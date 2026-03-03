/* ModelSelector — Enhanced with capability tags, pricing, latency indicators
   Composed from DS atoms (DSBadge)
   Phase 3: model specs, capability pills, cost indicator, context size bar */
import { useState } from 'react';
import { ChevronDown, Check, Sparkles, Zap, Brain, DollarSign, Clock, Gauge } from 'lucide-react';
import { DSBadge } from '../ds/atoms';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  context: number;
  capabilities?: string[];
  costTier?: 'free' | 'low' | 'medium' | 'high';
  latency?: 'fast' | 'medium' | 'slow';
}

interface ModelSelectorProps {
  models: Model[];
  selectedId: string;
  onSelect?: (id: string) => void;
}

const costColors: Record<string, string> = {
  free: 'var(--token-success)',
  low: 'var(--token-success)',
  medium: 'var(--token-warning)',
  high: 'var(--token-error)',
};

const costLabels: Record<string, string> = {
  free: 'Free',
  low: '$',
  medium: '$$',
  high: '$$$',
};

const latencyIcons: Record<string, { color: string; label: string }> = {
  fast: { color: 'var(--token-success)', label: 'Fast' },
  medium: { color: 'var(--token-warning)', label: 'Medium' },
  slow: { color: 'var(--token-text-disabled)', label: 'Slow' },
};

export function ModelSelector({ models, selectedId, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = models.find(m => m.id === selectedId) || models[0];

  return (
    <div className="relative" style={{ fontFamily: 'var(--token-font-sans)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-border)',
          background: 'var(--token-bg)',
          color: 'var(--token-text-primary)',
          fontSize: 'var(--token-text-sm)',
          fontWeight: 'var(--token-weight-medium)',
          fontFamily: 'var(--token-font-sans)',
          transition: 'all var(--token-duration-normal) var(--token-ease-default)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border-strong)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--token-border)'; }}
      >
        <span className="flex items-center justify-center" style={{ color: 'var(--token-text-tertiary)' }}>
          {selected.icon}
        </span>
        {selected.name}
        {selected.costTier && (
          <span style={{ fontSize: 'var(--token-text-2xs)', color: costColors[selected.costTier], fontFamily: 'var(--token-font-mono)' }}>
            {costLabels[selected.costTier]}
          </span>
        )}
        <ChevronDown
          size={14}
          style={{
            color: 'var(--token-text-tertiary)',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-normal) var(--token-ease-default)',
          }}
        />
      </button>

      {open && (
        <div>
          <div
            className="fixed inset-0"
            style={{ zIndex: 'var(--token-z-dropdown)' }}
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute"
            style={{
              top: 'calc(100% + var(--token-space-1))',
              left: 0,
              minWidth: 300,
              borderRadius: 'var(--token-radius-lg)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
              boxShadow: 'var(--token-shadow-lg)',
              padding: 'var(--token-space-1)',
              zIndex: 'calc(var(--token-z-dropdown) + 1)',
              animation: 'token-fade-in var(--token-duration-normal) var(--token-ease-default)',
            }}
          >
            {models.map(model => {
              const isSelected = model.id === selectedId;
              const latInfo = model.latency ? latencyIcons[model.latency] : null;
              return (
                <button
                  key={model.id}
                  onClick={() => { onSelect?.(model.id); setOpen(false); }}
                  className="flex items-start w-full cursor-pointer"
                  style={{
                    gap: 'var(--token-space-3)',
                    padding: 'var(--token-space-2-5) var(--token-space-3)',
                    borderRadius: 'var(--token-radius-md)',
                    border: 'none',
                    background: isSelected ? 'var(--token-bg-hover)' : 'transparent',
                    fontFamily: 'var(--token-font-sans)',
                    textAlign: 'left',
                    transition: 'background var(--token-duration-fast) var(--token-ease-default)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isSelected ? 'var(--token-bg-hover)' : 'transparent'; }}
                >
                  <span className="flex items-center justify-center shrink-0" style={{ color: 'var(--token-text-tertiary)', marginTop: 2 }}>
                    {model.icon}
                  </span>
                  <div className="flex flex-col flex-1" style={{ gap: 2 }}>
                    <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                      <span style={{
                        fontSize: 'var(--token-text-sm)',
                        fontWeight: 'var(--token-weight-medium)',
                        color: 'var(--token-text-primary)',
                      }}>
                        {model.name}
                      </span>
                      {model.costTier && (
                        <span style={{
                          fontSize: 'var(--token-text-2xs)',
                          color: costColors[model.costTier],
                          fontFamily: 'var(--token-font-mono)',
                        }}>
                          {costLabels[model.costTier]}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>
                      {model.description}
                    </span>
                    {/* Specs row: context + latency */}
                    <div className="flex items-center flex-wrap" style={{ gap: 'var(--token-space-2)', marginTop: 2 }}>
                      <span style={{
                        fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)',
                        fontFamily: 'var(--token-font-mono)',
                      }}>
                        {model.context}k ctx
                      </span>
                      {latInfo && (
                        <span className="flex items-center" style={{
                          gap: 2, fontSize: 'var(--token-text-2xs)', color: latInfo.color,
                        }}>
                          <Gauge size={9} />{latInfo.label}
                        </span>
                      )}
                      {/* Capability pills */}
                      {model.capabilities?.map((cap, ci) => (
                        <span key={ci} style={{
                          fontSize: 8,
                          padding: '1px 5px',
                          borderRadius: 'var(--token-radius-full)',
                          background: 'var(--token-bg-tertiary)',
                          color: 'var(--token-text-disabled)',
                          fontFamily: 'var(--token-font-mono)',
                        }}>
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} style={{ color: 'var(--token-accent)', flexShrink: 0, marginTop: 2 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const sampleModels: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable multimodal', icon: <Sparkles size={15} />, context: 128, capabilities: ['Vision', 'Tools', 'JSON'], costTier: 'high', latency: 'medium' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & cost-effective', icon: <Zap size={15} />, context: 128, capabilities: ['Tools', 'JSON'], costTier: 'low', latency: 'fast' },
  { id: 'o1', name: 'o1', description: 'Deep reasoning', icon: <Brain size={15} />, context: 128, capabilities: ['Reasoning', 'Math', 'Code'], costTier: 'high', latency: 'slow' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', description: 'Balanced quality', icon: <Sparkles size={15} />, context: 200, capabilities: ['Vision', 'Tools', 'Artifacts'], costTier: 'medium', latency: 'medium' },
];

export function ModelSelectorDemo() {
  const [selected, setSelected] = useState('gpt-4o');
  const selectedModel = sampleModels.find(m => m.id === selected);

  return (
    <div className="flex flex-col" style={{ maxWidth: 340, width: '100%', gap: 'var(--token-space-3)' }}>
      <ModelSelector models={sampleModels} selectedId={selected} onSelect={setSelected} />
      {selectedModel && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-secondary)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Active: {selectedModel.name} ({selectedModel.context}k ctx)
          {selectedModel.costTier && ` · ${costLabels[selectedModel.costTier]}`}
          {selectedModel.latency && ` · ${selectedModel.latency}`}
        </div>
      )}
    </div>
  );
}
