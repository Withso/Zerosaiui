import { DSSkeleton, DSAvatar, DSButton } from '../ds/atoms';
import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/* —— Shimmer bar with stagger support —— */
function ShimmerBar({
  width = '100%',
  height = 12,
  delay = 0,
}: {
  width?: string | number;
  height?: number;
  delay?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 'var(--token-radius-sm)',
        background: 'linear-gradient(90deg, var(--token-bg-tertiary) 25%, var(--token-bg-hover) 50%, var(--token-bg-tertiary) 75%)',
        backgroundSize: '200% 100%',
        animation: `token-shimmer 1.5s linear infinite ${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    />
  );
}

/* —— Staggered entry wrapper —— */
function StaggerItem({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div style={{
      animation: `token-fade-in 300ms ease ${index * 60}ms both`,
    }}>
      {children}
    </div>
  );
}

/* —— Message skeleton —— */
export function MessageSkeleton({ staggerIndex = 0 }: { staggerIndex?: number }) {
  return (
    <StaggerItem index={staggerIndex}>
      <div className="flex" style={{ gap: 'var(--token-space-3)' }}>
        <DSSkeleton variant="avatar" width={28} height={28} />
        <div className="flex-1 flex flex-col" style={{ gap: 'var(--token-space-2)', paddingTop: 2 }}>
          <ShimmerBar width="35%" height={10} delay={staggerIndex * 60} />
          <ShimmerBar width="100%" height={12} delay={staggerIndex * 60 + 80} />
          <ShimmerBar width="80%" height={12} delay={staggerIndex * 60 + 160} />
          <ShimmerBar width="55%" height={12} delay={staggerIndex * 60 + 240} />
        </div>
      </div>
    </StaggerItem>
  );
}

/* —— Code skeleton —— */
export function CodeSkeleton({ staggerIndex = 0 }: { staggerIndex?: number }) {
  return (
    <StaggerItem index={staggerIndex}>
      <div style={{
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        overflow: 'hidden',
      }}>
        <div
          className="flex items-center"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            background: 'var(--token-bg-secondary)',
            borderBottom: '1px solid var(--token-border)',
            gap: 'var(--token-space-2)',
          }}
        >
          <ShimmerBar width={50} height={10} delay={staggerIndex * 60} />
          <div style={{ flex: 1 }} />
          <ShimmerBar width={24} height={10} delay={staggerIndex * 60 + 40} />
        </div>
        <div className="flex flex-col" style={{ padding: 'var(--token-space-4)', gap: 'var(--token-space-2)' }}>
          <ShimmerBar width="70%" height={10} delay={staggerIndex * 60 + 80} />
          <ShimmerBar width="90%" height={10} delay={staggerIndex * 60 + 140} />
          <ShimmerBar width="50%" height={10} delay={staggerIndex * 60 + 200} />
          <ShimmerBar width="80%" height={10} delay={staggerIndex * 60 + 260} />
          <ShimmerBar width="40%" height={10} delay={staggerIndex * 60 + 320} />
        </div>
      </div>
    </StaggerItem>
  );
}

/* —— Card skeleton —— */
export function CardSkeleton({ staggerIndex = 0 }: { staggerIndex?: number }) {
  return (
    <StaggerItem index={staggerIndex}>
      <div style={{
        padding: 'var(--token-space-4)',
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
      }}>
        <div className="flex items-center" style={{ gap: 'var(--token-space-3)', marginBottom: 'var(--token-space-4)' }}>
          <DSSkeleton variant="card" width={36} height={36} />
          <div className="flex-1 flex flex-col" style={{ gap: 'var(--token-space-1-5)' }}>
            <ShimmerBar width="40%" height={12} delay={staggerIndex * 60} />
            <ShimmerBar width="60%" height={10} delay={staggerIndex * 60 + 80} />
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
          <ShimmerBar width="100%" height={10} delay={staggerIndex * 60 + 160} />
          <ShimmerBar width="85%" height={10} delay={staggerIndex * 60 + 220} />
          <ShimmerBar width="70%" height={10} delay={staggerIndex * 60 + 280} />
        </div>
      </div>
    </StaggerItem>
  );
}

/* —— List skeleton —— */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)' }}>
      {Array.from({ length: count }, (_, i) => (
        <StaggerItem key={i} index={i}>
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-3)',
              padding: 'var(--token-space-2-5) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--token-border)',
            }}
          >
            <DSSkeleton variant="avatar" width={24} height={24} />
            <div className="flex-1 flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
              <ShimmerBar width={`${60 + Math.random() * 30}%`} height={10} delay={i * 80} />
              <ShimmerBar width={`${30 + Math.random() * 40}%`} height={8} delay={i * 80 + 60} />
            </div>
            <ShimmerBar width={48} height={20} delay={i * 80 + 120} />
          </div>
        </StaggerItem>
      ))}
    </div>
  );
}

/* —— Error fallback state —— */
function LoadError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: 'var(--token-space-6)',
        gap: 'var(--token-space-2)',
        borderRadius: 'var(--token-radius-lg)',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'var(--token-error)',
        background: 'color-mix(in srgb, var(--token-error) 3%, transparent)',
      }}
    >
      <AlertTriangle size={20} style={{ color: 'var(--token-error)' }} />
      <span style={{
        fontSize: 'var(--token-text-xs)',
        color: 'var(--token-text-secondary)',
        fontFamily: 'var(--token-font-sans)',
        textAlign: 'center',
      }}>
        {message || 'Failed to load content'}
      </span>
      {onRetry && (
        <DSButton variant="secondary" onClick={onRetry} style={{ fontSize: 'var(--token-text-2xs)', marginTop: 'var(--token-space-1)' }}>
          <RefreshCw size={10} /> Retry
        </DSButton>
      )}
    </div>
  );
}

/* —— Demo —— */
export function SkeletonLoaderDemo() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [key, setKey] = useState(0);
  const [view, setView] = useState<'all' | 'list' | 'error'>('all');

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    if (view === 'error') {
      const timer = setTimeout(() => setErrored(true), 1800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(timer);
  }, [key, view]);

  const handleRetry = () => {
    setKey(k => k + 1);
    setView('all');
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-4)', maxWidth: 420, width: '100%' }}>
      {/* View switcher */}
      <div className="flex items-center" style={{
        gap: 'var(--token-space-2)',
        fontFamily: 'var(--token-font-mono)',
        fontSize: 'var(--token-text-2xs)',
      }}>
        {(['all', 'list', 'error'] as const).map(v => (
          <button
            key={v}
            onClick={() => { setView(v); setKey(k => k + 1); }}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-1) var(--token-space-2)',
              borderRadius: 'var(--token-radius-sm)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: view === v ? 'var(--token-accent)' : 'var(--token-border)',
              background: view === v ? 'var(--token-accent-light)' : 'transparent',
              color: view === v ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
              fontSize: 'var(--token-text-2xs)',
              transition: 'all var(--token-duration-fast) var(--token-ease-default)',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Error view */}
      {view === 'error' && !errored && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
          <MessageSkeleton staggerIndex={0} />
          <CardSkeleton staggerIndex={1} />
        </div>
      )}
      {view === 'error' && errored && (
        <div style={{ animation: 'token-fade-in 300ms ease' }}>
          <LoadError message="Network timeout — API took too long to respond" onRetry={handleRetry} />
        </div>
      )}

      {/* List view */}
      {view === 'list' && !loaded && <ListSkeleton count={4} />}
      {view === 'list' && loaded && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', animation: 'token-fade-in 400ms ease' }}>
          {[
            { name: 'Research Agent', status: 'Active', emoji: '\uD83E\uDD16' },
            { name: 'Code Review', status: 'Idle', emoji: '\uD83D\uDCBB' },
            { name: 'Data Analyst', status: 'Running', emoji: '\uD83D\uDCCA' },
            { name: 'Writing Assistant', status: 'Complete', emoji: '\u270D\uFE0F' },
          ].map((item, i) => (
            <div
              key={item.name}
              className="flex items-center"
              style={{
                gap: 'var(--token-space-3)',
                padding: 'var(--token-space-2-5) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--token-border)',
                fontFamily: 'var(--token-font-sans)',
                animation: `token-fade-in 300ms ease ${i * 80}ms both`,
              }}
            >
              <span style={{ fontSize: 'var(--token-text-md)' }}>{item.emoji}</span>
              <div className="flex-1">
                <div style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>{item.name}</div>
                <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All view */}
      {view === 'all' && !loaded && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-5)' }}>
          <MessageSkeleton staggerIndex={0} />
          <CodeSkeleton staggerIndex={2} />
          <CardSkeleton staggerIndex={4} />
        </div>
      )}
      {view === 'all' && loaded && (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-5)' }}>
          {/* Real message */}
          <div className="flex" style={{ gap: 'var(--token-space-3)', animation: 'token-fade-in 400ms ease' }}>
            <DSAvatar variant="ai" size={28} />
            <div style={{
              flex: 1, fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)',
              lineHeight: 'var(--token-leading-relaxed)', fontFamily: 'var(--token-font-sans)', paddingTop: 2,
            }}>
              Transformers use self-attention to process all positions in parallel, making them faster to train than RNNs.
            </div>
          </div>

          {/* Real code */}
          <div style={{
            borderRadius: 'var(--token-radius-lg)',
            borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--token-border)',
            overflow: 'hidden',
            animation: 'token-fade-in 400ms ease 100ms both',
          }}>
            <div className="flex items-center" style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              background: 'var(--token-bg-secondary)',
              borderBottom: '1px solid var(--token-border)',
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-tertiary)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              attention.py
            </div>
            <pre style={{
              padding: 'var(--token-space-3)',
              fontSize: 'var(--token-text-xs)',
              fontFamily: 'var(--token-font-mono)',
              color: 'var(--token-text-secondary)',
              margin: 0,
              lineHeight: 'var(--token-leading-relaxed)',
            }}>
{`def attention(Q, K, V):
    scores = Q @ K.T / sqrt(d_k)
    return softmax(scores) @ V`}
            </pre>
          </div>

          {/* Real card */}
          <div style={{
            padding: 'var(--token-space-4)',
            borderRadius: 'var(--token-radius-lg)',
            borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--token-border)',
            animation: 'token-fade-in 400ms ease 200ms both',
          }}>
            <div className="flex items-center" style={{ gap: 'var(--token-space-3)', marginBottom: 'var(--token-space-3)' }}>
              <div className="flex items-center justify-center" style={{
                width: 36, height: 36,
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-accent-light)',
              }}>
                <span style={{ fontSize: 'var(--token-text-sm)' }}>&#x1F4CA;</span>
              </div>
              <div>
                <div style={{ fontSize: 'var(--token-text-sm)', fontWeight: 500, color: 'var(--token-text-primary)', fontFamily: 'var(--token-font-sans)' }}>Analysis Complete</div>
                <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-sans)' }}>3 patterns found</div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)', fontFamily: 'var(--token-font-sans)' }}>
              Cross-referenced 24 sources and identified key correlations in the dataset.
            </div>
          </div>
        </div>
      )}

      {/* Replay button */}
      <div className="flex justify-center">
        <button
          onClick={() => setKey(k => k + 1)}
          className="cursor-pointer"
          style={{
            fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)',
            fontFamily: 'var(--token-font-mono)',
            border: 'none', background: 'none',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}
        >
          {loaded || errored ? 'replay loading' : 'loading...'}
        </button>
      </div>
    </div>
  );
}
