/* =================================================================
   Component Snapshots -- Static captures of component interaction states
   Each snapshot renders the actual component with controlled props to
   force a specific visual state, plus a state-specific token mapping.
   
   Used by DSDetailPage.tsx -- "Default" snapshot (index 0) stays
   interactive; snapshots 1+ are static previews with pointerEvents:none.

   Deep-analyzed: every clickable path, form view, mode switch, search
   result, expanded/collapsed toggle, and status transition is captured
   as its own snapshot with accurate token mappings.
   ================================================================= */
import type { ReactNode } from 'react';

/* ===============================================
   Types -- mirrors DSDetailPage TokenLayer shape
   =============================================== */
interface TokenLayer {
  layer: string;
  token: string;
  compToken?: string;
  primitive?: string;
  lightVal: string;
  darkVal: string;
  purpose: string;
  category: 'surface' | 'text' | 'border' | 'spacing' | 'shape' | 'motion' | 'shadow';
}

export interface SnapshotDef {
  id: string;
  label: string;
  description: string;
  tokens: TokenLayer[];
  render: () => ReactNode;
}

/* ===============================================
   tk() -- concise TokenLayer constructor
   =============================================== */
function tk(
  token: string,
  purpose: string,
  category: TokenLayer['category'],
  lightVal: string,
  darkVal: string,
  compToken?: string,
): TokenLayer {
  return { layer: 'L3', token, purpose, category, lightVal, darkVal, compToken };
}

/* ===============================================
   Component Imports
   =============================================== */
import { WelcomeScreen } from '../components/ai/WelcomeScreen';
import { ChatMessage } from '../components/ai/ChatMessage';
import { MarkdownResponse } from '../components/ai/MarkdownResponse';
import { ChatInput } from '../components/ai/ChatInput';
import { MultiModalInput } from '../components/ai/MultiModalInput';
import { PromptSuggestions } from '../components/ai/PromptSuggestions';
import { ChatHistory } from '../components/ai/ChatHistory';
import { Autocomplete } from '../components/ai/Autocomplete';
import { SystemMessage } from '../components/ai/SystemMessage';
import { PromptEnhancer } from '../components/ai/PromptEnhancer';
import { PromptTemplates } from '../components/ai/PromptTemplates';
import { FollowUpBar } from '../components/ai/FollowUpBar';
import { DynamicForm } from '../components/ai/DynamicForm';
import { ThinkingIndicator } from '../components/ai/ThinkingIndicator';
import { ReasoningTrace } from '../components/ai/ReasoningTrace';
import { ToolCall } from '../components/ai/ToolCall';
import { AnalysisProgress } from '../components/ai/AnalysisProgress';
import { StreamingText } from '../components/ai/StreamingText';
import { ActionPlan } from '../components/ai/ActionPlan';
import { ToolResult } from '../components/ai/ToolResult';
import { CodeBlock } from '../components/ai/CodeBlock';
import { FeedbackActions } from '../components/ai/FeedbackActions';
import { SourceCitation } from '../components/ai/SourceCitation';
import { FileAttachment } from '../components/ai/FileAttachment';
import { InlineActions } from '../components/ai/InlineActions';
import { ArtifactViewer } from '../components/ai/ArtifactViewer';
import { VariationsPicker } from '../components/ai/VariationsPicker';
import { ComparisonView } from '../components/ai/ComparisonView';
import { SearchResults } from '../components/ai/SearchResults';
import { FileTree } from '../components/ai/FileTree';
import { TerminalOutput } from '../components/ai/TerminalOutput';
import { DataTable } from '../components/ai/DataTable';
import { VoiceWaveform } from '../components/ai/VoiceWaveform';
import { AudioPlayer } from '../components/ai/AudioPlayer';
import { VoiceSelector } from '../components/ai/VoiceSelector';
import { SpeechInput } from '../components/ai/SpeechInput';
import { OrbVisualizer } from '../components/ai/OrbVisualizer';
import { ResearchCard } from '../components/ai/ResearchCard';
import { InsightCard } from '../components/ai/InsightCard';
import { ConfidenceScore } from '../components/ai/ConfidenceScore';
import { VerificationBadge } from '../components/ai/VerificationBadge';
import { ChartResult } from '../components/ai/ChartResult';
import { StylePresets } from '../components/ai/StylePresets';
import { ImageEditor } from '../components/ai/ImageEditor';
import { ImageGenGrid } from '../components/ai/ImageGenGrid';
import { AgentCard } from '../components/ai/AgentCard';
import { ThreadManager } from '../components/ai/ThreadManager';
import { CanvasWorkspace } from '../components/ai/CanvasWorkspace';
import { ModelSelector } from '../components/ai/ModelSelector';
import { TokenUsage } from '../components/ai/TokenUsage';
import { ContextWindow } from '../components/ai/ContextWindow';
import { MessageSkeleton, CardSkeleton, ListSkeleton, CodeSkeleton } from '../components/ai/SkeletonLoader';
import { AIDisclosure } from '../components/ai/AIDisclosure';
import { MemoryManager } from '../components/ai/MemoryManager';
import { MCPConnector } from '../components/ai/MCPConnector';
import { CostEstimator } from '../components/ai/CostEstimator';
import { ConsentDialog } from '../components/ai/ConsentDialog';
import { ParametersPanel } from '../components/ai/ParametersPanel';
import { KnowledgeBase } from '../components/ai/KnowledgeBase';
import { NotificationCenter } from '../components/ai/NotificationCenter';
import { MobileAIChat } from '../components/ai/MobileAIChat';
import { QuickActionsSheet } from '../components/ai/QuickActionsSheet';
import { MobileAgentTasks } from '../components/ai/MobileAgentTasks';
import { MobileSmartReply } from '../components/ai/MobileSmartReply';
import { MobileSearchAI } from '../components/ai/MobileSearchAI';
import { MobileNotifications } from '../components/ai/MobileNotifications';
import { AIUsageDashboard } from '../components/ai/AIUsageDashboard';
import { AIContextPanel } from '../components/ai/AIContextPanel';
import { AIOnboarding } from '../components/ai/AIOnboarding';
import { VoiceTranscriptionDemo } from '../components/ai/VoiceTranscription';
import { MeetingNotesDemo } from '../components/ai/MeetingNotes';
import { AICommandPaletteDemo } from '../components/ai/AICommandPalette';
import { ContextAttachmentsDemo } from '../components/ai/ContextAttachments';
import { ConversationForkDemo } from '../components/ai/ConversationFork';

import { Code, FileText, Lightbulb, Palette, Sparkles, Brain, Zap } from 'lucide-react';

/* ===============================================
   Shared token palettes
   =============================================== */
const T = {
  bg:        (p: string, c?: string) => tk('--token-bg', p, 'surface', '#ffffff', '#09090b', c),
  bgSec:     (p: string, c?: string) => tk('--token-bg-secondary', p, 'surface', '#fafafa', '#111113', c),
  bgTert:    (p: string, c?: string) => tk('--token-bg-tertiary', p, 'surface', '#f5f5f5', '#18181b', c),
  bgHover:   (p: string, c?: string) => tk('--token-bg-hover', p, 'surface', 'rgba(0,0,0,.04)', 'rgba(255,255,255,.05)', c),
  border:    (p: string, c?: string) => tk('--token-border', p, 'border', '#eaeaea', '#27272a', c),
  borderSub: (p: string, c?: string) => tk('--token-border-subtle', p, 'border', '#f0f0f0', '#1c1c1f', c),
  borderStr: (p: string, c?: string) => tk('--token-border-strong', p, 'border', '#d4d4d4', '#3f3f46', c),
  text1:     (p: string, c?: string) => tk('--token-text-primary', p, 'text', '#0a0a0a', '#ededed', c),
  text2:     (p: string, c?: string) => tk('--token-text-secondary', p, 'text', '#666666', '#a1a1a1', c),
  text3:     (p: string, c?: string) => tk('--token-text-tertiary', p, 'text', '#8f8f8f', '#707070', c),
  textDis:   (p: string, c?: string) => tk('--token-text-disabled', p, 'text', '#c4c4c4', '#3b3b3b', c),
  textInv:   (p: string, c?: string) => tk('--token-text-inverse', p, 'text', '#ffffff', '#0a0a0a', c),
  accent:    (p: string, c?: string) => tk('--token-accent', p, 'surface', '#4f6d80', '#6b8598', c),
  accentLt:  (p: string, c?: string) => tk('--token-accent-light', p, 'surface', '#dce3ea', '#131c22', c),
  accentFg:  (p: string, c?: string) => tk('--token-accent-fg', p, 'text', '#ffffff', '#ffffff', c),
  success:   (p: string, c?: string) => tk('--token-success', p, 'surface', '#2d7a60', '#6aab8a', c),
  warning:   (p: string, c?: string) => tk('--token-warning', p, 'surface', '#9f8136', '#d4aa55', c),
  error:     (p: string, c?: string) => tk('--token-error', p, 'surface', '#b54a4a', '#d47272', c),
  radiusLg:  (p: string, c?: string) => tk('--token-radius-lg', p, 'shape', '12px', '12px', c),
  radiusMd:  (p: string, c?: string) => tk('--token-radius-md', p, 'shape', '8px', '8px', c),
  radiusXl:  (p: string, c?: string) => tk('--token-radius-xl', p, 'shape', '16px', '16px', c),
  radiusFull:(p: string, c?: string) => tk('--token-radius-full', p, 'shape', '9999px', '9999px', c),
  shadowSm:  (p: string, c?: string) => tk('--token-shadow-sm', p, 'shadow', '0 1px 2px rgba(0,0,0,.05)', '0 1px 2px rgba(0,0,0,.3)', c),
  shadowLg:  (p: string, c?: string) => tk('--token-shadow-lg', p, 'shadow', '0 4px 12px rgba(0,0,0,.08)', '0 4px 12px rgba(0,0,0,.4)', c),
  durationFast: (p: string, c?: string) => tk('--token-duration-fast', p, 'motion', '120ms', '120ms', c),
  durationNorm: (p: string, c?: string) => tk('--token-duration-normal', p, 'motion', '200ms', '200ms', c),
  userBubble:    (p: string) => tk('--token-user-bubble', p, 'surface', '#f0f0f0', '#27272a'),
  userBubbleTxt: (p: string) => tk('--token-user-bubble-text', p, 'text', '#0a0a0a', '#ededed'),
  aiBubbleTxt:   (p: string) => tk('--token-ai-bubble-text', p, 'text', '#0a0a0a', '#ededed'),
  confHigh:  (p: string) => tk('--token-confidence-high', p, 'surface', '#2d7a60', '#6aab8a'),
  confMed:   (p: string) => tk('--token-confidence-medium', p, 'surface', '#9f8136', '#d4aa55'),
  confLow:   (p: string) => tk('--token-confidence-low', p, 'surface', '#b54a4a', '#d47272'),
};


/* ===============================================================
   SNAPSHOT DEFINITIONS -- keyed by component registry ID
   =============================================================== */

