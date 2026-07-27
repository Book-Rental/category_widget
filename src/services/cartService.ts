import { AddToCartPayload } from "../types/cart";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Retrieves or generates a persistent anonymous ID for guest users.
 * The ID is stored in localStorage and survives page refreshes.
 */
const getAnonymousId = (): string => {
    const STORAGE_KEY = "book_rental_anonymous_id";
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
};

export const addToCart = async (
  payload: AddToCartPayload
) => {
  const response = await fetch(
    `${API_URL}/api/cart/items`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Id": getAnonymousId(),
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
