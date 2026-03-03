/* —— AICommandPalette — Phase 3 Enhanced ——
   Phase 3: chained commands with pipe syntax, recent commands,
   contextual badges, command preview, execution status */
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, FileText, Image, Mic, Globe, Zap, ArrowRight, Slash, Clock, Link, Loader2, Check, X } from 'lucide-react';
import { DSBadge, DSKbd, DSDivider } from '../ds/atoms';

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  shortcut?: string[];
  category: string;
  badge?: string;
}

/* —— Command data —— */
const commands: CommandItem[] = [
  { id: 'explain', icon: <Sparkles size={14} />, label: 'Explain', description: 'Explain selected code or text', shortcut: ['E'], category: 'AI', badge: 'AI' },
  { id: 'edit', icon: <Code2 size={14} />, label: 'Edit Code', description: 'Modify code with natural language', shortcut: ['K'], category: 'AI', badge: 'AI' },
  { id: 'summarize', icon: <FileText size={14} />, label: 'Summarize', description: 'Create a concise summary', category: 'AI', badge: 'AI' },
  { id: 'generate-image', icon: <Image size={14} />, label: 'Generate Image', description: 'Create an image from description', category: 'AI', badge: 'New' },
  { id: 'transcribe', icon: <Mic size={14} />, label: 'Transcribe Audio', description: 'Convert speech to text', category: 'AI' },
  { id: 'search-web', icon: <Globe size={14} />, label: 'Search Web', description: 'Search the internet for answers', shortcut: ['S'], category: 'Tools' },
  { id: 'run-action', icon: <Zap size={14} />, label: 'Run Action', description: 'Execute a custom automation', category: 'Tools' },
];

/* —— Recent commands —— */
const recentCommands = [
  { id: 'r1', label: 'Summarize Q1 report', time: '2m ago' },
  { id: 'r2', label: 'Edit: refactor useEffect', time: '15m ago' },
  { id: 'r3', label: 'Search: React 19 features', time: '1h ago' },
];

