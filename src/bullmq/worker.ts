import { Job, Worker } from 'bullmq';
import { REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.constants';
import path from 'path';

let worker: Worker;
const processorPath = path.join(__dirname, 'job-processor.js');

export function setUpWorker(): void {
  worker = new Worker('my-queue', processorPath, {
    connection: {
      host: REDIS_QUEUE_HOST,
      port: REDIS_QUEUE_PORT,
    },
    autorun: true,
  });

  worker.on('completed', (job: Job, returnvalue: 'DONE') => {
    console.debug(`Completed job with id ${job.id}`, returnvalue);
  });

  worker.on('active', (job: Job<unknown>) => {
    console.debug(`Completed job with id ${job.id}`);
  });
  worker.on('error', (failedReason: Error) => {
    console.error(`Job encountered an error`, failedReason);
  });
}
