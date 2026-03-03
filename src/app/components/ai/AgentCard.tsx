/* AgentCard — Enhanced with pause/resume, progress, live log streaming
   Composed from DS atoms (DSBadge, DSButton, DSDot, DSProgress)
   Phase 3: pausable tasks, live log, progress indicator */
import { Bot, Zap, Shield, Palette, Code, MessageSquare, Pause, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { DSBadge, DSButton, DSDot, DSProgress } from '../ds/atoms';
import { useState, useEffect, useRef } from 'react';

type AgentStatus = 'online' | 'busy' | 'offline' | 'paused';

interface AgentCardProps {
  name: string;
  role: string;
  description?: string;
  status?: AgentStatus;
  avatar?: React.ReactNode;
  capabilities?: string[];
  progress?: number;
  onChat?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  logEntries?: string[];
}

const statusColors: Record<AgentStatus, string> = {
  online: 'var(--token-success)',
  busy: 'var(--token-warning)',
  offline: 'var(--token-text-disabled)',
  paused: 'var(--token-text-tertiary)',
};

const statusLabels: Record<AgentStatus, string> = {
  online: 'Online',
  busy: 'Running',
  offline: 'Offline',
  paused: 'Paused',
};

export function AgentCard({
  name,
  role,
  description,
  status = 'online',
  avatar,
  capabilities,
  progress,
  onChat,
  onPause,
  onResume,
  logEntries,
}: AgentCardProps) {
  const statusDotColor = statusColors[status];
  const [hovered, setHovered] = useState(false);
  const [logExpanded, setLogExpanded] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll log to bottom */
  useEffect(() => {
    if (logExpanded && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries, logExpanded]);

  const isPausable = status === 'busy' || status === 'paused';
  const hasLog = logEntries && logEntries.length > 0;

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: `1px solid ${hovered ? 'var(--token-border-strong)' : 'var(--token-border)'}`,
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
        transition: 'border-color 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.05)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-3)', padding: 'var(--token-space-4)' }}>
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 'var(--token-radius-lg)', background: 'var(--token-text-primary)', color: 'var(--token-text-inverse)' }}
          >
            {avatar || <Bot size={20} />}
          </div>
          <div className="absolute" style={{ bottom: -1, right: -1 }}>
            <DSDot color={statusDotColor} size={12} pulsing={status === 'online' || status === 'busy'} />
          </div>
        </div>

        <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-0-5)', minWidth: 0 }}>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-primary)' }}>
              {name}
            </span>
            <DSBadge variant={status === 'busy' ? 'streaming' : status === 'paused' ? 'warning' : 'default'}>
              {statusLabels[status]}
            </DSBadge>
          </div>
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>{role}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {isPausable && (
            <DSButton
              variant="icon"
              icon={status === 'paused' ? <Play size={14} /> : <Pause size={14} />}
              onClick={status === 'paused' ? onResume : onPause}
              title={status === 'paused' ? 'Resume' : 'Pause'}
              style={{ width: 32, height: 32 }}
            />
          )}
          <DSButton variant="icon" icon={<MessageSquare size={14} />} onClick={onChat} style={{ width: 32, height: 32 }} />
        </div>
      </div>

      {/* Progress bar for running/paused tasks */}
      {isPausable && progress !== undefined && (
        <div style={{ padding: '0 var(--token-space-4) var(--token-space-2)' }}>
          <DSProgress
            value={progress}
            state={status === 'paused' ? undefined : undefined}
            eta={status === 'paused' ? 'Paused' : undefined}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <div style={{ padding: '0 var(--token-space-4) var(--token-space-3)' }}>
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-normal)' }}>
            {description}
          </span>
        </div>
      )}

      {/* Capabilities */}
      {capabilities && capabilities.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-1)', padding: '0 var(--token-space-4) var(--token-space-3)' }}>
          {capabilities.map((cap, i) => (
            <DSBadge key={i} variant="default" style={{ fontSize: 'var(--token-text-2xs)' }}>{cap}</DSBadge>
          ))}
        </div>
      )}

      {/* Live log panel */}
      {hasLog && (
        <div style={{ borderTop: '1px solid var(--token-border)' }}>
          <button
            onClick={() => setLogExpanded(!logExpanded)}
            className="flex items-center w-full cursor-pointer"
            style={{
              gap: 'var(--token-space-2)',
              padding: 'var(--token-space-2) var(--token-space-4)',
              border: 'none',
              background: 'var(--token-bg-secondary)',
              color: 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {logExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            Live Log ({logEntries.length} entries)
          </button>
          {logExpanded && (
            <div
              ref={logRef}
              style={{
                maxHeight: 120,
                overflowY: 'auto',
                padding: 'var(--token-space-2) var(--token-space-4)',
                background: 'var(--token-bg-secondary)',
                fontFamily: 'var(--token-font-mono)',
                fontSize: 'var(--token-text-2xs)',
                lineHeight: 'var(--token-leading-relaxed)',
              }}
            >
              {logEntries.map((entry, i) => (
                <div key={i} style={{
                  color: entry.startsWith('[ERROR]') ? 'var(--token-error)' : entry.startsWith('[DONE]') ? 'var(--token-success)' : 'var(--token-text-disabled)',
                  animation: i === logEntries.length - 1 ? 'token-fade-in 200ms ease' : undefined,
                }}>
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AgentCardDemo() {
  const [agents, setAgents] = useState([
    { name: 'Coder', role: 'Software Engineer Agent', description: 'Writes, reviews, and debugs code across multiple languages and frameworks.', status: 'busy' as AgentStatus, avatar: <Code size={20} />, capabilities: ['TypeScript', 'Python', 'React', 'Testing'], progress: 45, logEntries: ['[START] Analyzing codebase...', '[INFO] Found 12 files to review', '[INFO] Reviewing src/components...'] },
    { name: 'Designer', role: 'UI/UX Design Agent', description: 'Creates interfaces, design systems, and visual assets.', status: 'online' as AgentStatus, avatar: <Palette size={20} />, capabilities: ['Figma', 'Tailwind', 'Responsive', 'A11y'], progress: undefined, logEntries: [] },
    { name: 'Researcher', role: 'Research & Analysis Agent', description: undefined, status: 'offline' as AgentStatus, avatar: <Shield size={20} />, capabilities: ['Web Search', 'Summarize', 'Cite'], progress: undefined, logEntries: [] },
  ]);
  const [chatAgent, setChatAgent] = useState<string | null>(null);

  /* Simulate progress for busy agent */
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(a => {
        if (a.status === 'busy' && a.progress !== undefined && a.progress < 95) {
          const newProgress = Math.min(a.progress + Math.random() * 5, 95);
          const newLog = newProgress > 70 && a.logEntries.length < 5
            ? [...a.logEntries, `[INFO] Processing step ${a.logEntries.length + 1}...`]
            : a.logEntries;
          return { ...a, progress: Math.round(newProgress), logEntries: newLog };
        }
        return a;
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const togglePause = (idx: number) => {
    setAgents(prev => prev.map((a, i) => {
      if (i !== idx) return a;
      if (a.status === 'busy') return { ...a, status: 'paused' as AgentStatus };
      if (a.status === 'paused') return { ...a, status: 'busy' as AgentStatus };
      return a;
    }));
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', maxWidth: 360, width: '100%' }}>
      {agents.map((agent, i) => (
        <div key={agent.name} style={{ position: 'relative' }}>
          <AgentCard
            name={agent.name}
            role={agent.role}
            description={agent.description}
            status={agent.status}
            avatar={agent.avatar}
            capabilities={agent.capabilities}
            progress={agent.progress}
            logEntries={agent.logEntries}
            onChat={() => setChatAgent(chatAgent === agent.name ? null : agent.name)}
            onPause={() => togglePause(i)}
            onResume={() => togglePause(i)}
          />
          {chatAgent === agent.name && (
            <div style={{
              marginTop: 'var(--token-space-1)',
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: '1px solid var(--token-accent)',
              background: 'var(--token-bg-hover)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-secondary)',
              fontFamily: 'var(--token-font-mono)',
              animation: 'token-fade-in 200ms ease',
            }}>
              Chat session with {agent.name} agent started...
            </div>
          )}
        </div>
      ))}
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
        textAlign: 'center',
      }}>
        Coder agent is running with live progress
      </span>
    </div>
  );
}
