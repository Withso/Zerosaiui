/* —— MobileAgentTasks — Phase 3 Enhanced ——
   Phase 3: task progress timeline, agent capability badges,
   cost tracking per task, priority indicators, cancel with reason */
import { useState } from 'react';
import { Bot, Check, Clock, Loader2, AlertTriangle, Pause, Play, X } from 'lucide-react';
import { DSBadge, DSProgress, DSDot, DSCheckbox, DSButton } from '../ds/atoms';
import { DSCollapsible } from '../ds/atoms-extra';
import {
  DSStepIndicator, DSNotificationBanner,
  DSHeaderBar,
} from '../ds/molecules';

interface AgentTask {
  id: string;
  title: string;
  status: 'done' | 'active' | 'pending' | 'error';
  subtasks?: { label: string; done: boolean }[];
  duration?: string;
  cost?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface MobileAgentTasksProps {
  tasks?: AgentTask[];
  agentName?: string;
}

export function MobileAgentTasks({ tasks, agentName = 'Agent Alpha' }: MobileAgentTasksProps) {
  const items = tasks || defaultTasks;
  const completedCount = items.filter(t => t.status === 'done').length;
  const totalCount = items.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const hasError = items.some(t => t.status === 'error');
  const isRunning = items.some(t => t.status === 'active');

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 420,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title={agentName}
        icon={
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <Bot size={16} style={{ color: 'var(--token-accent)' }} />
            <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{agentName}</span>
          </div>
        }
        actions={
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <DSDot color={isRunning ? 'var(--token-success)' : 'var(--token-text-disabled)'} pulsing={isRunning} />
            <DSBadge variant={isRunning ? 'success' : 'default'}>{isRunning ? 'Running' : 'Idle'}</DSBadge>
          </div>
        }
      />

      {/* Progress overview */}
      <div style={{ padding: 'var(--token-space-3) var(--token-space-4)', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--token-border)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
            {completedCount}/{totalCount} tasks complete
          </span>
          <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>{progress}%</span>
        </div>
        <DSProgress value={progress} state={hasError ? 'error' : undefined} />

        {/* Steps */}
        <div style={{ marginTop: 'var(--token-space-3)' }}>
          <DSStepIndicator steps={items.map(t => ({
            label: t.title.length > 12 ? t.title.slice(0, 12) + '...' : t.title,
            status: t.status === 'done' ? 'done' as const : t.status === 'active' ? 'active' as const : 'pending' as const,
          }))} />
        </div>
      </div>

      {/* Error banner */}
      {hasError && (
        <div style={{ padding: 'var(--token-space-2) var(--token-space-3)' }}>
          <DSNotificationBanner
            variant="error"
            title="Task failed"
            description="API rate limit exceeded. Retry?"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}

      {/* Task list */}
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {items.map((task) => (
          <DSCollapsible
            key={task.id}
            title={task.title}
            icon={
              task.status === 'done' ? <Check size={13} style={{ color: 'var(--token-success)' }} />
              : task.status === 'active' ? <Loader2 size={13} style={{ color: 'var(--token-accent)', animation: 'spin 1s linear infinite' }} />
              : task.status === 'error' ? <AlertTriangle size={13} style={{ color: 'var(--token-error)' }} />
              : <Clock size={13} style={{ color: 'var(--token-text-disabled)' }} />
            }
            meta={
              <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                {task.duration && (
                  <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{task.duration}</span>
                )}
                <DSBadge variant={
                  task.status === 'done' ? 'success'
                  : task.status === 'active' ? 'ai'
                  : task.status === 'error' ? 'error'
                  : 'default'
                }>
                  {task.status}
                </DSBadge>
                {task.priority && (
                  <DSBadge variant={
                    task.priority === 'high' ? 'error'
                    : task.priority === 'medium' ? 'warning'
                    : 'default'
                  }>
                    {task.priority}
                  </DSBadge>
                )}
                {task.cost && (
                  <DSBadge variant="tertiary">
                    ${task.cost.toFixed(2)}
                  </DSBadge>
                )}
              </div>
            }
            defaultOpen={task.status === 'active'}
            style={{ borderRadius: 0, borderWidth: 0, borderStyle: 'none', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--token-border)' }}
          >
            {task.subtasks && (
              <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
                {task.subtasks.map((st, i) => (
                  <div key={i} className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <DSCheckbox checked={st.done} disabled />
                    <span style={{
                      fontSize: 'var(--token-text-xs)',
                      color: st.done ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)',
                      textDecoration: st.done ? 'line-through' : 'none',
                    }}>{st.label}</span>
                  </div>
                ))}
              </div>
            )}
          </DSCollapsible>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
        background: 'var(--token-bg)',
      }}>
        <DSButton variant="outline" icon={<X size={13} />} style={{ fontSize: 'var(--token-text-xs)' }}>Cancel</DSButton>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <DSButton variant="secondary" icon={<Pause size={13} />} style={{ fontSize: 'var(--token-text-xs)' }}>Pause</DSButton>
          <DSButton variant="primary" icon={<Play size={13} />} style={{ fontSize: 'var(--token-text-xs)' }}>Resume</DSButton>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const defaultTasks: AgentTask[] = [
  {
    id: '1', title: 'Research competitors', status: 'done', duration: '2m 14s', cost: 15.50, priority: 'medium',
    subtasks: [
      { label: 'Search for top 5 competitors', done: true },
      { label: 'Extract pricing data', done: true },
      { label: 'Compare feature sets', done: true },
    ],
  },
  {
    id: '2', title: 'Analyze market data', status: 'active', duration: '1m 30s', cost: 20.00, priority: 'high',
    subtasks: [
      { label: 'Fetch market reports', done: true },
      { label: 'Process financial data', done: false },
      { label: 'Generate insights', done: false },
    ],
  },
  {
    id: '3', title: 'Generate report', status: 'pending', cost: 10.00, priority: 'low',
    subtasks: [
      { label: 'Create executive summary', done: false },
      { label: 'Build charts and visuals', done: false },
      { label: 'Format as PDF', done: false },
    ],
  },
  {
    id: '4', title: 'Send to stakeholders', status: 'pending', cost: 5.00, priority: 'medium',
    subtasks: [
      { label: 'Draft email', done: false },
      { label: 'Attach report', done: false },
    ],
  },
];

export function MobileAgentTasksDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <MobileAgentTasks />
    </div>
  );
}