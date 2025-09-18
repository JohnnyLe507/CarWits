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

import type { ChartData } from "chart.js";
import ChartCard from "./components/ChartCard";
import SearchPanel from "./components/SearchPanel";
import MarketShareTable from "./components/MarketShareTable";
import DetailedCarTable from "./components/DetailedCarTable";

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


  // Fetch cars from backend
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

  // --- Filtering Logic ---
  useEffect(() => {
    let cars = allCars;

    if (filters.make !== "All") {
      cars = cars.filter((c) => c.make === filters.make);
    }

    if (filters.fuelType !== "All") {
      cars = cars.filter((c) => c.fuelType === filters.fuelType);
    }

    setFilteredCars(cars);
  }, [filters, allCars]);

  // Update charts only when filteredCars changes
  useEffect(() => {
    updateFuelTypes(filteredCars);
    updateBodyStyles(filteredCars);

    if (filters.make !== "All") {
      updateLineChart(filteredCars, filters.make);
    }
  }, [filteredCars, filters.make]);


  const updateLineChart = (cars: Car[], label: string) => {
    if (cars.length === 0) return;

    const grouped: Record<number, number[]> = {};
    cars.forEach((c) => {
      if (!grouped[c.year]) grouped[c.year] = [];
      grouped[c.year].push(c.msrp);
    });

    const avgByYear = years.map((y) => {
      if (!grouped[y]) return 0;
      const vals = grouped[y];
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    });

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

  // --- KPI calculations ---
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 shadow-lg flex justify-center items-center">
        <h1 className="text-3xl font-bold">🚗 CarWits Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="p-4 mb-6 ml-4 rounded-lg">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setView("overview")}
              className={`px-4 py-2 rounded-lg font-semibold ${view === "overview" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView("detail")}
              className={`px-4 py-2 rounded-lg font-semibold ${view === "detail" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
            >
              Detail
            </button>
          </div>

          <SearchPanel filters={filters} setFilters={setFilters} />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 space-y-6">
          {view === "overview" ? (
            <>
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <h3 className="text-gray-500 text-sm">Total Cars</h3>
                  <p className="text-2xl font-bold text-gray-800">{totalCars ?? 0}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <h3 className="text-gray-500 text-sm">Avg MSRP</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalCars > 0 ? `$${avgMSRP.toFixed(0)}` : "—"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <h3 className="text-gray-500 text-sm">Avg MPG</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalCars > 0 ? `${avgMPG.toFixed(1)} mpg` : "—"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <h3 className="text-gray-500 text-sm">Top Fuel</h3>
                  <p className="text-2xl font-bold text-gray-800">{topFuel}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title={`📈 Average MSRP Over Time`} data={avgPriceData} type="line" />
                <ChartCard title="Fuel Type Distribution" data={fuelTypes} type="doughnut" />
                <ChartCard title="Vehicle Style Popularity" data={bodyStyles} type="bar" />
                <div className="max-h-96 overflow-y-auto">
                  <MarketShareTable cars={filteredCars} />
                </div>
              </div>
            </>
          ) : (
            <DetailedCarTable cars={filteredCars} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
