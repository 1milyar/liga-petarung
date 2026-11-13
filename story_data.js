/**
 * STORY_DATA.JS - Episode 1: Ujian Padepokan & Gelanggang Kecamatan
 * v3.0 - Combat encounters, flags, requirements
 */

const GAME_DATA = {
  game_title: "LIGA PETARUNG",
  theme_colors: {
    bg: "#121318",
    panel: "#1c1e26",
    accent: "#d97706",
    text: "#f3f4f6"
  },
  stats_config: {
    stat1: { name: "Stamina", icon: "🥊", initial: 100, max: 100 },
    stat2: { name: "Qi", icon: "🧘", initial: 80, max: 100 },
    stat3: { name: "Reputasi", icon: "🏆", initial: 20, max: 100 }
  },
  audio_config: {
    bgm: "assets/audio/bgm_arena.mp3",
    sfx_action: "assets/audio/sfx_klik.mp3",
    sfx_danger: "assets/audio/sfx_tegang.mp3"
  },
  episodes: [
    {
      id: "ep_01_padepokan_kecamatan",
      title: "Episode 1: Ujian Padepokan & Gelanggang Kecamatan",
      synopsis: "Sebagai murid yang sering diremehkan di Padepokan Sumbu Jagat, Anda harus membuktikan kemampuan olah napas dan fisik Anda untuk meraih tiket wakil kecamatan ke ajang liga resmi.",
      start_location_id: "loc_01_padepokan",
      locations: [
        {
          id: "loc_01_padepokan",
          name: "Ruang Utama Padepokan Sumbu Jagat",
          image: "assets/images/scene_padepokan.webp",
          narrative: "Udara Ruang Utama Padepokan terasa berat, bercampur aroma kemenyan tipis dan keringat para murid yang berlatih sejak fajar. Lantai kayu jati berusia ratusan tahun mengilap oleh gesekan telapak kaki ribuan petarung sebelum Anda.\n\nSenior Danu berdiri dengan tangan menyilang di dada, tatapannya meremehkan. Di sudut ruangan, Guru Tua duduk hening mengamati kesiapan fisik dan ketenangan jiwa Anda sebelum pendaftaran seleksi kecamatan ditutup.",
          action_options: [
            {
              action_id: "act_pad_01",
              description: "Memohon restu Guru Tua dan menerima Kitab Napas Sumbu Jagat.",
              outcome: "Guru Tua mengangguk pelan, menyerahkan Kitab Napas. \"Kekuatan sejati bukan dari amarah, melainkan dari napas yang tenang,\" bisiknya.",
              unlocked_item_id: "item_01",
              stat_changes: { stat2: 10 },
              sets_flag: "ep1_has_blessing",
              once: true
            },
            {
              action_id: "act_pad_02",
              description: "Melatih fisik dengan memukul tiang kayu dilapis sabut.",
              outcome: "Tangan Anda memerah dan berdarah tipis, namun otot-otot mulai mengingat ritme pukulan Sumbu Jagat.",
              stat_changes: { stat1: -5, stat3: 5 },
              once: true
            },
            {
              action_id: "act_pad_03",
              description: "Melangkah ke Pelataran Sandbag untuk menguji kekuatan lawan.",
              next_location_id: "loc_02_pelataran"
            }
          ]
        },
        {
          id: "loc_02_pelataran",
          name: "Pelataran Sandbag & Ring Terbuka",
          image: "assets/images/scene_pelataran.webp",
          narrative: "Sinar matahari sore menembus celah atap seng pelataran. Sandbag kulit seberat lima puluh kilogram bergoyang ditiup angin sore. Di sinilah para murid mengasah ketajaman serangan.\n\nDanu melangkah mendekat sambil memutar handwrap di tangannya. \"Kalau kau memang sehebat yang dikatakan Guru, buktikan di ring ini!\" tantangnya di depan para murid junior.",
          action_options: [
            {
              action_id: "act_pel_01",
              description: "Menantang Danu dalam uji tanding terbuka.",
              combat: {
                enemy: { name: "Danu", emoji: "🥋", maxHp: 70, attack: 8, defense: 1 },
                victory: {
                  outcome: "Danu terhuyung, jatuh bersandar di tali ring. Wajahnya merah padam — bukan karena memar, tapi karena malu. Para murid junior bersorak untuk Anda!",
                  stat_changes: { stat3: 20 },
                  unlocked_item_id: "item_04",
                  sets_flag: "ep1_defeated_danu"
                },
                defeat: {
                  outcome: "Tubuh Anda terhempas ke lantai kayu. Danu menyeringai, tetapi Guru Tua yang melihat dari jauh hanya berkata, \"Belajarlah dari kegagalan.\"",
                  stat_changes: { stat1: -15 }
                }
              }
            },
            {
              action_id: "act_pel_02",
              description: "Menolak tantangan Danu dan memilih ke Dapur Herbal.",
              next_location_id: "loc_03_dapur"
            }
          ]
        },
        {
          id: "loc_03_dapur",
          name: "Dapur Herbal & Racikan Jamu",
          image: "assets/images/scene_dapur.webp",
          narrative: "Dapur padepokan dipenuhi kuali perunggu berasap tipis. Rimpang jahe merah, madu hutan, dan dedaunan kering tergantung di papan kayu. Aroma rempah menenangkan jiwa.\n\nDi sini Anda dapat mengolah bahan alami untuk memulihkan kondisi sebelum bertanding di gelanggang yang lebih berat.",
          action_options: [
            {
              action_id: "act_dap_01",
              description: "Mengambil Rimpang Jahe Merah dan Madu Hutan dari rak kayu.",
              outcome: "Anda menyimpan Jahe Merah dan Madu Hutan murni ke dalam tas. Keduanya bisa dirakit menjadi Jamu Pendekar Stamina di Meja Rakit.",
              unlocked_item_ids: ["item_02", "item_03"],
              once: true
            },
            {
              action_id: "act_dap_02",
              description: "Membawa botol Minyak Urut Cimande untuk perlindungan otot.",
              outcome: "Minyak urut tradisional berhasil diamankan ke dalam inventaris.",
              unlocked_item_id: "item_05",
              once: true
            },
            {
              action_id: "act_dap_03",
              description: "Melanjutkan perjalanan ke Gelanggang Underground Pasar Malam.",
              next_location_id: "loc_04_pasar_malam"
            }
          ]
        },
        {
          id: "loc_04_pasar_malam",
          name: "Gelanggang Underground Pasar Malam",
          image: "assets/images/scene_pasarmalam.webp",
          narrative: "Sorak sorai penonton dan aroma minyak jelantah membaur di arena ring kain yang dipasang di tengah Pasar Malam. Ini arena tak resmi di mana para petarung jalanan menguji mental.\n\nSeorang perantara berjas lusuh menawarkan taruhan uang dan suplemen booster misterius agar Anda sengaja mengalah di ronda pertama. Di seberang, seorang preman bertato tengah memanaskan otot.",
          action_options: [
            {
              action_id: "act_pas_01",
              description: "Menolak suap dan bertarung jujur membanting preman pasar.",
              combat: {
                enemy: { name: "Preman Pasar", emoji: "💢", maxHp: 90, attack: 10, defense: 2 },
                victory: {
                  outcome: "Preman itu roboh di atas kanvas kotor! Penonton bersorak. Panitia menyerahkan Tiket Resmi Seleksi GOR Kecamatan ke tangan Anda.",
                  stat_changes: { stat3: 20 },
                  unlocked_item_id: "item_11",
                  sets_flag: "ep1_refused_bribe",
                  next_location_id: "loc_05_gor_kecamatan"
                },
                defeat: {
                  outcome: "Anda terkapar di atas kanvas. Perantara menyeringai dan berbisik, \"Lain kali terima tawaranku.\" Stamina Anda terkuras parah.",
                  stat_changes: { stat1: -20 }
                }
              }
            },
            {
              action_id: "act_pas_02",
              description: "Menerima botol jamu oplosan suplemen misterius dari sang perantara.",
              outcome: "Suplemen tersebut ternyata racun obat terlarang yang merusak saraf! Tubuh Anda lemas dan reputasi tercoreng.",
              stat_changes: { stat1: -30, stat2: -40, stat3: -25 },
              unlocked_item_id: "item_10",
              once: true
            }
          ]
        },
        {
          id: "loc_05_gor_kecamatan",
          name: "GOR Kejuaraan Seleksi Kecamatan",
          image: "assets/images/scene_gor.webp",
          narrative: "Lampu sorot kuning menerangi Ring Octagon GOR Kecamatan. Ratusan penonton memadati tribun kayu. Ini adalah arena resmi pertama Anda menuju jenjang karir nasional.\n\nDi sudut merah, berdiri sang Juara Bertahan Kecamatan — terkenal dengan tendangan melingkar cepatnya. Wasit memberi sinyal pertarungan final dimulai!",
          action_options: [
            {
              action_id: "act_gor_01",
              description: "Naik ke ring dan hadapi Juara Bertahan Kecamatan.",
              required_item_id: "item_11",
              combat: {
                enemy: { name: "Juara Bertahan Kecamatan", emoji: "🥇", maxHp: 130, attack: 12, defense: 3 },
                victory: {
                  outcome: "Tubuh Juara Bertahan terhempas ke kanvas! Wasit mengangkat tangan Anda tinggi-tinggi di tengah gemuruh sorak-sorai. Anda resmi menjadi JUARA KECAMATAN!",
                  trigger_ending_id: "true_ending"
                },
                defeat: {
                  outcome: "Tendangan melingkar lawan menghantam pelipis Anda. Dunia berputar... lalu gelap. Mimpi Anda pupus di ring ini.",
                  stat_changes: { stat1: -40, stat3: -10 }
                }
              }
            },
            {
              action_id: "act_gor_02",
              description: "Menerjang secara emosional tanpa pertahanan (BERBAHAYA).",
              outcome: "Tendangan melingkar lawan menghantam pelipis Anda secara telak. Anda tergeletak tidak sadarkan diri.",
              stat_changes: { stat1: -100 },
              once: true
            }
          ]
        }
      ],
      items: [
        { id: "item_01", name: "Kitab Napas Sumbu Jagat", emoji: "📜", description: "Panduan jurus olah napas peningkat Qi." },
        { id: "item_02", name: "Rimpang Jahe Merah", emoji: "🫚", description: "Bahan jamu alami pemulih stamina." },
        { id: "item_03", name: "Madu Hutan Murni", emoji: "🍯", description: "Ekstrak energi murni penguat daya tahan." },
        { id: "item_04", name: "Handwrap Serat Pasak", emoji: "🥊", description: "Pelindung buku jari untuk efisiensi pukulan." },
        { id: "item_05", name: "Minyak Urut Cimande", emoji: "🧴", description: "Minyak herbal pereda kram dan memar." },
        { id: "item_10", name: "Jamu Oplosan Terlarang", emoji: "🧪", description: "Doping ilegal penghancur karir." },
        { id: "item_11", name: "Tiket Seleksi GOR Kecamatan", emoji: "🎟️", description: "Izin resmi bertanding di ajang kecamatan." }
      ],
      recipes: [
        {
          recipe_id: "rec_01",
          result_item_name: "Jamu Pendekar Stamina",
          required_item_ids: ["item_02", "item_03"],
          description: "Ramuan Jahe Merah & Madu Hutan memulihkan 30 poin Stamina!",
          reward_stat_changes: { stat1: 30 }
        }
      ],
      endings: {
        true_ending: {
          title: "TRUE ENDING: Juara Kecamatan & Tiket Kabupaten",
          narrative: "Tangan Anda diangkat tinggi oleh Wasit di tengah sorak gemuruh GOR Kecamatan. Dengan mental baja dan jurus tradisi yang kokoh, Anda memenangkan Sabuk Kejuaraan Kecamatan dan melangkah mantap menuju LIGA KABUPATEN!",
          next_episode_id: "ep_02_kabupaten"
        },
        stat_zero_ending: {
          title: "BAD ENDING: Keterpurukan Fisik & Cedera",
          narrative: "Stamina atau Ketenangan Batin Anda habis total. Tubuh Anda ambruk akibat dipaksa bertarung tanpa perhitungan matang, mengakhiri impian Anda di panggung petarung."
        },
        stat3_zero_ending: {
          title: "BAD ENDING: Murid Terbuang & Hancur Nama Baik",
          narrative: "Reputasi Anda menyentuh angka 0% akibat skandal doping atau tindakan tidak terpuji. Anda dikeluarkan dari padepokan dan di-ban selamanya dari liga."
        }
      }
    }
  ]
};
