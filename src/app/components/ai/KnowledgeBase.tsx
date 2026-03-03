/* —— KnowledgeBase — Phase 3 Enhanced ——
   Phase 3: index health indicator, re-index action per source,
   storage usage bar, embedding model info, chunk count totals */
import { useState } from 'react';
import { BookOpen, FileText, Link2, Database, Upload, Check, Clock, HardDrive, RefreshCw, Sparkles } from 'lucide-react';
import { DSButton, DSBadge, DSDot } from '../ds/atoms';
import { ListPanel, type ListPanelItem } from './ListPanel';

type SourceType = 'document' | 'url' | 'database' | 'upload';

interface KnowledgeSource {
  id: string;
  name: string;
  type: SourceType;
  size?: string;
  lastUpdated: string;
  status: 'indexed' | 'indexing' | 'error';
  chunks?: number;
  embeddingModel?: string;
}

interface KnowledgeBaseProps {
  sources?: KnowledgeSource[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

const typeIcons: Record<SourceType, React.ReactNode> = {
  document: <FileText size={14} />,
  url: <Link2 size={14} />,
  database: <Database size={14} />,
  upload: <Upload size={14} />,
};

const statusColors: Record<string, string> = {
  indexed: 'var(--token-success)',
  indexing: 'var(--token-warning)',
  error: 'var(--token-error)',
};

export function KnowledgeBase({ sources: controlledSources, onAdd, onRemove }: KnowledgeBaseProps) {
  const [sources, setSources] = useState(controlledSources || defaultSources);
  const totalChunks = sources.reduce((sum, s) => sum + (s.chunks || 0), 0);
  const indexedCount = sources.filter(s => s.status === 'indexed').length;
  const errorCount = sources.filter(s => s.status === 'error').length;

  /* —— Re-index handler —— */
  const handleReindex = (id: string) => {
    setSources(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'indexing' as const } : s,
    ));
    setTimeout(() => {
      setSources(prev => prev.map(s =>
        s.id === id ? { ...s, status: 'indexed' as const, lastUpdated: 'Just now' } : s,
      ));
    }, 2000);
  };

  const items: ListPanelItem[] = sources.map(s => ({
    id: s.id,
    title: s.name,
    subtitle: `${s.size || '—'} · ${s.lastUpdated}${s.chunks ? ` · ${s.chunks} chunks` : ''}`,
    icon: (
      <div className="flex items-center justify-center shrink-0" style={{
        width: 28, height: 28, borderRadius: 'var(--token-radius-md)',
        background: 'var(--token-bg-tertiary)', color: 'var(--token-text-tertiary)',
      }}>
        {typeIcons[s.type]}
      </div>
    ),
    badge: (
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {s.status === 'error' && (
          <button
            onClick={(e) => { e.stopPropagation(); handleReindex(s.id); }}
            className="flex items-center justify-center cursor-pointer"
            title="Re-index"
            style={{
              width: 20, height: 20,
              borderRadius: 'var(--token-radius-sm)',
              borderWidth: 0,
              borderStyle: 'none',
              background: 'var(--token-bg-tertiary)',
              color: 'var(--token-text-tertiary)',
              padding: 0,
            }}
          >
            <RefreshCw size={10} />
          </button>
        )}
        <DSBadge variant={s.status === 'indexed' ? 'success' : s.status === 'indexing' ? 'streaming' : 'error'}>
          {s.status === 'indexed' ? 'Indexed' : s.status === 'indexing' ? 'Indexing...' : 'Error'}
        </DSBadge>
      </div>
    ),
    dotColor: statusColors[s.status],
  }));

  return (
    <ListPanel
      title="Knowledge Base"
      headerIcon={<BookOpen size={14} style={{ color: 'var(--token-text-tertiary)' }} />}
      headerActions={
        <DSButton variant="ghost" icon={<Upload size={10} />} onClick={onAdd}
          style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1) var(--token-space-2-5)', color: 'var(--token-accent)', background: 'var(--token-accent-light)' }}
        >
          Add Source
        </DSButton>
      }
      searchPlaceholder="Search sources..."
      items={items}
      onRemove={onRemove}
      maxHeight={280}
      emptyText="No sources found"
      footer={
        <div className="flex flex-col" style={{
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
          background: 'var(--token-bg-tertiary)',
        }}>
          {/* Index health bar */}
          <div style={{
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--token-border-subtle)',
          }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-1)' }}>
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                Index Health
              </span>
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                {indexedCount}/{sources.length} indexed
              </span>
            </div>
            <div style={{
              height: 3,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-bg-hover)',
              overflow: 'hidden',
              display: 'flex',
            }}>
              <div style={{
                width: `${(indexedCount / sources.length) * 100}%`,
                height: '100%',
                background: 'var(--token-success)',
                borderRadius: 'var(--token-radius-full)',
              }} />
              {errorCount > 0 && (
                <div style={{
                  width: `${(errorCount / sources.length) * 100}%`,
                  height: '100%',
                  background: 'var(--token-error)',
                }} />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center" style={{
            gap: 'var(--token-space-4)',
            padding: 'var(--token-space-2) var(--token-space-4)',
          }}>
            <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
              <HardDrive size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                {sources.length} sources
              </span>
            </div>
            <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
              <BookOpen size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                {totalChunks.toLocaleString()} chunks
              </span>
            </div>
            <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
              <Sparkles size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                text-3-small
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}

const defaultSources: KnowledgeSource[] = [
  { id: '1', name: 'Product Documentation', type: 'document', size: '2.4 MB', lastUpdated: '1 hour ago', status: 'indexed', chunks: 342, embeddingModel: 'text-3-small' },
  { id: '2', name: 'https://docs.example.com/api', type: 'url', size: '890 KB', lastUpdated: '3 hours ago', status: 'indexed', chunks: 128 },
  { id: '3', name: 'Customer Feedback DB', type: 'database', size: '12.1 MB', lastUpdated: '30 min ago', status: 'indexing', chunks: 1240 },
  { id: '4', name: 'Brand Guidelines v3.pdf', type: 'upload', size: '4.8 MB', lastUpdated: 'Yesterday', status: 'indexed', chunks: 86 },
  { id: '5', name: 'competitor-analysis.csv', type: 'upload', size: '320 KB', lastUpdated: '2 days ago', status: 'error' },
];

export function KnowledgeBaseDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%' }}>
      <KnowledgeBase />
    </div>
  );
}
