import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProductSort from "../../components/ProductSort";

describe("ProductSort", () => {
  it("renders Sort By label", () => {
    render(
      <ProductSort
        value="popular"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("renders dropdown", () => {
    render(
      <ProductSort
        value="popular"
        onChange={vi.fn()}
      />
    );

    const dropdown = screen.getByRole("combobox");

    expect(dropdown).toBeInTheDocument();
  });

  it("shows selected value", () => {
    render(
      <ProductSort
        value="popular"
        onChange={vi.fn()}
      />
    );

    const dropdown = screen.getByRole("combobox") as HTMLSelectElement;

    expect(dropdown.value).toBe("popular");
  });

  it("calls onChange when another option is selected", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(
      <ProductSort
        value="popular"
        onChange={onChange}
      />
    );

    const dropdown = screen.getByRole("combobox");

    await user.selectOptions(dropdown, "priceLowToHigh");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("priceLowToHigh");
  });

  it("disables dropdown when disabled prop is true", () => {
    render(
      <ProductSort
        value="popular"
        onChange={vi.fn()}
        disabled
      />
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});