# TODO Peserta: Perbaiki Bug Kecil di Kanban Task API

Project ini sudah berbentuk MVC dan sebagian besar kodenya sudah lengkap.

Tugas peserta hanya memperbaiki **2 bagian kecil** yang sengaja dibuat error:

```text
1. parse id dari URL
2. default position saat create task
```

Target akhir:

```bash
npm test
```

Hasil akhirnya harus:

```text
tests 9
pass 9
fail 0
```

## Alur API Singkat

```text
Request
-> routes
-> controller
-> validator
-> model
-> SQLite
-> response JSON
```

File yang perlu dibuka:

```text
src/validators/taskValidator.js
src/models/taskModel.js
tests/task-api.test.js
```

Jangan ubah file test. Test dipakai sebagai pemeriksa jawaban.

## Tugas 1: Perbaiki `parseId`

File:

```text
src/validators/taskValidator.js
```

Cari kode ini:

```js
export function parseId(rawId) {
  // TODO PESERTA:
  // Lengkapi fungsi ini agar id dari URL seperti "1" berubah menjadi angka 1.
  // Jika id tidak valid, return null.
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

Penjelasan:

- `rawId` berasal dari URL, contohnya `/api/tasks/1`.
- Nilai dari URL biasanya berupa string, misalnya `"1"`.
- `Number.parseInt(rawId, 10)` mengubah `"1"` menjadi angka `1`.
- Jika hasilnya angka integer dan lebih dari `0`, id dianggap valid.
- Jika tidak valid, function mengembalikan `null`.

Bagian ini mempengaruhi endpoint:

```text
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

## Tugas 2: Perbaiki Default `position`

File:

```text
src/models/taskModel.js
```

Cari bagian ini di function `createTask`:

```js
// TODO PESERTA:
// Jika position tidak dikirim dari request, simpan 0 sebagai nilai default.
taskData.position,
```

Ganti dengan:

```js
taskData.position ?? 0,
```

Penjelasan:

- Saat membuat task, client boleh tidak mengirim `position`.
- Jika `position` tidak dikirim, nilainya menjadi `undefined`.
- Database tidak menerima `undefined` untuk kolom `position`.
- Operator `??` artinya: pakai nilai kiri jika ada, kalau tidak ada pakai nilai kanan.
- Jadi `taskData.position ?? 0` berarti:

```text
jika taskData.position ada, pakai nilainya
jika tidak ada, pakai 0
```

Contoh:

```js
taskData.position ?? 0
```

Jika `taskData.position` adalah `2`, hasilnya `2`.

Jika `taskData.position` adalah `undefined`, hasilnya `0`.

## Cara Mengecek

Setelah mengerjakan dua tugas di atas, jalankan:

```bash
npm test
```

Jika masih gagal:

- cek apakah masih ada tulisan `TODO` di dua bagian tersebut
- cek apakah syntax yang dicopy sudah sama
- cek nama test yang gagal untuk tahu endpoint mana yang masih bermasalah

## Checklist Selesai

Pastikan:

- `GET /api/tasks/:id` tidak lagi error karena `parseId`
- `DELETE /api/tasks/:id` bisa berjalan untuk task yang dibuat tanpa `position`
- `npm test` lulus semua
