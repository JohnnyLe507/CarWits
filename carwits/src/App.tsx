import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.color = "#f1f5f9";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.2)";
ChartJS.defaults.plugins.legend.labels.color = "#f1f5f9";
ChartJS.defaults.plugins.title.color = "#f1f5f9";
ChartJS.defaults.plugins.tooltip.backgroundColor = "rgba(0,0,0,0.7)";
ChartJS.defaults.plugins.tooltip.titleColor = "#fff";
ChartJS.defaults.plugins.tooltip.bodyColor = "#f1f5f9";

import { AnimatePresence, motion } from "framer-motion";
import type { ChartData } from "chart.js";
import ChartCard from "./components/ChartCard";
import SearchPanel from "./components/SearchPanel";
import MarketShareTable from "./components/MarketShareTable";
import DetailedCarTable from "./components/DetailedCarTable";
import RegionMap from "./components/RegionMap";

interface Filters {
  make: string;
  year: string;
  fuelType: string;
  transmission: string;
  style: string;
  category: string;
}

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

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

const App: React.FC = () => {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [avgPriceData, setAvgPriceData] = useState<ChartData<"line"> | null>(null);
  const [filters, setFilters] = useState<Filters>({
    make: "All",
    year: "All",
    fuelType: "All",
    transmission: "All",
    style: "All",
    category: "All",
  });

  const [bodyStyles, setBodyStyles] = useState<ChartData<"bar"> | null>(null);
  const [fuelTypes, setFuelTypes] = useState<ChartData<"doughnut"> | null>(null);

  const [view, setView] = useState<"overview" | "detail">("overview");

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cars");
        const data: Car[] = await res.json();
        setAllCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };
    fetchCars();
  }, []);

  // Filtering
  useEffect(() => {
    let cars = allCars;
    if (filters.make !== "All") cars = cars.filter((c) => c.make === filters.make);
    if (filters.fuelType !== "All") cars = cars.filter((c) => c.fuelType === filters.fuelType);
    setFilteredCars(cars);
  }, [filters, allCars]);

  // Charts
  useEffect(() => {
    updateFuelTypes(filteredCars);
    updateBodyStyles(filteredCars);
    if (filteredCars.length > 0) {
      const label = filters.make === "All" ? "All Makes" : filters.make;
      updateLineChart(filteredCars, label);
    } else {
      setAvgPriceData(null);
    }
  }, [filteredCars, filters.make]);

  const updateLineChart = (cars: Car[], label: string) => {
    if (cars.length === 0) return;
    const grouped: Record<number, number[]> = {};
    cars.forEach((c) => {
      if (!grouped[c.year]) grouped[c.year] = [];
      grouped[c.year].push(c.msrp);
    });
    const avgByYear = years.map((y) =>
      grouped[y] ? grouped[y].reduce((a, b) => a + b, 0) / grouped[y].length : 0
    );
    setAvgPriceData({
      labels: years,
      datasets: [
        {
          label: `Average MSRP (${label})`,
          data: avgByYear,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          tension: 0.3,
          fill: true,
        },
      ],
    });
  };

  const updateFuelTypes = (cars: Car[]) => {
    const counts = cars.reduce((acc: Record<string, number>, c) => {
      acc[c.fuelType] = (acc[c.fuelType] || 0) + 1;
      return acc;
    }, {});
    setFuelTypes({
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Fuel Type Distribution",
          data: Object.values(counts),
          backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"],
          hoverOffset: 8,
        },
      ],
    });
  };

  const updateBodyStyles = (cars: Car[]) => {
    const counts = cars.reduce((acc: Record<string, number>, c) => {
      acc[c.style] = (acc[c.style] || 0) + 1;
      return acc;
    }, {});
    setBodyStyles({
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Vehicle Style Popularity",
          data: Object.values(counts),
          backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"],
        },
      ],
    });
  };

  // KPIs
  const totalCars = filteredCars.length;
  const avgMSRP =
    totalCars > 0 ? filteredCars.reduce((sum, c) => sum + (c.msrp || 0), 0) / totalCars : 0;
  const avgMPG =
    totalCars > 0
      ? filteredCars.reduce(
        (sum, c) => sum + ((c.highwayMPG || 0) + (c.cityMPG || 0)) / 2,
        0
      ) / totalCars
      : 0;
  const topFuel =
    totalCars > 0
      ? Object.entries(
        filteredCars.reduce((acc: Record<string, number>, c) => {
          acc[c.fuelType] = (acc[c.fuelType] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">🚗 CarWits</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView("overview")}
              className={`px-3 py-1 rounded-md font-semibold text-sm ${view === "overview"
                ? "bg-purple-600 text-white"
                : "bg-white/20 text-gray-200 backdrop-blur-md"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView("detail")}
              className={`px-3 py-1 rounded-md font-semibold text-sm ${view === "detail"
                ? "bg-purple-600 text-white"
                : "bg-white/20 text-gray-200 backdrop-blur-md"
                }`}
            >
              Detail
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <AnimatePresence mode="wait">
            {view === "overview" ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-6"
              >
                {/* Left sidebar - Search Panel */}
                <div className="w-64 shrink-0">
                  <SearchPanel filters={filters} setFilters={setFilters} />
                </div>

                {/* Right content */}
                <div className="flex-1 space-y-6">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Total Cars</h3>
                      <p className="text-xl font-bold text-white">{totalCars ?? 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Avg MSRP</h3>
                      <p className="text-xl font-bold text-white">
                        {totalCars > 0 ? `$${avgMSRP.toFixed(0)}` : "—"}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Avg MPG</h3>
                      <p className="text-xl font-bold text-white">
                        {totalCars > 0 ? `${avgMPG.toFixed(1)} mpg` : "—"}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Top Fuel</h3>
                      <p className="text-xl font-bold text-white">{topFuel}</p>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid gap-4 md:grid-cols-3 mt-6">
                    <ChartCard title="📈 Average MSRP Over Time" data={avgPriceData} type="line" />
                    <ChartCard title="Fuel Type Distribution" data={fuelTypes} type="doughnut" />
                    <ChartCard title="Vehicle Style Popularity" data={bodyStyles} type="bar" />
                  </div>

                  {/* Map + Table */}
                  <div className="grid gap-4 md:grid-cols-3 mt-6">
                    <div className="col-span-2">
                      <RegionMap />
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      <MarketShareTable cars={filteredCars} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DetailedCarTable cars={filteredCars} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
