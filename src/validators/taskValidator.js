import { ApiError } from '../errors.js';
import { columnExists } from '../models/taskModel.js';

const MAX_TITLE_LENGTH = 255;

export function parseId(rawId) {
  // TODO PESERTA:
  // Lengkapi fungsi ini agar id dari URL seperti "1" berubah menjadi angka 1.
  // Jika id tidak valid, return null.
  throw new Error('TODO: lengkapi parseId');
}

export function validateTaskInput(db, body, { partial = false } = {}) {
  const errors = {};
  const data = {};

  if (partial) {
    validateOptionalColumnId(db, body, errors, data);
    validateOptionalTitle(body, errors, data);
  } else {
    validateRequiredColumnId(db, body, errors, data);
    validateRequiredTitle(body, errors, data);
  }

  validateDescription(body, errors, data);
  validatePosition(body, errors, data);

  if (Object.keys(errors).length > 0) {
    throw new ApiError(422, 'Validation failed.', errors);
  }

  return data;
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
  if (!Number.isInteger(value)) {
    errors.column_id = ['The column id must be an integer.'];
    return;
  }

  if (!columnExists(db, value)) {
    errors.column_id = ['The selected column id is invalid.'];
    return;
  }

  data.column_id = value;
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
  if (typeof value !== 'string') {
    errors.title = ['The title must be a string.'];
    return;
  }

  const title = value.trim();

  if (title.length === 0) {
    errors.title = ['The title field is required.'];
    return;
  }

  if (title.length > MAX_TITLE_LENGTH) {
    errors.title = [`The title may not be greater than ${MAX_TITLE_LENGTH} characters.`];
    return;
  }

  data.title = title;
}

function validateDescription(body, errors, data) {
  if (!Object.hasOwn(body, 'description')) {
    return;
  }

  if (body.description !== null && typeof body.description !== 'string') {
    errors.description = ['The description must be a string.'];
    return;
  }

  data.description = body.description;
}

function validatePosition(body, errors, data) {
  if (!Object.hasOwn(body, 'position')) {
    return;
  }

  if (!Number.isInteger(body.position)) {
    errors.position = ['The position must be an integer.'];
    return;
  }

  if (body.position < 0) {
    errors.position = ['The position must be at least 0.'];
    return;
  }

  data.position = body.position;
}
