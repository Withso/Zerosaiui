/* VoiceWaveform — Enhanced with speaker diarization, scrubbable timeline
   Phase 3 enhancements:
   — Speaker diarization (color-coded bars by speaker)
   — Scrubbable timeline (drag to seek, real-time timestamp)
   — Playback progress indicator
   — Duration display
   — Amplitude normalization */
import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import { DSButton } from '../ds/atoms';

type WaveformState = 'idle' | 'recording' | 'playing';
type Speaker = 'user' | 'ai';

interface WaveformBar {
  height: number;
  speaker?: Speaker;
}

interface VoiceWaveformProps {
  state?: WaveformState;
  barCount?: number;
  onToggle?: () => void;
  onSeek?: (progress: number) => void;
  progress?: number;
  duration?: number;
  showDiarization?: boolean;
  bars?: WaveformBar[];
}

const speakerColors: Record<Speaker, string> = {
  user: 'var(--token-accent)',
  ai: 'var(--token-chart-2, #8b5cf6)',
};

export function VoiceWaveform({
  state = 'idle',
  barCount = 40,
  onToggle,
  onSeek,
  progress = 0,
  duration = 0,
  showDiarization = false,
  bars: externalBars,
}: VoiceWaveformProps) {
  const isActive = state === 'recording' || state === 'playing';
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  const bars: WaveformBar[] = externalBars || Array.from({ length: barCount }, (_, i) => {
    const baseHeight = Math.sin((i / barCount) * Math.PI) * 0.6 + 0.2;
    const randomOffset = Math.sin(i * 2.5) * 0.3;
    const speaker: Speaker = showDiarization
      ? (i < barCount * 0.35 ? 'user' : i < barCount * 0.5 ? 'ai' : i < barCount * 0.75 ? 'user' : 'ai')
      : 'user';
    return {
      height: Math.max(0.08, Math.min(1, baseHeight + randomOffset)),
      speaker,
    };
  });

  const currentProgress = scrubProgress ?? progress;

  const getProgressFromEvent = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state !== 'playing') return;
    setScrubbing(true);
    const p = getProgressFromEvent(e);
    setScrubProgress(p);
    onSeek?.(p);
  }, [state, getProgressFromEvent, onSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const p = getProgressFromEvent(e);
    setHoverProgress(p);
    if (scrubbing) {
      setScrubProgress(p);
      onSeek?.(p);
    }
  }, [scrubbing, getProgressFromEvent, onSeek]);

  const handleMouseUp = useCallback(() => {
    setScrubbing(false);
    setScrubProgress(null);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const currentTime = duration > 0 ? formatTime(currentProgress * duration) : '0:00';
  const totalTime = duration > 0 ? formatTime(duration) : '0:00';

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 'var(--token-space-4)', fontFamily: 'var(--token-font-sans)' }}
    >
      {/* Waveform */}
      <div
        ref={containerRef}
        className="flex items-center justify-center"
        style={{
          gap: 2,
          height: 64,
          padding: '0 var(--token-space-4)',
          width: '100%',
          cursor: state === 'playing' ? 'crosshair' : 'default',
          position: 'relative',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setHoverProgress(null); }}
      >
        {bars.map((bar, i) => {
          const barProgress = i / bars.length;
          const isPast = state === 'playing' && barProgress < currentProgress;
          const isHoverPast = hoverProgress !== null && barProgress < hoverProgress;

          let barColor: string;
          if (isPast) {
            barColor = showDiarization
              ? speakerColors[bar.speaker || 'user']
              : 'var(--token-voice-bar-active, var(--token-accent))';
          } else if (isActive) {
            barColor = showDiarization
              ? speakerColors[bar.speaker || 'user']
              : 'var(--token-voice-bar-active, var(--token-accent))';
          } else {
            barColor = 'var(--token-voice-bar, var(--token-text-disabled))';
          }

          return (
            <span
              key={i}
              style={{
                display: 'block',
                width: 3,
                borderRadius: 'var(--token-radius-full)',
                background: barColor,
                opacity: isActive
                  ? (state === 'playing' ? (isPast ? 1 : 0.3) : 1)
                  : 0.25,
                height: isActive ? `${bar.height * 100}%` : '12%',
                transition: `height ${300 + i * 8}ms var(--token-ease-default), opacity var(--token-duration-normal) var(--token-ease-default)`,
                animation: state === 'recording' ? `token-pulse ${1 + (i % 5) * 0.2}s ease-in-out ${i * 0.05}s infinite` : 'none',
              }}
            />
          );
        })}

        {/* Hover timestamp tooltip */}
        {hoverProgress !== null && state === 'playing' && duration > 0 && (
          <div
            className="absolute"
            style={{
              left: `${hoverProgress * 100}%`,
              top: -20,
              transform: 'translateX(-50%)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-tertiary)',
              background: 'var(--token-bg)',
              padding: '0 var(--token-space-1)',
              borderRadius: 'var(--token-radius-sm)',
              boxShadow: 'var(--token-shadow-sm)',
              pointerEvents: 'none',
              animation: 'token-fade-in 80ms ease',
            }}
          >
            {formatTime(hoverProgress * duration)}
          </div>
        )}
      </div>

      {/* Time display */}
      {state === 'playing' && duration > 0 && (
        <div
          className="flex items-center justify-between w-full"
          style={{
            padding: '0 var(--token-space-4)',
            marginTop: 'calc(-1 * var(--token-space-2))',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {currentTime}
          </span>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {totalTime}
          </span>
        </div>
      )}

      {/* Diarization legend */}
      {showDiarization && isActive && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-3)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          {(['user', 'ai'] as Speaker[]).map(speaker => (
            <div key={speaker} className="flex items-center" style={{ gap: 'var(--token-space-1-5)' }}>
              <div style={{
                width: 8, height: 8,
                borderRadius: 'var(--token-radius-full)',
                background: speakerColors[speaker],
              }} />
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-tertiary)',
                textTransform: 'capitalize',
              }}>
                {speaker === 'ai' ? 'AI' : 'User'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-4)' }}>
        {state === 'recording' && (
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-error)',
              fontWeight: 'var(--token-weight-medium)',
              fontFamily: 'var(--token-font-mono)',
              animation: 'token-pulse 1.5s ease-in-out infinite',
            }}
          >
            REC 0:04
          </span>
        )}
        <DSButton
          variant="primary"
          icon={
            state === 'recording' ? <Square size={16} /> :
            state === 'playing' ? <Pause size={16} /> :
            <Mic size={18} />
          }
          onClick={onToggle}
          style={{
            width: 44, height: 44,
            borderRadius: 'var(--token-radius-full)',
            padding: 0, minWidth: 'unset',
            background: state === 'recording' ? 'var(--token-error)' : 'var(--token-text-primary)',
          }}
        />
        {state === 'recording' && (
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            48kHz
          </span>
        )}
      </div>
    </div>
  );
}

export function VoiceWaveformDemo() {
  const [state, setState] = useState<WaveformState>('recording');
  const [progress, setProgress] = useState(0.35);

  const cycleState = () => {
    setState(s => {
      if (s === 'idle') return 'recording';
      if (s === 'recording') return 'playing';
      return 'idle';
    });
    if (state === 'recording') setProgress(0);
  };

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      <VoiceWaveform
        state={state}
        onToggle={cycleState}
        progress={progress}
        duration={124}
        onSeek={setProgress}
        showDiarization={state === 'playing'}
      />
    </div>
  );
}
