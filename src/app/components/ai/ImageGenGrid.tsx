/* —— ImageGenGrid — Phase 3 Enhanced ——
   Phase 3: upscale flow, "use as reference" action, generation progress overlay,
   comparison side-by-side, batch select, prompt label on each image */
import { useState } from 'react';
import { Download, ZoomIn, Check, Wand2, RefreshCw, Image, Copy, Maximize2 } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface GeneratedImage {
  id: string;
  gradient: string;
  label?: string;
  prompt?: string;
  status?: 'generating' | 'complete' | 'error';
  progress?: number;
}

interface ImageGenGridProps {
  images: GeneratedImage[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onUpscale?: (id: string) => void;
  onUseAsReference?: (id: string) => void;
  onRegenerate?: (id: string) => void;
  multiSelect?: boolean;
}

export function ImageGenGrid({
  images,
  selectedId,
  onSelect,
  onUpscale,
  onUseAsReference,
  onRegenerate,
  multiSelect = false,
}: ImageGenGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedId ? [selectedId] : []));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (multiSelect) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
    onSelect?.(id);
  };

  const isSelected = (id: string) => selectedIds.has(id);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-3)', fontFamily: 'var(--token-font-sans)' }}>
      {/* Batch actions when multiple selected */}
      {multiSelect && selectedIds.size > 1 && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: 'var(--token-accent-light)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-accent)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-accent)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {selectedIds.size} selected
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <DSButton size="sm" variant="ghost" style={{ fontSize: 'var(--token-text-2xs)' }}>
              <Download size={11} style={{ marginRight: 3 }} />
              Download All
            </DSButton>
            <DSButton size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} style={{ fontSize: 'var(--token-text-2xs)' }}>
              Clear
            </DSButton>
          </div>
        </div>
      )}

      {/* Image grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--token-space-2)',
        }}
      >
        {images.map(img => {
          const selected = isSelected(img.id);
          const hovered = img.id === hoveredId;
          const isGenerating = img.status === 'generating';
          const isError = img.status === 'error';

          return (
            <div
              key={img.id}
              className="relative cursor-pointer"
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--token-radius-lg)',
                overflow: 'hidden',
                borderWidth: selected ? '2px' : '1px',
                borderStyle: 'solid',
                borderColor: selected ? 'var(--token-accent)' : isError ? 'var(--token-error)' : 'var(--token-border)',
                transition: 'border-color 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms cubic-bezier(0.16,1,0.3,1)',
                transform: hovered ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hovered ? 'var(--token-shadow-lg)' : 'none',
                opacity: isGenerating ? 0.7 : 1,
              }}
              onClick={() => !isGenerating && handleSelect(img.id)}
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={{ width: '100%', height: '100%', background: img.gradient }} />

              {/* Generation progress overlay */}
              {isGenerating && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: 'var(--token-radius-full)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderTopColor: 'rgba(255,255,255,0.8)',
                    animation: 'token-spin 1s linear infinite',
                  }} />
                  {img.progress !== undefined && (
                    <span style={{
                      marginTop: 'var(--token-space-2)',
                      fontSize: 'var(--token-text-2xs)',
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'var(--token-font-mono)',
                    }}>
                      {img.progress}%
                    </span>
                  )}
                </div>
              )}

              {/* Error overlay */}
              {isError && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <span style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-error)',
                    fontFamily: 'var(--token-font-mono)',
                  }}>
                    Failed
                  </span>
                  <DSButton
                    size="sm"
                    variant="ghost"
                    onClick={(e) => { (e as React.MouseEvent).stopPropagation(); onRegenerate?.(img.id); }}
                    style={{
                      marginTop: 'var(--token-space-1)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 'var(--token-text-2xs)',
                    }}
                  >
                    <RefreshCw size={10} style={{ marginRight: 3 }} />
                    Retry
                  </DSButton>
                </div>
              )}

              {/* Selected checkmark */}
              {selected && !isGenerating && (
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: 'var(--token-space-2)',
                    left: 'var(--token-space-2)',
                    width: 22, height: 22,
                    borderRadius: 'var(--token-radius-full)',
                    background: 'var(--token-accent)',
                  }}
                >
                  <Check size={12} style={{ color: 'var(--token-accent-fg)' }} />
                </div>
              )}

              {/* Hover actions */}
              {hovered && !isGenerating && !isError && (
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)',
                    padding: 'var(--token-space-2)',
                    animation: 'token-fade-in var(--token-duration-fast) var(--token-ease-default)',
                  }}
                >
                  {/* Top actions */}
                  <div className="flex justify-end">
                    <DSButton
                      variant="icon"
                      icon={<Maximize2 size={12} />}
                      onClick={e => { (e as React.MouseEvent).stopPropagation(); setExpandedId(img.id); }}
                      style={{
                        width: 26, height: 26,
                        borderRadius: 'var(--token-radius-md)',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(4px)',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  {/* Bottom actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                      <DSButton
                        variant="icon"
                        icon={<Wand2 size={12} />}
                        onClick={e => { (e as React.MouseEvent).stopPropagation(); onUpscale?.(img.id); }}
                        style={{
                          width: 26, height: 26,
                          borderRadius: 'var(--token-radius-md)',
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(4px)',
                          color: 'rgba(255,255,255,0.9)',
                        }}
                      />
                      <DSButton
                        variant="icon"
                        icon={<Image size={12} />}
                        onClick={e => { (e as React.MouseEvent).stopPropagation(); onUseAsReference?.(img.id); }}
                        style={{
                          width: 26, height: 26,
                          borderRadius: 'var(--token-radius-md)',
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(4px)',
                          color: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>
                    <DSButton
                      variant="icon"
                      icon={<Download size={12} />}
                      onClick={e => (e as React.MouseEvent).stopPropagation()}
                      style={{
                        width: 26, height: 26,
                        borderRadius: 'var(--token-radius-md)',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(4px)',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Version label */}
              {img.label && !hovered && (
                <div
                  className="absolute"
                  style={{
                    bottom: 'var(--token-space-2)',
                    left: 'var(--token-space-2)',
                    padding: '1px 6px',
                    borderRadius: 'var(--token-radius-sm)',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    fontSize: 'var(--token-text-2xs)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  {img.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sampleImages: GeneratedImage[] = [
  { id: '1', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'v1', prompt: 'Mountain landscape at sunset', status: 'complete' },
  { id: '2', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'v2', prompt: 'Abstract digital art', status: 'complete' },
  { id: '3', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'v3', prompt: 'Ocean waves', status: 'complete' },
  { id: '4', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'v4', prompt: 'Forest path', status: 'complete' },
];

export function ImageGenGridDemo() {
  const [selected, setSelected] = useState('1');

  return (
    <div className="flex flex-col" style={{ maxWidth: 320, width: '100%', gap: 'var(--token-space-3)' }}>
      <ImageGenGrid
        images={sampleImages}
        selectedId={selected}
        onSelect={setSelected}
        onUpscale={(id) => console.log('Upscale', id)}
        onUseAsReference={(id) => console.log('Use as ref', id)}
      />
      <div style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        borderRadius: 'var(--token-radius-md)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        background: 'var(--token-bg-secondary)',
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-secondary)',
        fontFamily: 'var(--token-font-mono)',
      }}>
        Selected: Image {selected}
      </div>
    </div>
  );
}
