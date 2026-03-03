/* ================================================
   Zeros AIUI — Component Documentation Registry
   
   Technical documentation for every atom, molecule,
   and AI component. Rendered on DSDetailPage below
   the viewport section.
   ================================================ */

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  description: string;
  category: 'atom' | 'molecule' | 'component';
  importPath: string;
  props: PropDoc[];
  usage: string;
  accessibility: string;
  tokens: string[];
  dependencies: string[];
  usedBy?: string[];
  notes?: string;
}

/* ——————————————————————————————————————————————————
   ATOM DOCUMENTATION
   —————————————————————————————————————————————————— */

const atomDocs: ComponentDoc[] = [
  {
    id: 'button',
    name: 'DSButton',
    description: 'Primary interactive element for triggering actions. Supports 6 visual variants, loading states, and icon slots. Uses data-ds-interactive for focus ring styling.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'icon'", default: "'primary'", description: 'Visual variant controlling background, text color, and shadow.' },
      { name: 'children', type: 'React.ReactNode', description: 'Button label content.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Optional leading icon element. Replaced by spinner during loading.' },
      { name: 'state', type: 'string', description: "Forced visual state: 'hover', 'focus', 'active', 'disabled', 'loading'. Default/undefined enables live interaction." },
      { name: 'onClick', type: '(e: React.MouseEvent) => void', description: 'Click handler.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction. Applies 0.5 opacity and not-allowed cursor.' },
      { name: 'title', type: 'string', description: 'Native HTML title attribute for tooltip.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides merged after variant styles.' },
      { name: 'className', type: 'string', description: 'Additional CSS class names.' },
    ],
    usage: `import { DSButton } from '@zeros-aiui/components/atoms';

<DSButton variant="primary" onClick={handleSave}>
  Save Changes
</DSButton>

<DSButton variant="ghost" icon={<Copy size={14} />}>
  Copy
</DSButton>

<DSButton variant="destructive" state="loading">
  Deleting...
</DSButton>`,
    accessibility: `- Renders native <button> element with full keyboard support
- aria-disabled set when disabled (maintains focusability)
- aria-busy="true" during loading state
- data-ds-interactive enables consistent focus-visible ring
- Focus ring: 3px accent-muted shadow on :focus-visible
- Reduced motion: transitions disabled via @media (prefers-reduced-motion)`,
    tokens: ['--token-accent', '--token-accent-hover', '--token-accent-fg', '--token-accent-muted', '--token-bg-tertiary', '--token-bg-hover', '--token-text-primary', '--token-text-secondary', '--token-error', '--token-border', '--token-shadow-accent', '--token-radius-md', '--token-duration-fast'],
    dependencies: [],
    usedBy: ['ActionPlan', 'AgentCard', 'ArtifactViewer', 'AudioPlayer', 'ChatInput', 'CodeBlock', 'ComparisonView', 'ConsentDialog', 'ContextAttachments', 'CostEstimator', 'DataTable', 'DynamicForm', 'FeedbackActions', 'FileAttachment', 'FollowUpBar', 'ImageEditor', 'ImageGenGrid', 'InlineActions'],
  },
  {
    id: 'badge',
    name: 'DSBadge',
    description: 'Small status label with color-coded variants. Used for counts, status indicators, AI markers, and categorization tags throughout the component system.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'variant', type: "'default' | 'success' | 'warning' | 'error' | 'ai' | 'count' | 'secondary' | 'tertiary'", default: "'default'", description: 'Color scheme. "ai" adds Sparkles icon prefix. "count" uses inverted colors.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Badge content text or number.' },
      { name: 'state', type: 'string', description: "Forced visual state for documentation." },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSBadge } from '@zeros-aiui/components/atoms';

<DSBadge variant="success">Active</DSBadge>
<DSBadge variant="ai">AI Generated</DSBadge>
<DSBadge variant="count">42</DSBadge>`,
    accessibility: `- Renders as <span> (non-interactive by default)
