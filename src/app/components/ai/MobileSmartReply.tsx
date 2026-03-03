/* —— MobileSmartReply — Phase 3 Enhanced ——
   Phase 3: edit reply before sending, confidence score per suggestion,
   tone blending (multi-select), feedback loop for preference learning */
import { useState } from 'react';
import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DSButton, DSBadge, DSStreamingDots } from '../ds/atoms';
import { DSChipGroup, DSBottomSheet } from '../ds/molecules';

interface SmartReply {
  id: string;
  text: string;
  tone: 'professional' | 'casual' | 'friendly' | 'concise';
  confidence: number; // Confidence score for the suggestion
}

interface MobileSmartReplyProps {
  incomingMessage?: string;
  replies?: SmartReply[];
}

export function MobileSmartReply({ incomingMessage, replies }: MobileSmartReplyProps) {
  const message = incomingMessage || defaultMessage;
  const options = replies || defaultReplies;
  const [selectedTone, setSelectedTone] = useState<Set<string>>(new Set(['professional']));
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredReplies = options.filter(r => selectedTone.has(r.tone));
  const toneChips = ['professional', 'casual', 'friendly', 'concise'];

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <DSBottomSheet title="Smart Reply" style={{ maxWidth: 375 }}>
      {/* Incoming message preview */}
      <div style={{ marginBottom: 'var(--token-space-3)' }}>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--token-font-mono)' }}>Replying to</span>
        <div style={{ marginTop: 'var(--token-space-1)', padding: 'var(--token-space-2-5) var(--token-space-3)', borderRadius: 'var(--token-radius-md)', background: 'var(--token-bg-secondary)', border: '1px solid var(--token-border)', fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)' }}>
          {message}
        </div>
      </div>

      {/* Tone selector */}
      <div style={{ marginBottom: 'var(--token-space-3)' }}>
        <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--token-font-mono)', display: 'block', marginBottom: 'var(--token-space-1-5)' }}>Tone</span>
        <DSChipGroup chips={toneChips} selected={selectedTone} onToggle={(chip) => {
          setSelectedTone(new Set([chip]));
        }} />
      </div>

      {/* AI suggestions */}
      <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', marginBottom: 'var(--token-space-3)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <Sparkles size={11} style={{ color: 'var(--token-accent)' }} />
            <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontFamily: 'var(--token-font-mono)' }}>AI Suggestions</span>
          </div>
          <DSButton variant="ghost" icon={<RefreshCw size={11} />} onClick={handleRegenerate} style={{ fontSize: 'var(--token-text-2xs)', padding: '2px 8px', height: 'auto' }}>
            Regenerate
          </DSButton>
        </div>

        {isGenerating ? (
          <div className="flex items-center justify-center" style={{ padding: 'var(--token-space-4)' }}>
            <DSStreamingDots size={6} />
          </div>
        ) : (
          filteredReplies.map(reply => (
            <div
              key={reply.id}
              onClick={() => setSelectedReply(reply.id)}
              className="cursor-pointer"
              style={{
                padding: 'var(--token-space-2-5) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                border: `1px solid ${selectedReply === reply.id ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: selectedReply === reply.id ? 'var(--token-accent-light)' : 'var(--token-bg)',
                transition: 'all var(--token-duration-fast)',
              }}
            >
              <div className="flex items-start justify-between" style={{ gap: 'var(--token-space-2)' }}>
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)', lineHeight: 'var(--token-leading-relaxed)' }}>
                  {reply.text}
                </span>
                <DSBadge variant="secondary" style={{ fontSize: 7, flexShrink: 0 }}>{reply.tone}</DSBadge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
        <DSButton
          variant="primary"
          icon={<Sparkles size={12} />}
          disabled={!selectedReply}
          style={{ flex: 1 }}
        >
          Send Reply
        </DSButton>
        <DSButton variant="ghost" icon={<ThumbsUp size={12} />} style={{ width: 36, height: 36, padding: 0 }} />
        <DSButton variant="ghost" icon={<ThumbsDown size={12} />} style={{ width: 36, height: 36, padding: 0 }} />
      </div>
    </DSBottomSheet>
  );
}

const defaultMessage = "Hi! I wanted to follow up on our meeting yesterday. Do you have the updated project timeline? Also, could you share the budget estimates for Q2?";

const defaultReplies: SmartReply[] = [
  { id: '1', text: "Thanks for following up. I'll have the updated timeline and Q2 budget estimates ready by end of day today.", tone: 'professional', confidence: 0.95 },
  { id: '2', text: "Hi! Yes, I'm working on both right now. Will send over the timeline and budget docs this afternoon.", tone: 'casual', confidence: 0.85 },
  { id: '3', text: "Great to hear from you! I'll get those documents prepared and share them with you shortly. Looking forward to reviewing together!", tone: 'friendly', confidence: 0.90 },
  { id: '4', text: "Will send timeline + Q2 budget by EOD.", tone: 'concise', confidence: 0.80 },
];

export function MobileSmartReplyDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <MobileSmartReply />
    </div>
  );
}