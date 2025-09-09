import { describe, it, expect, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { useEffect } from "react";

let mockProductListProp;
let mockOrderProp;
let mockProductListPropSC;
let mockOrderPropSC;
let mockNavbarCartNumber;

const mockProductList = await fetch("https://fakestoreapi.com/products/")
  .then((response) => response.json())
  .then();
const mockOrder = ["pr1", "pr2"];

vi.mock(import("../components/pages/Homepage.jsx"), () => ({
  default: ({ productList, orderCallback, order }) => {
    useEffect(() => {
      mockProductListProp(productList);
    }, [productList]);

    useEffect(() => {
      mockOrderProp(order);
    }, [order]);

    if (JSON.stringify(order) !== JSON.stringify(mockOrder))
      orderCallback(mockOrder);
    return (
      <>
        <h1>Homepage</h1>
      </>
    );
  },
}));

vi.mock(import("../components/pages/ErrorPage.jsx"), () => ({
  default: () => {
    return (
      <>
        <div data-testid="error-page">Only supposed to load</div>
      </>
    );
  },
}));

vi.mock(import("../components/pages/ShoppingCart.jsx"), () => ({
  default: ({ productList, orderCallback, order }) => {
    useEffect(() => {
      mockProductListPropSC(productList);
    }, [productList]);

    useEffect(() => {
      mockOrderPropSC(order);
    }, [order]);

    if (JSON.stringify(order) !== JSON.stringify(mockOrder))
      orderCallback(mockOrder);
    return (
      <>
        <h1>Shopping Cart</h1>
      </>
    );
  },
}));

vi.mock(import("../components/pages/Checkout.jsx"), () => ({
  default: ({ error, orderCallback }) => {
    useEffect(() => {
      orderCallback([mockOrderProp()]);
      orderCallback([]);
    }, []);

    return (
      <>
        <div data-testid="checkout-page"></div>
        {error && <h3>{error}</h3>}
      </>
    );
  },
}));

vi.mock(import("../components/Navbar.jsx"), () => ({
  default: ({ itemsNum }) => {
    useEffect(() => {
      mockNavbarCartNumber(itemsNum);
    }, [itemsNum]);

    return <></>;
  },
}));

describe("App general", () => {
  mockNavbarCartNumber = () => null;
  it("Renders at homepage", () => {
    mockProductListProp = vi.fn();
    mockOrderProp = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", { name: "Homepage" }),
    ).not.toThrow();
  });
  it("Renders at shopping cart", () => {
    mockOrderPropSC = vi.fn();
    mockProductListPropSC = vi.fn();
    render(
      <MemoryRouter initialEntries={["/shopping-cart"]}>
        <App />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", { name: "Shopping Cart" }),
    ).not.toThrow();
  });
  it("Renders NavBar with number of ordered items", async () => {
    mockNavbarCartNumber = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(mockNavbarCartNumber).toHaveBeenCalled();

    await waitFor(() => expect(mockNavbarCartNumber).toHaveBeenCalledTimes(2));
    expect(mockNavbarCartNumber.mock.calls[1][0]).toBe(mockOrder.length);
  });
  it("Passes props into routes", async () => {
    mockProductListProp = vi.fn();
    mockOrderProp = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(mockProductListProp).toHaveBeenCalled();
    expect(mockProductListProp.mock.calls[0][0]).toStrictEqual([]);

    await waitFor(() => expect(mockProductListProp).toHaveBeenCalledTimes(2));
    expect(mockProductListProp.mock.calls[1][0]).toStrictEqual(mockProductList);
  });
  it("Navigates to error page on fetching error", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App productListUrl="invalidUrl" />
      </MemoryRouter>,
    );

    await screen.findByTestId("error-page");
  });
  it("Routes to checkout", async () => {
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByTestId("checkout-page");
  });
  it("Routes to error page on invalid url", () => {
    render(
      <MemoryRouter initialEntries={["/invalid"]}>
        <App />
      </MemoryRouter>,
    );

    expect(() => screen.getByTestId("error-page")).not.toThrow();
  });
});

describe("Order managing in within App", () => {
  it("setOrder changes order", async () => {
    mockOrderProp = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockOrderProp).toHaveBeenCalledTimes(2));
    expect(mockOrderProp.mock.calls[1][0]).toStrictEqual(mockOrder);
  });
  it("setOrder changes order(in shopping cart)", async () => {
    mockOrderPropSC = vi.fn();
    render(
      <MemoryRouter initialEntries={["/shopping-cart"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockOrderPropSC).toHaveBeenCalledTimes(2));
    expect(mockOrderPropSC.mock.calls[1][0]).toStrictEqual(mockOrder);
  });
  it("setOrder changes order(in checkout)", () => {
    mockOrderProp = vi.fn();
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <App />
      </MemoryRouter>,
    );

    expect(mockOrderProp).toHaveBeenCalled();
  });
  it("Loads checkout with error msg on empty order", () => {
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <App />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", {
        name: "Error: Can't checkout on empty order.",
      }),
    ).not.toThrow();
  });
});
