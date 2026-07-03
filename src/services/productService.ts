import { ProductResponse } from "../types/product";

const API_URL = `${import.meta.env.VITE_API_URL}/api/book`;

export const getProducts = async (
    page: number = 1,
    sortBy?: string,
    priceRange?: [number, number]
): Promise<ProductResponse> => {

    const params = new URLSearchParams({
        page: page.toString(),
    });

    if (sortBy === "popular") {
        params.append("isPopular", "true");
    } else if (sortBy) {
        params.append("sortBy", sortBy);
    }

    if (priceRange) {
        params.append("minPrice", priceRange[0].toString());
        params.append("maxPrice", priceRange[1].toString());
    }

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return {
        products: data.data.products,
        totalCount: data.data.totalCount,
        currentPage: data.data.currentPage,
        totalPages: data.data.totalPages,
        hasMore: data.data.hasMore,
    };
};