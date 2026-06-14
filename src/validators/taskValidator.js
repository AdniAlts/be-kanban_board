import { ApiError } from '../errors.js';
import { columnExists } from '../models/taskModel.js';

const MAX_TITLE_LENGTH = 255;

export function parseId(rawId) {
  // TODO: Parse rawId menjadi integer positif. Return null jika tidak valid.
  throw new Error('TODO: lengkapi parseId');
}

export function validateTaskInput(db, body, { partial = false } = {}) {
  // TODO: Jalankan validasi input. Jika ada error, throw ApiError 422.
  throw new Error('TODO: lengkapi validateTaskInput');
}

function validateRequiredColumnId(db, body, errors, data) {
  if (!Object.hasOwn(body, 'column_id')) {
    errors.column_id = ['The column id field is required.'];
    return;
  }

  validateColumnIdValue(db, body.column_id, errors, data);
}

function validateOptionalColumnId(db, body, errors, data) {
  if (Object.hasOwn(body, 'column_id')) {
    validateColumnIdValue(db, body.column_id, errors, data);
  }
}

function validateColumnIdValue(db, value, errors, data) {
  // TODO: Pastikan value integer dan id column ada di database.
  throw new Error('TODO: lengkapi validateColumnIdValue');
}

function validateRequiredTitle(body, errors, data) {
  if (!Object.hasOwn(body, 'title')) {
    errors.title = ['The title field is required.'];
    return;
  }

  validateTitleValue(body.title, errors, data);
}

function validateOptionalTitle(body, errors, data) {
  if (Object.hasOwn(body, 'title')) {
    validateTitleValue(body.title, errors, data);
  }
}

function validateTitleValue(value, errors, data) {
  // TODO: Pastikan title string, tidak kosong, dan maksimal MAX_TITLE_LENGTH.
  throw new Error('TODO: lengkapi validateTitleValue');
}

function validateDescription(body, errors, data) {
  // TODO: Jika dikirim, description harus string atau null.
  throw new Error('TODO: lengkapi validateDescription');
}

function validatePosition(body, errors, data) {
  // TODO: Jika dikirim, position harus integer dan minimal 0.
  throw new Error('TODO: lengkapi validatePosition');
}
