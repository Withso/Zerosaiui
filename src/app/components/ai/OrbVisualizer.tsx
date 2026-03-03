/* —— OrbVisualizer — Phase 3 Enhanced ——
   Phase 3: smooth state morphing, error state with glitch,
   cursor-reactive tilt, ambient particle ring, status text */
import { useState, useEffect, useRef, useCallback } from 'react';
import { DSBadge, DSButton } from '../ds/atoms';
import { AlertTriangle } from 'lucide-react';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface OrbVisualizerProps {
  state?: OrbState;
  size?: number;
  label?: string;
  agentName?: string;
  statusText?: string;
  onRetry?: () => void;
  enableCursorReact?: boolean;
}

/* —— State config —— */
const stateConfig: Record<OrbState, {
  gradient: string;
  shadow: string;
  label: string;
  pulseSpeed: string;
  pulseScale: number;
  glowOpacity: number;
}> = {
  idle: {
    gradient: 'radial-gradient(circle at 40% 35%, var(--token-text-tertiary), var(--token-text-disabled))',
    shadow: '0 0 20px rgba(0,0,0,0.1)',
    label: 'Ready',
    pulseSpeed: '0s',
    pulseScale: 1,
    glowOpacity: 0,
  },
  listening: {
    gradient: 'radial-gradient(circle at 40% 35%, var(--token-chart-4), var(--token-accent))',
    shadow: '0 0 40px rgba(126,144,155,0.3)',
    label: 'Listening',
    pulseSpeed: '2.5s',
    pulseScale: 1.08,
    glowOpacity: 0.15,
  },
  thinking: {
    gradient: 'radial-gradient(circle at 40% 35%, var(--token-chart-3), var(--token-chart-6))',
    shadow: '0 0 40px rgba(154,144,112,0.3)',
    label: 'Thinking',
    pulseSpeed: '2s',
    pulseScale: 1.04,
    glowOpacity: 0.12,
  },
  speaking: {
    gradient: 'radial-gradient(circle at 40% 35%, var(--token-chart-5), var(--token-chart-2))',
    shadow: '0 0 40px rgba(132,148,120,0.3)',
    label: 'Speaking',
    pulseSpeed: '0.8s',
    pulseScale: 1.12,
    glowOpacity: 0.2,
  },
  error: {
    gradient: 'radial-gradient(circle at 40% 35%, var(--token-error), #8b2020)',
    shadow: '0 0 40px rgba(181,74,74,0.4)',
    label: 'Error',
    pulseSpeed: '0.3s',
    pulseScale: 1.02,
    glowOpacity: 0.25,
  },
};

