import { render, screen } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import Checkout from "./Checkout.jsx";
import checkoutStyles from "../../styles/Checkout.module.css";

const fakeFn = () => null;

describe("Checkout general", () => {
  it("Renders checkout message", () => {
    render(<Checkout orderCallback={fakeFn} />);

    expect(
      screen.getByRole("heading", { name: "Thank you for your purchase!" }),
    );
  });
  it("Renders error message", () => {
    render(
      <Checkout orderCallback={fakeFn} error={"Error: This is test error"} />,
    );

    expect(screen.getByRole("heading", { name: "Error: This is test error" }));
  });
});

describe("Checkout styling", () => {
  it("Correct class for successful checkout", () => {
    render(<Checkout orderCallback={fakeFn} />);

    expect(
      screen.getByRole("heading", { name: "Thank you for your purchase!" })
        .parentElement.className,
    ).toBe(checkoutStyles.successDiv);
  });
  it("Correct class for failed checkout", () => {
    render(
      <Checkout orderCallback={fakeFn} error={"Error: This is test error"} />,
    );

    expect(
      screen.getByRole("heading", { name: "Error: This is test error" })
        .parentElement.className,
    ).toBe(checkoutStyles.failDiv);
  });
});

describe("Order managing after checkout", () => {
  it("Calls 'orderCallback' with empty order", () => {
    const ordCallback = vi.fn();
    render(<Checkout orderCallback={ordCallback} />);

    expect(ordCallback).toHaveBeenCalled();
    expect(ordCallback.mock.calls[0][0]).toStrictEqual([]);
  });
  it("Doesn't call 'orderCallback' on failed checkout", () => {
    const ordCallback = vi.fn();
    render(
      <Checkout
        orderCallback={ordCallback}
        error={"Error: This is test error"}
      />,
    );

    expect(ordCallback).not.toHaveBeenCalled();
  });
});
