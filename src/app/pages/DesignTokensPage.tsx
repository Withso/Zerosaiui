/* ================================================
   Design Tokens Page — Documentation view
   Data-driven from shared tokenData (source of truth)
   Sidebar + single-column gallery rows
   Responsive with mobile menu
   ================================================ */
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { Menu, X, Check, Copy, Palette, Type, Space, Circle, Layers, Zap, Hash, PanelsTopLeft, Paintbrush, AlignLeft, Grid3x3, SunMoon, Ruler, LetterText, FileJson, FileCode2, ChevronDown } from 'lucide-react';
import { TokensSection, tokenSidebarSections } from '../components/ds/TokensSection';
import { allCollections } from '../data/tokenData';

/* ——————————————————————————————————————————
   Figma Variables Export
   —————————————————————————————————————————— */
function buildFigmaExport(mode: 'light' | 'dark') {
  const result: { collections: { name: string; modes: string[]; variables: { name: string; type: string; value: string }[] }[] } = { collections: [] };
  for (const coll of allCollections) {
    const variables = coll.groups.flatMap(g =>
      g.tokens.map(t => {
        /* For L4 component tokens, use the resolved swatch value instead of the alias reference */
        let value: string;
        if (mode === 'light') {
          value = t.lightSwatch || t.lightValue;
        } else {
          value = t.darkSwatch || t.darkValue;
        }
        return {
          name: `${g.name}/${t.name.replace(/^--token-/, '').replace(/^--/, '')}`,
          type: 'STRING' as string,
          value,
        };
      })
    );
    result.collections.push({ name: coll.name, modes: [mode], variables });
  }
  return result;
}

/* ——————————————————————————————————————————
   CSS Variables Export
   —————————————————————————————————————————— */
