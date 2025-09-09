import { describe, it, expect, vi, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import ShowcaseCard from "./ShowcaseCard.jsx";

vi.mock(import("./Card.jsx"), () => ({
  default: ({ productObj, amount = 1, amountCallback, addOnBtns }) => {
    return (
      <>
        {productObj && (
          <>
            <div>{productObj.title}</div>
            <div>{productObj.src}</div>
          </>
        )}
        <div data-testid="amount">{amount}</div>
        <button
          data-testid="increment"
          onClick={() => amountCallback(amount + 1)}
        ></button>
        <button
          data-testid="decrement"
          onClick={() => amountCallback(amount - 1)}
        ></button>
        <button data-testid="addon" onClick={addOnBtns[0].onClick}>
          {addOnBtns[0].text}
        </button>
        <input
          type="text"
          data-testid="input"
          value={amount}
          onChange={(e) => amountCallback(e.target.value)}
        />
      </>
    );
  },
}));

const testProduct = await fetch("https://fakestoreapi.com/products/1")
  .then((response) => response.json())
  .then();
const testProduct2 = await fetch("https://fakestoreapi.com/products/2")
  .then((response) => response.json())
  .then();

describe("Showcase card general", () => {
  it("SC card renders", () => {
    render(<ShowcaseCard productObj={testProduct} />);

    expect(() => screen.getByText(testProduct.title)).not.toThrow();
  });
  it("SC renders default 'Add to cart' button", () => {
    render(
      <ShowcaseCard title="Test title" src="../assets/cart-outline.svg" />,
    );

    expect(() => screen.getByText("Add To Cart")).not.toThrow();
  });
});

describe("Amount logic", () => {
  it("Remove negative values for amount", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ShowcaseCard />);

    await user.click(screen.getByTestId("increment"));
    rerender(<ShowcaseCard />);
    expect(screen.getByTestId("amount").textContent).toBe("2");
  });
  it("Remove floats for amount", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ShowcaseCard />);

    await user.click(screen.getByTestId("input"));
    await user.keyboard("5");
    rerender(<ShowcaseCard />);
    await user.keyboard(".");
    rerender(<ShowcaseCard />);
    expect(screen.getByTestId("input").value).toBe("15");
  });
  it("Non numbers don't load", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ShowcaseCard />);

    await user.click(screen.getByTestId("input"));

    expect(screen.getByTestId("input").value).toBe("1");

    await user.keyboard("N");
    rerender(<ShowcaseCard />);

    expect(screen.getByTestId("input").value).toBe("1");

    await user.keyboard("5");
    rerender(<ShowcaseCard />);

    expect(screen.getByTestId("input").value).toBe("15");

    await user.keyboard("a");

    rerender(<ShowcaseCard />);
    expect(screen.getByTestId("input").value).toBe("15");
  });
});

describe("Adding to order", () => {
  it("Add first item", async () => {
    const user = userEvent.setup();
    const orderFn = vi.fn();
    const order = [];
    render(
      <ShowcaseCard
        productObj={testProduct}
        order={order}
        orderCallback={orderFn}
      />,
    );

    await user.click(screen.getByText("Add To Cart"));

    expect(orderFn).toHaveBeenCalled();
    expect(orderFn.mock.calls[0][0]).toStrictEqual([
      { productId: 1, amount: 1, productObj: testProduct },
    ]);
  });
  it("Add new item to old list", async () => {
    const user = userEvent.setup();
    const orderFn = vi.fn();
    const order = [{ productId: 2, amount: 2, productObj: testProduct2 }];
    render(
      <ShowcaseCard
        productObj={testProduct}
        order={order}
        orderCallback={orderFn}
      />,
    );

    await user.click(screen.getByText("Add To Cart"));

    expect(orderFn).toHaveBeenCalled();
    expect(orderFn.mock.calls[0][0]).toStrictEqual([
      { productId: 2, amount: 2, productObj: testProduct2 },
      { productId: 1, amount: 1, productObj: testProduct },
    ]);
  });
  it("Adding item that is already in order", async () => {
    const user = userEvent.setup();
    const orderFn = vi.fn();
    const order = [
      { productId: 2, amount: 2, productObj: testProduct2 },
      { productId: 1, amount: 2, productObj: testProduct },
    ];
    render(
      <ShowcaseCard
        productObj={testProduct2}
        order={order}
        orderCallback={orderFn}
      />,
    );

    await user.click(screen.getByText("Add To Cart"));

    expect(orderFn).toHaveBeenCalled();
    expect(orderFn.mock.calls[0][0]).toStrictEqual([
      { productId: 2, amount: 3, productObj: testProduct2 },
      { productId: 1, amount: 2, productObj: testProduct },
    ]);
  });
});
