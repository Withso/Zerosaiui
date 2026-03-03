/* ================================================
   Design System — Atom Primitives (Single Source of Truth)
   
   Every atom is exported and reused by:
   - AtomsSection.tsx (gallery previews)
   - molecules.tsx (composition)
   - AI component files (final components)
   
   Change an atom here → it propagates everywhere.

   INTERACTION MODEL:
   - state='default' (or undefined) → LIVE interactive
     (atoms track hover/focus/active via real mouse events)
   - state='hover'|'focus'|'active'|... → FORCED static
     (for design system documentation to pin a visual state)
   ================================================ */
import React, { useState, useId, useCallback, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Copy, Trash2, Plus, Search, Check, X,
  ChevronDown, Settings, Mic, Paperclip, ThumbsUp, ThumbsDown,
  ArrowRight, RotateCcw, Eye, Download, Share2, Star, Loader2,
  AlertTriangle, Info, CheckCircle, XCircle, Bot, User,
  Minus, ExternalLink, SlidersHorizontal, Image as ImageIcon, HelpCircle,
  MoreHorizontal, Globe, Brain, Wrench, GitBranch, MemoryStick,
  Layers, Zap, FileText, ChevronRight,
} from 'lucide-react';

/* ——————————————————————————————————————————————————
   useInteractionState — shared hook for live interaction
   When state is 'default' or undefined, tracks real events.
   Otherwise returns the forced state booleans.
   —————————————————————————————————————————————————— */
function useInteractionState(forcedState?: string) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isLive = !forcedState || forcedState === 'default';

  const handlers = isLive ? {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => { setHovered(false); setPressed(false); },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
  } : {};

  return {
    isHover: isLive ? hovered : forcedState === 'hover',
    isFocus: isLive ? focused : forcedState === 'focus',
    isActive: isLive ? pressed : forcedState === 'active',
    isDisabled: forcedState === 'disabled',
    isLoading: forcedState === 'loading',
    handlers,
    isLive,
    forcedState,
  };
}

/* ——————————————————————————————————————————————————
   DS Button
   —————————————————————————————————————————————————— */
export interface DSButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'icon';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  state?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function DSButton({
  variant = 'primary', children, icon, state,
  onClick, disabled: disabledProp, title, style: extraStyle, className,
}: DSButtonProps) {
  const { isHover, isFocus, isActive, isDisabled: stateDisabled, isLoading, handlers } = useInteractionState(state);
  const isDisabled = stateDisabled || disabledProp;
  const isThinking = state === 'thinking';
  const [flashState, setFlashState] = useState<'idle' | 'success' | 'error'>('idle');

  /* — Post-action flash: success/error state before returning to default — */
  const triggerFlash = useCallback((result: 'success' | 'error') => {
    setFlashState(result);
    setTimeout(() => setFlashState('idle'), 1500);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled || isThinking || flashState !== 'idle') return;
    onClick?.(e);
  };

  const effectiveDisabled = isDisabled || isThinking || isLoading;

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 'var(--token-space-1-5)',
    padding: variant === 'icon' ? 'var(--token-space-2)' : 'var(--token-space-2) var(--token-space-4)',
    fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)',
    fontFamily: 'var(--token-font-sans)', borderRadius: 'var(--token-radius-md)',
    border: 'none', cursor: effectiveDisabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--token-duration-fast)', whiteSpace: 'nowrap',
    opacity: effectiveDisabled ? 0.5 : isActive ? 0.9 : 1,
    transform: isActive ? 'scale(0.97)' : 'none',
    boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : undefined,
  };

  /* — Flash-state color overrides — */
  const flashOverride: React.CSSProperties =
    flashState === 'success' ? { background: 'var(--token-success)', color: 'var(--token-accent-fg)' }
    : flashState === 'error' ? { background: 'var(--token-error)', color: 'var(--token-accent-fg)' }
    : {};

  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: isHover ? 'var(--token-accent-hover)' : 'var(--token-accent)', color: 'var(--token-accent-fg)', boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'var(--token-shadow-accent)' },
    secondary: { ...base, background: isHover ? 'var(--token-bg-active)' : 'var(--token-bg-tertiary)', color: 'var(--token-text-primary)' },
    ghost: { ...base, background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: isHover ? 'var(--token-text-primary)' : 'var(--token-text-secondary)' },
    outline: { ...base, background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: 'var(--token-text-primary)', border: isFocus ? '1px solid var(--token-accent)' : '1px solid var(--token-border)' },
    destructive: { ...base, background: isHover ? 'var(--token-error)' : 'var(--token-error)', color: 'var(--token-text-inverse)', boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : undefined, filter: isHover ? 'brightness(0.9)' : 'none' },
    icon: { ...base, background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: isHover ? 'var(--token-text-primary)' : 'var(--token-text-secondary)', padding: 'var(--token-space-2)', border: isFocus ? '1px solid var(--token-accent)' : '1px solid var(--token-border)' },
  };

  const showIcon = (isLoading || isThinking)
    ? <Loader2 size={12} style={{ animation: 'token-spin 1s linear infinite' }} />
    : flashState === 'success' ? <Check size={12} />
    : flashState === 'error' ? <X size={12} />
    : icon;
  const showChildren = isThinking ? 'Processing...' : (isLoading && variant !== 'icon') ? 'Loading...' : children;

  return (
    <button
      style={{ ...styles[variant], ...flashOverride, ...extraStyle }}
      onClick={handleClick}
      disabled={effectiveDisabled}
      title={title}
      className={className}
      data-ds-interactive
      aria-disabled={effectiveDisabled || undefined}
      aria-busy={isLoading || isThinking || undefined}
      {...handlers}
    >
      {showIcon}{showChildren}
    </button>
  );
}

/* ——————————————————————————————————————————————————
   DS Badge
   —————————————————————————————————————————————————— */
