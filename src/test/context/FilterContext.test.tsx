import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import {
  FilterProvider,
  useFilter,
} from "../../context/FilterContext";

const TestComponent = () => {
  const {
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    language,
    setLanguage,
    availability,
    setAvailability,
    nameOrAuthorSearch,
    setNameOrAuthorSearch,
    clearFilters,
  } = useFilter();

  return (
    <>
      <p data-testid="price">
        {priceRange[0]}-{priceRange[1]}
      </p>

      <p data-testid="categories">
        {selectedCategories.join(",")}
      </p>

      <p data-testid="language">
        {language}
      </p>

      <p data-testid="availability">
        {availability.rent ? "rent" : ""}
        {availability.sale ? "sale" : ""}
      </p>

      <p data-testid="search">
        {nameOrAuthorSearch}
      </p>

      <button
        onClick={() => setPriceRange([100, 200])}
      >
        Price
      </button>

      <button
        onClick={() =>
          setSelectedCategories(["cat1"])
        }
      >
        Category
      </button>

      <button
        onClick={() =>
          setLanguage("English")
        }
      >
        Language
      </button>

      <button
        onClick={() =>
          setAvailability({
            rent: true,
            sale: true,
          })
        }
      >
        Availability
      </button>

      <button
        onClick={() =>
          setNameOrAuthorSearch("Atomic Habits")
        }
      >
        Search
      </button>

      <button
        onClick={clearFilters}
      >
        Clear
      </button>
    </>
  );
};

describe("FilterContext", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("provides default values", () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    expect(
      screen.getByTestId("price")
    ).toHaveTextContent("0-5000");

    expect(
      screen.getByTestId("categories")
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("language")
    ).toHaveTextContent("All");

    expect(
      screen.getByTestId("availability")
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("search")
    ).toHaveTextContent("");
  });

  it("updates all filters", async () => {
    const user = userEvent.setup();

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await user.click(screen.getByText("Price"));
    await user.click(screen.getByText("Category"));
    await user.click(screen.getByText("Language"));
    await user.click(screen.getByText("Availability"));
    await user.click(screen.getByText("Search"));

    expect(
      screen.getByTestId("price")
    ).toHaveTextContent("100-200");

    expect(
      screen.getByTestId("categories")
    ).toHaveTextContent("cat1");

    expect(
      screen.getByTestId("language")
    ).toHaveTextContent("English");

    expect(
      screen.getByTestId("availability")
    ).toHaveTextContent("rentsale");

    expect(
      screen.getByTestId("search")
    ).toHaveTextContent("Atomic Habits");
  });

  it("clears all filters", async () => {
    const user = userEvent.setup();

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await user.click(screen.getByText("Price"));
    await user.click(screen.getByText("Category"));
    await user.click(screen.getByText("Language"));
    await user.click(screen.getByText("Availability"));
    await user.click(screen.getByText("Search"));

    await user.click(screen.getByText("Clear"));

    expect(
      screen.getByTestId("price")
    ).toHaveTextContent("0-5000");

    expect(
      screen.getByTestId("categories")
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("language")
    ).toHaveTextContent("All");

    expect(
      screen.getByTestId("availability")
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("search")
    ).toHaveTextContent("");
  });

  it("throws when useFilter is used outside provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useFilter must be used inside FilterProvider"
    );
  });
});