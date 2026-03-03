import { useState, useEffect, useRef } from 'react';
import {
  Terminal, Copy, Check, X, Minimize2, Search,
  ChevronDown, ChevronUp, Trash2, ArrowDown, Pause, Play,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  text: string;
  timestamp?: string;
}

interface TerminalOutputProps {
  title?: string;
  lines?: TerminalLine[];
  cwd?: string;
  maxHeight?: number;
  showTimestamps?: boolean;
  status?: 'idle' | 'running' | 'complete' | 'error';
  onClear?: () => void;
}

/* —— Line colors —— */
const lineColors: Record<string, string> = {
  command: 'var(--token-code-text)',
  output: 'var(--token-code-comment)',
  error: 'var(--token-error)',
  success: 'var(--token-success)',
  info: 'var(--token-accent)',
};

const lineIcons: Record<string, string> = {
  command: '$',
  error: '\u2717',
  success: '\u2713',
  info: '\u2139',
};

export function TerminalOutput({
  title = 'Terminal',
  lines,
  cwd = '~/project',
  maxHeight = 280,
  showTimestamps = false,
  status = 'idle',
  onClear,
}: TerminalOutputProps) {
  const items = lines || defaultLines;
  const [copied, setCopied] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const bodyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* —— Auto-scroll —— */
  useEffect(() => {
    if (autoScroll && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [items.length, autoScroll]);

  /* —— Focus search input —— */
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleCopy = () => {
    const text = selectedLines.size > 0
      ? items.filter((_, i) => selectedLines.has(i)).map(l => l.text).join('\n')
      : items.map(l => l.text).join('\n');
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLine = (idx: number) => {
    setSelectedLines(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  /* —— Search filter —— */
  const filteredLines = searchQuery
    ? items.map((line, i) => ({
        ...line,
        idx: i,
        matches: line.text.toLowerCase().includes(searchQuery.toLowerCase()),
      }))
    : items.map((line, i) => ({ ...line, idx: i, matches: true }));

  /* —— Status config —— */
  const statusConfig = {
    idle: { badge: 'default' as const, label: 'Idle' },
    running: { badge: 'ai' as const, label: 'Running' },
    complete: { badge: 'success' as const, label: 'Done' },
    error: { badge: 'error' as const, label: 'Error' },
  };

  const errorCount = items.filter(l => l.type === 'error').length;
  const successCount = items.filter(l => l.type === 'success').length;

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-mono)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: status === 'error' ? 'var(--token-error)' : 'var(--token-border)',
        width: '100%',
      }}
    >
      {/* —— Title bar —— */}
      <div
        className="flex items-center"
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          background: 'var(--token-bg-secondary)',
          borderBottom: '1px solid var(--token-border)',
          gap: 'var(--token-space-2)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center" style={{ gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: 'var(--token-error)' }} />
          <div style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: 'var(--token-warning)' }} />
          <div style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: 'var(--token-success)' }} />
        </div>

        <span
          className="flex-1 text-center truncate"
          style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
          }}
        >
          {title} — {cwd}
        </span>

        {/* Status badge */}
        <DSBadge variant={statusConfig[status].badge} style={{ fontSize: 'var(--token-text-2xs)' }}>
          {statusConfig[status].label}
        </DSBadge>

        {/* Error/success counts */}
        {errorCount > 0 && (
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)' }}>
            {errorCount} err
          </span>
        )}

        {/* Toolbar buttons */}
        <DSButton
          variant="icon"
          icon={<Search size={11} />}
          onClick={() => setSearchOpen(!searchOpen)}
          style={{
            width: 22, height: 22,
            color: searchOpen ? 'var(--token-accent)' : 'var(--token-text-disabled)',
          }}
        />
        <DSButton
          variant="icon"
          icon={copied ? <Check size={11} /> : <Copy size={11} />}
          onClick={handleCopy}
          style={{
            width: 22, height: 22,
            color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)',
          }}
        />
        {onClear && (
          <DSButton
            variant="icon"
            icon={<Trash2 size={11} />}
            onClick={onClear}
            style={{ width: 22, height: 22, color: 'var(--token-text-disabled)' }}
          />
        )}
      </div>

      {/* —— Search bar —— */}
      {searchOpen && (
        <div
          className="flex items-center"
          style={{
            padding: 'var(--token-space-1-5) var(--token-space-3)',
            background: 'var(--token-bg-tertiary)',
            borderBottom: '1px solid var(--token-border-subtle)',
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 120ms ease',
          }}
        >
          <Search size={11} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter output..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-primary)',
            }}
          />
          {searchQuery && (
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
              {filteredLines.filter(l => l.matches).length} matches
            </span>
          )}
          <DSButton
            variant="icon"
            icon={<X size={10} />}
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            style={{ width: 18, height: 18, color: 'var(--token-text-disabled)' }}
          />
        </div>
      )}

      {/* —— Terminal body —— */}
      <div
        ref={bodyRef}
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          background: 'var(--token-code-bg)',
          maxHeight,
          overflowY: 'auto',
        }}
        onScroll={() => {
          if (bodyRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
            setAutoScroll(scrollHeight - scrollTop - clientHeight < 30);
          }
        }}
      >
        {filteredLines.map(({ type, text, timestamp, idx, matches }) => (
          <div
            key={idx}
            className="flex"
            onClick={() => toggleLine(idx)}
            style={{
              gap: 'var(--token-space-2)',
              lineHeight: 'var(--token-leading-relaxed)',
              fontSize: 'var(--token-text-xs)',
              cursor: 'pointer',
              padding: '1px var(--token-space-1)',
              marginLeft: 'calc(-1 * var(--token-space-1))',
              marginRight: 'calc(-1 * var(--token-space-1))',
              borderRadius: 'var(--token-radius-sm)',
              background: selectedLines.has(idx)
                ? 'color-mix(in srgb, var(--token-accent) 12%, transparent)'
                : 'transparent',
              opacity: searchQuery && !matches ? 0.25 : 1,
              transition: 'background 100ms ease, opacity 100ms ease',
              animation: !searchQuery ? `token-fade-in 200ms ease ${idx * 40}ms both` : undefined,
            }}
            onMouseEnter={e => {
              if (!selectedLines.has(idx)) {
                e.currentTarget.style.background = 'color-mix(in srgb, var(--token-accent) 5%, transparent)';
              }
            }}
            onMouseLeave={e => {
              if (!selectedLines.has(idx)) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {/* Line number */}
            <span style={{
              color: 'var(--token-text-disabled)',
              flexShrink: 0,
              userSelect: 'none',
              width: 20,
              textAlign: 'right',
              fontSize: 'var(--token-text-2xs)',
              lineHeight: 'var(--token-leading-relaxed)',
              opacity: 0.5,
            }}>
              {idx + 1}
            </span>

            {/* Type indicator */}
            {lineIcons[type] && (
              <span style={{ color: lineColors[type], flexShrink: 0, userSelect: 'none' }}>
                {lineIcons[type]}
              </span>
            )}
            {type === 'output' && (
              <span style={{ width: '1em', flexShrink: 0 }} />
            )}

            {/* Text */}
            <span style={{
              color: lineColors[type] || 'var(--token-code-comment)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              flex: 1,
            }}>
              {searchQuery && matches ? highlightMatch(text, searchQuery) : text}
            </span>

            {/* Timestamp */}
            {showTimestamps && timestamp && (
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                flexShrink: 0,
                opacity: 0.5,
              }}>
                {timestamp}
              </span>
            )}
          </div>
        ))}

        {/* Blinking cursor */}
        {(status === 'idle' || status === 'running') && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginTop: 2, paddingLeft: 28 }}>
            <span style={{ color: 'var(--token-success)', fontSize: 'var(--token-text-xs)' }}>$</span>
            <span
              style={{
                width: 7,
                height: 14,
                background: status === 'running' ? 'var(--token-accent)' : 'var(--token-code-comment)',
                animation: 'token-blink 1s step-end infinite',
              }}
            />
          </div>
        )}
      </div>

      {/* —— Status bar —— */}
      {selectedLines.size > 0 && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-1-5) var(--token-space-3)',
            background: 'var(--token-bg-secondary)',
            borderTop: '1px solid var(--token-border)',
            animation: 'token-fade-in 120ms ease',
          }}
        >
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
            {selectedLines.size} line{selectedLines.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <DSButton
              variant="ghost"
              onClick={handleCopy}
              style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-0-5) var(--token-space-2)' }}
            >
              {copied ? <Check size={9} /> : <Copy size={9} />}
              {copied ? 'Copied' : 'Copy selected'}
            </DSButton>
            <DSButton
              variant="ghost"
              onClick={() => setSelectedLines(new Set())}
              style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-0-5) var(--token-space-2)' }}
            >
              Clear
            </DSButton>
          </div>
        </div>
      )}

      {/* —— Auto-scroll indicator —— */}
      {!autoScroll && status === 'running' && (
        <div
          className="flex items-center justify-center"
          style={{
            padding: 'var(--token-space-1)',
            background: 'var(--token-bg-secondary)',
            borderTop: '1px solid var(--token-border-subtle)',
            cursor: 'pointer',
          }}
          onClick={() => {
            setAutoScroll(true);
            if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--token-space-1)',
          }}>
            <ArrowDown size={9} /> Scroll to bottom
          </span>
        </div>
      )}
    </div>
  );
}

