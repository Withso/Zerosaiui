import { useState, useEffect } from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink,
  ChevronDown, RotateCw, Loader2, Check, X, Clock,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
type VerificationStatus = 'verified' | 'unverified' | 'disputed' | 'partial';

interface VerificationSource {
  name: string;
  url?: string;
  verdict: 'supports' | 'contradicts' | 'unclear';
  reliability?: number;
}

interface VerificationBadgeProps {
  status: VerificationStatus;
  claim?: string;
  sources?: VerificationSource[];
  lastChecked?: string;
  confidence?: number;
  onReVerify?: () => void;
}

/* —— Config maps —— */
const statusConfig: Record<VerificationStatus, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
}> = {
  verified: {
    icon: <ShieldCheck size={14} />,
    label: 'Verified',
    color: 'var(--token-success)',
    bg: 'var(--token-success-light)',
  },
  unverified: {
    icon: <ShieldQuestion size={14} />,
    label: 'Unverified',
    color: 'var(--token-text-tertiary)',
    bg: 'var(--token-bg-tertiary)',
  },
  disputed: {
    icon: <ShieldAlert size={14} />,
    label: 'Disputed',
    color: 'var(--token-error)',
    bg: 'var(--token-error-light)',
  },
  partial: {
    icon: <ShieldCheck size={14} />,
    label: 'Partially Verified',
    color: 'var(--token-warning)',
    bg: 'var(--token-warning-light)',
  },
};

const verdictConfig: Record<string, { color: string; label: string }> = {
  supports: { color: 'var(--token-success)', label: 'Supports' },
  contradicts: { color: 'var(--token-error)', label: 'Contradicts' },
  unclear: { color: 'var(--token-text-tertiary)', label: 'Unclear' },
};

/* —— Reliability bar —— */
function ReliabilityBar({ value }: { value: number }) {
  const color = value >= 80 ? 'var(--token-success)' : value >= 50 ? 'var(--token-warning)' : 'var(--token-error)';
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
      <div style={{
        width: 40, height: 3,
        borderRadius: 'var(--token-radius-full)',
        background: 'var(--token-bg-tertiary)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          borderRadius: 'var(--token-radius-full)',
          background: color,
          transition: 'width var(--token-duration-normal) var(--token-ease-default)',
        }} />
      </div>
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        fontFamily: 'var(--token-font-mono)',
        color: 'var(--token-text-disabled)',
      }}>
        {value}%
      </span>
    </div>
  );
}

