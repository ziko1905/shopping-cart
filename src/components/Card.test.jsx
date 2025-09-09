import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, render } from "@testing-library/react";
import Card from "./Card.jsx";
import prettyPrice from "./helper-functions/prettyPrice.js";

const testProduct = await fetch("https://fakestoreapi.com/products/1")
  .then((response) => response.json())
  .then();

describe("Card general", () => {
  it("card renders", () => {
    render(<Card productObj={testProduct} />);

    expect(() =>
      screen.getByRole("heading", { name: testProduct.title }),
    ).not.toThrow();
  });
  it("card renders title from products API", () => {
    render(<Card productObj={testProduct} />);

    expect(() => screen.getByText(testProduct.title)).not.toThrow();
  });
  it("card renders image", () => {
    render(<Card productObj={testProduct} />);

    expect(() => screen.getByAltText("Image of the item")).not.toThrow();
    expect(() => screen.getByRole("img")).not.toThrow();
    expect(screen.getByAltText("Image of the item").src).toBe(
      testProduct.image,
    );
  });
  it("card renders buttons", () => {
    render(<Card productObj={testProduct} />);

    expect(() => screen.getByText("+")).not.toThrow();
    expect(() => screen.getByText("-")).not.toThrow();
  });
  it("card render buttons aria-labels", () => {
    render(<Card productObj={testProduct} />);

    expect(() =>
      screen.getByLabelText("Increment amount by one"),
    ).not.toThrow();
    expect(() =>
      screen.getByLabelText("Decrement amount by one"),
    ).not.toThrow();
  });
  it("card renders input", () => {
    render(<Card productObj={testProduct} />);

    expect(() =>
      screen.getByLabelText("Input for changing amount with current amount"),
    ).not.toThrow();
  });
  it("card renders price correctly", () => {
    render(<Card productObj={testProduct} />);

    expect(screen.getByLabelText("Item price").textContent).toBe(
      `Price: ${prettyPrice(testProduct.price)}$`,
    );
  });
  it("card renders additional buttons", () => {
    render(
      <Card
        productObj={testProduct}
        addOnBtns={[{ text: "Additional button" }]}
      />,
    );

    expect(() => screen.getByText("Additional button")).not.toThrow();
    screen.debug();
  });
});

describe("Buttons logic", () => {
  it("Increment btn increases amount", async () => {
    const user = userEvent.setup();
    const incCallback = vi.fn();
    render(<Card productObj={testProduct} amountCallback={incCallback} />);

    await user.click(screen.getByText("+"));

    expect(incCallback.mock.calls[0][0]).toBe(1);
  });
  it("Increment btn increases amount(custom amount)", async () => {
    const user = userEvent.setup();
    const incCallback = vi.fn();
    render(
      <Card
        productObj={testProduct}
        amount={10}
        amountCallback={incCallback}
      />,
    );

    await user.click(screen.getByText("+"));

    expect(incCallback.mock.calls[0][0]).toBe(11);
  });
  it("Decrement btn decreases amount", async () => {
    const user = userEvent.setup();
    const incCallback = vi.fn();
    render(<Card productObj={testProduct} amountCallback={incCallback} />);

    await user.click(screen.getByText("-"));

    expect(incCallback.mock.calls[0][0]).toBe(-1);
  });
  it("Decrement btn decreases amount(custom amount)", async () => {
    const user = userEvent.setup();
    const decCallback = vi.fn();
    render(
      <Card
        productObj={testProduct}
        amount={10}
        amountCallback={decCallback}
      />,
    );

    await user.click(screen.getByText("-"));

    expect(decCallback.mock.calls[0][0]).toBe(9);
  });
});

describe("Input logic", () => {
  it("Input having default value of 0", () => {
    render(<Card productObj={testProduct} />);

    expect(
      screen.getByLabelText("Input for changing amount with current amount")
        .value,
    ).toBe("0");
  });
  it("Input having value of amount prop", () => {
    render(<Card productObj={testProduct} amount={10} />);

    expect(
      screen.getByLabelText("Input for changing amount with current amount")
        .value,
    ).toBe("10");
  });
  it("Input calling amountCallback with right value", async () => {
    let amount = 0;
    const user = userEvent.setup();
    const inpCallback = vi.fn((newA) => (amount = newA));
    const { rerender } = render(
      <Card productObj={testProduct} amountCallback={inpCallback} />,
    );

    await user.click(
      screen.getByLabelText("Input for changing amount with current amount"),
    );
    await user.keyboard("5");

    expect(inpCallback.mock.calls[0][0]).toBe("05");
    expect(
      screen.getByLabelText("Input for changing amount with current amount"),
    ).toHaveFocus();
    rerender(
      <Card
        productObj={testProduct}
        amount={amount}
        amountCallback={inpCallback}
      />,
    );
    await user.keyboard("5");
    expect(inpCallback.mock.calls[1][0]).toBe("055");

    await user.keyboard(".");
    rerender(
      <Card
        productObj={testProduct}
        amount={amount}
        amountCallback={inpCallback}
      />,
    );
    await user.keyboard("5");
    expect(inpCallback.mock.calls[3][0]).toBe("05.5");
  });
});

describe("Additional buttons props", () => {
  it("Class prop passed", () => {
    render(
      <Card
        productObj={testProduct}
        addOnBtns={[
          { text: "Add btn 1", className: "add-btn-1" },
          { text: "Add btn 2", className: "add-btn-2" },
        ]}
      />,
    );

    expect(screen.getByText("Add btn 1").className).toBe("add-btn-1");
    expect(screen.getByText("Add btn 2").className).toBe("add-btn-2");
  });
  it("Multiple props passed", () => {
    render(
      <Card
        productObj={testProduct}
        addOnBtns={[
          { text: "Add btn 1", className: "add-btn-1", id: "add-1" },
          { text: "Add btn 2", className: "add-btn-2", id: "add-2" },
        ]}
      />,
    );

    expect(screen.getByText("Add btn 1").className).toBe("add-btn-1");
    expect(screen.getByText("Add btn 1").id).toBe("add-1");
    expect(screen.getByText("Add btn 2").className).toBe("add-btn-2");
    expect(screen.getByText("Add btn 2").id).toBe("add-2");
  });
});
