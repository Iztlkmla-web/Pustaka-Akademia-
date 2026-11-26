import { useCallback, useEffect, useState } from 'react';
import { AccessibilityDrawer } from './components/AccessibilityDrawer';
import { BookDetailModal } from './components/BookDetailModal';
import { CatalogSection } from './components/CatalogSection';
import { CirculationView } from './components/CirculationView';
import { EbookReaderModal } from './components/EbookReaderModal';
import { HomeView } from './components/HomeView';
import { LearningResourcesView } from './components/LearningResourcesView';
import { TopBar } from './components/TopBar';
import { INITIAL_LOANS, LIBRARY_CATALOG } from './data/catalogData';
import {
  AccessibilityPrefs,
  ActiveSection,
  BookmarkNote,
  FormatConversionRequest,
  LibraryItem,
  LoanRecord,
} from './types/library';
import { addDaysIso } from './utils/libraryHelpers';

const STORAGE_KEYS = {
  loans: 'pustaka_akademia_loans_v1',
  saved: 'pustaka_akademia_saved_v1',
  notes: 'pustaka_akademia_notes_v1',
  progress: 'pustaka_akademia_progress_v1',
  requests: 'pustaka_akademia_requests_v1',
  prefs: 'pustaka_akademia_prefs_v1',
};

