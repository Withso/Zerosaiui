/* ================================================
   AI & Mobile Molecules (Composed from Atoms)
   New molecules for AI web + mobile applications.
   ================================================ */
import React, { useState } from 'react';
import {
  DSButton, DSBadge, DSAvatar, DSTag,
  DSProgress, DSSlider,
  DSStreamingDots, DSBottomSheetHandle, DSSwipeAction,
} from './atoms';
import {
  Search, X, Sparkles, Send, Copy, Check,
  Paperclip, Plus, ArrowRight, ChevronRight,
  ChevronDown, Info, AlertTriangle,
  MessageSquare, Home, Settings, MoreHorizontal,
} from 'lucide-react';

/* ——————————————————————————————————————————————————
   DS Chat Input
   —————————————————————————————————————————————————— */
export interface DSChatInputProps { placeholder?: string; onSend?: (text: string) => void; isStreaming?: boolean; onStop?: () => void; attachments?: { name: string; type?: string }[]; onRemoveAttachment?: (index: number) => void; style?: React.CSSProperties; }
export function DSChatInput({ placeholder = 'Message AI...', onSend, isStreaming = false, onStop, attachments, onRemoveAttachment, style: extraStyle }: DSChatInputProps) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const canSend = text.trim().length > 0;
  const handleSend = () => { if (isStreaming) { onStop?.(); return; } if (!canSend) return; onSend?.(text); setText(''); };
  return (
    <div role="form" aria-label="Chat input" style={{ display: 'flex', flexDirection: 'column', gap: 0, border: focused ? '1px solid var(--token-accent)' : '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg)', boxShadow: focused ? '0 0 0 3px var(--token-accent-muted)' : 'none', transition: 'all var(--token-duration-fast)', width: '100%', maxWidth: 400, overflow: 'hidden', ...extraStyle }}>
      {/* — Attachment previews — */}
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-1-5)', padding: 'var(--token-space-2) var(--token-space-3) 0' }}>
          {attachments.map((a, i) => (
            <div key={i} className="flex items-center" style={{ gap: 'var(--token-space-1)', padding: '2px 8px', borderRadius: 'var(--token-radius-sm)', background: 'var(--token-bg-tertiary)', fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-secondary)' }}>
              <Paperclip size={9} />
              <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
              {onRemoveAttachment && <X size={8} style={{ cursor: 'pointer', color: 'var(--token-text-disabled)' }} onClick={() => onRemoveAttachment(i)} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--token-space-2)', padding: 'var(--token-space-3)' }}>
        <DSButton variant="icon" icon={<Paperclip size={14} />} title="Attach file" style={{ width: 28, height: 28, border: 'none', padding: 0, flexShrink: 0 }} />
        <textarea placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} rows={1} aria-label={placeholder} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)', minHeight: 24, maxHeight: 120 }} />
        {/* — Send / Stop toggle — */}
        {isStreaming ? (
          <DSButton variant="destructive" icon={<X size={13} />} onClick={handleSend} title="Stop generating" style={{ width: 28, height: 28, padding: 0, flexShrink: 0, borderRadius: 'var(--token-radius-full)' }} />
        ) : (
          <DSButton variant={canSend ? 'primary' : 'ghost'} icon={<Send size={13} />} onClick={handleSend} disabled={!canSend} title="Send message" style={{ width: 28, height: 28, padding: 0, flexShrink: 0, borderRadius: 'var(--token-radius-full)' }} />
        )}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Message Bubble
   —————————————————————————————————————————————————— */
export interface DSMessageBubbleProps { variant?: 'user' | 'ai'; children: React.ReactNode; timestamp?: string; style?: React.CSSProperties; }
export function DSMessageBubble({ variant = 'ai', children, timestamp, style: extraStyle }: DSMessageBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const textContent = typeof children === 'string' ? children : '';
  const handleCopy = () => { if (textContent) navigator.clipboard?.writeText(textContent); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  if (variant === 'user') {
    return (<div className="flex" style={{ justifyContent: 'flex-end', gap: 'var(--token-space-2)', ...extraStyle }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}><div style={{ maxWidth: '80%' }}><div style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', borderRadius: 'var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-sm) var(--token-radius-lg)', background: 'var(--token-accent)', color: 'var(--token-accent-fg)', fontSize: 'var(--token-text-sm)' }}>{children}</div>{timestamp && <div style={{ textAlign: 'right', fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', marginTop: 2, fontFamily: 'var(--token-font-mono)' }}>{timestamp}</div>}</div></div>);
  }
  return (<div className="flex" style={{ gap: 'var(--token-space-2)', ...extraStyle }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}><DSAvatar variant="ai" size={28} /><div style={{ maxWidth: '80%', position: 'relative' }}><div style={{ padding: 'var(--token-space-2-5) var(--token-space-3)', borderRadius: 'var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-lg) var(--token-radius-sm)', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)', fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{children}{hovered && <span onClick={handleCopy} style={{ position: 'absolute', top: 6, right: 6, cursor: 'pointer', color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)' }}>{copied ? <Check size={10} /> : <Copy size={10} />}</span>}</div>{timestamp && <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', marginTop: 2, fontFamily: 'var(--token-font-mono)' }}>{timestamp}</div>}</div></div>);
}

