# Zeros AIUI - Product Roadmap & TODO

**Brand:** Zeros
**Product:** Zeros AIUI
**NPM Scope:** `@zeros-aiui`
**CLI:** `npx zeros-aiui add <component>`
**Tagline:** "AI can generate components. Zeros makes them coherent."

---

## Phase 0: Foundation (Current State)

### Completed
- [x] 74 AI components built with atom/molecule composition
- [x] 30 atom primitives (DSButton, DSToggle, DSCheckbox, DSSlider, DSSelect, etc.)
- [x] 30 molecule primitives (DSSearchBar, DSHeaderBar, DSTabBar, DSModal, etc.)
- [x] 4-level token architecture (L1 Raw > L2 Primitive > L3 Semantic > L4 Component)
- [x] Geological Intelligence color palette (Moonstone, Sunstone, Olivine, Malachite, Garnet, Ochre, Azurite)
- [x] Light + Dark theme support via CSS custom properties
- [x] Snapshot system for component state documentation (componentSnapshots.tsx)
- [x] Design system gallery with interactive detail pages
- [x] Scroll position save/restore with timeout cleanup
- [x] Focus-visible CSS utilities via `[data-ds-interactive]`
- [x] Reduced motion media query support
- [x] High contrast mode (forced-colors) support
- [x] Screen reader utility class (`.ds-sr-only`)
- [x] ARIA: DSButton (aria-disabled, aria-busy, data-ds-interactive)
- [x] ARIA: DSToggle (role="switch", aria-checked)
- [x] ARIA: DSCheckbox (role="checkbox", aria-checked, keyboard Enter/Space)
- [x] ARIA: DSCollapsible (aria-expanded)

### Blocked
- [ ] Delete 47 unused shadcn/ui files in `/src/app/components/ui/` (scaffold-protected in Figma Make; manually delete when exporting)

---

## Phase 1: Accessibility (CRITICAL - Must Complete Before Publishing)

### Atoms - ARIA & Keyboard
- [ ] DSInput: `aria-invalid` for error state, `aria-describedby` for hints
- [ ] DSSelect: `role="listbox"`, `aria-expanded`, `aria-activedescendant`, Escape to close, Arrow key navigation
- [ ] DSSlider: `aria-label` on native input, `aria-valuemin/max/now/text`
- [ ] DSTextarea: `aria-invalid`, `aria-describedby`
- [ ] DSRating: `role="radiogroup"`, individual `role="radio"`, Arrow key navigation
- [ ] DSCounter: `role="spinbutton"`, `aria-valuenow/min/max`, Arrow key Up/Down
- [ ] DSSegmentedControl: `role="radiogroup"`, individual `role="radio"`, `aria-checked`, Arrow keys
- [ ] DSProgress: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- [ ] DSSkeleton: `aria-hidden="true"`, `data-ds-animated`
- [ ] DSSpinner: `role="status"`, `aria-label="Loading"`
- [ ] DSDot: `aria-hidden="true"` (decorative)
- [ ] DSStreamingDots: `role="status"`, `aria-label="Processing"`, `data-ds-animated`
- [ ] DSBottomSheetHandle: `aria-hidden="true"`
- [ ] DSPullIndicator: `role="status"`, `aria-live="polite"`
- [ ] DSColorBar: `role="img"`, `aria-label` with segment descriptions
- [ ] DSBadge: `role="status"` for count/status variants
- [ ] DSAvatar: `role="img"`, `aria-label` with variant name
- [ ] DSDivider: `role="separator"`
- [ ] DSTag: `tabIndex={0}` when clickable, `role="option"` when selectable, keyboard Enter

### Molecules - ARIA & Keyboard
- [ ] DSSearchBar: `role="search"`, `aria-label`
- [ ] DSToolbar: `role="toolbar"`, `aria-label`, Arrow key navigation
- [ ] DSFormField: `aria-describedby` linking label to hint/error
- [ ] DSTabBar: `role="tablist"`, tabs with `role="tab"`, `aria-selected`, Arrow keys
- [ ] DSHeaderBar: Semantic heading level
- [ ] DSStepIndicator: `aria-current="step"` for active step
- [ ] DSChipGroup: `role="listbox"`, chips with `role="option"`, `aria-selected`
- [ ] DSEmptyState: `role="status"`
- [ ] DSToggleRow: `aria-labelledby` connecting label to toggle
- [ ] DSBreadcrumb: `nav` element, `aria-label="Breadcrumb"`, `aria-current="page"` for last
- [ ] DSDropdownMenu: `role="menu"`, items with `role="menuitem"`, Escape, Arrow keys, Home/End
- [ ] DSModal: `role="dialog"`, `aria-modal="true"`, focus trapping, Escape to close, return focus on close
- [ ] DSPopover: `role="dialog"` or `role="tooltip"`, focus management
- [ ] DSListItem: `role="option"` or `role="listitem"` context-dependent

