// src/utils/dataFilters.ts
import carsData from "../data/carsData";
import { Car } from "../types";

// Filter cars by brand
export const getCarsByMake = (make: string): Car[] =>
    carsData.filter(car => car.make.toLowerCase() === make.toLowerCase());

// Get top N most popular cars
export const getTopPopularCars = (limit = 10): Car[] =>
    [...carsData]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);

// Search cars by make or model
export const searchCars = (query: string): Car[] => {
    const lowerQuery = query.toLowerCase();
    return carsData.filter(
        car =>
            car.make.toLowerCase().includes(lowerQuery) ||
            car.model.toLowerCase().includes(lowerQuery)
    );
};
