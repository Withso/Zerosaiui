/* CodeBlock — Enhanced with word-wrap toggle, diff highlights, apply/reject actions
   Composed from DS atoms (DSButton, DSBadge)
   Phase 3: wrap toggle, diff-style line highlights, code action bar */
import { useState } from 'react';
import { Check, Copy, Terminal, WrapText, Plus, Minus, CheckCircle, X } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type LineHighlight = 'added' | 'removed' | 'modified' | 'none';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  lineHighlights?: Record<number, LineHighlight>;
  onApply?: () => void;
  onReject?: () => void;
  maxHeight?: number;
}

export function CodeBlock({
  code,
  language = 'javascript',
  filename,
  showLineNumbers = true,
  lineHighlights,
  onApply,
  onReject,
  maxHeight,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [wordWrap, setWordWrap] = useState(false);
  const lines = code.split('\n');
  const hasDiff = lineHighlights && Object.keys(lineHighlights).length > 0;
  const addedCount = hasDiff ? Object.values(lineHighlights!).filter(h => h === 'added').length : 0;
  const removedCount = hasDiff ? Object.values(lineHighlights!).filter(h => h === 'removed').length : 0;
  const hasActions = onApply || onReject;

  const handleCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      /* Clipboard API not available */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightColors: Record<LineHighlight, string> = {
    added: 'rgba(45,164,78,0.12)',
    removed: 'rgba(181,74,74,0.12)',
    modified: 'rgba(79,109,128,0.10)',
    none: 'transparent',
  };

  const highlightGutterColors: Record<LineHighlight, string> = {
    added: 'var(--token-success)',
    removed: 'var(--token-error)',
    modified: 'var(--token-accent)',
    none: 'transparent',
  };

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        fontFamily: 'var(--token-font-mono)',
        fontSize: 'var(--token-text-sm)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          background: 'var(--token-code-header)',
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Terminal size={13} style={{ color: 'var(--token-text-tertiary)' }} />
          <span
            style={{
              color: 'var(--token-text-secondary)',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-mono)',
              fontWeight: 'var(--token-weight-medium)',
              textTransform: 'lowercase',
            }}
          >
            {filename || language}
          </span>
          {/* Diff summary badges */}
          {hasDiff && (
            <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
              {addedCount > 0 && (
                <span className="flex items-center" style={{
                  gap: 2, fontSize: 'var(--token-text-2xs)', color: 'var(--token-success)',
                  fontFamily: 'var(--token-font-mono)',
                }}>
                  <Plus size={9} />+{addedCount}
                </span>
              )}
              {removedCount > 0 && (
                <span className="flex items-center" style={{
                  gap: 2, fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)',
                  fontFamily: 'var(--token-font-mono)',
                }}>
                  <Minus size={9} />-{removedCount}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {/* Word wrap toggle */}
          <DSButton
            variant="ghost"
            icon={<WrapText size={12} />}
            onClick={() => setWordWrap(!wordWrap)}
            title={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
            style={{
              padding: 'var(--token-space-1)',
              borderRadius: 'var(--token-radius-sm)',
              color: wordWrap ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              background: wordWrap ? 'var(--token-bg-hover)' : 'transparent',
            }}
          />
          <DSButton
            variant="ghost"
            icon={copied ? <Check size={12} /> : <Copy size={12} />}
            onClick={handleCopy}
            style={{
              gap: 'var(--token-space-1)',
              color: copied ? 'var(--token-success)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-sans)',
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-sm)',
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </DSButton>
        </div>
      </div>

      {/* Code Body */}
      <div
        style={{
          background: 'var(--token-code-bg)',
          overflowX: wordWrap ? 'visible' : 'auto',
          maxHeight: maxHeight || undefined,
          overflowY: maxHeight ? 'auto' : undefined,
        }}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {lines.map((line, i) => {
              const highlight = lineHighlights?.[i + 1] || 'none';
              return (
                <tr
                  key={i}
                  onMouseEnter={() => setHoveredLine(i)}
                  onMouseLeave={() => setHoveredLine(null)}
                  style={{
                    background: highlight !== 'none'
                      ? highlightColors[highlight]
                      : hoveredLine === i ? 'var(--token-bg-hover)' : 'transparent',
                    transition: 'background 80ms ease',
                  }}
                >
                  {/* Diff gutter indicator */}
                  {hasDiff && (
                    <td style={{
                      width: 3,
                      padding: 0,
                      background: highlightGutterColors[highlight],
                    }} />
                  )}
                  {showLineNumbers && (
                    <td
                      style={{
                        padding: `0 var(--token-space-3)`,
                        paddingTop: i === 0 ? 'var(--token-space-3)' : 0,
                        paddingBottom: i === lines.length - 1 ? 'var(--token-space-3)' : 0,
                        textAlign: 'right',
                        userSelect: 'none',
                        color: 'var(--token-text-disabled)',
                        fontSize: 'var(--token-text-xs)',
                        fontFamily: 'var(--token-font-mono)',
                        lineHeight: 'var(--token-leading-relaxed)',
                        verticalAlign: 'top',
                        borderRight: '1px solid var(--token-border-subtle)',
                        whiteSpace: 'nowrap',
                        width: 1,
                      }}
                    >
                      {i + 1}
                    </td>
                  )}
                  <td
                    style={{
                      padding: `0 var(--token-space-4)`,
                      paddingTop: i === 0 ? 'var(--token-space-3)' : 0,
                      paddingBottom: i === lines.length - 1 ? 'var(--token-space-3)' : 0,
                    }}
                  >
                    <pre style={{ margin: 0 }}>
                      <code
                        style={{
                          color: highlight === 'removed' ? 'var(--token-error)' : 'var(--token-code-text)',
                          fontFamily: 'var(--token-font-mono)',
                          fontSize: 'var(--token-text-sm)',
                          lineHeight: 'var(--token-leading-relaxed)',
                          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                          wordBreak: wordWrap ? 'break-all' : undefined,
                          tabSize: 2,
                          textDecoration: highlight === 'removed' ? 'line-through' : undefined,
                          opacity: highlight === 'removed' ? 0.6 : 1,
                        }}
                      >
                        {line || ' '}
                      </code>
                    </pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Apply/Reject action bar for AI-generated code */}
      {hasActions && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderTop: '1px solid var(--token-border)',
            background: 'var(--token-code-header)',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            AI-generated code
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {onReject && (
              <DSButton
                variant="ghost"
                icon={<X size={11} />}
                onClick={onReject}
                style={{ fontSize: 'var(--token-text-xs)', padding: '2px 8px', height: 24 }}
              >
                Reject
              </DSButton>
            )}
            {onApply && (
              <DSButton
                variant="primary"
                icon={<CheckCircle size={11} />}
                onClick={onApply}
                style={{ fontSize: 'var(--token-text-xs)', padding: '2px 10px', height: 24 }}
              >
                Apply
              </DSButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const sampleCode = `import torch
import torch.nn as nn

class Attention(nn.Module):
    def __init__(self, dim, heads=8):
        super().__init__()
        self.heads = heads
        self.scale = dim ** -0.5
        self.qkv = nn.Linear(dim, dim * 3)
        self.proj = nn.Linear(dim, dim)

    def forward(self, x):
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.heads, C // self.heads)
        q, k, v = qkv.unbind(2)
        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)
        return self.proj((attn @ v).reshape(B, N, C))`;

export function CodeBlockDemo() {
  const codeExamples: { code: string; language: string; filename: string; highlights?: Record<number, LineHighlight>; showActions?: boolean }[] = [
    { code: sampleCode, language: 'python', filename: 'attention.py' },
    {
      code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
      language: 'typescript',
      filename: 'useDebounce.ts',
    },
    {
      code: `import torch
import torch.nn as nn

class Attention(nn.Module):
    def __init__(self, dim, heads=8):
        super().__init__()
        self.heads = heads
        self.scale = dim ** -0.5
        self.to_qkv = nn.Linear(dim, dim * 3, bias=False)
        self.to_out = nn.Linear(dim, dim)
        self.dropout = nn.Dropout(0.1)

    def forward(self, x):
        B, N, C = x.shape
        qkv = self.to_qkv(x).reshape(B, N, 3, self.heads, C // self.heads)
        q, k, v = qkv.unbind(2)
        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = self.dropout(attn.softmax(dim=-1))
        return self.to_out((attn @ v).reshape(B, N, C))`,
      language: 'python',
      filename: 'attention.py (diff)',
      highlights: { 9: 'modified', 10: 'modified', 11: 'added', 18: 'modified' },
      showActions: true,
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = codeExamples[activeIdx];

  return (
    <div className="flex flex-col" style={{ maxWidth: 560, width: '100%', gap: 'var(--token-space-3)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {codeExamples.map((ex, i) => (
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
            {ex.filename}
          </button>
        ))}
      </div>
      <div key={activeIdx} style={{ animation: 'token-fade-in 200ms ease' }}>
        <CodeBlock
          code={active.code}
          language={active.language}
          filename={active.filename}
          lineHighlights={active.highlights}
          onApply={active.showActions ? () => {} : undefined}
          onReject={active.showActions ? () => {} : undefined}
        />
      </div>
    </div>
  );
}
