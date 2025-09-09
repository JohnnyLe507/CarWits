import { motion } from "framer-motion";

type CarCardProps = {
  name: string;
  brand: string;
  price?: number;
  fuelType?: string;
  image?: string;
};

const CarCard: React.FC<CarCardProps> = ({ name, brand, price, fuelType, image }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl p-4 shadow-lg backdrop-blur-md bg-white/10 border border-white/20 flex flex-col items-center text-center"
    >
      <img
        src={image || "https://picsum.photos/300/200"}
        alt={name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold text-lg">{brand} {name}</h3>
      <p className="text-sm text-gray-600">{fuelType || "Unknown fuel"}</p>
      <p className="text-blue-600 font-bold">
        {price ? `$${price.toLocaleString()}` : "Price N/A"}
      </p>
    </motion.div>
  );
};

export default CarCard;
