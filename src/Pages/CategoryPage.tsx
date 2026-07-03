import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Facet from "../components/Facet";
import ProductListing from "../components/ProductListing";

const CategoryPage = () => {
  const [showFilter, setShowFilter] = useState(false);
 const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setShowFilter(true)}
          className="border rounded-md p-2 bg-white shadow"
        >
          <GiHamburgerMenu size={22} />
        </button>
      </div>

      <div className="flex">
        {/* Desktop Filter */}
        <div className="hidden md:block w-[250px] shrink-0">
           <Facet
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* Products */}
        <div className="flex-1 p-4">
            <ProductListing priceRange={priceRange} />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowFilter(false)}
          />

          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto md:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              {/* <h2 className="font-semibold">Filters</h2> */}

              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <Facet priceRange={priceRange}
            setPriceRange={setPriceRange}/>
          </div>
        </>
      )}
    </>
  );
};

export default CategoryPage;