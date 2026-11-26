import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Info,
  Search,
  SlidersHorizontal,
  Volume2,
  X,
} from 'lucide-react';
import {
  AccessibilityFeature,
  FacultyDiscipline,
  LibraryItem,
  LoanRecord,
  ResourceFormat,
} from '../types/library';
import { getFormatLabel } from '../utils/libraryHelpers';
import { BookCover } from './BookCover';

interface CatalogSectionProps {
  items: LibraryItem[];
  loans: LoanRecord[];
  savedIds: string[];
  initialQuery?: string;
  onSelectDetail: (item: LibraryItem) => void;
  onOpenReader: (item: LibraryItem) => void;
  onBorrowOrQueue: (item: LibraryItem) => void;
  onToggleSave: (itemId: string) => void;
}

const FORMAT_TABS: { id: 'semua' | ResourceFormat; label: string }[] = [
  { id: 'semua', label: 'Semua Format' },
  { id: 'e-book', label: 'E-Book' },
  { id: 'jurnal', label: 'Jurnal Ilmiah' },
  { id: 'skripsi', label: 'Skripsi & Tesis' },
  { id: 'modul-ajar', label: 'Modul Ajar' },
  { id: 'buku-cetak', label: 'Buku Cetak' },
];

const FACULTIES: ('semua' | FacultyDiscipline)[] = [
  'semua',
  'Filsafat & Humaniora',
  'Ilmu Komputer & AI',
  'Ekologi & Hayati',
  'Desain & Arsitektur Inklusif',
  'Ekonomi & Kebijakan',
  'Pendidikan Khusus',
];

const ACCESS_FEATURES: ('semua' | AccessibilityFeature)[] = [
  'semua',
  'Audio-Ready',
  'Teks Terstruktur',
  'Ramah Disleksia',
  'Kontras Tinggi',
  'Deskripsi Visual',
];

