import { useEffect, useRef, useState, useMemo, useCallback, useLayoutEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { componentRegistry } from '../data/componentRegistry';
import { ComponentPreviewCard } from '../components/ds/ComponentPreviewCard';

/* ——— Category color map ——— */
const categoryColors: Record<string, string> = {
  Chat: 'var(--token-accent)',
  Processing: 'var(--token-warning)',
  Response: 'var(--token-tertiary)',
  Voice: 'var(--token-secondary)',
  Research: 'var(--token-chart-1)',
  Image: 'var(--token-chart-2)',
  Agentic: 'var(--token-chart-4)',
  System: 'var(--token-text-tertiary)',
  Mobile: 'var(--token-chart-5)',
  Mixed: 'var(--token-chart-3)',
  'Real-World AI': 'var(--token-accent)',
};

/* ——— Category order for sidebar sections ——— */
const categoryOrder = ['Chat', 'Processing', 'Response', 'Voice', 'Research', 'Image', 'Agentic', 'System', 'Mobile', 'Mixed', 'Real-World AI'];

/* ——————————————————————————————————————————
   Sidebar Index  (with floating indicator)
   —————————————————————————————————————————— */
function Sidebar({
  activeId,
  onItemClick,
  isMobileOpen,
  onClose,
}: {
  activeId: string | null;
  onItemClick: (id: string) => void;
  isMobileOpen: boolean;
  onClose: () => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof componentRegistry>();
    for (const entry of componentRegistry) {
      const list = map.get(entry.category) || [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return categoryOrder
      .filter(cat => map.has(cat))
      .map(cat => ({ category: cat, items: map.get(cat)! }));
  }, []);

  /* Refs for every sidebar button — used to position the floating bar */
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Floating indicator position */
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);
  const [hasTransitioned, setHasTransitioned] = useState(false);
  /* Flag to suppress sidebar auto-scroll during user-initiated clicks */
  const userClickRef = useRef(false);

  /* Recalc indicator position whenever activeId changes */
  useLayoutEffect(() => {
    if (!activeId || !listRef.current) {
      setIndicator(null);
      return;
    }
    const btn = itemRefs.current.get(activeId);
    if (!btn) {
      setIndicator(null);
      return;
    }
    const container = listRef.current;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      top: btnRect.top - containerRect.top,
      height: btnRect.height,
    });
    if (!hasTransitioned) {
      requestAnimationFrame(() => setHasTransitioned(true));
    }
  }, [activeId, hasTransitioned]);

  /* Auto-scroll sidebar to keep active item centred in view */
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    if (userClickRef.current) {
      userClickRef.current = false;
      return;
    }
    const btn = itemRefs.current.get(activeId);
    if (!btn) return;

    const nav = navRef.current;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const btnTopInNav = btnRect.top - navRect.top;
    const btnBottomInNav = btnRect.bottom - navRect.top;
    const margin = 80;

    if (btnTopInNav < margin || btnBottomInNav > navRect.height - margin) {
      const btnScrollOffset = btnRect.top - navRect.top + nav.scrollTop;
      const centred = btnScrollOffset - navRect.height / 2 + btnRect.height / 2;
      nav.scrollTo({ top: Math.max(0, centred), behavior: 'smooth' });
    }
  }, [activeId]);

  /* Responsive styles */
  const sidebarStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    borderRight: '1px solid var(--token-border)',
    background: 'var(--token-bg)',
    fontFamily: 'var(--token-font-sans)',
    zIndex: 1,
  };

  /* Mobile: fixed overlay sidebar */
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    Object.assign(sidebarStyles, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 280,
      zIndex: 'var(--token-z-modal)',
      transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
      boxShadow: isMobileOpen ? 'var(--token-shadow-lg)' : 'none',
    });
  } else {
    /* Desktop: sticky sidebar with responsive width */
    Object.assign(sidebarStyles, {
      position: 'sticky',
      top: 0,
      width: window.innerWidth >= 1440 ? 260 : 220,
      flexShrink: 0,
    });
  }

  return (
    <nav
      ref={navRef}
      style={sidebarStyles}
    >
      {/* Sidebar header */}
      <div style={{ padding: 'var(--token-space-4) var(--token-space-4) var(--token-space-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center">
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              fontWeight: 'var(--token-weight-semibold)',
              color: 'var(--token-text-primary)',
              letterSpacing: 'var(--token-tracking-tight)',
            }}
          >
            Components
          </span>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              marginLeft: 'var(--token-space-1-5)',
            }}
          >
            {componentRegistry.length}
          </span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 28,
              height: 28,
              border: 'none',
              background: 'transparent',
              color: 'var(--token-text-tertiary)',
              borderRadius: 'var(--token-radius-md)',
              transition: 'all var(--token-duration-fast)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-tertiary)';
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category sections — positioned container for indicator */}
      <div
        ref={listRef}
        className="flex-1 flex flex-col"
        style={{ padding: '0 0 var(--token-space-4)', position: 'relative' }}
      >
        {/* ── Floating indicator bar ── */}
        {indicator && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 2,
              pointerEvents: 'none',
              zIndex: 2,
              transform: `translateY(${indicator.top + indicator.height * 0.2}px)`,
              height: indicator.height * 0.6,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-accent)',
              transition: hasTransitioned
                ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'none',
            }}
          />
        )}

        {/* ── Floating background highlight ── */}
        {indicator && (
          <div
            style={{
              position: 'absolute',
              left: 4,
              right: 4,
              top: 0,
              pointerEvents: 'none',
              zIndex: 0,
              transform: `translateY(${indicator.top}px)`,
              height: indicator.height,
              borderRadius: 'var(--token-radius-sm)',
              background: 'var(--token-bg-hover)',
              transition: hasTransitioned
                ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease'
                : 'none',
            }}
          />
        )}

        {grouped.map(({ category, items }) => {
          const dotColor = categoryColors[category] || 'var(--token-text-tertiary)';
          return (
            <div key={category} style={{ marginTop: 'var(--token-space-2)' }}>
              {/* Category label */}
              <div
                className="flex items-center"
                style={{
                  padding: 'var(--token-space-1-5) var(--token-space-4)',
                  gap: 'var(--token-space-2)',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 'var(--token-radius-full)',
                    background: dotColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: 'var(--token-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  {category}
                </span>
              </div>

              {/* Items */}
              {items.map(entry => {
                const isActive = activeId === entry.id;
                return (
                  <button
                    key={entry.id}
                    ref={el => {
                      if (el) itemRefs.current.set(entry.id, el);
                      else itemRefs.current.delete(entry.id);
                    }}
                    onClick={() => {
                      userClickRef.current = true;
                      onItemClick(entry.id);
                      if (isMobile) onClose();
                    }}
                    className="flex items-center w-full cursor-pointer"
                    style={{
                      padding: 'var(--token-space-1-5) var(--token-space-4)',
                      paddingLeft: 'var(--token-space-8)',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: 'var(--token-font-sans)',
                      fontSize: 'var(--token-text-sm)',
                      color: isActive
                        ? 'var(--token-text-primary)'
                        : 'var(--token-text-secondary)',
                      textAlign: 'left',
                      transition: 'color 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--token-text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--token-text-secondary)';
                      }
                    }}
                  >
                    {entry.title}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/* ——————————————————————————————————————————
   Component Grid  (renders in registry order)
   —————————————————————————————————————————— */
function ComponentGrid({
  cardRefs,
}: {
  cardRefs: React.MutableRefObject<Map<string, HTMLElement>>;
}) {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      /* ——— Gallery: Mobile = 1 col, All devices ≥768px = 2 cols ——— */
      if (width < 768) {
        setColumns(1);
      } else {
        setColumns(2);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return (
    <div className="flex-1 flex flex-col" style={{ minWidth: 0, width: '100%' }}>
      <div
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          width: '100%',
        }}
      >
        {componentRegistry.map((entry, index) => {
          const isLastColumn = (index % columns) === (columns - 1);
          const isLastRow = index >= componentRegistry.length - columns;

          return (
            <div
              key={entry.id}
              id={`card-${entry.id}`}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardRefs.current.set(entry.id, el);
                else cardRefs.current.delete(entry.id);
              }}
              style={{
                borderBottom: isLastRow ? 'none' : '1px solid var(--token-border)',
                borderRight: isLastColumn ? 'none' : '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                minWidth: 0,
              }}
            >
              <ComponentPreviewCard
                component={entry.component}
                name={entry.title}
                category={entry.category}
                detailPath={`/component/${entry.id}`}
              />
            </div>
          );
        })}
      </div>
      {/* Empty footer space so the last row can scroll up to the scan line */}
      <div
        style={{
          height: 'calc(65vh - 56px)',
          flexShrink: 0,
          borderRight: 'none',
          background: 'var(--token-bg)',
        }}
      />
    </div>
  );
}

/* ——————————————————————————————————————————
   HomePage — sidebar + grid with responsive mobile menu
   —————————————————————————————————————————— */
export function HomePage() {
  const [activeId, setActiveId] = useState<string | null>(
    componentRegistry[0]?.id ?? null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  /* Guard: prevent save from overwriting sessionStorage during restore */
  const isRestoringScroll = useRef(false);

  /* ─── Restore scroll position from sessionStorage on mount ─── */
  useEffect(() => {
    const scrollEl = gridContainerRef.current;
    if (!scrollEl) return;
    const saved = sessionStorage.getItem('gallery-page-scroll');
    if (!saved) return;
    const pos = parseInt(saved, 10);
    if (isNaN(pos) || pos <= 0) return;

    isRestoringScroll.current = true;
    let attempts = 0;
    const maxAttempts = 20;
    let pendingTimeout: ReturnType<typeof setTimeout> | null = null;
    let pendingRaf: number | null = null;

    const tryRestore = () => {
      attempts++;
      scrollEl.scrollTop = pos;
      if (Math.abs(scrollEl.scrollTop - pos) > 2 && attempts < maxAttempts) {
        pendingTimeout = setTimeout(tryRestore, 50);
      } else {
        pendingTimeout = setTimeout(() => { isRestoringScroll.current = false; }, 100);
      }
    };
    pendingRaf = requestAnimationFrame(tryRestore);

    return () => {
      isRestoringScroll.current = false;
      if (pendingTimeout !== null) clearTimeout(pendingTimeout);
      if (pendingRaf !== null) cancelAnimationFrame(pendingRaf);
    };
  }, []);

  /* ─── Save scroll position to sessionStorage on scroll ─── */
  useEffect(() => {
    const scrollEl = gridContainerRef.current;
    if (!scrollEl) return;
    let saveRaf = 0;
    const onScroll = () => {
      if (isRestoringScroll.current) return;
      cancelAnimationFrame(saveRaf);
      saveRaf = requestAnimationFrame(() => {
        if (!isRestoringScroll.current) {
          sessionStorage.setItem('gallery-page-scroll', String(scrollEl.scrollTop));
        }
      });
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(saveRaf);
    };
  }, []);

  /* ─── Scroll-position based tracking ─── */
  useEffect(() => {
    let rafId = 0;
    const scrollEl = gridContainerRef.current;

    const update = () => {
      if (isScrollingRef.current || !scrollEl) return;

      if (scrollEl.scrollTop <= 5) {
        const firstId = componentRegistry[0]?.id;
        if (firstId) {
          setActiveId(prev => (prev === firstId ? prev : firstId));
        }
        return;
      }

      const containerRect = scrollEl.getBoundingClientRect();
      const scanY = containerRect.top + containerRect.height * 0.35;

      /* Determine columns based on width — Gallery: Mobile = 1, All others = 2 */
      const width = window.innerWidth;
      const columns = width < 768 ? 1 : 2;

      type RowInfo = {
        entries: string[];
        top: number;
        bottom: number;
      };
      const rows: RowInfo[] = [];
      for (let i = 0; i < componentRegistry.length; i += columns) {
        const rowEntries = componentRegistry.slice(i, i + columns);
        const firstEntry = rowEntries[0];
        const firstEl = cardRefs.current.get(firstEntry.id);
        if (!firstEl) continue;
        const rect = firstEl.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
        rows.push({
          entries: rowEntries.map(e => e.id),
          top: rect.top,
          bottom: rect.bottom,
        });
      }

      if (rows.length === 0) return;

      let bestRow: RowInfo | null = null;
      let bestDist = Infinity;
      for (const row of rows) {
        const mid = (row.top + row.bottom) / 2;
        const dist = Math.abs(mid - scanY);
        if (dist < bestDist) {
          bestDist = dist;
          bestRow = row;
        }
      }

      if (!bestRow) return;

      const rowH = bestRow.bottom - bestRow.top;
      const fraction = rowH > 0 ? (scanY - bestRow.top) / rowH : 0;

      let targetId: string;
      if (bestRow.entries.length === 1) {
        targetId = bestRow.entries[0];
      } else {
        const index = Math.floor(fraction * bestRow.entries.length);
        targetId = bestRow.entries[Math.min(index, bestRow.entries.length - 1)];
      }

      setActiveId(prev => (prev === targetId ? prev : targetId));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    scrollEl?.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(update);

    return () => {
      scrollEl?.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ─── Scroll to card on sidebar click ─── */
  const handleSidebarClick = useCallback((id: string) => {
    const el = document.getElementById(`card-${id}`);
    if (!el) return;

    setActiveId(id);
    isScrollingRef.current = true;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    el.style.background = 'var(--token-bg-active)';
    setTimeout(() => {
      el.style.background = 'var(--token-bg)';
    }, 600);

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  }, []);

  /* Mobile menu control */
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Mobile header with hamburger */}
      {isMobile && (
        <div className="mobile-header">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="responsive-hamburger"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span
            style={{
              fontSize: 'var(--token-text-sm)',
              fontWeight: 'var(--token-weight-semibold)',
              color: 'var(--token-text-primary)',
            }}
          >
            AI Components
          </span>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {componentRegistry.length}
          </span>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="responsive-sidebar-overlay visible"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex" style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <Sidebar 
          activeId={activeId} 
          onItemClick={handleSidebarClick}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div 
          ref={gridContainerRef} 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            overflowX: 'hidden', 
            minWidth: 0,
            width: '100%',
          }}
        >
          <ComponentGrid cardRefs={cardRefs} />
        </div>
      </div>
    </div>
  );
}