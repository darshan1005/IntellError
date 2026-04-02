import express from 'express';
import { errorFormatter } from '../src/index.js';

const app = express();
const port = 3000;

app.get('/error', (_req, _res) => {
  // Triggering a custom error
  throw new Error("Simulated API Error in route handler");
});

// Use the IntellError middleware
app.use(errorFormatter());

console.log(`Server started at http://localhost:${port}`);
console.log(`To see the formatted error, visit http://localhost:${port}/error`);

// Don't listen to avoid hanging during build or automated test runs
// app.listen(port);