export interface DSBadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'ai' | 'count' | 'secondary' | 'tertiary' | 'streaming' | 'indexing' | 'listening' | 'capability';
  children: React.ReactNode;
  icon?: React.ReactNode;
  state?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function DSBadge({ variant = 'default', children, icon, state, style: extraStyle, onClick }: DSBadgeProps) {
  const { isHover, handlers } = useInteractionState(state);
  const colors: Record<string, { bg: string; fg: string }> = {
    default: { bg: 'var(--token-bg-tertiary)', fg: 'var(--token-text-secondary)' },
    success: { bg: 'var(--token-success-light)', fg: 'var(--token-success)' },
    warning: { bg: 'var(--token-warning-light)', fg: 'var(--token-warning)' },
    error: { bg: 'var(--token-error-light)', fg: 'var(--token-error)' },
    ai: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
    secondary: { bg: 'var(--token-secondary-light)', fg: 'var(--token-secondary)' },
    tertiary: { bg: 'var(--token-tertiary-light)', fg: 'var(--token-tertiary)' },
    count: { bg: 'var(--token-text-primary)', fg: 'var(--token-text-inverse)' },
    streaming: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
    indexing: { bg: 'var(--token-secondary-light)', fg: 'var(--token-secondary)' },
    listening: { bg: 'var(--token-tertiary-light)', fg: 'var(--token-tertiary)' },
    capability: { bg: 'var(--token-bg-tertiary)', fg: 'var(--token-text-secondary)' },
  };
  const c = colors[variant];
  const hasIcon = variant === 'ai' || variant === 'streaming' || variant === 'listening' || variant === 'capability';

  return (
    <span
      role="status"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: hasIcon ? 4 : 0,
        padding: '1px 8px', borderRadius: 'var(--token-radius-full)',
        fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-medium)',
        fontFamily: 'var(--token-font-mono)', background: c.bg, color: c.fg, lineHeight: '18px',
        transform: isHover ? 'scale(1.08)' : 'none',
        transition: 'transform var(--token-duration-fast)',
        cursor: onClick ? 'pointer' : 'default',
        /* Indexing shimmer */
        ...(variant === 'indexing' ? {
          backgroundImage: 'linear-gradient(90deg, transparent 25%, var(--token-bg-secondary) 50%, transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'token-shimmer 2s ease-in-out infinite',
        } : {}),
        ...extraStyle,
      }}
      {...handlers}
    >
      {/* Variant-specific leading icons */}
      {variant === 'ai' && <Sparkles size={8} />}
      {variant === 'streaming' && (
        <span style={{
          width: 5, height: 5, borderRadius: 'var(--token-radius-full)',
          background: 'var(--token-accent)', display: 'inline-block',
          animation: 'token-pulse 1.5s ease-in-out infinite',
        }} />
      )}
      {variant === 'listening' && (
        <Mic size={8} />
      )}
      {variant === 'capability' && icon}
      {children}
    </span>
  );
}

/* ——————————————————————————————————————————————————
   DS Avatar
   —————————————————————————————————————————————————— */
export interface DSAvatarProps {
  variant?: 'user' | 'ai' | 'system';
  size?: number;
  state?: string;
  status?: 'online' | 'thinking' | 'offline' | 'error';
  style?: React.CSSProperties;
}

export function DSAvatar({ variant = 'ai', size = 32, state, status, style: extraStyle }: DSAvatarProps) {
  const { isHover, handlers, forcedState } = useInteractionState(state);
  const configs: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
    user: { bg: 'var(--token-secondary)', fg: 'var(--token-secondary-fg)', icon: <User size={size * 0.45} /> },
    ai: { bg: 'var(--token-accent)', fg: 'var(--token-accent-fg)', icon: <Sparkles size={size * 0.45} /> },
    system: { bg: 'var(--token-bg-tertiary)', fg: 'var(--token-text-tertiary)', icon: <Settings size={size * 0.45} /> },
  };
  const c = configs[variant];
  const isLoading = forcedState === 'loading';
  const shimmerBg = 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-secondary) 50%, var(--token-bg-tertiary) 75%)';

  /* — Status ring colors — */
  const statusColors: Record<string, string> = {
    online: 'var(--token-success)',
    thinking: 'var(--token-warning)',
    offline: 'var(--token-text-tertiary)',
    error: 'var(--token-error)',
  };
  const statusRingColor = status ? statusColors[status] : undefined;
  const isThinkingStatus = status === 'thinking';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <div
        role="img"
        aria-label={`${variant} avatar${status ? ` (${status})` : ''}`}
        className="flex items-center justify-center shrink-0" style={{
        width: size, height: size, borderRadius: 'var(--token-radius-full)',
        background: isLoading ? shimmerBg : c.bg, color: c.fg,
        backgroundSize: isLoading ? '200% 100%' : undefined,
        animation: isLoading ? 'token-shimmer 1.5s ease-in-out infinite' : undefined,
        boxShadow: statusRingColor
          ? `0 0 0 2px var(--token-bg), 0 0 0 4px ${statusRingColor}`
          : isHover ? '0 0 0 3px var(--token-accent-muted)' : 'none',
        transition: 'box-shadow var(--token-duration-fast)',
        ...extraStyle,
      }} {...handlers}>
        {!isLoading && c.icon}
      </div>
      {/* Status dot indicator */}
      {status && (
        <span style={{
          position: 'absolute', bottom: 0, right: 0,
          width: size * 0.3, height: size * 0.3,
          borderRadius: 'var(--token-radius-full)',
          background: statusRingColor,
          border: '2px solid var(--token-bg)',
          animation: isThinkingStatus ? 'token-pulse 2s ease-in-out infinite' : 'none',
        }} />
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Input
   —————————————————————————————————————————————————— */
export interface DSInputProps {
  variant?: 'text' | 'search' | 'disabled';
  placeholder?: string;
  state?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  style?: React.CSSProperties;
}

export function DSInput({
  variant = 'text', placeholder = '', state,
  value, onChange, onKeyDown, style: extraStyle,
}: DSInputProps) {
  const { isHover, isFocus, isDisabled: stateDisabled, handlers, forcedState } = useInteractionState(state);
  const isDisabled = variant === 'disabled' || stateDisabled;
  const isError = forcedState === 'error';

  // For input, we track focus on the inner input natively too
  const [innerFocus, setInnerFocus] = useState(false);
  const effectiveFocus = isFocus || innerFocus;

  return (
    <div className="flex items-center" style={{
      gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)',
      border: isError ? '1px solid var(--token-error)' : effectiveFocus ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
      borderRadius: 'var(--token-radius-md)',
      background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
      opacity: isDisabled ? 0.5 : 1, minWidth: 180,
      boxShadow: effectiveFocus ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 1px var(--token-border)' : 'none',
      transition: 'all var(--token-duration-fast)',
      ...extraStyle,
    }}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
    >
      {variant === 'search' && <Search size={13} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />}
      <input type="text" placeholder={placeholder} disabled={isDisabled}
        value={value} onChange={onChange} onKeyDown={onKeyDown}
        onFocus={() => setInnerFocus(true)}
        onBlur={() => setInnerFocus(false)}
        aria-invalid={isError || undefined}
        aria-disabled={isDisabled || undefined}
        style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)', width: '100%' }}
      />
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Toggle
   —————————————————————————————————————————————————— */
export interface DSToggleProps {
  defaultOn?: boolean;
  on?: boolean;
  indeterminate?: boolean;
  state?: string;
  onChange?: (value: boolean) => void;
}

export function DSToggle({ defaultOn = false, on: controlledOn, indeterminate = false, state, onChange }: DSToggleProps) {
  const { isHover, isDisabled, handlers, forcedState } = useInteractionState(state);
  const forceOn = forcedState === 'on';
  const forceOff = forcedState === 'off';
  const forceIndet = forcedState === 'indeterminate' || indeterminate;
  const [internalOn, setInternalOn] = useState(defaultOn);
  const isControlled = controlledOn !== undefined;
  const isOn = forceIndet ? false : forceOn ? true : forceOff ? false : (isControlled ? controlledOn : internalOn);

  const handleClick = () => {
    if (isDisabled) return;
    const next = forceIndet ? true : !isOn;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
  };

  return (
    <button onClick={handleClick} className="cursor-pointer" style={{
      width: 36, height: 20, borderRadius: 'var(--token-radius-full)',
      border: 'none', padding: 2,
      background: forceIndet ? 'var(--token-text-tertiary)' : isOn ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
      transition: 'all var(--token-duration-fast)', display: 'flex', alignItems: 'center',
      opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer',
      boxShadow: isHover ? '0 0 0 3px var(--token-accent-muted)' : 'none',
    }}
      role="switch"
      aria-checked={forceIndet ? 'mixed' : isOn}
      aria-disabled={isDisabled || undefined}
      data-ds-interactive
      {...handlers}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 'var(--token-radius-full)',
        background: '#fff', boxShadow: 'var(--token-shadow-xs)',
        transform: forceIndet ? 'translateX(8px)' : isOn ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform var(--token-duration-fast)',
      }}>
        {forceIndet && (
          <Minus size={10} style={{ color: 'var(--token-text-tertiary)', display: 'block', margin: '3px auto' }} />
        )}
      </div>
    </button>
  );
}

