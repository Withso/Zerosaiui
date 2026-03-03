/* ================================================
   Design System Detail Page
   Live preview + visual token mapping + composition
   Supports atoms, molecules, and components w/ variants
   ================================================ */
import { useParams, Link } from 'react-router';
import { ArrowLeft, Sparkles, Send, Plus, X, Search, Copy, ThumbsUp, ThumbsDown, RotateCcw, Share2, Check, Settings, Mic, MessageSquare, ChevronRight, TrendingUp, TrendingDown, Loader2, User, Bot, Paperclip, Eye, Download, Star, AlertTriangle, Trash2, Sun, Moon, Columns2, Square, Circle, HelpCircle, ExternalLink, SlidersHorizontal, Image as ImageIcon, ChevronDown, ChevronLeft, MoreVertical, MoreHorizontal, Bell, Info, Shield, Upload, File, Users, Home, Inbox, Layout, AlignLeft, ChevronUp, Type, CreditCard, Minus, Camera } from 'lucide-react';
import { useState, useRef, useLayoutEffect, useCallback, type ComponentType } from 'react';
import { componentRegistry } from '../data/componentRegistry';
import { componentSnapshots } from '../data/componentSnapshots';
import { getComponentDoc, type ComponentDoc, type PropDoc } from '../data/componentDocs';
import { fullComponents } from '../components/ds/ComponentsSection';
import { atomEntries } from '../components/ds/AtomsSection';
import { moleculeEntries } from '../components/ds/MoleculesSection';
import {
  DSButton, DSBadge, DSAvatar, DSInput, DSToggle, DSTag,
  DSKbd, DSCodeInline, DSCheckbox, DSSlider, DSSelect,
  DSDivider, DSProgress, DSSkeleton, DSSpinner,
} from '../components/ds/atoms';

/* ——————————————————————————————————————————
   Types — 4-Level Token Architecture
   L1: Raw Value (#4f6d80)
   L2: Primitive  (--moonstone-500)
   L3: Semantic   (--token-accent)
   L4: Component  (--btn-bg-primary)
   —————————————————————————————————————————— */
interface TokenLayer {
  layer: string;
  token: string;          // L3 semantic token (used for highlighting + MCT isolation)
  compToken?: string;     // L4 component-level token name (optional — auto = L3)
  primitive?: string;     // L2 primitive palette reference (auto-resolved from L3)
  lightVal: string;       // L1 raw light value
  darkVal: string;        // L1 raw dark value
  purpose: string;
  category: 'surface' | 'text' | 'border' | 'spacing' | 'shape' | 'motion' | 'shadow';
}

interface VariantInfo {
  id: string;
  label: string;
  useCase: string;
  tokenAdaptations: string;
  diffs: string[];
  tokens: TokenLayer[];
}

interface StateInfo {
  id: string;
  label: string;
  description: string;
  tokens: TokenLayer[];
}

interface DSEntry {
  id: string;
  name: string;
  type: 'atom' | 'molecule' | 'component';
  tag?: 'common' | 'ai';
  desc: string;
  usage: string;
  figma?: string;
  tokens: TokenLayer[];
  composition?: string[];
  variants?: VariantInfo[];
  states?: StateInfo[];
}

/* ——————————————————————————————————————————
   Token category config
   —————————————————————————————————————————— */
const catMeta: Record<string, { label: string; color: string; dot: string }> = {
  surface: { label: 'Surface', color: 'var(--token-accent)', dot: 'var(--token-accent)' },
  text: { label: 'Typography', color: 'var(--token-secondary)', dot: 'var(--token-secondary)' },
  border: { label: 'Border', color: 'var(--token-tertiary)', dot: 'var(--token-tertiary)' },
  spacing: { label: 'Spacing', color: 'var(--token-chart-3)', dot: 'var(--token-chart-3)' },
  shape: { label: 'Shape', color: 'var(--token-chart-6)', dot: 'var(--token-chart-6)' },
  motion: { label: 'Motion', color: 'var(--token-chart-4)', dot: 'var(--token-chart-4)' },
  shadow: { label: 'Elevation', color: 'var(--token-chart-2)', dot: 'var(--token-chart-2)' },
};

/* ——————————————————————————————————————————
   LIVE PREVIEW RENDERERS — Atoms (State-aware)
   —————————————————————————————————————————— */
function ButtonPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-wrap items-center" style={{ gap: 'var(--token-space-3)' }}>
      <DSButton variant="primary" icon={<Sparkles size={12}/>} state={activeState}>Generate</DSButton>
      <DSButton variant="secondary" state={activeState}>Secondary</DSButton>
      <DSButton variant="outline" state={activeState}>Outline</DSButton>
      <DSButton variant="ghost" state={activeState}>Ghost</DSButton>
      <DSButton variant="destructive" state={activeState}>Delete</DSButton>
      <DSButton variant="icon" icon={<Plus size={14}/>} state={activeState} />
    </div>
  );
}

function BadgePreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 'var(--token-space-2)' }}>
      <DSBadge variant="default" state={activeState}>Default</DSBadge>
      <DSBadge variant="ai" state={activeState}>AI</DSBadge>
      <DSBadge variant="secondary" state={activeState}>Sunstone</DSBadge>
      <DSBadge variant="tertiary" state={activeState}>Olivine</DSBadge>
      <DSBadge variant="success" state={activeState}>Success</DSBadge>
      <DSBadge variant="error" state={activeState}>Error</DSBadge>
      <DSBadge variant="count" state={activeState}>12</DSBadge>
    </div>
  );
}

function AvatarPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
      {[24,32,40].map(s => <DSAvatar key={`ai-${s}`} variant="ai" size={s} state={activeState} />)}
      {[24,32,40].map(s => <DSAvatar key={`u-${s}`} variant="user" size={s} state={activeState} />)}
      <DSAvatar variant="system" size={32} state={activeState} />
    </div>
  );
}

function InputPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', maxWidth: 280 }}>
      <DSInput variant="text" placeholder="Type something..." state={activeState} />
      <DSInput variant="search" placeholder="Search..." state={activeState} />
      {activeState === 'error' && <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)', fontFamily: 'var(--token-font-mono)' }}>This field is required</span>}
    </div>
  );
}

function TogglePreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
      <DSToggle defaultOn={false} state={activeState} />
      <DSToggle defaultOn={true} state={activeState} />
    </div>
  );
}

function TagPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      <DSTag state={activeState}>Default</DSTag>
      <DSTag removable state={activeState}>Removable</DSTag>
      <DSTag color="var(--token-accent)" state={activeState}>Moonstone</DSTag>
      <DSTag color="var(--token-secondary)" state={activeState}>Sunstone</DSTag>
      <DSTag color="var(--token-tertiary)" state={activeState}>Olivine</DSTag>
    </div>
  );
}

function ProgressPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 10, width: 220 }}>
      {[25, 65, 100].map((v) => (
        <div key={v} className="flex items-center" style={{ gap: 8 }}>
          <DSProgress value={v} state={activeState} style={{ flex: 1, width: 'auto' }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', minWidth: 24, textAlign: 'right' }}>{activeState === 'indeterminate' ? '...' : `${v}%`}</span>
        </div>
      ))}
    </div>
  );
}

function SkeletonPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-4)' }}>
      <DSSkeleton variant="avatar" />
      <DSSkeleton variant="text" width={140} />
      <DSSkeleton variant="card" width={100} height={56} />
    </div>
  );
}

function DividerPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: 16, width: '100%', maxWidth: 320 }}>
      <DSDivider />
      <DSDivider label="or continue with" />
      <DSDivider variant="dashed" />
      <DSDivider variant="gradient" />
      <DSDivider variant="dashed" label="Section" />
    </div>
  );
}

function DotPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isPulsing = st === 'pulsing';
  return (
    <div className="flex flex-wrap" style={{ gap: 12 }}>
      {[{ l: 'Online', c: 'var(--token-tertiary)' }, { l: 'Busy', c: 'var(--token-warning)' }, { l: 'Error', c: 'var(--token-error)' }, { l: 'Active', c: 'var(--token-accent)' }].map(d => (
        <div key={d.l} className="flex items-center" style={{ gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 'var(--token-radius-full)', background: d.c, boxShadow: isPulsing ? `0 0 0 3px color-mix(in srgb, ${d.c} 25%, transparent)` : 'none', animation: isPulsing ? 'token-pulse 1.5s ease-in-out infinite' : 'none' }}/>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

function KbdPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex items-center" style={{ gap: 4 }}>
      <DSKbd state={activeState}>⌘</DSKbd>
      <span style={{ fontSize: 8, color: 'var(--token-text-disabled)' }}>+</span>
      <DSKbd state={activeState}>K</DSKbd>
      <span style={{ width: 12 }}/>
      <DSKbd state={activeState}>⇧</DSKbd>
      <DSKbd state={activeState}>Enter</DSKbd>
      <DSKbd state={activeState}>Esc</DSKbd>
    </div>
  );
}

function CodeInlinePreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      <DSCodeInline state={activeState}>model.generate()</DSCodeInline>
      <DSCodeInline state={activeState}>gpt-4o</DSCodeInline>
      <DSCodeInline state={activeState}>temperature=0.7</DSCodeInline>
    </div>
  );
}

function SpinnerPreview({ activeState }: { activeState?: string }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <DSSpinner size={14} />
      <DSSpinner size={18} />
      <DSSpinner size={24} />
    </div>
  );
}

function DetailIconItem({ Icon }: { Icon: ComponentType<{ size: number }> }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32, height: 32, borderRadius: 'var(--token-radius-sm)',
        color: hovered ? 'var(--token-accent)' : 'var(--token-text-secondary)',
        background: hovered ? 'var(--token-bg-hover)' : 'transparent',
        transition: 'all var(--token-duration-fast)', cursor: 'pointer',
      }}
    >
      <Icon size={16}/>
    </div>
  );
}

function IconsPreview({ activeState }: { activeState?: string }) {
  const icons = [Sparkles, Send, Copy, Search, Check, X, Settings, Mic, ThumbsUp, ThumbsDown, Eye, Download, Share2, RotateCcw, Star, Bot, AlertTriangle, Trash2, Plus, Paperclip];
  return (
    <div className="flex flex-wrap" style={{ gap: 2 }}>
      {icons.map((I, i) => <DetailIconItem key={i} Icon={I} />)}
    </div>
  );
}

/* ——— NEW Atom preview renderers (Tier 1 + Tier 2) ——— */
function CheckboxPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isFocus = st === 'focus';
  const isChecked = st === 'checked';
  const isIndeterminate = st === 'indeterminate';
  const isDisabled = st === 'disabled';
  const Box = ({ checked, indet }: { checked?: boolean; indet?: boolean }) => (
    <div className="flex items-center" style={{ gap: 8 }}>
      <div className="flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: 'var(--token-radius-sm)', border: checked || indet ? 'none' : `1.5px solid ${isHover ? 'var(--token-border-strong)' : 'var(--token-border)'}`, background: checked || indet ? 'var(--token-accent)' : 'var(--token-bg)', boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none', opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 120ms' }}>
        {checked && <Check size={10} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }}/>}
        {indet && <Minus size={10} style={{ color: 'var(--token-accent-fg)', strokeWidth: 3 }}/>}
      </div>
      <span style={{ fontSize: 'var(--token-text-sm)', color: isDisabled ? 'var(--token-text-disabled)' : 'var(--token-text-primary)' }}>{indet ? 'Partial' : checked ? 'Selected' : 'Option'}</span>
    </div>
  );
  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <Box checked={isChecked || isIndeterminate ? false : undefined} />
      <Box checked={isChecked || true} />
      <Box indet={isIndeterminate || undefined} />
    </div>
  );
}

function RadioPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isFocus = st === 'focus';
  const isSelected = st === 'selected';
  const isDisabled = st === 'disabled';
  const R = ({ selected, label }: { selected?: boolean; label: string }) => (
    <div className="flex items-center" style={{ gap: 8 }}>
      <div className="flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: 'var(--token-radius-full)', border: `1.5px solid ${selected ? 'var(--token-accent)' : isHover ? 'var(--token-border-strong)' : 'var(--token-border)'}`, background: 'var(--token-bg)', boxShadow: isFocus && selected ? '0 0 0 3px var(--token-accent-muted)' : 'none', opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 120ms' }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: 'var(--token-radius-full)', background: 'var(--token-accent)' }}/>}
      </div>
      <span style={{ fontSize: 'var(--token-text-sm)', color: isDisabled ? 'var(--token-text-disabled)' : 'var(--token-text-primary)' }}>{label}</span>
    </div>
  );
  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <R selected={isSelected || true} label="GPT-4o" />
      <R selected={false} label="Claude 3.5" />
      <R selected={false} label="Gemini Pro" />
    </div>
  );
}

function TooltipPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isVisible = st === 'visible';
  return (
    <div className="flex flex-col items-center" style={{ gap: 16 }}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        {isVisible && (
          <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6, pointerEvents: 'none' }}>
            <div style={{ padding: '4px 10px', borderRadius: 'var(--token-radius-md)', background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap', boxShadow: 'var(--token-shadow-md)' }}>Copy to clipboard</div>
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--token-text-primary)' }}/>
          </div>
        )}
        <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: isVisible ? 'var(--token-bg-hover)' : 'transparent', color: 'var(--token-text-secondary)', cursor: 'pointer', transition: 'all 120ms' }}><Copy size={14}/></button>
      </div>
      <div className="flex items-center" style={{ gap: 12 }}>
        {[{ icon: <ThumbsUp size={13}/>, tip: 'Like' }, { icon: <Share2 size={13}/>, tip: 'Share' }, { icon: <HelpCircle size={13}/>, tip: 'Help' }].map((b, i) => (
          <div key={i} style={{ position: 'relative', display: 'inline-flex' }}>
            {isVisible && (
              <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 }}>
                <div style={{ padding: '3px 8px', borderRadius: 'var(--token-radius-sm)', background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)', fontSize: 9, fontFamily: 'var(--token-font-mono)', whiteSpace: 'nowrap', boxShadow: 'var(--token-shadow-sm)' }}>{b.tip}</div>
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '3px solid var(--token-text-primary)' }}/>
              </div>
            )}
            <span style={{ color: 'var(--token-text-tertiary)' }}>{b.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextareaPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isFocus = st === 'focus';
  const isHover = st === 'hover';
  const isFilled = st === 'filled';
  const isDisabled = st === 'disabled';
  const isError = st === 'error';
  const borderColor = isError ? 'var(--token-error)' : isFocus ? 'var(--token-accent)' : isHover ? 'var(--token-border-strong)' : 'var(--token-border)';
  const ring = isFocus ? '0 0 0 3px var(--token-accent-muted)' : isError ? '0 0 0 3px rgba(229,72,77,.15)' : 'none';
  return (
    <div className="flex flex-col" style={{ gap: 6, maxWidth: 300 }}>
      <div style={{ padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 'var(--token-radius-md)', background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)', boxShadow: ring, opacity: isDisabled ? 0.5 : 1, transition: 'all 120ms', minHeight: 80 }}>
        <div style={{ fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: isFilled || isFocus ? 'var(--token-text-primary)' : 'var(--token-text-disabled)', lineHeight: 'var(--token-leading-relaxed)' }}>
          {isFilled || isFocus ? 'Explain the transformer architecture in detail, including the multi-head attention mechanism...' : 'Enter your prompt here...'}
          {isFocus && <span style={{ borderRight: '2px solid var(--token-accent)', animation: 'token-blink 1s step-end infinite' }}>&nbsp;</span>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 'var(--token-text-2xs)', color: isError ? 'var(--token-error)' : 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{isError ? 'Prompt cannot be empty' : 'Max 4000 characters'}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{isFilled || isFocus ? '87/4000' : '0/4000'}</span>
      </div>
    </div>
  );
}

function SelectPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isFocus = st === 'focus';
  const isOpen = st === 'open';
  const isDisabled = st === 'disabled';
  const borderColor = isFocus || isOpen ? 'var(--token-accent)' : isHover ? 'var(--token-border-strong)' : 'var(--token-border)';
  const ring = isFocus || isOpen ? '0 0 0 3px var(--token-accent-muted)' : 'none';
  return (
    <div className="flex flex-col" style={{ gap: 4, maxWidth: 240, position: 'relative' }}>
      <div className="flex items-center" style={{ gap: 8, padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 'var(--token-radius-md)', background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)', boxShadow: ring, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 120ms' }}>
        <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>GPT-4o</span>
        <ChevronDown size={13} style={{ color: 'var(--token-text-disabled)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}/>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', zIndex: 10, overflow: 'hidden' }}>
          {['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3'].map((m, i) => (
            <div key={m} style={{ padding: '6px 12px', fontSize: 'var(--token-text-sm)', color: i === 0 ? 'var(--token-accent)' : 'var(--token-text-primary)', background: i === 0 ? 'var(--token-accent-muted)' : 'transparent', cursor: 'pointer' }}>{m}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isFocus = st === 'focus';
  const isVisited = st === 'visited';
  const isActive = st === 'active';
  const color = isVisited ? 'var(--token-tertiary)' : isHover || isActive ? 'var(--token-accent-hover)' : 'var(--token-accent)';
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <span style={{ fontSize: 'var(--token-text-sm)', color, textDecoration: isHover ? 'underline' : 'none', cursor: 'pointer', boxShadow: isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none', borderRadius: 2, padding: '0 2px', transition: 'all 120ms' }}>View documentation →</span>
      <div className="flex items-center" style={{ gap: 4 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color, textDecoration: isHover ? 'underline' : 'none', cursor: 'pointer', transition: 'all 120ms' }}>OpenAI API Reference</span>
        <ExternalLink size={11} style={{ color }}/>
      </div>
      <span style={{ fontSize: 'var(--token-text-xs)', color: isHover ? 'var(--token-accent)' : 'var(--token-text-secondary)', textDecoration: isHover ? 'underline' : 'none', cursor: 'pointer', transition: 'color 120ms' }}>Learn more about tokens</span>
    </div>
  );
}

function SliderPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  const isDisabled = st === 'disabled';
  const val = 70;
  return (
    <div className="flex flex-col" style={{ gap: 16, maxWidth: 260 }}>
      <div className="flex flex-col" style={{ gap: 6 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Temperature</span>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>0.7</span>
        </div>
        <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center', opacity: isDisabled ? 0.4 : 1 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 'var(--token-radius-full)', background: 'var(--token-bg-tertiary)' }}/>
          <div style={{ position: 'absolute', left: 0, width: `${val}%`, height: 4, borderRadius: 'var(--token-radius-full)', background: 'linear-gradient(90deg, var(--token-accent), var(--token-secondary))' }}/>
          <div style={{ position: 'absolute', left: `${val}%`, transform: 'translateX(-50%)', width: isActive ? 18 : 14, height: isActive ? 18 : 14, borderRadius: 'var(--token-radius-full)', background: 'var(--token-accent)', border: '2px solid #fff', boxShadow: isHover ? '0 0 0 4px var(--token-accent-muted)' : 'var(--token-shadow-sm)', cursor: isDisabled ? 'not-allowed' : 'grab', transition: 'all 120ms' }}/>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>0.0</span>
          <span style={{ fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>2.0</span>
        </div>
      </div>
    </div>
  );
}

function ThumbnailPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isLoading = st === 'loading';
  const isSelected = st === 'selected';
  const shimmer = 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-secondary) 50%, var(--token-bg-tertiary) 75%)';
  return (
    <div className="flex" style={{ gap: 10 }}>
      {[64, 80, 64].map((s, i) => (
        <div key={i} className="flex items-center justify-center" style={{ width: s, height: s, borderRadius: 'var(--token-radius-md)', background: isLoading ? shimmer : 'var(--token-bg-tertiary)', backgroundSize: isLoading ? '200% 100%' : undefined, animation: isLoading ? 'token-shimmer 1.5s ease-in-out infinite' : undefined, border: isSelected && i === 0 ? '2px solid var(--token-accent)' : '1px solid var(--token-border)', boxShadow: isSelected && i === 0 ? '0 0 0 3px var(--token-accent-muted)' : isHover && i === 1 ? '0 0 0 3px var(--token-border)' : 'none', overflow: 'hidden', cursor: 'pointer', transition: 'all 120ms' }}>
          {!isLoading && <ImageIcon size={s * 0.35} style={{ color: 'var(--token-text-disabled)' }}/>}
        </div>
      ))}
    </div>
  );
}

/* ——— Molecule preview renderers (State-aware) ——— */
function SearchBarPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isFocus = st === 'focus';
  const isFilled = st === 'filled';
  const isDisabled = st === 'disabled';
  const borderColor = isFocus ? 'var(--token-accent)' : 'var(--token-border)';
  const ring = isFocus ? '0 0 0 3px var(--token-accent-muted)' : 'none';
  return (
    <div className="flex items-center" style={{ gap: 8, padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 'var(--token-radius-md)', background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)', maxWidth: 320, boxShadow: ring, opacity: isDisabled ? 0.5 : 1, transition: 'all 120ms' }}>
      <Search size={13} style={{ color: isFocus ? 'var(--token-accent)' : 'var(--token-text-disabled)', flexShrink: 0 }}/>
      {isFilled || isFocus ? (
        <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{isFilled ? 'button component' : ''}{isFocus && <span style={{ borderRight: '2px solid var(--token-accent)', animation: 'token-blink 1s step-end infinite' }}>&nbsp;</span>}</span>
      ) : (
        <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-disabled)' }}>Search components...</span>
      )}
      {isFilled ? (
        <button style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--token-text-disabled)', display: 'flex' }}><X size={13}/></button>
      ) : (
        <div className="flex items-center" style={{ gap: 2 }}>
          <kbd style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)' }}>⌘</kbd>
          <kbd style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-sm)' }}>K</kbd>
        </div>
      )}
    </div>
  );
}

function ListItemPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  const isDisabled = st === 'disabled';
  const items = [
    { title: 'Explain transformers', meta: '2m ago', active: true },
    { title: 'Debug Python code', meta: '1h ago', active: false },
    { title: 'Write unit tests', meta: '3h ago', active: false },
  ];
  return (
    <div className="flex flex-col" style={{ gap: 2, maxWidth: 300, opacity: isDisabled ? 0.5 : 1 }}>
      {items.map((it, i) => {
        const rowActive = isActive ? (i === 0) : it.active;
        const rowHover = isHover && i === 1;
        return (
          <div key={it.title} className="flex items-center" style={{ gap: 12, padding: '8px 12px', borderRadius: 'var(--token-radius-md)', background: rowActive ? 'var(--token-bg-hover)' : rowHover ? 'var(--token-bg-hover)' : 'transparent', cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'background 100ms' }}>
            <MessageSquare size={14} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }}/>
            <span className="flex-1 truncate" style={{ fontSize: 'var(--token-text-sm)', color: rowActive ? 'var(--token-text-primary)' : 'var(--token-text-secondary)' }}>{it.title}</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', flexShrink: 0 }}>{it.meta}</span>
            <ChevronRight size={12} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }}/>
          </div>
        );
      })}
    </div>
  );
}

function MessageBubblePreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isStreaming = st === 'streaming';
  const isError = st === 'error';
  return (
    <div className="flex flex-col" style={{ gap: 12, maxWidth: 360 }}>
      <div className="flex" style={{ justifyContent: 'flex-end' }}>
        <div style={{ padding: '10px 12px', borderRadius: '12px 12px 4px 12px', background: 'var(--token-user-bubble)', color: 'var(--token-user-bubble-text)', fontSize: 'var(--token-text-sm)', maxWidth: '80%' }}>How does attention work?</div>
      </div>
      <div className="flex" style={{ gap: 10 }}>
        <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 'var(--token-radius-full)', background: isError ? 'var(--token-error)' : 'var(--token-accent)' }}>{isError ? <AlertTriangle size={13} style={{ color: 'var(--token-text-inverse)' }}/> : <Sparkles size={13} style={{ color: 'var(--token-accent-fg)' }}/>}</div>
        <div style={{ padding: '10px 12px', borderRadius: '12px 12px 12px 4px', background: isError ? 'var(--token-error-light)' : 'var(--token-bg-secondary)', border: `1px solid ${isError ? 'var(--token-error)' : 'var(--token-border)'}`, color: isError ? 'var(--token-error)' : 'var(--token-text-primary)', fontSize: 'var(--token-text-sm)', maxWidth: '80%' }}>
          {isError ? 'An error occurred. Please try again.' : isStreaming ? (<span>Attention computes weighted<span style={{ borderRight: '2px solid var(--token-accent)', animation: 'token-blink 1s step-end infinite', marginLeft: 1 }}>&nbsp;</span></span>) : 'Attention computes weighted relationships between all positions...'}
        </div>
      </div>
    </div>
  );
}

function ToolbarPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  return (
    <div className="inline-flex items-center" style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden' }}>
      {[Copy, ThumbsUp, ThumbsDown, RotateCcw, Share2].map((I, i) => {
        const isHoveredBtn = isHover && i === 0;
        const isActiveBtn = isActive && i === 1;
        return (
          <button key={i} className="flex items-center justify-center cursor-pointer" style={{ width: 34, height: 32, border: 'none', background: isHoveredBtn ? 'var(--token-bg-hover)' : isActiveBtn ? 'var(--token-bg-active)' : 'transparent', color: isHoveredBtn ? 'var(--token-text-primary)' : isActiveBtn ? 'var(--token-accent)' : 'var(--token-text-tertiary)', borderLeft: i > 0 ? '1px solid var(--token-border)' : 'none', transition: 'all 100ms' }}><I size={13}/></button>
        );
      })}
    </div>
  );
}

function StatPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isLoading = st === 'loading';
  const shimmer = 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-secondary) 50%, var(--token-bg-tertiary) 75%)';
  return (
    <div className="flex" style={{ gap: 12 }}>
      {[{ l: 'Tokens', v: '24.5k', t: '+12%', up: true }, { l: 'Latency', v: '340ms', t: '-8%', up: false }].map(s => (
        <div key={s.l} className="flex flex-col" style={{ gap: 4, padding: 12, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', minWidth: 110 }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</span>
          {isLoading ? (
            <div className="flex flex-col" style={{ gap: 4 }}>
              <div style={{ height: 20, width: 60, borderRadius: 4, background: shimmer, backgroundSize: '200% 100%', animation: 'token-shimmer 1.5s ease-in-out infinite' }}/>
              <div style={{ height: 10, width: 40, borderRadius: 4, background: shimmer, backgroundSize: '200% 100%', animation: 'token-shimmer 1.5s ease-in-out infinite' }}/>
            </div>
          ) : (
            <div className="flex items-end" style={{ gap: 6 }}>
              <span style={{ fontSize: 'var(--token-text-2xl)', fontWeight: 600, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)', lineHeight: 1 }}>{s.v}</span>
              <span className="flex items-center" style={{ gap: 2, fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: s.up ? 'var(--token-success)' : 'var(--token-error)', paddingBottom: 2 }}>{s.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}{s.t}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FormFieldPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isFocus = st === 'focus';
  const isError = st === 'error';
  const isDisabled = st === 'disabled';
  const borderColor = isError ? 'var(--token-error)' : isFocus ? 'var(--token-accent)' : 'var(--token-border)';
  const ring = isFocus ? '0 0 0 3px var(--token-accent-muted)' : isError ? '0 0 0 3px rgba(229,72,77,.15)' : 'none';
  return (
    <div className="flex flex-col" style={{ gap: 6, maxWidth: 260 }}>
      <label style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', fontFamily: 'var(--token-font-sans)' }}>Model Name <span style={{ color: 'var(--token-error)' }}>*</span></label>
      <div className="flex items-center" style={{ gap: 8, padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 'var(--token-radius-md)', background: isDisabled ? 'var(--token-bg-tertiary)' : 'var(--token-bg)', boxShadow: ring, opacity: isDisabled ? 0.5 : 1, transition: 'all 120ms' }}>
        <input type="text" placeholder="e.g. gpt-4o" value={isFocus ? 'gpt-4o' : ''} readOnly style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)', color: 'var(--token-text-primary)', width: '100%' }}/>
      </div>
      {isError ? (
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)', fontFamily: 'var(--token-font-mono)' }}>Model name is required</span>
      ) : (
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>Enter the model identifier</span>
      )}
    </div>
  );
}

function TabBarPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const tabs = ['Models', 'Settings', 'History', 'Logs'];
  return (
    <div style={{ borderBottom: '1px solid var(--token-border)', maxWidth: 320 }}>
      <div className="flex" style={{ gap: 0 }}>
        {tabs.map((t, i) => {
          const isActive = i === 0;
          const isHovered = isHover && i === 1;
          return (
            <button key={t} className="cursor-pointer" style={{ padding: '8px 14px', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)', fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--token-text-primary)' : isHovered ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)', border: 'none', background: 'transparent', borderBottom: isActive ? '2px solid var(--token-accent)' : '2px solid transparent', transition: 'all 120ms' }}>{t}</button>
          );
        })}
      </div>
    </div>
  );
}

function HeaderBarPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  return (
    <div className="flex items-center" style={{ padding: '10px 16px', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', maxWidth: 380, gap: 10 }}>
      <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 500, color: 'var(--token-text-primary)', flex: 1 }}>Conversation</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 8px', borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-2xs)', fontWeight: 500, fontFamily: 'var(--token-font-mono)', background: 'var(--token-accent-light)', color: 'var(--token-accent)' }}><Sparkles size={8}/>AI</span>
      <button className="flex items-center justify-center cursor-pointer" style={{ width: 28, height: 28, borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: 'var(--token-text-tertiary)', transition: 'all 120ms' }}><Settings size={13}/></button>
      <button className="flex items-center justify-center cursor-pointer" style={{ width: 28, height: 28, borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: 'var(--token-text-tertiary)', transition: 'all 120ms' }}><X size={13}/></button>
    </div>
  );
}

function StepIndicatorPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const steps = [
    { label: 'Parse input', status: 'done' as const },
    { label: 'Analyze context', status: st === 'complete' ? 'done' as const : 'active' as const },
    { label: 'Generate output', status: st === 'complete' ? 'done' as const : 'pending' as const },
  ];
  return (
    <div className="flex items-center" style={{ gap: 0, maxWidth: 340 }}>
      {steps.map((s, i) => {
        const color = s.status === 'done' ? 'var(--token-step-done)' : s.status === 'active' ? 'var(--token-step-active)' : 'var(--token-step-pending)';
        return (
          <div key={s.label} className="flex items-center" style={{ gap: 8, flex: 1 }}>
            <div className="flex items-center justify-center shrink-0" style={{ width: 22, height: 22, borderRadius: 'var(--token-radius-full)', background: color, color: 'var(--token-text-inverse)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', fontWeight: 500 }}>{s.status === 'done' ? <Check size={10}/> : i + 1}</div>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: s.status === 'pending' ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)', whiteSpace: 'nowrap' }}>{s.label}</span>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: s.status === 'done' ? 'var(--token-step-done)' : 'var(--token-step-line)', minWidth: 16, marginLeft: 4 }}/>}
          </div>
        );
      })}
    </div>
  );
}

function ChipGroupPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const chips = ['GPT-4o', 'Claude 3', 'Gemini', 'Llama 3', 'Mistral'];
  const selected = st === 'all-selected' ? [0,1,2,3,4] : st === 'none' ? [] : [0, 2];
  return (
    <div className="flex flex-wrap" style={{ gap: 'var(--token-space-2)' }}>
      {chips.map((c, i) => {
        const isSel = selected.includes(i);
        const isHover = st === 'hover' && i === 1;
        return (
          <span key={c} className="inline-flex items-center cursor-pointer" style={{ padding: '3px 10px', borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', border: isSel ? '1px solid var(--token-accent)' : '1px solid var(--token-border)', background: isSel ? 'var(--token-accent-light)' : isHover ? 'var(--token-bg-hover)' : 'transparent', color: isSel ? 'var(--token-accent)' : 'var(--token-text-secondary)', transition: 'all 120ms' }}>{c}</span>
        );
      })}
    </div>
  );
}

function EmptyStatePreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  return (
    <div className="flex flex-col items-center" style={{ padding: 'var(--token-space-6)', border: '1px dashed var(--token-border)', borderRadius: 'var(--token-radius-lg)', maxWidth: 300, gap: 12 }}>
      <MessageSquare size={28} style={{ color: 'var(--token-text-disabled)' }}/>
      <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)', textAlign: 'center' }}>No conversations yet</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', textAlign: 'center' }}>Start a new chat to begin</span>
      <button className="cursor-pointer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)', borderRadius: 'var(--token-radius-md)', border: 'none', background: isHover ? 'var(--token-accent-hover)' : 'var(--token-accent)', color: 'var(--token-accent-fg)', transition: 'all 120ms' }}><Plus size={12}/>New Chat</button>
    </div>
  );
}

function ToggleRowPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isDisabled = st === 'disabled';
  const [streaming, setStreaming] = useState(true);
  const [memory, setMemory] = useState(false);
  const rows = [
    { label: 'Streaming mode', desc: 'Show tokens as they are generated', on: st === 'all-on' ? true : st === 'all-off' ? false : streaming, toggle: () => setStreaming(!streaming) },
    { label: 'Memory', desc: 'Remember context across chats', on: st === 'all-on' ? true : st === 'all-off' ? false : memory, toggle: () => setMemory(!memory) },
  ];
  return (
    <div className="flex flex-col" style={{ maxWidth: 300, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', overflow: 'hidden' }}>
      {rows.map((r, i) => (
        <div key={r.label} className="flex items-center" style={{ padding: '12px 16px', borderBottom: i < rows.length - 1 ? '1px solid var(--token-border)' : 'none', opacity: isDisabled ? 0.5 : 1 }}>
          <div className="flex flex-col flex-1" style={{ gap: 2 }}>
            <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{r.label}</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{r.desc}</span>
          </div>
          <button onClick={isDisabled ? undefined : r.toggle} className={isDisabled ? '' : 'cursor-pointer'} style={{ width: 36, height: 20, borderRadius: 'var(--token-radius-full)', border: 'none', padding: 2, background: r.on ? 'var(--token-accent)' : 'var(--token-bg-tertiary)', transition: 'background 120ms', display: 'flex', alignItems: 'center', cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
            <div style={{ width: 16, height: 16, borderRadius: 'var(--token-radius-full)', background: '#fff', boxShadow: 'var(--token-shadow-xs)', transform: r.on ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 120ms' }}/>
          </button>
        </div>
      ))}
    </div>
  );
}

function BreadcrumbPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const segments = ['Settings', 'Models', 'GPT-4o'];
  return (
    <div className="flex items-center" style={{ gap: 6 }}>
      {segments.map((s, i) => {
        const isLast = i === segments.length - 1;
        const isHovered = isHover && i === 0;
        return (
          <div key={s} className="flex items-center" style={{ gap: 6 }}>
            <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)', color: isLast ? 'var(--token-text-primary)' : isHovered ? 'var(--token-accent)' : 'var(--token-text-tertiary)', cursor: isLast ? 'default' : 'pointer', textDecoration: isHovered ? 'underline' : 'none', transition: 'color 120ms' }}>{s}</span>
            {!isLast && <ChevronRight size={11} style={{ color: 'var(--token-text-disabled)' }}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ——— NEW Molecule preview renderers (Tier 1 + Tier 2) ——— */
function DropdownMenuPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  const isDisabledItem = st === 'disabled-item';
  const items = [
    { label: 'Copy', icon: <Copy size={12}/> },
    { label: 'Share', icon: <Share2 size={12}/> },
    { label: 'Download', icon: <Download size={12}/>, divider: true },
    { label: 'Delete', icon: <Trash2 size={12}/>, danger: true },
  ];
  return (
    <div style={{ width: 180, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', overflow: 'hidden' }}>
      {items.map((it, i) => (
        <div key={it.label}>
          {it.divider && <div style={{ height: 1, background: 'var(--token-border)', margin: '4px 0' }}/>}
          <div className="flex items-center" style={{ gap: 8, padding: '6px 12px', fontSize: 'var(--token-text-sm)', color: it.danger ? 'var(--token-error)' : isDisabledItem && i === 2 ? 'var(--token-text-disabled)' : isHover && i === 0 ? 'var(--token-text-primary)' : isActive && i === 1 ? 'var(--token-accent)' : 'var(--token-text-secondary)', background: isHover && i === 0 ? 'var(--token-bg-hover)' : isActive && i === 1 ? 'var(--token-accent-muted)' : 'transparent', cursor: isDisabledItem && i === 2 ? 'not-allowed' : 'pointer', opacity: isDisabledItem && i === 2 ? 0.4 : 1, transition: 'all 100ms' }}>
            {it.icon}<span>{it.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToastPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const configs: Record<string, { bg: string; border: string; icon: JSX.Element; text: string; color: string }> = {
    default: { bg: 'var(--token-bg)', border: 'var(--token-border)', icon: <Info size={14}/>, text: 'Action completed', color: 'var(--token-text-primary)' },
    success: { bg: 'var(--token-bg)', border: 'var(--token-success)', icon: <Check size={14}/>, text: 'Message sent successfully', color: 'var(--token-success)' },
    error: { bg: 'var(--token-bg)', border: 'var(--token-error)', icon: <AlertTriangle size={14}/>, text: 'Failed to send message', color: 'var(--token-error)' },
    warning: { bg: 'var(--token-bg)', border: 'var(--token-warning)', icon: <AlertTriangle size={14}/>, text: 'API rate limit approaching', color: 'var(--token-warning)' },
    info: { bg: 'var(--token-bg)', border: 'var(--token-accent)', icon: <Info size={14}/>, text: 'New model available', color: 'var(--token-accent)' },
  };
  const c = configs[st] || configs.default;
  return (
    <div className="flex items-start" style={{ gap: 10, padding: '12px 14px', border: `1px solid ${c.border}`, borderLeft: `3px solid ${c.border}`, borderRadius: 'var(--token-radius-md)', background: c.bg, boxShadow: 'var(--token-shadow-lg)', maxWidth: 320 }}>
      <span style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
      <div className="flex flex-col flex-1" style={{ gap: 2 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{c.text}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Just now</span>
      </div>
      <button style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--token-text-disabled)', display: 'flex' }}><X size={12}/></button>
    </div>
  );
}

function ModalPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isOverlay = st === 'overlay';
  return (
    <div style={{ position: 'relative', width: 300, minHeight: 180 }}>
      {isOverlay && <div style={{ position: 'absolute', inset: 0, background: 'var(--token-bg-overlay)', borderRadius: 'var(--token-radius-lg)' }}/>}
      <div style={{ position: 'relative', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', overflow: 'hidden', zIndex: 1 }}>
        <div className="flex items-center" style={{ padding: '12px 16px', borderBottom: '1px solid var(--token-border)', background: 'var(--token-bg-secondary)' }}>
          <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', fontWeight: 500, color: 'var(--token-text-primary)' }}>Delete Conversation</span>
          <button style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--token-text-tertiary)', display: 'flex' }}><X size={14}/></button>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ margin: '0 0 16px', fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)' }}>Are you sure you want to delete this conversation? This action cannot be undone.</p>
          <div className="flex items-center justify-end" style={{ gap: 8 }}>
            <button style={{ padding: '6px 14px', fontSize: 'var(--token-text-xs)', borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: 'transparent', color: 'var(--token-text-primary)', cursor: 'pointer' }}>Cancel</button>
            <button style={{ padding: '6px 14px', fontSize: 'var(--token-text-xs)', borderRadius: 'var(--token-radius-md)', border: 'none', background: 'var(--token-error)', color: 'var(--token-text-inverse)', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  return (
    <div className="flex" style={{ gap: 12 }}>
      {[{ title: 'Tokens Used', value: '24.5k', icon: <Sparkles size={14}/> }, { title: 'Avg Latency', value: '340ms', icon: <TrendingDown size={14}/> }].map((c, i) => (
        <div key={c.title} style={{ padding: 14, border: `1px solid ${isActive && i === 0 ? 'var(--token-accent)' : 'var(--token-border)'}`, borderRadius: 'var(--token-radius-lg)', background: isHover && i === 0 ? 'var(--token-bg-secondary)' : 'var(--token-bg)', boxShadow: isHover && i === 0 ? 'var(--token-shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 120ms', minWidth: 120 }}>
          <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
            <span style={{ color: 'var(--token-text-tertiary)' }}>{c.icon}</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>{c.title}</span>
          </div>
          <span style={{ fontSize: 'var(--token-text-xl)', fontWeight: 600, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-primary)' }}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

function AlertPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const configs: Record<string, { bg: string; border: string; icon: JSX.Element; title: string; text: string; color: string }> = {
    default: { bg: 'var(--token-info-light)', border: 'var(--token-accent)', icon: <Info size={14}/>, title: 'Information', text: 'New model version available for your workspace.', color: 'var(--token-accent)' },
    info: { bg: 'var(--token-info-light)', border: 'var(--token-accent)', icon: <Info size={14}/>, title: 'Information', text: 'New model version available for your workspace.', color: 'var(--token-accent)' },
    warning: { bg: 'var(--token-warning-light)', border: 'var(--token-warning)', icon: <AlertTriangle size={14}/>, title: 'Warning', text: 'API rate limit approaching — 85% used.', color: 'var(--token-warning)' },
    error: { bg: 'var(--token-error-light)', border: 'var(--token-error)', icon: <AlertTriangle size={14}/>, title: 'Error', text: 'API key expired. Please update your credentials.', color: 'var(--token-error)' },
    success: { bg: 'var(--token-success-light)', border: 'var(--token-success)', icon: <Check size={14}/>, title: 'Success', text: 'Model fine-tuning completed successfully.', color: 'var(--token-success)' },
  };
  const c = configs[st] || configs.default;
  return (
    <div className="flex items-start" style={{ gap: 10, padding: '12px 14px', border: `1px solid ${c.border}`, borderRadius: 'var(--token-radius-md)', background: c.bg, maxWidth: 340 }}>
      <span style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 500, color: 'var(--token-text-primary)' }}>{c.title}</span>
        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-normal)' }}>{c.text}</span>
      </div>
    </div>
  );
}

function PopoverPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  return (
    <div style={{ position: 'relative', paddingTop: 8 }}>
      <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', width: 220, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--token-border)' }}>
          <span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 500, color: 'var(--token-text-primary)' }}>Model Settings</span>
        </div>
        <div className="flex flex-col" style={{ padding: '10px 14px', gap: 8 }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-secondary)' }}>Temperature</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>0.7</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-secondary)' }}>Max Tokens</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>4096</span>
          </div>
        </div>
      </div>
      {st === 'arrow' && <div style={{ position: 'absolute', top: 0, left: 20, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid var(--token-border)' }}/>}
    </div>
  );
}

function AvatarGroupPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isOverflow = st === 'overflow';
  const colors = ['var(--token-accent)', 'var(--token-secondary)', 'var(--token-tertiary)', 'var(--token-error)'];
  const icons = [<Sparkles size={12} key="s"/>, <User size={12} key="u"/>, <User size={12} key="u2"/>, <User size={12} key="u3"/>];
  const count = isOverflow ? 4 : 3;
  return (
    <div className="flex items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 'var(--token-radius-full)', background: colors[i], color: 'var(--token-text-inverse)', border: '2px solid var(--token-bg)', marginLeft: i > 0 ? -8 : 0, zIndex: count - i, boxShadow: isHover && i === 0 ? '0 0 0 3px var(--token-accent-muted)' : 'none', transition: 'all 120ms' }}>
          {icons[i]}
        </div>
      ))}
      {isOverflow && (
        <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 'var(--token-radius-full)', background: 'var(--token-bg-tertiary)', color: 'var(--token-text-secondary)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', fontWeight: 500, border: '2px solid var(--token-bg)', marginLeft: -8, zIndex: 0 }}>+3</div>
      )}
    </div>
  );
}

function AccordionPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isOpen = st === 'open';
  const isHover = st === 'hover';
  const items = [
    { title: 'Parse input', content: 'Tokenize and validate the user prompt before processing.' },
    { title: 'Analyze context', content: 'Retrieve relevant context from conversation history and knowledge base.' },
    { title: 'Generate output', content: 'Run inference with the selected model and parameters.' },
  ];
  return (
    <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)', overflow: 'hidden', maxWidth: 300 }}>
      {items.map((it, i) => (
        <div key={it.title}>
          <div className="flex items-center" style={{ padding: '10px 14px', borderBottom: (isOpen && i === 0) || i < items.length - 1 ? '1px solid var(--token-border)' : 'none', background: isHover && i === 1 ? 'var(--token-bg-hover)' : 'transparent', cursor: 'pointer', transition: 'background 100ms' }}>
            <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{it.title}</span>
            <ChevronDown size={13} style={{ color: 'var(--token-text-disabled)', transform: isOpen && i === 0 ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}/>
          </div>
          {isOpen && i === 0 && (
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--token-border)', background: 'var(--token-bg-secondary)' }}>
              <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)' }}>{it.content}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PaginationPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  const isDisabled = st === 'disabled';
  const pages = [1, 2, 3, '...', 8];
  return (
    <div className="flex items-center" style={{ gap: 4 }}>
      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: 'transparent', color: isDisabled ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.4 : 1 }}><ChevronLeft size={13}/></button>
      {pages.map((p, i) => {
        const isCurrent = p === 1;
        const isHovered = isHover && p === 2;
        return (
          <button key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, padding: '0 6px', borderRadius: 'var(--token-radius-md)', border: isCurrent ? 'none' : '1px solid transparent', background: isCurrent ? 'var(--token-accent)' : isHovered ? 'var(--token-bg-hover)' : 'transparent', color: isCurrent ? 'var(--token-accent-fg)' : isHovered ? 'var(--token-text-primary)' : 'var(--token-text-secondary)', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', cursor: p === '...' ? 'default' : 'pointer', transition: 'all 120ms' }}>{p}</button>
        );
      })}
      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--token-radius-md)', border: '1px solid var(--token-border)', background: isHover ? 'var(--token-bg-hover)' : 'transparent', color: 'var(--token-text-secondary)', cursor: 'pointer' }}><ChevronRight size={13}/></button>
    </div>
  );
}

function ContextMenuPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isDisabledItem = st === 'disabled-item';
  return (
    <div style={{ width: 180, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg)', boxShadow: 'var(--token-shadow-lg)', overflow: 'hidden' }}>
      {[
        { label: 'Edit message', icon: <Type size={12}/>, keys: '⌘E' },
        { label: 'Copy text', icon: <Copy size={12}/>, keys: '⌘C' },
        { label: 'Regenerate', icon: <RotateCcw size={12}/>, divider: true },
        { label: 'Delete', icon: <Trash2 size={12}/>, danger: true },
      ].map((it, i) => (
        <div key={it.label}>
          {it.divider && <div style={{ height: 1, background: 'var(--token-border)', margin: '4px 0' }}/>}
          <div className="flex items-center" style={{ gap: 8, padding: '6px 12px', fontSize: 'var(--token-text-xs)', color: it.danger ? 'var(--token-error)' : isDisabledItem && i === 2 ? 'var(--token-text-disabled)' : isHover && i === 1 ? 'var(--token-text-primary)' : 'var(--token-text-secondary)', background: isHover && i === 1 ? 'var(--token-bg-hover)' : 'transparent', cursor: isDisabledItem && i === 2 ? 'not-allowed' : 'pointer', opacity: isDisabledItem && i === 2 ? 0.4 : 1 }}>
            {it.icon}<span style={{ flex: 1 }}>{it.label}</span>
            {it.keys && <span style={{ fontSize: 9, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{it.keys}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function NavItemPreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isActive = st === 'active';
  const isCollapsed = st === 'collapsed';
  const items = [
    { label: 'Chat', icon: <MessageSquare size={14}/>, badge: '3', active: true },
    { label: 'History', icon: <Inbox size={14}/>, active: false },
    { label: 'Settings', icon: <Settings size={14}/>, active: false },
  ];
  return (
    <div className="flex flex-col" style={{ gap: 2, width: isCollapsed ? 44 : 200 }}>
      {items.map((it, i) => {
        const isItemActive = isActive ? i === 0 : it.active;
        const isItemHover = isHover && i === 1;
        return (
          <div key={it.label} className="flex items-center" style={{ gap: 10, padding: isCollapsed ? '8px' : '8px 12px', borderRadius: 'var(--token-radius-md)', background: isItemActive ? 'var(--token-accent-muted)' : isItemHover ? 'var(--token-bg-hover)' : 'transparent', cursor: 'pointer', transition: 'all 100ms', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <span style={{ color: isItemActive ? 'var(--token-accent)' : 'var(--token-text-tertiary)', flexShrink: 0, display: 'flex' }}>{it.icon}</span>
            {!isCollapsed && <span style={{ flex: 1, fontSize: 'var(--token-text-sm)', color: isItemActive ? 'var(--token-accent)' : isItemHover ? 'var(--token-text-primary)' : 'var(--token-text-secondary)' }}>{it.label}</span>}
            {!isCollapsed && it.badge && (
              <span style={{ minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--token-radius-full)', fontSize: 9, fontFamily: 'var(--token-font-mono)', fontWeight: 500, background: 'var(--token-accent)', color: 'var(--token-accent-fg)' }}>{it.badge}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FileDropZonePreview({ activeState }: { activeState?: string }) {
  const st = activeState || 'default';
  const isHover = st === 'hover';
  const isDragging = st === 'dragging';
  const isUploaded = st === 'uploaded';
  return (
    <div style={{ maxWidth: 300 }}>
      {isUploaded ? (
        <div className="flex flex-col" style={{ gap: 8, padding: 14, border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-lg)' }}>
          {[{ name: 'report.pdf', size: '2.4 MB' }, { name: 'data.csv', size: '890 KB' }].map(f => (
            <div key={f.name} className="flex items-center" style={{ gap: 8, padding: '6px 10px', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg-secondary)' }}>
              <File size={13} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: 'var(--token-text-xs)', color: 'var(--token-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>{f.size}</span>
              <X size={11} style={{ color: 'var(--token-text-disabled)', cursor: 'pointer' }}/>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center" style={{ gap: 8, padding: 'var(--token-space-6)', border: `2px dashed ${isDragging ? 'var(--token-accent)' : 'var(--token-border)'}`, borderRadius: 'var(--token-radius-lg)', background: isDragging ? 'var(--token-accent-muted)' : isHover ? 'var(--token-bg-hover)' : 'transparent', cursor: 'pointer', transition: 'all 120ms' }}>
          <Upload size={20} style={{ color: isDragging ? 'var(--token-accent)' : 'var(--token-text-disabled)' }}/>
          <span style={{ fontSize: 'var(--token-text-sm)', color: isDragging ? 'var(--token-accent)' : 'var(--token-text-secondary)', textAlign: 'center' }}>{isDragging ? 'Drop files here' : 'Drag & drop files'}</span>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>PDF, CSV, TXT up to 10MB</span>
        </div>
      )}
    </div>
  );
}

/* ——— Preview map ——— */
type PreviewFn = (props: { activeState?: string }) => JSX.Element;
const atomPreviews: Record<string, PreviewFn> = {
  button: ButtonPreview, badge: BadgePreview, avatar: AvatarPreview, input: InputPreview,
  toggle: TogglePreview, tag: TagPreview, 'progress-bar': ProgressPreview, skeleton: SkeletonPreview,
  divider: DividerPreview, dot: DotPreview, kbd: KbdPreview, 'code-inline': CodeInlinePreview,
  spinner: SpinnerPreview, icons: IconsPreview,
  checkbox: CheckboxPreview, radio: RadioPreview, tooltip: TooltipPreview, textarea: TextareaPreview,
  select: SelectPreview, link: LinkPreview, slider: SliderPreview,
  thumbnail: ThumbnailPreview,
};

const moleculePreviews: Record<string, PreviewFn> = {
  'search-bar': SearchBarPreview, 'list-item': ListItemPreview, 'message-bubble': MessageBubblePreview,
  toolbar: ToolbarPreview, 'stat-display': StatPreview, 'form-field': FormFieldPreview,
  'tab-bar': TabBarPreview, 'header-bar': HeaderBarPreview, 'step-indicator': StepIndicatorPreview,
  'chip-group': ChipGroupPreview, 'empty-state': EmptyStatePreview, 'toggle-row': ToggleRowPreview,
  breadcrumb: BreadcrumbPreview,
  'dropdown-menu': DropdownMenuPreview, toast: ToastPreview, modal: ModalPreview, card: CardPreview,
  alert: AlertPreview, popover: PopoverPreview, 'avatar-group': AvatarGroupPreview,
  accordion: AccordionPreview, pagination: PaginationPreview, 'context-menu': ContextMenuPreview,
  'nav-item': NavItemPreview, 'file-drop-zone': FileDropZonePreview,
};

/* ——————————————————————————————————————————
   DATA — Atoms
   —————————————————————————————————————————— */
const atomsData: DSEntry[] = [
  { id: 'button', name: 'Button', type: 'atom', tag: 'common', desc: 'Interactive trigger element for actions. Supports 6 visual variants: Primary, Secondary, Outline, Ghost, Destructive, and Icon-only.', usage: 'Use Primary for main CTAs, Secondary for supporting actions, Ghost for inline actions, Outline for forms, Destructive for dangerous operations, Icon-only for toolbars.', figma: 'Create as component with variant property. Auto-layout with 8px/16px padding. Use accent fill for primary, transparent for ghost.', tokens: [
    { layer: 'Background (Primary)', compToken: '--btn-bg-primary', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Primary button fill — brand moonstone', category: 'surface' },
    { layer: 'Background (Secondary)', compToken: '--btn-bg-secondary', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Neutral button fill', category: 'surface' },
    { layer: 'Background (Destructive)', compToken: '--btn-bg-destructive', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Danger button fill', category: 'surface' },
    { layer: 'Text (Primary)', compToken: '--btn-text-primary', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'White text on accent', category: 'text' },
    { layer: 'Text (Secondary)', compToken: '--btn-text-secondary', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Text on neutral surface', category: 'text' },
    { layer: 'Text (Ghost)', compToken: '--btn-text-ghost', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Subdued ghost text', category: 'text' },
    { layer: 'Font Size', token: '--token-text-sm', lightVal: '13px', darkVal: '13px', purpose: 'Label text size', category: 'text' },
    { layer: 'Font Family', token: '--token-font-sans', lightVal: 'Inter', darkVal: 'Inter', purpose: 'Button label font', category: 'text' },
    { layer: 'Border (Outline)', compToken: '--btn-border-outline', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: '1px outline variant border', category: 'border' },
    { layer: 'Radius', compToken: '--btn-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
    { layer: 'Glow Shadow', token: '--token-shadow-accent', lightVal: 'moonstone glow', darkVal: 'moonstone glow', purpose: 'Primary button elevation', category: 'shadow' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Resting state — all variants in their normal appearance', tokens: [
      { layer: 'Background (Primary)', compToken: '--btn-bg-primary', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Primary button fill', category: 'surface' },
      { layer: 'Background (Secondary)', compToken: '--btn-bg-secondary', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Neutral fill', category: 'surface' },
      { layer: 'Text (Primary)', compToken: '--btn-text-primary', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'White on accent', category: 'text' },
      { layer: 'Border (Outline)', compToken: '--btn-border-outline', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Outline border', category: 'border' },
      { layer: 'Radius', compToken: '--btn-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Mouse over — darkened backgrounds for feedback', tokens: [
      { layer: 'Background (Primary)', compToken: '--btn-bg-primary-hover', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Darkened primary on hover', category: 'surface' },
      { layer: 'Background (Secondary)', compToken: '--btn-bg-secondary-hover', token: '--token-bg-active', lightVal: 'rgba(0,0,0,.06)', darkVal: 'rgba(255,255,255,.08)', purpose: 'Darkened neutral on hover', category: 'surface' },
      { layer: 'Background (Ghost)', compToken: '--btn-bg-ghost-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Subtle ghost hover fill', category: 'surface' },
      { layer: 'Ghost Text (Hover)', compToken: '--btn-text-ghost-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted ghost text on hover', category: 'text' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Keyboard focus — accent ring for accessibility', tokens: [
      { layer: 'Focus Ring', compToken: '--btn-ring-focus', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring around button', category: 'border' },
      { layer: 'Outline Border (Focus)', compToken: '--btn-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Outline variant border promoted to accent', category: 'border' },
    ] },
    { id: 'active', label: 'Active', description: 'Mouse press — pressed appearance with scale', tokens: [
      { layer: 'Background (Primary)', compToken: '--btn-bg-primary-active', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Pressed primary fill', category: 'surface' },
      { layer: 'Transform', compToken: '--btn-transform-active', token: '--token-ease-default', lightVal: 'scale(0.98)', darkVal: 'scale(0.98)', purpose: 'Press down scale', category: 'motion' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive — reduced opacity, no pointer', tokens: [
      { layer: 'Opacity', compToken: '--btn-opacity-disabled', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: '50% opacity for all variants', category: 'surface' },
      { layer: 'Cursor', compToken: '--btn-cursor-disabled', token: '--token-text-disabled', lightVal: 'not-allowed', darkVal: 'not-allowed', purpose: 'Disabled cursor', category: 'surface' },
    ] },
    { id: 'loading', label: 'Loading', description: 'Async state — spinner replaces icon, text changes', tokens: [
      { layer: 'Spinner Color', compToken: '--btn-spinner', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Loading spinner on primary', category: 'text' },
      { layer: 'Spin Animation', compToken: '--btn-spin', token: '--token-duration-normal', lightVal: '1s linear infinite', darkVal: '1s linear infinite', purpose: 'Spinner rotation', category: 'motion' },
    ] },
  ] },
  { id: 'badge', name: 'Badge', type: 'atom', tag: 'common', desc: 'Small status/category label with 8 color variants including AI and brand colors.', usage: 'Default for neutral, Success/Warning/Error for status, AI for branded, Count for numeric indicators.', figma: 'Auto-layout, pill shape (radius-full), 1px/8px padding. Mono font for data badges.', tokens: [
    { layer: 'Background (Default)', compToken: '--badge-bg-default', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Neutral badge fill', category: 'surface' },
    { layer: 'Background (AI)', compToken: '--badge-bg-ai', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'AI badge surface', category: 'surface' },
    { layer: 'Background (Sunstone)', compToken: '--badge-bg-sunstone', token: '--token-secondary-light', lightVal: '#f8f5ed', darkVal: '#211a10', purpose: 'Secondary badge surface', category: 'surface' },
    { layer: 'Background (Olivine)', compToken: '--badge-bg-olivine', token: '--token-tertiary-light', lightVal: '#f3f5f0', darkVal: '#181c15', purpose: 'Olivine badge surface', category: 'surface' },
    { layer: 'Background (Success)', compToken: '--badge-bg-success', token: '--token-success-light', lightVal: '#d2e8dc', darkVal: '#0e211a', purpose: 'Success badge surface', category: 'surface' },
    { layer: 'Background (Error)', compToken: '--badge-bg-error', token: '--token-error-light', lightVal: '#f0d8d8', darkVal: '#2a1111', purpose: 'Error badge surface', category: 'surface' },
    { layer: 'Background (Count)', compToken: '--badge-bg-count', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Count badge fill', category: 'surface' },
    { layer: 'Text (Default)', compToken: '--badge-text-default', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Default badge text', category: 'text' },
    { layer: 'Text (AI)', compToken: '--badge-text-ai', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'AI badge text', category: 'text' },
    { layer: 'Text (Sunstone)', compToken: '--badge-text-sunstone', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'Sunstone badge text', category: 'text' },
    { layer: 'Text (Olivine)', compToken: '--badge-text-olivine', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Olivine badge text', category: 'text' },
    { layer: 'Text (Success)', compToken: '--badge-text-success', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Success badge text', category: 'text' },
    { layer: 'Text (Error)', compToken: '--badge-text-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error badge text', category: 'text' },
    { layer: 'Text (Count)', compToken: '--badge-text-count', token: '--token-text-inverse', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Count badge text', category: 'text' },
    { layer: 'Font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Monospace for clarity', category: 'text' },
    { layer: 'Radius', compToken: '--badge-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Full pill shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static badge display — all color variants visible', tokens: [
      { layer: 'Background (Default)', compToken: '--badge-bg-default', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Neutral badge fill', category: 'surface' },
      { layer: 'Text (Default)', compToken: '--badge-text-default', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Default badge text', category: 'text' },
      { layer: 'Radius', compToken: '--badge-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Pill shape', category: 'shape' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Scale up on hover for interactive badges', tokens: [
      { layer: 'Transform', compToken: '--badge-transform-hover', token: '--token-ease-default', lightVal: 'scale(1.05)', darkVal: 'scale(1.05)', purpose: 'Slight scale on hover', category: 'motion' },
    ] },
    { id: 'muted', label: 'Muted', description: 'Reduced opacity for de-emphasized badges', tokens: [
      { layer: 'Opacity', compToken: '--badge-opacity-muted', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Half opacity', category: 'surface' },
    ] },
  ] },
  { id: 'avatar', name: 'Avatar', type: 'atom', tag: 'ai', desc: 'Identity indicator for users (sunstone), AI agents (moonstone), and system (neutral). Supports 24/32/40px sizes.', usage: 'User avatar uses secondary sunstone, AI avatar uses brand moonstone, System uses neutral gray.', figma: 'Circle frame with centered icon. Size variants via component properties.', tokens: [
    { layer: 'Background (AI)', compToken: '--avatar-bg-ai', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'AI agent identity', category: 'surface' },
    { layer: 'Background (User)', compToken: '--avatar-bg-user', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'User identity', category: 'surface' },
    { layer: 'Background (System)', compToken: '--avatar-bg-system', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'System/neutral', category: 'surface' },
    { layer: 'Foreground (AI)', compToken: '--avatar-fg-ai', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Icon on moonstone avatar', category: 'text' },
    { layer: 'Foreground (System)', compToken: '--avatar-fg-system', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Icon on neutral avatar', category: 'text' },
    { layer: 'Radius', compToken: '--avatar-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Circle shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static avatar display', tokens: [
      { layer: 'Background (AI)', compToken: '--avatar-bg-ai', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'AI agent identity', category: 'surface' },
      { layer: 'Background (User)', compToken: '--avatar-bg-user', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'User identity', category: 'surface' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Ring appears on hover for interactive avatars', tokens: [
      { layer: 'Hover Ring (AI)', compToken: '--avatar-ring-ai', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px ring on hover', category: 'border' },
      { layer: 'Hover Ring (User)', compToken: '--avatar-ring-user', token: '--token-secondary-light', lightVal: '#f8f5ed', darkVal: '#211a10', purpose: 'User ring on hover', category: 'border' },
    ] },
    { id: 'loading', label: 'Loading', description: 'Skeleton shimmer when avatar is loading', tokens: [
      { layer: 'Shimmer Base', compToken: '--avatar-shimmer-base', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Shimmer base', category: 'surface' },
      { layer: 'Shimmer Highlight', compToken: '--avatar-shimmer-highlight', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shimmer peak', category: 'surface' },
    ] },
  ] },
  { id: 'input', name: 'Input', type: 'atom', tag: 'common', desc: 'Text input field with optional icon prefix. Text, search, and disabled states.', usage: 'Text for general, search with prefix icon, disabled for locked fields.', figma: 'Auto-layout 8px/12px padding. 1px border, md radius. Icon at 13px, text at sm.', tokens: [
    { layer: 'Background', compToken: '--input-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Input surface', category: 'surface' },
    { layer: 'Border', compToken: '--input-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Input border', category: 'border' },
    { layer: 'Text', compToken: '--input-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Input value text', category: 'text' },
    { layer: 'Placeholder', compToken: '--input-text-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder text', category: 'text' },
    { layer: 'Font', token: '--token-font-sans', lightVal: 'Inter', darkVal: 'Inter', purpose: 'Input font family', category: 'text' },
    { layer: 'Font Size', token: '--token-text-sm', lightVal: '13px', darkVal: '13px', purpose: 'Input text size', category: 'text' },
    { layer: 'Radius', compToken: '--input-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Empty input at rest', tokens: [
      { layer: 'Background', compToken: '--input-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Input surface', category: 'surface' },
      { layer: 'Border', compToken: '--input-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
      { layer: 'Placeholder', compToken: '--input-text-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder text', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Border darkens on mouse hover', tokens: [
      { layer: 'Border (Hover)', compToken: '--input-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger border on hover', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Accent border with focus ring', tokens: [
      { layer: 'Border (Focus)', compToken: '--input-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border on focus', category: 'border' },
      { layer: 'Focus Ring', compToken: '--input-ring-focus', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
      { layer: 'Text', compToken: '--input-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Active input text', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-editable with muted appearance', tokens: [
      { layer: 'Background (Disabled)', compToken: '--input-bg-disabled', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Disabled input surface', category: 'surface' },
      { layer: 'Text (Disabled)', compToken: '--input-text-disabled', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Greyed-out text', category: 'text' },
      { layer: 'Opacity', compToken: '--input-opacity-disabled', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Overall opacity', category: 'surface' },
    ] },
    { id: 'error', label: 'Error', description: 'Validation error with red border and message', tokens: [
      { layer: 'Border (Error)', compToken: '--input-border-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Garnet error border', category: 'border' },
      { layer: 'Error Ring', compToken: '--input-ring-error', token: '--token-error-light', lightVal: 'rgba(229,72,77,.15)', darkVal: 'rgba(239,68,68,.15)', purpose: 'Error focus ring', category: 'border' },
      { layer: 'Error Text', compToken: '--input-text-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Validation message', category: 'text' },
    ] },
  ] },
  { id: 'toggle', name: 'Toggle', type: 'atom', tag: 'common', desc: 'Binary on/off switch. Track uses accent when on, neutral when off.', usage: 'Boolean settings: streaming mode, dark mode, feature flags.', tokens: [
    { layer: 'Track (On)', compToken: '--toggle-track-on', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active track fill', category: 'surface' },
    { layer: 'Track (Off)', compToken: '--toggle-track-off', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Inactive track', category: 'surface' },
    { layer: 'Knob Shadow', compToken: '--toggle-shadow-knob', token: '--token-shadow-xs', lightVal: '0 1px 2px rgba(0,0,0,.04)', darkVal: '0 1px 2px rgba(0,0,0,.25)', purpose: 'Knob depth', category: 'shadow' },
    { layer: 'Radius', compToken: '--toggle-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Pill shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Interactive toggles — click to switch on/off', tokens: [
      { layer: 'Track (On)', compToken: '--toggle-track-on', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active track fill', category: 'surface' },
      { layer: 'Track (Off)', compToken: '--toggle-track-off', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Inactive track', category: 'surface' },
    ] },
    { id: 'on', label: 'On', description: 'Both toggles forced to on state', tokens: [
      { layer: 'Track (On)', compToken: '--toggle-track-on', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active moonstone track', category: 'surface' },
    ] },
    { id: 'off', label: 'Off', description: 'Both toggles forced to off state', tokens: [
      { layer: 'Track (Off)', compToken: '--toggle-track-off', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Inactive neutral track', category: 'surface' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Focus ring appears on hover', tokens: [
      { layer: 'Hover Ring', compToken: '--toggle-ring-hover', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
    ] },
    { id: 'disabled-on', label: 'Disabled On', description: 'Non-interactive, locked in on position', tokens: [
      { layer: 'Opacity', compToken: '--toggle-opacity-disabled', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Reduced opacity', category: 'surface' },
    ] },
    { id: 'disabled-off', label: 'Disabled Off', description: 'Non-interactive, locked in off position', tokens: [
      { layer: 'Opacity', compToken: '--toggle-opacity-disabled', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Reduced opacity', category: 'surface' },
    ] },
  ] },
  { id: 'tag', name: 'Tag', type: 'atom', tag: 'common', desc: 'Label chip with optional brand color and remove action.', usage: 'Default for neutral labels, colored for categories, removable for filter selections.', tokens: [
    { layer: 'Border', compToken: '--tag-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Tag outline', category: 'border' },
    { layer: 'Text (Default)', compToken: '--tag-text-default', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Default label text', category: 'text' },
    { layer: 'Text (Moonstone)', compToken: '--tag-text-moonstone', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Moonstone tag color', category: 'text' },
    { layer: 'Text (Sunstone)', compToken: '--tag-text-sunstone', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'Sunstone tag color', category: 'text' },
    { layer: 'Text (Olivine)', compToken: '--tag-text-olivine', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Olivine tag color', category: 'text' },
    { layer: 'Radius', compToken: '--tag-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Pill shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static tag chips at rest', tokens: [
      { layer: 'Border', compToken: '--tag-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Tag outline', category: 'border' },
      { layer: 'Text', compToken: '--tag-text-default', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Default label', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Subtle fill appears on hover', tokens: [
      { layer: 'Hover BG', compToken: '--tag-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
    ] },
    { id: 'selected', label: 'Selected', description: 'Accent border and tinted background for active selection', tokens: [
      { layer: 'Selected Border', compToken: '--tag-border-selected', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent selection border', category: 'border' },
      { layer: 'Selected BG', compToken: '--tag-bg-selected', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Tinted fill', category: 'surface' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Reduced opacity, no interaction', tokens: [
      { layer: 'Opacity', compToken: '--tag-opacity-disabled', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed appearance', category: 'surface' },
    ] },
  ] },
  { id: 'progress-bar', name: 'Progress Bar', type: 'atom', tag: 'ai', desc: 'Linear progress indicator with moonstone→sunstone gradient fill.', usage: 'File uploads, analysis progress, token usage visualization.', tokens: [
    { layer: 'Track', compToken: '--progress-bg-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Track background', category: 'surface' },
    { layer: 'Fill Start', compToken: '--progress-bg-fill-start', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Gradient start', category: 'surface' },
    { layer: 'Fill End', compToken: '--progress-bg-fill-end', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'Gradient end', category: 'surface' },
    { layer: 'Percent Text', compToken: '--progress-text', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Percentage label', category: 'text' },
    { layer: 'Radius', compToken: '--progress-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Rounded ends', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Determinate progress bars at various fill levels', tokens: [
      { layer: 'Track', compToken: '--progress-bg-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Track background', category: 'surface' },
      { layer: 'Fill', compToken: '--progress-bg-fill-start', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Gradient fill', category: 'surface' },
    ] },
    { id: 'complete', label: 'Complete', description: 'All bars at 100% with success color', tokens: [
      { layer: 'Complete Fill', compToken: '--progress-bg-complete', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Success fill at 100%', category: 'surface' },
    ] },
    { id: 'indeterminate', label: 'Indeterminate', description: 'Animated shimmer bar for unknown duration', tokens: [
      { layer: 'Shimmer Fill', compToken: '--progress-bg-shimmer', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Moving gradient', category: 'surface' },
      { layer: 'Animation', compToken: '--progress-motion', token: '--token-duration-normal', lightVal: '1.5s ease', darkVal: '1.5s ease', purpose: 'Shimmer sweep', category: 'motion' },
    ] },
  ] },
  { id: 'skeleton', name: 'Skeleton', type: 'atom', tag: 'common', desc: 'Shimmer placeholder for loading. Text, avatar, and card variants.', usage: 'Match the shape/size of expected content during data fetch.', tokens: [
    { layer: 'Base', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Shimmer base color', category: 'surface' },
    { layer: 'Highlight', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shimmer highlight', category: 'surface' },
    { layer: 'Avatar Radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Circle avatar shape', category: 'shape' },
    { layer: 'Card Radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Card placeholder rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Animated shimmer placeholders', tokens: [
      { layer: 'Shimmer Base', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Shimmer base', category: 'surface' },
      { layer: 'Shimmer Highlight', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shimmer peak', category: 'surface' },
    ] },
  ] },
  { id: 'divider', name: 'Divider', type: 'atom', tag: 'common', desc: 'Horizontal separator, optionally with a centered label.', usage: 'Section breaks, context changes.', tokens: [
    { layer: 'Line', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Divider line', category: 'border' },
    { layer: 'Label', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Center text', category: 'text' },
    { layer: 'Label Font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Label font', category: 'text' },
    { layer: 'Label Size', token: '--token-text-2xs', lightVal: '10px', darkVal: '10px', purpose: 'Label font size', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static horizontal line with optional label', tokens: [
      { layer: 'Line', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Divider line', category: 'border' },
    ] },
  ] },
  { id: 'dot', name: 'Dot Indicator', type: 'atom', tag: 'ai', desc: 'Small 6px colored dot for status or category.', usage: 'Online/offline, category coding, activity indicators.', tokens: [
    { layer: 'Online', compToken: '--dot-bg-online', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Online / olivine dot', category: 'surface' },
    { layer: 'Busy', compToken: '--dot-bg-busy', token: '--token-warning', lightVal: '#9f8136', darkVal: '#d4aa55', purpose: 'Busy / warning dot', category: 'surface' },
    { layer: 'Error', compToken: '--dot-bg-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error dot', category: 'surface' },
    { layer: 'Active', compToken: '--dot-bg-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active / accent dot', category: 'surface' },
    { layer: 'Label', compToken: '--dot-text', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Status label text', category: 'text' },
    { layer: 'Radius', compToken: '--dot-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Circle', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static colored dots', tokens: [
      { layer: 'Online', compToken: '--dot-bg-online', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Online dot', category: 'surface' },
      { layer: 'Active', compToken: '--dot-bg-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent dot', category: 'surface' },
    ] },
    { id: 'pulsing', label: 'Pulsing', description: 'Animated pulse ring for live status', tokens: [
      { layer: 'Pulse Ring', compToken: '--dot-ring-pulse', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.25)', darkVal: 'rgba(107,133,152,.25)', purpose: 'Pulse glow ring', category: 'border' },
      { layer: 'Animation', compToken: '--dot-motion-pulse', token: '--token-duration-normal', lightVal: '1.5s ease', darkVal: '1.5s ease', purpose: 'Pulse animation', category: 'motion' },
    ] },
  ] },
  { id: 'kbd', name: 'Keyboard Shortcut', type: 'atom', tag: 'common', desc: 'Keyboard key visual with 3D border effect.', usage: 'Shortcut hints in search bars, tooltips, help text.', tokens: [
    { layer: 'Background', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Key cap surface', category: 'surface' },
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Key cap border', category: 'border' },
    { layer: 'Border Bottom', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: '3D depth', category: 'border' },
    { layer: 'Text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Key label', category: 'text' },
    { layer: 'Font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Monospace', category: 'text' },
    { layer: 'Radius', token: '--token-radius-sm', lightVal: '4px', darkVal: '4px', purpose: 'Slight rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Keyboard keys at rest', tokens: [
      { layer: 'Background', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Key cap surface', category: 'surface' },
      { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Key border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Promoted text and stronger border on hover', tokens: [
      { layer: 'Text (Hover)', compToken: '--kbd-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted key text', category: 'text' },
      { layer: 'Border (Hover)', compToken: '--kbd-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger hover border', category: 'border' },
    ] },
    { id: 'pressed', label: 'Pressed', description: 'Depressed state with reduced depth effect', tokens: [
      { layer: 'Background (Pressed)', compToken: '--kbd-bg-pressed', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Pressed key surface', category: 'surface' },
      { layer: 'Transform', compToken: '--kbd-transform-pressed', token: '--token-ease-default', lightVal: 'translateY(1px)', darkVal: 'translateY(1px)', purpose: 'Press down shift', category: 'motion' },
    ] },
  ] },
  { id: 'code-inline', name: 'Code Inline', type: 'atom', tag: 'ai', desc: 'Inline code with accent-tinted monospace styling.', usage: 'Model names, function calls, parameter values in body text.', tokens: [
    { layer: 'Background', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Code highlight', category: 'surface' },
    { layer: 'Text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Code text in brand moonstone', category: 'text' },
    { layer: 'Font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Monospace font', category: 'text' },
    { layer: 'Radius', token: '--token-radius-sm', lightVal: '4px', darkVal: '4px', purpose: 'Slight rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Inline code snippets at rest', tokens: [
      { layer: 'Background', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Code highlight', category: 'surface' },
      { layer: 'Text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Code text', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Slightly bolder background on hover', tokens: [
      { layer: 'Background (Hover)', compToken: '--code-inline-bg-hover', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Stronger hover fill', category: 'surface' },
      { layer: 'Text (Hover)', compToken: '--code-inline-text-hover', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Darker text on hover', category: 'text' },
    ] },
  ] },
  { id: 'spinner', name: 'Spinner', type: 'atom', tag: 'ai', desc: 'Rotating loading indicator in 14/18/24px sizes.', usage: 'Button loading, inline fetching, async operations.', tokens: [
    { layer: 'Color', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Spinner stroke color', category: 'surface' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Continuously spinning loading indicator', tokens: [
      { layer: 'Color', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Spinner color', category: 'surface' },
    ] },
  ] },
  { id: 'icons', name: 'Icon Set', type: 'atom', tag: 'common', desc: '20+ AI-specific icons from Lucide. 14/16/20px sizes.', usage: '14px compact, 16px default, 20px emphasis. Color inherits from parent.', tokens: [
    { layer: 'Default Color', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Standard icon color', category: 'text' },
    { layer: 'Container Radius', token: '--token-radius-sm', lightVal: '4px', darkVal: '4px', purpose: 'Icon cell rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Standard icon display at 16px', tokens: [
      { layer: 'Color', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Icon color', category: 'text' },
    ] },
  ] },
  /* ——— NEW Tier 1 Atoms ——— */
  { id: 'checkbox', name: 'Checkbox', type: 'atom', tag: 'common', desc: 'Binary selection control for multi-select lists, consent forms, and batch operations. Square box with check or indeterminate mark.', usage: 'Settings panels, filter selections, batch actions, consent forms, multi-select lists.', tokens: [
    { layer: 'Box Background', compToken: '--checkbox-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Unchecked box surface', category: 'surface' },
    { layer: 'Box Background (Checked)', compToken: '--checkbox-bg-checked', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Checked box fill', category: 'surface' },
    { layer: 'Border', compToken: '--checkbox-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Unchecked border', category: 'border' },
    { layer: 'Check Mark', compToken: '--checkbox-fg', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Check icon color', category: 'text' },
    { layer: 'Label', compToken: '--checkbox-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Label text', category: 'text' },
    { layer: 'Radius', compToken: '--checkbox-radius', token: '--token-radius-sm', lightVal: '4px', darkVal: '4px', purpose: 'Box rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Unchecked checkbox at rest', tokens: [
      { layer: 'Box Background', compToken: '--checkbox-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Unchecked surface', category: 'surface' },
      { layer: 'Border', compToken: '--checkbox-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Border darkens on hover', tokens: [
      { layer: 'Border (Hover)', compToken: '--checkbox-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Focus ring for keyboard navigation', tokens: [
      { layer: 'Focus Ring', compToken: '--checkbox-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
    ] },
    { id: 'checked', label: 'Checked', description: 'Filled with accent and check mark', tokens: [
      { layer: 'Checked BG', compToken: '--checkbox-bg-checked', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active fill', category: 'surface' },
      { layer: 'Check Mark', compToken: '--checkbox-fg', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Check icon', category: 'text' },
    ] },
    { id: 'indeterminate', label: 'Indeterminate', description: 'Partial selection — dash instead of check', tokens: [
      { layer: 'Indeterminate BG', compToken: '--checkbox-bg-indeterminate', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Partial fill', category: 'surface' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive with reduced opacity', tokens: [
      { layer: 'Opacity', compToken: '--checkbox-opacity-disabled', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed appearance', category: 'surface' },
      { layer: 'Label (Disabled)', compToken: '--checkbox-text-disabled', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Disabled label', category: 'text' },
    ] },
  ] },
  { id: 'radio', name: 'Radio Button', type: 'atom', tag: 'common', desc: 'Single-select control within a group. Circle with inner dot when selected.', usage: 'Model selection, output format picker, any mutually exclusive choice set.', tokens: [
    { layer: 'Circle Background', compToken: '--radio-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Unselected circle', category: 'surface' },
    { layer: 'Border', compToken: '--radio-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Circle border', category: 'border' },
    { layer: 'Border (Selected)', compToken: '--radio-border-selected', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected border', category: 'border' },
    { layer: 'Dot', compToken: '--radio-dot', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Inner selection dot', category: 'surface' },
    { layer: 'Label', compToken: '--radio-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Option label', category: 'text' },
    { layer: 'Radius', compToken: '--radio-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Perfect circle', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Radio group with one selected', tokens: [
      { layer: 'Circle BG', compToken: '--radio-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Unselected circle', category: 'surface' },
      { layer: 'Border', compToken: '--radio-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Border strengthens on hover', tokens: [
      { layer: 'Border (Hover)', compToken: '--radio-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Focus ring for keyboard nav', tokens: [
      { layer: 'Focus Ring', compToken: '--radio-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
    ] },
    { id: 'selected', label: 'Selected', description: 'Accent border with inner dot', tokens: [
      { layer: 'Selected Border', compToken: '--radio-border-selected', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border', category: 'border' },
      { layer: 'Dot Fill', compToken: '--radio-dot', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selection indicator', category: 'surface' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive, locked state', tokens: [
      { layer: 'Opacity', compToken: '--radio-opacity-disabled', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'tooltip', name: 'Tooltip', type: 'atom', tag: 'common', desc: 'Floating label that appears on hover/focus to describe an element. Inverted colors with optional arrow.', usage: 'Icon button labels, truncated text reveal, shortcut hints, contextual help.', tokens: [
    { layer: 'Background', compToken: '--tooltip-bg', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Dark tooltip surface', category: 'surface' },
    { layer: 'Text', compToken: '--tooltip-text', token: '--token-text-inverse', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Light tooltip text', category: 'text' },
    { layer: 'Font', compToken: '--tooltip-font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Tooltip font', category: 'text' },
    { layer: 'Shadow', compToken: '--tooltip-shadow', token: '--token-shadow-md', lightVal: '0 4px 12px rgba(0,0,0,.1)', darkVal: '0 4px 12px rgba(0,0,0,.3)', purpose: 'Tooltip elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--tooltip-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Tooltip rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Tooltip hidden — trigger elements visible', tokens: [
      { layer: 'Trigger Color', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Icon/trigger color', category: 'text' },
    ] },
    { id: 'visible', label: 'Visible', description: 'Tooltip shown with arrow pointing to trigger', tokens: [
      { layer: 'Tooltip BG', compToken: '--tooltip-bg', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Dark surface', category: 'surface' },
      { layer: 'Tooltip Text', compToken: '--tooltip-text', token: '--token-text-inverse', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Light text', category: 'text' },
      { layer: 'Shadow', compToken: '--tooltip-shadow', token: '--token-shadow-md', lightVal: '0 4px 12px rgba(0,0,0,.1)', darkVal: '0 4px 12px rgba(0,0,0,.3)', purpose: 'Elevation', category: 'shadow' },
    ] },
  ] },
  { id: 'textarea', name: 'Textarea', type: 'atom', tag: 'ai', desc: 'Multi-line text input for prompts, descriptions, and long-form content. Auto-grow support.', usage: 'Chat prompt input, system message editing, feedback forms, code snippets.', tokens: [
    { layer: 'Background', compToken: '--textarea-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Textarea surface', category: 'surface' },
    { layer: 'Border', compToken: '--textarea-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Textarea border', category: 'border' },
    { layer: 'Text', compToken: '--textarea-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Input text', category: 'text' },
    { layer: 'Placeholder', compToken: '--textarea-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder', category: 'text' },
    { layer: 'Counter', compToken: '--textarea-counter', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Character count', category: 'text' },
    { layer: 'Font', compToken: '--textarea-font', token: '--token-font-sans', lightVal: 'Inter', darkVal: 'Inter', purpose: 'Input font', category: 'text' },
    { layer: 'Radius', compToken: '--textarea-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Empty textarea at rest', tokens: [
      { layer: 'Background', compToken: '--textarea-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Surface', category: 'surface' },
      { layer: 'Border', compToken: '--textarea-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Border', category: 'border' },
      { layer: 'Placeholder', compToken: '--textarea-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Border darkens on hover', tokens: [
      { layer: 'Border (Hover)', compToken: '--textarea-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Accent border with focus ring and cursor', tokens: [
      { layer: 'Border (Focus)', compToken: '--textarea-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border', category: 'border' },
      { layer: 'Focus Ring', compToken: '--textarea-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px ring', category: 'border' },
    ] },
    { id: 'filled', label: 'Filled', description: 'Textarea with content and character count', tokens: [
      { layer: 'Text', compToken: '--textarea-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Input text', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-editable with muted surface', tokens: [
      { layer: 'Disabled BG', compToken: '--textarea-bg-disabled', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Disabled surface', category: 'surface' },
      { layer: 'Opacity', compToken: '--textarea-opacity', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Dimmed', category: 'surface' },
    ] },
    { id: 'error', label: 'Error', description: 'Validation error with red border', tokens: [
      { layer: 'Error Border', compToken: '--textarea-border-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error border', category: 'border' },
      { layer: 'Error Ring', compToken: '--textarea-ring-error', token: '--token-error-light', lightVal: 'rgba(229,72,77,.15)', darkVal: 'rgba(239,68,68,.15)', purpose: 'Error ring', category: 'border' },
      { layer: 'Error Text', compToken: '--textarea-text-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error message', category: 'text' },
    ] },
  ] },
  { id: 'select', name: 'Select', type: 'atom', tag: 'common', desc: 'Dropdown trigger that opens a list of options. Shows selected value with chevron indicator.', usage: 'Model picker, language selector, parameter enum choices, any single-select from predefined options.', tokens: [
    { layer: 'Background', compToken: '--select-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Select surface', category: 'surface' },
    { layer: 'Border', compToken: '--select-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Trigger border', category: 'border' },
    { layer: 'Text', compToken: '--select-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Selected value', category: 'text' },
    { layer: 'Icon', compToken: '--select-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Chevron icon', category: 'text' },
    { layer: 'Dropdown BG', compToken: '--select-dropdown-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Options panel', category: 'surface' },
    { layer: 'Dropdown Shadow', compToken: '--select-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Panel elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--select-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Trigger rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Closed select showing selected value', tokens: [
      { layer: 'Background', compToken: '--select-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Surface', category: 'surface' },
      { layer: 'Border', compToken: '--select-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Border strengthens on hover', tokens: [
      { layer: 'Border (Hover)', compToken: '--select-border-hover', token: '--token-border-strong', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Stronger border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Accent border with ring', tokens: [
      { layer: 'Border (Focus)', compToken: '--select-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border', category: 'border' },
      { layer: 'Focus Ring', compToken: '--select-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px ring', category: 'border' },
    ] },
    { id: 'open', label: 'Open', description: 'Dropdown panel visible with options', tokens: [
      { layer: 'Active Option', compToken: '--select-option-active', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Selected option fill', category: 'surface' },
      { layer: 'Active Text', compToken: '--select-text-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected option text', category: 'text' },
      { layer: 'Dropdown Shadow', compToken: '--select-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Floating panel', category: 'shadow' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive, muted', tokens: [
      { layer: 'Disabled BG', compToken: '--select-bg-disabled', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Disabled surface', category: 'surface' },
      { layer: 'Opacity', compToken: '--select-opacity', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'link', name: 'Link', type: 'atom', tag: 'common', desc: 'Styled anchor element with multiple visual states for inline navigation.', usage: 'Documentation links, breadcrumb segments, inline references, external URLs.', tokens: [
    { layer: 'Default Color', compToken: '--link-text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Link text color', category: 'text' },
    { layer: 'Hover Color', compToken: '--link-text-hover', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Darker on hover', category: 'text' },
    { layer: 'Visited Color', compToken: '--link-text-visited', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Visited link color', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Unvisited links at rest', tokens: [
      { layer: 'Color', compToken: '--link-text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Link text', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Underline appears, color darkens', tokens: [
      { layer: 'Hover Color', compToken: '--link-text-hover', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Darker text', category: 'text' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Focus ring for keyboard navigation', tokens: [
      { layer: 'Focus Ring', compToken: '--link-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px ring', category: 'border' },
    ] },
    { id: 'visited', label: 'Visited', description: 'Color shifts to olivine for visited links', tokens: [
      { layer: 'Visited Color', compToken: '--link-text-visited', token: '--token-tertiary', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Olivine visited', category: 'text' },
    ] },
    { id: 'active', label: 'Active', description: 'Pressed state during click', tokens: [
      { layer: 'Active Color', compToken: '--link-text-active', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Pressed color', category: 'text' },
    ] },
  ] },
  /* ——— NEW Tier 2 Atoms ——— */
  { id: 'slider', name: 'Slider', type: 'atom', tag: 'ai', desc: 'Range input with track, fill gradient, and draggable thumb. Shows current value.', usage: 'Temperature, top-p, max tokens, frequency penalty — any numeric AI parameter.', tokens: [
    { layer: 'Track', compToken: '--slider-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Unfilled track', category: 'surface' },
    { layer: 'Fill Start', compToken: '--slider-fill-start', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Fill gradient start', category: 'surface' },
    { layer: 'Fill End', compToken: '--slider-fill-end', token: '--token-secondary', lightVal: '#8a6d3b', darkVal: '#b29256', purpose: 'Fill gradient end', category: 'surface' },
    { layer: 'Thumb', compToken: '--slider-thumb', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Thumb circle fill', category: 'surface' },
    { layer: 'Thumb Shadow', compToken: '--slider-thumb-shadow', token: '--token-shadow-sm', lightVal: '0 1px 3px rgba(0,0,0,.08)', darkVal: '0 1px 3px rgba(0,0,0,.25)', purpose: 'Thumb elevation', category: 'shadow' },
    { layer: 'Value Label', compToken: '--slider-text-value', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current value display', category: 'text' },
    { layer: 'Range Text', compToken: '--slider-text-range', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Min/max labels', category: 'text' },
    { layer: 'Label Text', compToken: '--slider-text-label', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Parameter name', category: 'text' },
    { layer: 'Radius', compToken: '--slider-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Track and thumb rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Slider at rest with value indicator', tokens: [
      { layer: 'Track', compToken: '--slider-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Unfilled track', category: 'surface' },
      { layer: 'Fill', compToken: '--slider-fill-start', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Filled portion', category: 'surface' },
      { layer: 'Thumb', compToken: '--slider-thumb', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Handle', category: 'surface' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Thumb grows focus ring on hover', tokens: [
      { layer: 'Hover Ring', compToken: '--slider-ring-hover', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '4px hover ring', category: 'border' },
    ] },
    { id: 'active', label: 'Active', description: 'Thumb enlarged while dragging', tokens: [
      { layer: 'Thumb (Active)', compToken: '--slider-thumb-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Enlarged thumb', category: 'surface' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive, muted appearance', tokens: [
      { layer: 'Opacity', compToken: '--slider-opacity', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'thumbnail', name: 'Thumbnail', type: 'atom', tag: 'ai', desc: 'Rectangular image preview for attachments, generated images, and file previews.', usage: 'Image generation results, file attachment previews, gallery items, vision model inputs.', tokens: [
    { layer: 'Background', compToken: '--thumb-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Placeholder surface', category: 'surface' },
    { layer: 'Border', compToken: '--thumb-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Image border', category: 'border' },
    { layer: 'Placeholder Icon', compToken: '--thumb-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder icon', category: 'text' },
    { layer: 'Selection Ring', compToken: '--thumb-ring-selected', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected image ring', category: 'border' },
    { layer: 'Radius', compToken: '--thumb-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Image rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Image thumbnails with placeholder', tokens: [
      { layer: 'Background', compToken: '--thumb-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Placeholder fill', category: 'surface' },
      { layer: 'Border', compToken: '--thumb-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Image border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Ring appears on hover', tokens: [
      { layer: 'Hover Ring', compToken: '--thumb-ring-hover', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Hover ring', category: 'border' },
    ] },
    { id: 'loading', label: 'Loading', description: 'Shimmer animation while loading', tokens: [
      { layer: 'Shimmer Base', compToken: '--thumb-shimmer-base', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Shimmer base', category: 'surface' },
      { layer: 'Shimmer Highlight', compToken: '--thumb-shimmer-highlight', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shimmer peak', category: 'surface' },
    ] },
    { id: 'selected', label: 'Selected', description: 'Accent border ring for selected image', tokens: [
      { layer: 'Selection Ring', compToken: '--thumb-ring-selected', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent ring', category: 'border' },
      { layer: 'Selection Glow', compToken: '--thumb-ring-glow', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Outer glow', category: 'border' },
    ] },
  ] },
  /* ——— Additional atoms (Tier 2 + Extra) ——— */
  { id: 'rating', name: 'Rating', type: 'atom', tag: 'ai', desc: 'Star rating input for feedback, evaluations, and quality assessment. Supports configurable max stars.', usage: 'AI response quality rating, feedback forms, model evaluation.', tokens: [
    { layer: 'Star Active', compToken: '--rating-star-active', token: '--token-warning', lightVal: '#d4a72c', darkVal: '#e5b93a', purpose: 'Filled star color', category: 'surface' },
    { layer: 'Star Empty', compToken: '--rating-star-empty', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Empty star color', category: 'border' },
    { layer: 'Hover Fill', compToken: '--rating-hover', token: '--token-warning', lightVal: '#d4a72c', darkVal: '#e5b93a', purpose: 'Star fill on hover', category: 'surface' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Interactive star rating', tokens: [] },
    { id: 'hover', label: 'Hover', description: 'Stars highlight on hover', tokens: [
      { layer: 'Hover Fill', compToken: '--rating-hover', token: '--token-warning', lightVal: '#d4a72c', darkVal: '#e5b93a', purpose: 'Highlight color', category: 'surface' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Keyboard focus ring', tokens: [
      { layer: 'Focus Ring', compToken: '--rating-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Focus ring', category: 'border' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive state', tokens: [
      { layer: 'Opacity', compToken: '--rating-opacity', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Reduced opacity', category: 'surface' },
    ] },
  ] },
  { id: 'counter', name: 'Counter', type: 'atom', tag: 'common', desc: 'Increment/decrement numeric input with plus/minus buttons.', usage: 'Quantity selectors, token limits, batch sizing.', tokens: [
    { layer: 'Button BG', compToken: '--counter-btn-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Button surface', category: 'surface' },
    { layer: 'Value Text', compToken: '--counter-value', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Numeric display', category: 'text' },
    { layer: 'Border', compToken: '--counter-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Container border', category: 'border' },
    { layer: 'Radius', compToken: '--counter-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Interactive counter', tokens: [] },
    { id: 'hover', label: 'Hover', description: 'Button highlight on hover', tokens: [] },
    { id: 'focus', label: 'Focus', description: 'Focus ring on buttons', tokens: [] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive, reduced opacity', tokens: [] },
  ] },
  { id: 'segmented-control', name: 'Segmented Control', type: 'atom', tag: 'common', desc: 'Mutually exclusive tab-like control for switching between options. Active indicator slides.', usage: 'View mode toggle, output format selector, theme switch.', tokens: [
    { layer: 'Track BG', compToken: '--seg-track-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Track background', category: 'surface' },
    { layer: 'Active Segment', compToken: '--seg-active-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Active segment surface', category: 'surface' },
    { layer: 'Active Text', compToken: '--seg-active-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Active label', category: 'text' },
    { layer: 'Inactive Text', compToken: '--seg-inactive-text', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Inactive label', category: 'text' },
    { layer: 'Active Shadow', compToken: '--seg-shadow', token: '--token-shadow-sm', lightVal: '0 1px 2px rgba(0,0,0,.04)', darkVal: '0 1px 2px rgba(0,0,0,.25)', purpose: 'Active segment depth', category: 'shadow' },
    { layer: 'Radius', compToken: '--seg-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Corner rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Interactive segmented control', tokens: [] },
    { id: 'hover', label: 'Hover', description: 'Inactive segment highlight', tokens: [] },
    { id: 'focus', label: 'Focus', description: 'Keyboard focus ring', tokens: [] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive', tokens: [] },
  ] },
  { id: 'streaming-dots', name: 'Streaming Dots', type: 'atom', tag: 'ai', desc: 'Three animated dots indicating AI is streaming a response. Configurable size and color.', usage: 'Inline loading indicator during AI response generation.', tokens: [
    { layer: 'Dot Color', compToken: '--sdots-color', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Dot fill', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Animated dots', tokens: [] },
  ] },
  { id: 'bottom-sheet-handle', name: 'Bottom Sheet Handle', type: 'atom', tag: 'common', desc: 'Small draggable handle bar for mobile bottom sheet components.', usage: 'Anchor at top of bottom sheets for drag interaction.', tokens: [
    { layer: 'Handle Color', compToken: '--bsh-color', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Handle bar fill', category: 'surface' },
    { layer: 'Radius', compToken: '--bsh-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Pill shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static handle', tokens: [] },
  ] },
  { id: 'swipe-action', name: 'Swipe Action', type: 'atom', tag: 'common', desc: 'Swipeable wrapper that reveals action buttons behind content.', usage: 'Mobile list items with swipe-to-delete or swipe-to-archive.', tokens: [
    { layer: 'Action BG', compToken: '--swipe-action-bg', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Destructive action surface', category: 'surface' },
    { layer: 'Action Text', compToken: '--swipe-action-text', token: '--token-text-inverse', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Action icon color', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Hidden state', tokens: [] },
  ] },
  { id: 'pull-indicator', name: 'Pull Indicator', type: 'atom', tag: 'common', desc: 'Pull-to-refresh indicator with idle, pulling, refreshing, and done states.', usage: 'Mobile pull-to-refresh interaction at top of scrollable lists.', tokens: [
    { layer: 'Icon Color', compToken: '--pull-icon', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Indicator icon', category: 'text' },
    { layer: 'Text Color', compToken: '--pull-text', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Status text', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Idle state', tokens: [] },
  ] },
  { id: 'color-bar', name: 'Color Bar', type: 'atom', tag: 'ai', desc: 'Multi-segment colored progress bar for usage breakdowns and context window visualization.', usage: 'Token usage breakdown, context window fill, storage allocation.', tokens: [
    { layer: 'Track BG', compToken: '--cbar-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Track background', category: 'surface' },
    { layer: 'Radius', compToken: '--cbar-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Pill shape', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static bar', tokens: [] },
  ] },
  { id: 'collapsible', name: 'Collapsible', type: 'atom', tag: 'common', desc: 'Expandable section with header toggle and animated content reveal.', usage: 'Settings groups, parameter sections, detail panels.', tokens: [
    { layer: 'Header BG', compToken: '--coll-header-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Header surface', category: 'surface' },
    { layer: 'Header Text', compToken: '--coll-header-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Header label', category: 'text' },
    { layer: 'Chevron', compToken: '--coll-chevron', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Toggle indicator', category: 'text' },
    { layer: 'Border', compToken: '--coll-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Section border', category: 'border' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Expanded state', tokens: [] },
    { id: 'open', label: 'Open', description: 'Content visible', tokens: [] },
    { id: 'closed', label: 'Closed', description: 'Content hidden', tokens: [] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive', tokens: [] },
  ] },
  { id: 'legend-item', name: 'Legend Item', type: 'atom', tag: 'ai', desc: 'Color dot with label and optional mono value for chart/data legends.', usage: 'Chart legends, data breakdowns, context window usage labels.', tokens: [
    { layer: 'Label', compToken: '--legend-label', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Label text', category: 'text' },
    { layer: 'Value', compToken: '--legend-value', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Mono value', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Static display', tokens: [] },
  ] },
];

/* ——— Molecules data ——— */
const moleculesData: DSEntry[] = [
  { id: 'search-bar', name: 'Search Bar', type: 'molecule', tag: 'common', desc: 'Composite search field with icon, input, clear button, and keyboard shortcut hint.', usage: 'Component search, chat history filter, knowledge base search.', composition: ['Input', 'Icon', 'Button', 'Kbd'], tokens: [
    { layer: 'Container BG', compToken: '--searchbar-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Input surface', category: 'surface' },
    { layer: 'Kbd BG', compToken: '--searchbar-bg-kbd', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shortcut key surface', category: 'surface' },
    { layer: 'Placeholder', compToken: '--searchbar-text-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder and icon', category: 'text' },
    { layer: 'Container Border', compToken: '--searchbar-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Outer border and kbd border', category: 'border' },
    { layer: 'Container Radius', compToken: '--searchbar-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Rounded container', category: 'shape' },
    { layer: 'Kbd Radius', compToken: '--searchbar-radius-kbd', token: '--token-radius-sm', lightVal: '4px', darkVal: '4px', purpose: 'Key cap rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Empty search bar at rest with placeholder', tokens: [
      { layer: 'Container BG', compToken: '--searchbar-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Input surface', category: 'surface' },
      { layer: 'Placeholder', compToken: '--searchbar-text-placeholder', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder text', category: 'text' },
      { layer: 'Border', compToken: '--searchbar-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Accent border and focus ring with blinking cursor', tokens: [
      { layer: 'Border (Focus)', compToken: '--searchbar-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent focus border', category: 'border' },
      { layer: 'Focus Ring', compToken: '--searchbar-ring', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
      { layer: 'Icon (Focus)', compToken: '--searchbar-icon-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Search icon promoted', category: 'text' },
    ] },
    { id: 'filled', label: 'Filled', description: 'Search bar with query text and clear button', tokens: [
      { layer: 'Input Text', compToken: '--searchbar-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Query text', category: 'text' },
      { layer: 'Clear Icon', compToken: '--searchbar-text-clear', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Clear X button', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive, muted appearance', tokens: [
      { layer: 'Disabled BG', compToken: '--searchbar-bg-disabled', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Disabled surface', category: 'surface' },
      { layer: 'Opacity', compToken: '--searchbar-opacity', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Overall opacity', category: 'surface' },
    ] },
  ] },
  { id: 'list-item', name: 'List Item', type: 'molecule', tag: 'ai', desc: 'Row with icon, title, metadata, and chevron for navigation.', usage: 'Chat history entries, file lists, settings rows.', composition: ['Icon', 'Badge', 'Dot'], tokens: [
    { layer: 'Active BG', compToken: '--listitem-bg-active', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Selected highlight', category: 'surface' },
    { layer: 'Title (Active)', compToken: '--listitem-text-active', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Active item title', category: 'text' },
    { layer: 'Title', compToken: '--listitem-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Item label', category: 'text' },
    { layer: 'Meta', compToken: '--listitem-text-meta', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Timestamp', category: 'text' },
    { layer: 'Icon', compToken: '--listitem-text-icon', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Row icon and chevron', category: 'text' },
    { layer: 'Radius', compToken: '--listitem-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Row hover radius', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'List items at rest, one active', tokens: [
      { layer: 'Active BG', compToken: '--listitem-bg-active', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Selected row', category: 'surface' },
      { layer: 'Title', compToken: '--listitem-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Item label', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Row highlight on mouse hover', tokens: [
      { layer: 'Hover BG', compToken: '--listitem-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hovered row fill', category: 'surface' },
    ] },
    { id: 'active', label: 'Active', description: 'Selected/active item state', tokens: [
      { layer: 'Active Title', compToken: '--listitem-text-active', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Active item text', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive list items', tokens: [
      { layer: 'Opacity', compToken: '--listitem-opacity', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Dimmed rows', category: 'surface' },
    ] },
  ] },
  { id: 'message-bubble', name: 'Message Bubble', type: 'molecule', tag: 'ai', desc: 'Chat message with avatar, content, and role-specific styling.', usage: 'User messages, AI responses, system messages.', composition: ['Avatar', 'Badge', 'Divider'], tokens: [
    { layer: 'User BG', compToken: '--bubble-bg-user', token: '--token-user-bubble', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'User bubble fill', category: 'surface' },
    { layer: 'User Text', compToken: '--bubble-text-user', token: '--token-user-bubble-text', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'User text', category: 'text' },
    { layer: 'AI BG', compToken: '--bubble-bg-ai', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'AI bubble surface', category: 'surface' },
    { layer: 'AI Avatar', compToken: '--bubble-bg-avatar', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'AI identity circle', category: 'surface' },
    { layer: 'AI Avatar Icon', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'AI avatar icon', category: 'text' },
    { layer: 'AI Text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'AI response text', category: 'text' },
    { layer: 'AI Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'AI bubble border', category: 'border' },
    { layer: 'Font Size', token: '--token-text-sm', lightVal: '13px', darkVal: '13px', purpose: 'Message body size', category: 'text' },
    { layer: 'Avatar Radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'AI avatar circle', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'User and AI messages in normal display', tokens: [
      { layer: 'User BG', compToken: '--bubble-bg-user', token: '--token-user-bubble', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'User bubble', category: 'surface' },
      { layer: 'AI BG', compToken: '--bubble-bg-ai', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'AI bubble', category: 'surface' },
    ] },
    { id: 'streaming', label: 'Streaming', description: 'AI response streaming with blinking cursor', tokens: [
      { layer: 'Cursor', compToken: '--bubble-cursor', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Blinking cursor bar', category: 'surface' },
      { layer: 'Blink', compToken: '--bubble-motion-blink', token: '--token-duration-normal', lightVal: '1s step-end', darkVal: '1s step-end', purpose: 'Cursor blink', category: 'motion' },
    ] },
    { id: 'error', label: 'Error', description: 'Error state with red avatar and error message', tokens: [
      { layer: 'Error Avatar', compToken: '--bubble-bg-error-avatar', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error avatar fill', category: 'surface' },
      { layer: 'Error Bubble BG', compToken: '--bubble-bg-error', token: '--token-error-light', lightVal: '#f0d8d8', darkVal: '#2a1111', purpose: 'Error bubble surface', category: 'surface' },
      { layer: 'Error Border', compToken: '--bubble-border-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error border', category: 'border' },
      { layer: 'Error Text', compToken: '--bubble-text-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error message text', category: 'text' },
    ] },
  ] },
  { id: 'toolbar', name: 'Toolbar', type: 'molecule', tag: 'ai', desc: 'Grouped action buttons with dividers.', usage: 'Response actions: copy, like, dislike, retry, share.', composition: ['Button', 'Divider'], tokens: [
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Toolbar outline', category: 'border' },
    { layer: 'Button Color', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Icon color', category: 'text' },
    { layer: 'Radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Toolbar rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Toolbar buttons at rest', tokens: [
      { layer: 'Button Color', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Icon color', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Button highlighted on hover', tokens: [
      { layer: 'Hover BG', compToken: '--toolbar-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
      { layer: 'Hover Text', compToken: '--toolbar-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted icon', category: 'text' },
    ] },
    { id: 'active', label: 'Active', description: 'Active/toggled button (e.g. liked)', tokens: [
      { layer: 'Active BG', compToken: '--toolbar-bg-active', token: '--token-bg-active', lightVal: 'rgba(0,0,0,.06)', darkVal: 'rgba(255,255,255,.08)', purpose: 'Active fill', category: 'surface' },
      { layer: 'Active Color', compToken: '--toolbar-text-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent icon', category: 'text' },
    ] },
  ] },
  { id: 'stat-display', name: 'Stat Display', type: 'molecule', tag: 'ai', desc: 'Metric card with label, value, and trend indicator.', usage: 'Token usage, latency, cost metrics.', composition: ['Badge', 'Icon'], tokens: [
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Card border', category: 'border' },
    { layer: 'Label', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Metric label', category: 'text' },
    { layer: 'Value', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Metric number', category: 'text' },
    { layer: 'Trend Up', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Positive trend', category: 'text' },
    { layer: 'Trend Down', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Negative trend', category: 'text' },
    { layer: 'Value Font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Numeric font', category: 'text' },
    { layer: 'Radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Card rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Metric cards with data', tokens: [
      { layer: 'Value', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Metric number', category: 'text' },
      { layer: 'Label', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Metric label', category: 'text' },
    ] },
    { id: 'loading', label: 'Loading', description: 'Skeleton shimmer while fetching data', tokens: [
      { layer: 'Shimmer Base', compToken: '--stat-shimmer-base', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Shimmer base', category: 'surface' },
      { layer: 'Shimmer Highlight', compToken: '--stat-shimmer-peak', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Shimmer peak', category: 'surface' },
    ] },
  ] },
  { id: 'form-field', name: 'Form Field', type: 'molecule', tag: 'common', desc: 'Label, input, and helper text composition.', usage: 'Model config, parameter inputs, settings forms.', composition: ['Input', 'Badge'], tokens: [
    { layer: 'Label', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Field label', category: 'text' },
    { layer: 'Required', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Asterisk', category: 'text' },
    { layer: 'Helper', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Description', category: 'text' },
    { layer: 'Gap', token: '--token-space-1-5', lightVal: '6px', darkVal: '6px', purpose: 'Vertical spacing', category: 'spacing' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Form field at rest with label, input, and helper', tokens: [
      { layer: 'Label', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Field label', category: 'text' },
      { layer: 'Required', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Asterisk indicator', category: 'text' },
      { layer: 'Helper', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Description text', category: 'text' },
      { layer: 'Input Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Input border', category: 'border' },
    ] },
    { id: 'focus', label: 'Focus', description: 'Input focused with accent ring', tokens: [
      { layer: 'Focus Border', compToken: '--formfield-border-focus', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent focus border', category: 'border' },
      { layer: 'Focus Ring', compToken: '--formfield-ring-focus', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: '3px focus ring', category: 'border' },
    ] },
    { id: 'error', label: 'Error', description: 'Validation error with red border and message', tokens: [
      { layer: 'Error Border', compToken: '--formfield-border-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error border', category: 'border' },
      { layer: 'Error Ring', compToken: '--formfield-ring-error', token: '--token-error-light', lightVal: 'rgba(229,72,77,.15)', darkVal: 'rgba(239,68,68,.15)', purpose: 'Error ring', category: 'border' },
      { layer: 'Error Text', compToken: '--formfield-text-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error message', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-editable field with muted appearance', tokens: [
      { layer: 'Disabled BG', compToken: '--formfield-bg-disabled', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Disabled surface', category: 'surface' },
      { layer: 'Opacity', compToken: '--formfield-opacity', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Overall dimming', category: 'surface' },
    ] },
  ] },
  { id: 'tab-bar', name: 'Tab Bar', type: 'molecule', tag: 'common', desc: 'Horizontal tab navigation with active indicator.', usage: 'Section switching, model categories, output views.', composition: ['Button', 'Divider'], tokens: [
    { layer: 'Active Text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Selected tab', category: 'text' },
    { layer: 'Inactive Text', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Unselected tab', category: 'text' },
    { layer: 'Active Line', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: '2px indicator', category: 'surface' },
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Bottom divider', category: 'border' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Tab bar with active indicator', tokens: [
      { layer: 'Active Text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Selected tab', category: 'text' },
      { layer: 'Active Line', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: '2px indicator', category: 'surface' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Tab text promoted on hover', tokens: [
      { layer: 'Hover Text', compToken: '--tab-text-hover', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Hover tab text', category: 'text' },
    ] },
  ] },
  { id: 'header-bar', name: 'Header Bar', type: 'molecule', tag: 'ai', desc: 'Title with badges and action buttons.', usage: 'Panel headers, dialog titles, section labels.', composition: ['Badge', 'Button'], tokens: [
    { layer: 'Background', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Header surface', category: 'surface' },
    { layer: 'Title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Header text', category: 'text' },
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Border', category: 'border' },
    { layer: 'Padding', token: '--token-space-3 / -4', lightVal: '12px / 16px', darkVal: '12px / 16px', purpose: 'Header padding', category: 'spacing' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Header bar with title, badge, and action buttons', tokens: [
      { layer: 'Background', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Header surface', category: 'surface' },
      { layer: 'Title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Header text', category: 'text' },
      { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Bottom border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Action buttons show hover fill', tokens: [
      { layer: 'Button Hover BG', compToken: '--header-btn-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Button hover fill', category: 'surface' },
    ] },
  ] },
  { id: 'step-indicator', name: 'Step Indicator', type: 'molecule', tag: 'ai', desc: 'Multi-step progress with numbered circles and connecting lines.', usage: 'Reasoning traces, action plans, setup wizards.', composition: ['Dot', 'Badge', 'Divider'], tokens: [
    { layer: 'Done', token: '--token-step-done', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Completed step', category: 'surface' },
    { layer: 'Active', token: '--token-step-active', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current step', category: 'surface' },
    { layer: 'Pending', token: '--token-step-pending', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Future step', category: 'surface' },
    { layer: 'Line', token: '--token-step-line', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Connecting line', category: 'border' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Multi-step progress — one done, one active, one pending', tokens: [
      { layer: 'Done', token: '--token-step-done', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'Completed olivine', category: 'surface' },
      { layer: 'Active', token: '--token-step-active', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current moonstone', category: 'surface' },
      { layer: 'Pending', token: '--token-step-pending', lightVal: '#d1d1d1', darkVal: '#3f3f46', purpose: 'Future neutral', category: 'surface' },
      { layer: 'Line', token: '--token-step-line', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Connecting line', category: 'border' },
    ] },
    { id: 'complete', label: 'Complete', description: 'All steps completed', tokens: [
      { layer: 'All Done', token: '--token-step-done', lightVal: '#697459', darkVal: '#8a9b77', purpose: 'All steps olivine', category: 'surface' },
    ] },
  ] },
  { id: 'chip-group', name: 'Chip Group', type: 'molecule', tag: 'ai', desc: 'Multi-select chip row for filtering.', usage: 'Model selection, tag filters, capability selection.', composition: ['Tag', 'Button'], tokens: [
    { layer: 'Selected Accent', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active border and label', category: 'border' },
    { layer: 'Selected BG', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Active fill', category: 'surface' },
    { layer: 'Gap', token: '--token-space-2', lightVal: '8px', darkVal: '8px', purpose: 'Chip spacing', category: 'spacing' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Multi-select chips with some selected', tokens: [
      { layer: 'Selected Border', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active chip border', category: 'border' },
      { layer: 'Selected BG', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Active chip fill', category: 'surface' },
      { layer: 'Unselected Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Inactive chip border', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Unselected chip shows hover fill', tokens: [
      { layer: 'Hover BG', compToken: '--chip-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
    ] },
    { id: 'all-selected', label: 'All Selected', description: 'All chips in selected state', tokens: [
      { layer: 'All Selected BG', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'All active fills', category: 'surface' },
    ] },
    { id: 'none', label: 'None Selected', description: 'No chips selected', tokens: [
      { layer: 'Unselected Text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'All inactive text', category: 'text' },
    ] },
  ] },
  { id: 'empty-state', name: 'Empty State', type: 'molecule', tag: 'common', desc: 'Placeholder with icon, message, and call-to-action.', usage: 'Empty chat list, no search results, first-time experience.', composition: ['Icon', 'Button'], tokens: [
    { layer: 'Icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder icon', category: 'text' },
    { layer: 'Title', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Heading', category: 'text' },
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Dashed border', category: 'border' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Placeholder with icon, message, and CTA button', tokens: [
      { layer: 'Icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Placeholder icon', category: 'text' },
      { layer: 'Title', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Heading text', category: 'text' },
      { layer: 'Description', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Subtitle text', category: 'text' },
      { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Dashed border', category: 'border' },
      { layer: 'CTA BG', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Button fill', category: 'surface' },
    ] },
    { id: 'hover', label: 'Hover', description: 'CTA button in hover state', tokens: [
      { layer: 'CTA Hover BG', compToken: '--empty-btn-hover', token: '--token-accent-hover', lightVal: '#405a6a', darkVal: '#8ea3b4', purpose: 'Button hover fill', category: 'surface' },
    ] },
  ] },
  { id: 'toggle-row', name: 'Toggle Row', type: 'molecule', tag: 'common', desc: 'Setting row with label, description, and toggle.', usage: 'Feature toggles, streaming settings, privacy.', composition: ['Toggle', 'Divider'], tokens: [
    { layer: 'Title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Setting name', category: 'text' },
    { layer: 'Description', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Help text', category: 'text' },
    { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Row border', category: 'border' },
    { layer: 'Padding', token: '--token-space-3 / -4', lightVal: '12px / 16px', darkVal: '12px / 16px', purpose: 'Row padding', category: 'spacing' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Interactive toggle rows — click toggles to switch', tokens: [
      { layer: 'Title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Setting name', category: 'text' },
      { layer: 'Description', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Help text', category: 'text' },
      { layer: 'Border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Row divider', category: 'border' },
      { layer: 'Track (On)', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active toggle', category: 'surface' },
    ] },
    { id: 'all-on', label: 'All On', description: 'All toggles forced to on state', tokens: [
      { layer: 'Track (On)', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'All tracks active', category: 'surface' },
    ] },
    { id: 'all-off', label: 'All Off', description: 'All toggles forced to off state', tokens: [
      { layer: 'Track (Off)', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'All tracks inactive', category: 'surface' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Non-interactive rows with reduced opacity', tokens: [
      { layer: 'Opacity', compToken: '--togglerow-opacity-disabled', token: '--token-text-disabled', lightVal: '0.5', darkVal: '0.5', purpose: 'Disabled state', category: 'surface' },
    ] },
  ] },
  { id: 'breadcrumb', name: 'Breadcrumb', type: 'molecule', tag: 'common', desc: 'Path navigation with linked segments and chevrons.', usage: 'File tree nav, settings hierarchy, component paths.', composition: ['Icon', 'Divider'], tokens: [
    { layer: 'Active', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Current location', category: 'text' },
    { layer: 'Parent', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Ancestor links', category: 'text' },
    { layer: 'Separator', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Chevron', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Path navigation with current segment highlighted', tokens: [
      { layer: 'Active', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Current location', category: 'text' },
      { layer: 'Parent', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Ancestor links', category: 'text' },
      { layer: 'Separator', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Chevron icon', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Parent segment changes to accent on hover', tokens: [
      { layer: 'Hover Text', compToken: '--breadcrumb-text-hover', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Link hover color', category: 'text' },
    ] },
  ] },
  /* ——— NEW Tier 1 Molecules ——— */
  { id: 'dropdown-menu', name: 'Dropdown Menu', type: 'molecule', tag: 'common', desc: 'Floating action menu triggered from a button or select. Supports icons, dividers, and danger items.', usage: 'Context actions, user menu, model actions, export options.', composition: ['Button', 'Icon', 'Divider'], tokens: [
    { layer: 'Panel BG', compToken: '--dropdown-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Menu panel surface', category: 'surface' },
    { layer: 'Panel Border', compToken: '--dropdown-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Panel outline', category: 'border' },
    { layer: 'Panel Shadow', compToken: '--dropdown-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Floating elevation', category: 'shadow' },
    { layer: 'Item Text', compToken: '--dropdown-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Menu item label', category: 'text' },
    { layer: 'Danger Text', compToken: '--dropdown-text-danger', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Destructive action', category: 'text' },
    { layer: 'Divider', compToken: '--dropdown-divider', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Section divider', category: 'border' },
    { layer: 'Radius', compToken: '--dropdown-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Panel rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Menu items at rest', tokens: [
      { layer: 'Panel BG', compToken: '--dropdown-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Panel surface', category: 'surface' },
      { layer: 'Item Text', compToken: '--dropdown-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Item label', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Item highlighted on hover', tokens: [
      { layer: 'Hover BG', compToken: '--dropdown-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
      { layer: 'Hover Text', compToken: '--dropdown-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted text', category: 'text' },
    ] },
    { id: 'active', label: 'Active', description: 'Item in active/pressed state', tokens: [
      { layer: 'Active BG', compToken: '--dropdown-bg-active', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Active fill', category: 'surface' },
      { layer: 'Active Text', compToken: '--dropdown-text-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent text', category: 'text' },
    ] },
    { id: 'disabled-item', label: 'Disabled Item', description: 'Non-interactive menu item', tokens: [
      { layer: 'Disabled Text', compToken: '--dropdown-text-disabled', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Greyed text', category: 'text' },
      { layer: 'Opacity', compToken: '--dropdown-opacity', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'toast', name: 'Toast', type: 'molecule', tag: 'common', desc: 'Transient notification with icon, message, and dismiss action. Supports 5 semantic variants.', usage: 'Copy confirmation, error alerts, success messages, API status updates.', composition: ['Badge', 'Icon', 'Button'], tokens: [
    { layer: 'Background', compToken: '--toast-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Toast surface', category: 'surface' },
    { layer: 'Border', compToken: '--toast-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
    { layer: 'Text', compToken: '--toast-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Message text', category: 'text' },
    { layer: 'Meta', compToken: '--toast-text-meta', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Timestamp text', category: 'text' },
    { layer: 'Close', compToken: '--toast-text-close', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Close X icon', category: 'text' },
    { layer: 'Shadow', compToken: '--toast-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Toast elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--toast-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Toast rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Neutral toast notification', tokens: [
      { layer: 'Border', compToken: '--toast-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default border', category: 'border' },
      { layer: 'Icon', compToken: '--toast-icon', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Info icon', category: 'text' },
    ] },
    { id: 'success', label: 'Success', description: 'Green accent for positive outcomes', tokens: [
      { layer: 'Accent Border', compToken: '--toast-border-success', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Success border', category: 'border' },
      { layer: 'Icon', compToken: '--toast-icon-success', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Check icon', category: 'text' },
    ] },
    { id: 'error', label: 'Error', description: 'Red accent for failures', tokens: [
      { layer: 'Accent Border', compToken: '--toast-border-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error border', category: 'border' },
      { layer: 'Icon', compToken: '--toast-icon-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Warning icon', category: 'text' },
    ] },
    { id: 'warning', label: 'Warning', description: 'Amber accent for cautions', tokens: [
      { layer: 'Accent Border', compToken: '--toast-border-warning', token: '--token-warning', lightVal: '#9f8136', darkVal: '#d4aa55', purpose: 'Warning border', category: 'border' },
      { layer: 'Icon', compToken: '--toast-icon-warning', token: '--token-warning', lightVal: '#9f8136', darkVal: '#d4aa55', purpose: 'Warning icon', category: 'text' },
    ] },
    { id: 'info', label: 'Info', description: 'Moonstone accent for informational', tokens: [
      { layer: 'Accent Border', compToken: '--toast-border-info', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Info border', category: 'border' },
      { layer: 'Icon', compToken: '--toast-icon-info', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Info icon', category: 'text' },
    ] },
  ] },
  { id: 'modal', name: 'Modal', type: 'molecule', tag: 'common', desc: 'Overlay dialog with header, body, and action footer. Blocks interaction with background.', usage: 'Confirmation dialogs, settings panels, detail views, destructive action prompts.', composition: ['Button', 'Icon', 'Divider'], tokens: [
    { layer: 'Overlay BG', compToken: '--modal-overlay', token: '--token-bg-overlay', lightVal: 'rgba(0,0,0,0.5)', darkVal: 'rgba(0,0,0,0.7)', purpose: 'Backdrop overlay', category: 'surface' },
    { layer: 'Panel BG', compToken: '--modal-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Dialog panel surface', category: 'surface' },
    { layer: 'Header BG', compToken: '--modal-bg-header', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Header bar', category: 'surface' },
    { layer: 'Title', compToken: '--modal-text-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Dialog title', category: 'text' },
    { layer: 'Body', compToken: '--modal-text-body', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Body text', category: 'text' },
    { layer: 'Close', compToken: '--modal-text-close', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Close X icon', category: 'text' },
    { layer: 'Border', compToken: '--modal-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Panel and header border', category: 'border' },
    { layer: 'Shadow', compToken: '--modal-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Panel elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--modal-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Panel rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Dialog with header, body, and action buttons', tokens: [
      { layer: 'Panel BG', compToken: '--modal-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Panel surface', category: 'surface' },
      { layer: 'Title', compToken: '--modal-text-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Title text', category: 'text' },
      { layer: 'Border', compToken: '--modal-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Borders', category: 'border' },
    ] },
    { id: 'overlay', label: 'Overlay', description: 'With backdrop overlay visible', tokens: [
      { layer: 'Overlay', compToken: '--modal-overlay', token: '--token-bg-overlay', lightVal: 'rgba(0,0,0,0.5)', darkVal: 'rgba(0,0,0,0.7)', purpose: 'Background dim', category: 'surface' },
      { layer: 'Shadow', compToken: '--modal-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Elevated panel', category: 'shadow' },
    ] },
  ] },
  { id: 'card', name: 'Card', type: 'molecule', tag: 'common', desc: 'Generic container with header, body content, and optional hover/active states.', usage: 'Metric cards, suggestion cards, feature previews, content grouping.', composition: ['Icon', 'Badge', 'Divider'], tokens: [
    { layer: 'Background', compToken: '--card-mol-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Card surface', category: 'surface' },
    { layer: 'Border', compToken: '--card-mol-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Card outline', category: 'border' },
    { layer: 'Title', compToken: '--card-mol-text-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Card heading', category: 'text' },
    { layer: 'Subtitle', compToken: '--card-mol-text-sub', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Supporting text', category: 'text' },
    { layer: 'Value', compToken: '--card-mol-text-value', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Data value', category: 'text' },
    { layer: 'Value Font', compToken: '--card-mol-font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Monospace value', category: 'text' },
    { layer: 'Radius', compToken: '--card-mol-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Card rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Cards at rest with content', tokens: [
      { layer: 'Background', compToken: '--card-mol-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Card surface', category: 'surface' },
      { layer: 'Border', compToken: '--card-mol-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Card outline', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Elevated appearance on hover', tokens: [
      { layer: 'Hover BG', compToken: '--card-mol-bg-hover', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Hover surface', category: 'surface' },
      { layer: 'Hover Shadow', compToken: '--card-mol-shadow-hover', token: '--token-shadow-sm', lightVal: '0 1px 3px rgba(0,0,0,.08)', darkVal: '0 1px 3px rgba(0,0,0,.25)', purpose: 'Hover elevation', category: 'shadow' },
    ] },
    { id: 'active', label: 'Active', description: 'Accent border for selected card', tokens: [
      { layer: 'Active Border', compToken: '--card-mol-border-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border', category: 'border' },
    ] },
  ] },
  { id: 'alert', name: 'Alert', type: 'molecule', tag: 'ai', desc: 'Persistent informational banner with icon, title, and description. 4 semantic severity levels.', usage: 'Rate limit warnings, API key expiration, model deprecation notices, success confirmations.', composition: ['Icon', 'Badge'], tokens: [
    { layer: 'Info BG', compToken: '--alert-bg-info', token: '--token-info-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Info alert surface', category: 'surface' },
    { layer: 'Info Accent', compToken: '--alert-accent-info', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Info icon and border', category: 'border' },
    { layer: 'Warning BG', compToken: '--alert-bg-warning', token: '--token-warning-light', lightVal: '#ede3c7', darkVal: '#241e0d', purpose: 'Warning surface', category: 'surface' },
    { layer: 'Warning Accent', compToken: '--alert-accent-warning', token: '--token-warning', lightVal: '#9f8136', darkVal: '#d4aa55', purpose: 'Warning icon and border', category: 'border' },
    { layer: 'Error BG', compToken: '--alert-bg-error', token: '--token-error-light', lightVal: '#f0d8d8', darkVal: '#2a1111', purpose: 'Error surface', category: 'surface' },
    { layer: 'Error Accent', compToken: '--alert-accent-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error icon and border', category: 'border' },
    { layer: 'Success BG', compToken: '--alert-bg-success', token: '--token-success-light', lightVal: '#d2e8dc', darkVal: '#0e211a', purpose: 'Success surface', category: 'surface' },
    { layer: 'Success Accent', compToken: '--alert-accent-success', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Success icon and border', category: 'border' },
    { layer: 'Title', compToken: '--alert-text-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Alert heading', category: 'text' },
    { layer: 'Body', compToken: '--alert-text-body', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Alert description', category: 'text' },
    { layer: 'Radius', compToken: '--alert-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Alert rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Info', description: 'Moonstone-tinted informational alert', tokens: [
      { layer: 'Background', compToken: '--alert-bg-info', token: '--token-info-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Info surface', category: 'surface' },
      { layer: 'Accent', compToken: '--alert-accent-info', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Info border and icon', category: 'border' },
    ] },
    { id: 'warning', label: 'Warning', description: 'Ochre-tinted warning alert', tokens: [
      { layer: 'Background', compToken: '--alert-bg-warning', token: '--token-warning-light', lightVal: '#ede3c7', darkVal: '#241e0d', purpose: 'Warning surface', category: 'surface' },
      { layer: 'Accent', compToken: '--alert-accent-warning', token: '--token-warning', lightVal: '#9f8136', darkVal: '#d4aa55', purpose: 'Warning border', category: 'border' },
    ] },
    { id: 'error', label: 'Error', description: 'Garnet-tinted error alert', tokens: [
      { layer: 'Background', compToken: '--alert-bg-error', token: '--token-error-light', lightVal: '#f0d8d8', darkVal: '#2a1111', purpose: 'Error surface', category: 'surface' },
      { layer: 'Accent', compToken: '--alert-accent-error', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Error border', category: 'border' },
    ] },
    { id: 'success', label: 'Success', description: 'Malachite-tinted success alert', tokens: [
      { layer: 'Background', compToken: '--alert-bg-success', token: '--token-success-light', lightVal: '#d2e8dc', darkVal: '#0e211a', purpose: 'Success surface', category: 'surface' },
      { layer: 'Accent', compToken: '--alert-accent-success', token: '--token-success', lightVal: '#2d7a60', darkVal: '#6aab8a', purpose: 'Success border', category: 'border' },
    ] },
  ] },
  /* ——— NEW Tier 2 Molecules ——— */
  { id: 'popover', name: 'Popover', type: 'molecule', tag: 'common', desc: 'Floating content panel anchored to a trigger. Supports rich content with optional arrow.', usage: 'Filter panels, model settings, info cards, color pickers.', composition: ['Card', 'Divider'], tokens: [
    { layer: 'Panel BG', compToken: '--popover-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Popover surface', category: 'surface' },
    { layer: 'Border', compToken: '--popover-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Panel border', category: 'border' },
    { layer: 'Shadow', compToken: '--popover-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Panel elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--popover-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Panel rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Popover panel with content sections', tokens: [
      { layer: 'Panel BG', compToken: '--popover-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Surface', category: 'surface' },
      { layer: 'Border', compToken: '--popover-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Border', category: 'border' },
    ] },
    { id: 'arrow', label: 'With Arrow', description: 'Popover with directional arrow', tokens: [
      { layer: 'Arrow', compToken: '--popover-arrow', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Arrow border', category: 'border' },
    ] },
  ] },
  { id: 'avatar-group', name: 'Avatar Group', type: 'molecule', tag: 'ai', desc: 'Stacked overlapping avatars showing multiple participants with overflow counter.', usage: 'Shared conversation participants, team members, model ensemble display.', composition: ['Avatar', 'Badge'], tokens: [
    { layer: 'Ring', compToken: '--avatargroup-ring', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Avatar border ring', category: 'border' },
    { layer: 'Overflow BG', compToken: '--avatargroup-overflow-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Overflow count surface', category: 'surface' },
    { layer: 'Overflow Text', compToken: '--avatargroup-overflow-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Count number', category: 'text' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Stacked avatars with overlap', tokens: [
      { layer: 'Ring', compToken: '--avatargroup-ring', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Border ring', category: 'border' },
    ] },
    { id: 'hover', label: 'Hover', description: 'First avatar shows focus ring', tokens: [
      { layer: 'Hover Ring', compToken: '--avatargroup-ring-hover', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Hover glow', category: 'border' },
    ] },
    { id: 'overflow', label: 'Overflow', description: 'Shows +N counter for extra members', tokens: [
      { layer: 'Overflow BG', compToken: '--avatargroup-overflow-bg', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Count surface', category: 'surface' },
      { layer: 'Overflow Text', compToken: '--avatargroup-overflow-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Count', category: 'text' },
    ] },
  ] },
  { id: 'accordion', name: 'Accordion', type: 'molecule', tag: 'ai', desc: 'Collapsible content sections with headers and chevron indicators.', usage: 'Reasoning step details, FAQ, settings groups, expandable model info.', composition: ['Icon', 'Divider'], tokens: [
    { layer: 'Header Text', compToken: '--accordion-text-header', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Section header', category: 'text' },
    { layer: 'Content BG', compToken: '--accordion-bg-content', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Expanded content area', category: 'surface' },
    { layer: 'Content Text', compToken: '--accordion-text-content', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Body text', category: 'text' },
    { layer: 'Chevron', compToken: '--accordion-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Expand/collapse icon', category: 'text' },
    { layer: 'Border', compToken: '--accordion-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Section borders', category: 'border' },
    { layer: 'Radius', compToken: '--accordion-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Container rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'All sections collapsed', tokens: [
      { layer: 'Header', compToken: '--accordion-text-header', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Section header', category: 'text' },
      { layer: 'Chevron', compToken: '--accordion-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Chevron icon', category: 'text' },
    ] },
    { id: 'open', label: 'Open', description: 'First section expanded with content', tokens: [
      { layer: 'Content BG', compToken: '--accordion-bg-content', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Content area', category: 'surface' },
      { layer: 'Content Text', compToken: '--accordion-text-content', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Body text', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Header shows hover fill', tokens: [
      { layer: 'Hover BG', compToken: '--accordion-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
    ] },
  ] },
  { id: 'pagination', name: 'Pagination', type: 'molecule', tag: 'common', desc: 'Page navigation with numbered buttons, prev/next arrows, and ellipsis.', usage: 'Chat history pages, search results, log pagination, data table pages.', composition: ['Button', 'Icon'], tokens: [
    { layer: 'Active BG', compToken: '--page-bg-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current page fill', category: 'surface' },
    { layer: 'Active Text', compToken: '--page-text-active', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Current page text', category: 'text' },
    { layer: 'Text', compToken: '--page-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Page number', category: 'text' },
    { layer: 'Arrow Border', compToken: '--page-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Prev/next border', category: 'border' },
    { layer: 'Font', compToken: '--page-font', token: '--token-font-mono', lightVal: 'JetBrains Mono', darkVal: 'JetBrains Mono', purpose: 'Page numbers', category: 'text' },
    { layer: 'Radius', compToken: '--page-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Button rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Page buttons with one active', tokens: [
      { layer: 'Active BG', compToken: '--page-bg-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current page', category: 'surface' },
      { layer: 'Text', compToken: '--page-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Page numbers', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Page button shows hover fill', tokens: [
      { layer: 'Hover BG', compToken: '--page-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
      { layer: 'Hover Text', compToken: '--page-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted text', category: 'text' },
    ] },
    { id: 'active', label: 'Active', description: 'Accent-filled active page', tokens: [
      { layer: 'Active BG', compToken: '--page-bg-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active fill', category: 'surface' },
      { layer: 'Active Text', compToken: '--page-text-active', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'White text', category: 'text' },
    ] },
    { id: 'disabled', label: 'Disabled', description: 'Previous arrow disabled on first page', tokens: [
      { layer: 'Disabled Color', compToken: '--page-text-disabled', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Greyed arrow', category: 'text' },
      { layer: 'Opacity', compToken: '--page-opacity', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'context-menu', name: 'Context Menu', type: 'molecule', tag: 'common', desc: 'Right-click floating menu with icons, shortcuts, and danger items.', usage: 'Message actions, file operations, code block actions, conversation management.', composition: ['Button', 'Icon', 'Kbd', 'Divider'], tokens: [
    { layer: 'Panel BG', compToken: '--ctxmenu-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Menu panel', category: 'surface' },
    { layer: 'Panel Border', compToken: '--ctxmenu-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Panel outline', category: 'border' },
    { layer: 'Panel Shadow', compToken: '--ctxmenu-shadow', token: '--token-shadow-lg', lightVal: '0 8px 30px rgba(0,0,0,.08)', darkVal: '0 8px 30px rgba(0,0,0,.3)', purpose: 'Floating elevation', category: 'shadow' },
    { layer: 'Item Text', compToken: '--ctxmenu-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Item label', category: 'text' },
    { layer: 'Shortcut Text', compToken: '--ctxmenu-text-shortcut', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Key hints', category: 'text' },
    { layer: 'Danger Text', compToken: '--ctxmenu-text-danger', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Destructive action', category: 'text' },
    { layer: 'Radius', compToken: '--ctxmenu-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Panel rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Menu items at rest with shortcuts', tokens: [
      { layer: 'Panel BG', compToken: '--ctxmenu-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Panel surface', category: 'surface' },
      { layer: 'Item Text', compToken: '--ctxmenu-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Labels', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Item highlighted on hover', tokens: [
      { layer: 'Hover BG', compToken: '--ctxmenu-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
      { layer: 'Hover Text', compToken: '--ctxmenu-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted text', category: 'text' },
    ] },
    { id: 'disabled-item', label: 'Disabled Item', description: 'Non-interactive menu item', tokens: [
      { layer: 'Disabled Text', compToken: '--ctxmenu-text-disabled', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Greyed text', category: 'text' },
      { layer: 'Opacity', compToken: '--ctxmenu-opacity', token: '--token-text-disabled', lightVal: '0.4', darkVal: '0.4', purpose: 'Dimmed', category: 'surface' },
    ] },
  ] },
  { id: 'nav-item', name: 'Nav Item', type: 'molecule', tag: 'common', desc: 'Sidebar navigation item with icon, label, and optional badge. Supports collapsed mode.', usage: 'Sidebar navigation, settings menu, workspace switcher, app shell nav.', composition: ['Icon', 'Badge'], tokens: [
    { layer: 'Active BG', compToken: '--nav-bg-active', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Selected item fill', category: 'surface' },
    { layer: 'Active Text', compToken: '--nav-text-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected item label', category: 'text' },
    { layer: 'Default Text', compToken: '--nav-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Inactive item label', category: 'text' },
    { layer: 'Icon', compToken: '--nav-icon', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Inactive icon', category: 'text' },
    { layer: 'Badge BG', compToken: '--nav-badge-bg', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Notification count', category: 'surface' },
    { layer: 'Badge Text', compToken: '--nav-badge-text', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Badge number', category: 'text' },
    { layer: 'Radius', compToken: '--nav-radius', token: '--token-radius-md', lightVal: '8px', darkVal: '8px', purpose: 'Item rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Nav items with one active', tokens: [
      { layer: 'Active BG', compToken: '--nav-bg-active', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Selected fill', category: 'surface' },
      { layer: 'Active Text', compToken: '--nav-text-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected text', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Item shows hover fill', tokens: [
      { layer: 'Hover BG', compToken: '--nav-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
      { layer: 'Hover Text', compToken: '--nav-text-hover', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Promoted text', category: 'text' },
    ] },
    { id: 'active', label: 'Active', description: 'Active item with accent styling', tokens: [
      { layer: 'Active BG', compToken: '--nav-bg-active', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Active fill', category: 'surface' },
    ] },
    { id: 'collapsed', label: 'Collapsed', description: 'Icon-only mode for compact sidebar', tokens: [
      { layer: 'Active Icon', compToken: '--nav-icon-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active icon color', category: 'text' },
    ] },
  ] },
  { id: 'file-drop-zone', name: 'File Drop Zone', type: 'molecule', tag: 'ai', desc: 'Drag-and-drop upload area with file list after upload. Supports dragging state.', usage: 'File attachments to chat, dataset uploads, document ingestion, image inputs for vision models.', composition: ['Icon', 'Button', 'Tag'], tokens: [
    { layer: 'Border (Dashed)', compToken: '--dropzone-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Default dashed border', category: 'border' },
    { layer: 'Drag Border', compToken: '--dropzone-border-drag', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent border when dragging', category: 'border' },
    { layer: 'Drag BG', compToken: '--dropzone-bg-drag', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Tinted surface on drag', category: 'surface' },
    { layer: 'Icon', compToken: '--dropzone-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Upload icon', category: 'text' },
    { layer: 'Icon (Drag)', compToken: '--dropzone-icon-drag', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Upload icon on drag', category: 'text' },
    { layer: 'Text', compToken: '--dropzone-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Instruction text', category: 'text' },
    { layer: 'Meta', compToken: '--dropzone-text-meta', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'File size limits', category: 'text' },
    { layer: 'File Chip BG', compToken: '--dropzone-chip-bg', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Uploaded file chip', category: 'surface' },
    { layer: 'File Name', compToken: '--dropzone-chip-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'File name', category: 'text' },
    { layer: 'Radius', compToken: '--dropzone-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Drop zone rounding', category: 'shape' },
  ], states: [
    { id: 'default', label: 'Default', description: 'Empty drop zone with upload instruction', tokens: [
      { layer: 'Border', compToken: '--dropzone-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Dashed border', category: 'border' },
      { layer: 'Icon', compToken: '--dropzone-icon', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Upload icon', category: 'text' },
      { layer: 'Text', compToken: '--dropzone-text', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Instructions', category: 'text' },
    ] },
    { id: 'hover', label: 'Hover', description: 'Subtle hover fill', tokens: [
      { layer: 'Hover BG', compToken: '--dropzone-bg-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
    ] },
    { id: 'dragging', label: 'Dragging', description: 'Accent border and tinted background during file drag', tokens: [
      { layer: 'Drag Border', compToken: '--dropzone-border-drag', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Accent dashed border', category: 'border' },
      { layer: 'Drag BG', compToken: '--dropzone-bg-drag', token: '--token-accent-muted', lightVal: 'rgba(79,109,128,.12)', darkVal: 'rgba(107,133,152,.12)', purpose: 'Tinted surface', category: 'surface' },
      { layer: 'Icon (Drag)', compToken: '--dropzone-icon-drag', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Promoted icon', category: 'text' },
    ] },
    { id: 'uploaded', label: 'Uploaded', description: 'File list with remove buttons', tokens: [
      { layer: 'File Chip BG', compToken: '--dropzone-chip-bg', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'File chip surface', category: 'surface' },
      { layer: 'File Name', compToken: '--dropzone-chip-text', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'File name text', category: 'text' },
    ] },
  ] },
  /* ——— AI Molecules ——— */
  { id: 'chat-input', name: 'Chat Input', type: 'molecule', tag: 'ai', desc: 'AI chat text input with send, attach, and mic actions. Grows with content.', usage: 'Primary input for AI chat interfaces, prompt composition.', composition: ['Button', 'Input', 'Icon'], tokens: [
    { layer: 'Container BG', compToken: '--chatinput-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Input surface', category: 'surface' },
    { layer: 'Border', compToken: '--chatinput-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Container border', category: 'border' },
    { layer: 'Send Button', compToken: '--chatinput-send', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Send button fill', category: 'surface' },
    { layer: 'Radius', compToken: '--chatinput-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Rounded container', category: 'shape' },
  ] },
  { id: 'typing-indicator', name: 'Typing Indicator', type: 'molecule', tag: 'ai', desc: 'Animated bouncing dots showing AI is composing a response.', usage: 'Chat interfaces during AI response generation.', composition: ['StreamingDots', 'Badge'], tokens: [
    { layer: 'Container BG', compToken: '--typing-bg', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Indicator surface', category: 'surface' },
    { layer: 'Dot Color', compToken: '--typing-dot', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Dot fill', category: 'surface' },
    { layer: 'Label', compToken: '--typing-label', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Status label', category: 'text' },
  ] },
  { id: 'token-counter', name: 'Token Counter', type: 'molecule', tag: 'ai', desc: 'Token usage display with progress bar and used/total count.', usage: 'Context window monitoring, prompt length tracking.', composition: ['Progress', 'Badge'], tokens: [
    { layer: 'Track BG', compToken: '--tokenctr-track', token: '--token-bg-tertiary', lightVal: '#f5f5f5', darkVal: '#18181b', purpose: 'Progress track', category: 'surface' },
    { layer: 'Fill', compToken: '--tokenctr-fill', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Usage fill', category: 'surface' },
    { layer: 'Warning Fill', compToken: '--tokenctr-warn', token: '--token-warning', lightVal: '#d4a72c', darkVal: '#e5b93a', purpose: 'High usage warning', category: 'surface' },
    { layer: 'Value Text', compToken: '--tokenctr-value', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Count display', category: 'text' },
  ] },
  { id: 'model-selector', name: 'Model Selector', type: 'molecule', tag: 'ai', desc: 'AI model picker dropdown with badges for capabilities and status.', usage: 'Model switching in chat headers, parameter panels.', composition: ['Badge', 'Dot', 'Select'], tokens: [
    { layer: 'Container BG', compToken: '--modelselector-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Dropdown surface', category: 'surface' },
    { layer: 'Active Model', compToken: '--modelselector-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Selected model accent', category: 'text' },
    { layer: 'Border', compToken: '--modelselector-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Container border', category: 'border' },
  ] },
  { id: 'prompt-card', name: 'Prompt Card', type: 'molecule', tag: 'ai', desc: 'Suggestion card with title, description, and hover interaction.', usage: 'Welcome screen prompts, suggested actions, template previews.', composition: ['Icon', 'Badge'], tokens: [
    { layer: 'Card BG', compToken: '--promptcard-bg', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Card surface', category: 'surface' },
    { layer: 'Hover BG', compToken: '--promptcard-hover', token: '--token-bg-hover', lightVal: 'rgba(0,0,0,.04)', darkVal: 'rgba(255,255,255,.05)', purpose: 'Hover fill', category: 'surface' },
    { layer: 'Title', compToken: '--promptcard-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Card title', category: 'text' },
    { layer: 'Border', compToken: '--promptcard-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Card border', category: 'border' },
  ] },
  { id: 'copy-block', name: 'Copy Block', type: 'molecule', tag: 'ai', desc: 'Code/text block with syntax highlighting and copy-to-clipboard button.', usage: 'Code snippets, API responses, command examples.', composition: ['Button', 'CodeInline'], tokens: [
    { layer: 'Block BG', compToken: '--copyblock-bg', token: '--token-bg-code', lightVal: '#1a1a2e', darkVal: '#0d0d14', purpose: 'Code block surface', category: 'surface' },
    { layer: 'Text', compToken: '--copyblock-text', token: '--token-code-text', lightVal: '#d4d4d8', darkVal: '#d4d4d8', purpose: 'Code text', category: 'text' },
    { layer: 'Border', compToken: '--copyblock-border', token: '--token-border-subtle', lightVal: '#eaeaea12', darkVal: '#27272a12', purpose: 'Block border', category: 'border' },
  ] },
  { id: 'notification-banner', name: 'Notification Banner', type: 'molecule', tag: 'ai', desc: 'Dismissible banner with icon, title, and description. 4 semantic variants.', usage: 'Feature announcements, rate limit warnings, error banners.', composition: ['Button', 'Icon', 'Badge'], tokens: [
    { layer: 'Banner BG', compToken: '--notifbanner-bg', token: '--token-bg-secondary', lightVal: '#fafafa', darkVal: '#111113', purpose: 'Banner surface', category: 'surface' },
    { layer: 'Border', compToken: '--notifbanner-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Banner border', category: 'border' },
    { layer: 'Title', compToken: '--notifbanner-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Banner title', category: 'text' },
  ] },
  { id: 'filter-bar', name: 'Filter Bar', type: 'molecule', tag: 'ai', desc: 'Horizontal scrollable filter chips with active state.', usage: 'Search result filters, model category selection, content type filtering.', composition: ['Tag', 'Icon'], tokens: [
    { layer: 'Active Chip BG', compToken: '--filterbar-active', token: '--token-accent-light', lightVal: '#dce3ea', darkVal: '#131c22', purpose: 'Active filter surface', category: 'surface' },
    { layer: 'Active Text', compToken: '--filterbar-active-text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active filter text', category: 'text' },
    { layer: 'Inactive Text', compToken: '--filterbar-inactive-text', token: '--token-text-tertiary', lightVal: '#8f8f8f', darkVal: '#707070', purpose: 'Inactive chip text', category: 'text' },
  ] },
  { id: 'slider-group', name: 'Slider Group', type: 'molecule', tag: 'ai', desc: 'Labeled group of sliders for parameter tuning with value displays.', usage: 'Model temperature, top-p, frequency penalty configuration.', composition: ['Slider', 'Input'], tokens: [
    { layer: 'Label', compToken: '--slidergroup-label', token: '--token-text-secondary', lightVal: '#666666', darkVal: '#a1a1a1', purpose: 'Parameter label', category: 'text' },
    { layer: 'Value', compToken: '--slidergroup-value', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Current value', category: 'text' },
  ] },
  /* ——— Mobile Molecules ——— */
  { id: 'bottom-sheet', name: 'Bottom Sheet', type: 'molecule', tag: 'common', desc: 'Mobile bottom sheet drawer with handle, title, and content area.', usage: 'Mobile options, detail panels, action menus.', composition: ['BottomSheetHandle', 'Button'], tokens: [
    { layer: 'Sheet BG', compToken: '--bottomsheet-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Sheet surface', category: 'surface' },
    { layer: 'Handle', compToken: '--bottomsheet-handle', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Drag handle', category: 'surface' },
    { layer: 'Shadow', compToken: '--bottomsheet-shadow', token: '--token-shadow-lg', lightVal: '0 -8px 32px rgba(0,0,0,.08)', darkVal: '0 -8px 32px rgba(0,0,0,.3)', purpose: 'Sheet elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--bottomsheet-radius', token: '--token-radius-lg', lightVal: '12px', darkVal: '12px', purpose: 'Top corners', category: 'shape' },
  ] },
  { id: 'action-sheet', name: 'Action Sheet', type: 'molecule', tag: 'common', desc: 'iOS-style action sheet with stacked action buttons and cancel.', usage: 'Mobile context actions, share menus, destructive confirmations.', composition: ['Button', 'Divider'], tokens: [
    { layer: 'Sheet BG', compToken: '--actionsheet-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Sheet surface', category: 'surface' },
    { layer: 'Action Text', compToken: '--actionsheet-text', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Action label', category: 'text' },
    { layer: 'Destructive', compToken: '--actionsheet-danger', token: '--token-error', lightVal: '#b54a4a', darkVal: '#d47272', purpose: 'Danger action', category: 'text' },
  ] },
  { id: 'bottom-nav', name: 'Bottom Nav', type: 'molecule', tag: 'common', desc: 'Mobile bottom navigation bar with icons and labels.', usage: 'Primary app navigation on mobile, tab switching.', composition: ['Icon', 'Badge'], tokens: [
    { layer: 'Bar BG', compToken: '--bottomnav-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Nav bar surface', category: 'surface' },
    { layer: 'Active Icon', compToken: '--bottomnav-active', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Active tab icon', category: 'text' },
    { layer: 'Inactive Icon', compToken: '--bottomnav-inactive', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Inactive tab', category: 'text' },
    { layer: 'Border Top', compToken: '--bottomnav-border', token: '--token-border', lightVal: '#eaeaea', darkVal: '#27272a', purpose: 'Top border', category: 'border' },
  ] },
  { id: 'swipeable-row', name: 'Swipeable Row', type: 'molecule', tag: 'common', desc: 'List row with hidden swipe actions revealed on gesture.', usage: 'Chat history items with delete/archive, notification management.', composition: ['SwipeAction', 'ListItem'], tokens: [
    { layer: 'Row BG', compToken: '--swiperow-bg', token: '--token-bg', lightVal: '#ffffff', darkVal: '#09090b', purpose: 'Row surface', category: 'surface' },
    { layer: 'Title', compToken: '--swiperow-title', token: '--token-text-primary', lightVal: '#0a0a0a', darkVal: '#ededed', purpose: 'Item title', category: 'text' },
    { layer: 'Meta', compToken: '--swiperow-meta', token: '--token-text-disabled', lightVal: '#c4c4c4', darkVal: '#3b3b3b', purpose: 'Timestamp', category: 'text' },
  ] },
  { id: 'fab', name: 'FAB', type: 'molecule', tag: 'common', desc: 'Floating action button for primary mobile actions. Supports icon-only and icon+label.', usage: 'New chat, compose message, quick actions on mobile.', composition: ['Icon'], tokens: [
    { layer: 'FAB BG', compToken: '--fab-bg', token: '--token-accent', lightVal: '#4f6d80', darkVal: '#6b8598', purpose: 'Button surface', category: 'surface' },
    { layer: 'FAB Text', compToken: '--fab-text', token: '--token-accent-fg', lightVal: '#ffffff', darkVal: '#ffffff', purpose: 'Icon/label color', category: 'text' },
    { layer: 'Shadow', compToken: '--fab-shadow', token: '--token-shadow-lg', lightVal: '0 4px 16px rgba(79,109,128,.25)', darkVal: '0 4px 16px rgba(79,109,128,.25)', purpose: 'Floating elevation', category: 'shadow' },
    { layer: 'Radius', compToken: '--fab-radius', token: '--token-radius-full', lightVal: '9999px', darkVal: '9999px', purpose: 'Circle shape', category: 'shape' },
  ] },
];

/* ——————————————————————————————————————————
   Component variant data for ALL 15 components
   —————————————————————————————————————————— */
/* L3→L2 primitive lookup: maps semantic tokens to their primitive palette source */
const SEM_TO_PRIM: Record<string, string> = {
  '--token-bg':'--neutral-0','--token-bg-secondary':'--neutral-50','--token-bg-tertiary':'--neutral-100',
  '--token-bg-hover':'--neutral-1000/4%','--token-bg-active':'--neutral-1000/6%','--token-bg-code':'--neutral-100',
  '--token-bg-inset':'--neutral-150','--token-bg-overlay':'--neutral-1000/50%',
  '--token-text-primary':'--neutral-1000','--token-text-secondary':'--neutral-600','--token-text-tertiary':'--neutral-500',
  '--token-text-disabled':'--neutral-400','--token-text-inverse':'--neutral-0','--token-text-code':'--neutral-825',
  '--token-border':'--neutral-200','--token-border-strong':'--neutral-300','--token-border-subtle':'--neutral-150',
  '--token-accent':'--moonstone-500','--token-accent-hover':'--moonstone-600','--token-accent-light':'--moonstone-100',
  '--token-accent-fg':'--neutral-0','--token-accent-muted':'--moonstone-500/12%',
  '--token-secondary':'--sunstone-500','--token-secondary-hover':'--sunstone-600','--token-secondary-light':'--sunstone-50',
  '--token-secondary-fg':'--neutral-0',
  '--token-tertiary':'--olivine-500','--token-tertiary-hover':'--olivine-600','--token-tertiary-light':'--olivine-50',
  '--token-tertiary-fg':'--neutral-0',
  '--token-success':'--green-500','--token-success-light':'--green-50',
  '--token-error':'--red-500','--token-error-light':'--red-50',
  '--token-warning':'--amber-500','--token-warning-light':'--amber-50',
  '--token-info':'--moonstone-500','--token-info-light':'--moonstone-100',
  '--token-user-bubble':'--neutral-1000','--token-user-bubble-text':'--neutral-0',
  '--token-ai-bubble-text':'--neutral-1000','--token-ai-avatar-bg':'--moonstone-500','--token-ai-avatar-fg':'--neutral-0',
  '--token-code-header':'--neutral-150','--token-code-bg':'--neutral-50','--token-code-text':'--neutral-825',
  '--token-code-keyword':'--red-500','--token-code-string':'--cyan-900','--token-code-comment':'--neutral-500',
  '--token-code-function':'--moonstone-500','--token-code-number':'--cyan-700',
  '--token-voice-bar':'--neutral-1000','--token-voice-bar-active':'--moonstone-500',
  '--token-voice-bg':'--neutral-100','--token-voice-progress':'--moonstone-500','--token-voice-track':'--neutral-250',
  '--token-insight-bg':'--neutral-50','--token-insight-border':'--neutral-200',
  '--token-confidence-high':'--green-500','--token-confidence-medium':'--amber-500','--token-confidence-low':'--red-500',
  '--token-step-done':'--olivine-500','--token-step-active':'--moonstone-500','--token-step-pending':'--neutral-300','--token-step-line':'--neutral-200',
  '--token-image-placeholder':'--neutral-150','--token-image-overlay':'--neutral-1000/50%','--token-image-selected-ring':'--moonstone-500',
};

/** Resolve L2 primitive from L3 semantic token. Returns '' for structural tokens (spacing/radius/etc.) */
function getPrimitive(semantic: string): string {
  return SEM_TO_PRIM[semantic] || '';
}

/* Helper to build token layer entries concisely.
   6 args: t(layer, L3semantic, lightVal, darkVal, purpose, category) — L4 auto = L3
   7 args: t(layer, L4compToken, L3semantic, lightVal, darkVal, purpose, category) — explicit L4 */
function t(layer: string, token: string, lightVal: string, darkVal: string, purpose: string, category: TokenLayer['category']): TokenLayer;
function t(layer: string, compToken: string, token: string, lightVal: string, darkVal: string, purpose: string, category: TokenLayer['category']): TokenLayer;
function t(layer: string, ...args: string[]): TokenLayer {
  if (args.length === 5) {
    const [token, lightVal, darkVal, purpose, category] = args;
    return { layer, compToken: token, token, primitive: getPrimitive(token), lightVal, darkVal, purpose, category: category as TokenLayer['category'] };
  }
  const [compToken, token, lightVal, darkVal, purpose, category] = args;
  return { layer, compToken, token, primitive: getPrimitive(token), lightVal, darkVal, purpose, category: category as TokenLayer['category'] };
}

/* Panel/card tokens are now inlined per-component — no shared groups */

const componentVariants: Record<string, VariantInfo[]> = {
  'list-panel': [
    { id: 'chat-history', label: 'Chat History', useCase: 'Browse past conversations with timestamps and previews', tokenAdaptations: '--token-bg-hover for selected state, --token-accent for unread dot', diffs: ['Timestamp metadata column', 'Message preview truncation', 'Active/selected state highlight', 'Unread accent dot indicator'], tokens: [
      t('Panel Background', '--chat-history-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--chat-history-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--chat-history-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--chat-history-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--chat-history-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--chat-history-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--chat-history-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Active Item BG', '--chat-history-bg-active', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Selected conversation highlight', 'surface'),
      t('Unread Dot', '--chat-history-dot-unread', '--token-accent', '#4f6d80', '#6b8598', 'Unread indicator dot', 'surface'),
      t('New Button Icon', '--chat-history-text-action', '--token-text-secondary', '#666666', '#a1a1a1', 'New chat button icon', 'text'),
      t('Muted Text', '--chat-history-text-muted', '--token-text-tertiary', '#8f8f8f', '#707070', 'Preview, search icon, inactive chat icon', 'text'),
      t('Timestamp', '--chat-history-text-timestamp', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Relative time display', 'text'),
      t('Item Divider', '--chat-history-border-item', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between list items', 'border'),
      t('Search Padding', '--chat-history-spacing-search', '--token-space-2', '8px', '8px', 'Search section and gaps', 'spacing'),
      t('Search Inner Padding', '--chat-history-spacing-input', '--token-space-1-5', '6px', '6px', 'Search bar vertical padding', 'spacing'),
      t('Button Radius', '--chat-history-radius-btn', '--token-radius-md', '8px', '8px', 'Button and search rounding', 'shape'),
      t('Unread Dot Radius', '--chat-history-radius-dot', '--token-radius-full', '9999px', '9999px', 'Unread dot circle', 'shape'),
      t('Transition', '--chat-history-motion', '--token-duration-fast', '120ms', '120ms', 'Hover/active transitions', 'motion'),
    ] },
    { id: 'thread-manager', label: 'Thread Manager', useCase: 'Manage parallel conversation threads with pin/delete actions', tokenAdaptations: '--token-bg-hover for active, --token-accent for unread dot, hover actions', diffs: ['Active thread highlight', 'Unread dot indicator', 'Pin/delete hover actions', 'Pinned section header'], tokens: [
      t('Panel Background', '--thread-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--thread-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--thread-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--thread-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--thread-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--thread-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--thread-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Active Item BG', '--thread-bg-active', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Selected thread highlight', 'surface'),
      t('Unread Dot', '--thread-dot-unread', '--token-accent', '#4f6d80', '#6b8598', 'Unread indicator dot', 'surface'),
      t('Muted Text', '--thread-text-muted', '--token-text-tertiary', '#8f8f8f', '#707070', 'Thread preview and header icon', 'text'),
      t('Disabled Text', '--thread-text-disabled', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Date, actions, count badge', 'text'),
      t('Item Radius', '--thread-radius-item', '--token-radius-md', '8px', '8px', 'Thread item rounding', 'shape'),
      t('Unread Dot Radius', '--thread-radius-dot', '--token-radius-full', '9999px', '9999px', 'Unread dot circle', 'shape'),
      t('Item Padding', '--thread-spacing-item', '--token-space-2-5', '10px', '10px', 'Thread row vertical padding', 'spacing'),
      t('Transition', '--thread-motion', '--token-duration-fast', '120ms', '120ms', 'Hover transitions', 'motion'),
    ] },
    { id: 'knowledge-base', label: 'Knowledge Base', useCase: 'Browse uploaded documents and data sources', tokenAdaptations: '--token-success/warning/error for indexing status, --token-accent-light for add button', diffs: ['File type icons', 'Status indicators (indexed/indexing/error)', 'Source size metadata', 'Stats bar with counts'], tokens: [
      t('Panel Background', '--kb-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--kb-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--kb-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--kb-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--kb-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--kb-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--kb-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Stats Bar BG', '--kb-bg-stats', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Stats bar and icon cell background', 'surface'),
      t('Add Button BG', '--kb-bg-add', '--token-accent-light', '#dce3ea', '#131c22', 'Add source button surface', 'surface'),
      t('Hover BG', '--kb-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Item hover highlight', 'surface'),
      t('Add Button Text', '--kb-text-add', '--token-accent', '#4f6d80', '#6b8598', 'Add source button label', 'text'),
      t('Status Indexed', '--kb-text-indexed', '--token-success', '#2d7a60', '#6aab8a', 'Indexed status color', 'text'),
      t('Status Indexing', '--kb-text-indexing', '--token-warning', '#9f8136', '#d4aa55', 'Indexing status color', 'text'),
      t('Status Error', '--kb-text-error', '--token-error', '#b54a4a', '#d47272', 'Error status color', 'text'),
      t('Muted Text', '--kb-text-muted', '--token-text-tertiary', '#8f8f8f', '#707070', 'Header icon, file type icon', 'text'),
      t('Meta Text', '--kb-text-meta', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Size, date, stats count', 'text'),
      t('Item Divider', '--kb-border-item', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between source items', 'border'),
      t('Icon Radius', '--kb-radius-icon', '--token-radius-md', '8px', '8px', 'File type icon and search rounding', 'shape'),
      t('Add Button Radius', '--kb-radius-add', '--token-radius-sm', '4px', '4px', 'Add button rounding', 'shape'),
      t('Transition', '--kb-motion', '--token-duration-fast', '120ms', '120ms', 'Hover transitions', 'motion'),
    ] },
    { id: 'prompt-templates', label: 'Prompt Templates', useCase: 'Pre-built prompt patterns by category', tokenAdaptations: '--token-accent-light for template cards, category-colored left borders', diffs: ['Category grouping with colored headers', 'Template preview text', 'Star/favorite toggle', '"Use template" action button'], tokens: [
      t('Panel Background', '--pt-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--pt-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--pt-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--pt-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--pt-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--pt-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--pt-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Icon Cell BG', '--pt-bg-icon', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Template icon and search background', 'surface'),
      t('Hover BG', '--pt-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Item hover highlight', 'surface'),
      t('Use Button BG', '--pt-bg-use', '--token-accent', '#4f6d80', '#6b8598', 'Use template button', 'surface'),
      t('Use Button FG', '--pt-text-use', '--token-accent-fg', '#ffffff', '#ffffff', 'Button text', 'text'),
      t('Muted Text', '--pt-text-muted', '--token-text-tertiary', '#8f8f8f', '#707070', 'Description, header icon', 'text'),
      t('Disabled Text', '--pt-text-count', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Count, search icon', 'text'),
      t('Slot Label', '--pt-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Input field labels', 'text'),
      t('Item Divider', '--pt-border-item', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between list items', 'border'),
      t('Item Radius', '--pt-radius-icon', '--token-radius-md', '8px', '8px', 'Icon cell, search, input rounding', 'shape'),
    ] },
    { id: 'memory-manager', label: 'Memory Manager', useCase: 'View and manage persisted context memories', tokenAdaptations: '--token-warning for memory age, --token-error for delete actions', diffs: ['Memory type badges (fact/preference/context)', 'Last accessed timestamp', 'Delete/edit inline actions', 'Memory strength progress bar'], tokens: [
      t('Panel Background', '--mem-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--mem-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--mem-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--mem-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--mem-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--mem-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--mem-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Category Badge BG', '--mem-bg-badge', '--token-accent-light', '#dce3ea', '#131c22', 'Category tag surface', 'surface'),
      t('Hover BG', '--mem-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Item hover highlight', 'surface'),
      t('Cancel BG', '--mem-bg-cancel', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Cancel button bg', 'surface'),
      t('Save Button', '--mem-bg-save', '--token-success', '#2d7a60', '#6aab8a', 'Edit save button', 'surface'),
      t('Category Badge Text', '--mem-text-badge', '--token-accent', '#4f6d80', '#6b8598', 'Category tag text and focus border', 'text'),
      t('Delete Icon', '--mem-text-delete', '--token-error', '#b54a4a', '#d47272', 'Delete action', 'text'),
      t('Muted Text', '--mem-text-muted', '--token-text-tertiary', '#8f8f8f', '#707070', 'Header icon, cancel button icon', 'text'),
      t('Meta Text', '--mem-text-meta', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Date, source, count badge', 'text'),
      t('Item Divider', '--mem-border-item', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between memory items', 'border'),
      t('Badge Radius', '--mem-radius-badge', '--token-radius-full', '9999px', '9999px', 'Category tag pill shape', 'shape'),
      t('Input Radius', '--mem-radius-input', '--token-radius-sm', '4px', '4px', 'Edit input and button rounding', 'shape'),
    ] },
  ],
  'message': [
    { id: 'chat-message', label: 'Chat Message', useCase: 'User and AI message bubbles with role indicators', tokenAdaptations: 'User: --token-user-bubble fill (dark in light, light in dark), AI: transparent with avatar', diffs: ['User bubble solid, right-aligned', 'AI text with moonstone avatar, left-aligned', 'Streaming cursor indicator', 'Role-specific typography'], tokens: [
      t('User Bubble BG', '--msg-bg-user', '--token-user-bubble', '#0a0a0a', '#ededed', 'User message fill', 'surface'),
      t('User Bubble Text', '--msg-text-user', '--token-user-bubble-text', '#ffffff', '#09090b', 'User message text', 'text'),
      t('AI Bubble Text', '--msg-text-ai', '--token-ai-bubble-text', '#0a0a0a', '#ededed', 'AI response text', 'text'),
      t('AI Avatar BG', '--msg-avatar-bg', '--token-ai-avatar-bg', '#4f6d80', '#6b8598', 'AI identity circle', 'surface'),
      t('AI Avatar FG', '--msg-avatar-fg', '--token-ai-avatar-fg', '#ffffff', '#09090b', 'AI avatar icon', 'text'),
      t('User Bubble Radius', '--msg-radius-user', '--token-radius-2xl', '20px', '20px', 'User bubble corners', 'shape'),
      t('AI Avatar Radius', '--msg-radius-avatar', '--token-radius-full', '9999px', '9999px', 'AI avatar circle', 'shape'),
      t('User Padding V', '--msg-spacing-v', '--token-space-3', '12px', '12px', 'User bubble vertical padding', 'spacing'),
      t('User Padding H', '--msg-spacing-h', '--token-space-4', '16px', '16px', 'User bubble horizontal padding', 'spacing'),
    ] },
    { id: 'markdown-response', label: 'Markdown Response', useCase: 'Rich-text AI response with headings, lists, code', tokenAdaptations: '--token-code-bg for inline code, --token-accent for blockquote borders, --token-accent-muted for code inline', diffs: ['Parsed markdown with heading hierarchy', 'Syntax-highlighted code blocks', 'Bullet/numbered lists', 'Blockquote left border in moonstone'], tokens: [
      t('Body Text', '--md-text-body', '--token-text-primary', '#0a0a0a', '#ededed', 'Paragraph text', 'text'),
      t('Code Block BG', '--md-bg-code', '--token-code-bg', '#fafafa', '#111113', 'Code block surface', 'surface'),
      t('Code Header BG', '--md-bg-code-header', '--token-code-header', '#f0f0f0', '#1c1c1f', 'Code block header bar', 'surface'),
      t('Code Text', '--md-text-code', '--token-code-text', '#24292e', '#e5e5e5', 'Code text color', 'text'),
      t('Code Keyword', '--md-text-keyword', '--token-code-keyword', '#d73a49', '#ff7b72', 'Syntax: keywords', 'text'),
      t('Code String', '--md-text-string', '--token-code-string', '#032f62', '#a5d6ff', 'Syntax: strings', 'text'),
      t('Code Function', '--md-text-function', '--token-code-function', '#4f6d80', '#8ea3b4', 'Syntax: functions (moonstone)', 'text'),
      t('Inline Code BG', '--md-bg-inline-code', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Inline code highlight', 'surface'),
      t('Accent (links, code, blockquote)', '--md-text-accent', '--token-accent', '#4f6d80', '#6b8598', 'Inline code, blockquote border, links', 'text'),
      t('List Bullet', '--md-text-bullet', '--token-text-tertiary', '#8f8f8f', '#707070', 'Bullet/number color', 'text'),
      t('Code Radius', '--md-radius-code', '--token-radius-md', '8px', '8px', 'Code block rounding', 'shape'),
    ] },
    { id: 'system-message', label: 'System Message', useCase: 'System-level instructions and configuration', tokenAdaptations: '--token-warning-light background, --token-warning border, --token-text-secondary content', diffs: ['Full-width card layout (not bubble)', 'Warning/info icon prefix', 'Monospace content area', 'Collapsible content'], tokens: [
      t('Card BG', '--sysmsg-bg', '--token-warning-light', '#ede3c7', '#241e0d', 'Warning-tinted surface', 'surface'),
      t('Warning (border, icon)', '--sysmsg-border', '--token-warning', '#9f8136', '#d4aa55', 'Card border and warning icon', 'border'),
      t('Content Text', '--sysmsg-text', '--token-text-secondary', '#666666', '#a1a1a1', 'System message body', 'text'),
      t('Content Font', '--sysmsg-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Monospace for system text', 'text'),
      t('Collapse Icon', '--sysmsg-text-collapse', '--token-text-tertiary', '#8f8f8f', '#707070', 'Expand/collapse chevron', 'text'),
      t('Card Radius', '--sysmsg-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--sysmsg-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
    ] },
    { id: 'ai-disclosure', label: 'AI Disclosure', useCase: 'Transparency notice that content is AI-generated', tokenAdaptations: '--token-bg-secondary background, --token-text-tertiary text, minimal styling', diffs: ['Centered layout, smaller font', 'Shield/info icon', 'Learn more link', 'Non-intrusive, subtle'], tokens: [
      t('Background', '--disclosure-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Subtle disclosure surface', 'surface'),
      t('Text', '--disclosure-text', '--token-text-tertiary', '#8f8f8f', '#707070', 'Disclosure body', 'text'),
      t('Icon', '--disclosure-text-icon', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Shield/info icon', 'text'),
      t('Link', '--disclosure-text-link', '--token-accent', '#4f6d80', '#6b8598', '"Learn more" link', 'text'),
      t('Font Size', '--disclosure-text-size', '--token-text-2xs', '10px', '10px', 'Small disclosure text', 'text'),
      t('Radius', '--disclosure-radius', '--token-radius-md', '8px', '8px', 'Container rounding', 'shape'),
      t('Padding', '--disclosure-spacing', '--token-space-2-5', '10px', '10px', 'Container padding', 'spacing'),
    ] },
  ],
  'composer': [
    { id: 'chat-input', label: 'Chat Input', useCase: 'Primary text input with send button and shortcuts', tokenAdaptations: '--token-border for container, --token-accent for send button, --token-accent-muted for focus ring', diffs: ['Textarea auto-grow', 'Send button (accent moonstone) on right', 'Kbd shortcut hint', 'Focus ring with accent'], tokens: [
      t('Container BG', '--chat-input-bg', '--token-bg', '#ffffff', '#09090b', 'Input surface', 'surface'),
      t('Kbd BG', '--chat-input-bg-kbd', '--token-bg-secondary', '#fafafa', '#111113', 'Shortcut key background', 'surface'),
      t('Accent (send, focus)', '--chat-input-bg-send', '--token-accent', '#4f6d80', '#6b8598', 'Send button and focus ring', 'surface'),
      t('Send Button FG', '--chat-input-text-send', '--token-accent-fg', '#ffffff', '#ffffff', 'Send arrow icon', 'text'),
      t('Input Text', '--chat-input-text', '--token-text-primary', '#0a0a0a', '#ededed', 'User input text', 'text'),
      t('Placeholder / Kbd', '--chat-input-text-placeholder', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Placeholder and shortcut label', 'text'),
      t('Container Border', '--chat-input-border', '--token-border', '#eaeaea', '#27272a', 'Input and kbd border', 'border'),
      t('Container Radius', '--chat-input-radius', '--token-radius-lg', '12px', '12px', 'Input rounding', 'shape'),
      t('Padding', '--chat-input-spacing', '--token-space-3', '12px', '12px', 'Input padding', 'spacing'),
      t('Send Shadow', '--chat-input-shadow-send', '--token-shadow-accent', 'moonstone glow', 'moonstone glow', 'Send button elevation', 'shadow'),
      t('Transition', '--chat-input-motion', '--token-duration-fast', '120ms', '120ms', 'Focus transition', 'motion'),
    ] },
    { id: 'multi-modal-input', label: 'Multi-Modal Input', useCase: 'Text + file/image/voice attachment', tokenAdaptations: 'Attachment icons use --token-text-tertiary, file chips use --token-bg-tertiary', diffs: ['Bottom toolbar with attachment icons', 'File preview chips above input', 'Image thumbnails', 'Drag-drop overlay'], tokens: [
      t('Container BG', '--multimodal-bg', '--token-bg', '#ffffff', '#09090b', 'Input surface', 'surface'),
      t('Container Border', '--multimodal-border', '--token-border', '#eaeaea', '#27272a', 'Input border', 'border'),
      t('Toolbar BG', '--multimodal-bg-toolbar', '--token-bg-secondary', '#fafafa', '#111113', 'Bottom toolbar surface', 'surface'),
      t('Attach Icons', '--multimodal-text-icon', '--token-text-tertiary', '#8f8f8f', '#707070', 'Paperclip, mic, image icons', 'text'),
      t('File Chip BG', '--multimodal-bg-chip', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Attached file chip', 'surface'),
      t('File Chip Text', '--multimodal-text-chip', '--token-text-secondary', '#666666', '#a1a1a1', 'File name text', 'text'),
      t('Remove Icon', '--multimodal-text-remove', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Remove attachment X', 'text'),
      t('Drag Overlay BG', '--multimodal-bg-drag', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Drag-drop zone', 'surface'),
      t('Drag Overlay Border', '--multimodal-border-drag', '--token-accent', '#4f6d80', '#6b8598', 'Dashed drop border', 'border'),
      t('Toolbar Divider', '--multimodal-border-toolbar', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Toolbar top border', 'border'),
      t('Chip Radius', '--multimodal-radius-chip', '--token-radius-full', '9999px', '9999px', 'Pill shape for file chips', 'shape'),
    ] },
    { id: 'follow-up-bar', label: 'Follow-Up Bar', useCase: 'Contextual follow-up anchored to response', tokenAdaptations: '--token-bg-secondary background, thinner --token-border-subtle border', diffs: ['Compact single-line input', 'Anchored below AI response', 'Suggestion chips', 'No toolbar'], tokens: [
      t('Bar BG', '--followup-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Follow-up surface', 'surface'),
      t('Bar Border', '--followup-border', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Subtle container border', 'border'),
      t('Input Text', '--followup-text', '--token-text-primary', '#0a0a0a', '#ededed', 'Follow-up input text', 'text'),
      t('Placeholder', '--followup-text-placeholder', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Placeholder hint', 'text'),
      t('Chip BG', '--followup-bg-chip', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Suggestion chip fill', 'surface'),
      t('Chip Text', '--followup-text-chip', '--token-text-secondary', '#666666', '#a1a1a1', 'Suggestion chip label', 'text'),
      t('Send Icon', '--followup-text-send', '--token-accent', '#4f6d80', '#6b8598', 'Send arrow color', 'text'),
      t('Bar Radius', '--followup-radius', '--token-radius-md', '8px', '8px', 'Bar rounding', 'shape'),
      t('Bar Padding', '--followup-spacing', '--token-space-2', '8px', '8px', 'Compact padding', 'spacing'),
    ] },
    { id: 'speech-input', label: 'Speech Input', useCase: 'Voice recording with transcription preview', tokenAdaptations: 'Recording uses --token-secondary (sunstone), waveform uses --token-accent', diffs: ['Mic toggle button', 'Real-time waveform', 'Live transcription text', 'Duration counter'], tokens: [
      t('Container BG', '--speech-bg', '--token-bg', '#ffffff', '#09090b', 'Input surface', 'surface'),
      t('Container Border', '--speech-border', '--token-border', '#eaeaea', '#27272a', 'Input border', 'border'),
      t('Mic Button Idle', '--speech-text-mic', '--token-text-tertiary', '#8f8f8f', '#707070', 'Mic icon inactive', 'text'),
      t('Recording (mic, pulse, timer)', '--speech-bg-recording', '--token-secondary', '#8a6d3b', '#b29256', 'Mic active, pulse ring, timer color', 'surface'),
      t('Waveform Bars', '--speech-bg-waveform', '--token-accent', '#4f6d80', '#6b8598', 'Active waveform bars', 'surface'),
      t('Waveform Inactive', '--speech-bg-waveform-idle', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Inactive waveform bars', 'surface'),
      t('Transcript Text', '--speech-text', '--token-text-primary', '#0a0a0a', '#ededed', 'Live transcription', 'text'),
      t('Pulse Animation', 'token-pulse', '1.5s ease', '1.5s ease', 'Recording pulse', 'motion'),
    ] },
    { id: 'prompt-enhancer', label: 'Prompt Enhancer', useCase: 'AI-powered prompt improvement suggestions', tokenAdaptations: '--token-accent-light for enhancement preview panel', diffs: ['Split view: original vs enhanced', 'AI sparkle icon button', 'Diff highlighting', 'Accept/reject actions'], tokens: [
      t('Input BG', '--enhancer-bg', '--token-bg', '#ffffff', '#09090b', 'Original input area', 'surface'),
      t('Enhanced BG', '--enhancer-bg-preview', '--token-accent-light', '#dce3ea', '#131c22', 'Enhanced preview surface', 'surface'),
      t('Accent (border, text, button)', '--enhancer-accent', '--token-accent', '#4f6d80', '#6b8598', 'Enhanced border/text, sparkle icon, accept CTA', 'surface'),
      t('Diff Highlight', '--enhancer-bg-diff', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Changed text highlight', 'surface'),
      t('Original Text', '--enhancer-text', '--token-text-primary', '#0a0a0a', '#ededed', 'Original prompt', 'text'),
      t('Reject Button', '--enhancer-text-reject', '--token-text-tertiary', '#8f8f8f', '#707070', 'Reject text button', 'text'),
      t('Divider', '--enhancer-border', '--token-border', '#eaeaea', '#27272a', 'Split view divider', 'border'),
    ] },
  ],
  'suggestion-set': [
    { id: 'welcome-screen', label: 'Welcome Screen', useCase: 'Greeting with suggested starter prompts', tokenAdaptations: '--token-accent for AI avatar, suggestion cards use --token-bg-secondary with --token-border hover', diffs: ['Centered greeting layout', 'AI avatar with brand moonstone', 'Suggestion card grid', 'Category icons on cards'], tokens: [
      t('Page BG', '--welcome-bg', '--token-bg', '#ffffff', '#09090b', 'Full page surface', 'surface'),
      t('AI Avatar BG', '--welcome-avatar-bg', '--token-accent', '#4f6d80', '#6b8598', 'Centered AI identity circle', 'surface'),
      t('AI Avatar FG', '--welcome-avatar-fg', '--token-accent-fg', '#ffffff', '#ffffff', 'AI sparkle icon', 'text'),
      t('Greeting Text', '--welcome-text-heading', '--token-text-primary', '#0a0a0a', '#ededed', '"How can I help?" heading', 'text'),
      t('Card BG', '--welcome-bg-card', '--token-bg-secondary', '#fafafa', '#111113', 'Suggestion card surface', 'surface'),
      t('Card Border', '--welcome-border-card', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Hover BG', '--welcome-bg-card-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Card hover state', 'surface'),
      t('Card Text', '--welcome-text-card', '--token-text-secondary', '#666666', '#a1a1a1', 'Suggestion label text', 'text'),
      t('Card Icon', '--welcome-text-icon', '--token-text-tertiary', '#8f8f8f', '#707070', 'Category icon color', 'text'),
      t('Card Radius', '--welcome-radius-card', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--welcome-spacing-card', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Grid Gap', '--welcome-spacing-grid', '--token-space-3', '12px', '12px', 'Between cards', 'spacing'),
      t('Hover Transition', '--welcome-motion', '--token-duration-fast', '120ms', '120ms', 'Hover fade', 'motion'),
    ] },
    { id: 'prompt-suggestions', label: 'Prompt Suggestions', useCase: 'Contextual follow-up prompt chips', tokenAdaptations: '--token-bg-secondary for chip bg, --token-border for chip border, --token-accent on hover', diffs: ['Horizontal scrollable row', 'Arrow icon prefix', 'Contextual to last response', 'Click to insert'], tokens: [
      t('Chip BG', '--suggest-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Suggestion chip surface', 'surface'),
      t('Chip Border', '--suggest-border', '--token-border', '#eaeaea', '#27272a', 'Chip border', 'border'),
      t('Chip Text', '--suggest-text', '--token-text-secondary', '#666666', '#a1a1a1', 'Suggestion text', 'text'),
      t('Chip Hover Accent', '--suggest-border-hover', '--token-accent', '#4f6d80', '#6b8598', 'Hover border and text color', 'border'),
      t('Arrow Icon', '--suggest-text-arrow', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Arrow prefix icon', 'text'),
      t('Chip Radius', '--suggest-radius', '--token-radius-full', '9999px', '9999px', 'Pill shape', 'shape'),
      t('Chip Gap', '--suggest-gap', '--token-space-2', '8px', '8px', 'Between chips', 'spacing'),
      t('Chip Padding', '--token-space-2 / -3', '8px / 12px', '8px / 12px', 'Chip padding', 'spacing'),
    ] },
    { id: 'autocomplete', label: 'Autocomplete', useCase: 'Real-time suggestions while typing', tokenAdaptations: '--token-bg overlay with --token-shadow-lg, --token-bg-hover for highlighted item', diffs: ['Dropdown floating panel', 'Keyboard nav highlighting', 'Match text bolding', 'Category grouping'], tokens: [
      t('Panel BG', '--autocomplete-bg', '--token-bg', '#ffffff', '#09090b', 'Dropdown surface', 'surface'),
      t('Panel Border', '--autocomplete-border', '--token-border', '#eaeaea', '#27272a', 'Dropdown border', 'border'),
      t('Panel Shadow', '--autocomplete-shadow', '--token-shadow-lg', '...', '...', 'Floating elevation', 'shadow'),
      t('Highlight BG', '--autocomplete-bg-highlight', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Keyboard nav highlight', 'surface'),
      t('Match Bold', '--autocomplete-weight-match', '--token-weight-semibold', '600', '600', 'Matching text weight', 'text'),
      t('Item Text', '--autocomplete-text', '--token-text-secondary', '#666666', '#a1a1a1', 'Suggestion text', 'text'),
      t('Category Label', '--autocomplete-text-category', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Group header', 'text'),
      t('Panel Radius', '--autocomplete-radius', '--token-radius-lg', '12px', '12px', 'Dropdown rounding', 'shape'),
      t('Z-Index', '--autocomplete-z', '--token-z-dropdown', '100', '100', 'Float above content', 'spacing'),
    ] },
    { id: 'style-presets', label: 'Style Presets', useCase: 'Visual style options for image generation', tokenAdaptations: '--token-image-selected-ring (accent moonstone) for selected, --token-bg-tertiary for preview bg', diffs: ['Image thumbnail grid', 'Selected ring border', 'Style name label below', 'Preview on hover'], tokens: [
      t('Preview BG', '--preset-bg', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Image placeholder', 'surface'),
      t('Selected Ring', '--preset-border-selected', '--token-image-selected-ring', '#4f6d80', '#6b8598', 'Selected style border', 'border'),
      t('Unselected Border', '--preset-border', '--token-border', '#eaeaea', '#27272a', 'Default style border', 'border'),
      t('Style Name', '--preset-text', '--token-text-secondary', '#666666', '#a1a1a1', 'Style label text', 'text'),
      t('Selected Name', '--preset-text-selected', '--token-accent', '#4f6d80', '#6b8598', 'Active style label', 'text'),
      t('Preview Radius', '--preset-radius', '--token-radius-lg', '12px', '12px', 'Thumbnail rounding', 'shape'),
      t('Grid Gap', '--preset-gap', '--token-space-3', '12px', '12px', 'Between thumbnails', 'spacing'),
      t('Ring Width', '2px', '2px', '2px', 'Selection ring width', 'border'),
    ] },
  ],
  'dynamic-form': [
    { id: 'dynamic-form', label: 'Form Generator', useCase: 'AI creates forms on the fly from user intent', tokenAdaptations: 'Full token set from Form Field, Toggle Row, Button atoms', diffs: ['Dynamic field types (text, select, toggle)', 'Validation states with semantic colors', 'AI-suggested default values', 'Progressive disclosure sections'], tokens: [
      t('Card Background', '--form-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Radius', '--form-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--form-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Input BG', '--form-bg-input', '--token-bg', '#ffffff', '#09090b', 'Text input surface', 'surface'),
      t('Accent (toggle, submit)', '--form-bg-accent', '--token-accent', '#4f6d80', '#6b8598', 'Toggle active, submit button', 'surface'),
      t('Input Text', '--form-text-input', '--token-text-primary', '#0a0a0a', '#ededed', 'Input value text', 'text'),
      t('Field Label', '--form-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Form field label', 'text'),
      t('Helper Text', '--form-text-helper', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Field description', 'text'),
      t('Error (required, validation)', '--form-text-error', '--token-error', '#b54a4a', '#d47272', 'Required mark, error border/text', 'text'),
      t('Success State', '--form-text-success', '--token-success', '#2d7a60', '#6aab8a', 'Valid field indicator', 'border'),
      t('Input Border', '--form-border', '--token-border', '#eaeaea', '#27272a', 'Input border', 'border'),
      t('Submit FG', '--form-text-submit', '--token-accent-fg', '#ffffff', '#ffffff', 'Submit text', 'text'),
      t('Field Gap', '--form-gap', '--token-space-4', '16px', '16px', 'Between form fields', 'spacing'),
    ] },
  ],
  'loading-state': [
    { id: 'thinking-indicator', label: 'Thinking Indicator', useCase: 'Animated dots showing AI is processing', tokenAdaptations: '--token-accent for dot color, token-bounce animation', diffs: ['Three bouncing dots', 'Subtle pulse animation', '"Thinking..." label', 'Appears in AI bubble area'], tokens: [
      t('Dot Color', '--thinking-bg-dot', '--token-accent', '#4f6d80', '#6b8598', 'Bouncing dot fill', 'surface'),
      t('Dot Inactive', '--thinking-bg-dot-idle', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Dot at rest opacity', 'surface'),
      t('Label Text', '--thinking-text-label', '--token-text-disabled', '#c4c4c4', '#3b3b3b', '"Thinking..." label', 'text'),
      t('Dot Size', '6px', '6px', '6px', 'Each dot diameter', 'spacing'),
      t('Dot Gap', '--thinking-spacing-gap', '--token-space-1', '4px', '4px', 'Between dots', 'spacing'),
      t('Bounce', 'token-bounce', '0.6s ease', '0.6s ease', 'Sequential bounce animation', 'motion'),
      t('Pulse', 'token-pulse', '1.5s ease', '1.5s ease', 'Opacity pulse', 'motion'),
    ] },
    { id: 'streaming-text', label: 'Streaming Text', useCase: 'Token-by-token text appearing with cursor', tokenAdaptations: '--token-text-primary for text, --token-accent for blinking cursor', diffs: ['Character-by-character reveal', 'Blinking cursor at end', 'Smooth text flow', 'No loading indicator'], tokens: [
      t('Text Color', '--streaming-text', '--token-text-primary', '#0a0a0a', '#ededed', 'Streaming text', 'text'),
      t('Cursor Color', '--streaming-bg-cursor', '--token-accent', '#4f6d80', '#6b8598', 'Blinking cursor bar', 'surface'),
      t('Cursor Width', '2px', '2px', '2px', 'Cursor bar width', 'spacing'),
      t('Font Size', '--streaming-text-size', '--token-text-sm', '13px', '13px', 'Body text size', 'text'),
      t('Line Height', '--streaming-leading', '--token-leading-normal', '1.5', '1.5', 'Text line height', 'text'),
      t('Blink', 'token-blink', '1s step-end', '1s step-end', 'Cursor blink animation', 'motion'),
    ] },
    { id: 'analysis-progress', label: 'Analysis Progress', useCase: 'Multi-step progress with phase labels', tokenAdaptations: 'Progress bar gradient (accent → secondary), --token-step-active/done for steps', diffs: ['Step labels below progress bar', 'Current step highlight', 'Phase duration display', 'Completion percentage'], tokens: [
      t('Track BG', '--progress-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Progress track', 'surface'),
      t('Fill Start', '--progress-fill-start', '--token-accent', '#4f6d80', '#6b8598', 'Gradient start (moonstone)', 'surface'),
      t('Fill End', '--progress-fill-end', '--token-secondary', '#8a6d3b', '#b29256', 'Gradient end (sunstone)', 'surface'),
      t('Step Done', '--progress-step-done', '--token-step-done', '#697459', '#8a9b77', 'Completed step circle', 'surface'),
      t('Step Active', '--progress-step-active', '--token-step-active', '#4f6d80', '#6b8598', 'Current step circle', 'surface'),
      t('Step Pending', '--progress-step-pending', '--token-step-pending', '#d1d1d1', '#3f3f46', 'Future step circle', 'surface'),
      t('Step Line', '--progress-step-line', '--token-step-line', '#eaeaea', '#27272a', 'Connecting line', 'border'),
      t('Step Label', '--progress-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Phase name text', 'text'),
      t('Active Label', '--progress-text-active', '--token-text-primary', '#0a0a0a', '#ededed', 'Current phase name', 'text'),
      t('Percentage Font', '--progress-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Completion %', 'text'),
      t('Track Radius', '--progress-radius-track', '--token-radius-full', '9999px', '9999px', 'Rounded track ends', 'shape'),
    ] },
    { id: 'skeleton-loader', label: 'Skeleton Loader', useCase: 'Shimmer placeholders for content loading', tokenAdaptations: '--token-bg-tertiary/secondary for shimmer gradient', diffs: ['Content-shaped placeholders', 'Shimmer sweep animation', 'Multiple element types', 'Matches expected layout'], tokens: [
      t('Base Color', '--skeleton-bg', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Shimmer base', 'surface'),
      t('Highlight Color', '--skeleton-bg-highlight', '--token-bg-secondary', '#fafafa', '#111113', 'Shimmer peak', 'surface'),
      t('Text Line Radius', '--skeleton-radius-text', '--token-radius-sm', '4px', '4px', 'Text placeholder corners', 'shape'),
      t('Avatar Radius', '--skeleton-radius-avatar', '--token-radius-full', '9999px', '9999px', 'Circle placeholder', 'shape'),
      t('Card Radius', '--skeleton-radius-card', '--token-radius-md', '8px', '8px', 'Card placeholder corners', 'shape'),
      t('Shimmer', 'token-shimmer', '1.5s ease', '1.5s ease', 'Sweep animation', 'motion'),
    ] },
  ],
  'process-tracker': [
    { id: 'reasoning-trace', label: 'Reasoning Trace', useCase: 'Expandable chain-of-thought reasoning steps', tokenAdaptations: '--token-accent for active step, --token-step-done (olivine) for completed', diffs: ['Collapsible step cards', 'Step duration labels', 'Thought process content', 'Numbered step indicators'], tokens: [
      t('Step Done Circle', '--trace-step-done', '--token-step-done', '#697459', '#8a9b77', 'Completed step indicator', 'surface'),
      t('Step Active Circle', '--trace-step-active', '--token-step-active', '#4f6d80', '#6b8598', 'Current step indicator', 'surface'),
      t('Step Pending Circle', '--trace-step-pending', '--token-step-pending', '#d1d1d1', '#3f3f46', 'Future step indicator', 'surface'),
      t('Connecting Line', '--trace-step-line', '--token-step-line', '#eaeaea', '#27272a', 'Vertical connecting line', 'border'),
      t('Step Card BG', '--trace-bg-card', '--token-bg-secondary', '#fafafa', '#111113', 'Expandable card surface', 'surface'),
      t('Step Card Border', '--trace-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Step Title', '--trace-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Step name', 'text'),
      t('Step Content', '--trace-text-content', '--token-text-secondary', '#666666', '#a1a1a1', 'Thought process text', 'text'),
      t('Duration Label', '--trace-text-duration', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Step duration', 'text'),
      t('Duration Font', '--trace-font-duration', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Duration monospace', 'text'),
      t('Card Radius', '--trace-radius', '--token-radius-md', '8px', '8px', 'Step card rounding', 'shape'),
      t('Card Padding', '--trace-spacing', '--token-space-3', '12px', '12px', 'Step card padding', 'spacing'),
    ] },
    { id: 'action-plan', label: 'Action Plan', useCase: 'Ordered task plan with progress checkmarks', tokenAdaptations: '--token-step-done for checkmarks, --token-step-pending for future items', diffs: ['Checkbox-style completion', 'Task descriptions', 'Dependency indicators', 'Estimated time per task'], tokens: [
      t('Check Done', '--plan-check-done', '--token-step-done', '#697459', '#8a9b77', 'Completed checkbox', 'surface'),
      t('Check Pending', '--plan-check-pending', '--token-step-pending', '#d1d1d1', '#3f3f46', 'Unchecked circle', 'surface'),
      t('Task Title', '--plan-text', '--token-text-primary', '#0a0a0a', '#ededed', 'Task name', 'text'),
      t('Task Done Title', '--plan-text-done', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Completed task (strikethrough)', 'text'),
      t('Time Estimate', '--plan-text-time', '--token-text-tertiary', '#8f8f8f', '#707070', 'Est. duration', 'text'),
      t('Divider', '--plan-border', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between tasks', 'border'),
      t('Item Gap', '--plan-gap', '--token-space-2', '8px', '8px', 'Between task rows', 'spacing'),
    ] },
    { id: 'tool-call', label: 'Tool Call', useCase: 'Tool invocation with parameters and execution status', tokenAdaptations: '--token-bg-code for parameter blocks, --token-code-function (moonstone) for tool name', diffs: ['Tool name header with icon', 'Parameter key-value pairs', 'Execution status badge', 'Duration timestamp'], tokens: [
      t('Card BG', '--toolcall-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Tool call card surface', 'surface'),
      t('Card Border', '--toolcall-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Tool Name', '--toolcall-text-name', '--token-code-function', '#4f6d80', '#8ea3b4', 'Tool name in moonstone', 'text'),
      t('Tool Name Font', '--toolcall-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Monospace tool name', 'text'),
      t('Params BG', '--toolcall-bg-params', '--token-bg-code', '#f4f4f5', '#141416', 'Parameter block surface', 'surface'),
      t('Param Key', '--toolcall-text-key', '--token-code-keyword', '#d73a49', '#ff7b72', 'Parameter key color', 'text'),
      t('Param Value', '--toolcall-text-value', '--token-code-string', '#032f62', '#a5d6ff', 'Parameter value color', 'text'),
      t('Status Running', '--toolcall-bg-running', '--token-accent', '#4f6d80', '#6b8598', 'Running status badge', 'surface'),
      t('Status Done', '--toolcall-bg-done', '--token-success', '#2d7a60', '#6aab8a', 'Completed status badge', 'surface'),
      t('Status Error', '--toolcall-bg-error', '--token-error', '#b54a4a', '#d47272', 'Failed status badge', 'surface'),
      t('Duration', '--toolcall-text-duration', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Execution time', 'text'),
      t('Card Radius', '--toolcall-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
    ] },
    { id: 'tool-result', label: 'Tool Result', useCase: 'Rich formatted output from tool executions', tokenAdaptations: '--token-bg-secondary for result card, --token-tertiary for success indicators', diffs: ['Structured result display', 'Type-specific formatting', 'Expandable raw output', 'Link to source'], tokens: [
      t('Result Card BG', '--toolresult-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Result surface', 'surface'),
      t('Result Border', '--toolresult-border', '--token-border', '#eaeaea', '#27272a', 'Result outline', 'border'),
      t('Success Icon', '--toolresult-text-success', '--token-tertiary', '#697459', '#8a9b77', 'Success indicator', 'text'),
      t('Result Title', '--toolresult-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Result heading', 'text'),
      t('Result Body', '--toolresult-text-body', '--token-text-secondary', '#666666', '#a1a1a1', 'Result content', 'text'),
      t('Raw Output BG', '--toolresult-bg-raw', '--token-bg-code', '#f4f4f5', '#141416', 'Expandable raw area', 'surface'),
      t('Raw Output Font', '--toolresult-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Raw output monospace', 'text'),
      t('Link', '--toolresult-text-link', '--token-accent', '#4f6d80', '#6b8598', 'Source link', 'text'),
      t('Card Radius', '--toolresult-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
    ] },
  ],
  'code-panel': [
    { id: 'code-block', label: 'Code Block', useCase: 'Syntax-highlighted code with copy button', tokenAdaptations: '--token-code-* tokens for syntax colors, --token-code-header for top bar', diffs: ['Language label badge', 'Copy button in header', 'Line numbers', 'Syntax highlighting colors'], tokens: [
      t('Header BG', '--code-bg-header', '--token-code-header', '#f0f0f0', '#1c1c1f', 'Top bar surface', 'surface'),
      t('Code BG', '--code-bg', '--token-code-bg', '#fafafa', '#111113', 'Code area surface', 'surface'),
      t('Code Text', '--code-text', '--token-code-text', '#24292e', '#e5e5e5', 'Default code text', 'text'),
      t('Keywords', '--code-text-keyword', '--token-code-keyword', '#d73a49', '#ff7b72', 'Language keywords', 'text'),
      t('Strings', '--code-text-string', '--token-code-string', '#032f62', '#a5d6ff', 'String literals', 'text'),
      t('Comments', '--code-text-comment', '--token-code-comment', '#6a737d', '#8b949e', 'Code comments', 'text'),
      t('Functions', '--code-text-function', '--token-code-function', '#4f6d80', '#8ea3b4', 'Function names (moonstone)', 'text'),
      t('Numbers', '--code-text-number', '--token-code-number', '#005cc5', '#79c0ff', 'Numeric values', 'text'),
      t('Language Badge BG', '--code-bg-badge', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Language label bg', 'surface'),
      t('Copy Icon', '--code-text-action', '--token-text-tertiary', '#8f8f8f', '#707070', 'Copy button color', 'text'),
      t('Border', '--code-border', '--token-border', '#eaeaea', '#27272a', 'Code block border', 'border'),
      t('Radius', '--code-radius', '--token-radius-lg', '12px', '12px', 'Block rounding', 'shape'),
    ] },
    { id: 'terminal-output', label: 'Terminal Output', useCase: 'CLI output with colored lines and cursor', tokenAdaptations: '--token-code-bg darkened, --token-tertiary for success lines, --token-error for errors', diffs: ['Dark terminal background', 'Colored output lines', 'Blinking cursor', 'Command prefix ($)'], tokens: [
      t('Terminal BG', '--terminal-bg', '--token-code-bg', '#fafafa', '#111113', 'Terminal dark surface', 'surface'),
      t('Terminal Text', '--terminal-text', '--token-code-text', '#24292e', '#e5e5e5', 'Default output text', 'text'),
      t('Success Line', '--terminal-text-success', '--token-tertiary', '#697459', '#8a9b77', 'Success output lines', 'text'),
      t('Error Line', '--terminal-text-error', '--token-error', '#b54a4a', '#d47272', 'Error output lines', 'text'),
      t('Warning Line', '--terminal-text-warning', '--token-warning', '#9f8136', '#d4aa55', 'Warning output lines', 'text'),
      t('Prompt Prefix', '--terminal-text-prompt', '--token-text-tertiary', '#8f8f8f', '#707070', '$ command prefix', 'text'),
      t('Cursor', '--terminal-bg-cursor', '--token-accent', '#4f6d80', '#6b8598', 'Blinking terminal cursor', 'surface'),
      t('Font', '--terminal-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Monospace terminal font', 'text'),
      t('Cursor Blink', 'token-blink', '1s step-end', '1s step-end', 'Cursor blink animation', 'motion'),
    ] },
    { id: 'artifact-viewer', label: 'Artifact Viewer', useCase: 'Multi-tab viewer for generated code artifacts', tokenAdaptations: 'Tab bar uses --token-accent for active tab, --token-bg-secondary for tab row', diffs: ['Tab bar for multiple files', 'File type icons', 'Preview/code toggle', 'Download action'], tokens: [
      t('Tab Bar BG', '--artifact-bg-tabs', '--token-bg-secondary', '#fafafa', '#111113', 'Tab row surface', 'surface'),
      t('Active Tab', '--artifact-text-active', '--token-accent', '#4f6d80', '#6b8598', 'Selected tab label and indicator', 'text'),
      t('Inactive Tab', '--artifact-text-inactive', '--token-text-tertiary', '#8f8f8f', '#707070', 'Unselected tab, download icon', 'text'),
      t('Content BG', '--artifact-bg-content', '--token-code-bg', '#fafafa', '#111113', 'Code area', 'surface'),
      t('Tab Border', '--artifact-border', '--token-border', '#eaeaea', '#27272a', 'Tab bar bottom border', 'border'),
      t('File Icon', '--artifact-text-file', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'File type icon', 'text'),
    ] },
  ],
  'content-card': [
    { id: 'agent-card', label: 'Agent Card', useCase: 'AI agent identity with capabilities', tokenAdaptations: '--token-accent for agent avatar, --token-tertiary for capability badges', diffs: ['Agent avatar and name', 'Capability tag chips', 'Status indicator dot', 'Description paragraph'], tokens: [
      t('Card Background', '--agent-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--agent-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--agent-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--agent-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Agent Avatar BG', '--agent-bg-avatar', '--token-accent', '#4f6d80', '#6b8598', 'Agent identity circle', 'surface'),
      t('Agent Avatar FG', '--agent-text-avatar', '--token-accent-fg', '#ffffff', '#ffffff', 'Agent icon', 'text'),
      t('Agent Name', '--agent-text-name', '--token-text-primary', '#0a0a0a', '#ededed', 'Agent display name', 'text'),
      t('Description', '--agent-text-desc', '--token-text-secondary', '#666666', '#a1a1a1', 'Agent description', 'text'),
      t('Capability BG', '--agent-bg-capability', '--token-tertiary-light', '#f3f5f0', '#181c15', 'Capability badge surface', 'surface'),
      t('Capability FG', '--agent-text-capability', '--token-tertiary', '#697459', '#8a9b77', 'Capability badge text', 'text'),
      t('Status Dot', '--agent-dot-status', '--token-success', '#2d7a60', '#6aab8a', 'Online status dot', 'surface'),
    ] },
    { id: 'research-card', label: 'Research Card', useCase: 'Research findings with sources', tokenAdaptations: '--token-insight-bg/border for card surface, --token-accent for source links', diffs: ['Source citation numbers', 'Confidence bar', 'Key finding highlight', 'Source links list'], tokens: [
      t('Card BG', '--research-bg', '--token-insight-bg', '#fafafa', '#111113', 'Research card surface', 'surface'),
      t('Card Border', '--research-border', '--token-insight-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Finding Title', '--research-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Key finding heading', 'text'),
      t('Finding Body', '--research-text-body', '--token-text-secondary', '#666666', '#a1a1a1', 'Finding description', 'text'),
      t('Accent (citation, link)', '--research-bg-citation', '--token-accent', '#4f6d80', '#6b8598', 'Citation badge and source links', 'surface'),
      t('Citation Text', '--research-text-citation', '--token-accent-fg', '#ffffff', '#ffffff', 'Badge number text', 'text'),
      t('Confidence High', '--research-conf-high', '--token-confidence-high', '#2d7a60', '#6aab8a', 'High confidence bar', 'surface'),
      t('Confidence Medium', '--research-conf-medium', '--token-confidence-medium', '#9f8136', '#d4aa55', 'Medium confidence bar', 'surface'),
      t('Confidence Low', '--research-conf-low', '--token-confidence-low', '#b54a4a', '#d47272', 'Low confidence bar', 'surface'),
      t('Confidence Track', '--research-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Gauge track', 'surface'),
      t('Card Radius', '--research-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
    ] },
    { id: 'insight-card', label: 'Insight Card', useCase: 'Data-driven insight with metrics', tokenAdaptations: '--token-tertiary for positive metrics, --token-secondary for emphasis callouts', diffs: ['Key metric display', 'Trend arrow indicators', 'Insight summary text', 'Related data points'], tokens: [
      t('Card Background', '--insight-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--insight-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--insight-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--insight-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Metric Value', '--insight-text-metric', '--token-text-primary', '#0a0a0a', '#ededed', 'Key number display', 'text'),
      t('Trend Up', '--insight-text-trend-up', '--token-tertiary', '#697459', '#8a9b77', 'Positive trend arrow', 'text'),
      t('Trend Down', '--insight-text-trend-down', '--token-secondary', '#8a6d3b', '#b29256', 'Negative trend arrow', 'text'),
      t('Insight Text', '--insight-text-summary', '--token-text-secondary', '#666666', '#a1a1a1', 'Summary description', 'text'),
      t('Callout BG', '--insight-bg-callout', '--token-secondary-light', '#f8f5ed', '#211a10', 'Emphasis callout surface', 'surface'),
    ] },
    { id: 'model-selector', label: 'Model Selector', useCase: 'Model picker with specs and pricing', tokenAdaptations: '--token-accent for selected model ring, --token-bg-hover for hover state', diffs: ['Model name and provider', 'Spec comparison (context, speed)', 'Pricing per 1M tokens', 'Selected state ring'], tokens: [
      t('Card Background', '--model-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--model-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--model-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--model-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Selected Ring', '--model-border-selected', '--token-accent', '#4f6d80', '#6b8598', 'Selected model border', 'border'),
      t('Selected BG', '--model-bg-selected', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Selected model fill', 'surface'),
      t('Hover BG', '--model-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Hover state fill', 'surface'),
      t('Model Name', '--model-text-name', '--token-text-primary', '#0a0a0a', '#ededed', 'Model display name', 'text'),
      t('Provider', '--model-text-provider', '--token-text-tertiary', '#8f8f8f', '#707070', 'Provider name', 'text'),
      t('Spec Label', '--model-text-label', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Context/Speed label', 'text'),
      t('Price', '--model-text-price', '--token-text-secondary', '#666666', '#a1a1a1', 'Pricing text', 'text'),
    ] },
    { id: 'cost-estimator', label: 'Cost Estimator', useCase: 'Token/cost breakdown calculator', tokenAdaptations: '--token-font-mono for numbers, --token-warning for cost thresholds', diffs: ['Input/output token split', 'Cost per request', 'Monthly estimate', 'Budget threshold warning'], tokens: [
      t('Card Background', '--cost-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Radius', '--cost-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--cost-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Number Font', '--cost-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Cost numbers', 'text'),
      t('Cost Value', '--cost-text-value', '--token-text-primary', '#0a0a0a', '#ededed', 'Dollar amount', 'text'),
      t('Token Count', '--cost-text-count', '--token-text-secondary', '#666666', '#a1a1a1', 'Token numbers', 'text'),
      t('Label', '--cost-text-label', '--token-text-tertiary', '#8f8f8f', '#707070', 'Input/Output labels', 'text'),
      t('Threshold Warning', '--cost-text-warning', '--token-warning', '#9f8136', '#d4aa55', 'Budget warning indicator', 'text'),
      t('Warning BG', '--cost-bg-warning', '--token-warning-light', '#ede3c7', '#241e0d', 'Warning highlight area', 'surface'),
      t('Divider', '--cost-border', '--token-border', '#eaeaea', '#27272a', 'Between sections', 'border'),
    ] },
    { id: 'confidence-score', label: 'Confidence Score', useCase: 'Visual confidence gauge', tokenAdaptations: '--token-confidence-high/medium/low for gauge segments', diffs: ['Circular or bar gauge', 'Percentage display', 'Confidence level label', 'Contributing factors'], tokens: [
      t('Card Background', '--conf-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--conf-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--conf-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--conf-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('High Confidence', '--conf-fill-high', '--token-confidence-high', '#2d7a60', '#6aab8a', 'High gauge fill', 'surface'),
      t('Medium Confidence', '--conf-fill-medium', '--token-confidence-medium', '#9f8136', '#d4aa55', 'Medium gauge fill', 'surface'),
      t('Low Confidence', '--conf-fill-low', '--token-confidence-low', '#b54a4a', '#d47272', 'Low gauge fill', 'surface'),
      t('Gauge Track', '--conf-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Gauge background track', 'surface'),
      t('Percentage', '--conf-text-score', '--token-text-primary', '#0a0a0a', '#ededed', 'Score number', 'text'),
      t('Percentage Font', '--conf-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Score monospace', 'text'),
      t('Level Label', '--conf-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'High/Medium/Low label', 'text'),
    ] },
    { id: 'verification-badge', label: 'Verification Badge', useCase: 'Source verification status', tokenAdaptations: '--token-success for verified, --token-warning for partial, --token-error for unverified', diffs: ['Verification icon (check/warning)', 'Status label', 'Source reference', 'Last verified timestamp'], tokens: [
      t('Verified BG', '--verify-bg-verified', '--token-success-light', '#d2e8dc', '#0e211a', 'Verified surface', 'surface'),
      t('Verified Icon', '--verify-text-verified', '--token-success', '#2d7a60', '#6aab8a', 'Check icon', 'text'),
      t('Partial BG', '--verify-bg-partial', '--token-warning-light', '#ede3c7', '#241e0d', 'Partial surface', 'surface'),
      t('Partial Icon', '--verify-text-partial', '--token-warning', '#9f8136', '#d4aa55', 'Warning icon', 'text'),
      t('Unverified BG', '--verify-bg-unverified', '--token-error-light', '#f0d8d8', '#2a1111', 'Unverified surface', 'surface'),
      t('Unverified Icon', '--verify-text-unverified', '--token-error', '#b54a4a', '#d47272', 'X icon', 'text'),
      t('Status Label', '--verify-text-label', '--token-text-primary', '#0a0a0a', '#ededed', 'Verification status text', 'text'),
      t('Timestamp', '--verify-text-timestamp', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Last verified time', 'text'),
      t('Badge Radius', '--verify-radius', '--token-radius-full', '9999px', '9999px', 'Pill badge shape', 'shape'),
    ] },
  ],
  'data-view': [
    { id: 'data-table', label: 'Data Table', useCase: 'Sortable tabular data', tokenAdaptations: '--token-border for cell borders, --token-bg-secondary for header row', diffs: ['Column headers with sort', 'Alternating row colors', 'Cell formatting', 'Pagination controls'], tokens: [
      t('Table Background', '--table-bg', '--token-bg', '#ffffff', '#09090b', 'Table container surface', 'surface'),
      t('Header BG', '--table-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Table header row', 'surface'),
      t('Header Text', '--table-text-header', '--token-text-tertiary', '#8f8f8f', '#707070', 'Column headers', 'text'),
      t('Cell Text', '--table-text-cell', '--token-text-primary', '#0a0a0a', '#ededed', 'Cell values', 'text'),
      t('Row Alt BG', '--table-bg-alt', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Alternating row', 'surface'),
      t('Cell Border', '--table-border-cell', '--token-border', '#eaeaea', '#27272a', 'Cell dividers', 'border'),
      t('Sort Icon Active', '--table-text-sort-active', '--token-accent', '#4f6d80', '#6b8598', 'Active sort arrow', 'text'),
      t('Sort Icon Inactive', '--table-text-sort', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Inactive sort arrow', 'text'),
      t('Pagination Button', '--table-text-page', '--token-text-secondary', '#666666', '#a1a1a1', 'Page nav buttons', 'text'),
      t('Radius', '--table-radius', '--token-radius-lg', '12px', '12px', 'Table rounding', 'shape'),
    ] },
    { id: 'chart-result', label: 'Chart Result', useCase: 'Bar/horizontal chart visualization', tokenAdaptations: '--token-accent for primary bars, --token-secondary for comparison bars', diffs: ['Bar chart layout', 'Axis labels', 'Value labels on bars', 'Legend component'], tokens: [
      t('Card Background', '--chart-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--chart-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--chart-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--chart-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Primary Bar', '--chart-bg-primary', '--token-accent', '#4f6d80', '#6b8598', 'Primary data bars (moonstone)', 'surface'),
      t('Secondary Bar', '--chart-bg-secondary', '--token-secondary', '#8a6d3b', '#b29256', 'Comparison bars (sunstone)', 'surface'),
      t('Axis Text', '--chart-text-axis', '--token-text-tertiary', '#8f8f8f', '#707070', 'Axis labels', 'text'),
      t('Value Text', '--chart-text-value', '--token-text-secondary', '#666666', '#a1a1a1', 'Bar value labels', 'text'),
      t('Grid Lines', '--chart-border-grid', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Chart grid lines', 'border'),
    ] },
    { id: 'token-usage', label: 'Token Usage', useCase: 'Token consumption gauge', tokenAdaptations: 'Progress bar gradient, --token-warning for threshold approaching', diffs: ['Circular/linear gauge', 'Used/remaining split', 'Model label', 'Cost calculation'], tokens: [
      t('Card Background', '--usage-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--usage-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--usage-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--usage-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Gauge Fill Start', '--usage-fill-start', '--token-accent', '#4f6d80', '#6b8598', 'Usage gradient start', 'surface'),
      t('Gauge Fill End', '--usage-fill-end', '--token-secondary', '#8a6d3b', '#b29256', 'Usage gradient end', 'surface'),
      t('Gauge Track', '--usage-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Gauge background', 'surface'),
      t('Threshold Zone', '--usage-bg-threshold', '--token-warning', '#9f8136', '#d4aa55', 'Approaching limit', 'surface'),
      t('Used Label', '--usage-text-label', '--token-text-secondary', '#666666', '#a1a1a1', '"Used" text', 'text'),
      t('Count Font', '--usage-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Token count numbers', 'text'),
    ] },
    { id: 'context-window', label: 'Context Window', useCase: 'Context size visualization', tokenAdaptations: 'Segmented bar with --token-accent (system), --token-secondary (user), --token-tertiary (available)', diffs: ['Segmented capacity bar', 'Section labels', 'Token count per section', 'Optimization suggestions'], tokens: [
      t('Card Background', '--ctx-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--ctx-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--ctx-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--ctx-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('System Segment', '--ctx-segment-system', '--token-accent', '#4f6d80', '#6b8598', 'System prompt segment (moonstone)', 'surface'),
      t('User Segment', '--ctx-segment-user', '--token-secondary', '#8a6d3b', '#b29256', 'User context segment (sunstone)', 'surface'),
      t('Available Segment', '--ctx-segment-available', '--token-tertiary', '#697459', '#8a9b77', 'Available space (olivine)', 'surface'),
      t('Segment Track', '--ctx-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Full capacity track', 'surface'),
      t('Section Label', '--ctx-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Section name', 'text'),
      t('Token Count', '--ctx-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Token numbers per section', 'text'),
    ] },
    { id: 'parameters-panel', label: 'Parameters Panel', useCase: 'Model parameter sliders and toggles', tokenAdaptations: 'Slider track uses --token-bg-tertiary, thumb uses --token-accent', diffs: ['Range sliders', 'Value input fields', 'Reset to default', 'Parameter descriptions'], tokens: [
      t('Card Background', '--params-bg', '--token-bg', '#ffffff', '#09090b', 'Card surface', 'surface'),
      t('Card Border', '--params-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('Card Radius', '--params-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Card Padding', '--params-spacing', '--token-space-4', '16px', '16px', 'Card padding', 'spacing'),
      t('Slider Track', '--params-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Slider background track', 'surface'),
      t('Accent (slider, reset)', '--params-bg-accent', '--token-accent', '#4f6d80', '#6b8598', 'Slider fill/thumb, reset link', 'surface'),
      t('Param Label', '--params-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Parameter name', 'text'),
      t('Param Value', '--params-text-value', '--token-text-primary', '#0a0a0a', '#ededed', 'Current value', 'text'),
      t('Description', '--params-text-desc', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Help text', 'text'),
    ] },
  ],
  'media-canvas': [
    { id: 'image-gen-grid', label: 'Image Grid', useCase: 'Generated image results grid', tokenAdaptations: '--token-image-selected-ring (accent) for selection, --token-image-placeholder for loading', diffs: ['2x2 or 4-column grid', 'Selection ring on click', 'Download/expand actions', 'Generation progress overlay'], tokens: [
      t('Placeholder BG', '--imgrid-bg-placeholder', '--token-image-placeholder', '#f0f0f0', '#1c1c1f', 'Loading placeholder', 'surface'),
      t('Selected Ring', '--imgrid-border-selected', '--token-image-selected-ring', '#4f6d80', '#6b8598', 'Selection border (moonstone)', 'border'),
      t('Unselected Border', '--imgrid-border-default', '--token-border', '#eaeaea', '#27272a', 'Default image border', 'border'),
      t('Overlay BG', '--imgrid-bg-overlay', '--token-image-overlay', 'rgba(0,0,0,.5)', 'rgba(0,0,0,.6)', 'Action overlay', 'surface'),
      t('Action Icon', '#ffffff', '#ffffff', '#ffffff', 'Download/expand on overlay', 'text'),
      t('Image Radius', '--imgrid-radius', '--token-radius-lg', '12px', '12px', 'Image rounding', 'shape'),
      t('Grid Gap', '--imgrid-gap', '--token-space-3', '12px', '12px', 'Between images', 'spacing'),
      t('Ring Width', '3px', '3px', '3px', 'Selection ring thickness', 'border'),
      t('Progress BG', '--imgrid-bg-progress', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Gen progress overlay', 'surface'),
    ] },
    { id: 'image-editor', label: 'Image Editor', useCase: 'In/outpainting with brush controls', tokenAdaptations: '--token-accent for active tool, --token-bg-secondary for toolbar', diffs: ['Canvas workspace', 'Brush size slider', 'Tool palette sidebar', 'Mask overlay'], tokens: [
      t('Canvas BG', '--editor-bg-canvas', '--token-bg-inset', '#f0f0f0', '#0e0e10', 'Canvas workspace', 'surface'),
      t('Toolbar BG', '--editor-bg-toolbar', '--token-bg-secondary', '#fafafa', '#111113', 'Tool palette surface', 'surface'),
      t('Accent (tool, slider)', '--editor-bg-accent', '--token-accent', '#4f6d80', '#6b8598', 'Active tool and slider thumb', 'surface'),
      t('Tool Icon Default', '--editor-text-icon', '--token-text-secondary', '#666666', '#a1a1a1', 'Unselected tool icon', 'text'),
      t('Tool Icon Active', '--editor-text-icon-active', '--token-accent-fg', '#ffffff', '#ffffff', 'Active tool icon', 'text'),
      t('Brush Slider Track', '--editor-bg-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Slider track', 'surface'),
      t('Toolbar Border', '--editor-border', '--token-border', '#eaeaea', '#27272a', 'Toolbar border', 'border'),
      t('Mask Overlay', 'rgba(79,109,128,.3)', '...', '...', 'Mask painting overlay', 'surface'),
    ] },
    { id: 'variations-picker', label: 'Variations', useCase: 'Multiple AI variations for comparison', tokenAdaptations: '--token-accent for selected variation ring, --token-bg-hover for hover', diffs: ['Horizontal scroll of variants', 'Selected highlight', 'Variation index labels', 'Regenerate action'], tokens: [
      t('Accent (ring, regen)', '--variations-border-selected', '--token-accent', '#4f6d80', '#6b8598', 'Selected ring and regenerate action', 'border'),
      t('Hover BG', '--variations-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Hover state', 'surface'),
      t('Variation Index', '--variations-text-index', '--token-text-tertiary', '#8f8f8f', '#707070', 'Index number label', 'text'),
      t('Thumbnail Radius', '--variations-radius', '--token-radius-md', '8px', '8px', 'Thumbnail rounding', 'shape'),
      t('Scroll Gap', '--variations-gap', '--token-space-3', '12px', '12px', 'Between variations', 'spacing'),
    ] },
    { id: 'comparison-view', label: 'Comparison', useCase: 'Side-by-side model output comparison', tokenAdaptations: '--token-accent for model A label, --token-secondary for model B label', diffs: ['Split panel layout', 'Model name headers', 'Slider divider', 'Preference selection buttons'], tokens: [
      t('Accent (A label, pref)', '--compare-bg-a', '--token-accent', '#4f6d80', '#6b8598', 'Model A header, active preference', 'surface'),
      t('Model B Label', '--compare-bg-b', '--token-secondary', '#8a6d3b', '#b29256', 'Model B header (sunstone)', 'surface'),
      t('Label Text', '--compare-text-label', '--token-accent-fg', '#ffffff', '#ffffff', 'White text on labels', 'text'),
      t('Divider', '--compare-border-divider', '--token-border-strong', '#d1d1d1', '#3f3f46', 'Center slider divider', 'border'),
      t('Panel BG', '--compare-bg-panel', '--token-bg', '#ffffff', '#09090b', 'Each panel surface', 'surface'),
      t('Prefer Button BG', '--compare-bg-prefer', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Preference button', 'surface'),
    ] },
    { id: 'canvas-workspace', label: 'Canvas', useCase: 'Freeform AI workspace with nodes', tokenAdaptations: '--token-bg-inset for canvas bg, --token-accent for connection lines', diffs: ['Infinite canvas area', 'Node cards', 'Connection arrows', 'Zoom controls'], tokens: [
      t('Canvas BG', '--canvas-bg', '--token-bg-inset', '#f0f0f0', '#0e0e10', 'Infinite canvas surface', 'surface'),
      t('Node Card BG', '--canvas-bg-node', '--token-bg', '#ffffff', '#09090b', 'Node card surface', 'surface'),
      t('Node Card Border', '--canvas-border-node', '--token-border', '#eaeaea', '#27272a', 'Node border', 'border'),
      t('Node Card Shadow', '--canvas-shadow-node', '--token-shadow-md', '...', '...', 'Node elevation', 'shadow'),
      t('Connection (line, arrow)', '--canvas-border-connection', '--token-accent', '#4f6d80', '#6b8598', 'Node connections and arrows', 'border'),
      t('Zoom Controls BG', '--canvas-bg-zoom', '--token-bg-secondary', '#fafafa', '#111113', 'Zoom button bg', 'surface'),
      t('Zoom Icon', '--canvas-text-zoom', '--token-text-secondary', '#666666', '#a1a1a1', 'Zoom +/- icons', 'text'),
    ] },
  ],
  'audio-interface': [
    { id: 'voice-waveform', label: 'Waveform', useCase: 'Real-time voice input visualization', tokenAdaptations: '--token-voice-bar/bar-active for waveform bars', diffs: ['Vertical bar visualization', 'Active bars highlighted', 'Recording duration', 'Amplitude response'], tokens: [
      t('Container BG', '--waveform-bg', '--token-voice-bg', '#f5f5f5', '#18181b', 'Waveform area bg', 'surface'),
      t('Bar Default', '--waveform-bar', '--token-voice-bar', '#0a0a0a', '#ededed', 'Inactive waveform bars', 'surface'),
      t('Bar Active', '--waveform-bar-active', '--token-voice-bar-active', '#4f6d80', '#6b8598', 'Active waveform bars (moonstone)', 'surface'),
      t('Duration Text', '--waveform-text-duration', '--token-text-secondary', '#666666', '#a1a1a1', 'Recording time', 'text'),
      t('Duration Font', '--waveform-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Timer monospace', 'text'),
      t('Bar Radius', '--waveform-radius-bar', '--token-radius-sm', '4px', '4px', 'Bar top rounding', 'shape'),
      t('Bar Gap', '2px', '2px', '2px', 'Between bars', 'spacing'),
    ] },
    { id: 'audio-player', label: 'Audio Player', useCase: 'TTS playback with controls', tokenAdaptations: '--token-voice-progress (accent) for playback bar, --token-voice-track for bg', diffs: ['Play/pause button', 'Progress bar', 'Speed control', 'Duration display'], tokens: [
      t('Track BG', '--player-bg-track', '--token-voice-track', '#e5e5e5', '#2a2a2e', 'Playback track bg', 'surface'),
      t('Progress Fill', '--player-bg-progress', '--token-voice-progress', '#4f6d80', '#6b8598', 'Playback progress (moonstone)', 'surface'),
      t('Play Button', '--player-bg-play', '--token-accent', '#4f6d80', '#6b8598', 'Play/pause button', 'surface'),
      t('Play Icon', '--player-text-play', '--token-accent-fg', '#ffffff', '#ffffff', 'Play icon color', 'text'),
      t('Duration', '--player-text-duration', '--token-text-tertiary', '#8f8f8f', '#707070', 'Time display', 'text'),
      t('Speed Badge', '--player-bg-speed', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Speed control bg', 'surface'),
      t('Track Radius', '--player-radius-track', '--token-radius-full', '9999px', '9999px', 'Rounded track', 'shape'),
    ] },
    { id: 'voice-selector', label: 'Voice Picker', useCase: 'Voice identity selection', tokenAdaptations: '--token-accent for selected voice ring, --token-bg-hover for hover state', diffs: ['Voice avatar grid', 'Preview play button', 'Voice name and traits', 'Selected state ring'], tokens: [
      t('Avatar BG', '--voice-bg-avatar', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Voice avatar bg', 'surface'),
      t('Accent (ring, play)', '--voice-border-selected', '--token-accent', '#4f6d80', '#6b8598', 'Selected ring and play button', 'border'),
      t('Hover BG', '--voice-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Hover state', 'surface'),
      t('Voice Name', '--voice-text-name', '--token-text-primary', '#0a0a0a', '#ededed', 'Voice display name', 'text'),
      t('Voice Traits', '--voice-text-traits', '--token-text-tertiary', '#8f8f8f', '#707070', 'Trait description', 'text'),
      t('Card Radius', '--voice-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
      t('Grid Gap', '--voice-spacing-gap', '--token-space-3', '12px', '12px', 'Between voice cards', 'spacing'),
    ] },
    { id: 'orb-visualizer', label: 'Orb Visualizer', useCase: 'Ambient orb animation responding to audio', tokenAdaptations: '--token-accent gradient for orb glow, --token-bg-tertiary for backdrop', diffs: ['Centered circular orb', 'Pulse animation on audio', 'Gradient glow effect', 'State labels (listening/speaking)'], tokens: [
      t('Backdrop BG', '--orb-bg', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Full area backdrop', 'surface'),
      t('Orb Core', '--orb-bg-core', '--token-accent', '#4f6d80', '#6b8598', 'Inner orb gradient core', 'surface'),
      t('Orb Glow', '--orb-bg-glow', '--token-secondary', '#8a6d3b', '#b29256', 'Outer orb glow (sunstone)', 'surface'),
      t('Orb Shadow', '--orb-shadow', '--token-shadow-accent', 'moonstone glow', 'moonstone glow', 'Ambient glow shadow', 'shadow'),
      t('State Label', '--orb-text-state', '--token-text-secondary', '#666666', '#a1a1a1', 'Listening/Speaking text', 'text'),
      t('State Font', '--orb-font', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'State label monospace', 'text'),
      t('Pulse', 'token-pulse', '2s ease', '2s ease', 'Orb breath animation', 'motion'),
    ] },
  ],
  'action-row': [
    { id: 'feedback-actions', label: 'Feedback', useCase: 'Thumbs up/down with copy and retry', tokenAdaptations: 'Icons use --token-text-tertiary, active uses --token-accent', diffs: ['Horizontal button row', 'Toggle state for likes', 'Copy confirmation toast', 'Retry spinner'], tokens: [
      t('Icon Default', '--feedback-text-default', '--token-text-tertiary', '#8f8f8f', '#707070', 'Inactive action icon', 'text'),
      t('Active / Spinner', '--feedback-text-active', '--token-accent', '#4f6d80', '#6b8598', 'Active icon and retry spinner', 'text'),
      t('Icon Hover', '--feedback-text-hover', '--token-text-secondary', '#666666', '#a1a1a1', 'Hover state icon', 'text'),
      t('Divider', '--feedback-border', '--token-border', '#eaeaea', '#27272a', 'Between action groups', 'border'),
      t('Toast BG', '--feedback-bg-toast', '--token-text-primary', '#0a0a0a', '#ededed', 'Copy toast background', 'surface'),
      t('Toast Text', '--feedback-text-toast', '--token-text-inverse', '#ffffff', '#09090b', 'Toast message text', 'text'),
      t('Button Gap', '--feedback-spacing-gap', '--token-space-1', '4px', '4px', 'Between action buttons', 'spacing'),
    ] },
    { id: 'inline-actions', label: 'Inline Actions', useCase: 'Contextual actions overlaid on content', tokenAdaptations: '--token-bg with --token-shadow-md for floating bar, --token-border for container', diffs: ['Floating action bar', 'Appears on hover', 'Position context-aware', 'Quick action buttons'], tokens: [
      t('Bar BG', '--inline-bg', '--token-bg', '#ffffff', '#09090b', 'Floating bar surface', 'surface'),
      t('Bar Border', '--inline-border', '--token-border', '#eaeaea', '#27272a', 'Bar outline', 'border'),
      t('Bar Shadow', '--inline-shadow', '--token-shadow-md', '...', '...', 'Floating elevation', 'shadow'),
      t('Icon Color', '--inline-text-icon', '--token-text-tertiary', '#8f8f8f', '#707070', 'Action icons', 'text'),
      t('Bar Radius', '--inline-radius', '--token-radius-md', '8px', '8px', 'Bar rounding', 'shape'),
      t('Z-Index', '--inline-z', '--token-z-dropdown', '100', '100', 'Float above content', 'spacing'),
      t('Fade In', 'token-fade-in', '200ms ease', '200ms ease', 'Appear animation', 'motion'),
    ] },
    { id: 'source-citation', label: 'Source Citation', useCase: 'Inline reference links with numbered badges', tokenAdaptations: 'Badge uses --token-accent, hover shows --token-accent-light tooltip', diffs: ['Numbered superscript badges', 'Hover tooltip with source', 'Click to expand', 'Source URL and title'], tokens: [
      t('Badge BG', '--citation-bg-badge', '--token-accent', '#4f6d80', '#6b8598', 'Citation number badge', 'surface'),
      t('Badge Text', '--citation-text-badge', '--token-accent-fg', '#ffffff', '#ffffff', 'Badge number', 'text'),
      t('Tooltip BG', '--citation-bg-tooltip', '--token-accent-light', '#dce3ea', '#131c22', 'Source tooltip surface', 'surface'),
      t('Tooltip Text', '--citation-text-tooltip', '--token-text-secondary', '#666666', '#a1a1a1', 'Source URL/title', 'text'),
      t('Badge Radius', '--citation-radius-badge', '--token-radius-full', '9999px', '9999px', 'Circle badge', 'shape'),
      t('Tooltip Radius', '--citation-radius-tooltip', '--token-radius-md', '8px', '8px', 'Tooltip rounding', 'shape'),
      t('Tooltip Shadow', '--citation-shadow', '--token-shadow-lg', '...', '...', 'Tooltip elevation', 'shadow'),
    ] },
    { id: 'file-attachment', label: 'File Attachment', useCase: 'Attached file cards with type info', tokenAdaptations: '--token-bg-secondary for card, file type badges use category colors', diffs: ['File icon by type', 'File name and size', 'Download action', 'Preview on hover'], tokens: [
      t('Card BG', '--attach-bg', '--token-bg-secondary', '#fafafa', '#111113', 'Attachment card surface', 'surface'),
      t('Card Border', '--attach-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
      t('File Name', '--attach-text-name', '--token-text-primary', '#0a0a0a', '#ededed', 'File name text', 'text'),
      t('File Size', '--attach-text-size', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'File size label', 'text'),
      t('File Size Font', '--attach-font-size', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'Size monospace', 'text'),
      t('PDF Badge', '--attach-bg-pdf', '--token-error', '#b54a4a', '#d47272', 'PDF type badge', 'surface'),
      t('Code Badge', '--attach-bg-code', '--token-accent', '#4f6d80', '#6b8598', 'Code file type badge', 'surface'),
      t('Doc Badge', '--attach-bg-doc', '--token-tertiary', '#697459', '#8a9b77', 'Doc type badge', 'surface'),
      t('Download Icon', '--attach-text-download', '--token-text-tertiary', '#8f8f8f', '#707070', 'Download action', 'text'),
      t('Card Radius', '--attach-radius', '--token-radius-md', '8px', '8px', 'Card rounding', 'shape'),
    ] },
  ],
  'system-dialog': [
    { id: 'consent-dialog', label: 'Consent Dialog', useCase: 'Permission request with accept/deny', tokenAdaptations: '--token-accent for accept button, --token-bg-tertiary for deny, --token-bg-overlay for backdrop', diffs: ['Modal overlay', 'Permission description', 'Accept/deny buttons', "Don't ask again checkbox"], tokens: [
      t('Overlay BG', '--dialog-bg-overlay', '--token-bg-overlay', 'rgba(0,0,0,.5)', 'rgba(0,0,0,.7)', 'Modal backdrop', 'surface'),
      t('Dialog BG', '--dialog-bg', '--token-bg', '#ffffff', '#09090b', 'Dialog surface', 'surface'),
      t('Dialog Border', '--dialog-border', '--token-border', '#eaeaea', '#27272a', 'Dialog border', 'border'),
      t('Dialog Shadow', '--dialog-shadow', '--token-shadow-xl', '...', '...', 'Dialog elevation', 'shadow'),
      t('Title / Deny Text', '--dialog-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Dialog heading and deny text', 'text'),
      t('Description', '--dialog-text-desc', '--token-text-secondary', '#666666', '#a1a1a1', 'Permission description', 'text'),
      t('Accent (accept, checkbox)', '--dialog-bg-accept', '--token-accent', '#4f6d80', '#6b8598', 'Accept button and checkbox active', 'surface'),
      t('Accept FG', '--dialog-text-accept', '--token-accent-fg', '#ffffff', '#ffffff', 'Accept button text', 'text'),
      t('Deny BG', '--dialog-bg-deny', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Deny button surface', 'surface'),
      t('Dialog Radius', '--dialog-radius', '--token-radius-xl', '16px', '16px', 'Dialog rounding', 'shape'),
      t('Z-Index', '--dialog-z', '--token-z-modal', '300', '300', 'Modal layer', 'spacing'),
    ] },
    { id: 'mcp-connector', label: 'MCP Connector', useCase: 'Protocol server connection management', tokenAdaptations: '--token-tertiary for connected status, --token-error for disconnected', diffs: ['Server list with status', 'Connect/disconnect toggle', 'Server URL input', 'Connection log'], tokens: [
      t('Panel Background', '--mcp-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--mcp-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--mcp-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--mcp-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--mcp-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--mcp-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--mcp-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Connected Dot', '--mcp-bg-connected', '--token-tertiary', '#697459', '#8a9b77', 'Connected status (olivine)', 'surface'),
      t('Disconnected Dot', '--mcp-bg-disconnected', '--token-error', '#b54a4a', '#d47272', 'Disconnected status', 'surface'),
      t('Server Name', '--mcp-text-name', '--token-text-primary', '#0a0a0a', '#ededed', 'Server display name', 'text'),
      t('Server URL', '--mcp-text-url', '--token-text-tertiary', '#8f8f8f', '#707070', 'Server URL text', 'text'),
      t('URL Font', '--mcp-font-url', '--token-font-mono', 'JetBrains Mono', 'JetBrains Mono', 'URL monospace', 'text'),
      t('Toggle Active', '--mcp-bg-toggle', '--token-accent', '#4f6d80', '#6b8598', 'Connect toggle on', 'surface'),
      t('Log BG', '--mcp-bg-log', '--token-bg-code', '#f4f4f5', '#141416', 'Connection log area', 'surface'),
    ] },
    { id: 'notification-center', label: 'Notifications', useCase: 'Status notifications with type icons', tokenAdaptations: 'Success/warning/error semantic colors for notification types', diffs: ['Notification type icons', 'Timestamp display', 'Mark as read action', 'Clear all button'], tokens: [
      t('Panel Background', '--notif-bg', '--token-bg', '#ffffff', '#09090b', 'Main panel surface', 'surface'),
      t('Header Background', '--notif-bg-header', '--token-bg-secondary', '#fafafa', '#111113', 'Panel header bar', 'surface'),
      t('Border', '--notif-border', '--token-border', '#eaeaea', '#27272a', 'Panel outline and dividers', 'border'),
      t('Title Text', '--notif-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Panel header and primary text', 'text'),
      t('Panel Radius', '--notif-radius', '--token-radius-lg', '12px', '12px', 'Panel corner rounding', 'shape'),
      t('Header Padding', '--notif-spacing-header', '--token-space-3', '12px', '12px', 'Header vertical padding', 'spacing'),
      t('Content Padding', '--notif-spacing-content', '--token-space-4', '16px', '16px', 'Content area horizontal padding', 'spacing'),
      t('Success Icon', '--notif-text-success', '--token-success', '#2d7a60', '#6aab8a', 'Success notification icon', 'text'),
      t('Success BG', '--notif-bg-success', '--token-success-light', '#d2e8dc', '#0e211a', 'Success notification surface', 'surface'),
      t('Warning Icon', '--notif-text-warning', '--token-warning', '#9f8136', '#d4aa55', 'Warning notification icon', 'text'),
      t('Warning BG', '--notif-bg-warning', '--token-warning-light', '#ede3c7', '#241e0d', 'Warning notification surface', 'surface'),
      t('Error Icon', '--notif-text-error', '--token-error', '#b54a4a', '#d47272', 'Error notification icon', 'text'),
      t('Error BG', '--notif-bg-error', '--token-error-light', '#f0d8d8', '#2a1111', 'Error notification surface', 'surface'),
      t('Timestamp', '--notif-text-time', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Time display', 'text'),
      t('Accent (unread, clear)', '--notif-bg-accent', '--token-accent', '#4f6d80', '#6b8598', 'Unread dot and clear all link', 'surface'),
    ] },
  ],
  'search-browse': [
    { id: 'search-results', label: 'Search Results', useCase: 'Web search result cards with snippets', tokenAdaptations: '--token-accent for titles, --token-text-tertiary for URLs, --token-tertiary for relevance', diffs: ['Title as accent link', 'URL breadcrumb path', 'Snippet with bold matches', 'Relevance score badge'], tokens: [
      t('Container BG', '--search-bg', '--token-bg', '#ffffff', '#09090b', 'Results list surface', 'surface'),
      t('Result Title', '--search-text-title', '--token-accent', '#4f6d80', '#6b8598', 'Clickable title link (moonstone)', 'text'),
      t('URL Path', '--search-text-url', '--token-text-tertiary', '#8f8f8f', '#707070', 'Source URL breadcrumb', 'text'),
      t('Snippet Text', '--search-text-snippet', '--token-text-secondary', '#666666', '#a1a1a1', 'Result description', 'text'),
      t('Relevance BG', '--search-bg-relevance', '--token-tertiary-light', '#f3f5f0', '#181c15', 'Relevance badge surface', 'surface'),
      t('Relevance FG', '--search-text-relevance', '--token-tertiary', '#697459', '#8a9b77', 'Relevance score text', 'text'),
      t('Divider', '--search-border', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Between results', 'border'),
      t('Item Padding', '--search-spacing', '--token-space-4', '16px', '16px', 'Result card padding', 'spacing'),
    ] },
    { id: 'file-tree', label: 'File Tree', useCase: 'Recursive file/folder browser', tokenAdaptations: '--token-accent for selected file, indent using --token-space-4 per level', diffs: ['Expand/collapse chevrons', 'File/folder type icons', 'Indentation per depth', 'Selected file highlight'], tokens: [
      t('Container BG', '--filetree-bg', '--token-bg', '#ffffff', '#09090b', 'Tree panel surface', 'surface'),
      t('Selected BG', '--filetree-bg-selected', '--token-accent-muted', 'rgba(79,109,128,.12)', 'rgba(107,133,152,.12)', 'Selected file highlight', 'surface'),
      t('Selected Text', '--filetree-text-selected', '--token-accent', '#4f6d80', '#6b8598', 'Active file name', 'text'),
      t('File Name', '--filetree-text', '--token-text-secondary', '#666666', '#a1a1a1', 'Default file text', 'text'),
      t('Folder Name', '--filetree-text-folder', '--token-text-primary', '#0a0a0a', '#ededed', 'Folder name (bolder)', 'text'),
      t('Chevron Icon', '--filetree-text-chevron', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Expand/collapse arrow', 'text'),
      t('File Icon', '--filetree-text-icon', '--token-text-tertiary', '#8f8f8f', '#707070', 'File type icon color', 'text'),
      t('Indent Step', '--filetree-spacing-indent', '--token-space-4', '16px', '16px', 'Per-level indentation', 'spacing'),
      t('Row Padding', '--token-space-1-5 / -2', '6px / 8px', '6px / 8px', 'Row padding', 'spacing'),
      t('Row Radius', '--filetree-radius', '--token-radius-sm', '4px', '4px', 'Row hover radius', 'shape'),
    ] },
  ],
};

/* ——— New Real-World AI component token data ——— */
const realWorldTokens: Record<string, VariantInfo> = {
  'voice-transcription': { id: 'voice-transcription', label: 'Voice Transcription', useCase: 'Real-time voice-to-text (Wispr Flow, Otter.ai)', tokenAdaptations: '--token-error for recording, --token-accent for live segment', diffs: ['Recording waveform indicator', 'Speaker labels', 'Confidence badges', 'Live cursor'], tokens: [
    t('Card BG', '--vt-bg', '--token-bg', '#ffffff', '#09090b', 'Panel background', 'surface'),
    t('Recording BG', '--vt-bg-recording', '--token-error-light', 'rgba(229,72,77,.08)', 'rgba(229,72,77,.12)', 'Waveform strip', 'surface'),
    t('Active Segment', '--vt-bg-active', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Live segment highlight', 'surface'),
    t('Controls BG', '--vt-bg-controls', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Footer controls', 'surface'),
    t('Speaker', '--vt-text-speaker', '--token-accent', '#4f6d80', '#6b8598', 'Speaker name', 'text'),
    t('Timestamp', '--vt-text-time', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Segment timestamp', 'text'),
    t('Transcript', '--vt-text-body', '--token-text-primary', '#0a0a0a', '#ededed', 'Body text', 'text'),
    t('Waveform', '--vt-waveform', '--token-error', '#b54a4a', '#d47272', 'Waveform bars', 'surface'),
    t('Border', '--vt-border', '--token-border', '#eaeaea', '#27272a', 'Panel border', 'border'),
    t('Radius', '--vt-radius', '--token-radius-xl', '16px', '16px', 'Panel rounding', 'shape'),
    t('Motion', '--vt-motion', '--token-duration-fast', '120ms', '120ms', 'Transitions', 'motion'),
  ] },
  'meeting-notes': { id: 'meeting-notes', label: 'Meeting Notes', useCase: 'AI meeting summary (Granola, Fireflies)', tokenAdaptations: '--token-accent-muted for summary, --token-accent for checkbox', diffs: ['AI summary card', 'Topic tags', 'Action checkboxes', 'Participant avatars'], tokens: [
    t('Card BG', '--mn-bg', '--token-bg', '#ffffff', '#09090b', 'Panel background', 'surface'),
    t('Summary BG', '--mn-bg-summary', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'AI summary card', 'surface'),
    t('Summary Border', '--mn-border-summary', '--token-accent-light', '#dce3ea', '#131c22', 'Summary border', 'border'),
    t('Footer BG', '--mn-bg-footer', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Footer area', 'surface'),
    t('Section Label', '--mn-text-label', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Section headers', 'text'),
    t('Summary Text', '--mn-text-summary', '--token-text-secondary', '#666666', '#a1a1a1', 'Summary body', 'text'),
    t('Action Text', '--mn-text-action', '--token-text-primary', '#0a0a0a', '#ededed', 'Action item', 'text'),
    t('Checkbox', '--mn-checkbox', '--token-accent', '#4f6d80', '#6b8598', 'Checked state', 'surface'),
    t('Border', '--mn-border', '--token-border', '#eaeaea', '#27272a', 'Panel border', 'border'),
    t('Radius', '--mn-radius', '--token-radius-xl', '16px', '16px', 'Panel rounding', 'shape'),
    t('Motion', '--mn-motion', '--token-duration-fast', '120ms', '120ms', 'Transitions', 'motion'),
  ] },
  'ai-command-palette': { id: 'ai-command-palette', label: 'AI Command Palette', useCase: 'Slash command launcher (Raycast AI, Cursor)', tokenAdaptations: '--token-bg-hover for selected row, --token-shadow-xl for elevation', diffs: ['Keyboard navigation', 'Category grouping', 'Shortcut keys', 'Search filter'], tokens: [
    t('Panel BG', '--cp-bg', '--token-bg', '#ffffff', '#09090b', 'Palette background', 'surface'),
    t('Selected Row', '--cp-bg-selected', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Highlighted row', 'surface'),
    t('Icon Active', '--cp-bg-icon-active', '--token-accent-light', '#dce3ea', '#131c22', 'Active icon cell', 'surface'),
    t('Icon Default', '--cp-bg-icon', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Default icon cell', 'surface'),
    t('Footer BG', '--cp-bg-footer', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Hints footer', 'surface'),
    t('Label', '--cp-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Command name', 'text'),
    t('Description', '--cp-text-desc', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Command desc', 'text'),
    t('Accent Icon', '--cp-icon-active', '--token-accent', '#4f6d80', '#6b8598', 'Active icon', 'text'),
    t('Border', '--cp-border', '--token-border', '#eaeaea', '#27272a', 'Outer border', 'border'),
    t('Shadow', '--cp-shadow', '--token-shadow-xl', '0 20px 60px rgba(0,0,0,.15)', '0 20px 60px rgba(0,0,0,.5)', 'Elevation', 'shadow'),
    t('Radius', '--cp-radius', '--token-radius-xl', '16px', '16px', 'Panel rounding', 'shape'),
    t('Motion', '--cp-motion', '--token-duration-fast', '120ms', '120ms', 'Transitions', 'motion'),
  ] },
  'context-attachments': { id: 'context-attachments', label: 'Context Attachments', useCase: 'File context chips with token budget (Claude, Cursor)', tokenAdaptations: '--token-bg-secondary for chips, --token-warning for budget threshold', diffs: ['Type-colored icons', 'Token counts', 'Removable chips', 'Budget progress bar'], tokens: [
    t('Panel BG', '--ca-bg', '--token-bg', '#ffffff', '#09090b', 'Panel background', 'surface'),
    t('Chip BG', '--ca-bg-chip', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Chip background', 'surface'),
    t('Picker BG', '--ca-bg-picker', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Picker background', 'surface'),
    t('Chip Text', '--ca-text-chip', '--token-text-secondary', '#666666', '#a1a1a1', 'File name', 'text'),
    t('Token Count', '--ca-text-tokens', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Token count', 'text'),
    t('Remove Hover', '--ca-icon-remove-hover', '--token-error', '#b54a4a', '#d47272', 'Remove X hover', 'text'),
    t('Code Icon', '--ca-icon-code', '--token-accent', '#4f6d80', '#6b8598', 'Code file icon', 'text'),
    t('Budget Bar', '--ca-bar-normal', '--token-accent', '#4f6d80', '#6b8598', 'Normal budget fill', 'surface'),
    t('Budget Warn', '--ca-bar-warning', '--token-warning', '#9f8136', '#d4aa55', 'High budget fill', 'surface'),
    t('Chip Border', '--ca-border-chip', '--token-border', '#eaeaea', '#27272a', 'Chip border', 'border'),
    t('Panel Border', '--ca-border', '--token-border', '#eaeaea', '#27272a', 'Panel border', 'border'),
    t('Panel Radius', '--ca-radius', '--token-radius-xl', '16px', '16px', 'Panel rounding', 'shape'),
    t('Chip Radius', '--ca-radius-chip', '--token-radius-md', '8px', '8px', 'Chip rounding', 'shape'),
  ] },
  'conversation-fork': { id: 'conversation-fork', label: 'Conversation Fork', useCase: 'Branch conversations (Claude Projects, ChatGPT branches)', tokenAdaptations: '--token-accent-muted for active branch, --token-secondary for alt branch dots', diffs: ['Visual branch dots', 'Active highlight', 'Star toggle', 'Model labels'], tokens: [
    t('Panel BG', '--cf-bg', '--token-bg', '#ffffff', '#09090b', 'Panel background', 'surface'),
    t('Active Branch', '--cf-bg-active', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Active row highlight', 'surface'),
    t('Graph BG', '--cf-bg-graph', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Branch graph strip', 'surface'),
    t('Footer BG', '--cf-bg-footer', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Footer area', 'surface'),
    t('Icon Active', '--cf-bg-icon-active', '--token-accent-light', '#dce3ea', '#131c22', 'Active icon cell', 'surface'),
    t('Icon Default', '--cf-bg-icon', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Default icon cell', 'surface'),
    t('Label', '--cf-text-label', '--token-text-secondary', '#666666', '#a1a1a1', 'Branch name', 'text'),
    t('Preview', '--cf-text-preview', '--token-text-tertiary', '#8f8f8f', '#707070', 'Last message', 'text'),
    t('Meta', '--cf-text-meta', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Count, time', 'text'),
    t('Star', '--cf-star', '--token-secondary', '#8a6d3b', '#b29256', 'Starred indicator', 'text'),
    t('Main Dot', '--cf-dot-main', '--token-accent', '#4f6d80', '#6b8598', 'Main branch dot', 'surface'),
    t('Alt Dot', '--cf-dot-alt', '--token-secondary', '#8a6d3b', '#b29256', 'Alt branch dot', 'surface'),
    t('Border', '--cf-border', '--token-border', '#eaeaea', '#27272a', 'Panel border', 'border'),
    t('Radius', '--cf-radius', '--token-radius-xl', '16px', '16px', 'Panel rounding', 'shape'),
    t('Motion', '--cf-motion', '--token-duration-fast', '120ms', '120ms', 'Transitions', 'motion'),
  ] },
  'mobile-ai-chat': { id: 'mobile-ai-chat', label: 'Mobile AI Chat', useCase: 'Full mobile chat (ChatGPT mobile, Claude mobile, Gemini)', tokenAdaptations: '--token-accent for user bubble and send, mobile bottom nav', diffs: ['Header bar', 'Message bubbles', 'Bottom nav', 'FAB'], tokens: [
    t('Screen BG', '--mac-bg', '--token-bg', '#ffffff', '#09090b', 'Screen bg', 'surface'),
    t('Header BG', '--mac-bg-header', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Header', 'surface'),
    t('User Bubble', '--mac-bg-user', '--token-accent', '#4f6d80', '#6b8598', 'User message', 'surface'),
    t('AI Bubble', '--mac-bg-ai', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'AI message', 'surface'),
    t('Nav BG', '--mac-bg-nav', '--token-bg', '#ffffff', '#09090b', 'Bottom nav', 'surface'),
    t('User Text', '--mac-text-user', '--token-accent-fg', '#ffffff', '#ffffff', 'User text', 'text'),
    t('AI Text', '--mac-text-ai', '--token-text-primary', '#0a0a0a', '#ededed', 'AI text', 'text'),
    t('Nav Active', '--mac-nav-active', '--token-accent', '#4f6d80', '#6b8598', 'Active nav', 'text'),
    t('FAB BG', '--mac-fab', '--token-accent', '#4f6d80', '#6b8598', 'FAB bg', 'surface'),
    t('Nav Border', '--mac-border', '--token-border', '#eaeaea', '#27272a', 'Nav border', 'border'),
    t('Bubble Radius', '--mac-radius', '--token-radius-xl', '16px', '16px', 'Bubble rounding', 'shape'),
  ] },
  'quick-actions-sheet': { id: 'quick-actions-sheet', label: 'Quick Actions Sheet', useCase: 'Bottom sheet with AI actions (iOS Siri, Google Assistant)', tokenAdaptations: '--token-bg for sheet, --token-accent for actions', diffs: ['Drag handle', 'Segmented tabs', 'Prompt cards', 'Search bar'], tokens: [
    t('Sheet BG', '--qa-bg', '--token-bg', '#ffffff', '#09090b', 'Sheet bg', 'surface'),
    t('Handle', '--qa-handle', '--token-border-strong', '#d1d1d1', '#3f3f46', 'Drag handle', 'surface'),
    t('Card BG', '--qa-bg-card', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Card bg', 'surface'),
    t('Card Hover', '--qa-bg-hover', '--token-bg-hover', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', 'Card hover', 'surface'),
    t('Title', '--qa-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Title', 'text'),
    t('Desc', '--qa-text-desc', '--token-text-tertiary', '#8f8f8f', '#707070', 'Description', 'text'),
    t('Icon', '--qa-icon', '--token-accent', '#4f6d80', '#6b8598', 'Action icon', 'text'),
    t('Border', '--qa-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
    t('Sheet Radius', '--qa-radius', '--token-radius-xl', '16px', '16px', 'Sheet rounding', 'shape'),
    t('Card Radius', '--qa-radius-card', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
  ] },
  'mobile-agent-tasks': { id: 'mobile-agent-tasks', label: 'Mobile Agent Tasks', useCase: 'Agent monitoring (Devin AI, OpenAI Operator)', tokenAdaptations: '--token-success for done, --token-error for failed steps', diffs: ['Collapsible tasks', 'Step dots', 'Progress bars', 'Alerts'], tokens: [
    t('Screen BG', '--mat-bg', '--token-bg', '#ffffff', '#09090b', 'Screen bg', 'surface'),
    t('Task Card', '--mat-bg-card', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Card bg', 'surface'),
    t('Active Step', '--mat-bg-active', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Active step', 'surface'),
    t('Done Dot', '--mat-done', '--token-success', '#2d7a60', '#6aab8a', 'Done step', 'surface'),
    t('Active Dot', '--mat-active', '--token-accent', '#4f6d80', '#6b8598', 'Active step', 'surface'),
    t('Error Dot', '--mat-error', '--token-error', '#b54a4a', '#d47272', 'Failed step', 'surface'),
    t('Title', '--mat-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Task name', 'text'),
    t('Step', '--mat-text-step', '--token-text-secondary', '#666666', '#a1a1a1', 'Step label', 'text'),
    t('Progress', '--mat-progress', '--token-accent', '#4f6d80', '#6b8598', 'Progress fill', 'surface'),
    t('Border', '--mat-border', '--token-border', '#eaeaea', '#27272a', 'Card border', 'border'),
    t('Radius', '--mat-radius', '--token-radius-lg', '12px', '12px', 'Card rounding', 'shape'),
  ] },
  'mobile-smart-reply': { id: 'mobile-smart-reply', label: 'Mobile Smart Reply', useCase: 'AI smart replies (Gmail, iMessage, WhatsApp)', tokenAdaptations: '--token-accent for selected chip, streaming dots', diffs: ['Tone tabs', 'Reply chips', 'Streaming dots', 'Bottom sheet'], tokens: [
    t('Sheet BG', '--msr-bg', '--token-bg', '#ffffff', '#09090b', 'Sheet bg', 'surface'),
    t('Chip BG', '--msr-bg-chip', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Chip bg', 'surface'),
    t('Chip Active', '--msr-bg-active', '--token-accent', '#4f6d80', '#6b8598', 'Selected chip', 'surface'),
    t('Chip Text', '--msr-text', '--token-text-secondary', '#666666', '#a1a1a1', 'Reply text', 'text'),
    t('Active Text', '--msr-text-active', '--token-accent-fg', '#ffffff', '#ffffff', 'Selected text', 'text'),
    t('Streaming', '--msr-dots', '--token-accent', '#4f6d80', '#6b8598', 'Dots color', 'surface'),
    t('Chip Border', '--msr-border', '--token-border', '#eaeaea', '#27272a', 'Chip border', 'border'),
    t('Chip Radius', '--msr-radius', '--token-radius-full', '9999px', '9999px', 'Chip rounding', 'shape'),
    t('Motion', '--msr-motion', '--token-duration-fast', '120ms', '120ms', 'Transitions', 'motion'),
  ] },
  'mobile-search-ai': { id: 'mobile-search-ai', label: 'Mobile Search AI', useCase: 'Semantic AI search (Perplexity, Google AI overview)', tokenAdaptations: '--token-accent for AI overview, --token-info for confidence', diffs: ['AI overview card', 'Source cards', 'Filter chips', 'Bottom nav'], tokens: [
    t('Screen BG', '--msa-bg', '--token-bg', '#ffffff', '#09090b', 'Screen bg', 'surface'),
    t('Overview BG', '--msa-bg-overview', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Overview bg', 'surface'),
    t('Source Card', '--msa-bg-source', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Source card', 'surface'),
    t('Filter Active', '--msa-bg-filter', '--token-accent', '#4f6d80', '#6b8598', 'Active filter', 'surface'),
    t('Overview Border', '--msa-border-overview', '--token-accent-light', '#dce3ea', '#131c22', 'Overview border', 'border'),
    t('Title', '--msa-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Title', 'text'),
    t('Snippet', '--msa-text-snippet', '--token-text-secondary', '#666666', '#a1a1a1', 'Snippet', 'text'),
    t('Confidence', '--msa-text-conf', '--token-info', '#4f6d80', '#6b8598', 'Confidence', 'text'),
    t('Star', '--msa-star', '--token-secondary', '#8a6d3b', '#b29256', 'Rating', 'text'),
    t('Border', '--msa-border', '--token-border', '#eaeaea', '#27272a', 'Borders', 'border'),
    t('Radius', '--msa-radius', '--token-radius-lg', '12px', '12px', 'Rounding', 'shape'),
  ] },
  'mobile-notifications': { id: 'mobile-notifications', label: 'Mobile Notifications', useCase: 'Swipeable AI notifications (iOS, Android)', tokenAdaptations: '--token-accent for unread, --token-error for delete swipe', diffs: ['Swipeable rows', 'Read/unread dot', 'Segmented tabs', 'Pull refresh'], tokens: [
    t('Screen BG', '--mno-bg', '--token-bg', '#ffffff', '#09090b', 'Screen bg', 'surface'),
    t('Unread BG', '--mno-bg-unread', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Unread highlight', 'surface'),
    t('Delete', '--mno-bg-delete', '--token-error', '#b54a4a', '#d47272', 'Swipe delete', 'surface'),
    t('Archive', '--mno-bg-archive', '--token-accent', '#4f6d80', '#6b8598', 'Swipe archive', 'surface'),
    t('Title', '--mno-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Title', 'text'),
    t('Body', '--mno-text-body', '--token-text-secondary', '#666666', '#a1a1a1', 'Body', 'text'),
    t('Time', '--mno-text-time', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Time', 'text'),
    t('Unread Dot', '--mno-dot', '--token-accent', '#4f6d80', '#6b8598', 'Dot', 'surface'),
    t('Divider', '--mno-border', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Separator', 'border'),
    t('Radius', '--mno-radius', '--token-radius-lg', '12px', '12px', 'Rounding', 'shape'),
    t('Motion', '--mno-motion', '--token-duration-normal', '200ms', '200ms', 'Swipe anim', 'motion'),
  ] },
  'ai-usage-dashboard': { id: 'ai-usage-dashboard', label: 'AI Usage Dashboard', useCase: 'Token/cost monitoring (OpenAI, Anthropic billing)', tokenAdaptations: '--token-accent for primary model, multi-color bar segments', diffs: ['Stat cards', 'Color bar', 'Model breakdown', 'Period tabs'], tokens: [
    t('Panel BG', '--aud-bg', '--token-bg', '#ffffff', '#09090b', 'Dashboard bg', 'surface'),
    t('Stat Card', '--aud-bg-stat', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Stat card', 'surface'),
    t('Trend Up', '--aud-up', '--token-success', '#2d7a60', '#6aab8a', 'Positive', 'text'),
    t('Trend Down', '--aud-down', '--token-error', '#b54a4a', '#d47272', 'Negative', 'text'),
    t('Value', '--aud-text-value', '--token-text-primary', '#0a0a0a', '#ededed', 'Number', 'text'),
    t('Label', '--aud-text-label', '--token-text-tertiary', '#8f8f8f', '#707070', 'Label', 'text'),
    t('Bar 1', '--aud-bar-1', '--token-accent', '#4f6d80', '#6b8598', 'Primary', 'surface'),
    t('Bar 2', '--aud-bar-2', '--token-secondary', '#8a6d3b', '#b29256', 'Secondary', 'surface'),
    t('Bar 3', '--aud-bar-3', '--token-tertiary', '#697459', '#8a9b77', 'Tertiary', 'surface'),
    t('Warning', '--aud-warning', '--token-warning', '#9f8136', '#d4aa55', 'Budget warn', 'text'),
    t('Border', '--aud-border', '--token-border', '#eaeaea', '#27272a', 'Border', 'border'),
    t('Radius', '--aud-radius', '--token-radius-xl', '16px', '16px', 'Rounding', 'shape'),
  ] },
  'ai-context-panel': { id: 'ai-context-panel', label: 'AI Context Panel', useCase: 'Context window management (Claude, ChatGPT, Cursor)', tokenAdaptations: '--token-accent for active sources, --token-warning for capacity', diffs: ['Source toggles', 'Token bar', 'Capacity warning', 'Priority select'], tokens: [
    t('Panel BG', '--acp-bg', '--token-bg', '#ffffff', '#09090b', 'Panel bg', 'surface'),
    t('Header BG', '--acp-bg-header', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Header', 'surface'),
    t('Active', '--acp-bg-active', '--token-accent-muted', 'rgba(79,109,128,.08)', 'rgba(107,133,152,.12)', 'Active source', 'surface'),
    t('Bar', '--acp-bar', '--token-accent', '#4f6d80', '#6b8598', 'Usage fill', 'surface'),
    t('Bar Warn', '--acp-bar-warn', '--token-warning', '#9f8136', '#d4aa55', 'Near-limit', 'surface'),
    t('Track', '--acp-bar-track', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Bar track', 'surface'),
    t('Source', '--acp-text-source', '--token-text-primary', '#0a0a0a', '#ededed', 'Source name', 'text'),
    t('Tokens', '--acp-text-tokens', '--token-text-tertiary', '#8f8f8f', '#707070', 'Count', 'text'),
    t('Toggle', '--acp-toggle', '--token-accent', '#4f6d80', '#6b8598', 'Toggle on', 'surface'),
    t('Border', '--acp-border', '--token-border', '#eaeaea', '#27272a', 'Border', 'border'),
    t('Divider', '--acp-divider', '--token-border-subtle', '#f0f0f0', '#1c1c1f', 'Row divider', 'border'),
    t('Radius', '--acp-radius', '--token-radius-xl', '16px', '16px', 'Rounding', 'shape'),
  ] },
  'ai-onboarding': { id: 'ai-onboarding', label: 'AI Onboarding', useCase: 'Multi-step AI setup (ChatGPT, Claude, Notion AI)', tokenAdaptations: '--token-accent for active step, --token-success for completed', diffs: ['Step indicator', 'Interest chips', 'Privacy toggles', 'Transitions'], tokens: [
    t('Screen BG', '--aob-bg', '--token-bg', '#ffffff', '#09090b', 'Wizard bg', 'surface'),
    t('Card BG', '--aob-bg-card', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Card bg', 'surface'),
    t('Chip BG', '--aob-bg-chip', '--token-bg-tertiary', '#f5f5f5', '#18181b', 'Chip bg', 'surface'),
    t('Chip Active', '--aob-chip-active', '--token-accent', '#4f6d80', '#6b8598', 'Selected chip', 'surface'),
    t('Step Active', '--aob-step-active', '--token-accent', '#4f6d80', '#6b8598', 'Active step', 'surface'),
    t('Step Done', '--aob-step-done', '--token-success', '#2d7a60', '#6aab8a', 'Done step', 'surface'),
    t('Step Pending', '--aob-step-pending', '--token-text-disabled', '#c4c4c4', '#3b3b3b', 'Pending', 'surface'),
    t('Title', '--aob-text-title', '--token-text-primary', '#0a0a0a', '#ededed', 'Title', 'text'),
    t('Body', '--aob-text-body', '--token-text-secondary', '#666666', '#a1a1a1', 'Body', 'text'),
    t('Active Chip Text', '--aob-text-active', '--token-accent-fg', '#ffffff', '#ffffff', 'Active text', 'text'),
    t('Border', '--aob-border', '--token-border', '#eaeaea', '#27272a', 'Border', 'border'),
    t('Radius', '--aob-radius', '--token-radius-xl', '16px', '16px', 'Rounding', 'shape'),
    t('Chip Radius', '--aob-radius-chip', '--token-radius-full', '9999px', '9999px', 'Chip rounding', 'shape'),
    t('Motion', '--aob-motion', '--token-duration-normal', '200ms', '200ms', 'Transitions', 'motion'),
  ] },
};

/* ——————————————————————————————————————————
   Shared UI Components
   —————————————————————————————————————————— */

/* Visual token mapping — grouped by category with colored indicators */

/* ---- Helpers for per-row token isolation ---- */
/** Check if a token entry is a valid single CSS variable (starts with --token- and has no spaces/slashes) */
function isValidCSSVar(t: TokenLayer): boolean {
  return t.token.startsWith('--token-') && !/[\s/]/.test(t.token);
}

/** Filter token list:
 *  1. Valid CSS variables only (starts with --token-, no spaces/slashes)
 *  2. Remove non-color tokens from color categories (font, size, weight tokens in surface/text/border)
 *     — these can't be visually isolated and cause confusing 15%-dim-only behavior
 *  3. Deduplicate by CSS variable name (keep last = most specific) */
function filterValidTokens(tokens: TokenLayer[]): TokenLayer[] {
  const valid = tokens.filter(t => {
    if (!isValidCSSVar(t)) return false;
    // Remove non-color tokens from color categories (font-mono, text-sm, weight-semibold, leading-normal etc.)
    const isColorCat = ['surface', 'text', 'border'].includes(t.category);
    if (isColorCat && !isTokenColorBased(t)) return false;
    return true;
  });
  // Deduplicate: if multiple entries share the same CSS variable, keep the LAST one
  const lastIdx = new Map<string, number>();
  valid.forEach((t, i) => lastIdx.set(t.token, i));
  // Auto-fill missing L4/L2 fields and deduplicate
  return valid.filter((t, i) => lastIdx.get(t.token) === i).map(t => ({
    ...t,
    compToken: t.compToken || t.token,
    primitive: t.primitive || getPrimitive(t.token),
  }));
}

/** Check whether a token's value represents a visual color (not font/size/weight/etc.) */
function isTokenColorBased(t: TokenLayer): boolean {
  return isColorValue(t.lightVal) || isColorValue(t.darkVal);
}

function isColorValue(v: string): boolean {
  const s = v.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(s) || /^rgba?\(/.test(s) || /^hsla?\(/.test(s) || s === 'transparent';
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function colorToFaded(val: string, alpha: number): string {
  const s = val.trim();
  if (s === 'transparent') return 'transparent';
  if (s.startsWith('#')) return hexToRgba(s, alpha);
  const rgbaMatch = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (rgbaMatch) return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${alpha})`;
  return s;
}

/* Master token map — ALL color CSS variables from tokens.css (light + dark).
   Ensures any token used by a preview component gets faded even if it
   is not in the component's explicit TokenLayer[] array. */
const MCT: Record<string, [string, string]> = {
  '--token-bg':['#ffffff','#09090b'],'--token-bg-secondary':['#fafafa','#111113'],
  '--token-bg-tertiary':['#f5f5f5','#18181b'],'--token-bg-hover':['rgba(0,0,0,0.04)','rgba(255,255,255,0.05)'],
  '--token-bg-active':['rgba(0,0,0,0.06)','rgba(255,255,255,0.08)'],'--token-bg-code':['#f4f4f5','#141416'],
  '--token-bg-inset':['#f0f0f0','#0e0e10'],'--token-bg-overlay':['rgba(0,0,0,0.5)','rgba(0,0,0,0.7)'],
  '--token-text-primary':['#0a0a0a','#ededed'],'--token-text-secondary':['#666666','#a1a1a1'],
  '--token-text-tertiary':['#8f8f8f','#707070'],'--token-text-disabled':['#c4c4c4','#3b3b3b'],
  '--token-text-inverse':['#ffffff','#09090b'],'--token-text-code':['#24292e','#e5e5e5'],
  '--token-border':['#eaeaea','#27272a'],'--token-border-strong':['#d1d1d1','#3f3f46'],
  '--token-border-subtle':['#f0f0f0','#1c1c1f'],
  '--token-accent':['#4f6d80','#6b8598'],'--token-accent-hover':['#405a6a','#8ea3b4'],
  '--token-accent-light':['#dce3ea','#131c22'],'--token-accent-fg':['#ffffff','#ffffff'],
  '--token-accent-muted':['rgba(79,109,128,0.12)','rgba(107,133,152,0.12)'],
  '--token-secondary':['#8a6d3b','#b29256'],'--token-secondary-hover':['#725a30','#c7ac78'],
  '--token-secondary-light':['#f8f5ed','#211a10'],'--token-secondary-fg':['#ffffff','#ffffff'],
  '--token-tertiary':['#697459','#8a9b77'],'--token-tertiary-hover':['#555f48','#a9b597'],
  '--token-tertiary-light':['#f3f5f0','#181c15'],'--token-tertiary-fg':['#ffffff','#ffffff'],
  '--token-success':['#2d7a60','#6aab8a'],'--token-success-light':['#d2e8dc','#0e211a'],
  '--token-error':['#b54a4a','#d47272'],'--token-error-light':['#f0d8d8','#2a1111'],
  '--token-warning':['#9f8136','#d4aa55'],'--token-warning-light':['#ede3c7','#241e0d'],
  '--token-info':['#4f6d80','#6b8598'],'--token-info-light':['#dce3ea','#131c22'],
  '--token-user-bubble':['#0a0a0a','#ededed'],'--token-user-bubble-text':['#ffffff','#09090b'],
  '--token-ai-bubble':['transparent','transparent'],'--token-ai-bubble-text':['#0a0a0a','#ededed'],
  '--token-ai-avatar-bg':['#4f6d80','#6b8598'],'--token-ai-avatar-fg':['#ffffff','#09090b'],
  '--token-code-header':['#f0f0f0','#1c1c1f'],'--token-code-bg':['#fafafa','#111113'],
  '--token-code-text':['#24292e','#e5e5e5'],'--token-code-keyword':['#d73a49','#ff7b72'],
  '--token-code-string':['#032f62','#a5d6ff'],'--token-code-comment':['#6a737d','#8b949e'],
  '--token-code-function':['#4f6d80','#8ea3b4'],'--token-code-number':['#005cc5','#79c0ff'],
  '--token-voice-bar':['#0a0a0a','#ededed'],'--token-voice-bar-active':['#4f6d80','#6b8598'],
  '--token-voice-bg':['#f5f5f5','#18181b'],'--token-voice-progress':['#4f6d80','#6b8598'],
  '--token-voice-track':['#e5e5e5','#2a2a2e'],
  '--token-insight-bg':['#fafafa','#111113'],'--token-insight-border':['#eaeaea','#27272a'],
  '--token-confidence-high':['#2d7a60','#6aab8a'],'--token-confidence-medium':['#9f8136','#d4aa55'],
  '--token-confidence-low':['#b54a4a','#d47272'],
  '--token-step-done':['#697459','#8a9b77'],'--token-step-active':['#4f6d80','#6b8598'],
  '--token-step-pending':['#d1d1d1','#3f3f46'],'--token-step-line':['#eaeaea','#27272a'],
  '--token-image-placeholder':['#f0f0f0','#1c1c1f'],'--token-image-overlay':['rgba(0,0,0,0.5)','rgba(0,0,0,0.6)'],
  '--token-image-selected-ring':['#4f6d80','#6b8598'],
};

/** Build CSS variable overrides: fade ALL known color tokens to 0% opacity
 *  EXCEPT the hovered token, which stays at full value.
 *  Uses MCT (master color tokens) so even unlisted tokens get faded. */
function buildTokenOverrides(_allTokens: TokenLayer[], hoveredToken: TokenLayer, useDark: boolean): Record<string, string> {
  const overrides: Record<string, string> = {};
  const hv = hoveredToken.token;

  // Fade every known color token except the hovered one
  for (const [v, pair] of Object.entries(MCT)) {
    if (v === hv) continue;
    overrides[v] = colorToFaded(useDark ? pair[1] : pair[0], 0);
  }

  // Also fade component-specific tokens not in MCT
  for (const t of _allTokens) {
    if (t.token === hv || overrides[t.token] !== undefined) continue;
    const val = useDark ? t.darkVal : t.lightVal;
    if (isColorValue(val)) overrides[t.token] = colorToFaded(val, 0);
  }

  return overrides;
}

function TokenMapping({ tokens, hoveredRowIdx, onHoverRow, previewTheme }: { tokens: TokenLayer[]; hoveredRowIdx?: number | null; onHoverRow?: (idx: number | null) => void; previewTheme?: PreviewTheme }) {
  const isLightPreview = previewTheme === 'light';
  const grouped: { cat: string; items: { token: TokenLayer; globalIdx: number }[] }[] = [];
  const order: (keyof typeof catMeta)[] = ['surface', 'text', 'border', 'spacing', 'shape', 'shadow', 'motion'];
  const catMap: Record<string, { token: TokenLayer; globalIdx: number }[]> = {};
  tokens.forEach((t, idx) => {
    (catMap[t.category] = catMap[t.category] || []).push({ token: t, globalIdx: idx });
  });
  for (const cat of order) {
    if (catMap[cat]) grouped.push({ cat, items: catMap[cat] });
  }

  return (
    <div className="flex flex-col" style={{ gap: 0 }} onMouseLeave={() => onHoverRow?.(null)}>
      {grouped.map(({ cat, items }) => {
        const meta = catMeta[cat];
        return (
          <div key={cat}>
            {/* Category section header — matching gallery-row style */}
            <div
              className="flex items-center"
              style={{
                gap: 'var(--token-space-2-5)',
                padding: 'var(--token-space-2-5) var(--token-space-4)',
                borderBottom: '1px solid var(--token-border)',
                background: 'var(--token-bg-secondary)',
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: 'var(--token-radius-full)',
                background: meta.dot, display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{
                fontSize: 'var(--token-text-2xs)', fontWeight: 600,
                fontFamily: 'var(--token-font-mono)', color: meta.color,
                textTransform: 'uppercase' as const, letterSpacing: '0.06em',
              }}>{meta.label}</span>
              <span style={{
                fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                color: meta.color, background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '15px',
              }}>{items.length}</span>
            </div>
            {/* Token rows */}
            <div style={{ background: 'var(--token-bg)', borderBottom: '1px solid var(--token-border)' }}>
              {items.map(({ token: tk, globalIdx }, i) => {
                const isActive = hoveredRowIdx === globalIdx;
                const lClr = isColorValue(tk.lightVal);
                const dClr = isColorValue(tk.darkVal);
                const hasL4 = !!tk.compToken && tk.compToken !== tk.token;
                const hasL2 = !!tk.primitive;
                return (
                  <div
                    key={globalIdx}
                    onMouseEnter={() => onHoverRow?.(globalIdx)}
                    className="cursor-pointer"
                    style={{
                      padding: '8px 14px',
                      borderBottom: i < items.length - 1 ? '1px solid var(--token-border-subtle)' : 'none',
                      background: isActive ? `color-mix(in srgb, ${meta.color} 5%, var(--token-bg))` : 'transparent',
                      transition: 'background 100ms',
                    }}
                  >
                    {/* Row 1: Layer name + swatches */}
                    <div className="flex items-start flex-wrap" style={{ gap: 6, marginBottom: 4 }}>
                      <div className="flex items-center" style={{ gap: 6, flex: '1 1 auto', minWidth: 0 }}>
                        <span style={{
                          width: 3, height: 3, borderRadius: 'var(--token-radius-full)',
                          background: isActive ? meta.color : 'var(--token-text-disabled)',
                          flexShrink: 0, opacity: isActive ? 1 : 0.3, transition: 'all 100ms',
                          marginTop: 5,
                        }} />
                        <span style={{
                          fontSize: 'var(--token-text-xs)',
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                          transition: 'color 100ms',
                        }}>
                          {tk.layer}
                        </span>
                      </div>
                      {/* L1 raw value swatches — active theme highlighted */}
                      <div className="flex items-center flex-wrap" style={{ gap: 6, flexShrink: 0 }}>
                        <span className="inline-flex items-center" style={{ gap: 4, fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: isLightPreview ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120, opacity: isLightPreview ? 1 : 0.5, transition: 'all 150ms' }}>
                          {lClr && <span style={{ width: 10, height: 10, borderRadius: 3, background: tk.lightVal, border: isLightPreview ? '1.5px solid var(--token-accent)' : '1px solid var(--token-border)', flexShrink: 0, boxShadow: isLightPreview && isActive ? `0 0 0 2px color-mix(in srgb, ${meta.color} 25%, transparent)` : 'none', transition: 'all 150ms' }} />}
                          {tk.lightVal}
                        </span>
                        <span className="inline-flex items-center" style={{ gap: 4, fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: !isLightPreview ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120, opacity: !isLightPreview ? 1 : 0.5, transition: 'all 150ms' }}>
                          {dClr && <span style={{ width: 10, height: 10, borderRadius: 3, background: tk.darkVal, border: !isLightPreview ? '1.5px solid var(--token-accent)' : '1px solid var(--token-border-strong)', flexShrink: 0, boxShadow: !isLightPreview && isActive ? `0 0 0 2px color-mix(in srgb, ${meta.color} 25%, transparent)` : 'none', transition: 'all 150ms' }} />}
                          {tk.darkVal}
                        </span>
                      </div>
                    </div>
                    {/* Row 2: Token chain — arrows show hierarchy, wraps on mobile */}
                    <div className="flex items-center flex-wrap" style={{ gap: 4, paddingLeft: 11 }}>
                      {hasL4 && (<div className="flex items-center" style={{ display: 'inline-flex', gap: 0 }}>
                        <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: isActive ? meta.color : 'var(--token-text-disabled)', whiteSpace: 'nowrap', transition: 'color 100ms' }}>{tk.compToken}</code>
                        <span style={{ fontSize: 9, color: 'var(--token-text-disabled)', margin: '0 1px' }}>→</span>
                      </div>)}
                      <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: isActive ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)', whiteSpace: 'nowrap', transition: 'color 100ms' }}>{tk.token}</code>
                      {hasL2 && (<div className="flex items-center" style={{ display: 'inline-flex', gap: 0 }}>
                        <span style={{ fontSize: 9, color: 'var(--token-text-disabled)', margin: '0 1px' }}>→</span>
                        <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', whiteSpace: 'nowrap' }}>{tk.primitive}</code>
                      </div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ——————————————————————————————————————————
   Structural overlay system for spacing / shape / shadow
   —————————————————————————————————————————— */

/* Measurement data collected from the live DOM */
interface MRect { x: number; y: number; w: number; h: number; br: number; shadow: string; pad: [number,number,number,number]; gap: number; dir: string; kids: MRect[]; }

function parsePx(v: string): number { const m = v.match(/([\d.]+)\s*px/); return m ? parseFloat(m[1]) : 0; }

/** Recursively measure an element and its children (max 3 levels) */
function measureEl(el: HTMLElement, origin: DOMRect, depth: number): MRect | null {
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return null;
  const cs = getComputedStyle(el);
  const result: MRect = {
    x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height,
    br: parseFloat(cs.borderRadius) || 0,
    shadow: cs.boxShadow || 'none',
    pad: [parseFloat(cs.paddingTop)||0, parseFloat(cs.paddingRight)||0, parseFloat(cs.paddingBottom)||0, parseFloat(cs.paddingLeft)||0],
    gap: parseFloat(cs.gap) || 0,
    dir: cs.flexDirection || 'row',
    kids: [],
  };
  if (depth < 5) {
    for (const c of Array.from(el.children) as HTMLElement[]) {
      const m = measureEl(c, origin, depth + 1);
      if (m) result.kids.push(m);
    }
  }
  return result;
}

/* ——— Spacing overlay ——— */
function SpacingBar({ x, y, w, h, value, color, horizontal }: { x: number; y: number; w: number; h: number; value: number; color: string; horizontal: boolean }) {
  if (w < 1 || h < 1) return null;
  const sz = horizontal ? h : w;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, pointerEvents: 'none' }}>
      {/* Hatched fill */}
      <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(${horizontal ? '90deg' : '0deg'}, ${color}33 0px, ${color}33 1px, transparent 1px, transparent 3px)`, borderRadius: 1 }}/>
      {/* Edge lines */}
      {horizontal ? (<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.6 }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.6 }}/>
      </div>) : (<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: color, opacity: 0.6 }}/>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, background: color, opacity: 0.6 }}/>
      </div>)}
      {/* Value label — show if bar is large enough */}
      {sz >= 8 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--token-text-inverse)', background: color, padding: '0px 4px', borderRadius: 3, lineHeight: '14px', whiteSpace: 'nowrap', boxShadow: `0 1px 4px ${color}44` }}>{Math.round(value)}</span>
        </div>
      )}
    </div>
  );
}

function collectSpacingBars(el: MRect, color: string, targetPx: number, out: JSX.Element[], prefix: string) {
  const { x, y, w, h, pad, dir, kids } = el;
  const isCol = dir.startsWith('column');
  const match = (v: number) => targetPx > 0 && Math.abs(v - targetPx) < 1.5;

  // 1) Padding — ONLY show bars that match the hovered token value
  const [pt, pr, pb, pl] = pad;
  if (pt >= 2 && match(pt)) out.push(<SpacingBar key={`${prefix}-pt`} x={x + pl} y={y} w={w - pl - pr} h={pt} value={pt} color={color} horizontal={true}/>);
  if (pb >= 2 && match(pb)) out.push(<SpacingBar key={`${prefix}-pb`} x={x + pl} y={y + h - pb} w={w - pl - pr} h={pb} value={pb} color={color} horizontal={true}/>);
  if (pl >= 2 && match(pl)) out.push(<SpacingBar key={`${prefix}-pl`} x={x} y={y + pt} w={pl} h={h - pt - pb} value={pl} color={color} horizontal={false}/>);
  if (pr >= 2 && match(pr)) out.push(<SpacingBar key={`${prefix}-pr`} x={x + w - pr} y={y + pt} w={pr} h={h - pt - pb} value={pr} color={color} horizontal={false}/>);

  // 2) Gaps between children — ONLY show gaps that match
  if (kids.length > 1) {
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i]; const b = kids[i + 1];
      if (isCol) {
        const gapH = b.y - (a.y + a.h);
        if (gapH >= 2 && match(gapH)) {
          const gx = Math.min(a.x, b.x); const gw = Math.max(a.x + a.w, b.x + b.w) - gx;
          out.push(<SpacingBar key={`${prefix}-g${i}`} x={gx} y={a.y + a.h} w={gw} h={gapH} value={gapH} color={color} horizontal={true}/>);
        }
      } else {
        const gapW = b.x - (a.x + a.w);
        if (gapW >= 2 && match(gapW)) {
          const gy = Math.min(a.y, b.y); const gh = Math.max(a.y + a.h, b.y + b.h) - gy;
          out.push(<SpacingBar key={`${prefix}-g${i}`} x={a.x + a.w} y={gy} w={gapW} h={gh} value={gapW} color={color} horizontal={false}/>);
        }
      }
    }
  }

  // Recurse into children
  kids.forEach((k, i) => collectSpacingBars(k, color, targetPx, out, `${prefix}-c${i}`));
}

function SpacingOverlay({ root, token, color }: { root: MRect; token: TokenLayer; color: string }) {
  const targetPx = parsePx(token.lightVal);
  const bars: JSX.Element[] = [];

  // Subtle root outline for context
  bars.push(<div key="root-outline" style={{ position: 'absolute', left: root.x, top: root.y, width: root.w, height: root.h, border: `1px dashed ${color}22`, borderRadius: root.br, pointerEvents: 'none' }}/>);

  collectSpacingBars(root, color, targetPx, bars, 'r');
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{bars}</div>;
}

/* ——— Shape (border-radius) overlay ——— */
function collectRadiusArcs(el: MRect, color: string, targetR: number, paths: string[], labels: JSX.Element[], prefix: string) {
  const { x, y, w, h, br } = el;
  if (br > 0) {
    const r = Math.min(br, w / 2, h / 2);
    // For radius-full (9999px), match any element where br >= 50% of min dimension (fully rounded)
    const isFullRadius = targetR >= 9999;
    const isMatch = isFullRadius
      ? br >= Math.min(w, h) / 2 - 1
      : targetR > 0 && Math.abs(r - targetR) < 1.5;

    // ONLY render arcs for elements whose radius matches the hovered token
    if (isMatch) {
      // Four corner arcs (SVG arc commands)
      paths.push(`<path d="M ${x},${y + r} A ${r},${r} 0 0 1 ${x + r},${y}" stroke="${color}" stroke-width="2.5" fill="none"/>`);
      paths.push(`<path d="M ${x + w - r},${y} A ${r},${r} 0 0 1 ${x + w},${y + r}" stroke="${color}" stroke-width="2.5" fill="none"/>`);
      paths.push(`<path d="M ${x + w},${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h}" stroke="${color}" stroke-width="2.5" fill="none"/>`);
      paths.push(`<path d="M ${x + r},${y + h} A ${r},${r} 0 0 1 ${x},${y + h - r}" stroke="${color}" stroke-width="2.5" fill="none"/>`);

      // Radius measurement lines from corner to arc center
      if (r > 6) {
        const lineOpacity = 0.4;
        paths.push(`<line x1="${x}" y1="${y}" x2="${x + r}" y2="${y}" stroke="${color}" stroke-width="1" stroke-dasharray="2 2" opacity="${lineOpacity}"/>`);
        paths.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y + r}" stroke="${color}" stroke-width="1" stroke-dasharray="2 2" opacity="${lineOpacity}"/>`);

        labels.push(
          <div key={`${prefix}-lbl`} style={{ position: 'absolute', left: x + r / 2 - 8, top: y + r / 2 - 7, pointerEvents: 'none' }}>
            <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--token-text-inverse)', background: color, padding: '0 4px', borderRadius: 3, lineHeight: '14px', whiteSpace: 'nowrap', boxShadow: `0 1px 4px ${color}44` }}>{Math.round(r)}</span>
          </div>
        );
      }

      // Outline the matching element
      paths.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" stroke="${color}" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity="0.3"/>`);
    }
  }

  el.kids.forEach((k, i) => collectRadiusArcs(k, color, targetR, paths, labels, `${prefix}-${i}`));
}

function ShapeOverlay({ root, token, color }: { root: MRect; token: TokenLayer; color: string }) {
  const targetR = parsePx(token.lightVal);
  const paths: string[] = [];
  const labels: JSX.Element[] = [];
  collectRadiusArcs(root, color, targetR, paths, labels, 's');

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }} dangerouslySetInnerHTML={{ __html: paths.join('') }}/>
      {labels}
    </div>
  );
}

/* ——— Shadow (elevation) overlay ——— */
function collectShadowElements(el: MRect, color: string, out: JSX.Element[], prefix: string) {
  if (el.shadow && el.shadow !== 'none') {
    const { x, y, w, h, br } = el;
    const r = Math.min(br, w / 2, h / 2);
    // Parse shadow for blur radius (rough extraction)
    const parts = el.shadow.match(/([\d.]+)px/g);
    const blurPx = parts && parts.length >= 3 ? parseFloat(parts[2]) : 8;
    const spreadCount = Math.min(Math.max(Math.ceil(blurPx / 4), 2), 5);

    // Concentric spread rings
    for (let ring = spreadCount; ring >= 1; ring--) {
      const offset = ring * 4;
      out.push(
        <div key={`${prefix}-ring-${ring}`} style={{
          position: 'absolute',
          left: x - offset, top: y - offset,
          width: w + offset * 2, height: h + offset * 2,
          borderRadius: r + offset,
          border: `1px solid ${color}`,
          opacity: 0.12 + (spreadCount - ring) * 0.06,
          pointerEvents: 'none',
        }}/>
      );
    }

    // Main element outline with glow
    out.push(
      <div key={`${prefix}-main`} style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        borderRadius: r,
        border: `2px solid ${color}`,
        boxShadow: `0 0 ${blurPx * 2}px ${color}55, inset 0 0 ${blurPx}px ${color}11`,
        pointerEvents: 'none',
        animation: 'token-shadow-pulse 2s ease-in-out infinite',
      }}/>
    );

    // Shadow direction indicator (offset arrow) — small arrow below the element showing offset-y
    const offsetY = parts && parts.length >= 2 ? parseFloat(parts[1]) : 2;
    if (offsetY > 0) {
      out.push(
        <div key={`${prefix}-arrow`} style={{
          position: 'absolute', left: x + w / 2 - 16, top: y + h + 6,
          display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.6 }}>
            <path d="M5 0 L5 8 M2 5 L5 8 L8 5" stroke={color} strokeWidth="1.5" fill="none"/>
          </svg>
          <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--token-text-inverse)', background: color, padding: '0 4px', borderRadius: 3, lineHeight: '14px', whiteSpace: 'nowrap' }}>
            {Math.round(blurPx)}px blur
          </span>
        </div>
      );
    }
  }

  el.kids.forEach((k, i) => collectShadowElements(k, color, out, `${prefix}-${i}`));
}

function ShadowOverlay({ root, token, color }: { root: MRect; token: TokenLayer; color: string }) {
  const elements: JSX.Element[] = [];
  collectShadowElements(root, color, elements, 'sh');

  // If no shadow found on any element, show a generic indicator on the root
  if (elements.length === 0) {
    const { x, y, w, h, br } = root;
    elements.push(
      <div key="sh-fallback" style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        borderRadius: Math.min(br, w / 2, h / 2),
        border: `2px dashed ${color}66`,
        boxShadow: `0 4px 16px ${color}33`,
        pointerEvents: 'none',
      }}/>
    );
  }

  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{elements}</div>;
}

/* ——— Motion overlay ——— */
function MotionOverlay({ root, token, color }: { root: MRect; token: TokenLayer; color: string }) {
  const durationMs = parseFloat(token.lightVal) || 200;
  const { x, y, w, h, br } = root;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        borderRadius: Math.min(br, w / 2, h / 2),
        border: `2px solid ${color}`,
        pointerEvents: 'none',
        animation: `token-motion-ping ${durationMs}ms ease-in-out infinite alternate`,
      }}/>
      <div style={{
        position: 'absolute', left: x + w / 2 - 28, top: y + h + 8,
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--token-text-inverse)', background: color, padding: '1px 6px', borderRadius: 3, lineHeight: '14px', whiteSpace: 'nowrap' }}>
          {token.lightVal}
        </span>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   PreviewContentArea — renders preview + overlays
   Extracted as a proper component so we can use hooks (ref / layoutEffect)
   —————————————————————————————————————————— */
function PreviewContentArea({ children, themeClass, hoveredRow, allTokens }: { children: React.ReactNode; themeClass?: string; hoveredRow?: TokenLayer | null; allTokens?: TokenLayer[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<MRect | null>(null);

  const cat = hoveredRow?.category;
  // If token is in a "color" category but its value isn't a color (e.g. font-mono, text-sm), treat as structural
  const nominallyColor = !!cat && ['surface', 'text', 'border'].includes(cat);
  const isColorCat = nominallyColor && !!hoveredRow && isTokenColorBased(hoveredRow);
  const isStructural = !!cat && (['spacing', 'shape', 'shadow', 'motion'].includes(cat) || (nominallyColor && !isColorCat));

  // Color overrides for surface / text / border categories
  let overrideStyle: Record<string, string> = {};
  if (isColorCat && hoveredRow && allTokens && allTokens.length > 0) {
    const useDark = themeClass === 'theme-scope-dark';
    overrideStyle = buildTokenOverrides(allTokens, hoveredRow, useDark);
  }

  // DOM measurement for structural categories — sync in useLayoutEffect
  useLayoutEffect(() => {
    if (!isStructural || !containerRef.current) { setMeasured(null); return; }
    const container = containerRef.current;
    const origin = container.getBoundingClientRect();
    const themeDiv = container.firstElementChild as HTMLElement | null;
    const wrapperDiv = themeDiv?.firstElementChild as HTMLElement | null;
    const componentRoot = wrapperDiv?.firstElementChild as HTMLElement | null;
    if (!componentRoot) { setMeasured(null); return; }
    setMeasured(measureEl(componentRoot, origin, 0));
  }, [isStructural, hoveredRow?.token, hoveredRow?.layer]);

  const meta = hoveredRow ? catMeta[hoveredRow.category] : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: 1, overflow: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column' }}>
      <div className={themeClass} style={{ padding: 'var(--token-space-6)', background: 'var(--token-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 120, ...(isColorCat ? overrideStyle : {}) } as React.CSSProperties}>
        <div style={{ width: '100%', maxWidth: 500, position: 'relative', opacity: isStructural ? 0.15 : 1, transition: 'opacity 200ms ease', display: 'flex', justifyContent: 'center' }}>{children}</div>
      </div>

      {/* Structural overlays */}
      {isStructural && measured && hoveredRow && meta && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {cat === 'spacing' && <SpacingOverlay root={measured} token={hoveredRow} color={meta.color}/>}
          {cat === 'shape' && <ShapeOverlay root={measured} token={hoveredRow} color={meta.color}/>}
          {cat === 'shadow' && <ShadowOverlay root={measured} token={hoveredRow} color={meta.color}/>}
          {cat === 'motion' && <MotionOverlay root={measured} token={hoveredRow} color={meta.color}/>}
        </div>
      )}

      {/* Floating label badge */}
      {hoveredRow && meta && (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none', zIndex: 10 }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-inverse)', background: meta.color, padding: '3px 10px', borderRadius: 'var(--token-radius-full)', boxShadow: `0 2px 8px color-mix(in srgb, ${meta.color} 30%, transparent)`, whiteSpace: 'nowrap' }}>
            {hoveredRow.layer}
          </span>
        </div>
      )}
    </div>
  );
}

/* Live preview panel with theme toggle (light ↔ dark) */
type PreviewTheme = 'light' | 'dark';

function usePageTheme(): PreviewTheme {
  const detect = useCallback(() => {
    if (typeof document === 'undefined') return 'light' as PreviewTheme;
    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return (isDark ? 'dark' : 'light') as PreviewTheme;
  }, []);
  return detect();
}

function PreviewPanel({ children, hoveredRow, allTokens, previewTheme, onToggleTheme }: { children: React.ReactNode; hoveredRow?: TokenLayer | null; allTokens?: TokenLayer[]; previewTheme: PreviewTheme; onToggleTheme: () => void }) {
  const isDark = previewTheme === 'dark';
  const themeClass = isDark ? 'theme-scope-dark' : 'theme-scope-light';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative' }}>
      {/* Top bar — theme toggle at top-right */}
      <div className="flex items-center justify-end" style={{ flexShrink: 0, padding: 'var(--token-space-2) var(--token-space-3)', minHeight: 32 }}>
        <button
          onClick={onToggleTheme}
          className="flex items-center cursor-pointer"
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          style={{
            border: '1px solid var(--token-border)',
            borderRadius: 'var(--token-radius-full)',
            padding: 0,
            background: isDark ? 'var(--token-bg-tertiary)' : 'var(--token-bg)',
            flexShrink: 0,
            position: 'relative',
            width: 44,
            height: 22,
            transition: 'background 150ms ease',
            cursor: 'pointer',
          }}
        >
          {/* Track icons */}
          <div className="flex items-center justify-between" style={{ position: 'absolute', inset: '0 5px', zIndex: 1, pointerEvents: 'none' }}>
            <Sun size={10} style={{ color: isDark ? 'var(--token-text-disabled)' : 'var(--token-accent)', transition: 'color 150ms' }} />
            <Moon size={10} style={{ color: isDark ? 'var(--token-accent)' : 'var(--token-text-disabled)', transition: 'color 150ms' }} />
          </div>
          {/* Sliding thumb */}
          <div style={{
            position: 'absolute',
            top: 2,
            left: isDark ? 22 : 2,
            width: 18,
            height: 16,
            borderRadius: 'var(--token-radius-full)',
            background: isDark ? 'var(--token-accent-muted)' : 'var(--token-accent-muted)',
            border: '1px solid var(--token-accent)',
            transition: 'left 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2,
          }} />
        </button>
      </div>

      {/* Preview content — fills remaining space */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PreviewContentArea themeClass={themeClass} hoveredRow={hoveredRow} allTokens={allTokens}>{children}</PreviewContentArea>
      </div>
    </div>
  );
}

/* Composition chip */
function CompositionChips({ items, type }: { items: string[]; type: 'atom' | 'molecule' }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {items.map(item => {
        const aId = atomsData.find(a => a.name === item)?.id;
        const mId = moleculesData.find(m => m.name === item)?.id;
        const linkType = aId ? 'atom' : mId ? 'molecule' : null;
        const linkId = aId || mId;
        const isAtom = !!aId;
        const chip = (
          <span style={{
            padding: '2px 10px', borderRadius: 'var(--token-radius-full)',
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            background: isAtom ? 'var(--token-accent-muted)' : 'var(--token-secondary-light)',
            color: isAtom ? 'var(--token-accent)' : 'var(--token-secondary)',
          }}>
            {item}
          </span>
        );
        return linkType && linkId ? (
          <Link key={item} to={`/design-system/${linkType}/${linkId}`} style={{ textDecoration: 'none' }}>{chip}</Link>
        ) : <span key={item}>{chip}</span>;
      })}
    </div>
  );
}

/* ——————————————————————————————————————————
   MAIN PAGE
   —————————————————————————————————————————— */
export function DSDetailPage() {
  const { type: rawType, id } = useParams<{ type: string; id: string }>();
  /* When accessed via /component/:id, rawType is undefined — default to 'component' */
  const type = rawType || 'component';
  /* Track whether we came from the gallery homepage (/component/:id) vs design-system */
  const isGalleryRoute = !rawType;
  const [activeVariant, setActiveVariant] = useState(0);
  const [hoveredRowIdx, setHoveredRowIdx] = useState<number | null>(null);
  const [activeState, setActiveState] = useState('default');
  const [activeSnapshot, setActiveSnapshot] = useState(0); /* 0 = Default (interactive), 1+ = snapshot index */
  const [activeTab, setActiveTab] = useState<'preview' | 'documentation'>('preview');
  const pageTheme = usePageTheme();
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(pageTheme);
  const togglePreviewTheme = useCallback(() => {
    setPreviewTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Reset when navigating between detail pages
  const pageKey = `${type}-${id}`;
  const [prevKey, setPrevKey] = useState(pageKey);
  if (pageKey !== prevKey) {
    setPrevKey(pageKey);
    setActiveVariant(0);
    setActiveState('default');
    setActiveSnapshot(0);
    setHoveredRowIdx(null);
    setActiveTab('preview');
    setPreviewTheme(pageTheme);
  }

  // Find data
  let data: DSEntry | undefined;
  if (type === 'atom') data = atomsData.find(a => a.id === id);
  else if (type === 'molecule') data = moleculesData.find(m => m.id === id);
  else if (type === 'component') {
    const comp = fullComponents.find(c => c.id === id);
    if (comp) {
      /* Flatten componentVariants (keyed by old group ids) into per-component lookup */
      let matchedVariant: VariantInfo | undefined;
      for (const groupVariants of Object.values(componentVariants)) {
        const found = groupVariants.find(v => v.id === id);
        if (found) { matchedVariant = found; break; }
      }
      /* Also check realWorldTokens (keyed directly by component id) */
      if (!matchedVariant && id && realWorldTokens[id]) {
        matchedVariant = realWorldTokens[id];
      }
      const vars: VariantInfo[] = matchedVariant ? [matchedVariant] : [{
        id: comp.id, label: comp.name, useCase: comp.description,
        tokenAdaptations: 'Inherits tokens from composed atoms and molecules',
        diffs: ['Content layout adaptation', 'Context-specific data'],
        tokens: [] as TokenLayer[],
      }];
      const moleculeList = comp.moleculesUsed.length > 0 ? ` and ${comp.moleculesUsed.join(', ')} (molecules)` : '';
      data = {
        id: comp.id, name: comp.name, type: 'component', desc: comp.description,
        usage: `Composed from ${comp.atomsUsed.join(', ')} (atoms)${moleculeList}.`,
        tokens: [], composition: [...comp.atomsUsed, ...comp.moleculesUsed], variants: vars,
      };
    }
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: '100%', gap: 16 }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)' }}>Element not found</span>
        <Link to={isGalleryRoute ? '/' : '/design-system'} style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-accent)', textDecoration: 'none' }}>{isGalleryRoute ? '← Back to Gallery' : '← Back to Components'}</Link>
      </div>
    );
  }

  // Get gallery entry for atoms/molecules (per-variant render functions)
  const galleryEntry = type === 'atom' ? atomEntries.find(e => e.id === id) : type === 'molecule' ? moleculeEntries.find(e => e.id === id) : null;
  const galleryVariants = galleryEntry?.variants || [];
  const galleryStates = galleryEntry?.states || [];
  const hasGalleryVariants = galleryVariants.length > 1;
  const hasGalleryStates = galleryStates.length > 1;
  const currentGalleryStateRaw = galleryStates[galleryStates.findIndex(s => s.id === activeState)] ? activeState : 'default';
  /* When 'default' is selected, pass undefined so atoms/molecules use live interaction */
  const currentGalleryState = currentGalleryStateRaw === 'default' ? undefined : currentGalleryStateRaw;

  // Fallback: old all-at-once preview renderer (only if no gallery entry)
  const PreviewRenderer = !galleryEntry ? (type === 'atom' ? atomPreviews[id!] : type === 'molecule' ? moleculePreviews[id!] : null) : null;

  // For component variants, get the registry component
  const currentVariant = data.variants?.[activeVariant];
  const RegistryComponent = currentVariant ? componentRegistry.find(r => r.id === currentVariant.id)?.component : null;

  const typeBadge = { atom: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' }, molecule: { bg: 'var(--token-secondary-light)', fg: 'var(--token-secondary)' }, component: { bg: 'var(--token-tertiary-light)', fg: 'var(--token-tertiary)' } };
  const badge = typeBadge[data.type];

  /* Compute tokens to show — merge base + active state/snapshot tokens */
  const snapshots = type === 'component' && id ? componentSnapshots[id] || [] : [];
  const hasSnapshots = type === 'component' && snapshots.length > 0;

  let tokensToShow: TokenLayer[];
  if (hasSnapshots && activeSnapshot > 0 && snapshots[activeSnapshot - 1]) {
    /* Specific snapshot selected — show base tokens + snapshot-specific overrides
       so every visible element in the preview has its token mapping shown */
    const baseTokens = data.tokens.length > 0 ? data.tokens : (currentVariant as VariantInfo | undefined)?.tokens || [];
    tokensToShow = filterValidTokens([...baseTokens, ...snapshots[activeSnapshot - 1].tokens]);
  } else {
    /* Default or non-component: use base + state tokens, merge all snapshot tokens for default */
    const baseTokens = data.tokens.length > 0 ? data.tokens : (currentVariant as VariantInfo | undefined)?.tokens || [];
    const activeStateData = data.states?.find(s => s.id === activeState);
    const rawTokens = activeStateData && activeState !== 'default'
      ? [...baseTokens, ...activeStateData.tokens]
      : baseTokens;
    if (hasSnapshots && activeSnapshot === 0) {
      /* Default snapshot for components: merge base tokens + all snapshot tokens */
      const allSnapshotTokens = snapshots.flatMap(s => s.tokens);
      tokensToShow = filterValidTokens([...rawTokens, ...allSnapshotTokens]);
    } else {
      tokensToShow = filterValidTokens(rawTokens);
    }
  }

  return (
    <div className="ds-detail-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ——— Fixed top header section ——— */}
      <div className="ds-detail-header-padding" style={{ flexShrink: 0, padding: '0 var(--token-space-6)', borderBottom: '1px solid var(--token-border)' }}>
        {/* Breadcrumb */}
        <div style={{ padding: 'var(--token-space-3) 0' }}>
          <Link to={isGalleryRoute ? '/' : '/design-system'} className="inline-flex items-center" style={{ gap: 6, fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', textDecoration: 'none', transition: 'color 120ms' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
          >
            <ArrowLeft size={12}/> {isGalleryRoute ? 'Gallery' : 'Components'}
          </Link>
        </div>

        {/* Title + badge + Preview/Documentation tab */}
        <div style={{ paddingBottom: 0 }}>
          <div className="flex items-center flex-wrap" style={{ gap: 8, marginBottom: 8 }}>
            <h1 style={{ margin: 0, fontSize: 'var(--token-text-lg)', fontWeight: 600, color: 'var(--token-text-primary)', letterSpacing: 'var(--token-tracking-tight)' }}>{data.name}</h1>
            <span style={{ padding: '2px 10px', borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-2xs)', fontWeight: 500, fontFamily: 'var(--token-font-mono)', background: badge.bg, color: badge.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{data.type}</span>
            {data.tag && (
              <span style={{ padding: '2px 10px', borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-2xs)', fontWeight: 500, fontFamily: 'var(--token-font-mono)', background: data.tag === 'ai' ? 'var(--token-accent-light)' : 'var(--token-bg-tertiary)', color: data.tag === 'ai' ? 'var(--token-accent)' : 'var(--token-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {data.tag === 'ai' ? '✦ AI' : 'Common'}
              </span>
            )}
          </div>
          {/* Preview / Documentation tab switch */}
          <div className="flex" style={{ gap: 0 }}>
            {(['preview', 'documentation'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="cursor-pointer"
                  style={{
                    padding: '6px 14px',
                    fontSize: 'var(--token-text-xs)',
                    fontFamily: 'var(--token-font-sans)',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: isActive ? '2px solid var(--token-accent)' : '2px solid transparent',
                    transition: 'color 120ms',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant tabs — horizontal scroll on mobile (only in preview mode) */}
        {activeTab === 'preview' && data.variants && data.variants.length > 1 && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' as any, marginTop: -1 }}>
            <div className="flex" style={{ gap: 0 }}>
            {data.variants.map((v, i) => (
              <button key={v.id} onClick={() => { setActiveVariant(i); setHoveredRowIdx(null); }} className="cursor-pointer shrink-0" style={{
                padding: '8px 12px',
                fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)',
                fontWeight: activeVariant === i ? 500 : 400,
                color: activeVariant === i ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                border: 'none', background: 'transparent',
                borderBottom: activeVariant === i ? '2px solid var(--token-accent)' : '2px solid transparent',
                transition: 'color 120ms', whiteSpace: 'nowrap',
              }}>
                {v.label}
              </button>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* ——— 50/50 split columns — both scroll independently (Preview tab) ——— */}
      {activeTab === 'preview' && <div className="ds-detail-columns" style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* LEFT COLUMN — Preview (+ gallery tabs for atoms/molecules, Composed Of for components) */}
        <div className="ds-detail-left" style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: tokensToShow.length > 0 ? '1px solid var(--token-border)' : 'none' }}>

          {/* Variant tabs — top of preview column (atoms/molecules only) */}
          {galleryEntry && hasGalleryVariants && (
            <div
              className="flex shrink-0"
              style={{
                borderBottom: '1px solid var(--token-border)',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none' as any,
                background: 'var(--token-bg)',
              }}
            >
              {galleryVariants.map((v, i) => (
                <button
                  key={v.label}
                  onClick={() => { setActiveVariant(i); }}
                  className="cursor-pointer shrink-0"
                  style={{
                    padding: 'var(--token-space-1-5) var(--token-space-3)',
                    fontSize: 11,
                    fontFamily: 'var(--token-font-sans)',
                    fontWeight: activeVariant === i ? 500 : 400,
                    color: activeVariant === i ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                    border: 'none',
                    background: activeVariant === i ? 'var(--token-accent-light)' : 'transparent',
                    borderBottom: activeVariant === i ? '2px solid var(--token-accent)' : '2px solid transparent',
                    transition: 'all var(--token-duration-fast)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* State micro-pills — below variant tabs, above preview (atoms/molecules only) */}
          {galleryEntry && hasGalleryStates && (() => {
            const activeStateDesc = activeState !== 'default' ? data.states?.find(s => s.id === activeState)?.description : null;
            return (
              <div className="shrink-0" style={{ padding: '6px 12px', borderBottom: '1px solid var(--token-border)' }}>
                <div className="flex flex-wrap" style={{ gap: 4, marginBottom: activeStateDesc ? 4 : 0 }}>
                  {galleryStates.map(st => {
                    const isAct = currentGalleryStateRaw === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => { setActiveState(st.id); setHoveredRowIdx(null); }}
                        className="cursor-pointer"
                        style={{
                          padding: '1px 8px',
                          fontSize: 10,
                          lineHeight: '20px',
                          fontFamily: 'var(--token-font-mono)',
                          letterSpacing: '0.01em',
                          border: 'none',
                          borderRadius: 'var(--token-radius-full)',
                          background: isAct ? 'var(--token-bg-tertiary)' : 'transparent',
                          color: isAct ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)',
                          opacity: isAct ? 1 : 0.6,
                          transition: 'all var(--token-duration-fast)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
                {activeStateDesc && (
                  <div style={{ padding: '3px 8px', background: 'var(--token-accent-muted)', borderRadius: 'var(--token-radius-md)' }}>
                    <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>{activeStateDesc}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* LIVE PREVIEW — fills available space */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {type === 'component' && RegistryComponent ? (
              /* Component with snapshots: default = interactive, other = static snapshot label */
              hasSnapshots && activeSnapshot > 0 && snapshots[activeSnapshot - 1] ? (
                <PreviewPanel hoveredRow={hoveredRowIdx != null ? tokensToShow[hoveredRowIdx] : null} allTokens={tokensToShow} previewTheme={previewTheme} onToggleTheme={togglePreviewTheme}>
                  <div style={{ width: '100%', maxWidth: 520, overflow: 'auto', pointerEvents: 'none' }}>
                    {snapshots[activeSnapshot - 1].render()}
                  </div>
                  {/* Snapshot state overlay label */}
                  <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', borderRadius: 'var(--token-radius-full)', background: 'var(--token-accent)', color: 'var(--token-accent-fg)', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', fontWeight: 500, letterSpacing: '0.02em', zIndex: 5 }}>
                    {snapshots[activeSnapshot - 1].label}
                  </div>
                </PreviewPanel>
              ) : (
                <PreviewPanel hoveredRow={hoveredRowIdx != null ? tokensToShow[hoveredRowIdx] : null} allTokens={tokensToShow} previewTheme={previewTheme} onToggleTheme={togglePreviewTheme}>
                  <div style={{ width: '100%', maxWidth: 500, overflow: 'auto' }}>
                    <RegistryComponent />
                  </div>
                </PreviewPanel>
              )
            ) : galleryEntry ? (
              <PreviewPanel hoveredRow={hoveredRowIdx != null ? tokensToShow[hoveredRowIdx] : null} allTokens={tokensToShow} previewTheme={previewTheme} onToggleTheme={togglePreviewTheme}>
                {galleryVariants[activeVariant]?.render(currentGalleryState)}
              </PreviewPanel>
            ) : PreviewRenderer ? (
              <PreviewPanel hoveredRow={hoveredRowIdx != null ? tokensToShow[hoveredRowIdx] : null} allTokens={tokensToShow} previewTheme={previewTheme} onToggleTheme={togglePreviewTheme}>
                <PreviewRenderer activeState={activeState === 'default' ? undefined : activeState} />
              </PreviewPanel>
            ) : null}
          </div>

          {/* Snapshot selector — only for components with snapshots, pinned above "Composed Of" */}
          {hasSnapshots && (
            <div style={{ flexShrink: 0, borderTop: '1px solid var(--token-border)', background: 'var(--token-bg)' }}>
              <div style={{ padding: '8px 12px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Camera size={10} style={{ color: 'var(--token-text-disabled)' }} />
                <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Snapshots</span>
                <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)', background: 'var(--token-accent-light)', padding: '0 5px', borderRadius: 'var(--token-radius-full)', lineHeight: '14px' }}>{snapshots.length + 1}</span>
              </div>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' as any }}>
                <div className="flex" style={{ gap: 0, padding: '0 12px 6px' }}>
                  {/* Default snapshot = interactive */}
                  <button
                    onClick={() => { setActiveSnapshot(0); setHoveredRowIdx(null); }}
                    className="cursor-pointer shrink-0"
                    style={{
                      padding: '4px 10px',
                      fontSize: 10,
                      fontFamily: 'var(--token-font-mono)',
                      fontWeight: activeSnapshot === 0 ? 500 : 400,
                      color: activeSnapshot === 0 ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                      border: activeSnapshot === 0 ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
                      background: activeSnapshot === 0 ? 'var(--token-accent-light)' : 'transparent',
                      borderRadius: 'var(--token-radius-full)',
                      transition: 'all var(--token-duration-fast)',
                      whiteSpace: 'nowrap',
                      lineHeight: '18px',
                      marginRight: 4,
                    }}
                  >
                    Default
                  </button>
                  {snapshots.map((snap, i) => {
                    const isActive = activeSnapshot === i + 1;
                    return (
                      <button
                        key={snap.id}
                        onClick={() => { setActiveSnapshot(i + 1); setHoveredRowIdx(null); }}
                        className="cursor-pointer shrink-0"
                        style={{
                          padding: '4px 10px',
                          fontSize: 10,
                          fontFamily: 'var(--token-font-mono)',
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                          border: isActive ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
                          background: isActive ? 'var(--token-accent-light)' : 'transparent',
                          borderRadius: 'var(--token-radius-full)',
                          transition: 'all var(--token-duration-fast)',
                          whiteSpace: 'nowrap',
                          lineHeight: '18px',
                          marginRight: 4,
                        }}
                      >
                        {snap.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Composed Of — only for components, pinned to bottom */}
          {type === 'component' && data.composition && data.composition.length > 0 && (
            <div style={{ flexShrink: 0, borderTop: '1px solid var(--token-border)', padding: '12px var(--token-space-4)', background: 'var(--token-bg-secondary)' }}>
              <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Composed of</span>
              <CompositionChips items={data.composition} type={data.type as any} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Token Mapping */}
        {tokensToShow.length > 0 && (
          <div className="ds-detail-right" style={{ flex: '1 1 50%', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}>
            {/* Header */}
            <div className="flex items-center flex-wrap" style={{ padding: 'var(--token-space-3) var(--token-space-4)', gap: 'var(--token-space-2-5)', borderBottom: '1px solid var(--token-border)' }}>
              <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Token Mapping
              </span>
              <span style={{
                fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                color: 'var(--token-accent)', background: 'var(--token-accent-light)',
                padding: '0 6px', borderRadius: 'var(--token-radius-full)', lineHeight: '16px',
              }}>{tokensToShow.length}</span>
              {hasSnapshots && activeSnapshot > 0 && snapshots[activeSnapshot - 1] && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-tertiary)', marginLeft: 'auto',
                }}>
                  {snapshots[activeSnapshot - 1].label}
                </span>
              )}
              {hasSnapshots && activeSnapshot === 0 && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-disabled)', marginLeft: 'auto',
                }}>
                  All snapshots
                </span>
              )}
            </div>
            <TokenMapping tokens={tokensToShow} hoveredRowIdx={hoveredRowIdx} onHoverRow={setHoveredRowIdx} previewTheme={previewTheme} />
            {/* bottom spacer */}
            <div style={{ height: 'calc(50vh)', flexShrink: 0 }} />
          </div>
        )}
      </div>}

      {/* ——————————————————————————————————————————
         DOCUMENTATION TAB
         Rendered when documentation tab is active
         —————————————————————————————————————————— */}
      {activeTab === 'documentation' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          <ComponentDocSection componentId={data.id} />
        </div>
      )}

      {/* Responsive CSS moved to /src/styles/responsive.css */}
    </div>
  );
}

/* ——————————————————————————————————————————————————
   ComponentDocSection — Technical documentation panel
   Rendered below the viewport area on detail pages
   —————————————————————————————————————————————————— */
function ComponentDocSection({ componentId }: { componentId: string }) {
  const doc = getComponentDoc(componentId);
  if (!doc) return (
    <div style={{
      background: 'var(--token-bg)',
      padding: 'var(--token-space-6) var(--token-space-6)',
    }}>
      <div className="flex flex-col items-center justify-center" style={{ gap: 12, padding: 'var(--token-space-8) 0' }}>
        <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)' }}>Documentation coming soon</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{componentId}</span>
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'var(--token-bg)',
      padding: 'var(--token-space-6) var(--token-space-6)',
    }}>
      {/* Section Title */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-5)' }}>
        <span style={{
          fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
          color: 'var(--token-text-disabled)', textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Documentation
        </span>
        <DSBadge variant="ai">Zeros AIUI</DSBadge>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)',
        lineHeight: 'var(--token-leading-relaxed)', marginBottom: 'var(--token-space-5)',
        maxWidth: 680,
      }}>
        {doc.description}
      </p>

      {/* Import Path */}
      <div style={{ marginBottom: 'var(--token-space-5)' }}>
        <span style={{
          fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
          color: 'var(--token-text-disabled)', textTransform: 'uppercase',
          letterSpacing: '0.06em', display: 'block', marginBottom: 6,
        }}>
          Import
        </span>
        <code style={{
          display: 'block', padding: 'var(--token-space-3) var(--token-space-4)',
          background: 'var(--token-bg-code)', borderRadius: 'var(--token-radius-md)',
          fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)',
          color: 'var(--token-code-text)', border: '1px solid var(--token-border-subtle)',
        }}>
          {`import { ${doc.name} } from '${doc.importPath}';`}
        </code>
      </div>

      {/* Props Table */}
      {doc.props.length > 0 && (
        <div style={{ marginBottom: 'var(--token-space-5)' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)', textTransform: 'uppercase',
            letterSpacing: '0.06em', display: 'block', marginBottom: 8,
          }}>
            Props
          </span>
          <div style={{
            border: '1px solid var(--token-border-subtle)',
            borderRadius: 'var(--token-radius-lg)',
            overflow: 'hidden',
          }}>
            {/* Table Header */}
            <div className="flex" style={{
              background: 'var(--token-bg-secondary)',
              borderBottom: '1px solid var(--token-border-subtle)',
              padding: 'var(--token-space-2) var(--token-space-3)',
              gap: 'var(--token-space-2)',
            }}>
              <span style={{ flex: '0 0 140px', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
              <span style={{ flex: '1 1 200px', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
              <span style={{ flex: '0 0 80px', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default</span>
              <span style={{ flex: '1 1 200px', fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</span>
            </div>
            {/* Table Rows */}
            {doc.props.map((prop, i) => (
              <PropRow key={prop.name} prop={prop} isLast={i === doc.props.length - 1} />
            ))}
          </div>
        </div>
      )}

      {/* Usage Example */}
      {doc.usage && (
        <div style={{ marginBottom: 'var(--token-space-5)' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)', textTransform: 'uppercase',
            letterSpacing: '0.06em', display: 'block', marginBottom: 8,
          }}>
            Usage
          </span>
          <pre style={{
            padding: 'var(--token-space-4)',
            background: 'var(--token-bg-code)',
            borderRadius: 'var(--token-radius-lg)',
            fontSize: 'var(--token-text-xs)',
            fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-code-text)',
            border: '1px solid var(--token-border-subtle)',
            overflow: 'auto',
            lineHeight: 'var(--token-leading-relaxed)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {doc.usage}
          </pre>
        </div>
      )}

      {/* Accessibility Notes */}
      {doc.accessibility && (
        <div style={{ marginBottom: 'var(--token-space-5)' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)', textTransform: 'uppercase',
            letterSpacing: '0.06em', display: 'block', marginBottom: 8,
          }}>
            Accessibility
          </span>
          <div style={{
            padding: 'var(--token-space-3) var(--token-space-4)',
            background: 'var(--token-accent-light)',
            borderRadius: 'var(--token-radius-lg)',
            border: '1px solid var(--token-border-subtle)',
          }}>
            {doc.accessibility.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              const isListItem = trimmed.startsWith('-');
              return (
                <div key={i} className="flex" style={{
                  gap: 'var(--token-space-2)',
                  padding: '2px 0',
                }}>
                  {isListItem && (
                    <span style={{ color: 'var(--token-accent)', fontSize: 'var(--token-text-xs)', flexShrink: 0, marginTop: 1 }}>{'>'}</span>
                  )}
                  <span style={{
                    fontSize: 'var(--token-text-xs)',
                    color: 'var(--token-text-secondary)',
                    lineHeight: 'var(--token-leading-relaxed)',
                  }}>
                    {isListItem ? trimmed.slice(1).trim() : trimmed}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dependencies & Used By */}
      <div className="flex flex-wrap" style={{ gap: 'var(--token-space-5)' }}>
        {doc.dependencies.length > 0 && (
          <div style={{ flex: '1 1 280px' }}>
            <span style={{
              fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-disabled)', textTransform: 'uppercase',
              letterSpacing: '0.06em', display: 'block', marginBottom: 8,
            }}>
              Dependencies
            </span>
            <div className="flex flex-wrap" style={{ gap: 4 }}>
              {doc.dependencies.map(dep => (
                <span key={dep} style={{
                  padding: '1px 8px', borderRadius: 'var(--token-radius-full)',
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  background: 'var(--token-bg-tertiary)', color: 'var(--token-text-secondary)',
                  border: '1px solid var(--token-border-subtle)',
                }}>
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}
        {doc.usedBy && doc.usedBy.length > 0 && (
          <div style={{ flex: '1 1 280px' }}>
            <span style={{
              fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-disabled)', textTransform: 'uppercase',
              letterSpacing: '0.06em', display: 'block', marginBottom: 8,
            }}>
              Used By
            </span>
            <div className="flex flex-wrap" style={{ gap: 4 }}>
              {doc.usedBy.map(comp => (
                <span key={comp} style={{
                  padding: '1px 8px', borderRadius: 'var(--token-radius-full)',
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  background: 'var(--token-accent-light)', color: 'var(--token-accent)',
                  border: '1px solid var(--token-border-subtle)',
                }}>
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Token Dependencies */}
      {doc.tokens.length > 0 && (
        <div style={{ marginTop: 'var(--token-space-5)' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)', textTransform: 'uppercase',
            letterSpacing: '0.06em', display: 'block', marginBottom: 8,
          }}>
            Token Dependencies
          </span>
          <div className="flex flex-wrap" style={{ gap: 4 }}>
            {doc.tokens.map(token => (
              <span key={token} style={{
                padding: '1px 6px', borderRadius: 'var(--token-radius-sm)',
                fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                background: 'var(--token-bg-code)', color: 'var(--token-code-function)',
                border: '1px solid var(--token-border-subtle)',
              }}>
                {token}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* PropRow — individual prop table row with hover */
function PropRow({ prop, isLast }: { prop: PropDoc; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        gap: 'var(--token-space-2)',
        borderBottom: isLast ? 'none' : '1px solid var(--token-border-subtle)',
        background: hovered ? 'var(--token-bg-hover)' : 'transparent',
        transition: 'background var(--token-duration-fast)',
        alignItems: 'flex-start',
      }}
    >
      <span style={{
        flex: '0 0 140px',
        fontSize: 'var(--token-text-xs)',
        fontFamily: 'var(--token-font-mono)',
        color: 'var(--token-accent)',
        fontWeight: 'var(--token-weight-medium)',
      }}>
        {prop.name}{prop.required ? <span style={{ color: 'var(--token-error)' }}>*</span> : ''}
      </span>
      <span style={{
        flex: '1 1 200px',
        fontSize: 'var(--token-text-2xs)',
        fontFamily: 'var(--token-font-mono)',
        color: 'var(--token-text-tertiary)',
        wordBreak: 'break-word',
      }}>
        {prop.type}
      </span>
      <span style={{
        flex: '0 0 80px',
        fontSize: 'var(--token-text-2xs)',
        fontFamily: 'var(--token-font-mono)',
        color: prop.default ? 'var(--token-secondary)' : 'var(--token-text-disabled)',
      }}>
        {prop.default || '\u2014'}
      </span>
      <span style={{
        flex: '1 1 200px',
        fontSize: 'var(--token-text-xs)',
        color: 'var(--token-text-secondary)',
        lineHeight: 'var(--token-leading-relaxed)',
      }}>
        {prop.description}
      </span>
    </div>
  );
}