export function VerificationBadge({
  status, claim, sources, lastChecked, confidence, onReVerify,
}: VerificationBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const config = statusConfig[status];

  const handleReVerify = () => {
    setVerifying(true);
    onReVerify?.();
    setTimeout(() => setVerifying(false), 2000);
  };

  /* —— Aggregate source stats —— */
  const sourceStats = sources ? {
    supporting: sources.filter(s => s.verdict === 'supports').length,
    contradicting: sources.filter(s => s.verdict === 'contradicts').length,
    unclear: sources.filter(s => s.verdict === 'unclear').length,
  } : null;

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
        transition: 'box-shadow var(--token-duration-normal) var(--token-ease-default)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--token-shadow-sm)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* —— Main badge bar —— */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          border: 'none',
          background: config.bg,
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
          transition: 'background var(--token-duration-fast) var(--token-ease-default)',
        }}
      >
        {/* Status icon */}
        <span style={{
          color: config.color,
          flexShrink: 0,
          display: 'flex',
          animation: verifying ? 'spin 1s linear infinite' : undefined,
        }}>
          {verifying ? <Loader2 size={14} /> : config.icon}
        </span>

        {/* Label */}
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-xs)',
            fontWeight: 'var(--token-weight-medium)',
            color: config.color,
          }}
        >
          {verifying ? 'Re-verifying...' : config.label}
        </span>

        {/* Confidence badge */}
        {confidence !== undefined && !verifying && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: config.color,
            padding: 'var(--token-space-0-5) var(--token-space-1-5)',
            borderRadius: 'var(--token-radius-sm)',
            background: 'color-mix(in srgb, currentColor 8%, transparent)',
          }}>
            {confidence}%
          </span>
        )}

        {/* Source summary */}
        {sourceStats && !verifying && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)', flexShrink: 0 }}>
            {sourceStats.supporting > 0 && (
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-success)', fontFamily: 'var(--token-font-mono)' }}>
                {sourceStats.supporting}\u2713
              </span>
            )}
            {sourceStats.contradicting > 0 && (
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)', fontFamily: 'var(--token-font-mono)' }}>
                {sourceStats.contradicting}\u2717
              </span>
            )}
            {sourceStats.unclear > 0 && (
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                {sourceStats.unclear}?
              </span>
            )}
          </div>
        )}

        {/* Last checked */}
        {lastChecked && !verifying && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Clock size={9} />
            {lastChecked}
          </span>
        )}

        {/* Chevron */}
        {(sources || claim) && (
          <ChevronDown
            size={12}
            style={{
              color: 'var(--token-text-disabled)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform var(--token-duration-normal)',
              flexShrink: 0,
            }}
          />
        )}
      </button>

      {/* —— Expanded details —— */}
      {expanded && (
        <div
          className="flex flex-col"
          style={{
            borderTop: '1px solid var(--token-border)',
            padding: 'var(--token-space-3) var(--token-space-4)',
            gap: 'var(--token-space-3)',
            animation: 'token-fade-in 150ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Claim */}
          {claim && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Claim
              </span>
              <span style={{
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-secondary)',
                lineHeight: 'var(--token-leading-normal)',
                fontStyle: 'italic',
              }}>
                &ldquo;{claim}&rdquo;
              </span>
            </div>
          )}

          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Sources ({sources.length})
              </span>
              {sources.map((src, i) => {
                const v = verdictConfig[src.verdict];
                return (
                  <div
                    key={i}
                    className="flex items-center"
                    style={{
                      gap: 'var(--token-space-2)',
                      padding: 'var(--token-space-1-5) var(--token-space-2-5)',
                      borderRadius: 'var(--token-radius-sm)',
                      background: 'var(--token-bg-tertiary)',
                      transition: 'background var(--token-duration-fast) var(--token-ease-default)',
                      animation: `token-fade-in 200ms ease ${i * 60}ms both`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--token-bg-tertiary)'; }}
                  >
                    <span style={{
                      width: 5, height: 5,
                      borderRadius: 'var(--token-radius-full)',
                      background: v.color,
                      flexShrink: 0,
                    }} />
                    <span
                      className="flex-1 truncate"
                      style={{
                        fontSize: 'var(--token-text-xs)',
                        color: 'var(--token-text-secondary)',
                      }}
                    >
                      {src.name}
                    </span>

                    {/* Reliability indicator */}
                    {src.reliability !== undefined && (
                      <ReliabilityBar value={src.reliability} />
                    )}

                    <span style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: v.color,
                      fontFamily: 'var(--token-font-mono)',
                      flexShrink: 0,
                    }}>
                      {v.label}
                    </span>

                    {src.url && (
                      <ExternalLink size={10} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {onReVerify && (
              <DSButton
                variant="ghost"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReVerify(); }}
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  padding: 'var(--token-space-1) var(--token-space-2)',
                  color: config.color,
                }}
              >
                <RotateCw size={10} style={{ animation: verifying ? 'spin 1s linear infinite' : undefined }} />
                {verifying ? 'Checking...' : 'Re-verify'}
              </DSButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* —— Demo —— */
export function VerificationBadgeDemo() {
  const claims: VerificationBadgeProps[] = [
    {
      status: 'verified',
      claim: "Transformers were introduced in the 2017 paper 'Attention Is All You Need'.",
      lastChecked: '2 min ago',
      confidence: 97,
      sources: [
        { name: 'arxiv.org \u2014 Vaswani et al.', verdict: 'supports', url: '#', reliability: 98 },
        { name: 'Wikipedia \u2014 Transformer (deep learning)', verdict: 'supports', url: '#', reliability: 85 },
      ],
    },
    {
      status: 'partial',
      claim: 'GPT-4 has 1.8 trillion parameters.',
      lastChecked: '5 min ago',
      confidence: 42,
      sources: [
        { name: 'OpenAI Blog', verdict: 'unclear', reliability: 90 },
        { name: 'Tech Review \u2014 Rumored architecture', verdict: 'supports', url: '#', reliability: 55 },
      ],
    },
    {
      status: 'disputed',
      claim: 'AI will replace all programming jobs by 2025.',
      lastChecked: '1 min ago',
      confidence: 8,
      sources: [
        { name: 'MIT Tech Review', verdict: 'contradicts', url: '#', reliability: 95 },
        { name: 'Stack Overflow Survey 2024', verdict: 'contradicts', url: '#', reliability: 88 },
        { name: 'LinkedIn Pulse Article', verdict: 'supports', url: '#', reliability: 30 },
      ],
    },
    {
      status: 'unverified',
      claim: 'This model was trained on data up to April 2024.',
      lastChecked: 'Not checked',
    },
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const [key, setKey] = useState(0);
  const [statuses, setStatuses] = useState(claims.map(c => c.status));

  useEffect(() => {
    setVisibleCount(0);
    setStatuses(claims.map(c => c.status));
    const timers = claims.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 400 + i * 500)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, [key]);

  const allVisible = visibleCount >= claims.length;
  const verifiedCount = statuses.filter(s => s === 'verified').length;

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2-5)', maxWidth: 440, width: '100%' }}>
      {claims.slice(0, visibleCount).map((c, i) => (
        <div key={`${key}-${i}`} style={{ animation: 'token-fade-in 300ms ease' }}>
          <VerificationBadge
            status={statuses[i]}
            claim={c.claim}
            lastChecked={c.lastChecked}
            sources={c.sources}
            confidence={c.confidence}
            onReVerify={() => {
              setStatuses(prev => {
                const next = [...prev];
                next[i] = 'verified';
                return next;
              });
            }}
          />
        </div>
      ))}

      {allVisible && (
        <div className="flex items-center justify-between" style={{ animation: 'token-fade-in 300ms ease' }}>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {verifiedCount}/{claims.length} verified
          </span>
          <button
            onClick={() => setKey(k => k + 1)}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            re-verify all
          </button>
        </div>
      )}
    </div>
  );
}
