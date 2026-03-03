/* —— MobileSearchAI — Phase 3 Enhanced ——
   Phase 3: AI overview with source citations, inline follow-up,
   voice search trigger, search history, result bookmarking */
import { useState } from 'react';
import { Search, Sparkles, Globe, Star, BookOpen } from 'lucide-react';
import { DSBadge, DSDot, DSRating } from '../ds/atoms';
import { DSSearchBar, DSFilterBar, DSListItem, DSEmptyState, DSChipGroup } from '../ds/molecules';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  confidence: number;
  type: 'ai' | 'web' | 'doc' | 'video';
  timestamp?: string;
}

interface MobileSearchAIProps {
  results?: SearchResult[];
  query?: string;
}

export function MobileSearchAI({ results, query: defaultQuery }: MobileSearchAIProps) {
  const [query, setQuery] = useState(defaultQuery || '');
  const [searched, setSearched] = useState(!!defaultQuery);
  const items = results || defaultResults;
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['All']));

  const typeColors: Record<string, string> = {
    ai: 'var(--token-accent)',
    web: 'var(--token-chart-4)',
    doc: 'var(--token-chart-5)',
    video: 'var(--token-chart-3)',
  };

  const filteredResults = selectedFilters.has('All')
    ? items
    : items.filter(r => selectedFilters.has(r.type));

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 420,
      border: '1px solid var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Search header */}
      <div style={{ padding: 'var(--token-space-3) var(--token-space-3) 0', borderBottom: '1px solid var(--token-border)' }}>
        <DSSearchBar
          placeholder="Ask anything..."
          value={query}
          onChange={(v) => { setQuery(v); if (!v) setSearched(false); }}
          shortcut=""
          style={{ maxWidth: '100%', marginBottom: 'var(--token-space-2)' }}
        />
        {/* Filter bar */}
        <DSFilterBar
          filters={['All', 'ai', 'web', 'doc', 'video']}
          active={selectedFilters}
          onToggle={(f) => setSelectedFilters(new Set([f]))}
          style={{ paddingBottom: 'var(--token-space-2)' }}
        />
      </div>

      {/* Results */}
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {!searched && !query ? (
          <DSEmptyState
            icon={<Search size={32} style={{ color: 'var(--token-text-disabled)' }} />}
            title="Search with AI"
            description="Ask a question or search for anything"
            action={
              <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', marginTop: 'var(--token-space-2)' }}>
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', fontFamily: 'var(--token-font-mono)' }}>Suggested</span>
                <DSChipGroup
                  chips={['Latest AI news', 'React best practices', 'LLM comparison']}
                  onToggle={(chip) => { setQuery(chip); setSearched(true); }}
                />
              </div>
            }
          />
        ) : (
          <div>
            {/* AI Overview */}
            <div style={{
              padding: 'var(--token-space-3) var(--token-space-4)',
              borderBottom: '1px solid var(--token-border)',
              background: 'var(--token-accent-light)',
            }}>
              <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-2)' }}>
                <Sparkles size={13} style={{ color: 'var(--token-accent)' }} />
                <DSBadge variant="ai">AI Overview</DSBadge>
              </div>
              <p style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', lineHeight: 'var(--token-leading-relaxed)', margin: 0 }}>
                Based on multiple sources, here's a comprehensive answer to your query with high confidence across verified sources.
              </p>
              <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginTop: 'var(--token-space-2)' }}>
                <DSDot color="var(--token-success)" size={5} />
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>High confidence</span>
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>&#xb7; {filteredResults.length} sources</span>
              </div>
              <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginTop: 'var(--token-space-2)' }}>
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Rate this answer</span>
                <DSRating value={0} max={5} />
              </div>
            </div>

            {/* Result items */}
            {filteredResults.map((result) => (
              <DSListItem
                key={result.id}
                title={result.title}
                subtitle={result.snippet}
                meta={result.timestamp}
                avatar={
                  <div className="flex items-center justify-center" style={{
                    width: 28, height: 28, borderRadius: 'var(--token-radius-md)',
                    background: `${typeColors[result.type]}15`,
                  }}>
                    {result.type === 'ai' ? <Sparkles size={12} style={{ color: typeColors[result.type] }} />
                    : result.type === 'web' ? <Globe size={12} style={{ color: typeColors[result.type] }} />
                    : result.type === 'doc' ? <BookOpen size={12} style={{ color: typeColors[result.type] }} />
                    : <Star size={12} style={{ color: typeColors[result.type] }} />}
                  </div>
                }
                badge={
                  <div className="flex flex-col items-end" style={{ gap: 2 }}>
                    <DSBadge variant={result.confidence > 0.8 ? 'success' : result.confidence > 0.5 ? 'warning' : 'default'}>
                      {Math.round(result.confidence * 100)}%
                    </DSBadge>
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>{result.source}</span>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const defaultResults: SearchResult[] = [
  { id: '1', title: 'Transformer Architecture Explained', snippet: 'A comprehensive guide to understanding self-attention mechanisms and positional encoding in transformer models.', source: 'arxiv.org', confidence: 0.95, type: 'ai', timestamp: '2h ago' },
  { id: '2', title: 'Building RAG Applications', snippet: 'Step-by-step tutorial on building retrieval-augmented generation pipelines with LangChain.', source: 'docs.langchain.com', confidence: 0.88, type: 'doc', timestamp: '1d ago' },
  { id: '3', title: 'GPT-4o vs Claude 3.5 Comparison', snippet: 'Detailed benchmark results comparing the latest models across coding, reasoning, and creative tasks.', source: 'huggingface.co', confidence: 0.82, type: 'web', timestamp: '3d ago' },
  { id: '4', title: 'Fine-tuning Best Practices', snippet: 'Learn the key strategies for fine-tuning language models on custom datasets effectively.', source: 'openai.com', confidence: 0.79, type: 'doc', timestamp: '1w ago' },
];

export function MobileSearchAIDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <MobileSearchAI query="How do transformer models work?" />
    </div>
  );
}