import { useState } from 'react';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { HERO_READING_HALL_IMAGE } from '../data/catalogData';
import { ActiveSection, LibraryItem } from '../types/library';
import { getFormatLabel } from '../utils/libraryHelpers';
import { BookCover } from './BookCover';

interface HomeViewProps {
  featuredItems: LibraryItem[];
  onQuickSearch: (query: string) => void;
  onNavigate: (section: ActiveSection) => void;
  onSelectDetail: (item: LibraryItem) => void;
  onOpenReader: (item: LibraryItem) => void;
}

export function HomeView({
  featuredItems,
  onQuickSearch,
  onNavigate,
  onSelectDetail,
  onOpenReader,
}: HomeViewProps) {
  const [heroQuery, setHeroQuery] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(heroQuery);
  };

  return (
    <div>
      {/* Hero Split */}
      <section className="border-b border-[var(--border-hairline)] py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left Content Column */}
            <div className="flex flex-col justify-between lg:col-span-6 lg:pr-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
                  Perpustakaan Digital Perguruan Tinggi · Akses Terbuka & Setara
                </p>
                <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.1] text-balance">
                  Pengetahuan Akademik yang Inklusif, Cepat, dan Terbuka
                </h1>
                <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  Pinjam koleksi secara daring, baca e-book dengan dukungan pembaca suara serta tipografi ramah disleksia, dan temukan rujukan kuliah lintas disiplin kapan saja.
                </p>

                {/* Quick Search Form */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="mt-7 flex flex-col gap-2.5 sm:flex-row"
                  role="search"
                  aria-label="Pencarian cepat koleksi perpustakaan"
                >
                  <label htmlFor="hero-cari-koleksi" className="sr-only">
                    Cari judul buku, penulis, atau topik penelitian
                  </label>
                  <div className="relative flex-1">
                    <Search
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
                      aria-hidden="true"
                    />
                    <input
                      id="hero-cari-koleksi"
                      type="search"
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      placeholder="Cari judul buku, penulis, atau kata kunci..."
                      className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 min-h-[46px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent-primary)] px-5 py-3 text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[46px]"
                  >
                    <span>Cari Koleksi</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border-hairline)] pt-5 text-sm">
                <button
                  type="button"
                  onClick={() => onNavigate('katalog')}
                  className="font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap"
                >
                  Telusuri Semua Katalog
                </button>
                <span aria-hidden="true" className="text-[var(--border-hairline)]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('sirkulasi')}
                  className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap"
                >
                  Layanan Sirkulasi Daring
                </button>
                <span aria-hidden="true" className="text-[var(--border-hairline)]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('sumber-belajar')}
                  className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap"
                >
                  Panduan & Sumber Belajar
                </button>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6">
              {!heroImgError ? (
                <figure className="h-full overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
                  <img
                    src={HERO_READING_HALL_IMAGE}
                    alt="Ruang baca perpustakaan akademik modern dengan jalur aksesibel dan pencahayaan alami"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="h-64 w-full object-cover sm:h-80 lg:h-full"
                  />
                </figure>
              ) : (
                <div className="flex h-64 lg:h-full flex-col justify-end rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-8">
                  <BookOpen className="h-10 w-10 text-[var(--accent-primary)]" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl font-semibold">
                    Ruang Baca Terpadu Pustaka Akademia
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Terbuka bagi seluruh sivitas akademika dengan dukungan teknologi bantu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4-Column Operational Utility & Accessibility Strip */}
          <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--border-hairline)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs text-[var(--text-secondary)]">Jam Akses Digital</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
                24 Jam Daring
              </dd>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Sirkulasi mandiri & pembaca e-book tersedia setiap saat.
              </p>
            </div>
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs text-[var(--text-secondary)]">Standar Inklusivitas</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
                Audio & Disleksia
              </dd>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Pembaca suara, huruf khusus, dan mode kontras WCAG AAA.
              </p>
            </div>
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs text-[var(--text-secondary)]">Masa Peminjaman</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)] font-mono-catalog">
                14 Hari · 2x Perpanjang
              </dd>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Perpanjangan instan daring tanpa denda keterlambatan digital.
              </p>
            </div>
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs text-[var(--text-secondary)]">Ragam Koleksi</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
                5 Format Akademik
              </dd>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                E-Book, jurnal ilmiah, skripsi/tesis, modul OER, dan buku cetak.
              </p>
            </div>
          </dl>
        </div>
      </section>

      {/* Featured Curated Collection */}
      <section aria-labelledby="judul-koleksi-pilihan" className="py-12 sm:py-16 border-b border-[var(--border-hairline)]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                Kurasi Pustakawan Semester Berjalan
              </p>
              <h2
                id="judul-koleksi-pilihan"
                className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] text-balance"
              >
                Koleksi Akademik Pilihan
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('katalog')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
            >
              <span>Lihat seluruh katalog</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.slice(0, 4).map((item) => (
              <article key={item.id} className="group flex flex-col">
                <button
                  type="button"
                  onClick={() => onSelectDetail(item)}
                  className="w-full text-left"
                  aria-label={`Buka rincian ${item.title}`}
                >
                  <BookCover item={item} />
                </button>

                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {getFormatLabel(item.format)} · {item.year}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)] leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectDetail(item)}
                        className="text-left hover:text-[var(--accent-primary)] transition-colors"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {item.authors[0]}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-hairline)] pt-3">
                    <button
                      type="button"
                      onClick={() => onOpenReader(item)}
                      className="text-xs font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap"
                    >
                      Baca E-Book
                    </button>
                    <span aria-hidden="true" className="text-xs text-[var(--border-hairline)]">
                      ·
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectDetail(item)}
                      className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap"
                    >
                      Detail & Sitasi
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars of Inclusive Service */}
      <section aria-labelledby="judul-layanan-utama" className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2
            id="judul-layanan-utama"
            className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] text-balance"
          >
            Layanan Inti Perpustakaan Digital
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6">
              <div>
                <p className="text-xs font-mono-catalog text-[var(--text-secondary)]">
                  01. Sirkulasi Daring
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Pinjam, Perpanjang & Antre Mandiri
                </h3>
                <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Kelola peminjaman lisensi e-book maupun reservasi buku cetak secara instan. Ajukan perpanjangan masa pinjam dan konversi format aksesibel dari satu tempat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('sirkulasi')}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline w-fit"
              >
                <span>Buka Sirkulasi Daring</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6">
              <div>
                <p className="text-xs font-mono-catalog text-[var(--text-secondary)]">
                  02. Pembaca E-Book Inklusif
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Baca Nyaring & Tipografi Adaptif
                </h3>
                <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Setiap e-book dilengkapi mode baca sepia/malam/kontras tinggi, pilihan huruf ramah disleksia, glosarium istilah bab, catatan belajar, serta suara otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenReader(featuredItems[0])}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline w-fit"
              >
                <span>Coba Pembaca E-Book</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6">
              <div>
                <p className="text-xs font-mono-catalog text-[var(--text-secondary)]">
                  03. Sumber Belajar Fleksibel
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Panduan Riset, Sitasi & Portal Terbuka
                </h3>
                <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Akses panduan literasi informasi, generator sitasi APA/IEEE/Chicago/BibTeX, serta direktori repositori ilmiah terbuka nasional dan internasional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('sumber-belajar')}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline w-fit"
              >
                <span>Jelajahi Sumber Belajar</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
