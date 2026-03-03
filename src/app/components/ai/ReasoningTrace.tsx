/* ReasoningTrace — Enhanced with step confidence, branching paths, step duration, collapsible sub-thoughts
   Composed from DS atoms (DSBadge) + DS atoms-extra (DSCollapsible)
   Phase 3: per-step confidence indicator, timing per step, sub-thought expansion, token usage */
import { Brain, Clock, ChevronDown, Zap } from 'lucide-react';
import { DSBadge } from '../ds/atoms';
import { DSCollapsible } from '../ds/atoms-extra';
import { useState, useEffect } from 'react';

interface StepData {
  label: string;
  description?: string;
  confidence?: number;
  duration?: string;
  subSteps?: string[];
}

interface ReasoningTraceProps {
  steps: StepData[];
  duration?: string;
  isComplete?: boolean;
  defaultOpen?: boolean;
  tokenCount?: number;
}

export function ReasoningTrace({
  steps,
  duration,
  isComplete = false,
  defaultOpen = false,
  tokenCount,
}: ReasoningTraceProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const getConfColor = (conf?: number) => {
    if (!conf) return 'var(--token-text-disabled)';
    if (conf >= 80) return 'var(--token-success)';
    if (conf >= 50) return 'var(--token-warning)';
    return 'var(--token-error)';
  };

  return (
    <DSCollapsible
      defaultOpen={defaultOpen}
      trigger={
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)', width: '100%' }}>
          <Brain size={13} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
          <span style={{
            fontSize: 'var(--token-text-xs)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
            fontFamily: 'var(--token-font-sans)',
          }}>
            Reasoning
          </span>
          <DSBadge variant="tertiary">{steps.length} steps</DSBadge>
          {tokenCount && (
            <div className="flex items-center" style={{ gap: 3 }}>
              <Zap size={9} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {tokenCount.toLocaleString()} tokens
              </span>
            </div>
          )}
          {duration && (
            <div className="flex items-center" style={{ gap: 3, marginLeft: 'auto' }}>
              <Clock size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {duration}
              </span>
            </div>
          )}
          {!isComplete && (
            <span style={{
              width: 6, height: 6,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-accent)',
              marginLeft: duration ? 0 : 'auto',
              animation: 'token-pulse 1.5s ease-in-out infinite',
              flexShrink: 0,
            }} />
          )}
        </div>
      }
    >
      <div className="flex flex-col" style={{
        gap: 0,
        paddingLeft: 'var(--token-space-5)',
        borderLeft: '1px solid var(--token-border)',
        marginLeft: 6,
        marginTop: 'var(--token-space-2)',
      }}>
        {steps.map((step, i) => {
          const hasSubSteps = step.subSteps && step.subSteps.length > 0;
          const isExpanded = expandedSteps.has(i);
          return (
            <div key={i}>
              <div
                className={`flex items-start ${hasSubSteps ? 'cursor-pointer' : ''}`}
                onClick={() => hasSubSteps && toggleStep(i)}
                style={{
                  gap: 'var(--token-space-2)',
                  padding: 'var(--token-space-1-5) 0',
                  position: 'relative',
                }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: `calc(-1 * var(--token-space-5) - 3px)`,
                  top: 10,
                  width: 5,
                  height: 5,
                  borderRadius: 'var(--token-radius-full)',
                  background: i === steps.length - 1 && !isComplete
                    ? 'var(--token-accent)'
                    : 'var(--token-text-disabled)',
                  border: '1px solid var(--token-bg)',
                }} />

                {/* Step content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
                    <span style={{
                      fontSize: 'var(--token-text-xs)',
                      color: 'var(--token-text-secondary)',
                      lineHeight: 'var(--token-leading-normal)',
                      fontFamily: 'var(--token-font-sans)',
                    }}>
                      {step.label}
                    </span>
                    {hasSubSteps && (
                      <ChevronDown size={10} style={{
                        color: 'var(--token-text-disabled)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 150ms ease',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>

                  {/* Step meta row */}
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginTop: 2 }}>
                    {step.confidence !== undefined && (
                      <div className="flex items-center" style={{ gap: 3 }}>
                        <div style={{
                          width: 24, height: 3,
                          borderRadius: 'var(--token-radius-full)',
                          background: 'var(--token-bg-tertiary)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${step.confidence}%`,
                            height: '100%',
                            borderRadius: 'var(--token-radius-full)',
                            background: getConfColor(step.confidence),
                          }} />
                        </div>
                        <span style={{
                          fontSize: 'var(--token-text-2xs)',
                          fontFamily: 'var(--token-font-mono)',
                          color: getConfColor(step.confidence),
                        }}>
                          {step.confidence}%
                        </span>
                      </div>
                    )}
                    {step.duration && (
                      <span style={{
                        fontSize: 'var(--token-text-2xs)',
                        fontFamily: 'var(--token-font-mono)',
                        color: 'var(--token-text-disabled)',
                      }}>
                        {step.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-steps */}
              {hasSubSteps && isExpanded && (
                <div style={{
                  paddingLeft: 'var(--token-space-4)',
                  paddingBottom: 'var(--token-space-1)',
                  animation: 'token-fade-in 150ms ease',
                }}>
                  {step.subSteps!.map((sub, si) => (
                    <div key={si} className="flex items-start" style={{
                      gap: 'var(--token-space-1-5)',
                      padding: '2px 0',
                    }}>
                      <span style={{
                        color: 'var(--token-text-disabled)',
                        fontSize: 'var(--token-text-2xs)',
                        fontFamily: 'var(--token-font-mono)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        {String(si + 1).padStart(2, '0')}
                      </span>
                      <span style={{
                        fontSize: 'var(--token-text-2xs)',
                        color: 'var(--token-text-tertiary)',
                        lineHeight: 'var(--token-leading-normal)',
                        fontFamily: 'var(--token-font-sans)',
                      }}>
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DSCollapsible>
  );
}

const sampleSteps: StepData[] = [
  { label: 'Analyzing the code structure and dependencies', confidence: 95, duration: '1.2s', subSteps: ['Parsing import graph', 'Identifying circular deps', 'Mapping module boundaries'] },
  { label: 'Identifying potential optimization points', confidence: 82, duration: '2.4s', subSteps: ['Profiling hot paths', 'Detecting redundant renders'] },
  { label: 'Evaluating algorithmic complexity of core functions', confidence: 74, duration: '3.1s' },
  { label: 'Cross-referencing with best practices and patterns', confidence: 88, duration: '2.8s' },
  { label: 'Generating refactored solution with explanations', confidence: 91, duration: '2.5s' },
];

export function ReasoningTraceDemo() {
  const [phase, setPhase] = useState<'building' | 'complete'>('building');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setPhase('building');
    setVisibleSteps(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    sampleSteps.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), 600 + i * 800));
    });
    timers.push(setTimeout(() => setPhase('complete'), 600 + sampleSteps.length * 800 + 300));
    return () => timers.forEach(t => clearTimeout(t));
  }, [key]);

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <ReasoningTrace
        steps={sampleSteps.slice(0, visibleSteps)}
        duration={phase === 'complete' ? '12s' : undefined}
        isComplete={phase === 'complete'}
        defaultOpen
        tokenCount={phase === 'complete' ? 1847 : undefined}
      />
      {phase === 'complete' && (
        <div className="flex justify-center" style={{ animation: 'token-fade-in 300ms ease' }}>
          <button
            onClick={() => setKey(k => k + 1)}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            replay reasoning
          </button>
        </div>
      )}
    </div>
  );
}
