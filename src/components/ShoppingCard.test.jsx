import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import ShoppingCard from "./ShoppingCard";

vi.mock(import("./Card.jsx"), () => ({
  default: ({ productObj, amountCallback, amount, addOnBtns = [{}] }) => {
    return (
      <>
        <div>{productObj.title}</div>
        <img src={productObj.image} />
        <button
          data-testid="decrement"
          onClick={() => amountCallback(amount - 1)}
        ></button>
        <button
          data-testid="increment"
          onClick={() => amountCallback(amount + 1)}
        ></button>
        <input
          data-testid="input"
          type="text"
          defaultValue={amount}
          onChange={(e) => amountCallback(e.target.value)}
        />
        <button data-testid="remove" {...{ ...addOnBtns[0], text: undefined }}>
          {addOnBtns[0].text}
        </button>
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

describe("ShoppingCard general", () => {
  // SC is alias for ShoppingCard
  it("Render SC", () => {
    render(<ShoppingCard productObj={testProduct} />);

    expect(() => screen.getByText(testProduct.title)).not.toThrow();
  });
  it("Renders SC img src", () => {
    render(<ShoppingCard productObj={testProduct} />);

    expect(screen.getByRole("img").src).toBe(testProduct.image);
  });
});

describe("Shopping cart managing", () => {
  it("Decrement original amount by one", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={5}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("decrement"));

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 4 },
    ]);
  });
  it("Increment original amount by one", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={5}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("increment"));

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 6 },
    ]);
  });
  it("Increment value using input", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard("5");

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 15 },
    ]);
  });
  it("Dot in input", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard(".");

    expect(screen.getByTestId("input").value).toBe("1.");
    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Decrement a minimum amount(1)", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("decrement"));

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Delete amount in input", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard("[Backspace]");

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Amount changes after deletion", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard("[Backspace]");
    await user.keyboard("10");

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 10 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Increment after deletion", async () => {
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    const orderUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard("[Backspace]");
    await user.click(screen.getByTestId("increment"));

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 2 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Non number typed", async () => {
    const user = userEvent.setup();
    const orderUpdate = vi.fn();
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("input"));
    await user.keyboard("z");

    expect(screen.getByTestId("input").value).toBe("1z");
    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
  it("Item removed with remove btn", async () => {
    const user = userEvent.setup();
    const orderUpdate = vi.fn();
    const order = [
      { productObj: testProduct, productId: testProduct.id, amount: 1 },
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ];
    render(
      <ShoppingCard
        order={order}
        amount={1}
        productObj={testProduct}
        orderCallback={orderUpdate}
      />,
    );

    await user.click(screen.getByTestId("remove"));

    expect(orderUpdate).toHaveBeenCalled();
    expect(orderUpdate.mock.calls[0][0]).toStrictEqual([
      { productObj: testProduct2, productId: testProduct2.id, amount: 5 },
    ]);
  });
});
