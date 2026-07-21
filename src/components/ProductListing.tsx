import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductSort from "./ProductSort";
import { getProducts } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import { useFilter } from "../context/FilterContext";
import ProductActions from "./ProductActions";
import { ProductCard, Pagination, Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";
import { LibraryBig } from "lucide-react";


const ProductListing = () => {
  const { priceRange, selectedCategories, language, availability, nameOrAuthorSearch, search, setSearch } = useFilter();
  const debouncedPriceRange = useDebounce(priceRange, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("nameAToZ");
  const debouncedAuthorSearch = useDebounce(nameOrAuthorSearch, 500);

  useEffect(() => {
    const updateSearch = () => {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("search") || "";

      console.log("URL Search:", name);

      setSearch(name);
    };

    updateSearch();

    window.addEventListener("popstate", updateSearch);

    return () => {
      window.removeEventListener("popstate", updateSearch);
    };
  }, [setSearch]);

  useEffect(() => {
    console.log("Context Search:", search);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("isPopular") === "true") {
      setSortBy("popular");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedPriceRange,
    selectedCategories,
    language,
    availability,
    debouncedAuthorSearch,
    sortBy,
    search
  ]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      "products",
      currentPage,
      sortBy,
      debouncedPriceRange,
      selectedCategories,
      language,
      availability,
      debouncedAuthorSearch,
      search
    ],
    queryFn: () =>
      getProducts(
        currentPage,
        sortBy,
        debouncedPriceRange,
        selectedCategories,
        language,
        availability,
        debouncedAuthorSearch,
        search
      ),
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;
  const pageSize = products.length;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalCount === 0 ? 0 : Math.min(startItem + products.length - 1, totalCount);

  if (isError) return <div>{(error as Error).message}</div>;

  const redirectToPdp = (id: string) => {
    window.history.pushState({}, '',` /books-details?bookId=${id}`)
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
          // <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
          //   <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>            
          // </div>
          <div className="flex flex-1 w-full min-h-[60vh] items-center justify-center">
            <Rb_LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-6xl"><LibraryBig className="mx-auto h-16 w-16 text-gray-400" /></div>

              <h3 className="mt-4 text-xl font-semibold">
                No Books Found.
              </h3>
            </div>
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

            {totalPages > 1 && (<div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>)}

          </div>
        )}

      </div>
    </div>
  );
};

export default ProductListing;