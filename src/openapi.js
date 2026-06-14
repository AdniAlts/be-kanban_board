export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Kanban Board API',
    version: '1.0.0',
    description:
      'Simple task CRUD API for a Kanban board backend handoff demonstration.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'Tasks',
      description: 'CRUD operations for Kanban tasks.',
    },
  ],
  paths: {
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks',
        responses: {
          200: {
            description: 'Task list ordered by column, position, and id.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
              example: {
                column_id: 1,
                title: 'Create task API',
                description: 'Add simple CRUD endpoint',
                position: 1,
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/tasks/{id}': {
      parameters: [{ $ref: '#/components/parameters/TaskId' }],
      get: {
        tags: ['Tasks'],
        summary: 'Get task detail',
        responses: {
          200: {
            description: 'Task detail.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskUpdateInput' },
              example: {
                column_id: 3,
                title: 'Review task API',
                description: 'Move task to review column',
                position: 2,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Task updated.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Partially update task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskUpdateInput' },
              example: {
                column_id: 3,
                title: 'Review task API',
                position: 2,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Task updated.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete task',
        responses: {
          204: {
            description: 'Task deleted.',
          },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
  },
  components: {
    parameters: {
      TaskId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Task id.',
        schema: {
          type: 'integer',
          minimum: 1,
        },
        example: 1,
      },
    },
    responses: {
      ValidationError: {
        description: 'Validation failed.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationError' },
            example: {
              message: 'Validation failed.',
              errors: {
                column_id: ['The selected column id is invalid.'],
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'Task not found.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/NotFoundError' },
            example: {
              message: 'Task not found',
            },
          },
        },
      },
    },
    schemas: {
      Board: {
        type: 'object',
        required: ['id', 'name', 'slug', 'created_at', 'updated_at'],
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Main Board' },
          slug: { type: 'string', example: 'main-board' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
        },
      },
      Column: {
        type: 'object',
        required: [
          'id',
          'board_id',
          'name',
          'slug',
          'position',
          'created_at',
          'updated_at',
          'board',
        ],
        properties: {
          id: { type: 'integer', example: 1 },
          board_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'To-do' },
          slug: { type: 'string', example: 'to-do' },
          position: { type: 'integer', example: 1 },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
          board: { $ref: '#/components/schemas/Board' },
        },
      },
      Task: {
        type: 'object',
        required: [
          'id',
          'column_id',
          'title',
          'description',
          'position',
          'created_at',
          'updated_at',
          'column',
        ],
        properties: {
          id: { type: 'integer', example: 1 },
          column_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Create task API' },
          description: {
            type: ['string', 'null'],
            example: 'Add simple CRUD endpoint',
          },
          position: { type: 'integer', example: 1 },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-14T10:00:00.000Z',
          },
          column: { $ref: '#/components/schemas/Column' },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['column_id', 'title'],
        properties: {
          column_id: {
            type: 'integer',
            description: 'Must exist in columns.id.',
            example: 1,
          },
          title: {
            type: 'string',
            maxLength: 255,
            example: 'Create task API',
          },
          description: {
            type: ['string', 'null'],
            example: 'Add simple CRUD endpoint',
          },
          position: {
            type: 'integer',
            minimum: 0,
            default: 0,
            example: 1,
          },
        },
      },
      TaskUpdateInput: {
        type: 'object',
        minProperties: 1,
        properties: {
          column_id: {
            type: 'integer',
            description: 'Must exist in columns.id.',
            example: 3,
          },
          title: {
            type: 'string',
            maxLength: 255,
            example: 'Review task API',
          },
          description: {
            type: ['string', 'null'],
            example: 'Move task to review column',
          },
          position: {
            type: 'integer',
            minimum: 0,
            example: 2,
          },
        },
      },
      TaskResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/Task' },
        },
      },
      ValidationError: {
        type: 'object',
        required: ['message', 'errors'],
        properties: {
          message: { type: 'string', example: 'Validation failed.' },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
      NotFoundError: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Task not found' },
        },
      },
    },
  },
};
