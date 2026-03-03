/* WelcomeScreen — Enhanced with dynamic suggestions, refresh, contextual greeting
   Composed from DS atoms (DSAvatar, DSButton, DSBadge)
   Phase 3 enhancements: refresh suggestions, onboarding cards, contextual header */
import { Sparkles, Code, FileText, Lightbulb, Palette, RefreshCw, Brain, Wrench, Globe, Zap } from 'lucide-react';
import { DSAvatar, DSButton, DSBadge } from '../ds/atoms';
import { useState, useCallback } from 'react';

interface WelcomeSuggestion {
  icon: React.ReactNode;
  text: string;
  category?: string;
}

interface WelcomeScreenProps {
  greeting?: string;
  subtext?: string;
  suggestions?: WelcomeSuggestion[];
  onSelect?: (text: string) => void;
  onRefresh?: () => void;
  showOnboarding?: boolean;
  contextProject?: string;
}

export function WelcomeScreen({
  greeting,
  subtext,
  suggestions,
  onSelect,
  onRefresh,
  showOnboarding = false,
  contextProject,
}: WelcomeScreenProps) {
  const [currentPool, setCurrentPool] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  /* -- Dynamic suggestion pools for refresh cycling -- */
  const pools: WelcomeSuggestion[][] = [
    suggestions || defaultSuggestions,
    alternateSuggestions1,
    alternateSuggestions2,
  ];
  const items = pools[currentPool % pools.length];

  /* -- Contextual greeting -- */
  const effectiveGreeting = greeting || (contextProject
    ? `Ready to continue with ${contextProject}?`
    : 'How can I help you today?');

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPool(p => p + 1);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 400);
  }, [onRefresh]);

  return (
    <div
      className="flex flex-col items-center"
      style={{
        gap: 'var(--token-space-6)',
        fontFamily: 'var(--token-font-sans)',
        width: '100%',
      }}
    >
      {/* Avatar + Greeting */}
      <div className="flex flex-col items-center" style={{
        gap: 'var(--token-space-3)',
        animation: 'token-fade-in 500ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <DSAvatar variant="ai" size={48} status="online" style={{ borderRadius: 'var(--token-radius-xl)' }} />
        <span
          style={{
            fontSize: 'var(--token-text-2xl)',
            fontWeight: 'var(--token-weight-semibold)',
            color: 'var(--token-text-primary)',
            letterSpacing: 'var(--token-tracking-tight)',
            textAlign: 'center',
          }}
        >
          {effectiveGreeting}
        </span>
        {subtext && (
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-tertiary)',
            textAlign: 'center',
            maxWidth: 360,
          }}>
            {subtext}
          </span>
        )}
      </div>

      {/* Onboarding cards for first-time users */}
      {showOnboarding && !onboardingDismissed && (
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: 440,
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 400ms cubic-bezier(0.16,1,0.3,1) 100ms both',
          }}
        >
          {onboardingTips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start"
              style={{
                gap: 'var(--token-space-3)',
                padding: 'var(--token-space-3)',
                borderRadius: 'var(--token-radius-lg)',
                background: 'var(--token-accent-muted)',
                border: '1px solid var(--token-border-subtle)',
              }}
            >
              <span style={{ color: 'var(--token-accent)', flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
              <div className="flex flex-col" style={{ gap: 2 }}>
                <span style={{ fontSize: 'var(--token-text-sm)', fontWeight: 'var(--token-weight-medium)', color: 'var(--token-text-primary)' }}>{tip.title}</span>
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-normal)' }}>{tip.description}</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setOnboardingDismissed(true)}
            className="cursor-pointer"
            style={{
              alignSelf: 'center', marginTop: 'var(--token-space-1)',
              fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)', border: 'none', background: 'none',
            }}
          >
            Dismiss tips
          </button>
        </div>
      )}

      {/* Suggestions Grid + Refresh */}
      <div className="flex flex-col w-full items-center" style={{ gap: 'var(--token-space-2)', maxWidth: 440 }}>
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--token-space-2)',
          }}
        >
          {items.map((s, i) => (
            <div key={`${currentPool}-${i}`} style={{
              animation: `token-fade-in 400ms cubic-bezier(0.16,1,0.3,1) ${200 + i * 80}ms both`,
            }}>
              <DSButton
                variant="outline"
                icon={<span className="shrink-0" style={{ color: 'var(--token-text-tertiary)', marginTop: 1 }}>{s.icon}</span>}
                onClick={() => onSelect?.(s.text)}
                style={{
                  gap: 'var(--token-space-3)',
                  padding: 'var(--token-space-3) var(--token-space-4)',
                  borderRadius: 'var(--token-radius-lg)',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-secondary)',
                  lineHeight: 'var(--token-leading-normal)',
                  whiteSpace: 'normal',
                  fontWeight: 'var(--token-weight-regular)',
                  width: '100%',
                }}
              >
                {s.text}
              </DSButton>
            </div>
          ))}
        </div>

        {/* Refresh suggestions button */}
        <DSButton
          variant="ghost"
          icon={<RefreshCw size={12} style={{
            transition: 'transform var(--token-duration-normal)',
            transform: refreshing ? 'rotate(180deg)' : 'none',
          }} />}
          onClick={handleRefresh}
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            padding: 'var(--token-space-1) var(--token-space-3)',
          }}
        >
          Refresh suggestions
        </DSButton>
      </div>
    </div>
  );
}

