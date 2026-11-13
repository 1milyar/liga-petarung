========================================================================
 LIGA PETARUNG: DARI PADEPOKAN KE PUNCAK DUNIA
 Game Engine Interactive Text RPG Mobile / Web (Offline First)
========================================================================

STRUKTUR FILE & FOLDER:
------------------------------------------------------------------------
Liga-Petarung/
├── index.html            <- Halaman UI Web/Mobile Utama
├── engine.js             <- Core Engine System (Audio, Save, Typewriter, Action, Stats, Crafting)
├── story_data.js         <- Data Cerita Episode 1 (Padepokan & Kecamatan)
├── story_data2.js        <- Data Cerita Episode 2 (Kejuaraan Kabupaten)
├── README.txt            <- Panduan Penggunaan & Aset
└── assets/
    ├── images/           <- Folder Gambar Visual Latar (16:9)
    │   ├── scene_padepokan.webp
    │   ├── scene_pelataran.webp
    │   ├── scene_dapur.webp
    │   ├── scene_pasarmalam.webp
    │   ├── scene_gor.webp
    │   ├── scene_hotel.webp
    │   ├── scene_gym.webp
    │   ├── scene_mess.webp
    │   ├── scene_gorkab.webp
    │   └── scene_finalkab.webp
    └── audio/            <- Folder Musik & Efek Suara (.mp3)
        ├── bgm_arena.mp3
        ├── sfx_klik.mp3
        └── sfx_tegang.mp3

------------------------------------------------------------------------
CARA MENJALANKAN GAME:
------------------------------------------------------------------------
1. Buka file `index.html` langsung menggunakan browser pilihan Anda (Google Chrome, Firefox, Safari, atau browser HP di Spck Editor).
2. Game dapat dimainkan 100% offline tanpa koneksi internet.
3. Progres permainan tersimpan otomatis di penyimpanan lokal (localStorage) browser HP/Laptop Anda.

------------------------------------------------------------------------
CARA MENAMBAHKAN EPISODE BARU DI MASA DEPAN (misal Episode 3):
------------------------------------------------------------------------
1. Buat file baru bernama `story_data3.js` di dalam folder utama.
2. Tambahkan script tag baru di `index.html` sebelum `engine.js`:
   <script src="story_data3.js"></script>
3. Gunakan templat struktur yang sama seperti `story_data2.js`:
   if (typeof GAME_DATA !== 'undefined' && GAME_DATA.episodes) {
     GAME_DATA.episodes.push({ ... });
   }
4. Episode baru akan langsung otomatis terdeteksi di menu utama dan sistem transisi!
