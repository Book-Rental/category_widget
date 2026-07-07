import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Availability = {
  rent: boolean;
  sale: boolean;
};

type FilterContextType = {
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;

  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;

  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  availability: Availability;
  setAvailability: React.Dispatch<React.SetStateAction<Availability>>;
  
  clearFilters: () => void;

  nameOrAuthorSearch: string
  setNameOrAuthorSearch: React.Dispatch<React.SetStateAction<string>>;
};

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [language, setLanguage] = useState("");

  const [availability, setAvailability] = useState({
    rent: false,
    sale: false,
  });

  const [nameOrAuthorSearch, setNameOrAuthorSearch] = useState("");

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setLanguage("");
    setAvailability({
      rent: false,
      sale: false,
    });
    setNameOrAuthorSearch('')
  };

  return (
    <FilterContext.Provider
      value={{
        priceRange,
        setPriceRange,
        selectedCategories,
        setSelectedCategories,
        language,
        setLanguage,
        availability,
        setAvailability,
        clearFilters,
        nameOrAuthorSearch,
        setNameOrAuthorSearch
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used inside FilterProvider");
  }

  return context;
};