/* ——————————————————————————————————————————————————
   DS Typing Indicator
   —————————————————————————————————————————————————— */
export interface DSTypingIndicatorProps { label?: string; style?: React.CSSProperties; }
export function DSTypingIndicator({ label = 'AI is thinking', style: extraStyle }: DSTypingIndicatorProps) {
  return (<div role="status" aria-live="polite" aria-label={label} className="flex items-center" style={{ gap: 'var(--token-space-2)', ...extraStyle }}><DSAvatar variant="ai" size={24} /><div className="flex items-center" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)' }}><DSStreamingDots size={5} /><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{label}</span></div></div>);
}

/* ——————————————————————————————————————————————————
   DS Token Counter
   —————————————————————————————————————————————————— */
export interface DSTokenCounterProps { used: number; total: number; label?: string; style?: React.CSSProperties; }
export function DSTokenCounter({ used, total, label = 'Tokens', style: extraStyle }: DSTokenCounterProps) {
  const pct = Math.round((used / total) * 100);
  const v = pct > 90 ? 'error' : pct > 70 ? 'warning' : 'success';
  return (<div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', width: '100%', maxWidth: 200, ...extraStyle }}><div className="flex items-center justify-between"><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>{label}</span><DSBadge variant={v}>{pct}%</DSBadge></div><DSProgress value={pct} style={{ width: '100%' }} /><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{used.toLocaleString()} / {total.toLocaleString()}</span></div>);
}

/* ——————————————————————————————————————————————————
   DS Model Selector
   —————————————————————————————————————————————————— */
export interface DSModelSelectorModel { id: string; name: string; badge?: string; }
export interface DSModelSelectorProps { models?: DSModelSelectorModel[]; value?: string; onChange?: (id: string) => void; style?: React.CSSProperties; }
export function DSModelSelector({ models, value, onChange, style: extraStyle }: DSModelSelectorProps) {
  const defaultModels: DSModelSelectorModel[] = [{ id: 'gpt-4o', name: 'GPT-4o', badge: 'Fast' }, { id: 'claude-3.5', name: 'Claude 3.5', badge: 'Smart' }, { id: 'gemini-pro', name: 'Gemini Pro' }];
  const items = models || defaultModels;
  const [selected, setSelected] = useState(value || items[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const cur = items.find(m => m.id === selected) || items[0];
  return (
    <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-label="Select AI model" style={{ position: 'relative', width: '100%', maxWidth: 220, ...extraStyle }}>
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)} style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', border: isOpen ? '1px solid var(--token-accent)' : '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', transition: 'all var(--token-duration-fast)' }}>
        <DSAvatar variant="ai" size={18} /><span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{cur.name}</span>{cur.badge && <DSBadge variant="ai">{cur.badge}</DSBadge>}<ChevronDown size={12} style={{ color: 'var(--token-text-disabled)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--token-duration-fast)' }} />
      </div>
      {isOpen && <div role="listbox" aria-label="Available models" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', zIndex: 10, overflow: 'hidden' }}>{items.map((m, i) => (<div key={m.id} role="option" aria-selected={m.id === selected} onClick={() => { setSelected(m.id); setIsOpen(false); onChange?.(m.id); }} onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} className="flex items-center cursor-pointer" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)', background: hovIdx === i ? 'var(--token-bg-hover)' : m.id === selected ? 'var(--token-accent-light)' : 'transparent', transition: 'background var(--token-duration-fast)' }}><DSAvatar variant="ai" size={16} /><span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: m.id === selected ? 'var(--token-accent)' : 'var(--token-text-secondary)' }}>{m.name}</span>{m.badge && <DSBadge variant="ai" style={{ fontSize: 8 }}>{m.badge}</DSBadge>}</div>))}</div>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Prompt Card
   —————————————————————————————————————————————————— */
