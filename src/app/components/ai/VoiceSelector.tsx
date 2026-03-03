/* VoiceSelector — Enhanced with voice cloning, style options, preview waveform
   Phase 3 enhancements:
   — Voice cloning flow (Create new voice with guided recording)
   — Style options per voice (Conversational, Newscaster, Excited)
   — Preview waveform animation per voice
   — Favoriting voices
   — Search/filter voices */
import { useState, useCallback } from 'react';
import { Play, Check, Plus, Mic, Star, ChevronDown, Pause, X } from 'lucide-react';
import { DSBadge, DSButton } from '../ds/atoms';

type SpeakingStyle = 'conversational' | 'newscaster' | 'excited' | 'calm' | 'whisper';

interface Voice {
  id: string;
  name: string;
  description: string;
  accent: string;
  color: string;
  styles?: SpeakingStyle[];
  favorite?: boolean;
  isClone?: boolean;
}

interface VoiceSelectorProps {
  voices: Voice[];
  selectedId: string;
  onSelect?: (id: string) => void;
  onCreateVoice?: () => void;
  showCloneFlow?: boolean;
}

const styleLabels: Record<SpeakingStyle, string> = {
  conversational: 'Conversational',
  newscaster: 'Newscaster',
  excited: 'Excited',
  calm: 'Calm',
  whisper: 'Whisper',
};

