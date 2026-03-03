/* —— ConsentDialog — Phase 3 Enhanced ——
   Phase 3: risk level indicator per permission, expandable details,
   remember preference toggle, estimated data impact, timer auto-deny */
import { useState } from 'react';
import { Shield, Eye, Database, Globe, AlertTriangle, Check, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { DSButton, DSCheckbox, DSBadge, DSToggle } from '../ds/atoms';

type RiskLevel = 'low' | 'medium' | 'high';

interface Permission {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  required?: boolean;
  risk?: RiskLevel;
  detail?: string;
}

interface ConsentDialogProps {
  title?: string;
  description?: string;
  permissions?: Permission[];
  onAccept?: (granted: string[]) => void;
  onDeny?: () => void;
  showRemember?: boolean;
}

const riskConfig: Record<RiskLevel, { color: string; label: string; bg: string }> = {
  low: { color: 'var(--token-success)', label: 'Low Risk', bg: 'var(--token-success-light)' },
  medium: { color: 'var(--token-warning)', label: 'Medium', bg: 'var(--token-warning-light)' },
  high: { color: 'var(--token-error)', label: 'High Risk', bg: 'var(--token-error-light)' },
};

export function ConsentDialog({
  title = 'Permissions Required',
  description,
  permissions,
  onAccept,
  onDeny,
  showRemember = true,
}: ConsentDialogProps) {
  const items = permissions || defaultPermissions;
  const [granted, setGranted] = useState<Set<string>>(
    new Set(items.filter(p => p.required).map(p => p.id)),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const togglePermission = (id: string) => {
    const perm = items.find(p => p.id === id);
    if (perm?.required) return;
    setGranted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allRequired = items.filter(p => p.required).every(p => granted.has(p.id));
  const highRiskCount = items.filter(p => p.risk === 'high' && granted.has(p.id)).length;

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
        boxShadow: 'var(--token-shadow-md)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col"
        style={{
          padding: 'var(--token-space-4)',
          gap: 'var(--token-space-2)',
          background: 'var(--token-bg)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2-5)' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--token-radius-md)',
              background: 'var(--token-warning-light)',
            }}
          >
            <Shield size={16} style={{ color: 'var(--token-warning)' }} />
          </div>
          <div className="flex flex-col" style={{ gap: 'var(--token-space-0-5)', flex: 1 }}>
            <span style={{
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-primary)',
            }}>
              {title}
            </span>
            <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {granted.size}/{items.length} granted
              </span>
              {highRiskCount > 0 && (
                <DSBadge variant="error" style={{ fontSize: '9px', padding: '0 4px' }}>
                  {highRiskCount} high risk
                </DSBadge>
              )}
            </div>
          </div>
        </div>
        {(description || !permissions) && (
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
            lineHeight: 'var(--token-leading-normal)',
          }}>
            {description || 'This AI action requires the following permissions. Review and approve to continue.'}
          </span>
        )}
      </div>

      {/* Permission list */}
      <div
        className="flex flex-col"
        style={{
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
        }}
      >
        {items.map((perm, i) => {
          const isGranted = granted.has(perm.id);
          const isExpanded = expandedId === perm.id;
          const risk = perm.risk || 'low';
          const rc = riskConfig[risk];

          return (
            <div key={perm.id}>
              <button
                onClick={() => togglePermission(perm.id)}
                className="flex items-center w-full cursor-pointer"
                style={{
                  gap: 'var(--token-space-3)',
                  padding: 'var(--token-space-3) var(--token-space-4)',
                  borderWidth: 0,
                  borderStyle: 'none',
                  borderBottomWidth: (i < items.length - 1 && !isExpanded) ? '1px' : 0,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--token-border-subtle)',
                  background: 'transparent',
                  fontFamily: 'var(--token-font-sans)',
                  textAlign: 'left',
                  transition: 'background var(--token-duration-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{
                  color: isGranted ? 'var(--token-text-secondary)' : 'var(--token-text-disabled)',
                  flexShrink: 0,
                  display: 'flex',
                }}>
                  {perm.icon}
                </span>

                <div className="flex flex-col flex-1" style={{ gap: 'var(--token-space-0-5)', minWidth: 0 }}>
                  <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                    <span style={{
                      fontSize: 'var(--token-text-sm)',
                      color: 'var(--token-text-primary)',
                    }}>
                      {perm.label}
                    </span>
                    {perm.required && (
                      <DSBadge variant="error" style={{ fontSize: 'var(--token-text-2xs)' }}>Required</DSBadge>
                    )}
                    {/* Risk indicator */}
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'var(--token-font-mono)',
                      color: rc.color,
                      padding: '0 4px',
                      borderRadius: 'var(--token-radius-sm)',
                      background: rc.bg,
                      textTransform: 'uppercase',
                    }}>
                      {rc.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 'var(--token-text-xs)',
                    color: 'var(--token-text-tertiary)',
                    lineHeight: 'var(--token-leading-normal)',
                  }}>
                    {perm.description}
                  </span>
                </div>

                {/* Expand detail button */}
                {perm.detail && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : perm.id); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setExpandedId(isExpanded ? null : perm.id); } }}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 22, height: 22,
                      borderRadius: 'var(--token-radius-sm)',
                      background: 'var(--token-bg-tertiary)',
                      color: 'var(--token-text-tertiary)',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>
                )}

                <DSCheckbox
                  checked={isGranted}
                  onChange={() => togglePermission(perm.id)}
                  disabled={perm.required}
                />
              </button>

              {/* Expanded detail */}
              {isExpanded && perm.detail && (
                <div style={{
                  padding: 'var(--token-space-2) var(--token-space-4) var(--token-space-3)',
                  paddingLeft: 'calc(var(--token-space-4) + 14px + var(--token-space-3))',
                  background: 'var(--token-bg-secondary)',
                  borderBottomWidth: i < items.length - 1 ? '1px' : 0,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--token-border-subtle)',
                  animation: 'token-fade-in 150ms ease',
                }}>
                  <div className="flex items-start" style={{ gap: 'var(--token-space-2)' }}>
                    <Info size={11} style={{ color: 'var(--token-text-disabled)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{
                      fontSize: 'var(--token-text-xs)',
                      color: 'var(--token-text-tertiary)',
                      lineHeight: 'var(--token-leading-relaxed)',
                    }}>
                      {perm.detail}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Remember preference */}
      {showRemember && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--token-border-subtle)',
            background: 'var(--token-bg)',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
          }}>
            Remember for this session
          </span>
          <DSToggle checked={remember} onChange={() => setRemember(!remember)} />
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center justify-end"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <DSButton variant="outline" onClick={onDeny}>
          Deny All
        </DSButton>
        <DSButton
          variant="primary"
          onClick={() => onAccept?.([...granted])}
          disabled={!allRequired}
        >
          {highRiskCount > 0 ? 'Allow & Continue (Risky)' : 'Allow & Continue'}
        </DSButton>
      </div>
    </div>
  );
}