function buildCssExport(mode: 'light' | 'dark'): string {
  const lines: string[] = [];
  const selector = mode === 'light' ? ':root' : '.dark';
  lines.push(`/* Zeros-AIUI Design Tokens — ${mode === 'light' ? 'Light' : 'Dark'} Theme */`);
  lines.push(`/* Generated from the Geological Intelligence palette */`);
  lines.push('');
  lines.push(`${selector} {`);

  for (const coll of allCollections) {
    /* Skip L4 component alias tokens from CSS export — they are documentation-only */
    if (coll.name === 'Components') continue;
    lines.push(`  /* ——— ${coll.name} ——— */`);
    for (const group of coll.groups) {
      if (coll.groups.length > 1) {
        lines.push(`  /* ${group.name} */`);
      }
      for (const token of group.tokens) {
        const value = mode === 'light' ? token.lightValue : token.darkValue;
        lines.push(`  ${token.name}: ${value};`);
      }
      lines.push('');
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function buildCssExportFull(): string {
  const lines: string[] = [];
  lines.push('/* ================================================');
  lines.push('   Zeros-AIUI Design Tokens — Complete Export');
  lines.push('   Geological Intelligence Color Palette');
  lines.push('   4-Level Token Architecture');
  lines.push('   ================================================ */');
  lines.push('');

  /* Light theme */
  lines.push(':root {');
  for (const coll of allCollections) {
    if (coll.name === 'Components') continue;
    lines.push(`  /* ——— ${coll.name} ——— */`);
    for (const group of coll.groups) {
      if (coll.groups.length > 1) lines.push(`  /* ${group.name} */`);
      for (const token of group.tokens) {
        lines.push(`  ${token.name}: ${token.lightValue};`);
      }
      lines.push('');
    }
  }
  lines.push('}');
  lines.push('');

  /* Dark theme */
  lines.push('/* ——— Dark Theme ——— */');
  lines.push('.dark {');
  for (const coll of allCollections) {
    if (coll.name === 'Components') continue;
    /* Only include tokens where dark differs from light */
    const diffTokens = coll.groups.flatMap(g =>
      g.tokens.filter(t => t.darkValue !== t.lightValue)
    );
    if (diffTokens.length === 0) continue;
    lines.push(`  /* ——— ${coll.name} ——— */`);
    for (const group of coll.groups) {
      const groupDiff = group.tokens.filter(t => t.darkValue !== t.lightValue);
      if (groupDiff.length === 0) continue;
      if (coll.groups.length > 1) lines.push(`  /* ${group.name} */`);
      for (const token of groupDiff) {
        lines.push(`  ${token.name}: ${token.darkValue};`);
      }
      lines.push('');
    }
  }
  lines.push('}');

  return lines.join('\n');
}

/* ——————————————————————————————————————————
   Token Export Panel
   —————————————————————————————————————————— */
function TokenExportPanel() {
  const [exportFormat, setExportFormat] = useState<'figma' | 'css'>('figma');
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {
      /* Fallback for older browsers */
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch { /* ignore */ }
    });
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFigmaCopy = (mode: 'light' | 'dark') => {
    const data = buildFigmaExport(mode);
    copyToClipboard(JSON.stringify(data, null, 2), `figma-${mode}`);
  };

  const handleCssCopy = (variant: 'light' | 'dark' | 'both') => {
    let css: string;
    if (variant === 'both') {
      css = buildCssExportFull();
    } else {
      css = buildCssExport(variant);
    }
    copyToClipboard(css, `css-${variant}`);
  };

  /* Count tokens across all collections */
  const totalTokens = allCollections.reduce((sum, c) => sum + c.tokenCount, 0);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 3,
    padding: '3px 8px', borderRadius: 'var(--token-radius-sm)',
    border: 'none', fontSize: 9, fontFamily: 'var(--token-font-mono)',
    color: active ? 'var(--token-accent)' : 'var(--token-text-disabled)',
    background: active ? 'var(--token-accent-muted)' : 'transparent',
    cursor: 'pointer', transition: 'all 120ms',
  });

  const btnStyle = (label: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 'var(--token-radius-md)',
    border: '1px solid var(--token-border)', background: 'var(--token-bg)',
    fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
    color: copied === label ? 'var(--token-success)' : 'var(--token-text-secondary)',
    cursor: 'pointer', transition: 'all 120ms', whiteSpace: 'nowrap',
  });

  return (
    <div style={{
      margin: 'var(--token-space-4) var(--token-space-4) 0',
      border: '1px solid var(--token-border-subtle)',
      borderRadius: 'var(--token-radius-md)',
      background: 'var(--token-bg-secondary)',
      overflow: 'hidden',
    }}>
      {/* Header — clickable to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full cursor-pointer"
        style={{
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          border: 'none', background: 'transparent',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
          <Copy size={11} style={{ color: 'var(--token-text-disabled)' }} />
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-tertiary)', textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Export Tokens
          </span>
          <span style={{
            fontSize: 9, fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)',
          }}>
            {totalTokens}
          </span>
        </div>
        <ChevronDown
          size={11}
          style={{
            color: 'var(--token-text-disabled)',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--token-duration-fast)',
          }}
        />
      </button>

      {expanded && (
        <div style={{
          padding: '0 var(--token-space-3) var(--token-space-3)',
        }}>
          {/* Format tabs */}
          <div className="flex items-center" style={{
            gap: 'var(--token-space-1)',
            marginBottom: 'var(--token-space-2-5)',
          }}>
            <button onClick={() => setExportFormat('figma')} className="cursor-pointer" style={tabStyle(exportFormat === 'figma')}>
              <FileJson size={9} />
              Figma JSON
            </button>
            <button onClick={() => setExportFormat('css')} className="cursor-pointer" style={tabStyle(exportFormat === 'css')}>
              <FileCode2 size={9} />
              CSS Variables
            </button>
          </div>

          {/* Figma export buttons */}
          {exportFormat === 'figma' && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
              <div className="flex items-center" style={{ gap: 6 }}>
                <button
                  onClick={() => handleFigmaCopy('light')}
                  className="cursor-pointer"
                  style={btnStyle('figma-light')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
                >
                  {copied === 'figma-light' ? <Check size={10} /> : <Copy size={10} />}
                  Light
                </button>
                <button
                  onClick={() => handleFigmaCopy('dark')}
                  className="cursor-pointer"
                  style={btnStyle('figma-dark')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
                >
                  {copied === 'figma-dark' ? <Check size={10} /> : <Copy size={10} />}
                  Dark
                </button>
              </div>
              <span style={{
                fontSize: 9, color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)', lineHeight: 1.4,
              }}>
                Copies JSON for Figma Variables import
              </span>
            </div>
          )}

          {/* CSS Variables export buttons */}
          {exportFormat === 'css' && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
              <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
                <button
                  onClick={() => handleCssCopy('light')}
                  className="cursor-pointer"
                  style={btnStyle('css-light')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
                >
                  {copied === 'css-light' ? <Check size={10} /> : <Copy size={10} />}
                  Light
                </button>
                <button
                  onClick={() => handleCssCopy('dark')}
                  className="cursor-pointer"
                  style={btnStyle('css-dark')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
                >
                  {copied === 'css-dark' ? <Check size={10} /> : <Copy size={10} />}
                  Dark
                </button>
                <button
                  onClick={() => handleCssCopy('both')}
                  className="cursor-pointer"
                  style={btnStyle('css-both')}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
                >
                  {copied === 'css-both' ? <Check size={10} /> : <Copy size={10} />}
                  Both
                </button>
              </div>
              <span style={{
                fontSize: 9, color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)', lineHeight: 1.4,
              }}>
                Copies :root / .dark CSS custom properties
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————
   Icon mapping for groups
   —————————————————————————————————————————— */
const groupIcons: Record<string, React.ReactNode> = {
  'Moonstone': <Palette size={13} />,
  'Sunstone': <Palette size={13} />,
  'Olivine': <Palette size={13} />,
  'Malachite': <Palette size={13} />,
  'Garnet': <Palette size={13} />,
  'Ochre': <Palette size={13} />,
  'Cyan': <Palette size={13} />,
  'Neutral': <Palette size={13} />,
  'Background': <PanelsTopLeft size={13} />,
  'Text': <AlignLeft size={13} />,
  'Border': <Grid3x3 size={13} />,
  'Brand Primary': <Paintbrush size={13} />,
  'Brand Secondary': <Paintbrush size={13} />,
  'Brand Tertiary': <Paintbrush size={13} />,
  'Status': <SunMoon size={13} />,
  'Chart / Categorical': <Palette size={13} />,
  'Font Size': <Type size={13} />,
  'Font Family': <LetterText size={13} />,
  'Font Weight': <Type size={13} />,
  'Line Height': <AlignLeft size={13} />,
  'Letter Spacing': <Ruler size={13} />,
  'Spacing': <Space size={13} />,
  'Radius': <Circle size={13} />,
  'Z-Index': <Hash size={13} />,
  'Shadows': <Layers size={13} />,
  'Motion': <Zap size={13} />,
};
const defaultIcon = <Circle size={13} />;

/* ——————————————————————————————————————————
   Sidebar — Data-driven from tokenSidebarSections
   —————————————————————————————————————————— */
function TokensSidebar({ 
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

  /* Group sidebar items by collection */
  const grouped = useMemo(() => {
    const map = new Map<string, typeof tokenSidebarSections>();
    for (const sec of tokenSidebarSections) {
      if (!map.has(sec.collection)) map.set(sec.collection, []);
      map.get(sec.collection)!.push(sec);
    }
    return Array.from(map.entries());
  }, []);

  const totalCount = useMemo(() => tokenSidebarSections.reduce((s, sec) => s + sec.count, 0), []);

  const sidebarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    borderRight: '1px solid var(--token-border)',
    background: 'var(--token-bg)',
    fontFamily: 'var(--token-font-sans)',
    zIndex: 1,
  };

  if (isMobile) {
    Object.assign(sidebarStyle, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 280,
      zIndex: 'var(--token-z-modal)' as any,
      transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
      boxShadow: isMobileOpen ? 'var(--token-shadow-lg)' : 'none',
    });
  } else {
    Object.assign(sidebarStyle, {
      width: window.innerWidth >= 1440 ? 260 : 220,
      flexShrink: 0,
    });
  }

  const handleItemClick = (id: string) => {
    onSectionClick(id);
    if (isMobile) onClose();
  };

  return (
    <nav style={sidebarStyle}>
      {/* Header */}
      <div className="flex items-center" style={{ padding: 'var(--token-space-4) var(--token-space-4) var(--token-space-2)', gap: 'var(--token-space-1-5)', justifyContent: 'space-between' }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
          <span style={{
            fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-semibold)',
            color: 'var(--token-text-primary)', letterSpacing: 'var(--token-tracking-tight)',
          }}>
            Tokens
          </span>
          <span style={{
            fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {totalCount}
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

      {/* Collection-grouped sections */}
      <div className="flex flex-col" style={{ padding: '0 var(--token-space-2)' }}>
        {grouped.map(([collName, sections]) => (
          <div key={collName} style={{ marginBottom: 'var(--token-space-2)' }}>
            {/* Collection label */}
            <div className="flex items-center" style={{
              padding: 'var(--token-space-1-5) var(--token-space-3)',
              gap: 'var(--token-space-2)',
            }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-tertiary)', textTransform: 'uppercase',
                letterSpacing: '0.06em', fontFamily: 'var(--token-font-mono)',
              }}>
                {collName}
              </span>
            </div>

            {/* Group items */}
            {sections.map(sec => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleItemClick(sec.id)}
                  className="flex items-center w-full cursor-pointer"
                  style={{
                    gap: 'var(--token-space-2)',
                    padding: 'var(--token-space-1-5) var(--token-space-3)',
                    paddingLeft: 'var(--token-space-5)',
                    border: 'none',
                    borderRadius: 'var(--token-radius-md)',
                    background: isActive ? 'var(--token-bg-hover)' : 'transparent',
                    fontFamily: 'var(--token-font-sans)',
                    fontSize: 'var(--token-text-sm)',
                    color: isActive ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                    fontWeight: isActive ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
                    textAlign: 'left',
                    transition: 'all var(--token-duration-fast)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--token-bg-hover)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ color: isActive ? 'var(--token-accent)' : 'var(--token-text-disabled)', display: 'flex', flexShrink: 0 }}>
                    {groupIcons[sec.group] || defaultIcon}
                  </span>
                  <span className="flex-1">{sec.label}</span>
                  <span style={{
                    fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                    color: 'var(--token-text-disabled)',
                  }}>
                    {sec.count}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Token export panel */}
      <TokenExportPanel />

      {/* Back to gallery */}
      <div style={{ marginTop: 'auto', padding: 'var(--token-space-4)' }}>
        <Link
          to="/"
          style={{
            fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)',
            textDecoration: 'none', fontFamily: 'var(--token-font-sans)',
            transition: 'color var(--token-duration-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
        >
          &larr; Back to Gallery
        </Link>
      </div>
    </nav>
  );
}

/* ——————————————————————————————————————————
   Main Page
   —————————————————————————————————————————— */
export function DesignTokensPage() {
  const [activeSection, setActiveSection] = useState(tokenSidebarSections[0]?.id || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  const totalCount = useMemo(() => tokenSidebarSections.reduce((s, sec) => s + sec.count, 0), []);

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

      if (scrollEl.scrollTop <= 5 && tokenSidebarSections.length > 0) best = tokenSidebarSections[0].id;

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
            Design Tokens
          </span>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {totalCount}
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
        <TokensSidebar 
          activeSection={activeSection} 
          onSectionClick={handleSectionClick}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div ref={contentRef} className="flex-1" style={{ minWidth: 0, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', width: '100%' }}>
          <TokensSection registerRef={registerRef} />

          {/* Footer spacing */}
          <div style={{ height: 'calc(50vh)', flexShrink: 0, background: 'var(--token-bg)' }} />
        </div>
      </div>
    </div>
  );
}