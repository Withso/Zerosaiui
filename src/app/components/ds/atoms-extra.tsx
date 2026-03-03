/* ================================================
   Design System — Extra Atom Primitives (Re-exports)
   
   These atoms now live in atoms.tsx as the single source
   of truth. This file re-exports them for backward
   compatibility with existing import paths.
   ================================================ */
export {
  DSColorBar,
  DSCollapsible,
  DSLegendItem,
} from './atoms';

export type {
  DSColorBarProps,
  DSColorBarSegment,
  DSCollapsibleProps,
  DSLegendItemProps,
} from './atoms';