/* ——————————————————————————————————————————————————
   DS Tag
   —————————————————————————————————————————————————— */
export interface DSTagProps {
  children: string;
  removable?: boolean;
  color?: string;
  state?: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}

export function DSTag({ children, removable, color, state, selected: selectedProp, onClick, onRemove, style: extraStyle }: DSTagProps) {
  const { isHover, isDisabled, handlers, forcedState } = useInteractionState(state);
  const isSelected = forcedState === 'selected' || selectedProp;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(children);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isEditing && editRef.current) editRef.current.focus(); }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled) { setEditValue(children); setIsEditing(true); }
  };

  const commitEdit = () => { setIsEditing(false); /* parent would handle via onChange */ };

  if (isEditing) {
    return (
      <input
        ref={editRef}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditValue(children); setIsEditing(false); } }}
        style={{
          padding: '2px 8px', borderRadius: 'var(--token-radius-full)',
          fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-sans)',
          border: '1px solid var(--token-accent)', background: 'var(--token-bg)',
          color: 'var(--token-text-primary)', outline: 'none', width: 80,
          boxShadow: '0 0 0 3px var(--token-accent-muted)',
        }}
      />
    );
  }

  return (
    <span
      role={onClick ? 'option' : undefined}
      aria-selected={onClick ? (isSelected || undefined) : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      onDoubleClick={handleDoubleClick}
      className="inline-flex items-center" onClick={onClick} style={{
      gap: 'var(--token-space-1)', padding: '2px 8px', borderRadius: 'var(--token-radius-full)',
      fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-sans)',
      border: isSelected ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
      background: isSelected ? 'var(--token-accent-light)' : isHover ? 'var(--token-bg-hover)' : color ? `${color}10` : 'var(--token-bg)',
      color: isSelected ? 'var(--token-accent)' : color || 'var(--token-text-secondary)',
      opacity: isDisabled ? 0.4 : 1,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all var(--token-duration-fast)',
      ...extraStyle,
    }} {...handlers}>
      {children}
      {removable && <X size={8} onClick={(e) => { e.stopPropagation(); onRemove?.(); }} role="button" aria-label="Remove tag" style={{ cursor: 'pointer', opacity: 0.5 }} />}
    </span>
  );
}

/* ——————————————————————————————————————————————————
   DS Progress
   —————————————————————————————————————————————————— */
export interface DSProgressProps {
  value?: number;
  state?: string;
  eta?: string;
  onCancel?: () => void;
  segments?: { value: number; color: string; label?: string }[];
  style?: React.CSSProperties;
}

export function DSProgress({ value = 0, state, eta, onCancel, segments, style: extraStyle }: DSProgressProps) {
  const isIndeterminate = state === 'indeterminate';

  return (
    <div style={{ width: 160, ...extraStyle }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
        <div role="progressbar" aria-valuenow={isIndeterminate ? undefined : value} aria-valuemin={0} aria-valuemax={100} style={{ height: 4, borderRadius: 'var(--token-radius-full)', background: 'var(--token-bg-tertiary)', overflow: 'hidden', flex: 1, display: 'flex' }}>
          {segments ? (
            /* — Multi-stage segmented progress — */
            segments.map((seg, i) => (
              <div key={i} style={{
                height: '100%', width: `${seg.value}%`,
                background: seg.color,
                transition: 'width var(--token-duration-normal)',
              }} />
            ))
          ) : (
            <div style={{
              height: '100%', width: isIndeterminate ? '40%' : `${value}%`, borderRadius: 'var(--token-radius-full)',
              background: 'linear-gradient(90deg, var(--token-accent), var(--token-secondary))',
              transition: 'width var(--token-duration-normal)',
              animation: isIndeterminate ? 'token-shimmer 1.5s ease-in-out infinite' : undefined,
              backgroundSize: isIndeterminate ? '200% 100%' : undefined,
            }} />
          )}
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            aria-label="Cancel"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 14, height: 14, border: 'none', borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-bg-tertiary)', color: 'var(--token-text-disabled)',
              cursor: 'pointer', flexShrink: 0, padding: 0,
              transition: 'all var(--token-duration-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-error-light)'; e.currentTarget.style.color = 'var(--token-error)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--token-bg-tertiary)'; e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
          >
            <X size={8} />
          </button>
        )}
      </div>
      {eta && (
        <span style={{
          display: 'block', marginTop: 'var(--token-space-1)',
          fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
          color: 'var(--token-text-disabled)',
        }}>
          {eta}
        </span>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Skeleton
   —————————————————————————————————————————————————— */
export interface DSSkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'title';
  width?: number | string;
  height?: number | string;
  lines?: number;
  staggerDelay?: number;
}

export function DSSkeleton({ variant = 'text', width, height, lines = 2, staggerDelay = 50 }: DSSkeletonProps) {
  const shimmerBg = 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-secondary) 50%, var(--token-bg-tertiary) 75%)';
  const shimmerStyle = (delay: number = 0): React.CSSProperties => ({
    background: shimmerBg, backgroundSize: '200% 100%',
    animation: `token-shimmer 1.5s ease-in-out ${delay}ms infinite`,
  });

  if (variant === 'avatar') return <div aria-hidden="true" style={{ width: width || 32, height: height || 32, borderRadius: 'var(--token-radius-full)', ...shimmerStyle(0) }} />;
  if (variant === 'card') return <div aria-hidden="true" style={{ width: width || 120, height: height || 64, borderRadius: 'var(--token-radius-md)', ...shimmerStyle(0) }} />;
  if (variant === 'title') return <div aria-hidden="true" style={{ width: width || 120, height: height || 16, borderRadius: 'var(--token-radius-sm)', ...shimmerStyle(0) }} />;

  /* — Text variant: multiple lines with staggered delays — */
  const lineWidths = ['100%', '85%', '70%', '90%', '60%'];
  return (
    <div aria-hidden="true" className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', width: width || 160 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: height || 10,
          width: lineWidths[i % lineWidths.length],
          borderRadius: 'var(--token-radius-sm)',
          ...shimmerStyle(i * staggerDelay),
        }} />
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Divider
   —————————————————————————————————————————————————— */
