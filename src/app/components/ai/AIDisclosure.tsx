/* —— AIDisclosure — Phase 3 Enhanced ——
   Phase 3: expandable provenance details, copy citation,
   verification link, animated badge pulse, feedback action */
import { Bot, ShieldCheck, Eye, Copy, Check, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { DSButton, DSBadge } from '../ds/atoms';

type DisclosureVariant = 'badge' | 'banner' | 'watermark' | 'inline';

interface AIDisclosureProps {
  variant?: DisclosureVariant;
  model?: string;
  timestamp?: string;
  confidence?: number;
  label?: string;
  verifyUrl?: string;
  onFeedback?: (positive: boolean) => void;
}

export function AIDisclosure({
  variant = 'badge',
  model,
  timestamp,
  confidence,
  label = 'AI Generated',
  verifyUrl,
  onFeedback,
}: AIDisclosureProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  /* —— Copy citation —— */
  const handleCopy = () => {
    const citation = `AI-generated content${model ? ` by ${model}` : ''}${timestamp ? ` on ${timestamp}` : ''}${confidence !== undefined ? ` (confidence: ${(confidence * 100).toFixed(0)}%)` : ''}`;
    navigator.clipboard.writeText(citation).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFeedback = (positive: boolean) => {
    setFeedbackGiven(positive ? 'up' : 'down');
    onFeedback?.(positive);
  };

  if (variant === 'badge') {
    return (
      <div className="relative inline-flex">
        <DSButton
          variant="outline"
          icon={<Bot size={12} />}
          onClick={() => setShowDetails(!showDetails)}
          style={{
            borderRadius: 'var(--token-radius-full)',
            padding: 'var(--token-space-1) var(--token-space-2-5)',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
          }}
        >
          {label}
        </DSButton>

        {showDetails && (
          <div
            className="absolute"
            style={{
              top: 'calc(100% + var(--token-space-1))',
              left: 0,
              minWidth: 240,
              padding: 'var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--token-border)',
              background: 'var(--token-bg)',
              boxShadow: 'var(--token-shadow-md)',
              zIndex: 50,
              animation: 'token-fade-in var(--token-duration-fast) var(--token-ease-default)',
            }}
          >
            <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
              {/* Provenance header */}
              <div className="flex items-center justify-between">
                <span style={{
                  fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-primary)',
                }}>
                  AI Provenance
                </span>
                <ShieldCheck size={12} style={{ color: 'var(--token-success)' }} />
              </div>

              <div style={{
                height: 1,
                background: 'var(--token-border-subtle)',
              }} />

              {model && (
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Model</span>
                  <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', fontFamily: 'var(--token-font-mono)' }}>{model}</span>
                </div>
              )}
              {timestamp && (
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Generated</span>
                  <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>{timestamp}</span>
                </div>
              )}
              {confidence !== undefined && (
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Confidence</span>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
                    <div style={{
                      width: 40,
                      height: 3,
                      borderRadius: 'var(--token-radius-full)',
                      background: 'var(--token-bg-tertiary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${confidence * 100}%`,
                        height: '100%',
                        borderRadius: 'var(--token-radius-full)',
                        background: confidence > 0.8 ? 'var(--token-success)' : confidence > 0.5 ? 'var(--token-warning)' : 'var(--token-error)',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 'var(--token-text-xs)',
                      fontFamily: 'var(--token-font-mono)',
                      color: confidence > 0.8 ? 'var(--token-success)' : confidence > 0.5 ? 'var(--token-warning)' : 'var(--token-error)',
                    }}>
                      {(confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{
                height: 1,
                background: 'var(--token-border-subtle)',
                marginTop: 'var(--token-space-0-5)',
              }} />

              <div className="flex items-center justify-between">
                {/* Copy citation */}
                <button
                  onClick={handleCopy}
                  className="flex items-center cursor-pointer"
                  style={{
                    gap: 'var(--token-space-1)',
                    padding: 'var(--token-space-1) var(--token-space-2)',
                    borderRadius: 'var(--token-radius-sm)',
                    borderWidth: 0,
                    borderStyle: 'none',
                    background: 'var(--token-bg-tertiary)',
                    color: 'var(--token-text-tertiary)',
                    fontSize: 'var(--token-text-2xs)',
                    fontFamily: 'var(--token-font-mono)',
                    transition: 'all var(--token-duration-fast)',
                  }}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  {copied ? 'Copied' : 'Cite'}
                </button>

                {/* Feedback */}
                <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                  <button
                    onClick={() => handleFeedback(true)}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 22, height: 22,
                      borderRadius: 'var(--token-radius-sm)',
                      borderWidth: 0,
                      borderStyle: 'none',
                      background: feedbackGiven === 'up' ? 'var(--token-success)' : 'var(--token-bg-tertiary)',
                      color: feedbackGiven === 'up' ? 'var(--token-text-inverse)' : 'var(--token-text-disabled)',
                      padding: 0,
                      transition: 'all var(--token-duration-fast)',
                    }}
                  >
                    <ThumbsUp size={10} />
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 22, height: 22,
                      borderRadius: 'var(--token-radius-sm)',
                      borderWidth: 0,
                      borderStyle: 'none',
                      background: feedbackGiven === 'down' ? 'var(--token-error)' : 'var(--token-bg-tertiary)',
                      color: feedbackGiven === 'down' ? 'var(--token-text-inverse)' : 'var(--token-text-disabled)',
                      padding: 0,
                      transition: 'all var(--token-duration-fast)',
                    }}
                  >
                    <ThumbsDown size={10} />
                  </button>
                </div>

                {/* Verify link */}
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                    style={{
                      gap: 'var(--token-space-1)',
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-accent)',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={10} />
                    Verify
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2) var(--token-space-4)',
          borderRadius: 'var(--token-radius-md)',
          background: 'var(--token-bg-tertiary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--token-border-subtle)',
          fontFamily: 'var(--token-font-sans)',
        }}
      >
        <ShieldCheck size={14} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />
        <span style={{
          fontSize: 'var(--token-text-xs)',
          color: 'var(--token-text-tertiary)',
          lineHeight: 'var(--token-leading-normal)',
          flex: 1,
        }}>
          This content was generated by AI{model ? ` (${model})` : ''} and may contain inaccuracies. Always verify important information.
        </span>
        {confidence !== undefined && (
          <DSBadge variant={confidence > 0.8 ? 'success' : confidence > 0.5 ? 'warning' : 'error'}>
            {(confidence * 100).toFixed(0)}%
          </DSBadge>
        )}
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div className="flex items-center" style={{
        gap: 'var(--token-space-1)',
        fontFamily: 'var(--token-font-mono)',
        opacity: 0.3,
      }}>
        <Eye size={10} />
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--token-text-primary)',
        }}>AI Generated</span>
        {model && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-primary)',
          }}>
            · {model}
          </span>
        )}
      </div>
    );
  }

  return (
    <DSBadge variant="ai">
      <Bot size={10} style={{ marginRight: 2 }} />
      AI
    </DSBadge>
  );
}

