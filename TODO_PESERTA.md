# TODO Peserta: Lengkapi Kanban Board Task API

Project ini adalah backend API sederhana untuk Kanban board. Beberapa kode sengaja belum lengkap dan ditandai dengan `TODO`.

Fokus latihan ini adalah memahami alur API:

```text
Request dari client
-> route memilih controller
-> controller mengatur response
-> validator mengecek request body
-> model menjalankan query database
-> response JSON dikirim kembali ke client
```

## Target Akhir

Jalankan:

```bash
npm test
```

Target akhirnya:

```text
tests 9
pass 9
fail 0
```

## Sebelum Mulai

Install dependency:

```bash
npm install
```

Jalankan test awal:

```bash
npm test
```

Di awal, beberapa test akan gagal. Itu normal karena ada kode `TODO` yang harus dilengkapi.

## File yang Harus Dibaca Dulu

Buka file berikut sebelum mulai coding:

```text
docs/API.md
tests/task-api.test.js
src/routes/taskRoutes.js
```

Yang perlu dipahami:

- `docs/API.md` berisi bentuk endpoint, request, dan response.
- `tests/task-api.test.js` berisi syarat agar tugas dianggap selesai.
- `src/routes/taskRoutes.js` menunjukkan endpoint mana memanggil controller mana.

Jangan ubah file test.

## Alur Folder MVC

```text
src/routes
  daftar URL dan HTTP method

src/controllers
  menerima request dan mengirim response

src/validators
  mengecek input dari client

src/models
  menjalankan query ke database SQLite
```

Saat mengerjakan satu endpoint, biasanya kamu akan membuka 3 file:

```text
src/controllers/taskController.js
src/validators/taskValidator.js
src/models/taskModel.js
```

## Tugas 1: Buat API untuk Melihat Task

Endpoint yang dikerjakan:

```text
GET /api/tasks
GET /api/tasks/:id
```

File yang harus dibuka:

```text
src/controllers/taskController.js
src/models/taskModel.js
src/validators/taskValidator.js
```

Bagian yang dicari:

```text
controller:
- index
- show
- getTaskOrFail
- getValidIdOrFail

model:
- listTasks
- findTask

validator:
- parseId
```

Yang harus dilakukan:

1. Di `parseId`, ubah id dari URL menjadi angka.
2. Jika id bukan angka valid, kembalikan `null`.
3. Di `listTasks`, ambil semua task dari database.
4. Urutkan task berdasarkan `column_id`, `position`, lalu `id`.
5. Di `findTask`, cari satu task berdasarkan id.
6. Jika task tidak ditemukan, return `null`.
7. Di controller `index`, kirim response `{ data: tasks }`.
8. Di controller `show`, kirim response `{ data: task }`.
9. Jika task tidak ditemukan, lempar `ApiError(404, 'Task not found')`.

Response list harus seperti ini:

```json
{
  "data": []
}
```

Response detail harus seperti ini:

```json
{
  "data": {
    "id": 1,
    "column_id": 1,
    "title": "Create task API"
  }
}
```

Test yang harus mulai diperhatikan:

```text
lists and shows tasks
returns not found for an unknown task
```

## Tugas 2: Buat API untuk Menambah Task

Endpoint yang dikerjakan:

```text
POST /api/tasks
```

File yang harus dibuka:

```text
src/controllers/taskController.js
src/validators/taskValidator.js
src/models/taskModel.js
```

Bagian yang dicari:

```text
controller:
- store

validator:
- validateTaskInput
- validateColumnIdValue
- validateTitleValue
- validateDescription
- validatePosition

model:
- createTask
- columnExists
```

Request body contoh:

```json
{
  "column_id": 1,
  "title": "Create task API",
  "description": "Add simple task CRUD endpoint.",
  "position": 1
}
```

Yang harus dilakukan:

1. Di `columnExists`, cek apakah `column_id` ada di table `columns`.
2. Di validator, buat object `errors` untuk menampung pesan error.
3. Validasi `column_id`:
   - wajib ada saat create
   - harus integer
   - harus ada di table `columns`
4. Validasi `title`:
   - wajib ada saat create
   - harus string
   - tidak boleh kosong setelah `trim()`
   - maksimal 255 karakter
5. Validasi `description`:
   - boleh tidak dikirim
   - boleh string
   - boleh `null`
