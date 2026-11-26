import { useEffect, useRef } from 'react';
import { Eye, RotateCcw, Type, Volume2, X } from 'lucide-react';
import { AccessibilityPrefs } from '../types/library';

interface AccessibilityDrawerProps {
  open: boolean;
  onClose: () => void;
  prefs: AccessibilityPrefs;
  onUpdatePrefs: (next: AccessibilityPrefs) => void;
  onResetPrefs: () => void;
}

export function AccessibilityDrawer({
  open,
  onClose,
  prefs,
  onUpdatePrefs,
  onResetPrefs,
}: AccessibilityDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-panel-aksesibilitas"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-4">
          <div>
            <h2
              id="judul-panel-aksesibilitas"
              className="font-display text-xl font-semibold text-[var(--text-primary)]"
            >
              Preferensi Aksesibilitas
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Sesuaikan tampilan agar nyaman dibaca di seluruh layanan perpustakaan.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup panel aksesibilitas"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Theme & Contrast */}
          <section aria-labelledby="label-tema">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <h3 id="label-tema" className="text-sm font-semibold text-[var(--text-primary)]">
                Tema & Tingkat Kontras
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'archival', label: 'Kertas Arsip' },
                  { id: 'dark', label: 'Mode Malam' },
                  { id: 'high-contrast', label: 'Kontras AAA' },
                ] as const
              ).map((opt) => {
                const active = prefs.theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdatePrefs({ ...prefs, theme: opt.id })}
                    aria-pressed={active}
                    className={`rounded-md border px-3 py-2.5 text-xs font-medium transition-colors min-h-[44px] ${
                      active
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Global Font Scale */}
          <section aria-labelledby="label-ukuran-teks">
            <div className="flex items-center gap-2 mb-3">
              <Type className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <h3 id="label-ukuran-teks" className="text-sm font-semibold text-[var(--text-primary)]">
                Skala Ukuran Teks Global
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Standar (100%)' },
                  { id: 'large', label: 'Besar (112%)' },
                  { id: 'xlarge', label: 'Ekstra (125%)' },
                ] as const
              ).map((opt) => {
                const active = prefs.fontScale === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdatePrefs({ ...prefs, fontScale: opt.id })}
                    aria-pressed={active}
                    className={`rounded-md border px-2.5 py-2.5 text-xs font-medium transition-colors min-h-[44px] ${
                      active
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Toggles */}
          <section aria-labelledby="label-baca-inklusif" className="space-y-4">
            <h3 id="label-baca-inklusif" className="text-sm font-semibold text-[var(--text-primary)]">
              Dukungan Kognitif & Navigasi
            </h3>

            <label className="flex items-start justify-between gap-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 cursor-pointer">
              <div>
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Tipografi Ramah Disleksia
                </span>
                <span className="mt-1 block text-xs text-[var(--text-secondary)] leading-relaxed">
                  Menggunakan huruf Atkinson Hyperlegible dengan jarak huruf dan kata yang lebih lega agar bentuk huruf tidak tertukar.
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.dyslexiaFont}
                onChange={(e) =>
                  onUpdatePrefs({
                    ...prefs,
                    dyslexiaFont: e.target.checked,
                    wideSpacing: e.target.checked,
                  })
                }
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent-primary)]"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 cursor-pointer">
              <div>
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Kurangi Gerakan & Transisi
                </span>
                <span className="mt-1 block text-xs text-[var(--text-secondary)] leading-relaxed">
                  Mematikan efek transisi dan animasi visual untuk kenyamanan vestibular.
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.reducedMotion}
                onChange={(e) =>
                  onUpdatePrefs({ ...prefs, reducedMotion: e.target.checked })
                }
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent-primary)]"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 cursor-pointer">
              <div className="flex items-start gap-2.5">
                <Volume2 className="h-4 w-4 mt-0.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-medium text-[var(--text-primary)]">
                    Notifikasi Pembaca Layar (ARIA Live)
                  </span>
                  <span className="mt-1 block text-xs text-[var(--text-secondary)] leading-relaxed">
                    Mengumumkan perubahan status peminjaman, pengembalian, dan filter katalog secara langsung ke pembaca layar.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.screenReaderAnnouncements}
                onChange={(e) =>
                  onUpdatePrefs({
                    ...prefs,
                    screenReaderAnnouncements: e.target.checked,
                  })
                }
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent-primary)]"
              />
            </label>
          </section>

          <div className="border-t border-[var(--border-hairline)] pt-5">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">
              Pintasan Papan Ketik
            </h4>
            <dl className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <dt>Fokus pencarian katalog</dt>
                <dd className="font-mono-catalog">Tombol /</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tutup jendela dialog / pembaca</dt>
                <dd className="font-mono-catalog">Esc</dd>
              </div>
              <div className="flex justify-between">
                <dt>Navigasi antarkomponen</dt>
                <dd className="font-mono-catalog">Tab / Shift + Tab</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-hairline)] px-6 py-4 bg-[var(--bg-surface)]">
          <button
            type="button"
            onClick={onResetPrefs}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] min-h-[40px]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Atur Ulang</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--accent-primary-hover)] min-h-[40px]"
          >
            Selesai
          </button>
        </div>
      </aside>
    </div>
  );
}
