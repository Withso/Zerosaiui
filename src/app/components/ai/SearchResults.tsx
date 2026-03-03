/* SearchResults — Enhanced with type filters, highlight matches, AI summary, grouped domains
   Composed from DS atoms (DSBadge)
   Phase 3: result type tabs, query term highlighting, AI-generated summary card */
import { ExternalLink, Globe, FileText, Image, Sparkles, Filter, BookOpen, Code2, Video } from 'lucide-react';
import { DSBadge } from '../ds/atoms';
import { useState } from 'react';

type ResultType = 'all' | 'article' | 'code' | 'video' | 'paper';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  date?: string;
  relevance?: number;
  type?: ResultType;
  favicon?: string;
}

interface SearchResultsProps {
  query?: string;
  results?: SearchResult[];
  totalResults?: number;
  duration?: string;
  aiSummary?: string;
}

export function SearchResults({
  query = 'transformer architecture',
  results,
  totalResults,
  duration,
  aiSummary,
}: SearchResultsProps) {
  const items = results || defaultResults;
  const total = totalResults ?? items.length;
  const time = duration ?? '0.42s';
  const summary = aiSummary ?? defaultSummary;
  const [activeFilter, setActiveFilter] = useState<ResultType>('all');
  const [expandedSummary, setExpandedSummary] = useState(true);

  const filteredItems = activeFilter === 'all' ? items : items.filter(r => r.type === activeFilter);
  const typeCount = (t: ResultType) => t === 'all' ? items.length : items.filter(r => r.type === t).length;

  /* Highlight query terms in text */
  const highlightTerms = (text: string) => {
    if (!query) return text;
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (terms.length === 0) return text;
    const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      terms.includes(part.toLowerCase()) ? (
        <mark key={i} style={{
          background: 'var(--token-accent-light)',
          color: 'var(--token-accent)',
          borderRadius: 2,
          padding: '0 1px',
        }}>{part}</mark>
      ) : part
    );
  };

  const filters: { type: ResultType; icon: React.ReactNode; label: string }[] = [
    { type: 'all', icon: <Globe size={10} />, label: 'All' },
    { type: 'article', icon: <BookOpen size={10} />, label: 'Articles' },
    { type: 'code', icon: <Code2 size={10} />, label: 'Code' },
    { type: 'paper', icon: <FileText size={10} />, label: 'Papers' },
    { type: 'video', icon: <Video size={10} />, label: 'Video' },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 'var(--token-space-3)',
        width: '100%',
      }}
    >
      {/* Search meta */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <Globe size={12} style={{ color: 'var(--token-text-disabled)' }} />
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}
        >
          {total} results for &ldquo;{query}&rdquo; in {time}
        </span>
      </div>

      {/* Type filters */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)', flexWrap: 'wrap' }}>
        {filters.map(f => {
          const count = typeCount(f.type);
          if (f.type !== 'all' && count === 0) return null;
          const isActive = activeFilter === f.type;
          return (
            <button
              key={f.type}
              onClick={() => setActiveFilter(f.type)}
              className="flex items-center cursor-pointer"
              style={{
                gap: 4,
                padding: '3px 8px',
                borderRadius: 'var(--token-radius-full)',
                border: `1px solid ${isActive ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: isActive ? 'var(--token-accent-light)' : 'transparent',
                color: isActive ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-sans)',
                transition: 'all 150ms ease',
              }}
            >
              {f.icon}
              {f.label}
              <span style={{ fontFamily: 'var(--token-font-mono)', opacity: 0.7 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* AI Summary card */}
      {summary && expandedSummary && (
        <div
          style={{
            padding: 'var(--token-space-3)',
            borderRadius: 'var(--token-radius-lg)',
            border: '1px solid var(--token-accent-light)',
            background: 'var(--token-accent-muted, rgba(79,109,128,0.04))',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
            <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
              <Sparkles size={12} style={{ color: 'var(--token-accent)' }} />
              <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-accent)' }}>
                AI Summary
              </span>
            </div>
            <button
              onClick={() => setExpandedSummary(false)}
              className="cursor-pointer"
              style={{
                border: 'none', background: 'transparent',
                color: 'var(--token-text-disabled)', fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              dismiss
            </button>
          </div>
          <p style={{
            margin: 0, fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-relaxed)',
          }}>
            {summary}
          </p>
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
        {filteredItems.map((result) => (
          <div
            key={result.id}
            className="flex flex-col cursor-pointer"
            style={{
              padding: 'var(--token-space-3) var(--token-space-4)',
              borderRadius: 'var(--token-radius-lg)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
              gap: 'var(--token-space-1-5)',
              transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--token-border-strong)';
              e.currentTarget.style.background = 'var(--token-bg-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--token-border)';
              e.currentTarget.style.background = 'var(--token-bg)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* URL line */}
            <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 16, height: 16,
                  borderRadius: 'var(--token-radius-sm)',
                  background: 'var(--token-bg-tertiary)',
                }}
              >
                <Globe size={9} style={{ color: 'var(--token-text-disabled)' }} />
              </div>
              <span
                className="truncate"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                }}
              >
                {result.domain}
              </span>
              {result.type && result.type !== 'all' && (
                <DSBadge variant="default">{result.type}</DSBadge>
              )}
              {result.relevance && result.relevance >= 90 && (
                <span
                  className="flex items-center shrink-0"
                  style={{
                    gap: 2,
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-success)',
                  }}
                >
                  <FileText size={8} />
                  High relevance
                </span>
              )}
              <ExternalLink size={10} style={{ color: 'var(--token-text-disabled)', flexShrink: 0, marginLeft: 'auto' }} />
            </div>

            {/* Title */}
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-accent)',
                lineHeight: 'var(--token-leading-tight)',
              }}
            >
              {highlightTerms(result.title)}
            </span>

            {/* Snippet */}
            <span
              style={{
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-secondary)',
                lineHeight: 'var(--token-leading-normal)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {highlightTerms(result.snippet)}
            </span>

            {/* Date */}
            {result.date && (
              <span
                className="flex items-center"
                style={{
                  gap: 'var(--token-space-1)',
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                }}
              >
                <Image size={8} />
                {result.date}
              </span>
            )}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div style={{
            padding: 'var(--token-space-6)',
            textAlign: 'center',
            color: 'var(--token-text-disabled)',
            fontSize: 'var(--token-text-xs)',
          }}>
            No results match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

const defaultSummary = 'The Transformer is a deep learning architecture introduced in 2017 that uses self-attention mechanisms instead of recurrence. It forms the basis of models like GPT, BERT, and T5, revolutionizing NLP and increasingly other domains.';

const defaultResults: SearchResult[] = [
  {
    id: '1',
    title: 'Attention Is All You Need — Original Transformer Paper',
    url: 'https://arxiv.org/abs/1706.03762',
    domain: 'arxiv.org',
    snippet: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    date: 'Jun 2017',
    relevance: 98,
    type: 'paper',
  },
  {
    id: '2',
    title: 'The Illustrated Transformer — Jay Alammar',
    url: 'https://jalammar.github.io/illustrated-transformer/',
    domain: 'jalammar.github.io',
    snippet: 'A visual and intuitive explanation of the Transformer model architecture, including self-attention, multi-head attention, and positional encoding.',
    date: 'Jun 2018',
    relevance: 95,
    type: 'article',
  },
  {
    id: '3',
    title: 'Transformer (deep learning) — Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)',
    domain: 'en.wikipedia.org',
    snippet: 'A transformer is a deep learning architecture based on the multi-head attention mechanism proposed in the 2017 paper "Attention Is All You Need".',
    date: 'Updated Feb 2025',
    relevance: 82,
    type: 'article',
  },
];

export function SearchResultsDemo() {
  const [query, setQuery] = useState('transformer architecture');

  const queries = [
    'transformer architecture',
    'react performance optimization',
    'machine learning basics',
  ];

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
        {queries.map(q => (
          <button
            key={q}
            onClick={() => setQuery(q)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${query === q ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: query === q ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: query === q ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {q.split(' ').slice(0, 2).join(' ')}...
          </button>
        ))}
      </div>
      <div key={query} style={{ animation: 'token-fade-in 200ms ease' }}>
        <SearchResults />
      </div>
    </div>
  );
}
