import { WishlistResponse } from "../types/wishlist";

const API_URL = import.meta.env.VITE_API_URL;

export const getWishlistNames = async (
  userId: string
): Promise<WishlistResponse> => {
  const response = await fetch(
    `${API_URL}/api/wishlist/wishlistName/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch wishlists.");
  }

  return response.json();
};

export const addBookToWishlist = async (
  wishlistId: string,
  bookId: string
) => {
  const response = await fetch(
    `${API_URL}/api/wishlist/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wishlistId,
        bookId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const createWishlistGroup = async (
  userId: string,
  name: string
) => {
  const response = await fetch(
    `${API_URL}/api/wishlist/group`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};