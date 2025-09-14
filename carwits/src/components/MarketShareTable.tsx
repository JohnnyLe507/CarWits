import { useState, useMemo } from "react";

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

interface MarketShareTableProps {
  cars: Car[];
}

type SortKey = "make" | "avgPrice" | "count";

const MarketShareTable: React.FC<MarketShareTableProps> = ({ cars }) => {
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Aggregate stats per company
  const companyStats = useMemo(() => {
    const stats = Object.values(
      cars.reduce(
        (acc: Record<string, { make: string; totalPrice: number; count: number }>, c) => {
          if (!acc[c.make]) {
            acc[c.make] = { make: c.make, totalPrice: 0, count: 0 };
          }
          acc[c.make].totalPrice += c.msrp;
          acc[c.make].count += 1;
          return acc;
        },
        {}
      )
    ).map((d) => ({
      make: d.make,
      avgPrice: d.count > 0 ? d.totalPrice / d.count : 0,
      count: d.count,
    }));

    return stats;
  }, [cars]);

  const maxCount = Math.max(...companyStats.map((d) => d.count), 1);

  // Sorting
  const sortedStats = useMemo(() => {
    return [...companyStats].sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [companyStats, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-4 max-h-96 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Company Market Share</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("make")}
            >
              Company {sortKey === "make" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("avgPrice")}
            >
              YTD Avg Price {sortKey === "avgPrice" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:underline"
              onClick={() => handleSort("count")}
            >
              Market Share {sortKey === "count" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map(({ make, avgPrice, count }) => (
            <tr key={make} className="border-b border-gray-200">
              <td className="py-2 px-3">{make}</td>
              <td className="py-2 px-3">${avgPrice.toLocaleString()}</td>
              <td className="py-2 px-3">
                <div className="relative h-6 bg-gray-200 rounded">
                  <div
                    className="absolute left-0 top-0 h-6 bg-blue-500 rounded text-white text-xs flex items-center px-2"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  >
                    {count}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketShareTable;