export type ResourceFormat =
  | 'e-book'
  | 'jurnal'
  | 'skripsi'
  | 'modul-ajar'
  | 'buku-cetak';

export type FacultyDiscipline =
  | 'Filsafat & Humaniora'
  | 'Ilmu Komputer & AI'
  | 'Ekologi & Hayati'
  | 'Desain & Arsitektur Inklusif'
  | 'Ekonomi & Kebijakan'
  | 'Pendidikan Khusus';

export type AccessibilityFeature =
  | 'Audio-Ready'
  | 'Teks Terstruktur'
  | 'Ramah Disleksia'
  | 'Kontras Tinggi'
  | 'Deskripsi Visual';

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface EbookChapter {
  id: string;
  number: string;
  title: string;
  readingMinutes: number;
  keyTakeaway: string;
  paragraphs: string[];
  glossary?: GlossaryEntry[];
}

export interface LibraryItem {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  year: number;
  publisher: string;
  isbnOrIssn: string;
  callNumber: string;
  format: ResourceFormat;
  faculty: FacultyDiscipline;
  language: 'Bahasa Indonesia' | 'Bahasa Inggris' | 'Dwibahasa (ID/EN)';
  abstract: string;
  subjects: string[];
  totalCopies: number;
  availableCopies: number;
  openAccess: boolean;
  accessibilityFeatures: AccessibilityFeature[];
  pageCount: number;
  citationsCount: number;
  coverImage?: string;
  coverTone: 'lapis' | 'charcoal' | 'forest' | 'ochre' | 'plum' | 'slate';
  chapters: EbookChapter[];
}

export interface LoanRecord {
  id: string;
  itemId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  renewalsUsed: number;
  maxRenewals: number;
  status: 'aktif' | 'dikembalikan' | 'antrean';
  queuePosition?: number;
}

export interface BookmarkNote {
  id: string;
  itemId: string;
  chapterId: string;
  chapterTitle: string;
  note: string;
  createdAt: string;
}

export interface FormatConversionRequest {
  id: string;
  title: string;
  targetFormat: 'Audio DAISY / MP3' | 'EPUB Terstruktur' | 'Braille Digital (BRF)' | 'Cetak Huruf Besar';
  notes: string;
  submittedAt: string;
  status: 'Diproses Pustakawan' | 'Tersedia untuk Diunduh';
}

export interface AccessibilityPrefs {
  theme: 'archival' | 'dark' | 'high-contrast';
  fontScale: 'normal' | 'large' | 'xlarge';
  dyslexiaFont: boolean;
  wideSpacing: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
}

export interface LearningGuide {
  id: string;
  category: 'Panduan Riset' | 'Literasi Sitasi' | 'Aksesibilitas Akademik' | 'Sumber Terbuka';
  title: string;
  summary: string;
  estimatedMinutes: number;
  updatedAt: string;
  steps: {
    heading: string;
    detail: string;
  }[];
}

export interface OpenDatabaseLink {
  id: string;
  name: string;
  scope: string;
  description: string;
  url: string;
  accessType: 'Akses Terbuka Penuh' | 'Langganan Kampus';
}

export type ActiveSection = 'beranda' | 'katalog' | 'sirkulasi' | 'sumber-belajar';