export const componentSnapshots: Record<string, SnapshotDef[]> = {

  /* ============================================================
     CHAT & CONVERSATION
     ============================================================ */

  'welcome-screen': [
    {
      id: 'ws-greeting',
      label: 'Greeting',
      description: 'Welcome screen with AI avatar (online status ring), greeting heading, 4 suggestion cards in 2x2 grid, and refresh suggestions button.',
      tokens: [
        T.bg('Page background'),
        T.text1('Greeting heading', '--ws-text-title'),
        T.text3('Suggestion card icon tint', '--ws-icon'),
        T.text2('Suggestion card text', '--ws-card-text'),
        T.accent('AI avatar ring', '--ws-accent'),
        T.success('Avatar online status dot', '--ws-status-online'),
        T.border('Card border default', '--ws-card-border'),
        T.borderStr('Card border on hover', '--ws-card-border-hover'),
        T.bgHover('Card hover fill', '--ws-card-hover'),
        T.textDis('Refresh button text', '--ws-refresh'),
        T.radiusLg('Card radius', '--ws-radius'),
        T.radiusXl('Avatar radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <WelcomeScreen greeting="What can I help you build?" subtext="Select a suggestion or type your own prompt." />
        </div>
      ),
    },
    {
      id: 'ws-onboarding',
      label: 'Onboarding',
      description: 'Welcome screen with onboarding tips for first-time users — 3 feature explanation cards before suggestion grid.',
      tokens: [
        T.bg('Page background'),
        T.text1('Greeting heading'),
        T.accent('Onboarding tip icon tint', '--ws-onboard-icon'),
        T.accentLt('Onboarding tip background', '--ws-onboard-bg'),
        T.borderSub('Onboarding tip border', '--ws-onboard-border'),
        T.text1('Tip title text'),
        T.text2('Tip description text'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <WelcomeScreen greeting="Welcome to Zeros AI" showOnboarding />
        </div>
      ),
    },
    {
      id: 'ws-contextual',
      label: 'Contextual',
      description: 'Welcome screen with contextual greeting based on active project. Greeting adapts dynamically.',
      tokens: [
        T.bg('Page background'),
        T.text1('Contextual greeting heading'),
        T.text3('Subtext color'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <WelcomeScreen contextProject="Design System v2" />
        </div>
      ),
    },
  ],

  'chat-message': [
    {
      id: 'cm-user',
      label: 'User',
      description: 'User bubble right-aligned. Hover reveals edit + copy buttons. Inline edit with save/cancel.',
      tokens: [
        T.userBubble('User bubble fill'),
        T.userBubbleTxt('User bubble text'),
        T.border('Edit/copy button borders', '--cm-action-border'),
        T.text3('Action button icons', '--cm-action-icon'),
        tk('--token-radius-2xl', 'Bubble corner radius', 'shape', '16px', '16px'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ChatMessage role="user" content="Can you explain how transformers work in simple terms?" timestamp="just now" onEdit={() => {}} />
        </div>
      ),
    },
    {
      id: 'cm-assistant',
      label: 'Assistant',
      description: 'Assistant response with model label, timestamp, branch action in hover bar.',
      tokens: [
        T.aiBubbleTxt('Response text color'),
        T.bgTert('Avatar background tint'),
        T.accent('Avatar sparkle + branch icon', '--cm-accent'),
        T.textDis('Model label + timestamp', '--cm-model'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ChatMessage role="assistant" content="Transformers process all words in a sentence simultaneously using attention mechanisms, rather than one at a time like older models." model="GPT-4o" timestamp="just now" onBranch={() => {}} />
        </div>
      ),
    },
    {
      id: 'cm-streaming',
      label: 'Streaming',
      description: 'Assistant streaming with blinking cursor, model label visible, no action bar.',
      tokens: [
        T.aiBubbleTxt('Streaming text color'),
        T.text1('Cursor blink color'),
        T.durationFast('Cursor blink speed'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ChatMessage role="assistant" content="The key innovation is the self-attention mechanism which allows the model to..." isStreaming={true} model="GPT-4o" />
        </div>
      ),
    },
  ],

  'markdown-response': [
    {
      id: 'mr-rich',
      label: 'Rich Content',
      description: 'Markdown response rendering headings, paragraphs, and inline code.',
      tokens: [
        T.text1('Body text', '--md-text'),
        T.bgTert('Code inline background', '--md-code-bg'),
        T.border('Divider line', '--md-divider'),
        T.accent('Link color', '--md-link'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <MarkdownResponse>
            <div>
              <h2 style={{ fontSize: 'var(--token-text-lg)', fontWeight: 'var(--token-weight-semibold)', color: 'var(--token-text-primary)', marginBottom: 8 }}>Understanding Attention</h2>
              <p style={{ color: 'var(--token-text-primary)', marginBottom: 8 }}>The attention mechanism computes weighted relationships between all positions in a sequence.</p>
              <p style={{ color: 'var(--token-text-primary)' }}>The formula uses <code style={{ background: 'var(--token-bg-tertiary)', padding: '1px 4px', borderRadius: 4, fontSize: '0.9em' }}>Q</code>, <code style={{ background: 'var(--token-bg-tertiary)', padding: '1px 4px', borderRadius: 4, fontSize: '0.9em' }}>K</code>, and <code style={{ background: 'var(--token-bg-tertiary)', padding: '1px 4px', borderRadius: 4, fontSize: '0.9em' }}>V</code> matrices.</p>
            </div>
          </MarkdownResponse>
        </div>
      ),
    },
  ],

  'chat-input': [
    {
      id: 'ci-empty',
      label: 'Empty',
      description: 'Chat input with active model pill, attachment/mic/@mention buttons, send disabled.',
      tokens: [
        T.bg('Input background', '--ci-bg'),
        T.border('Input border ring', '--ci-border'),
        T.accent('Focus ring + model pill + mention popup', '--ci-accent'),
        T.text3('Placeholder text', '--ci-placeholder'),
        T.textDis('Send disabled + char count', '--ci-btn-disabled'),
        T.bgTert('Send bg disabled + mention type pills', '--ci-btn-bg-disabled'),
        T.radiusXl('Container radius', '--ci-radius'),
        T.radiusFull('Send button radius'),
        T.shadowSm('Input shadow'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChatInput placeholder="Ask anything... (try @)" activeModel="GPT-4o" />
        </div>
      ),
    },
    {
      id: 'ci-streaming',
      label: 'Streaming',
      description: 'Chat input during streaming -- pulsing stop button replaces send.',
      tokens: [
        T.bg('Input background', '--ci-bg'),
        T.border('Input border', '--ci-border'),
        T.borderStr('Stop button border', '--ci-stop-border'),
        T.text1('Stop icon fill', '--ci-stop-icon'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChatInput isStreaming={true} placeholder="AI is responding..." activeModel="GPT-4o" />
        </div>
      ),
    },
    {
      id: 'ci-disabled',
      label: 'Disabled',
      description: 'Chat input disabled -- lower opacity, cannot type or send.',
      tokens: [
        T.bg('Input background', '--ci-bg'),
        T.border('Input border', '--ci-border'),
        T.textDis('Disabled placeholder', '--ci-text-disabled'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChatInput disabled={true} placeholder="AI is thinking..." />
        </div>
      ),
    },
  ],

  'multi-modal-input': [
    {
      id: 'mmi-text',
      label: 'Text Mode',
      description: 'Multi-modal input with Text tab active, quick attach buttons (image/URL/document) in send bar, paste-to-attach detection, and attachment count indicator.',
      tokens: [
        T.bg('Input container', '--mmi-bg'),
        T.border('Container border + tab divider', '--mmi-border'),
        T.bgTert('Active tab background', '--mmi-tab-active'),
        T.text1('Active tab text', '--mmi-tab-text-active'),
        T.text3('Inactive tab text + icons', '--mmi-tab-inactive'),
        T.accent('Attachment type icon tint + drag border', '--mmi-accent'),
        T.bgSec('Attachment chip background', '--mmi-attach-bg'),
        T.textDis('Attachment limit counter', '--mmi-limit'),
        T.radiusXl('Container radius', '--mmi-radius'),
        T.radiusMd('Tab radius', '--mmi-tab-radius'),
        T.shadowSm('Container shadow'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <MultiModalInput placeholder="Message with attachments..." />
        </div>
      ),
    },
    {
      id: 'mmi-streaming',
      label: 'Streaming',
      description: 'Multi-modal input during AI streaming — stop button replaces send, input disabled, pulsing red stop indicator.',
      tokens: [
        T.bg('Input container', '--mmi-bg'),
        T.border('Container border', '--mmi-border'),
        T.error('Stop button background', '--mmi-stop'),
        T.textDis('Disabled input text', '--mmi-disabled'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <MultiModalInput isStreaming={true} placeholder="AI is responding..." />
        </div>
      ),
    },
  ],

  'prompt-suggestions': [
    {
      id: 'ps-grid',
      label: 'Suggestion Grid',
      description: 'Prompt grid with category filters, refresh button, keyboard shortcut hints on cards.',
      tokens: [
        T.bg('Card surface', '--ps-card-bg'),
        T.border('Card + filter pill borders', '--ps-card-border'),
        T.borderStr('Card hover border', '--ps-card-border-hover'),
        T.text2('Card text', '--ps-card-text'),
        T.text3('Card icon', '--ps-icon'),
        T.bgHover('Card hover fill', '--ps-hover'),
        T.accent('Active filter pill + shortcut bg', '--ps-accent'),
        T.textDis('Refresh + shortcut text', '--ps-meta'),
        T.radiusLg('Card radius', '--ps-radius'),
        T.radiusFull('Filter pill radius', '--ps-pill-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <PromptSuggestions
            suggestions={[
              { icon: <Code size={16} />, text: 'Write a React hook for debouncing', category: 'code', shortcut: '\u23181' },
              { icon: <FileText size={16} />, text: 'Summarize this document', category: 'writing', shortcut: '\u23182' },
              { icon: <Lightbulb size={16} />, text: 'Brainstorm startup ideas', category: 'creative', shortcut: '\u23183' },
              { icon: <Palette size={16} />, text: 'Design a color palette', category: 'creative', shortcut: '\u23184' },
            ]}
            showCategories
            showShortcuts
            onRefresh={() => {}}
          />
        </div>
      ),
    },
  ],

  'chat-history': [
    {
      id: 'ch-list',
      label: 'History List',
      description: 'Chat history sidebar with conversations, pinned section, branch indicators (fork icon + count), hover actions (pin/archive/delete), unread dots, message counts, and summarize button in footer.',
      tokens: [
        T.bg('Panel background', '--ch-bg'),
        T.border('Panel border + item dividers', '--ch-border'),
        T.text1('Conversation title', '--ch-title'),
        T.text3('Preview text', '--ch-preview'),
        T.textDis('Timestamp + message count', '--ch-time'),
        T.bgHover('Active/hovered item highlight', '--ch-active'),
        T.accent('Unread dot color + summarize icon', '--ch-dot'),
        T.warning('Pinned star fill', '--ch-pinned'),
        T.bgSec('Search bar background', '--ch-search-bg'),
        T.radiusLg('Panel radius', '--ch-radius'),
        T.shadowSm('Hover actions overlay shadow', '--ch-actions-shadow'),
        T.error('Delete action color', '--ch-delete'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <ChatHistory
            conversations={[
              { id: '1', title: 'Transformer architecture', preview: 'Can you explain self-attention?', time: '2m', unread: true, branches: 2, messageCount: 12 },
              { id: '2', title: 'React performance', preview: 'How to optimize re-renders in...', time: '1h', pinned: true, messageCount: 8 },
              { id: '3', title: 'API design patterns', preview: 'REST vs GraphQL comparison...', time: '3h', branches: 1 },
              { id: '4', title: 'Color theory for UI', preview: 'What makes a good color palette...', time: '1d', pinned: true },
            ]}
            activeId="1"
          />
        </div>
      ),
    },
    {
      id: 'ch-empty',
      label: 'Empty',
      description: 'Chat history with no conversations — empty state showing "No conversations yet" message with search bar, "New Chat" button, and disabled summarize footer.',
      tokens: [
        T.bg('Panel background', '--ch-bg'), T.border('Panel border', '--ch-border'),
        T.textDis('Empty state text', '--ch-empty'), T.bgSec('Search bar background', '--ch-search-bg'),
        T.accent('"New Chat" button', '--ch-new'), T.radiusLg('Panel radius', '--ch-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <ChatHistory conversations={[]} />
        </div>
      ),
    },
  ],

  'autocomplete': [
    {
      id: 'ac-suggestion',
      label: 'With Suggestion',
      description: 'Autocomplete input showing ghost text suggestion that can be accepted with Tab. Ghost text appears in disabled color after typed text.',
      tokens: [
        T.bg('Input background', '--ac-bg'),
        T.border('Input border', '--ac-border'),
        T.borderStr('Input border on focus', '--ac-border-focus'),
        T.text1('Typed text', '--ac-text'),
        T.textDis('Ghost suggestion text', '--ac-ghost'),
        T.accent('Caret color', '--ac-caret'),
        T.radiusLg('Input radius', '--ac-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Autocomplete placeholder="Start typing..." />
        </div>
      ),
    },
  ],

  'system-message': [
    {
      id: 'sm-info',
      label: 'Info',
      description: 'System message with info variant -- accent left bar, accent-tinted background, info icon, copy-on-hover, dismissible.',
      tokens: [
        T.accent('Info icon + left bar + border tint', '--sm-info-icon'),
        T.text1('Message text', '--sm-text'),
        T.text2('Content text', '--sm-content'),
        T.textDis('Timestamp', '--sm-timestamp'),
        T.radiusLg('Banner radius', '--sm-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <SystemMessage variant="info" content="Context updated. The AI will now respond with code examples in TypeScript." timestamp="2s ago" dismissible />
        </div>
      ),
    },
    {
      id: 'sm-warning',
      label: 'Warning',
      description: 'System message with warning variant -- amber left bar, warning background tint, dismissible with action button.',
      tokens: [
        T.warning('Warning icon + left bar + border tint', '--sm-warning-icon'),
        T.text1('Message text', '--sm-text'),
        T.textDis('Timestamp', '--sm-timestamp'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <SystemMessage variant="warning" title="Rate Limit" content="You have 3 requests remaining in the current window. Resets in 45 seconds." dismissible actions={[{ label: 'View usage', onClick: () => {} }]} />
        </div>
      ),
    },
    {
      id: 'sm-context',
      label: 'Context',
      description: 'System message with context variant -- collapsible system prompt display, italic content, copy support.',
      tokens: [
        T.accent('Context icon + left bar', '--sm-ctx-icon'),
        T.text2('System prompt text (italic)', '--sm-ctx-text'),
        T.textDis('Timestamp (mono)', '--sm-timestamp'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <SystemMessage variant="context" title="System Prompt" content="You are a helpful coding assistant. Always provide working examples with TypeScript." timestamp="Session start" collapsible />
        </div>
      ),
    },
    {
      id: 'sm-config',
      label: 'Config',
      description: 'System message with config variant -- settings icon, mono content, collapsible with edit action.',
      tokens: [
        T.text3('Config icon + left bar', '--sm-cfg-icon'),
        T.bgSec('Config background', '--sm-cfg-bg'),
        T.text1('Config text (mono)', '--sm-cfg-text'),
        T.border('Border', '--sm-cfg-border'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <SystemMessage variant="config" content="Temperature: 0.7 -- Max tokens: 4,096 -- Top-p: 0.95 -- Model: GPT-4o" timestamp="Active" collapsible actions={[{ label: 'Edit config', onClick: () => {} }]} />
        </div>
      ),
    },
    {
      id: 'sm-error',
      label: 'Error',
      description: 'System message with error variant -- red left bar, error background tint, dismissible with retry action.',
      tokens: [
        T.error('Error icon + left bar + border tint', '--sm-error-icon'),
        T.text1('Error message text', '--sm-error-text'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <SystemMessage variant="error" title="Connection Lost" content="Unable to reach the API server. Retrying in 10 seconds..." dismissible actions={[{ label: 'Retry now', onClick: () => {} }]} />
        </div>
      ),
    },
  ],

  'prompt-enhancer': [
    {
      id: 'pe-low',
      label: 'Low Quality',
      description: 'Prompt enhancer with "Weak" score, category-tagged suggestions (specificity/style/technical), apply/undo per item, preview toggle, and remaining counter.',
      tokens: [
        T.bg('Panel background', '--pe-bg'),
        T.bgSec('Header background', '--pe-header'),
        T.border('Panel + section borders', '--pe-border'),
        T.error('Low score bar + strikethrough text', '--pe-score-low'),
        T.text1('Prompt text', '--pe-text'),
        T.success('Enhanced text + applied row tint', '--pe-enhanced'),
        T.text3('Enhancement labels', '--pe-label'),
        T.textDis('Section headers + category pills', '--pe-section-label'),
        T.accent('Apply/Undo + Enhance All + preview', '--pe-action'),
        T.accentLt('Apply button background', '--pe-action-bg'),
        T.radiusLg('Panel radius', '--pe-radius'),
        T.radiusFull('Score bar + pill radius', '--pe-bar-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <PromptEnhancer prompt="make a website" qualityScore={25} />
        </div>
      ),
    },
    {
      id: 'pe-high',
      label: 'High Quality',
      description: 'Prompt enhancer with "Strong" score (green bar), numeric %, minimal suggestions needed.',
      tokens: [
        T.bg('Panel background', '--pe-bg'),
        T.bgSec('Header background', '--pe-header'),
        T.success('High score bar + label', '--pe-score-high'),
        T.text1('Prompt text', '--pe-text'),
        T.accent('"Enhance All" button', '--pe-action'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <PromptEnhancer prompt="Create a responsive landing page for a SaaS product with a hero section, feature grid, pricing table, and testimonials using React and Tailwind CSS" qualityScore={92} />
        </div>
      ),
    },
  ],

  'prompt-templates': [
    {
      id: 'pt-list',
      label: 'Template List',
      description: 'Template list view showing 5 templates (Code Review, Summarize Document, Design Feedback, Data Analysis, Email Draft). Each row has icon, name, description. Clicking a template navigates to its form view.',
      tokens: [
        T.bg('Panel background', '--pt-bg'),
        T.border('Panel border + item dividers', '--pt-border'),
        T.text1('Template name', '--pt-title'),
        T.text3('Template description', '--pt-desc'),
        T.bgTert('Icon container background', '--pt-icon-bg'),
        T.text3('Icon color', '--pt-icon'),
        T.bgHover('Item hover background', '--pt-hover'),
        T.bgSec('Search bar background', '--pt-search-bg'),
        T.radiusLg('Panel radius', '--pt-radius'),
        T.radiusMd('Icon container radius', '--pt-icon-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <PromptTemplates />
        </div>
      ),
    },
    {
      id: 'pt-code-review',
      label: 'Code Review Form',
      description: 'After clicking "Code Review" template -- form view with DSBreadcrumb (Templates > Code Review), Language field, Code textarea, template preview in mono font, and "Use Template" primary button.',
      tokens: [
        T.bg('Form background'),
        T.bgSec('Breadcrumb header background', '--pt-breadcrumb-bg'),
        T.border('Form border + header divider', '--pt-form-border'),
        T.accent('Breadcrumb clickable link', '--pt-breadcrumb-link'),
        T.text1('Field labels', '--pt-label'),
        T.text3('Placeholder text', '--pt-placeholder'),
        T.bgTert('Template preview background', '--pt-preview-bg'),
        T.text2('Template preview text (mono)', '--pt-preview-text'),
        T.accent('"Use Template" button fill', '--pt-action'),
        T.accentFg('"Use Template" button text', '--pt-action-text'),
        T.radiusLg('Form radius'),
        T.radiusMd('Input + preview radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <PromptTemplates templates={[
            { id: '1', name: 'Code Review', description: 'Analyze code for bugs and improvements', icon: <Code size={14} />, template: 'Review the following {{language}} code for bugs, performance issues, and best practices:\n\n```\n{{code}}\n```', slots: [{ key: 'language', label: 'Language', placeholder: 'TypeScript' }, { key: 'code', label: 'Code', placeholder: 'Paste code here...' }] },
          ]} />
        </div>
      ),
    },
    {
      id: 'pt-email-draft',
      label: 'Email Draft Form',
      description: 'After clicking "Email Draft" template -- form view with 3 fields: Tone, Recipient, Subject. Shows template preview with slot placeholders in brackets.',
      tokens: [
        T.bg('Form background'),
        T.bgSec('Breadcrumb header background'),
        T.border('Form border + header divider'),
        T.accent('Breadcrumb clickable link'),
        T.text1('Field labels (Tone, Recipient, Subject)'),
        T.text3('Field placeholder text'),
        T.bgTert('Template preview background'),
        T.text2('Preview text with [placeholders]'),
        T.accent('"Use Template" button', '--pt-email-action'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <PromptTemplates templates={[
            { id: '5', name: 'Email Draft', description: 'Compose professional emails', icon: <FileText size={14} />, template: 'Write a {{tone}} email to {{recipient}} about {{subject}}.', slots: [{ key: 'tone', label: 'Tone', placeholder: 'professional' }, { key: 'recipient', label: 'Recipient', placeholder: 'the team' }, { key: 'subject', label: 'Subject', placeholder: 'project update' }] },
          ]} />
        </div>
      ),
    },
    {
      id: 'pt-summarize',
      label: 'Summarize Form',
      description: 'After clicking "Summarize Document" -- form with Document Type, Length, and Text fields. Template preview shows "Summarize the following [Document Type] in [Length] sentences:"',
      tokens: [
        T.bg('Form background'),
        T.bgSec('Breadcrumb header background'),
        T.border('Form border'),
        T.text1('Field labels (Document Type, Length, Text)'),
        T.text3('Placeholder text'),
        T.bgTert('Preview background'),
        T.accent('"Use Template" button'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 320 }}>
          <PromptTemplates templates={[
            { id: '2', name: 'Summarize Document', description: 'Create a concise summary', icon: <FileText size={14} />, template: 'Summarize the following {{type}} in {{length}} sentences:\n\n{{text}}', slots: [{ key: 'type', label: 'Document Type', placeholder: 'article' }, { key: 'length', label: 'Length', placeholder: '3-5' }, { key: 'text', label: 'Text', placeholder: 'Paste text here...' }] },
          ]} />
        </div>
      ),
    },
  ],

  'follow-up-bar': [
    {
      id: 'fub-suggestions',
      label: 'Suggestions',
      description: 'Follow-up bar showing 5 contextual follow-up buttons with type-coded dots (accent/green/amber), dismiss X buttons, arrow icons, and hover border transition.',
      tokens: [
        T.bg('Button background', '--fub-bg'),
        T.border('Button border', '--fub-border'),
        T.borderStr('Button border on hover', '--fub-border-hover'),
        T.bgHover('Button hover fill', '--fub-hover'),
        T.text2('Suggestion text', '--fub-text'),
        T.accent('Question dot', '--fub-dot-question'),
        T.success('Action dot', '--fub-dot-action'),
        T.warning('Explore dot', '--fub-dot-explore'),
        T.textDis('Arrow icon + section label + dismiss', '--fub-arrow'),
        T.radiusMd('Button radius', '--fub-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <FollowUpBar />
        </div>
      ),
    },
    {
      id: 'fub-filtered',
      label: 'With Filters',
      description: 'Follow-up bar with category filter tabs (All, Questions, Actions, Explore), refresh button, keyboard navigation hints, and custom input field.',
      tokens: [
        T.bg('Button background', '--fub-bg'),
        T.accent('Active filter tab', '--fub-filter-active'),
        T.border('Filter tab border', '--fub-filter-border'),
        T.accentFg('Active filter text', '--fub-filter-text'),
        T.text3('Inactive filter text', '--fub-filter-inactive'),
        T.textDis('Keyboard hint + refresh', '--fub-hint'),
        T.accent('Send button', '--fub-send'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <FollowUpBar showFilters showCustomInput showKeyboardHints onRefresh={() => {}} />
        </div>
      ),
    },
    {
      id: 'fub-loading',
      label: 'Loading',
      description: 'Follow-up bar in loading state showing 3 shimmer skeleton placeholders while AI generates new suggestions.',
      tokens: [
        T.bgTert('Skeleton shimmer', '--fub-skeleton'),
        T.textDis('Section label', '--fub-label-loading'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <FollowUpBar loading onRefresh={() => {}} />
        </div>
      ),
    },
  ],

  'dynamic-form': [
    {
      id: 'df-empty',
      label: 'Empty Form',
      description: 'AI-generated dynamic form with header (Sparkles icon, "Generate Report" title, AI Generated badge), 5 fields (text, select, select, textarea, toggle), and Submit button.',
      tokens: [
        T.bg('Form background', '--df-bg'),
        T.bgSec('Header + footer background', '--df-header'),
        T.border('Form border + field borders + dividers', '--df-border'),
        T.text1('Field labels', '--df-label'),
        T.text2('Field description text', '--df-desc'),
        T.text3('Placeholder text', '--df-placeholder'),
        T.accent('Sparkles icon + AI badge accent + Submit button', '--df-accent'),
        T.accentLt('AI badge background', '--df-badge-bg'),
        T.error('Required asterisk', '--df-required'),
        T.textDis('Field help text', '--df-help'),
        T.radiusLg('Form radius', '--df-radius'),
        T.radiusMd('Field radius', '--df-field-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <DynamicForm description="I'll generate a report based on your inputs. Fill in the details below." />
        </div>
      ),
    },
  ],


  /* ============================================================
     AI PROCESSING
     ============================================================ */

  'thinking-indicator': [
    {
      id: 'ti-dots',
      label: 'Dots',
      description: 'Thinking indicator with streaming dots + dynamic status text that cycles through steps. Shows ETA badge.',
      tokens: [
        T.accent('Dot animation color', '--ti-dot-color'),
        T.bgTert('AI avatar background', '--ti-avatar-bg'),
        T.textDis('Dynamic step text', '--ti-step-text'),
        T.durationFast('Dot bounce timing', '--ti-motion'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <ThinkingIndicator variant="dots" eta="~12s" />
        </div>
      ),
    },
    {
      id: 'ti-bar',
      label: 'Bar',
      description: 'Thinking indicator with shimmer bar + dynamic status label below. Avatar shows thinking status ring.',
      tokens: [
        T.text3('Shimmer gradient (mid)', '--ti-bar-gradient'),
        T.textDis('Shimmer gradient (edges) + step text', '--ti-bar-edges'),
        T.bgTert('Bar track background', '--ti-bar-track'),
        T.warning('Avatar thinking status ring', '--ti-thinking-ring'),
        T.radiusFull('Bar radius', '--ti-bar-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <ThinkingIndicator variant="bar" eta="~30s" />
        </div>
      ),
    },
    {
      id: 'ti-minimal',
      label: 'Minimal',
      description: 'Thinking indicator minimal variant -- blinking cursor pipe with dynamic status text and optional ETA.',
      tokens: [
        T.text3('Label text + cursor color', '--ti-min-text'),
        T.textDis('ETA text', '--ti-min-eta'),
        T.durationFast('Cursor blink speed', '--ti-min-blink'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <ThinkingIndicator variant="minimal" eta="~5s" />
        </div>
      ),
    },
    {
      id: 'ti-custom-steps',
      label: 'Custom Steps',
      description: 'Thinking indicator with custom step array -- cycles through user-defined process steps.',
      tokens: [
        T.accent('Dot animation color', '--ti-dot-color'),
        T.textDis('Custom step text', '--ti-step-text'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <ThinkingIndicator variant="dots" steps={['Searching web...', 'Reading sources...', 'Synthesizing...']} eta="~20s" />
        </div>
      ),
    },
  ],

  'reasoning-trace': [
    {
      id: 'rt-thinking',
      label: 'Thinking',
      description: 'Reasoning trace active -- per-step confidence bars, duration, expandable sub-thoughts, pulsing dot.',
      tokens: [
        T.accent('Brain icon pulse', '--rt-brain'),
        T.bg('Container background', '--rt-bg'),
        T.border('Container + timeline border', '--rt-border'),
        T.text2('Step text', '--rt-step-text'),
        T.success('High confidence bar', '--rt-conf-high'),
        T.warning('Medium confidence', '--rt-conf-med'),
        T.textDis('Duration + sub-step numbers', '--rt-meta'),
        T.durationFast('Pulse animation', '--rt-pulse'),
        T.radiusLg('Container radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ReasoningTrace
            steps={[
              { label: 'Analyzing the code structure and dependencies', confidence: 92, duration: '1.2s', subSteps: ['Parsing import graph', 'Identifying circular deps'] },
              { label: 'Identifying potential optimization points', confidence: 78, duration: '2.1s' },
              { label: 'Evaluating trade-offs between approaches', confidence: 65, duration: '1.8s' },
            ]}
            isComplete={false}
            defaultOpen={true}
          />
        </div>
      ),
    },
    {
      id: 'rt-complete',
      label: 'Complete',
      description: 'Reasoning trace completed with total duration, token usage, per-step confidence.',
      tokens: [
        T.text3('Brain icon static', '--rt-brain-done'),
        T.bg('Container background', '--rt-bg'),
        T.border('Container border', '--rt-border'),
        T.text2('Completed step text', '--rt-step-done'),
        T.text3('Duration badge', '--rt-duration'),
        T.textDis('Token count + step durations', '--rt-meta-done'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ReasoningTrace
            steps={[
              { label: 'Parsed user intent as code refactoring request', confidence: 95, duration: '0.8s' },
              { label: 'Identified 3 functions eligible for optimization', confidence: 88, duration: '1.4s' },
              { label: 'Selected strategy: memoization + lazy evaluation', confidence: 91, duration: '2.5s' },
            ]}
            duration="4.7s"
            isComplete={true}
            defaultOpen={true}
            tokenCount={1247}
          />
        </div>
      ),
    },
  ],

  'tool-call': [
    {
      id: 'tc-running',
      label: 'Running',
      description: 'Tool call running -- DSSpinner animates, collapsible parameters visible. Icon in tertiary square.',
      tokens: [
        T.bgSec('Header background', '--tc-bg'),
        T.border('Card border', '--tc-border'),
        T.accent('Spinner color + param values', '--tc-spinner'),
        T.bgTert('Icon container + param section bg', '--tc-icon-bg'),
        T.text2('Icon color', '--tc-icon'),
        T.text1('Tool name', '--tc-title'),
        T.text3('Description', '--tc-desc'),
        T.radiusMd('Card radius', '--tc-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ToolCall
            toolName="web_search"
            description="Searching for recent transformer papers..."
            status="running"
            icon="search"
            parameters={{ query: '"transformer architecture"', limit: 10 }}
          />
        </div>
      ),
    },
    {
      id: 'tc-success',
      label: 'Success',
      description: 'Tool call completed -- green checkmark, summary line, duration badge, expandable result + params.',
      tokens: [
        T.bgSec('Header background', '--tc-bg'),
        T.border('Card border', '--tc-border'),
        T.success('Check icon + summary text', '--tc-success'),
        T.text1('Tool name', '--tc-title'),
        T.text3('Description + chevron', '--tc-desc'),
        T.textDis('Duration + param labels (mono)', '--tc-duration'),
        T.accent('Param value color', '--tc-param-val'),
        T.bgTert('Param section bg', '--tc-param-bg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ToolCall
            toolName="web_search"
            description="Search for transformer architecture papers"
            status="success"
            result="Found 12 relevant papers from arxiv.org"
            summary="Found 12 relevant articles"
            icon="search"
            duration="1.3s"
            parameters={{ query: '"transformer architecture"', limit: 10, safe_search: true }}
          />
        </div>
      ),
    },
    {
      id: 'tc-error',
      label: 'Error',
      description: 'Tool call failed -- red error icon + red-tinted border, error message expandable.',
      tokens: [
        T.bgSec('Header background', '--tc-bg'),
        T.error('Error icon + card border tint', '--tc-error'),
        T.text1('Tool name', '--tc-title'),
        T.text3('Error description', '--tc-error-msg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ToolCall
            toolName="database_query"
            description="Querying user analytics table"
            status="error"
            result="Connection timeout after 30s"
            icon="database"
            parameters={{ table: 'analytics', timeout: '30s' }}
          />
        </div>
      ),
    },
  ],

  'analysis-progress': [
    {
      id: 'ap-running',
      label: 'In Progress',
      description: 'Analysis progress with mixed statuses, overall progress bar, step counter, cancel button on active step, and elapsed time on completed steps.',
      tokens: [
        T.bg('Container', '--ap-bg'),
        T.border('Container border', '--ap-border'),
        T.accent('Active step spinner + progress bar', '--ap-active'),
        T.success('Completed step check', '--ap-done'),
        T.text3('Pending step text (dimmed)', '--ap-pending'),
        T.text1('Active/done step label', '--ap-label'),
        T.text2('Step descriptions', '--ap-desc'),
        T.textDis('Duration badges + cancel button', '--ap-meta'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <AnalysisProgress
            title="ANALYZING CODEBASE"
            showOverallProgress
            onCancelStep={() => {}}
            steps={[
              { label: 'Parsing file structure', status: 'done' as const, description: '142 files scanned', duration: 3 },
              { label: 'Analyzing dependencies', status: 'active' as const, description: 'Checking npm packages' },
              { label: 'Running static analysis', status: 'pending' as const },
              { label: 'Generating report', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'ap-complete',
      label: 'Complete',
      description: 'Analysis fully completed with all green checkmarks, elapsed times, partial result badges, completion banner, and full progress bar.',
      tokens: [
        T.bg('Container', '--ap-bg'),
        T.border('Container border', '--ap-border'),
        T.success('All completed checks + progress bar + banner', '--ap-done'),
        T.text1('Step labels', '--ap-label'),
        T.text2('Step descriptions', '--ap-desc'),
        T.bgTert('Result badges', '--ap-result-bg'),
        T.textDis('Duration badges', '--ap-duration'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <AnalysisProgress
            title="ANALYSIS COMPLETE"
            showOverallProgress
            steps={[
              { label: 'Parsing file structure', status: 'done' as const, description: '142 files scanned', duration: 3, result: '142 files in 12 directories' },
              { label: 'Analyzing dependencies', status: 'done' as const, description: '38 packages checked', duration: 5, result: '2 outdated, 0 vulnerabilities' },
              { label: 'Running static analysis', status: 'done' as const, description: '3 issues found', duration: 8, result: '3 warnings, 0 errors' },
              { label: 'Generating report', status: 'done' as const, description: 'Report ready', duration: 4, result: 'Summary report generated (2.4k words)' },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'ap-partial',
      label: 'Partially Cancelled',
      description: 'Analysis with cancelled step (strikethrough, ban icon) and partial results from completed steps. Warning-colored summary banner.',
      tokens: [
        T.bg('Container', '--ap-bg'),
        T.success('Done step check', '--ap-done'),
        T.textDis('Cancelled step (strikethrough + ban icon)', '--ap-cancelled'),
        T.text3('Pending step', '--ap-pending'),
        T.warning('Partial completion banner', '--ap-partial-banner'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <AnalysisProgress
            title="ANALYSIS INTERRUPTED"
            showOverallProgress
            steps={[
              { label: 'Parsing file structure', status: 'done' as const, description: '142 files scanned', duration: 3, result: '142 files found' },
              { label: 'Analyzing dependencies', status: 'done' as const, description: '38 packages checked', duration: 5 },
              { label: 'Running static analysis', status: 'cancelled' as const, description: 'Step cancelled by user' },
              { label: 'Generating report', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'ap-failed',
      label: 'With Failure',
      description: 'Analysis with a failed step (red error icon, error text) and retry button. Red border on container, error-colored summary banner.',
      tokens: [
        T.bg('Container', '--ap-bg'),
        T.error('Failed step icon + border + banner', '--ap-error'),
        T.success('Done step check', '--ap-done'),
        T.text3('Pending step', '--ap-pending'),
        T.error('Retry button', '--ap-retry'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <AnalysisProgress
            title="ANALYSIS ERROR"
            showOverallProgress
            onRetryStep={() => {}}
            steps={[
              { label: 'Parsing file structure', status: 'done' as const, description: '142 files scanned', duration: 3 },
              { label: 'Analyzing dependencies', status: 'failed' as const, description: 'Connection timeout after 30s' },
              { label: 'Running static analysis', status: 'pending' as const },
              { label: 'Generating report', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
  ],

  'streaming-text': [
    {
      id: 'st-char',
      label: 'Character',
      description: 'Text streaming character-by-character with blinking accent cursor. Pause/resume and speed controls visible.',
      tokens: [
        T.text1('Streamed text', '--st-text'),
        T.accent('Cursor color (streaming)', '--st-cursor'),
        T.warning('Cursor color (paused)', '--st-cursor-paused'),
        T.durationFast('Character timing', '--st-speed'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <StreamingText
            text="React Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client."
            speed={30}
            mode="char"
            showControls
          />
        </div>
      ),
    },
    {
      id: 'st-word',
      label: 'Word',
      description: 'Text streaming word-by-word for more natural reading. Includes pause/resume, speed toggle, and word counter.',
      tokens: [
        T.text1('Streamed text', '--st-text'),
        T.accent('Cursor color', '--st-cursor'),
        T.textDis('Word counter + speed label', '--st-controls'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <StreamingText
            text="Transformers process all tokens in parallel using self-attention mechanisms, enabling significantly faster training compared to sequential recurrent models."
            speed={12}
            mode="word"
            showControls
          />
        </div>
      ),
    },
  ],

  'action-plan': [
    {
      id: 'apl-pending',
      label: 'Pending',
      description: 'Action plan with all steps pending, overall progress bar at 0%, skip buttons on each step, and Approve & Run / Edit Plan action buttons.',
      tokens: [
        T.bg('Plan background', '--apl-bg'),
        T.border('Plan border', '--apl-border'),
        T.text1('Step labels', '--apl-step-text'),
        T.text3('Pending icons + counter', '--apl-pending'),
        T.accent('Approve button + sparkles icon', '--apl-approve-btn'),
        T.radiusLg('Plan radius', '--apl-radius'),
        T.textDis('Skip buttons', '--apl-skip'),
        T.bgTert('Progress bar track', '--apl-progress-track'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <ActionPlan
            title="Refactoring Plan"
            onSkipStep={() => {}}
            showProgress
            steps={[
              { id: '1', label: 'Extract shared utilities', status: 'pending' as const },
              { id: '2', label: 'Update import paths', status: 'pending' as const },
              { id: '3', label: 'Run test suite', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'apl-running',
      label: 'Executing',
      description: 'Action plan mid-execution -- step 1 done with duration badge, step 2 running (spinner + description), step 3 pending with skip option. ETA and progress bar shown.',
      tokens: [
        T.success('Completed step check + line', '--apl-done'),
        T.accent('Running spinner + progress bar', '--apl-running'),
        T.text3('Pending step (dimmed)', '--apl-pending-text'),
        T.text2('Running step description', '--apl-running-desc'),
        T.textDis('Duration badge + ETA', '--apl-timing'),
        T.bg('Plan background', '--apl-bg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <ActionPlan
            title="Refactoring Plan"
            showProgress
            steps={[
              { id: '1', label: 'Extract shared utilities', status: 'done' as const, duration: 3 },
              { id: '2', label: 'Update import paths', status: 'running' as const, description: 'Processing 24 files...', duration: 2 },
              { id: '3', label: 'Run test suite', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'apl-subtasks',
      label: 'With Subtasks',
      description: 'Action plan with expandable subtask lists -- step 1 shows 3 subtasks (2 done, 1 pending) in expanded view with mini checkboxes.',
      tokens: [
        T.success('Done subtask checkmark', '--apl-subtask-done'),
        T.border('Pending subtask circle', '--apl-subtask-pending'),
        T.text2('Subtask label', '--apl-subtask-text'),
        T.text3('Done subtask label (dimmed)', '--apl-subtask-done-text'),
        T.accent('Expand chevron', '--apl-expand'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <ActionPlan
            title="Implementation Plan"
            showProgress
            steps={[
              { id: '1', label: 'Analyze codebase', status: 'done' as const, duration: 5, subtasks: [
                { label: 'Scan directory tree', done: true },
                { label: 'Identify entry points', done: true },
                { label: 'Map dependencies', done: true },
              ]},
              { id: '2', label: 'Create components', status: 'running' as const, description: 'Generating files...', subtasks: [
                { label: 'Create component skeletons', done: true },
                { label: 'Add prop interfaces', done: false },
              ]},
              { id: '3', label: 'Write tests', status: 'pending' as const },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'apl-skipped',
      label: 'With Skipped Step',
      description: 'Action plan with a skipped step (skip-forward icon, strikethrough text, dimmed) -- all other steps done. Completion banner shows total elapsed time.',
      tokens: [
        T.success('Done step + banner', '--apl-done'),
        T.textDis('Skipped step icon + text', '--apl-skipped'),
        T.bgTert('Skipped step circle', '--apl-skipped-bg'),
        T.success('Completion banner', '--apl-complete-banner'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <ActionPlan
            title="Refactoring Plan"
            showProgress
            steps={[
              { id: '1', label: 'Extract shared utilities', status: 'done' as const, duration: 3 },
              { id: '2', label: 'Update import paths', status: 'done' as const, duration: 5 },
              { id: '3', label: 'Run test suite', status: 'skipped' as const },
            ]}
          />
        </div>
      ),
    },
  ],

  'tool-result': [
    {
      id: 'tr-weather',
      label: 'Weather',
      description: 'Tool result card for weather data -- collapsible header with status badge, 2x2 data grid, raw JSON toggle, copy action, footer with source attribution and execution time.',
      tokens: [
        T.bg('Card background', '--tr-bg'),
        T.border('Card border + cell dividers', '--tr-border'),
        tk('--token-chart-4', 'Weather accent (header icon + tint)', 'surface', '#36a3c2', '#5bbdd6', '--tr-weather-accent'),
        T.text1('Data values', '--tr-data-text'),
        T.textDis('Data labels (mono uppercase)', '--tr-data-label'),
        T.success('Status badge (Completed)', '--tr-status'),
        T.bgSec('Footer background', '--tr-footer'),
        T.accent('Copy/Open actions', '--tr-action'),
        T.radiusLg('Card radius', '--tr-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <ToolResult
            type="weather"
            title="San Francisco, CA"
            data={{ Temperature: '68\u00b0F', Humidity: '72%', Wind: '12 mph', Conditions: 'Partly Cloudy' }}
            footer="via OpenWeather API"
            executionTime="230ms"
            rawOutput={'{"temp":"68F","humidity":"72%","wind":"12 mph"}'}
          />
        </div>
      ),
    },
    {
      id: 'tr-stock',
      label: 'Stock',
      description: 'Tool result card for stock data -- collapsible with status badge, purple-accented header, price/change/volume/market cap grid, raw output view.',
      tokens: [
        T.bg('Card background', '--tr-bg'),
        T.border('Card border', '--tr-border'),
        tk('--token-chart-5', 'Stock accent (header)', 'surface', '#7c6bc4', '#9b8ed6', '--tr-stock-accent'),
        T.text1('Price values', '--tr-price'),
        T.textDis('Data labels', '--tr-labels'),
        T.success('Status badge', '--tr-status'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <ToolResult
            type="stock"
            title="AAPL -- Apple Inc."
            data={{ Price: '$178.42', Change: '+2.31%', Volume: '52.4M', 'Market Cap': '$2.8T' }}
            executionTime="450ms"
          />
        </div>
      ),
    },
    {
      id: 'tr-error',
      label: 'Error',
      description: 'Tool result card in error state -- red border, error status badge, expandable error message with retry action.',
      tokens: [
        T.error('Error border + icon + status badge + message', '--tr-error'),
        T.bg('Card background', '--tr-bg'),
        T.text1('Title text', '--tr-title'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <ToolResult
            type="calculation"
            title="Token Cost Estimate"
            data={{}}
            status="error"
            errorMessage="API rate limit exceeded. Retry after 30 seconds."
            onRetry={() => {}}
          />
        </div>
      ),
    },
  ],


  /* ============================================================
     RESPONSE & ACTIONS
     ============================================================ */

  'code-block': [
    {
      id: 'cb-code',
      label: 'Code View',
      description: 'Code block with filename header, copy button, word-wrap toggle, and hoverable line highlights.',
      tokens: [
        T.bgTert('Code background', '--cb-bg'),
        T.bgSec('Header background', '--cb-header-bg'),
        T.text1('Code text', '--cb-text'),
        T.text3('Line numbers', '--cb-line-num'),
        T.border('Header border', '--cb-header-border'),
        T.accent('Copy button + wrap toggle active', '--cb-copy'),
        T.radiusLg('Block radius', '--cb-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <CodeBlock
            language="typescript"
            filename="utils.ts"
            code={`function debounce<T extends (...args: any[]) => void>(\n  fn: T,\n  delay: number\n): T {\n  let timer: ReturnType<typeof setTimeout>;\n  return ((...args: any[]) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  }) as T;\n}`}
          />
        </div>
      ),
    },
    {
      id: 'cb-diff',
      label: 'Diff View',
      description: 'Code block with diff highlights -- green gutter for added lines, red for removed, accent for modified. Apply/Reject action bar.',
      tokens: [
        T.bgTert('Code background', '--cb-bg'),
        T.success('Added line gutter + highlight', '--cb-added'),
        T.error('Removed line gutter + text + strikethrough', '--cb-removed'),
        T.accent('Modified line gutter', '--cb-modified'),
        T.bg('Action bar background', '--cb-action-bg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <CodeBlock
            language="python"
            filename="model.py"
            code={`class Model:\n    def __init__(self, dim):\n        self.dim = dim\n        self.linear = Linear(dim, dim)\n        self.dropout = Dropout(0.1)\n\n    def forward(self, x):\n        x = self.linear(x)\n        x = self.dropout(x)\n        return x`}
            lineHighlights={{ 4: 'modified', 5: 'added', 9: 'added' }}
            onApply={() => {}}
            onReject={() => {}}
          />
        </div>
      ),
    },
  ],

  'feedback-actions': [
    {
      id: 'fa-default',
      label: 'Default',
      description: 'Feedback actions with copy, thumbs up/down, regenerate (with dropdown arrow for options), and share. Thumbs-down opens qualitative feedback popover.',
      tokens: [
        T.text3('Icon default color', '--fa-icon'),
        T.bgHover('Button hover', '--fa-hover'),
        T.success('Thumbs-up active color', '--fa-like'),
        T.error('Thumbs-down active / feedback popover accent', '--fa-dislike'),
        T.bg('Feedback popover background', '--fa-popover-bg'),
        T.border('Feedback popover border', '--fa-popover-border'),
        T.shadowLg('Feedback popover shadow', '--fa-popover-shadow'),
        T.accentLt('Selected reason chip fill', '--fa-reason-bg'),
        T.accent('Selected reason chip border + text', '--fa-reason-accent'),
        T.radiusMd('Button radius', '--fa-radius'),
        T.radiusLg('Popover radius', '--fa-popover-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <FeedbackActions />
        </div>
      ),
    },
  ],

  'source-citation': [
    {
      id: 'sc-sources',
      label: 'Sources',
      description: 'Source citations with verification badges (verified/community/unverified), relevance % ranking, and expandable snippets.',
      tokens: [
        T.bg('Card background', '--sc-bg'),
        T.border('Card border', '--sc-border'),
        T.accent('Expanded card border + number badge', '--sc-link'),
        T.text1('Source title', '--sc-title'),
        T.text2('Snippet text', '--sc-snippet'),
        T.text3('Domain text', '--sc-domain'),
        T.success('Verified badge + high relevance %', '--sc-verified'),
        T.warning('Community badge + mid relevance %', '--sc-community'),
        T.textDis('Unverified badge + low relevance %', '--sc-unverified'),
        T.radiusMd('Card radius', '--sc-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <SourceCitation
            sources={[
              { title: 'Attention Is All You Need', url: '#', domain: 'arxiv.org', snippet: 'The dominant sequence transduction models...', relevance: 95, verification: 'verified' },
              { title: 'BERT: Pre-training of Deep Bidirectional Transformers', url: '#', domain: 'arxiv.org', snippet: 'We introduce a new language representation model...', relevance: 72, verification: 'community' },
              { title: 'LLM Training Tips', url: '#', domain: 'blog.example.com', snippet: 'Some useful tips for training...', relevance: 38, verification: 'unverified' },
            ]}
          />
        </div>
      ),
    },
  ],

  'file-attachment': [
    {
      id: 'fa-files',
      label: 'Attached',
      description: 'File attachments with type-colored icons, hover actions (preview/download/expand), AI summary expandable, upload progress bar, and page count for documents.',
      tokens: [
        T.bg('Card background', '--fatt-bg'),
        T.border('Card border + dividers', '--fatt-border'),
        T.accent('Document icon + preview border + AI sparkle', '--fatt-accent'),
        T.text1('Filename', '--fatt-name'),
        T.text3('File size + hover action icons', '--fatt-size'),
        T.textDis('Page count + upload meta', '--fatt-meta'),
        T.bgSec('AI summary background', '--fatt-summary-bg'),
        T.bgTert('Icon background + remove button + preview area', '--fatt-icon-bg'),
        T.success('Code file icon color', '--fatt-code'),
        T.radiusMd('Card radius', '--fatt-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <FileAttachment
            files={[
              { name: 'research-paper.pdf', size: '2.4 MB', type: 'document', pages: 12, aiSummary: 'A comprehensive study on transformer architectures and their applications in NLP.' },
              { name: 'screenshot.png', size: '840 KB', type: 'image' },
              { name: 'utils.ts', size: '12 KB', type: 'code', aiSummary: 'Utility functions for date formatting and API parsing.' },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'fa-uploading',
      label: 'Uploading',
      description: 'File attachment with upload progress bar — accent-colored fill animates as upload completes.',
      tokens: [
        T.bg('Card background', '--fatt-bg'),
        T.border('Card border', '--fatt-border'),
        T.accent('Progress bar fill', '--fatt-progress'),
        T.bgTert('Progress bar track', '--fatt-track'),
        T.text1('Filename', '--fatt-name'),
        T.textDis('File size', '--fatt-size'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <FileAttachment
            files={[
              { name: 'dataset.csv', size: '156 KB', type: 'other', uploadProgress: 65 },
              { name: 'model-weights.bin', size: '2.1 GB', type: 'other', uploadProgress: 23 },
            ]}
            removable={false}
          />
        </div>
      ),
    },
  ],

  'inline-actions': [
    {
      id: 'ia-blocks',
      label: 'Content Blocks',
      description: 'Inline actions with hover toolbar (copy/edit/regenerate + AI sparkle menu), AI actions dropdown (Simplify/Expand/Translate/Improve), undo for AI changes, custom action creator, and chain indicators on AI-processed blocks.',
      tokens: [
        T.bg('Block background', '--ia-bg'),
        T.bgHover('Hovered/processing block highlight', '--ia-hover'),
        T.border('Code block border + dropdown border', '--ia-border'),
        T.text1('Heading text', '--ia-heading'),
        T.text2('Paragraph text', '--ia-text'),
        T.text3('Toolbar icons default', '--ia-toolbar-icons'),
        T.accent('AI menu trigger + AI result badge + dropdown icon tint', '--ia-accent'),
        T.warning('Undo button color', '--ia-undo'),
        T.radiusMd('Toolbar + dropdown radius', '--ia-radius'),
        T.shadowLg('AI menu dropdown shadow', '--ia-menu-shadow'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <InlineActions />
        </div>
      ),
    },
  ],

  'artifact-viewer': [
    {
      id: 'av-code',
      label: 'Code Artifact',
      description: 'Artifact viewer with source/preview/diff tabs, inline editing mode (edit button → save/discard), version history slider, run button with output panel, and fullscreen toggle.',
      tokens: [
        T.bg('Viewer background + tab bar', '--av-bg'),
        T.bgSec('Header + history bar + output panel', '--av-header'),
        T.border('Viewer border + tab borders + version chips', '--av-border'),
        T.text1('Code text + title', '--av-text'),
        T.accent('Active tab + editing badge + version highlight + run spinner', '--av-accent'),
        T.text3('Inactive tab + action icons', '--av-tab-inactive'),
        T.success('Save button + diff additions + run output', '--av-save'),
        T.error('Discard button + diff deletions', '--av-discard'),
        T.textDis('Version timestamps + language label + diff markers', '--av-meta'),
        T.radiusLg('Viewer radius', '--av-radius'),
        T.shadowSm('Viewer shadow', '--av-shadow'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <ArtifactViewer
            title="Counter.tsx"
            type="code"
            language="typescript"
            content={`import { useState } from 'react';\n\nexport function Counter({ initial = 0 }: { initial?: number }) {\n  const [count, setCount] = useState(initial);\n  return (\n    <div className="flex items-center gap-4">\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n      <span>{count}</span>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n    </div>\n  );\n}`}
            versions={[
              { id: 2, content: 'import { useState, useCallback } from \'react\';\n\nexport function Counter({ initial = 0, step = 1 }) {\n  const [count, setCount] = useState(initial);\n  return <div>{count}</div>;\n}', timestamp: 'Just now', label: 'Added step' },
              { id: 1, content: 'import { useState } from \'react\';\n\nexport function Counter({ initial = 0 }) {\n  const [count, setCount] = useState(initial);\n  return <div>{count}</div>;\n}', timestamp: '5m ago', label: 'Initial' },
            ]}
          />
        </div>
      ),
    },
  ],

  'variations-picker': [
    {
      id: 'vp-selecting',
      label: 'Selecting',
      description: 'Variations picker grid with AI-recommended badge, quality scores, diff toggle, and expand-to-full view.',
      tokens: [
        T.bg('Grid background', '--vp-bg'),
        T.border('Card border', '--vp-card-border'),
        T.accent('Selected ring + diff toggle', '--vp-selected'),
        T.text1('Card label', '--vp-label'),
        T.bgHover('Card hover', '--vp-hover'),
        T.radiusMd('Card radius', '--vp-radius'),
        T.warning('Recommended badge + score star', '--vp-recommended'),
        T.success('Diff highlight (added words)', '--vp-diff-added'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <VariationsPicker />
        </div>
      ),
    },
  ],

  'comparison-view': [
    {
      id: 'cv-split',
      label: 'Split + Merge',
      description: 'Comparison view with split/unified/merge modes, change stats badges, semantic diff, and cherry-pick merge interaction.',
      tokens: [
        T.bg('Panel background', '--cv-bg'),
        T.border('Panel border', '--cv-border'),
        T.error('Removed text highlight + stats badge', '--cv-removed'),
        T.success('Added text highlight + stats badge', '--cv-added'),
        T.text1('Content text', '--cv-text'),
        T.bgSec('Header background', '--cv-header'),
        T.radiusLg('Panel radius', '--cv-radius'),
        T.accent('Merge mode highlight + active tab', '--cv-merge'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <ComparisonView title="Compare Changes" />
        </div>
      ),
    },
  ],

  'search-results': [
    {
      id: 'sr-results',
      label: 'Results',
      description: 'Search results with type filter tabs, AI summary card, query-term highlighting, relevance badges.',
      tokens: [
        T.bg('Card background', '--sr-bg'),
        T.border('Card + filter pill borders', '--sr-border'),
        T.borderStr('Card hover border', '--sr-border-hover'),
        T.bgHover('Card hover fill', '--sr-hover'),
        T.accent('Title link + AI summary + filter active + highlight', '--sr-link'),
        T.text2('Snippet text', '--sr-snippet'),
        T.textDis('Domain + date + meta', '--sr-domain'),
        T.bgTert('Domain icon bg', '--sr-icon-bg'),
        T.success('Relevance badge', '--sr-relevance'),
        T.radiusLg('Card radius', '--sr-radius'),
        T.radiusFull('Filter pill radius', '--sr-pill-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <SearchResults query="transformer architecture" />
        </div>
      ),
    },
  ],

  'file-tree': [
    {
      id: 'ft-expanded',
      label: 'Expanded',
      description: 'File tree with folders expanded showing file icons, modification indicators.',
      tokens: [
        T.bg('Tree background', '--ft-bg'),
        T.text1('File/folder names', '--ft-name'),
        T.accent('Selected item highlight', '--ft-selected'),
        T.success('Added indicator', '--ft-added'),
        T.warning('Modified indicator', '--ft-modified'),
        T.text3('Folder icon tint', '--ft-folder-icon'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <FileTree />
        </div>
      ),
    },
  ],

  'terminal-output': [
    {
      id: 'to-output',
      label: 'Output',
      description: 'Terminal output with traffic lights, status badge, search/filter bar, line selection, copy actions, line numbers, and auto-scroll indicator.',
      tokens: [
        T.bgTert('Terminal background', '--to-bg'),
        T.bgSec('Header bar + status bar', '--to-header'),
        T.text1('Command text', '--to-command'),
        T.success('Success output + cursor prompt', '--to-success'),
        T.error('Error output + error count', '--to-error'),
        T.accent('Info output + search highlight + accent cursor', '--to-info'),
        T.textDis('Line numbers + timestamp', '--to-line-num'),
        T.border('Container + header border', '--to-border'),
        T.warning('Search match highlight', '--to-search-hl'),
        T.radiusLg('Terminal radius', '--to-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <TerminalOutput status="complete" />
        </div>
      ),
    },
    {
      id: 'to-running',
      label: 'Running',
      description: 'Terminal output in running state -- active cursor with accent color, running status badge.',
      tokens: [
        T.accent('Active cursor + status badge', '--to-active'),
        T.bgTert('Terminal background', '--to-bg'),
        T.success('Prompt symbol', '--to-prompt'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <TerminalOutput
            lines={[
              { type: 'command', text: 'npx zeros-aiui add chat-input' },
              { type: 'info', text: 'Fetching component metadata...' },
              { type: 'output', text: 'Resolving 3 dependencies...' },
            ]}
            status="running"
          />
        </div>
      ),
    },
  ],

  'data-table': [
    {
      id: 'dt-table',
      label: 'Table View',
      description: 'Data table with sortable columns, formatted values, and export action.',
      tokens: [
        T.bg('Table background', '--dt-bg'),
        T.bgSec('Header row', '--dt-header'),
        T.border('Cell borders', '--dt-border'),
        T.text1('Cell text', '--dt-text'),
        T.text3('Header labels', '--dt-header-text'),
        T.accent('Sort indicator', '--dt-sort'),
        T.radiusLg('Table radius', '--dt-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <DataTable />
        </div>
      ),
    },
  ],


  /* ============================================================
     VOICE AI
     ============================================================ */

  'voice-waveform': [
    {
      id: 'vw-idle',
      label: 'Idle',
      description: 'Voice waveform idle — flat bars at 15% height, mic button ready.',
      tokens: [
        T.bg('Container background', '--vw-bg'),
        T.bgTert('Bar resting color (low opacity)', '--vw-bar-idle'),
        T.text3('Mic button', '--vw-mic'),
        T.border('Container border', '--vw-border'),
        T.radiusLg('Container radius', '--vw-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <VoiceWaveform state="idle" />
        </div>
      ),
    },
    {
      id: 'vw-recording',
      label: 'Recording',
      description: 'Voice waveform recording — animated bars, stop button, REC indicator.',
      tokens: [
        T.accent('Active bar color', '--vw-bar-active'),
        T.error('Stop button + REC label', '--vw-stop'),
        T.bg('Container background', '--vw-bg'),
        T.durationFast('Bar animation timing', '--vw-motion'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <VoiceWaveform state="recording" />
        </div>
      ),
    },
    {
      id: 'vw-playing-diarized',
      label: 'Playing (Diarized)',
      description: 'Voice waveform playing with speaker diarization — color-coded bars (user=accent, AI=chart-2), scrubbable timeline, timestamps.',
      tokens: [
        T.accent('User speaker color', '--vw-user-color'),
        T.bgTert('Inactive bar', '--vw-inactive'),
        T.text3('Time labels', '--vw-time'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <VoiceWaveform state="playing" progress={0.4} duration={124} showDiarization />
        </div>
      ),
    },
  ],

  'audio-player': [
    {
      id: 'aup-paused',
      label: 'Paused',
      description: 'Audio player paused — play button, progress at 35%, bookmark support, shift-drag clip hint.',
      tokens: [
        T.bg('Player background', '--aup-bg'),
        T.border('Player border', '--aup-border'),
        T.text1('Title text', '--aup-title'),
        T.text3('Time labels + subtitle', '--aup-time'),
        T.accent('Progress bar fill', '--aup-progress'),
        T.bgTert('Progress track', '--aup-track'),
        T.radiusLg('Player radius', '--aup-radius'),
        T.warning('Bookmark indicator', '--aup-bookmark'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer title="Generated Audio" subtitle="AI Voice Output" isPlaying={false} progress={35} />
        </div>
      ),
    },
    {
      id: 'aup-playing-transcript',
      label: 'Playing + Transcript',
      description: 'Audio player actively playing with synced transcript — word-by-word highlighting, mute toggle, speed control.',
      tokens: [
        T.accent('Active progress fill + active word bg', '--aup-progress-active'),
        T.text1('Active transcript word', '--aup-active-word'),
        T.textDis('Upcoming words', '--aup-upcoming'),
        T.bgSec('Transcript panel bg', '--aup-transcript-bg'),
        T.bg('Player background', '--aup-bg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer title="Generated Audio" subtitle="AI Voice Output" isPlaying={true} progress={62} currentTime="2:05" showTranscript />
        </div>
      ),
    },
  ],

  'voice-selector': [
    {
      id: 'vs-list',
      label: 'Voice List',
      description: 'Voice selector with search, favorite toggle, speaking style dropdown, preview waveform animation, and voice clone button.',
      tokens: [
        T.bg('List background', '--vs-bg'),
        T.border('Item border + style dropdown', '--vs-border'),
        T.text1('Voice name', '--vs-name'),
        T.text2('Voice description', '--vs-desc'),
        T.accent('Selected indicator + clone flow', '--vs-selected'),
        T.bgHover('Item hover', '--vs-hover'),
        T.warning('Favorite star', '--vs-favorite'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <VoiceSelector
            voices={[
              { id: 'nova', name: 'Nova', description: 'Warm and expressive', accent: 'American', color: 'var(--token-chart-1)', styles: ['conversational', 'excited', 'calm'], favorite: true },
              { id: 'echo', name: 'Echo', description: 'Deep and resonant', accent: 'British', color: 'var(--token-chart-2)', styles: ['conversational', 'newscaster'] },
              { id: 'fable', name: 'Fable', description: 'Narrative storytelling', accent: 'Irish', color: 'var(--token-chart-3)', styles: ['conversational', 'whisper'] },
            ]}
            selectedId="nova"
          />
        </div>
      ),
    },
  ],

  'speech-input': [
    {
      id: 'si-idle',
      label: 'Idle',
      description: 'Speech input idle -- mic button ready with accent-light background, instruction text visible.',
      tokens: [
        T.bg('Container background', '--si-bg'),
        T.border('Container border', '--si-border'),
        T.text1('Instruction text', '--si-text'),
        T.accent('Mic button icon', '--si-mic'),
        T.accentLt('Mic button background', '--si-mic-bg'),
        T.radiusLg('Container radius', '--si-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <SpeechInput state="idle" />
        </div>
      ),
    },
    {
      id: 'si-listening',
      label: 'Listening',
      description: 'Speech input listening -- waveform bars animate, timer counting, stop button visible in error color.',
      tokens: [
        T.accent('Waveform bars', '--si-wave'),
        T.error('Stop button', '--si-stop'),
        T.text1('Timer text', '--si-timer'),
        T.bg('Container background', '--si-bg'),
        T.durationFast('Wave animation', '--si-wave-motion'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <SpeechInput state="listening" transcript="" />
        </div>
      ),
    },
    {
      id: 'si-processing',
      label: 'Processing',
      description: 'Speech input processing -- spinner animates, "Processing your speech..." transcript shown.',
      tokens: [
        T.accent('Processing spinner', '--si-spinner'),
        T.text3('Processing label', '--si-processing-text'),
        T.bg('Container background', '--si-bg'),
        T.border('Container border', '--si-border'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <SpeechInput state="processing" transcript="Processing your speech..." />
        </div>
      ),
    },
  ],

  'orb-visualizer': [
    {
      id: 'ov-idle',
      label: 'Idle',
      description: 'Orb visualizer idle -- muted gradient, subtle ambient glow.',
      tokens: [
        T.text3('Idle gradient start', '--ov-idle-gradient'),
        T.textDis('Idle gradient end', '--ov-idle-end'),
        T.text3('State label', '--ov-label'),
        T.bg('Container background', '--ov-bg'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
          <OrbVisualizer state="idle" agentName="AI Assistant" />
        </div>
      ),
    },
    {
      id: 'ov-listening',
      label: 'Listening',
      description: 'Orb visualizer listening -- accent gradient, pulsing glow rings.',
      tokens: [
        T.accent('Listening gradient', '--ov-listen-gradient'),
        T.accentLt('Listening glow', '--ov-listen-glow'),
        T.text1('State label', '--ov-label'),
        T.durationFast('Pulse timing', '--ov-pulse'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
          <OrbVisualizer state="listening" agentName="AI Assistant" />
        </div>
      ),
    },
    {
      id: 'ov-thinking',
      label: 'Thinking',
      description: 'Orb visualizer thinking -- warning-colored rotating gradient.',
      tokens: [
        T.warning('Thinking gradient', '--ov-think-gradient'),
        tk('--token-warning-light', 'Thinking glow', 'surface', '#fdf6e3', '#1c1a10', '--ov-think-glow'),
        T.text1('State label', '--ov-label'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
          <OrbVisualizer state="thinking" agentName="AI Assistant" />
        </div>
      ),
    },
    {
      id: 'ov-speaking',
      label: 'Speaking',
      description: 'Orb visualizer speaking -- success-colored vibrant gradient, rhythmic pulsing.',
      tokens: [
        T.success('Speaking gradient', '--ov-speak-gradient'),
        tk('--token-success-light', 'Speaking glow', 'surface', '#e8f5e9', '#0d1f12', '--ov-speak-glow'),
        T.text1('State label', '--ov-label'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
          <OrbVisualizer state="speaking" agentName="AI Assistant" />
        </div>
      ),
    },
    {
      id: 'ov-error',
      label: 'Error',
      description: 'Orb visualizer error state -- red gradient, glitch vibration, warning icon overlay, retry button.',
      tokens: [
        T.error('Error gradient', '--ov-error-gradient'),
        T.text1('Agent name', '--ov-name'),
        T.textDis('Status text', '--ov-status'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
          <OrbVisualizer state="error" agentName="AI Assistant" statusText="Connection lost" onRetry={() => {}} />
        </div>
      ),
    },
  ],


  /* ============================================================
     RESEARCH & ANALYSIS
     ============================================================ */

  'research-card': [
    {
      id: 'rc-card',
      label: 'Research Card',
      description: 'Research card with title, summary, 3 key findings as bullet points, source count, confidence bar, and category badge.',
      tokens: [
        T.bg('Card background', '--rc-bg'),
        T.border('Card border', '--rc-border'),
        T.text1('Card title', '--rc-title'),
        T.text2('Summary text + findings', '--rc-summary'),
        T.accent('Category badge', '--rc-badge'),
        T.confHigh('High confidence bar'),
        T.radiusLg('Card radius', '--rc-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ResearchCard
            title="Transformer Architecture Efficiency"
            summary="Analysis of recent advances in reducing transformer computational costs while maintaining accuracy."
            findings={['Flash Attention reduces memory usage by 5-20x', 'Sparse attention maintains 97% accuracy', 'Quantization enables mobile deployment']}
            sourceCount={12}
            confidence={87}
            category="ML Research"
          />
        </div>
      ),
    },
  ],

  'insight-card': [
    {
      id: 'ic-up',
      label: 'Trending Up',
      description: 'Insight card with positive trend -- green trend indicator, upward metric, high confidence.',
      tokens: [
        T.bg('Card background', '--ic-bg'),
        T.border('Card border', '--ic-border'),
        T.text1('Headline text', '--ic-headline'),
        T.success('Trend indicator up', '--ic-trend-up'),
        T.text3('Category label', '--ic-category'),
        T.radiusLg('Card radius', '--ic-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <InsightCard category="Performance" headline="Response latency improved significantly" metric="142ms" metricLabel="avg latency" trend="up" trendValue="+23%" confidence={91} />
        </div>
      ),
    },
    {
      id: 'ic-down',
      label: 'Trending Down',
      description: 'Insight card with negative trend -- red trend indicator, downward metric.',
      tokens: [
        T.bg('Card background', '--ic-bg'),
        T.border('Card border', '--ic-border'),
        T.text1('Headline text', '--ic-headline'),
        T.error('Trend indicator down', '--ic-trend-down'),
        T.text3('Category label', '--ic-category'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <InsightCard category="Cost" headline="Token spend increased this billing period" metric="$284" metricLabel="monthly spend" trend="down" trendValue="-18%" confidence={76} />
        </div>
      ),
    },
  ],

  'confidence-score': [
    {
      id: 'cs-high',
      label: 'High',
      description: 'Confidence 92% -- green ring, "High" center label, trend up +5%, hover for sub-metric breakdown popup.',
      tokens: [ T.confHigh('High score ring'), T.text1('Score value', '--cs-value'), T.text3('Label', '--cs-label'), T.success('Trend up + delta', '--cs-trend-up'), T.bg('Background', '--cs-bg') ],
      render: () => (<div style={{ display: 'flex', justifyContent: 'center' }}><ConfidenceScore value={92} label="Accuracy" trend="up" trendDelta={5} subMetrics={[{ label: 'Semantic', value: 95 }, { label: 'Factual', value: 88 }, { label: 'Context', value: 91 }]} /></div>),
    },
    {
      id: 'cs-medium',
      label: 'Medium',
      description: 'Confidence 63% -- amber ring, "Medium" label, stable trend, threshold marker at 70.',
      tokens: [ T.confMed('Medium score ring'), T.text1('Score value', '--cs-value'), T.text3('Label', '--cs-label'), T.textDis('Stable trend', '--cs-trend-stable'), T.borderStr('Threshold marker', '--cs-threshold') ],
      render: () => (<div style={{ display: 'flex', justifyContent: 'center' }}><ConfidenceScore value={63} label="Relevance" trend="stable" trendDelta={0} threshold={70} /></div>),
    },
    {
      id: 'cs-low',
      label: 'Low',
      description: 'Confidence 28% -- red ring, "Low" label, trend down -12%.',
      tokens: [ T.confLow('Low score ring'), T.text1('Score value', '--cs-value'), T.text3('Label', '--cs-label'), T.error('Trend down + delta', '--cs-trend-down') ],
      render: () => (<div style={{ display: 'flex', justifyContent: 'center' }}><ConfidenceScore value={28} label="Coverage" trend="down" trendDelta={-12} /></div>),
    },
  ],

  'verification-badge': [
    {
      id: 'vb-verified',
      label: 'Verified',
      description: 'Verification badge -- green shield, 97% confidence pill, source summary counts, expandable claim + sources with reliability bars, re-verify action.',
      tokens: [
        T.success('Verified icon + confidence pill + supports dot', '--vb-verified'),
        tk('--token-success-light', 'Verified background', 'surface', '#e8f5e9', '#0d1f12', '--vb-verified-bg'),
        T.text1('Claim text', '--vb-text'),
        T.text2('Source names', '--vb-source'),
        T.textDis('Timestamp + reliability bar labels', '--vb-meta'),
        T.radiusLg('Badge radius', '--vb-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <VerificationBadge
            status="verified"
            claim="Transformers were introduced in the 2017 paper 'Attention Is All You Need'."
            confidence={97}
            lastChecked="2 min ago"
            sources={[
              { name: 'arxiv.org \u2014 Vaswani et al.', verdict: 'supports', url: '#', reliability: 98 },
              { name: 'Wikipedia \u2014 Transformer', verdict: 'supports', url: '#', reliability: 85 },
            ]}
            onReVerify={() => {}}
          />
        </div>
      ),
    },
    {
      id: 'vb-disputed',
      label: 'Disputed',
      description: 'Verification badge -- red shield, 8% confidence, contradicting source summary, expandable sources with low reliability scores.',
      tokens: [
        T.error('Disputed icon + contradicts dot', '--vb-disputed'),
        tk('--token-error-light', 'Disputed background', 'surface', '#fbe9e7', '#1f0d0d', '--vb-disputed-bg'),
        T.text1('Claim text', '--vb-text'),
        T.textDis('Source reliability labels', '--vb-meta'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <VerificationBadge
            status="disputed"
            claim="AI will replace all programming jobs by 2025."
            confidence={8}
            lastChecked="1 min ago"
            sources={[
              { name: 'MIT Tech Review', verdict: 'contradicts', url: '#', reliability: 95 },
              { name: 'Stack Overflow Survey', verdict: 'contradicts', url: '#', reliability: 88 },
            ]}
            onReVerify={() => {}}
          />
        </div>
      ),
    },
    {
      id: 'vb-unverified',
      label: 'Unverified',
      description: 'Verification badge -- neutral grey shield, no confidence score, expandable claim with no sources.',
      tokens: [
        T.text3('Unverified icon', '--vb-unverified'),
        T.bgTert('Unverified background', '--vb-unverified-bg'),
        T.text1('Claim text', '--vb-text'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <VerificationBadge
            status="unverified"
            claim="This model was trained on data up to April 2024."
            lastChecked="Not checked"
            onReVerify={() => {}}
          />
        </div>
      ),
    },
  ],

  'chart-result': [
    {
      id: 'cr-bar',
      label: 'Bar Chart',
      description: 'Chart result with bar chart visualization.',
      tokens: [
        T.bg('Chart background', '--cr-bg'),
        T.border('Chart border', '--cr-border'),
        T.text1('Chart title', '--cr-title'),
        T.text3('Axis labels', '--cr-axis'),
        tk('--token-chart-1', 'Bar color 1', 'surface', '#4f6d80', '#6b8598', '--cr-bar-1'),
        tk('--token-chart-2', 'Bar color 2', 'surface', '#7c6bc4', '#9b8ed6', '--cr-bar-2'),
        T.radiusLg('Chart radius', '--cr-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><ChartResult chartType="bar" /></div>),
    },
    {
      id: 'cr-line',
      label: 'Line Chart',
      description: 'Chart result with line chart, data points, area fill, and hover tooltip.',
      tokens: [
        T.bg('Chart background', '--cr-bg'),
        T.border('Chart border', '--cr-border'),
        T.text1('Chart title', '--cr-title'),
        tk('--token-chart-1', 'Line color', 'surface', '#957A7F', '#B3979C', '--cr-line'),
        T.radiusLg('Chart radius', '--cr-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><ChartResult chartType="line" /></div>),
    },
  ],


  /* ============================================================
     IMAGE AI
     ============================================================ */

  'style-presets': [
    {
      id: 'sp-grid',
      label: 'Preset Grid',
      description: 'Style presets grid with gradient previews and selection ring.',
      tokens: [
        T.bg('Grid background', '--sp-bg'), T.border('Card border', '--sp-border'),
        T.accent('Selected ring', '--sp-selected'), T.text1('Preset name', '--sp-name'),
        T.text3('Preset description', '--sp-desc'), T.radiusMd('Card radius', '--sp-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><StylePresets /></div>),
    },
  ],

  'image-gen-grid': [
    {
      id: 'igg-grid',
      label: 'Generation Grid',
      description: 'Image generation grid showing 4 gradient variations with selection state.',
      tokens: [
        T.bg('Grid background', '--igg-bg'), T.border('Image border', '--igg-border'),
        T.accent('Selected outline', '--igg-selected'), T.bgHover('Hover overlay', '--igg-hover'),
        T.radiusMd('Image radius', '--igg-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <ImageGenGrid
            images={[
              { id: '1', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Variation 1' },
              { id: '2', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Variation 2' },
              { id: '3', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Variation 3' },
              { id: '4', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Variation 4' },
            ]}
            selectedId="1"
          />
        </div>
      ),
    },
  ],

  'image-editor': [
    {
      id: 'ie-select',
      label: 'Select Tool',
      description: 'Image editor with select (cursor) tool active.',
      tokens: [
        T.bg('Editor background', '--ie-bg'), T.bgSec('Toolbar background', '--ie-toolbar'),
        T.border('Editor border', '--ie-border'), T.accent('Active tool highlight', '--ie-tool-active'),
        T.text3('Inactive tool icons', '--ie-tool-inactive'), T.radiusLg('Editor radius', '--ie-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 480 }}><ImageEditor activeTool="select" /></div>),
    },
    {
      id: 'ie-inpaint',
      label: 'Inpaint Tool',
      description: 'Image editor with inpaint brush tool active for AI-powered editing.',
      tokens: [
        T.accent('Active inpaint tool', '--ie-inpaint-active'),
        T.bg('Canvas background', '--ie-canvas'),
        T.text1('Brush size indicator', '--ie-brush-label'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 480 }}><ImageEditor activeTool="inpaint" brushSize={24} /></div>),
    },
    {
      id: 'ie-gen-fill',
      label: 'Gen Fill Tool',
      description: 'Image editor with generative fill tool -- AI prompt bar, sparkle icon, "Gen Fill Region" label in canvas.',
      tokens: [
        tk('--token-chart-6', 'Gen fill accent', 'surface', '#A8878F', '#C4A3AB', '--ie-gen-fill'),
        T.bg('Prompt input background', '--ie-prompt-bg'),
        T.accent('Fill button', '--ie-fill-btn'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 480 }}><ImageEditor activeTool="gen-fill" /></div>),
    },
  ],


  /* ============================================================
     AGENTIC
     ============================================================ */

  'agent-card': [
    {
      id: 'agc-online',
      label: 'Online',
      description: 'Agent card online -- green pulsing status dot, active capabilities badges, Brain icon avatar.',
      tokens: [
        T.bg('Card background', '--agc-bg'), T.border('Card border', '--agc-border'),
        T.text1('Agent name', '--agc-name'), T.text2('Agent role', '--agc-role'),
        T.success('Online dot', '--agc-online'), T.accent('Chat button', '--agc-action'),
        T.radiusLg('Card radius', '--agc-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <AgentCard name="Research Agent" role="Knowledge Discovery" description="Searches and synthesizes information from multiple sources." status="online" capabilities={['Web Search', 'PDF Analysis', 'Citation']} avatar={<Brain size={20} style={{ color: 'var(--token-accent)' }} />} />
        </div>
      ),
    },
    {
      id: 'agc-busy',
      label: 'Running',
      description: 'Agent card in running state -- streaming badge, progress bar, pause/resume button, and expandable live log.',
      tokens: [
        T.bg('Card background', '--agc-bg'), T.border('Card border', '--agc-border'),
        T.text1('Agent name', '--agc-name'), T.warning('Running dot + streaming badge', '--agc-busy'),
        T.accent('Progress bar fill', '--agc-progress'),
        T.bgSec('Log panel background', '--agc-log-bg'),
        T.textDis('Log entry text', '--agc-log-text'),
        T.success('[DONE] log color', '--agc-log-done'),
        T.error('[ERROR] log color', '--agc-log-error'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <AgentCard name="Code Agent" role="Software Engineering" description="Writes, reviews, and refactors code." status="busy" progress={62} capabilities={['Code Gen', 'Review', 'Refactor']} avatar={<Zap size={20} style={{ color: 'var(--token-warning)' }} />} logEntries={['[START] Analyzing codebase...', '[INFO] Found 12 files to review', '[INFO] Reviewing src/components...']} />
        </div>
      ),
    },
    {
      id: 'agc-paused',
      label: 'Paused',
      description: 'Agent card in paused state -- progress bar frozen, resume button visible, warning badge.',
      tokens: [
        T.bg('Card background', '--agc-bg'), T.border('Card border', '--agc-border'),
        T.text1('Agent name', '--agc-name'), T.text3('Paused dot + status', '--agc-paused'),
        T.warning('Paused badge', '--agc-pause-badge'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <AgentCard name="Code Agent" role="Software Engineering" description="Task paused by user." status="paused" progress={45} capabilities={['Code Gen', 'Review']} avatar={<Zap size={20} style={{ color: 'var(--token-text-tertiary)' }} />} />
        </div>
      ),
    },
    {
      id: 'agc-offline',
      label: 'Offline',
      description: 'Agent card offline -- grey status dot, muted state.',
      tokens: [
        T.bg('Card background', '--agc-bg'), T.border('Card border', '--agc-border'),
        T.text1('Agent name', '--agc-name'), T.textDis('Offline dot', '--agc-offline'),
        T.text3('Disabled state', '--agc-muted'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <AgentCard name="Design Agent" role="UI/UX Design" description="Generates and iterates on visual designs." status="offline" capabilities={['Layout', 'Color', 'Typography']} avatar={<Sparkles size={20} style={{ color: 'var(--token-text-disabled)' }} />} />
        </div>
      ),
    },
  ],

  'thread-manager': [
    {
      id: 'tm-list',
      label: 'Thread List',
      description: 'Thread manager showing pinned/recent sections, unread dots, search bar, and new thread button. Pinned threads appear in a separate section header.',
      tokens: [
        T.bg('Panel background', '--thread-bg'),
        T.border('Panel border + item dividers', '--thread-border'),
        T.text1('Thread title', '--thread-title'),
        T.text3('Preview text', '--thread-preview'),
        T.textDis('Section labels (PINNED/RECENT mono)', '--thread-section'),
        T.bgHover('Active thread highlight', '--thread-active'),
        T.accent('Unread dot', '--thread-dot'),
        T.radiusLg('Panel radius', '--thread-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 320 }}><ThreadManager /></div>),
    },
  ],

  'canvas-workspace': [
    {
      id: 'cw-workspace',
      label: 'Workspace',
      description: 'Canvas workspace with tools sidebar, content nodes, and zoom controls.',
      tokens: [
        T.bg('Canvas background', '--cw-bg'), T.bgSec('Toolbar background', '--cw-toolbar'),
        T.border('Node borders', '--cw-border'), T.accent('Selected tool', '--cw-tool-active'),
        T.text3('Inactive tools', '--cw-tool-inactive'), T.text1('Node text', '--cw-node-text'),
        T.radiusLg('Workspace radius', '--cw-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 520, height: 320 }}><CanvasWorkspace /></div>),
    },
  ],


  /* ============================================================
     DATA & SYSTEM
     ============================================================ */

  'model-selector': [
    {
      id: 'ms-closed',
      label: 'Closed',
      description: 'Model selector with cost tier, latency, capability pills, and context size in dropdown rows.',
      tokens: [
        T.bg('Selector background', '--ms-bg'),
        T.border('Selector border', '--ms-border'),
        T.borderStr('Selector border on hover', '--ms-border-hover'),
        T.text1('Model name', '--ms-name'),
        T.text3('Model icon + chevron', '--ms-chevron'),
        T.success('Low cost + fast latency', '--ms-cost-low'),
        T.warning('Medium cost/latency', '--ms-cost-med'),
        T.error('High cost tier', '--ms-cost-high'),
        T.textDis('Context size + capability pills', '--ms-specs'),
        T.bgTert('Capability pill background', '--ms-pill-bg'),
        T.radiusMd('Selector radius', '--ms-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <ModelSelector
            models={[
              { id: 'gpt4o', name: 'GPT-4o', description: 'Most capable multimodal', icon: <Sparkles size={14} />, context: 128, capabilities: ['Vision', 'Tools'], costTier: 'high', latency: 'medium' },
              { id: 'claude', name: 'Claude 3.5', description: 'Balanced quality', icon: <Brain size={14} />, context: 200, capabilities: ['Vision', 'Artifacts'], costTier: 'medium', latency: 'medium' },
              { id: 'mini', name: 'GPT-4o Mini', description: 'Fast & efficient', icon: <Zap size={14} />, context: 128, capabilities: ['Tools', 'JSON'], costTier: 'low', latency: 'fast' },
            ]}
            selectedId="gpt4o"
          />
        </div>
      ),
    },
  ],

  'token-usage': [
    {
      id: 'tu-normal',
      label: 'Normal Usage',
      description: 'Token usage at ~49% -- accent-colored bar fill, well within limit. Hover shows percentage tooltip.',
      tokens: [
        T.bg('Container', '--tu-bg'), T.border('Container border', '--tu-border'),
        T.accent('Usage bar fill', '--tu-bar'), T.bgTert('Bar track', '--tu-track'),
        T.text1('Token counts', '--tu-text'), T.text3('Labels + icon', '--tu-label'),
        T.radiusLg('Container radius', '--tu-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><TokenUsage inputTokens={1200} outputTokens={800} maxTokens={4096} model="GPT-4o" /></div>),
    },
    {
      id: 'tu-warning',
      label: 'High Usage',
      description: 'Token usage at ~80%+ -- warning-colored bar with threshold alert banner warning about approaching context limit.',
      tokens: [
        T.warning('Warning bar fill', '--tu-bar-warning'), T.text1('Token counts', '--tu-text'),
        T.bg('Container', '--tu-bg'), T.warning('Alert banner icon + text', '--tu-alert-warn'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><TokenUsage inputTokens={2800} outputTokens={1400} maxTokens={4096} model="GPT-4o" /></div>),
    },
    {
      id: 'tu-critical',
      label: 'Critical Usage',
      description: 'Token usage at 95%+ -- error-colored bar, red border, critical alert banner about context window being nearly full.',
      tokens: [
        T.error('Critical bar fill + border', '--tu-bar-critical'), T.text1('Token counts', '--tu-text'),
        T.bg('Container', '--tu-bg'), T.error('Alert banner icon + text', '--tu-alert-critical'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><TokenUsage inputTokens={3200} outputTokens={1800} maxTokens={4096} model="GPT-4o" /></div>),
    },
    {
      id: 'tu-breakdown',
      label: 'With Breakdown',
      description: 'Token usage with expandable category breakdown showing system prompt, history, attachments, and output with per-category mini bars.',
      tokens: [
        T.bg('Container', '--tu-bg'), T.accent('System prompt bar', '--tu-cat-system'),
        T.warning('History bar', '--tu-cat-history'), T.success('Attachments bar', '--tu-cat-attach'),
        T.text2('Category labels', '--tu-cat-label'), T.text3('Category values', '--tu-cat-value'),
        T.bgTert('Category track', '--tu-cat-track'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <TokenUsage
            inputTokens={2400}
            outputTokens={1200}
            maxTokens={8192}
            model="GPT-4o"
            showBreakdownDefault
            breakdown={[
              { label: 'System prompt', tokens: 720, color: 'var(--token-accent)' },
              { label: 'Conversation history', tokens: 1200, color: 'var(--token-warning)' },
              { label: 'Attachments', tokens: 480, color: 'var(--token-success)' },
              { label: 'Output', tokens: 1200, color: 'var(--token-chart-4, #36a3c2)' },
            ]}
          />
        </div>
      ),
    },
    {
      id: 'tu-cost',
      label: 'With Cost & Trend',
      description: 'Token usage with cost estimation column, trend indicator (up arrow + percentage), and streaming tokens/sec badge.',
      tokens: [
        T.bg('Container', '--tu-bg'), T.accent('Usage bar', '--tu-bar'),
        T.text1('Cost value', '--tu-cost'), T.warning('Trend indicator', '--tu-trend'),
        T.success('Tokens/sec badge', '--tu-tps'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <TokenUsage
            inputTokens={1800}
            outputTokens={2400}
            maxTokens={8192}
            model="Claude 3.5"
            costPerInputToken={0.000003}
            costPerOutputToken={0.000015}
            trend="up"
            trendLabel="+18%"
            tokensPerSecond={56}
          />
        </div>
      ),
    },
  ],

  'context-window': [
    {
      id: 'ctxw-overview',
      label: 'Overview',
      description: 'Context window with interactive segments, compress button, and clickable legend to inspect items per segment.',
      tokens: [
        T.bg('Container', '--ctxw-bg'), T.border('Container border', '--ctxw-border'),
        T.text1('Model name', '--ctxw-model'), T.text2('Segment labels', '--ctxw-segment'),
        T.text3('Token counts', '--ctxw-tokens'), T.radiusLg('Container radius', '--ctxw-radius'),
        T.warning('Near-full usage badge', '--ctxw-warn'),
        T.bgSec('Segment detail panel bg', '--ctxw-detail-bg'),
        T.error('Remove item icon hover', '--ctxw-remove'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ContextWindow
            segments={[
              { label: 'System', tokens: 2400, color: 'var(--token-chart-6)', items: ['System prompt (2.4k tokens)'] },
              { label: 'History', tokens: 18600, color: 'var(--token-chart-4)', items: ['Messages 1-5 (2.1k)', 'Messages 6-12 (8.4k)', 'Messages 13-18 (5.2k)'] },
              { label: 'User', tokens: 1200, color: 'var(--token-chart-2)', items: ['Current input (1.2k)'] },
            ]}
            maxTokens={128000}
            model="gpt-4o &middot; 128k"
          />
        </div>
      ),
    },
  ],

  'skeleton-loader': [
    {
      id: 'sk-loading',
      label: 'Loading',
      description: 'Skeleton loader with staggered shimmer animation -- MessageSkeleton + CodeSkeleton + CardSkeleton with progressive fade-in.',
      tokens: [
        T.bgTert('Shimmer base', '--sk-base'), T.bgHover('Shimmer highlight', '--sk-highlight'),
        T.bg('Container', '--sk-bg'), T.radiusMd('Element radius', '--sk-radius'),
        T.border('Card/code borders', '--sk-border'),
      ],
      render: () => (
        <div className="flex flex-col" style={{ gap: 'var(--token-space-5)', width: '100%', maxWidth: 400 }}>
          <MessageSkeleton staggerIndex={0} />
          <CodeSkeleton staggerIndex={2} />
          <CardSkeleton staggerIndex={4} />
        </div>
      ),
    },
    {
      id: 'sk-list',
      label: 'List',
      description: 'Skeleton list loader -- staggered items with avatar, text lines, and action placeholder.',
      tokens: [
        T.bgTert('Shimmer base', '--sk-base'), T.bgHover('Shimmer highlight', '--sk-highlight'),
        T.border('Item borders', '--sk-item-border'), T.radiusMd('Item radius', '--sk-item-radius'),
      ],
      render: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ListSkeleton count={3} />
        </div>
      ),
    },
  ],

  'ai-disclosure': [
    {
      id: 'aid-badge',
      label: 'Badge',
      description: 'AI disclosure badge -- compact inline pill indicator.',
      tokens: [ T.bgTert('Badge background', '--aid-badge-bg'), T.text3('Badge text', '--aid-badge-text'), T.accent('AI icon', '--aid-icon'), T.radiusFull('Badge radius') ],
      render: () => (<div style={{ width: '100%', maxWidth: 300 }}><AIDisclosure variant="badge" model="GPT-4o" /></div>),
    },
    {
      id: 'aid-banner',
      label: 'Banner',
      description: 'AI disclosure banner -- full-width notification strip.',
      tokens: [ T.accentLt('Banner background', '--aid-banner-bg'), T.accent('Banner icon', '--aid-banner-icon'), T.text1('Banner text', '--aid-banner-text'), T.radiusMd('Banner radius') ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><AIDisclosure variant="banner" model="Claude 3.5 Sonnet" /></div>),
    },
    {
      id: 'aid-inline',
      label: 'Inline',
      description: 'AI disclosure inline -- subtle text-level indicator.',
      tokens: [ T.text3('Inline text', '--aid-inline-text'), T.accent('Inline icon', '--aid-inline-icon') ],
      render: () => (<div style={{ width: '100%', maxWidth: 300 }}><AIDisclosure variant="inline" model="Gemini Pro" /></div>),
    },
  ],

  'memory-manager': [
    {
      id: 'mm-list',
      label: 'Memory List',
      description: 'Memory manager with stored facts, AI-suggested memories (accent left border + approve/reject), session-only toggle, edit/delete actions.',
      tokens: [
        T.bg('Panel background', '--mm-bg'),
        T.border('Panel border + item dividers', '--mm-border'),
        T.text1('Memory content text', '--mm-text'),
        T.textDis('Timestamp + source (mono)', '--mm-meta'),
        T.accent('Category badge + inferred highlight border + sparkle icon', '--mm-badge'),
        T.accentLt('Badge background + inferred row tint', '--mm-badge-bg'),
        T.text3('Edit/delete icon buttons', '--mm-actions'),
        T.warning('Session-only badge + temp toggle icon', '--mm-temp'),
        T.success('Approve (Remember) button', '--mm-approve'),
        T.bgSec('Search bar background', '--mm-search'),
        T.radiusLg('Panel radius', '--mm-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 360 }}><MemoryManager /></div>),
    },
    {
      id: 'mm-empty',
      label: 'Empty',
      description: 'Memory manager with no stored memories — empty state with "No memories stored" message and search bar still visible.',
      tokens: [
        T.bg('Panel background', '--mm-bg'), T.border('Panel border', '--mm-border'),
        T.textDis('Empty state text', '--mm-empty'), T.bgSec('Search bar', '--mm-search'),
        T.radiusLg('Panel radius', '--mm-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 360 }}><MemoryManager memories={[]} /></div>),
    },
  ],

  'mcp-connector': [
    {
      id: 'mcp-mixed',
      label: 'Mixed Status',
      description: 'MCP connector panel showing 6 tools: 3 connected (green dots, tool counts), 2 disconnected (grey dots), 1 error (red dot). Each row has toggle switch, icon in tertiary container, and description.',
      tokens: [
        T.bg('Panel background', '--mcp-bg'),
        T.bgSec('Header background', '--mcp-header'),
        T.border('Panel border + row dividers', '--mcp-border'),
        T.text1('Connector name (connected)', '--mcp-name'),
        T.text3('Connector name (disconnected) + description', '--mcp-desc'),
        T.textDis('Icon (disconnected) + tool count text', '--mcp-disabled'),
        T.text2('Icon (connected)', '--mcp-icon-active'),
        T.bgTert('Icon container background', '--mcp-icon-bg'),
        T.success('Connected dot + header count', '--mcp-connected'),
        T.error('Error dot', '--mcp-error'),
        T.textDis('Disconnected dot', '--mcp-disconnected'),
        T.accent('Toggle on track', '--mcp-toggle'),
        T.bgHover('Row hover fill', '--mcp-hover'),
        T.radiusLg('Panel radius', '--mcp-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><MCPConnector /></div>),
    },
  ],

  'cost-estimator': [
    {
      id: 'ce-estimate',
      label: 'Cost Estimate',
      description: 'Cost estimator showing token breakdown, estimated cost, and time.',
      tokens: [
        T.bg('Panel background', '--ce-bg'), T.border('Panel border', '--ce-border'),
        T.text1('Cost amount', '--ce-cost'), T.text2('Breakdown labels', '--ce-labels'),
        T.accent('Proceed button', '--ce-action'), T.warning('Cost warning', '--ce-warning'),
        T.radiusLg('Panel radius', '--ce-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><CostEstimator /></div>),
    },
  ],

  'consent-dialog': [
    {
      id: 'cd-dialog',
      label: 'Permission Dialog',
      description: 'Consent dialog with permission checkboxes, required/optional markers, accept/deny buttons.',
      tokens: [
        T.bg('Dialog background', '--cd-bg'), T.border('Dialog border', '--cd-border'),
        T.text1('Permission labels', '--cd-label'), T.text2('Permission descriptions', '--cd-desc'),
        T.accent('Accept button', '--cd-accept'), T.error('Deny button', '--cd-deny'),
        T.warning('Required badge', '--cd-required'), T.radiusLg('Dialog radius', '--cd-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><ConsentDialog /></div>),
    },
  ],

  'parameters-panel': [
    {
      id: 'pp-panel',
      label: 'Parameters',
      description: 'Parameters panel with sliders, toggles, and select controls for model configuration.',
      tokens: [
        T.bg('Panel background', '--pp-bg'), T.border('Panel border', '--pp-border'),
        T.text1('Parameter labels', '--pp-label'), T.text3('Parameter descriptions', '--pp-desc'),
        T.accent('Slider fill', '--pp-slider'), T.bgTert('Slider track', '--pp-track'),
        T.radiusLg('Panel radius', '--pp-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 360 }}><ParametersPanel /></div>),
    },
  ],

  'knowledge-base': [
    {
      id: 'kb-panel',
      label: 'Knowledge Base',
      description: 'Knowledge base panel showing 5 indexed sources with mixed statuses (indexed green, indexing amber, error red). Icon per type, "Add Source" button, footer with source/chunk counts.',
      tokens: [
        T.bg('Panel background', '--kb-bg'),
        T.border('Panel border + item dividers', '--kb-border'),
        T.text1('Source title', '--kb-title'),
        T.text3('Source meta (size + date)', '--kb-meta'),
        T.bgTert('Type icon container', '--kb-icon-bg'),
        T.text3('Type icon color', '--kb-icon'),
        T.success('Indexed badge', '--kb-indexed'),
        T.warning('Indexing badge', '--kb-indexing'),
        T.error('Error badge', '--kb-error'),
        T.accent('"Add Source" button', '--kb-add'),
        T.accentLt('"Add Source" button background', '--kb-add-bg'),
        T.textDis('Footer stats (mono)', '--kb-footer'),
        T.radiusLg('Panel radius', '--kb-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 320 }}><KnowledgeBase /></div>),
    },
    {
      id: 'kb-empty',
      label: 'Empty',
      description: 'Knowledge base with no sources — empty state showing "No sources found" message with "Add Source" button still visible.',
      tokens: [
        T.bg('Panel background', '--kb-bg'), T.border('Panel border', '--kb-border'),
        T.textDis('Empty state text', '--kb-empty'), T.accent('"Add Source" button', '--kb-add'),
        T.radiusLg('Panel radius', '--kb-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 320 }}><KnowledgeBase sources={[]} /></div>),
    },
  ],

  'notification-center': [
    {
      id: 'nc-notifications',
      label: 'Notifications',
      description: 'Notification center showing typed notifications with action buttons.',
      tokens: [
        T.bg('Panel background', '--nc-bg'), T.bgSec('Header background', '--nc-header'),
        T.border('Panel border', '--nc-border'), T.text1('Notification title', '--nc-title'),
        T.text2('Notification message', '--nc-message'),
        T.success('Success icon', '--nc-success'), T.error('Error icon', '--nc-error'),
        T.warning('Warning icon', '--nc-warning'), T.accent('AI icon', '--nc-ai'),
        T.radiusLg('Panel radius', '--nc-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><NotificationCenter /></div>),
    },
    {
      id: 'nc-empty',
      label: 'Empty',
      description: 'Notification center with zero notifications — empty state with bell icon and "All caught up" message.',
      tokens: [
        T.bg('Panel background', '--nc-bg'), T.bgSec('Header background', '--nc-header'),
        T.border('Panel border', '--nc-border'), T.textDis('Empty state icon + text', '--nc-empty'),
        T.radiusLg('Panel radius', '--nc-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><NotificationCenter notifications={[]} /></div>),
    },
  ],


  /* ============================================================
     MOBILE & MIXED
     ============================================================ */

  'mobile-ai-chat': [
    {
      id: 'mac-chat',
      label: 'Chat View',
      description: 'Mobile AI chat in active conversation with messages and input bar.',
      tokens: [
        T.bg('Chat background', '--mac-bg'), T.bgSec('Header bar', '--mac-header'),
        T.userBubble('User message bubble'), T.aiBubbleTxt('AI message text'),
        T.accent('AI avatar', '--mac-avatar'), T.border('Input border', '--mac-input-border'),
        T.radiusLg('Container radius', '--mac-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileAIChat /></div>),
    },
  ],

  'quick-actions-sheet': [
    {
      id: 'qas-sheet',
      label: 'Actions Sheet',
      description: 'Quick actions bottom sheet with categorized AI action items.',
      tokens: [
        T.bg('Sheet background', '--qas-bg'), T.border('Sheet border', '--qas-border'),
        T.text1('Action titles', '--qas-title'), T.text3('Action descriptions', '--qas-desc'),
        T.accent('Action icons', '--qas-icon'), T.bgHover('Action hover', '--qas-hover'),
        T.radiusLg('Sheet radius', '--qas-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><QuickActionsSheet /></div>),
    },
  ],

  'mobile-agent-tasks': [
    {
      id: 'mat-tasks',
      label: 'Tasks View',
      description: 'Mobile agent tasks with progress steps.',
      tokens: [
        T.bg('Tasks background', '--mat-bg'), T.bgSec('Header background', '--mat-header'),
        T.border('Task border', '--mat-border'), T.text1('Task title', '--mat-title'),
        T.success('Completed step', '--mat-done'), T.accent('Active step', '--mat-active'),
        T.text3('Pending step', '--mat-pending'), T.radiusLg('Container radius', '--mat-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileAgentTasks /></div>),
    },
  ],

  'mobile-smart-reply': [
    {
      id: 'msr-replies',
      label: 'Smart Replies',
      description: 'Mobile smart reply suggestion chips.',
      tokens: [
        T.bg('Container background', '--msr-bg'), T.border('Chip border', '--msr-border'),
        T.text1('Reply text', '--msr-text'), T.accent('AI sparkle icon', '--msr-icon'),
        T.bgHover('Chip hover', '--msr-hover'), T.radiusFull('Chip radius', '--msr-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileSmartReply /></div>),
    },
  ],

  'mobile-search-ai': [
    {
      id: 'msa-search',
      label: 'Search View',
      description: 'Mobile AI search with semantic results and AI overview.',
      tokens: [
        T.bg('Search background', '--msa-bg'), T.bgSec('Search bar background', '--msa-bar'),
        T.border('Result borders', '--msa-border'), T.text1('Result titles', '--msa-title'),
        T.text2('Result snippets', '--msa-snippet'), T.accent('AI badge', '--msa-ai'),
        T.radiusLg('Container radius', '--msa-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileSearchAI /></div>),
    },
  ],

  'mobile-notifications': [
    {
      id: 'mn-stack',
      label: 'Notification Stack',
      description: 'Mobile notification stack with AI alerts.',
      tokens: [
        T.bg('Stack background', '--mn-bg'), T.bgSec('Header background', '--mn-header'),
        T.border('Card borders', '--mn-border'), T.text1('Notification title', '--mn-title'),
        T.text2('Notification body', '--mn-body'), T.accent('AI icon', '--mn-ai'),
        T.radiusLg('Card radius', '--mn-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileNotifications /></div>),
    },
    {
      id: 'mn-empty',
      label: 'Empty',
      description: 'Mobile notifications with all items cleared — empty state showing bell icon and "All caught up!" message.',
      tokens: [
        T.bg('Stack background', '--mn-bg'), T.bgSec('Header background', '--mn-header'),
        T.border('Panel border', '--mn-border'), T.textDis('Empty state icon + text', '--mn-empty'),
        T.radiusLg('Card radius', '--mn-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 375 }}><MobileNotifications notifications={[]} /></div>),
    },
  ],

  'ai-usage-dashboard': [
    {
      id: 'aud-dashboard',
      label: 'Dashboard',
      description: 'AI usage dashboard with token consumption, costs, and model breakdown.',
      tokens: [
        T.bg('Dashboard background', '--aud-bg'), T.bgSec('Card backgrounds', '--aud-card'),
        T.border('Card borders', '--aud-border'), T.text1('Stat values', '--aud-value'),
        T.text3('Stat labels', '--aud-label'), T.accent('Primary chart color', '--aud-chart'),
        T.warning('Warning indicator', '--aud-warning'), T.radiusLg('Card radius', '--aud-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><AIUsageDashboard /></div>),
    },
  ],

  'ai-context-panel': [
    {
      id: 'acp-panel',
      label: 'Context Panel',
      description: 'AI context panel showing context sources, token allocation, and management.',
      tokens: [
        T.bg('Panel background', '--acp-bg'), T.bgSec('Header background', '--acp-header'),
        T.border('Panel border', '--acp-border'), T.text1('Source names', '--acp-name'),
        T.text3('Token counts', '--acp-tokens'), T.accent('Usage bar', '--acp-bar'),
        T.radiusLg('Panel radius', '--acp-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 380 }}><AIContextPanel /></div>),
    },
  ],

  'ai-onboarding': [
    {
      id: 'aob-onboarding',
      label: 'Onboarding Flow',
      description: 'AI onboarding wizard with step progress, feature cards, and configuration.',
      tokens: [
        T.bg('Wizard background', '--aob-bg'), T.border('Step borders', '--aob-border'),
        T.text1('Step titles', '--aob-title'), T.text2('Step descriptions', '--aob-desc'),
        T.accent('Progress indicator', '--aob-progress'), T.accentFg('Button text', '--aob-btn-text'),
        T.radiusLg('Wizard radius', '--aob-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><AIOnboarding /></div>),
    },
  ],


  /* ============================================================
     NEW REAL-WORLD AI
     ============================================================ */

  'voice-transcription': [
    {
      id: 'vt-active',
      label: 'Transcribing',
      description: 'Voice transcription panel actively capturing speech with live segment highlighting.',
      tokens: [
        T.bg('Panel background', '--vt-bg'), T.bgSec('Header background', '--vt-header'),
        T.border('Panel border', '--vt-border'), T.text1('Transcript text', '--vt-text'),
        T.accent('Live indicator', '--vt-live'), T.text3('Speaker label', '--vt-speaker'),
        T.success('High confidence', '--vt-conf-high'), T.radiusLg('Panel radius', '--vt-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><VoiceTranscriptionDemo /></div>),
    },
  ],

  'meeting-notes': [
    {
      id: 'mn-notes',
      label: 'Meeting Notes',
      description: 'AI-generated meeting notes with summary, action items, and participant list.',
      tokens: [
        T.bg('Notes background', '--mnotes-bg'), T.bgSec('Header background', '--mnotes-header'),
        T.border('Section borders', '--mnotes-border'), T.text1('Summary text', '--mnotes-text'),
        T.text3('Meta info', '--mnotes-meta'), T.accent('AI badge', '--mnotes-ai'),
        T.success('Done action item', '--mnotes-done'), T.radiusLg('Notes radius', '--mnotes-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 480 }}><MeetingNotesDemo /></div>),
    },
  ],

  'ai-command-palette': [
    {
      id: 'acp-palette',
      label: 'Command Palette',
      description: 'AI command palette showing slash commands with shortcuts and category grouping.',
      tokens: [
        T.bg('Palette background', '--aicmd-bg'), T.border('Palette border', '--aicmd-border'),
        T.text1('Command labels', '--aicmd-label'), T.text2('Command descriptions', '--aicmd-desc'),
        T.accent('AI category badge', '--aicmd-badge'), T.bgHover('Item hover', '--aicmd-hover'),
        T.bgTert('Shortcut key background', '--aicmd-kbd'), T.radiusLg('Palette radius', '--aicmd-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 480 }}><AICommandPaletteDemo /></div>),
    },
  ],

  'context-attachments': [
    {
      id: 'ca-chips',
      label: 'Attachment Chips',
      description: 'Context attachment chips showing files, URLs, and code with token counts.',
      tokens: [
        T.bg('Chip background', '--ca-bg'), T.border('Chip border', '--ca-border'),
        T.text1('Chip label', '--ca-label'), T.text3('Token count', '--ca-tokens'),
        T.accent('Add button', '--ca-add'), T.radiusFull('Chip radius', '--ca-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><ContextAttachmentsDemo /></div>),
    },
  ],

  'conversation-fork': [
    {
      id: 'cf-branches',
      label: 'Branch View',
      description: 'Conversation fork with compare mode, inline message preview, delete-with-confirm, star toggle.',
      tokens: [
        T.bg('Panel background', '--cf-bg'), T.bgSec('Header + footer + preview bg', '--cf-header'),
        T.border('Panel border + dividers', '--cf-border'), T.text1('Branch labels', '--cf-label'),
        T.text2('Last messages', '--cf-message'), T.accent('Active indicator + compare mode + eye icon', '--cf-active'),
        T.text3('Timestamps + msg count', '--cf-time'),
        T.error('Delete confirm text', '--cf-delete'),
        T.text3('Star fill', '--cf-star'),
        T.radiusLg('Panel radius', '--cf-radius'),
      ],
      render: () => (<div style={{ width: '100%', maxWidth: 420 }}><ConversationForkDemo /></div>),
    },
  ],

};
