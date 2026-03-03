/* SourceCitation — Enhanced with verification status, relevance ranking, hover highlight
   Composed from DS atoms (DSBadge)
   Phase 3: verification badges, relevance ordering, inline citation highlighting */
import { Globe, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { DSBadge } from '../ds/atoms';
import { useState } from 'react';

type VerificationStatus = 'verified' | 'community' | 'unverified';

interface Source {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  relevance?: number;
  verification?: VerificationStatus;
}

interface SourceCitationProps {
  sources: Source[];
  onHoverSource?: (sourceIdx: number | null) => void;
}

const verificationConfig: Record<VerificationStatus, { icon: React.ReactNode; label: string; color: string }> = {
  verified: { icon: <ShieldCheck size={10} />, label: 'Verified', color: 'var(--token-success)' },
  community: { icon: <HelpCircle size={10} />, label: 'Community', color: 'var(--token-warning)' },
  unverified: { icon: <AlertTriangle size={10} />, label: 'Unverified', color: 'var(--token-text-disabled)' },
};

export function SourceCitation({ sources, onHoverSource }: SourceCitationProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  /* Sort by relevance (highest first) if relevance scores provided */
  const sortedSources = [...sources].sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      <DSBadge variant="tertiary" style={{
        textTransform: 'uppercase',
        letterSpacing: 'var(--token-tracking-wide)',
        alignSelf: 'flex-start',
        marginBottom: 'var(--token-space-1)',
      }}>
        Sources ({sortedSources.length})
      </DSBadge>
      <div className="flex flex-wrap" style={{ gap: 'var(--token-space-2)' }}>
        {sortedSources.map((source, i) => {
          const isExpanded = expandedIdx === i;
          const verif = source.verification ? verificationConfig[source.verification] : null;
          return (
            <div
              key={i}
              onClick={() => setExpandedIdx(isExpanded ? null : i)}
              onMouseEnter={() => onHoverSource?.(i)}
              onMouseLeave={() => onHoverSource?.(null)}
              className="flex flex-col cursor-pointer"
              style={{
                gap: 'var(--token-space-1)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                border: `1px solid ${isExpanded ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: isExpanded ? 'var(--token-bg-hover)' : 'var(--token-bg)',
                fontFamily: 'var(--token-font-sans)',
                transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
                maxWidth: isExpanded ? '100%' : 240,
                width: isExpanded ? '100%' : 'auto',
                animation: `token-fade-in 200ms ease ${i * 60}ms both`,
              }}
              onMouseOver={e => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border-strong)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }
              }}
              onMouseOut={e => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 20, height: 20,
                    borderRadius: 'var(--token-radius-sm)',
                    background: isExpanded ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: isExpanded ? 'var(--token-text-inverse)' : 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                    transition: 'all 200ms ease',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex flex-col overflow-hidden flex-1" style={{ gap: 0 }}>
                  <span className="truncate" style={{
                    fontSize: 'var(--token-text-sm)',
                    color: 'var(--token-text-primary)',
                    fontWeight: 'var(--token-weight-medium)',
                    lineHeight: 'var(--token-leading-tight)',
                  }}>
                    {source.title}
                  </span>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <span className="truncate" style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-tertiary)',
                      lineHeight: 'var(--token-leading-tight)',
                    }}>
                      {source.domain}
                    </span>
                    {/* Verification badge */}
                    {verif && (
                      <span className="flex items-center shrink-0" style={{
                        gap: 2,
                        fontSize: 'var(--token-text-2xs)',
                        color: verif.color,
                      }}>
                        {verif.icon}
                        <span>{verif.label}</span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Relevance score */}
                {source.relevance !== undefined && (
                  <span className="shrink-0" style={{
                    fontSize: 'var(--token-text-2xs)',
                    fontFamily: 'var(--token-font-mono)',
                    color: source.relevance >= 80 ? 'var(--token-success)' : source.relevance >= 50 ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                  }}>
                    {source.relevance}%
                  </span>
                )}
              </div>
              {isExpanded && source.snippet && (
                <div style={{
                  fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-secondary)',
                  lineHeight: 'var(--token-leading-relaxed)',
                  padding: 'var(--token-space-2) 0 0 28px',
                  borderTop: '1px solid var(--token-border)',
                  marginTop: 'var(--token-space-1)',
                  animation: 'token-fade-in 200ms ease',
                }}>
                  "{source.snippet}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sampleSources: Source[] = [
  { title: 'Attention Is All You Need', url: '#', domain: 'arxiv.org', snippet: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', relevance: 95, verification: 'verified' },
  { title: 'Transformer Architecture', url: '#', domain: 'wikipedia.org', snippet: 'A transformer is a deep learning architecture based on the multi-head attention mechanism, proposed in the 2017 paper "Attention Is All You Need".', relevance: 82, verification: 'community' },
  { title: 'The Illustrated Transformer', url: '#', domain: 'jalammar.github.io', snippet: 'In this post, we will look at The Transformer — a model that uses attention to boost the speed and quality of sequence-to-sequence models.', relevance: 78, verification: 'verified' },
  { title: 'LLM Training Guide', url: '#', domain: 'huggingface.co', snippet: 'This guide covers the fundamentals of training large language models, from data preparation to distributed training strategies.', relevance: 45, verification: 'unverified' },
];

export function SourceCitationDemo() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
        {hoveredSource !== null && (
          <div style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: 'var(--token-accent-muted)',
            border: '1px solid var(--token-accent)',
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-accent)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 150ms ease',
          }}>
            Highlighting response text derived from source #{hoveredSource + 1}
          </div>
        )}
        <SourceCitation sources={sampleSources} onHoverSource={setHoveredSource} />
      </div>
    </div>
  );
}
