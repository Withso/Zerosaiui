/* —— VoiceTranscription — Phase 3 Enhanced ——
   Phase 3: speaker diarization colors, word-level confidence,
   AI summary button with generated summary, language indicator,
   editable segments, export format options */
import { useState, useEffect } from 'react';
import { Mic, MicOff, Pause, Play, Copy, Download, Sparkles, Check, Edit3, Languages } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';
import { DSHeaderBar } from '../ds/molecules';

interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  confidence: number;
  isLive?: boolean;
}

/* —— Speaker color map —— */
const speakerColors: Record<string, string> = {
  'You': 'var(--token-accent)',
  'Speaker 1': 'var(--token-chart-4)',
  'Speaker 2': 'var(--token-chart-6)',
};

const mockSegments: TranscriptSegment[] = [
  { id: '1', speaker: 'You', text: 'Let me walk you through the new design system architecture we built.', timestamp: '0:00', confidence: 0.98 },
  { id: '2', speaker: 'You', text: 'The token system has four levels — raw values, primitives, semantic tokens, and component tokens.', timestamp: '0:12', confidence: 0.95 },
  { id: '3', speaker: 'You', text: 'Each atom is composed using semantic tokens so everything cascades properly when you change a theme.', timestamp: '0:28', confidence: 0.97 },
  { id: '4', speaker: 'You', text: 'And the molecules combine atoms into reusable patterns like search bars, toolbars, and form fields.', timestamp: '0:41', confidence: 0.92, isLive: true },
];

export function VoiceTranscriptionDemo() {
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(41);
  const [showSummary, setShowSummary] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording, isPaused]);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const wordCount = mockSegments.reduce((sum, seg) => sum + seg.text.split(' ').length, 0);

  return (
    <div style={{
      width: 400, borderRadius: 'var(--token-radius-xl)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      background: 'var(--token-bg)',
      overflow: 'hidden', fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Header */}
      <DSHeaderBar
        title="Live Transcription"
        icon={<Mic size={14} style={{ color: isRecording ? 'var(--token-error)' : 'var(--token-text-tertiary)' }} />}
        actions={
          <div className="flex items-center" style={{ gap: 6 }}>
            <div className="flex items-center" style={{ gap: 4 }}>
              <Languages size={10} style={{ color: 'var(--token-text-disabled)' }} />
              <span style={{ fontSize: '9px', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>EN</span>
            </div>
            <DSBadge variant={isRecording ? 'error' : 'default'}>
              {isRecording ? 'Recording' : 'Stopped'}
            </DSBadge>
            <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
              {fmtTime(elapsed)}
            </span>
          </div>
        }
      />

      {/* Waveform indicator */}
      {isRecording && !isPaused && (
        <div className="flex items-center justify-center" style={{
          height: 32, gap: 2, padding: '0 16px',
          background: 'var(--token-error-light)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
        }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{
              width: 2, borderRadius: 1,
              height: 4 + Math.random() * 16,
              background: 'var(--token-error)',
              opacity: 0.4 + Math.random() * 0.6,
              transition: 'height 100ms',
            }} />
          ))}
        </div>
      )}

      {/* AI Summary */}
      {showSummary && (
        <div style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          background: 'var(--token-accent-light)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border-subtle)',
          animation: 'token-fade-in 200ms ease',
        }}>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-1-5)' }}>
            <Sparkles size={11} style={{ color: 'var(--token-accent)' }} />
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-accent)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>
              AI Summary
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-secondary)',
            lineHeight: 'var(--token-leading-relaxed)',
          }}>
            Discussion covers a 4-level token architecture (raw → primitives → semantic → component), atom/molecule composition pattern with theme cascading, and reusable molecule patterns.
          </p>
        </div>
      )}

      {/* Transcript segments */}
      <div style={{ maxHeight: 240, overflowY: 'auto', padding: 'var(--token-space-3)' }}>
        {mockSegments.map((seg) => {
          const sColor = speakerColors[seg.speaker] || 'var(--token-text-tertiary)';
          return (
            <div key={seg.id} style={{
              padding: 'var(--token-space-2) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              marginBottom: 'var(--token-space-1)',
              background: seg.isLive ? 'var(--token-accent-muted)' : 'transparent',
              transition: 'background 200ms',
              borderLeftWidth: '2px',
              borderLeftStyle: 'solid',
              borderLeftColor: sColor,
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span style={{
                    fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)',
                    color: 'var(--token-text-disabled)',
                  }}>
                    {seg.timestamp}
                  </span>
                  <span style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: sColor,
                  }}>
                    {seg.speaker}
                  </span>
                  {seg.confidence < 0.95 && (
                    <DSBadge variant="secondary">
                      {Math.round(seg.confidence * 100)}%
                    </DSBadge>
                  )}
                </div>
                {/* Edit button */}
                <button
                  onClick={() => setEditingId(editingId === seg.id ? null : seg.id)}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 18, height: 18,
                    borderRadius: 'var(--token-radius-sm)',
                    borderWidth: 0,
                    borderStyle: 'none',
                    background: editingId === seg.id ? 'var(--token-accent-light)' : 'transparent',
                    color: editingId === seg.id ? 'var(--token-accent)' : 'var(--token-text-disabled)',
                    padding: 0,
                    opacity: 0.6,
                    transition: 'opacity var(--token-duration-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; }}
                >
                  <Edit3 size={9} />
                </button>
              </div>
              <p style={{
                margin: 0,
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-primary)',
                lineHeight: 'var(--token-leading-relaxed)',
              }}>
                {seg.text}
                {seg.isLive && (
                  <span style={{
                    display: 'inline-block',
                    width: 2, height: 14,
                    background: 'var(--token-accent)',
                    marginLeft: 2,
                    verticalAlign: 'text-bottom',
                    animation: 'token-blink 1s step-end infinite',
                  }} />
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="flex items-center" style={{
        padding: 'var(--token-space-1-5) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border-subtle)',
        gap: 'var(--token-space-3)',
      }}>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
          {mockSegments.length} segments
        </span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
          {wordCount} words
        </span>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)' }}>
          avg {Math.round(mockSegments.reduce((s, seg) => s + seg.confidence, 0) / mockSegments.length * 100)}% confidence
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
        background: 'var(--token-bg-secondary)',
      }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <DSButton
            variant={isRecording ? 'destructive' : 'primary'}
            icon={isRecording ? <MicOff size={12} /> : <Mic size={12} />}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? 'Stop' : 'Start'}
          </DSButton>
          {isRecording && (
            <DSButton
              variant="ghost"
              icon={isPaused ? <Play size={12} /> : <Pause size={12} />}
              onClick={() => setIsPaused(!isPaused)}
            />
          )}
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <DSButton
            variant="ghost"
            icon={copied ? <Check size={12} /> : <Copy size={12} />}
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          />
          <DSButton
            variant="ghost"
            icon={<Sparkles size={12} />}
            onClick={() => setShowSummary(!showSummary)}
            style={{ color: showSummary ? 'var(--token-accent)' : undefined }}
          />
          <DSButton variant="ghost" icon={<Download size={12} />} />
        </div>
      </div>
    </div>
  );
}
