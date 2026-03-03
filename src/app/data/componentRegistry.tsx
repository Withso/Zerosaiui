import type { ComponentType } from 'react';

// Chat & Conversation
import { WelcomeScreenDemo } from '../components/ai/WelcomeScreen';
import { ChatMessageDemo } from '../components/ai/ChatMessage';
import { MarkdownResponseDemo } from '../components/ai/MarkdownResponse';
import { ChatInputDemo } from '../components/ai/ChatInput';
import { MultiModalInputDemo } from '../components/ai/MultiModalInput';
import { PromptSuggestionsDemo } from '../components/ai/PromptSuggestions';
import { ChatHistoryDemo } from '../components/ai/ChatHistory';
import { AutocompleteDemo } from '../components/ai/Autocomplete';
import { SystemMessageDemo } from '../components/ai/SystemMessage';
import { PromptEnhancerDemo } from '../components/ai/PromptEnhancer';
import { PromptTemplatesDemo } from '../components/ai/PromptTemplates';
import { FollowUpBarDemo } from '../components/ai/FollowUpBar';
import { DynamicFormDemo } from '../components/ai/DynamicForm';

// AI Processing
import { ThinkingIndicatorDemo } from '../components/ai/ThinkingIndicator';
import { ReasoningTraceDemo } from '../components/ai/ReasoningTrace';
import { ToolCallDemo } from '../components/ai/ToolCall';
import { AnalysisProgressDemo } from '../components/ai/AnalysisProgress';
import { StreamingTextDemo } from '../components/ai/StreamingText';
import { ActionPlanDemo } from '../components/ai/ActionPlan';
import { ToolResultDemo } from '../components/ai/ToolResult';

// Response & Actions
import { CodeBlockDemo } from '../components/ai/CodeBlock';
import { FeedbackActionsDemo } from '../components/ai/FeedbackActions';
import { SourceCitationDemo } from '../components/ai/SourceCitation';
import { FileAttachmentDemo } from '../components/ai/FileAttachment';
import { InlineActionsDemo } from '../components/ai/InlineActions';
import { ArtifactViewerDemo } from '../components/ai/ArtifactViewer';
import { VariationsPickerDemo } from '../components/ai/VariationsPicker';
import { ComparisonViewDemo } from '../components/ai/ComparisonView';
import { SearchResultsDemo } from '../components/ai/SearchResults';
import { FileTreeDemo } from '../components/ai/FileTree';
import { TerminalOutputDemo } from '../components/ai/TerminalOutput';
import { DataTableDemo } from '../components/ai/DataTable';

// Voice AI
import { VoiceWaveformDemo } from '../components/ai/VoiceWaveform';
import { AudioPlayerDemo } from '../components/ai/AudioPlayer';
import { VoiceSelectorDemo } from '../components/ai/VoiceSelector';
import { SpeechInputDemo } from '../components/ai/SpeechInput';
import { OrbVisualizerDemo } from '../components/ai/OrbVisualizer';

// Research & Analysis
import { ResearchCardDemo } from '../components/ai/ResearchCard';
import { InsightCardDemo } from '../components/ai/InsightCard';
import { ConfidenceScoreDemo } from '../components/ai/ConfidenceScore';
import { VerificationBadgeDemo } from '../components/ai/VerificationBadge';
import { ChartResultDemo } from '../components/ai/ChartResult';

// Image AI
import { StylePresetsDemo } from '../components/ai/StylePresets';
import { ImageEditorDemo } from '../components/ai/ImageEditor';
import { ImageGenGridDemo } from '../components/ai/ImageGenGrid';

// Agentic
import { AgentCardDemo } from '../components/ai/AgentCard';
import { ThreadManagerDemo } from '../components/ai/ThreadManager';
import { CanvasWorkspaceDemo } from '../components/ai/CanvasWorkspace';

// Data & System
import { ModelSelectorDemo } from '../components/ai/ModelSelector';
import { TokenUsageDemo } from '../components/ai/TokenUsage';
import { ContextWindowDemo } from '../components/ai/ContextWindow';
import { SkeletonLoaderDemo } from '../components/ai/SkeletonLoader';
import { AIDisclosureDemo } from '../components/ai/AIDisclosure';
import { MemoryManagerDemo } from '../components/ai/MemoryManager';
import { MCPConnectorDemo } from '../components/ai/MCPConnector';
import { CostEstimatorDemo } from '../components/ai/CostEstimator';
import { ConsentDialogDemo } from '../components/ai/ConsentDialog';
import { ParametersPanelDemo } from '../components/ai/ParametersPanel';
import { KnowledgeBaseDemo } from '../components/ai/KnowledgeBase';
import { NotificationCenterDemo } from '../components/ai/NotificationCenter';

