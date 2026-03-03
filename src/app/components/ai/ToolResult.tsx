import { useState, useEffect, useRef } from 'react';
import {
  Cloud, TrendingUp, MapPin, Calendar, Check, ChevronDown,
  ExternalLink, Thermometer, Copy, RotateCw, Loader2,
  AlertTriangle, Code2, X,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
type ResultType = 'weather' | 'stock' | 'event' | 'location' | 'calculation';
type ResultStatus = 'loading' | 'success' | 'error';

interface ToolResultProps {
  type: ResultType;
  title: string;
  data: Record<string, string | number>;
  footer?: string;
  status?: ResultStatus;
  errorMessage?: string;
  executionTime?: string;
  onAction?: () => void;
  onRetry?: () => void;
  onCopy?: () => void;
  rawOutput?: string;
}

/* —— Type config —— */
const typeConfig: Record<ResultType, { icon: React.ReactNode; accent: string; bg: string }> = {
  weather: { icon: <Cloud size={16} />, accent: 'var(--token-chart-4)', bg: 'color-mix(in srgb, var(--token-chart-4) 8%, transparent)' },
  stock: { icon: <TrendingUp size={16} />, accent: 'var(--token-chart-5)', bg: 'color-mix(in srgb, var(--token-chart-5) 8%, transparent)' },
  event: { icon: <Calendar size={16} />, accent: 'var(--token-chart-6)', bg: 'color-mix(in srgb, var(--token-chart-6) 8%, transparent)' },
  location: { icon: <MapPin size={16} />, accent: 'var(--token-chart-2)', bg: 'color-mix(in srgb, var(--token-chart-2) 8%, transparent)' },
  calculation: { icon: <Thermometer size={16} />, accent: 'var(--token-chart-3)', bg: 'color-mix(in srgb, var(--token-chart-3) 8%, transparent)' },
};

/* —— Status badge map —— */
const statusBadgeMap: Record<ResultStatus, { variant: 'success' | 'error' | 'ai'; label: string }> = {
  success: { variant: 'success', label: 'Completed' },
  error: { variant: 'error', label: 'Failed' },
  loading: { variant: 'ai', label: 'Running' },
};

export function ToolResult({
  type, title, data, footer, status = 'success',
  errorMessage, executionTime, onAction, onRetry, onCopy, rawOutput,
}: ToolResultProps) {
  const config = typeConfig[type];
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleCopy = () => {
    const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch { /* noop */ }
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  };

  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isError ? 'var(--token-error)' : 'var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow var(--token-duration-normal) var(--token-ease-default), border-color var(--token-duration-normal) var(--token-ease-default)',
        opacity: isLoading ? 0.85 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--token-shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* —— Header —— */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          background: isError ? 'color-mix(in srgb, var(--token-error) 6%, transparent)' : config.bg,
          border: 'none',
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
        }}
      >
        {/* Icon */}
        <span style={{ color: isError ? 'var(--token-error)' : config.accent, display: 'flex', flexShrink: 0 }}>
          {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> :
           isError ? <AlertTriangle size={16} /> : config.icon}
        </span>

        {/* Title */}
        <span
          className="flex-1 truncate"
          style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}
        >
          {title}
        </span>

        {/* Status badge */}
        <DSBadge variant={statusBadgeMap[status].variant} style={{ fontSize: 'var(--token-text-2xs)' }}>
          {isLoading && <Loader2 size={9} style={{ animation: 'spin 1s linear infinite' }} />}
          {statusBadgeMap[status].label}
        </DSBadge>

        {/* Execution time */}
        {executionTime && !isLoading && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            flexShrink: 0,
          }}>
            {executionTime}
          </span>
        )}

        {/* Chevron */}
        <ChevronDown
          size={12}
          style={{
            color: 'var(--token-text-disabled)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-normal)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* —— Expanded data fields —— */}
      {expanded && !isError && !isLoading && (
        <div style={{ animation: 'token-fade-in 150ms ease' }}>
          {/* Data grid */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: Object.keys(data).length > 3 ? 'repeat(2, 1fr)' : '1fr',
              gap: 0,
            }}
          >
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col"
                style={{
                  padding: 'var(--token-space-2-5) var(--token-space-3)',
                  borderTop: '1px solid var(--token-border-subtle)',
                  gap: 'var(--token-space-0-5)',
                }}
              >
                <span style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {key}
                </span>
                <span style={{
                  fontSize: typeof value === 'number' ? 'var(--token-text-md)' : 'var(--token-text-sm)',
                  fontWeight: typeof value === 'number' ? 'var(--token-weight-semibold)' : 'var(--token-weight-regular)',
                  fontFamily: typeof value === 'number' ? 'var(--token-font-mono)' : 'var(--token-font-sans)',
                  color: 'var(--token-text-primary)',
                }}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
              </div>
            ))}
          </div>

          {/* —— Raw output toggle —— */}
          {rawOutput && (
            <div style={{ borderTop: '1px solid var(--token-border-subtle)' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowRaw(!showRaw); }}
                className="flex items-center w-full cursor-pointer"
                style={{
                  gap: 'var(--token-space-1-5)',
                  padding: 'var(--token-space-1-5) var(--token-space-3)',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--token-font-mono)',
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-tertiary)',
                }}
              >
                <Code2 size={10} />
                {showRaw ? 'Hide' : 'Show'} raw output
              </button>
              {showRaw && (
                <pre style={{
                  padding: 'var(--token-space-2-5) var(--token-space-3)',
                  margin: 0,
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-secondary)',
                  background: 'var(--token-bg-tertiary)',
                  borderTop: '1px solid var(--token-border-subtle)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: 120,
                  overflowY: 'auto',
                  animation: 'token-fade-in 150ms ease',
                }}>
                  {rawOutput}
                </pre>
              )}
            </div>
          )}

          {/* —— Action bar —— */}
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-2)',
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderTop: '1px solid var(--token-border)',
              background: 'var(--token-bg-secondary)',
            }}
          >
            {footer && (
              <span
                className="flex-1"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                }}
              >
                {footer}
              </span>
            )}
            {!footer && <span className="flex-1" />}

            <DSButton
              variant="ghost"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCopy(); }}
              style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1)', gap: 'var(--token-space-1)' }}
            >
              {copied ? <Check size={9} /> : <Copy size={9} />}
              {copied ? 'Copied' : 'Copy'}
            </DSButton>

            {onAction && (
              <DSButton
                variant="ghost"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAction(); }}
                style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1)', gap: 'var(--token-space-1)' }}
              >
                Open <ExternalLink size={9} />
              </DSButton>
            )}
          </div>
        </div>
      )}

      {/* —— Error state —— */}
      {expanded && isError && (
        <div
          className="flex flex-col"
          style={{
            padding: 'var(--token-space-3)',
            borderTop: '1px solid var(--token-border-subtle)',
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-error)',
            fontFamily: 'var(--token-font-mono)',
            lineHeight: 'var(--token-leading-relaxed)',
          }}>
            {errorMessage || 'Tool execution failed. Please try again.'}
          </span>
          {onRetry && (
            <DSButton variant="secondary" onClick={onRetry} style={{ alignSelf: 'flex-start', fontSize: 'var(--token-text-2xs)' }}>
              <RotateCw size={10} /> Retry
            </DSButton>
          )}
        </div>
      )}

      {/* —— Loading skeleton body —— */}
      {expanded && isLoading && (
        <div
          className="flex flex-col"
          style={{
            padding: 'var(--token-space-3)',
            gap: 'var(--token-space-2)',
            borderTop: '1px solid var(--token-border-subtle)',
          }}
        >
          {[80, 60, 45].map((w, i) => (
            <div key={i} style={{
              width: `${w}%`, height: 10,
              borderRadius: 'var(--token-radius-sm)',
              background: 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-hover) 50%, var(--token-bg-tertiary) 75%)',
              backgroundSize: '200% 100%',
              animation: `token-shimmer 1.5s linear infinite ${i * 100}ms`,
            }} />
          ))}
        </div>
      )}

      {/* —— Collapsed preview (success, not expanded) —— */}
      {!expanded && !isLoading && !isError && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderTop: '1px solid var(--token-border-subtle)',
            background: 'var(--token-bg-secondary)',
          }}
        >
          <span
            className="flex-1 truncate"
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {Object.entries(data).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ')}
          </span>
          {footer && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              flexShrink: 0,
            }}>
              {footer}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* —— Demo —— */
