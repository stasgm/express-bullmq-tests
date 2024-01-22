import { Job } from 'bullmq';

export type DelayJobOption = { runAt?: never; delay?: number } | { runAt?: Date; delay?: never };
export type JobOptions = { attempts?: number; priority?: number } & DelayJobOption;
export type AddJobToQueue = <T>(data: T, options?: JobOptions) => Promise<Job<T>>;