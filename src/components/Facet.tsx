import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Checkbox, PriceRangeSlider, Rb_Text } from "rentbook";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface FacetProps {
  priceRange: [number, number];
  setPriceRange: React.Dispatch<
    React.SetStateAction<[number, number]>
  >;
}

const Facet = ({priceRange,
  setPriceRange}: FacetProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [availability, setAvailability] = useState({
    sale: false,
    rent: false,
    unavailable: false,
  });

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Category`);
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const result = await res.json();
      return Array.isArray(result.data) ? result.data : [];
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load categories.</p>;
  }

  const handlePriceRange = (value: [number, number]) => {
  setPriceRange(value);
};

  return (
    <div className="w-[250px] p-4">
      <div className="flex justify-between items-center">
        <Rb_Text variant="h3">Filters</Rb_Text>
        <Rb_Text variant="p" className="!text-[#230bda] cursor-pointer">
          Clear all
        </Rb_Text>
      </div>

      <Rb_Text variant="h4" className="mt-2 mb-2">
        Categories
      </Rb_Text>

      <ul className="h-[160px] overflow-y-auto list-none p-0">
        {data.map((category) => (
          <li
            key={category._id}
            className="flex items-center gap-2 mb-2"
          >
            <Checkbox
              checked={selectedCategories.includes(category._id)}
              onChange={(checked: boolean) => {
                setSelectedCategories((prev) =>
                  checked
                    ? [...prev, category._id]
                    : prev.filter((id) => id !== category._id)
                );
              }}
            />

            <Rb_Text>{category.name}</Rb_Text>
          </li>
        ))}
      </ul>

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Price Range
      </Rb_Text>

      <PriceRangeSlider
        min={0}
        max={5000}
        value={priceRange}
        step={100}
        currency="₹"
        onChange={handlePriceRange}
      />

      <Rb_Text variant="h4" className="mt-4 mb-2">
        Availability
      </Rb_Text>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={availability.sale}
            onChange={(checked: boolean) =>
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
            onChange={(checked: boolean) =>
              setAvailability((prev) => ({
                ...prev,
                rent: checked,
              }))
            }
          />
          <Rb_Text>Available for Rent</Rb_Text>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={availability.unavailable}
            onChange={(checked: boolean) =>
              setAvailability((prev) => ({
                ...prev,
                unavailable: checked,
              }))
            }
          />
          <Rb_Text>Not Available</Rb_Text>
        </div>
      </div>
    </div>
  );
};

export default Facet;