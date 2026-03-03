/* ChatHistory — Enhanced Chat History with forking, pinning, summarization
   Uses shared ListPanel composed from DS atoms/molecules
   Phase 3 enhancements:
   — Conversation forking indicators (branch icon + count)
   — Pinnable messages (star toggle, pinned section)
   — Summarize conversation action
   — Swipe-to-archive visual hint
   — Last-message agent avatar */
import { useState, useCallback } from 'react';
import { MessageSquare, GitBranch, Pin, Star, Sparkles, Archive, Trash2, MoreHorizontal } from 'lucide-react';
import { DSBadge, DSDot, DSButton } from '../ds/atoms';
import { ListPanel, type ListPanelItem } from './ListPanel';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: boolean;
  pinned?: boolean;
  branches?: number;
  messageCount?: number;
  agent?: string;
}

interface ChatHistoryProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSummarize?: () => void;
}

export function ChatHistory({
  conversations,
  activeId,
  onSelect,
  onNew,
  onPin,
  onArchive,
  onDelete,
  onSummarize,
}: ChatHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = useCallback(() => {
    setSummarizing(true);
    onSummarize?.();
    setTimeout(() => setSummarizing(false), 2000);
  }, [onSummarize]);

  const items: ListPanelItem[] = conversations.map(c => ({
    id: c.id,
    title: c.title,
    subtitle: c.preview,
    meta: c.time,
    icon: (
      <MessageSquare
        size={14}
        style={{ color: 'var(--token-text-tertiary)', marginTop: 2, flexShrink: 0 }}
      />
    ),
    dotColor: c.unread ? 'var(--token-accent)' : undefined,
    dotPulsing: c.unread,
    pinned: c.pinned,
    badge: c.branches && c.branches > 0 ? (
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-1)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}
      >
        <GitBranch size={10} />
        <span>{c.branches}</span>
      </div>
    ) : undefined,
  }));

  /* — Custom item renderer with hover actions — */
  const renderItem = (item: ListPanelItem, isActive: boolean) => {
    const conv = conversations.find(c => c.id === item.id);
    const isHovered = hoveredId === item.id;

    return (
      <div
        key={item.id}
        className="flex items-center relative"
        style={{
          padding: 'var(--token-space-2-5) var(--token-space-4)',
          gap: 'var(--token-space-3)',
          background: isActive
            ? 'var(--token-bg-hover)'
            : isHovered
            ? 'var(--token-bg-hover)'
            : 'transparent',
          borderBottom: '1px solid var(--token-border-subtle, var(--token-border))',
          cursor: 'pointer',
          transition: 'background var(--token-duration-fast) var(--token-ease-default)',
        }}
        onClick={() => onSelect?.(item.id)}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Icon */}
        <div style={{ flexShrink: 0 }}>
          {item.icon}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col" style={{ minWidth: 0, gap: 'var(--token-space-0-5)' }}>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <span
              className="truncate"
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-primary)',
                lineHeight: 'var(--token-leading-tight)',
              }}
            >
              {item.title}
            </span>
            {conv?.pinned && (
              <Star
                size={10}
                fill="var(--token-warning)"
                style={{ color: 'var(--token-warning)', flexShrink: 0 }}
              />
            )}
            {item.dotColor && (
              <DSDot color={item.dotColor} size={6} pulsing={item.dotPulsing} />
            )}
          </div>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <span
              className="truncate flex-1"
              style={{
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-tertiary)',
                lineHeight: 'var(--token-leading-tight)',
              }}
            >
              {item.subtitle}
            </span>
          </div>
        </div>

        {/* Meta + badge area */}
        <div className="flex flex-col items-end shrink-0" style={{ gap: 'var(--token-space-1)' }}>
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {item.meta}
          </span>
          {item.badge}
          {conv?.messageCount && (
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
              }}
            >
              {conv.messageCount} msgs
            </span>
          )}
        </div>

        {/* Hover actions overlay */}
        {isHovered && (
          <div
            className="flex items-center absolute"
            style={{
              right: 'var(--token-space-2)',
              top: '50%',
              transform: 'translateY(-50%)',
              gap: 'var(--token-space-0-5)',
              background: 'var(--token-bg)',
              borderRadius: 'var(--token-radius-sm)',
              boxShadow: 'var(--token-shadow-sm)',
              padding: 'var(--token-space-0-5)',
              animation: 'token-fade-in 100ms ease',
              zIndex: 5,
            }}
            onMouseEnter={() => setHoveredId(item.id)}
          >
            <DSButton
              variant="icon"
              icon={<Star size={11} fill={conv?.pinned ? 'var(--token-warning)' : 'none'} />}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onPin?.(item.id); }}
              title={conv?.pinned ? 'Unpin' : 'Pin'}
              style={{
                width: 22, height: 22,
                color: conv?.pinned ? 'var(--token-warning)' : 'var(--token-text-tertiary)',
              }}
            />
            <DSButton
              variant="icon"
              icon={<Archive size={11} />}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onArchive?.(item.id); }}
              title="Archive"
              style={{ width: 22, height: 22 }}
            />
            <DSButton
              variant="icon"
              icon={<Trash2 size={11} />}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete?.(item.id); }}
              title="Delete"
              style={{ width: 22, height: 22, color: 'var(--token-error)' }}
            />
          </div>
        )}
      </div>
    );
  };

  /* — Summarize button in footer — */
  const footer = (
    <div
      className="flex items-center justify-center"
      style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        borderTop: '1px solid var(--token-border)',
      }}
    >
      <button
        onClick={handleSummarize}
        disabled={summarizing || conversations.length === 0}
        className="flex items-center justify-center cursor-pointer"
        style={{
          gap: 'var(--token-space-1-5)',
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-border)',
          background: 'var(--token-bg)',
          color: summarizing ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
          fontSize: 'var(--token-text-2xs)',
          fontWeight: 'var(--token-weight-medium)',
          fontFamily: 'var(--token-font-sans)',
          transition: 'all var(--token-duration-fast) var(--token-ease-default)',
          opacity: conversations.length === 0 ? 0.5 : 1,
          width: '100%',
        }}
      >
        <Sparkles size={11} style={{ animation: summarizing ? 'token-pulse 1s ease infinite' : 'none' }} />
        {summarizing ? 'Summarizing...' : 'Summarize conversation'}
      </button>
    </div>
  );

  return (
    <ListPanel
      title="Chats"
      searchPlaceholder="Search chats..."
      items={items}
      activeId={activeId}
      onSelect={onSelect}
      onNew={onNew}
      emptyText="No conversations yet"
      showPinnedSection={conversations.some(c => c.pinned)}
      renderItem={renderItem}
      footer={footer}
    />
  );
}