// Mobile & Mixed
import { MobileAIChatDemo } from '../components/ai/MobileAIChat';
import { QuickActionsSheetDemo } from '../components/ai/QuickActionsSheet';
import { AIUsageDashboardDemo } from '../components/ai/AIUsageDashboard';
import { MobileAgentTasksDemo } from '../components/ai/MobileAgentTasks';
import { AIContextPanelDemo } from '../components/ai/AIContextPanel';
import { MobileSmartReplyDemo } from '../components/ai/MobileSmartReply';
import { MobileSearchAIDemo } from '../components/ai/MobileSearchAI';
import { AIOnboardingDemo } from '../components/ai/AIOnboarding';
import { MobileNotificationsDemo } from '../components/ai/MobileNotifications';

// New real-world AI components
import { VoiceTranscriptionDemo } from '../components/ai/VoiceTranscription';
import { MeetingNotesDemo } from '../components/ai/MeetingNotes';
import { AICommandPaletteDemo } from '../components/ai/AICommandPalette';
import { ContextAttachmentsDemo } from '../components/ai/ContextAttachments';
import { ConversationForkDemo } from '../components/ai/ConversationFork';

export interface ComponentEntry {
  id: string;
  title: string;
  category: string;
  component: ComponentType;
}

export const componentRegistry: ComponentEntry[] = [
  // -------- Chat & Conversation --------
  { id: 'welcome-screen', title: 'Welcome Screen', category: 'Chat', component: WelcomeScreenDemo },
  { id: 'chat-message', title: 'Chat Message', category: 'Chat', component: ChatMessageDemo },
  { id: 'markdown-response', title: 'Markdown Response', category: 'Chat', component: MarkdownResponseDemo },
  { id: 'chat-input', title: 'Chat Input', category: 'Chat', component: ChatInputDemo },
  { id: 'multi-modal-input', title: 'Multi-Modal Input', category: 'Chat', component: MultiModalInputDemo },
  { id: 'prompt-suggestions', title: 'Prompt Suggestions', category: 'Chat', component: PromptSuggestionsDemo },
  { id: 'chat-history', title: 'Chat History', category: 'Chat', component: ChatHistoryDemo },
  { id: 'autocomplete', title: 'Autocomplete', category: 'Chat', component: AutocompleteDemo },
  { id: 'system-message', title: 'System Message', category: 'Chat', component: SystemMessageDemo },
  { id: 'prompt-enhancer', title: 'Prompt Enhancer', category: 'Chat', component: PromptEnhancerDemo },
  { id: 'prompt-templates', title: 'Prompt Templates', category: 'Chat', component: PromptTemplatesDemo },
  { id: 'follow-up-bar', title: 'Follow-Up Bar', category: 'Chat', component: FollowUpBarDemo },
  { id: 'dynamic-form', title: 'Dynamic Form', category: 'Chat', component: DynamicFormDemo },

  // -------- AI Processing --------
  { id: 'thinking-indicator', title: 'Thinking Indicator', category: 'Processing', component: ThinkingIndicatorDemo },
  { id: 'reasoning-trace', title: 'Reasoning Trace', category: 'Processing', component: ReasoningTraceDemo },
  { id: 'tool-call', title: 'Tool Call', category: 'Processing', component: ToolCallDemo },
  { id: 'analysis-progress', title: 'Analysis Progress', category: 'Processing', component: AnalysisProgressDemo },
  { id: 'streaming-text', title: 'Streaming Text', category: 'Processing', component: StreamingTextDemo },
  { id: 'action-plan', title: 'Action Plan', category: 'Processing', component: ActionPlanDemo },
  { id: 'tool-result', title: 'Tool Result', category: 'Processing', component: ToolResultDemo },

  // -------- Response & Actions --------
  { id: 'code-block', title: 'Code Block', category: 'Response', component: CodeBlockDemo },
  { id: 'feedback-actions', title: 'Feedback Actions', category: 'Response', component: FeedbackActionsDemo },
  { id: 'source-citation', title: 'Source Citation', category: 'Response', component: SourceCitationDemo },
  { id: 'file-attachment', title: 'File Attachment', category: 'Response', component: FileAttachmentDemo },
  { id: 'inline-actions', title: 'Inline Actions', category: 'Response', component: InlineActionsDemo },
  { id: 'artifact-viewer', title: 'Artifact Viewer', category: 'Response', component: ArtifactViewerDemo },
  { id: 'variations-picker', title: 'Variations Picker', category: 'Response', component: VariationsPickerDemo },
  { id: 'comparison-view', title: 'Comparison View', category: 'Response', component: ComparisonViewDemo },
  { id: 'search-results', title: 'Search Results', category: 'Response', component: SearchResultsDemo },
  { id: 'file-tree', title: 'File Tree', category: 'Response', component: FileTreeDemo },
  { id: 'terminal-output', title: 'Terminal Output', category: 'Response', component: TerminalOutputDemo },
  { id: 'data-table', title: 'Data Table', category: 'Response', component: DataTableDemo },

  // -------- Voice AI --------
  { id: 'voice-waveform', title: 'Voice Waveform', category: 'Voice', component: VoiceWaveformDemo },
  { id: 'audio-player', title: 'Audio Player', category: 'Voice', component: AudioPlayerDemo },
  { id: 'voice-selector', title: 'Voice Selector', category: 'Voice', component: VoiceSelectorDemo },
  { id: 'speech-input', title: 'Speech Input', category: 'Voice', component: SpeechInputDemo },
  { id: 'orb-visualizer', title: 'Orb Visualizer', category: 'Voice', component: OrbVisualizerDemo },

  // -------- Research & Analysis --------
  { id: 'research-card', title: 'Research Card', category: 'Research', component: ResearchCardDemo },
  { id: 'insight-card', title: 'Insight Card', category: 'Research', component: InsightCardDemo },
  { id: 'confidence-score', title: 'Confidence Score', category: 'Research', component: ConfidenceScoreDemo },
  { id: 'verification-badge', title: 'Verification Badge', category: 'Research', component: VerificationBadgeDemo },
  { id: 'chart-result', title: 'Chart Result', category: 'Research', component: ChartResultDemo },

  // -------- Image AI --------
  { id: 'style-presets', title: 'Style Presets', category: 'Image', component: StylePresetsDemo },
  { id: 'image-gen-grid', title: 'Image Gen Grid', category: 'Image', component: ImageGenGridDemo },
  { id: 'image-editor', title: 'Image Editor', category: 'Image', component: ImageEditorDemo },

  // -------- Agentic --------
  { id: 'agent-card', title: 'Agent Card', category: 'Agentic', component: AgentCardDemo },
  { id: 'thread-manager', title: 'Thread Manager', category: 'Agentic', component: ThreadManagerDemo },
  { id: 'canvas-workspace', title: 'Canvas Workspace', category: 'Agentic', component: CanvasWorkspaceDemo },

  // -------- Data & System --------
  { id: 'model-selector', title: 'Model Selector', category: 'System', component: ModelSelectorDemo },
  { id: 'token-usage', title: 'Token Usage', category: 'System', component: TokenUsageDemo },
  { id: 'context-window', title: 'Context Window', category: 'System', component: ContextWindowDemo },
  { id: 'skeleton-loader', title: 'Skeleton Loader', category: 'System', component: SkeletonLoaderDemo },
  { id: 'ai-disclosure', title: 'AI Disclosure', category: 'System', component: AIDisclosureDemo },
  { id: 'memory-manager', title: 'Memory Manager', category: 'System', component: MemoryManagerDemo },
  { id: 'mcp-connector', title: 'MCP Connector', category: 'System', component: MCPConnectorDemo },
  { id: 'cost-estimator', title: 'Cost Estimator', category: 'System', component: CostEstimatorDemo },
  { id: 'consent-dialog', title: 'Consent Dialog', category: 'System', component: ConsentDialogDemo },
  { id: 'parameters-panel', title: 'Parameters Panel', category: 'System', component: ParametersPanelDemo },
  { id: 'knowledge-base', title: 'Knowledge Base', category: 'System', component: KnowledgeBaseDemo },
  { id: 'notification-center', title: 'Notification Center', category: 'System', component: NotificationCenterDemo },

  // -------- Mobile & Mixed --------
  { id: 'mobile-ai-chat', title: 'Mobile AI Chat', category: 'Mobile', component: MobileAIChatDemo },
  { id: 'quick-actions-sheet', title: 'Quick Actions Sheet', category: 'Mobile', component: QuickActionsSheetDemo },
  { id: 'mobile-agent-tasks', title: 'Mobile Agent Tasks', category: 'Mobile', component: MobileAgentTasksDemo },
  { id: 'mobile-smart-reply', title: 'Mobile Smart Reply', category: 'Mobile', component: MobileSmartReplyDemo },
  { id: 'mobile-search-ai', title: 'Mobile Search AI', category: 'Mobile', component: MobileSearchAIDemo },
  { id: 'mobile-notifications', title: 'Mobile Notifications', category: 'Mobile', component: MobileNotificationsDemo },
  { id: 'ai-usage-dashboard', title: 'AI Usage Dashboard', category: 'Mixed', component: AIUsageDashboardDemo },
  { id: 'ai-context-panel', title: 'AI Context Panel', category: 'Mixed', component: AIContextPanelDemo },
  { id: 'ai-onboarding', title: 'AI Onboarding', category: 'Mixed', component: AIOnboardingDemo },

  // -------- New Real-World AI Components --------
  { id: 'voice-transcription', title: 'Voice Transcription', category: 'Real-World AI', component: VoiceTranscriptionDemo },
  { id: 'meeting-notes', title: 'Meeting Notes', category: 'Real-World AI', component: MeetingNotesDemo },
  { id: 'ai-command-palette', title: 'AI Command Palette', category: 'Real-World AI', component: AICommandPaletteDemo },
  { id: 'context-attachments', title: 'Context Attachments', category: 'Real-World AI', component: ContextAttachmentsDemo },
  { id: 'conversation-fork', title: 'Conversation Fork', category: 'Real-World AI', component: ConversationForkDemo },
];