export interface DSPromptCardProps { icon?: React.ReactNode; title: string; description?: string; onClick?: () => void; style?: React.CSSProperties; }
export function DSPromptCard({ icon, title, description, onClick, style: extraStyle }: DSPromptCardProps) {
  const [h, setH] = useState(false);
  return (<div className="flex flex-col cursor-pointer" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-3)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: h ? 'var(--token-bg-hover)' : 'var(--token-bg)', transform: h ? 'translateY(-1px)' : 'none', boxShadow: h ? 'var(--token-shadow-md)' : 'none', transition: 'all var(--token-duration-fast)', width: '100%', maxWidth: 220, ...extraStyle }}><div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>{icon || <Sparkles size={14} style={{ color: 'var(--token-accent)' }} />}<span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{title}</span></div>{description && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>{description}</span>}<ArrowRight size={12} style={{ color: h ? 'var(--token-accent)' : 'var(--token-text-disabled)', transition: 'color var(--token-duration-fast)', alignSelf: 'flex-end' }} /></div>);
}

/* ——————————————————————————————————————————————————
   DS Copy Block
   —————————————————————————————————————————————————— */
export interface DSCopyBlockProps { code: string; language?: string; style?: React.CSSProperties; }
export function DSCopyBlock({ code, language = 'typescript', style: extraStyle }: DSCopyBlockProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (<div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden', width: '100%', maxWidth: 340, ...extraStyle }}><div className="flex items-center justify-between" style={{ padding: 'var(--token-space-1-5) var(--token-space-3)', background: 'var(--token-bg-tertiary)', borderBottom: '1px solid var(--token-border)' }}><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>{language}</span><DSButton variant="ghost" onClick={handleCopy} icon={copied ? <Check size={11} /> : <Copy size={11} />} style={{ padding: '2px 6px', fontSize: 'var(--token-text-2xs)', height: 'auto', gap: 4 }}>{copied ? 'Copied' : 'Copy'}</DSButton></div><pre style={{ padding: 'var(--token-space-3)', background: 'var(--token-bg-secondary)', margin: 0, overflowX: 'auto', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)', lineHeight: 1.6 }}><code>{code}</code></pre></div>);
}

/* ——————————————————————————————————————————————————
   DS Notification Banner
   —————————————————————————————————————————————————— */
export interface DSNotificationBannerProps { variant?: 'info' | 'warning' | 'error' | 'success'; title: string; description?: string; onDismiss?: () => void; style?: React.CSSProperties; }
export function DSNotificationBanner({ variant = 'info', title, description, onDismiss, style: extraStyle }: DSNotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const icons: Record<string, React.ReactNode> = { info: <Info size={14} />, warning: <AlertTriangle size={14} />, error: <X size={14} />, success: <Check size={14} /> };
  const colors: Record<string, { border: string; bg: string; fg: string }> = { info: { border: 'var(--token-accent)', bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' }, warning: { border: 'var(--token-warning)', bg: 'var(--token-warning-light)', fg: 'var(--token-warning)' }, error: { border: 'var(--token-error)', bg: 'var(--token-error-light)', fg: 'var(--token-error)' }, success: { border: 'var(--token-success)', bg: 'var(--token-success-light)', fg: 'var(--token-success)' } };
  const c = colors[variant]; if (dismissed) return null;
  return (<div role="alert" aria-live="assertive" className="flex items-start" style={{ gap: 'var(--token-space-2-5)', padding: 'var(--token-space-3) var(--token-space-4)', borderLeft: `3px solid ${c.border}`, background: c.bg, borderRadius: 'var(--token-radius-md)', width: '100%', maxWidth: 360, ...extraStyle }}><span aria-hidden="true" style={{ color: c.fg, flexShrink: 0, marginTop: 1 }}>{icons[variant]}</span><div className="flex-1" style={{ minWidth: 0 }}><span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)', display: 'block' }}>{title}</span>{description && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', display: 'block', marginTop: 2 }}>{description}</span>}</div><X size={12} onClick={() => { setDismissed(true); onDismiss?.(); }} role="button" aria-label="Dismiss notification" tabIndex={0} style={{ color: 'var(--token-text-disabled)', cursor: 'pointer', flexShrink: 0 }} /></div>);
}

/* ——————————————————————————————————————————————————
   DS Filter Bar
   —————————————————————————————————————————————————— */
