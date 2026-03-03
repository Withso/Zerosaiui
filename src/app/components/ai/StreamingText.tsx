/* StreamingText — Enhanced with word-level streaming, pause/resume, speed control
   Composed from DS atoms (DSAvatar, DSButton, DSSkeleton)
   Phase 3: word-level chunking, pause/resume, speed toggle, token counter */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Pause, Play, Gauge } from 'lucide-react';
import { DSAvatar, DSButton, DSSkeleton, DSBadge } from '../ds/atoms';

type StreamMode = 'char' | 'word';

interface StreamingTextProps {
  text: string;
  speed?: number;
  mode?: StreamMode;
  showCursor?: boolean;
  onComplete?: () => void;
  showControls?: boolean;
}

export function StreamingText({
  text,
  speed = 20,
  mode = 'char',
  showCursor = true,
  onComplete,
  showControls = false,
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);

  /* Word-level chunking: split into tokens first */
  const chunks = mode === 'word' ? text.split(/(\s+)/) : text.split('');

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setIsComplete(false);
    setIsPaused(false);

    const tick = () => {
      if (pausedRef.current) return;
      indexRef.current += 1;
      if (indexRef.current >= chunks.length) {
        setDisplayed(text);
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      } else {
        setDisplayed(chunks.slice(0, indexRef.current).join(''));
      }
    };

    const effectiveSpeed = mode === 'word' ? currentSpeed * 3 : currentSpeed;
    const timer = setInterval(tick, effectiveSpeed);
    return () => clearInterval(timer);
  }, [text, currentSpeed, mode]);

  const togglePause = useCallback(() => setIsPaused(p => !p), []);
  const cycleSpeed = useCallback(() => {
    setCurrentSpeed(prev => {
      if (prev <= 10) return 40;
      if (prev <= 20) return 10;
      return 20;
    });
  }, []);

  const speedLabel = currentSpeed <= 10 ? '2x' : currentSpeed <= 20 ? '1x' : '0.5x';

  const tokenCount = mode === 'word'
    ? displayed.split(/\s+/).filter(Boolean).length
    : displayed.length;

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      <div
        style={{
          fontFamily: 'var(--token-font-sans)',
          fontSize: 'var(--token-text-base)',
          lineHeight: 'var(--token-leading-relaxed)',
          color: 'var(--token-text-primary)',
        }}
      >
        {displayed.split('').map((char, i) => {
          const isRecent = !isComplete && i >= displayed.length - 8;
          return (
            <span
              key={i}
              style={{
                opacity: isRecent ? undefined : 1,
                animation: isRecent ? 'token-fade-in 300ms var(--token-ease-default) forwards' : undefined,
              }}
            >
              {char}
            </span>
          );
        })}
        {showCursor && !isComplete && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: isPaused ? 'var(--token-warning)' : 'var(--token-accent)',
              marginLeft: 'var(--token-space-0-5)',
              verticalAlign: 'text-bottom',
              animation: isPaused ? 'none' : 'token-blink 1s step-end infinite',
              opacity: isPaused ? 0.5 : 1,
            }}
          />
        )}
      </div>

      {/* Streaming controls */}
      {showControls && !isComplete && (
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)', animation: 'token-fade-in 200ms ease' }}>
          <DSButton
            variant="ghost"
            icon={isPaused ? <Play size={10} /> : <Pause size={10} />}
            onClick={togglePause}
            style={{ padding: '2px 6px', fontSize: 'var(--token-text-2xs)', height: 20 }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </DSButton>
          <DSButton
            variant="ghost"
            icon={<Gauge size={10} />}
            onClick={cycleSpeed}
            style={{ padding: '2px 6px', fontSize: 'var(--token-text-2xs)', height: 20 }}
          >
            {speedLabel}
          </DSButton>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {tokenCount} {mode === 'word' ? 'words' : 'chars'}
          </span>
        </div>
      )}
    </div>
  );
}

/* shimmer line using DSSkeleton atom */
function ShimmerLine({ width }: { width: string }) {
  return <DSSkeleton width={width} height={12} />;
}

export function StreamingTextDemo() {
  const [key, setKey] = useState(0);
  const [phase, setPhase] = useState<'shimmer' | 'stream'>('shimmer');
  const [streamMode, setStreamMode] = useState<StreamMode>('word');

  useEffect(() => {
    const t = setTimeout(() => setPhase('stream'), 1200);
    return () => clearTimeout(t);
  }, [key]);

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-4)' }}>
      {/* Assistant header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--token-space-3)' }}>
          <DSAvatar variant="ai" size={28} />
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>
            {phase === 'shimmer' ? 'Preparing...' : 'Streaming response...'}
          </span>
        </div>
        {/* Mode toggle */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {(['char', 'word'] as StreamMode[]).map(m => (
            <button
              key={m}
              onClick={() => { setStreamMode(m); setPhase('shimmer'); setKey(k => k + 1); }}
              className="cursor-pointer"
              style={{
                padding: '2px 6px',
                borderRadius: 'var(--token-radius-sm)',
                border: `1px solid ${streamMode === m ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: streamMode === m ? 'var(--token-bg-hover)' : 'transparent',
                color: streamMode === m ? 'var(--token-accent)' : 'var(--token-text-disabled)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {phase === 'shimmer' ? (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', paddingLeft: 40 }}>
          <ShimmerLine width="90%" />
          <ShimmerLine width="75%" />
          <ShimmerLine width="60%" />
        </div>
      ) : (
        <div style={{ paddingLeft: 40 }}>
          <StreamingText
            key={key}
            text="Transformers use self-attention mechanisms to weigh the relevance of each part of the input data. Unlike sequential models, they process all tokens in parallel, enabling much faster training on modern hardware."
            speed={streamMode === 'word' ? 12 : 22}
            mode={streamMode}
            showControls
          />
        </div>
      )}

      <DSButton
        variant="outline"
        onClick={() => { setPhase('shimmer'); setKey(k => k + 1); }}
        style={{ alignSelf: 'flex-start', marginLeft: 40, borderRadius: 'var(--token-radius-full)', fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)' }}
      >
        Replay
      </DSButton>
    </div>
  );
}
