import { setupServer } from './server';
import { setUpWorker } from './bullmq/worker';

const worker = setUpWorker();

setupServer().catch((e) => {
  console.error(e);
  worker.close(true);
});