export interface DSFilterBarProps { filters: string[]; active?: Set<string>; onToggle?: (filter: string) => void; style?: React.CSSProperties; }
export function DSFilterBar({ filters, active: ca, onToggle, style: extraStyle }: DSFilterBarProps) {
  const [ia, setIA] = useState<Set<string>>(new Set([filters[0]])); const active = ca || ia;
  const toggle = (f: string) => { if (onToggle) { onToggle(f); } else { setIA(prev => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; }); } };
  return (<div className="flex items-center flex-wrap" style={{ gap: 'var(--token-space-2)', ...extraStyle }}><Search size={13} style={{ color: 'var(--token-text-disabled)' }} />{filters.map(f => <DSTag key={f} selected={active.has(f)} onClick={() => toggle(f)}>{f}</DSTag>)}</div>);
}

/* ——————————————————————————————————————————————————
   DS Slider Group
   —————————————————————————————————————————————————— */
export interface DSSliderGroupParam { label: string; value: number; min: number; max: number; step?: number; }
export interface DSSliderGroupProps { params?: DSSliderGroupParam[]; onChange?: (label: string, value: number) => void; style?: React.CSSProperties; }
export function DSSliderGroup({ params, onChange, style: extraStyle }: DSSliderGroupProps) {
  const defaults: DSSliderGroupParam[] = [{ label: 'Temperature', value: 0.7, min: 0, max: 2 }, { label: 'Top P', value: 0.9, min: 0, max: 1 }, { label: 'Max Tokens', value: 2048, min: 1, max: 4096, step: 1 }];
  const items = params || defaults;
  return (<div className="flex flex-col" style={{ gap: 'var(--token-space-4)', width: '100%', maxWidth: 280, ...extraStyle }}>{items.map(p => <DSSlider key={p.label} label={p.label} value={p.value} min={p.min} max={p.max} onChange={(v) => onChange?.(p.label, v)} />)}</div>);
}

/* ══════════════════════════════════════════════════
   MOBILE-SPECIFIC MOLECULES
   ══════════════════════════════════════════════════ */

/* DS Bottom Sheet (Mobile Only) */
export interface DSBottomSheetProps { title?: string; children: React.ReactNode; open?: boolean; style?: React.CSSProperties; }
export function DSBottomSheet({ title, children, open = true, style: extraStyle }: DSBottomSheetProps) {
  return (<div role="dialog" aria-modal="true" aria-label={title || 'Bottom sheet'} style={{ border: '1px solid var(--token-border)', borderRadius: '16px 16px 0 0', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-xl)', width: '100%', maxWidth: 375, overflow: 'hidden', transform: open ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s', ...extraStyle }}><DSBottomSheetHandle />{title && <div className="flex items-center justify-center" style={{ padding: 'var(--token-space-1) var(--token-space-4) var(--token-space-3)', borderBottom: '1px solid var(--token-border)' }}><span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{title}</span></div>}<div style={{ padding: 'var(--token-space-4)' }}>{children}</div></div>);
}