export function AICommandPaletteDemo() {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [chainMode, setChainMode] = useState(false);
  const [chainSteps, setChainSteps] = useState<string[]>([]);
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  /* —— Detect pipe syntax for chaining —— */
  const hasPipe = query.includes('|');
  const queryParts = hasPipe ? query.split('|').map(s => s.trim()) : [query];
  const activeQuery = queryParts[queryParts.length - 1];

  const filtered = activeQuery
    ? commands.filter(c => c.label.toLowerCase().includes(activeQuery.toLowerCase()) || c.description.toLowerCase().includes(activeQuery.toLowerCase()))
    : commands;

  const categories = [...new Set(filtered.map(c => c.category))];
  const showRecent = !query && executionState === 'idle';

  /* —— Simulate execution —— */
  const handleExecute = () => {
    if (hasPipe) {
      setChainSteps(queryParts.filter(Boolean));
    }
    setExecutionState('running');
    setTimeout(() => setExecutionState('done'), 2000);
  };

  /* —— Keyboard handler —— */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{
      width: 440, borderRadius: 'var(--token-radius-xl)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      background: 'var(--token-bg)',
      overflow: 'hidden',
      fontFamily: 'var(--token-font-sans)',
      boxShadow: 'var(--token-shadow-xl)',
    }}>
      {/* Search input */}
      <div className="flex items-center" style={{
        gap: 8, padding: '12px 16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border)',
      }}>
        <Slash size={14} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedIdx(0); setExecutionState('idle'); }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search... (use | to chain)"
          style={{
            flex: 1, borderWidth: 0, borderStyle: 'none', outline: 'none', background: 'transparent',
            fontSize: 'var(--token-text-sm)', fontFamily: 'var(--token-font-sans)',
            color: 'var(--token-text-primary)',
          }}
        />
        <div className="flex items-center" style={{ gap: 2 }}>
          {executionState === 'running' && <Loader2 size={13} style={{ color: 'var(--token-accent)', animation: 'token-spin 1s linear infinite' }} />}
          {executionState === 'done' && <Check size={13} style={{ color: 'var(--token-success)' }} />}
          <DSKbd>Esc</DSKbd>
        </div>
      </div>

      {/* Chain preview */}
      {hasPipe && executionState === 'idle' && (
        <div className="flex items-center" style={{
          gap: 'var(--token-space-1-5)',
          padding: 'var(--token-space-2) var(--token-space-4)',
          background: 'var(--token-accent-light)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
          animation: 'token-fade-in 150ms ease',
          flexWrap: 'wrap',
        }}>
          <Link size={10} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)', fontFamily: 'var(--token-font-mono)' }}>
            Chain:
          </span>
          {queryParts.filter(Boolean).map((step, i) => (
            <div key={i} className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
              {i > 0 && <ArrowRight size={10} style={{ color: 'var(--token-text-disabled)' }} />}
              <DSBadge variant="default" style={{ fontSize: '9px' }}>{step}</DSBadge>
            </div>
          ))}
        </div>
      )}

      {/* Execution progress */}
      {executionState === 'running' && chainSteps.length > 0 && (
        <div className="flex flex-col" style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          gap: 'var(--token-space-2)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
          animation: 'token-fade-in 150ms ease',
        }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>
            Executing chain...
          </span>
          {chainSteps.map((step, i) => (
            <div key={i} className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
              <div style={{
                width: 16, height: 16,
                borderRadius: 'var(--token-radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === 0 ? 'var(--token-success)' : 'var(--token-bg-tertiary)',
              }}>
                {i === 0 ? <Check size={9} style={{ color: 'var(--token-text-inverse)' }} /> :
                 <span style={{ fontSize: '8px', color: 'var(--token-text-disabled)' }}>{i + 1}</span>}
              </div>
              <span style={{
                fontSize: 'var(--token-text-xs)',
                color: i === 0 ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent commands */}
      {showRecent && (
        <div style={{ padding: 'var(--token-space-1) 0' }}>
          <div style={{
            padding: '6px 16px',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-disabled)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Recent
          </div>
          {recentCommands.map(rc => (
            <div
              key={rc.id}
              className="flex items-center cursor-pointer"
              onClick={() => setQuery(rc.label)}
              style={{
                gap: 10, padding: '6px 16px',
                transition: 'background 80ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Clock size={12} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>
                {rc.label}
              </span>
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                {rc.time}
              </span>
            </div>
          ))}
          <DSDivider style={{ margin: '4px 0' }} />
        </div>
      )}

      {/* Command list */}
      {executionState === 'idle' && (
        <div style={{ maxHeight: 240, overflowY: 'auto', padding: 'var(--token-space-1) 0' }}>
          {categories.map((cat, catIdx) => {
            const catItems = filtered.filter(c => c.category === cat);
            return (
              <div key={cat}>
                {catIdx > 0 && <DSDivider style={{ margin: '4px 0' }} />}
                <div style={{
                  padding: '6px 16px',
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-disabled)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {cat}
                </div>
                {catItems.map((cmd) => {
                  const globalIdx = filtered.indexOf(cmd);
                  const isSelected = globalIdx === selectedIdx;
                  return (
                    <div
                      key={cmd.id}
                      className="flex items-center cursor-pointer"
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                      onClick={handleExecute}
                      style={{
                        gap: 10, padding: '8px 16px',
                        background: isSelected ? 'var(--token-bg-hover)' : 'transparent',
                        transition: 'background 80ms',
                      }}
                    >
                      <span style={{
                        width: 28, height: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'var(--token-radius-md)',
                        background: isSelected ? 'var(--token-accent-light)' : 'var(--token-bg-tertiary)',
                        color: isSelected ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                        flexShrink: 0,
                        transition: 'all 80ms',
                      }}>
                        {cmd.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center" style={{ gap: 6 }}>
                          <span style={{
                            fontSize: 'var(--token-text-sm)',
                            color: isSelected ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                          }}>
                            {cmd.label}
                          </span>
                          {cmd.badge && (
                            <DSBadge variant={cmd.badge === 'AI' ? 'ai' : cmd.badge === 'New' ? 'secondary' : 'default'}>
                              {cmd.badge}
                            </DSBadge>
                          )}
                        </div>
                        <span style={{
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-text-disabled)',
                        }}>
                          {cmd.description}
                        </span>
                      </div>
                      {cmd.shortcut && (
                        <div className="flex items-center" style={{ gap: 2 }}>
                          <DSKbd>{'/'}</DSKbd>
                          {cmd.shortcut.map(k => <DSKbd key={k}>{k}</DSKbd>)}
                        </div>
                      )}
                      {isSelected && (
                        <ArrowRight size={12} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-disabled)' }}>
                No commands found
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer hint */}
      <div className="flex items-center justify-between" style={{
        padding: '8px 16px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <div className="flex items-center" style={{ gap: 4 }}>
            <DSKbd>{'↑'}</DSKbd>
            <DSKbd>{'↓'}</DSKbd>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>navigate</span>
          </div>
          <div className="flex items-center" style={{ gap: 4 }}>
            <DSKbd>{'↵'}</DSKbd>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>select</span>
          </div>
          <div className="flex items-center" style={{ gap: 4 }}>
            <DSKbd>{'|'}</DSKbd>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>chain</span>
          </div>
        </div>
        <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
          {filtered.length} commands
        </span>
      </div>
    </div>
  );
}