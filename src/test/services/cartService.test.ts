import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addToCart } from "../../services/cartService";
import type { AddToCartPayload } from "../../types/cart";

describe("cartService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the add to cart API with correct request", async () => {
    const mockResponse = {
      success: true,
      message: "Book added successfully",
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const payload: AddToCartPayload = {
      bookId: "1",
      quantity: 1,
      pricingMode: "rent",
      rentalPeriod: "week",
    };

    const result = await addToCart(payload);

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/cart/items"),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("throws an error when API request fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Failed to add book",
      }),
    });

    const payload: AddToCartPayload = {
      bookId: "1",
      quantity: 1,
      pricingMode: "rent",
      rentalPeriod: "day",
    };

    await expect(addToCart(payload)).rejects.toThrow(
      "Failed to add book"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});