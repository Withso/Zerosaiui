/* —— ParametersPanel — Phase 3 Enhanced ——
   Phase 3: preset configurations, visual diff from defaults,
   parameter grouping, individual reset per param, lock/pin toggle */
import { useState } from 'react';
import { Settings, RotateCcw, ChevronDown, Lock, Unlock, Sparkles } from 'lucide-react';
import { DSSlider, DSToggle, DSSelect, DSButton, DSBadge } from '../ds/atoms';

interface Parameter {
  id: string;
  label: string;
  description: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  value: number | string | boolean;
  defaultValue?: number | string | boolean;
  options?: string[];
  group?: string;
}

interface Preset {
  id: string;
  label: string;
  description: string;
  values: Record<string, number | string | boolean>;
}

interface ParametersPanelProps {
  parameters?: Parameter[];
  presets?: Preset[];
  onChange?: (id: string, value: number | string | boolean) => void;
  onReset?: () => void;
}

export function ParametersPanel({
  parameters,
  presets,
  onChange,
  onReset,
}: ParametersPanelProps) {
  const [params, setParams] = useState(parameters || defaultParameters);
  const [expanded, setExpanded] = useState(true);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const presetList = presets || defaultPresets;

  const updateParam = (id: string, value: number | string | boolean) => {
    if (lockedIds.has(id)) return;
    setParams(prev => prev.map(p => (p.id === id ? { ...p, value } : p)));
    setActivePreset(null);
    onChange?.(id, value);
  };

  const handleReset = () => {
    setParams(parameters || defaultParameters);
    setActivePreset(null);
    onReset?.();
  };

  const applyPreset = (preset: Preset) => {
    setParams(prev => prev.map(p => {
      if (lockedIds.has(p.id)) return p;
      const newVal = preset.values[p.id];
      return newVal !== undefined ? { ...p, value: newVal } : p;
    }));
    setActivePreset(preset.id);
  };

  const toggleLock = (id: string) => {
    setLockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isModified = (param: Parameter) => {
    const def = param.defaultValue ?? (parameters || defaultParameters).find(p => p.id === param.id)?.value;
    return param.value !== def;
  };

  const modifiedCount = params.filter(isModified).length;
  const groups = [...new Set(params.map(p => p.group || 'General'))];

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderWidth: 0,
          borderStyle: 'none',
          background: 'var(--token-bg-secondary)',
          fontFamily: 'var(--token-font-sans)',
          textAlign: 'left',
        }}
      >
        <Settings size={14} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />
        <span
          className="flex-1"
          style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
          }}
        >
          Parameters
        </span>
        {modifiedCount > 0 && (
          <DSBadge variant="ai" style={{ fontSize: '9px', padding: '0 5px' }}>
            {modifiedCount} changed
          </DSBadge>
        )}
        <ChevronDown
          size={14}
          style={{
            color: 'var(--token-text-disabled)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--token-duration-normal)',
            flexShrink: 0,
          }}
        />
      </button>

      {expanded && (
        <div className="flex flex-col" style={{ animation: 'token-fade-in 200ms ease' }}>
          {/* Presets */}
          <div className="flex items-center" style={{
            gap: 'var(--token-space-1)',
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--token-border-subtle)',
            overflowX: 'auto',
          }}>
            <Sparkles size={10} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
            {presetList.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="cursor-pointer"
                title={preset.description}
                style={{
                  padding: 'var(--token-space-1) var(--token-space-2)',
                  borderRadius: 'var(--token-radius-sm)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: activePreset === preset.id ? 'var(--token-accent)' : 'var(--token-border)',
                  background: activePreset === preset.id ? 'var(--token-accent-light)' : 'transparent',
                  color: activePreset === preset.id ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                  fontSize: 'var(--token-text-2xs)',
                  fontFamily: 'var(--token-font-mono)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--token-duration-fast)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Parameters grouped */}
          <div className="flex flex-col" style={{
            padding: 'var(--token-space-3) var(--token-space-4)',
            gap: 'var(--token-space-4)',
          }}>
            {groups.map(group => {
              const groupParams = params.filter(p => (p.group || 'General') === group);
              return (
                <div key={group} className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
                  {groups.length > 1 && (
                    <span style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-disabled)',
                      fontFamily: 'var(--token-font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {group}
                    </span>
                  )}
                  {groupParams.map((param, idx) => {
                    const modified = isModified(param);
                    const locked = lockedIds.has(param.id);
                    return (
                      <div key={param.id} className="flex flex-col" style={{
                        gap: 'var(--token-space-1-5)',
                        opacity: locked ? 0.5 : 1,
                        transition: 'opacity var(--token-duration-fast)',
                      }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
                            <span style={{
                              fontSize: 'var(--token-text-xs)',
                              color: 'var(--token-text-secondary)',
                            }}>
                              {param.label}
                            </span>
                            {modified && (
                              <div style={{
                                width: 5,
                                height: 5,
                                borderRadius: 'var(--token-radius-full)',
                                background: 'var(--token-accent)',
                              }} />
                            )}
                          </div>
                          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                            {param.type === 'slider' && (
                              <span style={{
                                fontSize: 'var(--token-text-xs)',
                                fontFamily: 'var(--token-font-mono)',
                                color: modified ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                                background: 'var(--token-bg-tertiary)',
                                padding: '1px 6px',
                                borderRadius: 'var(--token-radius-sm)',
                                transition: 'color var(--token-duration-fast)',
                              }}>
                                {param.value as number}
                              </span>
                            )}
                            <button
                              onClick={() => toggleLock(param.id)}
                              className="flex items-center justify-center cursor-pointer"
                              title={locked ? 'Unlock' : 'Lock'}
                              style={{
                                width: 18, height: 18,
                                borderRadius: 'var(--token-radius-sm)',
                                borderWidth: 0,
                                borderStyle: 'none',
                                background: 'transparent',
                                color: locked ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                                padding: 0,
                              }}
                            >
                              {locked ? <Lock size={10} /> : <Unlock size={10} />}
                            </button>
                          </div>
                        </div>

                        {param.type === 'slider' && (
                          <DSSlider
                            min={param.min ?? 0}
                            max={param.max ?? 1}
                            step={param.step ?? 0.1}
                            value={param.value as number}
                            onChange={(v) => updateParam(param.id, v)}
                          />
                        )}
                        {param.type === 'select' && (
                          <DSSelect
                            options={param.options || []}
                            value={param.value as string}
                            onChange={(v) => updateParam(param.id, v)}
                          />
                        )}
                        {param.type === 'toggle' && (
                          <DSToggle
                            checked={param.value as boolean}
                            onChange={() => updateParam(param.id, !(param.value as boolean))}
                          />
                        )}

                        <span style={{
                          fontSize: 'var(--token-text-2xs)',
                          color: 'var(--token-text-disabled)',
                          lineHeight: 'var(--token-leading-normal)',
                        }}>
                          {param.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Reset button */}
            <DSButton
              variant="outline"
              icon={<RotateCcw size={11} />}
              onClick={handleReset}
              disabled={modifiedCount === 0}
              style={{ alignSelf: 'flex-start', borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-2xs)' }}
            >
              Reset defaults
            </DSButton>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultParameters: Parameter[] = [
  { id: 'temperature', label: 'Temperature', description: 'Controls randomness. Lower = more deterministic.', type: 'slider', min: 0, max: 2, step: 0.1, value: 0.7, defaultValue: 0.7, group: 'Sampling' },
  { id: 'top-p', label: 'Top P', description: 'Nucleus sampling threshold. Lower = more focused.', type: 'slider', min: 0, max: 1, step: 0.05, value: 0.9, defaultValue: 0.9, group: 'Sampling' },
  { id: 'max-tokens', label: 'Max Tokens', description: 'Maximum number of tokens in the response.', type: 'slider', min: 256, max: 16384, step: 256, value: 4096, defaultValue: 4096, group: 'Output' },
  { id: 'response-format', label: 'Response Format', description: 'Output structure format.', type: 'select', value: 'text', defaultValue: 'text', options: ['text', 'json', 'markdown', 'code'], group: 'Output' },
  { id: 'streaming', label: 'Streaming', description: 'Stream tokens as they are generated.', type: 'toggle', value: true, defaultValue: true, group: 'Output' },
];

const defaultPresets: Preset[] = [
  { id: 'creative', label: 'Creative', description: 'High temperature for creative writing', values: { temperature: 1.2, 'top-p': 0.95, 'max-tokens': 8192 } },
  { id: 'precise', label: 'Precise', description: 'Low temperature for factual responses', values: { temperature: 0.2, 'top-p': 0.5, 'max-tokens': 4096 } },
  { id: 'code', label: 'Code', description: 'Optimized for code generation', values: { temperature: 0.3, 'top-p': 0.8, 'max-tokens': 8192, 'response-format': 'code' } },
  { id: 'balanced', label: 'Balanced', description: 'Default balanced settings', values: { temperature: 0.7, 'top-p': 0.9, 'max-tokens': 4096, 'response-format': 'text' } },
];

export function ParametersPanelDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 340, width: '100%', gap: 'var(--token-space-2)' }}>
      <ParametersPanel />
    </div>
  );
}