import { Router, Request, Response } from 'express';
import carsData from '../data/carsData';

import { getCarsByMake, getTopPopularCars, searchCars } from "../utils/dataFilters";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json(carsData);
});

// GET /api/cars/make/:make
router.get("/make/:make", (req, res) => {
    const { make } = req.params;
    const cars = getCarsByMake(make);
    res.json(cars);
});

// GET /api/cars/top?limit=10
router.get("/top", (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const cars = getTopPopularCars(limit);
    res.json(cars);
});

// GET /api/cars/search?q=...
router.get("/search", (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
    }
    const results = searchCars(q);
    res.json(results);
});

export default router;
