import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import ShoppingCart from "./ShoppingCart";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock(import("../ShoppingCard.jsx"), () => ({
  default: ({ orderCallback, productObj, amount, order }) => {
    function removeSelf() {
      orderCallback(order.filter((ord) => ord.productId !== productObj.id));
    }

    return (
      <>
        <h3>{productObj.title}</h3>
        <div data-testid={"image"}>{productObj.image}</div>
        <div data-testid={"amount"}>{amount}</div>
        <button onClick={removeSelf} data-testid="remove"></button>
      </>
    );
  },
}));

vi.mock(import("../components/pages/Checkout.jsx"), () => ({
  default: ({ error }) => {
    return (
      <>
        <div data-testid="checkout-page"></div>
        {error && <h3>{error}</h3>}
      </>
    );
  },
}));

let mockNavigate;

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: () => {
      return (route, options) => {
        mockNavigate(route, options);
        if (options) options.state.orderCallback();
      };
    },
  };
});

const fakeFn = () => null;

const orderItemOne = await fetch("https://fakestoreapi.com/products/1")
  .then((response) => response.json())
  .then();
const orderItemTwo = await fetch("https://fakestoreapi.com/products/2")
  .then((response) => response.json())
  .then();
const orderItemThree = await fetch("https://fakestoreapi.com/products/3")
  .then((response) => response.json())
  .then();

const order = [
  { productId: 1, productObj: orderItemOne, amount: 1 },
  { productId: 2, productObj: orderItemTwo, amount: 2 },
  { productId: 3, productObj: orderItemThree, amount: 3 },
];

function calcPrice(order) {
  let price = 0;
  order.forEach((ord) => (price += ord.amount * ord.productObj.price));

  return price;
}

describe("ShoppingCart general", () => {
  it("Shopping cart renders", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", { name: "Shopping Cart" }),
    ).not.toThrow();
  });
  it("Shopping cart renders initial orders", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", { name: orderItemOne.title }),
    ).not.toThrow();
    // Trim needed bcs of typo in API, I think...
    expect(() =>
      screen.getByRole("heading", { name: orderItemTwo.title.trim() }),
    ).not.toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemThree.title }),
    ).not.toThrow();
  });
  it("Shopping Cards render with right amount", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    const amounts = screen.getAllByTestId("amount");

    expect(amounts[0].textContent).toBe("1");
    expect(amounts[1].textContent).toBe("2");
    expect(amounts[2].textContent).toBe("3");
  });
  it("Price p renders", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    expect(() => screen.getByLabelText("Order price")).not.toThrow();
  });
  it("Proceed to checkout button renders", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("button", { name: "Proceed To Checkout" }),
    ).not.toThrow();
  });
});

describe("Order management", () => {
  it("Empty shopping cart", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={[]} />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByRole("heading", { name: "Shopping cart is empty" }),
    ).not.toThrow();
  });
  it("Order updates after removal", async () => {
    const user = userEvent.setup();
    const ordCallback = vi.fn((newOrder) => {
      rerender(
        <MemoryRouter>
          <ShoppingCart orderCallback={ordCallback} order={newOrder} />
        </MemoryRouter>,
      );
    });
    const { rerender } = render(
      <MemoryRouter>
        <ShoppingCart orderCallback={ordCallback} order={order} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByTestId("remove");
    await user.click(buttons[0]);

    expect(ordCallback).toHaveBeenCalled();
    expect(ordCallback.mock.calls[0][0]).toStrictEqual([
      { productId: 2, productObj: orderItemTwo, amount: 2 },
      { productId: 3, productObj: orderItemThree, amount: 3 },
    ]);

    await user.click(buttons[1]);
    await user.click(buttons[2]);

    expect(ordCallback.mock.calls[2][0]).toStrictEqual([]);
  });
  it("Cards update after order update", async () => {
    const user = userEvent.setup();
    const ordCallback = vi.fn((newOrder) => {
      rerender(
        <MemoryRouter>
          <ShoppingCart orderCallback={ordCallback} order={newOrder} />
        </MemoryRouter>,
      );
    });
    const { rerender } = render(
      <MemoryRouter>
        <ShoppingCart orderCallback={ordCallback} order={order} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByTestId("remove");
    await user.click(buttons[0]);

    expect(() =>
      screen.getByRole("heading", { name: orderItemOne.title }),
    ).toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemTwo.title.trim() }),
    ).not.toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemThree.title }),
    ).not.toThrow();

    await user.click(buttons[1]);

    expect(() =>
      screen.getByRole("heading", { name: orderItemOne.title }),
    ).toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemTwo.title.trim() }),
    ).toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemThree.title }),
    ).not.toThrow();

    await user.click(buttons[2]);

    expect(() =>
      screen.getByRole("heading", { name: orderItemOne.title }),
    ).toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemTwo.title.trim() }),
    ).toThrow();
    expect(() =>
      screen.getByRole("heading", { name: orderItemThree.title }),
    ).toThrow();
  });
});

describe("Price managing", () => {
  it("Initial order price correct", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    const correctPrice = calcPrice(order);

    expect(screen.getByLabelText("Order price").textContent).toBe(
      `Order total: ${correctPrice}$`,
    );
  });
  it("Zero on empty order", () => {
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Order price").textContent).toBe(
      `Order total: 0.00$`,
    );
  });
  it("Checks double decimal format on items that does not have it", async () => {
    // Specific item with price property of strictly equal 114
    const item = await fetch("https://fakestoreapi.com/products/12")
      .then((response) => response.json())
      .then();
    render(
      <MemoryRouter>
        <ShoppingCart
          orderCallback={fakeFn}
          order={[{ productId: item.id, productObj: item, amount: 1 }]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Order price").textContent).toBe(
      `Order total: 114.00$`,
    );
  });
});

describe("Checkout button", () => {
  it("Goes to thank you page after checkout", async () => {
    const user = userEvent.setup();
    mockNavigate = vi.fn();
    render(
      <MemoryRouter>
        <ShoppingCart orderCallback={fakeFn} order={order} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Proceed To Checkout" }),
    );

    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate.mock.calls[0][0]).toBe("/checkout");
    expect(mockNavigate.mock.calls[0][1]).toBeUndefined();
  });
});
