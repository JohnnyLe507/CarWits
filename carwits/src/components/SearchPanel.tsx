import { useState } from "react";

interface Filters {
  make: string;
  year: string;
  fuelType: string;
  transmission: string;
  style: string;
  category: string;
}

const SearchPanel: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    make: "",
    year: "",
    fuelType: "",
    transmission: "",
    style: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    console.log("🔍 Applied filters:", filters);
    // Later: Trigger backend query or lift state up to App
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-purple-600 to-pink-500 p-4 text-white rounded-2xl shadow-lg flex flex-col">
      <h2 className="text-xl font-bold mb-6">🔍 Filters</h2>

      <div className="flex flex-col gap-4 flex-grow">
        {/* Make */}
        <label className="text-sm">Make</label>
        <select
          name="make"
          value={filters.make}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Makes</option>
          <option value="BMW">BMW</option>
          <option value="Tesla">Tesla</option>
          <option value="Toyota">Toyota</option>
        </select>

        {/* Year */}
        <label className="text-sm">Year</label>
        <select
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Years</option>
          <option value="2020">2020</option>
          <option value="2015">2015</option>
          <option value="2010">2010</option>
        </select>

        {/* Fuel Type */}
        <label className="text-sm">Fuel Type</label>
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Fuel Types</option>
          <option value="gasoline">Gasoline</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Transmission */}
        <label className="text-sm">Transmission</label>
        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Transmissions</option>
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>

        {/* Vehicle Style */}
        <label className="text-sm">Vehicle Style</label>
        <select
          name="style"
          value={filters.style}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Styles</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Coupe">Coupe</option>
          <option value="Truck">Truck</option>
        </select>

        {/* Market Category */}
        <label className="text-sm">Market Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="">All Categories</option>
          <option value="Luxury">Luxury</option>
          <option value="High-Performance">High-Performance</option>
          <option value="Economy">Economy</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="mt-6 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default SearchPanel;
