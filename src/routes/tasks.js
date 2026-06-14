import { Router } from 'express';

import { ApiError } from '../errors.js';
import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../taskRepository.js';
import { parseId, validateTaskInput } from '../validation.js';

export function createTaskRouter(db) {
  const router = Router();

  router.get('/', (_request, response) => {
    response.json({ data: listTasks(db) });
  });

  router.post('/', (request, response) => {
    const taskData = validateTaskInput(db, request.body);
    const task = createTask(db, taskData);

    response.status(201).json({ data: task });
  });

  router.get('/:id', (request, response) => {
    const task = getTaskOrFail(db, request.params.id);

    response.json({ data: task });
  });

  router.put('/:id', (request, response) => {
    const id = getValidIdOrFail(request.params.id);
    const taskData = validateTaskInput(db, request.body, { partial: true });
    const task = updateTask(db, id, taskData);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    response.json({ data: task });
  });

  router.patch('/:id', (request, response) => {
    const id = getValidIdOrFail(request.params.id);
    const taskData = validateTaskInput(db, request.body, { partial: true });
    const task = updateTask(db, id, taskData);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    response.json({ data: task });
  });

  router.delete('/:id', (request, response) => {
    const id = getValidIdOrFail(request.params.id);

    if (!deleteTask(db, id)) {
      throw new ApiError(404, 'Task not found');
    }

    response.status(204).send();
  });

  return router;
}

function getTaskOrFail(db, rawId) {
  const id = getValidIdOrFail(rawId);
  const task = findTask(db, id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
}

function getValidIdOrFail(rawId) {
  const id = parseId(rawId);

  if (!id) {
    throw new ApiError(404, 'Task not found');
  }

  return id;
}
