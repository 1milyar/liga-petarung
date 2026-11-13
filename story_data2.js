/**
 * STORY_DATA2.JS - Episode 2: Kejuaraan Tingkat Kabupaten
 * v3.0 - Combat, flag branching, requirements
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
        narrative: "Lampu kristal menyoroti ballroom Hotel Grand Serayu. Kilatan kamera wartawan dan spanduk raksasa 'Kejuaraan Mutiara Kabupaten' memenuhi ruangan.\n\nSeorang pria berjas mahal — Pak Broto, pengusaha taruhan — mendekati Anda. Ia menyodorkan koper berisi uang tunai bernilai puluhan juta rupiah, meminta Anda sengaja mengalah di semifinal demi keuntungan bandar.",
        narrative_by_flags: {
          ep1_refused_bribe: "Lampu kristal menyoroti ballroom Hotel Grand Serayu. Pak Broto mendekati Anda dengan seringai sinis. \"Kau itu petarung yang menolak suapku di Pasar Malam. Aku suka sikapmu... tapi sayangnya kau akan bertarung melawan orang yang lebih kuat dan lebih kejam. Masih mau menolak tawaranku?\"\n\nKoper berisi uang tunai terbuka di meja di hadapan Anda. Wartawan di seberang ruangan menunggu jawaban.",
          ep1_defeated_danu: "Lampu kristal menyoroti ballroom Hotel Grand Serayu. Pak Broto mendekati Anda dengan senyum licik. \"Kau itu murid yang mengalahkan Danu, kan? Aku dengar ceritanya. Sayang, di level Kabupaten ceritanya berbeda.\"\n\nKoper berisi uang tunai dibuka di hadapan Anda. Tawaran match-fixing menggantung di udara."
        },
        action_options: [
          {
            action_id: "act_hot_01",
            description: "Menolak koper uang suap dan menegaskan integritas di hadapan media.",
            outcome: "Wartawan mencatat ketegasan Anda! Reputasi melonjak. Namun Pak Broto bersumpah menyewa petarung paling brutal untuk menghancurkan Anda.",
            stat_changes: { stat2: 15, stat3: 30 },
            unlocked_item_id: "item_21",
            sets_flag: "ep2_refused_bribe",
            once: true
          },
          {
            action_id: "act_hot_02",
            description: "Menerima uang suap dan menyembunyikannya di dalam koper.",
            outcome: "Uang suap masuk ke kantong Anda, tetapi rasa bersalah mengikis Ketenangan Batin. Reputasi Anda hancur jika tercium media.",
            stat_changes: { stat2: -35, stat3: -20 },
            unlocked_item_id: "item_20",
            sets_flag: "ep2_accepted_bribe",
            once: true
          },
          {
            action_id: "act_hot_03",
            description: "Meninggalkan Ballroom menuju Pusat Kebugaran Titan Gym.",
            next_location_id: "loc_07_gym_modern"
          }
        ]
      },
      {
        id: "loc_07_gym_modern",
        name: "Pusat Kebugaran & Ring Titan Combat Gym",
        image: "assets/images/scene_gym.webp",
        narrative: "Dentuman musik elektronik dan dentingan beban besi bergema di Titan Gym. Para atlet dilatih dengan analisis komputer, pengukur detak jantung digital, dan teknik Modern Kickboxing.\n\nPelatih Gym menawarkan pengujian biomekanika serta pemakaian Handwrap Pro Gel untuk memperkuat perlindungan pergelangan tangan Anda.",
        action_options: [
          {
            action_id: "act_gym_01",
            description: "Mempelajari analisis biomekanika tendangan Kickboxing pada layar simulasi.",
            outcome: "Anda memahami pola titik buta (blindspot) petarung modern saat melakukan kombinasi tendangan rendah. Ketenangan Anda meningkat!",
            stat_changes: { stat2: 20 },
            unlocked_item_id: "item_22",
            once: true
          },
          {
            action_id: "act_gym_02",
            description: "Membeli Handwrap Pro Gel dan Suplemen Konsentrat Whey.",
            outcome: "Peralatan modern terpasang, memberi perlindungan ekstra pada otot tangan Anda.",
            stat_changes: { stat1: 15 },
            unlocked_item_id: "item_23",
            once: true
          },
          {
            action_id: "act_gym_03",
            description: "Bergerak menuju Mess Atlet Kabupaten untuk persiapan penyisihan.",
            next_location_id: "loc_08_mess_atlet"
          }
        ]
      },
      {
        id: "loc_08_mess_atlet",
        name: "Mess Atlet & Dapur Nutrisi Kabupaten",
        image: "assets/images/scene_mess.webp",
        narrative: "Mess Atlet terasa relatif tenang menjelang malam semifinal. Di dapur mess, Anda dapat mengombinasikan Rimpang Tradisional dengan Suplemen Modern untuk menciptakan formula daya tahan tubuh maksimal.",
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
            description: "Melangkah menuju GOR Utama Kabupaten untuk Babak Semifinal.",
            next_location_id: "loc_09_arena_kabupaten"
          }
        ]
      },
      {
        id: "loc_09_arena_kabupaten",
        name: "GOR Utama Mutiara Kabupaten (Babak Semifinal)",
        image: "assets/images/scene_gorkab.webp",
        narrative: "Tribun GOR Utama padat oleh ribuan penonton. Di sudut merah berdiri 'Rangga Sang Siku Besi' — petarung bayaran Pak Broto yang terkenal dengan gaya Muay Thai tanpa ampun.\n\nWasit memanggil kedua petarung ke tengah ring. Rangga menatap Anda dengan tatapan dingin penuh provokasi.",
        narrative_by_flags: {
          ep2_refused_bribe: "Tribun GOR Utama padat. Di sudut merah berdiri Rangga — petarung bayaran yang secara khusus disewa Pak Broto untuk menghancurkan Anda setelah penolakan suap Anda tadi. Matanya menyala penuh kebencian.\n\n\"Kau akan menyesal telah mempermalukan Pak Broto,\" desisnya sambil membuka guard.",
          ep2_accepted_bribe: "Tribun GOR Utama padat. Rangga berdiri di sudut merah dengan seringai jijik. \"Jadi kau yang terima suap itu? Dasar anjing. Aku akan menghajarmu sampai kau lupa nama sendiri — dan Pak Broto tidak akan protes.\"\n\nRupanya Pak Broto memasang dua kuda: menyuap Anda DAN menyewa Rangga. Rencana licik."
        },
        action_options: [
          {
            action_id: "act_are_01",
            description: "Gunakan Tangkapan Siku Sumbu Jagat untuk mengunci serangan Muay Thai.",
            required_item_id: "item_22",
            combat: {
              enemy: { name: "Rangga Sang Siku Besi", emoji: "💢", maxHp: 150, attack: 13, defense: 4 },
              victory: {
                outcome: "Anda berhasil mengunci siku Rangga dan melontarkan lemparan telak! Rangga tumbang tak berkutik. Tiket Final Kabupaten di tangan Anda!",
                stat_changes: { stat3: 25 },
                next_location_id: "loc_10_final_kabupaten"
              },
              defeat: {
                outcome: "Siku keras Rangga mendarat di pelipis Anda. Darah mengalir deras. Wasit menghentikan pertarungan — Anda kalah TKO.",
                stat_changes: { stat1: -40, stat3: -10 }
              }
            }
          },
          {
            action_id: "act_are_02",
            description: "Mencoba adu pukulan terbuka tanpa pertahanan siku (BERBAHAYA).",
            outcome: "Siku keras Rangga mendarat di pelipis Anda! Anda tergeletak tidak sadarkan diri di atas kanvas. Semifinal berakhir dengan kekalahan telak.",
            stat_changes: { stat1: -60 },
            once: true
          }
        ]
      },
      {
        id: "loc_10_final_kabupaten",
        name: "Ring Utama Final Kejuaraan Kabupaten",
        image: "assets/images/scene_finalkab.webp",
        narrative: "Sorot lampu stroboskopik membakar atmosfer Ring Final. Lawan terakhir Anda adalah Bima 'Sang Hitam' — juara bertahan Kickboxing Kabupaten tiga kali berturut-turut yang tak pernah kalah.\n\nBima membuka dengan kombinasi pukulan cepat dan low-kick beruntun. Seluruh stadion menahan napas menunggu pergerakan Anda!",
        action_options: [
          {
            action_id: "act_fin_01",
            description: "Eksekusi Kombinasi 'Jurus Pembuka Sumbu Jagat' dengan Penetrasi Konter Titik Buta.",
            required_stat: { stat2: 60 },
            combat: {
              enemy: { name: "Bima Sang Hitam", emoji: "🖤", maxHp: 180, attack: 15, defense: 5 },
              victory: {
                outcome: "Serangan konter sempurna mendarat di rahang Bima! Sang juara bertahan roboh KO di lantai kanvas! Anda resmi menjadi JUARA KABUPATEN dan lolos ke SELEKSI PROVINSI!",
                trigger_ending_id: "true_ending_kabupaten"
              },
              defeat: {
                outcome: "Bima terlalu cepat, terlalu kuat. Low-kick-nya menghantam tulang kering Anda, disusul hook mematikan. Anda tumbang di ronde ketiga.",
                stat_changes: { stat1: -50, stat3: -15 }
              }
            }
          },
          {
            action_id: "act_fin_02",
            description: "Mengalah sengaja sesuai skenario suap Pak Broto.",
            outcome: "Anda berpura-pura jatuh, namun kecurangan Anda terbongkar oleh Tim Investigasi Liga. Anda di-ban selamanya!",
            trigger_ending_id: "corrupt_ending"
          }
        ]
      }
    ],
    items: [
      { id: "item_20", name: "Koper Uang Suap Bandar", emoji: "💼", description: "Uang hasil kecurangan yang merusak kehormatan petarung." },
      { id: "item_21", name: "Sertifikat Integritas Publik", emoji: "📜", description: "Bukti penolakan suap yang meningkatkan kepercayaan sponsor." },
      { id: "item_22", name: "Catatan Biomekanika Kickboxing", emoji: "📊", description: "Analisis teknis titik lemah gaya pertarungan modern." },
      { id: "item_23", name: "Handwrap Pro Gel Modern", emoji: "🥊", description: "Pelindung tangan kelas profesional." }
    ],
    recipes: [
      {
        recipe_id: "rec_02",
        result_item_name: "Formula Nutrisi Atlet Hibrida",
        required_item_ids: ["item_02", "item_23"],
        description: "Menggabungkan Jahe Merah Tradisional & Gel Pro untuk memulihkan 40 Stamina!",
        reward_stat_changes: { stat1: 40 }
      }
    ],
    endings: {
      true_ending_kabupaten: {
        title: "TRUE ENDING: Sabuk Kejuaraan Kabupaten & Seleksi Provinsi",
        narrative: "Sabuk Emas Kejuaraan Kabupaten dilingkarkan di pinggang Anda! Sorak ribuan penonton mengiringi kemenangan bersih Anda. Dengan memadukan ketahanan tradisi Sumbu Jagat dan pemahaman analisis modern, nama Anda kini resmi tercatat dalam daftar Atlet Pilihan menuju KEJUARAAN PROVINSI!"
      },
      corrupt_ending: {
        title: "BAD ENDING: Terbongkarnya Skandal Suap Match-Fixing",
        narrative: "Skandal pengusutan suap meledak di media massa. Nama baik Anda dicabut, gelar juara dibatalkan, dan Anda dilarang bertanding di seluruh gelanggang resmi seumur hidup."
      },
      stat_zero_ending: {
        title: "BAD ENDING: Cedera Permanen & Karir Berakhir",
        narrative: "Tubuh Anda tidak mampu lagi menerima tekanan pertarungan level kabupaten. Dokter menyatakan Anda tidak boleh naik ring lagi. Mimpi petarung berakhir di rumah sakit."
      },
      stat3_zero_ending: {
        title: "BAD ENDING: Nama Baik Hancur di Industri",
        narrative: "Reputasi Anda mencapai titik terendah. Tidak ada promotor yang mau bekerja sama, tidak ada sponsor yang mau mendanai. Anda menghilang dari dunia petarung tanpa jejak."
      }
    }
  });
}
