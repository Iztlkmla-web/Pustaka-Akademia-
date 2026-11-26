import {
  LearningGuide,
  LibraryItem,
  LoanRecord,
  OpenDatabaseLink,
} from '../types/library';

export const HERO_READING_HALL_IMAGE =
  '/src/assets/images/library_hero_reading_hall_1795676121004.jpg';

export const LIBRARY_CATALOG: LibraryItem[] = [
  {
    id: 'bk-001',
    title: 'Epistemologi & Filsafat Ilmu di Era Kecerdasan Kolektif',
    subtitle: 'Menelaah Fondasi Pengetahuan Akademik dan Keadilan Epistemik',
    authors: ['Prof. Dr. Hendra Wijaya', 'Dr. Ratna Puspitasari'],
    year: 2025,
    publisher: 'Penerbit Universitas Nusantara',
    isbnOrIssn: '978-623-410-218-4',
    callNumber: '121.09 WIJ e',
    format: 'e-book',
    faculty: 'Filsafat & Humaniora',
    language: 'Bahasa Indonesia',
    abstract:
      'Monograf akademik ini mengkaji pergeseran paradigma epistemologi kontemporer dari pendekatan positivistik menuju pengetahuan partisipatif yang inklusif. Dilengkapi kerangka metodologi riset interdisipliner serta studi kasus keterbukaan sains di perguruan tinggi Indonesia.',
    subjects: ['Epistemologi', 'Filsafat Ilmu', 'Metodologi Riset', 'Keadilan Epistemik'],
    totalCopies: 8,
    availableCopies: 5,
    openAccess: true,
    accessibilityFeatures: ['Audio-Ready', 'Teks Terstruktur', 'Ramah Disleksia', 'Kontras Tinggi'],
    pageCount: 312,
    citationsCount: 48,
    coverImage: '/src/assets/images/cover_filsafat_ilmu_1795676120663.jpg',
    coverTone: 'lapis',
    chapters: [
      {
        id: 'ch-1',
        number: 'Bab 01',
        title: 'Akar Pengetahuan dan Pergeseran Paradigma Akademik',
        readingMinutes: 6,
        keyTakeaway:
          'Pengetahuan ilmiah tidak pernah lahir di ruang hampa; ia dibentuk oleh komunitas penelaah yang terus menguji validitas, konteks sosial, dan kebermanfaatannya bagi publik luas.',
        paragraphs: [
          'Dalam tradisi akademik modern, pertanyaan mendasar mengenai bagaimana kita mengetahui sesuatu sering kali disederhanakan menjadi prosedur verifikasi empiris semata. Padahal, sejarah sains menunjukkan bahwa lompatan konseptual terbesar justru terjadi ketika batas-batas metode baku dipertanyakan secara kritis oleh komunitas lintas disiplin.',
          'Konsep keadilan epistemik menuntut agar sumber-sumber pengetahuan di lingkungan perguruan tinggi dapat diakses dan dimaknai oleh seluruh sivitas akademika tanpa terkecuali, termasuk mahasiswa dan peneliti dengan kebutuhan aksesibilitas visual, auditori, maupun kognitif yang beragam.',
          'Oleh sebab itu, perpustakaan digital masa kini bukan lagi sekadar gudang berkas PDF statis. Ia berfungsi sebagai infrastruktur epistemik hidup yang menjamin keterbacaan semantik, dukungan pembaca layar, serta navigasi terstruktur bagi setiap pencari ilmu.',
        ],
        glossary: [
          {
            term: 'Keadilan Epistemik',
            definition:
              'Prinsip etis yang menjamin kesetaraan hak setiap individu untuk mengakses, memproduksi, dan diakui dalam pertukaran pengetahuan ilmiah.',
          },
          {
            term: 'Paradigma Ilmiah',
            definition:
              'Kerangka konseptual, metode, dan standar pembuktian yang disepakati komunitas ilmuwan pada suatu kurun waktu.',
          },
        ],
      },
      {
        id: 'ch-2',
        number: 'Bab 02',
        title: 'Logika Induksi, Deduksi, dan Sintesis Lintas Disiplin',
        readingMinutes: 8,
        keyTakeaway:
          'Penggabungan penalaran deduktif yang ketat dengan eksplorasi induktif lapangan memungkinkan peneliti merumuskan teori yang kokoh sekaligus relevan.',
        paragraphs: [
          'Penalaran deduktif bergerak dari premis umum menuju kesimpulan khusus yang niscaya secara logis. Sebaliknya, penalaran induktif mengumpulkan pengamatan partikular dari fenomena empiris untuk merumuskan generalisasi teoretis yang terbuka terhadap pengujian ulang.',
          'Dalam riset terapan seperti ekologi pesisir atau rekayasa perangkat lunak sosial, peneliti tidak dapat mengandalkan satu kutub penalaran saja. Dialog berkelanjutan antara model konseptual dan bukti lapangan menciptakan siklus pembelajaran yang korektif.',
          'Setiap klaim akademik yang sahih harus menyertakan rujukan yang dapat ditelusuri, data pendukung yang transparan, serta batasan ruang lingkup analisis agar pembaca berikutnya dapat mereplikasi atau menyempurnakannya.',
        ],
        glossary: [
          {
            term: 'Falsifiabilitas',
            definition:
              'Kriteria ilmiah yang menyatakan suatu hipotesis harus dapat diuji dan berpotensi dibantah melalui observasi empiris.',
          },
        ],
      },
      {
        id: 'ch-3',
        number: 'Bab 03',
        title: 'Etika Sitasi dan Keterbukaan Sains di Perguruan Tinggi',
        readingMinutes: 5,
        keyTakeaway:
          'Sitasi adalah wujud penghargaan intelektual sekaligus peta navigasi yang menjaga integritas jejaring pengetahuan akademik.',
        paragraphs: [
          'Praktik sitasi yang tertib memastikan bahwa garis keturunan gagasan tetap jernih. Ketika seorang mahasiswa mengutip karya terdahulu, ia sesungguhnya sedang membangun jembatan dialog dengan para pemikir sebelumnya.',
          'Gerakan Sains Terbuka mendorong repositori perguruan tinggi untuk mempublikasikan buku ajar, artikel jurnal, serta dataset penelitian dengan lisensi terbuka agar hambatan finansial tidak memutus rantai inovasi di daerah.',
        ],
      },
    ],
  },
  {
    id: 'bk-002',
    title: 'Arsitektur Sistem Cerdas dan Etika Pemrosesan Bahasa',
    subtitle: 'Pendekatan Komputasional yang Transparan dan Dapat Diaudit',
    authors: ['Dr. Baskoro Adi Nugroho, M.Kom.', 'Nadia Kusuma, S.T., M.Sc.'],
    year: 2026,
    publisher: 'Teknika Akademika Press',
    isbnOrIssn: '978-623-882-041-9',
    callNumber: '006.35 NUG a',
    format: 'e-book',
    faculty: 'Ilmu Komputer & AI',
    language: 'Bahasa Indonesia',
    abstract:
      'Buku ajar tingkat lanjut yang membahas dasar-dasar pemodelan bahasa, evaluasi bias algoritmik, efisiensi energi komputasi, serta perancangan antarmuka sistem cerdas yang aksesibel bagi penyandang disabilitas.',
    subjects: ['Pemrosesan Bahasa Alami', 'Etika AI', 'Komputasi Inklusif', 'Algoritma'],
    totalCopies: 6,
    availableCopies: 2,
    openAccess: false,
    accessibilityFeatures: ['Audio-Ready', 'Teks Terstruktur', 'Deskripsi Visual'],
    pageCount: 428,
    citationsCount: 64,
    coverImage: '/src/assets/images/cover_kecerdasan_buatan_1795676122042.jpg',
    coverTone: 'charcoal',
    chapters: [
      {
        id: 'ch-1',
        number: 'Bab 01',
        title: 'Representasi Makna dan Korpus Bahasa Nusantara',
        readingMinutes: 7,
        keyTakeaway:
          'Kualitas sistem bahasa bergantung pada keterwakilan korpus yang adil terhadap bahasa daerah, ragam tutur akademik, dan istilah ilmiah lokal.',
        paragraphs: [
          'Sebagian besar model bahasa berskala besar dilatih menggunakan proporsi teks berbahasa Inggris yang sangat dominan. Ketimpangan data latih ini berdampak pada akurasi pemahaman konteks budaya, tata bahasa aglutinatif, serta kosakata keilmuan di Indonesia.',
          'Pembangunan korpus terbuka yang dikurasi oleh konsorsium universitas menjadi langkah strategis untuk memastikan sistem temu kembali informasi perpustakaan mampu memahami kueri mahasiswa dalam bahasa Indonesia maupun bahasa daerah secara presisi.',
        ],
        glossary: [
          {
            term: 'Korpus Linguistik',
            definition:
              'Kumpulan teks autentik terstruktur dalam skala besar yang digunakan untuk analisis kebahasaan dan pelatihan model komputasi.',
          },
        ],
      },
      {
        id: 'ch-2',
        number: 'Bab 02',
        title: 'Audit Transparansi dan Aksesibilitas Antarmuka Cerdas',
        readingMinutes: 6,
        keyTakeaway:
          'Sistem cerdas baru dapat disebut andal apabila keluaran keputusannya dapat dijelaskan dan dioperasikan oleh semua pengguna.',
        paragraphs: [
          'Merancang mesin pencari katalog perpustakaan berarti memikirkan bagaimana hasil peringkat ditampilkan secara netral dan dapat ditelusuri kriterianya. Pengguna berhak mengetahui mengapa suatu referensi muncul di urutan teratas.',
          'Selain keterjelasan algoritma, antarmuka pengguna harus mematuhi standar WCAG agar navigasi papan ketik, kontras teks, dan pembacaan suara berjalan tanpa hambatan.',
        ],
      },
    ],
  },
  {
    id: 'bk-003',
    title: 'Ekologi Pesisir & Keanekaragaman Hayati Mangrove Nusantara',
    subtitle: 'Atlas Penelitian Lapangan dan Strategi Restorasi Berkelanjutan',
    authors: ['Dr. Ir. Maya Saraswati', 'Prof. Lukman Hakim'],
    year: 2024,
    publisher: 'Balai Pustaka Hayati',
    isbnOrIssn: '978-602-559-712-1',
    callNumber: '577.69 SAR e',
    format: 'e-book',
    faculty: 'Ekologi & Hayati',
    language: 'Dwibahasa (ID/EN)',
    abstract:
      'Kajian komprehensif mengenai ekosistem mangrove di kepulauan Indonesia, mencakup pemetaan karbon biru, interaksi mikrofauna sedimen, serta panduan teknis rehabilitasi pesisir berbasis masyarakat akademik dan lokal.',
    subjects: ['Ekologi Mangrove', 'Karbon Biru', 'Konservasi Pesisir', 'Botani'],
    totalCopies: 5,
    availableCopies: 0,
    openAccess: false,
    accessibilityFeatures: ['Teks Terstruktur', 'Deskripsi Visual', 'Kontras Tinggi'],
    pageCount: 284,
    citationsCount: 91,
    coverImage: '/src/assets/images/cover_ekologi_nusantara_1795676121820.jpg',
    coverTone: 'forest',
    chapters: [
      {
        id: 'ch-1',
        number: 'Bab 01',
        title: 'Zonasi Hutan Mangrove dan Adaptasi Morfologi Akar',
        readingMinutes: 6,
        keyTakeaway:
          'Setiap spesies mangrove memiliki adaptasi akar dan toleransi salinitas khusus yang membentuk sabuk pelindung alami garis pantai.',
        paragraphs: [
          'Ekosistem mangrove menempati zona pasang surut yang dinamis antara daratan tropis dan perairan laut dangkal. Pada garis terdepan yang berhadapan langsung dengan gelombang, genus Avicennia dan Sonneratia mengembangkan akar napas (pneumatofora) yang menembus sedimen anaerob.',
          'Di zona tengah yang lebih terlindung, Rhizophora membentuk jalinan akar tunjang yang rapat. Struktur tiga dimensi ini memerangkap sedimen halus sekaligus menjadi daerah asuhan penting bagi larva ikan dan krustasea.',
        ],
        glossary: [
          {
            term: 'Pneumatofora',
            definition:
              'Akar napas yang tumbuh tegak ke atas permukaan lumpur untuk menyerap oksigen pada lingkungan tergenang.',
          },
          {
            term: 'Karbon Biru',
            definition:
              'Karbon organik yang diserap dan disimpan dalam jangka panjang oleh ekosistem pesisir dan laut seperti mangrove dan lamun.',
          },
        ],
      },
      {
        id: 'ch-2',
        number: 'Bab 02',
        title: 'Pengukuran Cadangan Karbon Sedimen Pesisir',
        readingMinutes: 7,
        keyTakeaway:
          'Lebih dari tujuh puluh persen simpanan karbon ekosistem mangrove tersimpan di lapisan tanah gambut pesisir yang jenuh air.',
        paragraphs: [
          'Berbeda dengan hutan daratan yang menyimpan sebagian besar karbonnya pada biomassa kayu di atas permukaan tanah, hutan mangrove mengakumulasi materi organik di dalam substrat berlumpur yang miskin oksigen sehingga laju dekomposisi berlangsung sangat lambat.',
          'Pengambilan sampel inti sedimen hingga kedalaman satu meter menjadi metode standar mahasiswa dan peneliti ekologi untuk mengkuantifikasi kontribusi pesisir terhadap mitigasi perubahan iklim.',
        ],
      },
    ],
  },
  {
    id: 'bk-004',
    title: 'Desain Universal & Arsitektur Ruang Belajar Inklusif',
    subtitle: 'Tujuh Prinsip Aksesibilitas Fisik dan Digital untuk Kampus Modern',
    authors: ['Ar. Dimas Pratama, IAI', 'Dra. Sri Wahyuni, M.Pd.'],
    year: 2025,
    publisher: 'Pustaka Rancang Bangun',
    isbnOrIssn: '978-623-701-119-8',
    callNumber: '720.42 PRA d',
    format: 'e-book',
    faculty: 'Desain & Arsitektur Inklusif',
    language: 'Bahasa Indonesia',
    abstract:
      'Panduan terpadu merancang lingkungan akademik—mulai dari tata ruang perpustakaan ramah kursi roda, pencahayaan bebas silau, penanda taktil, hingga pengalaman antarmuka digital yang setara bagi seluruh pembelajar.',
    subjects: ['Desain Universal', 'Arsitektur Inklusif', 'Aksesibilitas Digital', 'Ergonomi'],
    totalCopies: 10,
    availableCopies: 7,
    openAccess: true,
    accessibilityFeatures: [
      'Audio-Ready',
      'Teks Terstruktur',
      'Ramah Disleksia',
      'Kontras Tinggi',
      'Deskripsi Visual',
    ],
    pageCount: 256,
    citationsCount: 37,
    coverImage: '/src/assets/images/cover_desain_inklusif_1795676122376.jpg',
    coverTone: 'ochre',
    chapters: [
      {
        id: 'ch-1',
        number: 'Bab 01',
        title: 'Melampaui Akomodasi Khusus Menuju Desain Universal',
        readingMinutes: 5,
        keyTakeaway:
          'Desain universal sejak awal lebih bermartabat, hemat biaya, dan bermanfaat bagi semua orang dibandingkan penyesuaian tambal sulam.',
        paragraphs: [
          'Sering kali fasilitas aksesibel di gedung kampus dibangun sebagai jalur tambahan di pintu belakang. Pendekatan Desain Universal menolak pemisahan tersebut dengan menciptakan satu jalur landai elegan yang nyaman dilalui pengguna kursi roda, pembawa troli buku, maupun pejalan kaki.',
          'Prinsip yang sama berlaku pada platform perpustakaan digital. Ketika teks disusun dengan struktur judul yang runtut, rasio kontras tinggi, dan ukuran huruf fleksibel, mahasiswa low-vision terbantu sekaligus pembaca umum menikmati ketajaman tipografi yang nyaman di mata.',
        ],
        glossary: [
          {
            term: 'Desain Universal',
            definition:
              'Perancangan produk dan lingkungan agar dapat digunakan seluas mungkin oleh semua orang tanpa perlu adaptasi khusus.',
          },
        ],
      },
      {
        id: 'ch-2',
        number: 'Bab 02',
        title: 'Akustik Ruang Baca dan Orientasi Sensorik',
        readingMinutes: 6,
        keyTakeaway:
          'Pengendalian gema, zona tenang, dan pencahayaan alami yang merata mendukung fokus mahasiswa neurodivergen.',
        paragraphs: [
          'Perpustakaan akademik yang inklusif menyediakan gradasi ruang: mulai dari ruang kolaborasi aktif, bilik belajar kedap suara, hingga sudut tenang berpencahayaan hangat bagi mahasiswa dengan kepekaan sensorik tinggi.',
          'Penanda ruangan memadukan huruf cetak kontras tinggi, piktogram sederhana, serta huruf Braille pada ketinggian yang mudah dijangkau.',
        ],
      },
    ],
  },
  {
    id: 'jr-005',
    title: 'Jurnal Literasi Informasi & Pustaka Digital (Vol. 14, No. 2)',
    subtitle: 'Transformasi Sirkulasi Daring dan Layanan Aksesibilitas Kampus',
    authors: ['Tim Redaksi IPI', 'Dr. Farah Diba'],
    year: 2026,
    publisher: 'Asosiasi Pustakawan Akademik Indonesia',
    isbnOrIssn: 'ISSN 2442-8914',
    callNumber: '025.04 JLI v14',
    format: 'jurnal',
    faculty: 'Pendidikan Khusus',
    language: 'Bahasa Indonesia',
    abstract:
      'Edisi khusus berisi enam artikel peer-reviewed mengenai standar metadata EPUB3 aksesibel, pemanfaatan sintesis suara dalam pembelajaran mahasiswa tunanetra, dan efektivitas sistem peminjaman e-book tanpa DRM restriktif.',
    subjects: ['Ilmu Perpustakaan', 'Sirkulasi Daring', 'EPUB Aksesibel', 'Teknologi Bantu'],
    totalCopies: 99,
    availableCopies: 99,
    openAccess: true,
    accessibilityFeatures: ['Audio-Ready', 'Teks Terstruktur', 'Ramah Disleksia'],
    pageCount: 142,
    citationsCount: 29,
    coverTone: 'plum',
    chapters: [
      {
        id: 'ch-1',
        number: 'Artikel 01',
        title: 'Evaluasi Keterpakaian Pembaca Layar pada Portal Katalog Perguruan Tinggi',
        readingMinutes: 7,
        keyTakeaway:
          'Label ARIA yang konsisten dan urutan fokus papan ketik memangkas waktu pencarian referensi mahasiswa tunanetra hingga 58 persen.',
        paragraphs: [
          'Penelitian ini menguji dua belas portal katalog perpustakaan universitas di Indonesia bersama dua puluh empat partisipan pengguna pembaca layar. Temuan utama menunjukkan bahwa hambatan terbesar bukan pada ketiadaan koleksi, melainkan tombol filter yang tidak memiliki keterangan aksesibel.',
          'Dengan menerapkan pola landmark HTML semantik, pengumuman status dinamis melalui aria-live, serta tautan lewati navigasi, tingkat keberhasilan peminjaman mandiri daring meningkat dari 46% menjadi 95%.',
        ],
      },
    ],
  },
  {
    id: 'sk-006',
    title: 'Model Ekonomi Sirkular dalam Pengelolaan Limbah Elektronik Kampus',
    subtitle: 'Tesis Magister Kebijakan Publik & Ekonomi Lingkungan',
    authors: ['Anisa Maharani, S.E.'],
    year: 2025,
    publisher: 'Repositori Pascasarjana Universitas Nusantara',
    isbnOrIssn: 'REP-2025-88412',
    callNumber: '338.927 MAH m',
    format: 'skripsi',
    faculty: 'Ekonomi & Kebijakan',
    language: 'Bahasa Indonesia',
    abstract:
      'Penelitian empiris mengenai skema perbaikan, pemanfaatan kembali perangkat komputer laboratorium kampus, dan analisis biaya-manfaat bagi pengadaan perangkat bantu belajar mahasiswa.',
    subjects: ['Ekonomi Sirkular', 'Kebijakan Kampus', 'Keberlanjutan', 'Tesis'],
    totalCopies: 99,
    availableCopies: 99,
    openAccess: true,
    accessibilityFeatures: ['Teks Terstruktur', 'Audio-Ready'],
    pageCount: 164,
    citationsCount: 15,
    coverTone: 'slate',
    chapters: [
      {
        id: 'ch-1',
        number: 'Ringkasan Eksekutif',
        title: 'Temuan Utama dan Rekomendasi Tata Kelola Perangkat Kampus',
        readingMinutes: 5,
        keyTakeaway:
          'Program peremajaan modular memperpanjang usia pakai perangkat komputer laboratorium rata-rata 4,2 tahun dan menekan limbah elektronik sebesar 61%.',
        paragraphs: [
          'Setiap tahun, perguruan tinggi mengganti ratusan unit perangkat komputasi yang sebenarnya masih layak pakai apabila ditingkatkan memori dan penyimpanannya. Melalui skema ekonomi sirkular internal, perangkat rekondisi dapat dialokasikan ke ruang belajar terbuka dan sudut aksesibilitas mahasiswa.',
          'Analisis finansial menunjukkan penghematan anggaran pengadaan hingga 34% dalam siklus lima tahun, sekaligus mengurangi jejak karbon pengadaan perangkat baru.',
        ],
      },
    ],
  },
  {
    id: 'md-007',
    title: 'Modul Ajar Terbuka: Statistika Terapan untuk Penelitian Sosial',
    subtitle: 'Dilengkapi Panduan Interpretasi Data dan Studi Kasus Indonesia',
    authors: ['Dr. Arif Budiman', 'Rizky Maulana, M.Stat.'],
    year: 2026,
    publisher: 'Konsorsium Sumber Belajar Terbuka (OER)',
    isbnOrIssn: '978-623-901-330-2',
    callNumber: '519.5 BUD m',
    format: 'modul-ajar',
    faculty: 'Ekonomi & Kebijakan',
    language: 'Bahasa Indonesia',
    abstract:
      'Bahan ajar mandiri yang menyajikan konsep uji hipotesis, regresi linear, dan analisis survei dengan penjelasan naratif yang ramah bagi mahasiswa non-eksakta serta tabel data terstruktur bagi pembaca layar.',
    subjects: ['Statistika Sosial', 'Metodologi Kuantitatif', 'OER', 'Analisis Data'],
    totalCopies: 99,
    availableCopies: 99,
    openAccess: true,
    accessibilityFeatures: ['Audio-Ready', 'Teks Terstruktur', 'Ramah Disleksia', 'Kontras Tinggi'],
    pageCount: 196,
    citationsCount: 52,
    coverTone: 'lapis',
    chapters: [
      {
        id: 'ch-1',
        number: 'Unit 01',
        title: 'Membaca Sebaran Data Tanpa Bergantung pada Grafik Semata',
        readingMinutes: 6,
        keyTakeaway:
          'Ringkasan lima angka dan deskripsi tekstual pola distribusi memastikan analisis statistik tetap inklusif bagi peneliti dengan hambatan penglihatan.',
        paragraphs: [
          'Visualisasi grafik sering diperlakukan sebagai satu-satunya cara memahami pola data. Dalam modul terbuka ini, setiap histogram atau diagram pencar selalu didampingi ringkasan statistik deskriptif yang presisi: median, kuartil, rentang antarkuartil, serta arah kemencengan distribusi.',
          'Pendekatan ganda antara visual dan narasi numerik terstruktur menjadikan pembacaan data lebih akurat sekaligus meminimalkan bias tafsir optik.',
        ],
      },
    ],
  },
  {
    id: 'bk-008',
    title: 'Pedagogi Inklusif dan Teknologi Asistif di Pendidikan Tinggi',
    subtitle: 'Strategi Pengajaran Adaptif untuk Ragam Gaya Belajar Mahasiswa',
    authors: ['Prof. Dr. Kartini Lestari', 'Dr. Yosef Pratama'],
    year: 2024,
    publisher: 'Penerbit Ilmu Pendidikan',
    isbnOrIssn: '978-623-215-604-3',
    callNumber: '371.904 LES p',
    format: 'buku-cetak',
    faculty: 'Pendidikan Khusus',
    language: 'Bahasa Indonesia',
    abstract:
      'Membahas kerangka Universal Design for Learning (UDL) di kelas perkuliahan, penyesuaian asesmen, dan integrasi perangkat lunak pembaca teks untuk mendukung kemandirian akademik mahasiswa berkebutuhan khusus.',
    subjects: ['Pendidikan Inklusif', 'UDL', 'Teknologi Asistif', 'Pedagogi'],
    totalCopies: 4,
    availableCopies: 3,
    openAccess: false,
    accessibilityFeatures: ['Teks Terstruktur', 'Audio-Ready', 'Ramah Disleksia'],
    pageCount: 340,
    citationsCount: 73,
    coverTone: 'ochre',
    chapters: [
      {
        id: 'ch-1',
        number: 'Pratinjau Bab 01',
        title: 'Kerangka Universal Design for Learning (UDL) di Ruang Kuliah',
        readingMinutes: 5,
        keyTakeaway:
          'Menyediakan berbagai cara penyajian materi, ekspresi tugas, dan pelibatan mahasiswa membuka potensi akademik secara adil.',
        paragraphs: [
          'Buku cetak ini tersedia untuk peminjaman sirkulasi daring maupun pengambilan langsung di Meja Layanan Inklusif Lantai 1. Bab pratinjau digital ini disediakan agar seluruh anggota dapat menelaah kerangka UDL sebelum meminjam salinan fisik atau mengajukan alih format audio penuh.',
          'Tiga pilar UDL menekankan beragam sarana representasi (teks, audio, diagram beranotasi), beragam sarana aksi dan ekspresi, serta beragam sarana pelibatan belajar yang relevan dengan minat riset mahasiswa.',
        ],
      },
    ],
  },
];

