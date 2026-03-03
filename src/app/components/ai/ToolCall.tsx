/* ToolCall — Enhanced with parameter visibility, human-readable summary, parallel group view
   Composed from DS atoms (DSSpinner, DSBadge)
   Phase 3: collapsible params, summary line, multi-call group header */
import { useState, useEffect } from 'react';
import { Globe, Code, Database, Check, Loader, AlertCircle, ChevronDown, Wrench, FileSearch } from 'lucide-react';
import { DSSpinner, DSBadge } from '../ds/atoms';

type ToolStatus = 'running' | 'success' | 'error';

interface ToolCallProps {
  toolName: string;
  description: string;
  status: ToolStatus;
  result?: string;
  summary?: string;
  parameters?: Record<string, string | number | boolean>;
  icon?: 'search' | 'code' | 'database' | 'tool' | 'file';
  duration?: string;
}

const iconMap = {
  search: Globe,
  code: Code,
  database: Database,
  tool: Wrench,
  file: FileSearch,
};

export function ToolCall({ toolName, description, status, result, summary, parameters, icon = 'search', duration }: ToolCallProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[icon];

  const statusIcon = {
    running: <DSSpinner size={12} />,
    success: <Check size={12} style={{ color: 'var(--token-success)' }} />,
    error: <AlertCircle size={12} style={{ color: 'var(--token-error)' }} />,
  };

  const hasExpandable = result || parameters;

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-md)',
        border: `1px solid ${status === 'error' ? 'var(--token-error)' : 'var(--token-border)'}`,
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      <button
        onClick={() => hasExpandable && setExpanded(!expanded)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-3)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          border: 'none',
          background: 'var(--token-bg-secondary)',
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
          cursor: hasExpandable ? 'pointer' : 'default',
        }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 24, height: 24,
            borderRadius: 'var(--token-radius-sm)',
            background: status === 'error' ? 'rgba(181,74,74,0.1)' : 'var(--token-bg-tertiary)',
          }}
        >
          <Icon size={12} style={{ color: status === 'error' ? 'var(--token-error)' : 'var(--token-text-secondary)' }} />
        </div>

        <div className="flex flex-col flex-1" style={{ gap: 0, minWidth: 0 }}>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
            lineHeight: 'var(--token-leading-tight)',
          }}>
            {toolName}
          </span>
          <span className="truncate" style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
            lineHeight: 'var(--token-leading-tight)',
          }}>
            {description}
          </span>
          {/* Human-readable summary line */}
          {summary && status === 'success' && (
            <span style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-success)',
              lineHeight: 'var(--token-leading-tight)',
              marginTop: 2,
              animation: 'token-fade-in 300ms ease',
            }}>
              {summary}
            </span>
          )}
        </div>

        <div className="flex items-center shrink-0" style={{ gap: 'var(--token-space-2)' }}>
          {duration && status === 'success' && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {duration}
            </span>
          )}
          {statusIcon[status]}
          {hasExpandable && (
            <ChevronDown
              size={12}
              style={{
                color: 'var(--token-text-tertiary)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform var(--token-duration-normal)',
              }}
            />
          )}
        </div>
      </button>

      {expanded && (
        <div style={{
          borderTop: '1px solid var(--token-border)',
          animation: 'token-fade-in 150ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Parameters section */}
          {parameters && Object.keys(parameters).length > 0 && (
            <div style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              background: 'var(--token-bg-tertiary)',
              borderBottom: result ? '1px solid var(--token-border)' : undefined,
            }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}>
                Parameters
              </span>
              <div className="flex flex-col" style={{ gap: 2, marginTop: 4 }}>
                {Object.entries(parameters).map(([key, val]) => (
                  <div key={key} className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>
                      {key}:
                    </span>
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)', fontFamily: 'var(--token-font-mono)' }}>
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Result section */}
          {result && (
            <div style={{
              padding: 'var(--token-space-3)',
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-secondary)',
              fontFamily: 'var(--token-font-mono)',
              lineHeight: 'var(--token-leading-relaxed)',
              background: 'var(--token-bg)',
              whiteSpace: 'pre-wrap',
              maxHeight: 120,
              overflowY: 'auto',
            }}>
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -- ToolCallGroup: shows parallel tool calls with a group header -- */
interface ToolCallGroupProps {
  tools: ToolCallProps[];
  label?: string;
}

export function ToolCallGroup({ tools, label }: ToolCallGroupProps) {
  const running = tools.filter(t => t.status === 'running').length;
  const done = tools.filter(t => t.status === 'success').length;
  const failed = tools.filter(t => t.status === 'error').length;

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <Wrench size={11} style={{ color: 'var(--token-text-disabled)' }} />
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {label || `${tools.length} tools`}
          {running > 0 && ` — ${running} running`}
          {done > 0 && ` — ${done} done`}
          {failed > 0 && ` — ${failed} failed`}
        </span>
      </div>
      {tools.map((tool, i) => (
        <div key={i} style={{ animation: `token-fade-in 200ms ease ${i * 100}ms both` }}>
          <ToolCall {...tool} />
        </div>
      ))}
    </div>
  );
}

export function ToolCallDemo() {
  const toolDefs = [
    {
      toolName: 'Web Search', description: 'Searching for "transformer architecture explained"', icon: 'search' as const,
      result: 'Found 12 results from arxiv.org, wikipedia.org, and 3 other sources.',
      summary: 'Found 12 relevant articles',
      parameters: { query: '"transformer architecture explained"', limit: 10, safe_search: true },
      duration: '1.2s',
    },
    {
      toolName: 'Code Interpreter', description: 'Running Python code to generate visualization', icon: 'code' as const,
      result: 'Visualization generated successfully. Output saved to /tmp/chart.png',
      summary: 'Generated 1 chart',
      parameters: { language: 'python', timeout: '30s' },
      duration: '3.4s',
    },
    {
      toolName: 'Query Database', description: 'Fetching user preferences from settings', icon: 'database' as const,
      result: '{ "theme": "dark", "language": "en", "model": "gpt-4o" }',
      summary: 'Retrieved 3 preference keys',
      parameters: { table: 'user_settings', user_id: 'usr_abc123' },
      duration: '0.3s',
    },
  ];

  const [statuses, setStatuses] = useState<ToolStatus[]>(['running', 'running', 'running']);
  const [visibleCount, setVisibleCount] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setStatuses(['running', 'running', 'running']);
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setVisibleCount(1), 200));
    timers.push(setTimeout(() => setStatuses(s => s.map((v, i) => i === 0 ? 'success' : v) as ToolStatus[]), 1200));
    timers.push(setTimeout(() => setVisibleCount(2), 1400));
    timers.push(setTimeout(() => setStatuses(s => s.map((v, i) => i === 1 ? 'success' : v) as ToolStatus[]), 3000));
    timers.push(setTimeout(() => setVisibleCount(3), 3200));
    timers.push(setTimeout(() => setStatuses(s => s.map((v, i) => i === 2 ? 'success' : v) as ToolStatus[]), 3800));
    return () => timers.forEach(t => clearTimeout(t));
  }, [key]);

  const allDone = statuses.every(s => s === 'success');

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', maxWidth: 420, width: '100%' }}>
      {/* Group header */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <Wrench size={11} style={{ color: 'var(--token-text-disabled)' }} />
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {visibleCount} of 3 tools {allDone ? '— all completed' : '— running in parallel'}
        </span>
      </div>
      {toolDefs.slice(0, visibleCount).map((tool, i) => (
        <div key={i} style={{ animation: 'token-fade-in 200ms ease' }}>
          <ToolCall
            toolName={tool.toolName}
            description={tool.description}
            status={statuses[i]}
            icon={tool.icon}
            duration={statuses[i] === 'success' ? tool.duration : undefined}
            result={statuses[i] === 'success' ? tool.result : undefined}
            summary={statuses[i] === 'success' ? tool.summary : undefined}
            parameters={tool.parameters}
          />
        </div>
      ))}
      {allDone && (
        <div className="flex justify-center" style={{ marginTop: 'var(--token-space-2)', animation: 'token-fade-in 300ms ease' }}>
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
            replay sequence
          </button>
        </div>
      )}
    </div>
  );
}
