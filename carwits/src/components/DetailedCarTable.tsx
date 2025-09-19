import { useState, useMemo, useEffect } from "react";

interface Car {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  horsepower: number;
  cylinders: number;
  transmission: string;
  drive: string;
  doors: number;
  category: string;
  size: string;
  style: string;
  highwayMPG: number;
  cityMPG: number;
  popularity: number;
  msrp: number;
}

interface DetailedCarTableProps {
  cars: Car[];
}

type SortKey =
  | "name"
  | "make"
  | "year"
  | "msrp"
  | "mpg"
  | "horsepower"
  | "cylinders";

const BATCH_SIZE = 50; // number of rows added per batch
const BATCH_DELAY = 50; // ms delay between batches

const DetailedCarTable: React.FC<DetailedCarTableProps> = ({ cars }) => {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Precompute table data
  const tableData = useMemo(() => {
    return cars.map((c, index) => ({
      id: `${c.make}-${c.model}-${c.year}-${index}`,
      name: `${c.make} ${c.model}`,
      make: c.make,
      year: c.year,
      msrp: c.msrp,
      mpg: c.highwayMPG && c.cityMPG ? (c.highwayMPG + c.cityMPG) / 2 : null,
      horsepower: c.horsepower,
      cylinders: c.cylinders,
      style: c.style || "—",
      transmission: c.transmission || "—",
      fuelType: c.fuelType,
    }));
  }, [cars]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...tableData].sort((a, b) => {
      let aVal: string | number | null = a[sortKey];
      let bVal: string | number | null = b[sortKey];

      if (aVal === null) aVal = 0;
      if (bVal === null) bVal = 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [tableData, sortKey, sortOrder]);

  const [visibleRows, setVisibleRows] = useState<typeof sortedData>([]);

  // Incrementally add rows in batches
  useEffect(() => {
    setVisibleRows([]); // reset when sortedData changes
    let index = 0;
    const addBatch = () => {
      const nextIndex = Math.min(index + BATCH_SIZE, sortedData.length);
      setVisibleRows(sortedData.slice(0, nextIndex));
      index = nextIndex;
      if (index < sortedData.length) {
        setTimeout(addBatch, BATCH_DELAY);
      }
    };
    addBatch();
  }, [sortedData]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-6 border border-white/20">
      <h2 className="text-xl font-bold mb-4 text-white drop-shadow-sm">
        📋 Detailed Car Data
      </h2>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left text-gray-200">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-gradient shadow-md shadow-pink-500/20">
            <tr>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("name")}
              >
                Car Name {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("make")}
              >
                Make {sortKey === "make" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("year")}
              >
                Year {sortKey === "year" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-3 px-4 font-semibold">Fuel</th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("msrp")}
              >
                MSRP {sortKey === "msrp" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("mpg")}
              >
                MPG {sortKey === "mpg" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("horsepower")}
              >
                HP {sortKey === "horsepower" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer font-semibold hover:text-purple-300 transition-colors"
                onClick={() => handleSort("cylinders")}
              >
                Cylinders {sortKey === "cylinders" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-3 px-4 font-semibold">Style</th>
              <th className="py-3 px-4 font-semibold">Transmission</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {visibleRows.map((car, idx) => (
              <tr
                key={car.id}
                className={`transition-colors ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"
                  } hover:bg-purple-600/30`}
              >
                <td className="py-3 px-4">{car.name}</td>
                <td className="py-3 px-4">{car.make}</td>
                <td className="py-3 px-4">{car.year}</td>
                <td className="py-3 px-4">{car.fuelType}</td>
                <td className="py-3 px-4">
                  {car.msrp ? `$${car.msrp.toLocaleString()}` : "—"}
                </td>
                <td className="py-3 px-4">{car.mpg !== null ? car.mpg.toFixed(1) : "—"}</td>
                <td className="py-3 px-4">{car.horsepower || "—"}</td>
                <td className="py-3 px-4">{car.cylinders || "—"}</td>
                <td className="py-3 px-4">{car.style}</td>
                <td className="py-3 px-4">{car.transmission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedCarTable;
