/* ================================================
   Atoms — Gallery grid matching homepage layout
   Preview cell (interactive) + Title bar (navigates)
   Variant tabs + State tabs above title bar
   
   All atom components are imported from atoms.tsx
   (single source of truth). This file only handles
   gallery layout, variant tabs, and state controls.
   ================================================ */
import {
  Sparkles, Plus, Loader2, Check, Minus, ChevronDown, HelpCircle,
  Image as ImageIcon, ExternalLink, Mic, Brain, Wrench, Eye, MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import React from 'react';

/* ——— Import shared atom primitives ——— */
import {
  DSButton as ButtonAtom,
  DSBadge as BadgeAtom,
  DSAvatar as AvatarAtom,
  DSInput as InputAtom,
  DSToggle as ToggleAtom,
  DSTag as TagAtom,
  DSProgress as ProgressAtom,
  DSSkeleton as SkeletonAtom,
  DSDivider as DividerAtom,
  DSKbd as KbdAtom,
  DSCodeInline as CodeInlineAtom,
  DSSpinner as SpinnerAtom,
  DSDot as DotAtom,
  DSCheckbox as CheckboxAtom,
  DSSlider as SliderAtom,
  DSSelect as SelectAtom,
  DSTextarea as TextareaAtom,
  DSRating as RatingAtom,
  DSCounter as CounterAtom,
  DSSegmentedControl as SegmentedControlAtom,
  DSStreamingDots as StreamingDotsAtom,
  DSBottomSheetHandle as BottomSheetHandleAtom,
  DSSwipeAction as SwipeActionAtom,
  DSPullIndicator as PullIndicatorAtom,
} from './atoms';

import {
  DSColorBar as ColorBarAtom,
  DSCollapsible as CollapsibleAtom,
  DSLegendItem as LegendItemAtom,
} from './atoms-extra';
/* ——— Gallery-specific preview wrappers (delegate to shared atoms) ——— */

/* ——— Interactive Toggle+Label ——— */
function SwitchLabelPreview({ state }: { state?: string }) {
  const isLive = !state;
  const forceOn = state === 'on';
  const forceOff = state === 'off';
  const isDisabled = state === 'disabled';
  const isHoverForced = state === 'hover';
  const [internalOn, setInternalOn] = useState(true);
  const [hovered, setHovered] = useState(false);
  const trackOn = forceOff ? false : forceOn ? true : (isLive ? internalOn : true);
  const effectiveHover = isLive ? hovered : isHoverForced;

  const handleClick = () => {
    if (isDisabled || !isLive) return;
    setInternalOn(!internalOn);
  };

  return (
    <div
      className="flex items-center"
      style={{ gap: 'var(--token-space-2-5)', opacity: isDisabled ? 0.5 : 1 }}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => isLive && setHovered(false)}
    >
      <button onClick={handleClick} className="cursor-pointer" style={{
        width: 36, height: 20, borderRadius: 'var(--token-radius-full)', border: 'none', padding: 2,
        background: trackOn ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
        display: 'flex', alignItems: 'center', cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: effectiveHover ? '0 0 0 3px var(--token-accent-muted)' : 'none',
        transition: 'all var(--token-duration-fast)',
      }}>
        <div style={{ width: 16, height: 16, borderRadius: 'var(--token-radius-full)', background: '#fff', boxShadow: 'var(--token-shadow-xs)', transform: trackOn ? 'translateX(16px)' : 'translateX(0)', transition: 'transform var(--token-duration-fast)' }} />
      </button>
      <div className="flex flex-col" style={{ gap: 1 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>Dark mode</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Toggle theme</span>
      </div>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: trackOn ? 'var(--token-accent)' : 'var(--token-text-disabled)', marginLeft: 'auto', transition: 'color var(--token-duration-fast)' }}>{trackOn ? 'On' : 'Off'}</span>
    </div>
  );
}

/* ——— Interactive Checkbox preview ——— */
function CheckboxPreview({ state, defaultChecked = false, defaultLabel = 'Unchecked' }: { state?: string; defaultChecked?: boolean; defaultLabel?: string }) {
  const isLive = !state;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isChecked = state === 'checked' ? true : state === 'indeterminate' ? false : (isLive ? internalChecked : defaultChecked);
  const isIndet = state === 'indeterminate';
  const isHover = isLive ? hovered : state === 'hover';
  const isFocus = isLive ? focused : state === 'focus';
  const isDisabled = state === 'disabled';
  const filled = isChecked || isIndet;

  return (
    <div
      className="flex items-center cursor-pointer"
      style={{ gap: 'var(--token-space-2)', opacity: isDisabled ? 0.5 : 1 }}
      onClick={() => { if (isLive && !isDisabled) setInternalChecked(!internalChecked); }}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => isLive && setHovered(false)}
      onFocus={() => isLive && setFocused(true)}
      onBlur={() => isLive && setFocused(false)}
      tabIndex={isLive ? 0 : undefined}
    >
      <div className="flex items-center justify-center" style={{
        width: 18, height: 18, borderRadius: 'var(--token-radius-sm)',
        border: filled ? 'none' : isHover ? '1.5px solid var(--token-border-strong)' : '1.5px solid var(--token-border)',
        background: filled ? 'var(--token-accent)' : 'var(--token-bg)',
        boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none',
        transition: 'all var(--token-duration-fast)',
      }}>
        {(isChecked && !isIndet) && <Check size={11} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }} />}
        {isIndet && <Minus size={11} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }} />}
      </div>
      <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>
        {isIndet ? 'Indeterminate' : isChecked ? 'Checked' : defaultLabel}
      </span>
    </div>
  );
}

