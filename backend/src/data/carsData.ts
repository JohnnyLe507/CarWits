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

export default carsData;