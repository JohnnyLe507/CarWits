import { Router, Request, Response } from 'express';
import carsData from '../data/cars_data.json';  // Make sure this matches your filename

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const { brand, year, fuel, minPrice, maxPrice } = req.query;

    let filteredCars = [...(carsData as any[])];

    if (brand) {
        filteredCars = filteredCars.filter(
            (c) => c.Make.toLowerCase() === String(brand).toLowerCase()
        );
    }
    if (year) {
        filteredCars = filteredCars.filter(
            (c) => Number(c.Year) === Number(year)
        );
    }
    if (fuel) {
        filteredCars = filteredCars.filter(
            (c) => c['Engine Fuel Type']?.toLowerCase().includes(String(fuel).toLowerCase())
        );
    }
    if (minPrice) {
        filteredCars = filteredCars.filter(
            (c) => Number(c.MSRP) >= Number(minPrice)
        );
    }
    if (maxPrice) {
        filteredCars = filteredCars.filter(
            (c) => Number(c.MSRP) <= Number(maxPrice)
        );
    }

    res.json(filteredCars);
});

export default router;