export function AIDisclosureDemo() {
  const [activeVariant, setActiveVariant] = useState<DisclosureVariant>('badge');
  const variants: Array<{ key: DisclosureVariant; label: string }> = [
    { key: 'badge', label: 'Badge' },
    { key: 'banner', label: 'Banner' },
    { key: 'watermark', label: 'Watermark' },
    { key: 'inline', label: 'Inline' },
  ];

  return (
    <div className="flex flex-col items-start" style={{ gap: 'var(--token-space-5)', maxWidth: 440, width: '100%' }}>
      {/* Variant selector */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {variants.map(v => (
          <button
            key={v.key}
            onClick={() => setActiveVariant(v.key)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: activeVariant === v.key ? 'var(--token-accent)' : 'var(--token-border)',
              background: activeVariant === v.key ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: activeVariant === v.key ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      {/* Active variant preview */}
      <div key={activeVariant} className="w-full" style={{ animation: 'token-fade-in 200ms ease' }}>
        {activeVariant === 'badge' && (
          <AIDisclosure variant="badge" model="GPT-4o" timestamp="2 min ago" confidence={0.92} verifyUrl="#" />
        )}
        {activeVariant === 'banner' && (
          <AIDisclosure variant="banner" model="Claude 3.5" confidence={0.87} />
        )}
        {activeVariant === 'watermark' && (
          <AIDisclosure variant="watermark" model="Gemini Pro" />
        )}
        {activeVariant === 'inline' && (
          <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)' }}>
            This paragraph was written by <AIDisclosure variant="inline" /> and should be reviewed before publishing.
          </span>
        )}
      </div>
    </div>
  );
}
