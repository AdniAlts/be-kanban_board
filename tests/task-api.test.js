import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { createApp } from '../src/app.js';
import { createDatabase } from '../src/db.js';
import { getSeedSummary } from '../src/models/boardModel.js';

describe('task API', () => {
  let db;
  let server;
  let baseUrl;

  before(async () => {
    db = createDatabase(':memory:');
    server = createApp(db).listen(0);

    await new Promise((resolve) => {
      server.once('listening', resolve);
    });

    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    db.close();
  });

  it('seeds one board with four columns', () => {
    assert.deepEqual(getSeedSummary(db), {
      boards: 1,
      columns: 4,
    });
  });

  it('creates a task', async () => {
    const response = await request('/api/tasks', {
      method: 'POST',
      body: {
        column_id: 1,
        title: 'Create task API',
        description: 'Add simple task CRUD endpoint.',
        position: 1,
      },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.data.title, 'Create task API');
    assert.equal(response.body.data.column.slug, 'to-do');
  });

  it('lists and shows tasks', async () => {
    const listResponse = await request('/api/tasks');

    assert.equal(listResponse.status, 200);
    assert.ok(listResponse.body.data.length >= 1);

    const taskId = listResponse.body.data[0].id;
    const showResponse = await request(`/api/tasks/${taskId}`);

    assert.equal(showResponse.status, 200);
    assert.equal(showResponse.body.data.id, taskId);
  });

  it('updates and moves a task to another column', async () => {
    const createResponse = await request('/api/tasks', {
      method: 'POST',
      body: {
        column_id: 1,
        title: 'Move task',
        position: 1,
      },
    });
    const taskId = createResponse.body.data.id;

    const updateResponse = await request(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: {
        column_id: 3,
        title: 'Moved task',
        position: 2,
      },
    });

    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.data.title, 'Moved task');
    assert.equal(updateResponse.body.data.column.slug, 'review');
  });

  it('deletes a task', async () => {
    const createResponse = await request('/api/tasks', {
      method: 'POST',
      body: {
        column_id: 4,
        title: 'Delete task API',
      },
    });
    const taskId = createResponse.body.data.id;

    const deleteResponse = await request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const showResponse = await request(`/api/tasks/${taskId}`);

    assert.equal(deleteResponse.status, 204);
    assert.equal(showResponse.status, 404);
  });

  it('rejects an invalid column id', async () => {
    const response = await request('/api/tasks', {
      method: 'POST',
      body: {
        column_id: 999,
        title: 'Invalid column task',
      },
    });

    assert.equal(response.status, 422);
    assert.deepEqual(response.body.errors.column_id, [
      'The selected column id is invalid.',
    ]);
  });

  it('returns not found for an unknown task', async () => {
    const response = await request('/api/tasks/999999');

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Task not found');
  });

  it('serves the OpenAPI document', async () => {
    const response = await request('/openapi.json');

    assert.equal(response.status, 200);
    assert.equal(response.body.openapi, '3.1.0');
    assert.ok(response.body.paths['/api/tasks']);
    assert.ok(response.body.paths['/api/tasks/{id}']);
  });

  it('serves Swagger UI', async () => {
    const response = await request('/api-docs/', {
      parseJson: false,
    });

    assert.equal(response.status, 200);
    assert.match(response.body, /Swagger UI/i);
  });

  async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();

    return {
      status: response.status,
      body: options.parseJson === false ? text : text ? JSON.parse(text) : null,
    };
  }
});
