/* PromptSuggestions — Enhanced with categories, contextual refresh, keyboard shortcuts
   Composed from DS molecules (DSPromptCard)
   Phase 3: category tabs, personalized/contextual grouping, shortcut hints, refresh */
import { ArrowUpRight, Code, FileText, Lightbulb, Palette, Check, RefreshCw, Sparkles, Database, MessageSquare } from 'lucide-react';
import { DSPromptCard } from '../ds/molecules';
import { useState } from 'react';

type Category = 'all' | 'code' | 'writing' | 'creative' | 'data';

interface PromptSuggestion {
  icon: React.ReactNode;
  text: string;
  category?: Category;
  shortcut?: string;
}

interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[];
  onSelect?: (text: string) => void;
  showCategories?: boolean;
  showShortcuts?: boolean;
  onRefresh?: () => void;
}

export function PromptSuggestions({
  suggestions,
  onSelect,
  showCategories = false,
  showShortcuts = false,
  onRefresh,
}: PromptSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered = activeCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.category === activeCategory);

  const categories: { key: Category; icon: React.ReactNode; label: string }[] = [
    { key: 'all', icon: <Sparkles size={10} />, label: 'All' },
    { key: 'code', icon: <Code size={10} />, label: 'Code' },
    { key: 'writing', icon: <FileText size={10} />, label: 'Writing' },
    { key: 'creative', icon: <Palette size={10} />, label: 'Creative' },
    { key: 'data', icon: <Database size={10} />, label: 'Data' },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2-5)' }}>
      {/* Category filter + refresh */}
      {showCategories && (
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            {categories.map(cat => {
              const count = cat.key === 'all' ? suggestions.length : suggestions.filter(s => s.category === cat.key).length;
              if (cat.key !== 'all' && count === 0) return null;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center cursor-pointer"
                  style={{
                    gap: 3,
                    padding: '2px 8px',
                    borderRadius: 'var(--token-radius-full)',
                    border: `1px solid ${isActive ? 'var(--token-accent)' : 'var(--token-border)'}`,
                    background: isActive ? 'var(--token-accent-light)' : 'transparent',
                    color: isActive ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                    fontSize: 'var(--token-text-2xs)',
                    fontFamily: 'var(--token-font-sans)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center cursor-pointer"
              style={{
                gap: 4,
                border: 'none', background: 'transparent',
                color: 'var(--token-text-disabled)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
            >
              <RefreshCw size={10} />
              refresh
            </button>
          )}
        </div>
      )}

      {/* Suggestion grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--token-space-2)',
        }}
      >
        {filtered.map((s, i) => (
          <div key={i} style={{
            animation: `token-fade-in 300ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
            position: 'relative',
          }}>
            <DSPromptCard
              icon={s.icon}
              title={s.text}
              onClick={() => onSelect?.(s.text)}
            />
            {showShortcuts && s.shortcut && (
              <span style={{
                position: 'absolute',
                bottom: 6, right: 8,
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                color: 'var(--token-text-disabled)',
                padding: '0 3px',
                borderRadius: 'var(--token-radius-sm)',
                background: 'var(--token-bg-secondary)',
                border: '1px solid var(--token-border)',
              }}>
                {s.shortcut}
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--token-space-4)',
          fontSize: 'var(--token-text-xs)',
          color: 'var(--token-text-disabled)',
        }}>
          No suggestions in this category.
        </div>
      )}
    </div>
  );
}

const sampleSuggestions: PromptSuggestion[] = [
  { icon: <Code size={16} />, text: 'Write a React hook for debouncing', category: 'code', shortcut: '⌘1' },
  { icon: <FileText size={16} />, text: 'Summarize this document', category: 'writing', shortcut: '⌘2' },
  { icon: <Lightbulb size={16} />, text: 'Brainstorm startup ideas', category: 'creative', shortcut: '⌘3' },
  { icon: <Palette size={16} />, text: 'Design a color palette', category: 'creative', shortcut: '⌘4' },
  { icon: <Database size={16} />, text: 'Analyze this CSV data', category: 'data' },
  { icon: <MessageSquare size={16} />, text: 'Draft a professional email', category: 'writing' },
];

export function PromptSuggestionsDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [suggestions, setSuggestions] = useState(sampleSuggestions);

  const handleSelect = (text: string) => {
    setSelected(text);
    setSent(false);
    setTimeout(() => setSent(true), 600);
  };

  const handleReset = () => {
    setSelected(null);
    setSent(false);
  };

  const handleRefresh = () => {
    /* Simulate shuffling suggestions */
    setSuggestions(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <PromptSuggestions
        suggestions={suggestions}
        onSelect={handleSelect}
        showCategories
        showShortcuts
        onRefresh={handleRefresh}
      />
      {selected && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: sent ? 'var(--token-success-light)' : 'var(--token-bg-hover)',
            border: `1px solid ${sent ? 'var(--token-success)' : 'var(--token-border)'}`,
            fontSize: 'var(--token-text-xs)',
            color: sent ? 'var(--token-success)' : 'var(--token-text-secondary)',
            fontFamily: 'var(--token-font-sans)',
            animation: 'token-fade-in 200ms ease',
            transition: 'all 300ms ease',
          }}
        >
          {sent && <Check size={12} />}
          <span style={{ flex: 1 }}>
            {sent ? 'Sent: ' : 'Selected: '}<span style={{ fontWeight: 500 }}>{selected}</span>
          </span>
          {sent && (
            <button
              onClick={handleReset}
              className="cursor-pointer"
              style={{
                border: 'none', background: 'none',
                fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)',
                fontFamily: 'var(--token-font-mono)',
                textDecoration: 'underline', textUnderlineOffset: 2,
              }}
            >
              reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
