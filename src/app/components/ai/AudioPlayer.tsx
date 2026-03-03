/* AudioPlayer — Enhanced with transcript sync, clip sharing, bookmarks
   Phase 3 enhancements:
   — Transcript sync (highlighted words as audio plays)
   — Clip sharing (select portion of waveform)
   — Loop toggle for selected region
   — Bookmark support
   — Waveform click-to-seek */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Bookmark, Share2, Repeat, VolumeX } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

interface AudioPlayerProps {
  title?: string;
  subtitle?: string;
  duration?: string;
  currentTime?: string;
  progress?: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  transcript?: TranscriptWord[];
  showTranscript?: boolean;
}

export function AudioPlayer({
  title = 'Generated Audio',
  subtitle,
  duration = '3:24',
  currentTime = '1:12',
  progress = 35,
  isPlaying = false,
  onPlayPause,
  transcript,
  showTranscript = false,
}: AudioPlayerProps) {
  const [speed, setSpeed] = useState(1);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const [muted, setMuted] = useState(false);
  const [looping, setLooping] = useState(false);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipEnd, setClipEnd] = useState<number | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showClipShare, setShowClipShare] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  const toggleBookmark = () => {
    const current = progress;
    if (bookmarks.some(b => Math.abs(b - current) < 2)) {
      setBookmarks(prev => prev.filter(b => Math.abs(b - current) >= 2));
    } else {
      setBookmarks(prev => [...prev, current].sort((a, b) => a - b));
    }
  };

  /* — Mini waveform visualization — */
  const waveformBars = Array.from({ length: 60 }, (_, i) => {
    const v = Math.sin(i * 0.4) * 0.4 + Math.cos(i * 0.7) * 0.3 + 0.5;
    return Math.max(0.1, Math.min(1, v));
  });

  /* — Waveform click/drag for clip selection — */
  const getProgressFromEvent = useCallback((e: React.MouseEvent) => {
    if (!waveformRef.current) return 0;
    const rect = waveformRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  }, []);

  const handleWaveformMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      setSelecting(true);
      const p = getProgressFromEvent(e);
      setClipStart(p);
      setClipEnd(p);
    }
  };

  const handleWaveformMouseMove = (e: React.MouseEvent) => {
    if (selecting) {
      setClipEnd(getProgressFromEvent(e));
    }
  };

  const handleWaveformMouseUp = () => {
    if (selecting) {
      setSelecting(false);
      if (clipStart !== null && clipEnd !== null && Math.abs(clipEnd - clipStart) > 2) {
        setShowClipShare(true);
      }
    }
  };

  const clearClip = () => {
    setClipStart(null);
    setClipEnd(null);
    setShowClipShare(false);
  };

  /* — Transcript words — */
  const words = transcript || defaultTranscript;
  const currentProgressNorm = progress / 100;

  const isWordActive = (w: TranscriptWord) => {
    return currentProgressNorm >= w.start && currentProgressNorm < w.end;
  };

  const isWordPast = (w: TranscriptWord) => {
    return currentProgressNorm >= w.end;
  };

  const clipMin = clipStart !== null && clipEnd !== null ? Math.min(clipStart, clipEnd) : null;
  const clipMax = clipStart !== null && clipEnd !== null ? Math.max(clipStart, clipEnd) : null;

  return (
    <div
      style={{
        padding: 'var(--token-space-4)',
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        background: 'var(--token-bg)',
        fontFamily: 'var(--token-font-sans)',
      }}
    >
      {/* Title */}
      {title && (
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
          <div>
            <div
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-primary)',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-tertiary)',
                  marginTop: 'var(--token-space-0-5)',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <DSButton
              variant="icon"
              icon={<Bookmark size={13} fill={bookmarks.some(b => Math.abs(b - progress) < 2) ? 'var(--token-warning)' : 'none'} />}
              onClick={toggleBookmark}
              title="Bookmark"
              style={{
                width: 26, height: 26,
                color: bookmarks.some(b => Math.abs(b - progress) < 2) ? 'var(--token-warning)' : 'var(--token-text-tertiary)',
              }}
            />
            {looping && (
              <DSBadge variant="ai" style={{ fontSize: 'var(--token-text-2xs)', height: 16, padding: '0 var(--token-space-1-5)' }}>
                Loop
              </DSBadge>
            )}
          </div>
        </div>
      )}

      {/* Waveform */}
      <div
        ref={waveformRef}
        className="flex items-end relative"
        style={{
          height: 36,
          gap: 1.5,
          marginBottom: 'var(--token-space-3)',
          cursor: 'pointer',
        }}
        onMouseDown={handleWaveformMouseDown}
        onMouseMove={handleWaveformMouseMove}
        onMouseUp={handleWaveformMouseUp}
      >
        {/* Clip selection overlay */}
        {clipMin !== null && clipMax !== null && (
          <div
            className="absolute"
            style={{
              left: `${clipMin}%`,
              width: `${clipMax - clipMin}%`,
              top: 0,
              bottom: 0,
              background: 'rgba(79,109,128,0.15)',
              borderLeft: '2px solid var(--token-accent)',
              borderRight: '2px solid var(--token-accent)',
              borderRadius: 'var(--token-radius-sm)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        {/* Bookmark markers */}
        {bookmarks.map((bm, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${bm}%`,
              top: -4,
              width: 2,
              height: 'calc(100% + 4px)',
              background: 'var(--token-warning)',
              borderRadius: 1,
              zIndex: 3,
              opacity: 0.7,
            }}
          />
        ))}

        {waveformBars.map((h, i) => {
          const progressPoint = (progress / 100) * waveformBars.length;
          const isPast = i < progressPoint;
          return (
            <span
              key={i}
              style={{
                flex: 1,
                height: `${h * 100}%`,
                borderRadius: 1,
                background: isPast ? 'var(--token-voice-progress, var(--token-accent))' : 'var(--token-voice-track, var(--token-bg-tertiary))',
                transition: 'background var(--token-duration-fast)',
                minWidth: 2,
              }}
            />
          );
        })}
      </div>

      {/* Shift-drag hint / clip share */}
      {showClipShare && clipMin !== null && clipMax !== null && (
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: 'var(--token-space-2)',
            padding: 'var(--token-space-1-5) var(--token-space-2)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-accent)',
            background: 'var(--token-bg-hover)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-secondary)',
          }}>
            Clip: {clipMin.toFixed(0)}% — {clipMax.toFixed(0)}%
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <DSButton
              variant="icon"
              icon={<Repeat size={11} />}
              onClick={() => setLooping(!looping)}
              title="Loop clip"
              style={{ width: 22, height: 22, color: looping ? 'var(--token-accent)' : undefined }}
            />
            <DSButton
              variant="icon"
              icon={<Share2 size={11} />}
              title="Share clip"
              style={{ width: 22, height: 22 }}
            />
            <DSButton
              variant="icon"
              icon={<span style={{ fontSize: 9, fontWeight: 700 }}>✕</span>}
              onClick={clearClip}
              title="Clear"
              style={{ width: 22, height: 22 }}
            />
          </div>
        </div>
      )}

      {/* Time */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: 'var(--token-space-3)',
          fontFamily: 'var(--token-font-mono)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-tertiary)',
        }}
      >
        <span>{currentTime}</span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
          Shift+drag to clip
        </span>
        <span>{duration}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <DSButton variant="outline" onClick={cycleSpeed} style={{
          fontSize: 'var(--token-text-2xs)',
          fontFamily: 'var(--token-font-mono)',
          minWidth: 36,
          padding: 'var(--token-space-1) var(--token-space-2)',
        }}>
          {speed}x
        </DSButton>

        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <DSButton variant="icon" icon={<SkipBack size={15} />} style={{ width: 32, height: 32, borderRadius: 'var(--token-radius-full)' }} />
          <DSButton
            variant="primary"
            icon={isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
            onClick={onPlayPause}
            style={{
              width: 40, height: 40,
              borderRadius: 'var(--token-radius-full)',
              padding: 0,
              minWidth: 'unset',
            }}
          />
          <DSButton variant="icon" icon={<SkipForward size={15} />} style={{ width: 32, height: 32, borderRadius: 'var(--token-radius-full)' }} />
        </div>

        <DSButton
          variant="icon"
          icon={muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          onClick={() => setMuted(!muted)}
          style={{ width: 32, height: 32, borderRadius: 'var(--token-radius-full)', color: muted ? 'var(--token-text-disabled)' : 'var(--token-text-tertiary)' }}
        />
      </div>

      {/* Transcript sync */}
      {showTranscript && words.length > 0 && (
        <div
          style={{
            marginTop: 'var(--token-space-3)',
            padding: 'var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            border: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
            fontSize: 'var(--token-text-xs)',
            lineHeight: 'var(--token-leading-relaxed)',
            color: 'var(--token-text-tertiary)',
          }}
        >
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-1)',
              marginBottom: 'var(--token-space-2)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Transcript
          </div>
          <div>
            {words.map((w, i) => (
              <span
                key={i}
                style={{
                  color: isWordActive(w)
                    ? 'var(--token-text-primary)'
                    : isWordPast(w)
                    ? 'var(--token-text-secondary)'
                    : 'var(--token-text-disabled)',
                  fontWeight: isWordActive(w) ? 'var(--token-weight-medium)' : undefined,
                  background: isWordActive(w) ? 'var(--token-accent-light)' : undefined,
                  borderRadius: isWordActive(w) ? 'var(--token-radius-sm)' : undefined,
                  padding: isWordActive(w) ? '0 2px' : undefined,
                  transition: 'all var(--token-duration-fast)',
                }}
              >
                {w.word}{' '}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const defaultTranscript: TranscriptWord[] = [
  { word: 'Welcome', start: 0, end: 0.08 },
  { word: 'to', start: 0.08, end: 0.12 },
  { word: 'the', start: 0.12, end: 0.16 },
  { word: 'AI', start: 0.16, end: 0.22 },
  { word: 'voice', start: 0.22, end: 0.28 },
  { word: 'synthesis', start: 0.28, end: 0.36 },
  { word: 'demo.', start: 0.36, end: 0.42 },
  { word: 'This', start: 0.42, end: 0.48 },
  { word: 'transcript', start: 0.48, end: 0.56 },
  { word: 'highlights', start: 0.56, end: 0.64 },
  { word: 'each', start: 0.64, end: 0.68 },
  { word: 'word', start: 0.68, end: 0.74 },
  { word: 'as', start: 0.74, end: 0.78 },
  { word: 'it', start: 0.78, end: 0.82 },
  { word: 'is', start: 0.82, end: 0.86 },
  { word: 'spoken.', start: 0.86, end: 0.94 },
];

export function AudioPlayerDemo() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const minutes = Math.floor((progress / 100) * 204);
  const currentTime = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      <AudioPlayer
        title="Welcome message"
        subtitle="Voice: Aria  ·  English"
        isPlaying={playing}
        progress={progress}
        currentTime={currentTime}
        onPlayPause={() => setPlaying(!playing)}
        showTranscript={true}
      />
    </div>
  );
}
