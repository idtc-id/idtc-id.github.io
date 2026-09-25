#!/usr/bin/env python3
"""Periksa konsistensi berkas data situs IDTC.

Jalankan dari akar repo:  python tools/cek-data.py
Keluar dengan kode 1 bila ada masalah, sehingga bisa dipakai di CI.
"""

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
masalah = []
catatan = []


def muat(nama):
    berkas = ROOT / "data" / nama
    if not berkas.exists():
        masalah.append(f"{nama}: berkas tidak ditemukan")
        return None
    try:
        return json.loads(berkas.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        masalah.append(f"{nama}: JSON tidak valid — {e}")
        return None


def cek_anggota(d):
    respons = d.get("respons")
    if not isinstance(respons, int) or respons <= 0:
        masalah.append("anggota.json: 'respons' harus bilangan bulat positif")
        return

    if d.get("namaUnik", 0) > respons:
        masalah.append(
            f"anggota.json: namaUnik ({d['namaUnik']}) melebihi respons ({respons})"
        )

    for kunci in ("ekosistem", "institusi"):
        total = sum(r["jumlah"] for r in d.get(kunci, []))
        if total != respons:
            masalah.append(
                f"anggota.json: jumlah '{kunci}' = {total}, seharusnya sama dengan respons ({respons})"
            )

    if len(d.get("ekosistem", [])) > 4:
        masalah.append(
            "anggota.json: ekosistem lebih dari 4 kategori — hanya tersedia 4 warna "
            "yang sudah divalidasi keterbacaannya. Validasi ulang warna sebelum menambah."
        )

    sektor = sum(r["jumlah"] for r in d.get("sektor", []))
    if sektor < respons:
        catatan.append(
            f"anggota.json: jumlah sektor ({sektor}) di bawah respons ({respons}) — "
            "wajar bila banyak responden mengosongkan kolom sektor, tapi periksa lagi."
        )

    for kunci in ("ekosistem", "institusi", "sektor", "topInstitusi"):
        baris = d.get(kunci, [])
        urut = sorted(baris, key=lambda r: -r["jumlah"])
        if baris != urut:
            catatan.append(
                f"anggota.json: '{kunci}' belum urut dari besar ke kecil — "
                "grafik tetap tampil, tapi lebih mudah dibaca bila diurutkan."
            )
        for r in baris:
            if "persen" in r:
                masalah.append(
                    f"anggota.json: '{kunci}' masih memuat field 'persen'. "
                    "Persentase dihitung otomatis dari 'jumlah' — hapus field ini."
                )
                break


def cek_produk(d):
    valid = {"pokja1", "pokja2", "pokja3", "umum"}
    for p in d:
        if p.get("pokja") not in valid:
            masalah.append(
                f"produk.json: '{p.get('id')}' punya pokja '{p.get('pokja')}' "
                f"(harus salah satu dari {sorted(valid)})"
            )
        gambar = p.get("gambar")
        if gambar and not (ROOT / gambar).exists():
            masalah.append(f"produk.json: '{p.get('id')}' merujuk gambar hilang — {gambar}")


def cek_materi(d):
    valid = {"rencana", "draf", "siap-uji", "teruji"}
    for j in d.get("jalur", []):
        if j.get("warna") not in {"teal", "orange", "purple"}:
            masalah.append(f"materi.json: jalur '{j.get('kode')}' punya warna tidak dikenal")
        for m in j.get("modul", []):
            if m.get("status") not in valid:
                masalah.append(
                    f"materi.json: modul '{m.get('judul')}' status '{m.get('status')}' "
                    f"(harus salah satu dari {sorted(valid)})"
                )
            if m.get("status") == "teruji" and not m.get("tautan"):
                catatan.append(
                    f"materi.json: modul '{m.get('judul')}' berstatus teruji tapi belum ada tautan"
                )


def cek_struktur(d):
    def telusuri(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k in ("foto", "banner") and isinstance(v, str):
                    if not (ROOT / v).exists():
                        masalah.append(f"struktur.json: berkas hilang — {v}")
                else:
                    telusuri(v)
        elif isinstance(obj, list):
            for v in obj:
                telusuri(v)

    telusuri(d)


for nama, pemeriksa in (
    ("anggota.json", cek_anggota),
    ("produk.json", cek_produk),
    ("materi.json", cek_materi),
    ("struktur.json", cek_struktur),
):
    data = muat(nama)
    if data is not None:
        pemeriksa(data)

for c in catatan:
    print(f"  catatan : {c}")
for m in masalah:
    print(f"  MASALAH : {m}")

if masalah:
    print(f"\n{len(masalah)} masalah ditemukan — perbaiki sebelum di-merge.")
    sys.exit(1)

print("\nSemua berkas data konsisten.")
