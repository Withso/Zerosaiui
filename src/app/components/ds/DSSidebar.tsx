/* ================================================
   Components Sidebar
   Used by DesignSystemPage (Components page)
   Atoms, Molecules, Components sections
   ================================================ */
import { Link } from 'react-router';
import {
  Atom, FlaskConical, Component,
} from 'lucide-react';
import { fullComponents } from './ComponentsSection';
import { atomEntries } from './AtomsSection';
import { moleculeEntries } from './MoleculesSection';

/* ——— Section metadata ——— */
const componentSections = [
  { id: 'atoms', label: 'Atoms', icon: <Atom size={13} />, count: atomEntries.length },
  { id: 'molecules', label: 'Molecules', icon: <FlaskConical size={13} />, count: moleculeEntries.length },
  { id: 'components', label: 'Components', icon: <Component size={13} />, count: fullComponents.length },
];

interface DSSidebarProps {
  /** Currently active section id — 'atoms'/'molecules'/'components' */
  activeSection: string;
  /** Scroll-to-section handler */
  onSectionClick: (id: string) => void;
}

export function DSSidebar({ activeSection, onSectionClick }: DSSidebarProps) {
  return (
    <nav
      className="shrink-0 flex flex-col"
      style={{
        width: 220,
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{ padding: 'var(--token-space-4) var(--token-space-4) var(--token-space-2)' }}>
        <span style={{
          fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-semibold)',
          color: 'var(--token-text-primary)', letterSpacing: 'var(--token-tracking-tight)',
        }}>
          Components
        </span>
      </div>

      {/* Section nav */}
      <div className="flex flex-col" style={{ padding: 'var(--token-space-2) var(--token-space-2)', gap: 'var(--token-space-0-5)' }}>
        {componentSections.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSectionClick(sec.id)}
              className="flex items-center w-full cursor-pointer"
              style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                border: 'none',
                borderRadius: 'var(--token-radius-md)',
                background: isActive ? 'var(--token-bg-hover)' : 'transparent',
                fontFamily: 'var(--token-font-sans)',
                fontSize: 'var(--token-text-sm)',
                color: isActive ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                fontWeight: isActive ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
                textAlign: 'left',
                transition: 'all var(--token-duration-fast)',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--token-bg-hover)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ color: isActive ? 'var(--token-accent)' : 'var(--token-text-disabled)', display: 'flex', flexShrink: 0 }}>
                {sec.icon}
              </span>
              <span className="flex-1">{sec.label}</span>
              {sec.count !== null && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-disabled)',
                }}>
                  {sec.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Back to gallery link */}
      <div style={{ marginTop: 'auto', padding: 'var(--token-space-4)' }}>
        <Link
          to="/"
          style={{
            fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)',
            textDecoration: 'none', fontFamily: 'var(--token-font-sans)',
            transition: 'color var(--token-duration-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
        >
          ← Back to Gallery
        </Link>
      </div>
    </nav>
  );
}