/* MemoryManager — Enhanced with inferred memories (approve/reject) + temporary toggle
   Composed from ListPanel + DS atoms/molecules
   Phase 3: AI-suggested memories, session-only toggle, approve/reject flow */
import { useState } from 'react';
import { Brain, Trash2, Edit3, Check, X, Clock, Sparkles, Timer } from 'lucide-react';
import { DSButton, DSBadge, DSInput } from '../ds/atoms';
import { ListPanel, type ListPanelItem } from './ListPanel';

interface MemoryItem {
  id: string;
  content: string;
  source: string;
  date: string;
  category?: string;
  inferred?: boolean;
  temporary?: boolean;
}

interface MemoryManagerProps {
  memories?: MemoryItem[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
  onAdd?: (content: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function MemoryManager({
  memories: controlledMemories,
  onDelete,
  onEdit,
  onApprove,
  onReject,
}: MemoryManagerProps) {
  const [memories, setMemories] = useState(controlledMemories || defaultMemories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    onDelete?.(id);
  };

  const startEdit = (mem: MemoryItem) => {
    setEditingId(mem.id);
    setEditText(mem.content);
  };

  const saveEdit = () => {
    if (editingId) {
      setMemories(prev => prev.map(m => (m.id === editingId ? { ...m, content: editText } : m)));
      onEdit?.(editingId, editText);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleApprove = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, inferred: false, source: 'approved' } : m));
    onApprove?.(id);
  };

  const handleReject = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    onReject?.(id);
  };

  const toggleTemporary = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, temporary: !m.temporary } : m));
  };

  const inferredCount = memories.filter(m => m.inferred).length;

  const items: ListPanelItem[] = memories.map(mem => ({
    id: mem.id,
    title: mem.content,
    subtitle: `${mem.date} · via ${mem.source}`,
    badge: mem.category ? <DSBadge variant="ai">{mem.category}</DSBadge> : undefined,
  }));

  return (
    <ListPanel
      title="Memory"
      headerIcon={<Brain size={14} style={{ color: 'var(--token-text-tertiary)' }} />}
      headerActions={
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {inferredCount > 0 && (
            <DSBadge variant="ai" icon={<Sparkles size={8} />}>
              {inferredCount} suggested
            </DSBadge>
          )}
          <DSBadge variant="default">{`${memories.length} items`}</DSBadge>
        </div>
      }
      searchPlaceholder="Search memories..."
      items={items}
      maxHeight={360}
      emptyText="No memories stored"
      renderItem={(item) => {
        const mem = memories.find(m => m.id === item.id);
        if (!mem) return null;
        const isEditing = editingId === mem.id;
        const isInferred = mem.inferred;

        return (
          <div
            key={mem.id}
            className="flex"
            style={{
              gap: 'var(--token-space-3)',
              padding: 'var(--token-space-3) var(--token-space-4)',
              borderBottom: '1px solid var(--token-border-subtle, var(--token-border))',
              background: isInferred ? 'var(--token-accent-muted, rgba(79,109,128,0.06))' : 'transparent',
              borderLeft: isInferred ? '3px solid var(--token-accent)' : '3px solid transparent',
            }}
          >
            <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-1)', minWidth: 0 }}>
              {isEditing ? (
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                  <DSInput
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    state="focus"
                    style={{ minWidth: 0, flex: 1 }}
                  />
                  <DSButton variant="primary" icon={<Check size={11} />} onClick={saveEdit}
                    style={{ width: 22, height: 22, padding: 0, borderRadius: 'var(--token-radius-sm)', background: 'var(--token-success)' }} />
                  <DSButton variant="secondary" icon={<X size={11} />} onClick={cancelEdit}
                    style={{ width: 22, height: 22, padding: 0, borderRadius: 'var(--token-radius-sm)' }} />
                </div>
              ) : (
                <div className="flex items-start" style={{ gap: 'var(--token-space-2)' }}>
                  {isInferred && <Sparkles size={12} style={{ color: 'var(--token-accent)', flexShrink: 0, marginTop: 2 }} />}
                  <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', lineHeight: 'var(--token-leading-normal)' }}>
                    {mem.content}
                  </span>
                </div>
              )}
              <div className="flex items-center flex-wrap" style={{ gap: 'var(--token-space-2)' }}>
                {mem.category && <DSBadge variant="ai">{mem.category}</DSBadge>}
                {mem.temporary && (
                  <DSBadge variant="warning" icon={<Timer size={8} />}>session-only</DSBadge>
                )}
                {isInferred && (
                  <DSBadge variant="default" icon={<Sparkles size={8} />}>suggested</DSBadge>
                )}
                <span className="flex items-center" style={{ gap: 'var(--token-space-1)', fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
                  <Clock size={9} />{mem.date}
                </span>
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
                  via {mem.source}
                </span>
              </div>
              {/* Approve/Reject bar for inferred memories */}
              {isInferred && !isEditing && (
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginTop: 'var(--token-space-1)' }}>
                  <DSButton
                    variant="primary"
                    icon={<Check size={10} />}
                    onClick={() => handleApprove(mem.id)}
                    style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 22 }}
                  >
                    Remember
                  </DSButton>
                  <DSButton
                    variant="ghost"
                    icon={<X size={10} />}
                    onClick={() => handleReject(mem.id)}
                    style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 22 }}
                  >
                    Dismiss
                  </DSButton>
                </div>
              )}
            </div>
            {!isEditing && !isInferred && (
              <div className="flex items-start shrink-0" style={{ gap: 'var(--token-space-0-5)' }}>
                <DSButton variant="ghost" icon={<Timer size={11} />} onClick={() => toggleTemporary(mem.id)}
                  title={mem.temporary ? 'Make permanent' : 'Make session-only'}
                  style={{
                    width: 24, height: 24, padding: 0, borderRadius: 'var(--token-radius-sm)',
                    color: mem.temporary ? 'var(--token-warning)' : undefined,
                  }} />
                <DSButton variant="ghost" icon={<Edit3 size={11} />} onClick={() => startEdit(mem)}
                  style={{ width: 24, height: 24, padding: 0, borderRadius: 'var(--token-radius-sm)' }} />
                <DSButton variant="ghost" icon={<Trash2 size={11} />} onClick={() => handleDelete(mem.id)}
                  style={{ width: 24, height: 24, padding: 0, borderRadius: 'var(--token-radius-sm)' }} />
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

const defaultMemories: MemoryItem[] = [
  { id: '1', content: 'Prefers TypeScript over JavaScript for all projects.', source: 'conversation', date: '2 days ago', category: 'preference' },
  { id: '2', content: 'Working on a Figma AI UI Kit with 26+ components.', source: 'context', date: '1 day ago', category: 'project' },
  { id: '3', content: 'Uses Tailwind CSS v4 with design tokens pattern.', source: 'conversation', date: 'Today', category: 'tech' },
  { id: '4', content: 'Prefers Geist-inspired, minimal design aesthetic.', source: 'inferred', date: 'Today', category: 'preference' },
  { id: '5', content: 'You seem to prefer Python for data analysis tasks.', source: 'inferred', date: 'Just now', category: 'preference', inferred: true },
  { id: '6', content: 'Your team uses Linear for project management.', source: 'inferred', date: 'Just now', category: 'tool', inferred: true },
];

export function MemoryManagerDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-2)' }}>
      <MemoryManager />
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
        textAlign: 'center',
      }}>
        Edit, delete, approve/reject suggested memories, toggle session-only
      </span>
    </div>
  );
}
