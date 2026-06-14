# TODO Peserta: Lengkapi Kanban Board Task API

Project ini sudah disusun dengan pola MVC:

```text
Request -> Routes -> Controller -> Validator -> Model -> SQLite -> Response JSON
```

Beberapa bagian kode sengaja belum lengkap dan diberi komentar `TODO`. Fokus peserta bukan menghafal nama fungsi, tetapi melengkapi API task agar kontraknya sesuai dokumentasi dan test.

## Target Akhir

Command ini harus lulus:

```bash
npm test
```

Target:

```text
tests 9
pass 9
fail 0
```

## File yang Perlu Dibuka

Buka file ini berurutan:

```text
src/routes/taskRoutes.js
src/controllers/taskController.js
src/validators/taskValidator.js
src/models/taskModel.js
tests/task-api.test.js
docs/API.md
```

Alur sederhananya:

```text
routes
  menentukan endpoint dan HTTP method

controller
  membaca request, memanggil validator/model, lalu mengirim response

validator
  memastikan request body valid sebelum masuk database

model
  menjalankan query SQLite

tests dan docs/API.md
  menjadi kontrak API yang harus dipenuhi
```

## Tugas 1: API List dan Detail Task

Endpoint:

```text
GET /api/tasks
GET /api/tasks/:id
```

Yang harus dibuat:

- `GET /api/tasks` mengambil semua task dari database.
- Task diurutkan berdasarkan `column_id`, `position`, lalu `id`.
- Response list harus berbentuk:

  ```json
  {
    "data": []
  }
  ```

- `GET /api/tasks/:id` mengambil satu task berdasarkan id.
- Jika task tidak ditemukan, return status `404`.

Response task harus berisi data task, column, dan board seperti contoh di `docs/API.md`.

Test yang terkait:

```text
lists and shows tasks
returns not found for an unknown task
```

## Tugas 2: API Create Task dan Validasi Request

Endpoint:

```text
POST /api/tasks
```

Request body yang valid:

```json
{
  "column_id": 1,
  "title": "Create task API",
  "description": "Add simple task CRUD endpoint.",
  "position": 1
}
```

Yang harus dibuat:

- Validasi `column_id` wajib ada saat create.
- `column_id` harus integer dan harus ada di table `columns`.
- Validasi `title` wajib ada, harus string, tidak boleh kosong, dan maksimal 255 karakter.
- `description` boleh string, `null`, atau tidak dikirim.
- `position` boleh tidak dikirim; jika dikirim harus integer minimal `0`.
- Jika validasi gagal, return status `422`.
- Jika berhasil, insert task ke database dan return status `201`.

Response sukses:

```json
{
  "data": {
    "id": 1,
    "column_id": 1,
    "title": "Create task API"
  }
}
```

Response validasi:

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

Test yang terkait:

```text
creates a task
rejects an invalid column id
```

## Tugas 3: API Update dan Pindah Column

Endpoint:

```text
PUT /api/tasks/:id
PATCH /api/tasks/:id
```

Request body contoh:

```json
{
  "column_id": 3,
  "title": "Moved task",
  "position": 2
}
```

Yang harus dibuat:

- Update boleh partial, jadi field yang tidak dikirim tetap memakai data lama.
- `column_id`, `title`, `description`, dan `position` tetap divalidasi jika dikirim.
- `description: null` harus bisa disimpan sebagai `null`.
- Jika task tidak ditemukan, return status `404`.
- Jika berhasil, return task terbaru.

Response sukses:

```json
{
  "data": {
    "id": 1,
    "column_id": 3,
    "title": "Moved task"
  }
}
```

Test yang terkait:

```text
updates and moves a task to another column
```

## Tugas 4: API Delete Task

Endpoint:

```text
DELETE /api/tasks/:id
```

Yang harus dibuat:

- Hapus task berdasarkan id.
- Jika berhasil, return status `204` tanpa body.
- Jika task tidak ditemukan, return status `404`.

Test yang terkait:

```text
deletes a task
returns not found for an unknown task
```

## Aturan Penting

- Jangan ubah file test.
- Jangan ubah bentuk response API.
- Gunakan prepared statement dari `better-sqlite3`.
- Jangan gabungkan input user langsung ke string SQL.
- Gunakan `ApiError` untuk error `404` dan `422`.
- Swagger dan OpenAPI harus tetap bisa dibuka.

## Cara Mengecek

Jalankan:

```bash
npm test
```

Kalau masih gagal, baca nama test yang gagal. Nama test menunjukkan API mana yang belum sesuai.

Checklist akhir:

- `GET /api/tasks` return `200`
- `POST /api/tasks` return `201`
- `GET /api/tasks/:id` return `200` jika task ada
- `PATCH /api/tasks/:id` bisa memindahkan task ke column lain
- `DELETE /api/tasks/:id` return `204`
- Column id tidak valid return `422`
- Task tidak ditemukan return `404`
- `/openapi.json` tetap return dokumen OpenAPI
- `/api-docs` tetap membuka Swagger UI
