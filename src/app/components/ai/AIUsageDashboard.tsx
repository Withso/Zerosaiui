/* —— AIUsageDashboard — Phase 3 Enhanced ——
   Phase 3: time range selector, usage trend sparkline,
   export data action, per-model rate comparison,
   projected cost estimate, usage heat indicator */
import { useState } from 'react';
import { Zap, DollarSign, BarChart3, AlertTriangle, Download, Calendar, TrendingUp } from 'lucide-react';
import { DSBadge, DSDot, DSButton } from '../ds/atoms';
import { DSColorBar, DSLegendItem, DSCollapsible } from '../ds/atoms-extra';
import { DSStatDisplay, DSTabBar, DSHeaderBar, DSToggleRow } from '../ds/molecules';

interface UsageModel {
  name: string;
  tokens: number;
  cost: number;
  color: string;
  ratePerK?: number;
}

interface AIUsageDashboardProps {
  models?: UsageModel[];
  totalBudget?: number;
}

/* —— Time ranges —— */
const timeRanges = ['Today', '7d', '30d', 'All'];

export function AIUsageDashboard({ models, totalBudget = 100 }: AIUsageDashboardProps) {
  const items = models || defaultModels;
  const totalTokens = items.reduce((s, m) => s + m.tokens, 0);
  const totalCost = items.reduce((s, m) => s + m.cost, 0);
  const budgetPct = Math.round((totalCost / totalBudget) * 100);
  const [tab, setTab] = useState(0);
  const [alertsOn, setAlertsOn] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  /* —— Projected cost —— */
  const daysElapsed = 18;
  const projectedMonthly = (totalCost / daysElapsed) * 30;

  /* —— Usage sparkline data —— */
  const sparkData = [12, 18, 15, 22, 28, 20, 35, 30, 42, 38, 45, 40];
  const sparkMax = Math.max(...sparkData);
  const sparkH = 24;
  const sparkW = 80;

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 420,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="AI Usage"
        icon={<BarChart3 size={16} style={{ color: 'var(--token-text-tertiary)' }} />}
        actions={
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <DSBadge variant={budgetPct > 80 ? 'warning' : 'success'}>
              {budgetPct}% of budget
            </DSBadge>
          </div>
        }
      />

      {/* Time range selector */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-2) var(--token-space-4)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border-subtle)',
      }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <Calendar size={10} style={{ color: 'var(--token-text-disabled)' }} />
          {timeRanges.map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className="cursor-pointer"
              style={{
                padding: 'var(--token-space-0-5) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                borderWidth: 0,
                borderStyle: 'none',
                background: timeRange === tr ? 'var(--token-bg-hover)' : 'transparent',
                color: timeRange === tr ? 'var(--token-text-primary)' : 'var(--token-text-disabled)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                transition: 'all var(--token-duration-fast)',
              }}
            >
              {tr}
            </button>
          ))}
        </div>
        <DSButton
          variant="ghost"
          icon={<Download size={10} />}
          style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1)', height: 'auto' }}
        >
          Export
        </DSButton>
      </div>

      {/* Tabs */}
      <DSTabBar tabs={['Overview', 'By Model', 'Alerts']} activeIndex={tab} onTabChange={setTab} />

      <div style={{ padding: 'var(--token-space-4)' }}>
        {tab === 0 && (
          <div className="flex flex-col" style={{ gap: 'var(--token-space-4)' }}>
            {/* Stats row with sparkline */}
            <div className="flex" style={{ gap: 'var(--token-space-4)' }}>
              <DSStatDisplay
                label="Total Tokens"
                value={`${(totalTokens / 1000).toFixed(1)}k`}
                change={{ value: '12%', positive: true }}
                icon={<Zap size={14} style={{ color: 'var(--token-accent)' }} />}
              />
              <DSStatDisplay
                label="Total Cost"
                value={`$${totalCost.toFixed(2)}`}
                change={{ value: '3%', positive: false }}
                icon={<DollarSign size={14} style={{ color: 'var(--token-success)' }} />}
              />
            </div>

            {/* Projected cost */}
            <div className="flex items-center justify-between" style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              background: 'var(--token-bg-secondary)',
            }}>
              <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                <TrendingUp size={12} style={{ color: projectedMonthly > totalBudget ? 'var(--token-warning)' : 'var(--token-text-tertiary)' }} />
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
                  Projected monthly
                </span>
              </div>
              <span style={{
                fontSize: 'var(--token-text-xs)',
                fontFamily: 'var(--token-font-mono)',
                color: projectedMonthly > totalBudget ? 'var(--token-warning)' : 'var(--token-text-secondary)',
              }}>
                ${projectedMonthly.toFixed(2)}
              </span>
            </div>

            {/* Usage trend sparkline */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>
                Usage trend
              </span>
              <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} style={{ opacity: 0.6 }}>
                {sparkData.map((v, i) => {
                  if (i === 0) return null;
                  const x1 = ((i - 1) / (sparkData.length - 1)) * sparkW;
                  const y1 = sparkH - (sparkData[i - 1] / sparkMax) * (sparkH - 4);
                  const x2 = (i / (sparkData.length - 1)) * sparkW;
                  const y2 = sparkH - (v / sparkMax) * (sparkH - 4);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="var(--token-accent)" strokeWidth="1.5" />
                  );
                })}
                <circle
                  cx={sparkW}
                  cy={sparkH - (sparkData[sparkData.length - 1] / sparkMax) * (sparkH - 4)}
                  r="2.5"
                  fill="var(--token-accent)"
                />
              </svg>
            </div>

            {/* Budget bar */}
            <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Budget Usage</span>
                <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>
                  ${totalCost.toFixed(2)} / ${totalBudget}
                </span>
              </div>
              <DSColorBar
                segments={items.map(m => ({ value: m.cost, color: m.color }))}
                total={totalBudget}
                height={8}
              />
              <div className="flex flex-wrap" style={{ gap: 'var(--token-space-3)' }}>
                {items.map(m => (
                  <DSLegendItem key={m.name} color={m.color} label={m.name} value={`$${m.cost.toFixed(2)}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
            {items.map(m => {
              const pct = Math.round((m.tokens / totalTokens) * 100);
              return (
                <DSCollapsible key={m.name} title={m.name} meta={
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <DSBadge variant="count">{pct}%</DSBadge>
                    <DSDot color={m.color} size={6} />
                  </div>
                }>
                  <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Tokens</span>
                      <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>{m.tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Cost</span>
                      <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>${m.cost.toFixed(2)}</span>
                    </div>
                    {m.ratePerK && (
                      <div className="flex justify-between">
                        <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Rate</span>
                        <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)' }}>${m.ratePerK}/1k tok</span>
                      </div>
                    )}
                    <DSColorBar segments={[{ value: m.tokens, color: m.color }]} total={totalTokens} height={4} />
                  </div>
                </DSCollapsible>
              );
            })}
          </div>
        )}

        {tab === 2 && (
          <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
            <DSToggleRow label="Budget alerts" description="Notify at 80% usage" on={alertsOn} onChange={setAlertsOn} style={{ maxWidth: '100%' }} />
            <DSToggleRow label="Daily digest" description="Usage summary email" style={{ maxWidth: '100%' }} />
            <DSToggleRow label="Rate limit warnings" description="Alert on throttling" defaultOn={false} style={{ maxWidth: '100%' }} />
            {budgetPct > 70 && (
              <div className="flex items-center" style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-warning-light)',
              }}>
                <AlertTriangle size={13} style={{ color: 'var(--token-warning)' }} />
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>You're at {budgetPct}% of your monthly budget</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const defaultModels: UsageModel[] = [
  { name: 'GPT-4o', tokens: 45200, cost: 32.40, color: 'var(--token-chart-4)', ratePerK: 0.005 },
  { name: 'Claude 3.5', tokens: 28900, cost: 24.10, color: 'var(--token-chart-6)', ratePerK: 0.003 },
  { name: 'Gemini Pro', tokens: 12400, cost: 8.20, color: 'var(--token-chart-5)', ratePerK: 0.00025 },
  { name: 'Embeddings', tokens: 89000, cost: 2.80, color: 'var(--token-chart-3)', ratePerK: 0.00002 },
];

export function AIUsageDashboardDemo() {
  return (
    <div className="flex flex-col" style={{ width: '100%', maxWidth: 420 }}>
      <AIUsageDashboard />
    </div>
  );
}
