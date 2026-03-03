import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { componentRegistry } from '../data/componentRegistry';

export function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const entry = componentRegistry.find(c => c.id === id);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!entry) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          height: '100%',
          fontFamily: 'var(--token-font-sans)',
          gap: 'var(--token-space-4)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--token-text-lg)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
          }}
        >
          Component not found
        </span>
        <Link
          to="/"
          style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-accent)',
            textDecoration: 'none',
          }}
        >
          Back to all components
        </Link>
      </div>
    );
  }

  const Component = entry.component;

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100%',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      {/* Sub Header */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: isMobile ? 44 : 48,
          padding: isMobile ? '0 var(--token-space-3)' : '0 var(--token-space-6)',
          borderBottom: '1px solid var(--token-border)',
          gap: 'var(--token-space-2)',
          overflow: 'hidden',
        }}
      >
        <Link
          to="/"
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--token-radius-md)',
            border: 'none',
            background: 'transparent',
            color: 'var(--token-text-tertiary)',
            textDecoration: 'none',
            transition: 'all var(--token-duration-fast) var(--token-ease-default)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
            (e.currentTarget as HTMLElement).style.color = 'var(--token-text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--token-text-tertiary)';
          }}
        >
          <ArrowLeft size={16} />
        </Link>
        <span
          style={{
            fontSize: 'var(--token-text-sm)',
            fontWeight: 'var(--token-weight-medium)',
            color: 'var(--token-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
          }}
        >
          {entry.title}
        </span>
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'var(--token-bg-tertiary)',
            padding: '2px 8px',
            borderRadius: 'var(--token-radius-full)',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {entry.category}
        </span>
      </div>

      {/* Component Preview */}
      <div
        className="flex-1 flex flex-col"
        style={{
          padding: isMobile ? 'var(--token-space-3)' : 'var(--token-space-6)',
          paddingTop: isMobile ? 'var(--token-space-3)' : 'var(--token-space-6)',
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            background: 'var(--token-bg-secondary)',
            border: '1px solid var(--token-border)',
            borderRadius: isMobile ? 'var(--token-radius-lg)' : 'var(--token-radius-xl)',
            padding: isMobile ? 'var(--token-space-4)' : 'var(--token-space-10)',
            overflow: 'auto',
            minHeight: isMobile ? 300 : undefined,
          }}
        >
          <div style={{ maxWidth: '100%', overflow: 'auto' }}>
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}
