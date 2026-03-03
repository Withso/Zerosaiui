import {
  Info, AlertTriangle, Shield, Settings, X, Copy, Check,
  ChevronDown, Clock, Eye, EyeOff, Pencil,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
type SystemMessageVariant = 'info' | 'warning' | 'context' | 'config' | 'error' | 'success';

interface SystemMessageProps {
  variant?: SystemMessageVariant;
  title?: string;
  content: string;
  timestamp?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCopy?: () => void;
  actions?: { label: string; onClick: () => void }[];
}

/* —— Variant config —— */
const variantConfig: Record<SystemMessageVariant, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  borderColor: string;
}> = {
  info: {
    icon: <Info size={14} />,
    label: 'Info',
    color: 'var(--token-accent)',
    bg: 'color-mix(in srgb, var(--token-accent) 5%, transparent)',
    borderColor: 'color-mix(in srgb, var(--token-accent) 20%, var(--token-border))',
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    label: 'Warning',
    color: 'var(--token-warning)',
    bg: 'color-mix(in srgb, var(--token-warning) 5%, transparent)',
    borderColor: 'color-mix(in srgb, var(--token-warning) 20%, var(--token-border))',
  },
  error: {
    icon: <AlertTriangle size={14} />,
    label: 'Error',
    color: 'var(--token-error)',
    bg: 'color-mix(in srgb, var(--token-error) 5%, transparent)',
    borderColor: 'color-mix(in srgb, var(--token-error) 20%, var(--token-border))',
  },
  success: {
    icon: <Check size={14} />,
    label: 'Success',
    color: 'var(--token-success)',
    bg: 'color-mix(in srgb, var(--token-success) 5%, transparent)',
    borderColor: 'color-mix(in srgb, var(--token-success) 20%, var(--token-border))',
  },
  context: {
    icon: <Shield size={14} />,
    label: 'System',
    color: 'var(--token-accent)',
    bg: 'color-mix(in srgb, var(--token-accent) 4%, transparent)',
    borderColor: 'color-mix(in srgb, var(--token-accent) 15%, var(--token-border))',
  },
  config: {
    icon: <Settings size={14} />,
    label: 'Config',
    color: 'var(--token-text-tertiary)',
    bg: 'var(--token-bg-secondary)',
    borderColor: 'var(--token-border)',
  },
};

export function SystemMessage({
  variant = 'info', title, content, timestamp, dismissible = false,
  onDismiss, collapsible = false, defaultCollapsed = false,
  onCopy, actions,
}: SystemMessageProps) {
  const cfg = variantConfig[variant];
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (dismissed) return null;

  const handleCopy = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = content;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch { /* noop */ }
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const displayTitle = title || cfg.label;
  const isLongContent = content.length > 120;

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: cfg.borderColor,
        borderRadius: 'var(--token-radius-lg)',
        background: cfg.bg,
        overflow: 'hidden',
        transition: 'box-shadow var(--token-duration-normal) var(--token-ease-default)',
        boxShadow: hovered ? 'var(--token-shadow-sm)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* —— Header row —— */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={collapsible ? () => setCollapsed(!collapsed) : undefined}
      >
        {/* Left accent bar */}
        <div style={{
          width: 3,
          height: 16,
          borderRadius: 'var(--token-radius-full)',
          background: cfg.color,
          flexShrink: 0,
        }} />

        {/* Icon */}
        <span style={{ color: cfg.color, display: 'flex', flexShrink: 0 }}>
          {cfg.icon}
        </span>

        {/* Title */}
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-xs)',
            fontWeight: 'var(--token-weight-medium)',
            color: cfg.color,
          }}
        >
          {displayTitle}
        </span>

        {/* Timestamp */}
        {timestamp && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            flexShrink: 0,
          }}>
            {timestamp}
          </span>
        )}

        {/* Copy (on hover) */}
        {hovered && (
          <DSButton
            variant="icon"
            icon={copied ? <Check size={10} /> : <Copy size={10} />}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCopy(); }}
            style={{
              width: 22, height: 22,
              color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)',
            }}
          />
        )}

        {/* Collapsible chevron */}
        {collapsible && (
          <ChevronDown
            size={12}
            style={{
              color: 'var(--token-text-disabled)',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)',
              transition: 'transform var(--token-duration-normal)',
              flexShrink: 0,
            }}
          />
        )}

        {/* Dismiss */}
        {dismissible && (
          <DSButton
            variant="icon"
            icon={<X size={10} />}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDismiss(); }}
            style={{
              width: 20, height: 20,
              color: 'var(--token-text-disabled)',
            }}
          />
        )}
      </div>

      {/* —— Content —— */}
      {!collapsed && (
        <div
          style={{
            padding: '0 var(--token-space-3) var(--token-space-2-5) var(--token-space-3)',
            paddingLeft: 'calc(var(--token-space-3) + 3px + var(--token-space-2) + 14px + var(--token-space-2))',
            animation: collapsible ? 'token-fade-in 150ms ease' : undefined,
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: variant === 'context' ? 'var(--token-text-secondary)' : 'var(--token-text-primary)',
            lineHeight: 'var(--token-leading-relaxed)',
            fontStyle: variant === 'context' ? 'italic' : 'normal',
            fontFamily: variant === 'config' ? 'var(--token-font-mono)' : 'var(--token-font-sans)',
          }}>
            {content}
          </span>
        </div>
      )}

      {/* —— Actions —— */}
      {!collapsed && actions && actions.length > 0 && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-1-5) var(--token-space-3)',
            paddingLeft: 'calc(var(--token-space-3) + 3px + var(--token-space-2) + 14px + var(--token-space-2))',
          }}
        >
          {actions.map((action, i) => (
            <DSButton
              key={i}
              variant="ghost"
              onClick={action.onClick}
              style={{
                fontSize: 'var(--token-text-2xs)',
                padding: 'var(--token-space-0-5) var(--token-space-2)',
                color: cfg.color,
              }}
            >
              {action.label}
            </DSButton>
          ))}
        </div>
      )}
    </div>
  );
}

