/* —— CostEstimator — Phase 3 Enhanced ——
   Phase 3: pre-flight approval flow, model comparison,
   optimization suggestions, budget threshold warning, cost history sparkline */
import { DollarSign, Zap, Clock, AlertTriangle, TrendingDown, ArrowRight, Check, Loader2 } from 'lucide-react';
import { DSBadge, DSButton } from '../ds/atoms';
import { useState } from 'react';

interface CostBreakdown {
  label: string;
  tokens: number;
  cost: number;
}

interface OptimizationTip {
  label: string;
  savings: string;
  action: string;
}

interface CostEstimatorProps {
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  estimatedTime?: string;
  breakdown?: CostBreakdown[];
  onProceed?: () => void;
  onOptimize?: () => void;
  budget?: number;
  showApproval?: boolean;
}

export function CostEstimator({
  model = 'GPT-4o',
  inputTokens = 2340,
  outputTokens = 4096,
  estimatedCost = 0.042,
  estimatedTime = '~8s',
  breakdown,
  onProceed,
  onOptimize,
  budget = 1.0,
  showApproval = true,
}: CostEstimatorProps) {
  const items = breakdown || defaultBreakdown;
  const totalTokens = inputTokens + outputTokens;
  const isExpensive = estimatedCost > 0.1;
  const budgetPct = (estimatedCost / budget) * 100;
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [approvalState, setApprovalState] = useState<'pending' | 'approved' | 'running'>('pending');

  const handleApprove = () => {
    setApprovalState('approved');
    setTimeout(() => {
      setApprovalState('running');
      onProceed?.();
    }, 500);
  };

  /* —— Mock optimization tips —— */
  const tips: OptimizationTip[] = [
    { label: 'Use GPT-4o-mini', savings: '-78%', action: 'Switch model' },
    { label: 'Reduce context', savings: '-35%', action: 'Trim history' },
    { label: 'Enable caching', savings: '-20%', action: 'Enable' },
  ];

  /* —— Mini sparkline for cost trend —— */
  const sparkData = [0.02, 0.03, 0.025, 0.04, 0.035, 0.042];
  const sparkMax = Math.max(...sparkData);
  const sparkH = 20;

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
      }}
    >
      {/* Header */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <DollarSign size={14} style={{ color: 'var(--token-text-tertiary)' }} />
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
          }}
        >
          Cost Estimate
        </span>
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
          background: 'var(--token-bg-tertiary)',
          padding: '2px 8px',
          borderRadius: 'var(--token-radius-full)',
        }}>
          {model}
        </span>
      </div>

      {/* Summary stats */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border)',
        }}
      >
        {[
          { icon: <Zap size={13} />, label: 'Tokens', value: totalTokens.toLocaleString(), color: 'var(--token-text-primary)' },
          { icon: <DollarSign size={13} />, label: 'Cost', value: `$${estimatedCost.toFixed(3)}`, color: isExpensive ? 'var(--token-warning)' : 'var(--token-success)' },
          { icon: <Clock size={13} />, label: 'Time', value: estimatedTime, color: 'var(--token-text-primary)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center"
            style={{
              padding: 'var(--token-space-3)',
              borderRightWidth: i < 2 ? '1px' : 0,
              borderRightStyle: 'solid',
              borderRightColor: 'var(--token-border)',
              gap: 'var(--token-space-1)',
            }}
          >
            <span style={{ color: 'var(--token-text-disabled)', display: 'flex' }}>{stat.icon}</span>
            <span style={{
              fontSize: 'var(--token-text-md)',
              fontFamily: 'var(--token-font-mono)',
              color: stat.color,
            }}>
              {stat.value}
            </span>
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div style={{
        padding: 'var(--token-space-2-5) var(--token-space-4)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border-subtle)',
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-1)' }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
            Session Budget
          </span>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
            ${estimatedCost.toFixed(3)} / ${budget.toFixed(2)}
          </span>
        </div>
        <div style={{
          height: 4,
          borderRadius: 'var(--token-radius-full)',
          background: 'var(--token-bg-tertiary)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.min(budgetPct, 100)}%`,
            height: '100%',
            borderRadius: 'var(--token-radius-full)',
            background: budgetPct > 80 ? 'var(--token-error)' : budgetPct > 50 ? 'var(--token-warning)' : 'var(--token-success)',
            transition: 'width 300ms ease',
          }} />
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex flex-col" style={{ padding: 'var(--token-space-3) var(--token-space-4)', gap: 'var(--token-space-2)' }}>
        <div className="flex items-center justify-between">
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Breakdown
          </span>
          {/* Sparkline */}
          <svg width="48" height={sparkH} viewBox={`0 0 48 ${sparkH}`} style={{ opacity: 0.5 }}>
            {sparkData.map((v, i) => {
              const x = (i / (sparkData.length - 1)) * 48;
              const y = sparkH - (v / sparkMax) * (sparkH - 2);
              return i === 0 ? null : (
                <line
                  key={i}
                  x1={(((i - 1) / (sparkData.length - 1)) * 48)}
                  y1={sparkH - (sparkData[i - 1] / sparkMax) * (sparkH - 2)}
                  x2={x}
                  y2={y}
                  stroke="var(--token-accent)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
              {item.label}
            </span>
            <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {item.tokens.toLocaleString()} tok
              </span>
              <span style={{
                fontSize: 'var(--token-text-xs)',
                fontFamily: 'var(--token-font-mono)',
                color: 'var(--token-text-secondary)',
                minWidth: 48,
                textAlign: 'right',
              }}>
                ${item.cost.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Optimization suggestions */}
      <div style={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border-subtle)',
      }}>
        <button
          onClick={() => setShowOptimizations(!showOptimizations)}
          className="flex items-center w-full cursor-pointer"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderWidth: 0,
            borderStyle: 'none',
            background: 'transparent',
            fontFamily: 'var(--token-font-sans)',
            textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <TrendingDown size={12} style={{ color: 'var(--token-success)' }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-success)', flex: 1 }}>
            {showOptimizations ? 'Hide' : 'Show'} optimization tips
          </span>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            transform: showOptimizations ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-fast)',
          }}>
            ▶
          </span>
        </button>

        {showOptimizations && (
          <div className="flex flex-col" style={{
            padding: '0 var(--token-space-4) var(--token-space-3)',
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 150ms ease',
          }}>
            {tips.map((tip, i) => (
              <div key={i} className="flex items-center" style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-bg-secondary)',
              }}>
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', flex: 1 }}>
                  {tip.label}
                </span>
                <DSBadge variant="success" style={{ fontSize: '9px', padding: '0 4px' }}>
                  {tip.savings}
                </DSBadge>
                <button
                  className="cursor-pointer"
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-accent)',
                    borderWidth: 0,
                    borderStyle: 'none',
                    background: 'none',
                    fontFamily: 'var(--token-font-mono)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                  }}
                >
                  {tip.action}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning if expensive */}
      {isExpensive && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-4)',
            background: 'var(--token-warning-light)',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--token-border-subtle)',
          }}
        >
          <AlertTriangle size={12} style={{ color: 'var(--token-warning)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-warning)' }}>
            This request may be costly. Consider using a smaller model.
          </span>
        </div>
      )}

      {/* Actions with approval flow */}
      <div
        className="flex items-center justify-end"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        {approvalState === 'pending' && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <DSButton variant="outline" onClick={onOptimize}>
              Optimize
            </DSButton>
            {showApproval ? (
              <DSButton variant="primary" onClick={handleApprove}>
                Approve ${estimatedCost.toFixed(3)}
              </DSButton>
            ) : (
              <DSButton variant="primary" onClick={onProceed}>
                Proceed
              </DSButton>
            )}
          </div>
        )}
        {approvalState === 'approved' && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)', animation: 'token-fade-in 200ms ease' }}>
            <Check size={14} style={{ color: 'var(--token-success)' }} />
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-success)' }}>Approved</span>
          </div>
        )}
        {approvalState === 'running' && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)', animation: 'token-fade-in 200ms ease' }}>
            <Loader2 size={14} style={{ color: 'var(--token-accent)', animation: 'token-spin 1s linear infinite' }} />
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>Running...</span>
          </div>
        )}
      </div>
    </div>
  );
}

const defaultBreakdown: CostBreakdown[] = [
  { label: 'System prompt', tokens: 840, cost: 0.0042 },
  { label: 'User input', tokens: 1500, cost: 0.0075 },
  { label: 'Output (est.)', tokens: 4096, cost: 0.0307 },
];

export function CostEstimatorDemo() {
  const [model, setModel] = useState('gpt-4o');
  const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3.5'];

  return (
    <div className="flex flex-col" style={{ maxWidth: 380, width: '100%', gap: 'var(--token-space-3)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {models.map(m => (
          <button
            key={m}
            onClick={() => setModel(m)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-md)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: model === m ? 'var(--token-accent)' : 'var(--token-border)',
              background: model === m ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: model === m ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div key={model} style={{ animation: 'token-fade-in 200ms ease' }}>
        <CostEstimator />
      </div>
    </div>
  );
}