export function ToolResultDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [weatherData, setWeatherData] = useState({
    Temperature: '64°F', Condition: 'Partly Cloudy', Humidity: '72%', Wind: '12 mph NW',
  });
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [errorDemo, setErrorDemo] = useState(false);

  const refreshWeather = () => {
    setLoadingDemo(true);
    setErrorDemo(false);
    setTimeout(() => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Clear Skies'];
      const temps = ['58°F', '64°F', '71°F', '67°F', '75°F'];
      const humidities = ['65%', '72%', '80%', '55%', '68%'];
      const idx = Math.floor(Math.random() * conditions.length);
      setWeatherData({
        Temperature: temps[idx],
        Condition: conditions[idx],
        Humidity: humidities[idx],
        Wind: `${Math.floor(Math.random() * 20 + 5)} mph ${['N', 'NE', 'NW', 'S', 'SE', 'SW'][Math.floor(Math.random() * 6)]}`,
      });
      setLoadingDemo(false);
      setRefreshKey(k => k + 1);
    }, 1500);
  };

  const triggerError = () => {
    setErrorDemo(true);
    setLoadingDemo(false);
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', maxWidth: 380, width: '100%' }}>
      {/* Weather — live refresh with loading state */}
      <div key={refreshKey} style={{ animation: 'token-fade-in 300ms ease' }}>
        <ToolResult
          type="weather"
          title="San Francisco, CA"
          data={weatherData}
          footer="via OpenWeather API"
          status={loadingDemo ? 'loading' : 'success'}
          executionTime="230ms"
          rawOutput={JSON.stringify(weatherData, null, 2)}
        />
      </div>

      {/* Stock — static success */}
      <div style={{ animation: 'token-fade-in 300ms ease 100ms both' }}>
        <ToolResult
          type="stock"
          title="AAPL — Apple Inc."
          data={{
            Price: '$178.72',
            Change: '+2.41 (1.37%)',
            Volume: '52.3M',
            'Market Cap': '$2.78T',
          }}
          footer="15 min delay"
          executionTime="450ms"
          rawOutput={'{"symbol":"AAPL","price":178.72,"change":2.41,"pct":1.37}'}
        />
      </div>

      {/* Error state */}
      {errorDemo && (
        <div style={{ animation: 'token-fade-in 300ms ease' }}>
          <ToolResult
            type="calculation"
            title="Token Cost Estimate"
            data={{}}
            status="error"
            errorMessage="API rate limit exceeded. Retry after 30 seconds."
            onRetry={() => setErrorDemo(false)}
          />
        </div>
      )}

      {/* Calculation — success with raw output */}
      {!errorDemo && (
        <div style={{ animation: 'token-fade-in 300ms ease 200ms both' }}>
          <ToolResult
            type="calculation"
            title="Token Cost Estimate"
            data={{
              'Input tokens': '12,450',
              'Output tokens': '38,200',
              'Price per 1M': '$2.50 / $10.00',
              'Total cost': '$0.413',
            }}
            footer="Based on GPT-4o pricing"
            executionTime="85ms"
            rawOutput={'{\n  "input_tokens": 12450,\n  "output_tokens": 38200,\n  "input_cost": 0.031,\n  "output_cost": 0.382,\n  "total": 0.413\n}'}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center" style={{ gap: 'var(--token-space-3)' }}>
        <button
          onClick={refreshWeather}
          className="cursor-pointer"
          disabled={loadingDemo}
          style={{
            fontSize: 'var(--token-text-2xs)', color: loadingDemo ? 'var(--token-text-disabled)' : 'var(--token-accent)',
            fontFamily: 'var(--token-font-mono)',
            border: 'none', background: 'none',
            textDecoration: 'underline', textUnderlineOffset: 2,
            cursor: loadingDemo ? 'not-allowed' : 'pointer',
          }}
        >
          {loadingDemo ? 'fetching...' : 'refresh weather'}
        </button>
        <button
          onClick={triggerError}
          className="cursor-pointer"
          style={{
            fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)',
            fontFamily: 'var(--token-font-mono)',
            border: 'none', background: 'none',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}
        >
          simulate error
        </button>
      </div>
    </div>
  );
}
