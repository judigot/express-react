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

if (isVercel) {
  projectRoot = process.cwd();
} else {
  let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  if (platform === 'win32') {
    __dirname = __dirname.substring(1);
  }
  projectRoot = path.join(__dirname, '..');
}

const distDirectory = path.join(projectRoot, 'dist');

app.use(express.json());
app.use(cors());
app.use(express.static(distDirectory));

app.get('/api/hello', (_req: Request, res: Response) => {
  res.send({ message: 'Hello, world!' });
});

if (!isVercel) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://127.0.0.1:${PORT}`
    );
  });
}

export default app;
