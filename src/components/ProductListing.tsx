import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";
import { Button ,ProductCard , Pagination } from "rentbook";
import ProductSort from "./ProductSort";

const ProductListing = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>("");

    const {
        data,
        isLoading,
        isError,
        error,
        } = useQuery({
        queryKey: ["products", currentPage , sortBy],
        queryFn: () => getProducts(currentPage , sortBy),
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
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
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
                <Button>Add to Cart</Button>
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