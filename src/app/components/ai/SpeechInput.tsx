/* —— SpeechInput — Phase 3 Enhanced ——
   Phase 3: language indicator, confidence level, ambient waveform,
   real-time transcript preview, cancel confirmation, keyboard shortcut hint */
import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader, Languages, Volume2, Trash2 } from 'lucide-react';
import { DSButton, DSBadge, DSKbd } from '../ds/atoms';

type SpeechState = 'idle' | 'listening' | 'processing' | 'error';

interface SpeechInputProps {
  state?: SpeechState;
  onStart?: () => void;
  onStop?: () => void;
  onCancel?: () => void;
  transcript?: string;
  duration?: number;
  onTranscript?: (text: string) => void;
  language?: string;
  confidence?: number;
  showShortcutHint?: boolean;
}

export function SpeechInput({
  state: controlledState,
  onStart,
  onStop,
  onCancel,
  transcript,
  onTranscript,
  language = 'en-US',
  confidence,
  showShortcutHint = true,
}: SpeechInputProps) {
  const [internalState, setInternalState] = useState<SpeechState>('idle');
  const state = controlledState ?? internalState;
  const [elapsed, setElapsed] = useState(0);
  const [liveText, setLiveText] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const waveRef = useRef<number[]>([]);

  /* —— Timer —— */
  useEffect(() => {
    if (state === 'listening') {
      setElapsed(0);
      setLiveText('');
      setShowCancel(false);
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [state]);

  /* —— Simulate live transcript chunks —— */
  useEffect(() => {
    if (state !== 'listening') return;
    const phrases = ['Hello', 'Hello, I want to', 'Hello, I want to ask about', 'Hello, I want to ask about the new features...'];
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < phrases.length) {
        setLiveText(phrases[idx]);
        idx++;
      }
    }, 1200);
    return () => clearInterval(iv);
  }, [state]);

  /* —— Generate wave data —— */
  useEffect(() => {
    if (state === 'listening') {
      const iv = setInterval(() => {
        waveRef.current = Array.from({ length: 20 }).map(() => 6 + Math.random() * 22);
      }, 100);
      return () => clearInterval(iv);
    }
  }, [state]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'error') {
      if (!controlledState) setInternalState('listening');
      onStart?.();
    } else if (state === 'listening') {
      if (!controlledState) setInternalState('processing');
      onStop?.();
      if (!controlledState) {
        setTimeout(() => setInternalState('idle'), 2000);
      }
    }
  };

  const handleCancel = () => {
    setShowCancel(false);
    setLiveText('');
    if (!controlledState) setInternalState('idle');
    onCancel?.();
  };

  /* —— Mic icon per state —— */
  const micIcon =
    state === 'listening'
      ? <Square size={20} style={{ fill: 'currentColor' }} />
      : state === 'processing'
        ? <Loader size={22} style={{ animation: 'token-spin 1s linear infinite' }} />
        : <Mic size={22} />;

  return (
    <div
      className="flex flex-col items-center"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 'var(--token-space-4)',
      }}
    >
      {/* Language indicator */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <Languages size={12} style={{ color: 'var(--token-text-disabled)' }} />
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
          textTransform: 'uppercase',
        }}>
          {language}
        </span>
        {state === 'listening' && (
          <DSBadge variant="error" style={{ fontSize: '9px', padding: '0 4px', animation: 'token-pulse 1.5s ease-in-out infinite' }}>
            REC
          </DSBadge>
        )}
      </div>

      {/* Main button */}
      <div className="relative">
        {/* Pulse rings — listening only */}
        {state === 'listening' && (
          <div style={{ position: 'absolute', inset: -16, pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                inset: 8,
                borderRadius: 'var(--token-radius-full)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'var(--token-error)',
                opacity: 0.2,
                animation: 'token-pulse 2s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--token-radius-full)',
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: 'var(--token-error)',
                opacity: 0.1,
                animation: 'token-pulse 2s ease-in-out infinite 0.5s',
              }}
            />
          </div>
        )}

        <DSButton
          variant="primary"
          icon={micIcon}
          onClick={handleClick}
          style={{
            width: 64, height: 64,
            borderRadius: 'var(--token-radius-full)',
            padding: 0, minWidth: 'unset',
            background:
              state === 'listening'
                ? 'var(--token-error)'
                : state === 'processing'
                  ? 'var(--token-bg-tertiary)'
                  : state === 'error'
                    ? 'var(--token-error)'
                    : 'var(--token-text-primary)',
            color:
              state === 'processing'
                ? 'var(--token-text-tertiary)'
                : 'var(--token-text-inverse)',
            boxShadow:
              state === 'listening' ? '0 0 0 4px var(--token-error-light)' : 'var(--token-shadow-md)',
            position: 'relative',
            transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>

      {/* Status label */}
      <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-1)' }}>
        <span
          style={{
            fontSize: 'var(--token-text-sm)',
            color:
              state === 'listening'
                ? 'var(--token-error)'
                : state === 'processing'
                  ? 'var(--token-text-tertiary)'
                  : state === 'error'
                    ? 'var(--token-error)'
                    : 'var(--token-text-primary)',
            transition: 'color var(--token-duration-fast)',
          }}
        >
          {state === 'listening'
            ? 'Listening...'
            : state === 'processing'
              ? 'Processing...'
              : state === 'error'
                ? 'Failed — tap to retry'
                : 'Tap to speak'}
        </span>
        {state === 'listening' && (
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {formatTime(elapsed)}
          </span>
        )}
      </div>

      {/* Waveform bars — listening only */}
      {state === 'listening' && (
        <div className="flex items-center justify-center" style={{ gap: 3, height: 32 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                borderRadius: 2,
                background: 'var(--token-error)',
                opacity: 0.6,
                animation: `token-bounce ${0.4 + Math.random() * 0.4}s ease-in-out infinite ${i * 0.04}s`,
                height: 8 + Math.random() * 20,
              }}
            />
          ))}
        </div>
      )}

      {/* Live transcript preview */}
      {state === 'listening' && liveText && (
        <div
          style={{
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderRadius: 'var(--token-radius-lg)',
            background: 'var(--token-bg-secondary)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-border-subtle)',
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-normal)',
            maxWidth: 320,
            textAlign: 'center',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <span>{liveText}</span>
          <span style={{
            display: 'inline-block',
            width: 2,
            height: 14,
            background: 'var(--token-accent)',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'token-pulse 1s ease-in-out infinite',
          }} />
        </div>
      )}

      {/* Transcript result */}
      {transcript && state !== 'listening' && (
        <div
          style={{
            padding: 'var(--token-space-3) var(--token-space-4)',
            borderRadius: 'var(--token-radius-lg)',
            background: 'var(--token-bg-secondary)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-border)',
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-normal)',
            maxWidth: 320,
            textAlign: 'center',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          {transcript}
          {/* Confidence bar */}
          {confidence !== undefined && (
            <div className="flex items-center justify-center" style={{ gap: 'var(--token-space-2)', marginTop: 'var(--token-space-2)' }}>
              <Volume2 size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <div style={{
                flex: 1,
                maxWidth: 100,
                height: 3,
                borderRadius: 'var(--token-radius-full)',
                background: 'var(--token-bg-tertiary)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${confidence * 100}%`,
                  height: '100%',
                  borderRadius: 'var(--token-radius-full)',
                  background: confidence > 0.8 ? 'var(--token-success)' : confidence > 0.5 ? 'var(--token-warning)' : 'var(--token-error)',
                  transition: 'width 300ms ease',
                }} />
              </div>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                color: 'var(--token-text-disabled)',
              }}>
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Cancel action — listening */}
      {state === 'listening' && (
        <button
          onClick={handleCancel}
          className="flex items-center cursor-pointer"
          style={{
            gap: 'var(--token-space-1)',
            padding: 'var(--token-space-1) var(--token-space-3)',
            borderRadius: 'var(--token-radius-full)',
            borderWidth: 0,
            borderStyle: 'none',
            background: 'var(--token-bg-tertiary)',
            color: 'var(--token-text-tertiary)',
            fontSize: 'var(--token-text-2xs)',
            fontFamily: 'var(--token-font-mono)',
            transition: 'all var(--token-duration-fast)',
            animation: 'token-fade-in 300ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--token-bg-hover)';
            e.currentTarget.style.color = 'var(--token-error)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--token-bg-tertiary)';
            e.currentTarget.style.color = 'var(--token-text-tertiary)';
          }}
        >
          <Trash2 size={10} />
          Cancel
        </button>
      )}

      {/* Keyboard shortcut hint */}
      {state === 'idle' && showShortcutHint && (
        <div style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          Press <DSKbd>Space</DSKbd> to start
        </div>
      )}
    </div>
  );
}

export function SpeechInputDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 340, width: '100%', gap: 'var(--token-space-3)' }}>
      <SpeechInput language="en-US" />
    </div>
  );
}
