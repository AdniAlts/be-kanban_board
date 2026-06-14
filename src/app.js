import express from 'express';

import { handleError } from './errors.js';
import { createTaskRouter } from './routes/tasks.js';

export function createApp(db) {
  const app = express();

  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      message: 'Kanban Board API',
      docs: '/docs/API.md',
      endpoints: ['/api/tasks'],
    });
  });

  app.use('/api/tasks', createTaskRouter(db));
  app.use(handleError);

  return app;
}
