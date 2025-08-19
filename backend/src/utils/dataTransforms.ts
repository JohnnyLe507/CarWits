// src/utils/dataTransform.ts
import carsData from "../data/carsData";

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