const sampleConversations: Conversation[] = [
  { id: '1', title: 'Transformer architecture', preview: 'Can you explain self-attention?', time: '2m', unread: true, branches: 2, messageCount: 12, agent: 'GPT-4o' },
  { id: '2', title: 'React performance', preview: 'How to optimize re-renders in...', time: '1h', pinned: true, messageCount: 8 },
  { id: '3', title: 'API design patterns', preview: 'REST vs GraphQL comparison...', time: '3h', branches: 1, messageCount: 24 },
  { id: '4', title: 'Color theory for UI', preview: 'What makes a good color palette...', time: '1d', messageCount: 6 },
  { id: '5', title: 'Database optimization', preview: 'Indexing strategies for PostgreSQL...', time: '2d', pinned: true, messageCount: 15 },
];

export function ChatHistoryDemo() {
  const [convos, setConvos] = useState(sampleConversations);
  const [active, setActive] = useState('1');

  const handlePin = (id: string) => {
    setConvos(prev =>
      prev.map(c => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    );
  };

  const handleArchive = (id: string) => {
    setConvos(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ maxWidth: 320, width: '100%' }}>
      <ChatHistory
        conversations={convos}
        activeId={active}
        onSelect={setActive}
        onPin={handlePin}
        onArchive={handleArchive}
        onDelete={handleArchive}
      />
    </div>
  );
}