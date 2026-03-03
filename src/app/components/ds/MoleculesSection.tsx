/* ================================================
   Molecules — Gallery grid matching homepage layout
   Preview cell (interactive) + Title bar (navigates)

   All molecule components are imported from molecules.tsx
   which in turn imports and composes atoms from atoms.tsx.
   Change an atom -> molecules update -> components update.
   ================================================ */
import {
  Search, X, Sparkles, Send, Copy, ThumbsUp, ThumbsDown,
  RotateCcw, Share2, ChevronRight, Check, Clock, Paperclip,
  Settings, Bot, User, Plus, ArrowRight, Star, TrendingUp,
  TrendingDown, MessageSquare, Folder, ChevronDown, Info,
  AlertTriangle, Download, Trash2, ChevronLeft, Type, Upload,
  File, Users, Home, Inbox, MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import React from 'react';

/* --- Import shared atom & molecule primitives --- */
import { DSAvatar, DSButton, DSBadge, DSToggle, DSDivider, DSKbd, DSInput } from './atoms';
import {
  DSSearchBar, DSToolbar, DSFormField, DSTabBar, DSHeaderBar,
  DSStepIndicator, DSChipGroup, DSEmptyState, DSToggleRow,
  DSBreadcrumb, DSDropdownMenu, DSModal, DSPopover, DSListItem,
  DSStatDisplay,
  DSChatInput, DSMessageBubble, DSTypingIndicator, DSTokenCounter,
  DSModelSelector, DSPromptCard, DSCopyBlock, DSNotificationBanner,
  DSFilterBar, DSSliderGroup,
  DSBottomSheet, DSActionSheet, DSBottomNav, DSSwipeableRow, DSFab,
} from './molecules';

/* --- Molecule Preview Components (now composed from atoms/molecules) --- */

function SearchBarMolecule() { return <DSSearchBar />; }
function ToolbarPreview() { return <DSToolbar />; }
function FormFieldPreview() { return <DSFormField label="Model Name" required placeholder="e.g. gpt-4o" hint="The identifier for your AI model" />; }
function TabBarPreview() { return <DSTabBar tabs={['Chat', 'History', 'Settings']} />; }
function HeaderBarPreview() { return <DSHeaderBar title="New Chat" style={{ maxWidth: 360 }} />; }

function StepIndicatorPreview() {
  return <DSStepIndicator steps={[
    { label: 'Input', status: 'done' },
    { label: 'Processing', status: 'active' },
    { label: 'Output', status: 'pending' },
  ]} />;
}

function ChipGroupPreview() { return <DSChipGroup chips={['GPT-4o', 'Claude', 'Gemini', 'Llama']} />; }
function EmptyStatePreview() { return <DSEmptyState />; }
function ToggleRowPreview() { return <DSToggleRow label="Stream responses" description="Show tokens as they generate" />; }
function BreadcrumbPreview() { return <DSBreadcrumb items={['Projects', 'AI Chat', 'Settings']} />; }

function DropdownMenuPreview() {
  return <DSDropdownMenu items={[
    { icon: <Copy size={12} />, label: 'Copy', shortcut: '\u2318C' },
    { icon: <Download size={12} />, label: 'Export', shortcut: '\u2318E' },
    { icon: <Share2 size={12} />, label: 'Share', shortcut: '\u2318S', dividerAfter: true },
    { icon: <Trash2 size={12} />, label: 'Delete', destructive: true },
  ]} />;
}

function ModalPreview() {
  return (
    <DSModal title="Confirm Action" actions={<div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}><DSButton variant="outline">Cancel</DSButton><DSButton variant="destructive">Delete</DSButton></div>}>
      <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)' }}>Are you sure you want to delete this conversation?</span>
    </DSModal>
  );
}

function PopoverPreview() {
  return (
    <DSPopover title="Model Info">
      <p style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-secondary)', margin: 0, lineHeight: 1.5 }}>GPT-4o is a multimodal model with 128k context window and vision capabilities.</p>
    </DSPopover>
  );
}