const DEFAULT_PREFS: AccessibilityPrefs = {
  theme: 'archival',
  fontScale: 'normal',
  dyslexiaFont: false,
  wideSpacing: false,
  reducedMotion: false,
  screenReaderAnnouncements: true,
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('beranda');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  const [loans, setLoans] = useState<LoanRecord[]>(() =>
    readStorage(STORAGE_KEYS.loans, INITIAL_LOANS)
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.saved, ['bk-001', 'md-007'])
  );
  const [notes, setNotes] = useState<BookmarkNote[]>(() =>
    readStorage(STORAGE_KEYS.notes, [])
  );
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() =>
    readStorage(STORAGE_KEYS.progress, {})
  );
  const [conversionRequests, setConversionRequests] = useState<
    FormatConversionRequest[]
  >(() => readStorage(STORAGE_KEYS.requests, []));
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() =>
    readStorage(STORAGE_KEYS.prefs, DEFAULT_PREFS)
  );

  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);
  const [readerState, setReaderState] = useState<{
    item: LibraryItem;
    chapterId?: string;
  } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Persist user data locally
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify(readingProgress)
    );
  }, [readingProgress]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.requests,
      JSON.stringify(conversionRequests)
    );
  }, [conversionRequests]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(prefs));
  }, [prefs]);

  // Apply global inclusive accessibility attributes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', prefs.theme === 'dark');
    if (prefs.theme === 'high-contrast') {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }
    root.setAttribute('data-scale', prefs.fontScale);
    root.setAttribute('data-dyslexia', String(prefs.dyslexiaFont));
    root.setAttribute('data-reduced-motion', String(prefs.reducedMotion));
  }, [prefs]);

  const notifyUser = useCallback(
    (msg: string) => {
      setToastMessage(msg);
      if (prefs.screenReaderAnnouncements) {
        setAnnouncement(msg);
      }
      window.setTimeout(() => {
        setToastMessage((curr) => (curr === msg ? '' : curr));
      }, 4000);
    },
    [prefs.screenReaderAnnouncements]
  );

  // Compute live available copies from base catalog + active loan delta
  const catalogWithAvailability = LIBRARY_CATALOG.map((item) => {
    const initialActive = INITIAL_LOANS.filter(
      (l) => l.itemId === item.id && l.status === 'aktif'
    ).length;
    const currentActive = loans.filter(
      (l) => l.itemId === item.id && l.status === 'aktif'
    ).length;
    const delta = currentActive - initialActive;
    const computedAvail = Math.max(
      0,
      Math.min(item.totalCopies, item.availableCopies - delta)
    );
    return {
      ...item,
      availableCopies: computedAvail,
    };
  });

  const handleBorrowOrQueue = (item: LibraryItem) => {
    const existing = loans.find(
      (l) =>
        l.itemId === item.id &&
        (l.status === 'aktif' || l.status === 'antrean')
    );
    if (existing) {
      notifyUser(`Koleksi "${item.title}" sudah berada di daftar sirkulasi Anda.`);
      return;
    }

    const activeCount = loans.filter((l) => l.status === 'aktif').length;
    if (item.availableCopies > 0 && activeCount >= 5) {
      notifyUser(
        'Batas maksimal 5 pinjaman aktif tercapai. Kembalikan satu koleksi terlebih dahulu.'
      );
      return;
    }

    const today = new Date('2026-11-25T12:00:00');
    if (item.availableCopies > 0) {
      const newLoan: LoanRecord = {
        id: `ln-${Date.now()}`,
        itemId: item.id,
        borrowedAt: '2026-11-25',
        dueAt: addDaysIso(today, 14),
        renewalsUsed: 0,
        maxRenewals: 2,
        status: 'aktif',
      };
      setLoans((prev) => [newLoan, ...prev]);
      notifyUser(`Berhasil meminjam "${item.title}" selama 14 hari.`);
    } else {
      const queuedLoan: LoanRecord = {
        id: `ln-${Date.now()}`,
        itemId: item.id,
        borrowedAt: '2026-11-25',
        dueAt: '-',
        renewalsUsed: 0,
        maxRenewals: 2,
        status: 'antrean',
        queuePosition: 1,
      };
      setLoans((prev) => [queuedLoan, ...prev]);
      notifyUser(`"${item.title}" ditambahkan ke daftar antrean reservasi Anda.`);
    }
  };

  const handleRenewLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId || loan.renewalsUsed >= loan.maxRenewals) {
          return loan;
        }
        const currentDue = new Date(loan.dueAt + 'T12:00:00');
        return {
          ...loan,
          dueAt: addDaysIso(currentDue, 7),
          renewalsUsed: loan.renewalsUsed + 1,
        };
      })
    );
    notifyUser('Masa peminjaman berhasil diperpanjang 7 hari.');
  };

  const handleReturnLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === loanId
          ? { ...loan, status: 'dikembalikan', returnedAt: '2026-11-25' }
          : loan
      )
    );
    notifyUser('Koleksi telah dikembalikan ke sistem sirkulasi.');
  };

  const handleCancelQueue = (loanId: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== loanId));
    notifyUser('Antrean reservasi telah dibatalkan.');
  };

  const handleToggleSave = (itemId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(itemId);
      const next = exists
        ? prev.filter((id) => id !== itemId)
        : [itemId, ...prev];
      notifyUser(
        exists
          ? 'Koleksi dihapus dari daftar bacaan tersimpan.'
          : 'Koleksi disimpan ke rak bacaan Anda.'
      );
      return next;
    });
  };

  const handleAddNote = (note: Omit<BookmarkNote, 'id' | 'createdAt'>) => {
    const entry: BookmarkNote = {
      ...note,
      id: `nt-${Date.now()}`,
      createdAt: '25 Nov 2026',
    };
    setNotes((prev) => [entry, ...prev]);
    notifyUser('Catatan bacaan berhasil disimpan.');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleProgressUpdate = useCallback(
    (itemId: string, chapterIndex: number) => {
      setReadingProgress((prev) => {
        if (prev[itemId] === chapterIndex) return prev;
        return { ...prev, [itemId]: chapterIndex };
      });
    },
    []
  );

  const handleSubmitConversionRequest = (
    req: Omit<FormatConversionRequest, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newReq: FormatConversionRequest = {
      ...req,
      id: `req-${Date.now()}`,
      submittedAt: '25 Nov 2026',
      status: 'Diproses Pustakawan',
    };
    setConversionRequests((prev) => [newReq, ...prev]);
    notifyUser(`Permintaan alih format untuk "${req.title}" telah dikirim.`);
  };

  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: prefs.reducedMotion ? 'auto' : 'smooth' });
  };

  const activeLoanCount = loans.filter((l) => l.status === 'aktif').length;
  const activeDetailLoan = detailItem
    ? loans.find(
        (l) =>
          l.itemId === detailItem.id &&
          (l.status === 'aktif' || l.status === 'antrean')
      )
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Screen Reader Live Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <TopBar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAccessibility={() => setAccessibilityOpen(true)}
        activeLoanCount={activeLoanCount}
      />

      <main id="konten-utama" className="flex-1" tabIndex={-1}>
        {activeSection === 'beranda' && (
          <HomeView
            featuredItems={catalogWithAvailability.slice(0, 4)}
            onQuickSearch={(q) => {
              setCatalogSearchQuery(q);
              handleNavigate('katalog');
            }}
            onNavigate={handleNavigate}
            onSelectDetail={(item) => setDetailItem(item)}
            onOpenReader={(item) =>
              setReaderState({
                item,
                chapterId:
                  item.chapters[readingProgress[item.id] ?? 0]?.id ??
                  item.chapters[0]?.id,
              })
            }
          />
        )}

        {activeSection === 'katalog' && (
          <CatalogSection
            items={catalogWithAvailability}
            loans={loans}
            savedIds={savedIds}
            initialQuery={catalogSearchQuery}
            onSelectDetail={(item) => setDetailItem(item)}
            onOpenReader={(item) =>
              setReaderState({
                item,
                chapterId:
                  item.chapters[readingProgress[item.id] ?? 0]?.id ??
                  item.chapters[0]?.id,
              })
            }
            onBorrowOrQueue={handleBorrowOrQueue}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeSection === 'sirkulasi' && (
          <CirculationView
            catalog={catalogWithAvailability}
            loans={loans}
            savedIds={savedIds}
            readingProgress={readingProgress}
            conversionRequests={conversionRequests}
            onRenewLoan={handleRenewLoan}
            onReturnLoan={handleReturnLoan}
            onCancelQueue={handleCancelQueue}
            onRemoveSaved={handleToggleSave}
            onOpenReader={(item, chapterIdx) =>
              setReaderState({
                item,
                chapterId: item.chapters[chapterIdx ?? 0]?.id,
              })
            }
            onSubmitConversionRequest={handleSubmitConversionRequest}
            onNavigateCatalog={() => handleNavigate('katalog')}
          />
        )}

        {activeSection === 'sumber-belajar' && (
          <LearningResourcesView
            catalog={catalogWithAvailability}
            onOpenCatalogWithQuery={(q) => {
              setCatalogSearchQuery(q);
              handleNavigate('katalog');
            }}
          />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 text-xs text-[var(--text-secondary)]">
          <div>
            <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Pustaka Akademia
            </p>
            <p className="mt-0.5">
              Perpustakaan Digital Akademik Inklusif · Akses Pengetahuan Setara untuk Semua.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => handleNavigate('katalog')}
              className="hover:text-[var(--text-primary)]"
            >
              Katalog Koleksi
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('sirkulasi')}
              className="hover:text-[var(--text-primary)]"
            >
              Sirkulasi Daring
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('sumber-belajar')}
              className="hover:text-[var(--text-primary)]"
            >
              Sumber Belajar
            </button>
            <button
              type="button"
              onClick={() => setAccessibilityOpen(true)}
              className="hover:text-[var(--text-primary)] font-medium"
            >
              Pengaturan Aksesibilitas
            </button>
          </div>
        </div>
      </footer>

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md border border-[var(--border-hairline)] bg-[var(--text-primary)] px-4 py-3 text-xs sm:text-sm font-medium text-[var(--bg-canvas)] shadow-lg"
        >
          {toastMessage}
        </div>
      )}

      {/* Drawers & Modals */}
      <AccessibilityDrawer
        open={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
        prefs={prefs}
        onUpdatePrefs={setPrefs}
        onResetPrefs={() => setPrefs(DEFAULT_PREFS)}
      />

      <BookDetailModal
        item={detailItem}
        loan={activeDetailLoan}
        onClose={() => setDetailItem(null)}
        onOpenReader={(item) =>
          setReaderState({
            item,
            chapterId:
              item.chapters[readingProgress[item.id] ?? 0]?.id ??
              item.chapters[0]?.id,
          })
        }
        onBorrowOrQueue={handleBorrowOrQueue}
      />

      <EbookReaderModal
        item={readerState?.item ?? null}
        initialChapterId={readerState?.chapterId}
        notes={notes}
        onClose={() => setReaderState(null)}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}
