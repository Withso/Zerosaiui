/* —— AIContextPanel — Phase 3 Enhanced ——
   Phase 3: context compression indicator, auto-optimize suggestion,
   priority ordering visual, search within context, token cost estimate */
import { useState } from 'react';
import { Layers, FileText, MessageSquare, Settings, Database, Upload, Trash2, Sparkles, TrendingDown, Search } from 'lucide-react';
import { DSButton, DSBadge, DSSelect, DSDot } from '../ds/atoms';
import { DSColorBar, DSLegendItem, DSCollapsible } from '../ds/atoms-extra';
import { DSToggleRow, DSHeaderBar, DSStatDisplay } from '../ds/molecules';

interface ContextSource {
  name: string;
  tokens: number;
  color: string;
  type: 'system' | 'documents' | 'history' | 'tools' | 'user';
  enabled: boolean;
  compressible?: boolean;
  priority?: number;
}

interface AIContextPanelProps {
  sources?: ContextSource[];
  maxTokens?: number;
  model?: string;
}

const modelLimits: Record<string, number> = {
  'GPT-4o': 128000,
  'Claude 3.5': 200000,
  'Gemini Pro': 1000000,
  'Llama 3.1': 128000,
};

/* —— Cost per 1k tokens (input) by model —— */
const modelCostPer1k: Record<string, number> = {
  'GPT-4o': 0.005,
  'Claude 3.5': 0.003,
  'Gemini Pro': 0.00025,
  'Llama 3.1': 0.0003,
};

