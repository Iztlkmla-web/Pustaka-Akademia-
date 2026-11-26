import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Pause,
  Play,
  Square,
  Trash2,
  Type,
  Volume2,
  X,
} from 'lucide-react';
import { BookmarkNote, LibraryItem } from '../types/library';

interface EbookReaderModalProps {
  item: LibraryItem | null;
  notes: BookmarkNote[];
  initialChapterId?: string;
  onClose: () => void;
  onAddNote: (note: Omit<BookmarkNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onProgressUpdate: (itemId: string, chapterIndex: number) => void;
}

type ReaderSurface = 'paper' | 'sepia' | 'night' | 'high-contrast';
type ReaderFont = 'serif' | 'sans' | 'dyslexia';

const SURFACE_STYLES: Record<
  ReaderSurface,
  { bg: string; text: string; muted: string; border: string; card: string; label: string }
> = {
  paper: {
    bg: 'bg-[#FBF9F5]',
    text: 'text-[#1C1917]',
    muted: 'text-[#57534E]',
    border: 'border-[#E5E0D5]',
    card: 'bg-[#F3EFE7]',
    label: 'Kertas',
  },
  sepia: {
    bg: 'bg-[#F4ECD8]',
    text: 'text-[#2C2218]',
    muted: 'text-[#6B5843]',
    border: 'border-[#DFD2B5]',
    card: 'bg-[#EBE0C7]',
    label: 'Sepia',
  },
  night: {
    bg: 'bg-[#141210]',
    text: 'text-[#F5F2EB]',
    muted: 'text-[#B8B0A4]',
    border: 'border-[#332E28]',
    card: 'bg-[#1D1A17]',
    label: 'Malam',
  },
  'high-contrast': {
    bg: 'bg-black',
    text: 'text-white',
    muted: 'text-neutral-200',
    border: 'border-white',
    card: 'bg-neutral-950',
    label: 'Kontras AAA',
  },
};

export function EbookReaderModal({
  item,
  notes,
  initialChapterId,
  onClose,
  onAddNote,
  onDeleteNote,
  onProgressUpdate,
}: EbookReaderModalProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [surface, setSurface] = useState<ReaderSurface>('paper');
  const [readerFont, setReaderFont] = useState<ReaderFont>('serif');
  const [fontSizePx, setFontSizePx] = useState(18);
  const [lineHeight, setLineHeight] = useState<1.65 | 1.9 | 2.15>(1.9);
  const [showToc, setShowToc] = useState(true);
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  // Text-to-Speech (Read-Aloud) state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [activeParagraphIdx, setActiveParagraphIdx] = useState<number | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!item) return;
    const foundIdx = initialChapterId
      ? item.chapters.findIndex((c) => c.id === initialChapterId)
      : 0;
    setChapterIndex(foundIdx >= 0 ? foundIdx : 0);
    closeRef.current?.focus();
  }, [item, initialChapterId]);

  // Stop speech when closing or switching chapters
  const stopSpeech = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveParagraphIdx(null);
  };

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!item) return;
    onProgressUpdate(item.id, chapterIndex);
  }, [item, chapterIndex, onProgressUpdate]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeech();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  const itemNotes = useMemo(
    () => (item ? notes.filter((n) => n.itemId === item.id) : []),
    [item, notes]
  );

  if (!item) return null;

  const chapter = item.chapters[chapterIndex] || item.chapters[0];
  const theme = SURFACE_STYLES[surface];

  const speakChapter = (startIndex = 0) => {
    if (!speechSupported || !chapter) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setIsPaused(false);

    const paragraphs = chapter.paragraphs;
    let idx = startIndex;

    const speakNext = () => {
      if (idx >= paragraphs.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveParagraphIdx(null);
        return;
      }
      setActiveParagraphIdx(idx);
      const utterance = new SpeechSynthesisUtterance(paragraphs[idx]);
      utterance.lang = 'id-ID';
      utterance.rate = speechRate;
      utterance.onend = () => {
        idx += 1;
        speakNext();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveParagraphIdx(null);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const togglePauseSpeech = () => {
    if (!speechSupported || !isSpeaking) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !chapter) return;
    onAddNote({
      itemId: item.id,
      chapterId: chapter.id,
      chapterTitle: `${chapter.number}: ${chapter.title}`,
      note: noteInput.trim(),
    });
    setNoteInput('');
  };

  const handleExportNotes = () => {
    if (itemNotes.length === 0) return;
    const content = [
      `CATATAN BACA PUSTAKA AKADEMIA`,
      `Judul: ${item.title}`,
      `Penulis: ${item.authors.join(', ')}`,
      `Nomor Panggil: ${item.callNumber}`,
      `----------------------------------------`,
      ...itemNotes.map(
        (n) => `[${n.chapterTitle} — ${n.createdAt}]\n${n.note}\n`
      ),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catatan-${item.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const fontFamilyClass =
    readerFont === 'serif'
      ? 'font-display'
      : readerFont === 'dyslexia'
      ? 'font-accessible tracking-[0.03em] [word-spacing:0.12em]'
      : 'font-sans';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${theme.bg} ${theme.text}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-judul-buku"
    >
      {/* Top Reader Toolbar */}
      <header
        className={`flex flex-wrap items-center justify-between gap-3 border-b ${theme.border} px-4 py-3 sm:px-6`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className={`inline-flex items-center gap-1.5 rounded-md border ${theme.border} px-3 py-2 text-xs font-medium hover:opacity-80 min-h-[40px] whitespace-nowrap shrink-0`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Tutup Pembaca</span>
          </button>

          <div className="min-w-0">
            <h2
              id="reader-judul-buku"
              className="truncate font-display text-sm sm:text-base font-semibold"
            >
              {item.title}
            </h2>
            <p className={`truncate text-xs ${theme.muted}`}>
              {chapter?.number} · {chapter?.title}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Read-Aloud Controls */}
          {speechSupported && (
            <div
              className={`inline-flex items-center gap-1 rounded-md border ${theme.border} ${theme.card} px-2 py-1`}
            >
              {!isSpeaking ? (
                <button
                  type="button"
                  onClick={() => speakChapter(0)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium min-h-[34px] whitespace-nowrap"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span>Bacakan Bab</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={togglePauseSpeech}
                    aria-label={isPaused ? 'Lanjutkan bacaan suara' : 'Jeda bacaan suara'}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium min-h-[34px]"
                  >
                    {isPaused ? (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopSpeech}
                    aria-label="Hentikan bacaan suara"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium min-h-[34px]"
                  >
                    <Square className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Henti</span>
                  </button>
                </>
              )}

              <label htmlFor="kecepatan-suara" className="sr-only">
                Kecepatan pembaca suara
              </label>
              <select
                id="kecepatan-suara"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className={`rounded border ${theme.border} bg-transparent px-1.5 py-1 text-xs font-mono-catalog`}
              >
                <option value={0.8} className="text-black">0.8x</option>
                <option value={1} className="text-black">1.0x</option>
                <option value={1.25} className="text-black">1.25x</option>
                <option value={1.5} className="text-black">1.5x</option>
              </select>
            </div>
          )}

          {/* Typography & Theme Menu Button */}
          <button
            type="button"
            onClick={() => setShowDisplayMenu((v) => !v)}
            aria-expanded={showDisplayMenu}
            className={`inline-flex items-center gap-1.5 rounded-md border ${theme.border} px-3 py-2 text-xs font-medium min-h-[40px] whitespace-nowrap`}
          >
            <Type className="h-4 w-4" aria-hidden="true" />
            <span>Tampilan Teks</span>
          </button>

          <button
            type="button"
            onClick={() => setShowToc((v) => !v)}
            aria-expanded={showToc}
            className={`inline-flex items-center gap-1.5 rounded-md border ${theme.border} px-3 py-2 text-xs font-medium min-h-[40px] whitespace-nowrap`}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            <span>Daftar Isi & Catatan</span>
          </button>
        </div>
      </header>

      {/* Collapsible Display Customization Bar */}
      {showDisplayMenu && (
        <div
          className={`border-b ${theme.border} ${theme.card} px-4 py-3 sm:px-6`}
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className={theme.muted}>Latar:</span>
              {(['paper', 'sepia', 'night', 'high-contrast'] as ReaderSurface[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSurface(s)}
                    className={`rounded border px-2.5 py-1.5 font-medium ${
                      surface === s
                        ? 'border-current font-semibold underline'
                        : `${theme.border} opacity-80 hover:opacity-100`
                    }`}
                  >
                    {SURFACE_STYLES[s].label}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={theme.muted}>Huruf:</span>
              {(
                [
                  { id: 'serif', label: 'Editorial Serif' },
                  { id: 'sans', label: 'Sans Bersih' },
                  { id: 'dyslexia', label: 'Ramah Disleksia' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setReaderFont(f.id)}
                  className={`rounded border px-2.5 py-1.5 font-medium ${
                    readerFont === f.id
                      ? 'border-current font-semibold underline'
                      : `${theme.border} opacity-80 hover:opacity-100`
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className={theme.muted}>Ukuran:</span>
              <button
                type="button"
                onClick={() => setFontSizePx((v) => Math.max(15, v - 2))}
                aria-label="Perkecil ukuran teks"
                className={`rounded border ${theme.border} px-2.5 py-1 font-mono-catalog`}
              >
                A-
              </button>
              <span className="font-mono-catalog w-10 text-center">{fontSizePx}px</span>
              <button
                type="button"
                onClick={() => setFontSizePx((v) => Math.min(26, v + 2))}
                aria-label="Perbesar ukuran teks"
                className={`rounded border ${theme.border} px-2.5 py-1 font-mono-catalog`}
              >
                A+
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={theme.muted}>Spasi Baris:</span>
              {([1.65, 1.9, 2.15] as const).map((lh) => (
                <button
                  key={lh}
                  type="button"
                  onClick={() => setLineHeight(lh)}
                  className={`rounded border px-2 py-1 font-mono-catalog ${
                    lineHeight === lh ? 'border-current font-semibold' : theme.border
                  }`}
                >
                  {lh}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Reader Body: TOC Sidebar + Optimal Measure Reading Column */}
      <div className="flex flex-1 overflow-hidden">
        {showToc && (
          <aside
            aria-label="Daftar isi dan catatan pembaca"
            className={`w-full max-w-xs shrink-0 overflow-y-auto border-r ${theme.border} ${theme.card} p-5 hidden lg:block`}
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Daftar Bab ({item.chapters.length})
              </h3>
              <ul className="mt-3 space-y-1.5">
                {item.chapters.map((ch, idx) => {
                  const active = idx === chapterIndex;
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          setChapterIndex(idx);
                        }}
                        className={`w-full rounded-md px-3 py-2.5 text-left text-xs transition-colors ${
                          active
                            ? `border ${theme.border} ${theme.bg} font-semibold`
                            : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="block font-mono-catalog opacity-75">
                          {ch.number} · {ch.readingMinutes} mnt
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug">
                          {ch.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Study Notes Section */}
            <div className={`mt-8 border-t ${theme.border} pt-6`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Catatan Belajar ({itemNotes.length})
                </h3>
                {itemNotes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportNotes}
                    className="inline-flex items-center gap-1 text-xs font-medium underline"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Unduh</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveNote} className="mt-3 space-y-2">
                <label htmlFor="input-catatan-bab" className="sr-only">
                  Tulis catatan untuk bab ini
                </label>
                <textarea
                  id="input-catatan-bab"
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Catat kutipan atau gagasan penting bab ini..."
                  className={`w-full rounded-md border ${theme.border} ${theme.bg} p-2.5 text-xs`}
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-2 text-xs font-medium text-white hover:bg-[#172554] min-h-[38px]"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Simpan Catatan Bab</span>
                </button>
              </form>

              {itemNotes.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {itemNotes.map((n) => (
                    <li
                      key={n.id}
                      className={`rounded-md border ${theme.border} ${theme.bg} p-3 text-xs`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-medium ${theme.muted}`}>
                          {n.chapterTitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteNote(n.id)}
                          aria-label="Hapus catatan"
                          className="opacity-60 hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-1.5 leading-relaxed">{n.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}

        {/* Main Reading Pane */}
        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-10 lg:px-16">
          {chapter && (
            <article className="mx-auto max-w-[68ch]">
              <p className={`text-xs font-mono-catalog ${theme.muted}`}>
                {chapter.number} · Estimasi baca {chapter.readingMinutes} menit
              </p>
              <h1 className="mt-2 font-display text-2xl sm:text-4xl font-semibold leading-tight text-balance">
                {chapter.title}
              </h1>

              {/* Key Takeaway Box (Hairline border all-around, no left thick bar) */}
              <div
                className={`mt-6 rounded-md border ${theme.border} ${theme.card} p-4 sm:p-5`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
                  Intisari Bab
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">
                  {chapter.keyTakeaway}
                </p>
              </div>

              {/* Chapter Prose */}
              <div
                className={`mt-8 space-y-5 ${fontFamilyClass}`}
                style={{
                  fontSize: `${fontSizePx}px`,
                  lineHeight: lineHeight,
                }}
              >
                {chapter.paragraphs.map((p, idx) => {
                  const isHighlighted = activeParagraphIdx === idx;
                  return (
                    <p
                      key={idx}
                      onClick={() => {
                        if (isSpeaking) speakChapter(idx);
                      }}
                      className={`rounded px-1.5 py-1 transition-colors ${
                        isHighlighted
                          ? 'bg-amber-300/30 ring-1 ring-amber-500/60'
                          : ''
                      }`}
                    >
                      {p}
                    </p>
                  );
                })}
              </div>

              {/* Academic Glossary */}
              {chapter.glossary && chapter.glossary.length > 0 && (
                <section
                  aria-labelledby="glosarium-bab"
                  className={`mt-10 border-t ${theme.border} pt-6`}
                >
                  <h2
                    id="glosarium-bab"
                    className="font-display text-lg font-semibold"
                  >
                    Glosarium Istilah Akademik
                  </h2>
                  <dl className="mt-3 space-y-3 text-sm">
                    {chapter.glossary.map((g) => (
                      <div key={g.term}>
                        <dt className="font-semibold">{g.term}</dt>
                        <dd className={`mt-0.5 ${theme.muted} leading-relaxed`}>
                          {g.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Mobile Notes Form when sidebar is hidden */}
              <section
                aria-label="Catatan bab seluler"
                className={`mt-10 border-t ${theme.border} pt-6 lg:hidden`}
              >
                <h2 className="text-sm font-semibold">Catatan Belajar Bab Ini</h2>
                <form onSubmit={handleSaveNote} className="mt-2.5 space-y-2">
                  <textarea
                    rows={2}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Tulis catatan singkat..."
                    className={`w-full rounded-md border ${theme.border} ${theme.bg} p-2.5 text-sm`}
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white min-h-[40px]"
                  >
                    Simpan Catatan
                  </button>
                </form>
              </section>

              {/* Chapter Prev / Next Navigation */}
              <nav
                aria-label="Navigasi antarbab"
                className={`mt-12 flex items-center justify-between border-t ${theme.border} pt-6`}
              >
                <button
                  type="button"
                  disabled={chapterIndex === 0}
                  onClick={() => {
                    stopSpeech();
                    setChapterIndex((i) => Math.max(0, i - 1));
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-md border ${theme.border} px-4 py-2 text-xs sm:text-sm font-medium disabled:opacity-40 min-h-[42px]`}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Bab Sebelumnya</span>
                </button>

                <span className={`text-xs font-mono-catalog ${theme.muted}`}>
                  {chapterIndex + 1} / {item.chapters.length}
                </span>

                <button
                  type="button"
                  disabled={chapterIndex >= item.chapters.length - 1}
                  onClick={() => {
                    stopSpeech();
                    setChapterIndex((i) =>
                      Math.min(item.chapters.length - 1, i + 1)
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-md border ${theme.border} px-4 py-2 text-xs sm:text-sm font-medium disabled:opacity-40 min-h-[42px]`}
                >
                  <span>Bab Berikutnya</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