/* ——— Interactive Radio preview ——— */
function RadioGroupPreview({ state }: { state?: string }) {
  const isLive = !state;
  const [selected, setSelected] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const isDisabled = state === 'disabled';
  const options = ['GPT-4o', 'Claude 3.5', 'Gemini'];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      {options.map((label, i) => {
        const isSelected = isLive ? selected === i : (state === 'selected' ? i === 0 : i === 0);
        const isHover = isLive ? hoveredIdx === i : (state === 'hover' && i === 1);
        const isFocus = isLive ? focusedIdx === i : (state === 'focus' && i === 0);

        return (
          <div
            key={label}
            className="flex items-center cursor-pointer"
            style={{ gap: 'var(--token-space-2)', opacity: isDisabled ? 0.5 : 1 }}
            onClick={() => { if (isLive && !isDisabled) setSelected(i); }}
            onMouseEnter={() => isLive && setHoveredIdx(i)}
            onMouseLeave={() => isLive && setHoveredIdx(null)}
            onFocus={() => isLive && setFocusedIdx(i)}
            onBlur={() => isLive && setFocusedIdx(null)}
            tabIndex={isLive ? 0 : undefined}
          >
            <div className="flex items-center justify-center" style={{
              width: 18, height: 18, borderRadius: 'var(--token-radius-full)',
              border: isSelected ? '1.5px solid var(--token-accent)' : isHover ? '1.5px solid var(--token-border-strong)' : '1.5px solid var(--token-border)',
              boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none',
              transition: 'all var(--token-duration-fast)',
            }}>
              {isSelected && <div style={{ width: 9, height: 9, borderRadius: 'var(--token-radius-full)', background: 'var(--token-accent)' }} />}
            </div>
            <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ——— Interactive Tooltip preview ——— */
function TooltipPreview({ state, label = 'Tooltip' }: { state?: string; label?: string }) {
  const isLive = !state;
  const [showTooltip, setShowTooltip] = useState(false);
  const visible = isLive ? showTooltip : state === 'visible';

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => isLive && setShowTooltip(true)}
      onMouseLeave={() => isLive && setShowTooltip(false)}
    >
      {visible && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6, zIndex: 10 }}>
          <div style={{ padding: '4px 10px', borderRadius: 'var(--token-radius-md)', background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--token-text-primary)' }} />
        </div>
      )}
      <HelpCircle size={20} style={{ color: visible ? 'var(--token-accent)' : 'var(--token-text-tertiary)', cursor: 'pointer', transition: 'color var(--token-duration-fast)' }} />
    </div>
  );
}

/* ——— Interactive Textarea preview ——— */
function TextareaPreview({ state, defaultValue = '' }: { state?: string; defaultValue?: string }) {
  const isLive = !state;
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isFocus = isLive ? focused : state === 'focus';
  const isHover = isLive ? hovered : state === 'hover';
  const isError = state === 'error';
  const isDisabled = state === 'disabled';
  const isFilled = state === 'filled' || (isLive && value.length > 0);

  return (
    <div
      style={{
        width: '100%', maxWidth: 240, border: isError ? '1px solid var(--token-error)' : isFocus ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
        borderRadius: 'var(--token-radius-md)', background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
        minHeight: 60, opacity: isDisabled ? 0.5 : 1,
        boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 1px var(--token-border)' : 'none',
        transition: 'all var(--token-duration-fast)',
      }}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => isLive && setHovered(false)}
    >
      {isLive ? (
        <textarea
          placeholder="Enter your prompt..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isDisabled}
          style={{
            width: '100%', minHeight: 56, border: 'none', outline: 'none', background: 'transparent', resize: 'vertical',
            padding: 'var(--token-space-2) var(--token-space-3)', fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)',
            color: 'var(--token-text-primary)',
          }}
        />
      ) : (
        <div style={{ padding: 'var(--token-space-2) var(--token-space-3)' }}>
          <span style={{ fontSize: 'var(--token-text-sm)', color: isFilled ? 'var(--token-text-primary)' : 'var(--token-text-disabled)' }}>
            {state === 'filled' ? 'Explain the attention mechanism in transformers.' : 'Enter your prompt...'}
          </span>
        </div>
      )}
    </div>
  );
}

