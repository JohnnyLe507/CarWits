import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

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

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 inline ml-1 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 inline ml-1 text-purple-400" />
    ) : (
      <ArrowDown className="w-4 h-4 inline ml-1 text-purple-400" />
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-4 max-h-96 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-white">🏢 Company Market Share</h2>
      <table className="w-full text-sm border-collapse text-gray-200">
        <thead className="sticky top-0 bg-black/40 backdrop-blur-md">
          <tr>
            <th
              className="py-2 px-3 cursor-pointer hover:text-purple-400 transition"
              onClick={() => handleSort("make")}
            >
              Company {renderSortIcon("make")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:text-purple-400 transition"
              onClick={() => handleSort("avgPrice")}
            >
              YTD Avg Price {renderSortIcon("avgPrice")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer hover:text-purple-400 transition"
              onClick={() => handleSort("count")}
            >
              Market Share {renderSortIcon("count")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map(({ make, avgPrice, count }) => (
            <tr
              key={make}
              className="border-b border-white/10 hover:bg-white/5 transition"
            >
              <td className="py-2 px-3 font-medium">{make}</td>
              <td className="py-2 px-3 font-mono">${avgPrice.toLocaleString()}</td>
              <td className="py-2 px-3">
                <div className="relative h-6 bg-white/10 rounded overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-6 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center px-2 text-xs font-bold text-white transition-all duration-500"
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
