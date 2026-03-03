# Zeros AI Kit

**The open-source design system for AI interfaces.**

74+ production-ready React components purpose-built for AI products — chat, voice, agentic workflows, research, image generation, and more. Built on a rigorous 4-level design token architecture with a geological color palette, atomic composition, and a shadcn-style CLI for zero-friction adoption.

[![Built with Figma Make](https://img.shields.io/badge/Built%20with-Figma%20Make-000?style=flat-square&logo=figma)](https://figma.site)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What is Zeros AI Kit?

AI is reshaping every interface, but we're still building AI products with components designed for CRUD apps. There's no established design language for streaming indicators, confidence scores, reasoning traces, voice orbs, or agentic task panels.

Zeros AI Kit fills that gap. It's a complete, documented, token-driven component system — from primitive atoms to full-page AI experiences — that you can install into any React project with a single CLI command.

---

## Features

### 74+ AI-Native Components

Components organized across 11 categories, each with live interactive demos:

| Category | Components | Examples |
|---|---|---|
| **Chat & Conversation** | 13 | ChatMessage, ChatInput, PromptSuggestions, Autocomplete |
| **AI Processing** | 7 | ThinkingIndicator, ReasoningTrace, StreamingText, ToolCall |
| **Response & Actions** | 12 | CodeBlock, SourceCitation, ArtifactViewer, DataTable |
| **Voice AI** | 5 | VoiceWaveform, SpeechInput, OrbVisualizer, AudioPlayer |
| **Research & Analysis** | 5 | ResearchCard, ConfidenceScore, ChartResult, InsightCard |
| **Image AI** | 3 | ImageGenGrid, ImageEditor, StylePresets |
| **Agentic** | 3 | AgentCard, ThreadManager, CanvasWorkspace |
| **Data & System** | 12 | ModelSelector, TokenUsage, MCPConnector, CostEstimator |
| **Mobile** | 6 | MobileAIChat, MobileAgentTasks, MobileSmartReply |
| **Mixed** | 3 | AIUsageDashboard, AIContextPanel, AIOnboarding |
| **Real-World AI** | 5 | VoiceTranscription, MeetingNotes, AICommandPalette |

### Atomic Design Architecture

Every component is composed from a strict atom-molecule-component hierarchy:

```
atoms (35)  -->  molecules (30)  -->  components (74+)
DSButton         DSChatInput          ChatMessage
DSBadge          DSMessageBubble      ReasoningTrace
DSAvatar         DSToolbar            AgentCard
DSInput          DSStepIndicator      OrbVisualizer
DSToggle         DSModelSelector      ...
...              ...
```

**Change an atom, and it propagates everywhere.** Every atom is the single source of truth — used by molecules, which are used by components. No duplication, no drift.

### 4-Level Design Token Architecture

A rigorous token system that maps raw values to component-specific tokens:

```
L1: Raw Values       ->  #4f6d80
L2: Primitives       ->  --moonstone-500: #4f6d80
L3: Semantic          ->  --token-accent: var(--moonstone-500)
L4: Component         ->  --chat-input-ring: var(--token-accent)
```

- **160+ design tokens** covering color, spacing, typography, shadows, motion, and z-index
- **Full light/dark theme** with automatic switching
- **Figma Variables export** — download tokens as Figma-compatible JSON
- **CSS Variables export** — copy-paste ready `:root` and `.dark` blocks
- **Geological Intelligence palette** — mineral-inspired colors: Moonstone (primary), Sunstone (secondary), Olivine (tertiary), Malachite (success), Garnet (error), Ochre (warning), Azurite (info)

### shadcn-Style CLI

Install only what you need. No monolithic package — just copy the source files into your project:

```bash
# Initialize in your project
npx zeros-aiui init

# Add specific components (dependencies auto-resolved)
npx zeros-aiui add ChatMessage ReasoningTrace AgentCard

# List all available components
npx zeros-aiui list

# Show component details and dependency tree
npx zeros-aiui info ChatMessage

# Preview what would change
npx zeros-aiui diff ChatMessage
```

The CLI automatically:
- Resolves the full dependency tree (atoms -> molecules -> components)
- Copies only the required DS layer files
- Rewrites import paths to match your project's alias configuration
- Lists peer dependencies you need to install
- Optionally strips `Demo()` functions for production

### Interactive Documentation

Every component ships with:
- **Live demo** — interactive preview with real state management
- **Props table** — full TypeScript interface documentation
- **Usage examples** — copy-paste code snippets
- **Accessibility notes** — ARIA attributes, keyboard support, reduced motion
- **Token mapping** — which design tokens each component consumes
- **Dependency graph** — what it uses and what uses it

---

## Project Structure

```
src/
  styles/
    tokens.css            # L2 + L3 design tokens (single source of truth)
    theme.css             # Tailwind v4 theme extensions
    fonts.css             # Font imports
    responsive.css        # Responsive utilities
  app/
    components/
      ds/
        atoms.tsx          # 35 atom primitives (DSButton, DSBadge, DSAvatar...)
        atoms-extra.tsx    # Re-exports for backward compatibility
        molecules-base.tsx # 15 core molecules (DSSearchBar, DSToolbar, DSModal...)
        molecules-ai.tsx   # 15 AI/mobile molecules (DSChatInput, DSBottomSheet...)
        molecules.tsx      # Barrel file re-exporting all molecules
      ai/
        *.tsx              # 74+ AI component files, each with exported Demo()
      layout/
        Layout.tsx         # App shell with header, nav, theme toggle
    cli/
      commands.ts          # CLI command implementations (init, add, list, info, diff)
      config.ts            # Configuration schema (zeros-aiui.config.ts)
      resolver.ts          # Dependency tree resolver
      sourceTransformer.ts # Import path rewriting for distribution
      packageScaffold.ts   # npm package structure generator
    data/
      tokenData.ts         # Parses tokens.css into structured collections
      componentRegistry.tsx # Master registry of all 74+ components
      componentDocs.ts     # Props, usage, accessibility documentation
      componentL4Tokens.ts # L4 component-specific token mappings
      cliRegistry.ts       # CLI dependency graph (atoms + molecules + components)
    pages/
      HomePage.tsx         # Gallery with sidebar index + masonry grid
      DesignSystemPage.tsx # Atoms/Molecules/Components explorer
      DSDetailPage.tsx     # Rich detail page (preview, docs, tokens, code)
      DesignTokensPage.tsx # Token documentation with export features
      CLIPage.tsx          # Interactive CLI terminal simulator
```

---

## Token Architecture Deep Dive

### Geological Intelligence Palette

Every color in the system is named after a mineral or geological formation:

| Token Family | Mineral | Role | Light | Dark |
|---|---|---|---|---|
| `--moonstone-*` | Pewter Blue Steel | Primary / Brand | `#4f6d80` | `#6b8598` |
| `--sunstone-*` | Golden Feldspar | Secondary | `#8a6d3b` | `#b29256` |
| `--olivine-*` | Olive Silicate | Tertiary | `#697459` | `#8a9b77` |
| `--malachite-*` | Copper Carbonate | Success | `#2d7a60` | `#6aab8a` |
| `--garnet-*` | Deep Red Silicate | Error | `#b54a4a` | `#d47272` |
| `--ochre-*` | Natural Earth Pigment | Warning | `#9f8136` | `#d4aa55` |
| `--azurite-*` | Copper Carbonate Blue | Info | `#4f6d80` | `#6b8598` |

Each family provides an 11-step scale (50-950) for fine-grained usage.

### Chart Colors (Mineral Series)

```
--token-chart-1: Rhodolite   (rose-gray garnet)
--token-chart-2: Carnelian   (warm terracotta)
--token-chart-3: Feldspar    (golden sandstone)
--token-chart-4: Chalcedony  (cool blue-gray)
--token-chart-5: Serpentine  (sage mineral)
--token-chart-6: Tourmaline  (dusty mauve)
```

---

## Atom Primitives (35)

The foundational building blocks. Every atom supports:
- **Live interaction mode** — tracks hover/focus/active via real mouse events
- **Forced state mode** — pin to `hover`, `focus`, `active`, `disabled`, `loading` for documentation
- **`data-ds-interactive`** — consistent focus-visible ring styling
- **Reduced motion** — respects `prefers-reduced-motion`
- **High contrast** — supports `forced-colors` mode

| Atom | Description |
|---|---|
| `DSButton` | 6 variants (primary, secondary, ghost, outline, destructive, icon) with flash states |
| `DSBadge` | 12 variants including `ai`, `streaming`, `indexing`, `listening`, `capability` |
| `DSAvatar` | User/AI avatar with status indicators and loading state |
| `DSInput` | Text input with validation states and icon slots |
| `DSToggle` | Animated on/off switch |
| `DSTag` | Selectable filter chip with remove action |
| `DSProgress` | Horizontal progress bar with indeterminate mode |
| `DSSkeleton` | Shimmer loading placeholder |
| `DSSpinner` | Animated loading spinner |
| `DSDot` | Status indicator (success, warning, error, accent, pulsing) |
| `DSCheckbox` | Checkbox with label and indeterminate state |
| `DSSlider` | Range slider with value display |
| `DSSelect` | Dropdown with keyboard navigation |
| `DSTextarea` | Auto-growing multi-line input |
| `DSRadio` | Radio button group |
| `DSTooltip` | Hover tooltip with configurable position |
| `DSToast` | Notification toast with semantic variants |
| `DSAlert` | Inline alert banner |
| `DSKbd` | Keyboard shortcut indicator |
| `DSCodeInline` | Inline code snippet |
| `DSDivider` | Horizontal/vertical divider |
| `DSLink` | Styled anchor element |
| `DSTruncate` | Text with ellipsis overflow |
| `DSRating` | Star rating input |
| `DSCounter` | Increment/decrement counter |
| `DSIconButton` | Compact icon-only button |
| `DSAvatarGroup` | Stacked avatar cluster |
| `DSColorBar` | Multi-segment colored bar |
| `DSCollapsible` | Expandable/collapsible section |
| `DSLegendItem` | Color dot + label + value for chart legends |
| `DSStreamingDots` | Animated bouncing dots for streaming state |
| `DSBottomSheetHandle` | Drag handle for mobile bottom sheets |
| `DSSwipeAction` | Swipe action button for mobile rows |
| ...and more | |

---

## Molecule Compositions (30)

Molecules combine atoms into reusable patterns:

**Core Molecules (15):**
`DSSearchBar` | `DSToolbar` | `DSFormField` | `DSTabBar` | `DSHeaderBar` | `DSStepIndicator` | `DSChipGroup` | `DSEmptyState` | `DSToggleRow` | `DSBreadcrumb` | `DSStatDisplay` | `DSListItem` | `DSDropdownMenu` | `DSModal` | `DSPopover`

**AI & Mobile Molecules (15):**
`DSChatInput` | `DSMessageBubble` | `DSTypingIndicator` | `DSTokenCounter` | `DSModelSelector` | `DSPromptCard` | `DSCopyBlock` | `DSNotificationBanner` | `DSFilterBar` | `DSSliderGroup` | `DSBottomSheet` | `DSActionSheet` | `DSBottomNav` | `DSSwipeableRow` | `DSFab`

---

## CLI Configuration

After running `npx zeros-aiui init`, a config file is created:

```typescript
// zeros-aiui.config.ts
export default {
  componentDir: 'src/components/zeros-aiui',
  tokensDir: 'src/styles',
  importAlias: '@/components/zeros-aiui',
  includeDemos: false,
  tailwindVersion: 4,
  typescript: true,
};
```

| Option | Default | Description |
|---|---|---|
| `componentDir` | `src/components/zeros-aiui` | Where component files are copied |
| `tokensDir` | `src/styles` | Where `zeros-tokens.css` is placed |
| `importAlias` | `@/components/zeros-aiui` | Import path prefix in generated code |
| `includeDemos` | `false` | Include `Demo()` functions in output |
| `tailwindVersion` | `4` | Tailwind CSS version (3 or 4) |
| `typescript` | `true` | TypeScript output |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Build | Vite 6 |
| Routing | React Router 7 |
| Icons | Lucide React |
| Charts | Recharts |
| Animation | Motion (Framer Motion) |
| UI Primitives | Radix UI |

---

## Accessibility

Every component is built with accessibility as a first-class concern:

- **`data-ds-interactive`** attribute on all interactive elements for consistent `:focus-visible` ring
- **`aria-disabled`** instead of removing from tab order
- **`aria-busy`** during loading/thinking states
- **`@media (prefers-reduced-motion)`** — all animations and transitions disable gracefully
- **`@media (forced-colors: active)`** — high contrast mode with visible borders and outlines
- **Skip-to-content link** — `.ds-skip-link` class for keyboard navigation
- **Screen reader utilities** — `.ds-sr-only` class for visually hidden labels
- **Minimum touch targets** — `44px` default, `36px` compact

---

## Design Principles

1. **Token-driven, not hardcoded** — Every color, spacing, radius, shadow, and timing value comes from a token. Change the token, change the system.

2. **Composition over configuration** — Components are built by composing atoms and molecules, not by passing dozens of props to a monolith.

3. **AI-first patterns** — Streaming states, confidence indicators, reasoning traces, tool calls — patterns that don't exist in traditional UI kits.

4. **Single source of truth** — Atoms live in one file. Tokens live in one file. Change it once, it propagates everywhere.

5. **Own your code** — The CLI copies source files into your project. No runtime dependency. Fork it, modify it, make it yours.

---

## Browser Support

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari / Chrome for Android

---

## License

MIT

---

## Links

- **Live Site:** [Zeros AI Kit on Figma Make](https://zeros-ai-kit.figma.site)
- **Figma Community:** Coming soon
- **npm:** `npx zeros-aiui`

---

<p align="center">
  <strong>Built with Figma Make</strong><br/>
  A design system for interfaces that don't exist yet.
</p>
