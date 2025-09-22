import { Router, Request, Response } from "express";
import carsData from "../data/carsData";

const router = Router();

function applyFilters(data: typeof carsData, query: any) {
  let results = data;
  const { make, year, fuelType, transmission, style, category } = query;

  if (make && make !== "All") results = results.filter((c) => c.make === make);
  if (year && year !== "All") results = results.filter((c) => c.year === Number(year));
  if (fuelType && fuelType !== "All") results = results.filter((c) => c.fuelType === fuelType);
  if (transmission && transmission !== "All")
    results = results.filter((c) => c.transmission === transmission);
  if (style && style !== "All") results = results.filter((c) => c.style === style);
  if (category && category !== "All") results = results.filter((c) => c.category === category);

  return results;
}

/**
 * GET /api/cars
 * Returns filtered cars
 */
router.get("/", (req: Request, res: Response) => {
  res.json(applyFilters(carsData, req.query));
});

/**
 * GET /api/cars/charts/fuel
 */
router.get("/charts/fuel", (req: Request, res: Response) => {
  const filtered = applyFilters(carsData, req.query);
  const counts = filtered.reduce((acc: Record<string, number>, c) => {
    const key = c.fuelType && c.fuelType.trim() !== "" ? c.fuelType : "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  res.json({
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Fuel Type Distribution",
        data: Object.values(counts),
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"],
      },
    ],
  });
});

/**
 * GET /api/cars/charts/styles
 */
router.get("/charts/styles", (req: Request, res: Response) => {
  const filtered = applyFilters(carsData, req.query);
  const counts = filtered.reduce((acc: Record<string, number>, c) => {
    const key = c.style && c.style.trim() !== "" ? c.style : "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  res.json({
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Body Styles",
        data: Object.values(counts),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"],
      },
    ],
  });
});

/**
 * GET /api/cars/charts/msrp
 */
router.get("/charts/msrp", (req: Request, res: Response) => {
  const filtered = applyFilters(carsData, req.query);

  const grouped: Record<number, number[]> = {};
  filtered.forEach((c) => {
    if (!grouped[c.year]) grouped[c.year] = [];
    grouped[c.year].push(c.msrp);
  });

  const years = Array.from(new Set(filtered.map((c) => c.year))).sort((a, b) => a - b);
  const avgByYear = years.map(
    (y) => grouped[y].reduce((a, b) => a + b, 0) / grouped[y].length
  );

  res.json({
    labels: years,
    datasets: [
      {
        label: "Average MSRP",
        data: avgByYear,
        borderColor: "rgba(255, 69, 255, 1)",
        backgroundColor: "rgba(161, 55, 165, 0.3)",
        fill: true,
      },
    ],
  });
});

/**
 * GET /api/cars/kpis
 */
router.get("/kpis", (req: Request, res: Response) => {
  const filtered = applyFilters(carsData, req.query);
  const totalCars = filtered.length;

  const avgMSRP =
    totalCars > 0 ? filtered.reduce((sum, c) => sum + (c.msrp || 0), 0) / totalCars : 0;

  const avgMPG =
    totalCars > 0
      ? filtered.reduce(
          (sum, c) => sum + ((c.cityMPG || 0) + (c.highwayMPG || 0)) / 2,
          0
        ) / totalCars
      : 0;

  const topFuel =
    totalCars > 0
      ? Object.entries(
          filtered.reduce((acc: Record<string, number>, c) => {
            const key = c.fuelType && c.fuelType.trim() !== "" ? c.fuelType : "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  res.json({ totalCars, avgMSRP, avgMPG, topFuel });
});

/**
 * GET /api/cars/options/:field
 */
router.get("/options/:field", (req: Request, res: Response) => {
  const { field } = req.params;
  if (!["make", "year", "fuelType", "transmission", "style", "category"].includes(field)) {
    return res.status(400).json({ error: "Invalid field" });
  }

  const options = Array.from(
    new Set(carsData.map((c: any) => c[field]).filter((v) => v && v !== ""))
  ).sort();

  res.json(options);
});

export default router;
