import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Facet from "../components/Facet";
import ProductListing from "../components/ProductListing";
import { FilterProvider } from "../context/FilterContext";

const CategoryPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    const close = () => setShowFilter(false);
    window.addEventListener("close-filter-drawer", close);
    return () => window.removeEventListener("close-filter-drawer", close);
  }, []);
  return (
    <FilterProvider>
      <div className="md:hidden p-4">
        <button
          onClick={() => {
            setShowFilter(true);
            window.dispatchEvent(new Event("close-header-menu"));
          }}
          className="border rounded-md p-2 bg-white shadow"
        >
          <GiHamburgerMenu size={22} />
        </button>
      </div>

      <div className="flex">
        <div className="hidden md:block w-[250px]">
          <Facet />
        </div>

        <div className="flex-1 p-4">
          <ProductListing />
        </div>
      </div>

      {showFilter && (
        <>
          <div
            className="fixed inset-0 top-[72px] bg-black/40 z-40 md:hidden"
            onClick={() => setShowFilter(false)}
          />

          <div className="fixed top-[72px] left-0 h-[calc(100%-72px)] w-72 bg-white z-50 overflow-y-auto md:hidden">
            <div className="flex justify-end p-4 border-b">
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <Facet />
          </div>
        </>
      )}
    </FilterProvider>
  );
};

export default CategoryPage;