/* ================================================
   Design System Page — Gallery grid layout
   Matches homepage gallery: preview cell + title bar
   Responsive with mobile hamburger menu
   ================================================ */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { AtomsSection, atomEntries } from '../components/ds/AtomsSection';
import { MoleculesSection, moleculeEntries } from '../components/ds/MoleculesSection';
import { ComponentsSection, fullComponents } from '../components/ds/ComponentsSection';
import { DSSidebar } from '../components/ds/DSSidebar';

/* ——————————————————————————————————————————
   Compact Section Header (no description)
   —————————————————————————————————————————— */
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div
      className="flex items-center token-section-header"
      style={{
        gap: 'var(--token-space-2-5)',
        padding: 'var(--token-space-4) var(--token-space-6)',
        borderBottom: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}
    >
      <h2 style={{
        margin: 0, fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-semibold)',
        color: 'var(--token-text-primary)', letterSpacing: 'var(--token-tracking-tight)',
      }}>
        {title}
      </h2>
      <span style={{
        fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
        color: 'var(--token-accent)', background: 'var(--token-accent-light)',
        padding: '1px 8px', borderRadius: 'var(--token-radius-full)', lineHeight: '18px',
      }}>
        {count}
      </span>
    </div>
  );
}

/* ——————————————————————————————————————————
   Responsive Sidebar Wrapper
   —————————————————————————————————————————— */
function ResponsiveSidebar({
  activeSection,
  onSectionClick,
  isMobileOpen,
  onClose,
}: {
  activeSection: string;
  onSectionClick: (id: string) => void;
  isMobileOpen: boolean;
  onClose: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 280,
        height: '100%',
        zIndex: 'var(--token-z-modal)' as any,
        transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
        boxShadow: isMobileOpen ? 'var(--token-shadow-lg)' : 'none',
      }
    : {};

  const handleItemClick = (id: string) => {
    onSectionClick(id);
    if (isMobile) onClose();
  };

  return (
    <div style={sidebarStyle}>
      {isMobile && isMobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--token-space-4)',
            right: 'var(--token-space-4)',
            zIndex: 10,
          }}
        >
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 28,
              height: 28,
              border: 'none',
              background: 'var(--token-bg-hover)',
              color: 'var(--token-text-tertiary)',
              borderRadius: 'var(--token-radius-md)',
              transition: 'all var(--token-duration-fast)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-active)';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--token-text-tertiary)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <DSSidebar activeSection={activeSection} onSectionClick={handleItemClick} />
    </div>
  );
}

/* ——————————————————————————————————————————
   Main Page
   —————————————————————————————————————————— */
export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('atoms');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  /* Guard: prevent save from overwriting sessionStorage during restore */
  const isRestoringScroll = useRef(false);

  /* Restore scroll position from sessionStorage on mount.
     Uses retry loop because child components (AtomsSection etc.)
     may not have rendered yet, so scrollHeight is too small on
     the first frame and scrollTop gets clamped to 0. */
  useEffect(() => {
    const scrollEl = contentRef.current;
    if (!scrollEl) return;
    const saved = sessionStorage.getItem('ds-page-scroll');
    if (!saved) return;
    const pos = parseInt(saved, 10);
    if (isNaN(pos) || pos <= 0) return;

    isRestoringScroll.current = true;
    let attempts = 0;
    const maxAttempts = 20; /* ~1 second total */
    let pendingTimeout: ReturnType<typeof setTimeout> | null = null;
    let pendingRaf: number | null = null;

    const tryRestore = () => {
      attempts++;
      scrollEl.scrollTop = pos;
      /* If scrollTop was clamped (content not tall enough yet), retry */
      if (Math.abs(scrollEl.scrollTop - pos) > 2 && attempts < maxAttempts) {
        pendingTimeout = setTimeout(tryRestore, 50);
      } else {
        /* Done restoring — allow saves again after a short grace period */
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

  /* Save scroll position to sessionStorage on scroll */
  useEffect(() => {
    const scrollEl = contentRef.current;
    if (!scrollEl) return;
    let saveRaf = 0;
    const onScroll = () => {
      if (isRestoringScroll.current) return;
      cancelAnimationFrame(saveRaf);
      saveRaf = requestAnimationFrame(() => {
        if (!isRestoringScroll.current) {
          sessionStorage.setItem('ds-page-scroll', String(scrollEl.scrollTop));
        }
      });
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(saveRaf);
    };
  }, []);

  /* Check if mobile */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* Scroll tracking */
  useEffect(() => {
    let rafId = 0;
    const scrollEl = contentRef.current;

    const update = () => {
      if (isClickScrolling.current || !scrollEl) return;

      const scanY = scrollEl.getBoundingClientRect().top + scrollEl.clientHeight * 0.3;
      let best: string | null = null;
      let bestDist = Infinity;

      sectionRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - scanY);
        if (rect.top <= scanY + 200 && dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      });

      if (scrollEl.scrollTop <= 5) best = 'atoms';

      if (best) setActiveSection(prev => prev === best ? prev : best!);
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

  /* Click to scroll */
  const handleSectionClick = useCallback((id: string) => {
    const el = sectionRefs.current.get(id);
    if (!el) return;
    setActiveSection(id);
    isClickScrolling.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isClickScrolling.current = false; }, 900);
  }, []);

  const registerRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Mobile header */}
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
            Design System
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
      <div className="flex" style={{ height: '100%', minHeight: 0 }}>
        <ResponsiveSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div ref={contentRef} className="flex-1" style={{ minWidth: 0, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}>
          {/* ——— Atoms ——— */}
          <div ref={registerRef('atoms')} style={{ scrollMarginTop: 16 }}>
            <SectionHeader title="Atoms" count={atomEntries.length} />
            <AtomsSection />
          </div>

          {/* ——— Molecules ——— */}
          <div ref={registerRef('molecules')} style={{ scrollMarginTop: 16 }}>
            <SectionHeader title="Molecules" count={moleculeEntries.length} />
            <MoleculesSection />
          </div>

          {/* ——— Components ——— */}
          <div ref={registerRef('components')} style={{ scrollMarginTop: 16 }}>
            <SectionHeader title="Components" count={fullComponents.length} />
            <ComponentsSection />
          </div>

          {/* Footer spacing */}
          <div style={{ height: 'calc(50vh)', flexShrink: 0, background: 'var(--token-bg)' }} />
        </div>
      </div>
    </div>
  );
}