export function VoiceSelector({ voices: initialVoices, selectedId, onSelect, showCloneFlow = false }: VoiceSelectorProps) {
  const [voices, setVoices] = useState(initialVoices);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<Record<string, SpeakingStyle>>({});
  const [showClone, setShowClone] = useState(showCloneFlow);
  const [cloneStep, setCloneStep] = useState(0);
  const [cloneRecording, setCloneRecording] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVoices = searchQuery
    ? voices.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.accent.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : voices;

  const handlePreview = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewPlaying === id) {
      setPreviewPlaying(null);
    } else {
      setPreviewPlaying(id);
      setTimeout(() => setPreviewPlaying(null), 2000);
    }
  }, [previewPlaying]);

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVoices(prev => prev.map(v =>
      v.id === id ? { ...v, favorite: !v.favorite } : v
    ));
  }, []);

  const toggleStyleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStyle(expandedStyle === id ? null : id);
  };

  const selectStyle = (voiceId: string, style: SpeakingStyle) => {
    setSelectedStyles(prev => ({ ...prev, [voiceId]: style }));
    setExpandedStyle(null);
  };

  /* — Clone flow simulation — */
  const cloneSentences = [
    'The quick brown fox jumps over the lazy dog.',
    'She sells seashells by the seashore.',
    'How much wood would a woodchuck chuck?',
  ];

  const startCloneRecording = () => {
    setCloneRecording(true);
    let p = 0;
    const timer = setInterval(() => {
      p += 2;
      setCloneProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setCloneRecording(false);
        setCloneProgress(0);
        if (cloneStep < cloneSentences.length - 1) {
          setCloneStep(prev => prev + 1);
        } else {
          /* Clone complete — add new voice */
          const newVoice: Voice = {
            id: `clone-${Date.now()}`,
            name: 'My Voice',
            description: 'Custom voice clone',
            accent: 'Custom',
            color: 'var(--token-chart-5, var(--token-accent))',
            styles: ['conversational', 'calm'],
            isClone: true,
          };
          setVoices(prev => [...prev, newVoice]);
          setShowClone(false);
          setCloneStep(0);
        }
      }
    }, 40);
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', fontFamily: 'var(--token-font-sans)' }}>
      {/* Search + Create */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search voices..."
          style={{
            flex: 1,
            padding: 'var(--token-space-1-5) var(--token-space-2-5)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg)',
            color: 'var(--token-text-primary)',
            fontSize: 'var(--token-text-xs)',
            fontFamily: 'var(--token-font-sans)',
            outline: 'none',
          }}
        />
        <DSButton
          variant="outline"
          icon={<Plus size={12} />}
          onClick={() => setShowClone(true)}
          style={{
            fontSize: 'var(--token-text-2xs)',
            padding: 'var(--token-space-1-5) var(--token-space-2-5)',
            flexShrink: 0,
          }}
        >
          Clone
        </DSButton>
      </div>

      {/* Clone flow */}
      {showClone && (
        <div
          style={{
            padding: 'var(--token-space-3)',
            borderRadius: 'var(--token-radius-lg)',
            border: '1px solid var(--token-accent)',
            background: 'var(--token-bg-secondary)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-2)' }}>
            <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
              <Mic size={13} style={{ color: 'var(--token-accent)' }} />
              <span style={{
                fontSize: 'var(--token-text-xs)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-primary)',
              }}>
                Create Voice Clone
              </span>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {cloneStep + 1}/{cloneSentences.length}
              </span>
            </div>
            <DSButton
              variant="icon"
              icon={<X size={11} />}
              onClick={() => { setShowClone(false); setCloneStep(0); }}
              style={{ width: 20, height: 20 }}
            />
          </div>

          {/* Progress steps */}
          <div className="flex" style={{ gap: 'var(--token-space-1)', marginBottom: 'var(--token-space-3)' }}>
            {cloneSentences.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i < cloneStep ? 'var(--token-accent)' : i === cloneStep ? 'var(--token-accent)' : 'var(--token-bg-tertiary)',
                  opacity: i <= cloneStep ? 1 : 0.4,
                  transition: 'all var(--token-duration-normal)',
                }}
              >
                {i === cloneStep && cloneRecording && (
                  <div style={{
                    width: `${cloneProgress}%`,
                    height: '100%',
                    background: 'var(--token-accent)',
                    borderRadius: 2,
                    transition: 'width 40ms linear',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Current sentence */}
          <div style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg)',
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
            lineHeight: 'var(--token-leading-relaxed)',
            marginBottom: 'var(--token-space-2)',
          }}>
            &ldquo;{cloneSentences[cloneStep]}&rdquo;
          </div>

          {/* Record button */}
          <div className="flex justify-center">
            <DSButton
              variant="primary"
              icon={cloneRecording ? <span style={{
                width: 12, height: 12,
                borderRadius: 2,
                background: 'currentColor',
                display: 'block',
              }} /> : <Mic size={16} />}
              onClick={startCloneRecording}
              disabled={cloneRecording}
              style={{
                width: 44, height: 44,
                borderRadius: 'var(--token-radius-full)',
                padding: 0, minWidth: 'unset',
                background: cloneRecording ? 'var(--token-error)' : 'var(--token-text-primary)',
                animation: cloneRecording ? 'token-pulse 1.5s ease infinite' : 'none',
              }}
            />
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--token-space-1-5)',
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
          }}>
            {cloneRecording ? 'Recording...' : 'Tap to record this sentence'}
          </div>
        </div>
      )}

      {/* Voice list */}
      {filteredVoices.map((voice, idx) => {
        const isSelected = voice.id === selectedId;
        const isPreviewing = previewPlaying === voice.id;
        const currentStyle = selectedStyles[voice.id] || voice.styles?.[0];
        const isStyleOpen = expandedStyle === voice.id;

        return (
          <div
            key={voice.id}
            onClick={() => onSelect?.(voice.id)}
            className="flex items-center w-full cursor-pointer"
            style={{
              gap: 'var(--token-space-3)',
              padding: 'var(--token-space-3)',
              borderRadius: 'var(--token-radius-lg)',
              border: `1px solid ${isSelected ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: isSelected ? 'var(--token-accent-light)' : 'var(--token-bg)',
              fontFamily: 'var(--token-font-sans)',
              textAlign: 'left',
              transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
              transform: isSelected ? 'scale(0.99)' : 'scale(1)',
              boxShadow: isSelected ? '0 0 0 3px rgba(79,109,128,0.08)' : 'none',
              animation: `token-fade-in 200ms ease ${idx * 40}ms both`,
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--token-border-strong)';
                e.currentTarget.style.background = 'var(--token-bg-hover)';
              }
            }}
            onMouseLeave={e => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--token-border)';
                e.currentTarget.style.background = 'var(--token-bg)';
              }
            }}
          >
            {/* Avatar with mini waveform */}
            <div
              className="flex items-center justify-center shrink-0 relative"
              style={{
                width: 36, height: 36,
                borderRadius: 'var(--token-radius-full)',
                background: voice.color,
                color: 'var(--token-text-inverse)',
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-semibold)',
                overflow: 'hidden',
              }}
            >
              {isPreviewing ? (
                <div className="flex items-center" style={{ gap: 1 }}>
                  {[0,1,2,3].map(i => (
                    <span
                      key={i}
                      style={{
                        width: 2,
                        height: 10 + Math.sin(i * 1.5) * 6,
                        borderRadius: 1,
                        background: 'var(--token-text-inverse)',
                        animation: `token-pulse ${0.6 + i * 0.1}s ease infinite`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                voice.name[0]
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1" style={{ gap: 0, minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
                <span
                  style={{
                    fontSize: 'var(--token-text-sm)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: 'var(--token-text-primary)',
                    lineHeight: 'var(--token-leading-tight)',
                  }}
                >
                  {voice.name}
                </span>
                {voice.isClone && (
                  <DSBadge variant="default" style={{
                    fontSize: 'var(--token-text-2xs)',
                    height: 14,
                    padding: '0 var(--token-space-1)',
                  }}>
                    Clone
                  </DSBadge>
                )}
              </div>
              <span
                style={{
                  fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-tertiary)',
                  lineHeight: 'var(--token-leading-tight)',
                }}
              >
                {voice.description} &#xb7; {voice.accent}
              </span>

              {/* Style selector */}
              {voice.styles && voice.styles.length > 0 && (
                <div style={{ marginTop: 'var(--token-space-1)', position: 'relative' }}>
                  <button
                    onClick={(e) => toggleStyleDropdown(voice.id, e)}
                    className="flex items-center cursor-pointer"
                    style={{
                      gap: 'var(--token-space-1)',
                      padding: 'var(--token-space-0-5) var(--token-space-1-5)',
                      borderRadius: 'var(--token-radius-sm)',
                      border: '1px solid var(--token-border)',
                      background: 'var(--token-bg)',
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-tertiary)',
                      fontFamily: 'var(--token-font-sans)',
                    }}
                  >
                    {currentStyle ? styleLabels[currentStyle] : 'Style'}
                    <ChevronDown size={8} style={{
                      transform: isStyleOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform var(--token-duration-fast)',
                    }} />
                  </button>

                  {isStyleOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 'var(--token-space-0-5)',
                        minWidth: 120,
                        borderRadius: 'var(--token-radius-md)',
                        border: '1px solid var(--token-border)',
                        background: 'var(--token-bg)',
                        boxShadow: 'var(--token-shadow-lg)',
                        zIndex: 10,
                        overflow: 'hidden',
                        animation: 'token-fade-in 100ms ease',
                      }}
                    >
                      {voice.styles.map(style => (
                        <button
                          key={style}
                          onClick={(e) => { e.stopPropagation(); selectStyle(voice.id, style); }}
                          className="flex items-center cursor-pointer"
                          style={{
                            width: '100%',
                            gap: 'var(--token-space-2)',
                            padding: 'var(--token-space-1-5) var(--token-space-2-5)',
                            border: 'none',
                            background: currentStyle === style ? 'var(--token-bg-hover)' : 'transparent',
                            color: currentStyle === style ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
                            fontSize: 'var(--token-text-2xs)',
                            fontFamily: 'var(--token-font-sans)',
                            textAlign: 'left',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--token-bg-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = currentStyle === style ? 'var(--token-bg-hover)' : 'transparent')}
                        >
                          {styleLabels[style]}
                          {currentStyle === style && <Check size={10} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center shrink-0" style={{ gap: 'var(--token-space-1-5)' }}>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => toggleFavorite(voice.id, e)}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 24, height: 24,
                  borderRadius: 'var(--token-radius-full)',
                  color: voice.favorite ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                  transition: 'color var(--token-duration-fast)',
                }}
              >
                <Star size={12} fill={voice.favorite ? 'var(--token-warning)' : 'none'} />
              </span>
              {isSelected ? (
                <DSBadge variant="ai" style={{
                  width: 22, height: 22, padding: 0,
                  borderRadius: 'var(--token-radius-full)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--token-accent)',
                  color: 'var(--token-accent-fg)',
                }}>
                  <Check size={12} />
                </DSBadge>
              ) : (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handlePreview(voice.id, e)}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 28, height: 28,
                    borderRadius: 'var(--token-radius-full)',
                    border: '1px solid var(--token-border)',
                    color: isPreviewing ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                    transition: 'all var(--token-duration-fast)',
                  }}
                >
                  {isPreviewing ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: 1 }} />}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {filteredVoices.length === 0 && (
        <div style={{
          padding: 'var(--token-space-4)',
          textAlign: 'center',
          fontSize: 'var(--token-text-xs)',
          color: 'var(--token-text-disabled)',
        }}>
          No voices match your search
        </div>
      )}
    </div>
  );
}

const sampleVoices: Voice[] = [
  { id: 'aria', name: 'Aria', description: 'Warm & expressive', accent: 'American', color: 'var(--token-chart-6)', styles: ['conversational', 'excited', 'calm'], favorite: true },
  { id: 'marcus', name: 'Marcus', description: 'Deep & calm', accent: 'British', color: 'var(--token-chart-4)', styles: ['conversational', 'newscaster'] },
  { id: 'luna', name: 'Luna', description: 'Soft & clear', accent: 'Neutral', color: 'var(--token-chart-1)', styles: ['conversational', 'whisper', 'calm'] },
  { id: 'kai', name: 'Kai', description: 'Energetic & bright', accent: 'Australian', color: 'var(--token-chart-3)', styles: ['conversational', 'excited', 'newscaster'] },
];

export function VoiceSelectorDemo() {
  const [selected, setSelected] = useState('aria');

  return (
    <div className="flex flex-col" style={{ maxWidth: 380, width: '100%', gap: 'var(--token-space-3)' }}>
      <VoiceSelector voices={sampleVoices} selectedId={selected} onSelect={setSelected} />
    </div>
  );
}