export function AIContextPanel({ sources, maxTokens: maxTokensProp, model: modelProp }: AIContextPanelProps) {
  const [items, setItems] = useState(sources || defaultSources);
  const [selectedModel, setSelectedModel] = useState(modelProp || 'GPT-4o');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptimize, setShowOptimize] = useState(false);
  const maxTokens = maxTokensProp || modelLimits[selectedModel] || 128000;
  const costPer1k = modelCostPer1k[selectedModel] || 0.005;
  const enabledItems = items.filter(s => s.enabled);
  const totalUsed = enabledItems.reduce((s, i) => s + i.tokens, 0);
  const remaining = maxTokens - totalUsed;
  const pct = Math.round((totalUsed / maxTokens) * 100);
  const estimatedCost = (totalUsed / 1000) * costPer1k;

  const toggleSource = (name: string) => {
    setItems(prev => prev.map(s => s.name === name ? { ...s, enabled: !s.enabled } : s));
  };

  const filteredItems = searchQuery
    ? items.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  /* —— Compression estimate —— */
  const compressibleTokens = enabledItems.filter(s => s.compressible).reduce((s, i) => s + i.tokens, 0);
  const potentialSavings = Math.round(compressibleTokens * 0.4);

  const typeIcons: Record<string, React.ReactNode> = {
    system: <Settings size={12} style={{ color: 'var(--token-text-tertiary)' }} />,
    documents: <FileText size={12} style={{ color: 'var(--token-chart-4)' }} />,
    history: <MessageSquare size={12} style={{ color: 'var(--token-chart-6)' }} />,
    tools: <Database size={12} style={{ color: 'var(--token-chart-5)' }} />,
    user: <Layers size={12} style={{ color: 'var(--token-chart-3)' }} />,
  };

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: 380,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      borderRadius: 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="Context Window"
        icon={<Layers size={16} style={{ color: 'var(--token-text-tertiary)' }} />}
        actions={
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            <DSBadge variant={pct > 85 ? 'warning' : 'default'}>{pct}%</DSBadge>
          </div>
        }
      />

      <div style={{ padding: 'var(--token-space-4)' }}>
        {/* Model selector */}
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)' }}>Model</span>
          <DSSelect
            options={Object.keys(modelLimits)}
            value={selectedModel}
            onChange={(v) => setSelectedModel(v)}
            style={{ width: 150 }}
          />
        </div>

        {/* Stats — now includes cost estimate */}
        <div className="flex" style={{ gap: 'var(--token-space-4)', marginBottom: 'var(--token-space-4)' }}>
          <DSStatDisplay label="Used" value={`${(totalUsed / 1000).toFixed(1)}k`} />
          <DSStatDisplay label="Remaining" value={`${(remaining / 1000).toFixed(1)}k`} />
          <DSStatDisplay label="Cost" value={`$${estimatedCost.toFixed(3)}`} />
        </div>

        {/* Color bar */}
        <DSColorBar
          segments={enabledItems.map(s => ({ value: s.tokens, color: s.color }))}
          total={maxTokens}
          height={10}
        />

        {/* Legend */}
        <div className="flex flex-wrap" style={{ gap: 'var(--token-space-3)', marginTop: 'var(--token-space-2)', marginBottom: 'var(--token-space-3)' }}>
          {enabledItems.map(s => (
            <DSLegendItem
              key={s.name}
              color={s.color}
              label={s.name}
              value={`${(s.tokens / 1000).toFixed(1)}k`}
            />
          ))}
          <DSLegendItem color="var(--token-bg-tertiary)" label="Available" value={`${(remaining / 1000).toFixed(1)}k`} />
        </div>

        {/* Optimize suggestion */}
        {potentialSavings > 0 && (
          <button
            onClick={() => setShowOptimize(!showOptimize)}
            className="flex items-center w-full cursor-pointer"
            style={{
              gap: 'var(--token-space-2)',
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              borderWidth: 0,
              borderStyle: 'none',
              background: 'var(--token-success-light)',
              marginBottom: 'var(--token-space-3)',
              fontFamily: 'var(--token-font-sans)',
              textAlign: 'left',
              transition: 'opacity var(--token-duration-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <TrendingDown size={12} style={{ color: 'var(--token-success)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-success)', flex: 1 }}>
              Compress to save ~{(potentialSavings / 1000).toFixed(1)}k tokens
            </span>
            <Sparkles size={10} style={{ color: 'var(--token-success)' }} />
          </button>
        )}

        {/* Search filter */}
        <div className="flex items-center" style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          background: 'var(--token-bg-secondary)',
          marginBottom: 'var(--token-space-2)',
        }}>
          <Search size={11} style={{ color: 'var(--token-text-disabled)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter sources..."
            style={{
              flex: 1,
              borderWidth: 0,
              borderStyle: 'none',
              background: 'transparent',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-sans)',
              color: 'var(--token-text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Source toggles */}
        <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
          {filteredItems.map(source => (
            <DSCollapsible
              key={source.name}
              title={source.name}
              icon={typeIcons[source.type]}
              meta={
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                  {source.compressible && (
                    <span style={{ fontSize: '8px', color: 'var(--token-success)', fontFamily: 'var(--token-font-mono)' }}>
                      compressible
                    </span>
                  )}
                  <DSDot color={source.color} size={6} />
                  <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
                    {(source.tokens / 1000).toFixed(1)}k
                  </span>
                </div>
              }
              style={{ borderWidth: 0, borderStyle: 'none', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--token-border)', borderRadius: 0 }}
            >
              <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
                <DSToggleRow
                  label="Include in context"
                  description={`${source.tokens.toLocaleString()} tokens`}
                  on={source.enabled}
                  onChange={() => toggleSource(source.name)}
                  style={{ maxWidth: '100%' }}
                />
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                  <DSButton variant="ghost" icon={<Upload size={11} />} style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 'auto' }}>
                    Update
                  </DSButton>
                  <DSButton variant="ghost" icon={<Trash2 size={11} />} style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 'auto', color: 'var(--token-error)' }}>
                    Remove
                  </DSButton>
                </div>
              </div>
            </DSCollapsible>
          ))}
        </div>
      </div>
    </div>
  );
}

const defaultSources: ContextSource[] = [
  { name: 'System Prompt', tokens: 2400, color: '#6b7280', type: 'system', enabled: true, compressible: false, priority: 1 },
  { name: 'Project Docs', tokens: 18600, color: 'var(--token-chart-4)', type: 'documents', enabled: true, compressible: true, priority: 2 },
  { name: 'Chat History', tokens: 12200, color: 'var(--token-chart-6)', type: 'history', enabled: true, compressible: true, priority: 3 },
  { name: 'Tool Schemas', tokens: 3100, color: 'var(--token-chart-5)', type: 'tools', enabled: true, compressible: false, priority: 4 },
  { name: 'User Preferences', tokens: 800, color: 'var(--token-chart-3)', type: 'user', enabled: true, compressible: false, priority: 5 },
];

export function AIContextPanelDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <AIContextPanel />
    </div>
  );
}
