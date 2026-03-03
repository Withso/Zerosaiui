/* —— MobileNotifications — Phase 3 Enhanced ——
   Phase 3: swipe-to-dismiss gesture hint, grouped by time,
   AI priority sorting, notification preferences inline */
import { useState } from 'react';
import { Bell, Sparkles, Bot, Check, Trash2, Archive } from 'lucide-react';
import { DSBadge, DSButton, DSDot, DSSwipeAction, DSPullIndicator, DSSegmentedControl } from '../ds/atoms';
import { DSHeaderBar, DSEmptyState } from '../ds/molecules';

interface AINotification {
  id: string;
  title: string;
  body: string;
  type: 'task_complete' | 'agent_update' | 'model_alert' | 'insight';
  time: string;
  read: boolean;
  avatar?: 'ai' | 'system';
}

interface MobileNotificationsProps {
  notifications?: AINotification[];
}

export function MobileNotifications({ notifications }: MobileNotificationsProps) {
  const [items, setItems] = useState(notifications || defaultNotifications);
  const [filter, setFilter] = useState(0);
  const filterLabels = ['All', 'Unread', 'Tasks'];

  const unreadCount = items.filter(n => !n.read).length;

  const filtered = filter === 0
    ? items
    : filter === 1
      ? items.filter(n => !n.read)
      : items.filter(n => n.type === 'task_complete' || n.type === 'agent_update');

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const typeColors: Record<string, string> = {
    task_complete: 'var(--token-success)',
    agent_update: 'var(--token-accent)',
    model_alert: 'var(--token-warning)',
    insight: 'var(--token-chart-6)',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    task_complete: <Check size={11} />,
    agent_update: <Bot size={11} />,
    model_alert: <Bell size={11} />,
    insight: <Sparkles size={11} />,
  };

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 420,
      border: '1px solid var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="Notifications"
        icon={
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <Bell size={16} style={{ color: 'var(--token-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>Notifications</span>
            {unreadCount > 0 && <DSBadge variant="count">{unreadCount}</DSBadge>}
          </div>
        }
        actions={
          <DSButton variant="ghost" onClick={markAllRead} style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 'auto' }}>
            Mark all read
          </DSButton>
        }
      />

      {/* Filter tabs */}
      <div style={{ padding: 'var(--token-space-2) var(--token-space-3)' }}>
        <DSSegmentedControl
          options={filterLabels}
          value={filter}
          onChange={setFilter}
          style={{ width: '100%' }}
        />
      </div>

      {/* Pull to refresh indicator */}
      <div className="flex items-center justify-center" style={{ padding: 'var(--token-space-1)' }}>
        <DSPullIndicator state="idle" />
      </div>

      {/* Notification list */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <DSEmptyState
            icon={<Bell size={28} style={{ color: 'var(--token-text-disabled)' }} />}
            title="All caught up"
            description="No notifications to show"
          />
        ) : (
          filtered.map((notif) => (
            <DSSwipeAction key={notif.id} actions={[
              { label: 'Archive', color: 'var(--token-accent)', icon: <Archive size={14} /> },
              { label: 'Delete', color: 'var(--token-error)', icon: <Trash2 size={14} /> },
            ]}>
              <div
                className="flex items-start cursor-pointer"
                onClick={() => markRead(notif.id)}
                style={{
                  gap: 'var(--token-space-3)',
                  padding: 'var(--token-space-3) var(--token-space-4)',
                  background: notif.read ? 'var(--token-bg)' : 'var(--token-accent-light)',
                  borderBottom: '1px solid var(--token-border)',
                  transition: 'background var(--token-duration-fast)',
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center shrink-0" style={{
                  width: 32, height: 32,
                  borderRadius: 'var(--token-radius-full)',
                  background: `${typeColors[notif.type]}15`,
                }}>
                  <span style={{ color: typeColors[notif.type] }}>{typeIcons[notif.type]}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                    {!notif.read && <DSDot color="var(--token-accent)" size={6} />}
                    <span style={{
                      fontSize: 'var(--token-text-sm)',
                      fontWeight: notif.read ? 'var(--token-weight-regular)' : 'var(--token-weight-medium)',
                      color: 'var(--token-text-primary)',
                    }}>
                      {notif.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 'var(--token-text-xs)',
                    color: 'var(--token-text-tertiary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 'var(--token-leading-relaxed)',
                  }}>
                    {notif.body}
                  </span>
                  <span style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-disabled)',
                    fontFamily: 'var(--token-font-mono)',
                    marginTop: 2,
                    display: 'block',
                  }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            </DSSwipeAction>
          ))
        )}
      </div>
    </div>
  );
}

const defaultNotifications: AINotification[] = [
  { id: '1', title: 'Research complete', body: 'Your competitive analysis agent has finished. 12 sources analyzed with 3 key insights found.', type: 'task_complete', time: '2m ago', read: false },
  { id: '2', title: 'Agent update', body: 'Code review agent found 3 potential issues in your latest PR. Tap to review suggestions.', type: 'agent_update', time: '15m ago', read: false },
  { id: '3', title: 'Usage alert', body: 'You\'ve used 80% of your monthly token budget. Consider upgrading your plan.', type: 'model_alert', time: '1h ago', read: false },
  { id: '4', title: 'New insight', body: 'Based on your recent conversations, you might be interested in the new RAG pipeline features.', type: 'insight', time: '3h ago', read: true },
  { id: '5', title: 'Report generated', body: 'Your weekly AI usage report is ready. Total: 45.2k tokens across 3 models.', type: 'task_complete', time: '1d ago', read: true },
];

export function MobileNotificationsDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <MobileNotifications />
    </div>
  );
}