### AI Components - ARIA
- [ ] ListPanel: `role="listbox"` for item list, `aria-label` on search
- [ ] ChatMessage: `role="log"`, `aria-label`, `aria-live="polite"` for new messages
- [ ] ChatInput: `aria-label`, auto-announce send confirmation
- [ ] CodeBlock: `role="region"`, `aria-label="Code block"`, announce copy success
- [ ] All interactive AI components: Add `data-ds-interactive` to clickable containers

### Focus Management
- [ ] Focus trap utility for DSModal, DSBottomSheet, DSDropdownMenu
- [ ] Return focus to trigger element on close
- [ ] Focus ring token integration with all interactive components
- [ ] Skip-to-content link in Layout.tsx

### Testing
- [ ] Manual keyboard navigation audit for all 30 atoms
- [ ] Screen reader testing (VoiceOver + NVDA)
- [ ] Color contrast ratio verification for all token pairs (WCAG AA 4.5:1)
- [ ] Automated a11y testing setup (jest-axe or axe-core)

---

## Phase 2: Library Structure & Build

### Package Structure
```
zeros-aiui/
  packages/
    tokens/           # @zeros-aiui/tokens
      src/
        tokens.css    # Full CSS custom properties
        tokens.json   # JSON format for Figma/Style Dictionary
        index.ts      # TypeScript token type exports
      package.json
    components/       # @zeros-aiui/components
      src/
        atoms/        # Individual atom files
        molecules/    # Individual molecule files
        ai/           # Individual AI component files
        index.ts      # Barrel exports
      package.json
    cli/              # zeros-aiui (CLI package)
      src/
        index.ts      # CLI entry
        commands/
          add.ts      # npx zeros-aiui add <component>
          init.ts     # npx zeros-aiui init
          list.ts     # npx zeros-aiui list
        registry.ts   # Component dependency graph
      package.json
```

### Build Pipeline
- [ ] Set up monorepo (pnpm workspaces or turborepo)
- [ ] Configure tsup for ESM + CJS + declaration files
- [ ] Tree-shaking configuration
- [ ] CSS extraction (tokens as standalone importable stylesheet)
- [ ] Source maps for debugging
- [ ] Bundlesize budget (< 50kb gzipped for full library)

### @zeros-aiui/tokens
- [ ] Extract `tokens.css` as standalone package
- [ ] Generate `tokens.json` (Style Dictionary format)
- [ ] TypeScript types for all token names
- [ ] Dark theme as separate importable file
- [ ] CSS-in-JS compatible exports (object format)
- [ ] Figma token format export

### @zeros-aiui/components
- [ ] Separate Demo wrappers from reusable components (each component exports only the component, not `*Demo`)
- [ ] Each component in its own file with proper named export
- [ ] Peer dependencies: `react`, `react-dom`, `lucide-react`
- [ ] `forwardRef` support for all interactive atoms
- [ ] Consistent prop naming conventions documented

### CLI (npx zeros-aiui)
- [ ] `zeros-aiui init` - scaffolds tokens.css + atoms into project
- [ ] `zeros-aiui add <component>` - copies component + all dependencies
- [ ] `zeros-aiui list` - lists all available components with categories
- [ ] `zeros-aiui update` - updates existing components to latest
- [ ] Dependency graph resolution (e.g., `add chat-history` also installs `ListPanel`, `DSButton`, `DSBadge`, `DSDot`)
- [ ] Support for TypeScript and JavaScript output
- [ ] Configurable output directory
- [ ] Detect existing components to avoid overwriting

---

## Phase 3: Documentation & Component Docs

### Component Detail Page Documentation (In-App)
- [ ] Props table for every atom (name, type, default, description)
- [ ] Props table for every molecule
- [ ] Props table for every AI component
- [ ] Usage code snippets (import + basic usage)
- [ ] Accessibility notes per component
- [ ] Token dependency listing per component
- [ ] "Dependencies" section showing required atoms/molecules
- [ ] "Used by" section showing which AI components use each atom/molecule

### External Documentation
- [ ] Landing page (zeros-aiui.dev)
- [ ] Getting started guide
- [ ] Token architecture explainer
- [ ] Theming guide (custom palettes)
- [ ] Contribution guidelines
- [ ] Changelog / release notes
- [ ] Storybook deployment (optional)

---

## Phase 4: Quality & Testing

### Unit Tests (Vitest + React Testing Library)
- [ ] All 30 atoms: renders, handles props, edge cases
- [ ] All 30 molecules: composition, prop passing
- [ ] 10 critical AI components: ChatMessage, ChatInput, CodeBlock, ModelSelector, etc.
- [ ] Token resolution tests (CSS variables resolve correctly)
- [ ] Theme switching tests (light/dark)
- [ ] Snapshot regression tests

### Visual Regression
- [ ] Chromatic or Percy integration
- [ ] All component states captured
- [ ] Dark mode variants
- [ ] Responsive breakpoints

