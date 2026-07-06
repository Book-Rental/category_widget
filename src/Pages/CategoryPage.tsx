import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Facet from "../components/Facet";
import ProductListing from "../components/ProductListing";

const CategoryPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState({
    rent: false,
    sale: false,
  });

  return (
    <>
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
          <Facet
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            language={language}
            setLanguage={setLanguage}
            availability={availability}
            setAvailability={setAvailability}
          />
        </div>

        <div className="flex-1 p-4">
          <ProductListing
            priceRange={priceRange}
            selectedCategories={selectedCategories}
            language={language}
            availability={availability}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <>
          <div
            className="fixed bg-black/40 z-40 md:hidden"
            onClick={() => setShowFilter(false)}
          />

          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto md:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <Facet
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              language={language}
              setLanguage={setLanguage}
              availability={availability}
              setAvailability={setAvailability}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CategoryPage;