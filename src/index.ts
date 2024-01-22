import { setupServer } from './server';
import { setUpWorker } from './bullmq/worker';
import { myQueue } from './bullmq/queue';

const worker = setUpWorker();

setupServer()
  .then(() => {
    myQueue.resume();
  })
  .catch((e) => {
    console.error(e);
    worker.close(true);
  });