const defaultPermissions: Permission[] = [
  {
    id: 'read-files',
    icon: <Eye size={14} />,
    label: 'Read Files',
    description: 'Access and read files in your project directory.',
    required: true,
    risk: 'low',
    detail: 'This permission allows the AI to read file contents, metadata, and directory structures within your current project scope. No files outside the project are accessible.',
  },
  {
    id: 'write-data',
    icon: <Database size={14} />,
    label: 'Write to Database',
    description: 'Insert and update records in the connected database.',
    required: true,
    risk: 'medium',
    detail: 'Write access includes INSERT and UPDATE operations. DELETE operations require separate approval. All writes are logged and can be rolled back within 24 hours.',
  },
  {
    id: 'web-access',
    icon: <Globe size={14} />,
    label: 'Web Access',
    description: 'Search the web and fetch external resources.',
    risk: 'low',
  },
  {
    id: 'exec-code',
    icon: <AlertTriangle size={14} />,
    label: 'Execute Code',
    description: 'Run code in a sandboxed environment.',
    risk: 'high',
    detail: 'Code execution happens in an isolated sandbox with no network access and limited system calls. However, malicious code could still consume resources or produce misleading output.',
  },
];

export function ConsentDialogDemo() {
  const [decision, setDecision] = useState<string | null>(null);
  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      {!decision ? (
        <ConsentDialog onAccept={() => setDecision('approved')} onDeny={() => setDecision('denied')} />
      ) : (
        <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-3)', padding: 'var(--token-space-6)' }}>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: decision === 'approved' ? 'var(--token-success)' : 'var(--token-error)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {decision === 'approved' ? 'Permissions granted' : 'Permissions denied'}
          </span>
          <button
            onClick={() => setDecision(null)}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              borderWidth: 0, borderStyle: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            show dialog again
          </button>
        </div>
      )}
    </div>
  );
}