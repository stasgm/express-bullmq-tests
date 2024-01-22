import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { addJobToQueue, myQueue } from './bullmq/queue';

dotenv.config();

const run = async () => {
  const app: Application = express();
  const port = process.env.PORT ?? 3000;

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: [new BullMQAdapter(myQueue)],
    serverAdapter,
  });

  app.use('/ui', serverAdapter.getRouter());

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  app.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
    const job = await addJobToQueue(req.body);
    res.json({ jobId: job.id });
    return next();
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

// eslint-disable-next-line no-console
run().catch((e) => console.error(e));
