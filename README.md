# Kanban Board API

Backend sederhana untuk demonstrasi handoff API Kanban board kepada peserta.
Project ini sengaja dibuat minimal: tidak ada auth, tidak ada dashboard admin, dan tidak ada setup database server.

## Tech Stack

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Swagger UI
- SQLite Viewer

## Setup

Install dependency:

```bash
npm install
```

Jalankan server:

```bash
npm run dev
```

Server berjalan di:

```text
http://localhost:3000
```

Database SQLite akan dibuat otomatis di:

```text
data/kanban.sqlite
```

Seeder juga berjalan otomatis saat server start. Data awal:

| Table | Data |
| --- | --- |
| `boards` | 1 board: `Main Board` |
| `columns` | `To-do`, `In Progress`, `Review`, `Done` |

## API

CRUD hanya tersedia untuk task:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Dokumentasi interaktif tersedia di:

```text
http://localhost:3000/api-docs
```

OpenAPI JSON tersedia di:

```text
http://localhost:3000/openapi.json
```

Ringkasan dokumentasi juga ada di [docs/API.md](docs/API.md).

## SQLite Viewer

Gunakan SQLite Viewer untuk membuka:

```text
data/kanban.sqlite
```

File ini dibuat otomatis setelah menjalankan server atau test.

## Test

Jalankan test:

```bash
npm test
```

Test memakai database SQLite in-memory, jadi tidak mengubah file `data/kanban.sqlite`.
