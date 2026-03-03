/* —— MCPConnector — Phase 3 Enhanced ——
   Phase 3: granular permissions per connector, expandable tool list,
   health indicator, last sync time, search/filter connectors */
import { useState } from 'react';
import {
  Plug, Check, X, ExternalLink, Database, Globe, FileText,
  GitBranch, Mail, Calendar, ChevronDown, ChevronUp, Search,
  Shield, RefreshCw, Clock, AlertCircle,
} from 'lucide-react';
import { DSToggle, DSBadge, DSCheckbox } from '../ds/atoms';

type ConnectorStatus = 'connected' | 'disconnected' | 'error';

interface ConnectorPermission {
  id: string;
  label: string;
  enabled: boolean;
}

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ConnectorStatus;
  tools?: number;
  lastSync?: string;
  permissions?: ConnectorPermission[];
}

interface MCPConnectorProps {
  connectors?: Connector[];
  onToggle?: (id: string, enabled: boolean) => void;
  onConfigure?: (id: string) => void;
}

export function MCPConnector({
  connectors: controlledConnectors,
  onToggle,
  onConfigure,
}: MCPConnectorProps) {
  const [connectors, setConnectors] = useState(controlledConnectors || defaultConnectors);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (id: string) => {
    setConnectors(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'connected' ? 'disconnected' as ConnectorStatus : 'connected' as ConnectorStatus }
          : c,
      ),
    );
    const current = connectors.find(c => c.id === id);
    onToggle?.(id, current?.status !== 'connected');
  };

  const togglePermission = (connectorId: string, permId: string) => {
    setConnectors(prev =>
      prev.map(c =>
        c.id === connectorId
          ? {
              ...c,
              permissions: c.permissions?.map(p =>
                p.id === permId ? { ...p, enabled: !p.enabled } : p,
              ),
            }
          : c,
      ),
    );
  };

  const statusColor: Record<ConnectorStatus, string> = {
    connected: 'var(--token-success)',
    disconnected: 'var(--token-text-disabled)',
    error: 'var(--token-error)',
  };

  const filtered = searchQuery
    ? connectors.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : connectors;

  const activeCount = connectors.filter(c => c.status === 'connected').length;
  const errorCount = connectors.filter(c => c.status === 'error').length;

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
      }}
    >
      {/* Header */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <Plug size={14} style={{ color: 'var(--token-text-tertiary)' }} />
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
          }}
        >
          MCP Connectors
        </span>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {errorCount > 0 && (
            <DSBadge variant="error" style={{ fontSize: '9px', padding: '0 4px' }}>
              {errorCount} error
            </DSBadge>
          )}
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-success)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {activeCount} active
          </span>
        </div>
      </div>

      {/* Search */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2) var(--token-space-4)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
        }}
      >
        <Search size={12} style={{ color: 'var(--token-text-disabled)' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter connectors..."
          style={{
            flex: 1,
            borderWidth: 0,
            borderStyle: 'none',
            background: 'transparent',
            fontSize: 'var(--token-text-xs)',
            fontFamily: 'var(--token-font-sans)',
            color: 'var(--token-text-primary)',
            outline: 'none',
          }}
        />
      </div>

      {/* Connector list */}
      <div className="flex flex-col">
        {filtered.map((conn, i) => {
          const isConnected = conn.status === 'connected';
          const isError = conn.status === 'error';
          const isExpanded = expandedId === conn.id;

          return (
            <div key={conn.id}>
              <div
                className="flex items-center"
                style={{
                  gap: 'var(--token-space-3)',
                  padding: 'var(--token-space-3) var(--token-space-4)',
                  borderBottomWidth: (i < filtered.length - 1 && !isExpanded) ? '1px' : 0,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--token-border-subtle)',
                  transition: 'background var(--token-duration-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--token-radius-md)',
                    background: 'var(--token-bg-tertiary)',
                    color: isConnected ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)',
                  }}
                >
                  {conn.icon}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-0-5)', minWidth: 0 }}>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <span style={{
                      fontSize: 'var(--token-text-sm)',
                      color: isConnected ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                    }}>
                      {conn.name}
                    </span>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: 'var(--token-radius-full)',
                      background: statusColor[conn.status],
                      animation: isError ? 'token-pulse 1.5s ease-in-out infinite' : undefined,
                    }} />
                    {isError && (
                      <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)' }}>
                        Error
                      </span>
                    )}
                  </div>
                  <span className="truncate" style={{
                    fontSize: 'var(--token-text-xs)',
                    color: 'var(--token-text-tertiary)',
                  }}>
                    {conn.description}
                  </span>
                  {isConnected && (
                    <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
                      {conn.tools && (
                        <span style={{
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-text-disabled)',
                          fontFamily: 'var(--token-font-mono)',
                        }}>
                          {conn.tools} tools
                        </span>
                      )}
                      {conn.lastSync && (
                        <span className="flex items-center" style={{
                          gap: 2,
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-text-disabled)',
                          fontFamily: 'var(--token-font-mono)',
                        }}>
                          <Clock size={8} />
                          {conn.lastSync}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expand permissions */}
                {isConnected && conn.permissions && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : conn.id)}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 24, height: 24,
                      borderRadius: 'var(--token-radius-sm)',
                      borderWidth: 0,
                      borderStyle: 'none',
                      background: 'var(--token-bg-tertiary)',
                      color: 'var(--token-text-tertiary)',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}

                {/* Toggle */}
                <DSToggle
                  checked={isConnected}
                  onChange={() => toggle(conn.id)}
                />
              </div>

              {/* Expanded permissions panel */}
              {isExpanded && conn.permissions && (
                <div style={{
                  padding: 'var(--token-space-2) var(--token-space-4) var(--token-space-3)',
                  paddingLeft: 'calc(var(--token-space-4) + 32px + var(--token-space-3))',
                  background: 'var(--token-bg-secondary)',
                  borderBottomWidth: i < filtered.length - 1 ? '1px' : 0,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--token-border-subtle)',
                  animation: 'token-fade-in 150ms ease',
                }}>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-2)' }}>
                    <Shield size={10} style={{ color: 'var(--token-text-disabled)' }} />
                    <span style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-disabled)',
                      fontFamily: 'var(--token-font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      Permissions
                    </span>
                  </div>
                  <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
                    {conn.permissions.map(perm => (
                      <button
                        key={perm.id}
                        onClick={() => togglePermission(conn.id, perm.id)}
                        className="flex items-center cursor-pointer"
                        style={{
                          gap: 'var(--token-space-2)',
                          padding: 'var(--token-space-1) 0',
                          borderWidth: 0,
                          borderStyle: 'none',
                          background: 'transparent',
                          fontFamily: 'var(--token-font-sans)',
                          textAlign: 'left',
                        }}
                      >
                        <DSCheckbox
                          checked={perm.enabled}
                          onChange={() => togglePermission(conn.id, perm.id)}
                        />
                        <span style={{
                          fontSize: 'var(--token-text-xs)',
                          color: perm.enabled ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)',
                        }}>
                          {perm.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            padding: 'var(--token-space-4)',
            textAlign: 'center',
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-disabled)',
          }}>
            No connectors found
          </div>
        )}
      </div>
    </div>
  );
}

