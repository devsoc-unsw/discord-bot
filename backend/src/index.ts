import express, { Request, Response } from 'express';

const app = express();
const port = process.env.DEFAULT_PORT;

app.get('/', (req: Request, res: Response) => {
  const msg = 'PENNY BOT Backend';
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
