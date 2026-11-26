import { useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
} from 'lucide-react';
import {
  FormatConversionRequest,
  LibraryItem,
  LoanRecord,
} from '../types/library';
import {
  formatIndonesianDate,
  getDaysRemaining,
  getFormatLabel,
} from '../utils/libraryHelpers';

interface CirculationViewProps {
  catalog: LibraryItem[];
  loans: LoanRecord[];
  savedIds: string[];
  readingProgress: Record<string, number>;
  conversionRequests: FormatConversionRequest[];
  onRenewLoan: (loanId: string) => void;
  onReturnLoan: (loanId: string) => void;
  onCancelQueue: (loanId: string) => void;
  onRemoveSaved: (itemId: string) => void;
  onOpenReader: (item: LibraryItem, chapterIdx?: number) => void;
  onSubmitConversionRequest: (
    req: Omit<FormatConversionRequest, 'id' | 'submittedAt' | 'status'>
  ) => void;
  onNavigateCatalog: () => void;
}

export function CirculationView({
  catalog,
  loans,
  savedIds,
  readingProgress,
  conversionRequests,
  onRenewLoan,
  onReturnLoan,
  onCancelQueue,
  onRemoveSaved,
  onOpenReader,
  onSubmitConversionRequest,
  onNavigateCatalog,
}: CirculationViewProps) {
  const [reqTitle, setReqTitle] = useState('');
  const [reqFormat, setReqFormat] =
    useState<FormatConversionRequest['targetFormat']>('Audio DAISY / MP3');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSubmittedMsg, setReqSubmittedMsg] = useState(false);

  const itemById = new Map(catalog.map((c) => [c.id, c]));
  const activeLoans = loans.filter((l) => l.status === 'aktif');
  const queuedLoans = loans.filter((l) => l.status === 'antrean');
  const returnedLoans = loans.filter((l) => l.status === 'dikembalikan');
  const savedItems = savedIds
    .map((id) => itemById.get(id))
    .filter((x): x is LibraryItem => Boolean(x));

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;
    onSubmitConversionRequest({
      title: reqTitle.trim(),
      targetFormat: reqFormat,
      notes: reqNotes.trim() || 'Kebutuhan studi perkuliahan semester berjalan.',
    });
    setReqTitle('');
    setReqNotes('');
    setReqSubmittedMsg(true);
    setTimeout(() => setReqSubmittedMsg(false), 3500);
  };

  return (
    <section aria-labelledby="judul-sirkulasi" className="py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Member Summary */}
        <div className="flex flex-col gap-6 border-b border-[var(--border-hairline)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
              Layanan Anggota Terpadu
            </p>
            <h1
              id="judul-sirkulasi"
              className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] text-balance"
            >
              Sirkulasi Daring & Rak Saya
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
              Kelola masa pinjam koleksi, perpanjangan daring, antrean reservasi, serta pengajuan alih format aksesibel tanpa perlu datang ke meja sirkulasi fisik.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-6 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-5 py-4 shrink-0">
            <div>
              <dt className="text-xs text-[var(--text-secondary)]">Pinjaman Aktif</dt>
              <dd className="mt-1 font-mono-catalog text-xl font-semibold text-[var(--text-primary)]">
                {activeLoans.length} / 5
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-secondary)]">Antrean</dt>
              <dd className="mt-1 font-mono-catalog text-xl font-semibold text-[var(--text-primary)]">
                {queuedLoans.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-secondary)]">Tersimpan</dt>
              <dd className="mt-1 font-mono-catalog text-xl font-semibold text-[var(--text-primary)]">
                {savedItems.length}
              </dd>
            </div>
          </dl>
        </div>

        {/* Active Loans */}
        <section aria-labelledby="judul-pinjaman-aktif">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="judul-pinjaman-aktif"
              className="font-display text-2xl font-semibold text-[var(--text-primary)]"
            >
              Pinjaman Aktif
            </h2>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="text-xs sm:text-sm font-medium text-[var(--accent-primary)] hover:underline whitespace-nowrap"
            >
              Tambah dari Katalog
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div className="mt-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-8 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Belum ada koleksi dalam masa peminjaman aktif.
              </p>
              <button
                type="button"
                onClick={onNavigateCatalog}
                className="mt-3 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-white min-h-[40px]"
              >
                Jelajahi Katalog Koleksi
              </button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-[var(--border-hairline)] rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)]">
              {activeLoans.map((loan) => {
                const item = itemById.get(loan.itemId);
                if (!item) return null;
                const daysLeft = getDaysRemaining(loan.dueAt);
                const progressChapter = readingProgress[item.id] ?? 0;

                return (
                  <div
                    key={loan.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)]">
                        <span>{getFormatLabel(item.format)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-catalog">DDC {item.callNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-catalog">
                          Dipinjam {formatIndonesianDate(loan.borrowedAt)}
                        </span>
                      </div>

                      <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                          <CalendarClock className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
                          <span className="font-mono-catalog">
                            Jatuh tempo {formatIndonesianDate(loan.dueAt)} ({daysLeft} hari tersisa)
                          </span>
                        </span>
                        <span className="text-[var(--text-secondary)] font-mono-catalog">
                          Perpanjangan: {loan.renewalsUsed}/{loan.maxRenewals}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenReader(item, progressChapter)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--accent-primary-hover)] min-h-[40px]"
                      >
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Lanjutkan Baca</span>
                      </button>

                      <button
                        type="button"
                        disabled={loan.renewalsUsed >= loan.maxRenewals}
                        onClick={() => onRenewLoan(loan.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] disabled:opacity-45 min-h-[40px]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Perpanjang (+7 Hari)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onReturnLoan(loan.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] min-h-[40px]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Kembalikan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Queued & Saved Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Waitlist */}
          <section aria-labelledby="judul-antrean">
            <h2
              id="judul-antrean"
              className="font-display text-xl font-semibold text-[var(--text-primary)]"
            >
              Antrean Reservasi ({queuedLoans.length})
            </h2>
            {queuedLoans.length === 0 ? (
              <p className="mt-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 text-sm text-[var(--text-secondary)]">
                Anda tidak memiliki antrean reservasi saat ini.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {queuedLoans.map((loan) => {
                  const item = itemById.get(loan.itemId);
                  if (!item) return null;
                  return (
                    <li
                      key={loan.id}
                      className="flex items-center justify-between gap-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-mono-catalog text-[var(--text-secondary)]">
                          Posisi antrean #{loan.queuePosition ?? 1} · {getFormatLabel(item.format)}
                        </p>
                        <p className="mt-0.5 font-display text-base font-semibold truncate">
                          {item.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelQueue(loan.id)}
                        className="rounded-md border border-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0 min-h-[38px]"
                      >
                        Batalkan
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Recent Returned History */}
            {returnedLoans.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Riwayat Pengembalian Terbaru
                </h3>
                <ul className="mt-2.5 divide-y divide-[var(--border-hairline)] rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
                  {returnedLoans.slice(0, 4).map((loan) => {
                    const item = itemById.get(loan.itemId);
                    if (!item) return null;
                    return (
                      <li
                        key={loan.id}
                        className="flex items-center justify-between gap-3 px-4 py-3 text-xs"
                      >
                        <span className="truncate font-medium text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[var(--text-secondary)] font-mono-catalog shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                          <span>Kembali {formatIndonesianDate(loan.returnedAt || '')}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* Saved Reading Shelf */}
          <section aria-labelledby="judul-rak-tersimpan">
            <h2
              id="judul-rak-tersimpan"
              className="font-display text-xl font-semibold text-[var(--text-primary)]"
            >
              Daftar Bacaan Tersimpan ({savedItems.length})
            </h2>
            {savedItems.length === 0 ? (
              <p className="mt-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 text-sm text-[var(--text-secondary)]">
                Tandai buku atau jurnal di katalog menggunakan tombol "Simpan" untuk menyusun daftar bacaan kuliah Anda.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {savedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--text-secondary)]">
                        {getFormatLabel(item.format)} · {item.faculty}
                      </p>
                      <p className="mt-0.5 font-display text-base font-semibold truncate">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenReader(item)}
                        className="rounded-md bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-medium text-white min-h-[38px]"
                      >
                        Baca
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSaved(item.id)}
                        aria-label={`Hapus ${item.title} dari daftar tersimpan`}
                        className="rounded-md border border-[var(--border-hairline)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] min-h-[38px] min-w-[38px]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Inclusive Format Conversion & Acquisition Request */}
        <section
          aria-labelledby="judul-alih-format"
          className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                Layanan Perpustakaan Inklusif
              </p>
              <h2
                id="judul-alih-format"
                className="mt-1 font-display text-2xl font-semibold text-[var(--text-primary)]"
              >
                Ajukan Alih Format Aksesibel
              </h2>
              <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                Membutuhkan buku cetak atau diktat kuliah dalam format Audio DAISY, EPUB terstruktur, Braille digital (BRF), atau cetak huruf besar? Ajukan permintaan langsung kepada tim pustakawan aksesibilitas kami.
              </p>

              {conversionRequests.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Status Pengajuan Anda ({conversionRequests.length})
                  </h3>
                  <ul className="mt-2.5 space-y-2">
                    {conversionRequests.map((req) => (
                      <li
                        key={req.id}
                        className="rounded border border-[var(--border-hairline)] bg-[var(--bg-card)] p-3 text-xs"
                      >
                        <p className="font-semibold text-[var(--text-primary)]">
                          {req.title}
                        </p>
                        <p className="mt-1 text-[var(--text-secondary)] inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {req.targetFormat} · {req.status} ({req.submittedAt})
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmitRequest}
              className="lg:col-span-7 space-y-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-card)] p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="req-judul-buku"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                >
                  Judul Buku / Referensi Mata Kuliah
                </label>
                <input
                  id="req-judul-buku"
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="Contoh: Metodologi Penelitian Kualitatif — Prof. Moleong"
                  className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2.5 text-sm text-[var(--text-primary)] min-h-[42px]"
                />
              </div>

              <div>
                <label
                  htmlFor="req-format-target"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                >
                  Format Aksesibel yang Dibutuhkan
                </label>
                <select
                  id="req-format-target"
                  value={reqFormat}
                  onChange={(e) =>
                    setReqFormat(
                      e.target.value as FormatConversionRequest['targetFormat']
                    )
                  }
                  className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2.5 text-sm text-[var(--text-primary)] min-h-[42px]"
                >
                  <option value="Audio DAISY / MP3">Audio DAISY / MP3</option>
                  <option value="EPUB Terstruktur">EPUB Terstruktur (Ramah Pembaca Layar)</option>
                  <option value="Braille Digital (BRF)">Braille Digital (BRF)</option>
                  <option value="Cetak Huruf Besar">Cetak Huruf Besar (18pt+)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="req-catatan"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                >
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  id="req-catatan"
                  rows={2}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="Sebutkan bab prioritas atau jadwal tenggat tugas kuliah jika ada..."
                  className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] min-h-[44px]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Kirim Permintaan Alih Format</span>
                </button>

                {reqSubmittedMsg && (
                  <p role="status" className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Permintaan berhasil dicatat dan sedang diproses tim pustakawan.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}
