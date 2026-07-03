import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Checkbox, PriceRangeSlider, Rb_Label, Rb_Text } from "rentbook";

const Facet = () => {
  //  const { data, isLoading, error } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: async () => {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Category`);
  //     console.log(res)
  //     return res.json();
  //   },
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error</p>;
  const data = [
    {
      "_id": "6a460cc379a41de27f37d8e9",
      "name": "fantasy",
      "description": "Stories set in magical worlds with mythical creatures, magic, and epic adventures.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8ed",
      "name": "historical fiction",
      "description": "Stories set in the past, blending fictional characters with historical events.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8eb",
      "name": "thriller",
      "description": "Fast-paced stories filled with suspense, danger, and unexpected twists.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8ea",
      "name": "mystery",
      "description": "Novels centered around solving crimes, puzzles, or unexplained events.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8ee",
      "name": "biography",
      "description": "Books that tell the life story of a real person.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f0",
      "name": "self-help",
      "description": "Books that provide guidance on personal development, productivity, and well-being.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8ef",
      "name": "autobiography",
      "description": "A person's account of their own life, written by themselves.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8ec",
      "name": "romance",
      "description": "Books that focus on love, relationships, and emotional connections between characters.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f4",
      "name": "cooking",
      "description": "Cookbooks featuring recipes, cooking techniques, and culinary inspiration.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f2",
      "name": "technology",
      "description": "Books about programming, software development, artificial intelligence, and emerging technologies.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f6",
      "name": "poetry",
      "description": "Collections of poems expressing emotions, ideas, and artistic creativity.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f8",
      "name": "education",
      "description": "Books designed for academic learning, skill development, and exam preparation.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f7",
      "name": "comics & graphic novels",
      "description": "Illustrated stories told through sequential art and dialogue.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f3",
      "name": "health & wellness",
      "description": "Books focusing on physical health, nutrition, fitness, and mental well-being.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f5",
      "name": "travel",
      "description": "Guides and stories about destinations, cultures, and travel experiences.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f1",
      "name": "business",
      "description": "Books covering entrepreneurship, management, finance, leadership, and marketing.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8fb",
      "name": "horror",
      "description": "Stories intended to frighten, unsettle, or create suspense through supernatural or psychological elements.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8fa",
      "name": "young adult",
      "description": "Books written for teenagers and young adults, covering a variety of genres and themes.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    },
    {
      "_id": "6a460cc379a41de27f37d8f9",
      "name": "religion & spirituality",
      "description": "Books exploring religious beliefs, philosophies, and spiritual practices.",
      "isActive": true,
      "createdAt": "2026-07-02T07:01:23.580Z",
      "updatedAt": "2026-07-02T07:01:23.580Z",
      "__v": 0
    }
  ]

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
// const visibleCategories = showAll ? data : data.slice(0, 5);
const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
const [availability, setAvailability] = useState({
  sale: false,
  rent: false,
  unavailable: false,
});
  return (
    <>
      <div className="w-[250px] border-0 p-4">
        <div className="flex justify-between items-center">
        <Rb_Text variant="h3">Filters</Rb_Text>
        <Rb_Text variant="p" className="!text-[#230bda]">Clear all</Rb_Text>
</div>
         <div>
        <Rb_Text variant="h4" className="mt-2 mb-2">Categories</Rb_Text>

        <ul style={{ listStyle: "none", padding: 0  }} className="overflow-y-scroll h-[160px]">
          {data.map((category) => (
            <li
              key={category._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
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

        {/* {data.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            style={{
              border: "none",
              background: "none",
              color: "#007bff",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showAll ? "View Less" : "View More"}
          </button>
        )} */}
      </div>

<div>
  <Rb_Text variant="h4" className="mt-2 mb-2">Price Range</Rb_Text>
     <PriceRangeSlider
      min={0}
      max={5000}
      value={priceRange}
      step={100}
      currency="₹"
      onChange={setPriceRange}
    />
</div>
    <div>
        <Rb_Text variant="h4" className="mt-2 mb-2">Availability</Rb_Text>
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

<div className="flex items-center gap-2">
  <Checkbox
    checked={availability.unavailable}
    onChange={(checked) =>
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
    </>
  )
}

export default Facet;