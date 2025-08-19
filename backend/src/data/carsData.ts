import rawCarsJson from '../data/cars_data.json';
import { RawCar, Car } from '../types';

const rawCars = rawCarsJson as RawCar[];

if (!Array.isArray(rawCars)) {
    throw new Error("cars_data.json is not an array of cars");
}

const transformRawCars = (raw: RawCar): Car => ({
    make: raw.Make,
    model: raw.Model,
    year: raw.Year,
    fuelType: raw["Engine Fuel Type"],
    horsepower: raw["Engine HP"],
    cylinders: raw["Engine Cylinders"],
    transmission: raw["Transmission Type"],
    drive: raw.Driven_Wheels,
    doors: raw["Number of Doors"],
    category: raw["Market Category"],
    size: raw["Vehicle Size"],
    style: raw["Vehicle Style"],
    highwayMPG: raw["highway MPG"],
    cityMPG: raw["city mpg"],
    popularity: raw.Popularity,
    msrp: raw.MSRP,
});

const carsData: Car[] = rawCars.map(transformRawCars);

// --- Basic Helpers ---

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

// --- Dashboard Stats Helpers ---

// 1. Average Car Price by Year
export const getAveragePriceByYear = () => {
    const yearMap: Record<number, { total: number; count: number }> = {};

    carsData.forEach(car => {
        if (!yearMap[car.year]) yearMap[car.year] = { total: 0, count: 0 };
        yearMap[car.year].total += car.msrp;
        yearMap[car.year].count++;
    });

    return Object.entries(yearMap).map(([year, { total, count }]) => ({
        year: Number(year),
        averagePrice: total / count,
    }));
};

// 2. Market Share by Brand (counts models per brand)
export const getMarketShareByBrand = (year?: number) => {
    const brandMap: Record<string, number> = {};

    carsData.forEach(car => {
        if (year && car.year !== year) return;
        brandMap[car.make] = (brandMap[car.make] || 0) + 1;
    });

    return Object.entries(brandMap).map(([brand, count]) => ({
        brand,
        count,
    }));
};

// 3. Horsepower vs Price (scatterplot data)
export const getHorsepowerVsPrice = () =>
    carsData
        .filter(car => car.horsepower && car.msrp)
        .map(car => ({
            make: car.make,
            model: car.model,
            horsepower: car.horsepower,
            price: car.msrp,
        }));

// 4. Body Style Popularity
export const getBodyStyleDistribution = (year?: number) => {
    const styleMap: Record<string, number> = {};

    carsData.forEach(car => {
        if (year && car.year !== year) return;
        styleMap[car.style] = (styleMap[car.style] || 0) + 1;
    });

    return Object.entries(styleMap).map(([style, count]) => ({
        style,
        count,
    }));
};

export default carsData;