### Performance
- [ ] Bundlesize tracking per component
- [ ] Render performance benchmarks
- [ ] Memory leak checks for stateful components (CanvasWorkspace, OrbVisualizer)
- [ ] Tree-shaking verification

---

## Phase 5: Advanced Features

### Theming Engine
- [ ] Theme provider component wrapping CSS variable injection
- [ ] Custom palette builder (provide 7 mineral colors, generate full token set)
- [ ] CSS-in-JS adapter for Emotion/styled-components users
- [ ] Tailwind CSS plugin for using tokens as Tailwind utilities

### AI-Specific Enhancements
- [ ] Streaming text hook (`useStreamingText`)
- [ ] Token counting hook (`useTokenCount`)
- [ ] Message history hook with pagination (`useChatHistory`)
- [ ] Keyboard shortcut system (`useHotkey`)
- [ ] Copy-to-clipboard hook with toast feedback
- [ ] Responsive container queries for adaptive layouts

### SSR Support
- [ ] Remove any `window` references in component render paths
- [ ] Test with Next.js App Router
- [ ] Test with Remix / React Router v7
- [ ] Hydration-safe implementations

### i18n
- [ ] Extract all hardcoded strings to a locale object
- [ ] RTL layout support
- [ ] Example locale files (en, es, ja, zh)

---

## Cleanup (Before Any Publish)

- [ ] Remove 47 unused shadcn/ui files from `/src/app/components/ui/`
- [ ] Remove unused npm dependencies from package.json (MUI, Radix, embla-carousel, etc.)
- [ ] Audit for console.log / console.warn in production code
- [ ] Verify no hardcoded colors outside token system
- [ ] Lint pass (ESLint + Prettier)
- [ ] TypeScript strict mode validation
- [ ] License file (MIT recommended)

---

## Component Inventory

### Atoms (30)
DSButton, DSBadge, DSAvatar, DSInput, DSToggle, DSTag, DSProgress, DSSkeleton, DSDivider, DSKbd, DSCodeInline, DSSpinner, DSDot, DSCheckbox, DSSlider, DSSelect, DSTextarea, DSRating, DSCounter, DSSegmentedControl, DSStreamingDots, DSBottomSheetHandle, DSSwipeAction, DSPullIndicator, DSColorBar, DSCollapsible, DSLegendItem + (atoms-extra duplicates for backward compat)

### Molecules (30)
DSSearchBar, DSToolbar, DSFormField, DSTabBar, DSHeaderBar, DSStepIndicator, DSChipGroup, DSEmptyState, DSToggleRow, DSBreadcrumb, DSStatDisplay, DSListItem, DSDropdownMenu, DSModal, DSPopover, DSChatInput, DSMessageBubble, DSTypingIndicator, DSTokenCounter, DSModelSelector, DSPromptCard, DSCopyBlock, DSNotificationBanner, DSFilterBar, DSSliderGroup, DSBottomSheet, DSActionSheet, DSBottomNav, DSSwipeableRow, DSFab

### AI Components (74)
AICommandPalette, AIContextPanel, AIDisclosure, AIOnboarding, AIUsageDashboard, ActionPlan, AgentCard, AnalysisProgress, ArtifactViewer, AudioPlayer, Autocomplete, CanvasWorkspace, ChartResult, ChatHistory, ChatInput, ChatMessage, CodeBlock, ComparisonView, ConfidenceScore, ConsentDialog, ContextAttachments, ContextWindow, ConversationFork, CostEstimator, DataTable, DynamicForm, FeedbackActions, FileAttachment, FileTree, FollowUpBar, ImageEditor, ImageGenGrid, InlineActions, InsightCard, KnowledgeBase, ListPanel, MCPConnector, MarkdownResponse, MeetingNotes, MemoryManager, MobileAIChat, MobileAgentTasks, MobileNotifications, MobileSearchAI, MobileSmartReply, ModelSelector, MultiModalInput, NotificationCenter, OrbVisualizer, ParametersPanel, PromptEnhancer, PromptSuggestions, PromptTemplates, QuickActionsSheet, ReasoningTrace, ResearchCard, SearchResults, SkeletonLoader, SourceCitation, SpeechInput, StreamingText, StylePresets, SystemMessage, TerminalOutput, ThinkingIndicator, ThreadManager, TokenUsage, ToolCall, ToolResult, VariationsPicker, VerificationBadge, VoiceSelector, VoiceTranscription, VoiceWaveform, WelcomeScreen

---

## External Dependencies (Production)

| Package | Purpose | Removable? |
|---------|---------|-----------|
| react | Core framework | No (peer dep) |
| lucide-react | Icon library | No (used by all components) |
| react-router | App routing | Yes (app-level only, not in components) |

**All other packages in package.json are UNUSED by the DS/AI component system and can be removed for library distribution.**
