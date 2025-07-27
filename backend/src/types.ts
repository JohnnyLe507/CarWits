export interface Car {
  Make: string;
  Model: string;
  Year: number;
  'Engine Fuel Type': string;
  'Engine HP': number;
  'Engine Cylinders': number;
  MSRP: number;
  [key: string]: any; // catch-all for extra fields
}