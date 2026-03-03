import { DSSpinner } from '../ds/atoms';
import { useState, useEffect } from 'react';
import { X, RotateCcw, Clock, AlertTriangle, Check, Ban } from 'lucide-react';

/* —————————————————————————————————————————————————————
   AnalysisProgress — enhanced with cancellable stages,
   partial results, failed/cancelled states, elapsed time,
   overall progress bar, retry capability
   ————————————————————————————————————————————————————— */

type StepStatus = 'done' | 'active' | 'pending' | 'failed' | 'cancelled';

interface AnalysisStep {
  label: string;
  description?: string;
  status: StepStatus;
  duration?: number;
  result?: string;
}

interface AnalysisProgressProps {
  steps: AnalysisStep[];
  title?: string;
  onCancelStep?: (index: number) => void;
  onRetryStep?: (index: number) => void;
  onCancelAll?: () => void;
  showOverallProgress?: boolean;
}

export function AnalysisProgress({
  steps, title,
  onCancelStep, onRetryStep, onCancelAll,
  showOverallProgress = true,
}: AnalysisProgressProps) {
  const completedCount = steps.filter(s => s.status === 'done' || s.status === 'cancelled').length;
  const totalSteps = steps.length;
  const progressPct = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isRunning = steps.some(s => s.status === 'active');
  const hasFailed = steps.some(s => s.status === 'failed');
  const hasCancelled = steps.some(s => s.status === 'cancelled');
  const allDone = steps.every(s => s.status !== 'active' && s.status !== 'pending');

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'done': return 'var(--token-step-done)';
      case 'active': return 'var(--token-step-active)';
      case 'failed': return 'var(--token-error)';
      case 'cancelled': return 'var(--token-text-disabled)';
      default: return 'var(--token-step-pending)';
    }
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return <Check size={12} style={{ color: 'var(--token-accent-fg)' }} />;
      case 'active':
        return (
          <DSSpinner
            size={12}
            style={{ color: 'var(--token-accent-fg)', animation: 'token-spin 1s linear infinite' }}
          />
        );
      case 'failed':
        return <AlertTriangle size={10} style={{ color: 'var(--token-accent-fg)' }} />;
      case 'cancelled':
        return <Ban size={10} style={{ color: 'var(--token-text-disabled)' }} />;
      default:
        return (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-step-pending)',
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        padding: 'var(--token-space-4)',
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hasFailed ? 'var(--token-error)' : 'var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
        transition: 'border-color var(--token-duration-fast)',
      }}
    >
      {/* — Header — */}
      {title && (
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--token-tracking-wide)',
            }}
          >
            {title}
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {/* — Step counter — */}
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: allDone && !hasFailed ? 'var(--token-success)' : 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {completedCount}/{totalSteps}
            </span>
            {/* — Cancel all button — */}
            {isRunning && onCancelAll && (
              <button
                onClick={onCancelAll}
                className="cursor-pointer flex items-center"
                style={{
                  gap: 'var(--token-space-1)',
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-sans)',
                  padding: 'var(--token-space-0-5) var(--token-space-1-5)',
                  borderRadius: 'var(--token-radius-sm)',
                  transition: 'color var(--token-duration-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-error)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
              >
                <X size={10} />
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* — Overall progress bar — */}
      {showOverallProgress && (
        <div
          style={{
            height: 2,
            borderRadius: 1,
            background: 'var(--token-bg-tertiary)',
            marginBottom: 'var(--token-space-4)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              borderRadius: 1,
              background: hasFailed ? 'var(--token-error)' : allDone ? 'var(--token-success)' : 'var(--token-accent)',
              transition: 'width 500ms cubic-bezier(0.16,1,0.3,1), background 300ms ease',
            }}
          />
        </div>
      )}

      {/* — Steps — */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;

          return (
            <div key={i} className="flex" style={{ gap: 'var(--token-space-3)' }}>
              {/* — Step indicator + line — */}
              <div className="flex flex-col items-center" style={{ gap: 0 }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 'var(--token-radius-full)',
                    background: step.status === 'pending' ? 'transparent' : getStatusColor(step.status),
                    borderWidth: step.status === 'pending' ? 2 : 0,
                    borderStyle: 'solid',
                    borderColor: step.status === 'pending' ? getStatusColor(step.status) : 'transparent',
                    transition: 'all var(--token-duration-normal)',
                  }}
                >
                  {getStatusIcon(step.status)}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 20,
                      background: step.status === 'done' ? 'var(--token-step-done)' : 'var(--token-step-line)',
                      borderRadius: 1,
                      transition: 'background var(--token-duration-normal)',
                    }}
                  />
                )}
              </div>

              {/* — Content — */}
              <div
                className="flex-1"
                style={{
                  paddingBottom: isLast ? 0 : 'var(--token-space-5)',
                  paddingTop: 2,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: 'var(--token-text-sm)',
                      fontWeight: 'var(--token-weight-medium)',
                      color: step.status === 'pending'
                        ? 'var(--token-text-tertiary)'
                        : step.status === 'failed'
                          ? 'var(--token-error)'
                          : step.status === 'cancelled'
                            ? 'var(--token-text-disabled)'
                            : 'var(--token-text-primary)',
                      lineHeight: 'var(--token-leading-tight)',
                      display: 'block',
                      textDecoration: step.status === 'cancelled' ? 'line-through' : 'none',
                    }}
                  >
                    {step.label}
                  </span>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)', flexShrink: 0 }}>
                    {/* — Duration badge — */}
                    {step.duration != null && step.status !== 'pending' && (
                      <span
                        className="flex items-center"
                        style={{
                          gap: 'var(--token-space-1)',
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-text-disabled)',
                          fontFamily: 'var(--token-font-mono)',
                        }}
                      >
                        <Clock size={9} />
                        {formatDuration(step.duration)}
                      </span>
                    )}

                    {/* — Cancel button for active step — */}
                    {step.status === 'active' && onCancelStep && (
                      <button
                        onClick={() => onCancelStep(i)}
                        className="cursor-pointer flex items-center justify-center"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 'var(--token-radius-full)',
                          background: 'none',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'var(--token-border)',
                          color: 'var(--token-text-disabled)',
                          transition: 'all var(--token-duration-fast)',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--token-error)';
                          e.currentTarget.style.color = 'var(--token-error)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--token-border)';
                          e.currentTarget.style.color = 'var(--token-text-disabled)';
                        }}
                        title="Cancel this step"
                      >
                        <X size={10} />
                      </button>
                    )}

                    {/* — Retry button for failed step — */}
                    {step.status === 'failed' && onRetryStep && (
                      <button
                        onClick={() => onRetryStep(i)}
                        className="cursor-pointer flex items-center"
                        style={{
                          gap: 'var(--token-space-1)',
                          background: 'none',
                          border: 'none',
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-error)',
                          fontFamily: 'var(--token-font-sans)',
                          textDecoration: 'underline',
                          textUnderlineOffset: 2,
                        }}
                      >
                        <RotateCcw size={9} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* — Description — */}
                {step.description && (
                  <span
                    style={{
                      fontSize: 'var(--token-text-xs)',
                      color: step.status === 'failed' ? 'var(--token-error)' : 'var(--token-text-tertiary)',
                      lineHeight: 'var(--token-leading-normal)',
                      display: 'block',
                      marginTop: 'var(--token-space-0-5)',
                    }}
                  >
                    {step.description}
                  </span>
                )}

                {/* — Partial result for completed steps — */}
                {step.result && (step.status === 'done' || step.status === 'cancelled') && (
                  <div
                    style={{
                      marginTop: 'var(--token-space-1-5)',
                      padding: 'var(--token-space-1-5) var(--token-space-2-5)',
                      borderRadius: 'var(--token-radius-md)',
                      background: 'var(--token-bg-tertiary)',
                      fontSize: 'var(--token-text-xs)',
                      color: 'var(--token-text-secondary)',
                      fontFamily: 'var(--token-font-mono)',
                      animation: 'token-fade-in 200ms ease',
                    }}
                  >
                    {step.result}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* — Summary banner — */}
      {allDone && (
        <div
          className="flex items-center justify-center"
          style={{
            gap: 'var(--token-space-2)',
            marginTop: 'var(--token-space-3)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: hasFailed
              ? 'rgba(181,74,74,0.08)'
              : hasCancelled
                ? 'rgba(159,129,54,0.08)'
                : 'rgba(45,122,96,0.08)',
            animation: 'token-fade-in 300ms ease',
          }}
        >
          {hasFailed ? (
            <AlertTriangle size={12} style={{ color: 'var(--token-error)' }} />
          ) : hasCancelled ? (
            <Ban size={12} style={{ color: 'var(--token-warning)' }} />
          ) : (
            <Check size={12} style={{ color: 'var(--token-success)' }} />
          )}
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: hasFailed ? 'var(--token-error)' : hasCancelled ? 'var(--token-warning)' : 'var(--token-success)',
          }}>
            {hasFailed
              ? `Analysis incomplete — ${steps.filter(s => s.status === 'failed').length} step(s) failed`
              : hasCancelled
                ? `Analysis partially completed — ${steps.filter(s => s.status === 'done').length} of ${totalSteps} steps finished`
                : 'Analysis completed successfully'}
          </span>
        </div>
      )}
    </div>
  );
}

