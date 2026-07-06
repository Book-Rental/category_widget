import { useQuery } from "@tanstack/react-query";
import { Checkbox, Dropdown, PriceRangeSlider, Rb_Input, Rb_Label, Rb_Text } from "rentbook";
import { useFilter } from "../context/FilterContext";

const languageOptions = [
  { label: "English", value: "English" },
  { label: "Telugu", value: "Telugu" },
  { label: "Hindi", value: "Hindi" },
];

interface Category {
  _id: string;
  name: string;
}

const Facet = () => {
  const {
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    language,
    setLanguage,
    availability,
    setAvailability,
    clearFilters,
  } = useFilter();

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Category`
      );

      if (!res.ok) throw new Error("Failed to fetch categories");

      const result = await res.json();
      return result.data ?? [];
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load categories.</p>;

  return (
    <div className="w-[250px] p-4">
      <div className="flex justify-between items-center">
        <Rb_Text variant="h3">Filters</Rb_Text>

        <Rb_Text
          variant="p"
          className="cursor-pointer !text-blue-600"
          onClick={clearFilters}
        >
          Clear all
        </Rb_Text>
      </div>

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Categories
      </Rb_Text>

      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {categories.map((category) => (
          <li key={category._id} className="flex items-center gap-2">
            <Checkbox
              checked={selectedCategories.includes(category._id)}
              onChange={(checked) =>
                setSelectedCategories((prev) =>
                  checked
                    ? [...prev, category._id]
                    : prev.filter((id) => id !== category._id)
                )
              }
            />
            <Rb_Text>{category.name}</Rb_Text>
          </li>
        ))}
      </ul>

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Language
      </Rb_Text>

      <Dropdown
        placeholder="Select Language"
        value={language}
        options={languageOptions}
        onChange={setLanguage}
      />

      <div>
        <Rb_Label>Author / Book Name</Rb_Label>
        <Rb_Input type="text" placeholder="Searh for Author or Book Name"></Rb_Input>
      </div>

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Price Range
      </Rb_Text>

      <PriceRangeSlider
        min={0}
        max={5000}
        step={100}
        currency="₹"
        value={priceRange}
        onChange={setPriceRange}
      />

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Availability
      </Rb_Text>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={availability.sale}
          onChange={(checked) =>
            setAvailability((prev) => ({
              ...prev,
              sale: checked,
            }))
          }
        />
        <Rb_Text>Available for Sale</Rb_Text>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={availability.rent}
          onChange={(checked) =>
            setAvailability((prev) => ({
              ...prev,
              rent: checked,
            }))
          }
        />
        <Rb_Text>Available for Rent</Rb_Text>
      </div>
    </div>
  );
};

export default Facet;