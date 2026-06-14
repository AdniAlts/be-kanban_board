import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import { DATABASE_PATH } from './config.js';

const DEFAULT_BOARD = {
  name: 'Main Board',
  slug: 'main-board',
};

const DEFAULT_COLUMNS = [
  { name: 'To-do', slug: 'to-do', position: 1 },
  { name: 'In Progress', slug: 'in-progress', position: 2 },
  { name: 'Review', slug: 'review', position: 3 },
  { name: 'Done', slug: 'done', position: 4 },
];

export function createDatabase(databasePath = DATABASE_PATH) {
  if (databasePath !== ':memory:') {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  migrate(db);
  seed(db);

  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS columns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (board_id, slug),
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      column_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
    );
  `);
}

function seed(db) {
  const now = new Date().toISOString();

  const existingBoard = db
    .prepare('SELECT id FROM boards WHERE slug = ?')
    .get(DEFAULT_BOARD.slug);

  const boardId =
    existingBoard?.id ??
    db
      .prepare(
        'INSERT INTO boards (name, slug, created_at, updated_at) VALUES (?, ?, ?, ?)',
      )
      .run(DEFAULT_BOARD.name, DEFAULT_BOARD.slug, now, now).lastInsertRowid;

  const insertColumn = db.prepare(`
    INSERT INTO columns (board_id, name, slug, position, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(board_id, slug) DO UPDATE SET
      name = excluded.name,
      position = excluded.position,
      updated_at = excluded.updated_at
  `);

  for (const column of DEFAULT_COLUMNS) {
    insertColumn.run(
      boardId,
      column.name,
      column.slug,
      column.position,
      now,
      now,
    );
  }
}
