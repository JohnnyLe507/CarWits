import { Router, Request, Response } from "express";
import {
    getAveragePriceByYear,
    getMarketShareByBrand,
    getHorsepowerVsPrice,
    getBodyStyleDistribution,
} from "../utils/dataTransforms";

const router = Router();

// GET /api/stats/average-price-by-year
router.get("/average-price-by-year", (req, res) => {
    res.json(getAveragePriceByYear());
});

// GET /api/stats/market-share?year=2015
router.get("/market-share", (req, res) => {
    const year = req.query.year ? Number(req.query.year) : undefined;
    res.json(getMarketShareByBrand(year));
});

// GET /api/stats/horsepower-vs-price
router.get("/horsepower-vs-price", (req, res) => {
    res.json(getHorsepowerVsPrice());
});

// GET /api/stats/body-style-distribution?year=2015
router.get("/body-style-distribution", (req, res) => {
    const year = req.query.year ? Number(req.query.year) : undefined;
    res.json(getBodyStyleDistribution(year));
});

export default router;
