import { Job, Worker } from 'bullmq';
import { QUEUE_NAME, REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.constants';
import path from 'node:path';

export const setUpWorker = (): Worker => {
  const processorFile = path.join(__dirname, 'job-processor.ts');

  const worker = new Worker(QUEUE_NAME, processorFile, {
    connection: {
      host: REDIS_QUEUE_HOST,
      port: REDIS_QUEUE_PORT,
    },
    autorun: true,
    useWorkerThreads: true,
    concurrency: 2,
  });

  worker.on('ready', () => console.log('Worker is listening'));

  worker.on('completed', (job: Job) => {
    console.debug(`Completed job with id ${job.id}`, 'DONE');
  });

  worker.on('active', (job: Job) => {
    console.debug(`Active job with id ${job.id}`);
  });

  worker.on('error', (failedReason: Error) => {
    console.error(`Job encountered an error`, failedReason);
  });

  worker.on('stalled', (jobId) => {
    console.error(`Stalled Job ${jobId}`);
  });

  worker.on('failed', (job, error: Error, prev: string) => {
    console.error(`Job ${job?.id} failed ${error}`, prev);
  });

  return worker;
};
