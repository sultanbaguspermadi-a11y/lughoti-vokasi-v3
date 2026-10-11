# Lughati Vokasi
Kamus Digital Arab–Indonesia untuk Siswa SMK · SMK Muhammadiyah Pencongan · Sultan Bagus Permadi

## Jalankan lokal
    npm install
    npm run dev       # pengembangan
    npm run build     # cek tipe + build produksi ke dist/

## Hosting di GitHub Pages
1. Buat repository baru di GitHub, lalu unggah seluruh isi folder ini (termasuk `package-lock.json` dan `.github/`).
2. Buka **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push ke branch `main`. Workflow `Deploy to GitHub Pages` akan build dan publish otomatis.
4. Situs aktif di `https://<username>.github.io/<nama-repo>/`.

Build memakai path relatif (`base: './'`), jadi berfungsi di sub-path repo maupun domain sendiri.

## Data
`public/words.json` dimuat saat runtime. Tambahkan entri baru di AKHIR tiap daftar jurusan agar ID favorit tidak bergeser.

## Fitur Bagikan
Di detail kata, tekan **Bagikan ke Story**: aplikasi membuat kartu PNG 1080×1920 (3 gaya) di perangkat, lalu membukanya lewat menu bagikan HP (Instagram/WhatsApp/TikTok). Jika browser tidak mendukung, gambar diunduh.
