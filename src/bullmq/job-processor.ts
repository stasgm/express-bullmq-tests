import { Job } from 'bullmq';

export default async (job: Job): Promise<{ jobId: string }> => {
  await job.log(`Started processing job with id ${job.id}`);

  console.log(`Job with id ${job.id}`, job.data);

  const itemCount = job.data.steps || 1;
  const steps = Array(itemCount).fill(0);
  const delay = job.data.delay || 0;

  for await (const [idx, step] of steps.entries()) {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (job.data.fail) {
            return reject(new Error('Failed due to the fail flag'));
          }

          return resolve(`Success: ${step}`);
        }, delay);
      });

      const progressPercent = Math.round((idx + 1) * (1 / itemCount) * 100);
      await job.updateProgress(progressPercent);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed';
      throw new Error(message);
    }
  }

  await job.updateProgress(100);

  return { jobId: `This is the return value of job (${job.id})` };
};
