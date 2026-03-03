/* —— InsightCard — Phase 3 Enhanced —— */
import { TrendingUp, TrendingDown, Minus, Lightbulb, Zap, BookmarkPlus, BookmarkCheck, ExternalLink, X, ChevronDown } from 'lucide-react';
import { DSBadge, DSButton } from '../ds/atoms';
import { useState, useEffect, useRef } from 'react';

/* —— Types —— */
type Trend = 'up' | 'down' | 'neutral';
type InsightType = 'finding' | 'anomaly' | 'opportunity' | 'risk';

interface InsightAction {
  label: string;
  onClick?: () => void;
}

interface InsightCardProps {
  category: string;
  headline: string;
  metric?: string;
  metricLabel?: string;
  trend?: Trend;
  trendValue?: string;
  confidence?: number;
  type?: InsightType;
  actions?: InsightAction[];
  sourceCount?: number;
  onDismiss?: () => void;
  onBookmark?: () => void;
  bookmarked?: boolean;
}

/* —— Config maps —— */
const typeConfig: Record<InsightType, { icon: React.ReactNode; color: string; bg: string }> = {
  finding: { icon: <Lightbulb size={12} />, color: 'var(--token-warning)', bg: 'var(--token-warning-light)' },
  anomaly: { icon: <Zap size={12} />, color: 'var(--token-error)', bg: 'var(--token-error-light)' },
  opportunity: { icon: <TrendingUp size={12} />, color: 'var(--token-success)', bg: 'var(--token-success-light)' },
  risk: { icon: <TrendingDown size={12} />, color: 'var(--token-error)', bg: 'var(--token-error-light)' },
};

