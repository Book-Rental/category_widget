import { Dropdown } from "rentbook";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
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

function ProductSort({ value,onChange,}: ProductSortProps) {

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort By</span>
            <div className="w-36">
                <Dropdown
                options={sortOptions}
                value={value}
                onChange={onChange}
                />
            </div>
        </div>
    );

}

export default ProductSort;