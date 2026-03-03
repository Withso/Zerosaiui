/* FeedbackActions — Enhanced with qualitative feedback popover + regenerate options
   Composed from DS atoms (DSButton)
   Phase 3: thumbs-down opens multi-choice feedback, regenerate has dropdown */
import { useState, useRef, useEffect } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Share, Check, ChevronDown, X } from 'lucide-react';
import { DSButton } from '../ds/atoms';
import { DSToolbar } from '../ds/molecules';

interface FeedbackActionsProps {
  onCopy?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: (reason?: string, detail?: string) => void;
  onRegenerate?: (option?: string) => void;
  onShare?: () => void;
}

const feedbackReasons = [
  'Inaccurate',
  'Unhelpful',
  'Too verbose',
  'Too brief',
  'Outdated info',
  'Other',
];

const regenerateOptions = [
  'Regenerate',
  'Regenerate (different model)',
  'Regenerate (more detail)',
  'Regenerate (shorter)',
];

export function FeedbackActions({
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onRegenerate,
  onShare,
}: FeedbackActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [showFeedbackPopover, setShowFeedbackPopover] = useState(false);
  const [showRegenMenu, setShowRegenMenu] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [feedbackDetail, setFeedbackDetail] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const regenRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsDown = () => {
    if (liked === false) {
      setLiked(null);
      setShowFeedbackPopover(false);
      return;
    }
    setLiked(false);
    setShowFeedbackPopover(true);
    setFeedbackSubmitted(false);
    setSelectedReasons([]);
    setFeedbackDetail('');
  };

  const submitFeedback = () => {
    onThumbsDown?.(selectedReasons.join(', '), feedbackDetail);
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedbackPopover(false), 1500);
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  /* Close popovers on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setShowFeedbackPopover(false);
      if (regenRef.current && !regenRef.current.contains(e.target as Node)) setShowRegenMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center" style={{ gap: 'var(--token-space-1)', position: 'relative' }}>
      {/* Copy */}
      <DSButton
        variant="ghost"
        icon={copied ? <Check size={14} /> : <Copy size={14} />}
        onClick={handleCopy}
        title="Copy"
        style={{ color: copied ? 'var(--token-success)' : undefined }}
      />

      {/* Thumbs Up */}
      <DSButton
        variant="ghost"
        icon={<ThumbsUp size={14} />}
        onClick={() => { setLiked(liked === true ? null : true); onThumbsUp?.(); setShowFeedbackPopover(false); }}
        title="Like"
        style={{ color: liked === true ? 'var(--token-success)' : undefined }}
      />

      {/* Thumbs Down + Feedback Popover */}
      <div style={{ position: 'relative' }} ref={popoverRef}>
        <DSButton
          variant="ghost"
          icon={<ThumbsDown size={14} />}
          onClick={handleThumbsDown}
          title="Dislike"
          style={{ color: liked === false ? 'var(--token-error)' : undefined }}
        />
        {showFeedbackPopover && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 8,
              zIndex: 50,
              width: 260,
              background: 'var(--token-bg)',
              border: '1px solid var(--token-border)',
              borderRadius: 'var(--token-radius-lg)',
              boxShadow: 'var(--token-shadow-lg)',
              padding: 'var(--token-space-3)',
              animation: 'token-fade-in 200ms ease',
            }}
          >
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-2)', padding: 'var(--token-space-2)' }}>
                <Check size={20} style={{ color: 'var(--token-success)' }} />
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-secondary)' }}>Thanks for your feedback</span>
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>What went wrong?</span>
                  <DSButton variant="ghost" icon={<X size={12} />} onClick={() => setShowFeedbackPopover(false)} style={{ padding: 4 }} />
                </div>
                <div className="flex flex-wrap" style={{ gap: 'var(--token-space-1)' }}>
                  {feedbackReasons.map(reason => (
                    <button
                      key={reason}
                      onClick={() => toggleReason(reason)}
                      className="cursor-pointer"
                      style={{
                        padding: '3px 10px',
                        borderRadius: 'var(--token-radius-full)',
                        fontSize: 'var(--token-text-2xs)',
                        fontFamily: 'var(--token-font-sans)',
                        border: selectedReasons.includes(reason) ? '1px solid var(--token-accent)' : '1px solid var(--token-border)',
                        background: selectedReasons.includes(reason) ? 'var(--token-accent-light)' : 'var(--token-bg)',
                        color: selectedReasons.includes(reason) ? 'var(--token-accent)' : 'var(--token-text-secondary)',
                        transition: 'all var(--token-duration-fast)',
                      }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Tell us more (optional)..."
                  value={feedbackDetail}
                  onChange={e => setFeedbackDetail(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: 'var(--token-space-2)',
                    border: '1px solid var(--token-border)',
                    borderRadius: 'var(--token-radius-md)',
                    background: 'var(--token-bg)',
                    fontSize: 'var(--token-text-xs)',
                    fontFamily: 'var(--token-font-sans)',
                    color: 'var(--token-text-primary)',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
                <DSButton
                  variant="primary"
                  onClick={submitFeedback}
                  disabled={selectedReasons.length === 0}
                  style={{ fontSize: 'var(--token-text-xs)', width: '100%' }}
                >
                  Submit feedback
                </DSButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Regenerate with dropdown */}
      <div style={{ position: 'relative' }} ref={regenRef}>
        <div className="flex items-center" style={{ gap: 0 }}>
          <DSButton
            variant="ghost"
            icon={<RotateCcw size={14} />}
            onClick={() => onRegenerate?.()}
            title="Regenerate"
          />
          <button
            onClick={() => setShowRegenMenu(!showRegenMenu)}
            className="cursor-pointer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 16, height: 28, border: 'none', background: 'transparent',
              color: 'var(--token-text-disabled)', cursor: 'pointer',
              borderRadius: 'var(--token-radius-sm)',
              transition: 'all var(--token-duration-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-secondary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
          >
            <ChevronDown size={10} />
          </button>
        </div>
        {showRegenMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              zIndex: 50,
              minWidth: 200,
              background: 'var(--token-bg)',
              border: '1px solid var(--token-border)',
              borderRadius: 'var(--token-radius-md)',
              boxShadow: 'var(--token-shadow-lg)',
              overflow: 'hidden',
              animation: 'token-fade-in 150ms ease',
            }}
          >
            {regenerateOptions.map(opt => (
              <RegenOption key={opt} label={opt} onClick={() => { onRegenerate?.(opt); setShowRegenMenu(false); }} />
            ))}
          </div>
        )}
      </div>

      {/* Share */}
      <DSButton
        variant="ghost"
        icon={<Share size={14} />}
        onClick={onShare}
        title="Share"
      />
    </div>
  );
}