export function AnalysisProgressDemo() {
  const labels = [
    { label: 'Collecting data', descs: ['', 'Scanning sources...', 'Gathered 24 sources'], result: '24 sources found across 3 databases' },
    { label: 'Processing documents', descs: ['', 'Extracting key info...', 'Extracted 142 items'], result: '142 entities extracted' },
    { label: 'Analyzing patterns', descs: ['', 'Cross-referencing...', '3 patterns found'], result: '3 significant patterns identified' },
    { label: 'Generating report', descs: ['', 'Writing summary...', 'Report ready'], result: 'Summary report generated (2.4k words)' },
  ];
  const durations = [3, 5, 8, 4];
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<'running' | 'paused'>('running');
  const [cancelledSteps, setCancelledSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = setInterval(() => {
      setActiveIdx(prev => {
        let next = prev + 1;
        /* — Skip cancelled steps — */
        while (next < labels.length && cancelledSteps.has(next)) next++;
        if (next > labels.length) {
          setTimeout(() => { setActiveIdx(0); setPhase('running'); setCancelledSteps(new Set()); }, 2000);
          setPhase('paused');
          return labels.length;
        }
        return next;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, [phase, cancelledSteps]);

  const steps: AnalysisStep[] = labels.map((l, i) => ({
    label: l.label,
    description: cancelledSteps.has(i)
      ? 'Step cancelled by user'
      : i < activeIdx ? l.descs[2] : i === activeIdx ? l.descs[1] : undefined,
    status: cancelledSteps.has(i)
      ? 'cancelled' as const
      : i < activeIdx ? 'done' as const : i === activeIdx ? 'active' as const : 'pending' as const,
    duration: i < activeIdx && !cancelledSteps.has(i) ? durations[i] : undefined,
    result: i < activeIdx && !cancelledSteps.has(i) ? l.result : undefined,
  }));

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      <AnalysisProgress
        steps={steps}
        title="Analysis Pipeline"
        showOverallProgress
        onCancelStep={(idx) => {
          setCancelledSteps(prev => new Set(prev).add(idx));
          setActiveIdx(prev => prev + 1);
        }}
        onCancelAll={() => {
          const newCancelled = new Set(cancelledSteps);
          for (let i = activeIdx; i < labels.length; i++) newCancelled.add(i);
          setCancelledSteps(newCancelled);
          setActiveIdx(labels.length);
          setPhase('paused');
          setTimeout(() => { setActiveIdx(0); setPhase('running'); setCancelledSteps(new Set()); }, 2500);
        }}
      />
    </div>
  );
}