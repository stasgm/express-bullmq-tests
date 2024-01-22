import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { addJobToQueue, myQueue } from './bullmq/queue';

dotenv.config();

export const setupServer = async (): Promise<Application> => {
  const app: Application = express();

  app.use(express.json());

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
    const { data, options } = req.body || {};
    const job = await addJobToQueue(data, options);

    res.json({ jobId: job.id });
    return next();
  });

  const port = process.env.PORT ?? 3000;

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[server]: For UI open http://localhost:${port}/ui`);
  });

  return app;
};
