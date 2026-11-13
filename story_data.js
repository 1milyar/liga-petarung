/**
 * STORY_DATA2.JS - Episode 2: Kejuaraan Tingkat Kabupaten
 * Modul ini otomatis mendaftarkan Episode 2 ke dalam GAME_DATA utama.
 * v2.0 - Fix: 9 syntax errors, once flags, requirements, softlock prevention
 */

if (typeof GAME_DATA !== 'undefined' && GAME_DATA.episodes) {
  GAME_DATA.episodes.push({
    id: "ep_02_kabupaten",
    title: "Episode 2: Kejuaraan Kabupaten & Intrik Industri",
    synopsis: "Memasuki tingkat Kabupaten, dunia pertarungan bukan lagi sekadar olah napas dan tradisi. Industri olahraga, intrik bandar judi suap match-fixing, serta petarung modern gaya Kickboxing/MMA siap menguji integritas dan ketajaman mental Anda.",
    start_location_id: "loc_06_hotel_kabupaten",

    locations: [
      {
        id: "loc_06_hotel_kabupaten",
        name: "Hotel Grand Serayu & Konferensi Pers",
        image: "assets/images/scene_hotel.webp",
        narrative: "Lampu kristal menyoroti ruang ballroom Hotel Grand Serayu. Kilatan kamera wartawan dan spanduk raksasa 'Kejuaraan Mutiara Kabupaten' memenuhi ruangan.\n\nSeorang pria berjas mahal pengusaha taruhan—Pak Broto—mendekati Anda di sudut ruangan. Ia menyodorkan koper berisi uang tunai bernilai puluhan juta rupiah, meminta Anda sengaja mengalah (match-fixing) di semifinal demi keuntungan bandar.",
        action_options: [
          {
            action_id: "act_hot_01",
            description: "Menolak koper uang suap dan menegaskan integritas petarung Sumbu Jagat di hadapan media.",
            outcome: "Wartawan mencatat ketegasan Anda! Reputasi Anda melonjak pesat di mata publik, namun Pak Broto bersumpah akan menyewa petarung paling brutal untuk menghancurkan Anda.",
            stat_changes: { stat2: 15, stat3: 30 },
            unlocked_item_id: "item_21",
            once: true
          },
          {
            action_id: "act_hot_02",
            description: "Menerima uang suap dan menyembunyikannya di dalam koper.",
            outcome: "Uang suap masuk ke kantong Anda, tetapi rasa bersalah mengikis Ketenangan Batin (Qi) dan reputasi Anda hancur jika tercium media.",
            stat_changes: { stat2: -35, stat3: -20 },
            unlocked_item_id: "item_20",
            once: true
          },
          {
            action_id: "act_hot_03",
            description: "Meninggalkan Ballroom dan menuju Pusat Kebugaran Titan Gym.",
            next_location_id: "loc_07_gym_modern"
          }
        ]
      },
      {
        id: "loc_07_gym_modern",
        name: "Pusat Kebugaran & Ring Titan Combat Gym",
        image: "assets/images/scene_gym.webp",
        narrative: "Suara dentuman musik elektronik dan dentingan beban besi bergema di Titan Gym. Di sini, para atlet dilatih dengan analisis komputer, pengukur detak jantung digital, dan teknik Modern Kickboxing.\n\nPelatih Gym menawarkan pengujian kondisi fisik serta pemakaian Handwrap Pro Gel untuk memperkuat perlindungan pergelangan tangan Anda.",
        action_options: [
          {
            action_id: "act_gym_01",
            description: "Mempelajari analisis biomekanika tendangan Kickboxing pada layar simulasi.",
            outcome: "Anda memahami pola titik buta (blindspot) petarung modern saat melakukan kombinasi tendangan rendah (low-kick). Ketenangan Anda meningkat!",
            stat_changes: { stat2: 20 },
            unlocked_item_id: "item_22",
            once: true
          },
          {
            action_id: "act_gym_02",
            description: "Membeli Handwrap Pro Gel dan Suplemen Konsentrat Whey.",
            outcome: "Peralatan modern terpasang, memberikan perlindungan ekstra pada otot tangan Anda.",
            stat_changes: { stat1: 15 },
            unlocked_item_id: "item_23",
            once: true
          },
          {
            action_id: "act_gym_03",
            description: "Bergerak menuju Mess Atlet Kabupaten untuk persiapan babak penyisihan.",
            next_location_id: "loc_08_mess_atlet"
          }
        ]
      },
      {
        id: "loc_08_mess_atlet",
        name: "Mess Atlet & Dapur Nutrisi Kabupaten",
        image: "assets/images/scene_mess.webp",
        narrative: "Mess Atlet terasa relatif tenang menjelang malam semifinal. Di dapur mess, Anda dapat mengombinasikan Rimpang Tradisional dengan Suplemen Modern untuk menciptakan formula daya tahan tubuh yang maksimal.",
        action_options: [
          {
            action_id: "act_mes_01",
            description: "Melakukan latihan napas dalam di selasar malam mess.",
            outcome: "Olah napas memulihkan Qi dan memfokuskan mental Anda jelang pertarungan berat.",
            stat_changes: { stat2: 15 },
            once: true
          },
          {
            action_id: "act_mes_02",
            description: "Melangkah menuju GOR Utama Kabupaten untuk Babak Semifinal & Final.",
            next_location_id: "loc_09_arena_kabupaten"
          }
        ]
      },
      {
        id: "loc_09_arena_kabupaten",
        name: "GOR Utama Mutiara Kabupaten (Babak Semifinal)",
        image: "assets/images/scene_gorkab.webp",
        narrative: "Tribun GOR Utama padat oleh ribuan penonton. Di sudut merah berdiri 'Rangga Sang Siku Besi'—petarung bayaran Pak Broto yang terkenal dengan gaya Muay Thai tanpa ampun.\n\nWasit memanggil kedua petarung ke tengah ring. Rangga menatap Anda dengan tatapan dingin penuh provokasi.",
        action_options: [
          {
            action_id: "act_are_01",
            description: "Gunakan Tangkapan Siku Sumbu Jagat untuk mengunci dan mematahkan serangan Muay Thai lawan.",
            outcome: "Anda berhasil mengunci siku Rangga dan melontarkan lemparan telak! Rangga tumbang tak berkutik. Tiket Final Kabupaten di tangan Anda!",
            stat_changes: { stat1: -15, stat3: 25 },
            required_item_id: "item_22",
            next_location_id: "loc_10_final_kabupaten",
            once: true
          },
          {
            action_id: "act_are_02",
            description: "Mencoba adu pukulan terbuka jarak dekat tanpa pertahanan siku.",
            outcome: "Siku keras Rangga mendarat di pelipis Anda! Anda tergeletak tak sadarkan diri di atas kanvas. Semifinal berakhir dengan kekalahan telak.",
            stat_changes: { stat1: -100 },
            once: true
          }
        ]
      },
      {
        id: "loc_10_final_kabupaten",
        name: "Ring Utama Final Kejuaraan Kabupaten",
        image: "assets/images/scene_finalkab.webp",
        narrative: "Sorot lampu stroboskopik membakar atmosfer Ring Final. Lawan terakhir Anda adalah Bima 'Sang Hitam'—juara bertahan Kickboxing Kabupaten 3 kali berturut-turut yang tak pernah kalah.\n\nBima membuka dengan kombinasi pukulan cepat dan low-kick beruntun. Seluruh stadion menahan napas menunggu pergerakan Anda!",
        action_options: [
          {
            action_id: "act_fin_01",
            description: "Eksekusi Kombinasi 'Jurus Pembuka Sumbu Jagat' bercampur Penetrasi Konter Titik Buta.",
            outcome: "Serangan konter sempurna mendarat di rahang Bima! Sang juara bertahan roboh KO di lantai kanvas! Anda resmi menjadi JUARA KABUPATEN dan lolos ke SELEKSI PROVINSI!",
            required_stat: { stat2: 70 },
            trigger_ending_id: "true_ending_kabupaten"
          },
          {
            action_id: "act_fin_02",
            description: "Mencoba mengalah sengaja sesuai skenario suap Pak Broto.",
            outcome: "Anda berpura-pura jatuh, namun kecurangan Anda terbongkar oleh Tim Investigasi Liga. Anda di-ban selamanya!",
            trigger_ending_id: "corrupt_ending"
          }
        ]
      }
    ],

    items: [
      { id: "item_20", name: "Koper Uang Suap Bandar", emoji: "💼", description: "Uang hasil kecurangan yang merusak kehormatan petarung." },
      { id: "item_21", name: "Sertifikat Integritas Publik", emoji: "📜", description: "Bukti penolakan suap yang meningkatkan kepercayaan sponsor resmi." },
      { id: "item_22", name: "Catatan Biomekanika Kickboxing", emoji: "📊", description: "Analisis teknis titik lemah gaya pertarungan modern." },
      { id: "item_23", name: "Handwrap Pro Gel Modern", emoji: "🥊", description: "Pelindung tangan kelas profesional untuk daya rusak maksimal." }
    ],

    recipes: [
      {
        recipe_id: "rec_02",
        result_item_name: "Formula Nutrisi Atlet Hibrida",
        required_item_ids: ["item_02", "item_23"],
        description: "Menggabungkan Jahe Merah Tradisional & Gel Pro untuk memulihkan 40 Fisik!",
        reward_stat_changes: { stat1: 40 }
      }
    ],

    endings: {
      true_ending_kabupaten: {
        title: "TRUE ENDING: Sabuk Kejuaraan Kabupaten & Seleksi Provinsi",
        narrative: "Sabuk Emas Kejuaraan Kabupaten dilingkarkan di pinggang Anda! Sorak sorai ribuan penonton mengiringi kemenangan bersih Anda. Dengan memadukan ketahanan tradisi Sumbu Jagat dan pemahaman analisis modern, nama Anda kini resmi tercatat dalam daftar Atlet Pilihan menuju KEJUARAAN PROVINSI!"
      },
      corrupt_ending: {
        title: "BAD ENDING: Terbongkarnya Skandal Suap Match-Fixing",
        narrative: "Skandal pengusutan suap meledak di media massa. Nama baik Anda dicabut, gelar juara dibatalkan, dan Anda dilarang bertanding di seluruh gelanggang resmi seumur hidup."
      }
    }
  });
}