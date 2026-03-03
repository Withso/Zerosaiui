/* ================================================
   ListPanel — Shared component for all list-panel variants
   
   One component, multiple use cases:
   - Chat History
   - Thread Manager
   - Knowledge Base
   - Prompt Templates
   - Memory Manager
   
   Composed from DS atoms and molecules.
   Change any atom → propagates here → propagates to all variants.
   ================================================ */
import React, { useState } from 'react';
import { DSButton, DSBadge, DSDot, DSDivider } from '../ds/atoms';
import { DSSearchBar, DSHeaderBar, DSListItem } from '../ds/molecules';
import { Plus, MessageSquare, X } from 'lucide-react';

/* ——— Generic list item shape ——— */
export interface ListPanelItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  dotColor?: string;
  dotPulsing?: boolean;
  pinned?: boolean;
  active?: boolean;
}

/* ——— ListPanel props ——— */
export interface ListPanelProps {
  /** Panel title shown in header */
  title: string;
  /** Header icon (defaults to DSAvatar ai) */
  headerIcon?: React.ReactNode;
  /** Header action buttons */
  headerActions?: React.ReactNode;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Items to display */
  items: ListPanelItem[];
  /** Currently active item id */
  activeId?: string;
  /** Callback when item is selected */
  onSelect?: (id: string) => void;
  /** Callback when "new" button is pressed */
  onNew?: () => void;
  /** Callback when item is removed */
  onRemove?: (id: string) => void;
  /** Custom item renderer (uses DSListItem by default) */
  renderItem?: (item: ListPanelItem, isActive: boolean) => React.ReactNode;
  /** Show section dividers for pinned items */
  showPinnedSection?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Max height for scrollable list */
  maxHeight?: number;
  /** Custom empty state */
  emptyText?: string;
  /** Overall style override */
  style?: React.CSSProperties;
}

export function ListPanel({
  title,
  headerIcon,
  headerActions,
  searchPlaceholder = 'Search...',
  items,
  activeId: controlledActiveId,
  onSelect,
  onNew,
  onRemove,
  renderItem,
  showPinnedSection = false,
  footer,
  maxHeight = 260,
  emptyText = 'No items found',
  style,
}: ListPanelProps) {
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const activeId = controlledActiveId ?? internalActiveId;

  const filtered = items.filter(
    item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.subtitle || '').toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = showPinnedSection ? filtered.filter(i => i.pinned) : [];
  const unpinned = showPinnedSection ? filtered.filter(i => !i.pinned) : filtered;

  const handleSelect = (id: string) => {
    setInternalActiveId(id);
    onSelect?.(id);
  };

  const defaultRenderItem = (item: ListPanelItem, isActive: boolean) => (
    <DSListItem
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      meta={item.meta}
      avatar={item.icon}
      badge={item.badge}
      dot={item.dotColor ? <DSDot color={item.dotColor} size={6} pulsing={item.dotPulsing} /> : undefined}
      active={isActive}
      onClick={() => handleSelect(item.id)}
      style={{ borderBottom: '1px solid var(--token-border-subtle, var(--token-border))' }}
    />
  );

  const itemRenderer = renderItem || defaultRenderItem;

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        border: '1px solid var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        background: 'var(--token-bg)',
        ...style,
      }}
    >
      {/* Header — uses DSButton atom */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {headerIcon}
          <span
            style={{
              fontSize: 'var(--token-text-sm)',
              fontWeight: 'var(--token-weight-semibold)',
              color: 'var(--token-text-primary)',
            }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {headerActions}
          {onNew && (
            <DSButton
              variant="icon"
              icon={<Plus size={13} />}
              onClick={onNew}
              style={{ width: 26, height: 26 }}
            />
          )}
        </div>
      </div>

      {/* Search — uses DSSearchBar molecule (which uses DSInput + DSKbd atoms) */}
      <div
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <DSSearchBar
          placeholder={searchPlaceholder}
          value={search}
          onChange={setSearch}
          shortcut=""
          style={{
            maxWidth: '100%',
            borderRadius: 'var(--token-radius-md)',
            background: 'var(--token-bg-secondary)',
            border: 'none',
          }}
        />
      </div>

      {/* List — uses DSListItem molecule (which uses DSAvatar + DSBadge + DSDot atoms) */}
      <div className="flex flex-col" style={{ maxHeight, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div
            className="flex items-center justify-center"
            style={{
              padding: 'var(--token-space-6)',
              color: 'var(--token-text-disabled)',
              fontSize: 'var(--token-text-xs)',
            }}
          >
            {emptyText}
          </div>
        )}

        {/* Pinned section */}
        {pinned.length > 0 && (
          <div>
            <div
              style={{
                padding: 'var(--token-space-2) var(--token-space-4)',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Pinned
            </div>
            {pinned.map(item => itemRenderer(item, item.id === activeId))}
            {unpinned.length > 0 && <DSDivider />}
          </div>
        )}

        {/* Regular items */}
        {showPinnedSection && unpinned.length > 0 && pinned.length > 0 && (
          <div
            style={{
              padding: 'var(--token-space-2) var(--token-space-4)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Recent
          </div>
        )}
        {unpinned.map(item => itemRenderer(item, item.id === activeId))}
      </div>

      {/* Footer */}
      {footer}
    </div>
  );
}
