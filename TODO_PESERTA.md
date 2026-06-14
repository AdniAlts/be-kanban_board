# TODO Peserta: Lengkapi Kanban Board API MVC

Project ini sudah disusun dengan pola MVC:

```text
Request -> Routes -> Controller -> Validator -> Model -> SQLite
```

Beberapa bagian kode sengaja belum lengkap dan diberi komentar `TODO`. Tugas peserta adalah melengkapi bagian tersebut sampai semua test lulus.

## Target Akhir

Command ini harus lulus:

```bash
npm test
```

Target akhir:

```text
tests 9
pass 9
fail 0
```

## Urutan Pengerjaan

Kerjakan dari bawah ke atas: mulai dari helper kecil, lanjut model database, validator, lalu controller.

Urutan yang disarankan:

```text
1. Validator: parseId
2. Model: columnExists
3. Validator: validateTaskInput dan helper validasi
4. Model: listTasks dan findTask
5. Model: createTask
6. Model: updateTask
7. Model: deleteTask
8. Controller: index, store, show, update, destroy
9. Jalankan npm test
```

## Step 1: Jalankan Project dan Test Awal

Install dependency:

```bash
npm install
```

Jalankan test:

```bash
npm test
```

Di awal, beberapa test akan gagal karena controller, validator, dan model masih berisi `TODO`.

Jangan ubah file test. Test adalah petunjuk apakah implementasi sudah benar.

## Step 2: Pahami Alur File

Buka file berikut berurutan:

```text
src/app.js
src/routes/taskRoutes.js
src/controllers/taskController.js
src/validators/taskValidator.js
src/models/taskModel.js
src/db.js
tests/task-api.test.js
```

Alurnya:

```text
src/app.js
  memasang route /api/tasks

src/routes/taskRoutes.js
  menghubungkan HTTP method ke controller

src/controllers/taskController.js
  membaca request, memanggil validator/model, mengirim response

src/validators/taskValidator.js
  memastikan input dari client valid

src/models/taskModel.js
  membaca dan menulis data ke SQLite

src/db.js
  membuat table boards, columns, tasks, dan seed data awal
```

## Step 3: Lengkapi `parseId`

File:

```text
src/validators/taskValidator.js
```

Fungsi:

```js
parseId(rawId)
```

Yang harus dilakukan:

1. Ubah `rawId` menjadi integer dengan `Number.parseInt(rawId, 10)`.
2. Jika hasilnya integer dan lebih dari `0`, return id.
3. Jika tidak valid, return `null`.

Fungsi ini dipakai controller untuk menentukan apakah `:id` valid.

## Step 4: Lengkapi `columnExists`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
columnExists(db, columnId)
```

Yang harus dilakukan:

1. Query table `columns`.
2. Cari row dengan `id = columnId`.
3. Gunakan prepared statement.
4. Return `true` jika ada, `false` jika tidak ada.

Contoh query yang dibutuhkan:

```sql
SELECT 1 FROM columns WHERE id = ?
```

Fungsi ini dipakai validator untuk memastikan task hanya bisa dibuat di column yang sudah ada.

## Step 5: Lengkapi `validateTaskInput`

File:

```text
src/validators/taskValidator.js
```

Fungsi:

```js
validateTaskInput(db, body, { partial = false } = {})
```

Yang harus dilakukan:

1. Buat object `errors = {}`.
2. Buat object `data = {}`.
3. Jika `partial === false`, jalankan validasi wajib untuk `column_id` dan `title`.
4. Jika `partial === true`, validasi `column_id` dan `title` hanya jika field tersebut dikirim.
5. Selalu validasi `description` dan `position` jika field tersebut dikirim.
6. Jika `errors` tidak kosong, lempar `ApiError(422, 'Validation failed.', errors)`.
7. Jika valid, return `data`.

Create task memakai `partial = false`.

Update task memakai `partial = true`.

## Step 6: Lengkapi Validasi Field

File:

```text
src/validators/taskValidator.js
```

### `validateColumnIdValue`

Aturan:

1. `column_id` harus integer.
2. `column_id` harus ada di table `columns`.
3. Jika valid, simpan ke `data.column_id`.

Pesan error yang harus dipakai:

```js
errors.column_id = ['The column id must be an integer.'];
errors.column_id = ['The selected column id is invalid.'];
```

### `validateTitleValue`

Aturan:

1. `title` harus string.
2. `title.trim()` tidak boleh kosong.
3. Panjang title maksimal `MAX_TITLE_LENGTH`.
4. Jika valid, simpan title yang sudah di-`trim()` ke `data.title`.

Pesan error yang harus dipakai:

```js
errors.title = ['The title must be a string.'];
errors.title = ['The title field is required.'];
errors.title = [`The title may not be greater than ${MAX_TITLE_LENGTH} characters.`];
```

### `validateDescription`

Aturan:

1. Jika `description` tidak dikirim, tidak perlu melakukan apa-apa.
2. Jika dikirim, nilainya harus string atau `null`.
3. Jika valid, simpan ke `data.description`.

Pesan error yang harus dipakai:

```js
errors.description = ['The description must be a string.'];
```

### `validatePosition`

Aturan:

1. Jika `position` tidak dikirim, tidak perlu melakukan apa-apa.
2. Jika dikirim, nilainya harus integer.
3. Nilainya minimal `0`.
4. Jika valid, simpan ke `data.position`.

Pesan error yang harus dipakai:

```js
errors.position = ['The position must be an integer.'];
errors.position = ['The position must be at least 0.'];
```

## Step 7: Lengkapi `listTasks`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
listTasks(db)
```

Yang harus dilakukan:

