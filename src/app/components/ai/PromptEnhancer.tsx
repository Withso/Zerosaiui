/* PromptEnhancer — Enhanced with before/after full preview, category tags, undo
   Composed from DS atoms (DSButton)
   Phase 3: full enhanced preview, undo individual, category labels on suggestions */
import { useState, useCallback } from 'react';
import { Wand2, ChevronRight, Check, Sparkles, Undo2, Eye, EyeOff } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type EnhancementCategory = 'clarity' | 'specificity' | 'style' | 'technical' | 'scope';

interface Enhancement {
  id: string;
  label: string;
  original: string;
  enhanced: string;
  category?: EnhancementCategory;
}

interface PromptEnhancerProps {
  prompt?: string;
  qualityScore?: number;
  enhancements?: Enhancement[];
  onApply?: (enhanced: string) => void;
  onUseEnhanced?: () => void;
}

const categoryColors: Record<EnhancementCategory, string> = {
  clarity: 'var(--token-chart-2)',
  specificity: 'var(--token-accent)',
  style: 'var(--token-chart-5)',
  technical: 'var(--token-chart-6)',
  scope: 'var(--token-warning)',
};

export function PromptEnhancer({
  prompt,
  qualityScore: controlledScore,
  enhancements: controlledEnhancements,
  onApply,
  onUseEnhanced,
}: PromptEnhancerProps) {
  const text = prompt || defaultPrompt;
  const score = controlledScore ?? 45;
  const enhancements = controlledEnhancements || defaultEnhancements;
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'var(--token-success)';
    if (s >= 50) return 'var(--token-warning)';
    return 'var(--token-error)';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Strong';
    if (s >= 50) return 'Fair';
    return 'Weak';
  };

  const currentScore = score + applied.size * 15;
  const clampedScore = Math.min(100, currentScore);

  const toggleApply = useCallback((id: string) => {
    setApplied(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* Build enhanced preview text */
  const buildPreview = () => {
    let result = text;
    enhancements.forEach(enh => {
      if (applied.has(enh.id) && enh.original !== '(no style specified)' && enh.original !== '(no tech specified)') {
        result = result.replace(enh.original, enh.enhanced);
      }
    });
    /* Append style/tech if applied */
    enhancements.forEach(enh => {
      if (applied.has(enh.id) && (enh.original === '(no style specified)' || enh.original === '(no tech specified)')) {
        result += ` ${enh.enhanced}`;
      }
    });
    return result.trim();
  };

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        border: '1px solid var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header with quality meter */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-3)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <Wand2 size={14} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}
        >
          Prompt Enhancer
        </span>

        {/* Preview toggle */}
        <DSButton
          variant="ghost"
          icon={showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
          onClick={() => setShowPreview(!showPreview)}
          style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 6px', height: 20 }}
        >
          {showPreview ? 'Hide' : 'Preview'}
        </DSButton>

        {/* Quality score badge */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <div style={{
            width: 48, height: 4,
            borderRadius: 'var(--token-radius-full)',
            background: 'var(--token-bg-tertiary)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${clampedScore}%`,
              borderRadius: 'var(--token-radius-full)',
              background: getScoreColor(clampedScore),
              transition: 'width var(--token-duration-normal) var(--token-ease-default), background var(--token-duration-normal)',
            }} />
          </div>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: getScoreColor(clampedScore),
            fontWeight: 'var(--token-weight-medium)',
          }}>
            {clampedScore}% {getScoreLabel(clampedScore)}
          </span>
        </div>
      </div>

      {/* Current prompt / Enhanced preview toggle */}
      <div style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderBottom: '1px solid var(--token-border-subtle)',
      }}>
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {showPreview && applied.size > 0 ? 'Enhanced Preview' : 'Current Prompt'}
        </span>
        <p style={{
          margin: 'var(--token-space-1-5) 0 0',
          fontSize: 'var(--token-text-sm)',
          color: showPreview && applied.size > 0 ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
          lineHeight: 'var(--token-leading-normal)',
          transition: 'color 200ms ease',
        }}>
          {showPreview && applied.size > 0 ? buildPreview() : text}
        </p>
      </div>

      {/* Enhancement suggestions with categories */}
      <div className="flex flex-col">
        {enhancements.map((enh, i) => {
          const isApplied = applied.has(enh.id);
          return (
            <div
              key={enh.id}
              className="flex items-start"
              style={{
                gap: 'var(--token-space-3)',
                padding: 'var(--token-space-3) var(--token-space-4)',
                borderBottom: i < enhancements.length - 1 ? '1px solid var(--token-border-subtle)' : 'none',
                background: isApplied ? 'rgba(45,164,78,0.04)' : 'transparent',
                transition: 'background 200ms ease',
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 20, height: 20,
                  borderRadius: 'var(--token-radius-full)',
                  marginTop: 1,
                  background: isApplied ? 'var(--token-success)' : 'var(--token-bg-tertiary)',
                  transition: 'background var(--token-duration-fast)',
                }}
              >
                {isApplied ? (
                  <Check size={10} style={{ color: 'var(--token-accent-fg)' }} />
                ) : (
                  <Sparkles size={10} style={{ color: 'var(--token-text-disabled)' }} />
                )}
              </div>

              <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-1)', minWidth: 0 }}>
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                  <span style={{
                    fontSize: 'var(--token-text-xs)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: 'var(--token-text-primary)',
                  }}>
                    {enh.label}
                  </span>
                  {enh.category && (
                    <span style={{
                      fontSize: 7,
                      padding: '1px 5px',
                      borderRadius: 'var(--token-radius-full)',
                      background: 'var(--token-bg-tertiary)',
                      color: categoryColors[enh.category],
                      fontFamily: 'var(--token-font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {enh.category}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 'var(--token-text-xs)', lineHeight: 'var(--token-leading-normal)' }}>
                  <span style={{ color: 'var(--token-error)', textDecoration: 'line-through', opacity: 0.7 }}>
                    {enh.original}
                  </span>
                  <ChevronRight size={10} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px', color: 'var(--token-text-disabled)' }} />
                  <span style={{ color: 'var(--token-success)' }}>{enh.enhanced}</span>
                </div>
              </div>

              <DSButton
                variant="ghost"
                icon={isApplied ? <Undo2 size={10} /> : undefined}
                onClick={() => toggleApply(enh.id)}
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: isApplied ? 'var(--token-text-tertiary)' : 'var(--token-accent)',
                  background: isApplied ? 'transparent' : 'var(--token-accent-light)',
                  padding: 'var(--token-space-1) var(--token-space-2-5)',
                }}
              >
                {isApplied ? 'Undo' : 'Apply'}
              </DSButton>
            </div>
          );
        })}
      </div>

      {/* Apply all button */}
      <div style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderTop: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <DSButton
          variant="primary"
          icon={<Wand2 size={13} />}
          onClick={() => {
            const all = new Set(enhancements.map(e => e.id));
            setApplied(all);
            onApply?.('enhanced prompt');
            onUseEnhanced?.();
          }}
          style={{ width: '100%' }}
        >
          Enhance All ({enhancements.length - applied.size} remaining)
        </DSButton>
      </div>
    </div>
  );
}

const defaultPrompt = 'Make a website for my coffee shop';

const defaultEnhancements: Enhancement[] = [
  {
    id: '1',
    label: 'Add specificity',
    original: 'a website',
    enhanced: 'a responsive landing page with menu, location, and online ordering',
    category: 'specificity',
  },
  {
    id: '2',
    label: 'Define style',
    original: '(no style specified)',
    enhanced: 'warm, artisan aesthetic with earth tones and serif typography',
    category: 'style',
  },
  {
    id: '3',
    label: 'Specify tech stack',
    original: '(no tech specified)',
    enhanced: 'using React, Tailwind CSS, and responsive mobile-first design',
    category: 'technical',
  },
];

export function PromptEnhancerDemo() {
  const [enhanced, setEnhanced] = useState(false);

  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      <PromptEnhancer onUseEnhanced={() => setEnhanced(true)} />
      {enhanced && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-success)',
          background: 'var(--token-success-light)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-success)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Enhanced prompt applied to input
        </div>
      )}
    </div>
  );
}