6. Validasi `position`:
   - boleh tidak dikirim
   - jika dikirim harus integer
   - minimal `0`
7. Jika ada error validasi, lempar `ApiError(422, 'Validation failed.', errors)`.
8. Di `createTask`, insert task baru ke table `tasks`.
9. Jika `description` tidak dikirim, simpan `null`.
10. Jika `position` tidak dikirim, simpan `0`.
11. Setelah insert, ambil ulang task lengkap dengan `findTask`.
12. Di controller `store`, return status `201`.

Response sukses harus seperti ini:

```json
{
  "data": {
    "id": 1,
    "column_id": 1,
    "title": "Create task API"
  }
}
```

Response validasi harus seperti ini:

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

Test yang harus mulai diperhatikan:

```text
creates a task
rejects an invalid column id
```

## Tugas 3: Buat API untuk Mengubah Task

Endpoint yang dikerjakan:

```text
PUT /api/tasks/:id
PATCH /api/tasks/:id
```

File yang harus dibuka:

```text
src/controllers/taskController.js
src/validators/taskValidator.js
src/models/taskModel.js
```

Bagian yang dicari:

```text
controller:
- update

validator:
- validateTaskInput

model:
- updateTask
- findTask
```

Request body contoh:

```json
{
  "column_id": 3,
  "title": "Moved task",
  "position": 2
}
```

Yang harus dilakukan:

1. Di controller `update`, ambil id dari `request.params.id`.
2. Validasi id dengan helper yang sama seperti detail task.
3. Validasi body dengan mode partial:

   ```js
   validateTaskInput(db, request.body, { partial: true })
   ```

4. Mode partial artinya field boleh tidak lengkap.
5. Jika field tidak dikirim, pakai data lama dari database.
6. Jika `description` dikirim dengan nilai `null`, simpan `null`.
7. Di `updateTask`, cari task lama dulu.
8. Jika task lama tidak ada, return `null`.
9. Jika ada, jalankan query `UPDATE`.
10. Setelah update, ambil ulang task terbaru dengan `findTask`.
11. Jika controller menerima `null`, lempar `ApiError(404, 'Task not found')`.
12. Jika berhasil, return `{ data: task }`.

Response sukses harus seperti ini:

```json
{
  "data": {
    "id": 1,
    "column_id": 3,
    "title": "Moved task"
  }
}
```

Test yang harus mulai diperhatikan:

```text
updates and moves a task to another column
```

## Tugas 4: Buat API untuk Menghapus Task

Endpoint yang dikerjakan:

```text
DELETE /api/tasks/:id
```

File yang harus dibuka:

```text
src/controllers/taskController.js
src/models/taskModel.js
src/validators/taskValidator.js
```

Bagian yang dicari:

```text
controller:
- destroy
- getValidIdOrFail

model:
- deleteTask

validator:
- parseId
```

Yang harus dilakukan:

1. Di controller `destroy`, ambil id dari URL.
2. Validasi id dengan `getValidIdOrFail`.
3. Di `deleteTask`, hapus task berdasarkan id.
4. Cek hasil delete dari `.changes`.
5. Jika `.changes > 0`, berarti delete berhasil.
6. Jika tidak ada row terhapus, return `false`.
7. Jika controller menerima `false`, lempar `ApiError(404, 'Task not found')`.
8. Jika berhasil, kirim status `204` tanpa body.

Test yang harus mulai diperhatikan:

```text
deletes a task
returns not found for an unknown task
```

## Aturan yang Tidak Boleh Diubah

- Jangan ubah file `tests/task-api.test.js`.
- Jangan ubah bentuk response API.
- Jangan hapus Swagger atau OpenAPI.
- Jangan hardcode task langsung di controller.
- Jangan gabungkan input user langsung ke string SQL.
- Gunakan prepared statement dari `better-sqlite3`.

## Cara Mengecek Setelah Mengerjakan

Jalankan:

```bash
npm test
```

Jika gagal, baca nama test yang gagal.

Contoh:

```text
creates a task
```

Artinya masalah ada di API:

```text
POST /api/tasks
```

Jika error masih bertuliskan `TODO`, berarti bagian itu belum diganti dengan kode.

## Checklist Selesai

Pastikan semua ini sudah benar:

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
