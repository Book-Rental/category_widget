import { Product } from "../types/product";

const API_URL = "https://be-book-rental.onrender.com/api/book";

export const getProducts = async (
  page: number = 1
): Promise<Product[]> => {

  const response = await fetch(`${API_URL}?page=${page}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.data.products;
};