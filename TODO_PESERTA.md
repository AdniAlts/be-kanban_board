# TODO Peserta: Lengkapi Kanban Board API MVC

Project ini sudah disusun dengan pola MVC:

```text
Request -> Routes -> Controller -> Validator -> Model -> SQLite
```

Tugas peserta adalah melengkapi bagian yang diberi komentar `TODO` sampai semua test lulus.

## Cara Mengerjakan

1. Install dependency:

   ```bash
   npm install
   ```

2. Jalankan test:

   ```bash
   npm test
   ```

3. Buka file yang disebut di daftar tugas.
4. Lengkapi kode satu per satu.
5. Ulangi `npm test` sampai semua test lulus.

## Daftar Tugas

### 1. Lengkapi Controller

File: `src/controllers/taskController.js`

Lengkapi method berikut:

- `index`: mengambil semua task dan mengirim response `{ data: tasks }`
- `store`: validasi input, membuat task, dan mengirim status `201`
- `show`: mengambil detail task berdasarkan `id`
- `update`: validasi input, update task, dan mengirim hasil update
- `destroy`: hapus task dan mengirim status `204`

Pastikan task yang tidak ditemukan mengembalikan:

```json
{
  "message": "Task not found"
}
```

### 2. Lengkapi Validator

File: `src/validators/taskValidator.js`

Lengkapi validasi berikut:

- `column_id` wajib ada saat create
- `column_id` harus integer
- `column_id` harus ada di table `columns`
- `title` wajib ada saat create
- `title` harus string
- `title` tidak boleh kosong setelah `trim()`
- `title` maksimal 255 karakter
- `description` boleh string atau `null`
- `position` harus integer dan minimal `0`

Jika validasi gagal, lempar `ApiError` status `422` dengan format:

```json
{
  "message": "Validation failed.",
  "errors": {
    "field": ["Pesan error"]
  }
}
```

### 3. Lengkapi Model Task

File: `src/models/taskModel.js`

Lengkapi query database untuk:

- `listTasks`
- `findTask`
- `createTask`
- `updateTask`
- `deleteTask`
- `columnExists`

Gunakan prepared statement dari `better-sqlite3`; jangan gabungkan input user langsung ke string SQL.

### 4. Pertahankan Response Shape

Jangan mengubah bentuk response API yang sudah dites:

```json
{
  "data": {}
}
```

Untuk list:

```json
{
  "data": []
}
```

### 5. Acceptance Criteria

Tugas selesai jika command ini lulus:

```bash
npm test
```

Target akhir:

```text
tests 9
pass 9
fail 0
```