export interface DSDividerProps {
  label?: string;
  variant?: 'solid' | 'dashed' | 'gradient' | 'section';
  defaultOpen?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function DSDivider({ label, variant = 'solid', defaultOpen = true, children, style: extraStyle }: DSDividerProps) {
  const [sectionOpen, setSectionOpen] = useState(defaultOpen);
  const lineStyle: React.CSSProperties = variant === 'dashed'
    ? { borderTop: '1px dashed var(--token-border)', height: 0 }
    : variant === 'gradient'
    ? { height: 1, background: 'linear-gradient(90deg, transparent, var(--token-border), transparent)' }
    : { height: 1, background: 'var(--token-border)' };

  /* — Collapsible section divider — */
  if (variant === 'section' && label) {
    return (
      <div style={{ ...extraStyle }}>
        <button
          onClick={() => setSectionOpen(!sectionOpen)}
          className="flex items-center w-full cursor-pointer"
          aria-expanded={sectionOpen}
          style={{
            gap: 'var(--token-space-2)', padding: 'var(--token-space-1) 0',
            border: 'none', background: 'transparent', fontFamily: 'var(--token-font-sans)',
          }}
        >
          <ChevronDown size={12} style={{
            color: 'var(--token-text-disabled)', flexShrink: 0,
            transform: sectionOpen ? 'rotate(0)' : 'rotate(-90deg)',
            transition: 'transform var(--token-duration-fast) var(--token-ease-default)',
          }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--token-border)' }} />
        </button>
        {sectionOpen && children && (
          <div style={{ paddingTop: 'var(--token-space-2)' }}>{children}</div>
        )}
      </div>
    );
  }

  if (label) {
    return (
      <div role="separator" className="flex items-center w-full" style={{ gap: 'var(--token-space-3)', ...extraStyle }}>
        <div style={{ flex: 1, ...lineStyle }} />
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap' }}>{label}</span>
        <div style={{ flex: 1, ...lineStyle }} />
      </div>
    );
  }
  return <div role="separator" style={{ width: '100%', ...lineStyle, ...extraStyle }} />;
}

/* ——————————————————————————————————————————————————
   DS Kbd (Keyboard Shortcut)
   —————————————————————————————————————————————————— */
export interface DSKbdProps {
  children: string;
  state?: string;
}

export function DSKbd({ children, state }: DSKbdProps) {
  const { isHover, handlers } = useInteractionState(state);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard?.writeText(children).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <kbd
      onClick={handleClick}
      title={copied ? 'Copied!' : 'Click to copy'}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 22, height: 22, padding: '0 6px',
        fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
        color: copied ? 'var(--token-success)' : isHover ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
        background: isHover ? 'var(--token-bg-tertiary)' : 'var(--token-bg-secondary)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: isHover ? 'var(--token-border-strong)' : 'var(--token-border)',
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: isHover ? 'var(--token-border-strong)' : 'var(--token-border)',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: isHover ? 'var(--token-border-strong)' : 'var(--token-border)',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: isHover ? 'var(--token-text-tertiary)' : 'var(--token-border-strong)',
        borderRadius: 'var(--token-radius-sm)',
        transition: 'all var(--token-duration-fast)',
        cursor: 'pointer',
      }} {...handlers}
    >
      {copied ? <Check size={9} /> : children}
    </kbd>
  );
}

/* ——————————————————————————————————————————————————
   DS Code Inline
   —————————————————————————————————————————————————— */
export interface DSCodeInlineProps {
  children: string;
  state?: string;
}

export function DSCodeInline({ children, state }: DSCodeInlineProps) {
  const { isHover, handlers } = useInteractionState(state);
  return (
    <code style={{
      padding: '1px 6px', borderRadius: 'var(--token-radius-sm)',
      fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)',
      color: 'var(--token-accent)',
      background: isHover ? 'var(--token-accent-light)' : 'var(--token-accent-muted)',
      transition: 'background var(--token-duration-fast)',
      cursor: 'default',
    }} {...handlers}>
      {children}
    </code>
  );
}

/* ——————————————————————————————————————————————————
   DS Spinner
   —————————————————————————————————————————————————— */
export interface DSSpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export function DSSpinner({ size = 16, color, label }: DSSpinnerProps) {
  if (label) {
    return (
      <div role="status" aria-label={label} className="inline-flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
        <Loader2 size={size} style={{ color: color || 'var(--token-accent)', animation: 'token-spin 1s linear infinite' }} />
        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-sans)' }}>{label}</span>
      </div>
    );
  }
  return <Loader2 role="status" aria-label="Loading" size={size} style={{ color: color || 'var(--token-accent)', animation: 'token-spin 1s linear infinite' }} />;
}

/* ——————————————————————————————————————————————————
   DS Dot Indicator
   —————————————————————————————————————————————————— */
export interface DSDotProps {
  color?: string;
  size?: number;
  pulsing?: boolean;
  label?: string;
  tooltip?: string;
}

export function DSDot({ color = 'var(--token-tertiary)', size = 8, pulsing = false, label, tooltip }: DSDotProps) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }} title={tooltip}>
      <span aria-hidden="true" style={{
        width: size, height: size, borderRadius: 'var(--token-radius-full)',
        background: color, flexShrink: 0,
        boxShadow: pulsing ? `0 0 0 3px ${color}20` : 'none',
        animation: pulsing ? 'token-pulse 2s ease-in-out infinite' : 'none',
      }} />
      {label && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>{label}</span>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Checkbox
   —————————————————————————————————————————————————— */
export interface DSCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  state?: string;
}

export function DSCheckbox({ checked: checkedProp = false, indeterminate = false, label, disabled = false, onChange, state }: DSCheckboxProps) {
  const { isHover, isFocus, isDisabled: stateDisabled, handlers, forcedState } = useInteractionState(state);
  const [internalChecked, setInternalChecked] = useState(checkedProp);
  const isDisabled = stateDisabled || disabled;

  // Support live toggle when state is default
  const isLive = !forcedState || forcedState === 'default';
  const isChecked = forcedState === 'checked' ? true : (isLive ? internalChecked : checkedProp);
  const isIndet = forcedState === 'indeterminate' || indeterminate;
  const filled = isChecked || isIndet;

  const handleClick = () => {
    if (isDisabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div
      className="flex items-center cursor-pointer"
      style={{ gap: 'var(--token-space-2)', opacity: isDisabled ? 0.5 : 1 }}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isIndet ? 'mixed' : isChecked}
      aria-disabled={isDisabled || undefined}
      tabIndex={0}
      data-ds-interactive
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleClick(); } }}
      {...handlers}
    >
      <div className="flex items-center justify-center" style={{
        width: 18, height: 18, borderRadius: 'var(--token-radius-sm)',
        border: filled ? 'none' : isHover ? '1.5px solid var(--token-border-strong)' : '1.5px solid var(--token-border)',
        background: filled ? 'var(--token-accent)' : 'var(--token-bg)',
        boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none',
        transition: 'all var(--token-duration-fast)',
      }}>
        {isChecked && !isIndet && <Check size={11} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }} />}
        {isIndet && <Minus size={11} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }} />}
      </div>
      {label && <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{label}</span>}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Slider
   —————————————————————————————————————————————————— */
export interface DSSliderProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  state?: string;
  disabled?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  onChange?: (value: number) => void;
}

