/* ThinkingIndicator — Enhanced with state-aware dynamic text + ETA
   Composed from DS atoms (DSAvatar, DSStreamingDots)
   Phase 3: dynamic status text, estimated time, step cycling */
import { Sparkles } from 'lucide-react';
import { DSAvatar, DSStreamingDots, DSBadge } from '../ds/atoms';
import { useState, useEffect } from 'react';

interface ThinkingIndicatorProps {
  label?: string;
  variant?: 'dots' | 'bar' | 'minimal';
  steps?: string[];
  eta?: string;
}

export function ThinkingIndicator({ label, variant = 'dots', steps, eta }: ThinkingIndicatorProps) {
  /* -- State-aware dynamic text cycling through steps -- */
  const [stepIdx, setStepIdx] = useState(0);
  const activeSteps = steps || defaultSteps;
  const displayLabel = label || activeSteps[stepIdx % activeSteps.length];

  useEffect(() => {
    if (!steps && !label) {
      const timer = setInterval(() => setStepIdx(i => i + 1), 2500);
      return () => clearInterval(timer);
    }
    if (steps && steps.length > 1) {
      const timer = setInterval(() => setStepIdx(i => (i + 1) % steps.length), 2500);
      return () => clearInterval(timer);
    }
  }, [steps, label]);

  if (variant === 'minimal') {
    return (
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          fontFamily: 'var(--token-font-sans)',
          fontSize: 'var(--token-text-sm)',
          color: 'var(--token-text-tertiary)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: 16,
            background: 'var(--token-text-tertiary)',
            animation: 'token-blink 1s step-end infinite',
          }}
        />
        <span key={stepIdx} style={{ animation: 'token-fade-in 300ms ease' }}>{displayLabel}</span>
        {eta && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            marginLeft: 'var(--token-space-1)',
          }}>
            ({eta})
          </span>
        )}
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
          <DSAvatar variant="ai" size={28} status="thinking" />
          <div style={{ flex: 1, maxWidth: 180 }}>
            <div style={{
              height: 4, borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-bg-tertiary)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: '40%', borderRadius: 'var(--token-radius-full)',
                background: 'linear-gradient(90deg, var(--token-text-disabled), var(--token-text-tertiary), var(--token-text-disabled))',
                backgroundSize: '200% 100%',
                animation: 'token-shimmer 1.5s linear infinite',
              }} />
            </div>
          </div>
        </div>
        {/* Dynamic status text below bar */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)', paddingLeft: 40 }}>
          <span
            key={stepIdx}
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              animation: 'token-fade-in 300ms ease',
            }}
          >
            {displayLabel}
          </span>
          {eta && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              - {eta}
            </span>
          )}
        </div>
      </div>
    );
  }

  /* Default: dots with dynamic label */
  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
        <DSAvatar variant="ai" size={28} status="thinking" />
        <DSStreamingDots />
      </div>
      {/* Dynamic status text */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)', paddingLeft: 40 }}>
        <span
          key={stepIdx}
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 300ms ease',
          }}
        >
          {displayLabel}
        </span>
        {eta && (
          <DSBadge variant="default" style={{ fontSize: 9 }}>{eta}</DSBadge>
        )}
      </div>
    </div>
  );
}

const defaultSteps = [
  'Thinking...',
  'Analyzing context...',
  'Searching knowledge...',
  'Composing response...',
];

export function ThinkingIndicatorDemo() {
  const variants: Array<{ v: 'dots' | 'bar' | 'minimal'; label: string }> = [
    { v: 'dots', label: 'Dots' },
    { v: 'bar', label: 'Bar' },
    { v: 'minimal', label: 'Minimal' },
  ];
  const [activeVariant, setActiveVariant] = useState<'dots' | 'bar' | 'minimal'>('dots');
  const [autoCycle, setAutoCycle] = useState(true);

  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setActiveVariant(prev => prev === 'dots' ? 'bar' : prev === 'bar' ? 'minimal' : 'dots');
    }, 4000);
    return () => clearInterval(timer);
  }, [autoCycle]);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-6)', maxWidth: 400, width: '100%' }}>
      {/* Variant selector */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {variants.map(({ v, label }) => (
          <button
            key={v}
            onClick={() => { setActiveVariant(v); setAutoCycle(false); }}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${activeVariant === v ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: activeVariant === v ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: activeVariant === v ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setAutoCycle(!autoCycle)}
          className="cursor-pointer"
          style={{
            marginLeft: 'auto',
            padding: 'var(--token-space-1) var(--token-space-2)',
            borderRadius: 'var(--token-radius-md)',
            border: 'none',
            background: autoCycle ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
            color: autoCycle ? 'var(--token-text-inverse)' : 'var(--token-text-tertiary)',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            transition: 'all 200ms ease',
          }}
        >
          {autoCycle ? 'auto' : 'manual'}
        </button>
      </div>
      {/* Active variant */}
      <div style={{ minHeight: 60, animation: 'token-fade-in 200ms ease' }} key={activeVariant}>
        <ThinkingIndicator
          variant={activeVariant}
          eta="~8s"
        />
      </div>
    </div>
  );
}
