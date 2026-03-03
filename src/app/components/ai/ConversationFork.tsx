/* ConversationFork — Enhanced with comparison mode, delete branch, inline preview
   Composed from DS atoms (DSButton, DSBadge, DSDivider) + DSHeaderBar molecule
   Phase 3: branch comparison, delete with confirm, message preview on hover, fork-point indicator */
import { useState } from 'react';
import { GitBranch, GitMerge, GitCompare, MessageSquare, ChevronRight, Plus, Star, Trash2, Eye } from 'lucide-react';
import { DSButton, DSBadge, DSDivider } from '../ds/atoms';
import { DSHeaderBar } from '../ds/molecules';

interface Branch {
  id: string;
  label: string;
  messageCount: number;
  lastMessage: string;
  timestamp: string;
  isActive: boolean;
  isStarred: boolean;
  model: string;
  preview?: string[];
}

const mockBranches: Branch[] = [
  { id: 'main', label: 'Main', messageCount: 12, lastMessage: 'The token architecture has 4 levels...', timestamp: '2m ago', isActive: true, isStarred: true, model: 'GPT-4o', preview: ['User: How should I structure tokens?', 'AI: I recommend a 4-level architecture...', 'User: Can you elaborate on semantic tokens?'] },
  { id: 'alt-1', label: 'Alt: Simpler tokens', messageCount: 8, lastMessage: 'What if we use only 2 levels?', timestamp: '5m ago', isActive: false, isStarred: false, model: 'Claude 3.5', preview: ['User: What if we simplify to 2 levels?', 'AI: A 2-level system would be lighter...'] },
  { id: 'alt-2', label: 'Alt: Material Design', messageCount: 4, lastMessage: 'Comparing with Material tokens...', timestamp: '12m ago', isActive: false, isStarred: true, model: 'GPT-4o', preview: ['User: How does Material Design handle tokens?', 'AI: Material uses a reference/system/component model...'] },
];

