/**
 * STORY_DATA.JS - Episode 1: Ujian Padepokan & Gelanggang Kecamatan
 * Liga Petarung: Dari Padepokan ke Puncak Dunia
 * v2.0 - Fix: rec_01 syntax, item_03 drop, once flags, requirements
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
    stat1: { name: "Stamina & Fisik", icon: "🥊", initial: 100, max: 100 },
    stat2: { name: "Ketenangan & Qi", icon: "🧘", initial: 80, max: 100 },
    stat3: { name: "Reputasi & Nama", icon: "🏆", initial: 20, max: 100 }
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
          narrative: "Bau kemenyan tipis dan minyak serai memenuhi udara Ruang Utama Padepokan. Di atas lantai kayu jati tua yang licin oleh gesekan telapak kaki para murid, terbentang spanduk kelulusan sabuk.\n\nSenior Danu berdiri dengan menyilangkan tangan di dada, menatap Anda dengan pandangan meremehkan. Di sudut ruangan, Guru Tua duduk hening mengamati kesiapan fisik dan ketenangan jiwa Anda sebelum pendaftaran seleksi kecamatan ditutup.",
          action_options: [
            {
              action_id: "act_pad_01",
              description: "Memohon restu Guru Tua dan menerima Kitab Napas Sumbu Jagat.",
              outcome: "Guru Tua mengangguk pelan dan menyerahkan Kitab Napas. Ia berpesan bahwa kekuatannya terletak pada Ketenangan Batin, bukan amarah.",
              unlocked_item_id: "item_01",
              stat_changes: { stat2: 10 },
              once: true
            },
            {
              action_id: "act_pad_02",
              description: "Melakukan latihan tarikan fisik langsung dengan memukul tiang kayu dilapis sabut.",
              outcome: "Tangan Anda memar merah, namun daya rusak fisik dan stamina Anda teruji melampaui batas.",
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
          narrative: "Sinar matahari sore menembus celah atap seng pelataran latihan. Sandbag kulit seberat 50 kilogram bergoyang perlahan ditiup angin. Di sinilah para murid mengasah ketajaman serangan.\n\nDanu melangkah mendekat sambil memutar Handwrap di tangannya. Ia menantang Anda melakukan uji tanding singkat di depan para murid junior.",
          action_options: [
            {
              action_id: "act_pel_01",
              description: "Menerima tantangan Danu dengan fokus membaca arah bahu dan sasarannya.",
              outcome: "Anda berhasil menghindar secara presisi dan meluncurkan konter lurus ke rusuk Danu. Danu terkejut dan reputasi Anda melesat!",
              stat_changes: { stat1: -10, stat2: 10, stat3: 15 },
              unlocked_item_id: "item_04",
              once: true
            },
            {
              action_id: "act_pel_02",
              description: "Menolak tantangan Danu dan memilih meracik jamu pemulihan di Dapur Herbal.",
              next_location_id: "loc_03_dapur"
            }
          ]
        },
        {
          id: "loc_03_dapur",
          name: "Dapur Herbal & Racikan Jamu",
          image: "assets/images/scene_dapur.webp",
          narrative: "Dapur padepokan dipenuhi kuali perunggu berasap tipis. Berbagai rimpang jahe, madu hutan, dan dedaunan kering tergantung di papan kayu.\n\nDi sini Anda dapat mengolah bahan alami untuk memulihkan kondisi stamina dan memperkuat persendian sebelum bertanding.",
          action_options: [
            {
              action_id: "act_dap_01",
              description: "Mengambil Rimpang Jahe Merah dan Madu Hutan dari rak kayu.",
              outcome: "Anda menyimpan Jahe Merah dan Madu Hutan murni ke dalam tas. Keduanya bisa dirakit menjadi Jamu Pendekar Stamina di meja rakit.",
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
          narrative: "Sorak sorai penonton dan aroma minyak jelantah membaur di arena ring kain yang dipasang di tengah Pasar Malam. Ini adalah arena tak resmi di mana para petarung jalanan menguji mental.\n\nSeorang perantara menawarkan taruhan uang dan suplemen booster misterius agar Anda bersedia sengaja mengalah di ronda pertama.",
          action_options: [
            {
              action_id: "act_pas_01",
              description: "Menolak mentah-mentah tawaran suap dan bertarung jujur membanting lawan.",
              outcome: "Lawan roboh dalam dua ronda! Penonton bersorak dan panitia memberikan Tiket Resmi Seleksi GOR Kecamatan.",
              stat_changes: { stat1: -15, stat3: 20 },
              unlocked_item_id: "item_11",
              next_location_id: "loc_05_gor_kecamatan",
              once: true
            },
            {
              action_id: "act_pas_02",
              description: "Menerima botol jamu oplosan suplemen misterius dari sang perantara.",
              outcome: "Suplemen tersebut adalah racun obat terlarang yang merusak saraf dan reputasi Anda!",
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
          narrative: "Lampu sorot kuning menerangi Ring Octagon GOR Kecamatan. Ratusan penonton memadati tribun kayu. Ini adalah arena resmi pertama Anda menuju jenjang karir nasional.\n\nDi sudut merah, berdiri sang Juara Bertahan Kecamatan yang terkenal dengan tendangan melingkar cepatnya. Wasit memberi sinyal pertarungan final dimulai!",
          action_options: [
            {
              action_id: "act_gor_01",
              description: "Gunakan kombinasi Kuda-kuda Sumbu Jagat dan serangan konter jarak dekat.",
              outcome: "Serangan konter presisi mendarat telak di dagu lawan! Juara bertahan tumbang di lantai kanvas. Anda resmi menjadi JUARA KECAMATAN!",
              required_item_id: "item_11",
              trigger_ending_id: "true_ending"
            },
            {
              action_id: "act_gor_02",
              description: "Menerjang secara emosional tanpa mempedulikan pertahanan wajah.",
              outcome: "Tendangan melingkar lawan menghantam pelipis Anda secara telak. Anda tergeletak tidak sadarkan diri.",
              stat_changes: { stat1: -100 }
            }
          ]
        }
      ],
      items: [
        { id: "item_01", name: "Kitab Napas Sumbu Jagat", emoji: "📜", description: "Panduan jurus olah napas peningkat ketenangan." },
        { id: "item_02", name: "Rimpang Jahe Merah", emoji: "🫚", description: "Bahan jamu alami pemulih stamina fisik." },
        { id: "item_03", name: "Madu Hutan Murni", emoji: "🍯", description: "Ekstrak energi murni penguat daya tahan." },
        { id: "item_04", name: "Handwrap Serat Pasak", emoji: "🥊", description: "Pelindung buku jari untuk efisiensi pukulan." },
        { id: "item_05", name: "Minyak Urut Cimande", emoji: "🧴", description: "Minyak herbal pereda kram dan memar sendi." },
        { id: "item_10", name: "Jamu Oplosan Terlarang", emoji: "🧪", description: "Doping ilegal yang dapat menghancurkan karir." },
        { id: "item_11", name: "Tiket Seleksi GOR Kecamatan", emoji: "🎟️", description: "Izin resmi bertanding di ajang kecamatan." }
      ],
      recipes: [
        {
          recipe_id: "rec_01",
          result_item_name: "Jamu Pendekar Stamina",
          required_item_ids: ["item_02", "item_03"],
          description: "Ramuan Jahe Merah & Madu Hutan memulihkan 30 poin Stamina Fisik!",
          reward_stat_changes: { stat1: 30 }
        }
      ],
      endings: {
        true_ending: {
          title: "TRUE ENDING: Juara Kecamatan & Tiket Kabupaten",
          narrative: "Tangan Anda diangkat tinggi oleh Wasit di tengah sorak-sorak gemuruh GOR Kecamatan. Dengan mental baja dan jurus tradisi yang kokoh, Anda memenangkan Sabuk Kejuaraan Kecamatan dan melangkah mantap menuju LIGA KABUPATEN!",
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