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
│   └── img/
│       ├── emblem*.png     # Lambang untuk header (versi warna & putih)
│       ├── logo-white.png  # Logo lengkap versi putih (dipakai di footer)
│       ├── people/         # Foto pengurus (400×400, dipakai kartu struktur)
│       ├── pokja/          # Ilustrasi maskot per Pokja + maskot hero
│       └── struktur-*.jpeg # Poster resmi (dibuka lewat lightbox)
└── data/
    ├── struktur.json       # Data struktur kepengurusan & Pokja (dipakai main.js)
    ├── produk.json         # Data galeri produk Pokja
    ├── materi.json         # Jalur belajar & daftar modul (section Materi Belajar)
    └── anggota.json        # Statistik profil anggota (section Profil Anggota)
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
  - `gambar`: path gambar thumbnail sendiri (opsional). Kosongkan (`null`) agar otomatis
    memakai ilustrasi maskot Pokja terkait dengan lapisan warna.
  - `icon`: glyph kecil pada label kategori — pilihan: `book`, `template`, `dataset`,
    `guide`, `video`, atau tambahkan di objek `GLYPH` pada `assets/js/main.js`.
3. Buka Pull Request ke branch `main`.

## Memperbarui section Profil Anggota

Section `#anggota` dibaca dari `data/anggota.json`. Semua grafik digambar dari angka di berkas
itu — tidak ada nilai yang ditulis di HTML, dan **tidak ada persentase yang perlu dihitung
manual**. Yang Anda ubah hanya angka `jumlah`.

### Yang diubah saat ada data baru

1. `respons` dan `namaUnik` — total responden dan nama unik.
2. `ekosistem[].jumlah` — empat kategori, jumlahnya harus sama dengan `respons`.
3. `institusi[].jumlah` — jumlahnya juga harus sama dengan `respons`.
4. `sektor[].jumlah` — boleh melebihi `respons` (responden bisa memilih lebih dari satu).
5. `topInstitusi` — sepuluh institusi teratas, urutkan ulang bila peringkatnya berubah.

Persentase, lebar bar, dan bilah kemajuan dihitung otomatis. Urutkan tiap larik dari besar ke
kecil supaya grafiknya mudah dibaca.

### Periksa sebelum merge

```bash
python tools/cek-data.py
```

Skrip ini memeriksa total, field yang seharusnya tidak ada, status yang tidak dikenal, dan
berkas gambar yang hilang. Skrip yang sama juga berjalan otomatis di setiap Pull Request lewat
GitHub Actions (`.github/workflows/cek-data.yml`), jadi kesalahan angka ketahuan sebelum tayang.

### Catatan desain grafik (jangan diubah tanpa alasan)

- **Warna seri** (`#1e6fd9`, `#e8622c`, `#0f9b8e`, `#6b4fd6`) sudah divalidasi terhadap
  permukaan kartu putih untuk keterbacaan penyandang buta warna. Menambah kategori ekosistem
  kelima berarti harus memvalidasi ulang seluruh set warna — jangan sekadar menambah warna baru.
  Skrip pemeriksa akan menolak bila kategori ekosistem lebih dari empat.
- **Tiap bar chart memakai satu warna**, bukan gradasi menurut nilai. Panjang bar sudah
  menyatakan besarannya; mewarnai bar sesuai nilai hanya menduplikasi informasi yang sama.
- **Nilai kategori ekosistem ada di legenda**, bukan di dalam segmen — segmen terkecil (2,8%)
  terlalu sempit untuk memuat teks tanpa terpotong.
- **Sektor sengaja tanpa persentase.** Responden boleh memilih lebih dari satu sektor, sehingga
  persentase terhadap total responden akan menyesatkan.

## Memperbarui section Materi Belajar

Section `#materi` dibaca dari `data/materi.json`. Strukturnya: tiga `jalur`, masing-masing berisi
daftar `modul`.

```json
{
  "judul": "Integrasi BIM–GIS",
  "tingkat": "Menengah",
  "status": "teruji",
  "tautan": "https://github.com/idtc-id/materi-belajar/tree/main/modul/DT-M-B05-bim-gis"
}
```

- `status`: `rencana`, `draf`, `siap-uji`, atau `teruji` — menentukan warna label.
- `tautan`: isi saat modulnya sudah terbit. Modul bertautan dihitung sebagai "tersedia" pada
  bilah kemajuan tiap jalur, dan judulnya otomatis menjadi tautan.
- Untuk menambah jalur baru, tambahkan objek ke `jalur` dengan `warna` `teal`, `orange`, atau
  `purple`.

## Memperbarui struktur organisasi

Data struktur kepengurusan ada di `data/struktur.json` — nama, peran, foto, fokus, dan output
tiap unit.

- **Foto pengurus**: taruh file di `assets/img/people/` (persegi, disarankan 400×400, wajah di
  bagian atas frame karena kartu memotong lingkaran dari atas), lalu isi field `foto` dengan
  path-nya, mis. `"foto": "assets/img/people/nama-orang.jpg"`.
- **Ilustrasi Pokja**: field `banner` pada tiap Pokja/unit pendukung, menunjuk ke
  `assets/img/pokja/`. Rasio lebar disarankan sekitar 2.5:1.
- Kalau ada posisi yang belum terisi, biarkan `"nama": ""` — kartu wakil dengan nama kosong
  otomatis disembunyikan sampai namanya diisi.
- **Poster resmi** ada di `assets/img/struktur-kepengurusan.jpeg` dan
  `assets/img/struktur-grup-whatsapp.jpeg` — perbarui bila ada perubahan periode kepengurusan.

## Deploy ke GitHub Pages

1. Buat repo baru di organisasi `idtc-id` dengan nama **persis** `idtc-id.github.io`.
2. Push isi folder ini ke branch `main`.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Tunggu beberapa menit, situs aktif di `https://idtc-id.github.io`.