export const INITIAL_LOANS: LoanRecord[] = [
  {
    id: 'ln-101',
    itemId: 'bk-002',
    borrowedAt: '2026-11-18',
    dueAt: '2026-12-02',
    renewalsUsed: 0,
    maxRenewals: 2,
    status: 'aktif',
  },
  {
    id: 'ln-102',
    itemId: 'bk-004',
    borrowedAt: '2026-11-14',
    dueAt: '2026-11-28',
    renewalsUsed: 1,
    maxRenewals: 2,
    status: 'aktif',
  },
  {
    id: 'ln-103',
    itemId: 'bk-003',
    borrowedAt: '2026-11-22',
    dueAt: '-',
    renewalsUsed: 0,
    maxRenewals: 2,
    status: 'antrean',
    queuePosition: 1,
  },
];

export const LEARNING_GUIDES: LearningGuide[] = [
  {
    id: 'lg-1',
    category: 'Panduan Riset',
    title: 'Strategi Penelusuran Literatur Sistematis dengan Operator Boolean',
    summary:
      'Cara merumuskan kata kunci akademik, menggabungkan operator AND/OR/NOT, serta menyaring artikel peer-reviewed secara cepat dan presisi.',
    estimatedMinutes: 8,
    updatedAt: 'November 2026',
    steps: [
      {
        heading: '1. Pecah Topik Menjadi Konsep Inti',
        detail:
          'Identifikasi 2 hingga 3 konsep utama dari pertanyaan riset Anda beserta sinonimnya dalam bahasa Indonesia dan bahasa Inggris (misalnya: "desain inklusif" ATAU "universal design").',
      },
      {
        heading: '2. Gunakan Filter Format & Tahun Terbit',
        detail:
          'Batasi rentang tahun 5 tahun terakhir untuk kajian teknologi dan kebijakan, atau perluas rentang waktu untuk penelusuran landasan teori klasik di filsafat.',
      },
      {
        heading: '3. Verifikasi Rujukan Silang (Citation Chaining)',
        detail:
          'Telusuri daftar pustaka dari satu artikel kunci yang paling relevan untuk menemukan karya fondasional dan riset lanjutan terbaru.',
      },
    ],
  },
  {
    id: 'lg-2',
    category: 'Aksesibilitas Akademik',
    title: 'Panduan Mengoptimalkan Pembaca Suara & Pintasan Papan Ketik',
    summary:
      'Maksimalkan fitur baca nyaring, mode huruf ramah disleksia, serta navigasi tanpa tetikus di seluruh layanan Pustaka Akademia.',
    estimatedMinutes: 5,
    updatedAt: 'November 2026',
    steps: [
      {
        heading: '1. Pintasan Fokus Pencarian Cepat',
        detail:
          'Tekan tombol "/" saat berada di halaman Katalog untuk langsung memindahkan fokus kursor ke bilah pencarian koleksi tanpa perlu menggulir.',
      },
      {
        heading: '2. Atur Kecepatan Pembaca Suara di E-Book Reader',
        detail:
          'Pada mode baca e-book, aktifkan tombol "Bacakan Bab" dan pilih kecepatan antara 0.8x hingga 1.5x. Paragraf yang sedang dibacakan akan disorot secara otomatis.',
      },
      {
        heading: '3. Ajukan Alih Format Khusus',
        detail:
          'Jika membutuhkan buku cetak dalam format Braille digital (BRF) atau Audio DAISY penuh, gunakan formulir Pengajuan Alih Format di menu Sirkulasi Daring.',
      },
    ],
  },
  {
    id: 'lg-3',
    category: 'Literasi Sitasi',
    title: 'Etika Pengutipan & Manajemen Daftar Pustaka (APA 7, IEEE, Chicago)',
    summary:
      'Hindari plagiarisme tak disengaja dengan memahami teknik parafrasa yang tepat dan format sitasi standar tugas akhir.',
    estimatedMinutes: 6,
    updatedAt: 'Oktober 2026',
    steps: [
      {
        heading: '1. Bedakan Kutipan Langsung dan Parafrasa',
        detail:
          'Gunakan kutipan langsung hanya bila susunan kata asli sangat krusial (misalnya definisi hukum atau kutipan filosofis), dan sertakan nomor halaman.',
      },
      {
        heading: '2. Gunakan Generator Sitasi Bawaan Katalog',
        detail:
          'Buka detail koleksi mana pun di Pustaka Akademia lalu pilih tab Sitasi untuk menyalin format APA ke-7, IEEE, Chicago, atau BibTeX secara instan.',
      },
    ],
  },
  {
    id: 'lg-4',
    category: 'Sumber Terbuka',
    title: 'Memanfaatkan Repositori Skripsi & Modul Ajar Terbuka (OER)',
    summary:
      'Akses penuh bahan kuliah terbuka, dataset riset mahasiswa, dan publikasi ilmiah tanpa batas kuota peminjaman.',
    estimatedMinutes: 4,
    updatedAt: 'November 2026',
    steps: [
      {
        heading: '1. Filter "Akses Terbuka" di Katalog',
        detail:
          'Koleksi bertanda Akses Terbuka dapat langsung dibaca seluruh isinya dan disimpan catatannya kapan saja tanpa mengurangi kuota 5 pinjaman aktif.',
      },
      {
        heading: '2. Ekspor Catatan Belajar',
        detail:
          'Gunakan panel Catatan & Penanda di dalam pembaca e-book untuk merangkum temuan penting setiap bab dan mengunduhnya sebagai berkas teks.',
      },
    ],
  },
];

