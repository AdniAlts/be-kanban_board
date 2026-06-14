# TODO Peserta: Lengkapi Kanban Board Task API

Project ini adalah backend API sederhana untuk Kanban board. Beberapa bagian kode sengaja belum lengkap dan ditandai dengan `TODO`.

Latihan ini fokus pada API task:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Target akhir:

```bash
npm test
```

Harus menghasilkan:

```text
tests 9
pass 9
fail 0
```

## Cara Pakai Panduan Ini

Setiap tugas di bawah berisi:

- file yang harus dibuka
- bagian kode yang harus diganti
- syntax yang bisa dicopy
- penjelasan singkat fungsi kode tersebut

Jangan ubah file ini:

```text
tests/task-api.test.js
```

File test adalah pemeriksa apakah API sudah benar.

## Alur MVC Singkat

```text
routes
  memilih controller berdasarkan URL dan HTTP method

controller
  membaca request, memanggil validator/model, lalu mengirim response

validator
  mengecek input dari client

model
  menjalankan query SQLite
```

## Tugas 1: Lengkapi Validator

File yang dibuka:

```text
src/validators/taskValidator.js
```

Validator bertugas memastikan data dari client aman dan sesuai aturan sebelum masuk database.

### 1A. Ganti `parseId`

Cari:

```js
export function parseId(rawId) {
  // TODO: Parse rawId menjadi integer positif. Return null jika tidak valid.
  throw new Error('TODO: lengkapi parseId');
}
```

Ganti dengan:

```js
export function parseId(rawId) {
  const id = Number.parseInt(rawId, 10);

  return Number.isInteger(id) && id > 0 ? id : null;
}
```

Fungsinya:

- Mengubah id dari URL, misalnya `"1"`, menjadi angka `1`.
- Jika id tidak valid, function mengembalikan `null`.
- Ini dipakai untuk endpoint seperti `GET /api/tasks/:id`.

### 1B. Ganti `validateTaskInput`

Cari:

