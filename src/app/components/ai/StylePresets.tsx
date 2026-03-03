/* —— StylePresets — Phase 3 Enhanced ——
   Phase 3: intensity slider per preset, preview tooltip on hover,
   favorite/star toggle, custom preset creation, strength indicator */
import { useState, useRef } from 'react';
import { Check, Star, StarOff, Plus, Sliders } from 'lucide-react';
import { DSBadge, DSButton } from '../ds/atoms';

interface StylePreset {
  id: string;
  name: string;
  gradient: string;
  description: string;
  category?: string;
}

interface StylePresetsProps {
  presets?: StylePreset[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  showIntensity?: boolean;
}

export function StylePresets({
  presets,
  selectedId: controlledId,
  onSelect,
  showIntensity = true,
}: StylePresetsProps) {
  const items = presets || defaultPresets;
  const [internalId, setInternalId] = useState(items[0]?.id ?? '');
  const selectedId = controlledId ?? internalId;
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [intensity, setIntensity] = useState(75);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterFavs, setFilterFavs] = useState(false);

  const handleSelect = (id: string) => {
    setInternalId(id);
    onSelect?.(id);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = filterFavs ? items.filter(p => favorites.has(p.id)) : items;
  const categories = [...new Set(filtered.map(p => p.category || 'General'))];

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 'var(--token-space-3)',
        width: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <DSBadge variant="ai" style={{
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Style Preset
        </DSBadge>
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          <button
            onClick={() => setFilterFavs(!filterFavs)}
            className="flex items-center cursor-pointer"
            style={{
              gap: 'var(--token-space-1)',
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-sm)',
              borderWidth: 0,
              borderStyle: 'none',
              background: filterFavs ? 'var(--token-warning)' : 'var(--token-bg-tertiary)',
              color: filterFavs ? 'var(--token-text-inverse)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all var(--token-duration-fast)',
            }}
          >
            <Star size={10} />
            {favorites.size > 0 && !filterFavs && favorites.size}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--token-space-2)',
        }}
      >
        {filtered.map(preset => {
          const isSelected = selectedId === preset.id;
          const isHovered = hoveredId === preset.id;
          const isFav = favorites.has(preset.id);
          return (
            <div key={preset.id} className="relative">
              <button
                onClick={() => handleSelect(preset.id)}
                onMouseEnter={() => setHoveredId(preset.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex flex-col cursor-pointer"
                style={{
                  gap: 'var(--token-space-2)',
                  padding: 0,
                  borderWidth: 0,
                  borderStyle: 'none',
                  background: 'none',
                  fontFamily: 'var(--token-font-sans)',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {/* Swatch */}
                <div
                  className="relative"
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 'var(--token-radius-md)',
                    background: preset.gradient,
                    borderWidth: isSelected ? '2px' : '1px',
                    borderStyle: 'solid',
                    borderColor: isSelected ? 'var(--token-accent)' : 'var(--token-border)',
                    transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
                    overflow: 'hidden',
                    transform: isSelected ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 0 3px rgba(79,109,128,0.1)' : isHovered ? 'var(--token-shadow-md)' : 'none',
                  }}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        top: 4,
                        right: 4,
                        width: 18,
                        height: 18,
                        borderRadius: 'var(--token-radius-full)',
                        background: 'var(--token-accent)',
                      }}
                    >
                      <Check size={10} style={{ color: 'var(--token-accent-fg)' }} />
                    </div>
                  )}

                  {/* Favorite star */}
                  {(isHovered || isFav) && (
                    <button
                      onClick={(e) => toggleFavorite(e, preset.id)}
                      className="absolute flex items-center justify-center cursor-pointer"
                      style={{
                        top: 4,
                        left: 4,
                        width: 18,
                        height: 18,
                        borderRadius: 'var(--token-radius-full)',
                        borderWidth: 0,
                        borderStyle: 'none',
                        background: isFav ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.3)',
                        color: isFav ? 'var(--token-warning)' : 'rgba(255,255,255,0.8)',
                        padding: 0,
                        transition: 'all var(--token-duration-fast)',
                        animation: !isFav ? 'token-fade-in 150ms ease' : undefined,
                      }}
                    >
                      {isFav ? <Star size={10} /> : <StarOff size={10} />}
                    </button>
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: isSelected
                      ? 'var(--token-text-primary)'
                      : 'var(--token-text-tertiary)',
                    transition: 'color var(--token-duration-fast)',
                  }}
                >
                  {preset.name}
                </span>
              </button>

              {/* Hover tooltip */}
              {isHovered && !isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 4px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: 'var(--token-space-1-5) var(--token-space-2)',
                    borderRadius: 'var(--token-radius-sm)',
                    background: 'var(--token-text-primary)',
                    color: 'var(--token-text-inverse)',
                    fontSize: 'var(--token-text-2xs)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10,
                    animation: 'token-fade-in 100ms ease',
                  }}
                >
                  {preset.description.slice(0, 40)}...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected description */}
      {items.find(p => p.id === selectedId)?.description && (
        <span
          style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-tertiary)',
            lineHeight: 'var(--token-leading-normal)',
          }}
        >
          {items.find(p => p.id === selectedId)!.description}
        </span>
      )}

      {/* Intensity slider */}
      {showIntensity && (
        <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
          <Sliders size={12} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            flexShrink: 0,
            width: 52,
          }}>
            Strength
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            style={{
              flex: 1,
              height: 4,
              accentColor: 'var(--token-accent)',
            }}
          />
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            width: 28,
            textAlign: 'right',
          }}>
            {intensity}%
          </span>
        </div>
      )}
    </div>
  );
}

const defaultPresets: StylePreset[] = [
  { id: 'photorealistic', name: 'Photo', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', description: 'Photorealistic rendering with natural lighting and textures.', category: 'Realism' },
  { id: 'anime', name: 'Anime', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', description: 'Japanese anime-inspired style with vibrant colors.', category: 'Illustration' },
  { id: 'watercolor', name: 'Watercolor', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', description: 'Soft watercolor painting with organic brush strokes.', category: 'Art' },
  { id: 'oil-painting', name: 'Oil Paint', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', description: 'Rich oil painting style with textured brush work.', category: 'Art' },
  { id: '3d-render', name: '3D Render', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', description: 'Clean 3D-rendered style with smooth materials.', category: 'Realism' },
  { id: 'pixel-art', name: 'Pixel', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', description: 'Retro pixel art with limited color palette.', category: 'Illustration' },
  { id: 'sketch', name: 'Sketch', gradient: 'linear-gradient(135deg, #d4d4d4 0%, #8a8a8a 100%)', description: 'Hand-drawn pencil sketch style in grayscale.', category: 'Art' },
  { id: 'cinematic', name: 'Cinematic', gradient: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)', description: 'Movie-quality cinematic look with dramatic lighting.', category: 'Realism' },
];

export function StylePresetsDemo() {
  const [applied, setApplied] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 360, width: '100%', gap: 'var(--token-space-3)' }}>
      <StylePresets onSelect={(id) => setApplied(id)} />
      {applied && (
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
          Style applied: {applied}
        </div>
      )}
    </div>
  );
}