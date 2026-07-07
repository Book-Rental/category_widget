import { ProductResponse } from "../types/product";

export const getProducts = async (
  page: number,
  sortBy: string,
  priceRange: [number, number],
  selectedCategories: string[],
  language: string,
   availability: {
    rent: boolean;
    sale: boolean;
  },
  nameOrAuthorSearch: string
): Promise<ProductResponse> => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("sortBy", sortBy);
  params.append("minPrice", priceRange[0].toString());
  params.append("maxPrice", priceRange[1].toString());

  if (selectedCategories.length > 0) {
    params.append("categoryID", selectedCategories.join(","));
  }

  if (language) {
    params.append("language", language);
  }

  if (availability.rent) {
    params.append("availableForRent", "true");
  }

  if (availability.sale) {
    params.append("availableForSale", "true");
  }

  if(nameOrAuthorSearch) {
    params.append("name", nameOrAuthorSearch)
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/book?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();

  return result.data;
};