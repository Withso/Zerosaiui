/* ================================================
   CLI Registry — Component Dependency Graph
   
   Powers `npx zeros-aiui add <component>`.
   Maps every component to its source file, dependency
   chain (atoms -> molecules -> AI components), token
   requirements, and peer dependencies.
   
   Structure:
   - id: kebab-case identifier (used in CLI)
   - name: PascalCase export name
   - type: 'atom' | 'molecule' | 'ai-component'
   - file: relative source path from package root
   - dependencies: array of other component ids required
   - tokens: array of CSS custom property names consumed
   - peerDependencies: external npm packages needed
   ================================================ */

export interface CLIComponentEntry {
  id: string;
  name: string;
  type: 'atom' | 'atom-extra' | 'molecule' | 'molecule-ai' | 'ai-component';
  file: string;
  description: string;
  dependencies: string[];
  tokens: string[];
  peerDependencies: string[];
  category: string;
}

/* ——————————————————————————————————————————
   Shared token sets used across many components
   —————————————————————————————————————————— */
const CORE_TOKENS = [
  '--token-bg', '--token-bg-hover', '--token-bg-tertiary',
  '--token-border', '--token-text-primary', '--token-text-secondary',
  '--token-text-tertiary', '--token-text-disabled',
  '--token-accent', '--token-accent-fg', '--token-accent-light', '--token-accent-muted',
  '--token-radius-sm', '--token-radius-md', '--token-radius-lg', '--token-radius-full',
  '--token-space-1', '--token-space-1-5', '--token-space-2', '--token-space-2-5',
  '--token-space-3', '--token-space-4', '--token-space-6',
  '--token-text-xs', '--token-text-sm', '--token-text-2xs',
  '--token-font-sans', '--token-font-mono',
  '--token-weight-regular', '--token-weight-medium', '--token-weight-semibold',
  '--token-duration-fast',
  '--token-shadow-sm', '--token-shadow-md', '--token-shadow-lg',
];

const BUTTON_TOKENS = [
  ...CORE_TOKENS,
  '--token-error', '--token-error-light',
];

const INPUT_TOKENS = [
  ...CORE_TOKENS,
  '--token-success', '--token-warning',
];

/* ——————————————————————————————————————————
   Atom definitions (32 atoms)
   —————————————————————————————————————————— */
