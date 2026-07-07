import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  ProductCard,
} from "rentbook";
import ProductSort from "./ProductSort";
import { getProducts } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import { useFilter } from "../context/FilterContext";
import ProductActions from "./ProductActions";

const ProductListing = () => {
  const {
    priceRange,
    selectedCategories,
    language,
    availability,
    nameOrAuthorSearch
  } = useFilter();

  const debouncedPriceRange = useDebounce(priceRange, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("nameAToZ");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("isPopular") === "true") {
      setSortBy("popular");
    }
  }, []);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      "products",
      currentPage,
      sortBy,
      debouncedPriceRange,
      selectedCategories,
      language,
      availability,
      nameOrAuthorSearch
    ],
    queryFn: () =>
      getProducts(
        currentPage,
        sortBy,
        debouncedPriceRange,
        selectedCategories,
        language,
        availability,
        nameOrAuthorSearch
      ),
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{(error as Error).message}</div>;

  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-end mb-6 relative z-50">
        <div className="relative z-50 w-40">
          <ProductSort
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            disabled={isLoading || isFetching || !products.length}
          />
        </div>
      </div>

      {(isLoading || isFetching) ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">
            No products found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                imageUrl={
                  product.coverImage ||
                  "https://picsum.photos/250/350"
                }
                title={product.name}
                author={product.author}
                rating={4.5}
                priceText={`₹${product.rentalPricePerWeek} / Week`}
                isAction
              >
                <ProductActions product={product} />
              </ProductCard>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListing;