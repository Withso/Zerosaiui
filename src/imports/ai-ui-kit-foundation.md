You are enhancing an AI UI Kit. Your primary goal is to add rich interactions, new use cases, and intelligent behaviors to every component. The visual styling is secondary and should only serve to support these new interactions. First, establish this global foundation using the exact design tokens provided. Do not deviate from these tokens.1. Core Design Tokens (Apply Everywhere):Color Palette: Ingest and apply the full Zeros-AIUI color system, including primitives (Moonstone, Sunstone, Olivine, etc.), semantic colors (background, text, border, accent, status), and the dark theme variant under the .dark class.Typography: Use --token-font-sans for all UI text and --token-font-mono for code. Apply the full type scale (--token-text-2xs to --token-text-4xl), line heights, weights, and letter spacing as defined.Layout & Spacing: All layout must conform to the --token-space-* scale. All radii must use the --token-radius-* scale.Effects & Motion: All shadows must use the --token-shadow-* system. All animations must use the --token-duration-* and --token-ease-* variables.2. Core Interaction Principles (Apply to all relevant components):State Change Animation: All interactive state changes (hover, focus, active) must transition smoothly using --token-duration-fast and --token-ease-default.Focus States: All interactive elements must have a clearly visible focus state using the --token-focus-ring variable for accessibility. Error states should use --token-focus-ring-error.Loading States: Any component that fetches or waits for AI data must have a loading state. Use a shimmer/skeleton for components with defined shapes, and a spinner for actions. The animation should be unobtrusive.Disabled States: All interactive elements must have a disabled state where they are visually muted (opacity 50%) and have the not-allowed cursor.Haptic Feedback (Mobile): For mobile components, specify that key actions (button taps, toggle switches, successful submissions) should trigger subtle haptic feedback.Apply this foundation now. In all subsequent prompts, you will reference these token names, not hex codes or pixel values.




 Atoms (Interaction & Use Case Enhancements)

For each atom, focus on adding the specified behaviors and use cases.




Atom 01 — Button


PROMPT — Button Atom Enhancements
Enhance the Button atom. The existing UI is fine. Focus on adding these new interactions and use cases:1.
AI Action State: Add a new "thinking" state for buttons that trigger an AI process. In this state, the button label is replaced by a centered spinner and the text "Processing...", and the button is disabled.

2.
Post-Action State: After an AI action completes, the button should briefly (1.5s) enter a "success" (showing a checkmark icon and green background from --token-success) or "error" (x-mark icon and red background from --token-error) state before returning to default.

3.
Confirmation Use Case: For destructive actions (e.g., a button labeled "Delete Memory"), clicking it should not perform the action directly. Instead, it should trigger a confirmation modal, which will contain the actual destructive action button.

4.
Long-Press Interaction (Mobile): On mobile, a long-press on a primary button should reveal a contextual menu (a small popover) with secondary actions. For example, long-pressing "Generate" could show "Generate with different model" and "Generate with high detail".

5.
Split Button Use Case: Create a new "Split Button" variant. It consists of a primary action on the left and a dropdown arrow on the right. Clicking the left part executes the default action. Clicking the arrow reveals a menu of alternative actions (e.g., Main: "Reply", Alternatives: "Reply with translation", "Reply with summary").






Atom 02 — Badge


PROMPT — Badge Atom Enhancements
Enhance the Badge atom with new use cases:1.
Live Status Use Case: Create new variants for live AI status. An "Indexing" badge should have a subtle shimmer animation. A "Streaming" badge should have a pulsing dot indicator next to the text. A "Listening" badge should have a small audio waveform icon that reacts to ambient sound.

2.
Model Capability Use Case: Add variants to show model capabilities. A "Web-enabled" badge could have a globe icon. A "Vision-enabled" badge could have an eye icon. These should be small, informative, and use a neutral background (--token-bg-tertiary).

3.
Interactive Count: When a Count badge is clicked, it should trigger an action, like opening the panel that contains the items being counted. Add a hover state that slightly enlarges the badge to signal interactivity.

4.
Token Count Use Case: Create a variant for token counts. It should display a number and, on hover, show a tooltip breaking down the count (e.g., "Input: 4,096, Output: 8,192").






Atom 03 — Avatar


PROMPT — Avatar Atom Enhancements
Enhance the Avatar atom with new interactions and use cases:1.
Status Ring Interaction: The ring around the avatar should communicate agent status. Green (--token-success): Active/Online. Yellow (--token-warning): Thinking/Processing. Gray (--token-text-tertiary): Idle/Offline. The transition between colors should be a smooth animation.

2.
Click Interaction: Clicking an AI avatar should open a popover showing the agent's configuration (model, system prompt, tools). Clicking a User avatar could show their profile.

3.
Multi-Agent Use Case: Create an Avatar Group variant where multiple avatars can overlap in a stack. On hover, the avatars spread out horizontally to reveal all participants. Clicking the group could open a list of all agents in the current context.

4.
Progress Indicator Use Case: When an agent represented by an avatar is performing a long task, the avatar's ring should transform into a circular progress bar, filling up as the task completes.






Atom 04 — Input


PROMPT — Input Atom Enhancements
Enhance the Input atom with new features:1.
Slash Commands: When the user types /, a popover should appear listing available commands (e.g., /summarize, /translate, /search). Selecting a command inserts it and pre-formats the input.

2.
@Mentions: When the user types @, a popover should appear allowing them to reference context items like files (@document.pdf), other agents (@research-agent), or previous messages (@message-5). This turns the mention into a rich token.

3.
Paste Detection: If the user pastes a URL, the input should automatically show a preview of the link. If they paste an image, it should be attached as a thumbnail. This happens client-side before submission.

4.
Draft Autosave: If the user types in the input but doesn't send, the text should be saved as a draft. When they return, the draft is restored. A small "Draft saved" indicator should appear briefly.






Atom 05 — Toggle


PROMPT — Toggle Atom Enhancements
Enhance the Toggle atom with new use cases:1.
Confirmation Use Case: For critical settings (e.g., "Enable Model Training"), toggling it "On" should trigger a confirmation dialog explaining the implications before the state is finalized.

2.
Dependent Settings: If a toggle controls other settings, toggling it "Off" should disable and visually mute the dependent settings below it. Toggling it "On" should enable them with a subtle staggered fade-in animation.

3.
Tri-State Toggle: Add a third, indeterminate state for use cases where a setting is partially applied or inherited. The thumb should be centered and the track a neutral color.






Atom 06 — Tag


PROMPT — Tag Atom Enhancements
Enhance the Tag atom with new interactions:1.
Editable Tag: On double-click, a tag becomes an input field, allowing the user to rename it directly. Pressing Enter saves the change.

2.
Drag-and-Drop Use Case: Make tags draggable. This allows users to drag tags onto items to categorize them, or drag them into a search bar to filter by that tag.

3.
Detailed Tooltip: On hover, show a tooltip that provides more information about the tag, such as its creation date, number of items associated with it, or a brief definition.






Atom 07 — Progress Bar


PROMPT — Progress Bar Atom Enhancements
Enhance the Progress Bar atom with new features:1.
Multi-Stage Progress: Create a variant that shows multiple stages within a single bar. Each segment can have a different color, representing a different part of a process (e.g., Blue for "Downloading", Purple for "Processing").

2.
Cancellable Interaction: Add a small "x" button at the end of the progress bar. Clicking it cancels the ongoing operation and could trigger a confirmation.

3.
Estimated Time Remaining: Below the progress bar, add text that shows the estimated time remaining (e.g., "About 2 minutes left"). This text should update dynamically.






Atom 08 — Skeleton


PROMPT — Skeleton Atom Enhancements
Enhance the Skeleton atom with a new interaction:1.
Content-Aware Sizing: Instead of generic fixed-width lines, the skeleton lines should roughly match the expected size of the content they are replacing. For example, a skeleton for a title should be shorter and thicker than a skeleton for a paragraph.

2.
Staggered Loading: When loading a list of items, the skeletons for each item should not all appear/disappear at once. Instead, they should fade in and out with a slight stagger (e.g., 50ms delay between each item) to feel more organic.






Atom 09 — Divider


PROMPT — Divider Atom Enhancements
Enhance the Divider atom with a new use case:1.
Collapsible Section Divider: Create a new variant where the divider has a chevron icon and a label. Clicking this divider collapses or expands the entire section below it, acting as a section header.






Atom 10 — Keyboard Shortcut


PROMPT — Keyboard Shortcut Atom Enhancements
Enhance the Keyboard Shortcut atom with a new interaction:1.
Click-to-Copy Interaction: When a user clicks on the keyboard shortcut display, the key combination (e.g., "Cmd+K") should be copied to their clipboard as text. Show a brief "Copied!" tooltip upon click.






Atom 11 — Code Inline


PROMPT — Code Inline Atom Enhancements
Enhance the Code Inline atom with a new interaction:1.
Interactive Parameter: When an inline code snippet represents a parameter (e.g., temperature=0.7), hovering over it should reveal a mini-slider or input field, allowing the user to change the value directly in place. Changing it could trigger a re-run of the AI command.






Atom 12 — Spinner


PROMPT — Spinner Atom Enhancements
Enhance the Spinner atom with a new use case:1.
Embedded Text: Add a variant where short, dynamic text can be displayed inside the spinner's empty space (e.g., showing the current step of a multi-step process like "Cloning..." or "Building...").






Atom 13 — Icons


PROMPT — Icons Atom Enhancements
Enhance the Icons set with new use cases:1.
Animated Icons: For key actions, create animated versions. For example, a "trash" icon could animate into an open lid and back. A "send" icon could animate into a paper plane flying off. These animations should trigger on click.

2.
AI-Specific Icons: Ensure the library includes icons for modern AI concepts: agent, thought-process (brain with gears), tool-call (hammer/wrench), context-window, memory, fork-branch, and canvas.






Atom 14 — Dot Indicator


PROMPT — Dot Indicator Atom Enhancements
Enhance the Dot Indicator atom with new interactions:1.
Pulsing for Live Status: The dot should pulse with a soft glow (--token-shadow-accent with the dot's color) to indicate a "live" or "streaming" state. The pulse should be a slow, 2-second loop.

2.
Tooltip on Hover: On hover, the dot should display a tooltip explaining what the status means (e.g., Green dot: "Agent is active and ready").






Atom 15 — Checkbox


PROMPT — Checkbox Atom Enhancements
Enhance the Checkbox atom with a new use case:1.
Indeterminate State: Add a third, "indeterminate" state, represented by a horizontal line inside the box. This is for parent checkboxes in a tree structure where only some of the children are selected. Clicking an indeterminate checkbox should select all children.






Atom 16 — Radio


PROMPT — Radio Atom Enhancements
Enhance the Radio atom with a new use case:1.
Enhanced Selection: When a radio option is selected, in addition to the dot appearing, the entire label and its container should get a subtle background highlight (--token-accent-muted) and a thin border (--token-accent) to make the selection clearer.






Atom 17 — Tooltip


PROMPT — Tooltip Atom Enhancements
Enhance the Tooltip atom with new features:1.
Rich Content: Allow tooltips to contain more than just text. Add support for small images, key-value pairs, and even action buttons within the tooltip popover.

2.
Interactive Tooltip: Add a variant that remains open when the user moves their cursor inside it, allowing them to interact with the content (e.g., click a link or button within the tooltip).






Atom 18 — Textarea


PROMPT — Textarea Atom Enhancements
Enhance the Textarea atom with new features:1.
Auto-Resize: The textarea should automatically grow and shrink vertically to fit the content as the user types, up to a defined maximum height (e.g., 300px), at which point it becomes scrollable.

2.
Token Counter: Add a token counter at the bottom-right corner that updates in real-time as the user types, showing tokens / max_tokens.






Atom 19 — Select


PROMPT — Select Atom Enhancements
Enhance the Select atom with new features:1.
Searchable Dropdown: For long lists of options, the dropdown should include a search input at the top to quickly filter the options.

2.
Option Groups: Add support for grouping options under headings within the dropdown (e.g., grouping models by provider).

3.
Rich Options: Allow each option in the dropdown to have a small icon or avatar next to the label for better visual identification.






Atom 20 — Link


PROMPT — Link Atom Enhancements
Enhance the Link atom with a new interaction:1.
Preview on Hover: For external links, hovering over the link for 1 second should trigger a popover that shows a rich preview of the destination URL (using a service like iFramely or just showing the OpenGraph metadata).






Atom 21 — Slider


PROMPT — Slider Atom Enhancements
Enhance the Slider atom with new features:1.
Value Tooltip: As the user drags the slider thumb, a tooltip should appear above the thumb showing the current exact value.

2.
Tick Marks: Add the ability to show tick marks and labels at specific intervals along the slider track for better context.

3.
Range Slider: Create a variant with two thumbs to allow selecting a range (a min and max value).






Atom 22 — Thumbnail


PROMPT — Thumbnail Atom Enhancements
Enhance the Thumbnail atom with new interactions:1.
Interactive Overlay: On hover, an overlay should appear with action icons like "Preview", "Download", or "Remove".

2.
Selection State: When selected, the thumbnail should have a thick, colored border (--token-accent) and a checkmark icon overlay at the corner.

3.
Progress Overlay: For uploading/processing images, the thumbnail should have a semi-transparent overlay with a circular progress indicator in the center.






Atom 23 — Rating


PROMPT — Rating Atom Enhancements
Enhance the Rating atom with a new interaction:1.
Feedback on Selection: When a user clicks a rating (e.g., a star), it should trigger a small text input to appear below, prompting for optional qualitative feedback (e.g., "Tell us more...").






Atom 24 — Counter


PROMPT — Counter Atom Enhancements
Enhance the Counter atom with a new interaction:1.
Animated Change: When the count value changes, instead of just switching numbers, the numbers should animate. For example, they can quickly scroll/tumble to the new value, drawing attention to the change.






Atom 25 — Segmented Control


PROMPT — Segmented Control Enhancements
Enhance the Segmented Control atom with a new feature:1.
Icon Support: Add a variant where each segment can contain an icon in addition to or instead of a text label, useful for view switchers (e.g., grid view vs. list view).






Atom 26 — Streaming Dots


PROMPT — Streaming Dots Atom Enhancements
Enhance the Streaming Dots atom with a new interaction:1.
State-Aware Animation: The animation speed of the dots should reflect the AI's state. A slow, gentle bounce for "Thinking" and a faster, more energetic bounce for "Generating Response".






Atom 27 — Bottom Sheet Handle


PROMPT — Bottom Sheet Handle Atom Enhancements
Enhance the Bottom Sheet Handle atom with a new interaction:1.
Snap Points: The handle should support snapping to multiple heights (e.g., peeking, half-open, full-screen). Dragging the handle should feel magnetic as it approaches a snap point.






Atom 28 — Swipe Action


PROMPT — Swipe Action Atom Enhancements
Enhance the Swipe Action atom with a new interaction:1.
Progressive Disclosure: As the user swipes further, the background color can change and the icon can become more prominent, indicating a more definitive action. For example, a short swipe is "Archive" (gray), a full swipe is "Delete" (red).






Atom 29 — Pull Indicator


PROMPT — Pull Indicator Atom Enhancements
Enhance the Pull Indicator atom with a new interaction:1.
AI Action on Pull: Instead of just refreshing, pulling down could trigger a contextual AI action. The indicator should show an icon and text for the action (e.g., "Pull to summarize"). The animation should be more engaging, perhaps morphing the arrow into a sparkle icon before triggering.






Atom 30 — Color Bar


PROMPT — Color Bar Atom Enhancements
Enhance the Color Bar atom with a new use case:1.
Context Window Visualization: Use the color bar to represent the composition of the AI's context window. Different colored segments can represent the system prompt, conversation history, and attached files, with the length of each segment proportional to its token count.






Atom 31 — Collapsible


PROMPT — Collapsible Atom Enhancements
Enhance the Collapsible atom with a new interaction:1.
Accordion Behavior: Create a variant where only one collapsible section within a group can be open at a time. Opening a new section automatically closes the previously open one.






Atom 32 — Legend Item


PROMPT — Legend Item Atom Enhancements
Enhance the Legend Item atom with a new interaction:1.
Interactive Filtering: Clicking on a legend item should toggle the visibility of its corresponding data series in the associated chart. The item should visually dim to indicate the data is hidden.






 Molecules (Interaction & Use Case Enhancements)

For each molecule, focus on combining atoms into a smart, interactive unit.




Molecule 01 — Search Bar


PROMPT — Search Bar Molecule Enhancements
Enhance the Search Bar molecule. It uses the Input and Button atoms.1.
AI-Powered Suggestions: As the user types, don't just show past queries. Show AI-generated suggestions for follow-up questions or related concepts. These should appear in a dropdown menu below the search bar.

2.
Scope Selector: Add a dropdown button to the left of the search input that allows the user to define the search scope (e.g., "Search all conversations", "Search web", "Search documents"). The placeholder text should update to reflect the current scope.

3.
Voice Search Interaction: Add a microphone icon button. When tapped, it should initiate a voice search. The bar should display a live waveform and the real-time transcription of the user's speech.






Molecule 02 — List Item


PROMPT — List Item Molecule Enhancements
Enhance the List Item molecule.1.
Swipe Actions (Mobile): On mobile, swiping a list item left should reveal a "Delete" action (red background). Swiping right should reveal an "Archive" or "Pin" action (blue/gray background).

2.
Expandable Detail View: If a list item has more details, show a chevron icon. Tapping the item should expand it in place to reveal the additional information (e.g., a summary, metadata) with a smooth height animation.

3.
Drag Handle for Reordering: Add a drag handle icon. Users should be able to press and hold the handle to lift the item and reorder it within the list. A drop shadow should appear on the lifted item.






Molecule 03 — Message Bubble


PROMPT — Message Bubble Molecule Enhancements
Enhance the Message Bubble molecule. It uses the Avatar and Text atoms.1.
Hover Actions: On desktop, a floating action menu (using Icon Buttons) should appear next to the bubble on hover. Actions should include: "Copy", "Edit", "Regenerate", "Bookmark", and "Branch from here".

2.
Message Streaming Interaction: When an AI message is streaming in, the bubble should have a subtle pulsing glow. A "Stop generating" button should be visible below the message during streaming.

3.
Error State: If an AI response fails, the bubble should have a red border (--token-error) and contain an error message with a "Retry" button.

4.
Long-Press Actions (Mobile): On mobile, a long-press on the bubble should bring up a context menu (Action Sheet) with the same actions as the desktop hover menu.






Molecule 04 — Toolbar


PROMPT — Toolbar Molecule Enhancements
Enhance the Toolbar molecule. It uses Button atoms.1.
Context-Aware Actions: The buttons in the toolbar should dynamically change based on the user's selection or the current view. For example, if text is selected, show text-formatting buttons. If an image is selected, show image-editing buttons.

2.
Customizable Toolbar: Add a "..." button at the end of the toolbar. Clicking it should open a panel where users can drag and drop to add, remove, and reorder the toolbar buttons to their liking.






Molecule 05 — Stat Display


PROMPT — Stat Display Molecule Enhancements
Enhance the Stat Display molecule.1.
Trend Indicator: Next to the main stat value, add a smaller text element showing the change over a period (e.g., "+5.2% vs last week"). This should be color-coded (green for positive, red for negative) and have an up/down arrow icon.

2.
Click to Drill Down: Make the whole component clickable. Clicking it should navigate to a more detailed view or chart that explains the composition of the stat.

3.
Sparkline Visualization: Add a small sparkline chart below the main value to show the trend of the metric over time at a glance.






Molecule 06 — Form Field


PROMPT — Form Field Molecule Enhancements
Enhance the Form Field molecule. It uses Input and Text atoms.1.
Real-time Validation: Don't wait for form submission. Validate the input as the user types. Show a green checkmark for valid input and a red error message for invalid input immediately.

2.
AI-Powered Suggestions: For certain fields, add a "magic" or "sparkle" icon. Clicking it could have the AI suggest a value for that field based on the rest of the form's context.






Molecule 07 — Tab Bar


PROMPT — Tab Bar Molecule Enhancements
Enhance the Tab Bar molecule.1.
Indicator Animation: The active tab indicator (the line below the active tab) should not just appear. It should slide smoothly from the previously active tab to the newly selected one.

2.
Scrollable Tabs: If there are too many tabs to fit, the tab bar should become horizontally scrollable. Fading gradients should appear on the left and right edges to indicate there is more content.

3.
Unsaved Changes Indicator: If a tab's content has unsaved changes, a small dot indicator should appear next to the tab's label.






Molecule 08 — Header Bar


PROMPT — Header Bar Molecule Enhancements
Enhance the Header Bar molecule.1.
Dynamic Title: The header title should be able to dynamically update based on the content below. For example, in a chat, it could show the name of the current AI agent or the topic of the conversation.

2.
Contextual Actions: The action buttons on the right side of the header should be contextual. In a chat view, it might be "New Chat". In a document view, it might be "Share" and "Export".

3.
Scroll Behavior: When the user scrolls down, the header bar should shrink to a more compact height, and the title might fade into a smaller version.






Molecule 09 — Step Indicator


PROMPT — Step Indicator Molecule Enhancements
Enhance the Step Indicator molecule.1.
Live Progress: For AI tasks, the step indicator should update in real-time. The current step should have a pulsing indicator. Completed steps get a checkmark. Upcoming steps are muted.

2.
Clickable Steps: Allow users to click on past steps to view the logs or results from that stage of the process. The current step should not be clickable.

3.
Sub-steps: Support nested or sub-steps. These should be indented and connected with a thinner line to show they are part of a larger parent step.






Molecule 10 — Chip Group


PROMPT — Chip Group Molecule Enhancements
Enhance the Chip Group molecule. It uses Tag atoms.1.
AI-Suggested Chips: In addition to user-defined chips, the group should be able to display AI-suggested chips (with a sparkle icon) that are relevant to the current context. Clicking one adds it to the user's selection.

2.
Multi-Select vs. Single-Select: Add a mode to switch between single-select (like radio buttons) and multi-select (like checkboxes) behavior for the chip group.






Molecule 11 — Empty State


PROMPT — Empty State Molecule Enhancements
Enhance the Empty State molecule.1.
Contextual Actions: The call-to-action button should be contextual. For an empty chat, it should be "Start a new conversation". For an empty file list, it should be "Upload a file".

2.
AI-Powered Suggestions: Below the main message, include a section with AI-powered suggestions to get the user started, like a list of example prompts or actions they can take.






Molecule 12 — Toggle Row


PROMPT — Toggle Row Molecule Enhancements
Enhance the Toggle Row molecule. It uses a Toggle and Text atoms.1.
Info Tooltip: Add a small info icon next to the label. Hovering over it should display a tooltip that explains what the setting does in more detail.

2.
Loading State: If the toggle triggers a server-side change, it should enter a loading state where the toggle is disabled and a small spinner appears next to it until the change is confirmed.






Molecule 13 — Breadcrumb


PROMPT — Breadcrumb Molecule Enhancements
Enhance the Breadcrumb molecule.1.
Dropdown for Siblings: Each breadcrumb item except the last one should have a dropdown arrow. Clicking it reveals a menu of sibling pages at that level, allowing for quick lateral navigation.

2.
Collapsing: If the breadcrumb trail becomes too long, it should collapse intermediate items into a single "..." menu button.






Molecule 14 — Dropdown Menu


PROMPT — Dropdown Menu Molecule Enhancements
Enhance the Dropdown Menu molecule.1.
Sub-Menus: Support nested or sub-menus. Hovering over a menu item with a sub-menu should cause the sub-menu to fly out to the side.

2.
Keyboard Navigation: Ensure full keyboard accessibility. Users should be able to open, close, and navigate items and sub-menus using only the arrow keys, Enter, and Escape.

3.
Descriptive Items: Allow menu items to have a secondary line of text for a brief description, providing more context than just a label.






Molecule 15 — Toast


PROMPT — Toast Molecule Enhancements
Enhance the Toast molecule.1.
Actionable Toasts: Allow toasts to contain an action button (e.g., an "Undo" button after deleting an item). The toast's timer should pause when the user hovers over it.

2.
Stacking: If multiple toasts are triggered, they should stack neatly on top of each other (usually at the top or bottom of the screen), rather than overlapping.






Molecule 16 — Modal


PROMPT — Modal Molecule Enhancements
Enhance the Modal molecule.1.
Non-Blocking Variant: Create a variant that is non-blocking, allowing the user to interact with the content behind the modal. This is useful for things like a find/replace dialog.

2.
Multi-Step Wizard: Add support for a multi-step flow within a modal, using a Step Indicator at the top to show progress.






Molecule 17 — Card


PROMPT — Card Molecule Enhancements
Enhance the Card molecule.1.
Selectable State: Cards should have a selectable state. When selected, they should have a prominent border (--token-accent) and a checkmark overlay. This is for use in grids where a user might select multiple items.

2.
Quick Actions on Hover: On hover, a set of quick action icon buttons should appear at the top-right corner of the card (e.g., "Edit", "Delete", "Share").






Molecule 18 — Alert


PROMPT — Alert Molecule Enhancements
Enhance the Alert molecule.1.
Expandable Details: For complex alerts (especially errors), add a "Show details" link that expands the alert to show more technical information, like an error log or stack trace.






Molecule 19 — Popover


PROMPT — Popover Molecule Enhancements
Enhance the Popover molecule.1.
Interactive Content: Ensure popovers can contain fully interactive content, like forms or sliders, and that they don't close when the user interacts with that content.






Molecule 20 — Avatar Group


PROMPT — Avatar Group Molecule Enhancements
Enhance the Avatar Group molecule. It uses Avatar atoms.1.
Interactive Expansion: On hover, the overlapped avatars should spread out into a row with a smooth animation, revealing the full avatars. A tooltip should show the names of the users/agents.

2.
"+N" Indicator: If there are more avatars than can be shown, the last visible item should be a circle with a number like "+5", indicating how many more participants there are. Clicking this should open a full list.






Molecule 21 — Accordion


PROMPT — Accordion Molecule Enhancements
Enhance the Accordion molecule. It uses Collapsible atoms.1.
Deep Linking: Allow linking directly to a specific, expanded section of an accordion. When the page loads with such a link, the accordion should automatically scroll to and expand that specific section.






Molecule 22 — Pagination


PROMPT — Pagination Molecule Enhancements
Enhance the Pagination molecule.1.
Compact Mode: For smaller spaces, create a compact variant that only shows "Prev" and "Next" buttons along with a page indicator like "Page 5 of 20".

2.
"Load More" Use Case: Add a variant that is just a single "Load More" button, which appends the next page of items to the current list instead of navigating to a new page.






Molecule 23 — Context Menu


PROMPT — Context Menu Molecule Enhancements
Enhance the Context Menu molecule.1.
AI-Powered Suggestions: The top section of the context menu should contain AI-powered, context-aware suggestions. For example, right-clicking on selected text could show "Summarize" or "Translate" as the top actions.






Molecule 24 — Nav Item


PROMPT — Nav Item Molecule Enhancements
Enhance the Nav Item molecule.1.
Notification Badge: The nav item should be able to display a small notification badge (a dot or a count) to indicate new content or updates within that section.






Molecule 25 — File Drop Zone


PROMPT — File Drop Zone Molecule Enhancements
Enhance the File Drop Zone molecule.1.
Active Drag State: When a user is dragging a file over the drop zone, it should become highlighted with a dashed border and a prominent icon and text (e.g., "Drop files to upload").

2.
Multiple File Handling: After dropping multiple files, it should display a list of the uploaded files, each with its own upload progress bar and status.






Molecule 26 — Chat Input


PROMPT — Chat Input Molecule Enhancements
Enhance the Chat Input molecule. It uses Textarea and Button atoms.1.
Context Attachments: Add a button that allows users to attach files, images, or URLs. Attached items should appear as small previews above the text input area.

2.
Voice Mode Toggle: Include a microphone button to switch to voice input mode. In this mode, the text area is replaced by a voice waveform visualizer.

3.
Stop Button: When the AI is generating a response, the "Send" button should transform into a "Stop" button, allowing the user to interrupt the generation.






Molecule 27 — Typing Indicator


PROMPT — Typing Indicator Molecule Enhancements
Enhance the Typing Indicator molecule. It uses Avatar and Streaming Dots atoms.1.
Multi-User Support: It should be able to show when multiple different users or agents are typing at the same time, by displaying their avatars next to the typing dots.






Molecule 28 — Token Counter


PROMPT — Token Counter Molecule Enhancements
Enhance the Token Counter molecule.1.
Visual Breakdown: On hover, the counter should show a tooltip with a small bar chart that visually breaks down the token usage (e.g., System Prompt, User Input, History).






Molecule 29 — Model Selector


PROMPT — Model Selector Molecule Enhancements
Enhance the Model Selector molecule.1.
Model Comparison: The dropdown should include a "Compare" button next to each model. This allows a user to select multiple models to see a side-by-side comparison of their features and pricing in a modal.

2.
Capability Tags: Each model in the dropdown should have small tags indicating its capabilities (e.g., "Vision", "Web Search", "128k Context").






Molecule 30 — Prompt Card


PROMPT — Prompt Card Molecule Enhancements
Enhance the Prompt Card molecule.1.
"Try It" Interaction: Each prompt card should have a "Try It" button that, when clicked, instantly populates the main chat input with that prompt's text.

2.
Use Case Tags: Add tags to each card to categorize the prompts (e.g., "Creative", "Analysis", "Coding"). These tags should be clickable to filter the list of prompts.






Molecule 31 — Copy Block


PROMPT — Copy Block Molecule Enhancements
Enhance the Copy Block molecule.1.
One-Click Copy: The entire block should be clickable to copy the content, not just the copy button. The button should primarily serve as a visual affordance.

2.
Success Animation: When the content is copied, the "Copy" icon should briefly animate into a "Checkmark" icon before reverting.






Molecule 32 — Notification Banner


PROMPT — Notification Banner Molecule Enhancements
Enhance the Notification Banner molecule.1.
Snooze Action: Add a "Snooze" action that temporarily dismisses the notification for a period of time (e.g., 1 hour, 1 day).






Molecule 33 — Filter Bar


PROMPT — Filter Bar Molecule Enhancements
Enhance the Filter Bar molecule.1.
Active Filter Summary: Add a text summary that clearly states the active filters (e.g., "Showing results for 'AI' in 'Documents' sorted by 'Newest'").

2.
"Clear All" Button: A button to quickly remove all active filters and reset the view to its default state.






Molecule 34 — Slider Group


PROMPT — Slider Group Molecule Enhancements
Enhance the Slider Group molecule. It uses Slider atoms.1.
Reset to Default: Each slider should have a small "Reset" button that returns it to its default value. The group should also have a "Reset All" button.






Molecule 35 — Bottom Sheet


PROMPT — Bottom Sheet Molecule Enhancements
Enhance the Bottom Sheet molecule.1.
Dynamic Height: The sheet's height should be able to dynamically adjust to fit its content, rather than being fixed to a few snap points.






Molecule 36 — Action Sheet


PROMPT — Action Sheet Molecule Enhancements
Enhance the Action Sheet molecule.1.
Destructive Action Styling: Destructive actions (like "Delete") should be styled differently (using --token-error color) to distinguish them from regular actions.

2.
Cancel Button: The last item should always be a visually distinct "Cancel" button that closes the sheet.






Molecule 37 — Bottom Nav


PROMPT — Bottom Nav Molecule Enhancements
Enhance the Bottom Nav molecule.1.
Notification Badges: Each nav item should support showing a notification dot or count badge, indicating new activity in that section.






Molecule 38 — Swipeable Row


PROMPT — Swipeable Row Molecule Enhancements
Enhance the Swipeable Row molecule.1.
Haptic Feedback: As the user swipes and reveals the actions, provide subtle haptic feedback. A stronger feedback pulse should occur when an action is triggered.






Molecule 39 — FAB (Floating Action Button)


PROMPT — FAB Molecule Enhancements
Enhance the FAB molecule.1.
Expanded Actions: Tapping the FAB can optionally reveal a small menu of related, secondary actions that animate out from the main button.






 Components (Interaction & Use Case Enhancements)

This is where the magic happens. These prompts combine atoms and molecules to build complex, feature-rich AI components.




CHAT Components




Component 01 — Welcome Screen


PROMPT — Welcome Screen Component Enhancements
Enhance the Welcome Screen component. It uses Prompt Card molecules.1.
Dynamic Suggestions: Instead of static examples, the prompt suggestion cards should be dynamically generated based on the user's recent activity or popular queries. Include a "Refresh suggestions" button.

2.
Onboarding Use Case: For first-time users, the welcome screen should feature a mini-onboarding flow. This could be a series of 2-3 cards that explain the key features of the AI, with a final card being a "Let's get started" prompt.

3.
Contextual Header: The welcome message (e.g., "How can I help you today?") should be contextual. If the user has a project open, it could say, "Ready to continue with Project X?"






Component 02 — Chat History


PROMPT — Chat History Component Enhancements
Enhance the Chat History component. It uses Message Bubble molecules.1.
Conversation Forking: On hover over any AI message, a "Branch" or "Fork" icon should appear. Clicking it starts a new chat from that specific point, preserving the history up to that message. The original chat should show a small indicator that a branch was created.

2.
Pinning Messages: Allow users to "pin" important messages (both user and AI). Pinned messages are collected in a separate "Pinned" tab or a sidebar for easy reference.

3.
Summarization Action: Include a "Summarize conversation" button at the top of the history. Clicking it should prompt the AI to generate a concise summary of the entire chat so far, which could be displayed in a popover or a new message.






Component 03 — Multi-Modal Input


PROMPT — Multi-Modal Input Component Enhancements
Enhance the Multi-Modal Input component. It uses Chat Input and File Drop Zone molecules.1.
Rich Context Previews: When a user attaches a file, URL, or image, don't just show the filename. Show a rich preview thumbnail. For images, show the image. For URLs, show the page title and a favicon. For documents, show the file type icon and page count.

2.
Drag-and-Drop Reordering: Allow the user to drag and drop the attached context items to reorder them before sending the prompt. This can influence how the AI prioritizes the context.

3.
Paste-to-Attach: The input area should listen for paste events. If an image is pasted from the clipboard, it should be automatically attached. If a URL is pasted, it should create a URL attachment.






PROCESSING Components




Component 14 — Thinking Indicator


PROMPT — Thinking Indicator Component Enhancements
Enhance the Thinking Indicator component.1.
State-Aware Text: Next to the animation, display text that provides more context about what the AI is doing. This text should be dynamic, changing from "Thinking..." to "Searching web..." to "Analyzing data..." based on the agent's current action.

2.
Estimated Time: For long-running tasks, display an estimated time remaining. This can be a simple text string like "(about 30 seconds)" and should update as the task progresses.






Component 15 — Reasoning Trace


PROMPT — Reasoning Trace Component Enhancements
Enhance the Reasoning Trace component. It uses the Step Indicator molecule.1.
Interactive Steps: Make each step in the trace interactive. Clicking on a completed step should expand it to show the specific inputs and outputs of that step (e.g., the exact API call made and the data returned).

2.
Live Highlighting: The currently executing step should be highlighted with a pulsing background or a prominent border to draw the user's attention.

3.
Replay Interaction: Add a "Replay" button that allows the user to watch the reasoning process unfold again, with each step highlighting in sequence.






Component 16 — Tool Call


PROMPT — Tool Call Component Enhancements
Enhance the Tool Call component.1.
Parameter Visibility: By default, the tool call should be collapsed. It should show the tool's icon, name, and status (Running, Completed, Failed). Clicking it should expand to show the exact parameters that were sent to the tool.

2.
Human-Readable Summary: In the expanded view, in addition to the raw output, provide a simple, human-readable summary of the tool's result (e.g., "Found 5 relevant articles" for a web search tool).

3.
Multiple Calls View: When multiple tools are called in parallel, they should be displayed as a group of cards. The group should have a header indicating that multiple tools are running, and each card can update its status independently.






Component 17 — Analysis Progress


PROMPT — Analysis Progress Component Enhancements
Enhance the Analysis Progress component.1.
Cancellable Stages: Each stage in the analysis pipeline should have a cancel button. This allows the user to stop the entire process if they see it's not going in the right direction.

2.
Partial Results: If a stage is cancelled or fails, the component should still display the results from the successfully completed stages, rather than showing nothing.






RESPONSE Components




Component 21 — Code Block


PROMPT — Code Block Component Enhancements
Enhance the Code Block component.1.
Live Preview/Execution: For supported languages (like HTML/CSS/JS or Python), add a "Run" or "Preview" button. Clicking it should open a new panel next to or below the code block that shows the rendered output or the result of the code execution.

2.
Inline Editing: Allow the user to edit the code directly within the code block. Add a "Save" or "Apply" button that appears when the code is modified.

3.
Diff View: If the AI suggests changes to a block of code, it should be presented in a diff view, with deletions highlighted in red and additions in green.






Component 22 — Feedback Actions


PROMPT — Feedback Actions Component Enhancements
Enhance the Feedback Actions component.1.
Qualitative Feedback: When a user clicks the "thumbs down" button, don't just register the vote. Open a small popover with a multi-choice question (e.g., "What was wrong? - Inaccurate, - Unhelpful, - Harmful") and an optional text field for more detailed feedback.

2.
Regenerate with Options: The "Regenerate" button should have a small dropdown arrow next to it. Clicking the main button regenerates the response. Clicking the arrow reveals options like "Regenerate with different model" or "Regenerate with more detail".






Component 23 — Source Citation


PROMPT — Source Citation Component Enhancements
Enhance the Source Citation component.1.
Inline Citation Highlighting: When the user hovers over a source in the citation list, the parts of the AI's response that were derived from that source should be highlighted in the main message body.

2.
Relevance Ranking: The sources should be ordered by their relevance or contribution to the response, not just alphabetically or numerically. The most influential source should be listed first.

3.
Verification Status: Each source should have a small badge indicating its verification status (e.g., "Verified Source", "Community Note", "Unverified").






Component 24 — File Attachment


PROMPT — File Attachment Component Enhancements
Enhance the File Attachment component.1.
Interactive Previews: For document types like PDFs or presentations, clicking the attachment should open an interactive preview in a modal, allowing the user to page through the document without downloading it.

2.
AI-Generated Summary: On hover, the attachment could show a tooltip with a one-sentence, AI-generated summary of the file's content.






Component 25 — Inline Actions


PROMPT — Inline Actions Component Enhancements
Enhance the Inline Actions component.1.
Custom Actions: The floating toolbar should be customizable. Include a "+" or "Add Action" button that allows users to create their own custom prompt-based actions (e.g., create an action that translates selected text to pirate speak).

2.
Chainable Actions: After an inline action is performed, the result should also have inline actions, allowing for a chain of refinements (e.g., Highlight -> Simplify -> Expand on this point -> Translate).






Component 26 — Artifact Viewer


PROMPT — Artifact Viewer Component Enhancements
Enhance the Artifact Viewer component.1.
Real-time Collaboration: The code in the artifact should be editable by multiple users in real-time, with cursors and selections visible, similar to a Google Doc or Figma.

2.
Version History: The viewer should have a version history feature. A slider or a dropdown should allow the user to see and revert to previous versions of the artifact.

3.
MCP Integration: The artifact should be able to connect to external tools via MCP. For example, a React component artifact could have a button to deploy it directly to Vercel.






Component 27 — Variations Picker


PROMPT — Variations Picker Component Enhancements
Enhance the Variations Picker component.1.
Diff to Original: Each variation card should have a toggle or button that shows a "diff" view, highlighting what specifically is different between this variation and the original response.

2.
AI-Recommended Choice: One of the variations could be badged with "Recommended", indicating that the AI believes this is the best option based on the prompt.






Component 28 — Comparison View


PROMPT — Comparison View Component Enhancements
Enhance the Comparison View component.1.
Semantic Diffing: Instead of just a plain text diff, the comparison should be semantic. For code, it should understand syntax. For writing, it could highlight changes in tone or style, not just word changes.

2.
Merge Interaction: Allow the user to pick and choose specific changes from the revised version to apply to the original, rather than just accepting or rejecting all changes.






VOICE Components




Component 33 — Voice Waveform


PROMPT — Voice Waveform Component Enhancements
Enhance the Voice Waveform component.1.
Speaker Diarization: For conversations with multiple speakers, the waveform should change color to indicate who is speaking. For example, User is blue (--token-accent), AI is purple (--token-chart-2).

2.
Scrubbable Interaction: The entire waveform should be a scrubbable timeline. The user can drag their finger or mouse across it to quickly seek to different parts of the audio, with the timestamp updating in real-time.






Component 34 — Audio Player


PROMPT — Audio Player Component Enhancements
Enhance the Audio Player component.1.
Transcript Sync: As the audio plays, the corresponding text in the transcript (a separate component) should be highlighted word-by-word.

2.
Clip Sharing: Allow users to select a portion of the audio waveform. A "Share Clip" button should appear, allowing them to share a link that plays only the selected segment.






Component 35 — Voice Selector


PROMPT — Voice Selector Component Enhancements
Enhance the Voice Selector component.1.
Voice Cloning Use Case: Add a "Create a new voice" flow. This should guide the user through the process of recording a few sentences to create a clone of their own voice, showing them the progress as the new voice model is trained.

2.
Style Options: For each voice, include a dropdown with different speaking styles (e.g., "Conversational", "Newscaster", "Excited"). Previewing the voice should reflect the selected style.






Component 37 — Orb Visualizer


PROMPT — Orb Visualizer Component Enhancements
Enhance the Orb Visualizer component.1.
State Transitions: The animation between states (e.g., from listening to thinking) should be a smooth, fluid morph, not a sudden switch. The orb could momentarily contract and then expand into the new state's animation.

2.
Error State: Add an error state where the orb might glitch, turn red (--token-error), and vibrate before displaying an error message.

3.
User Input Reactivity: The orb should not only react to audio but also to user input. For example, it could subtly tilt or orient itself towards the user's cursor as it moves across the screen.






RESEARCH Components




Component 38 — Research Card


PROMPT — Research Card Component Enhancements
Enhance the Research Card component.1.
"Add to Context" Action: Each card should have an "Add to Context" button. Clicking it adds the source document to the AI's context window for the next prompt.

2.
Inline Summary: Include a button to "Show AI Summary". Clicking it expands the card to show a bulleted summary of the source, generated by the AI.






Component 39 — Insight Card


PROMPT — Insight Card Component Enhancements
Enhance the Insight Card component.1.
Actionable Insights: The insight should be actionable. For example, a "Risk" insight could have a button to "Generate mitigation strategies". An "Opportunity" insight could have a button to "Draft an action plan".

2.
Source Linking: The insight should be explicitly linked to the source cards it was derived from. On hover, it could highlight the relevant source cards in the UI.






Component 40 — Confidence Score


PROMPT — Confidence Score Component Enhancements
Enhance the Confidence Score component.1.
Explainability: When the user clicks on the score, it should open a popover that explains why the AI has that level of confidence, listing the supporting and conflicting evidence it found.






IMAGE Components




Component 44 — Image Gen Grid


PROMPT — Image Gen Grid Component Enhancements
Enhance the Image Gen Grid component.1.
Upscale & Refine Flow: The "Upscale" action shouldn't just enlarge the image. It should open the selected image in a new view with options to upscale to different resolutions and a "Refine Details" button that runs another AI process to add more detail.

2.
"Use as reference" Interaction: Add an action button to "Use as reference". This takes the selected image and puts it into a special input slot, allowing the user to use it as a reference (an "image prompt") for the next generation.






Component 45 — Image Editor


PROMPT — Image Editor Component Enhancements
Enhance the Image Editor component.1.
Generative Fill (Inpainting/Outpainting): The core feature should be generative fill. The user should be able to select an area of the image (or an area outside the image for outpainting) and type a prompt to fill that area with AI-generated content.

2.
History Brush: Add a history panel that shows a list of all edits. The user should be able to click on any previous state to revert the image to that point.






AGENTIC Components




Component 46 — Agent Card


PROMPT — Agent Card Component Enhancements
Enhance the Agent Card component.1.
Pause & Resume: The agent's task should be pausable. When paused, the progress bar stops and the status shows "Paused". A "Resume" button should appear.

2.
Live Log Streaming: Clicking the card should open a detailed view that includes a live-streaming log of the agent's thoughts and actions, providing full transparency.






Component 48 — Canvas Workspace


PROMPT — Canvas Workspace Component Enhancements
Enhance the Canvas Workspace component.1.
Node-Based Workflow: This should be a full node-based AI workflow editor like Flora AI. Users can drag in different AI models (nodes), connect them, and run complex chains. Each node should show its status (running, completed, error).

2.
Real-time Collaboration: The canvas should be collaborative, allowing multiple users to build and edit workflows together in real-time, with their cursors visible on the canvas.






SYSTEM Components




Component 49 — Model Selector (Component)


PROMPT — Model Selector Component Enhancements
Enhance the Model Selector component.1.
A/B Test Mode: Add a feature to select two models to run in an A/B test. The next prompt will be sent to both models, and their responses will be shown side-by-side for comparison.






Component 51 — Context Window


PROMPT — Context Window Component Enhancements
Enhance the Context Window component.1.
Interactive Segments: The segments in the context bar should be interactive. Clicking on the "Conversation History" segment could open a view where the user can selectively remove messages from the history to free up space.

2.
Context Compression: The "Compress context" button should trigger an AI process that summarizes the oldest parts of the conversation, replacing the detailed messages with a concise summary, thus freeing up tokens.






Component 54 — Memory Manager


PROMPT — Memory Manager Component Enhancements
Enhance the Memory Manager component.1.
Inferred Memories: The AI should be able to infer and suggest new memories. These should appear as "suggested" items that the user can approve or reject. For example, if a user repeatedly asks for code in Python, the AI could suggest, "Should I remember that you prefer Python?"

2.
Temporary Memory: Add a toggle to make a memory item "temporary" or "session-only", meaning it will be forgotten after the current session ends.






Component 55 — MCP Connector


PROMPT — MCP Connector Component Enhancements
Enhance the MCP Connector component.1.
Permissions Management: When expanding a connector's details, it should show a granular list of permissions the tool has (e.g., "Read calendar", "Write to Google Docs"). The user should be able to enable or disable these permissions individually with toggles.






Component 56 — Cost Estimator


PROMPT — Cost Estimator Component Enhancements
Enhance the Cost Estimator component.1.
Pre-flight Cost Check: Before running a complex agent or query, the AI should present a cost estimate. The user must approve the estimated cost before the task begins.






REAL-WORLD AI Components




Component 70 — Voice Transcription


PROMPT — Voice Transcription Component Enhancements
Enhance the Voice Transcription component.1.
AI-Powered Editing: When a user clicks to edit the transcript, the AI should provide suggestions. For example, it could automatically correct spelling and grammar, or suggest better phrasing.

2.
Action Item Detection: The component should automatically detect and highlight potential action items within the transcript (e.g., "I will send the report by Friday"). The user can then click a button to add these to a to-do list.






Component 71 — Meeting Notes


PROMPT — Meeting Notes Component Enhancements
Enhance the Meeting Notes component.1.
Interactive Summary: The AI-generated summary should be interactive. Hovering over a sentence in the summary should highlight the corresponding section in the full transcript where that point was discussed.

2.
Shareable Report: The "Export" function should generate a clean, well-formatted report (PDF or Markdown) that includes the summary, key points, and action items, ready to be shared with stakeholders.






Component 72 — AI Command Palette


PROMPT — AI Command Palette Component Enhancements
Enhance the AI Command Palette component.1.
Chained Commands: Allow the user to type and chain multiple commands together. For example, `find
find document about 'Q1 sales' | summarize | email to marketing team". The palette should show the planned steps and ask for confirmation before executing.

2.
Contextual Awareness: The commands available in the palette should be aware of the user's current context. If they are viewing a code file, it should suggest code-related commands. If they are viewing a design, it should suggest design-related commands.






Component 74 — Conversation Fork


PROMPT — Conversation Fork Component Enhancements
Enhance the Conversation Fork component.1.
Merge Interaction: Add a "Merge" feature. The user should be able to select two or more branches and ask the AI to merge the key insights from them into a single, consolidated response in the main branch.

2.
Visual Tree View: In a sidebar or a modal, display a visual tree diagram of the entire conversation, showing the main trunk and all the branches. The user can click on any node in the tree to jump to that point in the conversation.






Part 5 — Final Polish & Interaction Audit Prompt

After applying all the individual prompts above, paste this final prompt to ensure all the new interactions are consistent and feel right.


PROMPT — Final Polish & Interaction Audit
You have now enhanced all atoms, molecules, and components with new interactions and use cases. Now, perform a final audit of the entire kit to ensure behavioral and interactional consistency.1.
Interaction Consistency:

•
Hover/Focus: Verify that all interactive elements have consistent and smooth hover and focus states as defined in the Global Foundation.

•
Loading: Ensure all components that involve waiting for an AI response use a consistent loading pattern (e.g., a shimmer for content, a spinner for actions).

•
Animations: Check that all animations (state changes, entrances, exits) use the timings and easing curves from the --token-motion-* tokens. The feel should be quick but smooth, never jarring.



2.
Use Case Completeness:

•
Destructive Actions: Double-check that all destructive actions (e.g., Delete, Clear, Remove) trigger a confirmation modal before proceeding.

•
Empty States: Ensure every component that can display a list of items (e.g., Chat History, File Lists, Search Results) has a well-designed empty state with a clear call to action.



3.
AI Behavior Unification:

•
Cancellations: Verify that any long-running AI process (generation, analysis, tool calls) can be cancelled by the user.

•
Error Handling: Ensure that all components that can fail have a clear error state that provides a user-friendly message and a "Retry" or "Dismiss" action.



Apply all fixes silently. The goal is a polished, cohesive, and intelligent UI kit where every part feels like it belongs to the same smart system.




