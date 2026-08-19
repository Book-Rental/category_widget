import { useQuery } from "@tanstack/react-query";
import { useFilter } from "../context/FilterContext";
import { useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { Rb_Text, Checkbox, Dropdown, Rb_Input, PriceRangeSlider } from "@rentbook/rentbook-ui-lib";

const languageOptions = [
  { label: "All  Languages", value: "All" },  
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
    nameOrAuthorSearch,
    setNameOrAuthorSearch
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
  
  const handleAuthorNameSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setNameOrAuthorSearch(value);

    const params = new URLSearchParams(window.location.search);

    if (value.trim()) {
      params.set("name", value.trim());
    } else {
      params.delete("name");
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };
  useEffect(() => {
    const event = new CustomEvent("widget-loading-status", {
      detail: isLoading
    });
    window.dispatchEvent(event);
  }, [isLoading]);

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");


  const hasInitialized = useRef(false);

useEffect(() => {
  if (!categories.length) return;
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("categories");

  if (categoryParam) {
    const categoryNames = categoryParam
      .split(",")
      .map(name => name.trim().toLowerCase());

    const selectedIds = categories
      .filter(category => categoryNames.includes(slugify(category.name)))
      .map(category => category._id);

    setSelectedCategories(selectedIds);
  }

  hasInitialized.current = true;
}, [categories, setSelectedCategories]);

useEffect(() => {
  if (!categories.length) return;
  if (!hasInitialized.current) return;   // <-- guard added

  const params = new URLSearchParams(window.location.search);

  if (selectedCategories.length > 0) {
    const slugs = categories
      .filter(c => selectedCategories.includes(c._id))
      .map(c => slugify(c.name));
    params.set("categories", slugs.join(","));
  } else {
    params.delete("categories");
  }

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState({}, "", newUrl);
}, [selectedCategories, categories]);

  
 if (isError) return <p>Failed to load categories.</p>;
  return (
    <div className="w-[250px] p-4 flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <Rb_Text variant="h3">Filters</Rb_Text>

        <Rb_Text
          variant="p"
          className="text-blue-600 cursor-pointer"
          onClick={() => {
            clearFilters();
            window.history.replaceState({}, "", window.location.pathname);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Clear all
        </Rb_Text>
      </div>

      <section className="flex flex-col gap-3">
        <Rb_Text variant="h4">Categories</Rb_Text>

        <ul className="max-h-48 overflow-y-auto space-y-2 pr-2">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex items-center gap-3"
            >
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
              <Rb_Text className="capitalize">{category.name}</Rb_Text>
            </li>
          ))}
        </ul>
      </section>

      {/* Language */}
      <section className="flex flex-col gap-3">
        <Rb_Text variant="h4">Language</Rb_Text>

        <Dropdown
          placeholder="Select Language"
          value={language}
          options={languageOptions}
          onChange={setLanguage}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Rb_Text variant="h4">Author / Book Name</Rb_Text>

        <div className="relative">
          <CiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />

          <Rb_Input
            className="w-full pl-10 rounded-lg"
            type="text"
            placeholder="Search for Author or Book Name"
            value={nameOrAuthorSearch}
            onChange={handleAuthorNameSearch}
            borderClass="border !border-[#d1d5db]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Rb_Text variant="h4">Price Range</Rb_Text>

        <PriceRangeSlider
          min={0}
          max={5000}
          step={100}
          currency="₹"
          value={priceRange}
          onChange={setPriceRange}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Rb_Text variant="h4">Availability</Rb_Text>

        {/* <label className="flex items-center gap-3">
      <Checkbox
        checked={availability.sale}
        onChange={(checked) =>
          setAvailability((prev) => ({ ...prev, sale: checked }))
        }
      />
      <Rb_Text>Available for Sale</Rb_Text>
    </label> */}

        <label className="flex items-center gap-3">
          <Checkbox
            checked={availability.rent}
            onChange={(checked) =>
              setAvailability((prev) => ({ ...prev, rent: checked }))
            }
          />
          <Rb_Text>Available for Rent</Rb_Text>
        </label>
      </section>

    </div>
  );
};

export default Facet;