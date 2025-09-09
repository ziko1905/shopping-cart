import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import Navbar from "./Navbar.jsx";
import { MemoryRouter } from "react-router-dom";

describe("Nav general", () => {
  it("renders navbar", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    screen.debug();
  });
  it("renders homepage link", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(() => screen.getByText("Homepage")).not.toThrow();
  });
  it("renders shopping cart icon", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(() =>
      screen.getByAltText("Shopping cart displaying amount of items in cart"),
    ).not.toThrow();
  });
});

describe("Shopping cart button", () => {
  it("not render number of products icon", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(() => screen.getByLabelText("Number of items in cart")).toThrow();
  });
  it("display update in number of products in cart", () => {
    render(
      <MemoryRouter>
        <Navbar itemsNum={2} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Number of items in cart").textContent).toBe(
      "2",
    );
  });
  it("display '9' if number of products is 9", () => {
    render(
      <MemoryRouter>
        <Navbar itemsNum={9} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Number of items in cart").textContent).toBe(
      "9",
    );
  });
  it("display '+9' if number of products > 9", () => {
    render(
      <MemoryRouter>
        <Navbar itemsNum={10} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Number of items in cart").textContent).toBe(
      "+9",
    );
  });
});
