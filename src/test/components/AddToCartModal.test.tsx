import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddToCartModal from "../../components/AddToCartModal";
import { Product } from "../../types/product";

const product: Product = {
  _id: "1",
  name: "Atomic Habits",
  description: "A self improvement book",
  author: "James Clear",
  coverImage: "cover.jpg",
  images: [],
  purchasePrice: 500,
  rentalPricePerDay: 20,
  rentalPricePerWeek: 100,
  rentalPricePerMonth: 300,
  securityDeposit: 100,
};

describe("AddToCartModal", () => {
  it("renders modal when open", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={vi.fn()}
        product={product}
        onProceed={vi.fn()}
      />
    );

    expect(
      screen.getByText("Choose Purchase Option")
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <AddToCartModal
        isOpen={false}
        onClose={vi.fn()}
        product={product}
        onProceed={vi.fn()}
      />
    );

    expect(
      screen.queryByText("Choose Purchase Option")
    ).not.toBeInTheDocument();
  });

  it("Proceed button is disabled initially", () => {
    render(
      <AddToCartModal
        isOpen
        onClose={vi.fn()}
        product={product}
        onProceed={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /proceed/i })
    ).toBeDisabled();
  });

  it("shows rental duration dropdown after selecting Rent Now", async () => {
    const user = userEvent.setup();

    render(
      <AddToCartModal
        isOpen
        onClose={vi.fn()}
        product={product}
        onProceed={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: /rent now/i })
    );

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  it("enables Proceed after selecting rental duration", async () => {
    const user = userEvent.setup();

    render(
      <AddToCartModal
        isOpen
        onClose={vi.fn()}
        product={product}
        onProceed={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: /rent now/i })
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "week"
    );

    expect(
      screen.getByRole("button", { name: /proceed/i })
    ).toBeEnabled();
  });

  it("calls onProceed with correct payload", async () => {
    const user = userEvent.setup();

    const onProceed = vi.fn().mockResolvedValue(undefined);

    render(
      <AddToCartModal
        isOpen
        onClose={vi.fn()}
        product={product}
        onProceed={onProceed}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: /rent now/i })
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "month"
    );

    await user.click(
      screen.getByRole("button", { name: /proceed/i })
    );

    expect(onProceed).toHaveBeenCalledWith({
      bookId: "1",
      quantity: 1,
      pricingMode: "rent",
      rentalPeriod: "month",
    });
  });

  it("calls onClose after successful proceed", async () => {
    const user = userEvent.setup();

    const onClose = vi.fn();

    render(
      <AddToCartModal
        isOpen
        onClose={onClose}
        product={product}
        onProceed={vi.fn().mockResolvedValue(undefined)}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: /rent now/i })
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "day"
    );

    await user.click(
      screen.getByRole("button", { name: /proceed/i })
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("resets state when modal is closed", async () => {
    const user = userEvent.setup();

    const onClose = vi.fn();

    render(
      <AddToCartModal
        isOpen
        onClose={onClose}
        product={product}
        onProceed={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: /rent now/i })
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /close/i,
      })
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onProceed without selecting rental duration", async () => {
    const user = userEvent.setup();

    const onProceed = vi.fn();

    render(
      <AddToCartModal
        isOpen
        onClose={vi.fn()}
        product={product}
        onProceed={onProceed}
      />
    );

    await user.click(
      screen.getByRole("radio", {
        name: /rent now/i,
      })
    );

    expect(
      screen.getByRole("button", {
        name: /proceed/i,
      })
    ).toBeDisabled();

    expect(onProceed).not.toHaveBeenCalled();
  });
});