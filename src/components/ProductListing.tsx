import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";
import { Rb_Button, ProductCard, Pagination } from "rentbook";
import ProductSort from "./ProductSort";
import useDebounce from "../hooks/useDebounce";

interface ProductListingProps {
    priceRange: [number, number];
}

const ProductListing = ({ priceRange }: ProductListingProps) => {
    console.log(priceRange);
    const debouncedPriceRange = useDebounce(priceRange, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>("nameAToZ");

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["products", currentPage, sortBy, debouncedPriceRange],
        queryFn: () => getProducts(currentPage, sortBy, debouncedPriceRange),
    });

    const products = data?.products ?? [];
    const totalPages = data?.totalPages ?? 1;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {(error as Error).message}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <ProductSort
                value={sortBy}
                onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                }}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
                {products.map((product) => (
                    <div key={product._id} className="flex justify-center">
                        <ProductCard
                            imageUrl={
                                product.coverImage || "https://picsum.photos/250/350"
                            }
                            title={product.name}
                            author={product.author}
                            priceText={`₹${product.rentalPricePerWeek} / Week`}
                            isAction
                        >
                            <Rb_Button>Add to Cart</Rb_Button>
                        </ProductCard>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ProductListing;