/* —— Highlight helper —— */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} style={{
        background: 'color-mix(in srgb, var(--token-warning) 30%, transparent)',
        borderRadius: 2,
        padding: '0 1px',
      }}>
        {part}
      </span>
    ) : part
  );
}

/* —— Default lines —— */
const defaultLines: TerminalLine[] = [
  { type: 'command', text: 'npm install @ai-sdk/openai' },
  { type: 'output', text: 'added 23 packages in 3.2s' },
  { type: 'success', text: '23 packages are looking for funding' },
  { type: 'command', text: 'npm run build' },
  { type: 'info', text: 'Building for production...' },
  { type: 'output', text: 'dist/index.js    42.3 kB \u2502 gzip: 14.1 kB' },
  { type: 'output', text: 'dist/style.css    8.7 kB \u2502 gzip:  2.4 kB' },
  { type: 'success', text: 'Built in 1.24s' },
  { type: 'command', text: 'npm test' },
  { type: 'output', text: 'PASS  src/components/ChatInput.test.tsx' },
  { type: 'output', text: 'PASS  src/components/Message.test.tsx' },
  { type: 'error', text: 'FAIL  src/components/ToolCall.test.tsx' },
  { type: 'error', text: '  Expected: "success"  Received: "error"' },
  { type: 'output', text: 'Tests: 1 failed, 2 passed, 3 total' },
];

