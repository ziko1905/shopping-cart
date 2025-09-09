import { vi, describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import Homepage from "./Homepage.jsx";
import userEvent from "@testing-library/user-event";

vi.mock(import("../ShowcaseCard.jsx"), () => ({
  default: ({ productObj, orderCallback, order }) => {
    return (
      <div>
        {productObj && (
          <>
            <h3>{productObj.title}</h3>
            <h3>{productObj.image}</h3>
          </>
        )}
        <button
          data-testid="test-btn"
          onClick={() => orderCallback(order)}
        ></button>
      </div>
    );
  },
}));

const productList = await fetch("https://fakestoreapi.com/products/")
  .then((response) => response.json())
  .then();
const callback = () => {
  return null;
};
const order = [];

describe("Homepage general", () => {
  it("Render homepage", () => {
    render(<Homepage orderCallback={callback} order={order} />);

    expect(() =>
      screen.getByRole("heading", { name: "Homepage" }),
    ).not.toThrow();
  });
});

describe("Category render", () => {
  it("Renders categories", () => {
    render(
      <Homepage
        productList={productList}
        orderCallback={callback}
        order={order}
      />,
    );

    const headings = screen.getAllByTestId("category-heading");

    expect(headings[0].textContent).toBe("Men's Clothing");
    // API mistake I think (typo)
    expect(headings[1].textContent).toBe("Jewelery");
    expect(headings[2].textContent).toBe("Electronics");
  });
  it("Renders Showcase Cards correctly", () => {
    render(
      <Homepage
        productList={productList}
        orderCallback={callback}
        order={order}
      />,
    );

    expect(() =>
      screen.getByRole("heading", { name: productList[0].title }),
    ).not.toThrow();
    expect(() =>
      screen.getByRole("heading", { name: productList[0].image }),
    ).not.toThrow();
    expect(
      screen.getByRole("heading", { name: productList[0].title })
        .parentElement ===
        screen.getByRole("heading", { name: productList[0].image })
          .parentElement,
    ).toBeTruthy();
  });
  it("Renders Showcase Cards in proper div", () => {
    render(
      <Homepage
        productList={productList}
        orderCallback={callback}
        order={order}
      />,
    );

    const itemOne = screen.getByRole("heading", {
      name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    });
    const itemTwo = screen.getByRole("heading", {
      name: "Mens Casual Premium Slim Fit T-Shirts",
    });
    const itemThree = screen.getByRole("heading", {
      name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    });
    const itemFour = screen.getByRole("heading", {
      name: "DANVOUY Womens T Shirt Casual Cotton Short",
    });

    expect(
      itemOne.parentElement.parentElement.parentElement ===
        screen.getByRole("heading", { name: "Men's Clothing" }).parentElement,
    ).toBeTruthy();
    expect(
      itemOne.parentElement.parentElement.parentElement ===
        screen.getByRole("heading", { name: "Jewelery" }).parentElement,
    ).toBeFalsy();
    expect(
      itemTwo.parentElement.parentElement.parentElement ===
        screen.getByRole("heading", { name: "Men's Clothing" }).parentElement,
    ).toBeTruthy();
    expect(
      itemThree.parentElement.parentElement.parentElement ===
        screen.getByRole("heading", { name: "Jewelery" }).parentElement,
    ).toBeTruthy();
    expect(
      itemFour.parentElement.parentElement.parentElement ===
        screen.getByRole("heading", { name: "Women's Clothing" }).parentElement,
    ).toBeTruthy();
  });
});

describe("Order callback calling correctly", () => {
  it("Handler calling order callback", async () => {
    const ordCallback = vi.fn();
    const order = ["Test value"];
    const user = userEvent.setup();
    render(
      <Homepage
        order={order}
        orderCallback={ordCallback}
        productList={productList}
      />,
    );

    await user.click(screen.getAllByTestId("test-btn")[0]);

    expect(ordCallback).toHaveBeenCalled();
    expect(ordCallback.mock.calls[0][0]).toStrictEqual(["Test value"]);
  });
});
