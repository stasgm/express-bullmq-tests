import { Job, Queue } from 'bullmq';
import { QUEUE_NAME, REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.constants';

type DelayJobOption = { runAt?: never; delay?: number } | { runAt?: Date; delay?: never };
type JobOptions = { attempts?: number; priority?: number } & DelayJobOption;
type AddJobToQueue = <T>(data: T, options?: JobOptions) => Promise<Job<T>>;

const getDelayByDate = (runAt: Date): number => {
  const targetTime = new Date(runAt);
  const delayTime = Number(targetTime) - Number(new Date());
  return delayTime > 0 ? delayTime : 0;
};

export const myQueue = new Queue(QUEUE_NAME, {
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

export const addJobToQueue: AddJobToQueue = async (data, options) => {
  return myQueue.add('job', data, {
    attempts: options?.attempts ?? 3,
    delay: options?.runAt ? getDelayByDate(options.runAt) : options?.delay ?? 0,
    backoff: {
      delay: 100,
      type: 'fixed',
    },
    ...DEFAULT_REMOVE_CONFIG,
  });
};
