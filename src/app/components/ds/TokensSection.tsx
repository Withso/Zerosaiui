/* ================================================
   Design Tokens — Single-column gallery rows
   Data-driven from shared tokenData (source of truth)
   Excludes Components collection
   ================================================ */
import {
  documentationCollections,
  type TokenGroup,
  type TokenEntry,
  isColorValue,
} from '../../data/tokenData';

/* ——— Derive section IDs from collections + groups ——— */
function makeSectionId(collName: string, groupName: string): string {
  return `${collName}--${groupName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** All sidebar section entries, derived from the source of truth */
export const tokenSidebarSections: { id: string; label: string; collection: string; group: string; count: number }[] = [];
for (const coll of documentationCollections) {
  for (const group of coll.groups) {
    tokenSidebarSections.push({
      id: makeSectionId(coll.name, group.name),
      label: group.name,
      collection: coll.name,
      group: group.name,
      count: group.tokens.length,
    });
  }
}

/* ——— Section header matching DesignSystemPage ——— */
function SectionHeader({ title, count, collection }: { title: string; count: number; collection: string }) {
  return (
    <div
      className="flex items-center token-section-header"
      style={{
        gap: 'var(--token-space-2-5)',
        padding: 'var(--token-space-3) var(--token-space-6)',
        borderBottom: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}
    >
      <span style={{
        width: 5, height: 5, borderRadius: 'var(--token-radius-full)',
        background: 'var(--token-accent)', display: 'inline-block', flexShrink: 0,
      }} />
      <span style={{
        fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-semibold)',
        color: 'var(--token-text-primary)', letterSpacing: 'var(--token-tracking-tight)',
      }}>
        {title}
      </span>
      <span style={{
        fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
        color: 'var(--token-accent)', background: 'var(--token-accent-light)',
        padding: '0 6px', borderRadius: 'var(--token-radius-full)', lineHeight: '16px',
      }}>
        {count}
      </span>
      <span style={{
        fontSize: 9, color: 'var(--token-text-disabled)', marginLeft: 'auto',
        fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {collection}
      </span>
    </div>
  );
}

/* ——— Gallery row wrapper ——— */
function TokenRowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="token-section-row" style={{
      background: 'var(--token-bg)',
      borderBottom: '1px solid var(--token-border)',
    }}>
      <div style={{ padding: 'var(--token-space-5) var(--token-space-6)' }}>
        {children}
      </div>
    </div>
  );
}

/* ——— Color swatch (light/dark side by side) ——— */
const MINERAL_NAMES: Record<string, string> = {
  /* Chart / Categorical */
  '--token-chart-1': 'Rhodolite',
  '--token-chart-2': 'Carnelian',
  '--token-chart-3': 'Feldspar',
  '--token-chart-4': 'Chalcedony',
  '--token-chart-5': 'Serpentine',
  '--token-chart-6': 'Tourmaline',
  /* Status */
  '--token-success': 'Malachite',
  '--token-success-light': 'Malachite (light)',
  '--token-error': 'Garnet',
  '--token-error-light': 'Garnet (light)',
  '--token-warning': 'Ochre',
  '--token-warning-light': 'Ochre (light)',
  /* Brand */
  '--token-accent': 'Moonstone',
  '--token-accent-hover': 'Moonstone (hover)',
  '--token-accent-light': 'Moonstone (light)',
  '--token-accent-fg': 'Moonstone (fg)',
  '--token-accent-muted': 'Moonstone (muted)',
  '--token-secondary': 'Sunstone',
  '--token-secondary-hover': 'Sunstone (hover)',
  '--token-secondary-light': 'Sunstone (light)',
  '--token-secondary-fg': 'Sunstone (fg)',
  '--token-tertiary': 'Olivine',
  '--token-tertiary-hover': 'Olivine (hover)',
  '--token-tertiary-light': 'Olivine (light)',
  '--token-tertiary-fg': 'Olivine (fg)',
  /* Confidence (maps to status minerals) */
  '--token-confidence-high': 'Malachite (high)',
  '--token-confidence-medium': 'Ochre (medium)',
  '--token-confidence-low': 'Garnet (low)',
};

function DualSwatch({ token }: { token: TokenEntry }) {
  const mineralName = MINERAL_NAMES[token.name];
  return (
    <div className="flex flex-col" style={{
      border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)',
      overflow: 'hidden', minWidth: 90, flex: '1 1 90px',
    }}>
      <div className="flex">
        <div style={{ flex: 1, height: 32, background: token.lightValue }} />
        <div style={{ flex: 1, height: 32, background: token.darkValue, borderLeft: '1px solid var(--token-border)' }} />
      </div>
      <div style={{ padding: '4px 6px', background: 'var(--token-bg-secondary)' }}>
        <div style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>
          {mineralName || token.name.replace(/^--token-/, '').replace(/^--/, '')}
        </div>
        <code style={{ fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', display: 'block' }}>{token.name}</code>
      </div>
    </div>
  );
}

/* ——— Palette strip for primitive hue groups ——— */
function PaletteStrip({ groupName, tokens }: { groupName: string; tokens: TokenEntry[] }) {
  const sorted = [...tokens].sort((a, b) => {
    const numA = parseInt(a.name.replace(/^--\w+-/, '')) || 0;
    const numB = parseInt(b.name.replace(/^--\w+-/, '')) || 0;
    return numA - numB;
  });
  return (
    <div style={{ marginBottom: 'var(--token-space-2)' }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{groupName}</span>
        <span style={{ fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>--{groupName.toLowerCase()}-*</span>
      </div>
      <div className="flex" style={{ borderRadius: 'var(--token-radius-md)', overflow: 'hidden', border: '1px solid var(--token-border)' }}>
        {sorted.map((t, i) => {
          const stop = t.name.replace(/^--\w+-/, '');
          return (
            <div key={t.name} className="flex flex-col items-center justify-end" style={{ flex: 1, background: t.lightValue, height: 36, padding: '2px 0', position: 'relative' }}>
              <span style={{ fontSize: 7, fontFamily: 'var(--token-font-mono)', color: i < Math.ceil(sorted.length / 2) ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.7)', textAlign: 'center', lineHeight: 1.3 }}>{stop}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Table header for tabular token rows ——— */
function TableHeader() {
  return (
    <div className="flex items-center" style={{
      padding: 'var(--token-space-1) var(--token-space-3)',
      borderBottom: '1px solid var(--token-border)',
      background: 'var(--token-bg-secondary)', gap: 'var(--token-space-2)',
      minWidth: 420,
    }}>
      <span className="flex-1" style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>TOKEN</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', minWidth: 100, textAlign: 'right' }}>VARIABLE</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', minWidth: 70, textAlign: 'right' }}>LIGHT</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', minWidth: 70, textAlign: 'right' }}>DARK</span>
    </div>
  );
}

/* ——— Table row ——— */
function TokenTableRow({ token, preview }: { token: TokenEntry; preview?: React.ReactNode }) {
  const shortName = token.name.replace(/^--token-/, '').replace(/^--/, '');
  return (
    <div className="flex items-center" style={{
      padding: 'var(--token-space-1-5) var(--token-space-3)',
      borderBottom: '1px solid var(--token-border-subtle)',
      gap: 'var(--token-space-2)',
      minWidth: 420,
    }}>
      {preview && <div style={{ flexShrink: 0 }}>{preview}</div>}
      <span className="flex-1" style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', minWidth: 50 }}>{shortName}</span>
      <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', minWidth: 100, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{token.name}</code>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)', minWidth: 70, textAlign: 'right', background: 'var(--token-bg-secondary)', padding: '1px 5px', borderRadius: 'var(--token-radius-sm)' }}>
        {token.lightValue}
      </span>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)', minWidth: 70, textAlign: 'right', background: 'var(--token-bg-tertiary)', padding: '1px 5px', borderRadius: 'var(--token-radius-sm)' }}>
        {token.darkValue}
      </span>
    </div>
  );
}

/* ——— Color dot preview ——— */
function ColorDot({ color }: { color: string }) {
  return <div style={{ width: 14, height: 14, borderRadius: 'var(--token-radius-full)', background: color, border: '1px solid var(--token-border)', flexShrink: 0 }} />;
}

/* ——— Spacing bar ——— */
function SpacingBar({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-/, '');
  const px = parseInt(token.lightValue) || 0;
  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-3)', padding: '2px 0' }}>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)', minWidth: 56, textAlign: 'right' }}>{shortName}</span>
      <div style={{
        height: 6, width: Math.max(2, px * 3), maxWidth: '100%',
        borderRadius: 'var(--token-radius-sm)',
        background: 'linear-gradient(135deg, var(--token-accent), var(--token-secondary))',
        opacity: 0.8,
      }} />
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{token.lightValue}</span>
    </div>
  );
}

/* ——— Radius preview ——— */
function RadiusPreview({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-/, '');
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-1)' }}>
      <div style={{
        width: 40, height: 40, borderRadius: `var(${token.name})`,
        border: '2px solid var(--token-accent)',
        background: 'var(--token-accent-muted)',
      }} />
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-secondary)' }}>{shortName.replace('radius-', '')}</span>
      <span style={{ fontSize: 8, fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>{token.lightValue}</span>
    </div>
  );
}

/* ——— Shadow preview ——— */
function ShadowPreview({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-shadow-/, '');
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-1)' }}>
      <div style={{
        width: 56, height: 40, borderRadius: 'var(--token-radius-md)',
        background: 'var(--token-bg)', border: '1px solid var(--token-border-subtle)',
        boxShadow: `var(${token.name})`,
      }} />
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-secondary)' }}>{shortName}</span>
    </div>
  );
}

/* ——— Typography scale row ——— */
function TypoSizeRow({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-text-/, '');
  return (
    <div className="flex items-center" style={{ padding: 'var(--token-space-1-5) var(--token-space-3)', borderBottom: '1px solid var(--token-border-subtle)', gap: 'var(--token-space-3)' }}>
      <span className="flex-1" style={{ fontSize: `var(${token.name})`, color: 'var(--token-text-primary)', whiteSpace: 'nowrap' }}>The quick brown fox</span>
      <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', minWidth: 40 }}>{shortName}</code>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', minWidth: 36, textAlign: 'right' }}>{token.lightValue}</span>
    </div>
  );
}

/* ——— Font weight preview ——— */
function WeightPreview({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-weight-/, '');
  const w = parseInt(token.lightValue) || 400;
  return (
    <div className="flex flex-col" style={{ gap: 2 }}>
      <span style={{ fontSize: 'var(--token-text-2xl)', fontWeight: w, color: 'var(--token-text-primary)' }}>Ag</span>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-secondary)' }}>{shortName} &middot; {w}</span>
    </div>
  );
}

/* ——— Font family preview ——— */
function FontFamilyPreview({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-font-/, '');
  const isMono = shortName === 'mono';
  return (
    <div>
      <span style={{ fontSize: 'var(--token-text-md)', fontFamily: `var(${token.name})`, color: 'var(--token-text-primary)' }}>
        {isMono ? 'JetBrains Mono' : 'Inter'} &mdash; {isMono ? 'Monospace' : 'Sans Serif'}
      </span>
      <div style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', marginTop: 2 }}>{token.name}</div>
    </div>
  );
}

/* ——— Motion row ——— */
function MotionRow({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-/, '');
  return (
    <div className="flex items-center" style={{ padding: 'var(--token-space-2) var(--token-space-3)', borderBottom: '1px solid var(--token-border-subtle)', gap: 'var(--token-space-3)' }}>
      <span className="flex-1" style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{shortName}</span>
      <code style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-tertiary)', textAlign: 'right' }}>{token.lightValue}</code>
    </div>
  );
}

/* ——— Z-Index row ——— */
function ZIndexRow({ token }: { token: TokenEntry }) {
  const shortName = token.name.replace(/^--token-z-/, '');
  const v = parseInt(token.lightValue) || 0;
  return (
    <div className="flex items-center" style={{ padding: 'var(--token-space-2) var(--token-space-3)', borderBottom: '1px solid var(--token-border-subtle)', gap: 'var(--token-space-3)' }}>
      <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', minWidth: 70 }}>{shortName}</span>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--token-bg-tertiary)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${(v / 400) * 100}%`,
          borderRadius: 2,
          background: 'linear-gradient(90deg, var(--token-accent), var(--token-secondary))',
          opacity: 0.7, minWidth: v > 0 ? 4 : 0,
        }} />
      </div>
      <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)', minWidth: 24, textAlign: 'right' }}>{token.lightValue}</span>
    </div>
  );
}

