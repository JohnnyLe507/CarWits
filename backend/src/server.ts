import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/cars';
import statsRoutes from './routes/stats';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/cars', carRoutes);
app.use('/api/stats', statsRoutes);

app.listen(3000)