function AvatarGroupPreview() {
  const avatars = [
    { bg: 'var(--token-accent)', icon: <Sparkles size={11} style={{ color: 'var(--token-accent-fg)' }} />, label: 'AI Assistant' },
    { bg: 'var(--token-secondary)', icon: <User size={11} style={{ color: 'var(--token-text-inverse)' }} />, label: 'User' },
    { bg: 'var(--token-tertiary)', icon: <Bot size={11} style={{ color: 'var(--token-text-inverse)' }} />, label: 'Bot' },
  ];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <div className="flex items-center">
      {avatars.map((a, i) => (
        <div key={i} style={{ position: 'relative', zIndex: hoveredIdx === i ? 10 : avatars.length - i, marginLeft: i > 0 ? -8 : 0 }} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
          <div className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 'var(--token-radius-full)', background: a.bg, border: '2px solid var(--token-bg)', transform: hoveredIdx === i ? 'scale(1.2)' : 'none', transition: 'transform var(--token-duration-fast)' }}>{a.icon}</div>
          {hoveredIdx === i && (<div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 4, pointerEvents: 'none', zIndex: 20 }}><div style={{ padding: '2px 8px', borderRadius: 'var(--token-radius-md)', background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap' }}>{a.label}</div></div>)}
        </div>
      ))}
      <span style={{ marginLeft: 'var(--token-space-2)', fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>+2 more</span>
    </div>
  );
}

function AccordionPreview() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden', width: '100%', maxWidth: 280 }}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full cursor-pointer" style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', border: 'none', background: 'var(--token-bg)' }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>Model Parameters</span>
        <ChevronDown size={14} style={{ color: 'var(--token-text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--token-duration-fast)' }} />
      </button>
      {open && (<div style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', borderTop: '1px solid var(--token-border)' }}><p style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', margin: 0 }}>Temperature, top_p, max_tokens, and other generation parameters.</p></div>)}
    </div>
  );
}

function PaginationPreview() {
  const [activePage, setActivePage] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState<number | null>(null);
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
      <button onClick={() => setActivePage(Math.max(1, activePage - 1))} onMouseEnter={() => setHoveredBtn(-1)} onMouseLeave={() => setHoveredBtn(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)', background: hoveredBtn === -1 ? 'var(--token-bg-hover)' : 'var(--token-bg)', color: activePage === 1 ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)', cursor: 'pointer', transition: 'all var(--token-duration-fast)' }}><ChevronLeft size={14} /></button>
      {[1, 2, 3].map(n => (<button key={n} onClick={() => setActivePage(n)} onMouseEnter={() => setHoveredBtn(n)} onMouseLeave={() => setHoveredBtn(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: activePage === n ? 'none' : '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)', background: activePage === n ? 'var(--token-accent)' : hoveredBtn === n ? 'var(--token-bg-hover)' : 'var(--token-bg)', color: activePage === n ? 'var(--token-accent-fg)' : 'var(--token-text-secondary)', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', cursor: 'pointer', transition: 'all var(--token-duration-fast)' }}>{n}</button>))}
      <button onClick={() => setActivePage(Math.min(3, activePage + 1))} onMouseEnter={() => setHoveredBtn(4)} onMouseLeave={() => setHoveredBtn(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)', background: hoveredBtn === 4 ? 'var(--token-bg-hover)' : 'var(--token-bg)', color: activePage === 3 ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)', cursor: 'pointer', transition: 'all var(--token-duration-fast)' }}><ChevronRight size={14} /></button>
    </div>
  );
}

function ContextMenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex items-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', cursor: 'pointer', fontSize: 'var(--token-text-sm)', color: hovered ? 'var(--token-text-primary)' : 'var(--token-text-secondary)', background: hovered ? 'var(--token-bg-hover)' : 'transparent', transition: 'all var(--token-duration-fast)' }}>
      <span style={{ color: hovered ? 'var(--token-accent)' : 'var(--token-text-tertiary)', transition: 'color var(--token-duration-fast)' }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ContextMenuPreview() {
  return (
    <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-md)', minWidth: 160, overflow: 'hidden' }}>
      <ContextMenuItem icon={<Copy size={12} />} label="Copy message" />
      <ContextMenuItem icon={<RotateCcw size={12} />} label="Regenerate" />
      <ContextMenuItem icon={<Star size={12} />} label="Save to favorites" />
    </div>
  );
}

function FileDropZonePreview() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onDragOver={(e) => { e.preventDefault(); setHovered(true); }} onDragLeave={() => setHovered(false)} style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-4)', border: hovered ? '2px dashed var(--token-accent)' : '2px dashed var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: hovered ? 'var(--token-accent-light)' : 'var(--token-bg)', width: '100%', maxWidth: 240, minHeight: 80, cursor: 'pointer', transition: 'all var(--token-duration-fast)' }}>
      <Upload size={20} style={{ color: hovered ? 'var(--token-accent)' : 'var(--token-text-disabled)', transition: 'color var(--token-duration-fast)' }} />
      <span style={{ fontSize: 'var(--token-text-xs)', color: hovered ? 'var(--token-accent)' : 'var(--token-text-secondary)', transition: 'color var(--token-duration-fast)' }}>{hovered ? 'Release to upload' : 'Drop files here'}</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>PDF, TXT, CSV up to 10MB</span>
    </div>
  );
}