export function DSSlider({ label = 'Temperature', value: valueProp = 0.7, min = 0, max = 1, step: stepProp, state, disabled = false, showTicks = false, tickCount = 5, onChange }: DSSliderProps) {
  const { isHover, isActive, isDisabled: stateDisabled, handlers, isLive } = useInteractionState(state);
  const isDisabled = stateDisabled || disabled;
  const [internalValue, setInternalValue] = useState(valueProp);
  const [isDragging, setIsDragging] = useState(false);
  const currentValue = isLive ? internalValue : valueProp;
  const pct = ((currentValue - min) / (max - min)) * 100;
  const step = stepProp ?? 0.01;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', width: '100%', maxWidth: 240, opacity: isDisabled ? 0.4 : 1 }} {...handlers}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>{currentValue.toFixed(2)}</span>
      </div>
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 'var(--token-radius-full)', background: 'var(--token-bg-tertiary)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 'var(--token-radius-full)', background: 'linear-gradient(90deg, var(--token-accent), var(--token-secondary))' }} />
        {/* Tick marks */}
        {showTicks && Array.from({ length: tickCount + 1 }).map((_, i) => {
          const tickPct = (i / tickCount) * 100;
          return (
            <div key={i} style={{ position: 'absolute', left: `${tickPct}%`, transform: 'translateX(-50%)', width: 1, height: 8, background: 'var(--token-border)', top: 6 }} />
          );
        })}
        {/* Value tooltip (visible while dragging) */}
        {(isDragging || isActive) && (
          <div style={{
            position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
            bottom: 22, padding: '1px 6px', borderRadius: 'var(--token-radius-sm)',
            background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)',
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            {currentValue.toFixed(2)}
          </div>
        )}
        {/* Thumb */}
        <div style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)', width: (isActive || isDragging) ? 18 : 14, height: (isActive || isDragging) ? 18 : 14, borderRadius: 'var(--token-radius-full)', background: 'var(--token-accent)', border: '2px solid #fff', boxShadow: isHover || isActive ? '0 0 0 4px var(--token-accent-muted)' : 'var(--token-shadow-sm)', transition: 'all var(--token-duration-fast)' }} />
        {/* Hidden native range input for live dragging */}
        {isLive && !isDisabled && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleInput}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            aria-label={label}
            aria-valuenow={currentValue}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0, cursor: 'pointer', width: '100%', margin: 0 }}
          />
        )}
      </div>
      {/* Tick labels */}
      {showTicks && (
        <div className="flex justify-between" style={{ marginTop: -4 }}>
          {Array.from({ length: tickCount + 1 }).map((_, i) => {
            const tickVal = min + (i / tickCount) * (max - min);
            return (
              <span key={i} style={{ fontSize: 9, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
                {tickVal.toFixed(max >= 10 ? 0 : 1)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Select
   —————————————————————————————————————————————————— */
export interface DSSelectProps {
  options: string[];
  value?: string;
  placeholder?: string;
  state?: string;
  disabled?: boolean;
  searchable?: boolean;
  groups?: { label: string; options: string[] }[];
  onChange?: (value: string) => void;
}

export function DSSelect({ options, value, placeholder, state, disabled = false, searchable = false, groups, onChange }: DSSelectProps) {
  const { isHover, isFocus, isDisabled: stateDisabled, handlers, forcedState, isLive } = useInteractionState(state);
  const isDisabled = stateDisabled || disabled;
  const [isOpen, setIsOpen] = useState(forcedState === 'open');
  const [selected, setSelected] = useState(value || options[0] || '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const displayValue = isLive ? selected : (value || options[0] || placeholder || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  /* — Build flat list, filtered by search — */
  const allOptions = groups ? groups.flatMap(g => g.options) : options;
  const filteredOptions = searchable && searchQuery
    ? allOptions.filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
    : allOptions;

  const handleToggle = () => {
    if (isDisabled) return;
    if (!isOpen) {
      const idx = filteredOptions.indexOf(displayValue);
      setFocusedIndex(idx >= 0 ? idx : 0);
      setSearchQuery('');
    }
    setIsOpen(!isOpen);
  };

  /* Focus search input when dropdown opens */
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) searchRef.current.focus();
  }, [isOpen, searchable]);

  const handleSelect = (m: string) => {
    setSelected(m);
    setIsOpen(false);
    setFocusedIndex(-1);
    setSearchQuery('');
    onChange?.(m);
  };

  /* — Close on outside click — */
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  /* — Keyboard navigation (WCAG listbox pattern) — */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        } else if (!isOpen) {
          handleToggle();
        }
        break;
      }
      case ' ': {
        if (!searchable || !isOpen) {
          e.preventDefault();
          if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[focusedIndex]);
          } else {
            handleToggle();
          }
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          const idx = filteredOptions.indexOf(displayValue);
          setFocusedIndex(idx >= 0 ? idx : 0);
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          const idx = filteredOptions.indexOf(displayValue);
          setFocusedIndex(idx >= 0 ? idx : 0);
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        if (isOpen) setFocusedIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        if (isOpen) setFocusedIndex(filteredOptions.length - 1);
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        setSearchQuery('');
        break;
      }
      case 'Tab': {
        if (isOpen) { setIsOpen(false); setFocusedIndex(-1); setSearchQuery(''); }
        break;
      }
      default: break;
    }
  };

  /* — Render grouped or flat options — */
  const renderOptions = () => {
    if (groups && !searchQuery) {
      let globalIdx = 0;
      return groups.map((g) => (
        <div key={g.label}>
          <div style={{
            padding: '4px 12px', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)', textTransform: 'uppercase' as const, letterSpacing: '0.05em',
            background: 'var(--token-bg-secondary)',
          }}>
            {g.label}
          </div>
          {g.options.map((m) => {
            const idx = globalIdx++;
            return (
              <SelectOption key={m} id={`${listId}-opt-${idx}`} label={m} isActive={m === displayValue} isFocused={idx === focusedIndex} onClick={() => handleSelect(m)} onMouseEnter={() => setFocusedIndex(idx)} />
            );
          })}
        </div>
      ));
    }
    return filteredOptions.map((m, i) => (
      <SelectOption key={m} id={`${listId}-opt-${i}`} label={m} isActive={m === displayValue} isFocused={i === focusedIndex} onClick={() => handleSelect(m)} onMouseEnter={() => setFocusedIndex(i)} />
    ));
  };

  return (
    <div ref={containerRef} role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-disabled={isDisabled || undefined} aria-owns={isOpen ? listId : undefined} tabIndex={isDisabled ? -1 : 0} onKeyDown={handleKeyDown} style={{ position: 'relative', width: '100%', maxWidth: 220, outline: 'none' }} {...handlers}>
      <div
        className="flex items-center cursor-pointer"
        onClick={handleToggle}
        style={{
          gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)',
          border: isFocus || isOpen ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
          borderRadius: 'var(--token-radius-md)',
          background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
          opacity: isDisabled ? 0.5 : 1,
          boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 1px var(--token-border)' : 'none',
          transition: 'all var(--token-duration-fast)',
        }}
      >
        <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{displayValue}</span>
        <ChevronDown size={13} style={{ color: 'var(--token-text-disabled)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--token-duration-fast)' }} />
      </div>
      {isOpen && (
        <div id={listId} role="listbox" aria-activedescendant={focusedIndex >= 0 ? `${listId}-opt-${focusedIndex}` : undefined} style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', zIndex: 10, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
          {/* — Searchable filter input — */}
          {searchable && (
            <div style={{ padding: 'var(--token-space-1-5)', borderBottom: '1px solid var(--token-border)' }}>
              <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)', padding: '0 var(--token-space-1-5)' }}>
                <Search size={11} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setFocusedIndex(0); }}
                  placeholder="Search..."
                  onClick={e => e.stopPropagation()}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent', width: '100%',
                    fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)',
                    color: 'var(--token-text-primary)', padding: '2px 0',
                  }}
                />
              </div>
            </div>
          )}
          {renderOptions()}
          {filteredOptions.length === 0 && (
            <div style={{ padding: '8px 12px', fontSize: 'var(--token-text-xs)', color: 'var(--token-text-disabled)', textAlign: 'center' }}>
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Select option with hover/focus tracking */
function SelectOption({ id, label, isActive, isFocused, onClick, onMouseEnter }: { id: string; label: string; isActive: boolean; isFocused: boolean; onClick: () => void; onMouseEnter: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused && ref.current) ref.current.scrollIntoView({ block: 'nearest' });
  }, [isFocused]);
  return (
    <div
      ref={ref}
      id={id}
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        padding: '6px 12px', fontSize: 'var(--token-text-sm)', cursor: 'pointer',
        color: isActive ? 'var(--token-accent)' : 'var(--token-text-secondary)',
        background: isFocused ? 'var(--token-bg-hover)' : isActive ? 'var(--token-accent-light)' : 'transparent',
        transition: 'background var(--token-duration-fast)',
      }}
    >
      {label}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Textarea
   —————————————————————————————————————————————————— */