/* DS Action Sheet (Mobile Only) */
export interface DSActionSheetAction { label: string; icon?: React.ReactNode; destructive?: boolean; onClick?: () => void; }
export interface DSActionSheetProps { title?: string; actions: DSActionSheetAction[]; style?: React.CSSProperties; }
export function DSActionSheet({ title, actions, style: extraStyle }: DSActionSheetProps) {
  return (<div role="dialog" aria-modal="true" aria-label={title || 'Action sheet'} className="flex flex-col" style={{ gap: 'var(--token-space-2)', width: '100%', maxWidth: 375, ...extraStyle }}><div style={{ borderRadius: 16, background: 'var(--token-bg)', overflow: 'hidden', border: '1px solid var(--token-border)' }}>{title && <div style={{ padding: 'var(--token-space-3)', textAlign: 'center', borderBottom: '1px solid var(--token-border)' }}><span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>{title}</span></div>}{actions.map((a, i) => <ASItem key={a.label} action={a} isLast={i === actions.length - 1} />)}</div><div style={{ borderRadius: 16, background: 'var(--token-bg)', overflow: 'hidden', border: '1px solid var(--token-border)' }}><div style={{ padding: 'var(--token-space-3)', textAlign: 'center', cursor: 'pointer', fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-accent)' }}>Cancel</div></div></div>);
}
function ASItem({ action, isLast }: { action: DSActionSheetAction; isLast: boolean }) {
  const [h, setH] = useState(false);
  return (<div role="button" tabIndex={0} className="flex items-center justify-center cursor-pointer" onClick={action.onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-3)', borderBottom: isLast ? 'none' : '1px solid var(--token-border)', background: h ? 'var(--token-bg-hover)' : 'transparent', transition: 'background var(--token-duration-fast)' }}>{action.icon && <span style={{ color: action.destructive ? 'var(--token-error)' : 'var(--token-accent)' }}>{action.icon}</span>}<span style={{ fontSize: 'var(--token-text-sm)', color: action.destructive ? 'var(--token-error)' : 'var(--token-accent)' }}>{action.label}</span></div>);
}

/* DS Bottom Nav (Mobile Only) */
export interface DSBottomNavItem { icon: React.ReactNode; label: string; badge?: number; }
export interface DSBottomNavProps { items?: DSBottomNavItem[]; activeIndex?: number; onSelect?: (index: number) => void; style?: React.CSSProperties; }
export function DSBottomNav({ items, activeIndex: ci, onSelect, style: extraStyle }: DSBottomNavProps) {
  const defs: DSBottomNavItem[] = [{ icon: <Home size={18} />, label: 'Home' }, { icon: <MessageSquare size={18} />, label: 'Chat', badge: 3 }, { icon: <Sparkles size={18} />, label: 'AI' }, { icon: <Settings size={18} />, label: 'Settings' }];
  const navItems = items || defs;
  const [ii, setII] = useState(ci ?? 0); const ai = ci !== undefined ? ci : ii;
  return (<nav aria-label="Bottom navigation" className="flex items-end justify-around" style={{ padding: 'var(--token-space-2) 0 var(--token-space-3)', borderTop: '1px solid var(--token-border)', background: 'var(--token-bg)', width: '100%', maxWidth: 375, ...extraStyle }}>{navItems.map((item, i) => <BNItem key={item.label} item={item} isActive={ai === i} onClick={() => { setII(i); onSelect?.(i); }} />)}</nav>);
}
function BNItem({ item, isActive, onClick }: { item: DSBottomNavItem; isActive: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (<div className="flex flex-col items-center cursor-pointer" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ gap: 2, padding: 'var(--token-space-1) var(--token-space-3)', position: 'relative', minWidth: 56 }}><div style={{ position: 'relative' }}><span style={{ color: isActive ? 'var(--token-accent)' : h ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)', transition: 'color var(--token-duration-fast)' }}>{item.icon}</span>{item.badge !== undefined && item.badge > 0 && <span style={{ position: 'absolute', top: -4, right: -8, minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--token-error)', color: 'var(--token-text-inverse)', fontSize: 8, fontFamily: 'var(--token-font-mono)', fontWeight: 600 }}>{item.badge}</span>}</div><span style={{ fontSize: 9, fontFamily: 'var(--token-font-sans)', color: isActive ? 'var(--token-accent)' : 'var(--token-text-disabled)', fontWeight: isActive ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)' }}>{item.label}</span></div>);
}

/* DS Swipeable Row (Mobile Only) */
export interface DSSwipeableRowProps { title: string; subtitle?: string; meta?: string; icon?: React.ReactNode; style?: React.CSSProperties; }
export function DSSwipeableRow({ title, subtitle, meta, icon, style: extraStyle }: DSSwipeableRowProps) {
  const [revealed, setRevealed] = useState(false);
  return (<DSSwipeAction revealed={revealed} style={extraStyle}><div className="flex items-center cursor-pointer" onClick={() => setRevealed(!revealed)} style={{ gap: 'var(--token-space-3)', padding: 'var(--token-space-3) var(--token-space-4)', borderBottom: '1px solid var(--token-border)' }}>{icon || <MessageSquare size={16} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />}<div className="flex-1 min-w-0"><span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', display: 'block' }}>{title}</span>{subtitle && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', display: 'block' }}>{subtitle}</span>}</div>{meta && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', flexShrink: 0 }}>{meta}</span>}<ChevronRight size={12} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} /></div></DSSwipeAction>);
}

/* DS Floating Action Button (Mobile Only) */
export interface DSFabProps { icon?: React.ReactNode; label?: string; onClick?: () => void; style?: React.CSSProperties; }
export function DSFab({ icon, label, onClick, style: extraStyle }: DSFabProps) {
  const [h, setH] = useState(false); const [p, setP] = useState(false);
  return (<button aria-label={label || 'Action'} className="flex items-center justify-center cursor-pointer" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)} style={{ gap: 'var(--token-space-2)', padding: label ? 'var(--token-space-3) var(--token-space-5)' : 'var(--token-space-4)', borderRadius: '50px', border: 'none', background: h ? 'var(--token-accent-hover)' : 'var(--token-accent)', color: 'var(--token-accent-fg)', boxShadow: p ? 'var(--token-shadow-md)' : 'var(--token-shadow-lg)', transform: p ? 'scale(0.95)' : h ? 'scale(1.05)' : 'none', transition: 'all var(--token-duration-fast)', ...extraStyle }}>{icon || <Plus size={20} />}{label && <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)' }}>{label}</span>}</button>);
}