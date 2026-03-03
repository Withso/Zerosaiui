import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, AlertTriangle, ChevronDown } from 'lucide-react';
import { DSColorBar } from '../ds/atoms-extra';

/* —————————————————————————————————————————————————————
   TokenUsage — enhanced with category breakdown,
   cost estimation, trend indicator, and threshold alerts
   ————————————————————————————————————————————————————— */

interface TokenBreakdown {
  label: string;
  tokens: number;
  color: string;
}

interface TokenUsageProps {
  inputTokens: number;
  outputTokens: number;
  maxTokens: number;
  model?: string;
  /* — Phase 3 enhancements — */
  breakdown?: TokenBreakdown[];
  costPerInputToken?: number;
  costPerOutputToken?: number;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  tokensPerSecond?: number;
  showBreakdownDefault?: boolean;
}

export function TokenUsage({
  inputTokens, outputTokens, maxTokens, model,
  breakdown, costPerInputToken, costPerOutputToken,
  trend, trendLabel, tokensPerSecond,
  showBreakdownDefault = false,
}: TokenUsageProps) {
  const totalUsed = inputTokens + outputTokens;
  const percentage = Math.min((totalUsed / maxTokens) * 100, 100);
  const [hovered, setHovered] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(showBreakdownDefault);

  const getBarColor = () => {
    if (percentage > 90) return 'var(--token-error)';
    if (percentage > 70) return 'var(--token-warning)';
    return 'var(--token-accent)';
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const formatCost = (cost: number) => {
    if (cost < 0.01) return `<$0.01`;
    return `$${cost.toFixed(4)}`;
  };

  const estimatedCost = (costPerInputToken && costPerOutputToken)
    ? (inputTokens * costPerInputToken) + (outputTokens * costPerOutputToken)
    : null;

  const isNearLimit = percentage > 85;
  const isAtLimit = percentage > 95;

  /* — Trend icon — */
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--token-warning)' : trend === 'down' ? 'var(--token-success)' : 'var(--token-text-tertiary)';

  /* — Bar segments: if breakdown provided, use those; otherwise input/output split — */
  const barSegments = breakdown
    ? breakdown.map(b => ({ value: b.tokens, color: b.color }))
    : [
        { value: inputTokens, color: 'var(--token-accent)' },
        { value: outputTokens, color: 'var(--token-chart-2, var(--token-accent))' },
      ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'var(--token-space-4)',
        borderRadius: 'var(--token-radius-lg)',
        border: `1px solid ${isAtLimit ? 'var(--token-error)' : 'var(--token-border)'}`,
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
        transition: 'box-shadow 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease',
        boxShadow: hovered ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
        borderColor: isAtLimit ? 'var(--token-error)' : hovered ? 'var(--token-border-strong)' : undefined,
      }}
    >
      {/* — Header — */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--token-space-3)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Zap size={14} style={{ color: isNearLimit ? getBarColor() : 'var(--token-text-tertiary)' }} />
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--token-tracking-wide)',
            }}
          >
            Token Usage
          </span>
          {/* — Trend indicator — */}
          {trend && (
            <div
              className="flex items-center"
              style={{
                gap: 'var(--token-space-1)',
                marginLeft: 'var(--token-space-1)',
                animation: 'token-fade-in 200ms ease',
              }}
            >
              <TrendIcon size={10} style={{ color: trendColor }} />
              {trendLabel && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: trendColor,
                  fontFamily: 'var(--token-font-mono)',
                }}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {/* — Tokens/sec streaming indicator — */}
          {tokensPerSecond != null && tokensPerSecond > 0 && (
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-success)',
                fontFamily: 'var(--token-font-mono)',
                animation: 'token-fade-in 200ms ease',
              }}
            >
              {tokensPerSecond.toFixed(0)} tok/s
            </span>
          )}
          {model && (
            <span
              style={{
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-tertiary)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              {model}
            </span>
          )}
        </div>
      </div>

      {/* — Progress Bar — */}
      <div style={{ marginBottom: 'var(--token-space-3)', position: 'relative' }}>
        <DSColorBar
          segments={barSegments}
          total={maxTokens}
          height={breakdown ? 6 : 4}
        />
        {/* — Percentage tooltip on hover — */}
        {hovered && (
          <span style={{
            position: 'absolute',
            left: `${Math.min(percentage, 96)}%`,
            top: -22,
            transform: 'translateX(-50%)',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            color: getBarColor(),
            fontWeight: 'var(--token-weight-medium)',
            animation: 'token-fade-in 100ms ease',
            whiteSpace: 'nowrap',
          }}>
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>

      {/* — Stats row — */}
      <div
        className="flex items-center justify-between"
        style={{ gap: 'var(--token-space-4)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-4)' }}>
          <div className="flex flex-col">
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--token-tracking-wide)',
              }}
            >
              Input
            </span>
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-semibold)',
                color: 'var(--token-text-primary)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              {formatNumber(inputTokens)}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--token-tracking-wide)',
              }}
            >
              Output
            </span>
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-semibold)',
                color: 'var(--token-text-primary)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              {formatNumber(outputTokens)}
            </span>
          </div>
          {/* — Cost estimate — */}
          {estimatedCost !== null && (
            <div className="flex flex-col">
              <span
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--token-tracking-wide)',
                }}
              >
                Cost
              </span>
              <span
                className="flex items-center"
                style={{
                  fontSize: 'var(--token-text-sm)',
                  fontWeight: 'var(--token-weight-semibold)',
                  color: 'var(--token-text-primary)',
                  fontFamily: 'var(--token-font-mono)',
                  gap: 'var(--token-space-0-5)',
                }}
              >
                {formatCost(estimatedCost)}
              </span>
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 'var(--token-text-sm)',
            color: isAtLimit ? 'var(--token-error)' : 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            fontWeight: isAtLimit ? 'var(--token-weight-medium)' : undefined,
          }}
        >
          {formatNumber(totalUsed)} / {formatNumber(maxTokens)}
        </span>
      </div>

      {/* — Threshold warning — */}
      {isNearLimit && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            marginTop: 'var(--token-space-3)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: isAtLimit ? 'rgba(181,74,74,0.08)' : 'rgba(159,129,54,0.08)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <AlertTriangle size={12} style={{ color: getBarColor(), flexShrink: 0 }} />
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: getBarColor(),
          }}>
            {isAtLimit
              ? 'Context window nearly full. Consider compressing or removing context.'
              : 'Approaching context limit. Older messages may be truncated.'}
          </span>
        </div>
      )}

      {/* — Category breakdown toggle — */}
      {breakdown && breakdown.length > 0 && (
        <div style={{ marginTop: 'var(--token-space-3)' }}>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center w-full cursor-pointer"
            style={{
              gap: 'var(--token-space-1-5)',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              padding: 0,
              textTransform: 'uppercase',
              letterSpacing: 'var(--token-tracking-wide)',
            }}
          >
            <ChevronDown
              size={10}
              style={{
                transform: showBreakdown ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
              }}
            />
            Breakdown
          </button>
          {showBreakdown && (
            <div
              className="flex flex-col"
              style={{
                gap: 'var(--token-space-2)',
                marginTop: 'var(--token-space-2)',
                animation: 'token-fade-in 150ms ease',
              }}
            >
              {breakdown.map((cat, idx) => {
                const catPct = maxTokens > 0 ? (cat.tokens / maxTokens) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 'var(--token-radius-full)',
                        background: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="flex-1"
                      style={{
                        fontSize: 'var(--token-text-xs)',
                        color: 'var(--token-text-secondary)',
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--token-text-xs)',
                        fontFamily: 'var(--token-font-mono)',
                        color: 'var(--token-text-tertiary)',
                        minWidth: 48,
                        textAlign: 'right',
                      }}
                    >
                      {formatNumber(cat.tokens)}
                    </span>
                    <div
                      style={{
                        width: 60,
                        height: 3,
                        borderRadius: 2,
                        background: 'var(--token-bg-tertiary)',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(catPct, 100)}%`,
                          height: '100%',
                          borderRadius: 2,
                          background: cat.color,
                          transition: 'width 300ms cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TokenUsageDemo() {
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [simulating, setSimulating] = useState(true);
  const [tokPerSec, setTokPerSec] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!simulating) return;
    const targetIn = 1247;
    const targetOut = 3891;
    let frame = 0;
    const totalFrames = 60;
    setTokPerSec(42);
    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setInputTokens(Math.round(targetIn * eased));
      setOutputTokens(Math.round(targetOut * eased));
      if (frame >= totalFrames) {
        clearInterval(timer);
        setSimulating(false);
        setTokPerSec(undefined);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [simulating]);

  return (
    <div className="flex flex-col" style={{ maxWidth: 380, width: '100%', gap: 'var(--token-space-3)' }}>
      <TokenUsage
        inputTokens={inputTokens}
        outputTokens={outputTokens}
        maxTokens={8192}
        model="gpt-4o"
        trend="up"
        trendLabel="+12%"
        tokensPerSecond={simulating ? tokPerSec : undefined}
        costPerInputToken={0.000005}
        costPerOutputToken={0.000015}
        breakdown={[
          { label: 'System prompt', tokens: Math.round(inputTokens * 0.3), color: 'var(--token-chart-1, var(--token-accent))' },
          { label: 'Conversation history', tokens: Math.round(inputTokens * 0.5), color: 'var(--token-chart-2, var(--token-warning))' },
          { label: 'Attachments', tokens: Math.round(inputTokens * 0.2), color: 'var(--token-chart-3, var(--token-success))' },
          { label: 'Output', tokens: outputTokens, color: 'var(--token-chart-4, #36a3c2)' },
        ]}
      />
      {!simulating && (
        <div className="flex justify-center" style={{ animation: 'token-fade-in 300ms ease' }}>
          <button
            onClick={() => { setInputTokens(0); setOutputTokens(0); setSimulating(true); }}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            replay animation
          </button>
        </div>
      )}
    </div>
  );
}