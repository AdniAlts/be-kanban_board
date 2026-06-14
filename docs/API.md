# Kanban Board API Documentation

Base URL:

```text
http://localhost:3000
```

## Interactive Documentation

Open Swagger UI in the browser:

```text
http://localhost:3000/api-docs
```

OpenAPI JSON:

```text
http://localhost:3000/openapi.json
```

Use Swagger UI to read the endpoint contract and run requests directly from the browser.

## Database

Project uses SQLite through `better-sqlite3`.

Default database file:

```text
data/kanban.sqlite
```

The database schema and seed data are created automatically when the server starts.

Seeder creates:

| Table | Data |
| --- | --- |
| `boards` | 1 board: `Main Board` |
| `columns` | `To-do`, `In Progress`, `Review`, `Done` |

There are no CRUD endpoints for boards or columns.

## Task Endpoints

CRUD is only available for tasks:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{id}
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}
DELETE /api/tasks/{id}
```

## Response Shape

Success responses use a `data` wrapper:

```json
{
  "data": {
    "id": 1,
    "column_id": 1,
    "title": "Create task API",
    "description": "Add simple CRUD endpoint",
    "position": 1,
    "created_at": "2026-06-14T10:00:00.000Z",
    "updated_at": "2026-06-14T10:00:00.000Z",
    "column": {
      "id": 1,
      "board_id": 1,
      "name": "To-do",
      "slug": "to-do",
      "position": 1,
      "created_at": "2026-06-14T10:00:00.000Z",
      "updated_at": "2026-06-14T10:00:00.000Z",
      "board": {
        "id": 1,
        "name": "Main Board",
        "slug": "main-board",
        "created_at": "2026-06-14T10:00:00.000Z",
        "updated_at": "2026-06-14T10:00:00.000Z"
      }
    }
  }
}
```

Validation errors use status `422`:

```json
{
  "message": "Validation failed.",
  "errors": {
    "column_id": [
      "The selected column id is invalid."
    ]
  }
}
```

Missing tasks use status `404`:

```json
{
  "message": "Task not found"
}
```
