# 📋 Task Manager App

Aplikasi manajemen tugas modern dengan antarmuka **kanban board** yang intuitif. Proyek ini dikembangkan sebagai submission untuk tantangan dari [devChallenges.io](https://devchallenges.io/) untuk mengasah keterampilan **HTML, CSS, dan JavaScript** dengan menerapkan konsep drag-and-drop dan dark mode.[reference:0]

![Demo App](https://via.placeholder.com/800x400?text=Task+Manager+App+Screenshot)

> 🔗 **Live Demo**: [task-manager-app-steel-ten.vercel.app](https://task-manager-app-steel-ten.vercel.app)

## ✨ Fitur Utama

- **Drag & Drop Antar Kolom** – Pindahkan tugas antar status (Backlog → In Progress → In Review → Completed) dengan mudah. Aplikasi ini mendukung drag-and-drop baik di perangkat desktop maupun sentuh.[reference:1]
- **Dark / Light Mode** – Tersedia dua tema yang dapat diubah sesuai preferensi, dengan penyimpanan ke `localStorage` sehingga tema akan diingat di kunjungan berikutnya.[reference:2]
- **Manajemen Board** – Buat board baru dengan nama dan logo emoji, serta hapus board yang tidak diperlukan. Board terakhir tidak dapat dihapus untuk menjaga setidaknya satu board tersedia.[reference:3]
- **Edit Tugas Lengkap** – Ubah nama tugas, status, pilih tag (maksimal 4 tag: Concept, Technical, Design, Front-end), tambahkan cover image dari URL acak atau upload gambar sendiri.[reference:4][reference:5]
- **Penyimpanan Lokal** – Semua data board dan tugas disimpan di `localStorage` browser, sehingga data tidak hilang meskipun halaman di-refresh atau browser ditutup.[reference:6]
- **Responsif** – Tampilan menyesuaikan dengan berbagai ukuran layar, dari desktop hingga perangkat mobile.

## 🛠️ Teknologi yang Digunakan

- **React 18** – Library utama untuk membangun antarmuka pengguna.
- **Vite** – Build tool cepat untuk development dan produksi.[reference:7]
- **Tailwind CSS** – Utility-first CSS framework untuk styling yang konsisten.
- **Axios** – HTTP client untuk mengambil data board awal dari API.[reference:8]
- **React DnD** – Implementasi drag-and-drop dengan dukungan untuk HTML5 dan touch backend.[reference:9]
- **Context API** – Manajemen state global untuk data board dan operasi-operasi terkait.[reference:10]

## 📦 Cara Menjalankan Proyek

Pastikan Anda telah menginstal **Node.js** (versi 18 atau lebih baru) di komputer Anda.

1. **Clone repositori**
   ```bash
   git clone https://github.com/jejen-dev/Task-manager-app.git
   cd Task-manager-app

🧠 Refleksi Pengembangan
Proyek ini memberikan pengalaman berharga dalam beberapa aspek:

- Penerapan Drag-and-Drop – Menggunakan react-dnd untuk membuat antarmuka kanban yang interaktif. Tantangan utamanya adalah menangani perpindahan tugas antar kolom dengan posisi indeks yang tepat serta mendukung perangkat sentuh.

- Manajemen State Kompleks – Menggunakan Context API untuk mengelola data board yang bersarang (board → kolom → daftar tugas). Operasi seperti moveTask dan updateTask memerlukan pembaruan state yang immutable dan efisien.

- Dark Mode – Menerapkan tema gelap dengan bantuan Tailwind CSS dan kelas dark: yang disediakan, serta menyimpan preferensi pengguna ke localStorage.

- Integrasi API – Mengambil data board awal dari endpoint JSON milik devChallenges.io. Data kemudian ditransformasi ke dalam struktur yang sesuai dengan aplikasi, dengan fallback board jika API bermasalah.

- Penyimpanan Lokal – Menyimpan seluruh data board dan board aktif ke localStorage setiap kali ada perubahan, sehingga pengalaman pengguna tetap terjaga meskipun halaman di-refresh.

🤝 Kontribusi
Kontribusi sangat terbuka! Jika Anda menemukan bug atau memiliki ide untuk fitur baru, silakan buka issue atau kirim pull request.

Fork repositori ini.

Buat branch fitur baru (git checkout -b fitur-keren).

Commit perubahan Anda (git commit -m 'Menambahkan fitur keren').

Push ke branch (git push origin fitur-keren).

Buka Pull Request.

📜 Lisensi
Proyek ini dibuat untuk tujuan pembelajaran dan submission tantangan devChallenges.io. Anda bebas menggunakan kode ini sebagai referensi untuk proyek Anda sendiri.

Dibuat dengan oleh jejen-dev
Terima kasih telah mengunjungi repositori ini! Jangan lupa ⭐ jika proyek ini bermanfaat.