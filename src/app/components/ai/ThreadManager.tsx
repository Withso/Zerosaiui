/* —— ThreadManager — Phase 3 Enhanced — ListPanel variant —— */
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Pin, Archive, Trash2, Edit3, Check, X, MoreHorizontal } from 'lucide-react';
import { DSDot, DSBadge, DSButton } from '../ds/atoms';
import { ListPanel, type ListPanelItem } from './ListPanel';

/* —— Types —— */
interface Thread {
  id: string;
  title: string;
  preview: string;
  date: string;
  pinned?: boolean;
  unread?: boolean;
  messageCount?: number;
  archived?: boolean;
}

interface ThreadManagerProps {
  threads?: Thread[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  showArchived?: boolean;
}

export function ThreadManager({
  threads,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onPin,
  onArchive,
  onRename,
  showArchived = false,
}: ThreadManagerProps) {
  const [internalThreads, setInternalThreads] = useState(threads || defaultThreads);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [viewArchived, setViewArchived] = useState(showArchived);
  const renameRef = useRef<HTMLInputElement>(null);

  const data = internalThreads.filter(t => viewArchived ? t.archived : !t.archived);

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  /* —— Handlers —— */
  const handlePin = (id: string) => {
    setInternalThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
    onPin?.(id);
    setContextMenuId(null);
  };

  const handleArchive = (id: string) => {
    setInternalThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, archived: !t.archived } : t))
    );
    onArchive?.(id);
    setContextMenuId(null);
  };

  const handleDelete = (id: string) => {
    setInternalThreads(prev => prev.filter(t => t.id !== id));
    onDelete?.(id);
    setContextMenuId(null);
  };

  const startRename = (id: string) => {
    const thread = internalThreads.find(t => t.id === id);
    if (thread) {
      setRenamingId(id);
      setRenameValue(thread.title);
      setContextMenuId(null);
    }
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      setInternalThreads(prev =>
        prev.map(t => (t.id === renamingId ? { ...t, title: renameValue.trim() } : t))
      );
      onRename?.(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  /* —— Build list items —— */
  const items: ListPanelItem[] = data.map(t => ({
    id: t.id,
    title: t.title,
    subtitle: t.preview,
    meta: t.date,
    icon: <MessageSquare size={14} style={{ color: 'var(--token-text-tertiary)', marginTop: 2, flexShrink: 0 }} />,
    dotColor: t.unread ? 'var(--token-accent)' : undefined,
    pinned: t.pinned,
    badge: t.messageCount ? (
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
      }}>
        {t.messageCount} msgs
      </span>
    ) : undefined,
  }));

  /* —— Archive count for tab switcher —— */
  const archivedCount = internalThreads.filter(t => t.archived).length;
  const activeCount = internalThreads.filter(t => !t.archived).length;

  return (
    <div className="flex flex-col" style={{ width: '100%' }}>
      {/* Tab switcher — Active vs Archived */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-1)',
          marginBottom: 'var(--token-space-2)',
        }}
      >
        {[
          { label: 'Active', count: activeCount, isActive: !viewArchived },
          { label: 'Archived', count: archivedCount, isActive: viewArchived },
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => setViewArchived(tab.isActive ? viewArchived : !viewArchived)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-2-5)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${tab.isActive ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: tab.isActive ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: tab.isActive ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Inline rename overlay */}
      {renamingId && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            marginBottom: 'var(--token-space-2)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-accent)',
            background: 'var(--token-bg-hover)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <Edit3 size={12} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
          <input
            ref={renameRef}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') confirmRename();
              if (e.key === 'Escape') cancelRename();
            }}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-primary)',
            }}
          />
          <button
            onClick={confirmRename}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 22, height: 22, borderRadius: 'var(--token-radius-sm)',
              border: 'none', background: 'var(--token-success-light)',
              color: 'var(--token-success)', padding: 0,
            }}
          >
            <Check size={12} />
          </button>
          <button
            onClick={cancelRename}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 22, height: 22, borderRadius: 'var(--token-radius-sm)',
              border: 'none', background: 'var(--token-bg-tertiary)',
              color: 'var(--token-text-tertiary)', padding: 0,
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Context menu */}
      {contextMenuId && (
        <div
          style={{
            marginBottom: 'var(--token-space-2)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg)',
            boxShadow: 'var(--token-shadow-md)',
            overflow: 'hidden',
            animation: 'token-fade-in 120ms ease',
          }}
        >
          {[
            { icon: <Edit3 size={12} />, label: 'Rename', action: () => startRename(contextMenuId), color: 'var(--token-text-secondary)' },
            { icon: <Pin size={12} />, label: internalThreads.find(t => t.id === contextMenuId)?.pinned ? 'Unpin' : 'Pin', action: () => handlePin(contextMenuId), color: 'var(--token-text-secondary)' },
            { icon: <Archive size={12} />, label: viewArchived ? 'Unarchive' : 'Archive', action: () => handleArchive(contextMenuId), color: 'var(--token-text-secondary)' },
            { icon: <Trash2 size={12} />, label: 'Delete', action: () => handleDelete(contextMenuId), color: 'var(--token-error)' },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center w-full cursor-pointer"
              style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--token-font-sans)',
                fontSize: 'var(--token-text-xs)',
                color: item.color,
                textAlign: 'left',
                transition: 'background var(--token-duration-fast)',
                borderBottom: i < 3 ? '1px solid var(--token-border-subtle)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setContextMenuId(null)}
            className="flex items-center justify-center w-full cursor-pointer"
            style={{
              padding: 'var(--token-space-1-5)',
              border: 'none',
              background: 'var(--token-bg-secondary)',
              fontFamily: 'var(--token-font-mono)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
            }}
          >
            Close
          </button>
        </div>
      )}

      <ListPanel
        title={viewArchived ? 'Archived' : 'Threads'}
        searchPlaceholder="Search threads..."
        items={items}
        activeId={activeId || data[0]?.id}
        onSelect={(id) => {
          if (contextMenuId === id) {
            setContextMenuId(null);
          } else {
            onSelect?.(id);
          }
        }}
        onNew={viewArchived ? undefined : onNew}
        showPinnedSection={!viewArchived}
        maxHeight={340}
        emptyText={viewArchived ? 'No archived threads' : 'No threads found'}
        headerActions={
          <button
            onClick={() => {
              const firstId = data[0]?.id;
              if (firstId) setContextMenuId(contextMenuId ? null : firstId);
            }}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 24, height: 24, borderRadius: 'var(--token-radius-sm)',
              border: 'none', background: 'transparent',
              color: 'var(--token-text-disabled)', padding: 0,
              transition: 'background var(--token-duration-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            title="Thread actions"
          >
            <MoreHorizontal size={14} />
          </button>
        }
      />
    </div>
  );
}