const defaultSuggestions: WelcomeSuggestion[] = [
  { icon: <Code size={15} />, text: 'Write a React component', category: 'Code' },
  { icon: <FileText size={15} />, text: 'Summarize a research paper', category: 'Research' },
  { icon: <Lightbulb size={15} />, text: 'Brainstorm product ideas', category: 'Creative' },
  { icon: <Palette size={15} />, text: 'Create a color palette', category: 'Design' },
];

const alternateSuggestions1: WelcomeSuggestion[] = [
  { icon: <Brain size={15} />, text: 'Explain quantum computing', category: 'Learning' },
  { icon: <Wrench size={15} />, text: 'Debug a Python script', category: 'Code' },
  { icon: <Globe size={15} />, text: 'Find recent AI research', category: 'Research' },
  { icon: <Zap size={15} />, text: 'Optimize a database query', category: 'Performance' },
];

const alternateSuggestions2: WelcomeSuggestion[] = [
  { icon: <FileText size={15} />, text: 'Draft a project proposal', category: 'Writing' },
  { icon: <Code size={15} />, text: 'Convert Python to TypeScript', category: 'Code' },
  { icon: <Lightbulb size={15} />, text: 'Analyze user feedback', category: 'Analysis' },
  { icon: <Sparkles size={15} />, text: 'Generate test data', category: 'Data' },
];

const onboardingTips = [
  { icon: <Sparkles size={14} />, title: 'AI-Powered', description: 'Ask anything - from code to creative writing to data analysis.' },
  { icon: <Wrench size={14} />, title: 'Tool Integration', description: 'I can search the web, run code, and connect to your tools via MCP.' },
  { icon: <Brain size={14} />, title: 'Context Memory', description: 'I remember your preferences across conversations for personalized help.' },
];

export function WelcomeScreenDemo() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [typing, setTyping] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSelect = (text: string) => {
    setSelectedText(text);
    setTyping('');
    setShowResponse(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => setShowResponse(true), 400);
        return;
      }
      setTyping(text.slice(0, i));
    }, 25);
  };

  const handleReset = () => {
    setSelectedText(null);
    setTyping('');
    setShowResponse(false);
  };

  return (
    <div style={{ maxWidth: 480, width: '100%' }}>
      {!selectedText ? (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-3)' }}>
          <WelcomeScreen
            onSelect={handleSelect}
            showOnboarding={showOnboarding}
            subtext="Select a suggestion or type your own prompt to get started."
          />
          <div className="flex justify-center">
            <DSButton
              variant="ghost"
              onClick={() => setShowOnboarding(!showOnboarding)}
              style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}
            >
              {showOnboarding ? 'Hide onboarding' : 'Show onboarding tips'}
            </DSButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-4)', animation: 'token-fade-in 300ms ease' }}>
          <div className="flex justify-end">
            <div style={{
              background: 'var(--token-user-bubble)',
              color: 'var(--token-user-bubble-text)',
              borderRadius: 'var(--token-radius-2xl)',
              padding: 'var(--token-space-3) var(--token-space-4)',
              maxWidth: '85%',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-base)',
            }}>
              {typing}
              {typing.length < selectedText.length && (
                <span style={{
                  display: 'inline-block', width: 2, height: '1em',
                  background: 'var(--token-accent)', marginLeft: 2,
                  verticalAlign: 'text-bottom',
                  animation: 'token-blink 1s step-end infinite',
                }} />
              )}
            </div>
          </div>
          {showResponse && (
            <div className="flex items-start" style={{ gap: 'var(--token-space-3)', animation: 'token-fade-in 300ms ease' }}>
              <DSAvatar variant="ai" size={28} />
              <div style={{
                fontSize: 'var(--token-text-sm)',
                color: 'var(--token-text-secondary)',
                lineHeight: 'var(--token-leading-relaxed)',
                fontFamily: 'var(--token-font-sans)',
              }}>
                Sure! I'd be happy to help you with that. Let me work on it...
              </div>
            </div>
          )}
          {showResponse && (
            <div className="flex justify-center" style={{ animation: 'token-fade-in 300ms ease 200ms both' }}>
              <button
                onClick={handleReset}
                className="cursor-pointer"
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                  border: 'none', background: 'none',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                Reset demo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
