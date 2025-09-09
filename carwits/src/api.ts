const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getTopPopularCars() {
  const res = await fetch(`${API_BASE}/cars/top-popular`);
  return res.json();
}

export async function searchCars(query: string) {
  const res = await fetch(`${API_BASE}/cars/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getCarsByMake(make: string) {
  const res = await fetch(`${API_BASE}/cars/make/${make}`);
  return res.json();
}

export async function fetchAveragePriceByYear() {
  const res = await fetch(`${API_BASE}/stats/average-price-by-year`);
  return res.json();
}

export async function getMarketShare() {
  const res = await fetch(`${API_BASE}/stats/market-share`);
  return res.json();
}
