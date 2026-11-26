import { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { LEARNING_GUIDES, OPEN_DATABASES } from '../data/catalogData';
import { LibraryItem } from '../types/library';
import { CitationStyle, generateCitation } from '../utils/libraryHelpers';

interface LearningResourcesViewProps {
  catalog: LibraryItem[];
  onOpenCatalogWithQuery: (query: string) => void;
}

const CITATION_STYLES: CitationStyle[] = ['APA', 'IEEE', 'Chicago', 'BibTeX'];

export function LearningResourcesView({
  catalog,
  onOpenCatalogWithQuery,
}: LearningResourcesViewProps) {
  const [expandedGuideId, setExpandedGuideId] = useState<string>(
    LEARNING_GUIDES[0]?.id ?? ''
  );
  const [selectedItemId, setSelectedItemId] = useState<string>(
    catalog[0]?.id ?? ''
  );
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA');
  const [copied, setCopied] = useState(false);

  const selectedItem =
    catalog.find((c) => c.id === selectedItemId) ?? catalog[0];
  const citationText = selectedItem
    ? generateCitation(selectedItem, citationStyle)
    : '';

  const handleCopy = async () => {
    if (!citationText) return;
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section aria-labelledby="judul-sumber-belajar" className="py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="border-b border-[var(--border-hairline)] pb-6">
          <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
            Pusat Literasi Informasi & Referensi Terbuka
          </p>
          <h1
            id="judul-sumber-belajar"
            className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] text-balance"
          >
            Sumber Belajar & Informasi Akademik
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
            Akses cepat panduan riset mahasiswa, alat bantu sitasi otomatis, direktori jurnal terbuka, serta informasi jam layanan pustakawan inklusif.
          </p>
        </div>

        {/* Interactive Learning Guides */}
        <section aria-labelledby="judul-panduan-riset">
          <h2
            id="judul-panduan-riset"
            className="font-display text-2xl font-semibold text-[var(--text-primary)]"
          >
            Panduan Riset & Literasi Digital
          </h2>
          <div className="mt-5 space-y-3">
            {LEARNING_GUIDES.map((guide) => {
              const isOpen = expandedGuideId === guide.id;
              return (
                <article
                  key={guide.id}
                  className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpandedGuideId(isOpen ? '' : guide.id)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--text-secondary)]">
                        {guide.category} · {guide.estimatedMinutes} menit baca · Diperbarui {guide.updatedAt}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                        {guide.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[var(--text-secondary)]">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-5 py-5 space-y-4">
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {guide.summary}
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {guide.steps.map((step) => (
                          <div
                            key={step.heading}
                            className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4"
                          >
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                              {step.heading}
                            </h4>
                            <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Standalone Citation Tool + Quick Topic Jump */}
        <section
          aria-labelledby="judul-alat-sitasi"
          className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:max-w-sm">
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <h2
                  id="judul-alat-sitasi"
                  className="font-display text-xl font-semibold text-[var(--text-primary)]"
                >
                  Alat Bantu Sitasi Mandiri
                </h2>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Pilih koleksi dari katalog untuk menghasilkan format daftar pustaka siap tempel bagi makalah, skripsi, atau jurnal.
              </p>

              <div className="mt-4">
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Telusuri cepat berdasarkan topik populer:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Aksesibilitas', 'Epistemologi', 'Mangrove', 'Statistika', 'Etika AI'].map(
                    (topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => onOpenCatalogWithQuery(topic)}
                        className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="pilih-koleksi-sitasi"
                    className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                  >
                    Pilih Koleksi Rujukan
                  </label>
                  <select
                    id="pilih-koleksi-sitasi"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs sm:text-sm text-[var(--text-primary)] min-h-[40px]"
                  >
                    {catalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} ({item.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Gaya Sitasi
                  </span>
                  <div className="flex items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-1">
                    {CITATION_STYLES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setCitationStyle(st)}
                        className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                          citationStyle === st
                            ? 'bg-[var(--accent-primary)] text-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <pre className="whitespace-pre-wrap rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3.5 text-xs sm:text-sm font-mono-catalog text-[var(--text-primary)] leading-relaxed">
                {citationText}
              </pre>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--accent-primary-hover)] min-h-[38px]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Sitasi Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Salin Format {citationStyle}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Open Academic Databases Directory */}
        <section aria-labelledby="judul-direktori-terbuka">
          <h2
            id="judul-direktori-terbuka"
            className="font-display text-2xl font-semibold text-[var(--text-primary)]"
          >
            Portal Basis Data & Jurnal Akses Terbuka
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {OPEN_DATABASES.map((db) => (
              <article
                key={db.id}
                className="flex flex-col justify-between rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-5"
              >
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {db.scope} · {db.accessType}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                    {db.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {db.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-hairline)]">
                  <a
                    href={db.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                  >
                    <span>Kunjungi Portal Resmi</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Operational Hours & Inclusive Support Info */}
        <section
          aria-labelledby="judul-jam-layanan"
          className="border-t border-[var(--border-hairline)] pt-8"
        >
          <h2
            id="judul-jam-layanan"
            className="font-display text-xl font-semibold text-[var(--text-primary)]"
          >
            Informasi Layanan & Jam Operasional
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Portal Digital & E-Book</span>
              </dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)]">
                Aktif 24 Jam / 7 Hari
              </dd>
            </div>
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs font-medium text-[var(--text-secondary)]">
                Ruang Baca Inklusif Kampus
              </dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)] font-mono-catalog">
                Senin–Sabtu · 08.00–20.00 WIB
              </dd>
            </div>
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <dt className="text-xs font-medium text-[var(--text-secondary)]">
                Konsultasi Pustakawan & Teknologi Bantu
              </dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)]">
                Layanan Daring & Meja Lantai 1
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}
