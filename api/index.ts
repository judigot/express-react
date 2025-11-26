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

let projectRoot: string;

let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
if (isVercel) {
  projectRoot = process.cwd();
} else {
  __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  if (platform === 'win32') {
    __dirname = __dirname.substring(1);
  }
  projectRoot = path.join(__dirname, '..');
}

const distDirectory = path.join(projectRoot, 'dist');

app.use(express.json());
app.use(cors());
app.use(express.static(distDirectory));

app.get('/api', (_req: Request, res: Response) => {
  res.send({ message: 'Hello, world!' });
});

import fs from 'node:fs';

app.get('/api/files', (_req: Request, res: Response) => {
  const currentPath = __dirname;

  let files: string[] = [];

  try {
    files = fs.readdirSync(currentPath);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    files = [`Error reading directory: ${errorMessage}`];
  }

  res.send({
    cwd: currentPath,
    files,
  });
});

app.get('/api/dist', (_req: Request, res: Response) => {
  const distPath = path.join(__dirname, '..', 'dist');

  let files: string[] = [];
  let error: string | null = null;

  try {
    files = fs.readdirSync(distPath);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  res.send({
    distPath,
    files,
    error,
  });
});

if (!isVercel) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://127.0.0.1:${PORT}`,
    );
  });
}

export default app;
