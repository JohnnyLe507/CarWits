import { Router } from 'express';
import carsData from '../data/cars_data.json';
import { Car } from '../types';

const router = Router();
const cars: Car[] = carsData as Car[];

// Average MSRP by year
router.get('/average-price-by-year', (req, res) => {
    const yearGroups: Record<string, { total: number; count: number }> = {};

    cars.forEach((car) => {
        const year = String(car.Year);
        if (!yearGroups[year]) {
            yearGroups[year] = { total: 0, count: 0 };
        }
        yearGroups[year].total += Number(car.MSRP);
        yearGroups[year].count += 1;
    });

    const averages = Object.entries(yearGroups).map(([year, { total, count }]) => ({
        year,
        avgPrice: Math.round(total / count),
    }));

    res.json(averages);
});

export default router;
