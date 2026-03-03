/* ChatMessage — Enhanced with edit user messages, branch/fork, model label, timestamp
   Composed from DS atoms (DSAvatar, DSBadge)
   Phase 3: user message editing, model indicator on AI messages, relative timestamp, branch action */
import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Pencil, GitBranch, Sparkles } from 'lucide-react';
import { DSAvatar, DSBadge } from '../ds/atoms';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  showActions?: boolean;
  model?: string;
  timestamp?: string;
  onEdit?: (newContent: string) => void;
  onBranch?: () => void;
}

export function ChatMessage({
  role, content, isStreaming, showActions = true,
  model, timestamp, onEdit, onBranch,
}: ChatMessageProps) {
  const isUser = role === 'user';
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.style.height = 'auto';
      editRef.current.style.height = editRef.current.scrollHeight + 'px';
    }
  }, [editing]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSave = () => {
    if (editValue.trim() && editValue !== content) {
      onEdit?.(editValue.trim());
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSave(); }
    if (e.key === 'Escape') { setEditing(false); setEditValue(content); }
  };

  if (isUser) {
    return (
      <div
        className="flex justify-end"
        style={{ padding: 0, position: 'relative' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover actions for user bubble */}
        {hovered && !editing && (
          <div
            className="flex items-center"
            style={{
              position: 'absolute',
              right: 'calc(100% - 85% - 8px)',
              top: '50%',
              transform: 'translateY(-50%)',
              gap: 2,
              animation: 'token-fade-in 100ms ease',
            }}
          >
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true); setEditValue(content); }}
                className="flex items-center justify-center cursor-pointer"
                title="Edit message"
                style={{
                  width: 26, height: 26,
                  borderRadius: 'var(--token-radius-md)',
                  border: '1px solid var(--token-border)',
                  background: 'var(--token-bg)',
                  color: 'var(--token-text-tertiary)',
                  boxShadow: 'var(--token-shadow-sm)',
                }}
              >
                <Pencil size={11} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 26, height: 26,
                borderRadius: 'var(--token-radius-md)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: copied ? 'var(--token-success)' : 'var(--token-text-tertiary)',
                boxShadow: 'var(--token-shadow-sm)',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        )}
        <div
          style={{
            background: 'var(--token-user-bubble)',
            color: 'var(--token-user-bubble-text)',
            borderRadius: 'var(--token-radius-2xl)',
            padding: editing ? 'var(--token-space-2)' : 'var(--token-space-3) var(--token-space-4)',
            maxWidth: '85%',
            fontFamily: 'var(--token-font-sans)',
            fontSize: 'var(--token-text-base)',
            lineHeight: 'var(--token-leading-normal)',
            transition: 'box-shadow 200ms ease',
            boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {editing ? (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
              <textarea
                ref={editRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                style={{
                  width: '100%',
                  border: 'none', outline: 'none', resize: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  fontFamily: 'var(--token-font-sans)',
                  fontSize: 'var(--token-text-base)',
                  lineHeight: 'var(--token-leading-normal)',
                  padding: 'var(--token-space-1)',
                  minHeight: 24,
                }}
              />
              <div className="flex items-center justify-end" style={{ gap: 'var(--token-space-1)' }}>
                <button
                  onClick={() => { setEditing(false); setEditValue(content); }}
                  className="cursor-pointer"
                  style={{
                    fontSize: 'var(--token-text-2xs)', border: 'none', background: 'transparent',
                    color: 'var(--token-user-bubble-text)', opacity: 0.7,
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="cursor-pointer"
                  style={{
                    fontSize: 'var(--token-text-2xs)', border: 'none',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'var(--token-user-bubble-text)',
                    fontFamily: 'var(--token-font-mono)',
                    padding: '2px 8px',
                    borderRadius: 'var(--token-radius-sm)',
                  }}
                >
                  save
                </button>
              </div>
            </div>
          ) : (
            content
          )}
        </div>
        {/* Timestamp */}
        {timestamp && hovered && !editing && (
          <span style={{
            position: 'absolute',
            bottom: -16,
            right: 0,
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 100ms ease',
          }}>
            {timestamp}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 items-start"
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DSAvatar variant="ai" size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Model label */}
        {model && (
          <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)', marginBottom: 'var(--token-space-1)' }}>
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {model}
            </span>
            {timestamp && (
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {timestamp}
              </span>
            )}
          </div>
        )}
        <div
          style={{
            color: 'var(--token-ai-bubble-text)',
            fontFamily: 'var(--token-font-sans)',
            fontSize: 'var(--token-text-base)',
            lineHeight: 'var(--token-leading-relaxed)',
            paddingTop: model ? 0 : 'var(--token-space-1)',
          }}
        >
          {content}
          {isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: 2, height: '1em',
                background: 'var(--token-accent)',
                marginLeft: 'var(--token-space-0-5)',
                verticalAlign: 'text-bottom',
                animation: 'token-blink 1s step-end infinite',
                borderRadius: 1,
              }}
            />
          )}
        </div>
        {/* Hover action bar for assistant messages */}
        {showActions && hovered && !isStreaming && (
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-0-5)',
              marginTop: 'var(--token-space-2)',
              animation: 'token-fade-in 100ms ease',
            }}
          >
            {[
              { icon: copied ? <Check size={13} /> : <Copy size={13} />, onClick: handleCopy, active: copied, label: 'Copy' },
              { icon: <ThumbsUp size={13} />, onClick: () => setLiked(liked === true ? null : true), active: liked === true, label: 'Like' },
              { icon: <ThumbsDown size={13} />, onClick: () => setLiked(liked === false ? null : false), active: liked === false, label: 'Dislike' },
              { icon: <RotateCcw size={13} />, onClick: () => {}, active: false, label: 'Retry' },
              ...(onBranch ? [{ icon: <GitBranch size={13} />, onClick: onBranch, active: false, label: 'Branch' }] : []),
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="flex items-center justify-center cursor-pointer"
                title={btn.label}
                style={{
                  width: 28, height: 28,
                  borderRadius: 'var(--token-radius-md)',
                  border: 'none',
                  background: btn.active ? 'var(--token-bg-hover)' : 'transparent',
                  color: btn.active ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--token-bg-hover)';
                  if (!btn.active) e.currentTarget.style.color = 'var(--token-text-secondary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = btn.active ? 'var(--token-bg-hover)' : 'transparent';
                  if (!btn.active) e.currentTarget.style.color = 'var(--token-text-tertiary)';
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Demo with simulated streaming */
export function ChatMessageDemo() {
  const fullText = "Transformers are a neural network architecture that uses self-attention mechanisms to process sequential data. Unlike RNNs, they can process all positions in parallel, making them significantly faster to train.";
  const [streamedText, setStreamedText] = useState('');
  const [streamDone, setStreamDone] = useState(false);
  const [userMsg, setUserMsg] = useState('Explain how transformers work in machine learning.');
  const [key, setKey] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setStreamedText('');
    setStreamDone(false);
    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= fullText.length) {
        setStreamedText(fullText);
        setStreamDone(true);
        clearInterval(interval);
      } else {
        setStreamedText(fullText.slice(0, indexRef.current));
      }
    }, 18);
    return () => clearInterval(interval);
  }, [key]);

  return (
    <div
      className="flex flex-col w-full"
      style={{
        gap: 'var(--token-space-6)',
        fontFamily: 'var(--token-font-sans)',
        maxWidth: 520,
      }}
    >
      <ChatMessage
        role="user"
        content={userMsg}
        timestamp="just now"
        onEdit={(newContent) => setUserMsg(newContent)}
      />
      <ChatMessage
        role="assistant"
        content={streamedText}
        isStreaming={!streamDone}
        model="GPT-4o"
        timestamp="just now"
        onBranch={() => {}}
      />
      {streamDone && (
        <div className="flex items-center justify-between" style={{ animation: 'token-fade-in 300ms ease' }}>
          <ChatMessage role="user" content="Can you show me a simple example?" timestamp="1m ago" />
          <button
            onClick={() => setKey(k => k + 1)}
            className="cursor-pointer shrink-0"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
              marginLeft: 'var(--token-space-3)',
            }}
          >
            replay stream
          </button>
        </div>
      )}
    </div>
  );
}