/* ——— Interactive Select preview ——— */
function SelectPreview({ state, options = ['GPT-4o', 'Claude 3.5', 'Gemini'], showPlaceholder = false }: { state?: string; options?: string[]; showPlaceholder?: boolean }) {
  const isLive = !state;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(showPlaceholder ? '' : options[0]);
  const [hovered, setHovered] = useState(false);
  const [optionHover, setOptionHover] = useState<number | null>(null);

  const isFocus = state === 'focus';
  const isHover = isLive ? hovered : state === 'hover';
  const isDisabled = state === 'disabled';
  const effectiveOpen = isLive ? isOpen : state === 'open';
  const display = isLive ? (selectedValue || 'Select model...') : (showPlaceholder ? 'Select model...' : options[0]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => isLive && setHovered(false)}
    >
      <div
        className="flex items-center cursor-pointer"
        onClick={() => { if (isLive && !isDisabled) setIsOpen(!isOpen); }}
        style={{
          gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)',
          border: isFocus || effectiveOpen ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
          borderRadius: 'var(--token-radius-md)',
          background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
          opacity: isDisabled ? 0.5 : 1,
          boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 1px var(--token-border)' : 'none',
          transition: 'all var(--token-duration-fast)',
        }}
      >
        <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: display === 'Select model...' ? 'var(--token-text-disabled)' : 'var(--token-text-primary)' }}>{display}</span>
        <ChevronDown size={13} style={{ color: 'var(--token-text-disabled)', transform: effectiveOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--token-duration-fast)' }} />
      </div>
      {effectiveOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', zIndex: 10, overflow: 'hidden' }}>
          {options.map((m, i) => (
            <div
              key={m}
              onClick={() => { setSelectedValue(m); setIsOpen(false); }}
              onMouseEnter={() => setOptionHover(i)}
              onMouseLeave={() => setOptionHover(null)}
              style={{
                padding: '6px 12px', fontSize: 'var(--token-text-sm)', cursor: 'pointer',
                color: m === selectedValue ? 'var(--token-accent)' : 'var(--token-text-secondary)',
                background: optionHover === i ? 'var(--token-bg-hover)' : m === selectedValue ? 'var(--token-accent-light)' : 'transparent',
                transition: 'background var(--token-duration-fast)',
              }}
            >{m}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ——— Interactive Link preview ——— */
function LinkPreview({ state, label = 'Link', external = false }: { state?: string; label?: string; external?: boolean }) {
  const isLive = !state;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isHover = isLive ? hovered : state === 'hover';
  const isFocus = isLive ? focused : state === 'focus';
  const isActive = isLive ? pressed : state === 'active';
  const color = isHover || isActive ? 'var(--token-accent-hover)' : 'var(--token-accent)';

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 4, fontSize: 'var(--token-text-sm)', color,
        textDecoration: isHover ? 'underline' : 'none',
        cursor: 'pointer',
        boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none',
        borderRadius: 2, padding: '0 2px',
        transition: 'all var(--token-duration-fast)',
      }}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => { if (isLive) { setHovered(false); setPressed(false); } }}
      onMouseDown={() => isLive && setPressed(true)}
      onMouseUp={() => isLive && setPressed(false)}
      onFocus={() => isLive && setFocused(true)}
      onBlur={() => isLive && setFocused(false)}
      tabIndex={isLive ? 0 : undefined}
    >
      {label}
      {external && <ExternalLink size={11} />}
    </span>
  );
}

/* ——— Interactive Slider preview ——— */
function SliderPreview({ state }: { state?: string }) {
  return <SliderAtom state={state} />;
}

/* ——— Interactive Thumbnail preview ——— */
function ThumbnailPreview({ state, defaultSelected = false }: { state?: string; defaultSelected?: boolean }) {
  const isLive = !state;
  const [selected, setSelected] = useState(defaultSelected);
  const [hovered, setHovered] = useState(false);

  const isSelected = state === 'selected' || (isLive && selected);
  const isHover = isLive ? hovered : state === 'hover';
  const isLoading = state === 'loading';
  const shimmer = 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-secondary) 50%, var(--token-bg-tertiary) 75%)';

  return (
    <div
      className="flex items-center justify-center"
      onClick={() => isLive && setSelected(!selected)}
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => isLive && setHovered(false)}
      style={{
        width: 72, height: 72, borderRadius: 'var(--token-radius-md)',
        background: isLoading ? shimmer : 'var(--token-bg-tertiary)',
        backgroundSize: isLoading ? '200% 100%' : undefined,
        animation: isLoading ? 'token-shimmer 1.5s ease-in-out infinite' : undefined,
        border: isSelected ? '2px solid var(--token-accent)' : '1px solid var(--token-border)',
        boxShadow: isSelected ? '0 0 0 3px var(--token-accent-muted)' : isHover ? '0 0 0 3px var(--token-border)' : 'none',
        cursor: 'pointer',
        transition: 'all var(--token-duration-fast)',
      }}
    >
      {!isLoading && <ImageIcon size={24} style={{ color: 'var(--token-text-disabled)' }} />}
    </div>
  );
}

/* ——— Interactive Tag with remove/restore ——— */
function RemovableTagPreview({ state }: { state?: string }) {
  const [removed, setRemoved] = useState(false);
  if (removed) return (
    <ButtonAtom variant="ghost" onClick={() => setRemoved(false)} style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px' }}>
      + Restore tag
    </ButtonAtom>
  );
  return <TagAtom removable state={state} onRemove={() => setRemoved(true)}>Removable</TagAtom>;
}

