/* ================================================
   CLI Configuration — zeros-aiui
   
   Defines the config schema for zeros-aiui.config.ts
   that lives in the user's project root.
   ================================================ */

export interface ZerosConfig {
  /** Directory where components are installed (relative to project root) */
  componentDir: string;
  /** Directory where tokens CSS is placed */
  tokensDir: string;
  /** Import alias used in the project (e.g. @/ or ~/) */
  importAlias: string;
  /** Whether to include Demo() functions when copying components */
  includeDemos: boolean;
  /** Tailwind CSS version (3 or 4) */
  tailwindVersion: 3 | 4;
  /** TypeScript enabled */
  typescript: boolean;
}

export const DEFAULT_CONFIG: ZerosConfig = {
  componentDir: 'src/components/zeros-aiui',
  tokensDir: 'src/styles',
  importAlias: '@/components/zeros-aiui',
  includeDemos: false,
  tailwindVersion: 4,
  typescript: true,
};

/** Template for zeros-aiui.config.ts */
export function generateConfigFile(config: Partial<ZerosConfig> = {}): string {
  const merged = { ...DEFAULT_CONFIG, ...config };
  return `/** @type {import('zeros-aiui').ZerosConfig} */
export default {
  componentDir: '${merged.componentDir}',
  tokensDir: '${merged.tokensDir}',
  importAlias: '${merged.importAlias}',
  includeDemos: ${merged.includeDemos},
  tailwindVersion: ${merged.tailwindVersion},
  typescript: ${merged.typescript},
};
`;
}

/** Template for the CSS import the user adds to their global stylesheet */
export function generateCSSImport(config: ZerosConfig): string {
  return `/* Add this to your global CSS file (e.g. src/index.css or src/globals.css) */
@import './${config.tokensDir}/zeros-tokens.css';
`;
}