function ListItemPreview({ label, meta, active: defaultActive = false }: { label: string; meta: string; active?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(defaultActive);
  return (
    <div className="flex items-center" onClick={() => setActive(!active)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gap: 'var(--token-space-3)', padding: 'var(--token-space-2) var(--token-space-3)', borderRadius: 'var(--token-radius-md)', cursor: 'pointer', width: '100%', maxWidth: 300, background: active ? 'var(--token-bg-hover)' : hovered ? 'var(--token-bg-hover)' : 'transparent', transition: 'all var(--token-duration-fast)' }}>
      <MessageSquare size={14} style={{ color: active ? 'var(--token-accent)' : 'var(--token-text-tertiary)', flexShrink: 0, transition: 'color var(--token-duration-fast)' }} />
      <span className="flex-1 truncate" style={{ fontSize: 'var(--token-text-sm)', color: active ? 'var(--token-text-primary)' : 'var(--token-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', flexShrink: 0 }}>{meta}</span>
      <ChevronRight size={12} style={{ color: hovered ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', flexShrink: 0, transition: 'color var(--token-duration-fast)' }} />
    </div>
  );
}

function NavItemPreview({ icon, label, badge, defaultActive = false }: { icon: React.ReactNode; label: string; badge?: number; defaultActive?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(defaultActive);
  return (
    <div className="flex items-center" onClick={() => setActive(!active)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gap: 10, padding: '8px 12px', borderRadius: 'var(--token-radius-md)', width: '100%', maxWidth: 200, background: active ? 'var(--token-accent-muted)' : hovered ? 'var(--token-bg-hover)' : 'transparent', cursor: 'pointer', transition: 'all var(--token-duration-fast)' }}>
      <span style={{ color: active ? 'var(--token-accent)' : 'var(--token-text-tertiary)', display: 'flex', transition: 'color var(--token-duration-fast)' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: active ? 'var(--token-accent)' : hovered ? 'var(--token-text-primary)' : 'var(--token-text-secondary)', transition: 'color var(--token-duration-fast)' }}>{label}</span>
      {badge !== undefined && active && (<span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--token-radius-full)', fontSize: 9, fontFamily: 'var(--token-font-mono)', fontWeight: 500, background: 'var(--token-accent)', color: 'var(--token-accent-fg)' }}>{badge}</span>)}
    </div>
  );
}

function CardPreview({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ padding: 14, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', minWidth: 130, background: hovered ? 'var(--token-bg-hover)' : 'var(--token-bg)', boxShadow: hovered ? 'var(--token-shadow-md)' : 'none', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'all var(--token-duration-fast)', cursor: 'pointer' }}>
      <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
        <span style={{ color: hovered ? 'var(--token-accent)' : 'var(--token-text-tertiary)', transition: 'color var(--token-duration-fast)' }}>{icon}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <span style={{ fontSize: 'var(--token-text-xl)', fontWeight: 600, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)' }}>{value}</span>
    </div>
  );
}

function ToastPreview({ icon, iconColor, borderColor, title, time }: { icon: React.ReactNode; iconColor: string; borderColor: string; title: string; time: string }) {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  if (!visible) return (<DSButton variant="ghost" onClick={() => setVisible(true)} style={{ fontSize: 'var(--token-text-xs)' }}>Show toast again</DSButton>);
  return (
    <div className="flex items-start" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gap: 10, padding: '12px 14px', border: '1px solid var(--token-border)', borderLeft: `3px solid ${borderColor}`, borderRadius: 'var(--token-radius-md)', width: '100%', maxWidth: 280, boxShadow: hovered ? 'var(--token-shadow-md)' : 'none', transition: 'box-shadow var(--token-duration-fast)' }}>
      <span style={{ color: iconColor, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div className="flex flex-col flex-1" style={{ gap: 2 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{title}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{time}</span>
      </div>
      <X size={12} onClick={() => setVisible(false)} style={{ color: hovered ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', cursor: 'pointer', transition: 'color var(--token-duration-fast)' }} />
    </div>
  );
}

function AlertPreview({ variant }: { variant: 'warning' | 'error' | 'info' }) {
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const config = {
    warning: { icon: <AlertTriangle size={14} />, color: 'var(--token-warning)', bg: 'var(--token-warning-light)', title: 'Warning', msg: 'API rate limit approaching.' },
    error: { icon: <X size={14} />, color: 'var(--token-error)', bg: 'var(--token-error-light)', title: 'Error', msg: 'Request failed. Please retry.' },
    info: { icon: <Info size={14} />, color: 'var(--token-accent)', bg: 'var(--token-accent-light)', title: 'Info', msg: 'New model version available.' },
  };
  const c = config[variant];
  if (dismissed) return (<DSButton variant="ghost" onClick={() => setDismissed(false)} style={{ fontSize: 'var(--token-text-xs)' }}>Show alert again</DSButton>);
  return (
    <div className="flex items-start" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gap: 10, padding: '12px 14px', border: `1px solid ${c.color}`, borderRadius: 'var(--token-radius-md)', background: c.bg, width: '100%', maxWidth: 280, transition: 'box-shadow var(--token-duration-fast)', boxShadow: hovered ? 'var(--token-shadow-sm)' : 'none' }}>
      <span style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
      <div className="flex flex-col flex-1" style={{ gap: 2 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 500, color: 'var(--token-text-primary)' }}>{c.title}</span>
        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>{c.msg}</span>
      </div>
      <X size={12} onClick={() => setDismissed(true)} style={{ color: hovered ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', cursor: 'pointer', flexShrink: 0, marginTop: 1, transition: 'color var(--token-duration-fast)' }} />
    </div>
  );
}

function MessageBubblePreview({ variant }: { variant: 'user' | 'ai' }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = variant === 'user' ? 'How does attention work?' : 'Attention computes weighted relationships between all positions in a sequence...';
  const handleCopy = () => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  if (variant === 'user') {
    return (
      <div className="flex" style={{ gap: 'var(--token-space-3)', justifyContent: 'flex-end', width: '100%', maxWidth: 340 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {hovered && (<span onClick={handleCopy} style={{ alignSelf: 'center', cursor: 'pointer', color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)', transition: 'color var(--token-duration-fast)' }}>{copied ? <Check size={12} /> : <Copy size={12} />}</span>)}
        <div style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', borderRadius: 'var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-sm) var(--token-radius-lg)', background: 'var(--token-user-bubble)', color: 'var(--token-user-bubble-text)', fontSize: 'var(--token-text-sm)', maxWidth: '80%' }}>{text}</div>
      </div>
    );
  }
  return (
    <div className="flex" style={{ gap: 'var(--token-space-3)', width: '100%', maxWidth: 340 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 'var(--token-radius-full)', background: 'var(--token-ai-avatar-bg)' }}><Sparkles size={13} style={{ color: 'var(--token-ai-avatar-fg)' }} /></div>
      <div style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', borderRadius: 'var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-sm)', background: 'var(--token-bg-secondary)', color: 'var(--token-text-primary)', fontSize: 'var(--token-text-sm)', maxWidth: '80%', border: '1px solid var(--token-border)', position: 'relative' }}>
        {text}
        {hovered && (<span onClick={handleCopy} style={{ position: 'absolute', top: 6, right: 6, cursor: 'pointer', color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)', transition: 'color var(--token-duration-fast)' }}>{copied ? <Check size={10} /> : <Copy size={10} />}</span>)}
      </div>
    </div>
  );
}

/* --- Molecule variant type --- */
interface MoleculeVariant { label: string; render: (state?: string) => React.ReactNode; }
interface MoleculeState { id: string; label: string; }
interface MoleculeEntry { id: string; title: string; variants: MoleculeVariant[]; states: MoleculeState[]; }

export const moleculeEntries: MoleculeEntry[] = [
  { id: 'search-bar', title: 'Search Bar', variants: [{ label: 'Default', render: () => <SearchBarMolecule /> }], states: [{ id: 'default', label: 'Default' }, { id: 'focus', label: 'Focus' }, { id: 'filled', label: 'Filled' }, { id: 'disabled', label: 'Disabled' }] },
  { id: 'list-item', title: 'List Item', variants: [{ label: 'Active', render: () => <ListItemPreview label="Explain transformers" meta="2m ago" active /> }, { label: 'Default', render: () => <ListItemPreview label="Debug Python code" meta="1h ago" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }, { id: 'active', label: 'Active' }, { id: 'disabled', label: 'Disabled' }] },
  { id: 'message-bubble', title: 'Message Bubble', variants: [{ label: 'User', render: () => <MessageBubblePreview variant="user" /> }, { label: 'AI', render: () => <MessageBubblePreview variant="ai" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'error', label: 'Error' }] },
  { id: 'toolbar', title: 'Toolbar', variants: [{ label: 'Default', render: () => <ToolbarPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }, { id: 'active', label: 'Active' }] },
  { id: 'stat-display', title: 'Stat Display', variants: [
    { label: 'Tokens', render: () => (<div className="flex flex-col" style={{ gap: 'var(--token-space-1)', padding: 'var(--token-space-3)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', minWidth: 120 }}><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>Tokens</span><div className="flex items-end" style={{ gap: 'var(--token-space-2)' }}><span style={{ fontSize: 'var(--token-text-2xl)', fontWeight: 'var(--token-weight-semibold)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)', lineHeight: 1 }}>24.5k</span><span className="flex items-center" style={{ gap: 2, fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-success)', paddingBottom: 2 }}><TrendingUp size={10} /> +12%</span></div></div>) },
    { label: 'Latency', render: () => (<div className="flex flex-col" style={{ gap: 'var(--token-space-1)', padding: 'var(--token-space-3)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', minWidth: 120 }}><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>Latency</span><div className="flex items-end" style={{ gap: 'var(--token-space-2)' }}><span style={{ fontSize: 'var(--token-text-2xl)', fontWeight: 'var(--token-weight-semibold)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)', lineHeight: 1 }}>340ms</span><span className="flex items-center" style={{ gap: 2, fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-error)', paddingBottom: 2 }}><TrendingDown size={10} /> -8%</span></div></div>) },
  ], states: [{ id: 'default', label: 'Default' }, { id: 'loading', label: 'Loading' }] },
  { id: 'form-field', title: 'Form Field', variants: [{ label: 'Default', render: () => <FormFieldPreview /> }, { label: 'Error', render: () => (<div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', width: '100%', maxWidth: 240 }}><label className="flex items-center" style={{ gap: 'var(--token-space-1)' }}><span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-secondary)' }}>Model Name</span><span style={{ color: 'var(--token-error)', fontSize: 'var(--token-text-xs)' }}>*</span></label><input type="text" placeholder="e.g. gpt-4o" style={{ width: '100%', padding: 'var(--token-space-2) var(--token-space-3)', border: '1px solid var(--token-error)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)', outline: 'none' }} /><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)' }}>This field is required</span></div>) }], states: [{ id: 'default', label: 'Default' }, { id: 'focus', label: 'Focus' }, { id: 'error', label: 'Error' }, { id: 'disabled', label: 'Disabled' }] },
  { id: 'tab-bar', title: 'Tab Bar', variants: [{ label: 'Default', render: () => <TabBarPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'header-bar', title: 'Header Bar', variants: [{ label: 'Default', render: () => <HeaderBarPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'step-indicator', title: 'Step Indicator', variants: [{ label: 'Step 1', render: () => <StepIndicatorPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'chip-group', title: 'Chip Group', variants: [{ label: 'Default', render: () => <ChipGroupPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'empty-state', title: 'Empty State', variants: [{ label: 'Default', render: () => <EmptyStatePreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'toggle-row', title: 'Toggle Row', variants: [{ label: 'Default', render: () => <ToggleRowPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'breadcrumb', title: 'Breadcrumb', variants: [{ label: 'Default', render: () => <BreadcrumbPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'dropdown-menu', title: 'Dropdown Menu', variants: [{ label: 'Default', render: () => <DropdownMenuPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'toast', title: 'Toast', variants: [{ label: 'Success', render: () => <ToastPreview icon={<Check size={14}/>} iconColor="var(--token-success)" borderColor="var(--token-success)" title="Message sent" time="Just now" /> }, { label: 'Warning', render: () => <ToastPreview icon={<AlertTriangle size={14}/>} iconColor="var(--token-warning)" borderColor="var(--token-warning)" title="Rate limit warning" time="2s ago" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'modal', title: 'Modal', variants: [{ label: 'Default', render: () => <ModalPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'card', title: 'Card', variants: [{ label: 'Tokens', render: () => <CardPreview icon={<Sparkles size={14}/>} label="Tokens" value="24.5k" /> }, { label: 'Latency', render: () => <CardPreview icon={<TrendingDown size={14}/>} label="Latency" value="340ms" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'alert', title: 'Alert', variants: [{ label: 'Warning', render: () => <AlertPreview variant="warning" /> }, { label: 'Error', render: () => <AlertPreview variant="error" /> }, { label: 'Info', render: () => <AlertPreview variant="info" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'popover', title: 'Popover', variants: [{ label: 'Default', render: () => <PopoverPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'avatar-group', title: 'Avatar Group', variants: [{ label: 'Default', render: () => <AvatarGroupPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'accordion', title: 'Accordion', variants: [{ label: 'Expanded', render: () => <AccordionPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'expanded', label: 'Expanded' }] },
  { id: 'pagination', title: 'Pagination', variants: [{ label: 'Default', render: () => <PaginationPreview /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'context-menu', title: 'Context Menu', variants: [{ label: 'Default', render: () => <ContextMenuPreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'nav-item', title: 'Nav Item', variants: [{ label: 'Chat', render: () => <NavItemPreview icon={<MessageSquare size={14}/>} label="Chat" badge={3} defaultActive /> }, { label: 'History', render: () => <NavItemPreview icon={<Inbox size={14}/>} label="History" /> }, { label: 'Settings', render: () => <NavItemPreview icon={<Settings size={14}/>} label="Settings" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'file-drop-zone', title: 'File Drop Zone', variants: [{ label: 'Default', render: () => <FileDropZonePreview /> }], states: [{ id: 'default', label: 'Default' }, { id: 'dragging', label: 'Dragging' }] },
  /* === NEW AI MOLECULES === */
  { id: 'chat-input', title: 'Chat Input', variants: [
    { label: 'Default', render: () => <DSChatInput /> },
    { label: 'Streaming', render: () => <DSChatInput isStreaming onStop={() => {}} /> },
    { label: 'Attachments', render: () => <DSChatInput attachments={[{ name: 'data.csv', type: 'text/csv' }, { name: 'notes.pdf', type: 'application/pdf' }]} /> },
  ], states: [{ id: 'default', label: 'Default' }, { id: 'focus', label: 'Focus' }] },
  { id: 'typing-indicator', title: 'Typing Indicator', variants: [{ label: 'Default', render: () => <DSTypingIndicator /> }, { label: 'Custom', render: () => <DSTypingIndicator label="Generating code" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'token-counter', title: 'Token Counter', variants: [{ label: 'Low', render: () => <DSTokenCounter used={1200} total={4096} /> }, { label: 'Medium', render: () => <DSTokenCounter used={3200} total={4096} /> }, { label: 'High', render: () => <DSTokenCounter used={3900} total={4096} /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'model-selector', title: 'Model Selector', variants: [{ label: 'Default', render: () => <DSModelSelector /> }], states: [{ id: 'default', label: 'Default' }, { id: 'open', label: 'Open' }] },
  { id: 'prompt-card', title: 'Prompt Card', variants: [{ label: 'Default', render: () => <DSPromptCard title="Explain code" description="Break down complex code into simple steps" /> }, { label: 'Creative', render: () => <DSPromptCard title="Write a story" description="Generate creative fiction" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
  { id: 'copy-block', title: 'Copy Block', variants: [{ label: 'TypeScript', render: () => <DSCopyBlock code={'const model = new AI({\n  temperature: 0.7,\n  maxTokens: 2048,\n});'} /> }, { label: 'Python', render: () => <DSCopyBlock code={'model = AI(\n  temperature=0.7,\n  max_tokens=2048\n)'} language="python" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'notification-banner', title: 'Notification Banner', variants: [{ label: 'Info', render: () => <DSNotificationBanner variant="info" title="New feature" description="Try the new streaming mode" /> }, { label: 'Warning', render: () => <DSNotificationBanner variant="warning" title="Rate limit" description="Approaching API limit" /> }, { label: 'Error', render: () => <DSNotificationBanner variant="error" title="Connection lost" description="Reconnecting..." /> }, { label: 'Success', render: () => <DSNotificationBanner variant="success" title="Deployed" description="Model is live" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'filter-bar', title: 'Filter Bar', variants: [{ label: 'Default', render: () => <DSFilterBar filters={['All', 'Code', 'Text', 'Images', 'Audio']} /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'slider-group', title: 'Slider Group', variants: [{ label: 'Default', render: () => <DSSliderGroup /> }], states: [{ id: 'default', label: 'Default' }] },
  /* === MOBILE MOLECULES === */
  { id: 'bottom-sheet', title: 'Bottom Sheet', variants: [{ label: 'Default', render: () => <DSBottomSheet title="Options"><span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)' }}>Sheet content goes here</span></DSBottomSheet> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'action-sheet', title: 'Action Sheet', variants: [{ label: 'Default', render: () => <DSActionSheet title="Message actions" actions={[{ label: 'Copy', icon: <Copy size={14} /> }, { label: 'Share', icon: <Share2 size={14} /> }, { label: 'Delete', icon: <Trash2 size={14} />, destructive: true }]} /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'bottom-nav', title: 'Bottom Nav', variants: [{ label: 'Default', render: () => <DSBottomNav /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'swipeable-row', title: 'Swipeable Row', variants: [{ label: 'Default', render: () => <DSSwipeableRow title="AI Chat Session" subtitle="Last message 2m ago" meta="2:34 PM" /> }], states: [{ id: 'default', label: 'Default' }] },
  { id: 'fab', title: 'FAB', variants: [{ label: 'Icon Only', render: () => <DSFab /> }, { label: 'With Label', render: () => <DSFab label="New Chat" /> }], states: [{ id: 'default', label: 'Default' }, { id: 'hover', label: 'Hover' }] },
];

/* --- Gallery cell with variant tabs + state micro-pills --- */
function MoleculeGalleryCell({ entry }: { entry: MoleculeEntry }) {
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeState, setActiveState] = useState(0);
  const hasVariants = entry.variants.length > 1;
  const hasStates = entry.states.length > 1;
  const currentStateId = entry.states[activeState]?.id || 'default';
  const currentState = currentStateId === 'default' ? undefined : currentStateId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc((100vh - 56px) / 3)', background: 'var(--token-bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ padding: 'var(--token-space-4)', cursor: 'default' }}>
        <div style={{ pointerEvents: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>{entry.variants[activeVariant].render(currentState)}</div>
      </div>
      {hasStates && (
        <div className="flex flex-wrap shrink-0" style={{ padding: '4px 8px', gap: 3, marginBottom: 6 }}>
          {entry.states.map((st, i) => (<button key={st.id} onClick={() => setActiveState(i)} className="cursor-pointer" style={{ padding: '0px 5px', fontSize: 8, lineHeight: '16px', fontFamily: 'var(--token-font-mono)', letterSpacing: '0.01em', border: 'none', borderRadius: 'var(--token-radius-full)', background: activeState === i ? 'var(--token-bg-tertiary)' : 'transparent', color: activeState === i ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)', opacity: activeState === i ? 1 : 0.6, transition: 'all var(--token-duration-fast)', whiteSpace: 'nowrap' }}>{st.label}</button>))}
        </div>
      )}
      {hasVariants && (
        <div className="flex shrink-0" style={{ borderTop: '1px solid var(--token-border)', overflowX: 'auto', background: 'var(--token-bg)' }}>
          {entry.variants.map((v, i) => (<button key={v.label} onClick={() => setActiveVariant(i)} className="cursor-pointer shrink-0" style={{ padding: 'var(--token-space-1) var(--token-space-2-5)', fontSize: 9, fontFamily: 'var(--token-font-sans)', fontWeight: activeVariant === i ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)', color: activeVariant === i ? 'var(--token-accent)' : 'var(--token-text-tertiary)', border: 'none', background: activeVariant === i ? 'var(--token-accent-light)' : 'transparent', borderTop: activeVariant === i ? '2px solid var(--token-accent)' : '2px solid transparent', transition: 'all var(--token-duration-fast)', whiteSpace: 'nowrap' }}>{v.label}</button>))}
        </div>
      )}
      <Link to={`/design-system/molecule/${entry.id}`} className="flex items-center justify-between shrink-0" style={{ height: 40, padding: '0 var(--token-space-4)', borderTop: '1px solid var(--token-border)', textDecoration: 'none', cursor: 'pointer', background: 'var(--token-bg)', transition: 'background var(--token-duration-fast)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--token-bg)'; }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <span style={{ width: 5, height: 5, borderRadius: 'var(--token-radius-full)', background: 'var(--token-secondary)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-secondary)', fontFamily: 'var(--token-font-sans)' }}>{entry.title}</span>
          {hasVariants && (<span style={{ fontSize: 9, fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)', background: 'var(--token-accent-light)', padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '14px' }}>{entry.variants.length}</span>)}
          {hasStates && (<span style={{ fontSize: 9, fontFamily: 'var(--token-font-mono)', color: 'var(--token-secondary)', background: 'var(--token-secondary-light)', padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '14px' }}>{entry.states.length}s</span>)}
        </div>
        <span style={{ fontSize: 9, color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Molecule</span>
      </Link>
    </div>
  );
}

/* ================================================ */
export function MoleculesSection() {
  const colBreakpoints = [
    { query: '(min-width: 1920px)', cols: 4 },
    { query: '(min-width: 1440px)', cols: 3 },
    { query: '(min-width: 768px)', cols: 2 },
  ];
  const defaultCols = 1;
  const [cols, setCols] = React.useState(defaultCols);
  React.useEffect(() => {
    const update = () => { let matched = defaultCols; for (const bp of colBreakpoints) { if (window.matchMedia(bp.query).matches) { matched = bp.cols; break; } } setCols(matched); };
    update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
  }, []);
  const remainder = moleculeEntries.length % cols;
  const fillerCount = remainder === 0 ? 0 : cols - remainder;
  return (
    <div 
      className="grid" 
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        background: 'var(--token-border)', 
        gap: 1,
        width: '100%',
        minWidth: 0,
      }}
    >
      {moleculeEntries.map((entry) => (<MoleculeGalleryCell key={entry.id} entry={entry} />))}
      {Array.from({ length: fillerCount }).map((_, i) => (<div key={`filler-${i}`} style={{ background: 'var(--token-bg)', minWidth: 0 }} />))}
    </div>
  );
}