import { useEffect, useState } from "react";
import { Product } from "../types/product";
import { getProducts } from "../services/productService";
import { Button ,ProductCard } from "rentbook";

const ProductListing = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts(currentPage);
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [currentPage]);

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen text-lg">
            Loading...
        </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-6
            "
            >
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

            <div className="flex justify-center gap-4 mt-8">
            <Button onClick={() => setCurrentPage(1)}>
                Page 1
            </Button>

            <Button onClick={() => setCurrentPage(2)}>
                Page 2
            </Button>
            </div>
        </div>
    );
};

export default ProductListing;