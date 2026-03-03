import { ArrowRight, MessageCircle, X, RefreshCw, Send, Keyboard } from 'lucide-react';
import { DSDot } from '../ds/atoms';
import { useState, useRef, useEffect, useCallback } from 'react';

/* —————————————————————————————————————————————————————
   FollowUpBar — enhanced with category filter tabs,
   custom input, keyboard navigation, dismiss, loading state
   ————————————————————————————————————————————————————— */

interface FollowUp {
  text: string;
  type?: 'question' | 'action' | 'explore';
}

interface FollowUpBarProps {
  followUps?: FollowUp[];
  onSelect?: (text: string) => void;
  onRefresh?: () => void;
  onCustomSubmit?: (text: string) => void;
  loading?: boolean;
  showFilters?: boolean;
  showCustomInput?: boolean;
  showKeyboardHints?: boolean;
}

type FilterType = 'all' | 'question' | 'action' | 'explore';

const typeLabels: Record<string, string> = {
  all: 'All',
  question: 'Questions',
  action: 'Actions',
  explore: 'Explore',
};

const typeDotColors: Record<string, string> = {
  question: 'var(--token-accent)',
  action: 'var(--token-success)',
  explore: 'var(--token-warning)',
};

export function FollowUpBar({
  followUps,
  onSelect,
  onRefresh,
  onCustomSubmit,
  loading = false,
  showFilters = false,
  showCustomInput = false,
  showKeyboardHints = false,
}: FollowUpBarProps) {
  const items = followUps || defaultFollowUps;
  const [selected, setSelected] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [customText, setCustomText] = useState('');
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  /* — Filter items — */
  const filteredItems = items
    .map((item, originalIdx) => ({ ...item, originalIdx }))
    .filter(item => !dismissed.has(item.originalIdx))
    .filter(item => activeFilter === 'all' || item.type === activeFilter);

  /* — Keyboard navigation — */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && focusedIdx < filteredItems.length) {
      e.preventDefault();
      const item = filteredItems[focusedIdx];
      setSelected(item.originalIdx);
      onSelect?.(item.text);
    }
  }, [filteredItems, focusedIdx, onSelect]);

  const handleDismiss = (originalIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(prev => new Set(prev).add(originalIdx));
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onCustomSubmit?.(customText.trim());
      onSelect?.(customText.trim());
      setCustomText('');
    }
  };

  const filterTypes: FilterType[] = ['all', 'question', 'action', 'explore'];

  return (
    <div
      ref={containerRef}
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 'var(--token-space-2)',
        width: '100%',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* — Header with label + refresh — */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <MessageCircle size={12} style={{ color: 'var(--token-text-disabled)' }} />
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Follow-up suggestions
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {showKeyboardHints && (
            <span
              className="flex items-center"
              style={{
                gap: 'var(--token-space-1)',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              <Keyboard size={10} />
              <span style={{ opacity: 0.7 }}>arrows + enter</span>
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="cursor-pointer flex items-center justify-center"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--token-text-disabled)',
                padding: 'var(--token-space-1)',
                borderRadius: 'var(--token-radius-sm)',
                transition: 'color var(--token-duration-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
              title="Refresh suggestions"
            >
              <RefreshCw size={12} style={{ animation: loading ? 'token-spin 1s linear infinite' : 'none' }} />
            </button>
          )}
        </div>
      </div>

      {/* — Filter tabs — */}
      {showFilters && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-1)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          {filterTypes.map(ft => {
            const isActive = activeFilter === ft;
            return (
              <button
                key={ft}
                onClick={() => { setActiveFilter(ft); setFocusedIdx(-1); }}
                className="cursor-pointer"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-sans)',
                  padding: 'var(--token-space-1) var(--token-space-2)',
                  borderRadius: 'var(--token-radius-sm)',
                  border: `1px solid ${isActive ? 'var(--token-accent)' : 'var(--token-border)'}`,
                  background: isActive ? 'var(--token-accent)' : 'transparent',
                  color: isActive ? 'var(--token-accent-fg)' : 'var(--token-text-tertiary)',
                  transition: 'all var(--token-duration-fast)',
                  textTransform: 'capitalize',
                }}
              >
                {typeLabels[ft]}
              </button>
            );
          })}
        </div>
      )}

      {/* — Loading skeleton — */}
      {loading && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                height: 40,
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-bg-tertiary)',
                animation: `token-shimmer 1.5s ease-in-out infinite`,
                animationDelay: `${i * 100}ms`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* — Suggestions — */}
      {!loading && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
          {filteredItems.length === 0 && (
            <div
              style={{
                padding: 'var(--token-space-3)',
                textAlign: 'center',
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-disabled)',
              }}
            >
              No suggestions for this category
            </div>
          )}
          {filteredItems.map((item, i) => {
            const isSelected = selected === item.originalIdx;
            const isFocused = focusedIdx === i;
            return (
              <button
                key={item.originalIdx}
                onClick={() => { setSelected(item.originalIdx); onSelect?.(item.text); }}
                className="flex items-center w-full cursor-pointer"
                style={{
                  gap: 'var(--token-space-2-5)',
                  padding: 'var(--token-space-2) var(--token-space-3)',
                  borderRadius: 'var(--token-radius-md)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: isSelected ? 'var(--token-accent)' : isFocused ? 'var(--token-border-strong)' : 'var(--token-border)',
                  background: isSelected ? 'var(--token-bg-hover)' : isFocused ? 'var(--token-bg-hover)' : 'var(--token-bg)',
                  fontFamily: 'var(--token-font-sans)',
                  textAlign: 'left',
                  transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
                  opacity: selected !== null && !isSelected ? 0.5 : 1,
                  transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                  animation: `token-fade-in 200ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--token-border-strong)';
                    e.currentTarget.style.background = 'var(--token-bg-hover)';
                  }
                  setFocusedIdx(i);
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--token-border)';
                    e.currentTarget.style.background = 'var(--token-bg)';
                  }
                }}
              >
                <DSDot
                  color={typeDotColors[item.type || 'question'] || 'var(--token-accent)'}
                  size={5}
                />
                <span
                  className="flex-1"
                  style={{
                    fontSize: 'var(--token-text-sm)',
                    color: isSelected ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                    lineHeight: 'var(--token-leading-tight)',
                  }}
                >
                  {item.text}
                </span>
                {/* — Dismiss button — */}
                {!isSelected && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleDismiss(item.originalIdx, e)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDismiss(item.originalIdx, e as any); } }}
                    className="cursor-pointer flex items-center justify-center"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--token-text-disabled)',
                      padding: 2,
                      borderRadius: 'var(--token-radius-sm)',
                      opacity: 0,
                      transition: 'opacity var(--token-duration-fast)',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.color = 'var(--token-text-tertiary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                    title="Dismiss"
                  >
                    <X size={10} />
                  </span>
                )}
                <ArrowRight
                  size={12}
                  style={{
                    color: isSelected ? 'var(--token-accent)' : 'var(--token-text-disabled)',
                    flexShrink: 0,
                    opacity: isSelected ? 1 : 0.5,
                    transition: 'all 180ms ease',
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* — Custom follow-up input — */}
      {showCustomInput && !loading && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            marginTop: 'var(--token-space-1)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); handleCustomSubmit(); } }}
            placeholder="Ask your own follow-up..."
            style={{
              flex: 1,
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-primary)',
              outline: 'none',
              transition: 'border-color var(--token-duration-fast)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--token-accent)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--token-border)'; }}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customText.trim()}
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--token-radius-md)',
              border: 'none',
              background: customText.trim() ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
              color: customText.trim() ? 'var(--token-accent-fg)' : 'var(--token-text-disabled)',
              transition: 'all var(--token-duration-fast)',
              flexShrink: 0,
              opacity: customText.trim() ? 1 : 0.5,
            }}
          >
            <Send size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

const defaultFollowUps: FollowUp[] = [
  { text: 'Can you explain the attention mechanism in more detail?', type: 'question' },
  { text: 'Show me a code implementation of this', type: 'action' },
  { text: 'How does this compare to RNNs and LSTMs?', type: 'explore' },
  { text: 'What are the computational trade-offs?', type: 'question' },
  { text: 'Generate a visualization of the architecture', type: 'action' },
];

export function FollowUpBarDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setPicked(null);
    setTimeout(() => setIsLoading(false), 1200);
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <FollowUpBar
        onSelect={(text) => setPicked(text)}
        onRefresh={handleRefresh}
        onCustomSubmit={(text) => setPicked(text)}
        loading={isLoading}
        showFilters
        showCustomInput
        showKeyboardHints
      />
      {picked && (
        <div className="flex justify-end" style={{ animation: 'token-fade-in 200ms ease' }}>
          <div style={{
            background: 'var(--token-user-bubble)',
            color: 'var(--token-user-bubble-text)',
            borderRadius: 'var(--token-radius-2xl)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            maxWidth: '85%',
            fontFamily: 'var(--token-font-sans)',
            fontSize: 'var(--token-text-sm)',
          }}>
            {picked}
          </div>
        </div>
      )}
    </div>
  );
}