import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Copy, Quote, X } from 'lucide-react';
import { LibraryItem, LoanRecord } from '../types/library';
import {
  CitationStyle,
  generateCitation,
  getFormatLabel,
} from '../utils/libraryHelpers';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  item: LibraryItem | null;
  loan?: LoanRecord;
  onClose: () => void;
  onOpenReader: (item: LibraryItem) => void;
  onBorrowOrQueue: (item: LibraryItem) => void;
}

const CITATION_STYLES: CitationStyle[] = ['APA', 'IEEE', 'Chicago', 'BibTeX'];

export function BookDetailModal({
  item,
  loan,
  onClose,
  onOpenReader,
  onBorrowOrQueue,
}: BookDetailModalProps) {
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA');
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (item) {
      closeBtnRef.current?.focus();
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  const citationText = generateCitation(item, citationStyle);
  const isBorrowed = loan?.status === 'aktif';
  const isQueued = loan?.status === 'antrean';

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-judul-koleksi"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-4">
          <p className="text-xs font-mono-catalog text-[var(--text-secondary)]">
            Rekaman Bibliografi · {item.callNumber}
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup rincian koleksi"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="w-40 sm:w-44 shrink-0">
              <BookCover item={item} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-secondary)]">
                {getFormatLabel(item.format)} · {item.faculty} · {item.language}
              </p>
              <h2
                id="detail-judul-koleksi"
                className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-tight text-balance"
              >
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="mt-1 text-base text-[var(--text-secondary)]">
                  {item.subtitle}
                </p>
              )}
              <p className="mt-2.5 text-sm font-medium text-[var(--text-primary)]">
                Oleh {item.authors.join(', ')}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.abstract}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReader(item);
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] transition-colors min-h-[44px]"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {item.format === 'buku-cetak' ? 'Baca Pratinjau Digital' : 'Buka Pembaca E-Book'}
                  </span>
                </button>

                {!item.openAccess && (
                  <button
                    type="button"
                    onClick={() => onBorrowOrQueue(item)}
                    disabled={isBorrowed || isQueued}
                    className={`inline-flex items-center rounded-md border px-4 py-2.5 text-sm font-medium min-h-[44px] ${
                      isBorrowed || isQueued
                        ? 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    {isBorrowed
                      ? 'Sudah Dipinjam'
                      : isQueued
                      ? `Dalam Antrean (#${loan?.queuePosition ?? 1})`
                      : item.availableCopies > 0
                      ? 'Pinjam Daring (14 Hari)'
                      : 'Masuk Daftar Antrean'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Institutional Accession Metadata Grid */}
          <section aria-labelledby="judul-metadata-bibliografi">
            <h3
              id="judul-metadata-bibliografi"
              className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-hairline)] pb-2"
            >
              Informasi Bibliografi & Aksesibilitas
            </h3>
            <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 text-sm">
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Penerbit</dt>
                <dd className="font-medium text-right">{item.publisher}</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Tahun Terbit</dt>
                <dd className="font-mono-catalog text-right">{item.year}</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">ISBN / ISSN</dt>
                <dd className="font-mono-catalog text-right">{item.isbnOrIssn}</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Nomor Panggil DDC</dt>
                <dd className="font-mono-catalog text-right">{item.callNumber}</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Jumlah Halaman</dt>
                <dd className="font-mono-catalog text-right">{item.pageCount} hlm.</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Sitasi Akademik</dt>
                <dd className="font-mono-catalog text-right">{item.citationsCount} sitasi</dd>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-[var(--border-hairline)]/60 pb-2">
                <dt className="text-[var(--text-secondary)]">Dukungan Inklusif</dt>
                <dd className="font-medium sm:text-right">
                  {item.accessibilityFeatures.join(' · ')}
                </dd>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:justify-between gap-1 pb-1">
                <dt className="text-[var(--text-secondary)]">Subjek Terkait</dt>
                <dd className="font-medium sm:text-right">{item.subjects.join(' · ')}</dd>
              </div>
            </dl>
          </section>

          {/* Academic Citation Generator */}
          <section
            aria-labelledby="judul-generator-sitasi"
            className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <h3 id="judul-generator-sitasi" className="text-sm font-semibold text-[var(--text-primary)]">
                  Generator Sitasi Instan
                </h3>
              </div>

              <div className="flex items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-1">
                {CITATION_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCitationStyle(style)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      citationStyle === style
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <pre className="mt-3 whitespace-pre-wrap rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3.5 text-xs sm:text-sm font-mono-catalog text-[var(--text-primary)] leading-relaxed">
              {citationText}
            </pre>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] min-h-[38px]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Tersalin ke Papan Klip</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Salin Sitasi {citationStyle}</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