export function InsightCard({
  category,
  headline,
  metric,
  metricLabel,
  trend = 'neutral',
  trendValue,
  confidence,
  type = 'finding',
  actions,
  sourceCount,
  onDismiss,
  onBookmark,
  bookmarked: controlledBookmarked,
}: InsightCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--token-success)' : trend === 'down' ? 'var(--token-error)' : 'var(--token-text-tertiary)';
  const [hovered, setHovered] = useState(false);
  const [internalBookmarked, setInternalBookmarked] = useState(controlledBookmarked || false);
  const isBookmarked = controlledBookmarked ?? internalBookmarked;
  const [expanded, setExpanded] = useState(false);

  const tc = typeConfig[type];

  /* Animate metric number on mount */
  const [displayMetric, setDisplayMetric] = useState('');
  const mounted = useRef(false);
  useEffect(() => {
    if (!metric || mounted.current) return;
    mounted.current = true;
    const numMatch = metric.match(/[\d.]+/);
    if (!numMatch) { setDisplayMetric(metric); return; }
    const target = parseFloat(numMatch[0]);
    const prefix = metric.slice(0, metric.indexOf(numMatch[0]));
    const suffix = metric.slice(metric.indexOf(numMatch[0]) + numMatch[0].length);
    const isFloat = numMatch[0].includes('.');
    const duration = 600;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      setDisplayMetric(prefix + (isFloat ? val.toFixed(1) : Math.round(val).toString()) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [metric]);

  const getConfidenceColor = () => {
    if (!confidence) return 'var(--token-text-tertiary)';
    if (confidence >= 80) return 'var(--token-confidence-high)';
    if (confidence >= 50) return 'var(--token-confidence-medium)';
    return 'var(--token-confidence-low)';
  };

  const handleBookmark = () => {
    setInternalBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
        transition: 'box-shadow 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Type indicator bar */}
      <div style={{ height: 3, background: tc.color }} />

      <div style={{ padding: 'var(--token-space-4)' }}>
        {/* Top row */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 'var(--token-space-3)' }}
        >
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 22, height: 22,
                borderRadius: 'var(--token-radius-sm)',
                background: tc.bg,
                color: tc.color,
              }}
            >
              {tc.icon}
            </div>
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--token-tracking-wide)',
              }}
            >
              {category}
            </span>
          </div>

          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {confidence !== undefined && (
              <span
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-mono)',
                  color: getConfidenceColor(),
                  fontWeight: 'var(--token-weight-medium)',
                }}
              >
                {confidence}%
              </span>
            )}

            {/* Bookmark toggle */}
            <button
              onClick={handleBookmark}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 24, height: 24,
                borderRadius: 'var(--token-radius-sm)',
                border: 'none',
                background: 'transparent',
                color: isBookmarked ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                padding: 0,
                opacity: hovered || isBookmarked ? 1 : 0,
                transition: 'opacity var(--token-duration-fast), color var(--token-duration-fast)',
              }}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark insight'}
            >
              {isBookmarked ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
            </button>

            {/* Dismiss */}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 24, height: 24,
                  borderRadius: 'var(--token-radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--token-text-disabled)',
                  padding: 0,
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity var(--token-duration-fast)',
                }}
                title="Dismiss insight"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 'var(--token-text-base)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
            lineHeight: 'var(--token-leading-normal)',
            marginBottom: metric ? 'var(--token-space-4)' : 'var(--token-space-2)',
          }}
        >
          {headline}
        </div>

        {/* Metric */}
        {metric && (
          <div className="flex items-end justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
            <div className="flex flex-col">
              {metricLabel && (
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--token-tracking-wide)',
                  }}
                >
                  {metricLabel}
                </span>
              )}
              <span
                style={{
                  fontSize: 'var(--token-text-3xl)',
                  fontWeight: 'var(--token-weight-bold)',
                  color: 'var(--token-text-primary)',
                  fontFamily: 'var(--token-font-mono)',
                  letterSpacing: 'var(--token-tracking-tight)',
                  lineHeight: 'var(--token-leading-none)',
                }}
              >
                {displayMetric || metric}
              </span>
            </div>
            {trendValue && (
              <div
                className="flex items-center"
                style={{
                  gap: 'var(--token-space-1)',
                  color: trendColor,
                  fontSize: 'var(--token-text-sm)',
                  fontWeight: 'var(--token-weight-medium)',
                  fontFamily: 'var(--token-font-mono)',
                }}
              >
                <TrendIcon size={14} />
                {trendValue}
              </div>
            )}
          </div>
        )}

        {/* Source count */}
        {sourceCount !== undefined && (
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-1)',
              marginBottom: actions?.length ? 'var(--token-space-3)' : 0,
            }}
          >
            <ExternalLink size={10} style={{ color: 'var(--token-text-disabled)' }} />
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              Derived from {sourceCount} sources
            </span>
          </div>
        )}

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)', flexWrap: 'wrap' }}>
            {actions.map((action, i) => (
              <DSButton
                key={i}
                variant={i === 0 ? 'primary' : 'outline'}
                onClick={action.onClick}
                style={{
                  fontSize: 'var(--token-text-xs)',
                  padding: 'var(--token-space-1-5) var(--token-space-3)',
                }}
              >
                {action.label}
              </DSButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function InsightCardDemo() {
  const insights = [
    {
      category: 'Key Finding',
      headline: 'User engagement increased significantly after enabling AI suggestions',
      metric: '47%',
      metricLabel: 'Engagement rate',
      trend: 'up' as const,
      trendValue: '+12.3%',
      confidence: 88,
      type: 'finding' as const,
      sourceCount: 8,
      actions: [{ label: 'View Details' }, { label: 'Export' }],
    },
    {
      category: 'Anomaly',
      headline: 'Response latency spiked during peak hours on Tuesday',
      metric: '340ms',
      metricLabel: 'P95 latency',
      trend: 'down' as const,
      trendValue: '+89ms',
      confidence: 74,
      type: 'anomaly' as const,
      sourceCount: 3,
      actions: [{ label: 'Investigate' }],
    },
    {
      category: 'Opportunity',
      headline: 'Mobile users convert 2x better with inline suggestions',
      metric: '8.2%',
      metricLabel: 'Conversion rate',
      trend: 'up' as const,
      trendValue: '+4.1%',
      confidence: 91,
      type: 'opportunity' as const,
      sourceCount: 12,
      actions: [{ label: 'Draft Action Plan' }, { label: 'Share' }],
    },
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', maxWidth: 400, width: '100%' }}>
      <div key={activeIdx} style={{ animation: 'token-fade-in 200ms ease' }}>
        {!dismissed.has(activeIdx) ? (
          <InsightCard
            {...insights[activeIdx]}
            onDismiss={() => {
              setDismissed(prev => new Set([...prev, activeIdx]));
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              padding: 'var(--token-space-6)',
              borderRadius: 'var(--token-radius-lg)',
              border: '1px dashed var(--token-border)',
              background: 'var(--token-bg-secondary)',
            }}
          >
            <span style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              Insight dismissed
            </span>
          </div>
        )}
      </div>
      {/* Navigation dots */}
      <div className="flex items-center justify-center" style={{ gap: 'var(--token-space-2)' }}>
        {insights.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="cursor-pointer"
            style={{
              width: activeIdx === i ? 20 : 8,
              height: 8,
              borderRadius: 'var(--token-radius-full)',
              border: 'none',
              background: activeIdx === i ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
              transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
              padding: 0,
              opacity: dismissed.has(i) ? 0.3 : 1,
            }}
          />
        ))}
      </div>
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
        textAlign: 'center',
      }}>
        {activeIdx + 1} of {insights.length} insights
      </span>
    </div>
  );
}
