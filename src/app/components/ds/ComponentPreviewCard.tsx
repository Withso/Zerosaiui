/* ================================================
   ComponentPreviewCard — Shared preview cell
   Used by both the Design System page and the
   Home page gallery so they stay perfectly in sync.
   ================================================ */
import type { ComponentType, CSSProperties } from 'react';
import { Link } from 'react-router';

/* ——— Category badge colours ——— */
export const categoryCellColors: Record<string, { bg: string; fg: string }> = {
  Chat: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
  Composer: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
  Suggestion: { bg: 'var(--token-secondary-light)', fg: 'var(--token-secondary)' },
  Form: { bg: 'var(--token-secondary-light)', fg: 'var(--token-secondary)' },
  Processing: { bg: 'var(--token-tertiary-light)', fg: 'var(--token-tertiary)' },
  Response: { bg: 'var(--token-tertiary-light)', fg: 'var(--token-tertiary)' },
  Research: { bg: 'var(--token-info-light)', fg: 'var(--token-info)' },
  Image: { bg: 'color-mix(in srgb, var(--token-chart-6) 12%, transparent)', fg: 'var(--token-chart-6)' },
  Voice: { bg: 'color-mix(in srgb, var(--token-chart-3) 12%, transparent)', fg: 'var(--token-chart-3)' },
  Agentic: { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
  System: { bg: 'var(--token-bg-tertiary)', fg: 'var(--token-text-secondary)' },
  Action: { bg: 'var(--token-success-light)', fg: 'var(--token-success)' },
  Search: { bg: 'var(--token-info-light)', fg: 'var(--token-info)' },
  Mobile: { bg: 'color-mix(in srgb, var(--token-chart-5) 12%, transparent)', fg: 'var(--token-chart-5)' },
  Mixed: { bg: 'var(--token-warning-light)', fg: 'var(--token-warning)' },
  'Real-World AI': { bg: 'var(--token-accent-light)', fg: 'var(--token-accent)' },
};

const defaultCatColor = { bg: 'var(--token-bg-tertiary)', fg: 'var(--token-text-secondary)' };

export interface ComponentPreviewCardProps {
  /** Component to render inside the preview area */
  component: ComponentType;
  /** Display name shown in the title bar */
  name: string;
  /** Category label (Chat, Processing, etc.) */
  category: string;
  /** Where the title bar links to */
  detailPath: string;
  /** Optional outer wrapper style overrides */
  style?: CSSProperties;
}

export function ComponentPreviewCard({
  component: LivePreview,
  name,
  category,
  detailPath,
  style,
}: ComponentPreviewCardProps) {
  const cc = categoryCellColors[category] || defaultCatColor;

  return (
    <div
      className="flex flex-col"
      style={{
        height: 'calc((100vh - 56px) / 2)',
        background: 'var(--token-bg)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Preview Area — scrollable with inner padding for breathing room */}
      <div
        className="flex-1 flex flex-col responsive-padding-x"
        style={{
          cursor: 'default',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Inner wrapper — margin:auto centres when content fits,
            collapses to 0 when content overflows so the top stays
            reachable. Padding provides breathing room at both ends. */}
        <div className="responsive-padding-y" style={{
          pointerEvents: 'auto',
          margin: 'auto',
          maxWidth: '100%',
        }}>
          <LivePreview />
        </div>
      </div>

      {/* Title Bar — navigates to detail page */}
      <Link
        to={detailPath}
        className="flex items-center justify-between shrink-0 responsive-padding-x"
        style={{
          height: 44,
          borderTop: '1px solid var(--token-border)',
          textDecoration: 'none',
          cursor: 'pointer',
          background: 'var(--token-bg)',
          transition: 'background var(--token-duration-fast)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--token-bg)';
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2-5)' }}>
          <span style={{
            width: 6, height: 6, borderRadius: 'var(--token-radius-full)',
            background: cc.fg, display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{
            fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-secondary)', fontFamily: 'var(--token-font-sans)',
          }}>
            {name}
          </span>
        </div>
        <span style={{
          fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
          color: cc.fg, background: cc.bg,
          padding: '0 8px', borderRadius: 'var(--token-radius-full)', lineHeight: '18px',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {category}
        </span>
      </Link>
    </div>
  );
}