/* ================================================
   Components — Gallery grid of individual components
   Each card = 1 component with live preview + detail link
   Responsive grid: 1 col mobile, 2 cols tablet/desktop
   ================================================ */
import { useMemo, useState, useEffect } from 'react';
import {
  MessageSquare, Sparkles, Send, FileText, Brain, Code2, BarChart3,
  Mic, Image, Play, Settings, Search, Layers,
  Smartphone, LayoutDashboard,
} from 'lucide-react';
import { componentRegistry } from '../../data/componentRegistry';
import { ComponentPreviewCard } from './ComponentPreviewCard';

/* —— Individual component metadata —— */
export interface FullComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  atomsUsed: string[];
  moleculesUsed: string[];
}

/* —— Category icon helper —— */
const catIcons: Record<string, React.ReactNode> = {
  Chat: <MessageSquare size={16} />,
  Processing: <Brain size={16} />,
  Response: <Code2 size={16} />,
  Voice: <Mic size={16} />,
  Research: <BarChart3 size={16} />,
  'Image': <Image size={16} />,
  Agentic: <Sparkles size={16} />,
  System: <Settings size={16} />,
  Mobile: <Smartphone size={16} />,
  Mixed: <LayoutDashboard size={16} />,
  Composer: <Send size={16} />,
  Suggestion: <Layers size={16} />,
  Form: <FileText size={16} />,
  Action: <Play size={16} />,
  Search: <Search size={16} />,
  'Real-World AI': <Sparkles size={16} />,
};