/* ——— Interactive Animated Progress ——— */
function AnimatedProgressPreview({ target, state }: { target: number; state?: string }) {
  const [value, setValue] = useState(0);
  React.useEffect(() => {
    if (state === 'indeterminate') return;
    const timer = setTimeout(() => setValue(target), 100);
    return () => clearTimeout(timer);
  }, [target, state]);
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
      <ProgressAtom value={state === 'indeterminate' ? 0 : value} state={state} />
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
        {state === 'indeterminate' ? '...' : `${value}%`}
      </span>
    </div>
  );
}

/* ——— Interactive Kbd with click-press effect ——— */
function InteractiveKbd({ children, state }: { children: string; state?: string }) {
  const [pressed, setPressed] = useState(false);
  const isLive = !state;
  return (
    <span
      onClick={() => {
        if (!isLive) return;
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
      }}
      style={{ cursor: isLive ? 'pointer' : 'default' }}
    >
      <KbdAtom state={pressed ? 'hover' : state}>{children}</KbdAtom>
    </span>
  );
}

/* ——— Interactive Code Inline with click-to-copy ——— */
function CopyableCodeInline({ children, state }: { children: string; state?: string }) {
  const [copied, setCopied] = useState(false);
  const isLive = !state;
  return (
    <span
      onClick={() => {
        if (!isLive) return;
        navigator.clipboard?.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center"
      style={{ gap: 4, cursor: isLive ? 'pointer' : 'default', position: 'relative' }}
    >
      <CodeInlineAtom state={state}>{children}</CodeInlineAtom>
      {copied && (
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-success)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap' }}>
          <Check size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> Copied
        </span>
      )}
    </span>
  );
}

/* ——— Interactive Icon item ——— */
function IconItem({ Icon }: { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32, height: 32, borderRadius: 'var(--token-radius-sm)',
        background: hovered ? 'var(--token-bg-hover)' : 'transparent',
        color: hovered ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
        transition: 'all var(--token-duration-fast)', cursor: 'default',
      }}
    >
      <Icon size={16} />
    </div>
  );
}

/* ——— Atom variant & state types ——— */

interface AtomVariant {
  label: string;
  render: (state?: string) => React.ReactNode;
}

interface AtomState {
  id: string;
  label: string;
}

interface AtomEntry {
  id: string;
  title: string;
  variants: AtomVariant[];
  states: AtomState[];
}

/* ——— Atom registry with per-atom variants and states ——— */

