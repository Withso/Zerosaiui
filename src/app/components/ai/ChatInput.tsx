/* ChatInput — Enhanced with stop-generation, model indicator, mention autocomplete
   Composed from DS atoms (DSButton, DSBadge)
   Phase 3: stop button during streaming, active model pill, @ mention popup */
import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowUp, Paperclip, Mic, Image, Sparkles, X, Square, AtSign } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface ChatInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  activeModel?: string;
  mentions?: { id: string; label: string; type: 'model' | 'tool' }[];
}

export function ChatInput({
  placeholder = 'Message AI...',
  onSend,
  onStop,
  disabled,
  isStreaming = false,
  activeModel,
  mentions = defaultMentions,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [micPulse, setMicPulse] = useState(false);
  const [sendAnim, setSendAnim] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasValue = value.trim().length > 0;

  /* Auto-grow textarea */
  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, []);

  useEffect(() => { autoGrow(); }, [value, autoGrow]);

  const handleSend = () => {
    if (!hasValue || disabled || isStreaming) return;
    setSendAnim(true);
    setTimeout(() => setSendAnim(false), 400);
    onSend?.(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && mentionOpen) {
      setMentionOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    /* Detect @ mention trigger */
    const lastAt = v.lastIndexOf('@');
    if (lastAt >= 0 && (lastAt === 0 || v[lastAt - 1] === ' ')) {
      const query = v.slice(lastAt + 1);
      if (!query.includes(' ')) {
        setMentionOpen(true);
        setMentionFilter(query.toLowerCase());
        return;
      }
    }
    setMentionOpen(false);
  };

  const insertMention = (mention: { id: string; label: string }) => {
    const lastAt = value.lastIndexOf('@');
    const before = value.slice(0, lastAt);
    setValue(`${before}@${mention.label} `);
    setMentionOpen(false);
    textareaRef.current?.focus();
  };

  const handleMicClick = () => {
    setMicPulse(true);
    setTimeout(() => setMicPulse(false), 1200);
  };

  const filteredMentions = mentions.filter(m => m.label.toLowerCase().includes(mentionFilter));

  return (
    <div
      style={{
        border: `1px solid ${focused ? 'var(--token-accent)' : 'var(--token-border)'}`,
        borderRadius: 'var(--token-radius-xl)',
        background: disabled ? 'var(--token-bg-secondary)' : 'var(--token-bg)',
        padding: 'var(--token-space-3)',
        boxShadow: focused
          ? '0 0 0 3px rgba(79,109,128,0.12), var(--token-shadow-sm)'
          : 'var(--token-shadow-sm)',
        transition: 'border-color 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms cubic-bezier(0.16,1,0.3,1), background 200ms ease',
        opacity: disabled ? 0.6 : 1,
        position: 'relative' as const,
      }}
      onClick={() => textareaRef.current?.focus()}
    >
      {/* Active model pill */}
      {activeModel && (
        <div style={{ marginBottom: 'var(--token-space-2)' }}>
          <DSBadge variant="default" icon={<Sparkles size={8} />}>{activeModel}</DSBadge>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); setAttachMenuOpen(false); setTimeout(() => setMentionOpen(false), 150); }}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          background: 'transparent',
          color: 'var(--token-text-primary)',
          fontFamily: 'var(--token-font-sans)',
          fontSize: 'var(--token-text-base)',
          lineHeight: 'var(--token-leading-normal)',
          padding: 'var(--token-space-1) var(--token-space-2)',
          minHeight: 24,
          maxHeight: 140,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />

      {/* Mention autocomplete popup */}
      {mentionOpen && filteredMentions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: 'var(--token-space-3)',
            minWidth: 180,
            background: 'var(--token-bg)',
            border: '1px solid var(--token-border)',
            borderRadius: 'var(--token-radius-lg)',
            boxShadow: 'var(--token-shadow-lg)',
            padding: 'var(--token-space-1)',
            zIndex: 20,
            animation: 'token-fade-in 120ms ease',
          }}
        >
          <div style={{
            padding: 'var(--token-space-1) var(--token-space-2)',
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            Mention a model or tool
          </div>
          {filteredMentions.map(m => (
            <button
              key={m.id}
              className="flex items-center w-full cursor-pointer"
              onMouseDown={(e) => { e.preventDefault(); insertMention(m); }}
              style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-1-5) var(--token-space-2)',
                borderRadius: 'var(--token-radius-md)',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--token-font-sans)',
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-primary)',
                textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                padding: '1px 4px',
                borderRadius: 'var(--token-radius-sm)',
                background: m.type === 'model' ? 'var(--token-accent-light)' : 'var(--token-bg-tertiary)',
                color: m.type === 'model' ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {m.type === 'model' ? 'model' : 'tool'}
              </span>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions Bar */}
      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 'var(--token-space-2)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          {/* Attach button with mini-menu */}
          <div style={{ position: 'relative' }}>
            <DSButton
              variant="ghost"
              icon={<Paperclip size={16} />}
              onClick={() => setAttachMenuOpen(!attachMenuOpen)}
              disabled={disabled}
              style={{
                width: 32, height: 32, padding: 0,
                borderRadius: 'var(--token-radius-md)',
                transform: attachMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
              }}
            />
            {attachMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 6px)',
                  left: 0,
                  display: 'flex',
                  gap: 'var(--token-space-1)',
                  padding: 'var(--token-space-1-5)',
                  background: 'var(--token-bg)',
                  border: '1px solid var(--token-border)',
                  borderRadius: 'var(--token-radius-lg)',
                  boxShadow: 'var(--token-shadow-lg)',
                  animation: 'token-fade-in 150ms ease',
                  zIndex: 10,
                }}
              >
                {[
                  { icon: <Image size={14} />, label: 'Image' },
                  { icon: <Paperclip size={14} />, label: 'File' },
                  { icon: <Sparkles size={14} />, label: 'Context' },
                ].map(item => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setAttachMenuOpen(false)}
                    style={{
                      width: 52, height: 48, gap: 2,
                      border: 'none', background: 'transparent',
                      borderRadius: 'var(--token-radius-md)',
                      color: 'var(--token-text-tertiary)',
                      fontSize: 'var(--token-text-2xs)',
                      fontFamily: 'var(--token-font-sans)',
                      transition: 'background 120ms ease, color 120ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--token-bg-hover)';
                      e.currentTarget.style.color = 'var(--token-text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--token-text-tertiary)';
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <DSButton
            variant="ghost"
            icon={<Mic size={16} />}
            onClick={handleMicClick}
            disabled={disabled}
            style={{
              width: 32, height: 32, padding: 0,
              borderRadius: 'var(--token-radius-md)',
              color: micPulse ? 'var(--token-error)' : undefined,
              animation: micPulse ? 'token-pulse 600ms ease-in-out 2' : 'none',
            }}
          />

          {/* @ mention hint */}
          <DSButton
            variant="ghost"
            icon={<AtSign size={14} />}
            onClick={() => {
              setValue(prev => prev + '@');
              setMentionOpen(true);
              setMentionFilter('');
              textareaRef.current?.focus();
            }}
            disabled={disabled}
            title="Mention a model or tool"
            style={{
              width: 32, height: 32, padding: 0,
              borderRadius: 'var(--token-radius-md)',
            }}
          />

          {/* Character count when typing */}
          {hasValue && (
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: value.length > 4000 ? 'var(--token-error)' : 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                marginLeft: 'var(--token-space-1)',
                animation: 'token-fade-in 150ms ease',
              }}
            >
              {value.length}
            </span>
          )}
        </div>

        {/* Kbd hint + Send/Stop button */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {!hasValue && !disabled && !isStreaming && (
            <span
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                opacity: focused ? 1 : 0,
                transition: 'opacity 200ms ease',
              }}
            >
              <kbd style={{
                padding: '1px 4px',
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg-secondary)',
                fontSize: 'var(--token-text-2xs)',
              }}>
                ↵
              </kbd>
            </span>
          )}
          {isStreaming ? (
            /* Stop generation button */
            <button
              onClick={onStop}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--token-radius-full)',
                border: '2px solid var(--token-border-strong)',
                background: 'var(--token-bg)',
                color: 'var(--token-text-primary)',
                transition: 'all 200ms ease',
                animation: 'token-pulse 1.5s ease-in-out infinite',
              }}
            >
              <Square size={12} style={{ fill: 'currentColor' }} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!hasValue || disabled}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--token-radius-full)',
                border: 'none',
                background: hasValue ? 'var(--token-text-primary)' : 'var(--token-bg-tertiary)',
                color: hasValue ? 'var(--token-text-inverse)' : 'var(--token-text-disabled)',
                transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                transform: sendAnim ? 'scale(0.85)' : hasValue ? 'scale(1)' : 'scale(0.95)',
                cursor: hasValue && !disabled ? 'pointer' : 'default',
                boxShadow: hasValue ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              <ArrowUp size={16} style={{
                transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
                transform: sendAnim ? 'translateY(-2px)' : 'translateY(0)',
              }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultMentions = [
  { id: 'gpt4o', label: 'GPT-4o', type: 'model' as const },
  { id: 'claude', label: 'Claude 3.5', type: 'model' as const },
  { id: 'web_search', label: 'web_search', type: 'tool' as const },
  { id: 'code_exec', label: 'code_exec', type: 'tool' as const },
];

export function ChatInputDemo() {
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);

  const handleSend = (val: string) => {
    setSentMessages(prev => [...prev, val]);
    setStreaming(true);
    setTimeout(() => setStreaming(false), 3000);
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 520, width: '100%', gap: 'var(--token-space-3)' }}>
      {sentMessages.length > 0 && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
          {sentMessages.map((msg, i) => (
            <div key={i} className="flex justify-end" style={{ animation: 'token-fade-in 200ms ease' }}>
              <div style={{
                background: 'var(--token-user-bubble)',
                color: 'var(--token-user-bubble-text)',
                borderRadius: 'var(--token-radius-2xl)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                maxWidth: '80%',
                fontFamily: 'var(--token-font-sans)',
                fontSize: 'var(--token-text-sm)',
              }}>
                {msg}
              </div>
            </div>
          ))}
        </div>
      )}
      <ChatInput
        placeholder="Ask anything... (try @)"
        onSend={handleSend}
        onStop={() => setStreaming(false)}
        isStreaming={streaming}
        activeModel="GPT-4o"
      />
      {sentMessages.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => { setSentMessages([]); setStreaming(false); }}
            className="cursor-pointer"
            style={{
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              border: 'none', background: 'none',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}
          >
            clear messages
          </button>
        </div>
      )}
    </div>
  );
}
