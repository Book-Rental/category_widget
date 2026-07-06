import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Facet from "../components/Facet";
import ProductListing from "../components/ProductListing";
import { FilterProvider } from "../context/FilterContext";


const CategoryPage = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <FilterProvider>
      <div className="md:hidden p-4">
        <button
          onClick={() => setShowFilter(true)}
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
            className="absolute inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowFilter(false)}
          />

          <div className="absolute top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto md:hidden">
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