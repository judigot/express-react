import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';
import router from './route/index.js';

dotenv.config();

const app = express();
const VITE_BACKEND_PORT = (process.env.VITE_BACKEND_PORT ?? 5000).toString();
const platform: string = process.platform;

app.use(express.json());
app.use(cors());

app.get('/api', (_req: Request, res: Response) => {
  res.send({ message: router() });
});

if (process.env.VERCEL !== '1') {
  app.listen(VITE_BACKEND_PORT, () => {
    console.error(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on ${String(process.env.VITE_BACKEND_HOST)}:${VITE_BACKEND_PORT}`,
    );
  });
}

export default app;