export const atomEntries: AtomEntry[] = [
  {
    id: 'button', title: 'Button',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'active', label: 'Active' },
      { id: 'disabled', label: 'Disabled' },
      { id: 'loading', label: 'Loading' },
      { id: 'thinking', label: 'Thinking' },
    ],
    variants: [
      { label: 'Primary', render: (s) => <ButtonAtom state={s} icon={<Sparkles size={12} />}>Generate</ButtonAtom> },
      { label: 'Secondary', render: (s) => <ButtonAtom variant="secondary" state={s}>Cancel</ButtonAtom> },
      { label: 'Ghost', render: (s) => <ButtonAtom variant="ghost" state={s}>Ghost</ButtonAtom> },
      { label: 'Outline', render: (s) => <ButtonAtom variant="outline" state={s}>Outline</ButtonAtom> },
      { label: 'Destructive', render: (s) => <ButtonAtom variant="destructive" state={s}>Delete</ButtonAtom> },
      { label: 'Icon', render: (s) => <ButtonAtom variant="icon" state={s} icon={<Plus size={14} />} /> },
    ],
  },
  {
    id: 'badge', title: 'Badge',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
    ],
    variants: [
      { label: 'Default', render: (s) => <BadgeAtom state={s}>Default</BadgeAtom> },
      { label: 'Success', render: (s) => <BadgeAtom variant="success" state={s}>Online</BadgeAtom> },
      { label: 'Warning', render: (s) => <BadgeAtom variant="warning" state={s}>Pending</BadgeAtom> },
      { label: 'Error', render: (s) => <BadgeAtom variant="error" state={s}>Error</BadgeAtom> },
      { label: 'AI', render: (s) => <BadgeAtom variant="ai" state={s}>AI</BadgeAtom> },
      { label: 'Count', render: (s) => <BadgeAtom variant="count" state={s}>3</BadgeAtom> },
      { label: 'Streaming', render: (s) => <BadgeAtom variant="streaming" state={s}>Streaming</BadgeAtom> },
      { label: 'Indexing', render: (s) => <BadgeAtom variant="indexing" state={s}>Indexing</BadgeAtom> },
      { label: 'Listening', render: (s) => <BadgeAtom variant="listening" state={s}>Listening</BadgeAtom> },
      { label: 'Capability', render: (s) => <BadgeAtom variant="capability" state={s} icon={<Brain size={8} />}>Reasoning</BadgeAtom> },
    ],
  },
  {
    id: 'avatar', title: 'Avatar',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'loading', label: 'Loading' },
    ],
    variants: [
      { label: 'AI', render: (s) => <AvatarAtom variant="ai" state={s} /> },
      { label: 'User', render: (s) => <AvatarAtom variant="user" state={s} /> },
      { label: 'System', render: (s) => <AvatarAtom variant="system" state={s} /> },
      { label: 'Large', render: (s) => <AvatarAtom variant="ai" size={48} state={s} /> },
      { label: 'Online', render: (s) => <AvatarAtom variant="ai" status="online" state={s} /> },
      { label: 'Thinking', render: (s) => <AvatarAtom variant="ai" status="thinking" state={s} /> },
      { label: 'Error', render: (s) => <AvatarAtom variant="user" status="error" state={s} /> },
    ],
  },
  {
    id: 'input', title: 'Input',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'disabled', label: 'Disabled' },
      { id: 'error', label: 'Error' },
    ],
    variants: [
      { label: 'Text', render: (s) => <InputAtom placeholder="Enter prompt..." state={s} /> },
      { label: 'Search', render: (s) => <InputAtom variant="search" placeholder="Search models..." state={s} /> },
    ],
  },
  {
    id: 'toggle', title: 'Toggle',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'on', label: 'On' },
      { id: 'off', label: 'Off' },
      { id: 'hover', label: 'Hover' },
      { id: 'disabled', label: 'Disabled' },
      { id: 'indeterminate', label: 'Indeterminate' },
    ],
    variants: [
      { label: 'Off', render: (s) => <ToggleAtom defaultOn={false} state={s} /> },
      { label: 'On', render: (s) => <ToggleAtom defaultOn={true} state={s} /> },
      { label: 'Indeterminate', render: (s) => <ToggleAtom indeterminate state={s} /> },
      { label: 'With Label', render: (s) => <SwitchLabelPreview state={s} /> },
    ],
  },
  {
    id: 'tag', title: 'Tag',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'selected', label: 'Selected' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Default', render: (s) => <TagAtom state={s}>Default</TagAtom> },
      { label: 'Removable', render: (s) => <RemovableTagPreview state={s} /> },
      { label: 'Editable', render: () => <TagAtom>Double-click me</TagAtom> },
      { label: 'Violet', render: (s) => <TagAtom color="var(--token-accent)" state={s}>Violet</TagAtom> },
      { label: 'Rose', render: (s) => <TagAtom color="var(--token-secondary)" state={s}>Rose</TagAtom> },
      { label: 'Emerald', render: (s) => <TagAtom color="var(--token-tertiary)" state={s}>Emerald</TagAtom> },
    ],
  },
  {
    id: 'progress-bar', title: 'Progress Bar',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'indeterminate', label: 'Indeterminate' },
    ],
    variants: [
      { label: '25%', render: (s) => <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}><ProgressAtom value={25} state={s} /><span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{s === 'indeterminate' ? '...' : '25%'}</span></div> },
      { label: '65%', render: (s) => <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}><ProgressAtom value={65} state={s} /><span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{s === 'indeterminate' ? '...' : '65%'}</span></div> },
      { label: '100%', render: (s) => <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}><ProgressAtom value={100} state={s} /><span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{s === 'indeterminate' ? '...' : '100%'}</span></div> },
      { label: 'Animated', render: (s) => <AnimatedProgressPreview target={65} state={s} /> },
      { label: 'With ETA', render: () => <ProgressAtom value={45} eta="~12s remaining" /> },
      { label: 'Cancelable', render: () => <ProgressAtom value={60} onCancel={() => {}} /> },
      { label: 'Segmented', render: () => <ProgressAtom segments={[{ value: 30, color: 'var(--token-success)' }, { value: 25, color: 'var(--token-accent)' }, { value: 15, color: 'var(--token-warning)' }]} /> },
    ],
  },
  {
    id: 'skeleton', title: 'Skeleton',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Text', render: () => <SkeletonAtom variant="text" /> },
      { label: 'Title', render: () => <SkeletonAtom variant="title" width={160} /> },
      { label: 'Avatar', render: () => <SkeletonAtom variant="avatar" /> },
      { label: 'Card', render: () => <SkeletonAtom variant="card" /> },
      { label: 'Staggered', render: () => <SkeletonAtom variant="text" lines={4} staggerDelay={100} /> },
    ],
  },
  {
    id: 'divider', title: 'Divider',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Solid', render: () => <div style={{ width: '100%', maxWidth: 240 }}><DividerAtom /></div> },
      { label: 'Labeled', render: () => <div style={{ width: '100%', maxWidth: 240 }}><DividerAtom label="or continue with" /></div> },
      { label: 'Dashed', render: () => <div style={{ width: '100%', maxWidth: 240 }}><DividerAtom variant="dashed" /></div> },
      { label: 'Gradient', render: () => <div style={{ width: '100%', maxWidth: 240 }}><DividerAtom variant="gradient" /></div> },
      { label: 'Section', render: () => <div style={{ width: '100%', maxWidth: 240 }}><DividerAtom variant="section" label="Advanced"><span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Collapsible section content</span></DividerAtom></div> },
    ],
  },
  {
    id: 'kbd', title: 'Keyboard Shortcut',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
    ],
    variants: [
      { label: 'Keys', render: (s) => <div style={{ display: 'flex', gap: 'var(--token-space-2)', alignItems: 'center' }}><KbdAtom state={s}>⌘</KbdAtom><KbdAtom state={s}>K</KbdAtom><KbdAtom state={s}>⇧</KbdAtom><KbdAtom state={s}>Enter</KbdAtom><KbdAtom state={s}>Esc</KbdAtom></div> },
      { label: 'Combo', render: (s) => <div className="flex items-center" style={{ gap: 2 }}><KbdAtom state={s}>⌘</KbdAtom><span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>+</span><KbdAtom state={s}>K</KbdAtom></div> },
      { label: 'Interactive', render: (s) => <div style={{ display: 'flex', gap: 'var(--token-space-2)', alignItems: 'center' }}><InteractiveKbd state={s}>⌘</InteractiveKbd><InteractiveKbd state={s}>K</InteractiveKbd></div> },
    ],
  },
  {
    id: 'code-inline', title: 'Code Inline',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
    ],
    variants: [
      { label: 'Function', render: (s) => <CodeInlineAtom state={s}>model.generate()</CodeInlineAtom> },
      { label: 'Model', render: (s) => <CodeInlineAtom state={s}>gpt-4o</CodeInlineAtom> },
      { label: 'Parameter', render: (s) => <CodeInlineAtom state={s}>temperature=0.7</CodeInlineAtom> },
      { label: 'Copyable', render: (s) => <CopyableCodeInline state={s}>model.generate()</CopyableCodeInline> },
    ],
  },
  {
    id: 'spinner', title: 'Spinner',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Small', render: () => <SpinnerAtom size={14} /> },
      { label: 'Medium', render: () => <SpinnerAtom size={18} /> },
      { label: 'Large', render: () => <SpinnerAtom size={24} /> },
      { label: 'Labeled', render: () => <SpinnerAtom size={16} label="Loading models..." /> },
    ],
  },
  {
    id: 'icons', title: 'Icons',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Set', render: () => (
        <div className="flex flex-wrap" style={{ gap: 2, maxWidth: 200 }}>
          {[Sparkles, Plus, Check, Loader2, ChevronDown, HelpCircle, ExternalLink, ImageIcon, Mic, Brain, Wrench, Eye, MessageSquare].map((Icon, i) => (
            <IconItem key={i} Icon={Icon} />
          ))}
        </div>
      )},
    ],
  },
  {
    id: 'dot', title: 'Dot Indicator',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Default', render: () => <DotAtom label="Online" color="var(--token-success)" /> },
      { label: 'Pulsing', render: () => <DotAtom label="Streaming" color="var(--token-accent)" pulsing /> },
      { label: 'Error', render: () => <DotAtom label="Error" color="var(--token-error)" /> },
      { label: 'Tooltip', render: () => <DotAtom label="Status" color="var(--token-warning)" tooltip="Last active 2m ago" /> },
    ],
  },
  {
    id: 'checkbox', title: 'Checkbox',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'checked', label: 'Checked' },
      { id: 'indeterminate', label: 'Indeterminate' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Unchecked', render: (s) => <CheckboxPreview state={s} defaultChecked={false} defaultLabel="Unchecked" /> },
      { label: 'Checked', render: (s) => <CheckboxPreview state={s} defaultChecked={true} defaultLabel="Checked" /> },
    ],
  },
  {
    id: 'radio', title: 'Radio',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'selected', label: 'Selected' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Group', render: (s) => <RadioGroupPreview state={s} /> },
    ],
  },
  {
    id: 'tooltip', title: 'Tooltip',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'visible', label: 'Visible' },
    ],
    variants: [
      { label: 'Top', render: (s) => <TooltipPreview state={s} label="Tooltip" /> },
      { label: 'Help', render: (s) => <TooltipPreview state={s} label="Click for help" /> },
    ],
  },
  {
    id: 'textarea', title: 'Textarea',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'filled', label: 'Filled' },
      { id: 'disabled', label: 'Disabled' },
      { id: 'error', label: 'Error' },
    ],
    variants: [
      { label: 'Empty', render: (s) => <TextareaPreview state={s} /> },
      { label: 'Filled', render: (s) => <TextareaPreview state={s} defaultValue="Explain the attention mechanism in transformers." /> },
      { label: 'Auto-resize', render: () => <TextareaAtom placeholder="Type to auto-grow..." autoResize style={{ width: '100%', maxWidth: 240 }} /> },
      { label: 'Token Count', render: () => <TextareaAtom placeholder="Token-counted input..." tokenCount={128} maxTokens={4096} style={{ width: '100%', maxWidth: 240 }} /> },
    ],
  },
  {
    id: 'select', title: 'Select',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'open', label: 'Open' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Default', render: (s) => <SelectPreview state={s} /> },
      { label: 'Placeholder', render: (s) => <SelectPreview state={s} showPlaceholder /> },
      { label: 'Searchable', render: (s) => <SelectAtom options={['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3']} searchable state={s} /> },
      { label: 'Grouped', render: (s) => <SelectAtom options={[]} groups={[{ label: 'OpenAI', options: ['GPT-4o', 'GPT-4'] }, { label: 'Anthropic', options: ['Claude 3.5', 'Claude 3'] }]} state={s} /> },
    ],
  },
  {
    id: 'link', title: 'Link',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'active', label: 'Active' },
    ],
    variants: [
      { label: 'Inline', render: (s) => <LinkPreview state={s} label="View documentation →" /> },
      { label: 'External', render: (s) => <LinkPreview state={s} label="API Reference" external /> },
    ],
  },
  {
    id: 'slider', title: 'Slider',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'active', label: 'Active' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Default', render: (s) => <SliderPreview state={s} /> },
      { label: 'With Ticks', render: (s) => <SliderAtom label="Temperature" showTicks tickCount={5} state={s} /> },
    ],
  },
  {
    id: 'thumbnail', title: 'Thumbnail',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'loading', label: 'Loading' },
      { id: 'selected', label: 'Selected' },
    ],
    variants: [
      { label: 'Selected', render: (s) => <ThumbnailPreview state={s} defaultSelected={true} /> },
      { label: 'Default', render: (s) => <ThumbnailPreview state={s} defaultSelected={false} /> },
    ],
  },
  {
    id: 'rating', title: 'Rating',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: '5 Stars', render: (s) => <RatingAtom max={5} state={s} /> },
      { label: '3 Stars', render: (s) => <RatingAtom max={3} state={s} /> },
      { label: 'Feedback', render: (s) => <RatingAtom max={5} showFeedback state={s} /> },
    ],
  },
  {
    id: 'counter', title: 'Counter',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Simple', render: (s) => <CounterAtom state={s} /> },
      { label: 'With Label', render: (s) => <CounterAtom label="Items" state={s} /> },
    ],
  },
  {
    id: 'segmented-control', title: 'Segmented Control',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'hover', label: 'Hover' },
      { id: 'focus', label: 'Focus' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: '3 Options', render: (s) => <SegmentedControlAtom options={['Option 1', 'Option 2', 'Option 3']} state={s} /> },
      { label: '2 Options', render: (s) => <SegmentedControlAtom options={['Option 1', 'Option 2']} state={s} /> },
      { label: 'With Icons', render: (s) => <SegmentedControlAtom options={[{ label: 'Chat', icon: <MessageSquare size={12} /> }, { label: 'Vision', icon: <Eye size={12} /> }, { label: 'Code', icon: <Wrench size={12} /> }]} state={s} /> },
    ],
  },
  {
    id: 'streaming-dots', title: 'Streaming Dots',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Small', render: () => <StreamingDotsAtom size={4} /> },
      { label: 'Medium', render: () => <StreamingDotsAtom size={6} /> },
      { label: 'Large', render: () => <StreamingDotsAtom size={8} /> },
      { label: 'Accent', render: () => <StreamingDotsAtom color="var(--token-accent)" /> },
      { label: 'Fast', render: () => <StreamingDotsAtom speed="fast" /> },
      { label: 'Slow', render: () => <StreamingDotsAtom speed="slow" /> },
      { label: 'Labeled', render: () => <StreamingDotsAtom label="Generating" /> },
    ],
  },
  {
    id: 'bottom-sheet-handle', title: 'Bottom Sheet Handle',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Simple', render: () => <BottomSheetHandleAtom /> },
    ],
  },
  {
    id: 'swipe-action', title: 'Swipe Action',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Hidden', render: () => <SwipeActionAtom><div style={{ padding: 'var(--token-space-3)', fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>Swipe content</div></SwipeActionAtom> },
      { label: 'Revealed', render: () => <SwipeActionAtom revealed><div style={{ padding: 'var(--token-space-3)', fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>Swipe content</div></SwipeActionAtom> },
    ],
  },
  {
    id: 'pull-indicator', title: 'Pull Indicator',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Idle', render: () => <PullIndicatorAtom state="idle" /> },
      { label: 'Pulling', render: () => <PullIndicatorAtom state="pulling" /> },
      { label: 'Refreshing', render: () => <PullIndicatorAtom state="refreshing" /> },
      { label: 'Done', render: () => <PullIndicatorAtom state="done" /> },
      { label: 'Custom', render: () => <PullIndicatorAtom state="refreshing" actionLabel="Syncing models..." /> },
    ],
  },
  /* === NEW EXTRA ATOMS === */
  {
    id: 'color-bar', title: 'Color Bar',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'Multi-segment', render: () => <ColorBarAtom segments={[{ value: 2400, color: 'var(--token-chart-6)' }, { value: 18600, color: 'var(--token-chart-4)' }, { value: 1200, color: 'var(--token-text-tertiary)' }]} total={128000} height={8} /> },
      { label: 'Single', render: () => <ColorBarAtom segments={[{ value: 62, color: 'var(--token-accent)' }]} total={100} height={4} style={{ maxWidth: 200 }} /> },
      { label: 'Full', render: () => <ColorBarAtom segments={[{ value: 30, color: 'var(--token-chart-2)' }, { value: 25, color: 'var(--token-chart-3)' }, { value: 20, color: 'var(--token-chart-5)' }, { value: 15, color: 'var(--token-chart-4)' }]} total={100} height={6} style={{ maxWidth: 200 }} /> },
    ],
  },
  {
    id: 'collapsible', title: 'Collapsible',
    states: [
      { id: 'default', label: 'Default' },
      { id: 'open', label: 'Open' },
      { id: 'closed', label: 'Closed' },
      { id: 'disabled', label: 'Disabled' },
    ],
    variants: [
      { label: 'Default', render: (s) => <CollapsibleAtom title="Model Parameters" state={s} defaultOpen style={{ maxWidth: 280 }}><span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Temperature, top_p, max_tokens, and other generation parameters.</span></CollapsibleAtom> },
    ],
  },
  {
    id: 'legend-item', title: 'Legend Item',
    states: [
      { id: 'default', label: 'Default' },
    ],
    variants: [
      { label: 'With Value', render: () => <LegendItemAtom color="var(--token-chart-6)" label="System" value="2.4k" /> },
      { label: 'No Value', render: () => <LegendItemAtom color="var(--token-chart-4)" label="History" /> },
      { label: 'Multiple', render: () => <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}><LegendItemAtom color="var(--token-chart-6)" label="System" value="2.4k" /><LegendItemAtom color="var(--token-chart-4)" label="History" value="18.6k" /><LegendItemAtom color="var(--token-text-tertiary)" label="User" value="1.2k" /></div> },
    ],
  },
];
/* ——— Gallery cell with variant tabs + state micro-pills ——— */
function AtomGalleryCell({ entry }: { entry: AtomEntry }) {
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeState, setActiveState] = useState(0);
  const hasVariants = entry.variants.length > 1;
  const hasStates = entry.states.length > 1;
  /* When 'default' is selected, pass undefined so atoms use live interaction */
  const currentStateId = entry.states[activeState]?.id || 'default';
  const currentState = currentStateId === 'default' ? undefined : currentStateId;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc((100vh - 56px) / 3)',
        background: 'var(--token-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Preview Area */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ padding: 'var(--token-space-4)', cursor: 'default' }}
      >
        <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: 320, display: 'flex', justifyContent: 'center' }}>
          {entry.variants[activeVariant].render(currentState)}
        </div>
      </div>

      {/* State micro-pills — bottom of preview, above variant tabs */}
      {hasStates && (
        <div
          className="flex flex-wrap shrink-0"
          style={{
            padding: '4px 8px',
            gap: 3,
            marginBottom: 6,
          }}
        >
          {entry.states.map((st, i) => (
            <button
              key={st.id}
              onClick={() => setActiveState(i)}
              className="cursor-pointer"
              style={{
                padding: '0px 5px',
                fontSize: 8,
                lineHeight: '16px',
                fontFamily: 'var(--token-font-mono)',
                letterSpacing: '0.01em',
                border: 'none',
                borderRadius: 'var(--token-radius-full)',
                background: activeState === i ? 'var(--token-bg-tertiary)' : 'transparent',
                color: activeState === i ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)',
                opacity: activeState === i ? 1 : 0.6,
                transition: 'all var(--token-duration-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}

      {/* Variant tabs — above title bar */}
      {hasVariants && (
        <div
          className="flex shrink-0"
          style={{
            borderTop: '1px solid var(--token-border)',
            overflowX: 'auto',
            background: 'var(--token-bg)',
          }}
        >
          {entry.variants.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setActiveVariant(i)}
              className="cursor-pointer shrink-0"
              style={{
                padding: 'var(--token-space-1) var(--token-space-2-5)',
                fontSize: 9,
                fontFamily: 'var(--token-font-sans)',
                fontWeight: activeVariant === i ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
                color: activeVariant === i ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                border: 'none',
                background: activeVariant === i ? 'var(--token-accent-light)' : 'transparent',
                borderTop: activeVariant === i ? '2px solid var(--token-accent)' : '2px solid transparent',
                transition: 'all var(--token-duration-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Title Bar — navigates to detail page */}
      <Link
        to={`/design-system/atom/${entry.id}`}
        className="flex items-center justify-between shrink-0"
        style={{
          height: 40,
          padding: '0 var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
          textDecoration: 'none',
          cursor: 'pointer',
          background: 'var(--token-bg)',
          transition: 'background var(--token-duration-fast)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--token-bg)';
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}>
            {entry.title}
          </span>
          {hasVariants && (
            <span style={{
              fontSize: 9, fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-accent)', background: 'var(--token-accent-light)',
              padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '14px',
            }}>
              {entry.variants.length}
            </span>
          )}
          {hasStates && (
            <span style={{
              fontSize: 9, fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-secondary)', background: 'var(--token-secondary-light)',
              padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '14px',
            }}>
              {entry.states.length}s
            </span>
          )}
        </div>
        <span style={{
          fontSize: 9, color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          Atom
        </span>
      </Link>
    </div>
  );
}

/* ================================================ */
export function AtomsSection() {
  /* Fill empty cells in last row so the grid border-background doesn't show */
  const colBreakpoints = [
    { query: '(min-width: 1920px)', cols: 4 },
    { query: '(min-width: 1440px)', cols: 3 },
    { query: '(min-width: 768px)', cols: 2 },
  ];
  const defaultCols = 1;
  const [cols, setCols] = React.useState(defaultCols);
  React.useEffect(() => {
    const update = () => {
      let matched = defaultCols;
      for (const bp of colBreakpoints) {
        if (window.matchMedia(bp.query).matches) { matched = bp.cols; break; }
      }
      setCols(matched);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const remainder = atomEntries.length % cols;
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
      {atomEntries.map((entry) => (
        <AtomGalleryCell key={entry.id} entry={entry} />
      ))}
      {Array.from({ length: fillerCount }).map((_, i) => (
        <div key={`filler-${i}`} style={{ background: 'var(--token-bg)', minWidth: 0 }} />
      ))}
    </div>
  );
}