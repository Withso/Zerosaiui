/* ConfidenceScore — Enhanced with breakdown tooltip, trend indicator, threshold markers
   Composed from DS atoms (DSBadge)
   Phase 3: sub-metric breakdown, trend arrow, threshold ring markers */
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DSBadge } from '../ds/atoms';

type Trend = 'up' | 'down' | 'stable';

interface SubMetric {
  label: string;
  value: number;
}

interface ConfidenceScoreProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  trend?: Trend;
  trendDelta?: number;
  subMetrics?: SubMetric[];
  threshold?: number;
}

export function ConfidenceScore({
  value,
  label,
  size = 'md',
  trend,
  trendDelta,
  subMetrics,
  threshold,
}: ConfidenceScoreProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(clampedValue * eased);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [clampedValue]);

  const getColor = () => {
    if (clampedValue >= 80) return 'var(--token-confidence-high)';
    if (clampedValue >= 50) return 'var(--token-confidence-medium)';
    return 'var(--token-confidence-low)';
  };

  const getLabel = () => {
    if (clampedValue >= 80) return 'High';
    if (clampedValue >= 50) return 'Medium';
    return 'Low';
  };

  const trendColor = trend === 'up' ? 'var(--token-success)' : trend === 'down' ? 'var(--token-error)' : 'var(--token-text-disabled)';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const dimensions = { sm: 72, md: 96, lg: 120 };
  const strokes = { sm: 5, md: 6, lg: 7 };
  const fontSizes = { sm: 'var(--token-text-lg)', md: 'var(--token-text-2xl)', lg: 'var(--token-text-3xl)' };

  const dim = dimensions[size];
  const strokeWidth = strokes[size];
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  /* Threshold marker position */
  const thresholdAngle = threshold ? ((threshold / 100) * 360 - 90) * (Math.PI / 180) : 0;
  const thresholdX = threshold ? dim / 2 + radius * Math.cos(thresholdAngle) : 0;
  const thresholdY = threshold ? dim / 2 + radius * Math.sin(thresholdAngle) : 0;

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 'var(--token-space-2)', fontFamily: 'var(--token-font-sans)', position: 'relative' }}
      onMouseEnter={() => subMetrics && setShowBreakdown(true)}
      onMouseLeave={() => setShowBreakdown(false)}
    >
      <div style={{ position: 'relative', width: dim, height: dim, cursor: subMetrics ? 'pointer' : 'default' }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={dim / 2} cy={dim / 2} r={radius}
            fill="none" stroke="var(--token-bg-tertiary)" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={dim / 2} cy={dim / 2} r={radius}
            fill="none" stroke={getColor()} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
          />
          {/* Threshold marker */}
          {threshold && (
            <circle
              cx={thresholdX} cy={thresholdY} r={3}
              fill="var(--token-bg)" stroke="var(--token-border-strong)" strokeWidth={1.5}
            />
          )}
        </svg>
        {/* Center value */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ gap: 0 }}
        >
          <span style={{
            fontSize: fontSizes[size],
            fontWeight: 'var(--token-weight-bold)',
            fontFamily: 'var(--token-font-mono)',
            color: 'var(--token-text-primary)',
            letterSpacing: 'var(--token-tracking-tight)',
            lineHeight: 1,
          }}>
            {Math.round(animatedValue)}
          </span>
          {size !== 'sm' && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: getColor(),
              fontFamily: 'var(--token-font-mono)',
              marginTop: 2,
            }}>
              {getLabel()}
            </span>
          )}
        </div>
      </div>

      {/* Label + trend */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {label && (
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
            fontWeight: 'var(--token-weight-medium)',
          }}>
            {label}
          </span>
        )}
        {trend && (
          <span className="flex items-center" style={{ gap: 2, color: trendColor }}>
            <TrendIcon size={10} />
            {trendDelta !== undefined && (
              <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)' }}>
                {trend === 'up' ? '+' : trend === 'down' ? '' : ''}{trendDelta}%
              </span>
            )}
          </span>
        )}
      </div>

      {/* Breakdown popover */}
      {showBreakdown && subMetrics && subMetrics.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 160,
            background: 'var(--token-bg)',
            border: '1px solid var(--token-border)',
            borderRadius: 'var(--token-radius-lg)',
            boxShadow: 'var(--token-shadow-lg)',
            padding: 'var(--token-space-2-5)',
            zIndex: 20,
            animation: 'token-fade-in 120ms ease',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Breakdown
          </span>
          <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', marginTop: 'var(--token-space-1-5)' }}>
            {subMetrics.map((sm, i) => {
              const smColor = sm.value >= 80 ? 'var(--token-success)' : sm.value >= 50 ? 'var(--token-warning)' : 'var(--token-error)';
              return (
                <div key={i} className="flex items-center justify-between" style={{ gap: 'var(--token-space-3)' }}>
                  <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
                    {sm.label}
                  </span>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
                    <div style={{
                      width: 40, height: 3,
                      borderRadius: 'var(--token-radius-full)',
                      background: 'var(--token-bg-tertiary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${sm.value}%`,
                        borderRadius: 'var(--token-radius-full)',
                        background: smColor,
                      }} />
                    </div>
                    <span style={{
                      fontSize: 'var(--token-text-2xs)',
                      fontFamily: 'var(--token-font-mono)',
                      color: smColor,
                      minWidth: 20,
                      textAlign: 'right',
                    }}>
                      {sm.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConfidenceScoreDemo() {
  const [values, setValues] = useState([0, 0, 0]);
  const targets = [92, 67, 34];
  const labels = ['Accuracy', 'Relevance', 'Coverage'];
  const trends: Trend[] = ['up', 'stable', 'down'];
  const deltas = [5, 0, -12];

  useEffect(() => {
    const timer = setTimeout(() => setValues(targets), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRandomize = () => {
    setValues([0, 0, 0]);
    setTimeout(() => {
      setValues([
        Math.floor(Math.random() * 40) + 60,
        Math.floor(Math.random() * 50) + 30,
        Math.floor(Math.random() * 60) + 10,
      ]);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-6)', width: '100%' }}>
      <div className="flex items-end justify-center" style={{ gap: 'var(--token-space-8)', width: '100%' }}>
        <ConfidenceScore
          value={values[0]} label={labels[0]} size="sm"
          trend={trends[0]} trendDelta={deltas[0]}
        />
        <ConfidenceScore
          value={values[1]} label={labels[1]} size="md"
          trend={trends[1]} trendDelta={deltas[1]}
          threshold={70}
          subMetrics={[
            { label: 'Semantic', value: 78 },
            { label: 'Factual', value: 62 },
            { label: 'Context', value: 55 },
          ]}
        />
        <ConfidenceScore
          value={values[2]} label={labels[2]} size="sm"
          trend={trends[2]} trendDelta={deltas[2]}
        />
      </div>
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
      }}>
        Hover center gauge for breakdown
      </span>
      <button
        onClick={handleRandomize}
        className="cursor-pointer"
        style={{
          fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
          fontFamily: 'var(--token-font-mono)',
          border: 'none', background: 'none',
          textDecoration: 'underline', textUnderlineOffset: 2,
        }}
      >
        randomize values
      </button>
    </div>
  );
}