export const OPEN_DATABASES: OpenDatabaseLink[] = [
  {
    id: 'db-1',
    name: 'GARUDA (Garba Rujukan Digital)',
    scope: 'Jurnal Ilmiah Nasional Terakreditasi',
    description:
      'Portal indeksasi dan akses artikel ilmiah terbitan perguruan tinggi dan lembaga riset di seluruh Indonesia.',
    url: 'https://garuda.kemdikbud.go.id/',
    accessType: 'Akses Terbuka Penuh',
  },
  {
    id: 'db-2',
    name: 'DOAJ (Directory of Open Access Journals)',
    scope: 'Jurnal Internasional Peer-Reviewed',
    description:
      'Direktori independen ribuan jurnal ilmiah berkualitas lintas disiplin yang bebas biaya baca dan ramah sitasi.',
    url: 'https://doaj.org/',
    accessType: 'Akses Terbuka Penuh',
  },
  {
    id: 'db-3',
    name: 'Indonesia OneSearch (Perpusnas RI)',
    scope: 'Katalog Induk Nasional & Repositori',
    description:
      'Pintu pencarian tunggal yang menghimpun koleksi perpustakaan universitas, lembaga kearsipan, dan museum nasional.',
    url: 'https://onesearch.id/',
    accessType: 'Akses Terbuka Penuh',
  },
  {
    id: 'db-4',
    name: 'OpenStax Academic Textbooks',
    scope: 'Buku Ajar Kuliah Aksesibel',
    description:
      'Buku teks perguruan tinggi berlisensi terbuka dengan struktur HTML/EPUB bersih dan dukungan teks alternatif gambar.',
    url: 'https://openstax.org/',
    accessType: 'Akses Terbuka Penuh',
  },
];