function RegenOption({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer w-full"
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--token-space-2)',
        padding: 'var(--token-space-2) var(--token-space-3)',
        border: 'none', textAlign: 'left',
        background: hovered ? 'var(--token-bg-hover)' : 'transparent',
        color: hovered ? 'var(--token-text-primary)' : 'var(--token-text-secondary)',
        fontSize: 'var(--token-text-xs)',
        fontFamily: 'var(--token-font-sans)',
        transition: 'all var(--token-duration-fast)',
      }}
    >
      <RotateCcw size={12} style={{ color: 'var(--token-text-tertiary)', flexShrink: 0 }} />
      {label}
    </button>
  );
}

export function FeedbackActionsDemo() {
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 340, width: '100%', gap: 'var(--token-space-3)' }}>
      <FeedbackActions
        onCopy={() => setFeedback('Copied to clipboard')}
        onThumbsUp={() => setFeedback('Thanks for the positive feedback!')}
        onThumbsDown={(reason, detail) => setFeedback(`Feedback: ${reason}${detail ? ` - "${detail}"` : ''}`)}
        onRegenerate={(opt) => setFeedback(opt || 'Regenerating...')}
        onShare={() => setFeedback('Share link created')}
      />
      {feedback && (
        <div
          key={feedback}
          className="flex items-center"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderRadius: 'var(--token-radius-md)',
            background: 'var(--token-bg-hover)',
            border: '1px solid var(--token-border)',
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-secondary)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
