/* —— ContextAttachments — Phase 3 Enhanced ——
   Phase 3: token weight visualization per source, group-by-type view,
   drag hint for reorder, total cost estimate, priority badges */
import { useState } from 'react';
import { File, Image, Code2, Globe, Database, X, Plus, Paperclip, Hash, FileText, FolderOpen, Star } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface ContextItem {
  id: string;
  name: string;
  type: 'file' | 'image' | 'code' | 'url' | 'database' | 'document';
  size?: string;
  tokens?: number;
  priority?: 'high' | 'normal';
}

const typeIcons: Record<string, React.ReactNode> = {
  file: <File size={11} />,
  image: <Image size={11} />,
  code: <Code2 size={11} />,
  url: <Globe size={11} />,
  database: <Database size={11} />,
  document: <FileText size={11} />,
};

const typeColors: Record<string, string> = {
  file: 'var(--token-text-secondary)',
  image: 'var(--token-chart-6)',
  code: 'var(--token-accent)',
  url: 'var(--token-chart-5)',
  database: 'var(--token-chart-4)',
  document: 'var(--token-chart-3)',
};

const mockAttachments: ContextItem[] = [
  { id: '1', name: 'atoms.tsx', type: 'code', size: '24KB', tokens: 3200, priority: 'high' },
  { id: '2', name: 'molecules-base.tsx', type: 'code', size: '18KB', tokens: 2400 },
  { id: '3', name: 'design-spec.pdf', type: 'document', size: '2.1MB', tokens: 8500, priority: 'high' },
  { id: '4', name: 'component-screenshot.png', type: 'image', size: '340KB' },
  { id: '5', name: 'https://docs.design-system.dev', type: 'url', tokens: 1200 },
];

export function ContextAttachmentsDemo() {
  const [items, setItems] = useState(mockAttachments);
  const [showPicker, setShowPicker] = useState(false);

  const totalTokens = items.reduce((sum, i) => sum + (i.tokens || 0), 0);
  const maxContextTokens = 128000;
  const pct = (totalTokens / maxContextTokens) * 100;
  const highPriorityCount = items.filter(i => i.priority === 'high').length;

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const togglePriority = (id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, priority: i.priority === 'high' ? 'normal' : 'high' } : i,
    ));
  };

  return (
    <div style={{
      width: 440, borderRadius: 'var(--token-radius-xl)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      background: 'var(--token-bg)',
      overflow: 'hidden', fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-2-5) var(--token-space-4)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border)',
      }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <Paperclip size={13} style={{ color: 'var(--token-text-tertiary)' }} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>
            Context
          </span>
          <DSBadge variant="count">{items.length}</DSBadge>
          {highPriorityCount > 0 && (
            <DSBadge variant="warning" style={{ fontSize: '9px', padding: '0 4px' }}>
              {highPriorityCount} pinned
            </DSBadge>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          {totalTokens > 0 && (
            <span style={{
              fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-disabled)',
            }}>
              ~{(totalTokens / 1000).toFixed(1)}k tokens
            </span>
          )}
          <DSButton
            variant="ghost"
            icon={<Plus size={12} />}
            onClick={() => setShowPicker(!showPicker)}
          >
            Add
          </DSButton>
        </div>
      </div>

      {/* Attached items */}
      <div style={{ padding: 'var(--token-space-2) var(--token-space-3)' }}>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center"
              style={{
                gap: 6, padding: '4px 8px 4px 6px',
                borderRadius: 'var(--token-radius-md)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: item.priority === 'high' ? 'var(--token-warning)' : 'var(--token-border)',
                background: item.priority === 'high' ? 'var(--token-warning-light)' : 'var(--token-bg-secondary)',
                fontSize: 'var(--token-text-xs)',
                transition: 'all 150ms ease',
                maxWidth: 200,
                animation: 'token-fade-in 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--token-border-strong)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = item.priority === 'high' ? 'var(--token-warning)' : 'var(--token-border)';
              }}
            >
              {/* Pin indicator */}
              <button
                onClick={() => togglePriority(item.id)}
                className="flex items-center justify-center cursor-pointer"
                title={item.priority === 'high' ? 'Unpin' : 'Pin'}
                style={{
                  width: 14, height: 14,
                  borderWidth: 0,
                  borderStyle: 'none',
                  background: 'transparent',
                  color: item.priority === 'high' ? 'var(--token-warning)' : typeColors[item.type],
                  flexShrink: 0,
                  padding: 0,
                  display: 'flex',
                }}
              >
                {item.priority === 'high' ? <Star size={11} /> : typeIcons[item.type]}
              </button>
              <span className="truncate" style={{ color: 'var(--token-text-secondary)', flex: 1 }}>
                {item.name}
              </span>
              {item.tokens && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                  color: 'var(--token-text-disabled)', flexShrink: 0,
                }}>
                  {item.tokens > 999 ? `${(item.tokens / 1000).toFixed(1)}k` : item.tokens}
                </span>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 14, height: 14, borderRadius: 'var(--token-radius-full)',
                  borderWidth: 0, borderStyle: 'none', background: 'transparent',
                  color: 'var(--token-text-disabled)',
                  flexShrink: 0,
                  transition: 'color 80ms',
                  padding: 0,
                  display: 'flex',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-error)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick add picker */}
      {showPicker && (
        <div style={{
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
          padding: 'var(--token-space-2) var(--token-space-3)',
          background: 'var(--token-bg-secondary)',
          animation: 'token-fade-in 150ms ease',
        }}>
          <div className="flex items-center" style={{ gap: 4, marginBottom: 8 }}>
            {[
              { icon: <FolderOpen size={12} />, label: 'Files' },
              { icon: <Code2 size={12} />, label: 'Code' },
              { icon: <Globe size={12} />, label: 'URL' },
              { icon: <Database size={12} />, label: 'Data' },
            ].map(opt => (
              <button
                key={opt.label}
                className="flex items-center cursor-pointer"
                style={{
                  gap: 4, padding: '4px 10px',
                  borderRadius: 'var(--token-radius-md)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--token-border)',
                  background: 'var(--token-bg)',
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-secondary)',
                  fontFamily: 'var(--token-font-sans)',
                  transition: 'all 80ms',
                }}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center" style={{
            gap: 6, padding: '6px 10px',
            borderRadius: 'var(--token-radius-md)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-border)',
            background: 'var(--token-bg)',
          }}>
            <Hash size={12} style={{ color: 'var(--token-text-disabled)' }} />
            <input
              type="text"
              placeholder="Search files, paste URL..."
              style={{
                flex: 1, borderWidth: 0, borderStyle: 'none', outline: 'none', background: 'transparent',
                fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-sans)',
                color: 'var(--token-text-primary)',
              }}
            />
          </div>
        </div>
      )}

      {/* Token budget bar with weight visualization */}
      <div style={{
        padding: 'var(--token-space-2) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
            Context usage
          </span>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
            {(totalTokens / 1000).toFixed(1)}k / 128k
          </span>
        </div>
        {/* Segmented token bar by type */}
        <div style={{
          height: 4, borderRadius: 'var(--token-radius-full)',
          background: 'var(--token-bg-tertiary)', overflow: 'hidden',
          display: 'flex',
        }}>
          {items.filter(i => i.tokens).map(item => (
            <div
              key={item.id}
              title={`${item.name}: ${item.tokens} tokens`}
              style={{
                height: '100%',
                width: `${((item.tokens || 0) / maxContextTokens) * 100}%`,
                background: typeColors[item.type],
                transition: 'width 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