export function OrbVisualizer({
  state: controlledState,
  size = 120,
  label,
  agentName = 'AI',
  statusText,
  onRetry,
  enableCursorReact = true,
}: OrbVisualizerProps) {
  const [internalState, setInternalState] = useState<OrbState>('idle');
  const state = controlledState ?? internalState;
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [prevState, setPrevState] = useState<OrbState>(state);
  const [morphing, setMorphing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const config = stateConfig[state];

  /* —— Smooth state morph transition —— */
  useEffect(() => {
    if (state !== prevState) {
      setMorphing(true);
      const timer = setTimeout(() => {
        setPrevState(state);
        setMorphing(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [state, prevState]);

  /* —— Cursor reactivity —— */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableCursorReact || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTiltX(dy * -8);
    setTiltY(dx * 8);
  }, [enableCursorReact]);

  const handleMouseLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
  }, []);

  /* —— Particle ring dots —— */
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i / particleCount) * 360;
    const radius = size / 2 + 24;
    return { angle, radius, delay: i * 0.15 };
  });

  const orbTransform = [
    `perspective(600px)`,
    `rotateX(${tiltX}deg)`,
    `rotateY(${tiltY}deg)`,
    morphing ? `scale(0.92)` : `scale(1)`,
  ].join(' ');

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 'var(--token-space-4)',
      }}
    >
      {/* Orb container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size + 56, height: size + 56 }}
      >
        {/* Ambient particle ring */}
        {state !== 'idle' && state !== 'error' && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {particles.map((p, i) => {
              const x = (size + 56) / 2 + p.radius * Math.cos((p.angle * Math.PI) / 180) - 2;
              const y = (size + 56) / 2 + p.radius * Math.sin((p.angle * Math.PI) / 180) - 2;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 3,
                    height: 3,
                    borderRadius: 'var(--token-radius-full)',
                    background: 'var(--token-accent)',
                    opacity: 0.3,
                    animation: `token-pulse 2s ease-in-out infinite ${p.delay}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Outer glow rings */}
        {state !== 'idle' && (
          <div>
            <div
              style={{
                position: 'absolute',
                inset: 8,
                borderRadius: 'var(--token-radius-full)',
                background: config.gradient,
                opacity: config.glowOpacity * 0.4,
                animation: `token-pulse 3s ease-in-out infinite`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 16,
                borderRadius: 'var(--token-radius-full)',
                background: config.gradient,
                opacity: config.glowOpacity * 0.6,
                animation: `token-pulse 3s ease-in-out infinite 0.5s`,
              }}
            />
          </div>
        )}

        {/* Main orb */}
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 'var(--token-radius-full)',
            background: config.gradient,
            boxShadow: config.shadow,
            transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
            transform: orbTransform,
            position: 'relative',
            overflow: 'hidden',
            animation: state === 'error'
              ? 'orb-glitch 0.3s ease-in-out infinite'
              : state !== 'idle'
                ? `orb-pulse-${state} ${config.pulseSpeed} ease-in-out infinite`
                : undefined,
          }}
        >
          {/* Highlight sheen */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '35%',
              height: '25%',
              borderRadius: 'var(--token-radius-full)',
              background: 'rgba(255,255,255,0.25)',
              filter: 'blur(8px)',
              transition: 'opacity 400ms ease',
              opacity: state === 'error' ? 0.1 : 1,
            }}
          />

          {/* Inner glow for speaking */}
          {state === 'speaking' && (
            <div
              style={{
                position: 'absolute',
                inset: '20%',
                borderRadius: 'var(--token-radius-full)',
                background: 'rgba(255,255,255,0.1)',
                animation: 'token-pulse 0.8s ease-in-out infinite',
              }}
            />
          )}

          {/* Error icon overlay */}
          {state === 'error' && (
            <div
              className="flex items-center justify-center"
              style={{
                position: 'absolute',
                inset: 0,
                color: 'rgba(255,255,255,0.7)',
                animation: 'token-fade-in 300ms ease',
              }}
            >
              <AlertTriangle size={size * 0.3} />
            </div>
          )}

          {/* Thinking orbital ring */}
          {state === 'thinking' && (
            <div
              style={{
                position: 'absolute',
                inset: '15%',
                borderRadius: 'var(--token-radius-full)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderTopColor: 'rgba(255,255,255,0.2)',
                animation: 'token-spin 2s linear infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-1-5)' }}>
        <span
          style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-primary)',
          }}
        >
          {agentName}
        </span>

        {/* State badge */}
        <DSBadge variant={
          state === 'idle' ? 'default'
            : state === 'thinking' ? 'warning'
              : state === 'speaking' ? 'success'
                : state === 'error' ? 'error'
                  : 'ai'
        }>
          {label || config.label}
        </DSBadge>

        {/* Dynamic status text */}
        {statusText && (
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
              marginTop: 'var(--token-space-0-5)',
              animation: 'token-fade-in 200ms ease',
            }}
          >
            {statusText}
          </span>
        )}

        {/* Error retry */}
        {state === 'error' && onRetry && (
          <DSButton
            size="sm"
            variant="outline"
            onClick={onRetry}
            style={{
              marginTop: 'var(--token-space-2)',
              fontSize: 'var(--token-text-2xs)',
              borderRadius: 'var(--token-radius-full)',
              animation: 'token-fade-in 300ms ease',
            }}
          >
            Retry
          </DSButton>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes orb-pulse-listening {
          0%, 100% { transform: ${orbTransform} scale(1); }
          50% { transform: ${orbTransform} scale(1.08); }
        }
        @keyframes orb-pulse-thinking {
          0%, 100% { transform: ${orbTransform} scale(1); }
          50% { transform: ${orbTransform} scale(1.04); }
        }
        @keyframes orb-pulse-speaking {
          0%, 100% { transform: ${orbTransform} scale(1); }
          50% { transform: ${orbTransform} scale(1.12); }
        }
        @keyframes orb-glitch {
          0%, 100% { transform: ${orbTransform} translate(0, 0); }
          20% { transform: ${orbTransform} translate(-2px, 1px); }
          40% { transform: ${orbTransform} translate(2px, -1px); }
          60% { transform: ${orbTransform} translate(-1px, -2px); }
          80% { transform: ${orbTransform} translate(1px, 2px); }
        }
      `}</style>
    </div>
  );
}

export function OrbVisualizerDemo() {
  const [state, setState] = useState<OrbState>('idle');
  const [autoCycle, setAutoCycle] = useState(true);
  const states: OrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'error'];

  const statusTexts: Record<OrbState, string> = {
    idle: '',
    listening: 'Capturing audio...',
    thinking: 'Analyzing context...',
    speaking: 'Generating response...',
    error: 'Connection lost',
  };

  useEffect(() => {
    if (!autoCycle) return;
    const sequence: OrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'speaking', 'idle'];
    const durations = [1500, 2000, 2500, 2000, 1500, 1500];
    let idx = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const next = () => {
      setState(sequence[idx % sequence.length]);
      timeout = setTimeout(() => { idx++; next(); }, durations[idx % durations.length]);
    };
    next();
    return () => clearTimeout(timeout);
  }, [autoCycle]);

  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-6)', width: '100%' }}>
      <OrbVisualizer
        state={state}
        agentName="Nova"
        statusText={statusTexts[state]}
        onRetry={() => { setAutoCycle(false); setState('idle'); }}
      />

      {/* State buttons */}
      <div className="flex items-center flex-wrap justify-center" style={{ gap: 'var(--token-space-1)' }}>
        {states.map(s => (
          <DSButton
            key={s}
            variant={state === s ? 'secondary' : 'ghost'}
            onClick={() => { setAutoCycle(false); setState(s); }}
            style={{
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: 'var(--token-space-1-5) var(--token-space-3)',
              borderRadius: 'var(--token-radius-full)',
            }}
          >
            {s}
          </DSButton>
        ))}
      </div>

      {/* Auto-cycle toggle */}
      {!autoCycle && (
        <button
          onClick={() => setAutoCycle(true)}
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            background: 'none',
            borderWidth: 0,
            borderStyle: 'none',
            cursor: 'pointer',
            animation: 'token-fade-in 200ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
        >
          ↻ Auto-cycle
        </button>
      )}
    </div>
  );
}
