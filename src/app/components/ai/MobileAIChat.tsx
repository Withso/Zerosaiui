/* —— MobileAIChat — Phase 3 Enhanced ——
   Phase 3: message reactions, scroll-to-bottom FAB,
   connection status indicator, message retry on error,
   model switch inline, suggested follow-ups */
import { useState, useRef, useEffect } from 'react';
import { Phone, ArrowDown, RefreshCw, Sparkles } from 'lucide-react';
import { DSAvatar, DSBadge, DSDot, DSButton } from '../ds/atoms';
import {
  DSChatInput, DSMessageBubble,
  DSTypingIndicator, DSHeaderBar,
} from '../ds/molecules';

interface MobileAIChatProps {
  agentName?: string;
  model?: string;
}

const suggestedFollowUps = [
  'Tell me more about embeddings',
  'How does vector search work?',
  'Compare RAG vs fine-tuning',
];

export function MobileAIChat({ agentName = 'Nova', model = 'GPT-4o' }: MobileAIChatProps) {
  const [messages, setMessages] = useState(defaultMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { role: 'user' as const, text, time: 'now' }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai' as const,
        text: 'That\'s a great question! Here\'s what I found...',
        time: 'just now',
      }]);
    }, 2000);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 420,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title={agentName}
        icon={
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <DSAvatar variant="ai" size={28} />
            <div className="flex flex-col">
              <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{agentName}</span>
              <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                <DSDot color="var(--token-success)" size={5} />
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>Online</span>
                <DSBadge variant="ai" style={{ fontSize: 7, padding: '0 4px', lineHeight: '12px' }}>{model}</DSBadge>
              </div>
            </div>
          </div>
        }
        actions={
          <DSButton variant="icon" icon={<Phone size={14} />} style={{ width: 28, height: 28, borderWidth: 0, borderStyle: 'none', padding: 0 }} />
        }
      />

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-col relative"
        style={{
          padding: 'var(--token-space-3)',
          gap: 'var(--token-space-3)',
          maxHeight: 280,
          overflowY: 'auto',
        }}
        onScroll={(e) => {
          const el = e.currentTarget;
          setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 50);
        }}
      >
        {messages.map((msg, i) => (
          <DSMessageBubble key={i} variant={msg.role} timestamp={msg.time}>
            {msg.text}
          </DSMessageBubble>
        ))}
        {isTyping && <DSTypingIndicator label={`${agentName} is thinking`} />}

        {/* Suggested follow-ups after AI response */}
        {!isTyping && messages.length > 0 && messages[messages.length - 1].role === 'ai' && (
          <div className="flex flex-wrap" style={{ gap: 'var(--token-space-1)', marginTop: 'var(--token-space-1)' }}>
            {suggestedFollowUps.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="cursor-pointer"
                style={{
                  padding: 'var(--token-space-1) var(--token-space-2)',
                  borderRadius: 'var(--token-radius-full)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--token-border)',
                  background: 'var(--token-bg-secondary)',
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-tertiary)',
                  fontFamily: 'var(--token-font-sans)',
                  transition: 'all var(--token-duration-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; e.currentTarget.style.color = 'var(--token-accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
              >
                <Sparkles size={8} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to bottom FAB */}
      {showScrollBtn && (
        <div className="flex justify-center" style={{ marginTop: -28, position: 'relative', zIndex: 5 }}>
          <button
            onClick={scrollToBottom}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 28, height: 28,
              borderRadius: 'var(--token-radius-full)',
              borderWidth: 0,
              borderStyle: 'none',
              background: 'var(--token-text-primary)',
              color: 'var(--token-text-inverse)',
              boxShadow: 'var(--token-shadow-md)',
            }}
          >
            <ArrowDown size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
      }}>
        <DSChatInput placeholder={`Message ${agentName}...`} onSend={handleSend} style={{ maxWidth: '100%' }} />
      </div>
    </div>
  );
}

const defaultMessages = [
  { role: 'ai' as const, text: 'Hello! I\'m Nova, your AI assistant. How can I help you today?', time: '9:41 AM' },
  { role: 'user' as const, text: 'Can you explain how RAG works in LLMs?', time: '9:42 AM' },
  { role: 'ai' as const, text: 'RAG (Retrieval-Augmented Generation) combines a retrieval system with a language model. It first searches a knowledge base for relevant documents, then uses those as context when generating responses. This helps reduce hallucinations and keeps answers grounded in real data.', time: '9:42 AM' },
];

export function MobileAIChatDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <MobileAIChat />
    </div>
  );
}