1. Gunakan constant `TASK_SELECT` yang sudah disediakan.
2. Tambahkan `ORDER BY tasks.column_id ASC, tasks.position ASC, tasks.id ASC`.
3. Ambil semua row dengan `.all()`.
4. Ubah setiap row menjadi object task dengan `.map(toTask)`.

Response list task harus berbentuk array task lengkap, termasuk `column` dan `board`.

## Step 8: Lengkapi `findTask`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
findTask(db, id)
```

Yang harus dilakukan:

1. Gunakan `TASK_SELECT`.
2. Tambahkan filter `WHERE tasks.id = ?`.
3. Ambil satu row dengan `.get(id)`.
4. Jika row ada, return `toTask(row)`.
5. Jika tidak ada, return `null`.

Fungsi ini dipakai oleh detail task, create task, dan update task.

## Step 9: Lengkapi `createTask`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
createTask(db, taskData)
```

Yang harus dilakukan:

1. Buat timestamp dengan `new Date().toISOString()`.
2. Insert ke table `tasks`.
3. Field yang diisi: `column_id`, `title`, `description`, `position`, `created_at`, `updated_at`.
4. Jika `description` tidak dikirim, simpan `null`.
5. Jika `position` tidak dikirim, simpan `0`.
6. Ambil `lastInsertRowid` dari hasil insert.
7. Return `findTask(db, result.lastInsertRowid)`.

Gunakan prepared statement. Jangan membuat SQL dengan menggabungkan input user langsung ke string.

## Step 10: Lengkapi `updateTask`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
updateTask(db, id, taskData)
```

Yang harus dilakukan:

1. Cari task lama dengan query `SELECT * FROM tasks WHERE id = ?`.
2. Jika tidak ditemukan, return `null`.
3. Buat object `nextTask`.
4. Untuk `column_id`, `title`, dan `position`, pakai data baru jika dikirim; jika tidak, pakai data lama.
5. Untuk `description`, cek dengan `Object.hasOwn(taskData, 'description')` agar `null` tetap bisa disimpan.
6. Isi `updated_at` dengan timestamp baru.
7. Jalankan query `UPDATE tasks SET ... WHERE id = ?`.
8. Return `findTask(db, id)`.

Catatan penting:

```js
taskData.description ?? current.description
```

tidak boleh dipakai untuk `description`, karena `null` adalah nilai valid.

## Step 11: Lengkapi `deleteTask`

File:

```text
src/models/taskModel.js
```

Fungsi:

```js
deleteTask(db, id)
```

Yang harus dilakukan:

1. Jalankan `DELETE FROM tasks WHERE id = ?`.
2. Cek nilai `.changes`.
3. Return `true` jika `.changes > 0`.
4. Return `false` jika tidak ada row yang terhapus.

## Step 12: Lengkapi Controller Helper

File:

```text
src/controllers/taskController.js
```

### `getValidIdOrFail`

Yang harus dilakukan:

1. Panggil `parseId(rawId)`.
2. Jika hasilnya `null`, lempar `ApiError(404, 'Task not found')`.
3. Jika valid, return id.

### `getTaskOrFail`

Yang harus dilakukan:

1. Panggil `getValidIdOrFail(rawId)`.
2. Cari task dengan `findTask(db, id)`.
3. Jika task tidak ada, lempar `ApiError(404, 'Task not found')`.
4. Jika ada, return task.

## Step 13: Lengkapi Controller Endpoint

File:

```text
src/controllers/taskController.js
```

### `index`

Yang harus dilakukan:

1. Ambil semua task dengan `listTasks(db)`.
2. Kirim response:

   ```js
   response.json({ data: tasks });
   ```

### `store`

Yang harus dilakukan:

1. Validasi `request.body` dengan `validateTaskInput(db, request.body)`.
2. Buat task dengan `createTask(db, taskData)`.
3. Kirim response status `201`:

   ```js
   response.status(201).json({ data: task });
   ```

### `show`

Yang harus dilakukan:

1. Ambil task dengan `getTaskOrFail(db, request.params.id)`.
2. Kirim response:

   ```js
   response.json({ data: task });
   ```

### `update`

Yang harus dilakukan:

1. Parse id dengan `getValidIdOrFail(request.params.id)`.
2. Validasi body dengan mode partial:

   ```js
   validateTaskInput(db, request.body, { partial: true })
   ```

3. Update task dengan `updateTask(db, id, taskData)`.
4. Jika hasil update `null`, lempar `ApiError(404, 'Task not found')`.
5. Kirim response `{ data: task }`.

### `destroy`

Yang harus dilakukan:

1. Parse id dengan `getValidIdOrFail(request.params.id)`.
2. Hapus task dengan `deleteTask(db, id)`.
3. Jika hasilnya `false`, lempar `ApiError(404, 'Task not found')`.
4. Jika berhasil, kirim:

   ```js
   response.status(204).send();
   ```

## Step 14: Jalankan Test Setelah Setiap Bagian

Jalankan:

```bash
npm test
```

Gunakan pesan error test sebagai petunjuk.

Contoh:

```text
TODO: lengkapi controller store
```

Artinya fungsi `store` di controller belum selesai.

Jika sudah tidak ada error `TODO`, cek status code dan response body yang diminta test.

## Checklist Selesai

Pastikan semua item ini terpenuhi:

- `GET /api/tasks` return status `200`
- `POST /api/tasks` return status `201`
- `GET /api/tasks/:id` return status `200` jika task ada
- `PATCH /api/tasks/:id` bisa memindahkan task ke column lain
- `DELETE /api/tasks/:id` return status `204`
- Column id tidak valid return status `422`
- Task tidak ditemukan return status `404`
- Swagger UI tetap bisa dibuka
- `npm test` lulus semua