export interface DSTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  state?: string;
  rows?: number;
  maxLength?: number;
  autoResize?: boolean;
  maxHeight?: number;
  tokenCount?: number;
  maxTokens?: number;
  style?: React.CSSProperties;
}

export function DSTextarea({ placeholder = 'Enter your prompt...', value, onChange, state, rows = 3, maxLength, autoResize = false, maxHeight = 300, tokenCount, maxTokens, style: extraStyle }: DSTextareaProps) {
  const { isHover, isFocus, isDisabled, handlers, isLive, forcedState } = useInteractionState(state);
  const isError = forcedState === 'error';
  const [internal, setInternal] = useState(value || '');
  const [innerFocus, setInnerFocus] = useState(false);
  const effectiveFocus = isFocus || innerFocus;
  const val = isLive ? internal : (value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* — Auto-resize: grow/shrink vertically to fit content — */
  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [val, autoResize, maxHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 280, ...extraStyle }} {...handlers}>
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={val}
        onChange={handleChange}
        onFocus={() => setInnerFocus(true)}
        onBlur={() => setInnerFocus(false)}
        disabled={isDisabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={isError || undefined}
        aria-disabled={isDisabled || undefined}
        style={{
          width: '100%', resize: autoResize ? 'none' : 'vertical',
          border: isError ? '1px solid var(--token-error)' : effectiveFocus ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
          borderRadius: 'var(--token-radius-md)', padding: 'var(--token-space-2-5) var(--token-space-3)',
          background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
          fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)',
          outline: 'none', opacity: isDisabled ? 0.5 : 1,
          boxShadow: effectiveFocus ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 1px var(--token-border)' : 'none',
          transition: 'all var(--token-duration-fast)',
        }}
      />
      {/* — Bottom-right indicators (token count + char count) — */}
      <div className="flex items-center" style={{ position: 'absolute', bottom: 6, right: 10, gap: 'var(--token-space-2)' }}>
        {tokenCount !== undefined && maxTokens !== undefined && (
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: tokenCount > maxTokens * 0.9 ? 'var(--token-error)' : 'var(--token-text-disabled)',
          }}>
            {tokenCount.toLocaleString()}/{maxTokens.toLocaleString()} tokens
          </span>
        )}
        {maxLength && (
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: val.length > maxLength * 0.9 ? 'var(--token-error)' : 'var(--token-text-disabled)' }}>
            {val.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Rating (Star Rating for AI responses)
   —————————————————————————————————————————————————— */
export interface DSRatingProps {
  value?: number;
  max?: number;
  state?: string;
  onChange?: (value: number) => void;
  onFeedback?: (feedback: string) => void;
  showFeedback?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export function DSRating({ value: valueProp = 0, max = 5, state, onChange, onFeedback, showFeedback = false, size = 16, style: extraStyle }: DSRatingProps) {
  const { isDisabled, isLive } = useInteractionState(state);
  const [internalVal, setInternalVal] = useState(valueProp);
  const [hoverVal, setHoverVal] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const current = isLive ? internalVal : valueProp;
  const display = hoverVal > 0 ? hoverVal : current;

  const handleSelect = (starVal: number) => {
    if (!isDisabled && isLive) {
      setInternalVal(starVal);
      onChange?.(starVal);
      if (showFeedback) setShowInput(true);
    }
  };

  return (
    <div style={{ ...extraStyle }}>
      <div role="radiogroup" aria-label="Rating" className="inline-flex items-center" style={{ gap: 2 }}>
        {Array.from({ length: max }).map((_, i) => {
          const starVal = i + 1;
          const filled = starVal <= display;
          return (
            <Star
              key={i}
              size={size}
              fill={filled ? 'var(--token-warning)' : 'none'}
              style={{
                color: filled ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all var(--token-duration-fast)',
                transform: hoverVal === starVal ? 'scale(1.2)' : 'none',
                opacity: isDisabled ? 0.4 : 1,
              }}
              onClick={() => handleSelect(starVal)}
              onMouseEnter={() => isLive && setHoverVal(starVal)}
              onMouseLeave={() => isLive && setHoverVal(0)}
            />
          );
        })}
        {current > 0 && (
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', marginLeft: 4 }}>{current}/{max}</span>
        )}
      </div>
      {/* — Feedback input after rating selection — */}
      {showInput && showFeedback && (
        <div style={{ marginTop: 'var(--token-space-2)', display: 'flex', gap: 'var(--token-space-1-5)', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tell us more..."
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && feedbackText.trim()) { onFeedback?.(feedbackText); setShowInput(false); setFeedbackText(''); } }}
            style={{
              flex: 1, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)',
              padding: '4px 8px', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)',
              color: 'var(--token-text-primary)', background: 'var(--token-bg)', outline: 'none',
            }}
          />
          <button
            onClick={() => { onFeedback?.(feedbackText); setShowInput(false); setFeedbackText(''); }}
            style={{
              border: 'none', background: 'var(--token-accent)', color: 'var(--token-accent-fg)',
              borderRadius: 'var(--token-radius-sm)', padding: '4px 8px', fontSize: 'var(--token-text-2xs)',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Counter (+/- stepper for token limits, etc.)
   —————————————————————————————————————————————————— */
export interface DSCounterProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  state?: string;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export function DSCounter({ value: valueProp = 0, min = 0, max = 100, step = 1, label, state, onChange, style: extraStyle }: DSCounterProps) {
  const { isHover, isDisabled, handlers, isLive } = useInteractionState(state);
  const [internal, setInternal] = useState(valueProp);
  const [animDir, setAnimDir] = useState<'up' | 'down' | null>(null);
  const val = isLive ? internal : valueProp;

  const adjust = (delta: number) => {
    if (isDisabled) return;
    const next = Math.min(max, Math.max(min, val + delta));
    setAnimDir(delta > 0 ? 'up' : 'down');
    setInternal(next);
    onChange?.(next);
    setTimeout(() => setAnimDir(null), 200);
  };

  return (
    <div role="group" aria-label={label || 'Counter'} className="flex items-center" style={{ gap: 'var(--token-space-2)', ...extraStyle }} {...handlers}>
      {label && <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', marginRight: 'var(--token-space-2)' }}>{label}</span>}
      <button onClick={() => adjust(-step)} disabled={isDisabled || val <= min} aria-label="Decrease" style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)',
        background: 'var(--token-bg)', cursor: isDisabled || val <= min ? 'not-allowed' : 'pointer',
        color: val <= min ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)',
        opacity: isDisabled ? 0.4 : 1, transition: 'all var(--token-duration-fast)',
      }}>
        <Minus size={12} />
      </button>
      <span style={{
        minWidth: 36, textAlign: 'center', fontSize: 'var(--token-text-sm)',
        fontFamily: 'var(--token-font-mono)', fontWeight: 'var(--token-weight-medium)',
        color: 'var(--token-text-primary)', display: 'inline-block', overflow: 'hidden',
        transform: animDir === 'up' ? 'translateY(-2px)' : animDir === 'down' ? 'translateY(2px)' : 'none',
        transition: 'transform var(--token-duration-fast) var(--token-ease-default)',
      }}>{val}</span>
      <button onClick={() => adjust(step)} disabled={isDisabled || val >= max} aria-label="Increase" style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)',
        background: 'var(--token-bg)', cursor: isDisabled || val >= max ? 'not-allowed' : 'pointer',
        color: val >= max ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)',
        opacity: isDisabled ? 0.4 : 1, transition: 'all var(--token-duration-fast)',
      }}>
        <Plus size={12} />
      </button>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Segmented Control (inline tab selector)
   —————————————————————————————————————————————————— */