/* —— All 74 individual components —— */
export const fullComponents: FullComponent[] = [
  /* ——————————————— Chat & Conversation ——————————————— */
  { id: 'chat-history', name: 'Chat History', category: 'Chat', description: 'Browse past conversations with timestamps and previews', icon: catIcons.Chat, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar', 'Empty State'] },
  { id: 'knowledge-base', name: 'Knowledge Base', category: 'Chat', description: 'Browse and search uploaded documents and data sources', icon: catIcons.Chat, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar', 'Empty State'] },
  { id: 'prompt-templates', name: 'Prompt Templates', category: 'Chat', description: 'Pick from pre-built prompt patterns by category', icon: catIcons.Chat, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar', 'Breadcrumb'] },
  { id: 'memory-manager', name: 'Memory Manager', category: 'Chat', description: 'View and manage persisted context memories', icon: catIcons.Chat, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar', 'Empty State'] },
  { id: 'chat-message', name: 'Chat Message', category: 'Chat', description: 'User and AI message bubbles with role indicators', icon: catIcons.Chat, atomsUsed: ['Avatar', 'Badge', 'Code Inline', 'Divider'], moleculesUsed: ['Message Bubble', 'Toolbar'] },
  { id: 'markdown-response', name: 'Markdown Response', category: 'Chat', description: 'Rich-text AI response with headings, lists, and code', icon: catIcons.Chat, atomsUsed: ['Avatar', 'Badge', 'Code Inline', 'Divider'], moleculesUsed: ['Message Bubble', 'Toolbar'] },
  { id: 'system-message', name: 'System Message', category: 'Chat', description: 'System-level instructions and configuration messages', icon: catIcons.Chat, atomsUsed: ['Avatar', 'Badge', 'Code Inline', 'Divider'], moleculesUsed: ['Message Bubble', 'Notification Banner'] },
  { id: 'ai-disclosure', name: 'AI Disclosure', category: 'Chat', description: 'Transparency notice that content is AI-generated', icon: catIcons.Chat, atomsUsed: ['Badge', 'Button'], moleculesUsed: [] },

  /* ——————————————— Composer ——————————————— */
  { id: 'chat-input', name: 'Chat Input', category: 'Composer', description: 'Primary text input with send button and shortcuts', icon: catIcons.Composer, atomsUsed: ['Input', 'Button', 'Kbd', 'Toggle'], moleculesUsed: ['Form Field', 'Chip Group', 'Toolbar'] },
  { id: 'multi-modal-input', name: 'Multi-Modal Input', category: 'Composer', description: 'Text + file/image/voice attachment input', icon: catIcons.Composer, atomsUsed: ['Input', 'Button', 'Icon', 'Kbd'], moleculesUsed: ['Form Field', 'Chip Group', 'Toolbar'] },
  { id: 'follow-up-bar', name: 'Follow-Up Bar', category: 'Composer', description: 'Contextual follow-up input anchored to response', icon: catIcons.Composer, atomsUsed: ['Input', 'Button', 'Tag'], moleculesUsed: ['Chip Group'] },
  { id: 'prompt-enhancer', name: 'Prompt Enhancer', category: 'Composer', description: 'Input with AI-powered prompt improvement suggestions', icon: catIcons.Composer, atomsUsed: ['Input', 'Button', 'Badge', 'Tag'], moleculesUsed: ['Form Field', 'Chip Group'] },

  /* ——————————————— Suggestions ——————————————— */
  { id: 'welcome-screen', name: 'Welcome Screen', category: 'Suggestion', description: 'Greeting with suggested starter prompts', icon: catIcons.Suggestion, atomsUsed: ['Button', 'Tag', 'Badge'], moleculesUsed: ['Chip Group', 'Prompt Card'] },
  { id: 'prompt-suggestions', name: 'Prompt Suggestions', category: 'Suggestion', description: 'Contextual follow-up prompt chips', icon: catIcons.Suggestion, atomsUsed: ['Button', 'Tag'], moleculesUsed: ['Chip Group', 'Prompt Card'] },
  { id: 'autocomplete', name: 'Autocomplete', category: 'Suggestion', description: 'Real-time suggestions while typing', icon: catIcons.Suggestion, atomsUsed: ['Input', 'Kbd', 'Badge'], moleculesUsed: ['Search Bar'] },
  { id: 'style-presets', name: 'Style Presets', category: 'Suggestion', description: 'Visual style options for image generation', icon: catIcons.Suggestion, atomsUsed: ['Button', 'Badge', 'Tag'], moleculesUsed: ['Chip Group'] },

  /* ——————————————— Form ——————————————— */
  { id: 'dynamic-form', name: 'Dynamic Form', category: 'Form', description: 'AI-generated form with mixed field types and validation', icon: catIcons.Form, atomsUsed: ['Input', 'Toggle', 'Button', 'Badge', 'Select', 'Checkbox', 'Slider'], moleculesUsed: ['Form Field', 'Toggle Row', 'Header Bar'] },

  /* ——————————————— Processing ——————————————— */
  { id: 'thinking-indicator', name: 'Thinking Indicator', category: 'Processing', description: 'Animated dots showing AI is processing', icon: catIcons.Processing, atomsUsed: ['Spinner', 'Streaming Dots', 'Badge'], moleculesUsed: [] },
  { id: 'streaming-text', name: 'Streaming Text', category: 'Processing', description: 'Token-by-token text appearing with cursor', icon: catIcons.Processing, atomsUsed: ['Skeleton', 'Dot'], moleculesUsed: [] },
  { id: 'analysis-progress', name: 'Analysis Progress', category: 'Processing', description: 'Multi-step progress bar with phase labels', icon: catIcons.Processing, atomsUsed: ['Progress', 'Badge', 'Dot'], moleculesUsed: ['Step Indicator'] },
  { id: 'skeleton-loader', name: 'Skeleton Loader', category: 'Processing', description: 'Shimmer placeholders for content loading', icon: catIcons.Processing, atomsUsed: ['Skeleton'], moleculesUsed: [] },

  /* ——————————————— Process Trackers ——————————————— */
  { id: 'reasoning-trace', name: 'Reasoning Trace', category: 'Processing', description: 'Expandable chain-of-thought reasoning steps', icon: catIcons.Processing, atomsUsed: ['Badge', 'Dot', 'Spinner', 'Code Inline'], moleculesUsed: ['Step Indicator', 'List Item', 'Header Bar'] },
  { id: 'action-plan', name: 'Action Plan', category: 'Processing', description: 'Ordered task plan with progress checkmarks', icon: catIcons.Processing, atomsUsed: ['Badge', 'Dot', 'Checkbox'], moleculesUsed: ['Step Indicator'] },
  { id: 'tool-call', name: 'Tool Call', category: 'Processing', description: 'Tool invocation with parameters and execution status', icon: catIcons.Processing, atomsUsed: ['Badge', 'Code Inline', 'Spinner'], moleculesUsed: ['Header Bar'] },
  { id: 'tool-result', name: 'Tool Result', category: 'Processing', description: 'Rich formatted output cards from tool executions', icon: catIcons.Processing, atomsUsed: ['Badge', 'Code Inline', 'Button'], moleculesUsed: ['Header Bar'] },

  /* ——————————————— Code & Response ——————————————— */
  { id: 'code-block', name: 'Code Block', category: 'Response', description: 'Syntax-highlighted code with copy and language label', icon: catIcons.Response, atomsUsed: ['Button', 'Badge', 'Code Inline', 'Kbd'], moleculesUsed: ['Header Bar', 'Toolbar'] },
  { id: 'terminal-output', name: 'Terminal Output', category: 'Response', description: 'CLI output with colored lines and cursor', icon: catIcons.Response, atomsUsed: ['Badge', 'Code Inline'], moleculesUsed: ['Header Bar'] },
  { id: 'artifact-viewer', name: 'Artifact Viewer', category: 'Response', description: 'Multi-tab viewer for generated code artifacts', icon: catIcons.Response, atomsUsed: ['Button', 'Badge', 'Code Inline'], moleculesUsed: ['Header Bar', 'Tab Bar', 'Toolbar'] },

  /* ——————————————— Content Cards ——————————————— */
  { id: 'agent-card', name: 'Agent Card', category: 'Agentic', description: 'AI agent identity with capabilities and status', icon: catIcons.Agentic, atomsUsed: ['Avatar', 'Badge', 'Dot', 'Progress', 'Tag'], moleculesUsed: ['Stat Display', 'Header Bar'] },
  { id: 'research-card', name: 'Research Card', category: 'Research', description: 'Research findings with sources and confidence', icon: catIcons.Research, atomsUsed: ['Badge', 'Dot', 'Tag'], moleculesUsed: ['Stat Display', 'Header Bar'] },
  { id: 'insight-card', name: 'Insight Card', category: 'Research', description: 'Data-driven insight with key metrics', icon: catIcons.Research, atomsUsed: ['Badge', 'Dot'], moleculesUsed: ['Stat Display'] },
  { id: 'model-selector', name: 'Model Selector', category: 'System', description: 'Model picker with specs and pricing', icon: catIcons.System, atomsUsed: ['Badge', 'Button', 'Select'], moleculesUsed: ['Header Bar', 'List Item'] },
  { id: 'cost-estimator', name: 'Cost Estimator', category: 'System', description: 'Token/cost breakdown calculator', icon: catIcons.System, atomsUsed: ['Badge', 'Progress', 'Button'], moleculesUsed: ['Stat Display'] },
  { id: 'confidence-score', name: 'Confidence Score', category: 'Research', description: 'Visual confidence gauge with explanation', icon: catIcons.Research, atomsUsed: ['Badge', 'Progress', 'Dot'], moleculesUsed: ['Stat Display'] },
  { id: 'verification-badge', name: 'Verification Badge', category: 'Research', description: 'Source verification status indicator', icon: catIcons.Research, atomsUsed: ['Badge', 'Dot'], moleculesUsed: [] },

  /* ——————————————— Data Views ——————————————— */
  { id: 'data-table', name: 'Data Table', category: 'Response', description: 'Sortable tabular data with formatting', icon: catIcons.Response, atomsUsed: ['Badge', 'Progress', 'Dot', 'Divider'], moleculesUsed: ['Header Bar'] },
  { id: 'chart-result', name: 'Chart Result', category: 'Research', description: 'Bar/horizontal chart visualization', icon: catIcons.Research, atomsUsed: ['Badge', 'Dot'], moleculesUsed: ['Stat Display', 'Header Bar'] },
  { id: 'token-usage', name: 'Token Usage', category: 'System', description: 'Token consumption gauge with limits', icon: catIcons.System, atomsUsed: ['Badge', 'Progress', 'Dot'], moleculesUsed: ['Stat Display', 'Header Bar'] },
  { id: 'context-window', name: 'Context Window', category: 'System', description: 'Context size visualization and management', icon: catIcons.System, atomsUsed: ['Badge', 'Dot', 'Button'], moleculesUsed: ['Stat Display', 'Header Bar'] },
  { id: 'parameters-panel', name: 'Parameters Panel', category: 'System', description: 'Model parameter sliders and toggles', icon: catIcons.System, atomsUsed: ['Slider', 'Toggle', 'Select', 'Button', 'Badge'], moleculesUsed: ['Toggle Row', 'Header Bar'] },

  /* ——————————————— Media & Canvas ——————————————— */
  { id: 'image-gen-grid', name: 'Image Gen Grid', category: 'Image', description: 'Generated image results in a selectable grid', icon: catIcons.Image, atomsUsed: ['Button', 'Badge', 'Skeleton'], moleculesUsed: ['Toolbar', 'Header Bar'] },
  { id: 'image-editor', name: 'Image Editor', category: 'Image', description: 'In/outpainting editor with brush controls', icon: catIcons.Image, atomsUsed: ['Button', 'Badge', 'Slider'], moleculesUsed: ['Toolbar', 'Header Bar'] },
  { id: 'variations-picker', name: 'Variations Picker', category: 'Image', description: 'Multiple AI-generated variations for comparison', icon: catIcons.Image, atomsUsed: ['Button', 'Badge'], moleculesUsed: ['Toolbar'] },
  { id: 'comparison-view', name: 'Comparison View', category: 'Image', description: 'Side-by-side model output comparison', icon: catIcons.Image, atomsUsed: ['Button', 'Badge', 'Tag'], moleculesUsed: ['Header Bar', 'Tab Bar'] },
  { id: 'canvas-workspace', name: 'Canvas Workspace', category: 'Agentic', description: 'Freeform AI workspace with nodes and connections', icon: catIcons.Agentic, atomsUsed: ['Button', 'Badge'], moleculesUsed: ['Toolbar', 'Header Bar'] },

  /* ——————————————— Voice AI ——————————————— */
  { id: 'voice-waveform', name: 'Voice Waveform', category: 'Voice', description: 'Real-time voice input waveform visualization', icon: catIcons.Voice, atomsUsed: ['Button', 'Progress', 'Avatar'], moleculesUsed: ['Header Bar'] },
  { id: 'audio-player', name: 'Audio Player', category: 'Voice', description: 'TTS playback with progress and speed controls', icon: catIcons.Voice, atomsUsed: ['Button', 'Progress', 'Avatar'], moleculesUsed: ['Header Bar', 'Toolbar'] },
  { id: 'voice-selector', name: 'Voice Selector', category: 'Voice', description: 'Voice identity selection with preview samples', icon: catIcons.Voice, atomsUsed: ['Button', 'Avatar', 'Badge'], moleculesUsed: ['List Item'] },
  { id: 'speech-input', name: 'Speech Input', category: 'Voice', description: 'Voice recording input with transcription preview', icon: catIcons.Voice, atomsUsed: ['Button', 'Progress', 'Avatar'], moleculesUsed: ['Toolbar'] },
  { id: 'orb-visualizer', name: 'Orb Visualizer', category: 'Voice', description: 'Ambient orb animation responding to audio', icon: catIcons.Voice, atomsUsed: ['Button'], moleculesUsed: [] },

  /* ——————————————— Actions ——————————————— */
  { id: 'feedback-actions', name: 'Feedback Actions', category: 'Action', description: 'Thumbs up/down with copy and retry actions', icon: catIcons.Action, atomsUsed: ['Button', 'Badge', 'Tag'], moleculesUsed: ['Toolbar'] },
  { id: 'inline-actions', name: 'Inline Actions', category: 'Action', description: 'Contextual actions overlaid on content', icon: catIcons.Action, atomsUsed: ['Button', 'Badge'], moleculesUsed: ['Toolbar'] },
  { id: 'source-citation', name: 'Source Citation', category: 'Action', description: 'Inline reference links with numbered badges', icon: catIcons.Action, atomsUsed: ['Badge', 'Button'], moleculesUsed: [] },
  { id: 'file-attachment', name: 'File Attachment', category: 'Action', description: 'Attached file cards with type and size info', icon: catIcons.Action, atomsUsed: ['Badge', 'Button', 'Tag'], moleculesUsed: [] },

  /* ——————————————— System & Dialogs ——————————————— */
  { id: 'consent-dialog', name: 'Consent Dialog', category: 'System', description: 'Permission request with accept/deny actions', icon: catIcons.System, atomsUsed: ['Button', 'Badge', 'Checkbox', 'Divider'], moleculesUsed: ['Header Bar', 'Toggle Row'] },
  { id: 'mcp-connector', name: 'MCP Connector', category: 'System', description: 'Protocol server connection management panel', icon: catIcons.System, atomsUsed: ['Button', 'Badge', 'Input', 'Toggle', 'Divider'], moleculesUsed: ['Header Bar', 'Form Field', 'Toggle Row'] },
  { id: 'notification-center', name: 'Notification Center', category: 'System', description: 'Status notifications with type icons and actions', icon: catIcons.System, atomsUsed: ['Button', 'Badge', 'Dot'], moleculesUsed: ['Header Bar', 'Notification Banner'] },

  /* ——————————————— Search & Browse ——————————————— */
  { id: 'search-results', name: 'Search Results', category: 'Search', description: 'Web search result cards with snippets and relevance', icon: catIcons.Search, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar'] },
  { id: 'file-tree', name: 'File Tree', category: 'Search', description: 'Recursive file/folder browser with type icons', icon: catIcons.Search, atomsUsed: ['Badge', 'Dot', 'Divider'], moleculesUsed: ['Breadcrumb', 'Header Bar'] },

  /* ——————————————— Agentic ——————————————— */
  { id: 'thread-manager', name: 'Thread Manager', category: 'Agentic', description: 'Manage parallel conversation threads with pin/delete', icon: catIcons.Agentic, atomsUsed: ['Input', 'Badge', 'Dot', 'Divider'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar'] },

  /* ——————————————— Mobile AI ——————————————— */
  { id: 'mobile-ai-chat', name: 'Mobile AI Chat', category: 'Mobile', description: 'Full mobile chat screen with bottom nav, message bubbles, and typing indicator', icon: catIcons.Mobile, atomsUsed: ['Avatar', 'Badge', 'Dot', 'Button', 'Streaming Dots'], moleculesUsed: ['Bottom Nav', 'Chat Input', 'Message Bubble', 'Typing Indicator', 'Header Bar', 'FAB'] },
  { id: 'quick-actions-sheet', name: 'Quick Actions Sheet', category: 'Mobile', description: 'Bottom sheet with AI quick action cards and search', icon: catIcons.Mobile, atomsUsed: ['Button', 'Badge', 'Segmented Control', 'Bottom Sheet Handle'], moleculesUsed: ['Bottom Sheet', 'Prompt Card', 'Search Bar'] },
  { id: 'mobile-agent-tasks', name: 'Mobile Agent Tasks', category: 'Mobile', description: 'Mobile agent task monitoring with collapsible steps and progress', icon: catIcons.Mobile, atomsUsed: ['Badge', 'Progress', 'Dot', 'Checkbox', 'Button'], moleculesUsed: ['Collapsible', 'Step Indicator', 'Header Bar', 'Notification Banner'] },
  { id: 'mobile-smart-reply', name: 'Mobile Smart Reply', category: 'Mobile', description: 'AI-powered smart reply suggestions with tone selection', icon: catIcons.Mobile, atomsUsed: ['Button', 'Badge', 'Streaming Dots'], moleculesUsed: ['Chip Group', 'Bottom Sheet'] },
  { id: 'mobile-search-ai', name: 'Mobile Search AI', category: 'Mobile', description: 'Semantic AI search with AI overview and source confidence', icon: catIcons.Mobile, atomsUsed: ['Badge', 'Tag', 'Avatar', 'Dot', 'Rating', 'Button'], moleculesUsed: ['Search Bar', 'Filter Bar', 'List Item', 'Empty State', 'Chip Group', 'Bottom Nav'] },
  { id: 'mobile-notifications', name: 'Mobile Notifications', category: 'Mobile', description: 'Swipeable AI notification stack with read/unread states', icon: catIcons.Mobile, atomsUsed: ['Badge', 'Button', 'Dot', 'Swipe Action', 'Pull Indicator', 'Segmented Control'], moleculesUsed: ['Header Bar', 'Empty State', 'Bottom Nav'] },

  /* ——————————————— Mixed (Web + Mobile) ——————————————— */
  { id: 'ai-usage-dashboard', name: 'AI Usage Dashboard', category: 'Mixed', description: 'Token and cost monitoring with multi-model breakdown and budget tracking', icon: catIcons.Mixed, atomsUsed: ['Badge', 'Dot', 'Button', 'Progress'], moleculesUsed: ['Stat Display', 'Tab Bar', 'Header Bar', 'Toggle Row'] },
  { id: 'ai-context-panel', name: 'AI Context Panel', category: 'Mixed', description: 'Context window management with source toggles and token visualization', icon: catIcons.Mixed, atomsUsed: ['Button', 'Badge', 'Select', 'Dot'], moleculesUsed: ['Toggle Row', 'Header Bar', 'Stat Display'] },
  { id: 'ai-onboarding', name: 'AI Onboarding', category: 'Mixed', description: 'Multi-step AI setup wizard with interest selection and privacy consent', icon: catIcons.Mixed, atomsUsed: ['Button', 'Badge', 'Progress', 'Checkbox', 'Counter', 'Segmented Control'], moleculesUsed: ['Step Indicator', 'Prompt Card', 'Toggle Row', 'Chip Group'] },

  /* ——————————————— Real-World AI (Wispr, Granola, Cursor, etc.) ——————————————— */
  { id: 'voice-transcription', name: 'Voice Transcription', category: 'Real-World AI', description: 'Real-time voice-to-text panel with speaker diarization and confidence scoring (Wispr Flow, Otter.ai)', icon: catIcons['Real-World AI'], atomsUsed: ['Button', 'Badge', 'Dot', 'Progress', 'Avatar'], moleculesUsed: ['Header Bar', 'Toolbar', 'List Item'] },
  { id: 'meeting-notes', name: 'Meeting Notes', category: 'Real-World AI', description: 'AI-generated meeting summary with action items, key topics, and participant tracking (Granola, Fireflies)', icon: catIcons['Real-World AI'], atomsUsed: ['Button', 'Badge', 'Avatar', 'Dot', 'Divider', 'Checkbox', 'Tag'], moleculesUsed: ['Header Bar', 'List Item', 'Chip Group', 'Stat Display'] },
  { id: 'ai-command-palette', name: 'AI Command Palette', category: 'Real-World AI', description: 'Slash command and keyboard-driven AI action launcher (Raycast AI, Cursor, Linear)', icon: catIcons['Real-World AI'], atomsUsed: ['Input', 'Badge', 'Kbd', 'Divider', 'Button'], moleculesUsed: ['Search Bar', 'List Item', 'Header Bar'] },
  { id: 'context-attachments', name: 'Context Attachments', category: 'Real-World AI', description: 'File and context chips bar with token budget visualization (Claude, Cursor, Copilot)', icon: catIcons['Real-World AI'], atomsUsed: ['Button', 'Badge', 'Tag', 'Divider', 'Input'], moleculesUsed: ['Chip Group', 'Header Bar', 'Search Bar'] },
  { id: 'conversation-fork', name: 'Conversation Fork', category: 'Real-World AI', description: 'Branch and explore alternative conversation paths (Claude Projects, ChatGPT branches)', icon: catIcons['Real-World AI'], atomsUsed: ['Button', 'Badge', 'Avatar', 'Dot', 'Divider'], moleculesUsed: ['Header Bar', 'List Item'] },
];

/* ——— Build lookup from component id -> live preview component ——— */
function useVariantComponentMap() {
  return useMemo(() => {
    const map = new Map<string, React.ComponentType>();
    for (const entry of componentRegistry) {
      map.set(entry.id, entry.component);
    }
    return map;
  }, []);
}

/* ——— Live component preview in gallery ——— */
/* Components section: always 2 cols on tablet/desktop, 1 col on mobile */
export function ComponentsSection() {
  const variantMap = useVariantComponentMap();
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth < 768 ? 1 : 2);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const fillerCount = fullComponents.length % columns === 0 ? 0 : (columns - (fullComponents.length % columns));

  return (
    <div
      className="grid"
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        background: 'var(--token-border)', 
        gap: 1,
        width: '100%',
        minWidth: 0,
      }}
    >
      {fullComponents.map((comp) => {
        const LiveComp = variantMap.get(comp.id);
        
        const cardContent = LiveComp ? (
          <ComponentPreviewCard
            component={LiveComp}
            name={comp.name}
            category={comp.category}
            detailPath={`/design-system/component/${comp.id}`}
          />
        ) : (
          <ComponentPreviewCard
            component={() => (
              <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-disabled)' }}>
                Preview unavailable
              </span>
            )}
            name={comp.name}
            category={comp.category}
            detailPath={`/design-system/component/${comp.id}`}
          />
        );

        return (
          <div 
            key={comp.id} 
            style={{ 
              background: 'var(--token-bg)',
              minWidth: 0,
            }}
          >
            {cardContent}
          </div>
        );
      })}
      {fillerCount > 0 && Array.from({ length: fillerCount }).map((_, i) => (
        <div key={`filler-${i}`} style={{ background: 'var(--token-bg)', minWidth: 0 }} />
      ))}
    </div>
  );
}
