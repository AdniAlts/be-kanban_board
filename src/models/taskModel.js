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
  // TODO: Ambil semua task, join columns dan boards, urutkan berdasarkan column, position, id.
  throw new Error('TODO: lengkapi model listTasks');
}

export function findTask(db, id) {
  // TODO: Cari satu task berdasarkan id. Return null jika tidak ditemukan.
  throw new Error('TODO: lengkapi model findTask');
}

export function createTask(db, taskData) {
  // TODO: Insert task baru, lalu return task lengkap dari findTask.
  throw new Error('TODO: lengkapi model createTask');
}

export function updateTask(db, id, taskData) {
  // TODO: Ambil data lama, gabungkan dengan input baru, update row, lalu return task terbaru.
  throw new Error('TODO: lengkapi model updateTask');
}

export function deleteTask(db, id) {
  // TODO: Hapus task berdasarkan id. Return true jika ada row yang terhapus.
  throw new Error('TODO: lengkapi model deleteTask');
}

export function columnExists(db, columnId) {
  // TODO: Cek apakah column dengan id tersebut ada.
  throw new Error('TODO: lengkapi model columnExists');
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
