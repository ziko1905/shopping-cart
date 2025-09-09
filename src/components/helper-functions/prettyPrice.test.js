import { expect, it, describe } from "vitest";
import prettyPrice from "./prettyPrice";

describe("Returns strings with two decimal positions", () => {
  it("Returns prices with two decimal places correctly", () => {
    expect(prettyPrice(12.45)).toBe("12.45");
    expect(prettyPrice(1212.05)).toBe("1212.05");
    expect(prettyPrice(0.1)).toBe("0.10");
    expect(prettyPrice(1.99)).toBe("1.99");
  });
  it("Returns zero correctly", () => {
    expect(prettyPrice(0)).toBe("0.00");
  });
  it("Returns numbers with no decimal places correctly", () => {
    expect(prettyPrice(12)).toBe("12.00");
    expect(prettyPrice(1212)).toBe("1212.00");
    expect(prettyPrice(92)).toBe("92.00");
    expect(prettyPrice(1)).toBe("1.00");
  });
  it("Returns numbers with one decimal places correctly", () => {
    expect(prettyPrice(12.2)).toBe("12.20");
    expect(prettyPrice(1212.9)).toBe("1212.90");
    expect(prettyPrice(92.5)).toBe("92.50");
    expect(prettyPrice(1.3)).toBe("1.30");
  });
  it("Returns numbers with more than two decimal places correctly", () => {
    expect(prettyPrice(12.299)).toBe("12.30");
    expect(prettyPrice(1212.921)).toBe("1212.92");
    expect(prettyPrice(92.009)).toBe("92.01");
    expect(prettyPrice(1.325)).toBe("1.33");
  });
  it("Works with strings", () => {
    expect(prettyPrice("0")).toBe("0.00");
    expect(prettyPrice("1212.9")).toBe("1212.90");
    expect(prettyPrice("92.49")).toBe("92.49");
    expect(prettyPrice("1.325")).toBe("1.33");
  });
});

describe("Error handling", () => {
  it("Throws on negative values", () => {
    expect(() => prettyPrice(-12.29)).toThrow(
      "ValueError, prices can't be negative",
    );
    expect(() => prettyPrice("-12.29")).toThrow(
      "ValueError, prices can't be negative",
    );
  });
  it("Throws on non numbers", () => {
    expect(() => prettyPrice("-12.A29")).toThrow(
      "TypeError, a non number passed as price",
    );
  });
});
