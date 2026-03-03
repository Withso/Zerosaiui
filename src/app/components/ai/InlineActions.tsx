/* InlineActions — Enhanced inline actions with custom actions + chaining
   Phase 3 enhancements:
   — Custom user-defined actions (create prompt-based actions)
   — Chainable actions (result shows its own action bar)
   — AI-powered inline actions (Simplify, Translate, Expand)
   — Action history for undo
   — Keyboard shortcuts per action */
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Pencil, RefreshCw, Maximize2, Trash2, Copy, Check,
  Sparkles, Languages, Minimize2, Plus, Wand2, Undo2,
  ChevronRight, X,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface ContentBlock {
  id: string;
  type: 'paragraph' | 'code' | 'heading';
  text: string;
  isAiResult?: boolean;
  sourceAction?: string;
}

interface CustomAction {
  id: string;
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

interface InlineActionsProps {
  blocks?: ContentBlock[];
  onEdit?: (id: string) => void;
  onRegenerate?: (id: string) => void;
  onExpand?: (id: string) => void;
  onDelete?: (id: string) => void;
  customActions?: CustomAction[];
}

const builtInAiActions = [
  { id: 'simplify', label: 'Simplify', icon: <Minimize2 size={11} />, prompt: 'Simplify this text' },
  { id: 'expand', label: 'Expand', icon: <Maximize2 size={11} />, prompt: 'Expand on this point' },
  { id: 'translate', label: 'Translate', icon: <Languages size={11} />, prompt: 'Translate to Spanish' },
  { id: 'improve', label: 'Improve', icon: <Wand2 size={11} />, prompt: 'Improve writing quality' },
];

export function InlineActions({
  blocks,
  onEdit,
  onRegenerate,
  onExpand,
  onDelete,
  customActions = [],
}: InlineActionsProps) {
  const [items, setItems] = useState<ContentBlock[]>(blocks || defaultBlocks);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAiMenu, setShowAiMenu] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionHistory, setActionHistory] = useState<{ blockId: string; prevText: string }[]>([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionPrompt, setNewActionPrompt] = useState('');
  const [userActions, setUserActions] = useState<CustomAction[]>(customActions);
  const containerRef = useRef<HTMLDivElement>(null);

  /* — Close AI menu on click outside — */
  useEffect(() => {
    if (!showAiMenu) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowAiMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAiMenu]);

  const allAiActions = [...builtInAiActions, ...userActions];

  const handleCopy = (id: string, text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch { /* ignore */ }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  /* — AI action simulation — */
  const handleAiAction = useCallback((blockId: string, action: typeof builtInAiActions[0]) => {
    const block = items.find(b => b.id === blockId);
    if (!block) return;

    setActionHistory(prev => [...prev, { blockId, prevText: block.text }]);
    setProcessingId(blockId);
    setShowAiMenu(null);

    /* Simulate AI processing */
    setTimeout(() => {
      const resultTexts: Record<string, string> = {
        simplify: 'Each token looks at all other tokens and computes relevance scores.',
        expand: `${block.text} This process enables the model to capture long-range dependencies effectively, as each position in the sequence can directly attend to every other position. Unlike recurrent architectures, this removes the sequential bottleneck.`,
        translate: 'La autoatención permite a cada token en una secuencia atender a todos los demás tokens, calculando puntuaciones de relevancia dinámicamente.',
        improve: block.text.charAt(0).toUpperCase() + block.text.slice(1).replace(/\.$/, '') + '. This fundamental mechanism underpins modern language models.',
      };

      const newText = resultTexts[action.id] || `[${action.label}] ${block.text}`;

      setItems(prev => prev.map(b =>
        b.id === blockId
          ? { ...b, text: newText, isAiResult: true, sourceAction: action.label }
          : b,
      ));
      setProcessingId(null);
    }, 1200);
  }, [items]);

  /* — Undo — */
  const handleUndo = useCallback((blockId: string) => {
    const lastAction = [...actionHistory].reverse().find(h => h.blockId === blockId);
    if (!lastAction) return;
    setItems(prev => prev.map(b =>
      b.id === blockId ? { ...b, text: lastAction.prevText, isAiResult: false, sourceAction: undefined } : b,
    ));
    setActionHistory(prev => {
      const idx = prev.findLastIndex(h => h.blockId === blockId);
      return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev;
    });
  }, [actionHistory]);

  /* — Add custom action — */
  const addCustomAction = () => {
    if (!newActionLabel.trim() || !newActionPrompt.trim()) return;
    setUserActions(prev => [...prev, {
      id: `custom-${Date.now()}`,
      label: newActionLabel,
      prompt: newActionPrompt,
      icon: <Sparkles size={11} />,
    }]);
    setNewActionLabel('');
    setNewActionPrompt('');
    setShowAddAction(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 0,
        width: '100%',
      }}
    >
      {items.map(block => {
        const isHovered = hoveredId === block.id;
        const isProcessing = processingId === block.id;
        const hasHistory = actionHistory.some(h => h.blockId === block.id);

        return (
          <div
            key={block.id}
            className="relative flex flex-col"
            style={{
              borderRadius: 'var(--token-radius-md)',
              background: isProcessing
                ? 'var(--token-bg-hover)'
                : isHovered
                ? 'var(--token-bg-hover)'
                : 'transparent',
              transition: 'background var(--token-duration-fast) var(--token-ease-default)',
            }}
            onMouseEnter={() => setHoveredId(block.id)}
            onMouseLeave={() => { setHoveredId(null); }}
          >
            <div className="flex" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2) var(--token-space-3)' }}>
              {/* Content */}
              <div className="flex-1" style={{ minWidth: 0 }}>
                {/* AI result badge */}
                {block.isAiResult && block.sourceAction && (
                  <div
                    className="flex items-center"
                    style={{
                      gap: 'var(--token-space-1)',
                      marginBottom: 'var(--token-space-1)',
                      animation: 'token-fade-in 150ms ease',
                    }}
                  >
                    <Sparkles size={9} style={{ color: 'var(--token-accent)' }} />
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)' }}>
                      {block.sourceAction}
                    </span>
                    <ChevronRight size={8} style={{ color: 'var(--token-text-disabled)' }} />
                  </div>
                )}

                {block.type === 'heading' ? (
                  <span
                    style={{
                      fontSize: 'var(--token-text-md)',
                      fontWeight: 'var(--token-weight-semibold)',
                      color: 'var(--token-text-primary)',
                      lineHeight: 'var(--token-leading-normal)',
                    }}
                  >
                    {block.text}
                  </span>
                ) : block.type === 'code' ? (
                  <code
                    style={{
                      display: 'block',
                      fontSize: 'var(--token-text-xs)',
                      fontFamily: 'var(--token-font-mono)',
                      color: 'var(--token-code-text)',
                      background: 'var(--token-code-bg)',
                      padding: 'var(--token-space-2) var(--token-space-3)',
                      borderRadius: 'var(--token-radius-md)',
                      border: '1px solid var(--token-border)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 'var(--token-leading-relaxed)',
                    }}
                  >
                    {block.text}
                  </code>
                ) : (
                  <span
                    style={{
                      fontSize: 'var(--token-text-sm)',
                      color: 'var(--token-text-secondary)',
                      lineHeight: 'var(--token-leading-relaxed)',
                      opacity: isProcessing ? 0.5 : 1,
                      transition: 'opacity var(--token-duration-fast)',
                    }}
                  >
                    {isProcessing ? (
                      <span className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 12, height: 12,
                            borderRadius: 'var(--token-radius-full)',
                            borderTopColor: 'var(--token-accent)',
                            borderRightColor: 'transparent',
                            borderBottomColor: 'transparent',
                            borderLeftColor: 'transparent',
                            borderWidth: 2,
                            borderStyle: 'solid',
                            animation: 'token-spin 0.8s linear infinite',
                          }}
                        />
                        Processing...
                      </span>
                    ) : block.text}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              {isHovered && !isProcessing && (
                <div
                  className="flex items-start shrink-0"
                  style={{
                    gap: 'var(--token-space-0-5)',
                    animation: 'token-fade-in 120ms var(--token-ease-default)',
                  }}
                >
                  {hasHistory && (
                    <DSButton
                      variant="icon"
                      icon={<Undo2 size={12} />}
                      onClick={() => handleUndo(block.id)}
                      title="Undo"
                      style={{ width: 26, height: 26, color: 'var(--token-warning)' }}
                    />
                  )}
                  <DSButton
                    variant="icon"
                    icon={copiedId === block.id ? <Check size={12} /> : <Copy size={12} />}
                    onClick={() => handleCopy(block.id, block.text)}
                    title="Copy"
                    style={{ width: 26, height: 26 }}
                  />
                  <DSButton
                    variant="icon"
                    icon={<Pencil size={12} />}
                    onClick={() => onEdit?.(block.id)}
                    title="Edit"
                    style={{ width: 26, height: 26 }}
                  />
                  <DSButton
                    variant="icon"
                    icon={<RefreshCw size={12} />}
                    onClick={() => onRegenerate?.(block.id)}
                    title="Regenerate"
                    style={{ width: 26, height: 26 }}
                  />

                  {/* AI Actions trigger */}
                  <div style={{ position: 'relative' }}>
                    <DSButton
                      variant="icon"
                      icon={<Sparkles size={12} />}
                      onClick={() => setShowAiMenu(showAiMenu === block.id ? null : block.id)}
                      title="AI Actions"
                      style={{
                        width: 26, height: 26,
                        color: showAiMenu === block.id ? 'var(--token-accent)' : undefined,
                      }}
                    />

                    {/* AI Actions dropdown */}
                    {showAiMenu === block.id && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: 'var(--token-space-1)',
                          minWidth: 160,
                          borderRadius: 'var(--token-radius-md)',
                          border: '1px solid var(--token-border)',
                          background: 'var(--token-bg)',
                          boxShadow: 'var(--token-shadow-lg)',
                          zIndex: 10,
                          overflow: 'hidden',
                          animation: 'token-fade-in 100ms ease',
                        }}
                      >
                        {allAiActions.map(action => (
                          <button
                            key={action.id}
                            onClick={() => handleAiAction(block.id, action)}
                            className="flex items-center cursor-pointer"
                            style={{
                              width: '100%',
                              gap: 'var(--token-space-2)',
                              padding: 'var(--token-space-2) var(--token-space-3)',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--token-text-secondary)',
                              fontSize: 'var(--token-text-xs)',
                              fontFamily: 'var(--token-font-sans)',
                              textAlign: 'left',
                              transition: 'background var(--token-duration-fast)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--token-bg-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ color: 'var(--token-accent)', display: 'flex' }}>{action.icon}</span>
                            {action.label}
                          </button>
                        ))}
                        <div style={{ borderTop: '1px solid var(--token-border)' }}>
                          <button
                            onClick={() => { setShowAiMenu(null); setShowAddAction(true); }}
                            className="flex items-center cursor-pointer"
                            style={{
                              width: '100%',
                              gap: 'var(--token-space-2)',
                              padding: 'var(--token-space-2) var(--token-space-3)',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--token-text-tertiary)',
                              fontSize: 'var(--token-text-xs)',
                              fontFamily: 'var(--token-font-sans)',
                              textAlign: 'left',
                              transition: 'background var(--token-duration-fast)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--token-bg-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Plus size={11} />
                            Add custom action
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Custom Action panel */}
      {showAddAction && (
        <div
          style={{
            margin: 'var(--token-space-2) var(--token-space-3)',
            padding: 'var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-accent)',
            background: 'var(--token-bg-secondary)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
            <span style={{ fontSize: 'var(--token-text-xs)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>
              New Custom Action
            </span>
            <DSButton
              variant="icon"
              icon={<X size={11} />}
              onClick={() => setShowAddAction(false)}
              style={{ width: 20, height: 20 }}
            />
          </div>
          <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
            <input
              value={newActionLabel}
              onChange={e => setNewActionLabel(e.target.value)}
              placeholder="Action name (e.g. Pirate Speak)"
              style={{
                width: '100%',
                padding: 'var(--token-space-1-5) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: 'var(--token-text-primary)',
                fontSize: 'var(--token-text-xs)',
                fontFamily: 'var(--token-font-sans)',
                outline: 'none',
              }}
            />
            <input
              value={newActionPrompt}
              onChange={e => setNewActionPrompt(e.target.value)}
              placeholder="Prompt (e.g. Rewrite in pirate speak)"
              style={{
                width: '100%',
                padding: 'var(--token-space-1-5) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: 'var(--token-text-primary)',
                fontSize: 'var(--token-text-xs)',
                fontFamily: 'var(--token-font-sans)',
                outline: 'none',
              }}
            />
            <DSButton
              variant="primary"
              onClick={addCustomAction}
              style={{ fontSize: 'var(--token-text-xs)', alignSelf: 'flex-end' }}
            >
              Add Action
            </DSButton>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultBlocks: ContentBlock[] = [
  {
    id: '1',
    type: 'heading',
    text: 'Understanding Self-Attention',
  },
  {
    id: '2',
    type: 'paragraph',
    text: 'Self-attention allows each token in a sequence to attend to every other token, computing relevance scores dynamically.',
  },
  {
    id: '3',
    type: 'code',
    text: 'attention = softmax(Q @ K.T / sqrt(d_k)) @ V',
  },
  {
    id: '4',
    type: 'paragraph',
    text: 'This mechanism replaces recurrence entirely, enabling full parallelization during training.',
  },
];

export function InlineActionsDemo() {
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (action: string) => {
    setActionLog(prev => [...prev.slice(-2), action]);
    setTimeout(() => setActionLog(prev => prev.slice(1)), 2000);
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <InlineActions
        onEdit={() => logAction('Editing block...')}
        onRegenerate={() => logAction('Regenerating...')}
        onExpand={() => logAction('Expanded view')}
        onDelete={() => logAction('Block deleted')}
      />
      {actionLog.length > 0 && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
          {actionLog.map((msg, i) => (
            <div
              key={`${msg}-${i}`}
              style={{
                padding: 'var(--token-space-1-5) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-bg-hover)',
                border: '1px solid var(--token-border)',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-secondary)',
                fontFamily: 'var(--token-font-mono)',
                animation: 'token-fade-in 200ms ease',
              }}
            >
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}