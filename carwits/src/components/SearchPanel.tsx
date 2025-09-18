import React from "react";
import { SlidersHorizontal, Car, Calendar, Fuel, Settings2, CarFront, LayoutGrid } from "lucide-react";

interface Filters {
  make: string;
  year: string;
  fuelType: string;
  transmission: string;
  style: string;
  category: string;
}

interface SearchPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      make: "All",
      year: "All",
      fuelType: "All",
      transmission: "All",
      style: "All",
      category: "All",
    });
  };

  return (
    <div className="w-64 min-h-screen bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-white rounded-2xl shadow-xl flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-purple-400" />
        Filters
      </h2>

      <div className="flex flex-col gap-5 flex-grow">
        {/* Make */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <Car className="w-4 h-4 text-purple-400" /> Make
          </label>
          <select
            name="make"
            value={filters.make}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Tesla">Tesla</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <Calendar className="w-4 h-4 text-purple-400" /> Year
          </label>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <Fuel className="w-4 h-4 text-purple-400" /> Fuel Type
          </label>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Fuel Types</option>
            <option value="Gas">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <Settings2 className="w-4 h-4 text-purple-400" /> Transmission
          </label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Vehicle Style */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <CarFront className="w-4 h-4 text-purple-400" /> Vehicle Style
          </label>
          <select
            name="style"
            value={filters.style}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Styles</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
          </select>
        </div>

        {/* Market Category */}
        <div>
          <label className="text-sm flex items-center gap-2 mb-1 text-gray-200">
            <LayoutGrid className="w-4 h-4 text-purple-400" /> Market Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="All">All Categories</option>
            <option value="Luxury">Luxury</option>
            <option value="Compact">Compact</option>
            <option value="Midsize">Midsize</option>
            <option value="Pickup">Pickup</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="mt-6 py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition shadow-lg"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SearchPanel;
