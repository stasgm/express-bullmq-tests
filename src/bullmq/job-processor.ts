import { Job } from 'bullmq';

const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t * 1000));

export const jobProcessor = async (job: Job): Promise<{ jobId: string }> => {
  await job.log(`Started processing job with id ${job.id}`);

  console.log(`Job with id ${job.id}`, job.data);

  for (let i = 0; i <= 100; i++) {
    await sleep(Math.random());
    await job.updateProgress(i);
    await job.log(`Processing job at interval ${i}`);

    if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
  }

  await job.updateProgress(100);

  return { jobId: `This is the return value of job (${job.id})` };
};
