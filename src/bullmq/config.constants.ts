export const REDIS_QUEUE_HOST = process.env.REDIS_QUEUE_HOST ?? 'localhost';
export const REDIS_QUEUE_PORT = process.env.REDIS_QUEUE_PORT ? parseInt(process.env.REDIS_QUEUE_PORT) : 6379;

export const QUEUE_NAME = 'my-queue';

export const DEFAULT_JOB_CONFIG = {
  removeOnComplete: {
    age: 3600,
  },
  removeOnFail: {
    age: 24 * 3600,
  },
  backoff: {
    delay: 100,
    type: 'fixed',
  },
};