/* —— Demo —— */
export function TerminalOutputDemo() {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(paused);
  pauseRef.current = paused;

  useEffect(() => {
    setVisibleLines([]);
    setDone(false);
    setPaused(false);
    let idx = 0;
    const timer = setInterval(() => {
      if (pauseRef.current) return;
      idx++;
      if (idx > defaultLines.length) {
        setDone(true);
        clearInterval(timer);
        return;
      }
      setVisibleLines(defaultLines.slice(0, idx));
    }, 280);
    return () => clearInterval(timer);
  }, [key]);

  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      <TerminalOutput
        lines={visibleLines}
        status={done ? (visibleLines.some(l => l.type === 'error') ? 'error' : 'complete') : 'running'}
      />
      <div className="flex items-center justify-center" style={{
        marginTop: 'var(--token-space-2)',
        gap: 'var(--token-space-3)',
      }}>
        {!done && (
          <button
            onClick={() => setPaused(!paused)}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {paused ? <Play size={9} /> : <Pause size={9} />}
            {paused ? 'resume' : 'pause'}
          </button>
        )}
        {done && (
          <button
            onClick={() => setKey(k => k + 1)}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
              animation: 'token-fade-in 300ms ease',
            }}
          >
            replay output
          </button>
        )}
      </div>
    </div>
  );
}
