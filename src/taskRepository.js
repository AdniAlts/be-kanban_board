const TASK_SELECT = `
  SELECT
    tasks.id,
    tasks.column_id,
    tasks.title,
    tasks.description,
    tasks.position,
    tasks.created_at,
    tasks.updated_at,
    columns.id AS column_id_value,
    columns.board_id AS column_board_id,
    columns.name AS column_name,
    columns.slug AS column_slug,
    columns.position AS column_position,
    columns.created_at AS column_created_at,
    columns.updated_at AS column_updated_at,
    boards.id AS board_id,
    boards.name AS board_name,
    boards.slug AS board_slug,
    boards.created_at AS board_created_at,
    boards.updated_at AS board_updated_at
  FROM tasks
  INNER JOIN columns ON columns.id = tasks.column_id
  INNER JOIN boards ON boards.id = columns.board_id
`;

export function listTasks(db) {
  return db
    .prepare(
      `${TASK_SELECT}
       ORDER BY tasks.column_id ASC, tasks.position ASC, tasks.id ASC`,
    )
    .all()
    .map(toTask);
}

export function findTask(db, id) {
  const row = db.prepare(`${TASK_SELECT} WHERE tasks.id = ?`).get(id);

  return row ? toTask(row) : null;
}

export function createTask(db, taskData) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO tasks (column_id, title, description, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      taskData.column_id,
      taskData.title,
      taskData.description ?? null,
      taskData.position ?? 0,
      now,
      now,
    );

  return findTask(db, result.lastInsertRowid);
}

export function updateTask(db, id, taskData) {
  const current = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!current) {
    return null;
  }

  const nextTask = {
    column_id: taskData.column_id ?? current.column_id,
    title: taskData.title ?? current.title,
    description:
      Object.hasOwn(taskData, 'description') ? taskData.description : current.description,
    position: taskData.position ?? current.position,
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE tasks
     SET column_id = ?, title = ?, description = ?, position = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    nextTask.column_id,
    nextTask.title,
    nextTask.description,
    nextTask.position,
    nextTask.updated_at,
    id,
  );

  return findTask(db, id);
}

export function deleteTask(db, id) {
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
}

export function columnExists(db, columnId) {
  return Boolean(db.prepare('SELECT 1 FROM columns WHERE id = ?').get(columnId));
}

export function getSeedSummary(db) {
  return {
    boards: db.prepare('SELECT COUNT(*) AS total FROM boards').get().total,
    columns: db.prepare('SELECT COUNT(*) AS total FROM columns').get().total,
  };
}

function toTask(row) {
  return {
    id: row.id,
    column_id: row.column_id,
    title: row.title,
    description: row.description,
    position: row.position,
    created_at: row.created_at,
    updated_at: row.updated_at,
    column: {
      id: row.column_id_value,
      board_id: row.column_board_id,
      name: row.column_name,
      slug: row.column_slug,
      position: row.column_position,
      created_at: row.column_created_at,
      updated_at: row.column_updated_at,
      board: {
        id: row.board_id,
        name: row.board_name,
        slug: row.board_slug,
        created_at: row.board_created_at,
        updated_at: row.board_updated_at,
      },
    },
  };
}
