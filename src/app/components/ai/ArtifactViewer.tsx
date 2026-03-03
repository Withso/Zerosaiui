/* ArtifactViewer — Enhanced artifact viewer with editing, versioning, diff
   Phase 3 enhancements:
   — Inline editing mode (edit code directly, save/discard)
   — Version history slider (navigate previous versions)
   — Diff view toggle (additions green, deletions red)
   — Run/Preview button for executable artifacts
   — Full-screen expand mode */
import { useState, useRef, useCallback } from 'react';
import {
  Code, FileText, Eye, Copy, Download, X, Check, ExternalLink,
  Pencil, Save, RotateCcw, History, Play, Maximize2, Minimize2,
  ChevronLeft, ChevronRight, GitCompare,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type ArtifactType = 'code' | 'document' | 'preview';

interface ArtifactVersion {
  id: number;
  content: string;
  timestamp: string;
  label?: string;
}

interface ArtifactViewerProps {
  title: string;
  type?: ArtifactType;
  language?: string;
  content: string;
  onClose?: () => void;
  onSave?: (content: string) => void;
  onRun?: () => void;
  versions?: ArtifactVersion[];
  editable?: boolean;
}

export function ArtifactViewer({
  title,
  type = 'code',
  language = 'typescript',
  content: initialContent,
  onClose,
  onSave,
  onRun,
  versions: externalVersions,
  editable = true,
}: ArtifactViewerProps) {
  const [activeTab, setActiveTab] = useState<'source' | 'preview' | 'diff'>(
    type === 'preview' ? 'preview' : 'source',
  );
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  /* — Version history — */
  const [versions, setVersions] = useState<ArtifactVersion[]>(
    externalVersions || [
      { id: 1, content: initialContent, timestamp: 'Now', label: 'Current' },
    ],
  );
  const [versionIdx, setVersionIdx] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const handleCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* — Editing — */
  const startEditing = () => {
    setIsEditing(true);
    setEditContent(content);
  };

  const saveEdit = () => {
    const newVersion: ArtifactVersion = {
      id: versions.length + 1,
      content: editContent,
      timestamp: 'Just now',
      label: `Edit #${versions.length}`,
    };
    setVersions(prev => [newVersion, ...prev]);
    setVersionIdx(0);
    setContent(editContent);
    setIsEditing(false);
    onSave?.(editContent);
  };

  const discardEdit = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  /* — Version navigation — */
  const goToVersion = (idx: number) => {
    setVersionIdx(idx);
    setContent(versions[idx].content);
    setEditContent(versions[idx].content);
  };

  /* — Run simulation — */
  const handleRun = () => {
    setIsRunning(true);
    setRunOutput(null);
    onRun?.();
    setTimeout(() => {
      setIsRunning(false);
      setRunOutput('> Output: Component rendered successfully\n> No errors detected\n> Build time: 0.42s');
    }, 1500);
  };

  /* — Diff computation (simple line-based) — */
  const computeDiff = () => {
    if (versions.length < 2) return null;
    const current = versions[0].content.split('\n');
    const previous = versions[1].content.split('\n');
    const maxLen = Math.max(current.length, previous.length);
    const lines: { text: string; type: 'added' | 'removed' | 'unchanged' }[] = [];

    for (let i = 0; i < maxLen; i++) {
      const curr = current[i];
      const prev = previous[i];
      if (curr === prev) {
        lines.push({ text: curr || '', type: 'unchanged' });
      } else {
        if (prev !== undefined) lines.push({ text: prev, type: 'removed' });
        if (curr !== undefined) lines.push({ text: curr, type: 'added' });
      }
    }
    return lines;
  };

  const typeIcons: Record<ArtifactType, React.ReactNode> = {
    code: <Code size={13} />,
    document: <FileText size={13} />,
    preview: <Eye size={13} />,
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--token-space-1-5) var(--token-space-3)',
    fontSize: 'var(--token-text-xs)',
    fontFamily: 'var(--token-font-sans)',
    fontWeight: active ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
    color: active ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
    background: active ? 'var(--token-bg-hover)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--token-radius-sm)',
    cursor: 'pointer',
    transition: 'all var(--token-duration-fast) var(--token-ease-default)',
  });

  const diffLines = activeTab === 'diff' ? computeDiff() : null;

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: `1px solid ${isEditing ? 'var(--token-accent)' : 'var(--token-border)'}`,
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
        boxShadow: 'var(--token-shadow-md)',
        transition: 'border-color var(--token-duration-fast)',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center"
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
          gap: 'var(--token-space-2)',
        }}
      >
        <span style={{ color: 'var(--token-text-tertiary)', flexShrink: 0, display: 'flex' }}>
          {typeIcons[type]}
        </span>
        <span
          className="flex-1 truncate"
          style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}
        >
          {title}
        </span>

        {isEditing && (
          <DSBadge
            label="Editing"
            style={{
              background: 'var(--token-accent)',
              color: 'var(--token-accent-fg, #fff)',
              fontSize: 'var(--token-text-2xs)',
            }}
          />
        )}

        {language && type === 'code' && (
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {language}
          </span>
        )}

        {/* Version indicator */}
        {versions.length > 1 && (
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            v{versions.length - versionIdx}
          </span>
        )}

        <DSButton variant="icon" icon={<X size={14} />} onClick={onClose} style={{ width: 28, height: 28 }} />
      </div>

      {/* Tabs + actions */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <button style={tabBtnStyle(activeTab === 'source')} onClick={() => setActiveTab('source')}>
            Source
          </button>
          <button style={tabBtnStyle(activeTab === 'preview')} onClick={() => setActiveTab('preview')}>
            Preview
          </button>
          {versions.length > 1 && (
            <button style={tabBtnStyle(activeTab === 'diff')} onClick={() => setActiveTab('diff')}>
              <span className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                <GitCompare size={11} />
                Diff
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          {/* Edit / Save / Discard */}
          {editable && !isEditing && activeTab === 'source' && (
            <DSButton
              variant="icon"
              icon={<Pencil size={13} />}
              onClick={startEditing}
              title="Edit"
              style={{ width: 28, height: 28 }}
            />
          )}
          {isEditing && (
            <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
              <DSButton
                variant="icon"
                icon={<Save size={13} />}
                onClick={saveEdit}
                title="Save"
                style={{ width: 28, height: 28, color: 'var(--token-success)' }}
              />
              <DSButton
                variant="icon"
                icon={<RotateCcw size={13} />}
                onClick={discardEdit}
                title="Discard"
                style={{ width: 28, height: 28, color: 'var(--token-error)' }}
              />
            </div>
          )}

          {/* Run button */}
          {type === 'code' && (
            <DSButton
              variant="icon"
              icon={isRunning
                ? <span style={{
                    display: 'inline-block', width: 13, height: 13,
                    borderRadius: 'var(--token-radius-full)',
                    borderTopColor: 'var(--token-accent)',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderWidth: 2, borderStyle: 'solid',
                    animation: 'token-spin 0.8s linear infinite',
                  }} />
                : <Play size={13} />
              }
              onClick={handleRun}
              title="Run"
              style={{ width: 28, height: 28, color: isRunning ? 'var(--token-accent)' : undefined }}
            />
          )}

          {/* History toggle */}
          {versions.length > 1 && (
            <DSButton
              variant="icon"
              icon={<History size={13} />}
              onClick={() => setShowHistory(!showHistory)}
              title="Version History"
              style={{ width: 28, height: 28, color: showHistory ? 'var(--token-accent)' : undefined }}
            />
          )}

          <DSButton
            variant="icon"
            icon={copied ? <Check size={13} /> : <Copy size={13} />}
            onClick={handleCopy}
            style={{ width: 28, height: 28, color: copied ? 'var(--token-success)' : undefined }}
          />
          <DSButton variant="icon" icon={<Download size={13} />} style={{ width: 28, height: 28 }} />
          <DSButton
            variant="icon"
            icon={isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{ width: 28, height: 28 }}
          />
        </div>
      </div>

      {/* Version history slider */}
      {showHistory && (
        <div
          className="flex items-center"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderBottom: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <DSButton
            variant="icon"
            icon={<ChevronLeft size={12} />}
            onClick={() => goToVersion(Math.min(versionIdx + 1, versions.length - 1))}
            disabled={versionIdx >= versions.length - 1}
            style={{ width: 22, height: 22, opacity: versionIdx >= versions.length - 1 ? 0.3 : 1 }}
          />
          <div className="flex-1 flex items-center" style={{ gap: 'var(--token-space-1)', overflowX: 'auto' }}>
            {versions.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => goToVersion(idx)}
                className="flex items-center shrink-0 cursor-pointer"
                style={{
                  gap: 'var(--token-space-1)',
                  padding: 'var(--token-space-1) var(--token-space-2)',
                  borderRadius: 'var(--token-radius-sm)',
                  border: `1px solid ${idx === versionIdx ? 'var(--token-accent)' : 'var(--token-border)'}`,
                  background: idx === versionIdx ? 'var(--token-bg-hover)' : 'transparent',
                  color: idx === versionIdx ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-mono)',
                  transition: 'all var(--token-duration-fast)',
                }}
              >
                <span>{v.label || `v${versions.length - idx}`}</span>
                <span style={{ color: 'var(--token-text-disabled)' }}>{v.timestamp}</span>
              </button>
            ))}
          </div>
          <DSButton
            variant="icon"
            icon={<ChevronRight size={12} />}
            onClick={() => goToVersion(Math.max(versionIdx - 1, 0))}
            disabled={versionIdx <= 0}
            style={{ width: 22, height: 22, opacity: versionIdx <= 0 ? 0.3 : 1 }}
          />
        </div>
      )}

      {/* Content area */}
      <div
        style={{
          padding: 'var(--token-space-4)',
          background: activeTab === 'source' || activeTab === 'diff' ? 'var(--token-code-bg)' : 'var(--token-bg)',
          maxHeight: isFullscreen ? 500 : 280,
          overflowY: 'auto',
          transition: 'max-height var(--token-duration-normal) var(--token-ease-default)',
        }}
      >
        {activeTab === 'source' ? (
          isEditing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: 200,
                margin: 0,
                fontFamily: 'var(--token-font-mono)',
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-code-text)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 'var(--token-leading-relaxed)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            />
          ) : (
            <pre
              style={{
                margin: 0,
                fontFamily: 'var(--token-font-mono)',
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-code-text)',
                lineHeight: 'var(--token-leading-relaxed)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {content}
            </pre>
          )
        ) : activeTab === 'diff' && diffLines ? (
          <div className="flex flex-col" style={{ gap: 0, fontFamily: 'var(--token-font-mono)', fontSize: 'var(--token-text-xs)' }}>
            {diffLines.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: 'var(--token-space-0-5) var(--token-space-2)',
                  background:
                    line.type === 'added'
                      ? 'rgba(45, 122, 96, 0.15)'
                      : line.type === 'removed'
                      ? 'rgba(181, 74, 74, 0.15)'
                      : 'transparent',
                  color:
                    line.type === 'added'
                      ? 'var(--token-success)'
                      : line.type === 'removed'
                      ? 'var(--token-error)'
                      : 'var(--token-code-text)',
                  lineHeight: 'var(--token-leading-relaxed)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <span style={{ display: 'inline-block', width: 16, color: 'var(--token-text-disabled)' }}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.text}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-secondary)',
              lineHeight: 'var(--token-leading-relaxed)',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                height: 160,
                borderRadius: 'var(--token-radius-md)',
                border: '1px dashed var(--token-border)',
                background: 'var(--token-bg-tertiary)',
                color: 'var(--token-text-disabled)',
                fontSize: 'var(--token-text-xs)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              Live Preview
            </div>
          </div>
        )}
      </div>

      {/* Run output panel */}
      {runOutput && (
        <div
          style={{
            padding: 'var(--token-space-3)',
            borderTop: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Output
            </span>
            <DSButton
              variant="icon"
              icon={<X size={10} />}
              onClick={() => setRunOutput(null)}
              style={{ width: 18, height: 18 }}
            />
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--token-font-mono)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-success)',
              lineHeight: 'var(--token-leading-relaxed)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {runOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

const sampleCode = `import { useState } from 'react';

interface CounterProps {
  initial?: number;
}

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`;

const sampleCodeV2 = `import { useState, useCallback } from 'react';

interface CounterProps {
  initial?: number;
  step?: number;
}

export function Counter({ initial = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initial);
  const decrement = useCallback(() => setCount(c => c - step), [step]);
  const increment = useCallback(() => setCount(c => c + step), [step]);
  
  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`;

export function ArtifactViewerDemo() {
  const sampleVersions: ArtifactVersion[] = [
    { id: 2, content: sampleCodeV2, timestamp: 'Just now', label: 'Added step prop' },
    { id: 1, content: sampleCode, timestamp: '5m ago', label: 'Initial' },
  ];

  const artifacts = [
    { title: 'Counter.tsx', type: 'code' as const, language: 'typescript', content: sampleCodeV2, versions: sampleVersions },
    { title: 'README.md', type: 'document' as const, language: undefined, content: '# Counter Component\n\nA simple counter component built with React hooks.\n\n## Usage\n\n```tsx\nimport { Counter } from "./Counter";\n\n<Counter initial={10} step={2} />\n```\n\n## Props\n\n| Prop | Type | Default |\n|------|------|--------|\n| initial | number | 0 |\n| step | number | 1 |', versions: undefined },
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = artifacts[activeIdx];

  return (
    <div className="flex flex-col" style={{ maxWidth: 520, width: '100%', gap: 'var(--token-space-3)' }}>
      {/* Artifact selector */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {artifacts.map((a, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${activeIdx === i ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: activeIdx === i ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: activeIdx === i ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {a.title}
          </button>
        ))}
      </div>
      <div key={activeIdx} style={{ animation: 'token-fade-in 200ms ease' }}>
        <ArtifactViewer
          title={active.title}
          type={active.type}
          language={active.language}
          content={active.content}
          versions={active.versions}
        />
      </div>
    </div>
  );
}