export function ConversationForkDemo() {
  const [branches, setBranches] = useState(mockBranches);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const toggleStar = (id: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, isStarred: !b.isStarred } : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
    selectedForCompare.delete(id);
  };

  const toggleCompareSelect = (id: string) => {
    setSelectedForCompare(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 2) next.add(id);
      return next;
    });
  };

  const totalMessages = branches.reduce((a, b) => a + b.messageCount, 0);

  return (
    <div style={{
      width: 380, borderRadius: 'var(--token-radius-xl)',
      border: '1px solid var(--token-border)', background: 'var(--token-bg)',
      overflow: 'hidden', fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="Conversation Branches"
        icon={<GitBranch size={14} style={{ color: 'var(--token-accent)' }} />}
        actions={
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <DSButton
              variant={compareMode ? 'primary' : 'ghost'}
              icon={<GitCompare size={12} />}
              onClick={() => { setCompareMode(!compareMode); setSelectedForCompare(new Set()); }}
              style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 6px', height: 22 }}
            >
              {compareMode ? 'Exit Compare' : 'Compare'}
            </DSButton>
            <DSButton variant="ghost" icon={<Plus size={12} />}>
              Fork
            </DSButton>
          </div>
        }
      />

      {/* Branch visualization */}
      <div style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderBottom: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <div className="flex items-center" style={{ gap: 4 }}>
          <div className="flex items-center" style={{ gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: 'var(--token-radius-full)',
                background: i <= 3 ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
                border: '1px solid var(--token-border)',
              }} />
            ))}
          </div>
          <GitBranch size={10} style={{ color: 'var(--token-text-disabled)', margin: '0 2px' }} />
          <div className="flex items-center" style={{ gap: 2 }}>
            {[1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: 'var(--token-radius-full)',
                background: 'var(--token-secondary)',
                border: '1px solid var(--token-border)',
              }} />
            ))}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
            Forked at message 5
          </span>
          <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>
            {branches.length} branches
          </span>
          {compareMode && selectedForCompare.size === 2 && (
            <DSBadge variant="ai">Ready to compare</DSBadge>
          )}
        </div>
      </div>

      {/* Compare view */}
      {compareMode && selectedForCompare.size === 2 && (
        <div style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-accent-muted, rgba(79,109,128,0.04))',
        }}>
          <div className="flex" style={{ gap: 'var(--token-space-3)' }}>
            {Array.from(selectedForCompare).map(id => {
              const b = branches.find(br => br.id === id);
              if (!b) return null;
              return (
                <div key={id} className="flex-1" style={{
                  padding: 'var(--token-space-2)',
                  borderRadius: 'var(--token-radius-md)',
                  border: '1px solid var(--token-border)',
                  background: 'var(--token-bg)',
                }}>
                  <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>
                    {b.label}
                  </span>
                  <p style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', margin: '4px 0 0', lineHeight: 'var(--token-leading-normal)' }}>
                    {b.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Branch list */}
      <div style={{ padding: 'var(--token-space-1) 0' }}>
        {branches.map((branch, i) => (
          <div key={branch.id}>
            {i > 0 && <DSDivider style={{ margin: '0 16px' }} />}
            <div
              className="flex items-start cursor-pointer"
              onMouseEnter={() => setHoveredId(branch.id)}
              onMouseLeave={() => { setHoveredId(null); setPreviewId(null); }}
              onClick={() => compareMode ? toggleCompareSelect(branch.id) : undefined}
              style={{
                padding: 'var(--token-space-3) var(--token-space-4)',
                gap: 10,
                background: compareMode && selectedForCompare.has(branch.id)
                  ? 'var(--token-accent-muted, rgba(79,109,128,0.08))'
                  : branch.isActive ? 'var(--token-accent-muted)'
                  : hoveredId === branch.id ? 'var(--token-bg-hover)' : 'transparent',
                transition: 'background 80ms',
                position: 'relative',
              }}
            >
              {/* Compare checkbox */}
              {compareMode && (
                <div className="flex items-center justify-center shrink-0" style={{
                  width: 18, height: 18, borderRadius: 'var(--token-radius-sm)',
                  border: `2px solid ${selectedForCompare.has(branch.id) ? 'var(--token-accent)' : 'var(--token-border)'}`,
                  background: selectedForCompare.has(branch.id) ? 'var(--token-accent)' : 'transparent',
                  marginTop: 4,
                  transition: 'all 120ms ease',
                }}>
                  {selectedForCompare.has(branch.id) && (
                    <span style={{ color: 'var(--token-accent-fg)', fontSize: 10 }}>✓</span>
                  )}
                </div>
              )}

              {/* Branch icon */}
              <div className="flex items-center justify-center shrink-0" style={{
                width: 28, height: 28, borderRadius: 'var(--token-radius-md)',
                background: branch.isActive ? 'var(--token-accent-light)' : 'var(--token-bg-tertiary)',
                marginTop: 2,
              }}>
                {branch.isActive ? (
                  <MessageSquare size={13} style={{ color: 'var(--token-accent)' }} />
                ) : (
                  <GitBranch size={13} style={{ color: 'var(--token-text-tertiary)' }} />
                )}
              </div>

              {/* Branch info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center" style={{ gap: 6, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 'var(--token-text-sm)',
                    fontWeight: branch.isActive ? 500 : 400,
                    color: branch.isActive ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                  }}>
                    {branch.label}
                  </span>
                  {branch.isActive && <DSBadge variant="ai">Active</DSBadge>}
                </div>
                <p className="truncate" style={{
                  margin: 0, fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-tertiary)',
                }}>
                  {branch.lastMessage}
                </p>
                <div className="flex items-center" style={{ gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
                    {branch.messageCount} msgs
                  </span>
                  <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
                    {branch.timestamp}
                  </span>
                  <DSBadge variant="default">{branch.model}</DSBadge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center shrink-0" style={{ gap: 2, marginTop: 2 }}>
                {/* Preview button */}
                {branch.preview && hoveredId === branch.id && !compareMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewId(previewId === branch.id ? null : branch.id); }}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 24, height: 24, borderRadius: 'var(--token-radius-sm)',
                      border: 'none', background: 'transparent',
                      color: previewId === branch.id ? 'var(--token-accent)' : 'var(--token-text-disabled)',
                      transition: 'color 80ms',
                    }}
                  >
                    <Eye size={12} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(branch.id); }}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 24, height: 24, borderRadius: 'var(--token-radius-sm)',
                    border: 'none', background: 'transparent',
                    color: branch.isStarred ? 'var(--token-secondary)' : 'var(--token-text-disabled)',
                    transition: 'color 80ms',
                  }}
                >
                  <Star size={12} fill={branch.isStarred ? 'currentColor' : 'none'} />
                </button>
                {/* Delete with confirm */}
                {!branch.isActive && hoveredId === branch.id && !compareMode && (
                  deleteConfirm === branch.id ? (
                    <div className="flex items-center" style={{ gap: 2 }}>
                      <DSButton variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteBranch(branch.id); }}
                        style={{ padding: '2px 4px', height: 20, fontSize: 'var(--token-text-2xs)', color: 'var(--token-error)' }}>
                        Delete
                      </DSButton>
                      <DSButton variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDeleteConfirm(null); }}
                        style={{ padding: '2px 4px', height: 20, fontSize: 'var(--token-text-2xs)' }}>
                        Cancel
                      </DSButton>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(branch.id); }}
                      className="flex items-center justify-center cursor-pointer"
                      style={{
                        width: 24, height: 24, borderRadius: 'var(--token-radius-sm)',
                        border: 'none', background: 'transparent',
                        color: 'var(--token-text-disabled)',
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  )
                )}
                <ChevronRight size={12} style={{ color: 'var(--token-text-disabled)' }} />
              </div>
            </div>

            {/* Inline preview */}
            {previewId === branch.id && branch.preview && (
              <div style={{
                padding: 'var(--token-space-2) var(--token-space-4) var(--token-space-2) 58px',
                borderTop: '1px solid var(--token-border-subtle)',
                background: 'var(--token-bg-secondary)',
                animation: 'token-fade-in 150ms ease',
              }}>
                {branch.preview.map((msg, mi) => (
                  <p key={mi} style={{
                    margin: mi > 0 ? '4px 0 0' : 0,
                    fontSize: 'var(--token-text-xs)',
                    color: msg.startsWith('User:') ? 'var(--token-text-secondary)' : 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                    lineHeight: 'var(--token-leading-normal)',
                  }}>
                    {msg}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-2-5) var(--token-space-4)',
        borderTop: '1px solid var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <DSButton variant="ghost" icon={<GitMerge size={12} />}>
          Merge
        </DSButton>
        <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
          {totalMessages} total messages
        </span>
      </div>
    </div>
  );
}
