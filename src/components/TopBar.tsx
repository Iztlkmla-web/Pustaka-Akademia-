import { useState } from 'react';
import { Accessibility, Menu, X } from 'lucide-react';
import { ActiveSection } from '../types/library';

interface TopBarProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  onOpenAccessibility: () => void;
  activeLoanCount: number;
}

const NAV_ITEMS: { id: ActiveSection; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'katalog', label: 'Katalog Koleksi' },
  { id: 'sirkulasi', label: 'Sirkulasi Daring' },
  { id: 'sumber-belajar', label: 'Sumber Belajar' },
];

export function TopBar({
  activeSection,
  onNavigate,
  onOpenAccessibility,
  activeLoanCount,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: ActiveSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <a href="#konten-utama" className="skip-link">
        Lewati ke konten utama
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('beranda')}
            className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 text-left hover:opacity-85 transition-opacity"
          >
            Pustaka Akademia
          </button>

          {/* Zone 2: 4 single-line text navigation links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[var(--accent-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>
                    {item.label}
                    {item.id === 'sirkulasi' && activeLoanCount > 0
                      ? ` (${activeLoanCount})`
                      : ''}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-[var(--accent-primary)]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              aria-label="Buka pengaturan aksesibilitas inklusif"
            >
              <Accessibility className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Aksesibilitas</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex md:hidden items-center justify-center rounded-md border border-[var(--border-hairline)] p-2 text-[var(--text-primary)] min-h-[44px] min-w-[44px]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Compact mobile navigation drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigasi seluler"
            className="md:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-3"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full text-left rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {item.label}
                      {item.id === 'sirkulasi' && activeLoanCount > 0
                        ? ` (${activeLoanCount})`
                        : ''}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
