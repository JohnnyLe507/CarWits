import { useEffect, useState } from "react";
import axios from "axios";
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

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<Filters>({
    make: "All",
    year: "All",
    fuelType: "All",
    transmission: "All",
    style: "All",
    category: "All",
  });

  // Chart + KPI data
  const [avgPriceData, setAvgPriceData] = useState<ChartData<"line"> | null>(null);
  const [fuelTypes, setFuelTypes] = useState<ChartData<"doughnut"> | null>(null);
  const [bodyStyles, setBodyStyles] = useState<ChartData<"bar"> | null>(null);
  const [kpis, setKpis] = useState({
    totalCars: 0,
    avgMSRP: 0,
    avgMPG: 0,
    topFuel: "N/A",
  });

  // Options for filters
  const [options, setOptions] = useState<{
    makes: string[];
    years: string[];
    fuelTypes: string[];
    transmissions: string[];
    styles: string[];
    categories: string[];
  }>({
    makes: [],
    years: [],
    fuelTypes: [],
    transmissions: [],
    styles: [],
    categories: [],
  });

  const [view, setView] = useState<"overview" | "detail">("overview");

  // Fetch cars whenever filters change
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get<Car[]>("http://localhost:3000/api/cars", { params: filters });
        setCars(res.data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };
    fetchCars();
  }, [filters]);

  // Fetch chart + KPI data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fuelRes, styleRes, msrpRes, kpiRes] = await Promise.all([
          axios.get("http://localhost:3000/api/cars/charts/fuel", { params: filters }),
          axios.get("http://localhost:3000/api/cars/charts/styles", { params: filters }),
          axios.get("http://localhost:3000/api/cars/charts/msrp", { params: filters }),
          axios.get("http://localhost:3000/api/cars/kpis", { params: filters }),
        ]);

        setFuelTypes(fuelRes.data as ChartData<"doughnut">);
        setBodyStyles(styleRes.data as ChartData<"bar">);
        setAvgPriceData(msrpRes.data as ChartData<"line">);
        setKpis(kpiRes.data as { totalCars: number; avgMSRP: number; avgMPG: number; topFuel: string });
      } catch (err) {
        console.error("Failed to fetch charts/kpis:", err);
      }
    };
    fetchData();
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [makes, years, fuelTypes, transmissions, styles, categories] = await Promise.all([
          axios.get<string[]>("http://localhost:3000/api/cars/options/make"),
          axios.get<string[]>("http://localhost:3000/api/cars/options/year"),
          axios.get<string[]>("http://localhost:3000/api/cars/options/fuelType"),
          axios.get<string[]>("http://localhost:3000/api/cars/options/transmission"),
          axios.get<string[]>("http://localhost:3000/api/cars/options/style"),
          axios.get<string[]>("http://localhost:3000/api/cars/options/category"),
        ]);

        setOptions({
          makes: makes.data,
          years: years.data,
          fuelTypes: fuelTypes.data,
          transmissions: transmissions.data,
          styles: styles.data,
          categories: categories.data,
        });
      } catch (err) {
        console.error("Failed to fetch options:", err);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
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
                  <SearchPanel filters={filters} setFilters={setFilters} options={options} />
                </div>

                {/* Right content */}
                <div className="flex-1 space-y-6">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Total Cars</h3>
                      <p className="text-xl font-bold text-white">{kpis.totalCars}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Avg MSRP</h3>
                      <p className="text-xl font-bold text-white">
                        {kpis.totalCars > 0 ? `$${kpis.avgMSRP.toFixed(0)}` : "—"}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Avg MPG</h3>
                      <p className="text-xl font-bold text-white">
                        {kpis.totalCars > 0 ? `${kpis.avgMPG.toFixed(1)} mpg` : "—"}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                      <h3 className="text-gray-300 text-xs">Top Fuel</h3>
                      <p className="text-xl font-bold text-white">{kpis.topFuel}</p>
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
                      <MarketShareTable cars={cars} />
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
                <DetailedCarTable cars={cars} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
