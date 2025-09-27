import { useState } from "react";
import React from "react";

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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChartData } from "chart.js";
import ChartCard from "./components/ChartCard";
import SearchPanel from "./components/SearchPanel";
import MarketShareTable from "./components/MarketShareTable";
import DetailedCarTable from "./components/DetailedCarTable";
import RegionMap from "./components/RegionMap";
import api from "./Api";

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

const emptyDoughnut: ChartData<"doughnut"> = {
  labels: [],
  datasets: [{ data: [], backgroundColor: [] }],
};

const emptyBar: ChartData<"bar"> = {
  labels: [],
  datasets: [{ data: [], backgroundColor: [] }],
};

const emptyLine: ChartData<"line"> = {
  labels: [],
  datasets: [{ data: [], borderColor: [], backgroundColor: [], fill: false }],
};

const emptyKpis = {
  totalCars: 0,
  avgMSRP: 0,
  avgMPG: 0,
  topFuel: "—",
};

const emptyOptions = {
  makes: [],
  years: [],
  fuelTypes: [],
  transmissions: [],
  styles: [],
  categories: [],
};

const App: React.FC = () => {
const [filters, setFilters] = useState<Filters>({
    make: "All",
    year: "All",
    fuelType: "All",
    transmission: "All",
    style: "All",
    category: "All",
  });
  const [view, setView] = useState<"overview" | "detail">("overview");

  const queryClient = useQueryClient();

  // Invalidate relevant queries when filters change
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    queryClient.invalidateQueries({ queryKey: ["cars"] });
    queryClient.invalidateQueries({ queryKey: ["charts"] });
    queryClient.invalidateQueries({ queryKey: ["kpis"] });
  };

  const prefetchDetailData = () => {
    queryClient.prefetchQuery({
      queryKey: ["cars", filters],
      queryFn: async () => {
        const res = await api.get<Car[]>("/api/cars", { params: filters });
        return res.data;
      },
    });
  };

  const prefetchOverviewData = () => {
    queryClient.prefetchQuery({
      queryKey: ["charts", "fuel", filters],
      queryFn: async () => {
        const res = await api.get("/api/cars/charts/fuel", { params: filters });
        return res.data as ChartData<"doughnut">;
      },
    });

    queryClient.prefetchQuery({
      queryKey: ["charts", "styles", filters],
      queryFn: async () => {
        const res = await api.get("/api/cars/charts/styles", { params: filters });
        return res.data as ChartData<"bar">;
      },
    });

    queryClient.prefetchQuery({
      queryKey: ["charts", "msrp", filters],
      queryFn: async () => {
        const res = await api.get("/api/cars/charts/msrp", { params: filters });
        return res.data as ChartData<"line">;
      },
    });

    queryClient.prefetchQuery({
      queryKey: ["kpis", filters],
      queryFn: async () => {
        const res = await api.get("/api/cars/kpis", { params: filters });
        return res.data as typeof emptyKpis;
      },
    });
  };


  // React Query Fetchers

  const { data: cars = [] } = useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      const res = await api.get<Car[]>("/api/cars", { params: filters });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  const { data: fuelTypes = emptyDoughnut } = useQuery({
    queryKey: ["charts", "fuel", filters],
    queryFn: async () => {
      const res = await api.get("/api/cars/charts/fuel", { params: filters });
      return res.data as ChartData<"doughnut">;
    },
    placeholderData: (prev) => prev ?? emptyDoughnut,
  });

  const { data: bodyStyles = emptyBar } = useQuery({
    queryKey: ["charts", "styles", filters],
    queryFn: async () => {
      const res = await api.get("/api/cars/charts/styles", { params: filters });
      return res.data as ChartData<"bar">;
    },
    placeholderData: (prev) => prev ?? emptyBar,
  });

  const { data: avgPriceData = emptyLine } = useQuery({
    queryKey: ["charts", "msrp", filters],
    queryFn: async () => {
      const res = await api.get("/api/cars/charts/msrp", { params: filters });
      return res.data as ChartData<"line">;
    },
    placeholderData: (prev) => prev ?? emptyLine,
  });

  const { data: kpis = emptyKpis } = useQuery({
    queryKey: ["kpis", filters],
    queryFn: async () => {
      const res = await api.get("/api/cars/kpis", { params: filters });
      return res.data as typeof emptyKpis;
    },
    placeholderData: (prev) => prev ?? emptyKpis,
  });

  const { data: options = emptyOptions } = useQuery({
    queryKey: ["options"],
    queryFn: async () => {
      const [makes, years, fuelTypes, transmissions, styles, categories] = await Promise.all([
        api.get<string[]>("/api/cars/options/make"),
        api.get<string[]>("/api/cars/options/year"),
        api.get<string[]>("/api/cars/options/fuelType"),
        api.get<string[]>("/api/cars/options/transmission"),
        api.get<string[]>("/api/cars/options/style"),
        api.get<string[]>("/api/cars/options/category"),
      ]);
      return {
        makes: makes.data,
        years: years.data,
        fuelTypes: fuelTypes.data,
        transmissions: transmissions.data,
        styles: styles.data,
        categories: categories.data,
      };
    },
    staleTime: Infinity,
  });
  
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">🚗 CarWits</h1>
          <div className="flex gap-2">
            <button
              onMouseEnter={prefetchOverviewData}
              onFocus={prefetchOverviewData}
              onClick={() => setView("overview")}
              className={`px-3 py-1 rounded-md font-semibold text-sm ${view === "overview"
                ? "bg-purple-600 text-white"
                : "bg-white/20 text-gray-200 backdrop-blur-md"
                }`}
            >
              Overview
            </button>
            <button
              onMouseEnter={prefetchDetailData}
              onFocus={prefetchDetailData}
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
                  <SearchPanel filters={filters} onFilterChange={handleFilterChange} options={options} />
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
