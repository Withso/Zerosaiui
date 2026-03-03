/* ================================================
   Design System — Base Molecules (Composed from Atoms)
   Original molecules re-exported from molecules.tsx
   ================================================ */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DSButton, DSBadge, DSAvatar, DSInput, DSToggle, DSTag,
  DSProgress, DSSkeleton, DSDivider, DSKbd, DSCodeInline,
  DSSpinner, DSDot, DSCheckbox, DSSlider,
} from './atoms';
import {
  Search, X, Sparkles, Send, Copy, ThumbsUp, ThumbsDown,
  RotateCcw, Share2, ChevronRight, Check, Clock, Paperclip,
  Settings, Bot, User, Plus, ArrowRight, Star, TrendingUp,
  TrendingDown, MessageSquare, Folder, ChevronDown, Info,
  AlertTriangle, Download, Trash2, ChevronLeft, MoreHorizontal,
} from 'lucide-react';

/* ——————————————————————————————————————————————————
   DS Search Bar (Input + Kbd atoms)
   —————————————————————————————————————————————————— */
export interface DSSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  shortcut?: string;
  style?: React.CSSProperties;
}

export function DSSearchBar({ placeholder = 'Search conversations...', value, onChange, shortcut = '⌘K', style: extraStyle }: DSSearchBarProps) {
  const [internal, setInternal] = useState('');
  const val = value !== undefined ? value : internal;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };
  return (
    <div role="search" className="flex items-center" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg)', width: '100%', maxWidth: 320, ...extraStyle }}>
      <Search size={14} aria-hidden="true" style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
      <input type="text" placeholder={placeholder} value={val} onChange={handleChange} aria-label={placeholder} style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)' }} />
      {shortcut && <div className="flex items-center" style={{ gap: 2 }}><DSKbd>{shortcut}</DSKbd></div>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Toolbar (Button atoms)
   —————————————————————————————————————————————————— */
export interface DSToolbarAction { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean; }
export interface DSToolbarProps { actions?: DSToolbarAction[]; style?: React.CSSProperties; }

export function DSToolbar({ actions, style: extraStyle }: DSToolbarProps) {
  const defaultActions: DSToolbarAction[] = [
    { icon: <Copy size={13} />, label: 'Copy' }, { icon: <ThumbsUp size={13} />, label: 'Like' },
    { icon: <ThumbsDown size={13} />, label: 'Dislike' }, { icon: <RotateCcw size={13} />, label: 'Retry' },
    { icon: <Share2 size={13} />, label: 'Share' },
  ];
  const items = actions || defaultActions;
  return (
    <div role="toolbar" aria-label="Actions" className="flex items-center" style={{ gap: 'var(--token-space-1)', padding: 'var(--token-space-1-5)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', ...extraStyle }}>
      {items.map(b => (<DSButton key={b.label} variant="icon" icon={b.icon} title={b.label} onClick={b.onClick} style={{ width: 28, height: 28, border: 'none', borderRadius: 'var(--token-radius-sm)', background: b.active ? 'var(--token-bg-hover)' : 'transparent', color: b.active ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)', padding: 0 }} />))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Form Field (Input + Badge atoms)
   —————————————————————————————————————————————————— */
export interface DSFormFieldProps { label: string; required?: boolean; hint?: string; placeholder?: string; value?: string; onChange?: (value: string) => void; error?: string; style?: React.CSSProperties; }

export function DSFormField({ label, required, hint, placeholder, value, onChange, error, style: extraStyle }: DSFormFieldProps) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', width: '100%', maxWidth: 240, ...extraStyle }}>
      <label className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        <span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-secondary)' }}>{label}</span>
        {required && <span style={{ color: 'var(--token-error)', fontSize: 'var(--token-text-xs)' }}>*</span>}
      </label>
      <DSInput placeholder={placeholder || `Enter ${label.toLowerCase()}...`} value={value} onChange={(e) => onChange?.(e.target.value)} state={error ? 'error' : 'default'} style={{ minWidth: 0 }} />
      {error && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{hint}</span>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Tab Bar
   —————————————————————————————————————————————————— */
export interface DSTabBarProps { tabs: string[]; activeIndex?: number; onTabChange?: (index: number) => void; style?: React.CSSProperties; }

export function DSTabBar({ tabs, activeIndex: controlledIndex, onTabChange, style: extraStyle }: DSTabBarProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const active = controlledIndex !== undefined ? controlledIndex : internalIndex;
  return (
    <div role="tablist" className="flex" style={{ borderBottom: '1px solid var(--token-border)', ...extraStyle }}>
      {tabs.map((t, i) => (
        <button key={t} role="tab" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => { setInternalIndex(i); onTabChange?.(i); }} className="cursor-pointer" style={{ padding: 'var(--token-space-2) var(--token-space-4)', fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', fontWeight: active === i ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)', color: active === i ? 'var(--token-accent)' : 'var(--token-text-tertiary)', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: active === i ? 'var(--token-accent)' : 'transparent', background: 'transparent' }}>{t}</button>
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Header Bar (Avatar + Button atoms)
   —————————————————————————————————————————————————— */
export interface DSHeaderBarProps { title: string; icon?: React.ReactNode; actions?: React.ReactNode; style?: React.CSSProperties; }

export function DSHeaderBar({ title, icon, actions, style: extraStyle }: DSHeaderBarProps) {
  return (
    <div className="flex items-center justify-between" style={{ padding: 'var(--token-space-2-5) var(--token-space-4)', borderBottom: '1px solid var(--token-border)', width: '100%', ...extraStyle }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        {icon || <DSAvatar variant="ai" size={24} />}
        <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{title}</span>
      </div>
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        {actions || (<div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}><DSButton variant="icon" icon={<Settings size={14} />} style={{ width: 28, height: 28, border: 'none', padding: 0 }} /><DSButton variant="icon" icon={<MoreHorizontal size={14} />} style={{ width: 28, height: 28, border: 'none', padding: 0 }} /></div>)}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Step Indicator (Badge + Dot atoms)
   —————————————————————————————————————————————————— */
export interface DSStepIndicatorStep { label: string; status: 'done' | 'active' | 'pending'; onClick?: () => void; }
export interface DSStepIndicatorProps { steps: DSStepIndicatorStep[]; style?: React.CSSProperties; }

export function DSStepIndicator({ steps, style: extraStyle }: DSStepIndicatorProps) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-2)', ...extraStyle }}>
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <div
            className="flex items-center justify-center"
            onClick={s.status === 'done' && s.onClick ? s.onClick : undefined}
            style={{
              width: 22, height: 22, borderRadius: 'var(--token-radius-full)',
              background: s.status === 'done' ? 'var(--token-accent)' : s.status === 'active' ? 'var(--token-accent-light)' : 'var(--token-bg-tertiary)',
              border: s.status === 'active' ? '1.5px solid var(--token-accent)' : 'none',
              cursor: s.status === 'done' && s.onClick ? 'pointer' : 'default',
              /* Pulsing for active step */
              animation: s.status === 'active' ? 'token-pulse 2s ease-in-out infinite' : 'none',
            }}
          >
            {s.status === 'done' ? <Check size={11} style={{ color: 'var(--token-accent-fg)' }} /> : <span style={{ fontSize: 9, fontFamily: 'var(--token-font-mono)', color: s.status === 'active' ? 'var(--token-accent)' : 'var(--token-text-disabled)' }}>{i + 1}</span>}
          </div>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: s.status === 'pending' ? 'var(--token-text-disabled)' : s.status === 'active' ? 'var(--token-accent)' : 'var(--token-text-secondary)', fontFamily: 'var(--token-font-mono)', fontWeight: s.status === 'active' ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)' }}>{s.label}</span>
          {i < steps.length - 1 && <DSDivider style={{ width: 20, flex: 'none' }} />}
        </div>
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Chip Group (Tag atoms)
   —————————————————————————————————————————————————— */
export interface DSChipGroupProps { chips: string[]; selected?: Set<string>; onToggle?: (chip: string) => void; style?: React.CSSProperties; }

export function DSChipGroup({ chips, selected: controlledSelected, onToggle, style: extraStyle }: DSChipGroupProps) {
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set([chips[0]]));
  const sel = controlledSelected || internalSelected;
  const toggle = (c: string) => { if (onToggle) { onToggle(c); } else { setInternalSelected(prev => { const next = new Set(prev); next.has(c) ? next.delete(c) : next.add(c); return next; }); } };
  return (
    <div className="flex flex-wrap" style={{ gap: 'var(--token-space-2)', ...extraStyle }}>
      {chips.map(c => (<DSTag key={c} selected={sel.has(c)} onClick={() => toggle(c)}>{c}</DSTag>))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Empty State
   —————————————————————————————————————————————————— */
export interface DSEmptyStateProps { icon?: React.ReactNode; title?: string; description?: string; action?: React.ReactNode; style?: React.CSSProperties; }

export function DSEmptyState({ icon, title = 'No conversations yet', description = 'Start a new chat to begin', action, style: extraStyle }: DSEmptyStateProps) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-4)', ...extraStyle }}>
      {icon || <MessageSquare size={24} style={{ color: 'var(--token-text-disabled)' }} />}
      <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)' }}>{title}</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{description}</span>
      {action}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Toggle Row (Toggle atom + labels)
   —————————————————————————————————————————————————— */
export interface DSToggleRowProps { label: string; description?: string; defaultOn?: boolean; on?: boolean; onChange?: (value: boolean) => void; style?: React.CSSProperties; }

export function DSToggleRow({ label, description, defaultOn = true, on, onChange, style: extraStyle }: DSToggleRowProps) {
  const [internalOn, setInternalOn] = useState(defaultOn);
  const isOn = on !== undefined ? on : internalOn;
  return (
    <div className="flex items-center justify-between" style={{ width: '100%', maxWidth: 280, padding: 'var(--token-space-2-5) 0', ...extraStyle }}>
      <div className="flex flex-col" style={{ gap: 1 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{label}</span>
        {description && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{description}</span>}
      </div>
      <DSToggle on={isOn} onChange={(v) => { setInternalOn(v); onChange?.(v); }} />
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Breadcrumb
   —————————————————————————————————————————————————— */
export interface DSBreadcrumbProps { items: string[]; onNavigate?: (index: number) => void; style?: React.CSSProperties; }

export function DSBreadcrumb({ items, onNavigate, style: extraStyle }: DSBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center" style={{ gap: 'var(--token-space-1-5)', ...extraStyle }}>
      {items.map((item, i) => (
        <div key={item} className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
          <span aria-current={i === items.length - 1 ? 'page' : undefined} onClick={() => i < items.length - 1 && onNavigate?.(i)} style={{ fontSize: 'var(--token-text-xs)', color: i === items.length - 1 ? 'var(--token-text-primary)' : 'var(--token-accent)', fontFamily: 'var(--token-font-sans)', cursor: i < items.length - 1 ? 'pointer' : 'default' }}>{item}</span>
          {i < items.length - 1 && <ChevronRight size={10} style={{ color: 'var(--token-text-disabled)' }} />}
        </div>
      ))}
    </nav>
  );
}

/* ——————————————————————————————————————————————————
   DS Stat Display
   —————————————————————————————————————————————————— */
export interface DSStatDisplayProps { label: string; value: string | number; change?: { value: string; positive: boolean }; icon?: React.ReactNode; style?: React.CSSProperties; }

export function DSStatDisplay({ label, value, change, icon, style: extraStyle }: DSStatDisplayProps) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-1)', ...extraStyle }}>
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>{label}</span>
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        {icon}
        <span style={{ fontSize: 'var(--token-text-lg)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-mono)' }}>{value}</span>
        {change && <DSBadge variant={change.positive ? 'success' : 'error'}>{change.positive ? '+' : ''}{change.value}</DSBadge>}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS List Item (Avatar + Badge + Dot atoms)
   —————————————————————————————————————————————————— */
export interface DSListItemProps { title: string; subtitle?: string; meta?: string; avatar?: React.ReactNode; badge?: React.ReactNode; dot?: React.ReactNode; active?: boolean; onClick?: () => void; style?: React.CSSProperties; }

export function DSListItem({ title, subtitle, meta, avatar, badge, dot, active, onClick, style: extraStyle }: DSListItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex items-start cursor-pointer" onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ gap: 'var(--token-space-3)', padding: 'var(--token-space-3) var(--token-space-4)', background: active ? 'var(--token-bg-hover)' : hovered ? 'var(--token-bg-hover)' : 'var(--token-bg)', borderLeft: active ? '2px solid var(--token-accent)' : '2px solid transparent', transition: 'all var(--token-duration-fast)', ...extraStyle }}>
      {avatar}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between" style={{ gap: 'var(--token-space-2)' }}>
          <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          <div className="flex items-center shrink-0" style={{ gap: 'var(--token-space-2)' }}>{dot}{meta && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{meta}</span>}</div>
        </div>
        {subtitle && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{subtitle}</span>}
      </div>
      {badge}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Dropdown Menu
   —————————————————————————————————————————————————— */
export interface DSDropdownMenuItem { icon?: React.ReactNode; label: string; shortcut?: string; destructive?: boolean; onClick?: () => void; dividerAfter?: boolean; }
export interface DSDropdownMenuProps { items: DSDropdownMenuItem[]; style?: React.CSSProperties; }

export function DSDropdownMenu({ items, style: extraStyle }: DSDropdownMenuProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* — Focus first item on mount — */
  useEffect(() => {
    itemRefs.current[0]?.focus();
  }, []);

  /* — Keep DOM focus in sync with focusedIndex — */
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, items.length]);

  /* — Keyboard navigation (WCAG menu pattern) — */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      }
      case 'Home': {
        e.preventDefault();
        setFocusedIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        items[focusedIndex]?.onClick?.();
        break;
      }
      default: break;
    }
  }, [items, focusedIndex]);

  return (
    <div ref={menuRef} role="menu" aria-label="Actions menu" onKeyDown={handleKeyDown} style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-md)', minWidth: 160, overflow: 'hidden', ...extraStyle }}>
      {items.map((item, i) => (<div key={item.label}><DropdownMenuItemInner ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el; }} item={item} isFocused={i === focusedIndex} onMouseEnter={() => setFocusedIndex(i)} />{item.dividerAfter && <DSDivider />}</div>))}
    </div>
  );
}

const DropdownMenuItemInner = React.forwardRef<HTMLDivElement, { item: DSDropdownMenuItem; isFocused: boolean; onMouseEnter: () => void }>(
  ({ item, isFocused, onMouseEnter }, ref) => {
    return (
      <div ref={ref} role="menuitem" tabIndex={isFocused ? 0 : -1} className="flex items-center cursor-pointer" onClick={item.onClick} onMouseEnter={onMouseEnter}
        style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', fontSize: 'var(--token-text-sm)', color: item.destructive ? 'var(--token-error)' : 'var(--token-text-secondary)', background: isFocused ? (item.destructive ? 'var(--token-error-light)' : 'var(--token-bg-hover)') : 'transparent', transition: 'background var(--token-duration-fast)', outline: 'none' }}>
        {item.icon && <span style={{ color: item.destructive ? 'var(--token-error)' : 'var(--token-text-tertiary)' }}>{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{item.shortcut}</span>}
      </div>
    );
  }
);

/* ——————————————————————————————————————————————————
   DS Modal
   —————————————————————————————————————————————————— */
export interface DSModalProps { title: string; children: React.ReactNode; onClose?: () => void; actions?: React.ReactNode; style?: React.CSSProperties; }

export function DSModal({ title, children, onClose, actions, style: extraStyle }: DSModalProps) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', width: '100%', maxWidth: 300, overflow: 'hidden', ...extraStyle }}>
      <div className="flex items-center justify-between" style={{ padding: 'var(--token-space-3) var(--token-space-4)', borderBottom: '1px solid var(--token-border)' }}>
        <span id="modal-title" style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{title}</span>
        <X size={14} onClick={onClose} role="button" aria-label="Close dialog" tabIndex={0} style={{ color: 'var(--token-text-tertiary)', cursor: 'pointer' }} />
      </div>
      <div style={{ padding: 'var(--token-space-4)' }}>{children}</div>
      {actions && <div className="flex justify-end" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-3) var(--token-space-4)', borderTop: '1px solid var(--token-border)' }}>{actions}</div>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Popover
   —————————————————————————————————————————————————— */
export interface DSPopoverProps { title?: string; icon?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties; }

export function DSPopover({ title, icon, children, style: extraStyle }: DSPopoverProps) {
  return (
    <div role="tooltip" style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-md)', padding: 'var(--token-space-3)', maxWidth: 220, ...extraStyle }}>
      {title && <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-2)' }}>{icon || <Info size={13} style={{ color: 'var(--token-accent)' }} />}<span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{title}</span></div>}
      {children}
    </div>
  );
}