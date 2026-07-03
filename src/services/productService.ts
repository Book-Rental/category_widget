import { ProductResponse } from "../types/product";

const API_URL = "https://be-book-rental.onrender.com/api/book";

export const getProducts = async (
    page: number = 1,
    sortBy?: string
    ): Promise<ProductResponse> => {
    
    const params = new URLSearchParams({
        page: page.toString(),
    });
        
    if (sortBy) {
        params.append("sortBy", sortBy);
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