/* ================================================
   Design System — Molecule Barrel File
   Re-exports all molecules from core + AI modules.
   ================================================ */

/* Core molecules (original) */
export {
  DSSearchBar, DSToolbar, DSFormField, DSTabBar, DSHeaderBar,
  DSStepIndicator, DSChipGroup, DSEmptyState, DSToggleRow,
  DSBreadcrumb, DSStatDisplay, DSListItem, DSDropdownMenu,
  DSModal, DSPopover,
} from './molecules-base';

export type {
  DSSearchBarProps, DSToolbarAction, DSToolbarProps, DSFormFieldProps,
  DSTabBarProps, DSHeaderBarProps, DSStepIndicatorStep, DSStepIndicatorProps,
  DSChipGroupProps, DSEmptyStateProps, DSToggleRowProps, DSBreadcrumbProps,
  DSStatDisplayProps, DSListItemProps, DSDropdownMenuItem, DSDropdownMenuProps,
  DSModalProps, DSPopoverProps,
} from './molecules-base';

/* AI + Mobile molecules (new) */
export {
  DSChatInput, DSMessageBubble, DSTypingIndicator, DSTokenCounter,
  DSModelSelector, DSPromptCard, DSCopyBlock, DSNotificationBanner,
  DSFilterBar, DSSliderGroup,
  DSBottomSheet, DSActionSheet, DSBottomNav, DSSwipeableRow, DSFab,
} from './molecules-ai';

export type {
  DSChatInputProps, DSMessageBubbleProps, DSTypingIndicatorProps,
  DSTokenCounterProps, DSModelSelectorModel, DSModelSelectorProps,
  DSPromptCardProps, DSCopyBlockProps, DSNotificationBannerProps,
  DSFilterBarProps, DSSliderGroupParam, DSSliderGroupProps,
  DSBottomSheetProps, DSActionSheetAction, DSActionSheetProps,
  DSBottomNavItem, DSBottomNavProps, DSSwipeableRowProps, DSFabProps,
} from './molecules-ai';