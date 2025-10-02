import { PropertyCard } from "@/components/PropertyCard";

const properties = [
  {
    image: "/placeholder.png",
    price: "1,100,000",
    beds: 4,
    baths: 4,
    sqft: 5373,
    status: "Active",
    address: "18 Shelburne Drive, Oak Brook, IL 60523",
    mls: "12485641",
    isNew: false,
  },
  {
    image: "/placeholder.png",
    price: "1,425,000",
    beds: 4,
    baths: 3,
    sqft: 3000,
    status: "Active",
    address: "3112 Cara Lane, Oak Brook, IL 60523",
    mls: "12481698",
    isNew: true,
  },
    {
    image: "/placeholder.png",
    price: "1,100,000",
    beds: 4,
    baths: 4,
    sqft: 5373,
    status: "Active",
    address: "18 Shelburne Drive, Oak Brook, IL 60523",
    mls: "12485641",
    isNew: false,
  },
  {
    image: "/placeholder.png",
    price: "1,425,000",
    beds: 4,
    baths: 3,
    sqft: 3000,
    status: "Active",
    address: "3112 Cara Lane, Oak Brook, IL 60523",
    mls: "12481698",
    isNew: true,
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl text-black font-bold mb-4">
        Oak Brook, IL Residential Properties for Sale
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.map((item) => (
          <PropertyCard key={item.mls} {...item} />
        ))}
      </div>
    </div>
  );
}
