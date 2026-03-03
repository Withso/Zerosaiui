/* —— MarkdownResponse — Phase 3 Enhanced —— */
import { DSCodeInline, DSDivider } from '../ds/atoms';
import { useState, useRef, useCallback } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, Link2 } from 'lucide-react';

/* —— Types —— */
interface MarkdownResponseProps {
  children: React.ReactNode;
  showTableOfContents?: boolean;
  collapsible?: boolean;
}

/* —— Main container —— */
export function MarkdownResponse({ children, showTableOfContents, collapsible }: MarkdownResponseProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        gap: 'var(--token-space-4)',
        fontFamily: 'var(--token-font-sans)',
        fontSize: 'var(--token-text-base)',
        lineHeight: 'var(--token-leading-relaxed)',
        color: 'var(--token-text-primary)',
      }}
    >
      {children}
    </div>
  );
}

/* —— Sub-components for rich markdown rendering —— */

/* Heading with anchor link on hover */
export function Heading({ level, children, id }: { level: 1 | 2 | 3; children: React.ReactNode; id?: string }) {
  const [showAnchor, setShowAnchor] = useState(false);
  const sizes = {
    1: 'var(--token-text-xl)',
    2: 'var(--token-text-lg)',
    3: 'var(--token-text-md)',
  };
  const anchorId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div
      id={anchorId}
      className="flex items-center"
      style={{
        gap: 'var(--token-space-2)',
        fontSize: sizes[level],
        fontWeight: 'var(--token-weight-semibold)',
        color: 'var(--token-text-primary)',
        letterSpacing: 'var(--token-tracking-tight)',
        lineHeight: 'var(--token-leading-tight)',
      }}
      onMouseEnter={() => setShowAnchor(true)}
      onMouseLeave={() => setShowAnchor(false)}
    >
      {children}
      {anchorId && showAnchor && (
        <button
          onClick={() => {
            const url = `${window.location.pathname}#${anchorId}`;
            navigator.clipboard?.writeText(window.location.origin + url);
          }}
          className="cursor-pointer"
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            color: 'var(--token-text-disabled)',
            transition: 'color var(--token-duration-fast)',
          }}
          title="Copy link to heading"
        >
          <Link2 size={14} />
        </button>
      )}
    </div>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, color: 'var(--token-text-primary)', lineHeight: 'var(--token-leading-relaxed)' }}>
      {children}
    </p>
  );
}

export function Bold({ children }: { children: React.ReactNode }) {
  return (
    <strong style={{ fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-primary)' }}>
      {children}
    </strong>
  );
}

/* InlineCode -- composed from DSCodeInline atom */
export function InlineCode({ children }: { children: string }) {
  return <DSCodeInline>{children}</DSCodeInline>;
}

/* —— CodeFence — multi-line code block with copy + language label —— */
export function CodeFence({ language, children }: { language?: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-md)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        fontSize: 'var(--token-text-sm)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          background: 'var(--token-bg-secondary)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--token-tracking-wide)',
          }}
        >
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center cursor-pointer"
          style={{
            gap: 'var(--token-space-1)',
            border: 'none',
            background: 'none',
            padding: 0,
            fontSize: 'var(--token-text-2xs)',
            color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            transition: 'color var(--token-duration-fast)',
          }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <pre
        style={{
          margin: 0,
          padding: 'var(--token-space-3)',
          background: 'var(--token-bg-tertiary)',
          fontFamily: 'var(--token-font-mono)',
          fontSize: 'var(--token-text-sm)',
          lineHeight: 'var(--token-leading-relaxed)',
          color: 'var(--token-text-primary)',
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/* —— CollapsibleSection — for long content blocks —— */
export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-md)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          border: 'none',
          background: 'var(--token-bg-secondary)',
          fontFamily: 'var(--token-font-sans)',
          fontSize: 'var(--token-text-sm)',
          fontWeight: 'var(--token-weight-medium)',
          color: 'var(--token-text-primary)',
          textAlign: 'left',
        }}
      >
        {open ? (
          <ChevronDown size={14} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />
        ) : (
          <ChevronRight size={14} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />
        )}
        {title}
      </button>
      {open && (
        <div
          style={{
            padding: 'var(--token-space-3)',
            borderTop: '1px solid var(--token-border)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* —— BulletList —— */
export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: 'var(--token-space-5)',
        listStyleType: 'disc',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            color: 'var(--token-text-primary)',
            paddingLeft: 'var(--token-space-1)',
            marginBottom: 'var(--token-space-1)',
            lineHeight: 'var(--token-leading-relaxed)',
            fontSize: 'var(--token-text-base)',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* —— NumberedList —— */
export function NumberedList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol
      style={{
        margin: 0,
        paddingLeft: 'var(--token-space-5)',
        listStyleType: 'decimal',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            color: 'var(--token-text-primary)',
            paddingLeft: 'var(--token-space-1)',
            marginBottom: 'var(--token-space-1)',
            lineHeight: 'var(--token-leading-relaxed)',
            fontSize: 'var(--token-text-base)',
          }}
        >
          {item}
        </li>
      ))}
    </ol>
  );
}

/* —— Blockquote —— */
export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        margin: 0,
        paddingLeft: 'var(--token-space-4)',
        borderLeft: '3px solid var(--token-accent)',
        color: 'var(--token-text-secondary)',
        fontStyle: 'italic',
        lineHeight: 'var(--token-leading-relaxed)',
      }}
    >
      {children}
    </blockquote>
  );
}

