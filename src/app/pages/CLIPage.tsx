/* ================================================
   CLI Page — Interactive zeros-aiui CLI Simulator
   
   Full documentation + interactive terminal for the
   shadcn-style CLI distribution system.
   ================================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import {
  Terminal, Package, Copy, Check, ChevronRight,
  Download, Layers, Sparkles, Search, Info,
  ArrowRight, GitBranch, FileCode, Palette,
  Code, Zap, Box, LayoutGrid,
} from 'lucide-react';
import { parseAndExecute, cmdHelp, cmdList, cmdAdd, cmdInfo, type CommandResult } from '../cli/commands';
import { resolve } from '../cli/resolver';
import { DEFAULT_CONFIG, generateConfigFile } from '../cli/config';
import { cliRegistry, registryStats, type CLIComponentEntry } from '../data/cliRegistry';
import { generateSourcePreview } from '../cli/sourceTransformer';
import { generateCLIPackage, generateTokensPackage, renderFileTree, type PackageFile } from '../cli/packageScaffold';

/* ——————————————————————————————————————————
   Interactive Terminal Component
   —————————————————————————————————————————— */

function CLITerminal() {
  const [history, setHistory] = useState<CommandResult[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const execute = useCallback(() => {
    if (!input.trim()) return;
    const result = parseAndExecute(input);
    setHistory(prev => [...prev, result]);
    setCmdHistory(prev => [input, ...prev]);
    setInput('');
    setCmdIdx(-1);
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      execute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(nextIdx);
      if (cmdHistory[nextIdx]) setInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(cmdIdx - 1, -1);
      setCmdIdx(nextIdx);
      setInput(nextIdx >= 0 ? cmdHistory[nextIdx] : '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  }, [execute, cmdHistory, cmdIdx]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        background: '#0d1117',
        fontFamily: 'var(--token-font-mono)',
        fontSize: 'var(--token-text-xs)',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          background: '#161b22',
          borderBottom: '1px solid #30363d',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <div className="flex" style={{ gap: 'var(--token-space-1-5)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: '#ff5f57' }} />
            <span style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: '#febc2e' }} />
            <span style={{ width: 10, height: 10, borderRadius: 'var(--token-radius-full)', background: '#28c840' }} />
          </div>
          <span style={{ color: '#8b949e', fontSize: 'var(--token-text-2xs)' }}>
            zeros-aiui
          </span>
        </div>
        <Terminal size={12} style={{ color: '#8b949e' }} />
      </div>

      {/* Terminal body */}
      <div
        ref={termRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          padding: 'var(--token-space-3)',
          minHeight: 300,
          maxHeight: 480,
          overflowY: 'auto',
          cursor: 'text',
        }}
      >
        {/* Welcome message */}
        {history.length === 0 && (
          <div style={{ color: '#8b949e', marginBottom: 'var(--token-space-3)' }}>
            <div style={{ color: '#58a6ff' }}>  zeros-aiui CLI simulator</div>
            <div>  Type a command to try it out. Start with `--help`</div>
            <div style={{ marginTop: 'var(--token-space-1)' }}>
              <span style={{ color: '#484f58' }}>  Try: </span>
              <span style={{ color: '#7ee787' }}>add chat-message</span>
              <span style={{ color: '#484f58' }}> | </span>
              <span style={{ color: '#7ee787' }}>list chat</span>
              <span style={{ color: '#484f58' }}> | </span>
              <span style={{ color: '#7ee787' }}>info reasoning-trace</span>
            </div>
          </div>
        )}

        {/* Command history */}
        {history.map((entry, i) => (
          <div key={i} style={{ marginBottom: 'var(--token-space-3)' }}>
            <div style={{ color: '#c9d1d9' }}>
              <span style={{ color: '#7ee787' }}>$</span>{' '}
              <span style={{ color: '#58a6ff' }}>{entry.command}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} style={{
                color: line.includes('Error') || line.includes('\u26a0')
                  ? '#f85149'
                  : line.includes('Done') || line.includes('\u2728')
                    ? '#7ee787'
                    : line.startsWith('    +')
                      ? '#58a6ff'
                      : '#c9d1d9',
                whiteSpace: 'pre',
              }}>
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <span style={{ color: '#7ee787' }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="npx zeros-aiui ..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#c9d1d9',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-mono)',
              caretColor: '#58a6ff',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Quick Action Buttons
   —————————————————————————————————————————— */

function QuickCommand({ cmd, label, onClick }: { cmd: string; label: string; onClick: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onClick}
      style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        borderRadius: 'var(--token-radius-md)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; e.currentTarget.style.background = 'var(--token-bg-secondary)'; }}
    >
      <div className="flex flex-col" style={{ gap: 1 }}>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>{label}</span>
        <code style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-mono)' }}>{cmd}</code>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center cursor-pointer"
        style={{
          width: 28, height: 28,
          borderRadius: 'var(--token-radius-sm)',
          border: '1px solid var(--token-border)',
          background: 'var(--token-bg)',
          color: copied ? 'var(--token-success)' : 'var(--token-text-tertiary)',
          flexShrink: 0,
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

/* ——————————————————————————————————————————
   Dependency Tree Visualizer
   —————————————————————————————————————————— */

function DependencyTree({ componentId }: { componentId: string }) {
  const plan = resolve([componentId]);
  const entry = cliRegistry.find(c => c.id === componentId);
  if (!entry) return null;

  const atoms = plan.all.filter(e => e.type === 'atom' || e.type === 'atom-extra');
  const molecules = plan.all.filter(e => e.type === 'molecule' || e.type === 'molecule-ai');

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-1)', fontFamily: 'var(--token-font-mono)', fontSize: 'var(--token-text-2xs)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        <Box size={11} style={{ color: 'var(--token-accent)' }} />
        <span style={{ color: 'var(--token-text-primary)' }}>{entry.name}</span>
      </div>
      {atoms.length > 0 && (
        <div style={{ paddingLeft: 16 }}>
          {atoms.map((a, i) => (
            <div key={a.id} className="flex items-center" style={{ gap: 'var(--token-space-1)', color: 'var(--token-chart-5)' }}>
              <span style={{ color: 'var(--token-text-disabled)' }}>{i === atoms.length - 1 && molecules.length === 0 ? '\u2514' : '\u251c'}</span>
              <span>{a.name}</span>
            </div>
          ))}
        </div>
      )}
      {molecules.length > 0 && (
        <div style={{ paddingLeft: 16 }}>
          {molecules.map((m, i) => (
            <div key={m.id} className="flex items-center" style={{ gap: 'var(--token-space-1)', color: 'var(--token-chart-4)' }}>
              <span style={{ color: 'var(--token-text-disabled)' }}>{i === molecules.length - 1 ? '\u2514' : '\u251c'}</span>
              <span>{m.name}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ paddingLeft: 16 }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)', color: 'var(--token-chart-3)' }}>
          <span style={{ color: 'var(--token-text-disabled)' }}>{'\u2514'}</span>
          <Palette size={9} />
          <span>tokens.css</span>
        </div>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Component Browser
   —————————————————————————————————————————— */

function ComponentBrowser() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const aiComponents = cliRegistry.filter(c => c.type === 'ai-component');
  const filtered = search
    ? aiComponents.filter(c =>
        c.id.includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      )
    : aiComponents;

  /* Group by category */
  const grouped = new Map<string, CLIComponentEntry[]>();
  for (const e of filtered) {
    if (!grouped.has(e.category)) grouped.set(e.category, []);
    grouped.get(e.category)!.push(e);
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    Chat: <Sparkles size={12} />,
    Processing: <Zap size={12} />,
    Response: <Code size={12} />,
    Voice: <LayoutGrid size={12} />,
    Research: <Search size={12} />,
    Image: <Palette size={12} />,
    Agentic: <GitBranch size={12} />,
    System: <Layers size={12} />,
    Mobile: <Box size={12} />,
    Mixed: <Package size={12} />,
    'Real-World AI': <FileCode size={12} />,
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-4)' }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--token-text-disabled)',
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search components..."
          style={{
            width: '100%',
            padding: 'var(--token-space-2) var(--token-space-3) var(--token-space-2) 32px',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg)',
            color: 'var(--token-text-primary)',
            fontSize: 'var(--token-text-sm)',
            fontFamily: 'var(--token-font-sans)',
            outline: 'none',
          }}
        />
        <span style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {filtered.length}/{aiComponents.length}
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-col" style={{ gap: 'var(--token-space-4)' }}>
        {Array.from(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="flex items-center" style={{
              gap: 'var(--token-space-1-5)',
              marginBottom: 'var(--token-space-2)',
              color: 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {categoryIcons[cat] || <Box size={12} />}
              {cat}
              <span style={{ color: 'var(--token-text-disabled)' }}>({items.length})</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--token-space-2)',
            }}>
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                  className="flex flex-col cursor-pointer"
                  style={{
                    padding: 'var(--token-space-2) var(--token-space-3)',
                    borderRadius: 'var(--token-radius-md)',
                    border: `1px solid ${selectedId === item.id ? 'var(--token-accent)' : 'var(--token-border)'}`,
                    background: selectedId === item.id ? 'var(--token-accent-muted)' : 'var(--token-bg)',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                    gap: 2,
                  }}
                >
                  <span style={{
                    fontSize: 'var(--token-text-xs)',
                    color: 'var(--token-text-primary)',
                    fontFamily: 'var(--token-font-mono)',
                  }}>
                    {item.id}
                  </span>
                  <span style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-tertiary)',
                    lineHeight: 'var(--token-leading-normal)',
                  }}>
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected component detail */}
      {selectedId && (
        <div style={{
          padding: 'var(--token-space-4)',
          borderRadius: 'var(--token-radius-lg)',
          border: '1px solid var(--token-accent)',
          background: 'var(--token-bg-secondary)',
        }}>
          <div className="flex items-start justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--token-text-md)', color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-mono)' }}>
                {cliRegistry.find(c => c.id === selectedId)?.name}
              </div>
              <div style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', marginTop: 2 }}>
                {cliRegistry.find(c => c.id === selectedId)?.description}
              </div>
            </div>
            <CopyableCommand cmd={`npx zeros-aiui add ${selectedId}`} />
          </div>
          <DependencyTree componentId={selectedId} />
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————————
   Copyable Command
   —————————————————————————————————————————— */

function CopyableCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="flex items-center cursor-pointer"
      style={{
        gap: 'var(--token-space-1-5)',
        padding: 'var(--token-space-1) var(--token-space-2)',
        borderRadius: 'var(--token-radius-sm)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
        color: copied ? 'var(--token-success)' : 'var(--token-text-secondary)',
        fontSize: 'var(--token-text-2xs)',
        fontFamily: 'var(--token-font-mono)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {cmd}
    </button>
  );
}

/* ——————————————————————————————————————————
   Architecture Diagram
   —————————————————————————————————————————— */

function ArchitectureDiagram() {
  const layers = [
    { label: 'Your Project', color: 'var(--token-text-primary)', bg: 'var(--token-bg)', items: ['App.tsx', 'pages/', 'styles/'] },
    { label: 'AI Components', color: 'var(--token-accent)', bg: 'var(--token-accent-muted)', items: ['ChatMessage', 'ReasoningTrace', 'ToolCall', '...74 total'] },
    { label: 'DS Molecules', color: 'var(--token-chart-4)', bg: 'rgba(126, 144, 155, 0.12)', items: ['DSHeaderBar', 'DSPromptCard', 'DSToggleRow', '...30 total'] },
    { label: 'DS Atoms', color: 'var(--token-chart-5)', bg: 'rgba(132, 148, 120, 0.12)', items: ['DSButton', 'DSBadge', 'DSAvatar', '...27 total'] },
    { label: 'Design Tokens', color: 'var(--token-chart-3)', bg: 'rgba(154, 144, 112, 0.12)', items: ['tokens.css', '4-level architecture', 'Light + Dark themes'] },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      {layers.map((layer, i) => (
        <div key={layer.label}>
          <div
            style={{
              padding: 'var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${layer.color}`,
              background: layer.bg,
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--token-text-xs)', color: layer.color, fontFamily: 'var(--token-font-mono)' }}>
                {layer.label}
              </span>
              <div className="flex" style={{ gap: 'var(--token-space-1)' }}>
                {layer.items.map(item => (
                  <span key={item} style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-tertiary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--token-radius-sm)',
                    background: 'var(--token-bg)',
                    border: '1px solid var(--token-border-subtle)',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="flex justify-center" style={{ padding: '2px 0', color: 'var(--token-text-disabled)' }}>
              <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————
   Stats Bar
   —————————————————————————————————————————— */

function StatsBar() {
  const stats = [
    { label: 'Components', value: registryStats.aiComponents, icon: <Box size={12} /> },
    { label: 'Atoms', value: registryStats.atoms, icon: <Layers size={12} /> },
    { label: 'Molecules', value: registryStats.molecules, icon: <Package size={12} /> },
    { label: 'Categories', value: registryStats.categories.length, icon: <LayoutGrid size={12} /> },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--token-space-2)',
    }}>
      {stats.map(s => (
        <div
          key={s.label}
          className="flex flex-col items-center"
          style={{
            padding: 'var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg)',
            gap: 'var(--token-space-1)',
          }}
        >
          <div style={{ color: 'var(--token-text-disabled)' }}>{s.icon}</div>
          <span style={{ fontSize: 'var(--token-text-xl)', color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-mono)' }}>
            {s.value}
          </span>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————
   Main CLI Page
   —————————————————————————————————————————— */

export function CLIPage() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'browse' | 'architecture' | 'packages'>('terminal');

  const tabs = [
    { key: 'terminal' as const, label: 'Terminal', icon: <Terminal size={13} /> },
    { key: 'browse' as const, label: 'Browse', icon: <Search size={13} /> },
    { key: 'architecture' as const, label: 'Architecture', icon: <Layers size={13} /> },
    { key: 'packages' as const, label: 'Packages', icon: <Package size={13} /> },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--token-space-8) var(--token-space-6)', width: '100%' }}>
        {/* Hero */}
        <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', marginBottom: 'var(--token-space-8)' }}>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-text-primary)',
              }}
            >
              <Download size={16} style={{ color: 'var(--token-text-inverse)' }} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--token-text-lg)', color: 'var(--token-text-primary)' }}>
                zeros-aiui
              </div>
              <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                CLI + Token Package
              </div>
            </div>
          </div>

          <p style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-relaxed)',
            maxWidth: 560,
          }}>
            Copy AI components directly into your project. No runtime dependency, no lock-in.
            Like shadcn/ui, but purpose-built for AI interfaces. Just React + lucide-react + CSS tokens.
          </p>

          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <CopyableCommand cmd="npx zeros-aiui init" />
            <CopyableCommand cmd="npx zeros-aiui add chat-message" />
          </div>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Quick Start */}
        <div style={{ marginTop: 'var(--token-space-8)', marginBottom: 'var(--token-space-6)' }}>
          <h2 style={{
            fontSize: 'var(--token-text-md)',
            color: 'var(--token-text-primary)',
            marginBottom: 'var(--token-space-4)',
          }}>
            Quick Start
          </h2>
          <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
            <StepBlock
              number={1}
              title="Initialize your project"
              code="npx zeros-aiui init"
              description="Creates zeros-aiui.config.ts and copies tokens.css into your project."
            />
            <StepBlock
              number={2}
              title="Import the tokens CSS"
              code="@import './styles/zeros-tokens.css';"
              description="Add this to your global CSS file (e.g. globals.css or index.css)."
            />
            <StepBlock
              number={3}
              title="Add components"
              code="npx zeros-aiui add chat-message reasoning-trace tool-call"
              description="Components + their atom/molecule dependencies are copied into your project."
            />
            <StepBlock
              number={4}
              title="Use in your app"
              code={`import { ChatMessage } from '@/components/zeros-aiui/ChatMessage';`}
              description="Components are now local source files you own and can customize."
            />
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center" style={{
          gap: 0,
          borderBottom: '1px solid var(--token-border)',
          marginBottom: 'var(--token-space-4)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center cursor-pointer"
              style={{
                gap: 'var(--token-space-1-5)',
                padding: 'var(--token-space-2) var(--token-space-4)',
                fontSize: 'var(--token-text-xs)',
                color: activeTab === tab.key ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: activeTab === tab.key ? 'var(--token-accent)' : 'transparent',
                marginBottom: -1,
                transition: 'all 150ms ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'terminal' && <CLITerminal />}
        {activeTab === 'browse' && <ComponentBrowser />}
        {activeTab === 'architecture' && (
          <div className="flex flex-col" style={{ gap: 'var(--token-space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', marginBottom: 'var(--token-space-3)' }}>
                Layer Architecture
              </h3>
              <ArchitectureDiagram />
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', marginBottom: 'var(--token-space-3)' }}>
                Token Architecture (4 Levels)
              </h3>
              <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
                {[
                  { level: 'L1', name: 'Raw Values', desc: 'Hardcoded hex/px values embedded in L2', color: 'var(--token-chart-2)' },
                  { level: 'L2', name: 'Primitive Palettes', desc: 'Moonstone, Sunstone, Olivine, Malachite, Garnet, Ochre, Azurite', color: 'var(--token-chart-3)' },
                  { level: 'L3', name: 'Semantic Tokens', desc: '--token-bg, --token-accent, --token-error (theme-aware)', color: 'var(--token-chart-4)' },
                  { level: 'L4', name: 'Component Tokens', desc: '--token-user-bubble, --token-code-bg, --token-voice-bar', color: 'var(--token-chart-5)' },
                ].map(l => (
                  <div
                    key={l.level}
                    className="flex items-center"
                    style={{
                      gap: 'var(--token-space-3)',
                      padding: 'var(--token-space-2) var(--token-space-3)',
                      borderRadius: 'var(--token-radius-md)',
                      border: '1px solid var(--token-border)',
                      background: 'var(--token-bg)',
                    }}
                  >
                    <span style={{
                      fontSize: 'var(--token-text-2xs)',
                      fontFamily: 'var(--token-font-mono)',
                      color: l.color,
                      padding: '2px 6px',
                      borderRadius: 'var(--token-radius-sm)',
                      background: 'var(--token-bg-secondary)',
                      border: '1px solid var(--token-border)',
                    }}>
                      {l.level}
                    </span>
                    <div>
                      <div style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-primary)' }}>{l.name}</div>
                      <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', marginBottom: 'var(--token-space-3)' }}>
                Config Template
              </h3>
              <pre style={{
                padding: 'var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                border: '1px solid var(--token-border)',
                background: '#0d1117',
                color: '#c9d1d9',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                overflow: 'auto',
                lineHeight: 'var(--token-leading-relaxed)',
              }}>
                {generateConfigFile()}
              </pre>
            </div>
          </div>
        )}
        {activeTab === 'packages' && <PackagesTab />}

        {/* Footer */}
        <div style={{
          marginTop: 'var(--token-space-8)',
          paddingTop: 'var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
        }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
              zeros-aiui v0.1.0
            </span>
            <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
              <Link
                to="/design-system"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-accent)',
                  textDecoration: 'none',
                }}
              >
                View Components
              </Link>
              <Link
                to="/design-tokens"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-accent)',
                  textDecoration: 'none',
                }}
              >
                Design Tokens
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Step Block (for Quick Start)
   —————————————————————————————————————————— */

function StepBlock({ number, title, code, description }: {
  number: number;
  title: string;
  code: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="flex"
      style={{
        gap: 'var(--token-space-3)',
        padding: 'var(--token-space-3)',
        borderRadius: 'var(--token-radius-md)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 24, height: 24,
          borderRadius: 'var(--token-radius-full)',
          background: 'var(--token-accent-muted)',
          color: 'var(--token-accent)',
          fontSize: 'var(--token-text-2xs)',
          fontFamily: 'var(--token-font-mono)',
        }}
      >
        {number}
      </div>
      <div className="flex flex-col" style={{ gap: 'var(--token-space-1)', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-primary)' }}>
          {title}
        </span>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{
            padding: 'var(--token-space-1) var(--token-space-2)',
            borderRadius: 'var(--token-radius-sm)',
            background: '#0d1117',
            gap: 'var(--token-space-2)',
          }}
        >
          <code style={{
            fontSize: 'var(--token-text-2xs)',
            color: '#7ee787',
            fontFamily: 'var(--token-font-mono)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {code}
          </code>
          <div style={{ color: copied ? '#7ee787' : '#8b949e', flexShrink: 0 }}>
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </div>
        </div>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', lineHeight: 'var(--token-leading-normal)' }}>
          {description}
        </span>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Packages Tab
   —————————————————————————————————————————— */

function PackagesTab() {
  const [activePackage, setActivePackage] = useState<'cli' | 'tokens'>('cli');
  const [activeFile, setActiveFile] = useState(0);

  const cliPkg = generateCLIPackage();
  const tokensPkg = generateTokensPackage();
  const currentPkg = activePackage === 'cli' ? cliPkg : tokensPkg;

  const codeStyle: React.CSSProperties = {
    padding: 'var(--token-space-3)',
    borderRadius: 'var(--token-radius-md)',
    border: '1px solid var(--token-border)',
    background: '#0d1117',
    color: '#c9d1d9',
    fontSize: 'var(--token-text-2xs)',
    fontFamily: 'var(--token-font-mono)',
    overflow: 'auto',
    lineHeight: 'var(--token-leading-relaxed)',
    maxHeight: 400,
    whiteSpace: 'pre',
    margin: 0,
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-4)' }}>
      {/* Package selector */}
      <div className="flex" style={{ gap: 'var(--token-space-2)' }}>
        {([
          { key: 'cli' as const, name: 'zeros-aiui', desc: 'CLI + Component Registry' },
          { key: 'tokens' as const, name: '@zeros-aiui/tokens', desc: 'CSS Token Package' },
        ]).map(pkg => (
          <button
            key={pkg.key}
            onClick={() => { setActivePackage(pkg.key); setActiveFile(0); }}
            className="flex flex-col cursor-pointer"
            style={{
              flex: 1,
              padding: 'var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${activePackage === pkg.key ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: activePackage === pkg.key ? 'var(--token-accent-muted)' : 'var(--token-bg)',
              textAlign: 'left',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-mono)' }}>
              {pkg.name}
            </span>
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>
              {pkg.desc}
            </span>
          </button>
        ))}
      </div>

      {/* File tree */}
      <div>
        <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', marginBottom: 'var(--token-space-1-5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          File Tree
        </div>
        <pre style={{ ...codeStyle, maxHeight: 'none' }}>
          {renderFileTree(currentPkg).join('\n')}
        </pre>
      </div>

      {/* File tabs */}
      <div>
        <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', marginBottom: 'var(--token-space-1-5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Source Files
        </div>
        <div className="flex" style={{ gap: 'var(--token-space-1)', overflowX: 'auto', marginBottom: 'var(--token-space-2)' }}>
          {currentPkg.files.map((file, i) => (
            <button
              key={file.path}
              onClick={() => setActiveFile(i)}
              className="cursor-pointer"
              style={{
                padding: 'var(--token-space-1) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                border: `1px solid ${activeFile === i ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: activeFile === i ? 'var(--token-accent-muted)' : 'var(--token-bg)',
                color: activeFile === i ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {file.path}
            </button>
          ))}
        </div>
        <pre style={codeStyle}>
          {currentPkg.files[activeFile]?.content || ''}
        </pre>
      </div>
    </div>
  );
}