const defaultConnectors: Connector[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repositories, issues, PRs, and code search',
    icon: <GitBranch size={15} />,
    status: 'connected',
    tools: 12,
    lastSync: '2m ago',
    permissions: [
      { id: 'read-repos', label: 'Read repositories', enabled: true },
      { id: 'write-issues', label: 'Create/edit issues', enabled: true },
      { id: 'write-prs', label: 'Create pull requests', enabled: false },
      { id: 'read-actions', label: 'Read Actions logs', enabled: true },
    ],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Query and manage database tables',
    icon: <Database size={15} />,
    status: 'connected',
    tools: 8,
    lastSync: '5m ago',
    permissions: [
      { id: 'read-tables', label: 'Read tables', enabled: true },
      { id: 'write-rows', label: 'Insert/update rows', enabled: true },
      { id: 'delete-rows', label: 'Delete rows', enabled: false },
      { id: 'alter-schema', label: 'Alter schema', enabled: false },
    ],
  },
  {
    id: 'web',
    name: 'Web Search',
    description: 'Search the web for real-time information',
    icon: <Globe size={15} />,
    status: 'connected',
    tools: 3,
    lastSync: '1m ago',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Read and write to Notion pages and databases',
    icon: <FileText size={15} />,
    status: 'disconnected',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and read email messages',
    icon: <Mail size={15} />,
    status: 'disconnected',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage events and scheduling',
    icon: <Calendar size={15} />,
    status: 'error',
  },
];

export function MCPConnectorDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-2)' }}>
      <MCPConnector />
    </div>
  );
}