const defaultThreads: Thread[] = [
  { id: '1', title: 'Build a dashboard', preview: 'Create a React dashboard with charts and...', date: 'Today', pinned: true, unread: true, messageCount: 24 },
  { id: '2', title: 'API integration help', preview: 'How to connect to the Stripe API with...', date: 'Today', pinned: true, messageCount: 12 },
  { id: '3', title: 'Debug memory leak', preview: 'My React app has a memory leak in the...', date: 'Yesterday', unread: true, messageCount: 8 },
  { id: '4', title: 'Write unit tests', preview: 'Generate Jest tests for the auth module...', date: 'Yesterday', messageCount: 15 },
  { id: '5', title: 'Database schema design', preview: 'Design a PostgreSQL schema for a multi-...', date: '2 days ago', messageCount: 6 },
  { id: '6', title: 'Old brainstorm session', preview: 'Exploring ideas for the new feature...', date: '1 week ago', archived: true, messageCount: 32 },
];

export function ThreadManagerDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 320, width: '100%', gap: 'var(--token-space-3)' }}>
      <ThreadManager onSelect={(id) => setSelected(id)} />
      {selected && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-accent)',
          background: 'var(--token-bg-hover)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-secondary)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Opened thread: {selected}
        </div>
      )}
    </div>
  );
}