/* —— Demo —— */
export function SystemMessageDemo() {
  const allMessages: {
    variant: SystemMessageVariant;
    title?: string;
    content: string;
    timestamp?: string;
    collapsible?: boolean;
    dismissible?: boolean;
    actions?: { label: string; onClick: () => void }[];
  }[] = [
    {
      variant: 'context',
      title: 'System Prompt',
      content: 'You are a helpful coding assistant. Always provide working examples with TypeScript. Prefer functional patterns over class-based approaches.',
      timestamp: 'Session start',
      collapsible: true,
    },
    {
      variant: 'info',
      content: 'Context updated. The AI will now respond with code examples in TypeScript.',
      timestamp: '2s ago',
      dismissible: true,
    },
    {
      variant: 'warning',
      title: 'Rate Limit',
      content: 'You have 3 requests remaining in the current window. Resets in 45 seconds.',
      dismissible: true,
      actions: [{ label: 'View usage', onClick: () => {} }],
    },
    {
      variant: 'config',
      content: 'Temperature: 0.7 \u00b7 Max tokens: 4,096 \u00b7 Top-p: 0.95 \u00b7 Model: GPT-4o',
      timestamp: 'Active',
      collapsible: true,
      actions: [{ label: 'Edit config', onClick: () => {} }],
    },
    {
      variant: 'error',
      title: 'Connection Lost',
      content: 'Unable to reach the API server. Retrying in 10 seconds...',
      dismissible: true,
      actions: [{ label: 'Retry now', onClick: () => {} }],
    },
    {
      variant: 'success',
      content: 'Model switched to Claude 3.5 Sonnet successfully.',
      timestamp: 'Just now',
      dismissible: true,
    },
  ];

  const [visible, setVisible] = useState(allMessages.map(() => true));
  const dismissedCount = visible.filter(v => !v).length;

  const handleDismiss = (idx: number) => {
    setVisible(prev => prev.map((v, i) => i === idx ? false : v));
  };

  const handleReset = () => {
    setVisible(allMessages.map(() => true));
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2-5)', maxWidth: 460, width: '100%' }}>
      {allMessages.map((msg, i) => visible[i] && (
        <div key={i} style={{ animation: 'token-fade-in 200ms ease' }}>
          <SystemMessage
            variant={msg.variant}
            title={msg.title}
            content={msg.content}
            timestamp={msg.timestamp}
            collapsible={msg.collapsible}
            dismissible={msg.dismissible}
            onDismiss={() => handleDismiss(i)}
            actions={msg.actions}
          />
        </div>
      ))}
      {dismissedCount > 0 && (
        <div className="flex items-center justify-between" style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'var(--token-border)',
          animation: 'token-fade-in 200ms ease',
        }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
            {dismissedCount} dismissed
          </span>
          <button
            onClick={handleReset}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none', textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            restore all
          </button>
        </div>
      )}
    </div>
  );
}