- For count/status variants, consider adding role="status" in parent context
- Scale animation on hover is purely decorative`,
    tokens: ['--token-bg-tertiary', '--token-text-secondary', '--token-success-light', '--token-success', '--token-warning-light', '--token-warning', '--token-error-light', '--token-error', '--token-accent-light', '--token-accent', '--token-text-primary', '--token-text-inverse', '--token-radius-full'],
    dependencies: [],
    usedBy: ['AICommandPalette', 'AIContextPanel', 'AgentCard', 'AnalysisProgress', 'ArtifactViewer', 'ChartResult', 'ChatHistory', 'CodeBlock', 'ConfidenceScore', 'ContextAttachments', 'CostEstimator', 'DynamicForm', 'InsightCard', 'KnowledgeBase', 'ListPanel', 'MCPConnector', 'MarkdownResponse', 'MeetingNotes', 'MemoryManager', 'MobileNotifications'],
  },
  {
    id: 'avatar',
    name: 'DSAvatar',
    description: 'Circular avatar with three variants for users, AI assistants, and system actors. Supports loading shimmer animation.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'variant', type: "'user' | 'ai' | 'system'", default: "'ai'", description: 'Avatar identity. Controls background color, icon, and ARIA label.' },
      { name: 'size', type: 'number', default: '32', description: 'Diameter in pixels. Icon scales to 45% of size.' },
      { name: 'state', type: 'string', description: "Forced state. 'loading' shows shimmer animation." },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSAvatar } from '@zeros-aiui/components/atoms';

<DSAvatar variant="ai" size={40} />
<DSAvatar variant="user" />
<DSAvatar variant="system" state="loading" />`,
    accessibility: `- Should include role="img" and aria-label for screen readers
- Loading state uses shimmer animation (respects prefers-reduced-motion)
- Hover ring is decorative feedback only`,
    tokens: ['--token-accent', '--token-accent-fg', '--token-secondary', '--token-secondary-fg', '--token-bg-tertiary', '--token-text-tertiary', '--token-accent-muted', '--token-radius-full'],
    dependencies: [],
    usedBy: ['ChatMessage', 'MobileAIChat', 'MeetingNotes'],
  },
  {
    id: 'input',
    name: 'DSInput',
    description: 'Text input field with search variant (prepends magnifying glass icon). Supports error, disabled, and focus states with animated border transitions.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'variant', type: "'text' | 'search' | 'disabled'", default: "'text'", description: "Input type variant. 'search' prepends Search icon." },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
      { name: 'state', type: 'string', description: "Forced state: 'error', 'focus', 'disabled'." },
      { name: 'value', type: 'string', description: 'Controlled value.' },
      { name: 'onChange', type: '(e: React.ChangeEvent<HTMLInputElement>) => void', description: 'Change handler.' },
      { name: 'onKeyDown', type: '(e: React.KeyboardEvent) => void', description: 'Keyboard event handler.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on wrapper div.' },
    ],
    usage: `import { DSInput } from '@zeros-aiui/components/atoms';

<DSInput placeholder="Type a message..." />
<DSInput variant="search" placeholder="Search..." />
<DSInput state="error" value="Invalid" />`,
    accessibility: `- Wraps native <input type="text"> which inherits browser a11y
- Focus state applies accent border + shadow ring
- Error state applies red border (needs aria-invalid for screen readers)
- Consider adding aria-label when no visible label exists`,
    tokens: ['--token-border', '--token-accent', '--token-error', '--token-bg', '--token-bg-tertiary', '--token-text-primary', '--token-text-disabled', '--token-accent-muted', '--token-radius-md'],
    dependencies: [],
    usedBy: ['DynamicForm', 'MemoryManager', 'ListPanel'],
  },
  {
    id: 'toggle',
    name: 'DSToggle',
    description: 'Boolean switch control with smooth knob animation. Supports controlled and uncontrolled modes with forced on/off states for documentation.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'defaultOn', type: 'boolean', default: 'false', description: 'Initial state (uncontrolled mode).' },
      { name: 'on', type: 'boolean', description: 'Controlled on/off state.' },
      { name: 'state', type: 'string', description: "Forced state: 'on', 'off', 'disabled', 'hover'." },
      { name: 'onChange', type: '(value: boolean) => void', description: 'Called with new boolean value on toggle.' },
    ],
    usage: `import { DSToggle } from '@zeros-aiui/components/atoms';

<DSToggle defaultOn={true} onChange={setEnabled} />
<DSToggle on={isEnabled} onChange={setEnabled} />`,
    accessibility: `- role="switch" with aria-checked for screen reader state
- aria-disabled when disabled
- data-ds-interactive for focus ring
- Keyboard: Space/Enter toggles (native button behavior)
- Consider adding aria-label when no adjacent label exists`,
    tokens: ['--token-accent', '--token-bg-tertiary', '--token-accent-muted', '--token-shadow-xs', '--token-radius-full', '--token-duration-fast'],
    dependencies: [],
    usedBy: ['DSToggleRow', 'MCPConnector', 'DynamicForm', 'ConsentDialog'],
  },
  {
    id: 'tag',
    name: 'DSTag',
    description: 'Pill-shaped label for categories, filters, and selections. Supports removable (X button), selected state, and custom colors.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'children', type: 'string', required: true, description: 'Tag label text.' },
      { name: 'removable', type: 'boolean', description: 'Shows X button for removal.' },
      { name: 'color', type: 'string', description: 'Custom color. Applied as text color and 10% opacity background.' },
      { name: 'state', type: 'string', description: "Forced state: 'selected', 'hover', 'disabled'." },
      { name: 'selected', type: 'boolean', description: 'Selected state (accent border + light background).' },
      { name: 'onClick', type: '() => void', description: 'Click handler. Changes cursor to pointer when set.' },
      { name: 'onRemove', type: '() => void', description: 'Called when X button is clicked.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSTag } from '@zeros-aiui/components/atoms';

<DSTag>TypeScript</DSTag>
<DSTag selected>React</DSTag>
<DSTag removable onRemove={handleRemove}>Filter</DSTag>`,
    accessibility: `- When clickable (onClick), should have tabIndex={0} and keyboard Enter support
- When selectable, should use role="option" with aria-selected
- Remove button stops event propagation
- Consider aria-label for removable tags ("Remove TypeScript")`,
    tokens: ['--token-border', '--token-accent', '--token-accent-light', '--token-bg-hover', '--token-text-secondary', '--token-radius-full'],
    dependencies: [],
    usedBy: ['MeetingNotes', 'ContextAttachments'],
  },
  {
    id: 'checkbox',
    name: 'DSCheckbox',
    description: 'Tri-state checkbox (checked, unchecked, indeterminate) with optional label. Full keyboard support with Space/Enter toggle.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Initial checked state.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate (mixed) visual state.' },
      { name: 'label', type: 'string', description: 'Adjacent text label.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with new checked value.' },
      { name: 'state', type: 'string', description: "Forced state: 'checked', 'indeterminate', 'hover', 'focus', 'disabled'." },
    ],
    usage: `import { DSCheckbox } from '@zeros-aiui/components/atoms';

<DSCheckbox label="Accept terms" onChange={setAccepted} />
<DSCheckbox checked indeterminate />
<DSCheckbox label="Disabled" disabled />`,
    accessibility: `- role="checkbox" with aria-checked (true/false/"mixed")
- tabIndex={0} for keyboard focus
- Keyboard: Space or Enter toggles checked state
- aria-disabled when disabled
- data-ds-interactive for focus ring
- Label text is visually associated (same click target)`,
    tokens: ['--token-accent', '--token-accent-fg', '--token-border', '--token-border-strong', '--token-accent-muted', '--token-text-primary', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['ConsentDialog', 'AIOnboarding'],
  },
  {
    id: 'slider',
    name: 'DSSlider',
    description: 'Range slider with gradient track fill, label, and real-time value display. Uses a hidden native range input for accessible dragging.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'label', type: 'string', default: "'Temperature'", description: 'Label text displayed above the slider.' },
      { name: 'value', type: 'number', default: '0.7', description: 'Current value.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
      { name: 'max', type: 'number', default: '1', description: 'Maximum value.' },
      { name: 'state', type: 'string', description: "Forced state for documentation." },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
      { name: 'onChange', type: '(value: number) => void', description: 'Called with new value on change.' },
    ],
    usage: `import { DSSlider } from '@zeros-aiui/components/atoms';

<DSSlider label="Temperature" value={0.7} onChange={setTemp} />
<DSSlider label="Max Tokens" min={0} max={4096} value={2048} />`,
    accessibility: `- Uses hidden native <input type="range"> for full a11y support
- Native input provides keyboard Arrow key adjustment
- Visual thumb and track are decorative overlays
- Consider adding aria-label to the native input matching the label prop
- Disabled state applies 0.4 opacity`,
    tokens: ['--token-accent', '--token-secondary', '--token-bg-tertiary', '--token-text-secondary', '--token-accent-muted', '--token-shadow-sm', '--token-radius-full'],
    dependencies: [],
    usedBy: ['ParametersPanel', 'DSSliderGroup'],
  },
  {
    id: 'select',
    name: 'DSSelect',
    description: 'Custom dropdown select with option list. Tracks hover state per option. Supports controlled/uncontrolled selection with open/close animation.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'options', type: 'string[]', required: true, description: 'Array of option strings.' },
      { name: 'value', type: 'string', description: 'Controlled selected value.' },
      { name: 'placeholder', type: 'string', description: 'Placeholder when no value selected.' },
      { name: 'state', type: 'string', description: "Forced state: 'open', 'focus', 'disabled'." },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with selected option string.' },
    ],
    usage: `import { DSSelect } from '@zeros-aiui/components/atoms';

<DSSelect
  options={['GPT-4', 'GPT-3.5', 'Claude']}
  value={model}
  onChange={setModel}
/>`,
    accessibility: `- Needs role="combobox" on trigger, role="listbox" on dropdown
- aria-expanded on trigger element
- Arrow key navigation through options
- Escape to close dropdown
- Click outside to close (not yet implemented)
- Each option needs role="option" and aria-selected`,
    tokens: ['--token-border', '--token-accent', '--token-bg', '--token-bg-tertiary', '--token-bg-hover', '--token-accent-light', '--token-text-primary', '--token-text-secondary', '--token-text-disabled', '--token-accent-muted', '--token-shadow-lg', '--token-radius-md'],
    dependencies: [],
    usedBy: ['DynamicForm', 'AIContextPanel'],
  },
  {
    id: 'progress-bar',
    name: 'DSProgress',
    description: 'Horizontal progress bar with gradient fill. Supports determinate (percentage) and indeterminate (shimmer animation) modes.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Progress percentage (0-100).' },
      { name: 'state', type: 'string', description: "'indeterminate' for shimmer animation." },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on outer container.' },
    ],
    usage: `import { DSProgress } from '@zeros-aiui/components/atoms';

<DSProgress value={65} />
<DSProgress state="indeterminate" />`,
    accessibility: `- Needs role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
- For indeterminate: omit aria-valuenow, add aria-label="Loading"
- Gradient fill is decorative; ensure sufficient contrast`,
    tokens: ['--token-accent', '--token-secondary', '--token-bg-tertiary', '--token-radius-full', '--token-duration-normal'],
    dependencies: [],
    usedBy: ['ActionPlan', 'ContextWindow', 'AIOnboarding'],
  },
  {
    id: 'spinner',
    name: 'DSSpinner',
    description: 'Rotating loading indicator using the Loader2 icon with infinite spin animation.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'size', type: 'number', default: '16', description: 'Spinner diameter in pixels.' },
      { name: 'color', type: 'string', description: 'Custom color. Defaults to --token-accent.' },
    ],
    usage: `import { DSSpinner } from '@zeros-aiui/components/atoms';

<DSSpinner />
<DSSpinner size={24} color="var(--token-error)" />`,
    accessibility: `- Needs role="status" and aria-label="Loading" for screen readers
- Animation respects prefers-reduced-motion via data-ds-animated
- Should be accompanied by visually hidden status text`,
    tokens: ['--token-accent'],
    dependencies: [],
    usedBy: ['AnalysisProgress', 'DSPullIndicator'],
  },
  {
    id: 'divider',
    name: 'DSDivider',
    description: 'Horizontal rule with three visual variants: solid line, dashed line, or gradient fade. Optional centered label text.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'label', type: 'string', description: 'Centered text between two lines.' },
      { name: 'variant', type: "'solid' | 'dashed' | 'gradient'", default: "'solid'", description: 'Visual style of the dividing line.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSDivider } from '@zeros-aiui/components/atoms';

<DSDivider />
<DSDivider label="or" variant="dashed" />
<DSDivider variant="gradient" />`,
    accessibility: `- Should use role="separator" for semantic separation
- Label variant includes visible text (accessible by default)
- Decorative use: consider aria-hidden="true"`,
    tokens: ['--token-border', '--token-text-disabled'],
    dependencies: [],
    usedBy: ['ChatMessage', 'ConversationFork', 'AICommandPalette', 'MarkdownResponse', 'MeetingNotes'],
  },
  {
    id: 'collapsible',
    name: 'DSCollapsible',
    description: 'Expandable section with clickable header, chevron indicator, and animated content reveal. Supports icon and meta content in header.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Header title text.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Leading icon in header.' },
      { name: 'meta', type: 'React.ReactNode', description: 'Trailing meta content (badge, count, etc.).' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open/closed state.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Collapsible content.' },
      { name: 'state', type: 'string', description: "Forced state: 'open', 'closed', 'disabled'." },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on outer container.' },
    ],
    usage: `import { DSCollapsible } from '@zeros-aiui/components/atoms';

<DSCollapsible title="Advanced Settings" defaultOpen>
  <DSSlider label="Temperature" />
</DSCollapsible>`,
    accessibility: `- Header button has aria-expanded indicating open/closed state
- data-ds-interactive for focus ring on header
- Keyboard: Enter/Space toggles open/closed (native button)
- Should add aria-controls linking to content panel id
- Content panel should have role="region" with aria-labelledby`,
    tokens: ['--token-border', '--token-bg-secondary', '--token-bg-hover', '--token-text-primary', '--token-text-tertiary', '--token-radius-lg', '--token-duration-fast', '--token-duration-normal'],
    dependencies: [],
    usedBy: ['AIContextPanel', 'AIUsageDashboard', 'ConsentDialog'],
  },
  {
    id: 'segmented-control',
    name: 'DSSegmentedControl',
    description: 'Inline radio-button-style selector with visual indicator for active option. Used for filter tabs, view modes, and toggle groups.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'options', type: 'string[]', required: true, description: 'Array of option labels.' },
      { name: 'value', type: 'string', description: 'Controlled active option.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with selected option string.' },
      { name: 'state', type: 'string', description: "Forced state: 'disabled'." },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on outer container.' },
    ],
    usage: `import { DSSegmentedControl } from '@zeros-aiui/components/atoms';

<DSSegmentedControl
  options={['All', 'Unread', 'Archived']}
  value={filter}
  onChange={setFilter}
/>`,
    accessibility: `- Should use role="radiogroup" on container
- Each option should have role="radio" with aria-checked
- Arrow key navigation between options
- Active option has elevated shadow for visual distinction`,
    tokens: ['--token-border', '--token-bg-secondary', '--token-bg', '--token-text-primary', '--token-text-tertiary', '--token-shadow-xs', '--token-radius-md', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['MobileNotifications', 'AIOnboarding'],
  },
  {
    id: 'counter',
    name: 'DSCounter',
    description: 'Numeric stepper with +/- buttons, value display, and configurable min/max/step. Used for token limits, quantity selectors.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current value.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step.' },
      { name: 'label', type: 'string', description: 'Leading label text.' },
      { name: 'state', type: 'string', description: "Forced state: 'disabled'." },
      { name: 'onChange', type: '(value: number) => void', description: 'Called with new value.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSCounter } from '@zeros-aiui/components/atoms';

<DSCounter label="Max Tokens" value={4096} max={8192} step={256} />`,
    accessibility: `- Buttons disable at min/max boundaries
- Should use role="spinbutton" with aria-valuenow, aria-valuemin, aria-valuemax
- Arrow Up/Down keyboard support needed
- aria-label combining label + value for screen readers`,
    tokens: ['--token-border', '--token-bg', '--token-text-primary', '--token-text-secondary', '--token-text-disabled', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['AIOnboarding'],
  },
  {
    id: 'rating',
    name: 'DSRating',
    description: 'Star rating control with hover preview. Supports configurable max stars, custom size, and disabled state.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current rating value (1-based).' },
      { name: 'max', type: 'number', default: '5', description: 'Maximum number of stars.' },
      { name: 'state', type: 'string', description: "Forced state: 'disabled'." },
      { name: 'onChange', type: '(value: number) => void', description: 'Called with selected star value.' },
      { name: 'size', type: 'number', default: '16', description: 'Star icon size in pixels.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSRating } from '@zeros-aiui/components/atoms';

<DSRating value={4} onChange={setRating} />
<DSRating max={10} size={20} />`,
    accessibility: `- Should use role="radiogroup" with individual role="radio" per star
- Arrow key navigation to change rating
- aria-label="Rating: 4 out of 5" for screen readers
- Hover preview is visual-only feedback`,
    tokens: ['--token-warning', '--token-text-disabled'],
    dependencies: [],
    usedBy: [],
  },
  {
    id: 'textarea',
    name: 'DSTextarea',
    description: 'Multi-line text input with character counter, error state, and auto-growing capabilities. Used for prompt composition.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'placeholder', type: 'string', default: "'Enter your prompt...'", description: 'Placeholder text.' },
      { name: 'value', type: 'string', description: 'Controlled value.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with new text value.' },
      { name: 'state', type: 'string', description: "Forced state: 'error', 'focus', 'disabled'." },
      { name: 'rows', type: 'number', default: '3', description: 'Initial visible rows.' },
      { name: 'maxLength', type: 'number', description: 'Character limit. Shows counter when set.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on wrapper.' },
    ],
    usage: `import { DSTextarea } from '@zeros-aiui/components/atoms';

<DSTextarea
  placeholder="Describe your task..."
  maxLength={500}
  onChange={setPrompt}
/>`,
    accessibility: `- Native <textarea> element with full a11y support
- Character counter turns red at 90% capacity
- aria-invalid should be set for error state
- Consider aria-describedby for character count`,
    tokens: ['--token-border', '--token-accent', '--token-error', '--token-bg', '--token-bg-tertiary', '--token-text-primary', '--token-text-disabled', '--token-accent-muted', '--token-radius-md'],
    dependencies: [],
    usedBy: ['PromptTemplates', 'DynamicForm'],
  },
  {
    id: 'skeleton',
    name: 'DSSkeleton',
    description: 'Loading placeholder with shimmer animation. Three variants: text (two lines), avatar (circle), and card (rectangle).',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'variant', type: "'text' | 'avatar' | 'card'", default: "'text'", description: 'Shape variant.' },
      { name: 'width', type: 'number | string', description: 'Custom width override.' },
      { name: 'height', type: 'number | string', description: 'Custom height override.' },
    ],
    usage: `import { DSSkeleton } from '@zeros-aiui/components/atoms';

<DSSkeleton variant="text" />
<DSSkeleton variant="avatar" />
<DSSkeleton variant="card" width={200} height={100} />`,
    accessibility: `- Should use aria-hidden="true" (decorative placeholder)
- Parent container should have role="status" with aria-label="Loading"
- Shimmer animation respects prefers-reduced-motion`,
    tokens: ['--token-bg-tertiary', '--token-bg-secondary', '--token-radius-full', '--token-radius-md', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['SkeletonLoader'],
  },
  {
    id: 'dot',
    name: 'DSDot',
    description: 'Small circular status indicator with optional pulsing animation and label. Used for online status, unread markers, and priority indicators.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'color', type: 'string', default: 'var(--token-tertiary)', description: 'Dot color.' },
      { name: 'size', type: 'number', default: '8', description: 'Dot diameter in pixels.' },
      { name: 'pulsing', type: 'boolean', default: 'false', description: 'Enables pulse glow animation.' },
      { name: 'label', type: 'string', description: 'Adjacent text label.' },
    ],
    usage: `import { DSDot } from '@zeros-aiui/components/atoms';

<DSDot color="var(--token-success)" pulsing />
<DSDot color="var(--token-error)" label="Offline" />`,
    accessibility: `- Decorative by default: should use aria-hidden="true"
- When label is present, the label provides context
- Pulsing animation respects prefers-reduced-motion`,
    tokens: ['--token-tertiary', '--token-text-tertiary', '--token-radius-full'],
    dependencies: [],
    usedBy: ['AgentCard', 'ChatHistory', 'FileTree', 'FollowUpBar', 'KnowledgeBase', 'ListPanel', 'MCPConnector', 'MobileAIChat', 'MobileNotifications'],
  },
  {
    id: 'kbd',
    name: 'DSKbd',
    description: 'Keyboard shortcut display using semantic <kbd> element. Styled as a raised key cap with bottom border shadow.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'children', type: 'string', required: true, description: 'Key label text (e.g., "K", "Enter", "Esc").' },
      { name: 'state', type: 'string', description: "Forced visual state." },
    ],
    usage: `import { DSKbd } from '@zeros-aiui/components/atoms';

<DSKbd>K</DSKbd>
<DSKbd>Enter</DSKbd>`,
    accessibility: `- Uses semantic <kbd> element (natively accessible)
- Screen readers announce as keyboard key
- Hover state adds visual depth effect`,
    tokens: ['--token-text-primary', '--token-text-secondary', '--token-bg-secondary', '--token-bg-tertiary', '--token-border', '--token-border-strong', '--token-text-tertiary', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['AICommandPalette', 'Autocomplete'],
  },
  {
    id: 'code-inline',
    name: 'DSCodeInline',
    description: 'Inline code snippet using semantic <code> element. Accent-colored text with subtle muted background.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'children', type: 'string', required: true, description: 'Code text content.' },
      { name: 'state', type: 'string', description: "Forced visual state." },
    ],
    usage: `import { DSCodeInline } from '@zeros-aiui/components/atoms';

<p>Use the <DSCodeInline>useState</DSCodeInline> hook.</p>`,
    accessibility: `- Uses semantic <code> element (natively accessible)
- Screen readers identify as code content
- Hover brightens background for visual feedback`,
    tokens: ['--token-accent', '--token-accent-light', '--token-accent-muted', '--token-radius-sm'],
    dependencies: [],
    usedBy: ['MarkdownResponse'],
  },
  {
    id: 'color-bar',
    name: 'DSColorBar',
    description: 'Multi-segment horizontal bar chart. Each segment has a proportional width based on value/total ratio. Used for token usage, context windows, and data visualization.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'segments', type: '{ value: number; color: string; label?: string }[]', required: true, description: 'Array of segments with value and color.' },
      { name: 'total', type: 'number', required: true, description: 'Total value for calculating percentages.' },
      { name: 'height', type: 'number', default: '6', description: 'Bar height in pixels.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSColorBar } from '@zeros-aiui/components/atoms';

<DSColorBar
  segments={[
    { value: 60, color: 'var(--token-accent)', label: 'Used' },
    { value: 40, color: 'var(--token-bg-tertiary)', label: 'Free' },
  ]}
  total={100}
/>`,
    accessibility: `- Should use role="img" with aria-label describing all segments
- Example: aria-label="Token usage: 60% used, 40% free"
- Individual segment labels are for tooltip/legend only`,
    tokens: ['--token-bg-tertiary', '--token-radius-full', '--token-duration-slow'],
    dependencies: [],
    usedBy: ['ContextWindow', 'TokenUsage', 'ChartResult', 'AIContextPanel', 'AIUsageDashboard'],
  },
  {
    id: 'legend-item',
    name: 'DSLegendItem',
    description: 'Color swatch + label + optional mono value. Used in chart legends and data visualization key displays.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'color', type: 'string', required: true, description: 'Swatch color.' },
      { name: 'label', type: 'string', required: true, description: 'Legend label text.' },
      { name: 'value', type: 'string', description: 'Optional value displayed in mono font.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSLegendItem } from '@zeros-aiui/components/atoms';

<DSLegendItem color="var(--token-accent)" label="Prompt" value="2.4k" />`,
    accessibility: `- Static display element, accessible by default
- Color swatch is decorative (info conveyed by label text)`,
    tokens: ['--token-text-secondary', '--token-text-tertiary'],
    dependencies: [],
    usedBy: ['ContextWindow', 'ChartResult', 'AIContextPanel', 'AIUsageDashboard'],
  },
  {
    id: 'streaming-dots',
    name: 'DSStreamingDots',
    description: 'Three-dot bouncing animation for AI thinking/typing states. Customizable size and color.',
    category: 'atom',
    importPath: "@zeros-aiui/components/atoms",
    props: [
      { name: 'size', type: 'number', default: '6', description: 'Dot diameter in pixels.' },
      { name: 'color', type: 'string', default: 'var(--token-accent)', description: 'Dot color.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSStreamingDots } from '@zeros-aiui/components/atoms';

<DSStreamingDots />
<DSStreamingDots size={8} color="var(--token-secondary)" />`,
    accessibility: `- Should have role="status" and aria-label="Processing"
- Animation respects prefers-reduced-motion
- Accompany with visually hidden "AI is thinking" text`,
    tokens: ['--token-accent', '--token-radius-full'],
    dependencies: [],
    usedBy: ['ThinkingIndicator', 'StreamingText'],
  },
  { id: 'radio', name: 'DSRadio', description: 'Radio button group for single-selection choices.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'options', type: 'string[]', required: true, description: 'Option labels.' }, { name: 'value', type: 'string', description: 'Selected option.' }, { name: 'onChange', type: '(v: string) => void', description: 'Selection callback.' }, { name: 'state', type: 'string', description: 'Forced state.' }], usage: `<DSRadio options={['GPT-4o', 'Claude', 'Gemini']} />`, accessibility: '- role="radiogroup" with aria-label\n- Each option: role="radio", aria-checked\n- Arrow keys move, Space/Enter selects', tokens: ['--token-accent', '--token-border', '--token-radius-full'], dependencies: [] },
  { id: 'tooltip', name: 'DSTooltip', description: 'Hover-triggered tooltip with positioned label.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'label', type: 'string', required: true, description: 'Tooltip text.' }, { name: 'state', type: 'string', description: "Force 'visible'." }], usage: `<DSTooltip label="Copy to clipboard" />`, accessibility: '- role="tooltip", aria-hidden when hidden\n- Trigger uses aria-describedby', tokens: ['--token-bg-tertiary', '--token-text-primary', '--token-radius-sm'], dependencies: [] },
  { id: 'link', name: 'DSLink', description: 'Styled text link with optional external icon.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'label', type: 'string', required: true, description: 'Link text.' }, { name: 'href', type: 'string', description: 'URL.' }, { name: 'external', type: 'boolean', default: 'false', description: 'Shows external icon.' }, { name: 'state', type: 'string', description: 'Forced state.' }], usage: `<DSLink label="View docs" href="/docs" />`, accessibility: '- Renders <a> with proper href\n- External: "(opens in new tab)" label\n- Focus ring via box-shadow', tokens: ['--token-accent', '--token-accent-hover'], dependencies: [] },
  { id: 'thumbnail', name: 'DSThumbnail', description: 'Square image preview with selection state for media grids.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Accent border when selected.' }, { name: 'state', type: 'string', description: 'Forced state.' }], usage: `<DSThumbnail selected />`, accessibility: '- role="img" with aria-label\n- aria-selected for selection state\n- Space/Enter to select', tokens: ['--token-accent', '--token-border', '--token-bg-tertiary', '--token-radius-md'], dependencies: [] },
  { id: 'icons', name: 'Icons', description: 'Curated lucide-react icon set used across the system.', category: 'atom', importPath: "lucide-react", props: [{ name: 'size', type: 'number', default: '24', description: 'Pixel size.' }, { name: 'color', type: 'string', description: 'Stroke color.' }], usage: `import { Sparkles } from 'lucide-react';\n<Sparkles size={16} />`, accessibility: '- Decorative: aria-hidden="true"\n- Standalone: needs aria-label or title', tokens: [], dependencies: [] },
  { id: 'bottom-sheet-handle', name: 'DSBottomSheetHandle', description: 'Draggable pill handle for mobile bottom sheets.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' }], usage: `<DSBottomSheetHandle />`, accessibility: '- Decorative, aria-hidden\n- Parent handles drag', tokens: ['--token-text-disabled', '--token-radius-full'], dependencies: [], usedBy: ['BottomSheet'] },
  { id: 'swipe-action', name: 'DSSwipeAction', description: 'Mobile swipe-to-reveal action container.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'children', type: 'React.ReactNode', required: true, description: 'Content layer.' }, { name: 'actions', type: 'array', description: 'Action buttons on swipe.' }, { name: 'revealed', type: 'boolean', default: 'false', description: 'Actions visible.' }], usage: `<DSSwipeAction revealed><div>Content</div></DSSwipeAction>`, accessibility: '- Actions need aria-labels\n- Keyboard alternative for touch gesture', tokens: ['--token-error', '--token-warning', '--token-bg'], dependencies: [], usedBy: ['SwipeableRow'] },
  { id: 'pull-indicator', name: 'DSPullIndicator', description: 'Pull-to-refresh status indicator for mobile.', category: 'atom', importPath: "@zeros-aiui/components/atoms", props: [{ name: 'state', type: "'idle'|'pulling'|'refreshing'|'done'", default: "'idle'", description: 'Pull state.' }], usage: `<DSPullIndicator state="refreshing" />`, accessibility: '- role="status", aria-live="polite"\n- State text is screen-reader accessible', tokens: ['--token-accent', '--token-success', '--token-text-disabled'], dependencies: [] },
];

/* ——————————————————————————————————————————————————
   MOLECULE DOCUMENTATION
   —————————————————————————————————————————————————— */

const moleculeDocs: ComponentDoc[] = [
  {
    id: 'search-bar',
    name: 'DSSearchBar',
    description: 'Search input with icon, placeholder, and keyboard shortcut hint. Composed from DSInput atoms with Search icon prefix.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'placeholder', type: 'string', default: "'Search conversations...'", description: 'Placeholder text.' },
      { name: 'value', type: 'string', description: 'Controlled search value.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with search text on change.' },
      { name: 'shortcut', type: 'string', default: "'\\u2318K'", description: 'Keyboard shortcut hint displayed on right.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSSearchBar } from '@zeros-aiui/components/molecules';

<DSSearchBar placeholder="Search..." onChange={setQuery} />`,
    accessibility: `- Should wrap in role="search" landmark
- Input needs aria-label="Search"
- Shortcut hint is decorative (aria-hidden)`,
    tokens: ['--token-border', '--token-bg', '--token-text-primary', '--token-text-disabled', '--token-radius-md'],
    dependencies: ['DSInput', 'DSKbd'],
    usedBy: ['ListPanel', 'MobileSearchAI'],
  },
  {
    id: 'header-bar',
    name: 'DSHeaderBar',
    description: 'Panel header with title, icon slot, and action buttons. Used as the top bar for cards, panels, and content sections.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'title', type: 'string', description: 'Header title text (hidden when icon provides its own title).' },
      { name: 'icon', type: 'React.ReactNode', description: 'Leading icon or custom header content. Replaces title when set.' },
      { name: 'actions', type: 'React.ReactNode', description: 'Trailing action buttons.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSHeaderBar } from '@zeros-aiui/components/molecules';

<DSHeaderBar
  title="Notifications"
  actions={<DSButton variant="ghost">Clear All</DSButton>}
/>`,
    accessibility: `- Title should map to appropriate heading level (h2, h3)
- Action buttons should be keyboard accessible
- Consider aria-label on the header region`,
    tokens: ['--token-bg-secondary', '--token-border', '--token-text-primary'],
    dependencies: [],
    usedBy: ['ListPanel', 'ConversationFork', 'MeetingNotes', 'MobileNotifications', 'AIContextPanel', 'AIUsageDashboard'],
  },
  {
    id: 'tab-bar',
    name: 'DSTabBar',
    description: 'Horizontal tab navigation with animated active indicator. Supports controlled active index.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'tabs', type: 'string[]', required: true, description: 'Array of tab labels.' },
      { name: 'activeIndex', type: 'number', description: 'Controlled active tab index.' },
      { name: 'onTabChange', type: '(index: number) => void', description: 'Called with new active index.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSTabBar } from '@zeros-aiui/components/molecules';

<DSTabBar
  tabs={['Overview', 'Usage', 'Settings']}
  activeIndex={activeTab}
  onTabChange={setActiveTab}
/>`,
    accessibility: `- Needs role="tablist" on container
- Each tab needs role="tab" with aria-selected
- Tab panels need role="tabpanel" with aria-labelledby
- Arrow keys to navigate between tabs
- Home/End to jump to first/last tab`,
    tokens: ['--token-border', '--token-text-primary', '--token-text-tertiary', '--token-accent'],
    dependencies: [],
    usedBy: ['ArtifactViewer', 'AIUsageDashboard'],
  },
  {
    id: 'modal',
    name: 'DSModal',
    description: 'Overlay dialog with title, content area, and action buttons. Centered on screen with backdrop overlay.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Modal title text.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Modal body content.' },
      { name: 'onClose', type: '() => void', description: 'Close handler (X button and backdrop click).' },
      { name: 'actions', type: 'React.ReactNode', description: 'Footer action buttons.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides on modal container.' },
    ],
    usage: `import { DSModal } from '@zeros-aiui/components/molecules';

<DSModal title="Confirm Delete" onClose={close} actions={
  <>
    <DSButton variant="ghost" onClick={close}>Cancel</DSButton>
    <DSButton variant="destructive" onClick={handleDelete}>Delete</DSButton>
  </>
}>
  <p>Are you sure you want to delete this conversation?</p>
</DSModal>`,
    accessibility: `- Needs role="dialog" and aria-modal="true"
- Focus should be trapped within modal
- Escape key should close modal
- Return focus to trigger element on close
- Title should be referenced via aria-labelledby`,
    tokens: ['--token-bg', '--token-border', '--token-bg-overlay', '--token-text-primary', '--token-shadow-xl', '--token-radius-xl', '--token-z-modal'],
    dependencies: ['DSButton'],
    usedBy: [],
  },
  {
    id: 'empty-state',
    name: 'DSEmptyState',
    description: 'Placeholder content for empty lists and zero-data states. Shows icon, title, description, and optional action button.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'icon', type: 'React.ReactNode', description: 'Large centered icon.' },
      { name: 'title', type: 'string', default: "'No conversations yet'", description: 'Primary message.' },
      { name: 'description', type: 'string', default: "'Start a new chat to begin'", description: 'Secondary explanation text.' },
      { name: 'action', type: 'React.ReactNode', description: 'Optional action button.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSEmptyState } from '@zeros-aiui/components/molecules';

<DSEmptyState
  icon={<Bell size={32} />}
  title="All caught up"
  description="No new notifications"
/>`,
    accessibility: `- Should use role="status" for dynamic content replacement
- Icon is decorative (aria-hidden)
- Action button inherits DSButton accessibility`,
    tokens: ['--token-text-primary', '--token-text-tertiary', '--token-text-disabled'],
    dependencies: ['DSButton'],
    usedBy: ['MobileNotifications', 'MobileSearchAI', 'ListPanel'],
  },
  {
    id: 'breadcrumb',
    name: 'DSBreadcrumb',
    description: 'Navigation breadcrumb trail with clickable segments and separator characters.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'items', type: 'string[]', required: true, description: 'Array of breadcrumb labels.' },
      { name: 'onNavigate', type: '(index: number) => void', description: 'Called with clicked item index.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSBreadcrumb } from '@zeros-aiui/components/molecules';

<DSBreadcrumb
  items={['Templates', 'Code Review']}
  onNavigate={(i) => setStep(i)}
/>`,
    accessibility: `- Should wrap in <nav> with aria-label="Breadcrumb"
- Last item should have aria-current="page"
- Clickable items need keyboard Enter support`,
    tokens: ['--token-text-secondary', '--token-text-primary', '--token-accent', '--token-text-disabled'],
    dependencies: [],
    usedBy: ['PromptTemplates'],
  },
  {
    id: 'toggle-row',
    name: 'DSToggleRow',
    description: 'Labeled toggle switch row with title, description, and DSToggle. Standard settings pattern.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Primary label text.' },
      { name: 'description', type: 'string', description: 'Secondary description text.' },
      { name: 'defaultOn', type: 'boolean', default: 'true', description: 'Initial toggle state.' },
      { name: 'on', type: 'boolean', description: 'Controlled toggle state.' },
      { name: 'onChange', type: '(value: boolean) => void', description: 'Called with new toggle value.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSToggleRow } from '@zeros-aiui/components/molecules';

<DSToggleRow
  label="Stream responses"
  description="Show text as it's generated"
  onChange={setStreaming}
/>`,
    accessibility: `- Label should be connected to toggle via aria-labelledby
- Description should be connected via aria-describedby
- Clicking anywhere on the row toggles the switch`,
    tokens: ['--token-text-primary', '--token-text-tertiary', '--token-border'],
    dependencies: ['DSToggle'],
    usedBy: ['AIContextPanel', 'AIUsageDashboard', 'ConsentDialog'],
  },
  {
    id: 'list-item',
    name: 'DSListItem',
    description: 'Standard list row with avatar, title, subtitle, meta, badge, and active state indicator. Building block for all list-based panels.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Primary text.' },
      { name: 'subtitle', type: 'string', description: 'Secondary text line.' },
      { name: 'meta', type: 'string', description: 'Right-aligned meta text (time, count).' },
      { name: 'avatar', type: 'React.ReactNode', description: 'Leading avatar/icon.' },
      { name: 'badge', type: 'React.ReactNode', description: 'Trailing badge element.' },
      { name: 'dot', type: 'React.ReactNode', description: 'Status dot indicator.' },
      { name: 'active', type: 'boolean', description: 'Active/selected visual state.' },
      { name: 'onClick', type: '() => void', description: 'Click handler.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSListItem } from '@zeros-aiui/components/molecules';

<DSListItem
  title="Conversation Title"
  subtitle="Last message preview..."
  meta="2m ago"
  active
/>`,
    accessibility: `- Should use role="option" when inside a listbox, role="listitem" otherwise
- Active state should be conveyed via aria-selected or aria-current
- Keyboard Enter/Space to activate`,
    tokens: ['--token-bg', '--token-accent-light', '--token-border', '--token-text-primary', '--token-text-secondary', '--token-text-tertiary', '--token-bg-hover'],
    dependencies: ['DSBadge', 'DSDot'],
    usedBy: ['ListPanel'],
  },
  {
    id: 'dropdown-menu',
    name: 'DSDropdownMenu',
    description: 'Floating menu with labeled items, icons, and keyboard shortcut hints. Supports dividers and item-level hover tracking.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'items', type: '{ label: string; icon?: React.ReactNode; shortcut?: string; onClick?: () => void; divider?: boolean }[]', required: true, description: 'Menu items array.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSDropdownMenu } from '@zeros-aiui/components/molecules';

<DSDropdownMenu items={[
  { label: 'Edit', icon: <Pencil size={14} /> },
  { label: 'Delete', icon: <Trash2 size={14} />, shortcut: '\\u2318D' },
  { divider: true },
  { label: 'Settings', icon: <Settings size={14} /> },
]} />`,
    accessibility: `- Needs role="menu" on container
- Items need role="menuitem"
- Arrow Up/Down navigation
- Escape to close
- Home/End to jump to first/last
- Type-ahead character matching`,
    tokens: ['--token-bg', '--token-border', '--token-shadow-lg', '--token-text-primary', '--token-text-disabled', '--token-bg-hover', '--token-radius-lg'],
    dependencies: ['DSDivider'],
    usedBy: [],
  },
  {
    id: 'stat-display',
    name: 'DSStatDisplay',
    description: 'Metric display card with label, large value, change indicator, and optional icon. Used in dashboards and overview panels.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Metric label.' },
      { name: 'value', type: 'string | number', required: true, description: 'Metric value (rendered large).' },
      { name: 'change', type: 'string', description: 'Change indicator text (e.g., "+12%").' },
      { name: 'icon', type: 'React.ReactNode', description: 'Leading icon.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSStatDisplay } from '@zeros-aiui/components/molecules';

<DSStatDisplay label="API Calls" value="1,234" change="+12%" />`,
    accessibility: `- Static display, accessible by default
- Consider role="status" for live-updating values
- Change text color conveys meaning (green/red) - ensure text prefix (+/-) provides redundant info`,
    tokens: ['--token-text-primary', '--token-text-secondary', '--token-text-tertiary', '--token-success', '--token-error', '--token-border', '--token-radius-lg'],
    dependencies: [],
    usedBy: ['AIUsageDashboard'],
  },
  {
    id: 'chip-group',
    name: 'DSChipGroup',
    description: 'Multi-select chip/tag group with toggle selection. Used for filter sets, interest pickers, and category selectors.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'chips', type: 'string[]', required: true, description: 'Array of chip labels.' },
      { name: 'selected', type: 'string[]', description: 'Controlled array of selected chip labels.' },
      { name: 'onToggle', type: '(chip: string) => void', description: 'Called with toggled chip label.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSChipGroup } from '@zeros-aiui/components/molecules';

<DSChipGroup
  chips={['Code', 'Design', 'Writing', 'Research']}
  selected={['Code', 'Writing']}
  onToggle={handleToggle}
/>`,
    accessibility: `- Should use role="listbox" with aria-multiselectable="true"
- Each chip should have role="option" with aria-selected
- Keyboard Enter/Space to toggle selection`,
    tokens: ['--token-border', '--token-accent', '--token-accent-light', '--token-text-secondary'],
    dependencies: ['DSTag'],
    usedBy: ['AIOnboarding', 'MobileSearchAI', 'MobileSmartReply'],
  },
  {
    id: 'step-indicator',
    name: 'DSStepIndicator',
    description: 'Multi-step progress indicator with numbered circles, connecting lines, and status labels. Used in wizards and onboarding flows.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'steps', type: "{ label: string; status: 'done' | 'active' | 'pending' }[]", required: true, description: 'Step definitions with labels and statuses.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSStepIndicator } from '@zeros-aiui/components/molecules';

<DSStepIndicator steps={[
  { label: 'Select', status: 'done' },
  { label: 'Configure', status: 'active' },
  { label: 'Review', status: 'pending' },
]} />`,
    accessibility: `- Should use aria-current="step" for active step
- Step numbers provide sequential context
- Status conveyed by color and icon (check for done, number for active/pending)`,
    tokens: ['--token-step-done', '--token-step-active', '--token-step-pending', '--token-step-line', '--token-text-primary', '--token-text-tertiary'],
    dependencies: [],
    usedBy: ['AIOnboarding', 'ActionPlan'],
  },
  {
    id: 'toolbar',
    name: 'DSToolbar',
    description: 'Horizontal action bar with icon buttons. Used for message actions (copy, thumbs up, thumbs down, regenerate).',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'actions', type: "{ icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }[]", required: true, description: 'Array of toolbar actions.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSToolbar } from '@zeros-aiui/components/molecules';

<DSToolbar actions={[
  { icon: <Copy size={14} />, label: 'Copy' },
  { icon: <ThumbsUp size={14} />, label: 'Like' },
  { icon: <RotateCcw size={14} />, label: 'Regenerate' },
]} />`,
    accessibility: `- Should use role="toolbar" with aria-label
- Arrow key navigation between buttons
- Each button should have title/aria-label from the label prop`,
    tokens: ['--token-border', '--token-bg', '--token-text-secondary', '--token-text-primary', '--token-bg-hover', '--token-accent', '--token-radius-md'],
    dependencies: ['DSButton'],
    usedBy: ['FeedbackActions'],
  },
  {
    id: 'form-field',
    name: 'DSFormField',
    description: 'Labeled form field wrapper with label, required indicator, hint text, and error state. Wraps DSInput for consistent form layouts.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Field label text.' },
      { name: 'required', type: 'boolean', description: 'Shows red asterisk indicator.' },
      { name: 'hint', type: 'string', description: 'Help text below the input.' },
      { name: 'placeholder', type: 'string', description: 'Input placeholder.' },
      { name: 'value', type: 'string', description: 'Controlled input value.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Input change handler.' },
      { name: 'error', type: 'string', description: 'Error message (replaces hint, turns border red).' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSFormField } from '@zeros-aiui/components/molecules';

<DSFormField
  label="API Key"
  required
  hint="Find this in your dashboard"
  error={errors.apiKey}
/>`,
    accessibility: `- Label should be connected to input via htmlFor/id
- Hint text connected via aria-describedby
- Error text replaces hint and adds aria-invalid
- Required indicated visually (asterisk) and via aria-required`,
    tokens: ['--token-text-primary', '--token-text-tertiary', '--token-error', '--token-border', '--token-accent'],
    dependencies: ['DSInput'],
    usedBy: ['DynamicForm'],
  },
  {
    id: 'popover',
    name: 'DSPopover',
    description: 'Small floating content container with title, icon, and arbitrary content. Used for contextual information and inline details.',
    category: 'molecule',
    importPath: "@zeros-aiui/components/molecules",
    props: [
      { name: 'title', type: 'string', description: 'Popover title.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Leading icon.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Popover content.' },
      { name: 'style', type: 'React.CSSProperties', description: 'Style overrides.' },
    ],
    usage: `import { DSPopover } from '@zeros-aiui/components/molecules';

<DSPopover title="Token Info" icon={<Info size={14} />}>
  <p>This model supports up to 128k tokens.</p>
</DSPopover>`,
    accessibility: `- Should use role="dialog" or role="tooltip" based on context
- Trigger needs aria-haspopup and aria-expanded
- Escape to dismiss
- Focus management when opened`,
    tokens: ['--token-bg', '--token-border', '--token-shadow-lg', '--token-text-primary', '--token-radius-lg'],
    dependencies: [],
    usedBy: [],
  },
  /* ——— Missing molecule docs ——— */
  { id: 'message-bubble', name: 'DSMessageBubble', description: 'Chat message bubble with role-based styling, copy on hover, and timestamps.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'user'|'ai'", default: "'ai'", description: 'Sender role.' }, { name: 'children', type: 'React.ReactNode', required: true, description: 'Message content.' }, { name: 'timestamp', type: 'string', description: 'Time display.' }], usage: `<DSMessageBubble variant="user">Hello AI</DSMessageBubble>`, accessibility: '- Copy button has aria-label\n- Timestamps use <time> semantic', tokens: ['--token-accent', '--token-bg-secondary', '--token-border'], dependencies: ['DSAvatar'], usedBy: ['ChatMessage'] },
  { id: 'typing-indicator', name: 'DSTypingIndicator', description: 'AI thinking indicator with avatar and streaming dots.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'label', type: 'string', default: "'AI is thinking'", description: 'Status label.' }], usage: `<DSTypingIndicator />`, accessibility: '- role="status" with aria-live="polite"\n- aria-label matches label prop', tokens: ['--token-accent', '--token-bg-secondary', '--token-border'], dependencies: ['DSAvatar', 'DSStreamingDots'] },
  { id: 'token-counter', name: 'DSTokenCounter', description: 'Token usage display with progress bar and percentage badge.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'used', type: 'number', required: true, description: 'Tokens used.' }, { name: 'total', type: 'number', required: true, description: 'Token limit.' }, { name: 'label', type: 'string', default: "'Tokens'", description: 'Counter label.' }], usage: `<DSTokenCounter used={1200} total={4096} />`, accessibility: '- Progress bar has role="progressbar"\n- Badge communicates severity via color + text', tokens: ['--token-accent', '--token-success', '--token-warning', '--token-error'], dependencies: ['DSProgress', 'DSBadge'] },
  { id: 'prompt-card', name: 'DSPromptCard', description: 'Clickable prompt suggestion card with icon, title, and description.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', required: true, description: 'Prompt title.' }, { name: 'description', type: 'string', description: 'Description text.' }, { name: 'icon', type: 'React.ReactNode', description: 'Leading icon.' }, { name: 'onClick', type: '() => void', description: 'Click handler.' }], usage: `<DSPromptCard title="Explain code" description="Break down complex code" />`, accessibility: '- Clickable card with hover/focus states\n- Title serves as accessible name', tokens: ['--token-bg', '--token-bg-hover', '--token-border', '--token-accent'], dependencies: [] },
  { id: 'copy-block', name: 'DSCopyBlock', description: 'Code block with syntax label, copy button, and monospace formatting.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'code', type: 'string', required: true, description: 'Code content.' }, { name: 'language', type: 'string', default: "'typescript'", description: 'Language label.' }], usage: `<DSCopyBlock code="const x = 1;" language="typescript" />`, accessibility: '- Copy button announces "Copied" on success\n- Code block uses <pre><code> semantics', tokens: ['--token-bg-secondary', '--token-bg-tertiary', '--token-border'], dependencies: ['DSButton'] },
  { id: 'notification-banner', name: 'DSNotificationBanner', description: 'Dismissible status banner with variant-colored left border and icon.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'info'|'warning'|'error'|'success'", default: "'info'", description: 'Visual variant.' }, { name: 'title', type: 'string', required: true, description: 'Banner title.' }, { name: 'description', type: 'string', description: 'Detail text.' }, { name: 'onDismiss', type: '() => void', description: 'Dismiss callback.' }], usage: `<DSNotificationBanner variant="warning" title="Rate limit" description="Approaching limit" />`, accessibility: '- role="alert" with aria-live="assertive"\n- Dismiss button has aria-label\n- Icon is aria-hidden (redundant with color)', tokens: ['--token-accent', '--token-warning', '--token-error', '--token-success'], dependencies: ['DSButton'] },
  { id: 'filter-bar', name: 'DSFilterBar', description: 'Horizontally scrolling filter tags with search icon prefix.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'filters', type: 'string[]', required: true, description: 'Filter labels.' }, { name: 'active', type: 'Set<string>', description: 'Active filters.' }, { name: 'onToggle', type: '(filter: string) => void', description: 'Toggle callback.' }], usage: `<DSFilterBar filters={['All', 'Code', 'Text']} />`, accessibility: '- Tags have aria-selected\n- Search icon is decorative', tokens: ['--token-accent', '--token-border'], dependencies: ['DSTag'] },
  { id: 'slider-group', name: 'DSSliderGroup', description: 'Grouped parameter sliders for AI model configuration.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'params', type: 'DSSliderGroupParam[]', description: 'Slider parameters.' }, { name: 'onChange', type: '(label, value) => void', description: 'Change callback.' }], usage: `<DSSliderGroup />`, accessibility: '- Each slider has aria-label and aria-valuenow\n- Keyboard navigable via arrow keys', tokens: ['--token-accent', '--token-secondary'], dependencies: ['DSSlider'] },
  { id: 'toast', name: 'DSToast', description: 'Temporary notification toast with icon, title, and timestamp.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'icon', type: 'React.ReactNode', description: 'Status icon.' }, { name: 'title', type: 'string', required: true, description: 'Toast message.' }, { name: 'time', type: 'string', description: 'Timestamp.' }], usage: `<DSToast title="Message sent" time="Just now" />`, accessibility: '- role="alert" with aria-live\n- Auto-dismiss respects prefers-reduced-motion', tokens: ['--token-bg', '--token-border', '--token-shadow-md'], dependencies: [] },
  { id: 'card', name: 'DSCard', description: 'Bordered content card with optional icon, label, and value.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'icon', type: 'React.ReactNode', description: 'Card icon.' }, { name: 'label', type: 'string', description: 'Card label.' }, { name: 'value', type: 'string', description: 'Display value.' }], usage: `<DSCard label="Tokens" value="24.5k" />`, accessibility: '- Semantic container\n- Hover state for interactive cards', tokens: ['--token-bg', '--token-border', '--token-shadow-sm'], dependencies: [] },
  { id: 'alert', name: 'DSAlert', description: 'Alert banner with variant styling for warnings, errors, and info messages.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'warning'|'error'|'info'", description: 'Alert type.' }, { name: 'children', type: 'React.ReactNode', description: 'Alert content.' }], usage: `<DSAlert variant="warning">Rate limit approaching</DSAlert>`, accessibility: '- role="alert" with aria-live\n- Icon has aria-hidden', tokens: ['--token-warning', '--token-error', '--token-accent'], dependencies: [] },
  { id: 'avatar-group', name: 'DSAvatarGroup', description: 'Overlapping avatar stack showing multiple participants.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'count', type: 'number', default: '3', description: 'Number of avatars.' }], usage: `<DSAvatarGroup count={4} />`, accessibility: '- Group has aria-label with count\n- Individual avatars have role="img"', tokens: ['--token-accent', '--token-secondary', '--token-bg-tertiary'], dependencies: ['DSAvatar'] },
  { id: 'accordion', name: 'DSAccordion', description: 'Expandable content section built on DSCollapsible.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', required: true, description: 'Header title.' }, { name: 'children', type: 'React.ReactNode', required: true, description: 'Expandable content.' }, { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initially expanded.' }], usage: `<DSAccordion title="Details">Content</DSAccordion>`, accessibility: '- aria-expanded on trigger\n- aria-controls links to panel\n- Enter/Space toggles', tokens: ['--token-bg-secondary', '--token-border'], dependencies: ['DSCollapsible'] },
  { id: 'pagination', name: 'DSPagination', description: 'Page navigation with prev/next buttons and page indicators.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'page', type: 'number', description: 'Current page.' }, { name: 'total', type: 'number', description: 'Total pages.' }, { name: 'onChange', type: '(page: number) => void', description: 'Page change callback.' }], usage: `<DSPagination page={1} total={5} />`, accessibility: '- nav with aria-label="Pagination"\n- Current page: aria-current="page"\n- Disabled buttons when at bounds', tokens: ['--token-accent', '--token-border', '--token-text-secondary'], dependencies: ['DSButton'] },
  { id: 'context-menu', name: 'DSContextMenu', description: 'Right-click context menu with categorized actions and shortcuts.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'items', type: 'DSDropdownMenuItem[]', required: true, description: 'Menu items.' }], usage: `<DSContextMenu items={[{ label: 'Copy', shortcut: '⌘C' }]} />`, accessibility: '- role="menu" with role="menuitem" children\n- Arrow key navigation\n- Escape to close', tokens: ['--token-bg', '--token-border', '--token-shadow-lg'], dependencies: ['DSDropdownMenu'] },
  { id: 'nav-item', name: 'DSNavItem', description: 'Sidebar navigation item with icon, label, and optional badge count.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'icon', type: 'React.ReactNode', description: 'Nav icon.' }, { name: 'label', type: 'string', required: true, description: 'Nav label.' }, { name: 'badge', type: 'number', description: 'Badge count.' }, { name: 'active', type: 'boolean', description: 'Active state.' }], usage: `<DSNavItem icon={<MessageSquare />} label="Chat" badge={3} active />`, accessibility: '- aria-current="page" when active\n- Badge has role="status"', tokens: ['--token-accent', '--token-bg-hover', '--token-text-secondary'], dependencies: ['DSBadge'] },
  { id: 'file-drop-zone', name: 'DSFileDropZone', description: 'Drag-and-drop file upload area with visual feedback.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'onDrop', type: '(files: FileList) => void', description: 'Drop handler.' }, { name: 'accept', type: 'string', description: 'Accepted MIME types.' }], usage: `<DSFileDropZone onDrop={handleFiles} />`, accessibility: '- Labeled with "Drop files here" text\n- Keyboard accessible via button fallback\n- Drag state announced via aria-live', tokens: ['--token-accent', '--token-border', '--token-bg-secondary'], dependencies: ['DSButton'] },
  { id: 'bottom-sheet', name: 'DSBottomSheet', description: 'Mobile bottom sheet dialog with handle, title, and content area.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', description: 'Sheet title.' }, { name: 'children', type: 'React.ReactNode', required: true, description: 'Sheet content.' }, { name: 'open', type: 'boolean', default: 'true', description: 'Visibility.' }], usage: `<DSBottomSheet title="Options"><p>Content</p></DSBottomSheet>`, accessibility: '- role="dialog" with aria-modal="true"\n- aria-label from title prop\n- Escape to dismiss', tokens: ['--token-bg', '--token-border', '--token-shadow-xl'], dependencies: ['DSBottomSheetHandle'] },
  { id: 'action-sheet', name: 'DSActionSheet', description: 'Mobile action sheet with grouped action buttons and cancel.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', description: 'Sheet title.' }, { name: 'actions', type: 'DSActionSheetAction[]', required: true, description: 'Action items.' }], usage: `<DSActionSheet title="Actions" actions={[{ label: 'Copy' }]} />`, accessibility: '- role="dialog" with aria-modal="true"\n- Each action is role="button" with tabIndex\n- Destructive actions use color + text', tokens: ['--token-accent', '--token-error', '--token-bg', '--token-border'], dependencies: [] },
  { id: 'bottom-nav', name: 'DSBottomNav', description: 'Mobile bottom navigation bar with icon tabs and badge counts.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'items', type: 'DSBottomNavItem[]', description: 'Nav items.' }, { name: 'activeIndex', type: 'number', description: 'Active tab.' }, { name: 'onSelect', type: '(i: number) => void', description: 'Selection callback.' }], usage: `<DSBottomNav />`, accessibility: '- <nav> with aria-label="Bottom navigation"\n- Active item visually distinguished\n- Badge counts have aria-label', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-error'], dependencies: [] },
  { id: 'swipeable-row', name: 'DSSwipeableRow', description: 'Mobile list row with swipe-to-reveal actions.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', required: true, description: 'Row title.' }, { name: 'subtitle', type: 'string', description: 'Secondary text.' }, { name: 'meta', type: 'string', description: 'Timestamp.' }], usage: `<DSSwipeableRow title="AI Chat" subtitle="Last message 2m ago" />`, accessibility: '- Swipe has keyboard alternative\n- Hidden actions accessible via context menu', tokens: ['--token-bg', '--token-border', '--token-text-primary'], dependencies: ['DSSwipeAction'] },
  { id: 'fab', name: 'DSFab', description: 'Floating action button for primary mobile actions.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'icon', type: 'React.ReactNode', description: 'Button icon.' }, { name: 'label', type: 'string', description: 'Extended label.' }, { name: 'onClick', type: '() => void', description: 'Click handler.' }], usage: `<DSFab label="New Chat" />`, accessibility: '- <button> with aria-label\n- Accent shadow for prominence\n- Focus ring on keyboard navigation', tokens: ['--token-accent', '--token-accent-hover', '--token-accent-fg', '--token-shadow-lg'], dependencies: [] },
  { id: 'model-selector', name: 'DSModelSelector', description: 'AI model picker dropdown with specs and badges.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'models', type: 'DSModelSelectorModel[]', description: 'Available models.' }, { name: 'value', type: 'string', description: 'Selected model ID.' }, { name: 'onChange', type: '(id: string) => void', description: 'Selection callback.' }], usage: `<DSModelSelector />`, accessibility: '- role="combobox" with aria-expanded\n- Dropdown: role="listbox" with role="option"\n- aria-label="Select AI model"', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSAvatar', 'DSBadge'] },
  { id: 'chat-input', name: 'DSChatInput', description: 'Primary chat text input with send button, attach, and keyboard shortcuts.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'placeholder', type: 'string', default: "'Message AI...'", description: 'Placeholder text.' }, { name: 'onSend', type: '(text: string) => void', description: 'Send callback.' }], usage: `<DSChatInput onSend={handleSend} />`, accessibility: '- role="form" with aria-label\n- Textarea has aria-label\n- Enter to send, Shift+Enter for newline', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-accent-muted'], dependencies: ['DSButton'] },
  { id: 'message-bubble', name: 'DSMessageBubble', description: 'Chat message bubble with role-based styling. User messages align right with accent fill, AI messages align left with avatar and neutral fill.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'user' | 'ai' | 'system'", default: "'ai'", description: 'Message role determining alignment and color.' }, { name: 'children', type: 'React.ReactNode', required: true, description: 'Message content.' }, { name: 'avatar', type: 'React.ReactNode', description: 'Optional avatar element.' }], usage: `<DSMessageBubble variant="user">How does attention work?</DSMessageBubble>\n<DSMessageBubble variant="ai">Attention computes weighted relationships...</DSMessageBubble>`, accessibility: '- role="log" for chat container\n- Each message has role="article" with aria-label\n- Streaming uses aria-busy="true"', tokens: ['--token-user-bubble', '--token-user-bubble-text', '--token-bg-secondary', '--token-border', '--token-accent'], dependencies: ['DSAvatar'], usedBy: ['ChatMessage'] },
  { id: 'toast', name: 'DSToast', description: 'Transient notification with icon, message, timestamp, and dismiss action. Supports 5 semantic variants: default, success, error, warning, info.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'default' | 'success' | 'error' | 'warning' | 'info'", default: "'default'", description: 'Semantic variant controlling icon and border color.' }, { name: 'title', type: 'string', required: true, description: 'Toast message text.' }, { name: 'onDismiss', type: '() => void', description: 'Dismiss callback.' }], usage: `<DSToast variant="success" title="Copied to clipboard" />\n<DSToast variant="error" title="Failed to send" />`, accessibility: '- role="alert" with aria-live="assertive"\n- Dismiss button has aria-label="Dismiss"\n- Auto-dismiss respects prefers-reduced-motion', tokens: ['--token-success', '--token-error', '--token-warning', '--token-accent', '--token-bg', '--token-shadow-lg'], dependencies: ['DSButton'] },
  { id: 'card', name: 'DSCard', description: 'Generic container card with optional header, body, and hover/active states. Used for metrics, suggestions, and content grouping.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'children', type: 'React.ReactNode', required: true, description: 'Card content.' }, { name: 'onClick', type: '() => void', description: 'Click handler for interactive cards.' }, { name: 'active', type: 'boolean', default: 'false', description: 'Accent border when active.' }], usage: `<DSCard>\n  <span>Tokens Used</span>\n  <strong>24.5k</strong>\n</DSCard>`, accessibility: '- Interactive cards use role="button" with tabIndex\n- Non-interactive cards are <div>\n- Focus ring via box-shadow on keyboard navigation', tokens: ['--token-bg', '--token-border', '--token-bg-secondary', '--token-shadow-sm', '--token-radius-lg'], dependencies: ['DSBadge', 'DSDivider'] },
  { id: 'alert', name: 'DSAlert', description: 'Persistent informational banner with icon, title, and description. 4 semantic severity levels: info, warning, error, success.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'info' | 'warning' | 'error' | 'success'", default: "'info'", description: 'Severity level.' }, { name: 'title', type: 'string', required: true, description: 'Alert title.' }, { name: 'children', type: 'React.ReactNode', description: 'Alert description.' }], usage: `<DSAlert variant="warning" title="Rate limit approaching">\n  85% of your API quota has been used.\n</DSAlert>`, accessibility: '- role="alert" for error/warning\n- role="status" for info/success\n- Icon has aria-hidden="true"', tokens: ['--token-info-light', '--token-warning-light', '--token-error-light', '--token-success-light', '--token-accent', '--token-warning', '--token-error', '--token-success'], dependencies: [] },
  { id: 'avatar-group', name: 'DSAvatarGroup', description: 'Stacked overlapping avatars showing multiple participants with overflow counter.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'avatars', type: 'DSAvatarProps[]', required: true, description: 'Array of avatar configs.' }, { name: 'max', type: 'number', default: '4', description: 'Max visible avatars before +N overflow.' }], usage: `<DSAvatarGroup avatars={[{ variant: 'ai' }, { variant: 'user' }]} />`, accessibility: '- group role with aria-label\n- Overflow counter has sr-only "and N more"', tokens: ['--token-accent', '--token-secondary', '--token-bg', '--token-bg-tertiary'], dependencies: ['DSAvatar'] },
  { id: 'accordion', name: 'DSAccordion', description: 'Collapsible content sections with headers and chevron indicators. Single or multiple sections can be open.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'items', type: 'DSAccordionItem[]', required: true, description: 'Accordion items with title and content.' }, { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple open sections.' }], usage: `<DSAccordion items={[\n  { title: 'Parse input', content: 'Tokenize and validate...' },\n  { title: 'Generate output', content: 'Run inference...' }\n]} />`, accessibility: '- Headers are <button> with aria-expanded\n- Content has role="region" with aria-labelledby\n- Enter/Space toggles, arrow keys navigate', tokens: ['--token-bg', '--token-border', '--token-text-primary', '--token-text-disabled'], dependencies: ['DSDivider'] },
  { id: 'pagination', name: 'DSPagination', description: 'Page navigation with numbered buttons, prev/next arrows, and ellipsis for large page counts.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'total', type: 'number', required: true, description: 'Total page count.' }, { name: 'current', type: 'number', default: '1', description: 'Current page.' }, { name: 'onPageChange', type: '(page: number) => void', description: 'Page change callback.' }], usage: `<DSPagination total={8} current={1} onPageChange={setPage} />`, accessibility: '- <nav> with aria-label="Pagination"\n- Current page: aria-current="page"\n- Disabled prev/next: aria-disabled="true"', tokens: ['--token-accent', '--token-accent-fg', '--token-border', '--token-bg-hover'], dependencies: ['DSButton'] },
  { id: 'context-menu', name: 'DSContextMenu', description: 'Right-click floating menu with icons, keyboard shortcuts, dividers, and danger items.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'items', type: 'DSContextMenuItem[]', required: true, description: 'Menu items.' }, { name: 'position', type: '{ x: number; y: number }', description: 'Menu position.' }], usage: `<DSContextMenu items={[\n  { label: 'Copy', icon: <Copy />, keys: '⌘C' },\n  { label: 'Delete', icon: <Trash2 />, danger: true }\n]} />`, accessibility: '- role="menu" with aria-label\n- Items: role="menuitem"\n- Arrow keys navigate, Enter activates\n- Escape closes', tokens: ['--token-bg', '--token-border', '--token-shadow-lg', '--token-error'], dependencies: ['DSKbd', 'DSDivider'] },
  { id: 'typing-indicator', name: 'DSTypingIndicator', description: 'AI typing/thinking indicator with animated dots and optional status label.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'label', type: 'string', default: "'AI is thinking...'", description: 'Status text.' }], usage: `<DSTypingIndicator />\n<DSTypingIndicator label="Generating code" />`, accessibility: '- role="status" with aria-live="polite"\n- Label is readable by screen readers\n- Animation respects prefers-reduced-motion', tokens: ['--token-accent', '--token-bg-secondary', '--token-text-tertiary'], dependencies: ['DSStreamingDots'] },
  { id: 'token-counter', name: 'DSTokenCounter', description: 'Token usage display with colored progress bar and used/total count.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'used', type: 'number', required: true, description: 'Tokens used.' }, { name: 'total', type: 'number', required: true, description: 'Total available tokens.' }], usage: `<DSTokenCounter used={2400} total={4096} />`, accessibility: '- role="meter" with aria-valuenow, aria-valuemin, aria-valuemax\n- Color shift announced via aria-label', tokens: ['--token-accent', '--token-warning', '--token-error', '--token-bg-tertiary'], dependencies: ['DSProgress'] },
  { id: 'prompt-card', name: 'DSPromptCard', description: 'Suggestion card with title, description, and hover interaction for welcome screens.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'title', type: 'string', required: true, description: 'Prompt title.' }, { name: 'description', type: 'string', description: 'Prompt description.' }, { name: 'onClick', type: '() => void', description: 'Click handler.' }], usage: `<DSPromptCard title="Explain code" description="Break down complex code" />`, accessibility: '- role="button" with tabIndex\n- Enter/Space to activate\n- Focus ring via box-shadow', tokens: ['--token-bg-secondary', '--token-bg-hover', '--token-border', '--token-text-primary'], dependencies: [] },
  { id: 'copy-block', name: 'DSCopyBlock', description: 'Code block with syntax highlighting and copy-to-clipboard button.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'code', type: 'string', required: true, description: 'Code content.' }, { name: 'language', type: 'string', default: "'typescript'", description: 'Language for display label.' }], usage: `<DSCopyBlock code={'const x = 42;'} language="typescript" />`, accessibility: '- <pre><code> with lang attribute\n- Copy button has aria-label="Copy code"\n- Success state announced via aria-live', tokens: ['--token-bg-code', '--token-code-text', '--token-border-subtle', '--token-accent'], dependencies: ['DSButton'] },
  { id: 'notification-banner', name: 'DSNotificationBanner', description: 'Dismissible banner for announcements. 4 semantic variants: info, warning, error, success.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'variant', type: "'info' | 'warning' | 'error' | 'success'", default: "'info'", description: 'Banner variant.' }, { name: 'title', type: 'string', required: true, description: 'Banner title.' }, { name: 'description', type: 'string', description: 'Banner description.' }], usage: `<DSNotificationBanner variant="info" title="New feature" description="Try streaming mode" />`, accessibility: '- role="alert" for errors\n- Dismiss button accessible\n- aria-live for dynamic updates', tokens: ['--token-accent', '--token-warning', '--token-error', '--token-success', '--token-bg-secondary'], dependencies: ['DSButton'] },
  { id: 'filter-bar', name: 'DSFilterBar', description: 'Horizontal scrollable filter chips with active selection state.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'filters', type: 'string[]', required: true, description: 'Filter labels.' }, { name: 'active', type: 'number', default: '0', description: 'Active filter index.' }, { name: 'onSelect', type: '(i: number) => void', description: 'Selection callback.' }], usage: `<DSFilterBar filters={['All', 'Code', 'Text', 'Images']} />`, accessibility: '- role="tablist" with aria-label\n- Each chip: role="tab" with aria-selected\n- Arrow keys navigate, Enter selects', tokens: ['--token-accent-light', '--token-accent', '--token-text-tertiary', '--token-border'], dependencies: ['DSTag'] },
  { id: 'slider-group', name: 'DSSliderGroup', description: 'Labeled group of parameter sliders for AI model configuration.', category: 'molecule', importPath: "@zeros-aiui/components/molecules", props: [{ name: 'params', type: 'DSSliderGroupParam[]', description: 'Slider parameter configs.' }], usage: `<DSSliderGroup />`, accessibility: '- Each slider has aria-label from parameter name\n- Value changes announced via aria-valuenow\n- Keyboard: arrow keys adjust value', tokens: ['--token-accent', '--token-secondary', '--token-text-secondary', '--token-bg-tertiary'], dependencies: ['DSSlider'] },
];

/* ——————————————————————————————————————————————————
   AI COMPONENT DOCUMENTATION
   (Key components - expand as needed)
   —————————————————————————————————————————————————— */

const aiComponentDocs: ComponentDoc[] = [
  {
    id: 'chat-message',
    name: 'ChatMessage',
    description: 'Conversational message bubble with role-based styling (user/assistant/system). Supports markdown content, avatars, timestamps, and embedded feedback actions.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'role', type: "'user' | 'assistant' | 'system'", required: true, description: 'Message sender role. Controls bubble color, alignment, and avatar.' },
      { name: 'content', type: 'string', required: true, description: 'Message text content.' },
      { name: 'timestamp', type: 'string', description: 'Time string displayed below message.' },
      { name: 'isStreaming', type: 'boolean', description: 'Shows typing indicator animation.' },
      { name: 'feedbackState', type: "'none' | 'liked' | 'disliked'", description: 'Feedback action state for assistant messages.' },
    ],
    usage: `import { ChatMessage } from '@zeros-aiui/components/ai';

<ChatMessage role="user" content="Explain transformers" />
<ChatMessage
  role="assistant"
  content="Transformers are a neural network architecture..."
  timestamp="2:34 PM"
/>`,
    accessibility: `- Message container should use role="log" or aria-live="polite"
- Avatar uses role="img" with aria-label
- Feedback buttons (like/dislike) need aria-pressed state
- Streaming state should announce "AI is responding" to screen readers`,
    tokens: ['--token-user-bubble', '--token-user-bubble-text', '--token-ai-bubble', '--token-ai-bubble-text', '--token-ai-avatar-bg', '--token-ai-avatar-fg', '--token-text-tertiary'],
    dependencies: ['DSAvatar', 'DSBadge', 'DSDivider'],
    usedBy: [],
  },
  {
    id: 'chat-input',
    name: 'ChatInput',
    description: 'Multi-feature message composer with text input, send button, attachment button, and optional toolbar for formatting/mode switching.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'onSend', type: '(message: string) => void', description: 'Called with message text on send.' },
      { name: 'placeholder', type: 'string', description: 'Input placeholder text.' },
      { name: 'disabled', type: 'boolean', description: 'Disables input and send.' },
      { name: 'showAttach', type: 'boolean', description: 'Shows attachment button.' },
    ],
    usage: `import { ChatInput } from '@zeros-aiui/components/ai';

<ChatInput
  onSend={handleSend}
  placeholder="Ask anything..."
/>`,
    accessibility: `- Input needs aria-label="Message input"
- Send button needs aria-label="Send message"
- Keyboard: Enter to send, Shift+Enter for new line
- Disabled state conveys via aria-disabled`,
    tokens: ['--token-border', '--token-bg', '--token-accent', '--token-text-primary', '--token-text-secondary'],
    dependencies: ['DSButton'],
    usedBy: [],
  },
  {
    id: 'code-block',
    name: 'CodeBlock',
    description: 'Syntax-highlighted code display with filename header, copy button, line wrapping toggle, and language badge. Used for AI-generated code responses.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'code', type: 'string', required: true, description: 'Code content string.' },
      { name: 'language', type: 'string', description: 'Programming language label.' },
      { name: 'filename', type: 'string', description: 'Filename displayed in header.' },
      { name: 'showLineNumbers', type: 'boolean', description: 'Show line numbers.' },
    ],
    usage: `import { CodeBlock } from '@zeros-aiui/components/ai';

<CodeBlock
  code="const x = 42;"
  language="typescript"
  filename="example.ts"
/>`,
    accessibility: `- Should use role="region" with aria-label="Code block: {filename}"
- Copy button should announce success to screen readers
- Code content should be selectable and navigable
- Consider aria-roledescription="code block"`,
    tokens: ['--token-code-bg', '--token-code-header', '--token-code-text', '--token-code-keyword', '--token-code-string', '--token-code-comment', '--token-code-function', '--token-code-number', '--token-border'],
    dependencies: ['DSButton', 'DSBadge'],
    usedBy: [],
  },
  {
    id: 'model-selector',
    name: 'ModelSelector',
    description: 'AI model picker dropdown with model name, description, capability badges, and performance indicators. Supports multi-model comparison.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'models', type: '{ id: string; name: string; description: string; badge?: string }[]', description: 'Available models.' },
      { name: 'selected', type: 'string', description: 'Selected model ID.' },
      { name: 'onSelect', type: '(id: string) => void', description: 'Called with selected model ID.' },
    ],
    usage: `import { ModelSelector } from '@zeros-aiui/components/ai';

<ModelSelector
  models={[
    { id: 'gpt4', name: 'GPT-4', description: 'Most capable', badge: 'Pro' },
    { id: 'gpt35', name: 'GPT-3.5', description: 'Fast and efficient' },
  ]}
  selected="gpt4"
  onSelect={setModel}
/>`,
    accessibility: `- Uses DSSelect pattern; needs same ARIA attributes
- Model descriptions should be accessible via aria-describedby
- Badge text should be part of accessible name`,
    tokens: ['--token-border', '--token-bg', '--token-accent', '--token-text-primary', '--token-text-secondary'],
    dependencies: ['DSBadge'],
    usedBy: [],
  },
  {
    id: 'list-panel',
    name: 'ListPanel',
    description: 'Shared list panel component used by ChatHistory, KnowledgeBase, MemoryManager, PromptTemplates, and ThreadManager. Provides search, header, scrollable list, and empty state.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'title', type: 'string', required: true, description: 'Panel header title.' },
      { name: 'items', type: 'ListPanelItem[]', required: true, description: 'Array of list items.' },
      { name: 'searchPlaceholder', type: 'string', description: 'Search input placeholder.' },
      { name: 'activeId', type: 'string', description: 'Active/selected item ID.' },
      { name: 'onSelect', type: '(id: string) => void', description: 'Item selection handler.' },
      { name: 'onNew', type: '() => void', description: 'New item button handler.' },
      { name: 'emptyText', type: 'string', default: "'No items found'", description: 'Message when list is empty or filtered to zero.' },
      { name: 'maxHeight', type: 'number', default: '260', description: 'Maximum scrollable height.' },
    ],
    usage: `import { ListPanel, type ListPanelItem } from '@zeros-aiui/components/ai';

const items: ListPanelItem[] = [
  { id: '1', title: 'Item One', subtitle: 'Description' },
];

<ListPanel title="Items" items={items} onSelect={setActive} />`,
    accessibility: `- Search input needs aria-label
- Item list should use role="listbox"
- Items should use role="option" with aria-selected
- Keyboard Arrow Up/Down to navigate items
- Empty state uses role="status"`,
    tokens: ['--token-bg', '--token-border', '--token-text-primary', '--token-text-secondary', '--token-text-disabled', '--token-accent-light'],
    dependencies: ['DSButton', 'DSBadge', 'DSDot', 'DSDivider', 'DSSearchBar', 'DSHeaderBar', 'DSListItem'],
    usedBy: ['ChatHistory', 'KnowledgeBase', 'MemoryManager', 'PromptTemplates', 'ThreadManager'],
  },
  {
    id: 'notification-center',
    name: 'NotificationCenter',
    description: 'Full-featured notification panel with typed notifications (success, warning, error, info), dismiss/action buttons, clear all, and empty state.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'notifications', type: 'Notification[]', description: 'Array of notification objects. Empty array triggers empty state.' },
      { name: 'onDismiss', type: '(id: string) => void', description: 'Individual dismiss handler.' },
      { name: 'onAction', type: '(id: string) => void', description: 'Action button handler per notification.' },
      { name: 'onClearAll', type: '() => void', description: 'Clear all notifications handler.' },
    ],
    usage: `import { NotificationCenter } from '@zeros-aiui/components/ai';

<NotificationCenter notifications={[
  { id: '1', type: 'success', title: 'Task Complete', body: 'Report generated', time: '2m' },
]} />`,
    accessibility: `- Container should use role="log" with aria-live="polite"
- New notifications should be announced to screen readers
- Dismiss buttons need aria-label="Dismiss notification"
- Clear All should confirm before bulk action`,
    tokens: ['--token-bg', '--token-bg-secondary', '--token-border', '--token-text-primary', '--token-text-secondary', '--token-text-disabled', '--token-success', '--token-warning', '--token-error', '--token-info'],
    dependencies: ['DSBadge', 'DSButton'],
    usedBy: [],
  },
  {
    id: 'reasoning-trace',
    name: 'ReasoningTrace',
    description: 'Step-by-step reasoning visualization showing AI thought process. Animated brain icon, expandable thinking steps, and timing display.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'steps', type: '{ id: string; label: string; detail: string; duration?: string }[]', description: 'Reasoning steps array.' },
      { name: 'isThinking', type: 'boolean', description: 'Animates brain icon and shows active state.' },
      { name: 'totalTime', type: 'string', description: 'Total reasoning duration display.' },
    ],
    usage: `import { ReasoningTrace } from '@zeros-aiui/components/ai';

<ReasoningTrace
  steps={[
    { id: '1', label: 'Analyzing query', detail: 'Identifying key concepts...', duration: '0.8s' },
    { id: '2', label: 'Searching knowledge', detail: 'Found 3 relevant sources', duration: '1.2s' },
  ]}
  totalTime="2.0s"
/>`,
    accessibility: `- Steps should use ordered list semantics
- Active step should have aria-current
- Brain icon animation respects prefers-reduced-motion
- Expand/collapse uses aria-expanded`,
    tokens: ['--token-accent', '--token-text-primary', '--token-text-secondary', '--token-text-tertiary', '--token-border', '--token-bg-secondary'],
    dependencies: ['DSCollapsible', 'DSBadge'],
    usedBy: [],
  },
  {
    id: 'confidence-score',
    name: 'ConfidenceScore',
    description: 'Visual confidence indicator with percentage, colored ring, and textual assessment. Three tiers: high (green), medium (amber), low (red).',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'score', type: 'number', required: true, description: 'Confidence percentage (0-100).' },
      { name: 'label', type: 'string', description: 'Custom label override.' },
      { name: 'showDetails', type: 'boolean', description: 'Show breakdown details.' },
    ],
    usage: `import { ConfidenceScore } from '@zeros-aiui/components/ai';

<ConfidenceScore score={87} />
<ConfidenceScore score={45} showDetails />`,
    accessibility: `- Score should be announced: "Confidence: 87% - High"
- Color coding needs text label redundancy (already has "High"/"Medium"/"Low")
- Progress ring is decorative (info conveyed by percentage text)`,
    tokens: ['--token-confidence-high', '--token-confidence-medium', '--token-confidence-low', '--token-text-primary', '--token-text-secondary'],
    dependencies: ['DSBadge'],
    usedBy: [],
  },
  {
    id: 'tool-call',
    name: 'ToolCall',
    description: 'Visualization of an AI tool/function call with name, parameters, execution status, and result. Shows the agent-tool interaction pattern.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'name', type: 'string', required: true, description: 'Tool/function name.' },
      { name: 'params', type: 'Record<string, unknown>', description: 'Call parameters.' },
      { name: 'status', type: "'pending' | 'running' | 'success' | 'error'", description: 'Execution status.' },
      { name: 'result', type: 'string', description: 'Result text.' },
    ],
    usage: `import { ToolCall } from '@zeros-aiui/components/ai';

<ToolCall
  name="search_web"
  params={{ query: 'React performance' }}
  status="success"
  result="Found 5 results"
/>`,
    accessibility: `- Status conveyed by icon + text label
- Parameters displayed as code (accessible via <code>)
- Status changes should announce to screen readers`,
    tokens: ['--token-bg-secondary', '--token-border', '--token-accent', '--token-success', '--token-error', '--token-text-primary'],
    dependencies: ['DSBadge', 'DSSpinner'],
    usedBy: [],
  },
  {
    id: 'canvas-workspace',
    name: 'CanvasWorkspace',
    description: 'Full-featured whiteboard/canvas workspace with toolbar, zoom controls, pan, and node placement. Largest component in the system (413 lines).',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'tools', type: 'string[]', description: 'Available tool names for toolbar.' },
      { name: 'onToolChange', type: '(tool: string) => void', description: 'Tool selection handler.' },
    ],
    usage: `import { CanvasWorkspace } from '@zeros-aiui/components/ai';

<CanvasWorkspace />`,
    accessibility: `- Canvas content is inherently inaccessible to screen readers
- Provide alternative text representation of canvas content
- Toolbar buttons need aria-label and keyboard navigation
- Zoom controls need aria-label and keyboard shortcuts`,
    tokens: ['--token-bg', '--token-bg-secondary', '--token-border', '--token-accent', '--token-text-primary'],
    dependencies: ['DSButton'],
    usedBy: [],
  },
  {
    id: 'welcome-screen',
    name: 'WelcomeScreen',
    description: 'Initial AI chat interface with greeting, suggested prompts, and capability cards. Entry point for new conversations.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'title', type: 'string', description: 'Welcome heading.' },
      { name: 'subtitle', type: 'string', description: 'Description text.' },
      { name: 'suggestions', type: '{ icon: React.ReactNode; text: string }[]', description: 'Prompt suggestion cards.' },
      { name: 'onSelect', type: '(text: string) => void', description: 'Suggestion click handler.' },
    ],
    usage: `import { WelcomeScreen } from '@zeros-aiui/components/ai';

<WelcomeScreen
  title="How can I help?"
  suggestions={[
    { icon: <Code size={16} />, text: 'Write a function' },
  ]}
  onSelect={handlePrompt}
/>`,
    accessibility: `- Heading hierarchy should match page structure
- Suggestion cards should be keyboard navigable
- Consider role="complementary" for the suggestions area`,
    tokens: ['--token-bg', '--token-text-primary', '--token-text-secondary', '--token-accent', '--token-border'],
    dependencies: [],
    usedBy: [],
  },
  {
    id: 'mcp-connector',
    name: 'MCPConnector',
    description: 'Model Context Protocol tool connector panel. Shows available MCP tools with connection status, toggle switches, and tool counts.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'tools', type: 'MCPTool[]', description: 'Array of MCP tool definitions.' },
      { name: 'onToggle', type: '(id: string) => void', description: 'Tool enable/disable handler.' },
    ],
    usage: `import { MCPConnector } from '@zeros-aiui/components/ai';

<MCPConnector tools={[
  { id: '1', name: 'GitHub', status: 'connected', toolCount: 12 },
  { id: '2', name: 'Slack', status: 'disconnected' },
]} />`,
    accessibility: `- Each tool row is a toggle switch with label
- Connection status conveyed by dot color + text
- Toggle switches use DSToggle (role="switch", aria-checked)`,
    tokens: ['--token-bg', '--token-bg-secondary', '--token-border', '--token-success', '--token-error', '--token-text-primary', '--token-text-tertiary', '--token-text-disabled'],
    dependencies: ['DSToggle', 'DSBadge', 'DSDot'],
    usedBy: [],
  },
  {
    id: 'prompt-templates',
    name: 'PromptTemplates',
    description: 'Template browser with list view and detail form view. Supports template slot filling, preview, and breadcrumb navigation.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'templates', type: 'Template[]', description: 'Available prompt templates.' },
      { name: 'onUse', type: '(filled: string) => void', description: 'Called with filled template text.' },
    ],
    usage: `import { PromptTemplates } from '@zeros-aiui/components/ai';

<PromptTemplates templates={[
  { id: '1', name: 'Code Review', template: 'Review this {{language}} code...',
    slots: [{ key: 'language', label: 'Language' }] },
]} />`,
    accessibility: `- Template list uses ListPanel accessibility (role="listbox")
- Form view fields need proper label association
- Breadcrumb navigation for back to list`,
    tokens: ['--token-bg', '--token-border', '--token-accent', '--token-text-primary'],
    dependencies: ['ListPanel', 'DSButton', 'DSBadge', 'DSBreadcrumb'],
    usedBy: [],
  },
  {
    id: 'thinking-indicator',
    name: 'ThinkingIndicator',
    description: 'AI processing state indicator with animated dots and optional status text. Lightweight alternative to full ReasoningTrace.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'text', type: 'string', description: 'Status text (e.g., "Analyzing...").' },
      { name: 'variant', type: "'dots' | 'pulse' | 'text'", description: 'Animation variant.' },
    ],
    usage: `import { ThinkingIndicator } from '@zeros-aiui/components/ai';

<ThinkingIndicator text="Generating response..." />`,
    accessibility: `- Should use role="status" with aria-live="polite"
- Text provides accessible description of current state
- Animation respects prefers-reduced-motion`,
    tokens: ['--token-accent', '--token-text-tertiary'],
    dependencies: ['DSStreamingDots'],
    usedBy: [],
  },
  {
    id: 'feedback-actions',
    name: 'FeedbackActions',
    description: 'Response quality feedback toolbar with copy, like, dislike, and regenerate actions. Tracks active state per action.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'onCopy', type: '() => void', description: 'Copy action handler.' },
      { name: 'onLike', type: '() => void', description: 'Like action handler.' },
      { name: 'onDislike', type: '() => void', description: 'Dislike action handler.' },
      { name: 'onRegenerate', type: '() => void', description: 'Regenerate action handler.' },
    ],
    usage: `import { FeedbackActions } from '@zeros-aiui/components/ai';

<FeedbackActions
  onCopy={() => copyToClipboard(text)}
  onLike={() => submitFeedback('positive')}
/>`,
    accessibility: `- Uses DSToolbar with role="toolbar"
- Each action needs aria-label
- Like/dislike should use aria-pressed for toggle state
- Copy should announce "Copied to clipboard" to screen readers`,
    tokens: ['--token-text-secondary', '--token-text-primary', '--token-accent', '--token-success', '--token-border'],
    dependencies: ['DSButton', 'DSToolbar'],
    usedBy: ['ChatMessage'],
  },
  {
    id: 'action-plan',
    name: 'ActionPlan',
    description: 'Multi-step task execution plan with progress tracking, step status indicators, and overall completion percentage.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'steps', type: 'Step[]', description: 'Array of plan steps with status.' },
      { name: 'title', type: 'string', description: 'Plan title.' },
      { name: 'progress', type: 'number', description: 'Overall completion percentage.' },
    ],
    usage: `import { ActionPlan } from '@zeros-aiui/components/ai';

<ActionPlan
  title="Deploy Application"
  steps={[
    { id: '1', label: 'Build', status: 'complete' },
    { id: '2', label: 'Test', status: 'running' },
    { id: '3', label: 'Deploy', status: 'pending' },
  ]}
  progress={66}
/>`,
    accessibility: `- Steps should use ordered list semantics
- Active step uses aria-current
- Progress bar needs role="progressbar"
- Step status icons need alt text`,
    tokens: ['--token-accent', '--token-success', '--token-text-primary', '--token-text-secondary', '--token-border', '--token-bg-secondary'],
    dependencies: ['DSButton', 'DSProgress', 'DSBadge'],
    usedBy: [],
  },
  {
    id: 'agent-card',
    name: 'AgentCard',
    description: 'AI agent identity card with name, role, capabilities, status indicator, and action button. Used in multi-agent systems.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'name', type: 'string', required: true, description: 'Agent name.' },
      { name: 'role', type: 'string', required: true, description: 'Agent role description.' },
      { name: 'status', type: "'active' | 'idle' | 'error'", description: 'Agent operational status.' },
      { name: 'capabilities', type: 'string[]', description: 'List of capability tags.' },
    ],
    usage: `import { AgentCard } from '@zeros-aiui/components/ai';

<AgentCard
  name="Code Assistant"
  role="Software Engineer Agent"
  status="active"
  capabilities={['TypeScript', 'React', 'Testing']}
/>`,
    accessibility: `- Card should use role="article" or semantic heading
- Status dot needs text alternative
- Capabilities use DSTag (keyboard accessible when interactive)`,
    tokens: ['--token-bg', '--token-border', '--token-accent', '--token-text-primary', '--token-text-secondary', '--token-success', '--token-error'],
    dependencies: ['DSBadge', 'DSButton', 'DSDot'],
    usedBy: [],
  },
  {
    id: 'source-citation',
    name: 'SourceCitation',
    description: 'Inline citation reference with source number, title, URL, and hover preview. Used in RAG-powered AI responses.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'number', type: 'number', required: true, description: 'Citation number.' },
      { name: 'title', type: 'string', required: true, description: 'Source title.' },
      { name: 'url', type: 'string', description: 'Source URL.' },
      { name: 'snippet', type: 'string', description: 'Preview snippet text.' },
    ],
    usage: `import { SourceCitation } from '@zeros-aiui/components/ai';

<SourceCitation
  number={1}
  title="React Documentation"
  url="https://react.dev"
/>`,
    accessibility: `- Citation number should be part of accessible link text
- External links should indicate "opens in new tab"
- Hover preview should be accessible via focus as well`,
    tokens: ['--token-accent', '--token-accent-light', '--token-text-secondary', '--token-border'],
    dependencies: [],
    usedBy: ['ChatMessage'],
  },
  {
    id: 'token-usage',
    name: 'TokenUsage',
    description: 'Token consumption display with color-coded segments (prompt, completion, system), percentage bar, and cost estimate.',
    category: 'component',
    importPath: "@zeros-aiui/components/ai",
    props: [
      { name: 'prompt', type: 'number', required: true, description: 'Prompt token count.' },
      { name: 'completion', type: 'number', required: true, description: 'Completion token count.' },
      { name: 'total', type: 'number', required: true, description: 'Maximum token limit.' },
      { name: 'cost', type: 'string', description: 'Estimated cost string.' },
    ],
    usage: `import { TokenUsage } from '@zeros-aiui/components/ai';

<TokenUsage prompt={1200} completion={800} total={4096} cost="$0.03" />`,
    accessibility: `- Uses DSColorBar with aria-label describing segments
- Percentage and cost are plain text (accessible by default)
- Color coding has text label redundancy`,
    tokens: ['--token-accent', '--token-secondary', '--token-tertiary', '--token-bg-tertiary', '--token-text-primary', '--token-text-secondary'],
    dependencies: ['DSColorBar', 'DSLegendItem'],
    usedBy: [],
  },
  /* ——— Remaining AI Component Docs ——— */
  { id: 'chat-history', name: 'ChatHistory', description: 'Browsable list of past conversations with search, timestamps, and previews.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'conversations', type: 'Conversation[]', required: true, description: 'Conversation list.' }, { name: 'onSelect', type: '(id: string) => void', description: 'Selection callback.' }], usage: `<ChatHistory conversations={chats} onSelect={openChat} />`, accessibility: '- Search input with aria-label\n- List items with role="option"\n- Active item highlighted with aria-current', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar', 'DSEmptyState'] },
  { id: 'knowledge-base', name: 'KnowledgeBase', description: 'Document browser and search for uploaded data sources.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'documents', type: 'Document[]', required: true, description: 'Document list.' }, { name: 'onSelect', type: '(id: string) => void', description: 'Selection callback.' }], usage: `<KnowledgeBase documents={docs} />`, accessibility: '- Search with role="search"\n- Documents as selectable list items', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar'] },
  { id: 'memory-manager', name: 'MemoryManager', description: 'View and manage persisted context memories for AI conversations.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'memories', type: 'Memory[]', description: 'Memory entries.' }, { name: 'onDelete', type: '(id: string) => void', description: 'Delete callback.' }], usage: `<MemoryManager memories={mems} onDelete={handleDelete} />`, accessibility: '- List with delete actions\n- Delete confirms via dialog or aria-live', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar', 'DSEmptyState'] },
  { id: 'markdown-response', name: 'MarkdownResponse', description: 'Rich-text AI response with rendered headings, lists, code blocks, and inline formatting.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'content', type: 'string', required: true, description: 'Markdown string.' }, { name: 'streaming', type: 'boolean', default: 'false', description: 'Show streaming cursor.' }], usage: `<MarkdownResponse content="## Hello\\n- Item 1" />`, accessibility: '- Semantic HTML headings preserved\n- Code blocks have language labels\n- Links are focusable', tokens: ['--token-text-primary', '--token-accent', '--token-bg-secondary'], dependencies: ['DSMessageBubble', 'DSToolbar'] },
  { id: 'system-message', name: 'SystemMessage', description: 'System-level instruction or configuration message with distinct styling.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'content', type: 'string', required: true, description: 'System message text.' }], usage: `<SystemMessage content="You are a helpful assistant." />`, accessibility: '- role="note" for system context\n- Visually distinct from user/AI messages', tokens: ['--token-bg-tertiary', '--token-text-secondary', '--token-border'], dependencies: ['DSMessageBubble', 'DSNotificationBanner'] },
  { id: 'ai-disclosure', name: 'AIDisclosure', description: 'Transparency notice indicating content is AI-generated.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'model', type: 'string', description: 'Model name.' }], usage: `<AIDisclosure model="GPT-4o" />`, accessibility: '- role="note"\n- Clear text stating AI generation', tokens: ['--token-accent', '--token-bg-secondary'], dependencies: ['DSBadge', 'DSButton'] },
  { id: 'multi-modal-input', name: 'MultiModalInput', description: 'Text input with file, image, and voice attachment buttons.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'onSend', type: '(data: InputData) => void', description: 'Submit callback.' }, { name: 'attachments', type: 'Attachment[]', description: 'Current attachments.' }], usage: `<MultiModalInput onSend={handleSubmit} />`, accessibility: '- Each attach button has aria-label\n- File list announced via aria-live\n- Keyboard: Tab between controls', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSButton', 'DSChipGroup', 'DSToolbar'] },
  { id: 'follow-up-bar', name: 'FollowUpBar', description: 'Contextual follow-up input bar anchored below AI responses.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'suggestions', type: 'string[]', description: 'Follow-up suggestions.' }, { name: 'onSubmit', type: '(text: string) => void', description: 'Submit handler.' }], usage: `<FollowUpBar suggestions={['Tell me more', 'Show code']} />`, accessibility: '- Suggestions as clickable chips with aria-label\n- Input with placeholder description', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSInput', 'DSButton', 'DSChipGroup'] },
  { id: 'prompt-enhancer', name: 'PromptEnhancer', description: 'Input with AI-powered prompt improvement suggestions shown inline.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'value', type: 'string', description: 'Current prompt.' }, { name: 'onEnhance', type: '(enhanced: string) => void', description: 'Enhancement callback.' }], usage: `<PromptEnhancer value="make better" onEnhance={setPrompt} />`, accessibility: '- Suggestions announced via aria-live\n- Accept/reject with keyboard', tokens: ['--token-accent', '--token-bg-secondary'], dependencies: ['DSInput', 'DSButton', 'DSBadge'] },
  { id: 'prompt-suggestions', name: 'PromptSuggestions', description: 'Grid of contextual follow-up prompt chips.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'prompts', type: 'string[]', required: true, description: 'Suggestion text.' }, { name: 'onSelect', type: '(prompt: string) => void', description: 'Selection callback.' }], usage: `<PromptSuggestions prompts={['Explain', 'Simplify']} />`, accessibility: '- Chips are focusable buttons\n- aria-label on each chip', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSChipGroup', 'DSPromptCard'] },
  { id: 'autocomplete', name: 'Autocomplete', description: 'Real-time suggestion dropdown while typing.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'suggestions', type: 'string[]', description: 'Autocomplete options.' }, { name: 'onSelect', type: '(value: string) => void', description: 'Selection callback.' }], usage: `<Autocomplete suggestions={options} onSelect={pick} />`, accessibility: '- role="combobox" with aria-expanded\n- Options: role="listbox/option"\n- Arrow keys navigate, Enter selects', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-shadow-lg'], dependencies: ['DSSearchBar'] },
  { id: 'style-presets', name: 'StylePresets', description: 'Visual style option cards for image generation.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'presets', type: 'Preset[]', description: 'Style options.' }, { name: 'selected', type: 'string', description: 'Selected preset.' }], usage: `<StylePresets presets={styles} selected="realistic" />`, accessibility: '- role="radiogroup"\n- Each preset is role="radio" with aria-checked', tokens: ['--token-accent', '--token-border', '--token-bg-hover'], dependencies: ['DSButton', 'DSBadge', 'DSChipGroup'] },
  { id: 'dynamic-form', name: 'DynamicForm', description: 'AI-generated form with mixed field types, validation, and dynamic layout.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'schema', type: 'FormSchema', required: true, description: 'Form field definitions.' }, { name: 'onSubmit', type: '(data: Record) => void', description: 'Submit handler.' }], usage: `<DynamicForm schema={formSchema} onSubmit={handleSubmit} />`, accessibility: '- Labels linked to inputs via htmlFor\n- Required fields marked with aria-required\n- Validation errors with aria-invalid and aria-describedby', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-error'], dependencies: ['DSInput', 'DSToggle', 'DSButton', 'DSSelect', 'DSCheckbox', 'DSSlider', 'DSFormField', 'DSToggleRow'] },
  { id: 'streaming-text', name: 'StreamingText', description: 'Token-by-token text appearance with blinking cursor animation.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'text', type: 'string', required: true, description: 'Full text content.' }, { name: 'speed', type: 'number', default: '30', description: 'ms per character.' }], usage: `<StreamingText text="Hello, I can help you with..." />`, accessibility: '- aria-live="polite" on container\n- Cursor is aria-hidden', tokens: ['--token-text-primary', '--token-accent'], dependencies: ['DSSkeleton', 'DSDot'] },
  { id: 'analysis-progress', name: 'AnalysisProgress', description: 'Multi-step progress indicator with phase labels and completion status.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'steps', type: 'AnalysisStep[]', required: true, description: 'Progress steps.' }, { name: 'current', type: 'number', description: 'Current step index.' }], usage: `<AnalysisProgress steps={[{ label: 'Parsing' }]} current={1} />`, accessibility: '- Step indicator has aria-current="step"\n- Progress bar with aria-valuenow', tokens: ['--token-accent', '--token-success', '--token-bg-tertiary'], dependencies: ['DSProgress', 'DSBadge', 'DSDot', 'DSStepIndicator'] },
  { id: 'skeleton-loader', name: 'SkeletonLoader', description: 'Full-layout shimmer placeholder for content loading states.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'variant', type: "'chat'|'card'|'list'", default: "'chat'", description: 'Layout variant.' }], usage: `<SkeletonLoader variant="chat" />`, accessibility: '- aria-hidden="true" on skeleton elements\n- aria-busy="true" on parent container', tokens: ['--token-bg-tertiary', '--token-bg-secondary'], dependencies: ['DSSkeleton'] },
  { id: 'tool-result', name: 'ToolResult', description: 'Rich formatted output card from tool executions with success/error states.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'tool', type: 'string', required: true, description: 'Tool name.' }, { name: 'result', type: 'any', required: true, description: 'Result data.' }, { name: 'status', type: "'success'|'error'", description: 'Execution status.' }], usage: `<ToolResult tool="web_search" result={data} status="success" />`, accessibility: '- Status indicated via badge + color\n- Result content in semantic container', tokens: ['--token-success', '--token-error', '--token-bg-secondary'], dependencies: ['DSBadge', 'DSCodeInline', 'DSButton', 'DSHeaderBar'] },
  { id: 'terminal-output', name: 'TerminalOutput', description: 'CLI-style output display with colored lines, timestamps, and cursor.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'lines', type: 'TerminalLine[]', required: true, description: 'Output lines.' }], usage: `<TerminalOutput lines={[{ text: '$ npm install', type: 'command' }]} />`, accessibility: '- Uses <pre> for preformatted text\n- Screen readers announce line-by-line', tokens: ['--token-bg-tertiary', '--token-text-primary', '--token-success', '--token-error'], dependencies: ['DSBadge', 'DSCodeInline', 'DSHeaderBar'] },
  { id: 'artifact-viewer', name: 'ArtifactViewer', description: 'Multi-tab viewer for AI-generated code artifacts with preview and source views.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'artifacts', type: 'Artifact[]', required: true, description: 'Generated artifacts.' }, { name: 'activeTab', type: 'number', description: 'Active tab index.' }], usage: `<ArtifactViewer artifacts={[{ name: 'index.tsx', code: '...' }]} />`, accessibility: '- Tabs use role="tablist" with aria-selected\n- Tab panels use role="tabpanel"', tokens: ['--token-bg', '--token-bg-secondary', '--token-border'], dependencies: ['DSHeaderBar', 'DSTabBar', 'DSToolbar', 'DSButton'] },
  { id: 'research-card', name: 'ResearchCard', description: 'Research findings card with sources, confidence score, and key metrics.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'title', type: 'string', required: true, description: 'Finding title.' }, { name: 'confidence', type: 'number', description: 'Confidence 0-1.' }, { name: 'sources', type: 'string[]', description: 'Source references.' }], usage: `<ResearchCard title="Finding" confidence={0.92} sources={['arxiv']} />`, accessibility: '- Confidence score readable as percentage\n- Sources as link list', tokens: ['--token-accent', '--token-success', '--token-bg-secondary'], dependencies: ['DSBadge', 'DSDot', 'DSTag', 'DSStatDisplay'] },
  { id: 'insight-card', name: 'InsightCard', description: 'Data-driven insight card with key metrics and trend indicators.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'title', type: 'string', required: true, description: 'Insight title.' }, { name: 'value', type: 'string|number', required: true, description: 'Metric value.' }, { name: 'trend', type: "'up'|'down'|'flat'", description: 'Trend direction.' }], usage: `<InsightCard title="Avg Response" value="1.2s" trend="down" />`, accessibility: '- Trend direction communicated via text + icon\n- Metric has aria-label', tokens: ['--token-success', '--token-error', '--token-text-primary'], dependencies: ['DSBadge', 'DSDot', 'DSStatDisplay'] },
  { id: 'cost-estimator', name: 'CostEstimator', description: 'Token and cost breakdown calculator with model pricing.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'tokens', type: 'number', required: true, description: 'Token count.' }, { name: 'model', type: 'string', description: 'Model name for pricing.' }], usage: `<CostEstimator tokens={4096} model="gpt-4o" />`, accessibility: '- Numeric values readable\n- Progress bar shows budget usage', tokens: ['--token-accent', '--token-warning', '--token-error'], dependencies: ['DSBadge', 'DSProgress', 'DSStatDisplay'] },
  { id: 'verification-badge', name: 'VerificationBadge', description: 'Source verification status indicator (verified, unverified, partial).', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'status', type: "'verified'|'unverified'|'partial'", required: true, description: 'Verification status.' }, { name: 'source', type: 'string', description: 'Source name.' }], usage: `<VerificationBadge status="verified" source="arxiv" />`, accessibility: '- Status text accompanies color coding\n- aria-label describes full status', tokens: ['--token-success', '--token-warning', '--token-error'], dependencies: ['DSBadge', 'DSDot'] },
  { id: 'data-table', name: 'DataTable', description: 'Sortable tabular data display with formatted cells and header controls.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'columns', type: 'Column[]', required: true, description: 'Column definitions.' }, { name: 'data', type: 'Record[]', required: true, description: 'Row data.' }, { name: 'sortable', type: 'boolean', default: 'true', description: 'Enable sorting.' }], usage: `<DataTable columns={cols} data={rows} />`, accessibility: '- <table> with <thead>/<tbody>\n- Sort buttons have aria-sort\n- Keyboard navigable cells', tokens: ['--token-bg', '--token-border', '--token-text-primary'], dependencies: ['DSBadge', 'DSProgress', 'DSDot', 'DSDivider', 'DSHeaderBar'] },
  { id: 'chart-result', name: 'ChartResult', description: 'Horizontal bar chart visualization for AI data analysis results.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'data', type: 'ChartData[]', required: true, description: 'Chart data points.' }, { name: 'title', type: 'string', description: 'Chart title.' }], usage: `<ChartResult title="Usage" data={[{ label: 'GPT-4', value: 45 }]} />`, accessibility: '- Bars have aria-label with value\n- Legend uses DSLegendItem with text labels\n- Title as accessible name', tokens: ['--token-accent', '--token-secondary', '--token-tertiary'], dependencies: ['DSBadge', 'DSDot', 'DSStatDisplay', 'DSHeaderBar'] },
  { id: 'context-window', name: 'ContextWindow', description: 'Context size visualization with segment breakdown and management controls.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'used', type: 'number', required: true, description: 'Used tokens.' }, { name: 'total', type: 'number', required: true, description: 'Max tokens.' }, { name: 'segments', type: 'Segment[]', description: 'Usage segments.' }], usage: `<ContextWindow used={24000} total={128000} />`, accessibility: '- Color bar with aria-label\n- Segment labels readable\n- Management buttons labeled', tokens: ['--token-accent', '--token-secondary', '--token-bg-tertiary'], dependencies: ['DSBadge', 'DSDot', 'DSButton', 'DSStatDisplay', 'DSHeaderBar'] },
  { id: 'parameters-panel', name: 'ParametersPanel', description: 'Model parameter configuration with sliders, toggles, and selects.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'params', type: 'Param[]', description: 'Parameter definitions.' }, { name: 'onChange', type: '(key, value) => void', description: 'Change callback.' }], usage: `<ParametersPanel onChange={updateParams} />`, accessibility: '- Each control has aria-label\n- Sliders have aria-valuenow/min/max\n- Toggles use role="switch"', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSSlider', 'DSToggle', 'DSSelect', 'DSButton', 'DSToggleRow', 'DSHeaderBar'] },
  { id: 'image-gen-grid', name: 'ImageGenGrid', description: 'Generated image results in a selectable grid with actions.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'images', type: 'GeneratedImage[]', required: true, description: 'Generated images.' }, { name: 'onSelect', type: '(id: string) => void', description: 'Selection callback.' }], usage: `<ImageGenGrid images={results} onSelect={select} />`, accessibility: '- Grid items are role="img" with alt text\n- Selected item: aria-selected\n- Keyboard: arrow keys navigate grid', tokens: ['--token-accent', '--token-bg-tertiary', '--token-border'], dependencies: ['DSButton', 'DSBadge', 'DSSkeleton', 'DSToolbar', 'DSHeaderBar'] },
  { id: 'image-editor', name: 'ImageEditor', description: 'In/outpainting editor with brush size, tool selection, and canvas controls.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'image', type: 'string', required: true, description: 'Image source URL.' }, { name: 'onSave', type: '(data: ImageData) => void', description: 'Save callback.' }], usage: `<ImageEditor image={url} onSave={handleSave} />`, accessibility: '- Toolbar buttons with aria-labels\n- Brush size slider accessible\n- Canvas has aria-label="Image editor"', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSButton', 'DSBadge', 'DSSlider', 'DSToolbar', 'DSHeaderBar'] },
  { id: 'variations-picker', name: 'VariationsPicker', description: 'Multiple AI-generated variations displayed for comparison and selection.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'variations', type: 'Variation[]', required: true, description: 'Variation options.' }, { name: 'selected', type: 'number', description: 'Selected index.' }], usage: `<VariationsPicker variations={vars} selected={0} />`, accessibility: '- role="radiogroup" for selection\n- Each variation: role="radio" with aria-checked', tokens: ['--token-accent', '--token-border'], dependencies: ['DSButton', 'DSBadge', 'DSToolbar'] },
  { id: 'comparison-view', name: 'ComparisonView', description: 'Side-by-side model output comparison with diff highlighting.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'left', type: 'ComparisonItem', required: true, description: 'Left panel content.' }, { name: 'right', type: 'ComparisonItem', required: true, description: 'Right panel content.' }], usage: `<ComparisonView left={modelA} right={modelB} />`, accessibility: '- Panels labeled with model names\n- Tab navigation between panels', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSButton', 'DSBadge', 'DSTag', 'DSHeaderBar', 'DSTabBar'] },
  { id: 'voice-waveform', name: 'VoiceWaveform', description: 'Real-time voice input waveform visualization with recording controls.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'recording', type: 'boolean', default: 'false', description: 'Recording state.' }, { name: 'waveData', type: 'number[]', description: 'Waveform amplitude data.' }], usage: `<VoiceWaveform recording={true} />`, accessibility: '- Recording state announced via aria-live\n- Stop/start button with aria-label\n- Waveform is decorative (aria-hidden)', tokens: ['--token-accent', '--token-error', '--token-bg-secondary'], dependencies: ['DSButton', 'DSProgress', 'DSAvatar', 'DSHeaderBar'] },
  { id: 'audio-player', name: 'AudioPlayer', description: 'TTS playback with progress scrubber, speed controls, and time display.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'src', type: 'string', required: true, description: 'Audio source URL.' }, { name: 'title', type: 'string', description: 'Track title.' }], usage: `<AudioPlayer src="/audio.mp3" title="Response" />`, accessibility: '- Play/pause with aria-label\n- Progress slider with aria-valuenow\n- Speed selector accessible', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSButton', 'DSProgress', 'DSToolbar', 'DSHeaderBar'] },
  { id: 'voice-selector', name: 'VoiceSelector', description: 'Voice identity picker with preview samples and selection state.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'voices', type: 'Voice[]', required: true, description: 'Available voices.' }, { name: 'selected', type: 'string', description: 'Selected voice ID.' }], usage: `<VoiceSelector voices={voices} selected="alloy" />`, accessibility: '- List items with role="option" and aria-selected\n- Preview button with aria-label', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSButton', 'DSAvatar', 'DSBadge', 'DSListItem'] },
  { id: 'speech-input', name: 'SpeechInput', description: 'Voice recording input with real-time transcription preview.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'onTranscript', type: '(text: string) => void', description: 'Transcription callback.' }], usage: `<SpeechInput onTranscript={handleText} />`, accessibility: '- Record button toggles with aria-pressed\n- Transcription shown in aria-live region\n- Clear visual recording state', tokens: ['--token-accent', '--token-error', '--token-bg'], dependencies: ['DSButton', 'DSProgress', 'DSToolbar'] },
  { id: 'orb-visualizer', name: 'OrbVisualizer', description: 'Ambient orb animation responding to audio input or AI processing state.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'active', type: 'boolean', default: 'false', description: 'Animation active.' }, { name: 'intensity', type: 'number', default: '0.5', description: 'Animation intensity 0-1.' }], usage: `<OrbVisualizer active intensity={0.8} />`, accessibility: '- Purely decorative, aria-hidden="true"\n- Status communicated by adjacent text\n- Respects prefers-reduced-motion', tokens: ['--token-accent', '--token-secondary'], dependencies: ['DSButton'] },
  { id: 'inline-actions', name: 'InlineActions', description: 'Contextual action toolbar overlaid on content on hover.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'actions', type: 'Action[]', required: true, description: 'Action buttons.' }, { name: 'visible', type: 'boolean', default: 'false', description: 'Visibility state.' }], usage: `<InlineActions actions={[{ icon: <Copy />, label: 'Copy' }]} />`, accessibility: '- Toolbar role with aria-label\n- Each button has title/aria-label\n- Keyboard accessible via Tab', tokens: ['--token-bg', '--token-border', '--token-shadow-sm'], dependencies: ['DSButton', 'DSBadge', 'DSToolbar'] },
  { id: 'file-attachment', name: 'FileAttachment', description: 'File attachment card showing type icon, name, size, and remove action.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'name', type: 'string', required: true, description: 'File name.' }, { name: 'size', type: 'string', description: 'File size display.' }, { name: 'type', type: 'string', description: 'File MIME type.' }, { name: 'onRemove', type: '() => void', description: 'Remove callback.' }], usage: `<FileAttachment name="report.pdf" size="2.4 MB" />`, accessibility: '- Remove button with aria-label\n- File type indicated via icon + text\n- Focusable card', tokens: ['--token-bg-secondary', '--token-border', '--token-text-secondary'], dependencies: ['DSBadge', 'DSButton', 'DSTag'] },
  { id: 'consent-dialog', name: 'ConsentDialog', description: 'Permission request dialog with explanation, checkboxes, and accept/deny.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'title', type: 'string', required: true, description: 'Dialog title.' }, { name: 'permissions', type: 'Permission[]', description: 'Permission items.' }, { name: 'onAccept', type: '() => void', description: 'Accept callback.' }, { name: 'onDeny', type: '() => void', description: 'Deny callback.' }], usage: `<ConsentDialog title="Data Access" onAccept={accept} />`, accessibility: '- role="dialog" with aria-modal\n- Checkboxes for granular consent\n- Focus trapped within dialog', tokens: ['--token-bg', '--token-border', '--token-accent', '--token-error'], dependencies: ['DSButton', 'DSBadge', 'DSCheckbox', 'DSDivider', 'DSHeaderBar', 'DSToggleRow'] },
  { id: 'search-results', name: 'SearchResults', description: 'Web search result cards with titles, snippets, URLs, and relevance scores.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'results', type: 'SearchResult[]', required: true, description: 'Result items.' }, { name: 'query', type: 'string', description: 'Search query.' }], usage: `<SearchResults results={results} query="transformers" />`, accessibility: '- Results as list with role="listitem"\n- Links are focusable with descriptive text\n- Relevance score readable', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar'] },
  { id: 'file-tree', name: 'FileTree', description: 'Recursive file/folder browser with expand/collapse, type icons, and breadcrumb.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'tree', type: 'FileNode', required: true, description: 'Root file tree node.' }, { name: 'onSelect', type: '(path: string) => void', description: 'File selection callback.' }], usage: `<FileTree tree={rootNode} onSelect={openFile} />`, accessibility: '- role="tree" with role="treeitem"\n- aria-expanded on folders\n- Arrow keys navigate tree', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSBadge', 'DSDot', 'DSDivider', 'DSBreadcrumb', 'DSHeaderBar'] },
  { id: 'thread-manager', name: 'ThreadManager', description: 'Parallel conversation thread list with pin, archive, and delete actions.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'threads', type: 'Thread[]', required: true, description: 'Thread list.' }, { name: 'onSelect', type: '(id: string) => void', description: 'Thread selection.' }], usage: `<ThreadManager threads={threads} onSelect={openThread} />`, accessibility: '- List with aria-label\n- Actions per item with aria-labels\n- Active thread: aria-current', tokens: ['--token-bg', '--token-border', '--token-accent'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar'] },
  { id: 'mobile-ai-chat', name: 'MobileAIChat', description: 'Full mobile chat screen with bottom nav, message bubbles, typing indicator, and FAB.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'messages', type: 'Message[]', description: 'Chat messages.' }], usage: `<MobileAIChat messages={messages} />`, accessibility: '- Full screen layout with landmarks\n- Messages in aria-live region\n- Bottom nav accessible', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSBottomNav', 'DSChatInput', 'DSMessageBubble', 'DSTypingIndicator', 'DSHeaderBar', 'DSFab'] },
  { id: 'quick-actions-sheet', name: 'QuickActionsSheet', description: 'Mobile bottom sheet with AI quick action cards and category search.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'actions', type: 'QuickAction[]', description: 'Available actions.' }], usage: `<QuickActionsSheet actions={quickActions} />`, accessibility: '- Bottom sheet with role="dialog"\n- Action cards are focusable buttons\n- Search filters results', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSBottomSheet', 'DSPromptCard', 'DSSearchBar', 'DSSegmentedControl'] },
  { id: 'mobile-agent-tasks', name: 'MobileAgentTasks', description: 'Mobile agent task monitor with collapsible steps, progress bars, and notifications.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'tasks', type: 'AgentTask[]', required: true, description: 'Task list.' }], usage: `<MobileAgentTasks tasks={tasks} />`, accessibility: '- Collapsible sections with aria-expanded\n- Progress bars with aria-valuenow\n- Notifications as alerts', tokens: ['--token-accent', '--token-success', '--token-warning', '--token-error'], dependencies: ['DSCollapsible', 'DSStepIndicator', 'DSHeaderBar', 'DSNotificationBanner', 'DSBadge', 'DSProgress'] },
  { id: 'mobile-smart-reply', name: 'MobileSmartReply', description: 'AI smart reply suggestions with tone selection chips and preview.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'suggestions', type: 'SmartReply[]', description: 'Reply suggestions.' }, { name: 'onSelect', type: '(reply: string) => void', description: 'Selection callback.' }], usage: `<MobileSmartReply suggestions={replies} onSelect={send} />`, accessibility: '- Suggestions as focusable chips\n- Tone selector as radio group\n- Preview in aria-live region', tokens: ['--token-accent', '--token-bg-secondary'], dependencies: ['DSChipGroup', 'DSBottomSheet', 'DSStreamingDots'] },
  { id: 'mobile-search-ai', name: 'MobileSearchAI', description: 'Semantic AI search with AI overview, source confidence, and result ranking.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'query', type: 'string', description: 'Search query.' }, { name: 'results', type: 'AISearchResult[]', description: 'Search results.' }], usage: `<MobileSearchAI query="transformers" results={results} />`, accessibility: '- Search with role="search"\n- Results as accessible list\n- Confidence scores readable', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSSearchBar', 'DSFilterBar', 'DSListItem', 'DSEmptyState', 'DSChipGroup', 'DSBottomNav'] },
  { id: 'mobile-notifications', name: 'MobileNotifications', description: 'Swipeable notification stack with read/unread states and category filters.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'notifications', type: 'Notification[]', required: true, description: 'Notification list.' }], usage: `<MobileNotifications notifications={notifs} />`, accessibility: '- Unread count announced\n- Swipe actions have keyboard alternative\n- Pull to refresh with aria-live', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-error'], dependencies: ['DSHeaderBar', 'DSEmptyState', 'DSBottomNav', 'DSSwipeAction', 'DSPullIndicator', 'DSSegmentedControl'] },
  { id: 'ai-usage-dashboard', name: 'AIUsageDashboard', description: 'Token and cost monitoring dashboard with multi-model breakdown and budget tracking.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'usage', type: 'UsageData', required: true, description: 'Usage statistics.' }, { name: 'period', type: 'string', default: "'month'", description: 'Time period.' }], usage: `<AIUsageDashboard usage={data} period="week" />`, accessibility: '- Stats have aria-labels\n- Charts use text labels alongside colors\n- Tab navigation between views', tokens: ['--token-accent', '--token-success', '--token-warning', '--token-error'], dependencies: ['DSStatDisplay', 'DSTabBar', 'DSHeaderBar', 'DSToggleRow', 'DSBadge', 'DSDot', 'DSProgress'] },
  { id: 'ai-context-panel', name: 'AIContextPanel', description: 'Context window management panel with source toggles and token visualization.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'sources', type: 'ContextSource[]', description: 'Context sources.' }, { name: 'tokenBudget', type: 'number', description: 'Max tokens.' }], usage: `<AIContextPanel sources={sources} tokenBudget={128000} />`, accessibility: '- Toggle rows with accessible labels\n- Token visualization with aria-valuenow\n- Sources listed with sizes', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSToggleRow', 'DSHeaderBar', 'DSStatDisplay', 'DSButton', 'DSBadge', 'DSSelect'] },
  { id: 'ai-onboarding', name: 'AIOnboarding', description: 'Multi-step AI setup wizard with interest selection, config, and privacy consent.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'steps', type: 'OnboardingStep[]', description: 'Wizard steps.' }, { name: 'onComplete', type: '() => void', description: 'Completion callback.' }], usage: `<AIOnboarding onComplete={finishSetup} />`, accessibility: '- Step indicator with aria-current\n- Form fields properly labeled\n- Progress bar tracks completion', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-success'], dependencies: ['DSStepIndicator', 'DSPromptCard', 'DSToggleRow', 'DSChipGroup', 'DSButton', 'DSProgress', 'DSCheckbox'] },
  { id: 'voice-transcription', name: 'VoiceTranscription', description: 'Real-time voice-to-text panel with speaker diarization and confidence scoring.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'transcript', type: 'TranscriptEntry[]', description: 'Transcript data.' }, { name: 'recording', type: 'boolean', default: 'false', description: 'Recording state.' }], usage: `<VoiceTranscription transcript={entries} recording />`, accessibility: '- Transcript in aria-live region\n- Speaker labels as accessible names\n- Confidence shown as badge text', tokens: ['--token-accent', '--token-bg-secondary', '--token-border'], dependencies: ['DSHeaderBar', 'DSToolbar', 'DSListItem', 'DSButton', 'DSBadge', 'DSDot'] },
  { id: 'meeting-notes', name: 'MeetingNotes', description: 'AI-generated meeting summary with action items, topics, and participant tracking.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'summary', type: 'MeetingSummary', required: true, description: 'Meeting data.' }], usage: `<MeetingNotes summary={meetingData} />`, accessibility: '- Sections with heading hierarchy\n- Action items as checkbox list\n- Participants with avatar alt text', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSHeaderBar', 'DSListItem', 'DSChipGroup', 'DSStatDisplay', 'DSButton', 'DSBadge', 'DSAvatar', 'DSCheckbox', 'DSTag'] },
  { id: 'ai-command-palette', name: 'AICommandPalette', description: 'Keyboard-driven AI action launcher with search, categories, and shortcuts.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'commands', type: 'Command[]', required: true, description: 'Available commands.' }, { name: 'onSelect', type: '(cmd: Command) => void', description: 'Selection callback.' }], usage: `<AICommandPalette commands={cmds} onSelect={run} />`, accessibility: '- role="combobox" with aria-expanded\n- Commands as role="option"\n- Shortcuts displayed with <kbd>\n- Arrow keys + Enter to select', tokens: ['--token-accent', '--token-bg', '--token-border', '--token-shadow-xl'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar', 'DSInput', 'DSBadge', 'DSKbd'] },
  { id: 'context-attachments', name: 'ContextAttachments', description: 'File and context chip bar with token budget visualization and quick-add.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'attachments', type: 'ContextAttachment[]', description: 'Current context items.' }, { name: 'budget', type: 'number', description: 'Token budget.' }], usage: `<ContextAttachments attachments={items} budget={128000} />`, accessibility: '- Chips with remove buttons (aria-label)\n- Token budget shown as progress\n- Add button with aria-label', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSChipGroup', 'DSHeaderBar', 'DSSearchBar', 'DSButton', 'DSBadge', 'DSTag'] },
  { id: 'conversation-fork', name: 'ConversationFork', description: 'Branch explorer for alternative conversation paths with tree visualization.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'branches', type: 'Branch[]', required: true, description: 'Conversation branches.' }, { name: 'active', type: 'string', description: 'Active branch ID.' }], usage: `<ConversationFork branches={branches} active="main" />`, accessibility: '- Tree structure with role="tree"\n- Active branch: aria-current\n- Branch labels descriptive', tokens: ['--token-accent', '--token-bg', '--token-border'], dependencies: ['DSHeaderBar', 'DSListItem', 'DSButton', 'DSBadge', 'DSAvatar', 'DSDot', 'DSDivider'] },
  { id: 'list-panel', name: 'ListPanel', description: 'Scrollable list panel with search, header, and empty state fallback.', category: 'component', importPath: "@zeros-aiui/components/ai", props: [{ name: 'items', type: 'ListItem[]', required: true, description: 'List items.' }, { name: 'onSelect', type: '(id: string) => void', description: 'Selection callback.' }], usage: `<ListPanel items={items} onSelect={select} />`, accessibility: '- Search with aria-label\n- List items focusable\n- Empty state announced', tokens: ['--token-bg', '--token-border'], dependencies: ['DSSearchBar', 'DSListItem', 'DSHeaderBar', 'DSEmptyState'] },
];

/* ——————————————————————————————————————————————————
   DOCUMENTATION REGISTRY (merged)
   —————————————————————————————————————————————————— */

export const allComponentDocs: ComponentDoc[] = [
  ...atomDocs,
  ...moleculeDocs,
  ...aiComponentDocs,
];

export function getComponentDoc(id: string): ComponentDoc | undefined {
  return allComponentDocs.find(doc => doc.id === id);
}

export function getDocsByCategory(category: 'atom' | 'molecule' | 'component'): ComponentDoc[] {
  return allComponentDocs.filter(doc => doc.category === category);
}