export interface DSSegmentedControlProps {
  options: (string | { label: string; icon?: React.ReactNode })[];
  value?: string;
  onChange?: (value: string) => void;
  state?: string;
  style?: React.CSSProperties;
}

export function DSSegmentedControl({ options, value, onChange, state, style: extraStyle }: DSSegmentedControlProps) {
  const { isDisabled, isLive } = useInteractionState(state);
  const getLabel = (opt: string | { label: string; icon?: React.ReactNode }) => typeof opt === 'string' ? opt : opt.label;
  const getIcon = (opt: string | { label: string; icon?: React.ReactNode }) => typeof opt === 'string' ? undefined : opt.icon;
  const [internal, setInternal] = useState(value || getLabel(options[0]));
  const current = isLive ? internal : (value || getLabel(options[0]));

  return (
    <div role="radiogroup" aria-label="Segmented control" className="inline-flex" style={{
      border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)',
      background: 'var(--token-bg-secondary)', padding: 2, opacity: isDisabled ? 0.5 : 1,
      ...extraStyle,
    }}>
      {options.map(opt => {
        const lbl = getLabel(opt);
        const ico = getIcon(opt);
        const isActive = lbl === current;
        return (
          <SegmentedOption
            key={lbl}
            label={lbl}
            icon={ico}
            isActive={isActive}
            disabled={isDisabled}
            onClick={() => { if (!isDisabled && isLive) { setInternal(lbl); onChange?.(lbl); } }}
          />
        );
      })}
    </div>
  );
}

function SegmentedOption({ label, icon, isActive, disabled, onClick }: { label: string; icon?: React.ReactNode; isActive: boolean; disabled: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      role="radio"
      aria-checked={isActive}
      className="cursor-pointer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: icon ? 'var(--token-space-1)' : 0,
        padding: 'var(--token-space-1-5) var(--token-space-3)',
        fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)',
        fontWeight: isActive ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
        color: isActive ? 'var(--token-text-primary)' : hovered ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
        background: isActive ? 'var(--token-bg)' : 'transparent',
        border: 'none', borderRadius: 'var(--token-radius-sm)',
        boxShadow: isActive ? 'var(--token-shadow-xs)' : 'none',
        transition: 'all var(--token-duration-fast)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}{label}
    </button>
  );
}

/* ——————————————————————————————————————————————————
   DS Streaming Dots (AI thinking/typing animation)
   —————————————————————————————————————————————————— */
export interface DSStreamingDotsProps {
  size?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
  style?: React.CSSProperties;
}

