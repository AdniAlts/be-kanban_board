import { Router } from 'express';

import { createTaskController } from '../controllers/taskController.js';

export function createTaskRouter(db) {
  const router = Router();
  const taskController = createTaskController(db);

  router.get('/', taskController.index);
  router.post('/', taskController.store);
  router.get('/:id', taskController.show);
  router.put('/:id', taskController.update);
  router.patch('/:id', taskController.update);
  router.delete('/:id', taskController.destroy);

  return router;
}
