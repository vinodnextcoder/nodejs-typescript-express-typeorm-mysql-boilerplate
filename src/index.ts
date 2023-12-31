import cluster from 'cluster';
import os from 'os';
import app from './app'; // Update the path to your App file

// const numCPUs = 1;
const port = process.env.PORT || 3000;

if (cluster.isMaster) {
  console.log(`Master process (PID ${process.pid}) is running`);

  const numWorkers = os.cpus().length;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker (PID ${worker.process.pid}) died`);
    // Fork a new worker when one dies to maintain the desired number of workers
    cluster.fork();
  });
} else {
  // This code will run for each worker
  const server = app.listen(port, () => {
    console.log(`Worker (PID ${process.pid}) is running on port ${port}`);
  });

  // Process error handler for the worker
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    process.exit(0);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(0);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('SIGINT signal received. Shutting down gracefully...');
    server.close(() => {
      console.log('Worker closed.');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Shutting down gracefully...');
    server.close(() => {
      console.log('Worker closed.');
      process.exit(0);
    });
  });
}
