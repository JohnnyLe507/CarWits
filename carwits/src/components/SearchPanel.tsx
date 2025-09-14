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
          <option value="All">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Tesla">Tesla</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
        </select>

        {/* Year */}
        <label className="text-sm">Year</label>
        <select
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="All">All Years</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>

        {/* Fuel Type */}
        <label className="text-sm">Fuel Type</label>
        <select
          name="fuel"
          value={filters.fuelType}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="All">All Fuel Types</option>
          <option value="Gas">Gasoline</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Transmission */}
        <label className="text-sm">Transmission</label>
        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="All">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        {/* Vehicle Style */}
        <label className="text-sm">Vehicle Style</label>
        <select
          name="style"
          value={filters.style}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="All">All Styles</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Truck">Truck</option>
          <option value="Coupe">Coupe</option>
        </select>

        {/* Market Category */}
        <label className="text-sm">Market Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 rounded-lg text-black"
        >
          <option value="All">All Categories</option>
          <option value="Luxury">Luxury</option>
          <option value="Compact">Compact</option>
          <option value="Midsize">Midsize</option>
          <option value="Pickup">Pickup</option>
        </select>
      </div>
    </div>
  );
};

export default SearchPanel;
