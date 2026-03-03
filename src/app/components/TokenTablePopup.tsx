/* ================================================
   Token Table Popup — Figma Variables-style panel
   Read-only, draggable, responsive, auto-updates
   from tokens.css via Vite ?raw import
   ================================================ */
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { X, Search, Table2, Maximize2, Minimize2 } from 'lucide-react';
import {
  type TokenEntry,
  allCollections, isColorValue,
} from '../data/tokenData';

/* ═══════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════ */
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return size;
}

/* ═══════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════ */

/* Color Swatch */
function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 3,
        background: color === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50%/8px 8px' : color,
        border: '1px solid var(--token-border)',
        flexShrink: 0,
      }}
    />
  );
}

/* Variable icon (small diamond/hexagon) */
function VarIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" style={{ flexShrink: 0, opacity: 0.4 }}>
      <path d="M6 1L10 3.5V8.5L6 11L2 8.5V3.5L6 1Z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* Token Row */
function TokenRow({ token, isLast }: { token: TokenEntry; isLast: boolean }) {
  /* For alias tokens (L4), use the swatch fields for color preview;
     for regular tokens, use the value itself */
  const lightSwatchColor = token.lightSwatch || token.lightValue;
  const darkSwatchColor = token.darkSwatch || token.darkValue;
  const lightHasSwatch = isColorValue(lightSwatchColor);
  const darkHasSwatch = isColorValue(darkSwatchColor);
  const shortName = token.name.replace(/^--token-/, '').replace(/^--/, '');

  return (
    <div
      className="flex items-center"
      style={{
        padding: '6px 12px',
        borderBottom: isLast ? 'none' : '1px solid var(--token-border-subtle)',
        gap: 8,
        minHeight: 34,
        transition: 'background var(--token-duration-fast)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Name */}
      <div className="flex items-center" style={{ flex: '1 1 160px', gap: 6, minWidth: 0 }}>
        <VarIcon />
        <span
          style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-primary)',
            fontFamily: 'var(--token-font-sans)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={token.name}
        >
          {shortName}
        </span>
      </div>

      {/* Light Value */}
      <div
        className="flex items-center"
        style={{ flex: '1 1 130px', gap: 6, minWidth: 0, justifyContent: 'flex-start' }}
      >
        {lightHasSwatch && <ColorSwatch color={lightSwatchColor} />}
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={token.lightSwatch ? `${token.lightValue} → ${token.lightSwatch}` : token.lightValue}
        >
          {token.lightValue}
        </span>
      </div>

      {/* Dark Value */}
      <div
        className="flex items-center"
        style={{ flex: '1 1 130px', gap: 6, minWidth: 0, justifyContent: 'flex-start' }}
      >
        {darkHasSwatch && <ColorSwatch color={darkSwatchColor} />}
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={token.darkSwatch ? `${token.darkValue} → ${token.darkSwatch}` : token.darkValue}
        >
          {token.darkValue}
        </span>
      </div>
    </div>
  );
}

/* Group Header Row */
function GroupHeader({ name, count }: { name: string; count: number }) {
  return (
    <div
      className="flex items-center"
      style={{
        padding: '8px 12px 4px',
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 'var(--token-text-xs)',
          fontWeight: 'var(--token-weight-semibold)',
          color: 'var(--token-text-primary)',
          fontFamily: 'var(--token-font-sans)',
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}
      >
        {count}
      </span>
    </div>
  );
}

/* Sidebar list item */
function SidebarItem({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full cursor-pointer"
      style={{
        padding: '4px 10px',
        borderRadius: 'var(--token-radius-sm)',
        border: 'none',
        background: isActive ? 'var(--token-accent-muted)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--token-accent)' : '2px solid transparent',
        transition: 'all var(--token-duration-fast)',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <span
        style={{
          fontSize: 'var(--token-text-xs)',
          color: isActive ? 'var(--token-accent)' : 'var(--token-text-secondary)',
          fontWeight: isActive ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
          fontFamily: 'var(--token-font-sans)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--token-text-2xs)',
          color: isActive ? 'var(--token-accent)' : 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
          minWidth: 20,
          textAlign: 'right',
        }}
      >
        {count}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Main Popup Component
   ═══════════════════════════════════════════════ */
function TokenTablePanel({ onClose }: { onClose: () => void }) {
  const collections = allCollections;
  const totalTokenCount = useMemo(() => collections.reduce((s, c) => s + c.tokenCount, 0), [collections]);

  const { w: winW, h: winH } = useWindowSize();
  const isMobile = winW < 640;

  const [selectedCollection, setSelectedCollection] = useState(collections[0]?.name || '');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  // Panel size
  const panelW = isMobile ? winW : isMaximized ? winW - 40 : Math.min(820, winW - 40);
  const panelH = isMobile ? winH - 56 : isMaximized ? winH - 40 : Math.min(580, winH - 80);

  // Position (centered initially, ensure below header)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (isMobile) {
        setPosition({ x: 0, y: 56 });
      } else {
        setPosition({
          x: Math.max(20, (winW - panelW) / 2),
          y: Math.max(60, (winH - panelH) / 2),
        });
      }
    }
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Re-center on maximize toggle
  useEffect(() => {
    if (isMaximized) {
      setPosition({ x: 20, y: 20 });
    } else if (!isMobile) {
      setPosition({
        x: Math.max(20, (winW - panelW) / 2),
        y: Math.max(20, (winH - panelH) / 2),
      });
    }
  }, [isMaximized]);

  // Dragging
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile || isMaximized) return;
    e.preventDefault();
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    posStart.current = { ...position };
  }, [position, isMobile, isMaximized]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      setPosition({
        x: Math.max(0, Math.min(winW - 100, posStart.current.x + dx)),
        y: Math.max(0, Math.min(winH - 40, posStart.current.y + dy)),
      });
    };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [winW, winH]);

  // Current collection data
  const currentCollection = collections.find(c => c.name === selectedCollection);
  const currentGroups = currentCollection?.groups || [];

  // Filtered tokens
  const visibleGroups = useMemo(() => {
    let groups = selectedGroup === 'All'
      ? currentGroups
      : currentGroups.filter(g => g.name === selectedGroup);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      groups = groups.map(g => ({
        ...g,
        tokens: g.tokens.filter(
          t =>
            t.name.toLowerCase().includes(q) ||
            t.lightValue.toLowerCase().includes(q) ||
            t.darkValue.toLowerCase().includes(q) ||
            t.group.toLowerCase().includes(q)
        ),
      })).filter(g => g.tokens.length > 0);
    }

    return groups;
  }, [currentGroups, selectedGroup, searchQuery]);

  const visibleTokenCount = visibleGroups.reduce((s, g) => s + g.tokens.length, 0);

  // Sidebar section
  const sidebarWidth = 200;

  return (
    <div>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--token-bg-overlay)',
            zIndex: 998,
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          left: isMobile ? 0 : position.x,
          top: isMobile ? 56 : position.y,
          width: isMobile ? '100%' : panelW,
          height: isMobile ? `calc(100vh - 56px)` : panelH,
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--token-bg)',
          border: isMobile ? 'none' : '1px solid var(--token-border)',
          borderRadius: isMobile ? 0 : 'var(--token-radius-lg)',
          boxShadow: isMobile ? 'none' : 'var(--token-shadow-xl)',
          overflow: 'hidden',
          fontFamily: 'var(--token-font-sans)',
          userSelect: isDragging.current ? 'none' : 'auto',
        }}
      >
        {/* ——— Title Bar (drag handle) ——— */}
        <div
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          className="flex items-center shrink-0"
          style={{
            height: 38,
            padding: '0 10px 0 14px',
            borderBottom: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
            cursor: isMobile || isMaximized ? 'default' : 'grab',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              fontWeight: 'var(--token-weight-semibold)',
              color: 'var(--token-text-primary)',
              letterSpacing: 'var(--token-tracking-tight)',
            }}
          >
            Variables
          </span>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {totalTokenCount}
          </span>

          <div className="flex-1" />

          {/* Search */}
          <div
            className="flex items-center"
            style={{
              background: 'var(--token-bg)',
              border: '1px solid var(--token-border)',
              borderRadius: 'var(--token-radius-sm)',
              padding: '2px 6px',
              gap: 4,
              maxWidth: isMobile ? 120 : 180,
              flex: '0 1 180px',
            }}
          >
            <Search size={11} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-primary)',
                fontFamily: 'var(--token-font-sans)',
                width: '100%',
                padding: 0,
              }}
            />
          </div>

          {/* Toggle sidebar on mobile */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(v => !v)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 26,
                height: 26,
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: showSidebar ? 'var(--token-accent-muted)' : 'var(--token-bg)',
                color: showSidebar ? 'var(--token-accent)' : 'var(--token-text-secondary)',
              }}
            >
              <Table2 size={12} />
            </button>
          )}

          {/* Maximize */}
          {!isMobile && (
            <button
              onClick={() => setIsMaximized(v => !v)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 26,
                height: 26,
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: 'var(--token-text-secondary)',
                transition: 'all var(--token-duration-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
            >
              {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 26,
              height: 26,
              borderRadius: 'var(--token-radius-sm)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
              color: 'var(--token-text-secondary)',
              transition: 'all var(--token-duration-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--token-error)';
              e.currentTarget.style.color = 'var(--token-error)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--token-border)';
              e.currentTarget.style.color = 'var(--token-text-secondary)';
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* ——— Body ——— */}
        <div className="flex flex-1" style={{ minHeight: 0, overflow: 'hidden' }}>
          {/* Sidebar */}
          {showSidebar && (
            <div
              className="flex flex-col shrink-0"
              style={{
                width: isMobile ? '100%' : sidebarWidth,
                borderRight: isMobile ? 'none' : '1px solid var(--token-border)',
                background: 'var(--token-bg-secondary)',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {/* Collections */}
              <div style={{ padding: '8px 8px 4px' }}>
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '2px 6px',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--token-text-2xs)',
                      fontWeight: 'var(--token-weight-semibold)',
                      color: 'var(--token-text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontFamily: 'var(--token-font-mono)',
                    }}
                  >
                    Collections
                  </span>
                </div>
                {collections.map(c => (
                  <SidebarItem
                    key={c.name}
                    label={c.name}
                    count={c.tokenCount}
                    isActive={selectedCollection === c.name}
                    onClick={() => {
                      setSelectedCollection(c.name);
                      setSelectedGroup('All');
                      if (isMobile) setShowSidebar(false);
                    }}
                  />
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--token-border)', margin: '4px 8px' }} />

              {/* Groups */}
              <div style={{ padding: '4px 8px 8px' }}>
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '2px 6px',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--token-text-2xs)',
                      fontWeight: 'var(--token-weight-semibold)',
                      color: 'var(--token-text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontFamily: 'var(--token-font-mono)',
                    }}
                  >
                    Groups
                  </span>
                </div>
                <SidebarItem
                  label="All"
                  count={currentCollection?.tokenCount || 0}
                  isActive={selectedGroup === 'All'}
                  onClick={() => {
                    setSelectedGroup('All');
                    if (isMobile) setShowSidebar(false);
                  }}
                />
                {currentGroups.map(g => (
                  <SidebarItem
                    key={g.name}
                    label={g.name}
                    count={g.tokens.length}
                    isActive={selectedGroup === g.name}
                    onClick={() => {
                      setSelectedGroup(g.name);
                      if (isMobile) setShowSidebar(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Token Table */}
          {(!isMobile || !showSidebar) && (
            <div className="flex flex-col flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
              {/* Table header */}
              <div
                className="flex items-center shrink-0"
                style={{
                  padding: '6px 12px',
                  borderBottom: '1px solid var(--token-border)',
                  background: 'var(--token-bg-secondary)',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    flex: '1 1 160px',
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-semibold)',
                    color: 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Name
                </span>
                <span
                  style={{
                    flex: '1 1 130px',
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-semibold)',
                    color: 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Light
                </span>
                <span
                  style={{
                    flex: '1 1 130px',
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-semibold)',
                    color: 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Dark
                </span>
              </div>

              {/* Scrollable content */}
              <div className="flex-1" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {visibleGroups.length === 0 ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      padding: 'var(--token-space-10)',
                      color: 'var(--token-text-disabled)',
                      fontSize: 'var(--token-text-xs)',
                      fontFamily: 'var(--token-font-mono)',
                    }}
                  >
                    {searchQuery ? 'No tokens match your search' : 'No tokens'}
                  </div>
                ) : (
                  visibleGroups.map(group => (
                    <div key={group.name}>
                      {/* Show group header when viewing "All" */}
                      {selectedGroup === 'All' && (
                        <GroupHeader name={group.name} count={group.tokens.length} />
                      )}
                      {group.tokens.map((token, i) => (
                        <TokenRow
                          key={token.name}
                          token={token}
                          isLast={i === group.tokens.length - 1 && selectedGroup !== 'All'}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between shrink-0"
                style={{
                  padding: '6px 12px',
                  borderTop: '1px solid var(--token-border)',
                  background: 'var(--token-bg-secondary)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-disabled)',
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  {visibleTokenCount} variable{visibleTokenCount !== 1 ? 's' : ''}
                  {searchQuery && ` (filtered)`}
                </span>
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-disabled)',
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  Read-only
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Trigger Button — place in header
   ═══════════════════════════════════════════════ */
export function TokenTableButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center justify-center cursor-pointer"
        title="Token Variables"
        style={{
          width: 34,
          height: 34,
          borderRadius: 'var(--token-radius-md)',
          border: `1px solid ${isOpen ? 'var(--token-accent)' : 'var(--token-border)'}`,
          background: isOpen ? 'var(--token-accent-muted)' : 'var(--token-bg)',
          color: isOpen ? 'var(--token-accent)' : 'var(--token-text-secondary)',
          transition: 'all var(--token-duration-normal) var(--token-ease-default)',
        }}
        onMouseEnter={e => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border-strong)';
            (e.currentTarget as HTMLElement).style.color = 'var(--token-text-primary)';
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--token-text-secondary)';
          }
        }}
      >
        <Table2 size={15} />
      </button>
      {isOpen && <TokenTablePanel onClose={() => setIsOpen(false)} />}
    </div>
  );
}