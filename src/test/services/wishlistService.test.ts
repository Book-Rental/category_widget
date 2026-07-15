import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getWishlistNames,
  addBookToWishlist,
  createWishlistGroup,
} from "../../services/wishlistService";

describe("wishlistService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getWishlistNames", () => {
    it("fetches wishlist names", async () => {
      const response = {
        data: [
          {
            _id: "1",
            name: "Favorites",
          },
        ],
      };

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => response,
      });

      const result = await getWishlistNames("user123");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/wishlist/wishlistName/user123")
      );

      expect(result).toEqual(response);
    });

    it("throws error when fetch fails", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
      });

      await expect(
        getWishlistNames("user123")
      ).rejects.toThrow("Failed to fetch wishlists.");
    });
  });

  describe("addBookToWishlist", () => {
    it("adds book successfully", async () => {
      const response = {
        success: true,
      };

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => response,
      });

      const result = await addBookToWishlist(
        "wishlist1",
        "book1"
      );

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/wishlist/add"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wishlistId: "wishlist1",
            bookId: "book1",
          }),
        }
      );

      expect(window.dispatchEvent).toHaveBeenCalled();

      expect(result).toEqual(response);
    });

    it("throws error if add book fails", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Book already exists",
        }),
      });

      await expect(
        addBookToWishlist("wishlist1", "book1")
      ).rejects.toThrow("Book already exists");
    });
  });

  describe("createWishlistGroup", () => {
    it("creates wishlist group", async () => {
      const response = {
        success: true,
      };

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => response,
      });

      const result = await createWishlistGroup(
        "user1",
        "My Wishlist"
      );

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/wishlist/group"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user1",
            name: "My Wishlist",
          }),
        }
      );

      expect(result).toEqual(response);
    });

    it("throws error when create wishlist fails", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Wishlist already exists",
        }),
      });

      await expect(
        createWishlistGroup("user1", "Favorites")
      ).rejects.toThrow("Wishlist already exists");
    });
  });
});