export function DSStreamingDots({ size = 6, color = 'var(--token-accent)', speed = 'normal', label, style: extraStyle }: DSStreamingDotsProps) {
  /* — Speed reflects AI state: slow=thinking, normal=default, fast=generating — */
  const durations: Record<string, number> = { slow: 2.0, normal: 1.4, fast: 0.8 };
  const dur = durations[speed];
  const ariaLabel = label || (speed === 'slow' ? 'AI is thinking' : speed === 'fast' ? 'AI is generating' : 'AI is processing');

  return (
    <div role="status" aria-label={ariaLabel} className="inline-flex items-center" style={{ gap: size * 0.6, ...extraStyle }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: size, height: size, borderRadius: 'var(--token-radius-full)',
          background: color, display: 'block',
          animation: `token-bounce ${dur}s ease-in-out ${i * (dur * 0.11)}s infinite`,
        }} />
      ))}
      {label && (
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-sans)', marginLeft: 'var(--token-space-1)' }}>{label}</span>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Bottom Sheet Handle (Mobile Only)
   —————————————————————————————————————————————————— */
export interface DSBottomSheetHandleProps {
  style?: React.CSSProperties;
}

export function DSBottomSheetHandle({ style: extraStyle }: DSBottomSheetHandleProps) {
  return (
    <div className="flex justify-center" style={{ padding: 'var(--token-space-2) 0', ...extraStyle }}>
      <div style={{
        width: 36, height: 4, borderRadius: 'var(--token-radius-full)',
        background: 'var(--token-text-disabled)', opacity: 0.5,
      }} />
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Swipe Action (Mobile Only)
   Reveals action buttons on swipe (visual preview)
   —————————————————————————————————————————————————— */
export interface DSSwipeActionProps {
  children: React.ReactNode;
  actions?: { icon: React.ReactNode; color: string; label: string }[];
  revealed?: boolean;
  style?: React.CSSProperties;
}

export function DSSwipeAction({ children, actions, revealed = false, style: extraStyle }: DSSwipeActionProps) {
  const defaultActions = [
    { icon: <Trash2 size={14} />, color: 'var(--token-error)', label: 'Delete' },
    { icon: <Star size={14} />, color: 'var(--token-warning)', label: 'Star' },
  ];
  const items = actions || defaultActions;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...extraStyle }}>
      {/* Action buttons behind */}
      <div className="flex" style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}>
        {items.map((a, i) => (
          <div key={i} className="flex items-center justify-center" style={{
            width: 64, background: a.color, color: 'var(--token-text-inverse)',
            flexDirection: 'column', gap: 2, fontSize: 'var(--token-text-2xs)',
          }}>
            {a.icon}
            <span>{a.label}</span>
          </div>
        ))}
      </div>
      {/* Content layer */}
      <div style={{
        position: 'relative', background: 'var(--token-bg)',
        transform: revealed ? `translateX(-${items.length * 64}px)` : 'translateX(0)',
        transition: 'transform var(--token-duration-normal)',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Pull Indicator (Mobile Only — pull-to-refresh)
   —————————————————————————————————————————————————— */
export interface DSPullIndicatorProps {
  state?: 'idle' | 'pulling' | 'refreshing' | 'done';
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  style?: React.CSSProperties;
}

export function DSPullIndicator({ state = 'idle', actionLabel, actionIcon, style: extraStyle }: DSPullIndicatorProps) {
  const labels: Record<string, string> = {
    idle: actionLabel || 'Pull to refresh',
    pulling: actionLabel ? `Release to ${actionLabel.toLowerCase().replace('pull to ', '')}` : 'Release to refresh',
    refreshing: actionLabel ? `${actionLabel.replace('Pull to ', '')}...` : 'Refreshing...',
    done: 'Updated',
  };

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center" style={{
      padding: 'var(--token-space-3)', gap: 'var(--token-space-1)',
      opacity: state === 'idle' ? 0.3 : 1,
      transition: 'opacity var(--token-duration-fast)',
      ...extraStyle,
    }}>
      {state === 'refreshing' ? (
        actionIcon || <Loader2 size={18} style={{ color: 'var(--token-accent)', animation: 'token-spin 1s linear infinite' }} />
      ) : state === 'done' ? (
        <Check size={18} style={{ color: 'var(--token-success)' }} />
      ) : (
        actionIcon || <ArrowRight size={18} style={{
          color: 'var(--token-text-tertiary)',
          transform: state === 'pulling' ? 'rotate(90deg)' : 'rotate(-90deg)',
          transition: 'transform var(--token-duration-fast)',
        }} />
      )}
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
        {labels[state]}
      </span>
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Color Bar (Multi-segment colored progress bar)
   Used by ContextWindow, TokenUsage, ChartResult
   —————————————————————————————————————————————————— */
export interface DSColorBarSegment {
  value: number;
  color: string;
  label?: string;
}

export interface DSColorBarProps {
  segments: DSColorBarSegment[];
  total: number;
  height?: number;
  style?: React.CSSProperties;
}

export function DSColorBar({ segments, total, height = 6, style: extraStyle }: DSColorBarProps) {
  return (
    <div className="flex" style={{
      height, borderRadius: 'var(--token-radius-full)',
      overflow: 'hidden', background: 'var(--token-bg-tertiary)',
      gap: 1, width: '100%', ...extraStyle,
    }}>
      {segments.map((seg, i) => (
        <div
          key={i}
          title={seg.label ? `${seg.label}: ${seg.value.toLocaleString()} (${((seg.value / total) * 100).toFixed(1)}%)` : undefined}
          style={{
            width: `${(seg.value / total) * 100}%`,
            background: seg.color,
            borderRadius: i === 0 ? `${height / 2}px 0 0 ${height / 2}px`
              : i === segments.length - 1 ? `0 ${height / 2}px ${height / 2}px 0` : 0,
            transition: 'width var(--token-duration-slow) var(--token-ease-default)',
            minWidth: 2,
            cursor: seg.label ? 'help' : 'default',
          }}
        />
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Collapsible (Expandable section with header)
   Used by ReasoningTrace, Accordion patterns
   —————————————————————————————————————————————————— */
export interface DSCollapsibleProps {
  title: string;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: React.ReactNode;
  state?: string;
  style?: React.CSSProperties;
}

export function DSCollapsible({ title, icon, meta, defaultOpen = false, open: controlledOpen, onToggle, children, state, style: extraStyle }: DSCollapsibleProps) {
  const { isDisabled, isLive } = useInteractionState(state);
  const forceOpen = state === 'open';
  const forceClosed = state === 'closed';
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = forceOpen ? true : forceClosed ? false : isControlled ? controlledOpen : (isLive ? internalOpen : defaultOpen);
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <div style={{
      borderRadius: 'var(--token-radius-lg)',
      border: '1px solid var(--token-border)',
      overflow: 'hidden',
      fontFamily: 'var(--token-font-sans)',
      opacity: isDisabled ? 0.5 : 1,
      ...extraStyle,
    }}>
      <button
        onClick={() => {
          if (!isDisabled && isLive) {
            const next = !isOpen;
            if (!isControlled) setInternalOpen(next);
            onToggle?.(next);
          }
        }}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        className="flex items-center justify-between w-full cursor-pointer"
        aria-expanded={isOpen}
        data-ds-interactive
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          border: 'none',
          background: headerHovered ? 'var(--token-bg-hover)' : 'var(--token-bg-secondary)',
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
          transition: 'background var(--token-duration-fast)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {icon}
          <span style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}>
            {title}
          </span>
          {meta}
        </div>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--token-text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
          }}
        />
      </button>
      {isOpen && (
        <div style={{
          padding: 'var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Legend Item (Color dot + label + mono value)
   Used by ContextWindow, ChartResult legends
   —————————————————————————————————————————————————— */
export interface DSLegendItemProps {
  color: string;
  label: string;
  value?: string;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function DSLegendItem({ color, label, value, active = true, onClick, style: extraStyle }: DSLegendItemProps) {
  return (
    <div
      className="flex items-center"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        gap: 'var(--token-space-1-5)',
        cursor: onClick ? 'pointer' : 'default',
        opacity: active ? 1 : 0.35,
        transition: 'opacity var(--token-duration-fast)',
        ...extraStyle,
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: 2,
        background: active ? color : 'var(--token-text-disabled)',
        display: 'inline-block', flexShrink: 0,
        transition: 'background var(--token-duration-fast)',
      }} />
      <span style={{
        fontSize: 'var(--token-text-xs)',
        color: 'var(--token-text-secondary)',
        textDecoration: active ? 'none' : 'line-through',
      }}>
        {label}
      </span>
      {value && (
        <span style={{
          fontSize: 'var(--token-text-xs)',
          color: 'var(--token-text-tertiary)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   DS Icon Set (re-export for convenience)
   —————————————————————————————————————————————————— */
export {
  Sparkles, Send, Copy, Trash2, Plus, Search, Check, X,
  ChevronDown, Settings, Mic, Paperclip, ThumbsUp, ThumbsDown,
  ArrowRight, RotateCcw, Eye, Download, Share2, Star, Loader2,
  AlertTriangle, Info, CheckCircle, XCircle, Bot, User,
  Minus, ExternalLink, SlidersHorizontal, Image as ImageIcon, HelpCircle,
  MoreHorizontal, Globe, Brain, Wrench, GitBranch, MemoryStick,
  Layers, Zap, FileText, ChevronRight,
} from 'lucide-react';