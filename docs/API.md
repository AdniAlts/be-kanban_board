# Kanban Board API Documentation

Base URL:

```text
http://localhost:8000/api
```

## Database Setup

The application uses PostgreSQL. Configure `.env` like this:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kanban_board
DB_USERNAME=postgres
DB_PASSWORD=
```

Run migrations and seed the default board:

```bash
php artisan migrate
php artisan db:seed
```

Seeder creates:

| Table | Data |
| --- | --- |
| `boards` | 1 board: `Main Board` |
| `columns` | `To-do`, `In Progress`, `Review`, `Done` |

There are no CRUD endpoints for boards or columns.

## Task Object

```json
{
    "id": 1,
    "column_id": 1,
    "title": "Create API documentation",
    "description": "Write task endpoint examples",
    "position": 1,
    "created_at": "2026-06-13T10:00:00.000000Z",
    "updated_at": "2026-06-13T10:00:00.000000Z",
    "column": {
        "id": 1,
        "board_id": 1,
        "name": "To-do",
        "slug": "to-do",
        "position": 1,
        "board": {
            "id": 1,
            "name": "Main Board",
            "slug": "main-board"
        }
    }
}
```

## List Tasks

```http
GET /api/tasks
```

Response `200 OK`:

```json
{
    "data": [
        {
            "id": 1,
            "column_id": 1,
            "title": "Create API documentation",
            "description": "Write task endpoint examples",
            "position": 1,
            "created_at": "2026-06-13T10:00:00.000000Z",
            "updated_at": "2026-06-13T10:00:00.000000Z",
            "column": {
                "id": 1,
                "board_id": 1,
                "name": "To-do",
                "slug": "to-do",
                "position": 1,
                "created_at": "2026-06-13T10:00:00.000000Z",
                "updated_at": "2026-06-13T10:00:00.000000Z",
                "board": {
                    "id": 1,
                    "name": "Main Board",
                    "slug": "main-board",
                    "created_at": "2026-06-13T10:00:00.000000Z",
                    "updated_at": "2026-06-13T10:00:00.000000Z"
                }
            }
        }
    ]
}
```

## Create Task

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
    "column_id": 1,
    "title": "Create task API",
    "description": "Add simple CRUD endpoint",
    "position": 1
}
```

Validation:

| Field | Rule |
| --- | --- |
| `column_id` | required, integer, must exist in `columns.id` |
| `title` | required, string, max 255 characters |
| `description` | optional, nullable, string |
| `position` | optional, integer, minimum 0 |

Response `201 Created`:

```json
{
    "data": {
        "column_id": 1,
        "title": "Create task API",
        "description": "Add simple CRUD endpoint",
        "position": 1,
        "id": 1,
        "created_at": "2026-06-13T10:00:00.000000Z",
        "updated_at": "2026-06-13T10:00:00.000000Z",
        "column": {
            "id": 1,
            "board_id": 1,
            "name": "To-do",
            "slug": "to-do",
            "position": 1,
            "board": {
                "id": 1,
                "name": "Main Board",
                "slug": "main-board"
            }
        }
    }
}
```

## Get Task Detail

```http
GET /api/tasks/{task}
```

Response `200 OK`:

```json
{
    "data": {
        "id": 1,
        "column_id": 1,
        "title": "Create task API",
        "description": "Add simple CRUD endpoint",
        "position": 1,
        "created_at": "2026-06-13T10:00:00.000000Z",
        "updated_at": "2026-06-13T10:00:00.000000Z",
        "column": {
            "id": 1,
            "board_id": 1,
            "name": "To-do",
            "slug": "to-do",
            "position": 1,
            "board": {
                "id": 1,
                "name": "Main Board",
                "slug": "main-board"
            }
        }
    }
}
```

If task is not found:

```json
{
    "message": "No query results for model [App\\Models\\Task] 999"
}
```

Status: `404 Not Found`

## Update Task

```http
PUT /api/tasks/{task}
PATCH /api/tasks/{task}
Content-Type: application/json
```

Request body can include one or more fields:

```json
{
    "column_id": 3,
    "title": "Review task API",
    "description": "Move task to review column",
    "position": 2
}
```

Validation:

| Field | Rule |
| --- | --- |
| `column_id` | optional, integer, must exist in `columns.id` |
| `title` | optional, string, max 255 characters |
| `description` | optional, nullable, string |
| `position` | optional, integer, minimum 0 |

Response `200 OK`:

```json
{
    "data": {
        "id": 1,
        "column_id": 3,
        "title": "Review task API",
        "description": "Move task to review column",
        "position": 2,
        "created_at": "2026-06-13T10:00:00.000000Z",
        "updated_at": "2026-06-13T10:10:00.000000Z",
        "column": {
            "id": 3,
            "board_id": 1,
            "name": "Review",
            "slug": "review",
            "position": 3,
            "board": {
                "id": 1,
                "name": "Main Board",
                "slug": "main-board"
            }
        }
    }
}
```

## Delete Task

```http
DELETE /api/tasks/{task}
```

Response:

```text
204 No Content
```

## Validation Error

Example invalid `column_id`:

```json
{
    "column_id": 999,
    "title": "Invalid task"
}
```

Response `422 Unprocessable Entity`:

```json
{
    "message": "The selected column id is invalid.",
    "errors": {
        "column_id": [
            "The selected column id is invalid."
        ]
    }
}
```
