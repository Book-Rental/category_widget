import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProducts } from "../../services/productService";

describe("productService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls getProducts API with correct query parameters", async () => {
    const mockResponse = {
      data: {
        products: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
        pageSize: 0,
        hasMore: false,
      },
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getProducts(
      1,
      "popular",
      [100, 500],
      ["cat1", "cat2"],
      "English",
      {
        rent: true,
        sale: true,
      },
      "Harry Potter"
    );

    expect(fetch).toHaveBeenCalledTimes(1);

    const url = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;

    expect(url).toContain("page=1");
    expect(url).toContain("sortBy=popular");
    expect(url).toContain("minPrice=100");
    expect(url).toContain("maxPrice=500");
    expect(url).toContain("categoryID=cat1,cat2");
    expect(url).toContain("language=English");
    expect(url).toContain("availableForRent=true");
    expect(url).toContain("availableForSale=true");
    expect(url).toContain("name=Harry+Potter");

    expect(result).toEqual(mockResponse.data);
  });

  it("throws an error when API request fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(
      getProducts(
        1,
        "popular",
        [0, 500],
        [],
        "",
        {
          rent: false,
          sale: false,
        },
        ""
      )
    ).rejects.toThrow("Failed to fetch products");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("does not include optional query parameters when filters are empty", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          products: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          pageSize: 0,
          hasMore: false,
        },
      }),
    });

    await getProducts(
      1,
      "nameAToZ",
      [0, 500],
      [],
      "",
      {
        rent: false,
        sale: false,
      },
      ""
    );

    const url = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;

    expect(url).not.toContain("categoryID=");
    expect(url).not.toContain("language=");
    expect(url).not.toContain("availableForRent");
    expect(url).not.toContain("availableForSale");
    expect(url).not.toContain("name=");
  });
});