```js
export function validateTaskInput(db, body, { partial = false } = {}) {
  // TODO: Jalankan validasi input. Jika ada error, throw ApiError 422.
  throw new Error('TODO: lengkapi validateTaskInput');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- `errors` menyimpan pesan error validasi.
- `data` menyimpan data yang sudah valid.
- `partial = false` dipakai saat create task, jadi `column_id` dan `title` wajib ada.
- `partial = true` dipakai saat update task, jadi field boleh tidak lengkap.
- Jika ada error, API mengembalikan status `422`.

### 1C. Ganti `validateColumnIdValue`

Cari:

```js
function validateColumnIdValue(db, value, errors, data) {
  // TODO: Pastikan value integer dan id column ada di database.
  throw new Error('TODO: lengkapi validateColumnIdValue');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- Memastikan `column_id` berupa angka integer.
- Memastikan column tersebut benar-benar ada di database.
- Jika valid, nilai disimpan ke `data.column_id`.

### 1D. Ganti `validateTitleValue`

Cari:

```js
function validateTitleValue(value, errors, data) {
  // TODO: Pastikan title string, tidak kosong, dan maksimal MAX_TITLE_LENGTH.
  throw new Error('TODO: lengkapi validateTitleValue');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- Memastikan `title` adalah string.
- Menghapus spasi depan/belakang dengan `trim()`.
- Menolak title kosong.
- Menolak title yang terlalu panjang.
- Jika valid, title yang sudah rapi disimpan ke `data.title`.

### 1E. Ganti `validateDescription`

Cari:

```js
function validateDescription(body, errors, data) {
  // TODO: Jika dikirim, description harus string atau null.
  throw new Error('TODO: lengkapi validateDescription');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- `description` boleh tidak dikirim.
- Jika dikirim, nilainya harus string atau `null`.
- `Object.hasOwn` dipakai agar `description: null` tetap terbaca sebagai input valid.

### 1F. Ganti `validatePosition`

Cari:

```js
function validatePosition(body, errors, data) {
  // TODO: Jika dikirim, position harus integer dan minimal 0.
  throw new Error('TODO: lengkapi validatePosition');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- `position` boleh tidak dikirim.
- Jika dikirim, harus integer.
- Nilainya tidak boleh kurang dari `0`.

## Tugas 2: Lengkapi Model

File yang dibuka:

```text
src/models/taskModel.js
```

Model bertugas membaca dan menulis data ke database SQLite.

### 2A. Ganti `listTasks`

Cari:

```js
export function listTasks(db) {
  // TODO: Ambil semua task, join columns dan boards, urutkan berdasarkan column, position, id.
  throw new Error('TODO: lengkapi model listTasks');
}
```

Ganti dengan:

```js
export function listTasks(db) {
  return db
    .prepare(
      `${TASK_SELECT}
       ORDER BY tasks.column_id ASC, tasks.position ASC, tasks.id ASC`,
    )
    .all()
    .map(toTask);
}
```

Fungsinya:

- Mengambil semua task dari database.
- Mengurutkan task agar rapi sesuai column dan posisi.
- `.map(toTask)` mengubah hasil query database menjadi response object API.

### 2B. Ganti `findTask`

Cari:

```js
export function findTask(db, id) {
  // TODO: Cari satu task berdasarkan id. Return null jika tidak ditemukan.
  throw new Error('TODO: lengkapi model findTask');
}
```

Ganti dengan:

```js
export function findTask(db, id) {
  const row = db.prepare(`${TASK_SELECT} WHERE tasks.id = ?`).get(id);

  return row ? toTask(row) : null;
}
```

Fungsinya:

- Mencari satu task berdasarkan id.
- Tanda `?` adalah placeholder prepared statement agar input user tidak langsung digabung ke SQL.
- Jika tidak ada task, return `null`.

### 2C. Ganti `createTask`

Cari:

```js
export function createTask(db, taskData) {
  // TODO: Insert task baru, lalu return task lengkap dari findTask.
  throw new Error('TODO: lengkapi model createTask');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- Membuat timestamp `created_at` dan `updated_at`.
- Menyimpan task baru ke table `tasks`.
- Jika `description` kosong, simpan `null`.
- Jika `position` kosong, simpan `0`.
- Setelah insert, ambil ulang task agar response berisi column dan board.

### 2D. Ganti `updateTask`

Cari:

```js
export function updateTask(db, id, taskData) {
  // TODO: Ambil data lama, gabungkan dengan input baru, update row, lalu return task terbaru.
  throw new Error('TODO: lengkapi model updateTask');
}
```

Ganti dengan:

```js
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
```

Fungsinya:

- Mengambil data lama terlebih dahulu.
- Jika task tidak ada, return `null`.
- Field yang tidak dikirim memakai data lama.
- `description` dicek dengan `Object.hasOwn` agar `description: null` tetap bisa disimpan.
- Setelah update, ambil ulang task terbaru.

### 2E. Ganti `deleteTask`

Cari:

```js
export function deleteTask(db, id) {
  // TODO: Hapus task berdasarkan id. Return true jika ada row yang terhapus.
  throw new Error('TODO: lengkapi model deleteTask');
}
```

Ganti dengan:

```js
export function deleteTask(db, id) {
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
}
```

Fungsinya:

- Menghapus task berdasarkan id.
- `.changes > 0` berarti ada row yang berhasil dihapus.
- Jika tidak ada row terhapus, hasilnya `false`.

### 2F. Ganti `columnExists`

Cari:

```js
export function columnExists(db, columnId) {
  // TODO: Cek apakah column dengan id tersebut ada.
  throw new Error('TODO: lengkapi model columnExists');
}
```

Ganti dengan:

```js
export function columnExists(db, columnId) {
  return Boolean(db.prepare('SELECT 1 FROM columns WHERE id = ?').get(columnId));
}
```

Fungsinya:

- Mengecek apakah column tujuan task ada.
- Dipakai saat validasi `column_id`.

## Tugas 3: Lengkapi Controller

File yang dibuka:

```text
src/controllers/taskController.js
```

Controller bertugas menghubungkan request API dengan validator dan model.

### 3A. Ganti `index`

Cari:

```js
index(_request, response) {
  // TODO: Ambil semua task dari model, lalu kirim response { data: tasks }.
  throw new Error('TODO: lengkapi controller index');
},
```

Ganti dengan:

```js
index(_request, response) {
  response.json({ data: listTasks(db) });
},
```

Fungsinya:

- Menangani `GET /api/tasks`.
- Mengirim semua task dalam format `{ data: [...] }`.

### 3B. Ganti `store`

Cari:

```js
store(request, response) {
  // TODO: Validasi request.body, buat task baru, lalu kirim status 201.
  throw new Error('TODO: lengkapi controller store');
},
```

Ganti dengan:

```js
store(request, response) {
  const taskData = validateTaskInput(db, request.body);
  const task = createTask(db, taskData);

  response.status(201).json({ data: task });
},
```

Fungsinya:

- Menangani `POST /api/tasks`.
- Memvalidasi request body.
- Membuat task baru.
- Mengirim status `201 Created`.

### 3C. Ganti `show`

Cari:

```js
show(request, response) {
  // TODO: Ambil task berdasarkan id. Jika tidak ada, kembalikan 404.
  throw new Error('TODO: lengkapi controller show');
},
```

Ganti dengan:

```js
show(request, response) {
  const task = getTaskOrFail(db, request.params.id);

  response.json({ data: task });
},
```

Fungsinya:

- Menangani `GET /api/tasks/:id`.
- Jika task ada, response berisi `{ data: task }`.
- Jika task tidak ada, helper akan melempar error `404`.

### 3D. Ganti `update`

Cari:

```js
update(request, response) {
  // TODO: Validasi body secara partial, update task, lalu kirim task terbaru.
  throw new Error('TODO: lengkapi controller update');
},
```

Ganti dengan:

```js
update(request, response) {
  const id = getValidIdOrFail(request.params.id);
  const taskData = validateTaskInput(db, request.body, { partial: true });
  const task = updateTask(db, id, taskData);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  response.json({ data: task });
},
```

Fungsinya:

- Menangani `PUT /api/tasks/:id` dan `PATCH /api/tasks/:id`.
- `partial: true` berarti body boleh tidak lengkap.
- Jika task tidak ditemukan, API mengembalikan `404`.

### 3E. Ganti `destroy`

Cari:

```js
destroy(request, response) {
  // TODO: Hapus task berdasarkan id. Jika berhasil, kirim status 204.
  throw new Error('TODO: lengkapi controller destroy');
},
```

Ganti dengan:

```js
destroy(request, response) {
  const id = getValidIdOrFail(request.params.id);

  if (!deleteTask(db, id)) {
    throw new ApiError(404, 'Task not found');
  }

  response.status(204).send();
},
```

Fungsinya:

- Menangani `DELETE /api/tasks/:id`.
- Jika berhasil, mengirim status `204 No Content`.
- Jika task tidak ditemukan, mengirim `404`.

### 3F. Ganti `getTaskOrFail`

Cari:

```js
function getTaskOrFail(db, rawId) {
  // TODO: Parse id, cari task dari model, dan throw ApiError 404 jika kosong.
  throw new Error('TODO: lengkapi helper getTaskOrFail');
}
```

Ganti dengan:

```js
function getTaskOrFail(db, rawId) {
  const id = getValidIdOrFail(rawId);
  const task = findTask(db, id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
}
```

Fungsinya:

- Mengambil task berdasarkan id.
- Jika id tidak valid atau task tidak ada, API mengembalikan `404`.

### 3G. Ganti `getValidIdOrFail`

Cari:

```js
function getValidIdOrFail(rawId) {
  // TODO: Gunakan parseId. Jika tidak valid, throw ApiError 404.
  throw new Error('TODO: lengkapi helper getValidIdOrFail');
}
```

Ganti dengan:

```js
function getValidIdOrFail(rawId) {
  const id = parseId(rawId);

  if (!id) {
    throw new ApiError(404, 'Task not found');
  }

  return id;
}
```

Fungsinya:

- Memastikan id dari URL valid.
- Jika tidak valid, API mengembalikan `404`.

## Urutan Pengerjaan yang Disarankan

Kerjakan dengan urutan ini agar error lebih mudah dipahami:

```text
1. src/validators/taskValidator.js
2. src/models/taskModel.js
3. src/controllers/taskController.js
4. npm test
```

Jika test masih gagal, lihat nama test yang gagal.

Contoh:

```text
creates a task
```

Artinya cek endpoint:

```text
POST /api/tasks
```

## Checklist Akhir

Pastikan semua ini benar:

- `GET /api/tasks` return status `200`
- `POST /api/tasks` return status `201`
- `GET /api/tasks/:id` return status `200` jika task ada
- `PATCH /api/tasks/:id` bisa memindahkan task ke column lain
- `DELETE /api/tasks/:id` return status `204`
- Column id tidak valid return status `422`
- Task tidak ditemukan return status `404`
- `/openapi.json` tetap bisa dibuka
- `/api-docs` tetap bisa dibuka
- `npm test` lulus semua
