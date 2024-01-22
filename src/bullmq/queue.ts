import { Queue } from 'bullmq';
import { DEFAULT_JOB_CONFIG, QUEUE_NAME, REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.constants';
import { getDelayByDate } from './utils';
import { AddJobToQueue } from './types';

export const myQueue = new Queue(QUEUE_NAME, {
  connection: {
    host: REDIS_QUEUE_HOST,
    port: REDIS_QUEUE_PORT,
  },
});

export const addJobToQueue: AddJobToQueue = async (data, options) => {
  return myQueue.add('job', data, {
    attempts: options?.attempts ?? 3,
    priority: options?.priority ?? undefined,
    delay: options?.runAt ? getDelayByDate(options.runAt) : options?.delay ?? 0,
    ...DEFAULT_JOB_CONFIG,
  });
};
