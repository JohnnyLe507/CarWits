import { motion } from "framer-motion";
import { Line, Bar, Scatter, Pie, Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface ChartCardProps {
  title: string;
  data?: ChartData<any> | null;
  type: "line" | "bar" | "scatter" | "pie" | "doughnut";
  options?: ChartOptions<any>;
}

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "right", // moves labels to the right side
      labels: {
        color: "white", // makes text visible on dark bg
        padding: 20,
        boxWidth: 12,
      },
    },
  },
};


const ChartCard: React.FC<ChartCardProps> = ({ title, data, type, options }) => {
  const safeData = data && data.datasets
    ? data
    : { labels: [], datasets: [] };

  const renderChart = () => {
    switch (type) {
      case "line": return <Line data={safeData} options={options} />;
      case "bar": return <Bar data={safeData} options={options} />;
      case "scatter": return <Scatter data={safeData} options={options} />;
      case "pie": return <Pie data={safeData} options={options} />;
      case "doughnut": return <Doughnut data={safeData} options={chartOptions} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20"
    >
      <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-sm">
        {title}
      </h3>
      <div className="h-64">{renderChart()}</div>
    </motion.div>
  );
};

export default ChartCard;
