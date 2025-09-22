import express, { Request, Response, NextFunction  } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/cars';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("CarWits API is running 🚗");
});

app.use('/api/cars', carRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


app.listen(3000)