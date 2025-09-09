import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import type { ChartData } from "chart.js";
import CarCard from "./components/CarCard";
import ChartCard from "./components/ChartCard";
import SearchPanel from "./components/SearchPanel";

const mockTopCars = [
  { name: "Toyota Camry", price: 28000, fuel: "Gas", brand: "Toyota" },
  { name: "Tesla Model 3", price: 42000, fuel: "Electric", brand: "Tesla" },
  { name: "Honda Civic", price: 25000, fuel: "Gas", brand: "Honda" },
];

const mockMarketShare: ChartData<"bar"> = {
  labels: ["Toyota", "Tesla", "Honda", "Ford"],
  datasets: [
    {
      label: "Market Share (%)",
      data: [25, 20, 18, 15],
      backgroundColor: ["#4ade80", "#60a5fa", "#facc15", "#f87171"],
    },
  ],
};

const mockAvgPriceByYear: ChartData<"line"> = {
  labels: [2018, 2019, 2020, 2021, 2022, 2023],
  datasets: [
    {
      label: "Average Price",
      data: [27000, 28000, 29000, 31000, 35000, 37000],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.3)",
    },
  ],
};

const mockBodyStylePopularity: ChartData<"bar"> = {
  labels: ["Sedan", "SUV", "Truck", "Coupe"],
  datasets: [
    {
      label: "Popularity (%)",
      data: [35, 40, 15, 10],
      backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24"],
    },
  ],
};

const App: React.FC = () => {
  const [topCars, setTopCars] = useState<any[]>([]);
  const [avgPriceData, setAvgPriceData] = useState<ChartData<"line"> | null>(null);
  const [marketShare, setMarketShare] = useState<ChartData<"bar"> | null>(null);
  const [bodyStyles, setBodyStyles] = useState<ChartData<"bar"> | null>(null);

  // Dropdown states
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    // Mock fetch
    setTopCars(mockTopCars);
    setAvgPriceData(mockAvgPriceByYear);
    setMarketShare(mockMarketShare);
    setBodyStyles(mockBodyStylePopularity);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 shadow-lg flex justify-center items-center">
        <h1 className="text-3xl font-bold">🚗 CarWits Dashboard</h1>
      </header>

      {/* Main Content: Sidebar + Dashboard */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="p-4 mb-6 ml-4 rounded-lg">
          <SearchPanel />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Top Cars */}
          <div>
            <h2 className="text-xl font-semibold mb-2">🔥 Top Popular Cars</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {topCars.map((car, idx) => <CarCard key={idx} {...car} />)}
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Market Share by Brand" data={marketShare} type="bar" />
            <ChartCard title="Horsepower vs Price" data={[]} type="scatter" />
            <ChartCard title="Body Style Popularity" data={[]} type="bar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
