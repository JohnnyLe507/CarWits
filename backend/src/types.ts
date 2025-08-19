export interface RawCar {
  Make: string;
  Model: string;
  Year: number;
  "Engine Fuel Type": string;
  "Engine HP": number;
  "Engine Cylinders": number;
  "Transmission Type": string;
  Driven_Wheels: string;
  "Number of Doors": number;
  "Market Category"?: string;
  "Vehicle Size": string;
  "Vehicle Style": string;
  "highway MPG": number;
  "city mpg": number;
  Popularity: number;
  MSRP: number;
}

export interface Car {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  horsepower: number;
  cylinders: number;
  transmission: string;
  drive: string;
  doors: number;
  category?: string;
  size: string;
  style: string;
  highwayMPG: number;
  cityMPG: number;
  popularity: number;
  msrp: number;
}