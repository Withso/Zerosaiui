/* —— ChartResult — Phase 3 Enhanced —— */
import { useState, useRef, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Maximize2, Copy, Check, RefreshCw, Table2 } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
type ChartType = 'bar' | 'line' | 'pie' | 'area';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartResultProps {
  chartType?: ChartType;
  title?: string;
  subtitle?: string;
  data?: DataPoint[];
  xLabel?: string;
  yLabel?: string;
  onRefresh?: () => void;
  onExport?: () => void;
}

/* —— Default data —— */
const defaultData: DataPoint[] = [
  { label: 'React', value: 78, color: 'var(--token-chart-1)' },
  { label: 'Vue', value: 45, color: 'var(--token-chart-2)' },
  { label: 'Angular', value: 38, color: 'var(--token-chart-3)' },
  { label: 'Svelte', value: 28, color: 'var(--token-chart-4)' },
  { label: 'Solid', value: 15, color: 'var(--token-chart-5)' },
];

/* —— Chart type icons —— */
const chartIcons: Record<ChartType, React.ReactNode> = {
  bar: <BarChart3 size={13} />,
  line: <TrendingUp size={13} />,
  pie: <PieChart size={13} />,
  area: <TrendingUp size={13} />,
};

export function ChartResult({
  chartType = 'bar',
  title = 'Framework Popularity',
  subtitle = 'Developer survey results (2025)',
  data,
  xLabel = 'Framework',
  yLabel = 'Usage %',
  onRefresh,
  onExport,
}: ChartResultProps) {
  const items = data || defaultData;
  const maxVal = Math.max(...items.map(d => d.value));
  const [activeType, setActiveType] = useState<ChartType>(chartType);
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animated, setAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  /* —— Animate bars on mount —— */
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, [activeType]);

  /* —— Copy data as text —— */
  const handleCopy = () => {
    const text = items.map(d => `${d.label}: ${d.value}`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* —— Render bar chart —— */
  const renderBarChart = () => (
    <div
      className="flex items-end"
      style={{
        gap: 'var(--token-space-2)',
        height: 160,
        padding: 'var(--token-space-2) 0',
      }}
    >
      {items.map((d, i) => {
        const pct = animated ? (d.value / maxVal) * 100 : 0;
        const isHovered = hovered === i;
        return (
          <div
            key={d.label}
            className="flex flex-col items-center flex-1"
            style={{ gap: 'var(--token-space-1)', height: '100%', justifyContent: 'flex-end' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Value label */}
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              color: isHovered ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
              opacity: isHovered || hovered === null ? 1 : 0.5,
              transition: 'all var(--token-duration-fast)',
            }}>
              {d.value}%
            </span>
            {/* Bar */}
            <div
              style={{
                width: '100%',
                maxWidth: 48,
                height: `${pct}%`,
                borderRadius: 'var(--token-radius-sm) var(--token-radius-sm) 0 0',
                background: d.color || 'var(--token-chart-1)',
                opacity: isHovered || hovered === null ? 1 : 0.4,
                transition: 'height 600ms cubic-bezier(0.16,1,0.3,1), opacity var(--token-duration-fast)',
                minHeight: 4,
              }}
            />
            {/* Label */}
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: isHovered ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-sans)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 56,
              transition: 'color var(--token-duration-fast)',
            }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  /* —— Render line chart (simplified) —— */
  const renderLineChart = () => {
    const w = 360;
    const h = 140;
    const px = 10;
    const py = 10;
    const stepX = (w - 2 * px) / (items.length - 1);

    const points = items.map((d, i) => ({
      x: px + i * stepX,
      y: py + (1 - d.value / maxVal) * (h - 2 * py),
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${h - py} L ${points[0].x} ${h - py} Z`;

    return (
      <div style={{ position: 'relative', height: 160, padding: 'var(--token-space-2) 0' }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
          {/* Area fill */}
          <path d={areaD} fill="var(--token-chart-1)" opacity="0.1" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="var(--token-chart-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {points.map((p, i) => (
            <circle
              key={items[i].label}
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3}
              fill={hovered === i ? 'var(--token-chart-1)' : 'var(--token-bg)'}
              stroke="var(--token-chart-1)"
              strokeWidth="2"
              style={{ transition: 'r var(--token-duration-fast)', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {/* X labels */}
        <div className="flex justify-between" style={{ padding: '0 10px' }}>
          {items.map((d, i) => (
            <span key={d.label} style={{
              fontSize: 'var(--token-text-2xs)',
              color: hovered === i ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-sans)',
              transition: 'color var(--token-duration-fast)',
            }}>
              {d.label}
            </span>
          ))}
        </div>
        {/* Tooltip */}
        {hovered !== null && (
          <div style={{
            position: 'absolute',
            left: points[hovered].x,
            top: points[hovered].y - 32,
            transform: 'translateX(-50%)',
            padding: 'var(--token-space-1) var(--token-space-2)',
            borderRadius: 'var(--token-radius-sm)',
            background: 'var(--token-text-primary)',
            color: 'var(--token-text-inverse)',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {items[hovered].value}%
          </div>
        )}
      </div>
    );
  };

  /* —— Render pie chart (simplified) —— */
  const renderPieChart = () => {
    const total = items.reduce((s, d) => s + d.value, 0);
    const cx = 80;
    const cy = 80;
    const r = 60;
    let startAngle = -90;

    const slices = items.map((d, i) => {
      const angle = (d.value / total) * 360;
      const endAngle = startAngle + angle;
      const largeArc = angle > 180 ? 1 : 0;
      const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;
      return { path, color: d.color || `var(--token-chart-${(i % 6) + 1})`, label: d.label, value: d.value, pct: Math.round((d.value / total) * 100) };
    });

    return (
      <div className="flex items-center" style={{ gap: 'var(--token-space-4)', padding: 'var(--token-space-2) 0' }}>
        <svg viewBox="0 0 160 160" style={{ width: 140, height: 140, flexShrink: 0 }}>
          {slices.map((s, i) => (
            <path
              key={s.label}
              d={s.path}
              fill={s.color}
              opacity={hovered === null || hovered === i ? 1 : 0.3}
              stroke="var(--token-bg)"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'opacity var(--token-duration-fast)' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {/* Legend */}
        <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)', flex: 1 }}>
          {slices.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center"
              style={{
                gap: 'var(--token-space-2)',
                opacity: hovered === null || hovered === i ? 1 : 0.4,
                transition: 'opacity var(--token-duration-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                width: 8, height: 8,
                borderRadius: 'var(--token-radius-full)',
                background: s.color,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-primary)',
                fontFamily: 'var(--token-font-sans)',
                flex: 1,
              }}>
                {s.label}
              </span>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-tertiary)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* —— Render table view —— */
  const renderTable = () => (
    <div style={{
      borderRadius: 'var(--token-radius-md)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--token-font-sans)' }}>
        <thead>
          <tr style={{ background: 'var(--token-bg-secondary)' }}>
            <th style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              textAlign: 'left',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--token-border)',
            }}>
              {xLabel}
            </th>
            <th style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              textAlign: 'right',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--token-border)',
            }}>
              {yLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((d, i) => (
            <tr
              key={d.label}
              style={{
                borderBottomWidth: i < items.length - 1 ? '1px' : 0,
                borderBottomStyle: 'solid',
                borderBottomColor: 'var(--token-border-subtle)',
              }}
            >
              <td className="flex items-center" style={{
                padding: 'var(--token-space-2) var(--token-space-3)',
                gap: 'var(--token-space-2)',
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-primary)',
              }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: 'var(--token-radius-full)',
                  background: d.color || `var(--token-chart-${(i % 6) + 1})`,
                  flexShrink: 0,
                }} />
                {d.label}
              </td>
              <td style={{
                padding: 'var(--token-space-2) var(--token-space-3)',
                textAlign: 'right',
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-secondary)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {d.value}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* —— Chart type switcher —— */
  const chartTypes: ChartType[] = ['bar', 'line', 'pie'];

  return (
    <div
      ref={chartRef}
      style={{
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
        }}
      >
        <div className="flex flex-col" style={{ gap: 'var(--token-space-0-5)' }}>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <span style={{
              color: 'var(--token-accent)',
              display: 'flex',
            }}>
              {chartIcons[activeType]}
            </span>
            <span style={{
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-primary)',
            }}>
              {title}
            </span>
            <DSBadge variant="ai" style={{ fontSize: '9px', padding: '0 4px' }}>
              AI Generated
            </DSBadge>
          </div>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
          }}>
            {subtitle}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <DSButton
            size="sm"
            variant="ghost"
            onClick={() => setShowTable(!showTable)}
            style={{ padding: 'var(--token-space-1-5)' }}
          >
            <Table2 size={13} />
          </DSButton>
          <DSButton
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            style={{ padding: 'var(--token-space-1-5)' }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </DSButton>
          <DSButton
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            style={{ padding: 'var(--token-space-1-5)' }}
          >
            <RefreshCw size={13} />
          </DSButton>
        </div>
      </div>

      {/* Chart type tabs */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-1)',
          padding: 'var(--token-space-2) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        {chartTypes.map(ct => (
          <button
            key={ct}
            onClick={() => { setActiveType(ct); setAnimated(false); setHovered(null); }}
            className="flex items-center cursor-pointer"
            style={{
              gap: 'var(--token-space-1)',
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-sm)',
              borderWidth: 0,
              borderStyle: 'none',
              background: activeType === ct ? 'var(--token-bg)' : 'transparent',
              color: activeType === ct ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-sans)',
              textTransform: 'capitalize' as const,
              boxShadow: activeType === ct ? 'var(--token-shadow-sm)' : 'none',
              transition: 'all var(--token-duration-fast)',
            }}
          >
            {chartIcons[ct]}
            {ct}
          </button>
        ))}
      </div>

      {/* Chart body */}
      <div style={{ padding: 'var(--token-space-3) var(--token-space-4)' }}>
        {showTable
          ? renderTable()
          : activeType === 'bar'
            ? renderBarChart()
            : activeType === 'pie'
              ? renderPieChart()
              : renderLineChart()
        }
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-2) var(--token-space-4)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border-subtle)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          {items.length} data points
        </span>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <DSButton size="sm" variant="ghost" onClick={onExport}>
            <Download size={11} style={{ marginRight: 4 }} />
            Export
          </DSButton>
          <DSButton size="sm" variant="ghost">
            <Maximize2 size={11} style={{ marginRight: 4 }} />
            Expand
          </DSButton>
        </div>
      </div>
    </div>
  );
}

export function ChartResultDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <ChartResult chartType="bar" />
    </div>
  );
}