export function CatalogSection({
  items,
  loans,
  savedIds,
  initialQuery = '',
  onSelectDetail,
  onOpenReader,
  onBorrowOrQueue,
  onToggleSave,
}: CatalogSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [formatFilter, setFormatFilter] = useState<'semua' | ResourceFormat>('semua');
  const [facultyFilter, setFacultyFilter] = useState<'semua' | FacultyDiscipline>('semua');
  const [accessFilter, setAccessFilter] = useState<'semua' | AccessibilityFeature>('semua');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyOpenAccess, setOnlyOpenAccess] = useState(false);
  const [sortBy, setSortBy] = useState<'relevansi' | 'terbaru' | 'judul' | 'sitasi'>('relevansi');
  const [showFilters, setShowFilters] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Press '/' to jump directly to catalog search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const activeLoanMap = useMemo(() => {
    const map = new Map<string, LoanRecord>();
    loans.forEach((loan) => {
      if (loan.status === 'aktif' || loan.status === 'antrean') {
        map.set(loan.itemId, loan);
      }
    });
    return map;
  }, [loans]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((item) => {
      if (formatFilter !== 'semua' && item.format !== formatFilter) return false;
      if (facultyFilter !== 'semua' && item.faculty !== facultyFilter) return false;
      if (
        accessFilter !== 'semua' &&
        !item.accessibilityFeatures.includes(accessFilter)
      ) {
        return false;
      }
      if (onlyAvailable && item.availableCopies === 0 && !item.openAccess) return false;
      if (onlyOpenAccess && !item.openAccess) return false;

      if (!q) return true;
      const haystack = [
        item.title,
        item.subtitle ?? '',
        item.authors.join(' '),
        item.abstract,
        item.subjects.join(' '),
        item.callNumber,
        item.isbnOrIssn,
        item.faculty,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (sortBy === 'terbaru') {
      return [...list].sort((a, b) => b.year - a.year);
    }
    if (sortBy === 'judul') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'id'));
    }
    if (sortBy === 'sitasi') {
      return [...list].sort((a, b) => b.citationsCount - a.citationsCount);
    }
    return list;
  }, [
    items,
    query,
    formatFilter,
    facultyFilter,
    accessFilter,
    onlyAvailable,
    onlyOpenAccess,
    sortBy,
  ]);

  const resetFilters = () => {
    setQuery('');
    setFormatFilter('semua');
    setFacultyFilter('semua');
    setAccessFilter('semua');
    setOnlyAvailable(false);
    setOnlyOpenAccess(false);
    setSortBy('relevansi');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    formatFilter !== 'semua' ||
    facultyFilter !== 'semua' ||
    accessFilter !== 'semua' ||
    onlyAvailable ||
    onlyOpenAccess;

  return (
    <section aria-labelledby="judul-katalog" className="py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-hairline)] pb-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
              Penelusuran Terpadu
            </p>
            <h1
              id="judul-katalog"
              className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] text-balance"
            >
              Katalog Koleksi Akademik
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Telusuri buku elektronik, jurnal ilmiah, repositori tugas akhir, dan modul ajar terbuka dengan filter aksesibilitas.
          </p>
        </div>

        {/* Search Bar + Filter Toggle */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="cari-katalog-input" className="sr-only">
              Cari judul, penulis, subjek, ISBN, atau nomor panggil
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="cari-katalog-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, penulis, kata kunci, nomor panggil DDC, atau ISBN (tekan /)"
              className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] py-2.5 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 min-h-[44px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>{showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}</span>
          </button>
        </div>

        {/* Interactive Format Tabs */}
        <div
          role="tablist"
          aria-label="Filter format koleksi"
          className="mt-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-1.5"
        >
          {FORMAT_TABS.map((tab) => {
            const active = formatFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFormatFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
                  active
                    ? 'bg-[var(--bg-card)] text-[var(--accent-primary)] shadow-sm font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Faceted Secondary Controls */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="filter-fakultas"
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Bidang Ilmu / Fakultas
              </label>
              <select
                id="filter-fakultas"
                value={facultyFilter}
                onChange={(e) =>
                  setFacultyFilter(e.target.value as 'semua' | FacultyDiscipline)
                }
                className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] min-h-[40px]"
              >
                {FACULTIES.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac === 'semua' ? 'Semua Bidang Ilmu' : fac}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-aksesibilitas"
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Dukungan Aksesibilitas
              </label>
              <select
                id="filter-aksesibilitas"
                value={accessFilter}
                onChange={(e) =>
                  setAccessFilter(e.target.value as 'semua' | AccessibilityFeature)
                }
                className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] min-h-[40px]"
              >
                {ACCESS_FEATURES.map((feat) => (
                  <option key={feat} value={feat}>
                    {feat === 'semua' ? 'Semua Fitur Inklusif' : feat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="urutkan-katalog"
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Urutkan Hasil
              </label>
              <select
                id="urutkan-katalog"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'relevansi' | 'terbaru' | 'judul' | 'sitasi'
                  )
                }
                className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] min-h-[40px]"
              >
                <option value="relevansi">Relevansi Katalog</option>
                <option value="terbaru">Tahun Terbit Terbaru</option>
                <option value="judul">Judul (A–Z)</option>
                <option value="sitasi">Paling Banyak Disitasi</option>
              </select>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent-primary)]"
                />
                <span>Hanya yang tersedia sekarang</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOpenAccess}
                  onChange={(e) => setOnlyOpenAccess(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent-primary)]"
                />
                <span>Hanya Akses Terbuka (OER)</span>
              </label>
            </div>
          </div>
        )}

        {/* Result Summary Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
          <p aria-live="polite">
            Menampilkan <strong className="font-mono-catalog text-[var(--text-primary)]">{filteredItems.length}</strong> dari{' '}
            <span className="font-mono-catalog">{items.length}</span> koleksi akademik
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
            >
              Atur ulang semua filter
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="mt-8 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-6 py-14 text-center">
            <p className="font-display text-xl font-medium text-[var(--text-primary)]">
              Tidak ada koleksi yang cocok dengan kriteria pencarian
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
              Coba perluas kata kunci, ubah bidang ilmu, atau atur ulang filter aksesibilitas untuk melihat seluruh koleksi yang tersedia.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] min-h-[44px]"
            >
              Tampilkan Semua Koleksi
            </button>
          </div>
        ) : (
          /* Catalog List - Clean Editorial Rows */
          <div className="mt-6 divide-y divide-[var(--border-hairline)] border-t border-b border-[var(--border-hairline)]">
            {filteredItems.map((item) => {
              const existingLoan = activeLoanMap.get(item.id);
              const isSaved = savedIds.includes(item.id);
              const isBorrowed = existingLoan?.status === 'aktif';
              const isQueued = existingLoan?.status === 'antrean';
              const canReadNow = item.openAccess || isBorrowed || item.chapters.length > 0;

              return (
                <article
                  key={item.id}
                  className="group py-6 sm:py-7 flex flex-col gap-5 md:flex-row md:items-start"
                >
                  {/* Cover Thumbnail */}
                  <button
                    type="button"
                    onClick={() => onSelectDetail(item)}
                    className="w-32 sm:w-36 shrink-0 text-left focus-visible:outline-none"
                    aria-label={`Lihat detail bibliografi ${item.title}`}
                  >
                    <BookCover item={item} />
                  </button>

                  {/* Bibliographic Body */}
                  <div className="flex-1 min-w-0">
                    {/* Unboxed Metadata Line (Zero-Pill Rule) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">
                        {getFormatLabel(item.format)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.faculty}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-catalog">{item.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-catalog">DDC {item.callNumber}</span>
                      {item.openAccess && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[var(--accent-primary)]">
                            Akses Terbuka
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title & Authors */}
                    <h2 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectDetail(item)}
                        className="text-left hover:text-[var(--accent-primary)] transition-colors"
                      >
                        {item.title}
                      </button>
                    </h2>

                    {item.subtitle && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
                      {item.authors.join(', ')}
                    </p>

                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 max-w-3xl">
                      {item.abstract}
                    </p>

                    {/* Accessibility & Availability Line (Icon + Text, never color alone) */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--text-secondary)]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                        {item.availableCopies > 0 || item.openAccess ? (
                          <>
                            <CheckCircle2
                              className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              {item.openAccess
                                ? 'Tersedia Tanpa Batas'
                                : `Tersedia ${item.availableCopies} dari ${item.totalCopies} lisensi`}
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock
                              className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Semua eksemplar sedang dipinjam (antrean terbuka)</span>
                          </>
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{item.accessibilityFeatures.join(' · ')}</span>
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      {canReadNow && (
                        <button
                          type="button"
                          onClick={() => onOpenReader(item)}
                          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                        >
                          <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>
                            {item.format === 'buku-cetak' ? 'Baca Pratinjau Digital' : 'Baca E-Book'}
                          </span>
                        </button>
                      )}

                      {!item.openAccess && (
                        <button
                          type="button"
                          onClick={() => onBorrowOrQueue(item)}
                          disabled={isBorrowed || isQueued}
                          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                            isBorrowed || isQueued
                              ? 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] cursor-default'
                              : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                          }`}
                        >
                          <span>
                            {isBorrowed
                              ? 'Sedang Dipinjam'
                              : isQueued
                              ? `Dalam Antrean (#${existingLoan?.queuePosition ?? 1})`
                              : item.availableCopies > 0
                              ? 'Pinjam Daring (14 Hari)'
                              : 'Masuk Antrean'}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectDetail(item)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                      >
                        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Detail & Sitasi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleSave(item.id)}
                        aria-pressed={isSaved}
                        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                      >
                        <Bookmark
                          className={`h-4 w-4 shrink-0 ${
                            isSaved ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span>{isSaved ? 'Tersimpan di Rak' : 'Simpan'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
