import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const app = express();
const PORT = (process.env.PORT ?? 5000).toString();
const platform: string = process.platform;

const isVercel = process.env.VERCEL === '1';
let publicDirectory: string;

if (isVercel) {
  publicDirectory = path.join(process.cwd(), 'dist', 'public');
} else {
  let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  if (platform === 'win32') {
    __dirname = __dirname.substring(1);
  }
  publicDirectory = path.join(__dirname, 'public');
}

// Parse JSON from front end
app.use(express.json());

// Enable CORS and serve static files
app.use(cors());
app.use(express.static(publicDirectory));

// Define routes
app.get('/', (_req, res) => {
  const isDevelopment: boolean = String(process.env.NODE_ENV) === 'development';

  if (isDevelopment) {
    res.redirect(String(process.env.VITE_FRONTEND_URL));
    return;
  }

  // res.sendFile(path.join(publicDirectory, 'index.html'));
  res.sendFile("/var/task/dist/public/index.html");
});

app.get('/api', (_req: Request, res: Response) => {
  res.send({ message: path.join(publicDirectory, 'index.html') });
});

app.get('/api/hello', (_req: Request, res: Response) => {
  res.send({ message: 'Hello, world!' });
});

// app.get('*', (_req, res) => {
//   res.sendFile(path.join(publicDirectory, 'index.html'));
// });

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://127.0.0.1:${PORT}`,
    );
  });
}

export default app;