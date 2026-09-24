# idtc-id.github.io

Situs resmi **Indonesia Digital Twin Community (IDTC)** — halaman interaktif yang menampilkan
struktur organisasi, fokus tiap Pokja, dan galeri produk yang dihasilkan komunitas.

Live: `https://idtc-id.github.io` (aktif setelah repo ini dibuat dengan nama persis
`idtc-id.github.io` di organisasi [idtc-id](https://github.com/idtc-id) dan GitHub Pages
diaktifkan).

## Struktur proyek

```
idtc-id.github.io/
├── index.html              # Halaman utama (satu halaman, multi-section)
├── assets/
│   ├── css/style.css       # Semua styling
│   ├── js/main.js          # Interaktivitas (tabs, accordion, filter galeri, lightbox)
│   └── img/                # Logo, favicon, poster struktur organisasi
└── data/
    ├── struktur.json       # Data struktur kepengurusan & Pokja (dipakai main.js)
    └── produk.json         # Data galeri produk Pokja
```

Situs ini murni HTML/CSS/JS statis — tidak ada proses build. Cocok untuk GitHub Pages.

## Menjalankan secara lokal

Karena halaman memuat data lewat `fetch()`, buka lewat server lokal (bukan klik dua kali
`index.html`), misalnya:

```bash
# Python
python -m http.server 8000

# atau Node
npx serve .
```

Lalu buka `http://localhost:8000`.

## Cara menambahkan produk ke Galeri

Galeri Produk Pokja (`#galeri`) dibaca dari `data/produk.json`. Untuk menambah item:

1. Fork/branch repo ini.
2. Tambahkan objek baru ke `data/produk.json`, contoh:

```json
{
  "id": "nama-unik-produk",
  "pokja": "pokja1",
  "judul": "Judul Produk",
  "kategori": "Standar",
  "deskripsi": "Deskripsi singkat 1-2 kalimat tentang produk ini.",
  "gambar": null,
  "icon": "book",
  "tautan": "https://github.com/idtc-id/nama-repo",
  "tag": ["tag1", "tag2"],
  "tanggal": "2026-10"
}
```

  - `pokja`: salah satu dari `pokja1`, `pokja2`, `pokja3`, atau `umum`.
  - `gambar`: URL/path gambar thumbnail (opsional). Kosongkan (`null`) agar memakai
    thumbnail warna otomatis sesuai Pokja + ikon.
  - `icon`: dipakai kalau `gambar` kosong — pilihan: `book`, `template`, `dataset`, `guide`,
    atau tambahkan glyph baru di `iconGlyph` pada `assets/js/main.js`.
3. Buka Pull Request ke branch `main`.

## Memperbarui struktur organisasi

Data struktur kepengurusan ada di `data/struktur.json` (nama, peran, fokus, dan output tiap
unit). Poster resmi (gambar) ada di `assets/img/struktur-kepengurusan.jpeg` dan
`assets/img/struktur-grup-whatsapp.jpeg` — perbarui keduanya bila ada perubahan periode
kepengurusan.

## Deploy ke GitHub Pages

1. Buat repo baru di organisasi `idtc-id` dengan nama **persis** `idtc-id.github.io`.
2. Push isi folder ini ke branch `main`.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Tunggu beberapa menit, situs aktif di `https://idtc-id.github.io`.
