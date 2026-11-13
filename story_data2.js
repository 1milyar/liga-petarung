/**
 * STORY_DATA2.JS - Episode 2: Kejuaraan Tingkat Kabupaten
 * v4.0 - Dialogue Trap System, Telegraphed Bosses, Flag-Based Danu Reappearance
 */

if (typeof GAME_DATA !== 'undefined' && GAME_DATA.episodes) {
  GAME_DATA.episodes.push({
    id: "ep_02_kabupaten",
    title: "Episode 2: Kejuaraan Kabupaten & Intrik Industri",
    synopsis: "Dunia pertarungan tingkat kabupaten bukan lagi soal tradisi. Bandar judi, match-fixing, dan petarung modern gaya MMA siap menguji integritas.",
    start_location_id: "loc_06_hotel_kabupaten",
    locations: [
      {
        id: "loc_06_hotel_kabupaten",
        name: "Hotel Grand Serayu & Konferensi Pers",
        category: "hub",
        image: "assets/images/scene_hotel.webp",
        narrative: "Lampu kristal menyoroti ballroom Hotel Grand Serayu. Kilatan kamera wartawan dan spanduk raksasa 'Kejuaraan Mutiara Kabupaten' memenuhi ruangan. Kau berdiri di antara nama-nama besar — dan kau tahu, kau bukan siapa-siapa di sini.\n\nSeorang pria berjas mahal — Pak Broto, pengusaha taruhan — mendekatimu dengan seringai yang terlalu lama. Ia menyodorkan koper berisi uang tunai puluhan juta, meminta kau sengaja mengalah di semifinal.",
        narrative_by_flags: {
          ep1_knows_broto: "Lampu kristal menyoroti ballroom. Pak Broto mendekatimu — dan kau mengenali wajahnya dari pasar malam. Pria berjas mahal yang bersandar di mobil hitam. Ia melihat pengakuan di matamu dan tersenyum lebih lebar.\n\n\"Kau sudah tahu siapa aku,\" katanya. \"Bagus. Aku suka orang yang tahu diri. Tiga puluh juta untuk satu ronde kalah. Tidak perlu berdarah-darah.\"",
          ep1_lost_gor: "Lampu kristal menyoroti ballroom. Pak Broto mendekatimu dengan senyum mengasihani. \"Aku melihat pertarunganmu melawan Juara Kecamatan. Kau kalah, tapi kau bertahan tiga ronde penuh. Itu lebih baik dari yang kubayangkan.\"\n\nIa membuka koper berisi uang. \"Kali ini, mainlah aman. Tiga puluh juta untuk satu ronde kalah.\""
        },
        action_options: [
          {
            action_id: "act_broto_meeting",
            description: "Hadapi Pak Broto dan jawab tawarannya.",
            category: "arena",
            once: true,
            dialogue: {
              npc: "Pak Broto",
              npc_personality: "manipulatif",
              micro_expressions: [
                "Ia menyeringai terlalu lama — satu sisi bibir tertarik sedikit, bukan senyum asli.",
                "Jari telunjuknya mengetuk-ngetuk koper: tiga ketukan. Jeda. Tiga ketukan.",
                "Matanya menyapu dari wajahmu ke tasmu, dan sejenak berhenti di handwrap merah di pergelangan tanganmu."
              ],
              narrative: "Pak Broto membuka koper. Uang bertumpuk rapi, wangi kertas baru. 'Tiga puluh juta, Raka. Hanya untuk satu ronde kalah. Tidakkah kau lelah berjuang keras tanpa hasil?' Ia mendorong koper sedikit ke arahmu. Di seberang ruangan, seorang wartawan mengangkat kamera — mungkin untuk foto, mungkin untuk sesuatu yang lain.",
              options: [
                {
                  action_id: "broto_accept",
                  description: "Mengambil uang dan menutup koper dengan senyum tipis.",
                  tone: "tegas",
                  is_trap: true,
                  outcome: "Broto tertawa kecil saat kau berbalik. 'Bagus. Ternyata kau bisa dilatih.' Namun ada nada mengejek di ujung kalimatnya. Ia tidak akan menghormatimu — hanya memakai. Di pintu, kau melihat wartawan menurunkan kameranya. Besok, fotomu akan muncul di koran — dengan caption yang tidak kau pilih.",
                  stat_changes: { stat2: -20, stat3: -15 },
                  unlocked_item_id: "item_20",
                  sets_flag: "ep2_accepted_bribe"
                },
                {
                  action_id: "broto_refuse_direct",
                  description: "Menutup koper dengan dua jari, mendorongnya kembali, dan berkata dengan suara rendah tapi jelas.",
                  tone: "tegas",
                  outcome: "Mata Broto menyipit sepersekian detik — ekspresi asli sebelum topengnya kembali. 'Kau berani,' katanya pelan. Di seberang ruangan, wartawan itu mengangkat kamera lagi — kali ini pasti untuk fotomu.",
                  stat_changes: { stat2: 10, stat3: 25 },
                  unlocked_item_id: "item_21",
                  sets_flag: "ep2_refused_bribe"
                },
                {
                  action_id: "broto_provoke",
                  description: "Mendekat, tersenyum penuh percaya diri, dan berkata keras — cukup keras agar wartawan mendengar, 'Kau takut aku menang bersih, ya, Broto?'",
                  tone: "provokatif",
                  is_trap: true,
                  required_stat: { stat3: 40 },
                  outcome: "Wartawan berbalik. Kamera menyorot. Broto kehilangan senyumnya — ini bukan skenario yang ia bayangkan. Namun di balik senyumnya yang hilang, ada kebencian yang mengeras. Ia tidak akan melupakan ini. Tapi kau juga baru saja membuat dirimu terlihat — untuk baik dan buruk.",
                  stat_changes: { stat2: -5, stat3: 40 },
                  sets_flag: { ep2_refused_bribe: true, broto_humiliated: true }
                },
                {
                  action_id: "broto_silent",
                  description: "Berdiam diri, menatap Broto tanpa ekspresi, dan menunggu ia berbicara lebih dulu.",
                  tone: "stoik",
                  required_stat: { stat2: 70 },
                  outcome: "Sepuluh detik berlalu. Broto mulai mengetuk kopernya lagi — lebih cepat. Ia tidak tahan dengan diam. 'Baiklah,' katanya akhirnya, 'kau punya keberanian yang mahal. Kita lihat apakah kau bisa mempertahankannya.' Ia menutup koper. Wartawan mencatat, tapi tidak ada foto — kau telah memberi mereka cerita yang lebih tenang, lebih kuat.",
                  stat_changes: { stat2: 15, stat3: 20 },
                  unlocked_item_id: "item_21",
                  sets_flag: "ep2_refused_bribe"
                }
              ]
            },
            next_location_id: "loc_07_gym_modern",
            transition_text: "Kau berjalan keluar dari ballroom. Di koridor hotel, pria-pria berjas lain menatapmu — sebagian dengan hormat, sebagian dengan perhitungan. Kau tahu, di kabupaten ini, reputasi adalah mata uang kedua setelah uang."
          },
          {
            action_id: "act_skip_broto",
            description: "Berpaling dari Broto dan berjalan langsung ke Titan Gym.",
            category: "exploration",
            next_location_id: "loc_07_gym_modern",
            transition_text: "Kau tidak menoleh. Langkahmu cepat, tidak tergesa, tapi jelas. Broto tidak mengejarmu — tapi kau merasakan tatapannya menempel di punggung, seperti jarum yang belum menusuk."
          }
        ]
      },
      {
        id: "loc_07_gym_modern",
        name: "Titan Combat Gym",
        category: "hub",
        image: "assets/images/scene_gym.webp",
        rest_available: true,
        narrative: "Dentuman musik elektronik dan dentingan beban besi bergema di Titan Gym. Para atlet dilatih dengan analisis komputer, pengukur detak jantung digital, dan teknik Modern Kickboxing.\n\nDi dinding, layar besar menampilkan rekaman pertarungan legenda MMA. Pelatih gym, pria berotot dengan peluit di lehernya, mendekatimu. 'Kau petarung tradisional, ya? Aku tidak akan mengubah gayamu. Tapi aku bisa mengajarimu membaca pola lawan.'",
        action_options: [
          {
            action_id: "act_belajar_biomekanika",
            description: "Pelajari analisis biomekanika tendangan Kickboxing pada layar simulasi.",
            category: "hub",
            once: true,
            stat_changes: { stat2: 20 },
            unlocked_item_id: "item_22",
            outcome: "Pelatih menunjuk ke layar. 'Lihat titik buta di sini — setiap petarung modern membuka celah ini saat melakukan low-kick. Kalau kau bisa membaca pola ini, kau bisa mengalahkan mereka semua.' Kau mencatat semuanya dengan tangan, bukan dengan HP — pelatih tersenyum melihat itu."
          },
          {
            action_id: "act_beli_handwrap",
            description: "Beli Handwrap Pro Gel dan Suplemen Konsentrat Whey.",
            category: "hub",
            once: true,
            stat_changes: { stat1: 15 },
            unlocked_item_id: "item_23",
            outcome: "Handwrap gel itu dingin di tanganmu, tapi memanas saat dipakai. Pelatih menepuk punggungmu. 'Kau sekarang terlihat seperti petarung modern. Semoga kau masih ingat kau siapa.'"
          },
          {
            action_id: "act_ke_mess",
            description: "Bergerak menuju Mess Atlet Kabupaten.",
            category: "exploration",
            next_location_id: "loc_08_mess_atlet",
            transition_text: "Kau meninggalkan gym saat malam mulai turun. Udara kota kabupaten lebih dingin dari desa — bukan karena cuaca, tapi karena tidak ada yang mengenalmu di sini. Kau hanya satu dari puluhan atlet yang berjuang."
          }
        ]
      },
      {
        id: "loc_08_mess_atlet",
        name: "Mess Atlet & Dapur Nutrisi",
        category: "hub",
        image: "assets/images/scene_mess.webp",
        rest_available: true,
        narrative: "Mess Atlet terasa relatif tenang menjelang malam semifinal. Di dapur mess, rak-rak berisi bubuk protein, madu, dan rempah-rempah tradisional. Beberapa atlet duduk bersila, melakukan peregangan.\n\nDi sudut, seorang pria yang kau kenali duduk sendirian. Danu. Ia tidak lagi memakai seragam padepokan. Wajahnya lebih keras, dan ada bekas luka baru di alisnya.",
        narrative_by_flags: {
          ep1_defeated_danu: "Mess Atlet terasa tenang. Di sudut, seorang pria yang kau kenali duduk sendirian. Danu. Wajahnya lebih keras dari yang kau ingat, dan bekas luka baru di alisnya bercerita tentang pertarungan yang tidak ia menangkan. Ia melihatmu — dan untuk sesaat, ekspresinya berubah.\n\nKau mendengar bisik-bisik: setelah kalah darimu, Danu dipecat dari padepokan. Ia sekarang bertarung untuk siapa pun yang mau membayarnya. Termasuk, mungkin, Broto.",
          ep1_danu_friendship: "Mess Atlet terasa tenang. Danu duduk sendirian di sudut, tapi saat melihatmu, ia tersenyum — senyum pertama yang tulus yang pernah kau lihat darinya. 'Aku menunggumu,' katanya. 'Aku dipecat dari padepokan setelah kalah darimu. Tapi aku tidak menyesal. Aku sekarang bertarung untuk diriku sendiri.'"
        },
        action_options: [
          {
            action_id: "act_danu_reunion",
            description: "Duduk di samping Danu dan berbicara.",
            category: "hub",
            once: true,
            stat_changes: { stat2: 10 },
            outcome: "Danu menatap cangkir kopinya lama sebelum bicara. 'Eyang tidak mengusirku,' katanya pelan. 'Aku yang pergi. Aku tidak bisa tinggal di tempat yang mengingatkanku bahwa aku bukan yang terbaik.' Ia menatapmu. 'Kau akan bertarung melawan Rangga besok. Dia hewan. Jangan coba-coba adu fisik. Baca dia, bukan hadapi dia.'"
          },
          {
            action_id: "act_latihan_napas",
            description: "Latihan napas dalam di selasar malam mess.",
            category: "hub",
            once: true,
            stat_changes: { stat2: 15 },
            outcome: "Kau duduk bersila di selasar. Kota kabupaten berkilau di kejauhan, jauh dari desa dan padepokan. Untuk sesaat, kau merasakan kesepian yang aneh — tapi juga kelegaan. Di sini, tidak ada yang mengenalmu. Kau hanya dirimu sendiri."
          },
          {
            action_id: "act_ke_semifinal",
            description: "Menuju GOR Utama Kabupaten untuk semifinal.",
            category: "arena",
            next_location_id: "loc_09_arena_kabupaten",
            transition_text: "Kau berjalan ke GOR Utama. Lampu-lampu sorot sudah terlihat dari kejauhan. Ribuan penonton sudah memadati tribun. Di udara, kau bisa merasakan sesuatu yang tidak pernah kau rasakan di kecamatan: ketakutan. Bukan ketakutan akan kalah — tapi ketakutan bahwa kau mungkin tidak bisa pulang dengan kepala tegak."
          }
        ]
      },
      {
        id: "loc_09_arena_kabupaten",
        name: "GOR Utama Mutiara Kabupaten (Semifinal)",
        category: "arena",
        image: "assets/images/scene_gorkab.webp",
        narrative: "Tribun GOR Utama padat oleh ribuan penonton. Di sudut merah berdiri 'Rangga Sang Siku Besi' — petarung bayaran yang terkenal dengan gaya Muay Thai tanpa ampun.\n\nIa menatapmu dari seberang ring. Tidak ada provokasi. Tidak ada senyum. Hanya mata dingin yang sudah melihat banyak lawan tumbang di bawah sikunya.",
        narrative_by_flags: {
          ep2_refused_bribe: "Tribun GOR Utama padat. Rangga menatapmu dengan kebencian murni — bukan kebencian seorang petarung, tapi kebencian seseorang yang dibayar untuk membencimu. 'Kau mempermalukan Broto,' desisnya. 'Aku akan membuatmu menyesal.'",
          ep2_accepted_bribe: "Tribun GOR Utama padat. Rangga menatapmu dengan jijik. 'Jadi kau yang terima suap itu? Dasar anjing. Aku akan menghajarmu sampai kau lupa nama sendiri — dan Pak Broto tidak akan protes.' Rupanya Broto memasang dua kuda: menyuapmu DAN menyewa Rangga."
        },
        action_options: [
          {
            action_id: "act_hadapi_rangga",
            description: "Naik ke ring dan hadapi Rangga Sang Siku Besi.",
            category: "arena",
            once: true,
            required_item_id: "item_22",
            combat: {
              enemy_name: "Rangga Sang Siku Besi",
              enemy_emoji: "💢",
              intro: "Rangga memutar bahu kirinya perlahan, seperti melonggarkan sendi. Kaki kanannya mulai menggeser ke depan, tumpuan memusat di bola kaki — posisi siap untuk tendangan rendah. Napasnya keluar pendek, dua kali, sebelum masuk panjang. Ia tidak akan membiarkanmu membaca dia.",
              rounds: [
                {
                  round: 1,
                  telegraph: "Rangga memutar bahu kirinya perlahan, seperti melonggarkan sendi. Namun matanya tidak berkedip dari arah lutut kananmu. Kaki kanannya mulai menggeser ke depan, tumpuan memusat di bola kaki — posisi siap untuk tendangan rendah. Napasnya keluar pendek, dua kali, sebelum masuk panjang.",
                  pattern_hint: "LOW_KICK_RIGHT",
                  options: [
                    {
                      label: "Menarik kaki kanan ke belakang, memutar pinggul ke kiri, dan menghadirkan siku untuk menangkis ke arah tulang kering musuh yang datang.",
                      correct_for: "LOW_KICK_RIGHT",
                      outcome: "Tulang kering Rangga menghantam ujung siku Anda. Bunyi berdebam — bukan tulang Anda yang bergetar, tapi tulang kakinya. Ia menyeringai menahan sakit dan melompat mundur. Anda memenangkan momentum.",
                      stat_changes: { stat1: -5, stat2: 3, stat3: 5 }
                    },
                    {
                      label: "Menerjang lurus dengan kombinasi hook kiri-kanan, mengandalkan kecepatan.",
                      correct_for: null,
                      outcome: "Tendangan rendah Rangga mendarat lebih dulu di betis kanan Anda. Bunyi 'BRAK' memenuhi GOR. Kaki Anda lemas, dan Anda terjatuh ke satu lutut di hadapan sang juara.",
                      stat_changes: { stat1: -28, stat2: -12 },
                      debuff: { name: "Kaki Gemetar" },
                      vibrate: true
                    },
                    {
                      label: "Berpura-pura goyah di kaki kiri, membiarkan bahu kanan terbuka — undang tendangan datang. Siapkan Qi untuk melesat ke samping pada detik terakhir.",
                      required_stat: { stat2: 55 },
                      correct_for: "LOW_KICK_RIGHT",
                      outcome: "Rangga termakan umpan. Tendangannya meluncur ke arah kosong saat Anda sudah berputar ke belakangnya. Dengan satu dorongan punggung, ia terhuyung ke tali ring. Penonton bersorak melihat juara mereka goyah.",
                      stat_changes: { stat2: -10, stat3: 12 }
                    }
                  ]
                },
                {
                  round: 2,
                  telegraph: "Rangga tidak lagi tersenyum. Kini ia memasang kuda-kuda Muay Thai klasik: kaki depan ringan, kaki belakang jadi tumpuan utama. Siku kanannya terangkat sedikit, dan bahu kirinya berputar ke depan. Ini pola serangan siku terbang — ia ingin mematahkan pertahananmu dengan satu hantaman brutal.",
                  pattern_hint: "FLYING_ELBOW_LEFT",
                  options: [
                    {
                      label: "Mundur selangkah, angkat kedua lengan tinggi, dan biarkan siku kirinya menghantam pelindung lengan — bukan kepala.",
                      correct_for: "FLYING_ELBOW_LEFT",
                      outcome: "Siku Rangga menghantam lenganmu. Rasanya seperti ditabrak motor. Tapi lenganmu menahan. Saat ia mendarat, kau sudah meluncurkan pukulan lurus pendek ke hidungnya. Darah mengalir. Ia mengumpat.",
                      stat_changes: { stat1: -10, stat3: 8 }
                    },
                    {
                      label: "Menerjang masuk saat ia melompat, mengandalkan kecepatan untuk memukul duluan.",
                      correct_for: null,
                      outcome: "Siku Rangga menghantam pelipismu. Dunia berputar. Kau mendengar suara wasit menghitung dari kejauhan, dan suara Broto tertawa dari tribun. Kau terjatuh, tapi masih sadar.",
                      stat_changes: { stat1: -30, stat2: -15 },
                      debuff: { name: "Pelipis Berdarah" },
                      vibrate: true
                    },
                    {
                      label: "Bersiap menangkap kakinya saat mendarat, lalu membantingnya ke kanvas.",
                      required_stat: { stat2: 60 },
                      correct_for: "FLYING_ELBOW_LEFT",
                      outcome: "Siku Rangga menghantam lenganmu, tapi kau sudah menangkap kakinya yang mendarat. Satu putaran pinggul, dan kau membantingnya ke kanvas. Tubuh besar itu menghantam lantai dengan bunyi menggelegar. Penonton histeris.",
                      stat_changes: { stat2: -12, stat3: 15 }
                    }
                  ]
                },
                {
                  round: 3,
                  telegraph: "Rangga berdiri tegak. Napasnya memburu, tapi matanya masih tajam. Ia mengangkat tangan kanan tinggi — terlalu tinggi untuk pukulan biasa. Ini bukan lagi teknik. Ini pukulan pamungkas dari petarung yang sudah kehabisan akal: hook kanan terbuka lebar, mengandalkan kekuatan bukan akurasi.",
                  pattern_hint: "DESPERATE_HOOK",
                  options: [
                    {
                      label: "Mundur, biarkan hook meleset, lalu melancarkan pukulan lurus pendek ke dagu saat ia kehilangan keseimbangan.",
                      correct_for: "DESPERATE_HOOK",
                      outcome: "Hook-nya meleset. Kau mundur dengan tenang, dan saat ia terhuyung karena momentum, pukulan lurusmu menghantam dagunya. Rangga jatuh ke kanvas. Wasit menghitung. Satu. Dua. Tiga. Empat. Lima. Enam. Tujuh. Delapan. Sembilan. Sepuluh.",
                      stat_changes: { stat3: 25 }
                    },
                    {
                      label: "Maju masuk, tangkap lengannya, dan coba kunci dengan siku.",
                      correct_for: null,
                      outcome: "Hook-nya menghantam bahumu, dan lenganmu kaku. Kau mencoba mengunci, tapi Rangga terlalu kuat. Ia membalikkan tubuhmu dan melancarkan serangan balik. Kau terlempar ke tali ring.",
                      stat_changes: { stat1: -18, stat2: -8 },
                      vibrate: true
                    },
                    {
                      label: "Berdiri tegak, tatap matanya, dan beri isyarat agar ia menyerang dengan seluruh tenaga.",
                      required_stat: { stat2: 70 },
                      correct_for: "DESPERATE_HOOK",
                      outcome: "Kau membuka tangan, mempersilakan. Rangga menyerang dengan seluruh tenaga — hook kanan yang mematikan. Tapi kau sudah membaca arahnya. Satu langkah ke samping, satu putaran pinggul, dan siku kananmu menghantam rahangnya. Ia jatuh tak sadarkan diri. Penonton meledak.",
                      stat_changes: { stat2: -15, stat3: 30 }
                    }
                  ]
                }
              ],
              victory: {
                outcome: "Rangga tumbang! Wasit mengangkat tanganmu. Di tribun, kau melihat Broto berdiri dan berjalan keluar dengan wajah gelap. Dan di sudut lain, kau melihat Danu tersenyum — senyum pertama yang tulus dari senior yang pernah kau kalahkan.",
                stat_changes: { stat3: 15 },
                next_location_id: "loc_10_final_kabupaten"
              },
              defeat: {
                outcome: "Kau terkapar di kanvas. Rangga berdiri di atasmu, mengangkat tangan ke tribun. Sorak penonton memekakkan telinga. Tapi di sudut, kau melihat Danu berdiri, mengepalkan tangan. Ia tidak menyorakimu — tapi ia tidak pergi. Untuk sesaat, kau merasa tidak sendirian.",
                stat_changes: { stat1: -30, stat3: -10 }
              }
            }
          },
          {
            action_id: "act_serang_membabi_buta",
            description: "Menerjang tanpa pertahanan sama sekali (BERBAHAYA).",
            category: "arena",
            stat_changes: { stat1: -60, stat2: -20 },
            outcome: "Kau menerjang tanpa perhitungan. Siku keras Rangga mendarat di pelipismu. Kau tergeletak tidak sadarkan diri di atas kanvas. Semifinal berakhir dengan kekalahan telak. Kau sadar saat dibawa ke rumah sakit — pertarungan sudah usai.",
            vibrate: true
          }
        ]
      },
      {
        id: "loc_10_final_kabupaten",
        name: "Ring Utama Final Kejuaraan Kabupaten",
        category: "arena",
        image: "assets/images/scene_finalkab.webp",
        narrative: "Sorot lampu stroboskopik membakar atmosfer Ring Final. Lawan terakhir: Bima 'Sang Hitam' — juara bertahan Kickboxing Kabupaten tiga kali berturut-turut yang tak pernah kalah.\n\nBima membuka dengan kombinasi pukulan cepat dan low-kick beruntun. Seluruh stadion menahan napas menunggu pergerakanmu.",
        action_options: [
          {
            action_id: "act_hadapi_bima",
            description: "Hadapi Bima Sang Hitam di final kabupaten.",
            category: "arena",
            once: true,
            required_stat: { stat2: 50 },
            combat: {
              enemy_name: "Bima Sang Hitam",
              enemy_emoji: "🖤",
              intro: "Bima melangkah ke tengah ring dengan langkah ringan, seperti penari. Ia tidak memasang kuda-kuda — ia hanya berdiri, tangan menggantung rileks. Namun matanya mengamati setiap inci tubuhmu. Ini petarung yang sudah melihat semuanya.",
              rounds: [
                {
                  round: 1,
                  telegraph: "Bima menggeser berat badannya ke kaki belakang — sedikit saja, hampir tidak terlihat. Tapi matanya turun ke betis kirimu. Kaki depannya terangkat sedikit, siap melancarkan tendangan rendah. Ia menguji reflex-mu dulu sebelum menunjukkan yang sebenarnya.",
                  pattern_hint: "TESTING_LOW_KICK",
                  options: [
                    {
                      label: "Angkat kaki kiri, tangkis tendangan dengan tulang kering, dan biarkan kakinya memantul.",
                      correct_for: "TESTING_LOW_KICK",
                      outcome: "Tulang keringmu menangkis tendangannya. Bima tersenyum tipis — bukan senyum mengejek, tapi senyum seseorang yang baru menemukan lawan yang layak. 'Bagus,' katanya pelan. 'Berarti ini tidak akan membosankan.'",
                      stat_changes: { stat1: -3, stat3: 5 }
                    },
                    {
                      label: "Mundur menjauh dan tunggu kesempatan.",
                      correct_for: null,
                      outcome: "Kau mundur, tapi tendangan rendahnya tetap menghantam betis kananmu. Tidak telak, tapi cukup untuk membuat kaki kananmu terasa berat. Bima tidak mengejar — ia hanya tersenyum. Ia tahu kau sudah mulai kehilangan inisiatif.",
                      stat_changes: { stat1: -12, stat2: -5 }
                    },
                    {
                      label: "Berpura-pura tidak siap, biarkan ia menendang, lalu tangkap kakinya di detik terakhir.",
                      required_stat: { stat2: 60 },
                      correct_for: "TESTING_LOW_KICK",
                      outcome: "Kau berpura-pura lengah. Bima termakan — ia melancarkan tendangan lebih keras dari yang seharusnya. Kau menangkap kakinya, memutar pinggul, dan mendorongnya ke tali ring. Penonton bersorak. Untuk pertama kali, wajah Bima berubah.",
                      stat_changes: { stat2: -10, stat3: 12 }
                    }
                  ]
                },
                {
                  round: 2,
                  telegraph: "Bima tidak lagi menguji. Kali ini ia benar-benar menyerang: kaki kanan melangkah jauh ke depan, pinggul berputar, tangan kiri terangkat untuk menutup wajah. Ini bukan tendangan rendah — ini high kick yang mengincar pelipismu. Kekuatannya bisa mematikan.",
                  pattern_hint: "HIGH_KICK_LEFT",
                  options: [
                    {
                      label: "Mundur satu langkah, angkat lengan kiri untuk menangkis, dan biarkan kakinya melintas di atas.",
                      correct_for: "HIGH_KICK_LEFT",
                      outcome: "Kakinya melintas di atas pelipismu, tapi lengan kirimu menahan sebagian kekuatan. Kau merasakan getaran sampai ke gigi. Bima mendarat dengan ringan. 'Kau kuat,' katanya. 'Tapi belum cukup.'",
                      stat_changes: { stat1: -8, stat3: 8 }
                    },
                    {
                      label: "Bungkuk dan terobos masuk untuk memukul badannya.",
                      correct_for: null,
                      outcome: "Kau bungkuk untuk menerobos, tapi kakinya menghantam bahumu. Kekuatannya luar biasa. Kau terjatuh, berguling ke tali ring. Telingamu berdenging.",
                      stat_changes: { stat1: -28, stat2: -12 },
                      debuff: { name: "Telinga Berdenging" },
                      vibrate: true
                    },
                    {
                      label: "Menunggu tendangan, membaca arah, lalu melangkah memutar ke punggungnya dan melancarkan pukulan.",
                      required_stat: { stat2: 65 },
                      correct_for: "HIGH_KICK_LEFT",
                      outcome: "Kakinya melintas di atasmu saat kau sudah berputar ke belakangnya. Kau mendorong punggungnya — ia tersandung ke tali ring. Penonton bersorak histeris: juara mereka goyah! Bima menoleh, dan untuk pertama kali, kau melihat rasa hormat di matanya.",
                      stat_changes: { stat2: -12, stat3: 15 }
                    }
                  ]
                },
                {
                  round: 3,
                  telegraph: "Bima menghela napas panjang. Ia memasang kuda-kuda rendah, kedua tangan rapat di depan wajah. Kaki depannya jinjit. Ini bukan lagi gaya Kickboxing — ini kombinasi MMA: ia akan mencoba menangkap kakimu, menjatuhkanmu, lalu menghabisi di lantai. Ini teknik yang tidak kau pelajari di padepokan.",
                  pattern_hint: "TAKEDOWN_ATTEMPT",
                  options: [
                    {
                      label: "Jaga jarak, tetap di kaki, dan pukul kepalanya setiap kali ia mencoba mendekat.",
                      correct_for: "TAKEDOWN_ATTEMPT",
                      outcome: "Bima mengulurkan tangan untuk menangkap kakimu, tapi setiap kali ia mendekat, pukulan lurusmu menghantam wajahnya. Ia mundur, mengusap pipi yang mulai bengkak. 'Kau belajar cepat,' katanya. Untuk pertama kali, kau melihat Bima ragu.",
                      stat_changes: { stat1: -5, stat3: 10 }
                    },
                    {
                      label: "Biarkan ia menangkap kaki, lalu gulingkan badannya dengan teknik yang kau pelajari di gym.",
                      required_stat: { stat2: 55 },
                      correct_for: "TAKEDOWN_ATTEMPT",
                      outcome: "Bima menangkap kakimu — dan tersenyum, mengira kau sudah kalah. Tapi kau sudah belajar di Titan Gym: satu putaran pinggul, satu dorongan, dan tiba-tiba Bima terjatuh ke punggungnya. Penonton terkesiap. Kau memanfaatkan momentum ini.",
                      stat_changes: { stat2: -15, stat3: 18 }
                    },
                    {
                      label: "Terima takedown, tapi coba kunci lehernya dari bawah.",
                      correct_for: null,
                      outcome: "Kau terjatuh ke kanvas. Bima langsung menduduki dadamu dan menghantam wajahmu berkali-kali sebelum wasit menghentikan. Kau melihat bintang. Tapi kau masih sadar — dan kau tahu kau harus bangkit.",
                      stat_changes: { stat1: -25, stat2: -10 },
                      vibrate: true
                    }
                  ]
                },
                {
                  round: 4,
                  telegraph: "Bima berdiri tiga langkah di hadapanmu. Ia tidak menyerang. Ia hanya menatap, dan kau melihat sesuatu di matanya yang belum pernah kau lihat sebelumnya: kelelahan. Kaki kanannya sedikit gemetar. Ia mengangkat tangan kanan — tinggi, terlalu tinggi — dan kau tahu, ini pukulan pamungkas. Hook kanan dengan seluruh sisa tenaganya.",
                  pattern_hint: "FINAL_HOOK",
                  options: [
                    {
                      label: "Berdiri tegak, tatap matanya, dan beri isyarat agar ia menyerang dengan seluruh tenaga.",
                      required_stat: { stat2: 70 },
                      correct_for: "FINAL_HOOK",
                      outcome: "Kau membuka tangan, mempersilakan. Bima menyerang dengan seluruh tenaga — hook kanan yang mematikan. Tapi kau sudah membaca arahnya. Satu langkah ke samping, satu putaran pinggul, dan siku kananmu menghantam rahangnya. Ia jatuh tak sadarkan diri. Penonton meledak. Wasit menghentikan pertarungan. KAU JUARA KABUPATEN.",
                      stat_changes: { stat2: -15, stat3: 30 },
                      trigger_ending_id: "true_ending_kabupaten"
                    },
                    {
                      label: "Mundur, biarkan hook-nya meleset, lalu balas dengan kombinasi pukulan.",
                      correct_for: "FINAL_HOOK",
                      outcome: "Hook-nya meleset. Kau mundur dengan tenang, dan saat ia terhuyung karena momentum, kombinasi pukulanmu masuk. Pukulan kiri ke badan, pukulan kanan ke dagu. Bima jatuh ke kanvas. Wasit menghitung. Sepuluh. Kau juara kabupaten!",
                      stat_changes: { stat1: -8, stat3: 25 },
                      trigger_ending_id: "true_ending_kabupaten"
                    },
                    {
                      label: "Maju masuk, tangkap lengannya, dan coba banting dia ke kanvas.",
                      correct_for: null,
                      outcome: "Hook-nya menghantam bahumu. Kau terjatuh ke kanvas, dan Bima langsung melompat ke atas. Wasit menghentikan pertarungan. Kau kalah angka. Di tribun, Danu menutup matanya — bukan karena kecewa, tapi karena menahan tangis.",
                      stat_changes: { stat1: -30, stat3: -5 }
                    }
                  ]
                }
              ],
              victory: {
                outcome: "Bima tidak bangkit. Wasit mengangkat tanganmu. Sabuk Emas Kejuaraan Kabupaten dilingkarkan di pinggangmu. Sorak ribuan penonton mengiringi kemenangan bersihmu. Kau melihat Eyang Suryo di tribun — ia mengangguk, dan kau melihat air mata di matanya.",
                trigger_ending_id: "true_ending_kabupaten"
              },
              defeat: {
                outcome: "Kau terkapar di kanvas. Bima berdiri di atasmu, mengangkat tangannya ke tribun. Kekalahan ini berat — tapi saat kau bangkit, kau melihat Danu di tepi ring. Ia mengangguk. 'Kau sudah bertarung lebih keras dari yang kubayangkan,' katanya. 'Itu bukan sesuatu yang bisa diambil dari siapa pun.'",
                stat_changes: { stat1: -25, stat3: -5 }
              }
            }
          },
          {
            action_id: "act_kalah_sengaja",
            description: "Mengalah sengaja sesuai skenario suap Pak Broto.",
            category: "arena",
            once: true,
            trigger_ending_id: "corrupt_ending"
          }
        ]
      }
    ],
    items: [
      { id: "item_20", name: "Koper Uang Suap Bandar", emoji: "💼", category: "bukti", description: "Uang hasil kecurangan yang merusak kehormatan petarung." },
      { id: "item_21", name: "Sertifikat Integritas Publik", emoji: "📜", category: "bukti", description: "Bukti penolakan suap yang meningkatkan kepercayaan sponsor." },
      { id: "item_22", name: "Catatan Biomekanika Kickboxing", emoji: "📊", category: "kitab", description: "Analisis teknis titik lemah gaya pertarungan modern." },
      { id: "item_23", name: "Handwrap Pro Gel Modern", emoji: "🥊", category: "peralatan", description: "Pelindung tangan kelas profesional untuk daya rusak maksimal." }
    ],
    recipes: [
      {
        recipe_id: "rec_hibrida",
        result_item_name: "Formula Nutrisi Atlet Hibrida",
        required_categories: { herbal: 1, peralatan: 1 },
        description: "Menggabungkan Jahe Merah Tradisional & Gel Pro untuk memulihkan 40 Stamina!",
        reward_stat_changes: { stat1: 40 }
      }
    ],
    endings: {
      true_ending_kabupaten: {
        title: "TRUE ENDING: Sabuk Kejuaraan Kabupaten & Seleksi Provinsi",
        narrative: "Sabuk Emas Kejuaraan Kabupaten dilingkarkan di pinggangmu! Sorak ribuan penonton mengiringi kemenangan bersihmu. Dengan memadukan ketahanan tradisi Sumbu Jagat dan pemahaman analisis modern, nama kau kini resmi tercatat dalam daftar Atlet Pilihan menuju KEJUARAAN PROVINSI!\n\nEyang Suryo menyalami kau di tepi ring. \"Kau bukan lagi murid yang aku kenal saat bersujud di tikar,\" katanya pelan. \"Kau petarung. Dan petarung sejati tidak pernah kehilangan arah, meski menang.\""
      },
      corrupt_ending: {
        title: "BAD ENDING: Skandal Suap Match-Fixing",
        narrative: "Skandal pengusutan suap meledak di media massa. Nama baikmu dicabut, gelar juara dibatalkan, dan kau dilarang bertanding di seluruh gelanggang resmi seumur hidup. Di desa, nenekmu tidak pernah bertanya. Ia hanya menatap handwrap merah di meja, dan tidak berkata apa-apa. Itu lebih menyakitkan dari apa pun."
      },
      stat_zero_ending: {
        title: "BAD ENDING: Cedera Permanen & Karir Berakhir",
        narrative: "Tubuhmu tidak mampu lagi menerima tekanan pertarungan level kabupaten. Dokter menyatakan kau tidak boleh naik ring lagi. Mimpi petarung berakhir di rumah sakit — tapi di luar jendela, Danu menunggu. Ia tidak masuk. Ia hanya berdiri di sana, memastikan kau tidak sendirian."
      },
      stat3_zero_ending: {
        title: "BAD ENDING: Nama Baik Hancur di Industri",
        narrative: "Reputasimu mencapai titik terendah. Tidak ada promotor yang mau bekerja sama, tidak ada sponsor yang mau mendanai. Kau menghilang dari dunia petarung tanpa jejak — dan di desa, hanya nenek yang masih menunggu kau pulang."
      }
    }
  });
}
