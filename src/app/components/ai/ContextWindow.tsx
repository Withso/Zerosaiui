/* ContextWindow — Enhanced with interactive segments, compress context, segment details
   Composed from DS atoms-extra (DSColorBar, DSLegendItem) + DS atoms (DSButton)
   Phase 3: clickable segments to manage content, context compression action */
import { useState } from 'react';
import { Layers, Minimize2, Trash2, X } from 'lucide-react';
import { DSColorBar } from '../ds/atoms-extra';
import { DSLegendItem } from '../ds/atoms-extra';
import { DSButton, DSBadge, DSSpinner } from '../ds/atoms';

interface ContextSegment {
  label: string;
  tokens: number;
  color: string;
  items?: string[];
}

interface ContextWindowProps {
  segments: ContextSegment[];
  maxTokens: number;
  model?: string;
  onCompress?: () => void;
  onRemoveItem?: (segmentIdx: number, itemIdx: number) => void;
}

export function ContextWindow({ segments, maxTokens, model, onCompress, onRemoveItem }: ContextWindowProps) {
  const totalUsed = segments.reduce((sum, s) => sum + s.tokens, 0);
  const remaining = maxTokens - totalUsed;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [compressing, setCompressing] = useState(false);
  const usagePercent = ((totalUsed / maxTokens) * 100).toFixed(1);
  const isNearFull = totalUsed / maxTokens > 0.8;

  const formatTokens = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const handleCompress = () => {
    setCompressing(true);
    onCompress?.();
    setTimeout(() => setCompressing(false), 2000);
  };

  return (
    <div
      style={{
        padding: 'var(--token-space-4)',
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Layers size={14} style={{ color: 'var(--token-text-tertiary)' }} />
          <span style={{
            fontSize: 'var(--token-text-xs)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--token-tracking-wide)',
          }}>
            Context Window
          </span>
          {isNearFull && (
            <DSBadge variant="warning" style={{ fontSize: 9 }}>
              {usagePercent}% used
            </DSBadge>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {model && (
            <span style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {model}
            </span>
          )}
          {/* Compress context button */}
          <DSButton
            variant="ghost"
            icon={compressing ? <DSSpinner size={10} /> : <Minimize2 size={11} />}
            onClick={handleCompress}
            disabled={compressing}
            title="Compress context"
            style={{ padding: '3px 6px', fontSize: 'var(--token-text-2xs)' }}
          >
            {compressing ? 'Compressing...' : 'Compress'}
          </DSButton>
        </div>
      </div>

      {/* Bar — interactive: click segments to inspect */}
      <div
        style={{ marginBottom: 'var(--token-space-3)', cursor: 'pointer' }}
        onClick={() => setSelectedSegment(null)}
      >
        <DSColorBar
          segments={segments.map(seg => ({ value: seg.tokens, color: seg.color }))}
          total={maxTokens}
          height={8}
        />
      </div>

      {/* Legend — clickable segments */}
      <div className="flex flex-wrap items-center" style={{ gap: 'var(--token-space-4)' }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            onClick={() => setSelectedSegment(selectedSegment === i ? null : i)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer"
            style={{
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1,
              transition: 'opacity 150ms ease',
              borderBottom: selectedSegment === i ? `2px solid ${seg.color}` : '2px solid transparent',
              paddingBottom: 2,
            }}
          >
            <DSLegendItem
              color={seg.color}
              label={seg.label}
              value={formatTokens(seg.tokens)}
            />
          </div>
        ))}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
          <span style={{
            width: 8, height: 8,
            borderRadius: 2,
            background: 'var(--token-bg-tertiary)',
            border: '1px solid var(--token-border)',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
            Available
          </span>
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {formatTokens(remaining)}
          </span>
        </div>
      </div>

      {/* Interactive segment detail panel */}
      {selectedSegment !== null && segments[selectedSegment]?.items && (
        <div style={{
          marginTop: 'var(--token-space-3)',
          padding: 'var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
          animation: 'token-fade-in 200ms ease',
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {segments[selectedSegment].label} Items
            </span>
            <DSButton
              variant="ghost"
              icon={<X size={10} />}
              onClick={() => setSelectedSegment(null)}
              style={{ padding: 2 }}
            />
          </div>
          <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
            {segments[selectedSegment].items!.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center justify-between" style={{
                padding: '3px var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                background: 'var(--token-bg)',
                border: '1px solid var(--token-border-subtle)',
              }}>
                <span style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-secondary)',
                  fontFamily: 'var(--token-font-mono)',
                }}>
                  {item}
                </span>
                {onRemoveItem && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveItem(selectedSegment, itemIdx); }}
                    className="cursor-pointer"
                    style={{
                      border: 'none', background: 'none',
                      color: 'var(--token-text-disabled)',
                      padding: 2, display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--token-error)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--token-text-disabled)'; }}
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContextWindowDemo() {
  const [systemTokens, setSystemTokens] = useState(2400);
  const [historyTokens, setHistoryTokens] = useState(18600);
  const [userTokens, setUserTokens] = useState(1200);
  const [historyItems, setHistoryItems] = useState([
    'Message 1-5: Intro discussion (2.1k tokens)',
    'Message 6-12: Code review session (8.4k tokens)',
    'Message 13-18: Debug discussion (5.2k tokens)',
    'Message 19-22: Summary request (2.9k tokens)',
  ]);

  const simulateGrowth = () => {
    setSystemTokens(2400);
    setHistoryTokens(18600);
    setUserTokens(1200);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      if (frame > 40) { clearInterval(timer); return; }
      setHistoryTokens(prev => prev + Math.floor(Math.random() * 800));
      if (frame % 3 === 0) setUserTokens(prev => prev + Math.floor(Math.random() * 300));
    }, 150);
  };

  const handleRemoveItem = (segIdx: number, itemIdx: number) => {
    if (segIdx === 1) {
      setHistoryItems(prev => prev.filter((_, i) => i !== itemIdx));
      setHistoryTokens(prev => Math.max(0, prev - 3000));
    }
  };

  const totalUsed = systemTokens + historyTokens + userTokens;
  const pct = ((totalUsed / 128000) * 100).toFixed(1);

  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      <ContextWindow
        model="gpt-4o &middot; 128k"
        maxTokens={128000}
        segments={[
          { label: 'System', tokens: systemTokens, color: 'var(--token-chart-6)', items: ['System prompt (2.4k tokens)'] },
          { label: 'History', tokens: historyTokens, color: 'var(--token-chart-4)', items: historyItems },
          { label: 'User', tokens: userTokens, color: 'var(--token-chart-2)', items: ['Current input (1.2k tokens)'] },
        ]}
        onCompress={() => setHistoryTokens(prev => Math.floor(prev * 0.6))}
        onRemoveItem={handleRemoveItem}
      />
      <div className="flex items-center justify-between">
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {pct}% used ({totalUsed.toLocaleString()} / 128,000)
        </span>
        <button
          onClick={simulateGrowth}
          className="cursor-pointer"
          style={{
            fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
            fontFamily: 'var(--token-font-mono)',
            border: 'none', background: 'none',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}
        >
          simulate conversation
        </button>
      </div>
    </div>
  );
}