/* ================================================
   Render a single group based on its collection + group context
   ================================================ */
function renderGroup(collection: string, group: TokenGroup) {
  const { name: groupName, tokens } = group;

  /* Primitives → Palette strips */
  if (collection === 'Primitives') {
    return <PaletteStrip groupName={groupName} tokens={tokens} />;
  }

  /* Colors → swatches for brand groups, table for background/text/border/status */
  if (collection === 'Colors') {
    const allColor = tokens.every(t => isColorValue(t.lightValue));
    if (['Brand Primary', 'Brand Secondary', 'Brand Tertiary', 'Status', 'Chart / Categorical'].includes(groupName) && allColor) {
      return (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-2)' }}>
          {tokens.map(t => <DualSwatch key={t.name} token={t} />)}
        </div>
      );
    }
    /* Background, Text, Border → table */
    return (
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden', minWidth: 420 }}>
        <TableHeader />
        {tokens.map(t => {
          let preview: React.ReactNode = undefined;
          if (isColorValue(t.lightValue)) {
            if (groupName === 'Text') {
              preview = <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-semibold)', color: `var(${t.name})`, width: 14, textAlign: 'center' }}>A</span>;
            } else if (groupName === 'Border') {
              preview = <div style={{ width: 14, height: 3, borderRadius: 2, background: `var(${t.name})` }} />;
            } else {
              preview = <ColorDot color={`var(${t.name})`} />;
            }
          }
          return <TokenTableRow key={t.name} token={t} preview={preview} />;
        })}
      </div>
      </div>
    );
  }

  /* Typography */
  if (collection === 'Typography') {
    if (groupName === 'Font Size') {
      const sizeOrder = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'base', 'sm', 'xs', '2xs'];
      const sorted = [...tokens].sort((a, b) => {
        const ia = sizeOrder.indexOf(a.name.replace(/^--token-text-/, ''));
        const ib = sizeOrder.indexOf(b.name.replace(/^--token-text-/, ''));
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
      return (
        <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden' }}>
          <div className="flex items-center" style={{ padding: 'var(--token-space-1) var(--token-space-3)', borderBottom: '1px solid var(--token-border)', background: 'var(--token-bg-secondary)', gap: 'var(--token-space-3)' }}>
            <span className="flex-1" style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>PREVIEW</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', minWidth: 40 }}>NAME</span>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)', minWidth: 36, textAlign: 'right' }}>SIZE</span>
          </div>
          {sorted.map(t => <TypoSizeRow key={t.name} token={t} />)}
        </div>
      );
    }
    if (groupName === 'Font Weight') {
      return (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-6)' }}>
          {tokens.map(t => <WeightPreview key={t.name} token={t} />)}
        </div>
      );
    }
    if (groupName === 'Font Family') {
      return (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', padding: 'var(--token-space-3)' }}>
          {tokens.map((t, i) => (
            <div key={t.name} style={i > 0 ? { borderTop: '1px solid var(--token-border-subtle)', paddingTop: 'var(--token-space-3)' } : undefined}>
              <FontFamilyPreview token={t} />
            </div>
          ))}
        </div>
      );
    }
    /* Line Height, Letter Spacing → table */
    return (
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden', minWidth: 420 }}>
        <TableHeader />
        {tokens.map(t => <TokenTableRow key={t.name} token={t} />)}
      </div>
      </div>
    );
  }

  /* Layout */
  if (collection === 'Layout') {
    if (groupName === 'Spacing') {
      const sorted = [...tokens].sort((a, b) => {
        const pa = parseFloat(a.lightValue) || 0;
        const pb = parseFloat(b.lightValue) || 0;
        return pa - pb;
      });
      return (
        <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', padding: 'var(--token-space-2-5) var(--token-space-3)' }}>
          {sorted.map(t => <SpacingBar key={t.name} token={t} />)}
        </div>
      );
    }
    if (groupName === 'Radius') {
      return (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-5)' }}>
          {tokens.map(t => <RadiusPreview key={t.name} token={t} />)}
        </div>
      );
    }
    if (groupName === 'Z-Index') {
      return (
        <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden' }}>
          {tokens.map(t => <ZIndexRow key={t.name} token={t} />)}
        </div>
      );
    }
  }

  /* Effects */
  if (collection === 'Effects') {
    if (groupName === 'Shadows') {
      return (
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-5)' }}>
          {tokens.map(t => <ShadowPreview key={t.name} token={t} />)}
        </div>
      );
    }
    if (groupName === 'Motion') {
      return (
        <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden' }}>
          {tokens.map(t => <MotionRow key={t.name} token={t} />)}
        </div>
      );
    }
  }

  /* Fallback — generic table */
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <div style={{ border: '1px solid var(--token-border)', borderRadius: 'var(--token-radius-md)', overflow: 'hidden', minWidth: 420 }}>
      <TableHeader />
      {tokens.map(t => {
        const preview = isColorValue(t.lightValue) ? <ColorDot color={t.lightValue} /> : undefined;
        return <TokenTableRow key={t.name} token={t} preview={preview} />;
      })}
    </div>
    </div>
  );
}

/* ================================================
   Main Section Export
   ================================================ */
interface TokensSectionProps {
  registerRef: (id: string) => (el: HTMLDivElement | null) => void;
}

export function TokensSection({ registerRef }: TokensSectionProps) {
  return (
    <div className="flex flex-col" style={{ background: 'var(--token-border)', gap: 0 }}>
      {documentationCollections.map(coll =>
        coll.groups.map(group => {
          const sectionId = makeSectionId(coll.name, group.name);
          return (
            <div key={sectionId} ref={registerRef(sectionId)} style={{ scrollMarginTop: 16 }}>
              <SectionHeader title={group.name} count={group.tokens.length} collection={coll.name} />
              <TokenRowWrapper>
                {renderGroup(coll.name, group)}
              </TokenRowWrapper>
            </div>
          );
        })
      )}
    </div>
  );
}