/* —— Autocomplete — Phase 3 Enhanced —— */
import { useState, useEffect, useRef } from 'react';
import { DSKbd, DSBadge } from '../ds/atoms';
import { Search, Clock, Sparkles, X } from 'lucide-react';

/* —— Types —— */
interface SuggestionItem {
  text: string;
  category?: 'recent' | 'ai' | 'command';
}

interface AutocompleteProps {
  suggestions?: string[];
  richSuggestions?: SuggestionItem[];
  placeholder?: string;
  onAccept?: (text: string) => void;
  showDropdown?: boolean;
  maxDropdownItems?: number;
}

export function Autocomplete({
  suggestions,
  richSuggestions,
  placeholder = 'Start typing...',
  onAccept,
  showDropdown = true,
  maxDropdownItems = 6,
}: AutocompleteProps) {
  const plainItems = suggestions || defaultSuggestions;
  const items: SuggestionItem[] = richSuggestions || plainItems.map(text => ({ text }));

  const [value, setValue] = useState('');
  const [ghost, setGhost] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  /* —— Ghost text from best match —— */
  useEffect(() => {
    if (!value) {
      setGhost('');
      return;
    }
    const lower = value.toLowerCase();
    const match = items.find(s => s.text.toLowerCase().startsWith(lower));
    setGhost(match ? match.text.slice(value.length) : '');
  }, [value, items]);

  /* —— Filtered dropdown items —— */
  const filtered = value
    ? items.filter(s => s.text.toLowerCase().includes(value.toLowerCase())).slice(0, maxDropdownItems)
    : items.slice(0, maxDropdownItems);

  const showDropdownList = showDropdown && focused && filtered.length > 0;

  /* —— Accept a suggestion —— */
  const acceptSuggestion = (text: string) => {
    setValue(text);
    setGhost('');
    setSelectedIdx(-1);
    onAccept?.(text);
    inputRef.current?.blur();
  };

  /* —— Keyboard navigation —— */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && ghost) {
      e.preventDefault();
      acceptSuggestion(value + ghost);
      return;
    }

    if (!showDropdownList) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      acceptSuggestion(filtered[selectedIdx].text);
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  /* —— Category icon helper —— */
  const getCategoryIcon = (cat?: string) => {
    if (cat === 'recent') return <Clock size={11} style={{ color: 'var(--token-text-disabled)' }} />;
    if (cat === 'ai') return <Sparkles size={11} style={{ color: 'var(--token-accent)' }} />;
    if (cat === 'command') return <Search size={11} style={{ color: 'var(--token-text-tertiary)' }} />;
    return null;
  };

  /* —— Clear button —— */
  const handleClear = () => {
    setValue('');
    setGhost('');
    setSelectedIdx(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        position: 'relative',
        fontFamily: 'var(--token-font-sans)',
        width: '100%',
      }}
    >
      {/* Ghost layer */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 'var(--token-space-3) var(--token-space-4)',
          paddingLeft: 'calc(var(--token-space-4) + 20px)',
          fontSize: 'var(--token-text-base)',
          lineHeight: 'var(--token-leading-normal)',
          pointerEvents: 'none',
          whiteSpace: 'pre',
          overflow: 'hidden',
          borderRadius: 'var(--token-radius-lg)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'transparent',
        }}
      >
        <span style={{ visibility: 'hidden' }}>{value}</span>
        <span style={{ color: 'var(--token-text-disabled)' }}>{ghost}</span>
      </div>

      {/* Search icon */}
      <div
        style={{
          position: 'absolute',
          left: 'var(--token-space-3)',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: focused ? 'var(--token-accent)' : 'var(--token-text-disabled)',
          transition: 'color var(--token-duration-fast)',
          display: 'flex',
        }}
      >
        <Search size={15} />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={value}
        onChange={e => { setValue(e.target.value); setSelectedIdx(-1); }}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--token-space-3) var(--token-space-4)',
          paddingLeft: 'calc(var(--token-space-4) + 20px)',
          paddingRight: value ? 'calc(var(--token-space-4) + 24px)' : 'var(--token-space-4)',
          fontSize: 'var(--token-text-base)',
          lineHeight: 'var(--token-leading-normal)',
          fontFamily: 'var(--token-font-sans)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focused ? 'var(--token-accent)' : 'var(--token-border)',
          borderRadius: showDropdownList ? 'var(--token-radius-lg) var(--token-radius-lg) 0 0' : 'var(--token-radius-lg)',
          background: 'var(--token-bg)',
          color: 'var(--token-text-primary)',
          outline: 'none',
          transition: 'border-color 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: focused ? '0 0 0 3px rgba(79,109,128,0.12)' : 'none',
          position: 'relative',
          caretColor: 'var(--token-accent)',
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center cursor-pointer"
          style={{
            position: 'absolute',
            right: 'var(--token-space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            height: 20,
            borderRadius: 'var(--token-radius-full)',
            borderWidth: 0,
            borderStyle: 'none',
            background: 'var(--token-bg-tertiary)',
            color: 'var(--token-text-tertiary)',
            padding: 0,
            transition: 'background var(--token-duration-fast)',
          }}
        >
          <X size={11} />
        </button>
      )}

      {/* Dropdown suggestions */}
      {showDropdownList && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-border)',
            borderTopWidth: 0,
            borderRadius: '0 0 var(--token-radius-lg) var(--token-radius-lg)',
            background: 'var(--token-bg)',
            boxShadow: 'var(--token-shadow-md)',
            overflow: 'hidden',
            animation: 'token-fade-in 120ms ease',
          }}
        >
          {filtered.map((item, i) => {
            const isSelected = selectedIdx === i;
            return (
              <button
                key={item.text}
                onClick={() => acceptSuggestion(item.text)}
                className="flex items-center w-full cursor-pointer"
                style={{
                  gap: 'var(--token-space-2)',
                  padding: 'var(--token-space-2) var(--token-space-3)',
                  borderWidth: 0,
                  borderStyle: 'none',
                  borderBottomWidth: i < filtered.length - 1 ? '1px' : 0,
                  borderBottomStyle: i < filtered.length - 1 ? 'solid' : 'none',
                  borderBottomColor: i < filtered.length - 1 ? 'var(--token-border-subtle)' : 'transparent',
                  background: isSelected ? 'var(--token-bg-hover)' : 'transparent',
                  fontFamily: 'var(--token-font-sans)',
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-primary)',
                  textAlign: 'left' as const,
                  transition: 'background var(--token-duration-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--token-bg-hover)';
                  setSelectedIdx(i);
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {getCategoryIcon(item.category)}
                <span className="flex-1 truncate">{item.text}</span>
                {item.category === 'ai' && (
                  <DSBadge variant="ai" style={{ fontSize: '9px', padding: '0 4px' }}>AI</DSBadge>
                )}
              </button>
            );
          })}

          {/* Footer hint */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: 'var(--token-space-1-5) var(--token-space-3)',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'var(--token-border-subtle)',
              background: 'var(--token-bg-secondary)',
            }}
          >
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {filtered.length} suggestions
            </span>
            <span className="flex items-center" style={{
              gap: 'var(--token-space-1)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              <DSKbd>↑↓</DSKbd> navigate <DSKbd>↵</DSKbd> select
            </span>
          </div>
        </div>
      )}

      {/* Tab hint when ghost visible and dropdown hidden */}
      {ghost && !showDropdownList && (
        <div
          style={{
            marginTop: 'var(--token-space-2)',
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          Press <DSKbd>Tab</DSKbd> to accept
        </div>
      )}
    </div>
  );
}

const defaultSuggestions = [
  'Write a React component with TypeScript',
  'Write a Python script to process CSV files',
  'Write a SQL query to find duplicates',
  'Explain how transformers work',
  'Create a REST API endpoint',
  'Build a responsive navigation bar',
  'Design a database schema for a blog',
  'Summarize this research paper',
];

export function AutocompleteDemo() {
  const [accepted, setAccepted] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      <Autocomplete
        placeholder="Write a..."
        richSuggestions={[
          { text: 'Write a React component with TypeScript', category: 'ai' },
          { text: 'Write a Python script to process CSV files', category: 'recent' },
          { text: 'Write a SQL query to find duplicates', category: 'recent' },
          { text: 'Explain how transformers work', category: 'ai' },
          { text: 'Create a REST API endpoint', category: 'command' },
          { text: 'Build a responsive navigation bar' },
          { text: 'Design a database schema for a blog' },
          { text: 'Summarize this research paper', category: 'ai' },
        ]}
        onAccept={(text) => setAccepted(text)}
      />
      {accepted && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--token-accent)',
          background: 'var(--token-bg-hover)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-secondary)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Accepted: {accepted}
        </div>
      )}
    </div>
  );
}
