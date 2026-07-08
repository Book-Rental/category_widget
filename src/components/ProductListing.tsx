import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination, ProductCard } from "rentbook";
import ProductSort from "./ProductSort";
import { getProducts } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import { useFilter } from "../context/FilterContext";
import ProductActions from "./ProductActions";

const ProductListing = () => {
  const { priceRange, selectedCategories, language, availability, nameOrAuthorSearch } = useFilter();
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
  const totalCount = data?.totalCount ?? 0;
  const pageSize = products.length;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalCount === 0 ? 0 : Math.min(startItem + products.length - 1, totalCount);
  
  if (isError) return <div>{(error as Error).message}</div>;

  const redirectToPdp = (id:string) => {
    window.history.pushState({}, '', `/books/${id}`)
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col ">

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {startItem} - {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {totalCount}
          </span>{" "}
          results
        </p>

        {/* <div className="w-40"></div>   */}
          <ProductSort
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            disabled={isLoading || isFetching || !products.length}
          />
              
      </div>

      <div className="flex-1 flex">
        {(isFetching || isLoading) ? (
          <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>            
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
            <p className="text-lg text-gray-500">
              No products found.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  imageUrl={product.coverImage || "https://picsum.photos/250/350"}
                  title={product.name}
                  author={product.author}
                  rating={4.5}
                  priceText={`₹${product.rentalPricePerWeek} / Week`}
                  onProductClick={() => redirectToPdp(product._id)}
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
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProductListing;