/* —— MeetingNotes — Phase 3 Enhanced ——
   Phase 3: meeting sentiment indicator, decision log section,
   follow-up scheduling, export with template, AI confidence badge */
import { useState } from 'react';
import { FileText, Users, Clock, CheckCircle, Sparkles, Copy, Share2, ChevronDown, ChevronUp, Pencil, Calendar, TrendingUp, Download, Check } from 'lucide-react';
import { DSButton, DSBadge, DSAvatar, DSDivider, DSTag } from '../ds/atoms';
import { DSHeaderBar } from '../ds/molecules';

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  done: boolean;
  dueDate?: string;
}

interface Decision {
  id: string;
  text: string;
  category: string;
}

const mockActions: ActionItem[] = [
  { id: '1', text: 'Finalize token naming convention for L4 component tokens', assignee: 'Sarah', done: true, dueDate: 'Mar 5' },
  { id: '2', text: 'Create Figma variables for the Geological Intelligence palette', assignee: 'Alex', done: false, dueDate: 'Mar 7' },
  { id: '3', text: 'Audit all mobile components for DS atom composition', assignee: 'Jordan', done: false, dueDate: 'Mar 10' },
  { id: '4', text: 'Write migration guide for v1 to v2 token architecture', assignee: 'Sarah', done: false, dueDate: 'Mar 12' },
];

const mockDecisions: Decision[] = [
  { id: 'd1', text: 'Adopt 4-level token architecture as standard', category: 'Architecture' },
  { id: 'd2', text: 'Use Geological Intelligence palette for all product surfaces', category: 'Design' },
];

const keyTopics = ['Token Architecture', 'Color Palette', 'Mobile Components', 'Figma Sync'];

export function MeetingNotesDemo() {
  const [actions, setActions] = useState(mockActions);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [decisionsExpanded, setDecisionsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const doneCount = actions.filter(a => a.done).length;

  return (
    <div style={{
      width: 420, borderRadius: 'var(--token-radius-xl)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      background: 'var(--token-bg)',
      overflow: 'hidden', fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="Design System Sync"
        icon={<FileText size={14} style={{ color: 'var(--token-accent)' }} />}
        actions={
          <div className="flex items-center" style={{ gap: 6 }}>
            <DSBadge variant="ai">AI Notes</DSBadge>
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-success)',
              padding: '0 4px',
              borderRadius: 'var(--token-radius-sm)',
              background: 'var(--token-success-light)',
            }}>
              96% conf
            </span>
          </div>
        }
      />

      {/* Meeting meta */}
      <div className="flex items-center" style={{
        gap: 12, padding: 'var(--token-space-3) var(--token-space-4)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border-subtle)',
      }}>
        <div className="flex items-center" style={{ gap: 4 }}>
          <Clock size={11} style={{ color: 'var(--token-text-disabled)' }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
            45 min
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <Users size={11} style={{ color: 'var(--token-text-disabled)' }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
            3 participants
          </span>
        </div>
        {/* Sentiment */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <TrendingUp size={11} style={{ color: 'var(--token-success)' }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-success)' }}>
            Productive
          </span>
        </div>
        <div className="flex items-center" style={{ gap: -4, marginLeft: 'auto' }}>
          {['ai', 'user', 'system'].map((v, i) => (
            <DSAvatar key={i} variant={v as any} size={20} style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--token-bg)', marginLeft: i > 0 ? -6 : 0, position: 'relative', zIndex: 3 - i }} />
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div style={{ padding: 'var(--token-space-3) var(--token-space-4)' }}>
        <button
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="flex items-center w-full cursor-pointer"
          style={{
            borderWidth: 0, borderStyle: 'none', background: 'transparent', padding: 0,
            gap: 6, marginBottom: summaryExpanded ? 8 : 0,
          }}
        >
          <Sparkles size={12} style={{ color: 'var(--token-accent)' }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', flex: 1, textAlign: 'left' }}>
            AI Summary
          </span>
          {summaryExpanded ? <ChevronUp size={12} style={{ color: 'var(--token-text-disabled)' }} /> : <ChevronDown size={12} style={{ color: 'var(--token-text-disabled)' }} />}
        </button>
        {summaryExpanded && (
          <div style={{
            padding: 'var(--token-space-3)',
            background: 'var(--token-accent-muted)',
            borderRadius: 'var(--token-radius-md)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-accent-light)',
            animation: 'token-fade-in 200ms ease',
          }}>
            <p style={{
              margin: 0, fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-secondary)',
              lineHeight: 'var(--token-leading-relaxed)',
            }}>
              Team reviewed the 4-level token architecture and agreed on the Geological Intelligence color palette naming. Mobile component audit is pending. Next step: create Figma variables and migration guide.
            </p>
          </div>
        )}
      </div>

      {/* Key Topics */}
      <div style={{ padding: '0 var(--token-space-4) var(--token-space-3)' }}>
        <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
          Key Topics
        </span>
        <div className="flex flex-wrap" style={{ gap: 4 }}>
          {keyTopics.map(t => <DSTag key={t}>{t}</DSTag>)}
        </div>
      </div>

      {/* Decisions */}
      <div style={{ padding: '0 var(--token-space-4) var(--token-space-2)' }}>
        <button
          onClick={() => setDecisionsExpanded(!decisionsExpanded)}
          className="flex items-center w-full cursor-pointer"
          style={{
            borderWidth: 0, borderStyle: 'none', background: 'transparent', padding: 0,
            gap: 6, marginBottom: decisionsExpanded ? 8 : 0,
          }}
        >
          <CheckCircle size={11} style={{ color: 'var(--token-success)' }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', flex: 1, textAlign: 'left' }}>
            Decisions ({mockDecisions.length})
          </span>
          {decisionsExpanded ? <ChevronUp size={12} style={{ color: 'var(--token-text-disabled)' }} /> : <ChevronDown size={12} style={{ color: 'var(--token-text-disabled)' }} />}
        </button>
        {decisionsExpanded && (
          <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', animation: 'token-fade-in 150ms ease' }}>
            {mockDecisions.map(d => (
              <div key={d.id} className="flex items-start" style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-success-light)',
              }}>
                <Check size={11} style={{ color: 'var(--token-success)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', display: 'block' }}>
                    {d.text}
                  </span>
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                    {d.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DSDivider />

      {/* Action Items */}
      <div style={{ padding: 'var(--token-space-3) var(--token-space-4)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Action Items
          </span>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>
            {doneCount}/{actions.length}
          </span>
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          {actions.map(a => (
            <div
              key={a.id}
              className="flex items-start"
              style={{
                gap: 8, padding: 'var(--token-space-1-5) 0',
                opacity: a.done ? 0.5 : 1,
                transition: 'opacity 200ms',
              }}
            >
              <div
                onClick={() => toggleAction(a.id)}
                className="flex items-center justify-center cursor-pointer shrink-0"
                style={{
                  width: 16, height: 16, borderRadius: 'var(--token-radius-sm)', marginTop: 2,
                  borderWidth: a.done ? 0 : '1.5px',
                  borderStyle: a.done ? 'none' : 'solid',
                  borderColor: 'var(--token-border)',
                  background: a.done ? 'var(--token-accent)' : 'transparent',
                  transition: 'all 120ms',
                }}
              >
                {a.done && <CheckCircle size={10} style={{ color: 'var(--token-accent-fg)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-primary)',
                  textDecoration: a.done ? 'line-through' : 'none',
                }}>
                  {a.text}
                </span>
                <div className="flex items-center" style={{ marginTop: 2, gap: 'var(--token-space-2)' }}>
                  <DSBadge variant="secondary">{a.assignee}</DSBadge>
                  {a.dueDate && (
                    <span className="flex items-center" style={{
                      gap: 2,
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-disabled)',
                      fontFamily: 'var(--token-font-mono)',
                    }}>
                      <Calendar size={8} />
                      {a.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <DSButton variant="ghost" icon={<Pencil size={12} />}>Edit</DSButton>
        <div className="flex items-center" style={{ gap: 4 }}>
          <DSButton
            variant="ghost"
            icon={copied ? <Check size={12} /> : <Copy size={12} />}
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          />
          <DSButton variant="ghost" icon={<Download size={12} />} />
          <DSButton variant="ghost" icon={<Share2 size={12} />} />
        </div>
      </div>
    </div>
  );
}
