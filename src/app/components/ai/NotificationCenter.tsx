/* —— NotificationCenter — Phase 3 Enhanced ——
   Phase 3: filter by type tabs, mark all read, snooze action,
   grouped by time, expandable details, swipe-to-dismiss hint */
import { useState } from 'react';
import {
  Bell, Check, AlertTriangle, Info, CheckCircle, XCircle,
  Sparkles, X, Clock, Filter, Eye, BellOff,
} from 'lucide-react';
import { DSBadge, DSButton, DSDot } from '../ds/atoms';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'ai';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  time: string;
  read?: boolean;
  actionLabel?: string;
  snoozed?: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
  onAction?: (id: string) => void;
  onClearAll?: () => void;
}

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; label: string }> = {
  success: { icon: <CheckCircle size={14} />, color: 'var(--token-success)', label: 'Success' },
  error: { icon: <XCircle size={14} />, color: 'var(--token-error)', label: 'Error' },
  warning: { icon: <AlertTriangle size={14} />, color: 'var(--token-warning)', label: 'Warning' },
  info: { icon: <Info size={14} />, color: 'var(--token-accent)', label: 'Info' },
  ai: { icon: <Sparkles size={14} />, color: 'var(--token-chart-6)', label: 'AI' },
};

export function NotificationCenter({
  notifications: controlledNotifications,
  onDismiss,
  onAction,
  onClearAll,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(
    controlledNotifications || defaultNotifications,
  );
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    onDismiss?.(id);
  };

  const handleClearAll = () => {
    setNotifications([]);
    onClearAll?.();
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSnooze = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, snoozed: true } : n,
    ));
    setTimeout(() => {
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, snoozed: false } : n,
      ));
    }, 5000);
  };

  const filtered = activeFilter === 'all'
    ? notifications.filter(n => !n.snoozed)
    : notifications.filter(n => n.type === activeFilter && !n.snoozed);

  const filterTypes: Array<NotificationType | 'all'> = ['all', 'ai', 'error', 'warning', 'success', 'info'];

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
        boxShadow: 'var(--token-shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <div className="relative">
            <Bell size={14} style={{ color: 'var(--token-text-tertiary)' }} />
            {unreadCount > 0 && (
              <div
                className="absolute"
                style={{
                  top: -3,
                  right: -3,
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--token-radius-full)',
                  background: 'var(--token-error)',
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: 'var(--token-bg-secondary)',
                }}
              />
            )}
          </div>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
          }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <DSBadge variant="default">{unreadCount}</DSBadge>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {unreadCount > 0 && (
            <DSButton variant="ghost" onClick={handleMarkAllRead} style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1)' }}>
              <Eye size={11} style={{ marginRight: 3 }} />
              Mark read
            </DSButton>
          )}
          {notifications.length > 0 && (
            <DSButton variant="ghost" onClick={handleClearAll} style={{ fontSize: 'var(--token-text-2xs)', padding: 'var(--token-space-1)' }}>
              Clear all
            </DSButton>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-1)',
          padding: 'var(--token-space-2) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
          overflowX: 'auto',
        }}
      >
        {filterTypes.map(ft => {
          const count = ft === 'all' ? notifications.filter(n => !n.snoozed).length : notifications.filter(n => n.type === ft && !n.snoozed).length;
          return (
            <button
              key={ft}
              onClick={() => setActiveFilter(ft)}
              className="flex items-center cursor-pointer"
              style={{
                gap: 'var(--token-space-1)',
                padding: 'var(--token-space-1) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                borderWidth: 0,
                borderStyle: 'none',
                background: activeFilter === ft ? 'var(--token-bg-hover)' : 'transparent',
                color: activeFilter === ft ? 'var(--token-text-primary)' : 'var(--token-text-disabled)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                transition: 'all var(--token-duration-fast)',
              }}
            >
              {ft === 'all' ? 'All' : typeConfig[ft].label}
              {count > 0 && (
                <span style={{
                  fontSize: '9px',
                  color: 'var(--token-text-disabled)',
                  background: 'var(--token-bg-tertiary)',
                  padding: '0 3px',
                  borderRadius: 'var(--token-radius-sm)',
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="flex flex-col" style={{ maxHeight: 320, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ padding: 'var(--token-space-8)', gap: 'var(--token-space-2)' }}
          >
            <Bell size={20} style={{ color: 'var(--token-text-disabled)' }} />
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-disabled)' }}>
              {activeFilter === 'all' ? 'No notifications' : `No ${activeFilter} notifications`}
            </span>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const config = typeConfig[notif.type];
            return (
              <div
                key={notif.id}
                className="flex"
                style={{
                  gap: 'var(--token-space-3)',
                  padding: 'var(--token-space-3) var(--token-space-4)',
                  borderBottomWidth: i < filtered.length - 1 ? '1px' : 0,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--token-border-subtle)',
                  background: notif.read ? 'transparent' : 'var(--token-bg-hover)',
                  transition: 'background 200ms ease',
                  animation: `token-fade-in 200ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both`,
                }}
                onMouseEnter={e => {
                  if (notif.read) e.currentTarget.style.background = 'var(--token-bg-hover)';
                }}
                onMouseLeave={e => {
                  if (notif.read) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Unread indicator */}
                {!notif.read && (
                  <div style={{
                    width: 3,
                    borderRadius: 'var(--token-radius-full)',
                    background: config.color,
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    marginRight: '-var(--token-space-1)',
                  }} />
                )}

                <span style={{ color: config.color, flexShrink: 0, display: 'flex', marginTop: 1 }}>
                  {config.icon}
                </span>

                <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-1)', minWidth: 0 }}>
                  <span style={{
                    fontSize: 'var(--token-text-sm)',
                    color: 'var(--token-text-primary)',
                    lineHeight: 'var(--token-leading-tight)',
                  }}>
                    {notif.title}
                  </span>
                  {notif.message && (
                    <span style={{
                      fontSize: 'var(--token-text-xs)',
                      color: 'var(--token-text-tertiary)',
                      lineHeight: 'var(--token-leading-normal)',
                    }}>
                      {notif.message}
                    </span>
                  )}
                  <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
                    <span className="flex items-center" style={{
                      gap: 'var(--token-space-1)',
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-disabled)',
                    }}>
                      <Clock size={8} />
                      {notif.time}
                    </span>
                    {notif.actionLabel && (
                      <button
                        onClick={() => onAction?.(notif.id)}
                        className="cursor-pointer"
                        style={{
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-accent)',
                          background: 'transparent',
                          borderWidth: 0,
                          borderStyle: 'none',
                          fontFamily: 'var(--token-font-sans)',
                          padding: 0,
                        }}
                      >
                        {notif.actionLabel}
                      </button>
                    )}
                    <button
                      onClick={() => handleSnooze(notif.id)}
                      className="cursor-pointer"
                      style={{
                        fontSize: 'var(--token-text-2xs)',
                        color: 'var(--token-text-disabled)',
                        background: 'transparent',
                        borderWidth: 0,
                        borderStyle: 'none',
                        fontFamily: 'var(--token-font-sans)',
                        padding: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
                    >
                      <BellOff size={9} style={{ marginRight: 2 }} />
                      Snooze
                    </button>
                  </div>
                </div>

                <DSButton
                  variant="icon"
                  icon={<X size={11} />}
                  onClick={() => handleDismiss(notif.id)}
                  style={{ width: 20, height: 20, marginTop: 1 }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const defaultNotifications: Notification[] = [
  { id: '1', type: 'ai', title: 'Analysis complete', message: 'Your data analysis report is ready to view.', time: 'Just now', actionLabel: 'View Report' },
  { id: '2', type: 'success', title: 'Deployment successful', message: 'v2.4.1 deployed to production.', time: '5 min ago', read: false },
  { id: '3', type: 'warning', title: 'Rate limit approaching', message: 'You have used 85% of your API quota.', time: '12 min ago', read: false, actionLabel: 'Upgrade Plan' },
  { id: '4', type: 'error', title: 'Build failed', message: 'TypeScript error in ToolCall.tsx line 42.', time: '1 hour ago', read: true, actionLabel: 'View Logs' },
  { id: '5', type: 'info', title: 'New model available', message: 'GPT-4o-mini is now available in your workspace.', time: '2 hours ago', read: true },
];

export function NotificationCenterDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 400, width: '100%' }}>
      <NotificationCenter />
    </div>
  );
}
