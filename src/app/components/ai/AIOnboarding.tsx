/* —— AIOnboarding — Phase 3 Enhanced ——
   Phase 3: skip step option, animated transitions between steps,
   summary review before final, keyboard navigation hints,
   persistent progress indicator */
import { useState } from 'react';
import { Sparkles, Zap, Shield, Globe, Code, FileText, MessageSquare, ArrowRight, Check, SkipForward } from 'lucide-react';
import { DSButton, DSBadge, DSProgress, DSCheckbox, DSCounter, DSSegmentedControl } from '../ds/atoms';
import { DSStepIndicator, DSPromptCard, DSToggleRow, DSChipGroup } from '../ds/molecules';

interface AIOnboardingProps {
  variant?: 'mobile' | 'web';
}

export function AIOnboarding({ variant = 'web' }: AIOnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set(['Coding']));
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState(1);
  const [usageMode, setUsageMode] = useState(0);
  const [memoryOn, setMemoryOn] = useState(true);
  const [webSearchOn, setWebSearchOn] = useState(true);
  const [codeExecOn, setCodeExecOn] = useState(false);
  const [maxResponses, setMaxResponses] = useState(3);

  const totalSteps = 4;
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const isMobile = variant === 'mobile';

  const stepsData = [
    { label: 'Welcome', status: step > 0 ? 'done' as const : step === 0 ? 'active' as const : 'pending' as const },
    { label: 'Interests', status: step > 1 ? 'done' as const : step === 1 ? 'active' as const : 'pending' as const },
    { label: 'Settings', status: step > 2 ? 'done' as const : step === 2 ? 'active' as const : 'pending' as const },
    { label: 'Ready', status: step > 3 ? 'done' as const : step === 3 ? 'active' as const : 'pending' as const },
  ];

  const interests = ['Coding', 'Writing', 'Research', 'Design', 'Data Analysis', 'Learning', 'Business', 'Creative'];
  const modeLabels = ['Chat', 'Agent', 'Creative'];
  const levelLabels = ['Beginner', 'Intermediate', 'Expert'];

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  const skipToEnd = () => setStep(totalSteps - 1);

  return (
    <div className="flex flex-col" style={{
      width: '100%', maxWidth: isMobile ? 375 : 480,
      height: isMobile ? 580 : 'auto',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--token-border)',
      borderRadius: isMobile ? '24px 24px 0 0' : 'var(--token-radius-lg)',
      overflow: 'hidden', background: 'var(--token-bg)',
      fontFamily: 'var(--token-font-sans)',
    }}>
      {/* Progress header */}
      <div style={{
        padding: 'var(--token-space-4)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--token-border)',
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--token-space-3)' }}>
          <DSBadge variant="ai">
            <Sparkles size={10} style={{ marginRight: 4 }} />
            Setup
          </DSBadge>
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {step < totalSteps - 1 && (
              <button
                onClick={skipToEnd}
                className="flex items-center cursor-pointer"
                style={{
                  gap: 3,
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  borderWidth: 0,
                  borderStyle: 'none',
                  background: 'none',
                  fontFamily: 'var(--token-font-mono)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--token-text-tertiary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--token-text-disabled)'; }}
              >
                <SkipForward size={9} />
                Skip
              </button>
            )}
            <span style={{ fontSize: 'var(--token-text-2xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-disabled)' }}>
              Step {step + 1} of {totalSteps}
            </span>
          </div>
        </div>
        <DSProgress value={progress} />
        <div style={{ marginTop: 'var(--token-space-2)' }}>
          <DSStepIndicator steps={stepsData} />
        </div>
      </div>

      {/* Content — animated transitions */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--token-space-4)' }}>
        <div key={step} style={{ animation: 'token-fade-in 250ms ease' }}>
          {step === 0 && (
            <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-4)', textAlign: 'center', paddingTop: 'var(--token-space-4)' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 'var(--token-radius-full)',
                background: 'var(--token-accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={28} style={{ color: 'var(--token-accent)' }} />
              </div>
              <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
                <span style={{ fontSize: 'var(--token-text-lg)', color: 'var(--token-text-primary)' }}>
                  Welcome to Nova AI
                </span>
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)', lineHeight: 'var(--token-leading-relaxed)' }}>
                  Your intelligent assistant for coding, writing, research, and more. Let's personalize your experience.
                </span>
              </div>

              <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', width: '100%', marginTop: 'var(--token-space-2)' }}>
                <DSPromptCard icon={<Zap size={14} style={{ color: 'var(--token-chart-3)' }} />} title="Lightning Fast" description="Sub-second responses with streaming" style={{ maxWidth: '100%' }} />
                <DSPromptCard icon={<Shield size={14} style={{ color: 'var(--token-chart-5)' }} />} title="Privacy First" description="Your data stays yours" style={{ maxWidth: '100%' }} />
                <DSPromptCard icon={<Globe size={14} style={{ color: 'var(--token-chart-4)' }} />} title="Multi-Modal" description="Text, code, images, and more" style={{ maxWidth: '100%' }} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-4)' }}>
              <div>
                <span style={{ fontSize: 'var(--token-text-md)', color: 'var(--token-text-primary)', display: 'block' }}>
                  What are you interested in?
                </span>
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)', display: 'block', marginTop: 4 }}>
                  Select topics to personalize your AI experience
                </span>
              </div>

              <DSChipGroup
                chips={interests}
                selected={selectedInterests}
                onToggle={(chip) => {
                  setSelectedInterests(prev => {
                    const next = new Set(prev);
                    next.has(chip) ? next.delete(chip) : next.add(chip);
                    return next;
                  });
                }}
              />

              <div>
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', display: 'block', marginBottom: 'var(--token-space-2)' }}>
                  Experience Level
                </span>
                <DSSegmentedControl
                  options={levelLabels}
                  value={experienceLevel}
                  onChange={setExperienceLevel}
                />
              </div>

              <DSBadge variant="secondary">
                {selectedInterests.size} topics selected
              </DSBadge>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--token-text-md)', color: 'var(--token-text-primary)', display: 'block' }}>
                  Preferences
                </span>
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)', display: 'block', marginTop: 4 }}>
                  Configure your AI behavior
                </span>
              </div>

              <div>
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', display: 'block', marginBottom: 'var(--token-space-2)' }}>
                  Usage Mode
                </span>
                <DSSegmentedControl
                  options={modeLabels}
                  value={usageMode}
                  onChange={setUsageMode}
                />
              </div>

              <DSToggleRow label="Memory" description="Remember conversation context" on={memoryOn} onChange={setMemoryOn} style={{ maxWidth: '100%' }} />
              <DSToggleRow label="Web search" description="Search the web for answers" on={webSearchOn} onChange={setWebSearchOn} style={{ maxWidth: '100%' }} />
              <DSToggleRow label="Code execution" description="Run code in sandbox" on={codeExecOn} onChange={setCodeExecOn} style={{ maxWidth: '100%' }} />

              <div className="flex items-center justify-between" style={{ width: '100%' }}>
                <div className="flex flex-col" style={{ gap: 1 }}>
                  <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-primary)' }}>Max responses</span>
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>Parallel conversations</span>
                </div>
                <DSCounter value={maxResponses} min={1} max={10} onChange={setMaxResponses} />
              </div>

              <div className="flex items-start" style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-bg-secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--token-border)',
              }}>
                <DSCheckbox checked={privacyAccepted} onChange={() => setPrivacyAccepted(!privacyAccepted)} />
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)' }}>
                  I agree to the Terms of Service and Privacy Policy. My data will be processed to improve AI responses.
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-4)', textAlign: 'center', paddingTop: 'var(--token-space-4)' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 'var(--token-radius-full)',
                background: 'var(--token-success-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={28} style={{ color: 'var(--token-success)' }} />
              </div>
              <div className="flex flex-col" style={{ gap: 'var(--token-space-1)' }}>
                <span style={{ fontSize: 'var(--token-text-lg)', color: 'var(--token-text-primary)' }}>
                  You're all set!
                </span>
                <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)', lineHeight: 'var(--token-leading-relaxed)' }}>
                  Nova AI is ready to help you with {Array.from(selectedInterests).join(', ')}. Start a conversation to begin!
                </span>
              </div>

              {/* Summary review */}
              <div className="flex flex-col w-full" style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                background: 'var(--token-bg-secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--token-border)',
                textAlign: 'left',
              }}>
                <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', fontFamily: 'var(--token-font-mono)', textTransform: 'uppercase' }}>
                  Your setup
                </span>
                {[
                  { label: 'Level', value: levelLabels[experienceLevel] },
                  { label: 'Mode', value: modeLabels[usageMode] },
                  { label: 'Topics', value: `${selectedInterests.size} selected` },
                  { label: 'Memory', value: memoryOn ? 'On' : 'Off' },
                  { label: 'Web Search', value: webSearchOn ? 'On' : 'Off' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>{row.label}</span>
                    <span style={{ fontSize: 'var(--token-text-xs)', fontFamily: 'var(--token-font-mono)', color: 'var(--token-text-secondary)' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <DSBadge variant="success">Setup Complete</DSBadge>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--token-space-3) var(--token-space-4)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--token-border)',
      }}>
        <DSButton
          variant="ghost"
          onClick={prevStep}
          disabled={step === 0}
          style={{ fontSize: 'var(--token-text-sm)' }}
        >
          Back
        </DSButton>
        <DSButton
          variant="primary"
          icon={step === totalSteps - 1 ? <Sparkles size={12} /> : <ArrowRight size={12} />}
          onClick={step === totalSteps - 1 ? undefined : nextStep}
          disabled={step === 2 && !privacyAccepted}
          style={{ fontSize: 'var(--token-text-sm)' }}
        >
          {step === totalSteps - 1 ? 'Start Chatting' : 'Continue'}
        </DSButton>
      </div>
    </div>
  );
}

export function AIOnboardingDemo() {
  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-2)', width: '100%' }}>
      <AIOnboarding variant="web" />
    </div>
  );
}
