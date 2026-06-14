import { ApiError } from '../errors.js';
import {
  createTask,
  deleteTask,
  findTask,
  listTasks,
  updateTask,
} from '../models/taskModel.js';
import { parseId, validateTaskInput } from '../validators/taskValidator.js';

export function createTaskController(db) {
  return {
    index(_request, response) {
      // TODO: Ambil semua task dari model, lalu kirim response { data: tasks }.
      throw new Error('TODO: lengkapi controller index');
    },

    store(request, response) {
      // TODO: Validasi request.body, buat task baru, lalu kirim status 201.
      throw new Error('TODO: lengkapi controller store');
    },

    show(request, response) {
      // TODO: Ambil task berdasarkan id. Jika tidak ada, kembalikan 404.
      throw new Error('TODO: lengkapi controller show');
    },

    update(request, response) {
      // TODO: Validasi body secara partial, update task, lalu kirim task terbaru.
      throw new Error('TODO: lengkapi controller update');
    },

    destroy(request, response) {
      // TODO: Hapus task berdasarkan id. Jika berhasil, kirim status 204.
      throw new Error('TODO: lengkapi controller destroy');
    },
  };
}

function getTaskOrFail(db, rawId) {
  // TODO: Parse id, cari task dari model, dan throw ApiError 404 jika kosong.
  throw new Error('TODO: lengkapi helper getTaskOrFail');
}

function getValidIdOrFail(rawId) {
  // TODO: Gunakan parseId. Jika tidak valid, throw ApiError 404.
  throw new Error('TODO: lengkapi helper getValidIdOrFail');
}
