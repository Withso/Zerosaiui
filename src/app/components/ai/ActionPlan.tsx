import { useState, useEffect, useRef } from 'react';
import { Check, Circle, Loader, ChevronDown, Sparkles, Clock, SkipForward, AlertTriangle, ChevronRight } from 'lucide-react';
import { DSButton, DSProgress } from '../ds/atoms';

/* —————————————————————————————————————————————————————
   ActionPlan — enhanced with per-step timing, subtasks,
   skip step, overall progress bar, ETA, detail expansion
   ————————————————————————————————————————————————————— */

type StepStatus = 'pending' | 'running' | 'done' | 'skipped' | 'failed';

interface PlanSubtask {
  label: string;
  done?: boolean;
}

interface PlanStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  duration?: number;
  subtasks?: PlanSubtask[];
}

interface ActionPlanProps {
  title?: string;
  steps: PlanStep[];
  onApprove?: () => void;
  onEdit?: () => void;
  onSkipStep?: (stepId: string) => void;
  onRetryStep?: (stepId: string) => void;
  showProgress?: boolean;
  estimatedTotalSeconds?: number;
}

export function ActionPlan({
  title = 'Action Plan',
  steps,
  onApprove,
  onEdit,
  onSkipStep,
  onRetryStep,
  showProgress = true,
  estimatedTotalSeconds,
}: ActionPlanProps) {
  const [expanded, setExpanded] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const completedCount = steps.filter(s => s.status === 'done' || s.status === 'skipped').length;
  const isRunning = steps.some(s => s.status === 'running');
  const allDone = steps.every(s => s.status === 'done' || s.status === 'skipped');
  const hasFailed = steps.some(s => s.status === 'failed');
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  /* — ETA calculation based on average completed step duration — */
  const completedDurations = steps.filter(s => s.status === 'done' && s.duration).map(s => s.duration!);
  const avgDuration = completedDurations.length > 0
    ? completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length
    : null;
  const remainingSteps = steps.filter(s => s.status === 'pending' || s.status === 'running').length;
  const etaSeconds = estimatedTotalSeconds
    ? Math.max(0, estimatedTotalSeconds - completedDurations.reduce((a, b) => a + b, 0))
    : avgDuration
      ? Math.round(avgDuration * remainingSteps)
      : null;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const getStepIcon = (step: PlanStep) => {
    switch (step.status) {
      case 'done':
        return (
          <div
            className="flex items-center justify-center"
            style={{
              width: 18,
              height: 18,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-step-done)',
            }}
          >
            <Check size={10} style={{ color: 'var(--token-accent-fg)' }} />
          </div>
        );
      case 'running':
        return (
          <div
            className="flex items-center justify-center"
            style={{
              width: 18,
              height: 18,
              borderRadius: 'var(--token-radius-full)',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'var(--token-step-active)',
            }}
          >
            <Loader
              size={10}
              style={{
                color: 'var(--token-step-active)',
                animation: 'token-spin 1s linear infinite',
              }}
            />
          </div>
        );
      case 'skipped':
        return (
          <div
            className="flex items-center justify-center"
            style={{
              width: 18,
              height: 18,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-bg-tertiary)',
            }}
          >
            <SkipForward size={9} style={{ color: 'var(--token-text-disabled)' }} />
          </div>
        );
      case 'failed':
        return (
          <div
            className="flex items-center justify-center"
            style={{
              width: 18,
              height: 18,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-error)',
            }}
          >
            <AlertTriangle size={9} style={{ color: 'var(--token-accent-fg)' }} />
          </div>
        );
      default:
        return <Circle size={18} style={{ color: 'var(--token-step-pending)' }} />;
    }
  };

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hasFailed ? 'var(--token-error)' : 'var(--token-border)',
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
        transition: 'border-color var(--token-duration-fast)',
      }}
    >
      {/* — Header — */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-3)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          border: 'none',
          background: 'var(--token-bg-secondary)',
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
        }}
      >
        <Sparkles size={14} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}
        >
          {title}
        </span>
        {/* — ETA badge — */}
        {isRunning && etaSeconds !== null && etaSeconds > 0 && (
          <span
            className="flex items-center"
            style={{
              gap: 'var(--token-space-1)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
              animation: 'token-fade-in 200ms ease',
            }}
          >
            <Clock size={10} />
            ~{formatDuration(etaSeconds)}
          </span>
        )}
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: allDone ? 'var(--token-success)' : 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
          }}
        >
          {completedCount}/{steps.length}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--token-text-tertiary)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* — Overall progress bar — */}
      {showProgress && expanded && (
        <div
          style={{
            height: 2,
            background: 'var(--token-bg-tertiary)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: hasFailed ? 'var(--token-error)' : allDone ? 'var(--token-success)' : 'var(--token-accent)',
              transition: 'width 500ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>
      )}

      {expanded && (
        <div style={{ padding: 'var(--token-space-2) var(--token-space-4) var(--token-space-4)' }}>
          {/* — Steps — */}
          <div className="flex flex-col" style={{ gap: 0 }}>
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              const isStepExpanded = expandedSteps.has(step.id);
              const hasExpandable = step.subtasks && step.subtasks.length > 0;
              return (
                <div key={step.id} className="flex" style={{ gap: 'var(--token-space-3)' }}>
                  {/* — Vertical line + icon — */}
                  <div
                    className="flex flex-col items-center"
                    style={{ width: 20, flexShrink: 0, paddingTop: 'var(--token-space-3)' }}
                  >
                    {getStepIcon(step)}
                    {!isLast && (
                      <div
                        style={{
                          width: 1.5,
                          flex: 1,
                          background: step.status === 'done' ? 'var(--token-step-done)' : 'var(--token-step-line)',
                          minHeight: 12,
                          transition: 'background var(--token-duration-normal)',
                        }}
                      />
                    )}
                  </div>

                  {/* — Step content — */}
                  <div
                    className="flex flex-col flex-1"
                    style={{
                      gap: 'var(--token-space-0-5)',
                      paddingTop: 'var(--token-space-3)',
                      paddingBottom: isLast ? 0 : 'var(--token-space-2)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center flex-1"
                        style={{ gap: 'var(--token-space-1-5)', cursor: hasExpandable ? 'pointer' : 'default' }}
                        onClick={() => hasExpandable && toggleStepExpand(step.id)}
                      >
                        {hasExpandable && (
                          <ChevronRight
                            size={10}
                            style={{
                              color: 'var(--token-text-disabled)',
                              transform: isStepExpanded ? 'rotate(90deg)' : 'rotate(0)',
                              transition: 'transform var(--token-duration-fast)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 'var(--token-text-sm)',
                            fontWeight: 'var(--token-weight-medium)',
                            color:
                              step.status === 'done' || step.status === 'skipped'
                                ? 'var(--token-text-tertiary)'
                                : step.status === 'running'
                                  ? 'var(--token-text-primary)'
                                  : step.status === 'failed'
                                    ? 'var(--token-error)'
                                    : 'var(--token-text-secondary)',
                            textDecoration: step.status === 'done' ? 'line-through' : step.status === 'skipped' ? 'line-through' : 'none',
                          }}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* — Step duration — */}
                      {step.duration != null && (step.status === 'done' || step.status === 'running') && (
                        <span
                          className="flex items-center"
                          style={{
                            gap: 'var(--token-space-1)',
                            fontSize: 'var(--token-text-2xs)',
                            color: 'var(--token-text-disabled)',
                            fontFamily: 'var(--token-font-mono)',
                            flexShrink: 0,
                          }}
                        >
                          <Clock size={9} />
                          {formatDuration(step.duration)}
                        </span>
                      )}

                      {/* — Skip button for pending steps — */}
                      {step.status === 'pending' && onSkipStep && (
                        <button
                          onClick={() => onSkipStep(step.id)}
                          className="cursor-pointer flex items-center"
                          style={{
                            gap: 'var(--token-space-1)',
                            background: 'none',
                            border: 'none',
                            fontSize: 'var(--token-text-2xs)',
                            color: 'var(--token-text-disabled)',
                            fontFamily: 'var(--token-font-sans)',
                            padding: 'var(--token-space-0-5) var(--token-space-1)',
                            borderRadius: 'var(--token-radius-sm)',
                            transition: 'color var(--token-duration-fast)',
                            opacity: 0.6,
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-secondary)'; e.currentTarget.style.opacity = '1'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; e.currentTarget.style.opacity = '0.6'; }}
                          title="Skip this step"
                        >
                          <SkipForward size={10} />
                          Skip
                        </button>
                      )}

                      {/* — Retry button for failed steps — */}
                      {step.status === 'failed' && onRetryStep && (
                        <button
                          onClick={() => onRetryStep(step.id)}
                          className="cursor-pointer"
                          style={{
                            fontSize: 'var(--token-text-2xs)',
                            color: 'var(--token-error)',
                            fontFamily: 'var(--token-font-sans)',
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            textUnderlineOffset: 2,
                            flexShrink: 0,
                          }}
                        >
                          Retry
                        </button>
                      )}
                    </div>

                    {step.description && (
                      <span
                        style={{
                          fontSize: 'var(--token-text-xs)',
                          color: step.status === 'failed' ? 'var(--token-error)' : 'var(--token-text-tertiary)',
                          lineHeight: 'var(--token-leading-normal)',
                        }}
                      >
                        {step.description}
                      </span>
                    )}

                    {/* — Subtasks — */}
                    {hasExpandable && isStepExpanded && (
                      <div
                        className="flex flex-col"
                        style={{
                          gap: 'var(--token-space-1)',
                          marginTop: 'var(--token-space-1-5)',
                          paddingLeft: 'var(--token-space-2)',
                          animation: 'token-fade-in 150ms ease',
                        }}
                      >
                        {step.subtasks!.map((sub, si) => (
                          <div
                            key={si}
                            className="flex items-center"
                            style={{ gap: 'var(--token-space-2)' }}
                          >
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: 'var(--token-radius-full)',
                                borderWidth: sub.done ? 0 : 1,
                                borderStyle: 'solid',
                                borderColor: 'var(--token-border)',
                                background: sub.done ? 'var(--token-step-done)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {sub.done && <Check size={7} style={{ color: 'var(--token-accent-fg)' }} />}
                            </div>
                            <span
                              style={{
                                fontSize: 'var(--token-text-xs)',
                                color: sub.done ? 'var(--token-text-tertiary)' : 'var(--token-text-secondary)',
                                textDecoration: sub.done ? 'line-through' : 'none',
                              }}
                            >
                              {sub.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* — Actions — */}
          {!isRunning && !allDone && (
            <div
              className="flex items-center"
              style={{
                gap: 'var(--token-space-2)',
                marginTop: 'var(--token-space-4)',
                paddingLeft: 32,
              }}
            >
              <DSButton variant="primary" onClick={onApprove}>
                Approve & Run
              </DSButton>
              <DSButton variant="outline" onClick={onEdit}>
                Edit Plan
              </DSButton>
            </div>
          )}

          {/* — Completion banner — */}
          {allDone && (
            <div
              className="flex items-center justify-center"
              style={{
                gap: 'var(--token-space-2)',
                marginTop: 'var(--token-space-3)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                background: hasFailed ? 'rgba(181,74,74,0.08)' : 'rgba(45,122,96,0.08)',
                animation: 'token-fade-in 300ms ease',
              }}
            >
              {hasFailed ? (
                <AlertTriangle size={12} style={{ color: 'var(--token-error)' }} />
              ) : (
                <Check size={12} style={{ color: 'var(--token-success)' }} />
              )}
              <span style={{
                fontSize: 'var(--token-text-xs)',
                color: hasFailed ? 'var(--token-error)' : 'var(--token-success)',
                fontFamily: 'var(--token-font-sans)',
              }}>
                {hasFailed
                  ? `Completed with ${steps.filter(s => s.status === 'failed').length} failed step(s)`
                  : completedDurations.length > 0
                    ? `All steps completed in ${formatDuration(completedDurations.reduce((a, b) => a + b, 0))}`
                    : 'All steps completed successfully'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ActionPlanDemo() {
  const [steps, setSteps] = useState<PlanStep[]>([
    {
      id: '1',
      label: 'Analyze the codebase structure',
      description: 'Scan files and identify the project architecture',
      status: 'pending',
      subtasks: [
        { label: 'Scan directory tree', done: false },
        { label: 'Identify entry points', done: false },
        { label: 'Map dependencies', done: false },
      ],
    },
    {
      id: '2',
      label: 'Create component files',
      description: 'Generate React components with TypeScript',
      status: 'pending',
      subtasks: [
        { label: 'Create component skeletons', done: false },
        { label: 'Add prop interfaces', done: false },
      ],
    },
    { id: '3', label: 'Write unit tests', status: 'pending' },
    {
      id: '4',
      label: 'Update documentation',
      description: 'Add JSDoc comments and update README',
      status: 'pending',
    },
  ]);
  const [running, setRunning] = useState(false);

  const handleApprove = () => {
    if (running) return;
    setRunning(true);
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' as const, duration: undefined,
      subtasks: s.subtasks?.map(st => ({ ...st, done: false })),
    })));

    const durations = [2, 3, 1, 2];
    const advance = (idx: number) => {
      if (idx >= steps.length) {
        setRunning(false);
        return;
      }
      /* — Skip skipped steps — */
      setSteps(prev => {
        if (prev[idx].status === 'skipped') {
          setTimeout(() => advance(idx + 1), 200);
          return prev;
        }
        return prev.map((s, i) => ({
          ...s,
          status: i < idx ? 'done' as const : i === idx ? 'running' as const : s.status,
        }));
      });

      /* — Simulate subtask progress — */
      setSteps(prev => {
        const step = prev[idx];
        if (step.status === 'skipped') return prev;
        if (step.subtasks) {
          let subIdx = 0;
          const subTimer = setInterval(() => {
            setSteps(p => p.map((s, i) => i === idx ? {
              ...s,
              subtasks: s.subtasks?.map((st, si) => si <= subIdx ? { ...st, done: true } : st),
            } : s));
            subIdx++;
            if (subIdx >= (step.subtasks?.length || 0)) clearInterval(subTimer);
          }, 400);
        }
        return prev;
      });

      setTimeout(() => {
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i <= idx ? 'done' as const : i === idx + 1 ? 'running' as const : s.status,
          duration: i === idx ? durations[idx] : s.duration,
          subtasks: i === idx ? s.subtasks?.map(st => ({ ...st, done: true })) : s.subtasks,
        })));
        setTimeout(() => advance(idx + 1), 600);
      }, durations[idx] * 400);
    };
    setTimeout(() => advance(0), 300);
  };

  const handleSkip = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'skipped' as const } : s));
  };

  const allDone = steps.every(s => s.status === 'done' || s.status === 'skipped');

  return (
    <div style={{ maxWidth: 440, width: '100%' }}>
      <ActionPlan
        title="Implementation Plan"
        steps={steps}
        onApprove={handleApprove}
        onEdit={() => {
          setSteps(prev => prev.map(s => ({
            ...s, status: 'pending' as const, duration: undefined,
            subtasks: s.subtasks?.map(st => ({ ...st, done: false })),
          })));
          setRunning(false);
        }}
        onSkipStep={handleSkip}
        showProgress
      />
    </div>
  );
}
