/**
 * STORY_DATA.JS - Episode 1: Ujian Padepokan & Gelanggang Kecamatan
 * v4.0 - Telegraphed Combat, Narrative Bridge, Category Crafting, Location Hub
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
      synopsis: "Sebagai murid yang sering diremehkan di Padepokan Sumbu Jagat, buktikan kemampuan olah napas dan fisik untuk meraih tiket wakil kecamatan.",
      start_location_id: "loc_00_rumah",
      locations: [
        {
          id: "loc_00_rumah",
          name: "Rumah Tua di Tepi Desa",
          category: "hub",
          image: "assets/images/scene_padepokan.webp",
          narrative: "Subuh masih gelap saat kau mengikat tali sepatu butut di beranda rumah panggung warisan nenek. Uap hangat dari teh tubruk yang ia seduh mengambang di udara — satu-satunya kehangatan yang kau punya sebelum meninggalkan desa ini.\n\n\"Raka,\" panggilnya pelan, tangannya yang berkerut menyerahkan sepotong kain merah lusuh. \"Ini handwrap ayahmu. Ia tidak pernah menang di ring — tapi ia tidak pernah pulang dengan punggung membungkuk. Ingat itu.\"\n\nKau menerima kain itu. Bau keringat dan tanah sudah lama pudar, hanya tersisa aroma tembakau dan doa yang tak sempat ia ucapkan.",
          action_options: [
            {
              action_id: "act_terima_handwrap",
              description: "Menerima handwrap ayah dari tangan nenek.",
              category: "hub",
              once: true,
              unlocked_item_id: "item_00",
              outcome: "Kau membungkus kain itu erat di pergelangan tangan kanan. Nenek tersenyum, lalu berbalik masuk ke rumah tanpa berkata lagi. Kau tahu ia menahan tangis.",
              sets_flag: "ep1_has_father_wrap"
            },
            {
              action_id: "act_berangkat_padepokan",
              description: "Berjalan menyusuri jalan setapak menuju Padepokan Sumbu Jagat.",
              category: "exploration",
              next_location_id: "loc_01_padepokan",
              transition_text: "Kabut subuh mengikuti langkahmu sepanjang jalan setapak berbatu. Sawah-sawah masih diam, hanya suara katung yang menyambut. Setiap langkah membawa kau lebih jauh dari rumah — lebih dekat ke sesuatu yang kau sendiri belum tahu bentuknya.\n\nSaat gerbang Padepokan Sumbu Jagat muncul di kejauhan, dadamu berdebar. Bukan karena gugup. Karena kau sadar: mulai detik ini, kau tidak bisa pulang dengan tangan kosong."
            }
          ]
        },
        {
          id: "loc_01_padepokan",
          name: "Ruang Utama Padepokan Sumbu Jagat",
          category: "hub",
          image: "assets/images/scene_padepokan.webp",
          rest_available: true,
          narrative: "Aroma kemenyan tipis mengepul dari anglo di sudut ruangan, bercampur bau keringat dan minyak serai yang sudah bertahun-tahun meresap ke dinding kayu jati. Di atas lantai yang licin mengilap, kau berdiri — murid paling tidak dikenal di Padepokan Sumbu Jagat.\n\nEyang Suryo duduk bersila di tikar pandan, punggung setegak tombak meski usia sudah senja. Matanya setengah terpejam, tapi kau tahu ia mengamati setiap tarikan napasmu. Di ambang pintu, Danu bersandar dengan tangan menyilang. \"Murid kesayangan tidak akan datang menjemputmu,\" katanya tanpa menatap. \"Kau yang harus datang pada mereka.\"",
          action_options: [
            {
              action_id: "act_bersujud_eyang",
              description: "Bersujud memohon restu Eyang Suryo.",
              category: "hub",
              once: true,
              unlocked_item_id: "item_01",
              stat_changes: { stat2: 8 },
              sets_flag: "ep1_has_blessing",
              outcome: "Eyang Suryo membuka mata. Untuk sesaat, tatapannya tidak lagi kabur oleh usia. \"Kau bukan yang terkuat, bukan yang tercepat. Tapi kau satu-satunya yang berani bersujud tanpa mengharap balasan.\" Ia menyodorkan kitab tipis yang sudah usang. \"Baca ini. Jangan dihafal — diresapi.\""
            },
            {
              action_id: "act_eyang_lore",
              description: "Bertanya pada Eyang tentang asal-usul Sumbu Jagat.",
              category: "hub",
              once: true,
              stat_changes: { stat2: 5 },
              outcome: "Eyang tersenyum tipis. \"Sumbu Jagat bukan nama. Ia cara pandang. Sumbu — poros — yang tidak bergerak meski dunia berputar. Kau akan mengerti nanti, saat ring sudah mulai memanggil namamu.\""
            },
            {
              action_id: "act_ke_pelataran",
              description: "Menuju pelataran untuk latihan fisik.",
              category: "exploration",
              next_location_id: "loc_02_pelataran",
              transition_text: "Kau melangkah keluar dari ruang utama. Kemenyan berubah menjadi bau tanah dan seng panas. Di pelataran, sinar matahari sore menyorot sandbag yang bergoyang pelan. Beberapa murid junior berhenti berlatih saat melihatmu — bukan karena hormat, tapi karena ingin melihat apakah kau akan dipermalukan hari ini."
            },
            {
              action_id: "act_ke_dapur",
              description: "Menuju Dapur Herbal untuk belajar meracik jamu.",
              category: "exploration",
              next_location_id: "loc_03_dapur",
              transition_text: "Di ujung koridor padepokan, pintu dapur berderit. Aroma rimpang dan madu menyambutmu — lebih hangat daripada ruang utama. Seorang murid perempuan tua yang biasa dipanggil Mbok Sri sedang menumbuk jahe. Ia mengangguk pelan saat melihatmu."
            }
          ]
        },
        {
          id: "loc_02_pelataran",
          name: "Pelataran Sandbag & Ring Terbuka",
          category: "exploration",
          image: "assets/images/scene_pelataran.webp",
          narrative: "Sinar matahari sore menembus celah atap seng pelataran. Sandbag kulit seberat lima puluh kilogram bergoyang ditiup angin. Di sinilah para murid mengasah ketajaman serangan.\n\nDanu melangkah mendekat sambil memutar handwrap di tangannya. Ia berhenti tiga langkah di hadapanmu, mengetuk dagunya dua kali dengan telunjuk — kebiasaan yang ia lakukan setiap kali mulai serius. \"Kalau kau memang sehebat yang dikatakan Eyang, buktikan di ring ini,\" tantangnya.",
          action_options: [
            {
              action_id: "act_hadapi_danu",
              description: "Naik ke ring dan hadapi Danu dalam uji tanding.",
              category: "arena",
              once: true,
              combat: {
                enemy_name: "Danu",
                enemy_emoji: "🥋",
                intro: "Danu memasang kuda-kuda tinggi — gaya modern, bukan Sumbu Jagat. Ia ingin menunjukkan bahwa padepokan ini tidak lagi hanya milik orang-orang tua. Beberapa murid junior menahan napas, menonton dari tepi ring.",
                rounds: [
                  {
                    round: 1,
                    telegraph: "Bahu kanan Danu menegang. Matanya melirik cepat ke arah rusuk kirimu yang terbuka, sementara kaki kirinya digeser ke belakang untuk memusatkan tumpuan. Napasnya keluar pendek — tanda ia akan melesat cepat, bukan memukul keras.",
                    pattern_hint: "DASH_RIGHT_HOOK",
                    options: [
                      {
                        label: "Membaca tarikan bahu, melangkah ke samping sambil menaikkan siku untuk menangkis.",
                        correct_for: "DASH_RIGHT_HOOK",
                        outcome: "Kau melangkah ke samping tepat saat Danu melesat. Hook-nya hanya menyayat udara. Siku kirimu menyentuh rusuknya sebagai peringatan — cukup untuk membuatnya mundur sejengkal dan menatapmu dengan mata berbeda.",
                        stat_changes: { stat1: -3, stat3: 5 }
                      },
                      {
                        label: "Menerjang lurus dengan kombinasi pukulan untuk memukul lebih dulu.",
                        correct_for: null,
                        outcome: "Kau menerjang. Danu sudah membaca. Hook kanannya menghantam rahangmu dari samping sebelum pukulanmu sampai. Dunia berputar sedikit — kau merasakan logam di ujung lidah.",
                        stat_changes: { stat1: -18, stat2: -5 },
                        debuff: { name: "Rahang Terbuka" },
                        vibrate: true
                      },
                      {
                        label: "Berpura-pura goyah di kaki kiri, mengundang Danu menyerang.",
                        required_stat: { stat2: 45 },
                        correct_for: "DASH_RIGHT_HOOK",
                        outcome: "Kau sengaja menggeser berat badan seolah kehilangan keseimbangan. Danu termakan. Saat ia melesat, kau sudah berputar ke belakangnya dan menepis punggungnya dengan telapak tangan terbuka. Ia terhuyung ke tali ring. Murid junior bersorak kecil.",
                        stat_changes: { stat2: -8, stat3: 8 }
                      }
                    ]
                  },
                  {
                    round: 2,
                    telegraph: "Danu menarik napas panjang. Kakinya kini melebar — tumpuan rendah, bukan untuk menyerang tapi untuk menahan. Tangannya di depan wajah, siku rapat. Ia beralih ke pertahanan. Ini strategi murid yang pernah kau kalahkan sekali: biarkan lawan lelah, lalu habisi.",
                    pattern_hint: "DEFENSIVE_WAIT",
                    options: [
                      {
                        label: "Menembus pertahanan dengan pukulan lurus pendek ke celah antara siku dan dagu.",
                        correct_for: "DEFENSIVE_WAIT",
                        outcome: "Kau meluncurkan pukulan lurus pendek yang sempit — persis ke celah antara siku dan dagu Danu. Kepalanya tersentak ke belakang. Matanya membelalak; ia tidak menyangka celah sekecil itu bisa kau tembus.",
                        stat_changes: { stat2: -3, stat3: 8 }
                      },
                      {
                        label: "Mundur dan tunggu Danu menyerang lebih dulu.",
                        correct_for: null,
                        outcome: "Kau mundur, tapi Danu tidak menyerang — ia justru mengendurkan bahunya. Napasmu mulai memburu. Kau baru sadar: ia sengaja membuatmu lelah dengan menunggu. Qi-mu mengendur tanpa kau sadari.",
                        stat_changes: { stat2: -10 }
                      },
                      {
                        label: "Berteriak mengejutkan sambil melancarkan tendangan samping.",
                        correct_for: "DEFENSIVE_WAIT",
                        outcome: "Teriakanmu memecah konsentrasi Danu sepersekian detik. Cukup. Tendangan sampingmu menghantam tulang rusuknya. Ia terhuyung — dan kau melihat sesuatu di matanya yang belum pernah kau lihat: rasa hormat.",
                        stat_changes: { stat1: -5, stat3: 12 }
                      }
                    ]
                  },
                  {
                    round: 3,
                    telegraph: "Danu menghela napas panjang, lalu tersenyum tipis. Kaki kirinya maju, tangan kanan terangkat setinggi dagu — ini bukan serangan, tapi ajakan. Ia ingin uji terakhir: siapa yang lebih dulu berkedip. Bahu kanannya sudah rileks. Ia tidak akan menyerang.",
                    pattern_hint: "STANDOFF",
                    options: [
                      {
                        label: "Menatap matanya, menurunkan tangan sedikit, dan mengangguk sebagai penghormatan.",
                        correct_for: "STANDOFF",
                        outcome: "Danu mengangguk balik. \"Kau bukan yang terkuat,\" katanya pelan, \"tapi kau tidak menyilaukan mata dengan amarah. Aku bisa belajar dari itu.\" Ia melepas handwrapnya dan menyerahkannya padamu — tanda hormat antarpetarung.",
                        stat_changes: { stat3: 15 },
                        unlocked_item_id: "item_04"
                      },
                      {
                        label: "Memanfaatkan momen untuk melancarkan serangan pamungkas.",
                        correct_for: null,
                        outcome: "Kau menerjang saat Danu lengah. Tapi ia sudah menduga — karena kau tidak menghormati ajakannya. Siku kirinya menghantam pelipismu. Kau terjatuh, dan saat kau bangun, Danu sudah berbalik pergi. Rasa malu lebih menyakitkan dari memarnya.",
                        stat_changes: { stat1: -12, stat2: -15, stat3: -8 },
                        vibrate: true
                      },
                      {
                        label: "Tersenyum, menurunkan tangan, dan mengajaknya berlatih bersama setelah ini.",
                        required_stat: { stat2: 55 },
                        correct_for: "STANDOFF",
                        outcome: "Danu terdiam sejenak — lalu tertawa, tawa pertama yang pernah kau dengar darinya. \"Kau ini aneh,\" katanya. Tapi ia menerima uluran tanganmu. Untuk pertama kali, kalian berpisah bukan sebagai senior dan junior, tapi sebagai dua petarung.",
                        stat_changes: { stat3: 20, stat2: 5 },
                        sets_flag: "ep1_danu_friendship"
                      }
                    ]
                  }
                ],
                victory: {
                  outcome: "Pertarungan usai. Kau masih berdiri. Pelataran sunyi selama beberapa detik — lalu murid junior bertepuk tangan. Danu, meski masih terengah, mengangkat tangannya untuk memberi hormat. Sesuatu berubah di padepokan ini.",
                  stat_changes: { stat3: 10 },
                  sets_flag: "ep1_defeated_danu"
                },
                defeat: {
                  outcome: "Kau terkapar di lantai kayu. Danu berdiri di atasmu, napasnya juga memburu — tapi ia menundukkan kepala. \"Belum cukup,\" katanya, bukan dengan ejekan, tapi dengan suara seorang senior yang mengingatkan. \"Tapi kau tidak buruk. Coba lagi nanti.\"",
                  stat_changes: { stat1: -15 }
                }
              }
            },
            {
              action_id: "act_latihan_sandbag",
              description: "Berlatih memukul sandbag hingga buku jari memerah.",
              category: "hub",
              once: true,
              stat_changes: { stat1: -3, stat2: 5 },
              outcome: "Kau memukul sandbag hingga lengan serasa lumpuh. Tapi di sela-sela rasa sakit itu, kau merasakan ritme — tarikan otot, dorongan pinggul, hembusan napas. Tubuhmu mulai mengingat sesuatu yang belum pernah diajarkan."
            },
            {
              action_id: "act_kembali_padepokan",
              description: "Kembali ke ruang utama Padepokan.",
              category: "hub",
              next_location_id: "loc_01_padepokan",
              transition_text: "Kau melangkah kembali ke dalam padepokan saat senja mulai turun. Bau kemenyan menyambut, seperti pelukan yang tidak pernah kau minta tapi selalu kau butuhkan."
            }
          ]
        },
        {
          id: "loc_03_dapur",
          name: "Dapur Herbal & Racikan Jamu",
          category: "hub",
          image: "assets/images/scene_dapur.webp",
          rest_available: true,
          narrative: "Dapur padepokan dipenuhi kuali perunggu berasap tipis. Rimpang jahe merah, kunyit tua, dan dedaunan kering tergantung di papan kayu. Di rak bawah, botol-botol madu hutan dan minyak urut tertata rapi.\n\nDi dinding, Guru Tua menempelkan catatan tua dengan tulisan tangan yang sudah memudar: \"Yang pahit menyembuhkan luka. Yang manis memberi tenaga. Yang licin melindungi sendi.\" — sepertinya petunjuk untuk murid yang mau belajar meracik. Mbok Sri, perempuan tua penjaga dapur, tersenyum melihatmu membaca.",
          action_options: [
            {
              action_id: "act_ambil_bahan_jamu",
              description: "Mengambil Jahe Merah dan Madu Hutan dari rak kayu.",
              category: "hub",
              once: true,
              unlocked_item_ids: ["item_02", "item_03"],
              outcome: "Mbok Sri mengangguk pelan. \"Jahe dan madu. Yang pahit dan yang manis. Kau sudah baca catatan Eyang, ya? Bagus. Sebagian besar murid bahkan tidak menyadari itu petunjuk.\" Ia menyerahkan rimpang dan botol madu ke tanganmu."
            },
            {
              action_id: "act_ambil_minyak",
              description: "Mengambil Minyak Urut Cimande untuk perlindungan sendi.",
              category: "hub",
              once: true,
              unlocked_item_id: "item_05",
              outcome: "Mbok Sri menyemprotkan sedikit minyak ke pergelangan tanganmu. Wanginya tajam — kayu putih, cengkeh, dan sesuatu yang tidak kau kenal. \"Oleskan sebelum bertarung. Yang licin melindungi sendi.\""
            },
            {
              action_id: "act_mbok_hint",
              description: "Bertanya pada Mbok Sri tentang resep jamu yang lebih kuat.",
              category: "hub",
              once: true,
              stat_changes: { stat2: 5 },
              outcome: "\"Jamu stamina?\" Mbok Sri tersenyum. \"Jahe merah plus madu hutan. Yang pahit menyembuhkan, yang manis memberi tenaga. Rakit di meja rakit kapan pun kau mau.\" Ia menunjuk ke sudut dapur. \"Jangan takut — yang gagal cuma bikin lidah pahit, bukan mati.\""
            },
            {
              action_id: "act_kembali_dari_dapur",
              description: "Kembali ke ruang utama Padepokan.",
              category: "hub",
              next_location_id: "loc_01_padepokan",
              transition_text: "Kau meninggalkan dapur dengan tas yang lebih berat. Bau rimpang menempel di pakaianmu — bau yang akan kau bawa sampai ring nanti."
            },
            {
              action_id: "act_ke_pasar",
              description: "Berjalan menyusuri gang sempit menuju gelanggang pasar malam.",
              category: "exploration",
              next_location_id: "loc_04_pasar_malam",
              transition_text: "Kau melangkah keluar dari padepokan saat senja mulai memerah. Bau kemenyan berubah menjadi bau gorengan dan asap knalpot. Gang sempit di antara rumah-rumah penduduk membawa kau ke jantung kota kecamatan — tempat di mana hukum bukan ditentukan wasit, melainkan penonton yang memegang uang.\n\nSetiap langkah terasa lebih berat. Bukan karena fisik — tapi karena kau tahu, di pasar malam ini, kau bukan murid padepokan lagi. Kau hanya petarung tak bernama yang harus membuktikan diri di atas ring kain yang berlumur darah orang lain."
            }
          ]
        },
        {
          id: "loc_04_pasar_malam",
          name: "Gelanggang Underground Pasar Malam",
          category: "exploration",
          image: "assets/images/scene_pasarmalam.webp",
          narrative: "Sorak sorai penonton dan aroma minyak jelantah membaur di arena ring kain yang dipasang di tengah Pasar Malam. Ini arena tak resmi di mana para petarung jalanan menguji mental.\n\nDi seberang, seorang pria berjas mahal bersandar di mobil hitam, mengamati dari kejauhan. Kau tidak mengenalnya — tapi kau tahu tipe orang seperti itu: orang yang tidak pernah kotor tangannya sendiri. Seorang preman bertato tengah memanaskan otot di dalam ring. Perantara berjas lusuh mendekatimu dan berbisik, \"Nak, ini bukan tempat anak padepokan. Kecuali kau mau main denganku dulu.\"",
          action_options: [
            {
              action_id: "act_hadapi_preman",
              description: "Naik ke ring dan hadapi preman pasar.",
              category: "arena",
              once: true,
              combat: {
                enemy_name: "Preman Pasar",
                enemy_emoji: "💢",
                intro: "Preman itu lebih besar darimu — bekas luka di alisnya bercerita tentang puluhan perkelahian jalanan. Ia tidak memasang kuda-kuda. Ia hanya berdiri, tangan rileks, seperti sedang menunggu bus. Namun matanya tidak pernah berkedip dari dagumu.",
                rounds: [
                  {
                    round: 1,
                    telegraph: "Preman itu mengangkat bahu kanannya sedikit — bukan tarikan penuh, hanya setengah. Matanya turun ke dadamu. Kaki kanannya bergeser satu langkah ke samping, memutar tubuhnya sedikit. Ini bukan pukulan; ini ancang-ancang untuk menerjang dan menubruk.",
                    pattern_hint: "TACKLE_RIGHT",
                    options: [
                      {
                        label: "Menunggu, lalu melompat mundur saat ia menerjang dan menyikut bagian belakang lehernya.",
                        correct_for: "TACKLE_RIGHT",
                        outcome: "Preman itu menerjang seperti banteng. Kau melompat mundur, membiarkannya menubruk udara dan menabrak tali ring. Saat ia bangkit, siku kirimu sudah menemukan bagian belakang lehernya. Ia jatuh tersungkur, menggeram.",
                        stat_changes: { stat1: -5, stat3: 8 }
                      },
                      {
                        label: "Menerjang balik dengan pukulan kombinasi.",
                        correct_for: null,
                        outcome: "Tubuh besar itu menabrakmu seperti truk. Kau terlempar ke tali ring. Napasmu tercekat. Saat kau bangkit, ia sudah bersiap menerjang lagi.",
                        stat_changes: { stat1: -22, stat2: -8 },
                        debuff: { name: "Napas Sesak" },
                        vibrate: true
                      },
                      {
                        label: "Berdiri tegak, tatap matanya, dan beri isyarat agar ia datang lebih dulu.",
                        required_stat: { stat2: 50 },
                        correct_for: "TACKLE_RIGHT",
                        outcome: "Preman itu tertegun sepersekian detik — bahasa tubuh yang tidak ia duga. Saat ia menerjang, kau sudah siap. Lehernya kau tangkap dengan lengan, dan kau berputar, membantingnya ke kanvas. Penonton bersorak histeris.",
                        stat_changes: { stat2: -8, stat3: 15 }
                      }
                    ]
                  },
                  {
                    round: 2,
                    telegraph: "Preman itu bangkit dengan tatapan berbeda. Kini ia lebih waspada. Tangan kanannya menggantung rendah, siap memukul kearah perut — khas tinju jalanan, tanpa teknik tapi mematikan. Bahunya sedikit miring ke kiri. Ia akan memulai dengan pukulan badan.",
                    pattern_hint: "BODY_HOOK_LEFT",
                    options: [
                      {
                        label: "Memutar pinggul ke kanan, menurunkan siku kiri untuk menahan badan, dan melancarkan pukulan atas ke dagunya.",
                        correct_for: "BODY_HOOK_LEFT",
                        outcome: "Pukulan badannya menghantam sikumu, bukan perutmu. Saat ia terkejut, pukulan atasmu meluncur ke dagunya. Preman itu terhuyung ke tali ring — kali ini tidak bangkit cepat. Matanya mulai berkunang.",
                        stat_changes: { stat1: -5, stat3: 10 }
                      },
                      {
                        label: "Menangkis dengan lengan terbuka dan menyerang balik dengan tendangan.",
                        correct_for: null,
                        outcome: "Pukulan badannya tetap masuk. Napasmu tercekat, dan tendanganmu melebar. Ia masih berdiri — dan sekarang ia tahu kau sedang kesakitan.",
                        stat_changes: { stat1: -15, stat2: -5 }
                      },
                      {
                        label: "Bersiaga penuh, menunggu ia menghabiskan tenaga.",
                        required_stat: { stat2: 60 },
                        correct_for: "BODY_HOOK_LEFT",
                        outcome: "Preman itu melepaskan pukulan badannya — dan kau hanya bergeser sedikit, cukup untuk membuatnya meleset. Ia memukul lagi. Kau bergeser lagi. Setelah empat pukulan, napasnya memburu. Saat itulah kau meluncurkan serangan pamungkas. Ia tidak bangun lagi.",
                        stat_changes: { stat2: -10, stat3: 12 }
                      }
                    ]
                  }
                ],
                victory: {
                  outcome: "Preman itu tidak bangkit. Ring kain sunyi sejenak — lalu sorak penonton memecah udara. Perantara berjas lusuh mendekatimu dengan wajah pucat, menyodorkan kertas lusuh. \"Tiket seleksi GOR,\" katanya cepat. \"Jangan tanya dari mana. Ambil dan pergi.\"",
                  unlocked_item_id: "item_11",
                  stat_changes: { stat3: 20 },
                  sets_flag: "ep1_refused_bribe"
                },
                defeat: {
                  outcome: "Kau terkapar di kanvas kotor. Preman itu meludah di sampingmu, lalu berbalik ke perantara. Kau mendengar mereka tertawa. Tapi saat kau bangkit, salah seorang penonton tua berbisik: \"Anak padepokan, ya? Aku lihat usahamu. Coba lagi besok — perantara itu selalu di sini.\"",
                  stat_changes: { stat1: -20 }
                }
              }
            },
            {
              action_id: "act_terima_suplemen",
              description: "Menerima botol jamu oplosan dari perantara tanpa bertarung.",
              category: "arena",
              once: true,
              stat_changes: { stat1: -20, stat2: -30, stat3: -20 },
              unlocked_item_id: "item_10",
              sets_flag: "ep1_took_doping",
              outcome: "Botol itu dingin di tanganmu. Kau menenggaknya — dan beberapa detik kemudian, jantungmu berdebar terlalu cepat. Bukan kekuatan. Ini racun. Kau muntah di sudut gang. Perantara tertawa dan berlalu. Reputasimu sebagai murid padepokan tercoreng di mata penonton yang melihat."
            },
            {
              action_id: "act_ke_warung",
              description: "Beristirahat di warung kopi pinggir pasar.",
              category: "hub",
              next_location_id: "loc_04b_warung",
              transition_text: "Kau meninggalkan ring dan menyusuri lorong pasar yang sesak. Di ujung, warung kopi tua dengan lampu kuning temaram. Beberapa orang tua duduk di bangku panjang, mengobrol pelan. Di sini kau bisa menenangkan diri."
            },
            {
              action_id: "act_ke_gor",
              description: "Menuju GOR Kejuaraan Seleksi Kecamatan.",
              category: "arena",
              required_item_id: "item_11",
              next_location_id: "loc_05_gor",
              transition_text: "Dengan tiket di tangan, kau berjalan menuju GOR. Di sepanjang jalan, poster-poster nama juara bertahan menatapmu dari dinding. Malam ini, salah satu dari mereka akan melawanmu — atau kau akan pulang tanpa pernah masuk ring."
            }
          ]
        },
        {
          id: "loc_04b_warung",
          name: "Warung Kopi Pinggir Pasar",
          category: "hub",
          image: "assets/images/scene_pasarmalam.webp",
          rest_available: true,
          narrative: "Warung kopi ini seperti potret masa lalu: bangku kayu panjang, meja marmer retak, dan radio tua yang menyala samar. Di sudut, sekelompok pria tua bermain kartu sambil mengobrol tentang juara kecamatan tahun lalu.\n\nDi luar, kau sempat melihat pria berjas mahal dari ring tadi masuk ke mobil hitam. Salah satu pria tua mengikut arah pandangmu. \"Itu Broto,\" katanya pelan. \"Bandar. Dia selalu mencari petarung muda yang bisa dia beli. Hati-hati, Nak.\"",
          action_options: [
            {
              action_id: "act_dengar_broto",
              description: "Duduk dekat orang tua itu dan dengarkan cerita tentang Broto.",
              category: "hub",
              once: true,
              stat_changes: { stat2: 8 },
              sets_flag: "ep1_knows_broto",
              outcome: "\"Broto tidak pernah kalah,\" kata orang tua itu. \"Bukan karena ia kuat — karena ia selalu punya dua kuda. Kalau kau tolak suapnya, ia sewa orang untuk menghancurkanmu. Kalau kau terima, ia punya bukti untuk memerasmu seumur hidup.\" Ia menyeruput kopinya. \"Ingat wajahnya. Suatu hari kau akan melihatnya lagi.\""
            },
            {
              action_id: "act_beli_kopi",
              description: "Memesan kopi tubruk dan duduk menenangkan diri.",
              category: "hub",
              once: true,
              stat_changes: { stat2: 5, stat1: 5 },
              outcome: "Kopi tubruk itu pahit — persis seperti yang biasa nenek buat. Untuk sesaat, kau merasa seperti pulang."
            },
            {
              action_id: "act_kembali_pasar",
              description: "Kembali ke gelanggang pasar malam.",
              category: "exploration",
              next_location_id: "loc_04_pasar_malam",
              transition_text: "Kau kembali ke gelanggang. Sorak penonton masih terdengar — pertarungan malam belum berakhir. Tapi kau sudah tahu apa yang harus kau lakukan."
            }
          ]
        },
        {
          id: "loc_05_gor",
          name: "GOR Kejuaraan Seleksi Kecamatan",
          category: "arena",
          image: "assets/images/scene_gor.webp",
          narrative: "Lampu sorot kuning menerangi Ring Octagon GOR Kecamatan. Ratusan penonton memadati tribun kayu. Ini arena resmi pertama menuju jenjang karir nasional.\n\nDi sudut merah, sang Juara Bertahan Kecamatan berdiri dengan tenang — terkenal dengan tendangan melingkar cepatnya. Ia tidak tersenyum, tidak melotot. Hanya menatap. Wasit memberi sinyal pertarungan final dimulai.",
          action_options: [
            {
              action_id: "act_hadapi_juara",
              description: "Naik ke ring dan hadapi Juara Bertahan Kecamatan.",
              category: "arena",
              once: true,
              combat: {
                enemy_name: "Juara Bertahan Kecamatan",
                enemy_emoji: "🥇",
                intro: "Ia melangkah ke tengah ring dengan langkah pendek, hati-hati, seperti kucing. Tidak ada provokasi. Tidak ada senyum. Ini petarung yang sudah sering menang — dan tahu bahwa kemenangan datang dari sabar, bukan dari amarah.",
                rounds: [
                  {
                    round: 1,
                    telegraph: "Kakinya bergerak maju dengan langkah kecil, hampir tanpa suara. Bahu kirinya naik sedikit — bukan untuk menyerang, tapi untuk mengalihkan perhatian. Matanya tidak lepas dari perutmu. Ia akan mencoba tendangan melingkar dari arah yang tidak kau duga.",
                    pattern_hint: "SPIN_KICK_RIGHT",
                    options: [
                      {
                        label: "Mundur satu langkah, angkat kedua tangan setinggi telinga, dan siap menangkap kakinya.",
                        correct_for: "SPIN_KICK_RIGHT",
                        outcome: "Tendangan melingkarnya menghantam lenganmu, bukan kepalamu. Kau menangkap pergelangan kakinya dan mendorongnya ke samping. Ia terhuyung — dan untuk sesaat, ekspresinya berubah. Ia tidak menduga kau bisa membaca tendangannya.",
                        stat_changes: { stat1: -5, stat3: 10 }
                      },
                      {
                        label: "Menerjang masuk dengan kombinasi pukulan badan.",
                        correct_for: null,
                        outcome: "Kau menerjang tepat saat kakinya melingkar. Tumitnya menghantam pelipismu. Dunia berputar — kau mendengar suara wasit menghitung dari kejauhan.",
                        stat_changes: { stat1: -25, stat2: -12 },
                        debuff: { name: "Pelipis Berdarah" },
                        vibrate: true
                      },
                      {
                        label: "Menunggu tendangan, membaca arah, lalu melangkah memutar ke punggungnya.",
                        required_stat: { stat2: 60 },
                        correct_for: "SPIN_KICK_RIGHT",
                        outcome: "Tendangan melingkarnya meleset total saat kau sudah berputar ke belakangnya. Kau mendorong punggungnya — ia tersandung ke tali ring. Penonton bersorak histeris: juara mereka goyah!",
                        stat_changes: { stat2: -10, stat3: 15 }
                      }
                    ]
                  },
                  {
                    round: 2,
                    telegraph: "Ia tidak lagi meremehkanmu. Kini ia memasang kuda-kuda lebar, kedua tangan rendah. Matanya menyapu seluruh tubuhmu — ini bukan lagi serangan tunggal. Ia akan melancarkan kombinasi: dua pukulan cepat, lalu tendangan rendah. Kakinya sudah siap melompat.",
                    pattern_hint: "COMBO_LOW_KICK",
                    options: [
                      {
                        label: "Menarik kaki belakang, menurunkan siku, dan bersiap menahan tendangan rendah sambil mengincar wajahnya.",
                        correct_for: "COMBO_LOW_KICK",
                        outcome: "Dua pukulannya kau tahan di lengan. Tendangan rendahnya menghantam sikumu — bukan tulang keringmu. Saat ia menarik kaki, kau meluncurkan pukulan lurus ke dagunya. Kepalanya tersentak. Darah mulai mengalir dari hidungnya.",
                        stat_changes: { stat1: -8, stat3: 12 }
                      },
                      {
                        label: "Berusaha memotong kombinasi dengan hook kiri di awal.",
                        correct_for: null,
                        outcome: "Hook-mu meleset. Kombinasinya masuk: dua pukulan ke perut, tendangan rendah ke betis. Kaki kananmu lemas. Kau terjatuh ke satu lutut.",
                        stat_changes: { stat1: -22, stat2: -8 },
                        debuff: { name: "Kaki Gemetar" },
                        vibrate: true
                      },
                      {
                        label: "Berteriak untuk memecah konsentrasinya, lalu melancarkan serangan balik.",
                        required_stat: { stat2: 50 },
                        correct_for: "COMBO_LOW_KICK",
                        outcome: "Teriakanmu menghentikan kombinasi di tengah jalan. Kau melancarkan serangan balik — pukulan atas ke dagu, disusul pukulan badan. Ia terhuyung ke tali. Penonton bersorak: juara mereka di ambang kekalahan!",
                        stat_changes: { stat1: -5, stat3: 15 }
                      }
                    ]
                  },
                  {
                    round: 3,
                    telegraph: "Ia berdiri tegak, membiarkan tangannya menggantung. Wajahnya sudah tidak tenang. Kakinya berat. Ia mengangkat tangan kanan tinggi — terlalu tinggi, terlalu lebar. Ini pukulan pamungkas: hook kanan yang ia lepaskan saat kehabisan akal. Matanya berkedip dua kali sebelum menyerang.",
                    pattern_hint: "DESPERATE_HOOK",
                    options: [
                      {
                        label: "Melangkah maju, mengambil posisi dalam, dan menangkis hook dengan tangan kiri sambil memutar tubuh untuk serangan balik.",
                        correct_for: "DESPERATE_HOOK",
                        outcome: "Hook-nya meleset saat kau sudah masuk ke dalam. Tangan kirimu menangkis, dan tubuhmu berputar. Pukulan balikmu menghantam dagunya dari arah yang tidak ia duga. Ia terlempar ke tali ring. Wasit mulai menghitung. Penonton berdiri.",
                        stat_changes: { stat3: 20 }
                      },
                      {
                        label: "Menghindar mundur dan biarkan ia menghabiskan tenaga.",
                        correct_for: null,
                        outcome: "Kau mundur, tapi hook-nya masih menyentuh pelipismu. Tidak telak, tapi cukup untuk membuatmu kehilangan keseimbangan. Ia melihat celah itu dan menerjang lagi.",
                        stat_changes: { stat1: -12, stat2: -10 }
                      },
                      {
                        label: "Berdiri tegak, menatap matanya, dan memberi isyarat agar ia menyerang dengan seluruh tenaga.",
                        required_stat: { stat2: 65 },
                        correct_for: "DESPERATE_HOOK",
                        outcome: "Kau membuka tangan, mempersilakan. Ia menyerang dengan seluruh tenaga — hook kanan yang mematikan. Tapi kau sudah membaca arahnya. Satu langkah ke samping, satu putaran pinggul, dan siku kananmu menghantam rahangnya. Ia jatuh tak sadarkan diri. Penonton meledak.",
                        stat_changes: { stat2: -15, stat3: 30 }
                      }
                    ]
                  }
                ],
                victory: {
                  outcome: "Tubuh Juara Bertahan terhempas ke kanvas! Wasit mengangkat tanganmu tinggi-tinggi di tengah gemuruh sorak-sorai. Kau melihat Eyang Suryo berdiri di tribun — ia mengangguk pelan. Kau resmi menjadi JUARA KECAMATAN.",
                  trigger_ending_id: "true_ending"
                },
                defeat: {
                  outcome: "Kau terkapar di kanvas. Tendangan melingkar lawan masih terasa di pelipismu. Tapi saat kau bangkit, wasit menggeleng — pertarungan sudah berakhir. Kau kalah angka. Di tribun, Eyang Suryo menutup matanya. Tapi kau melihat tangannya terkepal — bukan karena marah, tapi karena menahan haru. Ia masih percaya padamu.",
                  stat_changes: { stat1: -30, stat3: -10 },
                  sets_flag: "ep1_lost_gor"
                }
              }
            }
          ]
        }
      ],
      items: [
        { id: "item_00", name: "Handwrap Ayah", emoji: "🧣", category: "bukti", description: "Kain merah lusuh pemberian nenek. Bau tembakau dan doa yang tak sempat diucapkan." },
        { id: "item_01", name: "Kitab Napas Sumbu Jagat", emoji: "📜", category: "kitab", description: "Panduan jurus olah napas peningkat Qi. Jangan dihafal — diresapi." },
        { id: "item_02", name: "Rimpang Jahe Merah", emoji: "🫚", category: "herbal", description: "Bahan jamu alami pemulih stamina. Pahit, tapi menyembuhkan." },
        { id: "item_03", name: "Madu Hutan Murni", emoji: "🍯", category: "pelengkap", description: "Ekstrak energi murni penguat daya tahan. Yang manis memberi tenaga." },
        { id: "item_04", name: "Handwrap Serat Pasak", emoji: "🥊", category: "peralatan", description: "Pelindung buku jari untuk efisiensi pukulan. Diberikan sebagai tanda hormat." },
        { id: "item_05", name: "Minyak Urut Cimande", emoji: "🧴", category: "pelengkap", description: "Minyak herbal pereda kram dan memar. Yang licin melindungi sendi." },
        { id: "item_10", name: "Jamu Oplosan Terlarang", emoji: "🧪", category: "bukti", description: "Doping ilegal penghancur karir. Menyimpan racun dan penyesalan." },
        { id: "item_11", name: "Tiket Seleksi GOR Kecamatan", emoji: "🎟️", category: "bukti", description: "Izin resmi bertanding di ajang kecamatan." },
        { id: "item_jamu_stamina", name: "Jamu Pendekar Stamina", emoji: "🍵", category: "konsumabel", description: "Hasil rakit jahe + madu. Memulihkan stamina." }
      ],
      recipes: [
        {
          recipe_id: "rec_jamu_stamina",
          result_item_name: "Jamu Pendekar Stamina",
          required_categories: { herbal: 1, pelengkap: 1 },
          description: "Ramuan pahit-manis pemulih 30 Stamina.",
          reward_stat_changes: { stat1: 30 }
        },
        {
          recipe_id: "rec_jurus_konter",
          result_item_name: "Jurus Konter Sumbu Jagat",
          required_categories: { kitab: 1, peralatan: 1 },
          description: "Kitab napas + pelindung tangan mempertajam respons. +10 Qi.",
          reward_stat_changes: { stat2: 10 }
        }
      ],
      endings: {
        true_ending: {
          title: "TRUE ENDING: Juara Kecamatan & Tiket Kabupaten",
          narrative: "Tangan Anda diangkat tinggi oleh Wasit di tengah sorak gemuruh GOR Kecamatan. Dengan mental baja dan jurus tradisi yang kokoh, Anda memenangkan Sabuk Kejuaraan Kecamatan dan melangkah mantap menuju LIGA KABUPATEN.\n\nEyang Suryo menyalami Anda di tepi ring. \"Kau masih belum menyadari sesuatu,\" katanya pelan. \"Kemenangan ini bukan tentang sabuk. Ini tentang kau yang memilih tidak menjadi Danu, tidak menjadi preman, tidak menjadi Broto. Itu yang membuatmu berbeda.\"",
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
