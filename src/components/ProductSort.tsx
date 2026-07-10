import { Dropdown } from "@rentbook/rentbook-ui-lib";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const sortOptions = [
  {
    label: "Popular",
    value: "popular",
  },
  {
    label: "Newest",
    value: "",
  },
  {
    label: "Name: A-Z",
    value: "nameAToZ",
  },
  {
    label: "Name: Z-A",
    value: "nameZToA",
  },
  {
    label: "Price: Low to High",
    value: "priceLowToHigh",
  },
  {
    label: "Price: High to Low",
    value: "priceHighToLow",
  },
];

function ProductSort({
  value,
  onChange,
  disabled = false,
}: ProductSortProps) {
  return (
    <div className="flex items-center justify-between sm:justify-end gap-2">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort By
      </span>

      <div className="w-full sm:min-w-[180px] sm:w-auto">
        <Dropdown
          options={sortOptions}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default ProductSort;