/* —— Table with sortable columns + row hover + copy cell —— */
export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const handleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colIdx);
      setSortAsc(true);
    }
  };

  const sorted = sortCol !== null
    ? [...rows].sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      })
    : rows;

  const handleCellClick = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedCell(value);
    setTimeout(() => setCopiedCell(null), 1200);
  };

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-md)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        fontSize: 'var(--token-text-sm)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                onClick={() => handleSort(i)}
                style={{
                  textAlign: 'left',
                  padding: 'var(--token-space-2) var(--token-space-3)',
                  background: 'var(--token-bg-secondary)',
                  fontWeight: 'var(--token-weight-medium)',
                  color: 'var(--token-text-secondary)',
                  fontSize: 'var(--token-text-xs)',
                  borderBottom: '1px solid var(--token-border)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--token-tracking-wide)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background var(--token-duration-fast)',
                }}
              >
                <span className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                  {h}
                  {sortCol === i && (
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)' }}>
                      {sortAsc ? '↑' : '↓'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              style={{
                transition: 'background var(--token-duration-fast)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  onClick={() => handleCellClick(cell)}
                  style={{
                    padding: 'var(--token-space-2) var(--token-space-3)',
                    borderBottom: i < sorted.length - 1 ? '1px solid var(--token-border)' : 'none',
                    color: copiedCell === cell ? 'var(--token-success)' : 'var(--token-text-primary)',
                    cursor: 'pointer',
                    transition: 'color var(--token-duration-fast)',
                  }}
                  title="Click to copy"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* —— Callout — info/warning/tip blocks inside markdown —— */
export function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip';
  children: React.ReactNode;
}) {
  const config = {
    info: { color: 'var(--token-accent)', bg: 'var(--token-accent-light)', label: 'Info' },
    warning: { color: 'var(--token-warning)', bg: 'var(--token-warning-light)', label: 'Warning' },
    tip: { color: 'var(--token-success)', bg: 'var(--token-success-light)', label: 'Tip' },
  };
  const c = config[type];

  return (
    <div
      style={{
        padding: 'var(--token-space-3)',
        borderRadius: 'var(--token-radius-md)',
        background: c.bg,
        borderLeft: `3px solid ${c.color}`,
      }}
    >
      <div
        style={{
          fontSize: 'var(--token-text-2xs)',
          fontWeight: 'var(--token-weight-semibold)',
          color: c.color,
          textTransform: 'uppercase',
          letterSpacing: 'var(--token-tracking-wide)',
          marginBottom: 'var(--token-space-1-5)',
        }}
      >
        {c.label}
      </div>
      <div
        style={{
          fontSize: 'var(--token-text-sm)',
          color: 'var(--token-text-secondary)',
          lineHeight: 'var(--token-leading-relaxed)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* —— Demo —— */
export function MarkdownResponseDemo() {
  const [showTable, setShowTable] = useState(false);
  const [showList, setShowList] = useState(true);

  return (
    <div className="flex flex-col" style={{ maxWidth: 520, width: '100%', gap: 'var(--token-space-3)' }}>
      {/* Toggle controls */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        {[
          { label: 'List', active: showList, toggle: () => setShowList(!showList) },
          { label: 'Table', active: showTable, toggle: () => setShowTable(!showTable) },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.toggle}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${btn.active ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: btn.active ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: btn.active ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <MarkdownResponse>
        <Heading level={2}>Transformer Architecture</Heading>
        <Paragraph>
          The <Bold>Transformer</Bold> model relies on <InlineCode>self-attention</InlineCode> mechanisms
          to draw global dependencies between input and output sequences.
        </Paragraph>

        <Blockquote>
          Attention is all you need. The transformer dispensed with recurrence and convolutions entirely.
        </Blockquote>

        <DSDivider variant="gradient" />

        {showList && (
          <div style={{ animation: 'token-fade-in 200ms ease' }}>
            <BulletList
              items={[
                <span key="1"><Bold>Encoder</Bold> &#x2014; processes the input sequence</span>,
                <span key="2"><Bold>Decoder</Bold> &#x2014; generates the output sequence</span>,
                <span key="3"><Bold>Attention</Bold> &#x2014; weighs relevance of each token</span>,
              ]}
            />
          </div>
        )}

        <CollapsibleSection title="Implementation Details">
          <Paragraph>
            The scaled dot-product attention is computed as{' '}
            <InlineCode>Attention(Q,K,V) = softmax(QK/sqrt(d))V</InlineCode>.
            Multi-head attention runs multiple attention functions in parallel.
          </Paragraph>
        </CollapsibleSection>

        <CodeFence language="python">
{`import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads`}
        </CodeFence>

        <Callout type="tip">
          Use flash attention for 2-4x speedup on long sequences without any accuracy loss.
        </Callout>

        {showTable && (
          <div style={{ animation: 'token-fade-in 200ms ease' }}>
            <Table
              headers={['Model', 'Parameters', 'Context']}
              rows={[
                ['GPT-4o', '~1.8T', '128K'],
                ['Claude 3.5', '~175B', '200K'],
                ['Gemini Pro', '~540B', '1M'],
              ]}
            />
          </div>
        )}
      </MarkdownResponse>
    </div>
  );
}
