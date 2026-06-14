import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { handleError } from './errors.js';
import { openApiDocument } from './openapi.js';
import { createTaskRouter } from './routes/taskRoutes.js';

export function createApp(db) {
  const app = express();

  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      message: 'Kanban Board API',
      docs: '/api-docs',
      openapi: '/openapi.json',
      endpoints: ['/api/tasks'],
    });
  });

  app.get('/openapi.json', (_request, response) => {
    response.json(openApiDocument);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use('/api/tasks', createTaskRouter(db));
  app.use(handleError);

  return app;
}
