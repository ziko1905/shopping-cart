import { describe, expect, it } from "vitest";
import categoryFilter from "./categoryFilter";

describe("Category function", () => {
  it("Arranges each of one category in its pair", () => {
    const arrToFilter = [
      { category: "primary", id: 0 },
      { category: "secondary", id: 1 },
    ];

    expect(categoryFilter(arrToFilter)).toStrictEqual({
      primary: [0],
      secondary: [1],
    });
  });
  it("Arrange each of one category in its pair(different values)", () => {
    const arrToFilter = [
      { category: "tertiary", id: 2 },
      { category: "quaternary", id: 3 },
    ];

    expect(categoryFilter(arrToFilter)).toStrictEqual({
      tertiary: [2],
      quaternary: [3],
    });
  });
  it("Arranges objects with two objects in same category", () => {
    const arrToFilter = [
      { category: "primary", id: 0 },
      { category: "secondary", id: 1 },
      { category: "primary", id: 2 },
    ];

    expect(categoryFilter(arrToFilter)).toStrictEqual({
      primary: [0, 2],
      secondary: [1],
    });
  });
  it("Order of categories is same on iteration", () => {
    const arrToFilter = [
      { category: "primary", id: 0 },
      { category: "secondary", id: 1 },
      { category: "tertiary", id: 2 },
      { category: "quaternary", id: 3 },
      { category: "something", id: 4 },
      { category: "very", id: 5 },
      { category: "random", id: 6 },
      { category: "more", id: 7 },
      { category: "random", id: 8 },
      { category: "items", id: 9 },
      { category: "here", id: 10 },
    ];

    const arrangement = Object.keys(categoryFilter(arrToFilter));

    expect(arrangement).toStrictEqual([
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "something",
      "very",
      "random",
      "more",
      "items",
      "here",
    ]);
  });
});