const atoms: CLIComponentEntry[] = [
  { id: 'ds-button', name: 'DSButton', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Multi-variant button with icon support', dependencies: [], tokens: BUTTON_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-badge', name: 'DSBadge', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Status badge with semantic variants', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-avatar', name: 'DSAvatar', type: 'atom', file: 'components/ds/atoms.tsx', description: 'User/AI avatar with variant support', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-input', name: 'DSInput', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Text input with states and validation', dependencies: [], tokens: INPUT_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-toggle', name: 'DSToggle', type: 'atom', file: 'components/ds/atoms.tsx', description: 'On/off toggle switch', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-tag', name: 'DSTag', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Selectable filter tag/chip', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-progress', name: 'DSProgress', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Horizontal progress bar', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-skeleton', name: 'DSSkeleton', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Loading placeholder skeleton', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-divider', name: 'DSDivider', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Horizontal/vertical divider line', dependencies: [], tokens: ['--token-border'], peerDependencies: [], category: 'Atom' },
  { id: 'ds-kbd', name: 'DSKbd', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Keyboard shortcut indicator', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-code-inline', name: 'DSCodeInline', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Inline code snippet', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-spinner', name: 'DSSpinner', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Animated loading spinner', dependencies: [], tokens: ['--token-accent'], peerDependencies: [], category: 'Atom' },
  { id: 'ds-dot', name: 'DSDot', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Status indicator dot', dependencies: [], tokens: ['--token-success', '--token-warning', '--token-error', '--token-accent'], peerDependencies: [], category: 'Atom' },
  { id: 'ds-checkbox', name: 'DSCheckbox', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Checkbox with label support', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-slider', name: 'DSSlider', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Range slider with value display', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-select', name: 'DSSelect', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Dropdown select with keyboard navigation', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-rating', name: 'DSRating', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Star rating input', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-counter', name: 'DSCounter', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Increment/decrement counter', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-tooltip', name: 'DSTooltip', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Hover tooltip with configurable position', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-toast', name: 'DSToast', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Notification toast with variants', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-alert', name: 'DSAlert', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Inline alert banner', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-textarea', name: 'DSTextarea', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Multi-line text input', dependencies: [], tokens: INPUT_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-radio', name: 'DSRadio', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Radio button group', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-icon-button', name: 'DSIconButton', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Compact icon-only button', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-link', name: 'DSLink', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Styled anchor/link element', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-truncate', name: 'DSTruncate', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Text with ellipsis overflow', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-avatar-group', name: 'DSAvatarGroup', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Stacked avatar cluster', dependencies: ['ds-avatar'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  { id: 'ds-empty-dot', name: 'DSEmptyDot', type: 'atom', file: 'components/ds/atoms.tsx', description: 'Empty state dot placeholder', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
  /* Extra atoms */
  { id: 'ds-color-bar', name: 'DSColorBar', type: 'atom-extra', file: 'components/ds/atoms-extra.tsx', description: 'Multi-segment colored progress bar', dependencies: [], tokens: ['--token-bg-tertiary', '--token-radius-full'], peerDependencies: [], category: 'Atom' },
  { id: 'ds-collapsible', name: 'DSCollapsible', type: 'atom-extra', file: 'components/ds/atoms-extra.tsx', description: 'Expandable/collapsible section', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Atom' },
  { id: 'ds-legend-item', name: 'DSLegendItem', type: 'atom-extra', file: 'components/ds/atoms-extra.tsx', description: 'Color dot + label + value for legends', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Atom' },
];

/* ——————————————————————————————————————————
   Base molecule definitions (15 molecules)
   —————————————————————————————————————————— */
const moleculesBase: CLIComponentEntry[] = [
  { id: 'ds-search-bar', name: 'DSSearchBar', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Search input with keyboard shortcut badge', dependencies: ['ds-kbd'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-toolbar', name: 'DSToolbar', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Row of action buttons', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-form-field', name: 'DSFormField', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Labeled input with validation', dependencies: ['ds-input', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-tab-bar', name: 'DSTabBar', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Horizontal tab navigation', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-header-bar', name: 'DSHeaderBar', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Page/section header with avatar and actions', dependencies: ['ds-avatar', 'ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-step-indicator', name: 'DSStepIndicator', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Multi-step progress indicator', dependencies: ['ds-divider'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-chip-group', name: 'DSChipGroup', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Multi-select tag/chip group', dependencies: ['ds-tag'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-empty-state', name: 'DSEmptyState', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Empty content placeholder with icon and CTA', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-toggle-row', name: 'DSToggleRow', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Label + description + toggle switch row', dependencies: ['ds-toggle'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-breadcrumb', name: 'DSBreadcrumb', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Navigation breadcrumb trail', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-stat-display', name: 'DSStatDisplay', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Metric display with label and change indicator', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-list-item', name: 'DSListItem', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'List row with avatar, badge, and metadata', dependencies: ['ds-avatar', 'ds-badge', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-dropdown-menu', name: 'DSDropdownMenu', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Keyboard-navigable dropdown menu', dependencies: ['ds-divider'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-modal', name: 'DSModal', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Dialog modal with header and action bar', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-popover', name: 'DSPopover', type: 'molecule', file: 'components/ds/molecules-base.tsx', description: 'Floating information popover', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
];

/* ——————————————————————————————————————————
   AI/Mobile molecule definitions (15 molecules)
   —————————————————————————————————————————— */
const moleculesAI: CLIComponentEntry[] = [
  { id: 'ds-chat-input', name: 'DSChatInput', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'AI chat text input with send/attach actions', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-message-bubble', name: 'DSMessageBubble', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Chat message bubble (user/AI variants)', dependencies: ['ds-avatar'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-typing-indicator', name: 'DSTypingIndicator', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Animated typing dots indicator', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-token-counter', name: 'DSTokenCounter', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Token usage counter with progress', dependencies: ['ds-progress'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-model-selector', name: 'DSModelSelector', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'AI model picker dropdown', dependencies: ['ds-badge', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-prompt-card', name: 'DSPromptCard', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Prompt suggestion card', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-copy-block', name: 'DSCopyBlock', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Copyable text/code block', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-notification-banner', name: 'DSNotificationBanner', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Dismissible notification banner', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-filter-bar', name: 'DSFilterBar', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Horizontal filter chip bar', dependencies: ['ds-tag'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-slider-group', name: 'DSSliderGroup', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Labeled slider group for parameters', dependencies: ['ds-slider'], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-bottom-sheet', name: 'DSBottomSheet', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Mobile bottom sheet drawer', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-action-sheet', name: 'DSActionSheet', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'iOS-style action sheet', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-bottom-nav', name: 'DSBottomNav', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Mobile bottom navigation bar', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Molecule' },
  { id: 'ds-swipeable-row', name: 'DSSwipeableRow', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Swipeable list row with actions', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
  { id: 'ds-fab', name: 'DSFab', type: 'molecule-ai', file: 'components/ds/molecules-ai.tsx', description: 'Floating action button', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Molecule' },
];

/* ——————————————————————————————————————————
   AI Component definitions (74 components)
   —————————————————————————————————————————— */
const aiComponents: CLIComponentEntry[] = [
  /* Chat & Conversation */
  { id: 'welcome-screen', name: 'WelcomeScreen', type: 'ai-component', file: 'components/ai/WelcomeScreen.tsx', description: 'AI chat welcome/landing screen', dependencies: ['ds-button', 'ds-badge', 'ds-avatar'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'chat-message', name: 'ChatMessage', type: 'ai-component', file: 'components/ai/ChatMessage.tsx', description: 'Chat message with avatar and actions', dependencies: ['ds-avatar', 'ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'markdown-response', name: 'MarkdownResponse', type: 'ai-component', file: 'components/ai/MarkdownResponse.tsx', description: 'Rendered markdown AI response', dependencies: ['ds-button', 'ds-code-inline'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'chat-input', name: 'ChatInput', type: 'ai-component', file: 'components/ai/ChatInput.tsx', description: 'Full-featured AI chat input', dependencies: ['ds-button', 'ds-kbd'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'multi-modal-input', name: 'MultiModalInput', type: 'ai-component', file: 'components/ai/MultiModalInput.tsx', description: 'Multi-modal input with file/image support', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'prompt-suggestions', name: 'PromptSuggestions', type: 'ai-component', file: 'components/ai/PromptSuggestions.tsx', description: 'Suggested prompt cards grid', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'chat-history', name: 'ChatHistory', type: 'ai-component', file: 'components/ai/ChatHistory.tsx', description: 'Conversation history sidebar', dependencies: ['ds-button', 'ds-input'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'autocomplete', name: 'Autocomplete', type: 'ai-component', file: 'components/ai/Autocomplete.tsx', description: 'AI-powered autocomplete input', dependencies: ['ds-input', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'system-message', name: 'SystemMessage', type: 'ai-component', file: 'components/ai/SystemMessage.tsx', description: 'System/status message in chat', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'prompt-enhancer', name: 'PromptEnhancer', type: 'ai-component', file: 'components/ai/PromptEnhancer.tsx', description: 'AI prompt improvement interface', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'prompt-templates', name: 'PromptTemplates', type: 'ai-component', file: 'components/ai/PromptTemplates.tsx', description: 'Reusable prompt template library', dependencies: ['ds-button', 'ds-badge', 'ds-tag'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'follow-up-bar', name: 'FollowUpBar', type: 'ai-component', file: 'components/ai/FollowUpBar.tsx', description: 'Suggested follow-up actions bar', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },
  { id: 'dynamic-form', name: 'DynamicForm', type: 'ai-component', file: 'components/ai/DynamicForm.tsx', description: 'AI-generated dynamic form', dependencies: ['ds-input', 'ds-select', 'ds-toggle', 'ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Chat' },

  /* AI Processing */
  { id: 'thinking-indicator', name: 'ThinkingIndicator', type: 'ai-component', file: 'components/ai/ThinkingIndicator.tsx', description: 'AI thinking/processing animation', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },
  { id: 'reasoning-trace', name: 'ReasoningTrace', type: 'ai-component', file: 'components/ai/ReasoningTrace.tsx', description: 'Step-by-step reasoning display', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },
  { id: 'tool-call', name: 'ToolCall', type: 'ai-component', file: 'components/ai/ToolCall.tsx', description: 'Tool/function call visualization', dependencies: ['ds-badge', 'ds-spinner'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },
  { id: 'analysis-progress', name: 'AnalysisProgress', type: 'ai-component', file: 'components/ai/AnalysisProgress.tsx', description: 'Multi-step analysis progress tracker', dependencies: ['ds-progress', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },
  { id: 'streaming-text', name: 'StreamingText', type: 'ai-component', file: 'components/ai/StreamingText.tsx', description: 'Streaming text with cursor animation', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Processing' },
  { id: 'action-plan', name: 'ActionPlan', type: 'ai-component', file: 'components/ai/ActionPlan.tsx', description: 'AI-generated action plan with steps', dependencies: ['ds-badge', 'ds-button', 'ds-checkbox'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },
  { id: 'tool-result', name: 'ToolResult', type: 'ai-component', file: 'components/ai/ToolResult.tsx', description: 'Tool execution result display', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Processing' },

  /* Response & Actions */
  { id: 'code-block', name: 'CodeBlock', type: 'ai-component', file: 'components/ai/CodeBlock.tsx', description: 'Syntax-highlighted code block with copy', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'feedback-actions', name: 'FeedbackActions', type: 'ai-component', file: 'components/ai/FeedbackActions.tsx', description: 'Like/dislike/report feedback row', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'source-citation', name: 'SourceCitation', type: 'ai-component', file: 'components/ai/SourceCitation.tsx', description: 'Cited source reference card', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'file-attachment', name: 'FileAttachment', type: 'ai-component', file: 'components/ai/FileAttachment.tsx', description: 'File attachment preview card', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'inline-actions', name: 'InlineActions', type: 'ai-component', file: 'components/ai/InlineActions.tsx', description: 'Inline action buttons on text', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'artifact-viewer', name: 'ArtifactViewer', type: 'ai-component', file: 'components/ai/ArtifactViewer.tsx', description: 'Rich artifact preview panel', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'variations-picker', name: 'VariationsPicker', type: 'ai-component', file: 'components/ai/VariationsPicker.tsx', description: 'Response variation selector', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'comparison-view', name: 'ComparisonView', type: 'ai-component', file: 'components/ai/ComparisonView.tsx', description: 'Side-by-side comparison layout', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'search-results', name: 'SearchResults', type: 'ai-component', file: 'components/ai/SearchResults.tsx', description: 'AI-powered search results list', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'file-tree', name: 'FileTree', type: 'ai-component', file: 'components/ai/FileTree.tsx', description: 'Collapsible file/folder tree', dependencies: [], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'terminal-output', name: 'TerminalOutput', type: 'ai-component', file: 'components/ai/TerminalOutput.tsx', description: 'Terminal/console output display', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },
  { id: 'data-table', name: 'DataTable', type: 'ai-component', file: 'components/ai/DataTable.tsx', description: 'Sortable data table', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Response' },

  /* Voice AI */
  { id: 'voice-waveform', name: 'VoiceWaveform', type: 'ai-component', file: 'components/ai/VoiceWaveform.tsx', description: 'Audio waveform visualization', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Voice' },
  { id: 'audio-player', name: 'AudioPlayer', type: 'ai-component', file: 'components/ai/AudioPlayer.tsx', description: 'Audio playback controls', dependencies: ['ds-button', 'ds-slider'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Voice' },
  { id: 'voice-selector', name: 'VoiceSelector', type: 'ai-component', file: 'components/ai/VoiceSelector.tsx', description: 'Voice/persona selection grid', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Voice' },
  { id: 'speech-input', name: 'SpeechInput', type: 'ai-component', file: 'components/ai/SpeechInput.tsx', description: 'Voice input with waveform', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Voice' },
  { id: 'orb-visualizer', name: 'OrbVisualizer', type: 'ai-component', file: 'components/ai/OrbVisualizer.tsx', description: 'Animated AI orb visualization', dependencies: [], tokens: CORE_TOKENS, peerDependencies: [], category: 'Voice' },

  /* Research & Analysis */
  { id: 'research-card', name: 'ResearchCard', type: 'ai-component', file: 'components/ai/ResearchCard.tsx', description: 'Research finding card', dependencies: ['ds-badge', 'ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Research' },
  { id: 'insight-card', name: 'InsightCard', type: 'ai-component', file: 'components/ai/InsightCard.tsx', description: 'AI-generated insight display', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Research' },
  { id: 'confidence-score', name: 'ConfidenceScore', type: 'ai-component', file: 'components/ai/ConfidenceScore.tsx', description: 'AI confidence level indicator', dependencies: ['ds-progress', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Research' },
  { id: 'verification-badge', name: 'VerificationBadge', type: 'ai-component', file: 'components/ai/VerificationBadge.tsx', description: 'Fact verification status badge', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Research' },
  { id: 'chart-result', name: 'ChartResult', type: 'ai-component', file: 'components/ai/ChartResult.tsx', description: 'AI-generated chart/graph display', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Research' },

  /* Image AI */
  { id: 'style-presets', name: 'StylePresets', type: 'ai-component', file: 'components/ai/StylePresets.tsx', description: 'Image generation style selector', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Image' },
  { id: 'image-gen-grid', name: 'ImageGenGrid', type: 'ai-component', file: 'components/ai/ImageGenGrid.tsx', description: 'Generated images grid gallery', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Image' },
  { id: 'image-editor', name: 'ImageEditor', type: 'ai-component', file: 'components/ai/ImageEditor.tsx', description: 'AI image editing workspace', dependencies: ['ds-button', 'ds-slider'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Image' },

  /* Agentic */
  { id: 'agent-card', name: 'AgentCard', type: 'ai-component', file: 'components/ai/AgentCard.tsx', description: 'AI agent profile/status card', dependencies: ['ds-badge', 'ds-button', 'ds-avatar'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Agentic' },
  { id: 'thread-manager', name: 'ThreadManager', type: 'ai-component', file: 'components/ai/ThreadManager.tsx', description: 'Multi-thread conversation manager', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Agentic' },
  { id: 'canvas-workspace', name: 'CanvasWorkspace', type: 'ai-component', file: 'components/ai/CanvasWorkspace.tsx', description: 'Infinite canvas AI workspace', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Agentic' },

  /* Data & System */
  { id: 'model-selector', name: 'ModelSelector', type: 'ai-component', file: 'components/ai/ModelSelector.tsx', description: 'AI model comparison/selection panel', dependencies: ['ds-badge', 'ds-button', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'token-usage', name: 'TokenUsage', type: 'ai-component', file: 'components/ai/TokenUsage.tsx', description: 'Token usage breakdown display', dependencies: ['ds-progress', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'context-window', name: 'ContextWindow', type: 'ai-component', file: 'components/ai/ContextWindow.tsx', description: 'Context window usage visualizer', dependencies: ['ds-progress', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'skeleton-loader', name: 'SkeletonLoader', type: 'ai-component', file: 'components/ai/SkeletonLoader.tsx', description: 'Content skeleton loading states', dependencies: ['ds-skeleton'], tokens: CORE_TOKENS, peerDependencies: [], category: 'System' },
  { id: 'ai-disclosure', name: 'AIDisclosure', type: 'ai-component', file: 'components/ai/AIDisclosure.tsx', description: 'AI-generated content disclosure banner', dependencies: ['ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'memory-manager', name: 'MemoryManager', type: 'ai-component', file: 'components/ai/MemoryManager.tsx', description: 'AI memory/context management panel', dependencies: ['ds-button', 'ds-badge', 'ds-toggle'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'mcp-connector', name: 'MCPConnector', type: 'ai-component', file: 'components/ai/MCPConnector.tsx', description: 'MCP server connection interface', dependencies: ['ds-button', 'ds-badge', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'cost-estimator', name: 'CostEstimator', type: 'ai-component', file: 'components/ai/CostEstimator.tsx', description: 'API cost estimation calculator', dependencies: ['ds-badge', 'ds-slider'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'consent-dialog', name: 'ConsentDialog', type: 'ai-component', file: 'components/ai/ConsentDialog.tsx', description: 'AI data consent dialog', dependencies: ['ds-button', 'ds-checkbox'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'parameters-panel', name: 'ParametersPanel', type: 'ai-component', file: 'components/ai/ParametersPanel.tsx', description: 'Model parameter tuning panel', dependencies: ['ds-slider', 'ds-toggle', 'ds-select', 'ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'knowledge-base', name: 'KnowledgeBase', type: 'ai-component', file: 'components/ai/KnowledgeBase.tsx', description: 'Knowledge base file manager', dependencies: ['ds-button', 'ds-badge', 'ds-progress'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
  { id: 'notification-center', name: 'NotificationCenter', type: 'ai-component', file: 'components/ai/NotificationCenter.tsx', description: 'Notification feed panel', dependencies: ['ds-button', 'ds-badge', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },

  /* Mobile & Mixed */
  { id: 'mobile-ai-chat', name: 'MobileAIChat', type: 'ai-component', file: 'components/ai/MobileAIChat.tsx', description: 'Full mobile chat interface', dependencies: ['ds-avatar', 'ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'quick-actions-sheet', name: 'QuickActionsSheet', type: 'ai-component', file: 'components/ai/QuickActionsSheet.tsx', description: 'Mobile quick actions bottom sheet', dependencies: ['ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'mobile-agent-tasks', name: 'MobileAgentTasks', type: 'ai-component', file: 'components/ai/MobileAgentTasks.tsx', description: 'Mobile agent task list', dependencies: ['ds-badge', 'ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'mobile-smart-reply', name: 'MobileSmartReply', type: 'ai-component', file: 'components/ai/MobileSmartReply.tsx', description: 'AI smart reply suggestions', dependencies: ['ds-button', 'ds-avatar'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'mobile-search-ai', name: 'MobileSearchAI', type: 'ai-component', file: 'components/ai/MobileSearchAI.tsx', description: 'Mobile AI search interface', dependencies: ['ds-input', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'mobile-notifications', name: 'MobileNotifications', type: 'ai-component', file: 'components/ai/MobileNotifications.tsx', description: 'Mobile notification feed', dependencies: ['ds-badge', 'ds-dot'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mobile' },
  { id: 'ai-usage-dashboard', name: 'AIUsageDashboard', type: 'ai-component', file: 'components/ai/AIUsageDashboard.tsx', description: 'AI usage analytics dashboard', dependencies: ['ds-badge', 'ds-progress', 'ds-button'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mixed' },
  { id: 'ai-context-panel', name: 'AIContextPanel', type: 'ai-component', file: 'components/ai/AIContextPanel.tsx', description: 'Context management side panel', dependencies: ['ds-button', 'ds-badge', 'ds-select', 'ds-dot', 'ds-color-bar', 'ds-legend-item', 'ds-collapsible', 'ds-toggle-row', 'ds-header-bar', 'ds-stat-display'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mixed' },
  { id: 'ai-onboarding', name: 'AIOnboarding', type: 'ai-component', file: 'components/ai/AIOnboarding.tsx', description: 'AI onboarding flow wizard', dependencies: ['ds-button', 'ds-badge', 'ds-progress'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Mixed' },

  /* Real-World AI */
  { id: 'voice-transcription', name: 'VoiceTranscription', type: 'ai-component', file: 'components/ai/VoiceTranscription.tsx', description: 'Real-time voice transcription display', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Real-World AI' },
  { id: 'meeting-notes', name: 'MeetingNotes', type: 'ai-component', file: 'components/ai/MeetingNotes.tsx', description: 'AI-generated meeting notes', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Real-World AI' },
  { id: 'ai-command-palette', name: 'AICommandPalette', type: 'ai-component', file: 'components/ai/AICommandPalette.tsx', description: 'AI-powered command palette', dependencies: ['ds-input', 'ds-badge', 'ds-kbd'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Real-World AI' },
  { id: 'context-attachments', name: 'ContextAttachments', type: 'ai-component', file: 'components/ai/ContextAttachments.tsx', description: 'Attached context files/snippets panel', dependencies: ['ds-button', 'ds-badge'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Real-World AI' },
  { id: 'conversation-fork', name: 'ConversationFork', type: 'ai-component', file: 'components/ai/ConversationFork.tsx', description: 'Branching conversation interface', dependencies: ['ds-button', 'ds-badge', 'ds-avatar'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'Real-World AI' },

  /* List Panel (standalone composite) */
  { id: 'list-panel', name: 'ListPanel', type: 'ai-component', file: 'components/ai/ListPanel.tsx', description: 'Filterable list panel with search', dependencies: ['ds-button', 'ds-badge', 'ds-input'], tokens: CORE_TOKENS, peerDependencies: ['lucide-react'], category: 'System' },
];

/* ——————————————————————————————————————————
   Complete registry + utility functions
   —————————————————————————————————————————— */
export const cliRegistry: CLIComponentEntry[] = [
  ...atoms,
  ...moleculesBase,
  ...moleculesAI,
  ...aiComponents,
];

/** Resolve full dependency tree for a component (recursive) */
export function resolveDependencies(id: string, visited = new Set<string>()): CLIComponentEntry[] {
  if (visited.has(id)) return [];
  visited.add(id);

  const entry = cliRegistry.find(c => c.id === id);
  if (!entry) return [];

  const deps: CLIComponentEntry[] = [];
  for (const depId of entry.dependencies) {
    deps.push(...resolveDependencies(depId, visited));
  }
  deps.push(entry);
  return deps;
}

/** Get all unique files needed for a component (including deps) */
export function getRequiredFiles(id: string): string[] {
  const entries = resolveDependencies(id);
  return [...new Set(entries.map(e => e.file))];
}

/** Get all unique peer dependencies for a component */
export function getPeerDependencies(id: string): string[] {
  const entries = resolveDependencies(id);
  return [...new Set(entries.flatMap(e => e.peerDependencies))];
}

/** Get all unique tokens consumed by a component */
export function getRequiredTokens(id: string): string[] {
  const entries = resolveDependencies(id);
  return [...new Set(entries.flatMap(e => e.tokens))];
}

/** Search registry by name or id */
export function searchComponents(query: string): CLIComponentEntry[] {
  const q = query.toLowerCase();
  return cliRegistry.filter(c =>
    c.id.includes(q) || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
}

/** Group registry by type */
export function getRegistryByType(): Record<string, CLIComponentEntry[]> {
  return {
    atoms: cliRegistry.filter(c => c.type === 'atom' || c.type === 'atom-extra'),
    molecules: cliRegistry.filter(c => c.type === 'molecule' || c.type === 'molecule-ai'),
    'ai-components': cliRegistry.filter(c => c.type === 'ai-component'),
  };
}

/** Summary stats */
export const registryStats = {
  totalComponents: cliRegistry.length,
  atoms: atoms.length,
  molecules: moleculesBase.length + moleculesAI.length,
  aiComponents: aiComponents.length,
  categories: [...new Set(cliRegistry.map(c => c.category))],
};
