import { Job, Queue } from 'bullmq';
import { REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.constants';

export const myQueue = new Queue('my-queue', {
  connection: {
    host: REDIS_QUEUE_HOST,
    port: REDIS_QUEUE_PORT,
  },
});

const DEFAULT_REMOVE_CONFIG = {
  removeOnComplete: {
    age: 3600,
  },
  removeOnFail: {
    age: 24 * 3600,
  },
};

export async function addJobToQueue<T>(data: T): Promise<Job<T>> {
  return myQueue.add('job', data, DEFAULT_REMOVE_CONFIG);
}
