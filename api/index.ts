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

// Resolve project root and dist directory
let projectRoot: string;

if (isVercel) {
  // On Vercel, process.cwd() is the project root
  projectRoot = process.cwd();
} else {
  let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  if (platform === 'win32') {
    // Remove leading slash on Windows (e.g. /C:/path -> C:/path)
    __dirname = __dirname.substring(1);
  }
  // Your folder structure: api / public / src / dist
  // api/index.ts sits inside "api", so project root is one level up
  projectRoot = path.join(__dirname, '..');
}

const distDirectory = path.join(projectRoot, 'dist');

app.use(express.json());
app.use(cors());

// Serve the built Vite React app (static assets from dist)
app.use(express.static(distDirectory));

// Example API route
app.get('/api/hello', (_req: Request, res: Response) => {
  res.send({ message: 'Hello, world!' });
});

// SPA fallback: any non-API route returns index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distDirectory, 'index.html'));
});

// Only listen locally; on Vercel the handler is exported instead
if (!isVercel) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://127.0.0.1:${PORT}`,
    );
  });
}

export default app;
