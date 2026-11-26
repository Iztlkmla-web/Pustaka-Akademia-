import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { LibraryItem } from '../types/library';
import { getFormatLabel } from '../utils/libraryHelpers';

interface BookCoverProps {
  item: LibraryItem;
  className?: string;
}

const TONE_CLASSES: Record<LibraryItem['coverTone'], string> = {
  lapis: 'bg-[#1E3A8A] text-[#FBF9F5] border-[#172554]',
  charcoal: 'bg-[#292524] text-[#F5F2EB] border-[#1C1917]',
  forest: 'bg-[#14532D] text-[#FBF9F5] border-[#052E16]',
  ochre: 'bg-[#78350F] text-[#FBF9F5] border-[#451A03]',
  plum: 'bg-[#4C1D95] text-[#FBF9F5] border-[#2E1065]',
  slate: 'bg-[#334155] text-[#F8FAFC] border-[#1E293B]',
};

export function BookCover({ item, className = '' }: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  if (item.coverImage && !imgError) {
    return (
      <div
        className={`relative overflow-hidden rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] aspect-[3/4] ${className}`}
      >
        <img
          src={item.coverImage}
          alt={`Sampul koleksi ${item.title}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-md border p-4 aspect-[3/4] ${TONE_CLASSES[item.coverTone]} ${className}`}
      aria-label={`Sampul tipografis ${item.title}`}
    >
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono-catalog opacity-80 border-b border-current/20 pb-2">
        <span className="truncate">{getFormatLabel(item.format)}</span>
        <span className="shrink-0">{item.year}</span>
      </div>

      <div className="my-auto py-2">
        <p className="font-display text-sm sm:text-base font-semibold leading-snug line-clamp-4">
          {item.title}
        </p>
        <p className="mt-2 text-[11px] opacity-80 line-clamp-2">
          {item.authors[0]}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-current/20 pt-2 text-[10px] font-mono-catalog opacity-75">
        <span className="truncate">{item.callNumber}</span>
        <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
