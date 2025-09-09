import { motion } from "framer-motion";
import { Line, Bar, Scatter, Pie } from "react-chartjs-2";

interface ChartCardProps {
  title: string;
  data?: any; // Chart.js data object
  type: "line" | "bar" | "scatter" | "pie";
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, type }) => {
  // fallback to empty data if API hasn't returned yet
  const safeData = data && data.datasets
    ? data
    : { labels: [], datasets: [] };

  const renderChart = () => {
    switch (type) {
      case "line": return <Line data={safeData} />;
      case "bar": return <Bar data={safeData} />;
      case "scatter": return <Scatter data={safeData} />;
      case "pie": return <Pie data={safeData} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-2xl shadow-md"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {renderChart()}
    </motion.div>
  );
};

export default ChartCard;
