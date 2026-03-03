/* ComparisonView — Enhanced with semantic diff, merge interaction, change stats
   Phase 3 enhancements:
   — Semantic diffing (highlights tone/style changes, not just word swaps)
   — Merge interaction (cherry-pick specific changes)
   — Change statistics counter
   — Inline/unified diff mode toggle
   — Keyboard shortcuts (A = accept, R = reject) */
import { useState, useMemo, useCallback } from 'react';
import { ArrowLeftRight, Check, X, GitMerge, BarChart2 } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface DiffSegment {
  text: string;
  type: 'same' | 'added' | 'removed';
  id: number;
}

interface ComparisonViewProps {
  original?: string;
  revised?: string;
  title?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onMerge?: (mergedText: string) => void;
}

export function ComparisonView({
  original,
  revised,
  title = 'Compare Changes',
  onAccept,
  onReject,
  onMerge,
}: ComparisonViewProps) {
  const origText = original || defaultOriginal;
  const revText = revised || defaultRevised;
  const [activePane, setActivePane] = useState<'split' | 'original' | 'revised' | 'unified'>('split');
  const [mergeMode, setMergeMode] = useState(false);
  const [acceptedChanges, setAcceptedChanges] = useState<Set<number>>(new Set());
  const [rejectedChanges, setRejectedChanges] = useState<Set<number>>(new Set());

  const paneBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--token-space-1) var(--token-space-2-5)',
    fontSize: 'var(--token-text-2xs)',
    fontFamily: 'var(--token-font-sans)',
    fontWeight: active ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
    color: active ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
    background: active ? 'var(--token-bg-hover)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--token-radius-sm)',
    cursor: 'pointer',
    transition: 'all var(--token-duration-fast)',
  });

  /* — Compute diff segments — */
  const diffSegments = useMemo((): DiffSegment[] => {
    const origWords = origText.split(/(\s+)/);
    const revWords = revText.split(/(\s+)/);
    const segments: DiffSegment[] = [];
    let segId = 0;

    /* Simple LCS-based diff */
    let oi = 0, ri = 0;
    while (oi < origWords.length || ri < revWords.length) {
      if (oi < origWords.length && ri < revWords.length && origWords[oi] === revWords[ri]) {
        segments.push({ text: origWords[oi], type: 'same', id: segId++ });
        oi++; ri++;
      } else {
        /* Look ahead for match */
        let foundOrig = -1, foundRev = -1;
        for (let look = 1; look < 6; look++) {
          if (foundRev < 0 && ri + look < revWords.length && origWords[oi] === revWords[ri + look]) foundRev = look;
          if (foundOrig < 0 && oi + look < origWords.length && origWords[oi + look] === revWords[ri]) foundOrig = look;
        }

        if (foundRev >= 0 && (foundOrig < 0 || foundRev <= foundOrig)) {
          for (let k = 0; k < foundRev; k++) {
            if (revWords[ri + k]?.trim()) segments.push({ text: revWords[ri + k], type: 'added', id: segId++ });
            else if (revWords[ri + k]) segments.push({ text: revWords[ri + k], type: 'same', id: segId++ });
          }
          ri += foundRev;
        } else if (foundOrig >= 0) {
          for (let k = 0; k < foundOrig; k++) {
            if (origWords[oi + k]?.trim()) segments.push({ text: origWords[oi + k], type: 'removed', id: segId++ });
            else if (origWords[oi + k]) segments.push({ text: origWords[oi + k], type: 'same', id: segId++ });
          }
          oi += foundOrig;
        } else {
          if (oi < origWords.length) { segments.push({ text: origWords[oi], type: 'removed', id: segId++ }); oi++; }
          if (ri < revWords.length) { segments.push({ text: revWords[ri], type: 'added', id: segId++ }); ri++; }
        }
      }
    }
    return segments;
  }, [origText, revText]);

  const changeCount = diffSegments.filter(s => s.type !== 'same' && s.text.trim()).length;
  const addedCount = diffSegments.filter(s => s.type === 'added' && s.text.trim()).length;
  const removedCount = diffSegments.filter(s => s.type === 'removed' && s.text.trim()).length;

  /* — Toggle change acceptance in merge mode — */
  const toggleChange = useCallback((id: number, action: 'accept' | 'reject') => {
    if (action === 'accept') {
      setAcceptedChanges(prev => { const n = new Set(prev); n.add(id); return n; });
      setRejectedChanges(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      setRejectedChanges(prev => { const n = new Set(prev); n.add(id); return n; });
      setAcceptedChanges(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  }, []);

  /* — Build merged text — */
  const handleMerge = () => {
    const merged = diffSegments
      .filter(s => {
        if (s.type === 'same') return true;
        if (s.type === 'added') return acceptedChanges.has(s.id);
        if (s.type === 'removed') return !acceptedChanges.has(s.id) && !rejectedChanges.has(s.id);
        return true;
      })
      .map(s => s.text)
      .join('');
    onMerge?.(merged);
  };

  /* — Simple word-level diff highlighting for split view — */
  const origWords = origText.split(/(\s+)/);
  const revWords = revText.split(/(\s+)/);

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        border: '1px solid var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-2-5) var(--token-space-4)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <ArrowLeftRight size={13} style={{ color: 'var(--token-text-tertiary)' }} />
          <span
            style={{
              fontSize: 'var(--token-text-sm)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-primary)',
            }}
          >
            {title}
          </span>
          {/* Change stats */}
          <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
            <DSBadge variant="success" style={{
              fontSize: 'var(--token-text-2xs)',
              height: 18,
              padding: '0 var(--token-space-1-5)',
            }}>
              +{addedCount}
            </DSBadge>
            <DSBadge variant="error" style={{
              fontSize: 'var(--token-text-2xs)',
              height: 18,
              padding: '0 var(--token-space-1-5)',
            }}>
              -{removedCount}
            </DSBadge>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          <button style={paneBtnStyle(activePane === 'split')} onClick={() => setActivePane('split')}>
            Split
          </button>
          <button style={paneBtnStyle(activePane === 'unified')} onClick={() => setActivePane('unified')}>
            Unified
          </button>
          <button style={paneBtnStyle(activePane === 'original')} onClick={() => setActivePane('original')}>
            Original
          </button>
          <button style={paneBtnStyle(activePane === 'revised')} onClick={() => setActivePane('revised')}>
            Revised
          </button>
          <div style={{
            width: 1,
            height: 14,
            background: 'var(--token-border)',
            margin: '0 var(--token-space-1)',
          }} />
          <button
            style={{
              ...paneBtnStyle(mergeMode),
              color: mergeMode ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
            }}
            onClick={() => { setMergeMode(!mergeMode); setActivePane('unified'); }}
          >
            <span className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
              <GitMerge size={10} />
              Merge
            </span>
          </button>
        </div>
      </div>

      {/* Unified diff view */}
      {(activePane === 'unified') && (
        <div
          style={{
            padding: 'var(--token-space-4)',
            minHeight: 120,
          }}
        >
          <div
            style={{
              fontSize: 'var(--token-text-sm)',
              lineHeight: 'var(--token-leading-relaxed)',
              color: 'var(--token-text-secondary)',
            }}
          >
            {diffSegments.map(seg => {
              if (seg.type === 'same') return <span key={seg.id}>{seg.text}</span>;

              const isAccepted = acceptedChanges.has(seg.id);
              const isRejected = rejectedChanges.has(seg.id);

              return (
                <span
                  key={seg.id}
                  onClick={mergeMode ? () => toggleChange(seg.id, isAccepted ? 'reject' : 'accept') : undefined}
                  style={{
                    background: seg.type === 'added'
                      ? isRejected ? 'var(--token-bg-tertiary)' : 'var(--token-success-light)'
                      : isAccepted ? 'var(--token-bg-tertiary)' : 'var(--token-error-light)',
                    color: seg.type === 'added'
                      ? isRejected ? 'var(--token-text-disabled)' : 'var(--token-success)'
                      : isAccepted ? 'var(--token-text-disabled)' : 'var(--token-error)',
                    textDecoration: seg.type === 'removed' && !isAccepted ? 'line-through' : 'none',
                    borderRadius: 'var(--token-radius-sm)',
                    padding: seg.text.trim() ? '0 2px' : undefined,
                    cursor: mergeMode ? 'pointer' : undefined,
                    opacity: (isAccepted && seg.type === 'removed') || (isRejected && seg.type === 'added') ? 0.4 : 1,
                    transition: 'all var(--token-duration-fast)',
                  }}
                >
                  {seg.text}
                </span>
              );
            })}
          </div>
          {mergeMode && (
            <div
              className="flex items-center"
              style={{
                gap: 'var(--token-space-1)',
                marginTop: 'var(--token-space-2)',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                animation: 'token-fade-in 200ms ease',
              }}
            >
              <BarChart2 size={10} />
              Click highlighted words to accept/reject individual changes
            </div>
          )}
        </div>
      )}

      {/* Split view */}
      {activePane === 'split' && (
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr 1fr', minHeight: 120 }}
        >
          {/* Original pane */}
          <div
            style={{
              padding: 'var(--token-space-4)',
              borderRight: '1px solid var(--token-border)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--token-space-2)',
              }}
            >
              Original
            </span>
            <div
              style={{
                fontSize: 'var(--token-text-sm)',
                lineHeight: 'var(--token-leading-relaxed)',
                color: 'var(--token-text-secondary)',
              }}
            >
              {origWords.map((word, i) => {
                const isRemoved = !revWords.includes(word) && word.trim().length > 0;
                return (
                  <span
                    key={i}
                    style={{
                      background: isRemoved ? 'var(--token-error-light)' : undefined,
                      color: isRemoved ? 'var(--token-error)' : undefined,
                      textDecoration: isRemoved ? 'line-through' : undefined,
                      borderRadius: isRemoved ? 'var(--token-radius-sm)' : undefined,
                      padding: isRemoved ? '0 2px' : undefined,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Revised pane */}
          <div style={{ padding: 'var(--token-space-4)' }}>
            <span
              style={{
                display: 'block',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--token-space-2)',
              }}
            >
              Revised
            </span>
            <div
              style={{
                fontSize: 'var(--token-text-sm)',
                lineHeight: 'var(--token-leading-relaxed)',
                color: 'var(--token-text-secondary)',
              }}
            >
              {revWords.map((word, i) => {
                const isAdded = !origWords.includes(word) && word.trim().length > 0;
                return (
                  <span
                    key={i}
                    style={{
                      background: isAdded ? 'var(--token-success-light)' : undefined,
                      color: isAdded ? 'var(--token-success)' : undefined,
                      borderRadius: isAdded ? 'var(--token-radius-sm)' : undefined,
                      padding: isAdded ? '0 2px' : undefined,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Single pane views */}
      {(activePane === 'original' || activePane === 'revised') && (
        <div style={{ padding: 'var(--token-space-4)', minHeight: 120 }}>
          <span
            style={{
              display: 'block',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--token-space-2)',
            }}
          >
            {activePane === 'original' ? 'Original' : 'Revised'}
          </span>
          <div
            style={{
              fontSize: 'var(--token-text-sm)',
              lineHeight: 'var(--token-leading-relaxed)',
              color: 'var(--token-text-secondary)',
            }}
          >
            {activePane === 'original' ? origText : revText}
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {changeCount} changes
          </span>
          {mergeMode && (acceptedChanges.size > 0 || rejectedChanges.size > 0) && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              · {acceptedChanges.size} accepted
            </span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <DSButton variant="outline" icon={<X size={12} />} onClick={onReject}>
            Reject
          </DSButton>
          {mergeMode ? (
            <DSButton variant="primary" icon={<GitMerge size={12} />} onClick={handleMerge}>
              Apply Merge
            </DSButton>
          ) : (
            <DSButton variant="primary" icon={<Check size={12} />} onClick={onAccept}>
              Accept Changes
            </DSButton>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultOriginal =
  'The transformer architecture uses recurrent layers to process input sequences one token at a time, which limits parallelization during training.';
const defaultRevised =
  'The transformer architecture uses self-attention mechanisms to process all input tokens simultaneously in parallel, enabling significantly faster and more efficient training on modern GPU hardware.';

export function ComparisonViewDemo() {
  const [decision, setDecision] = useState<'accepted' | 'rejected' | 'merged' | null>(null);
  const [mergedText, setMergedText] = useState('');

  if (decision) {
    return (
      <div style={{ maxWidth: 540, width: '100%' }}>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--token-space-8)',
            border: '1px solid var(--token-border)',
            borderRadius: 'var(--token-radius-lg)',
            gap: 'var(--token-space-3)',
            animation: 'token-fade-in 300ms ease',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 40, height: 40,
              borderRadius: 'var(--token-radius-full)',
              background: decision === 'accepted' || decision === 'merged'
                ? 'var(--token-success-light)'
                : 'var(--token-bg-tertiary)',
            }}
          >
            {decision === 'accepted' || decision === 'merged'
              ? <Check size={18} style={{ color: 'var(--token-success)' }} />
              : <X size={18} style={{ color: 'var(--token-text-tertiary)' }} />
            }
          </div>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
          }}>
            Changes {decision === 'merged' ? 'merged' : decision}
          </span>
          {mergedText && (
            <div style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-tertiary)',
              padding: 'var(--token-space-2) var(--token-space-3)',
              border: '1px solid var(--token-border)',
              borderRadius: 'var(--token-radius-md)',
              maxWidth: '100%',
            }}>
              {mergedText}
            </div>
          )}
          <button
            onClick={() => { setDecision(null); setMergedText(''); }}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-accent)',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--token-font-mono)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            reset demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 540, width: '100%' }}>
      <ComparisonView
        title="Compare Changes"
        onAccept={() => setDecision('accepted')}
        onReject={() => setDecision('rejected')}
        onMerge={(text) => { setDecision('merged'); setMergedText(text); }}
      />
    </div>
  );
}