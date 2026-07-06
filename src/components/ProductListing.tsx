import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dropdown,
  Pagination,
  ProductCard,
  Rb_Button,
} from "rentbook";
import ProductSort from "./ProductSort";
import { getProducts } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import { useFilter } from "../context/FilterContext";

const durationOptions = [
  { label: "7 Day", value: "7" },
  { label: "15 Days", value: "15" },
  { label: "20 Days", value: "20" },
  { label: "30 Days", value: "30" },
];

const ProductListing = () => {
  const {
    priceRange,
    selectedCategories,
    language,
    availability,
  } = useFilter();

  const debouncedPriceRange = useDebounce(priceRange, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("nameAToZ");

  const [selectedDuration, setSelectedDuration] = useState<
    Record<string, string>
  >({});

  const [showDuration, setShowDuration] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "products",
      currentPage,
      sortBy,
      debouncedPriceRange,
      selectedCategories,
      language,
      availability,
    ],
    queryFn: () =>
      getProducts(
        currentPage,
        sortBy,
        debouncedPriceRange,
        selectedCategories,
        language,
        availability
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
      <ProductSort
        value={sortBy}
        onChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            imageUrl={
              product.coverImage || "https://picsum.photos/250/350"
            }
            title={product.name}
            author={product.author}
            priceText={`₹${product.rentalPricePerWeek} / Week`}
            isAction
          >
            {showDuration[product._id] ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Dropdown
                    placeholder="Select Days"
                    value={selectedDuration[product._id] || "7"}
                    options={durationOptions}
                    onChange={(value) =>
                      setSelectedDuration((prev) => ({
                        ...prev,
                        [product._id]: value,
                      }))
                    }
                  />
                </div>

                <button
                  className="text-red-500 font-bold"
                  onClick={() =>
                    setShowDuration((prev) => ({
                      ...prev,
                      [product._id]: false,
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            ) : (
              <Rb_Button
                onClick={() =>
                  setShowDuration((prev) => ({
                    ...prev,
                    [product._id]: true,
                  }))
                }
              >
                Add to Cart
              </Rb_Button>
            )}
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
  );
};

export default ProductListing;