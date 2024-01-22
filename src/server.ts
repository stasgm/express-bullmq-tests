import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { addJobToQueue, myQueue } from './bullmq/queue';
import FakeTimers from '@sinonjs/fake-timers';

dotenv.config();

let clock: FakeTimers.InstalledClock;

const addMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() + months);

  return date;
};

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ errors: [{ message: err.message }] });
};

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
    res.send('Hello, cruel World!');
  });

  app.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
    const { data, options } = req.body || {};
    const job = await addJobToQueue(data, options);

    res.json({ jobId: job.id });
  });

  app.get('/fake-timer', async (req: Request, res: Response, next: NextFunction) => {
    res.json({ currentDate: new Date().toISOString() });
  });

  app.post('/fake-timer/reset', async (req: Request, res: Response, next: NextFunction) => {
    if (clock) {
      // clock.uninstall();
      clock.reset();
      res.json({ currentDate: new Date().toISOString() });
    } else {
      try {
        throw new Error('Fake-timer is not installed');
      } catch (err) {
        next(err);
      }
    }
  });

  app.post('/fake-timer', async (req: Request, res: Response, next: NextFunction) => {
    const { months = 1 } = req.body || {};

    const newDate = addMonths(new Date(), months);

    if (!clock) {
      clock = FakeTimers.install({
        toFake: ['Date'],
        now: new Date(),
      });
    }

    clock.setSystemTime(newDate);

    res.json({ currentDate: new Date().toISOString() });
  });

  app.use(globalErrorHandler);

  const port = process.env.PORT ?? 3000;

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[server]: For UI open http://localhost:${port}/ui`);
  });

  return app;
};
