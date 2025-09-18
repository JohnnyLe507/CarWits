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
    <div className="bg-white/70 rounded-xl shadow-lg p-4 max-h-[500px] overflow-y-auto mt-6">
      <h2 className="text-lg font-bold mb-4">📋 Detailed Car Data</h2>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200 sticky top-0 z-10 text-blue-600">
          <tr className="text-left border-b border-gray-300">
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("name")}
            >
              Car Name {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("make")}
            >
              Make {sortKey === "make" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("year")}
            >
              Year {sortKey === "year" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-3">Fuel</th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("msrp")}
            >
              MSRP {sortKey === "msrp" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("mpg")}
            >
              MPG {sortKey === "mpg" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("horsepower")}
            >
              HP {sortKey === "horsepower" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("cylinders")}
            >
              Cylinders {sortKey === "cylinders" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-3">Style</th>
            <th className="py-2 px-3">Transmission</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((car) => (
            <tr key={car.id} className="border-b border-gray-200">
              <td className="py-2 px-3">{car.name}</td>
              <td className="py-2 px-3">{car.make}</td>
              <td className="py-2 px-3">{car.year}</td>
              <td className="py-2 px-3">{car.fuelType}</td>
              <td className="py-2 px-3">
                {car.msrp ? `$${car.msrp.toLocaleString()}` : "—"}
              </td>
              <td className="py-2 px-3">{car.mpg !== null ? car.mpg.toFixed(1) : "—"}</td>
              <td className="py-2 px-3">{car.horsepower || "—"}</td>
              <td className="py-2 px-3">{car.cylinders || "—"}</td>
              <td className="py-2 px-3">{car.style}</td>
              <td className="py-2 px-3">{car.transmission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedCarTable;
