/* —— ResearchCard — Phase 3 Enhanced —— */
import { BookOpen, ExternalLink, TrendingUp, Plus, ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { DSBadge, DSDot, DSButton } from '../ds/atoms';
import { useState } from 'react';

/* —— Types —— */
interface ResearchCardProps {
  title: string;
  summary: string;
  findings: string[];
  sourceCount: number;
  confidence: number;
  category?: string;
  url?: string;
  onAddToContext?: () => void;
  onShowSummary?: () => void;
  aiSummary?: string;
}

export function ResearchCard({
  title,
  summary,
  findings,
  sourceCount,
  confidence,
  category,
  url,
  onAddToContext,
  onShowSummary,
  aiSummary,
}: ResearchCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [addedToContext, setAddedToContext] = useState(false);
  const [copied, setCopied] = useState(false);

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'var(--token-confidence-high)';
    if (confidence >= 50) return 'var(--token-confidence-medium)';
    return 'var(--token-confidence-low)';
  };

  const handleAddToContext = () => {
    setAddedToContext(true);
    onAddToContext?.();
    setTimeout(() => setAddedToContext(false), 2000);
  };

  const handleCopy = () => {
    const text = `${title}\n\n${summary}\n\nKey Findings:\n${findings.map(f => `- ${f}`).join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleSummary = () => {
    setShowSummary(!showSummary);
    if (!showSummary) onShowSummary?.();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
        background: 'var(--token-bg)',
        transition: 'box-shadow 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        borderColor: hovered ? 'var(--token-border-strong)' : 'var(--token-border)',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <BookOpen size={14} style={{ color: 'var(--token-text-tertiary)' }} />
          {category && <DSBadge variant="ai">{category}</DSBadge>}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {/* Copy button on hover */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 24, height: 24,
              borderRadius: 'var(--token-radius-sm)',
              border: 'none',
              background: 'transparent',
              color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)',
              padding: 0,
              opacity: hovered || copied ? 1 : 0,
              transition: 'opacity var(--token-duration-fast), color var(--token-duration-fast)',
            }}
            title="Copy card content"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <DSDot color={getConfidenceColor()} size={6} />
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {confidence}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--token-space-4)' }}>
        <div
          style={{
            fontSize: 'var(--token-text-md)',
            fontWeight: 'var(--token-weight-semibold)',
            color: 'var(--token-text-primary)',
            marginBottom: 'var(--token-space-2)',
            letterSpacing: 'var(--token-tracking-tight)',
          }}
        >
          {title}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-relaxed)',
            marginBottom: 'var(--token-space-4)',
          }}
        >
          {summary}
        </p>

        {/* Key Findings */}
        <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--token-tracking-wide)',
            }}
          >
            Key Findings
          </span>
          {findings.map((f, i) => (
            <div key={i} className="flex items-start" style={{ gap: 'var(--token-space-2)' }}>
              <TrendingUp size={12} className="shrink-0" style={{ color: 'var(--token-success)', marginTop: 3 }} />
              <span
                style={{
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-primary)',
                  lineHeight: 'var(--token-leading-normal)',
                }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* AI Summary — expandable */}
        {(aiSummary || onShowSummary) && (
          <div style={{ marginTop: 'var(--token-space-3)' }}>
            <button
              onClick={handleToggleSummary}
              className="flex items-center cursor-pointer"
              style={{
                gap: 'var(--token-space-1-5)',
                border: 'none',
                background: 'none',
                padding: 0,
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-accent)',
                fontFamily: 'var(--token-font-sans)',
                fontWeight: 'var(--token-weight-medium)',
              }}
            >
              <Sparkles size={11} />
              {showSummary ? 'Hide AI Summary' : 'Show AI Summary'}
              {showSummary ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showSummary && (
              <div
                style={{
                  marginTop: 'var(--token-space-2)',
                  padding: 'var(--token-space-3)',
                  borderRadius: 'var(--token-radius-md)',
                  background: 'var(--token-bg-secondary)',
                  border: '1px solid var(--token-border-subtle)',
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-secondary)',
                  lineHeight: 'var(--token-leading-relaxed)',
                  animation: 'token-fade-in 200ms ease',
                }}
              >
                {aiSummary || 'AI summary loading...'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
          }}
        >
          {sourceCount} sources analyzed
        </span>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {/* Add to context */}
          <DSButton
            variant="ghost"
            icon={addedToContext ? <Check size={11} /> : <Plus size={11} />}
            onClick={handleAddToContext}
            style={{
              fontSize: 'var(--token-text-2xs)',
              padding: 'var(--token-space-1) var(--token-space-2)',
              color: addedToContext ? 'var(--token-success)' : 'var(--token-accent)',
              background: addedToContext ? 'var(--token-success-light)' : 'var(--token-accent-light)',
            }}
          >
            {addedToContext ? 'Added' : 'Add to Context'}
          </DSButton>
          {url && (
            <span
              className="flex items-center cursor-pointer"
              style={{
                gap: 'var(--token-space-1)',
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-accent)',
                fontWeight: 'var(--token-weight-medium)',
              }}
              onClick={() => window.open(url, '_blank')}
            >
              View <ExternalLink size={10} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResearchCardDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      <ResearchCard
        title="Impact of Transformer Models on NLP"
        summary="Analysis of how transformer-based architectures have revolutionized natural language processing since 2017."
        category="Research"
        confidence={92}
        sourceCount={24}
        findings={[
          '94% of state-of-the-art NLP models use attention',
          'Training costs reduced 60% with efficient architectures',
          'Context windows expanded from 512 to 1M+ tokens',
        ]}
        aiSummary="Transformer models have fundamentally changed NLP by replacing recurrent architectures with self-attention mechanisms. Key advances include: massive context window expansion, cost reduction through efficiency research, and near-universal adoption in production systems. The trend toward mixture-of-experts architectures suggests continued innovation."
        url="https://example.com"
      />
    </div>
  );
}
