import { LibraryItem, ResourceFormat } from '../types/library';

export function getFormatLabel(format: ResourceFormat): string {
  switch (format) {
    case 'e-book':
      return 'E-Book';
    case 'jurnal':
      return 'Jurnal Ilmiah';
    case 'skripsi':
      return 'Skripsi & Tesis';
    case 'modul-ajar':
      return 'Modul Ajar OER';
    case 'buku-cetak':
      return 'Buku Cetak';
  }
}

export function formatIndonesianDate(isoDate: string): string {
  if (!isoDate || isoDate === '-') return '—';
  const date = new Date(isoDate + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function addDaysIso(baseDate: Date, days: number): string {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export function getDaysRemaining(dueIso: string, referenceIso = '2026-11-25'): number {
  if (!dueIso || dueIso === '-') return 0;
  const due = new Date(dueIso + 'T00:00:00').getTime();
  const ref = new Date(referenceIso + 'T00:00:00').getTime();
  return Math.ceil((due - ref) / (1000 * 60 * 60 * 24));
}

export type CitationStyle = 'APA' | 'IEEE' | 'Chicago' | 'BibTeX';

export function generateCitation(item: LibraryItem, style: CitationStyle): string {
  const authorsJoined = item.authors.join(', ');
  const firstAuthor = item.authors[0] || 'Penulis Anonim';
  const slug = item.id.replace(/[^a-zA-Z0-9]/g, '');

  switch (style) {
    case 'APA':
      return `${authorsJoined} (${item.year}). ${item.title}${
        item.subtitle ? `: ${item.subtitle}` : ''
      }. ${item.publisher}. ${item.isbnOrIssn}`;
    case 'IEEE':
      return `${authorsJoined}, "${item.title}," ${item.publisher}, ${item.year}. [Nomor Panggil: ${item.callNumber}].`;
    case 'Chicago':
      return `${firstAuthor}${
        item.authors.length > 1 ? ', dkk' : ''
      }. ${item.year}. ${item.title}. ${item.publisher}.`;
    case 'BibTeX':
      return `@book{${slug}_${item.year},
  author = {${item.authors.join(' and ')}},
  title = {${item.title}},
  publisher = {${item.publisher}},
  year = {${item.year}},
  note = {${item.isbnOrIssn}}
}`;
  }
}
