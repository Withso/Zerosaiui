/* ================================================
   Dependency Resolver — zeros-aiui CLI
   
   Given a list of component IDs the user wants to add,
   resolves the full dependency tree and determines:
   - Which files to copy
   - Which DS layer files are needed
   - Which peer deps to install
   - Which tokens are consumed
   ================================================ */

import {
  cliRegistry,
  resolveDependencies,
  type CLIComponentEntry,
} from '../data/cliRegistry';

/* ——————————————————————————————————————————
   Types
   —————————————————————————————————————————— */

export interface ResolvedPlan {
  /** Components the user explicitly requested */
  requested: CLIComponentEntry[];
  /** All resolved entries (deps included), topologically sorted */
  all: CLIComponentEntry[];
  /** Unique files to copy, grouped by layer */
  files: {
    tokens: string[];
    atoms: string[];
    molecules: string[];
    components: string[];
  };
  /** npm packages user needs to install */
  peerDependencies: string[];
  /** CSS tokens consumed */
  tokens: string[];
  /** Warnings (e.g. unknown IDs) */
  warnings: string[];
}

/* ——————————————————————————————————————————
   File grouping logic
   —————————————————————————————————————————— */

const FILE_GROUPS = {
  atoms: new Set(['components/ds/atoms.tsx']),
  atomsExtra: new Set(['components/ds/atoms-extra.tsx']),
  moleculesBase: new Set(['components/ds/molecules-base.tsx']),
  moleculesAI: new Set(['components/ds/molecules-ai.tsx']),
  moleculesBarrel: new Set(['components/ds/molecules.tsx']),
};

function classifyFile(file: string): 'tokens' | 'atoms' | 'molecules' | 'components' {
  if (file.includes('tokens')) return 'tokens';
  if (file.includes('atoms')) return 'atoms';
  if (file.includes('molecules')) return 'molecules';
  return 'components';
}

/* ——————————————————————————————————————————
   Main resolver
   —————————————————————————————————————————— */

export function resolve(ids: string[]): ResolvedPlan {
  const warnings: string[] = [];
  const requested: CLIComponentEntry[] = [];
  const allMap = new Map<string, CLIComponentEntry>();

  /* Resolve each requested ID */
  for (const id of ids) {
    const entry = cliRegistry.find(c => c.id === id);
    if (!entry) {
      warnings.push(`Unknown component: "${id}"`);
      continue;
    }
    requested.push(entry);

    const resolved = resolveDependencies(id);
    for (const dep of resolved) {
      if (!allMap.has(dep.id)) {
        allMap.set(dep.id, dep);
      }
    }
  }

  const all = Array.from(allMap.values());

  /* Collect unique files */
  const fileSet = new Set<string>();
  for (const entry of all) {
    fileSet.add(entry.file);
  }

  /* Determine if molecules barrel is needed */
  const needsMolBase = all.some(e => e.type === 'molecule');
  const needsMolAI = all.some(e => e.type === 'molecule-ai');
  if (needsMolBase || needsMolAI) {
    fileSet.add('components/ds/molecules.tsx');
  }

  /* Group files by layer */
  const files: ResolvedPlan['files'] = {
    tokens: ['tokens.css'],
    atoms: [],
    molecules: [],
    components: [],
  };

  for (const f of fileSet) {
    const group = classifyFile(f);
    if (group === 'tokens') continue; /* tokens always included */
    files[group].push(f);
  }

  /* Sort for deterministic output */
  files.atoms.sort();
  files.molecules.sort();
  files.components.sort();

  /* Collect peer deps */
  const peerSet = new Set<string>();
  for (const entry of all) {
    for (const p of entry.peerDependencies) {
      peerSet.add(p);
    }
  }
  /* React is always required but not listed */
  peerSet.delete('react');
  const peerDependencies = [...peerSet].sort();

  /* Collect tokens */
  const tokenSet = new Set<string>();
  for (const entry of all) {
    for (const t of entry.tokens) {
      tokenSet.add(t);
    }
  }
  const tokens = [...tokenSet].sort();

  return {
    requested,
    all,
    files,
    peerDependencies,
    tokens,
    warnings,
  };
}

/* ——————————————————————————————————————————
   Import path rewriter
   —————————————————————————————————————————— */

export interface RewriteOptions {
  /** The import alias prefix (e.g. '@/components/zeros-aiui') */
  alias: string;
  /** Whether to strip Demo functions */
  stripDemos: boolean;
}

/**
 * Rewrites import paths in a component source file.
 * Transforms internal DS references to the user's configured alias.
 * 
 * Examples:
 *   '../ds/atoms'       -> '@/components/zeros-aiui/atoms'
 *   '../ds/atoms-extra' -> '@/components/zeros-aiui/atoms-extra'
 *   '../ds/molecules'   -> '@/components/zeros-aiui/molecules'
 */
export function rewriteImports(source: string, opts: RewriteOptions): string {
  let result = source;

  /* Rewrite DS import paths */
  result = result.replace(
    /from\s+['"]\.\.\/ds\/(atoms-extra|atoms|molecules-ai|molecules-base|molecules)['"]/g,
    (_, mod) => `from '${opts.alias}/${mod}'`
  );

  /* Strip Demo functions if requested */
  if (opts.stripDemos) {
    result = stripDemoExport(result);
  }

  return result;
}

/**
 * Removes the exported Demo() function and its associated sample data.
 * Finds the last `export function *Demo()` block and everything after it.
 */
function stripDemoExport(source: string): string {
  /* Find the Demo function export */
  const demoPattern = /\n(?:\/\*[\s\S]*?\*\/\s*)?(?:const\s+sample\w+[\s\S]*?)?\nexport\s+function\s+\w+Demo\s*\(/;
  const match = source.match(demoPattern);
  if (!match || match.index === undefined) return source;

  /* Return everything before the Demo block */
  return source.substring(0, match.index).trimEnd() + '\n';
}

/* ——————————————————————————————————————————
   CLI output formatters
   —————————————————————————————————————————— */

export function formatAddCommand(ids: string[]): string {
  return `npx zeros-aiui add ${ids.join(' ')}`;
}

export function formatInstallOutput(plan: ResolvedPlan): string[] {
  const lines: string[] = [];
  
  lines.push('');
  lines.push(`  Resolving dependencies...`);
  lines.push('');

  if (plan.warnings.length > 0) {
    for (const w of plan.warnings) {
      lines.push(`  \u26a0  ${w}`);
    }
    lines.push('');
  }

  /* Files to be created */
  lines.push('  Files to install:');
  lines.push('');
  
  if (plan.files.atoms.length > 0) {
    for (const f of plan.files.atoms) {
      lines.push(`    + ${f.replace('components/', '')}`);
    }
  }
  if (plan.files.molecules.length > 0) {
    for (const f of plan.files.molecules) {
      lines.push(`    + ${f.replace('components/', '')}`);
    }
  }
  for (const f of plan.files.components) {
    lines.push(`    + ${f.replace('components/', '')}`);
  }
  lines.push(`    + tokens.css`);
  lines.push('');

  /* Peer deps */
  if (plan.peerDependencies.length > 0) {
    lines.push('  Peer dependencies:');
    lines.push(`    npm install ${plan.peerDependencies.join(' ')}`);
    lines.push('');
  }

  /* Summary */
  const atomCount = plan.all.filter(e => e.type === 'atom' || e.type === 'atom-extra').length;
  const molCount = plan.all.filter(e => e.type === 'molecule' || e.type === 'molecule-ai').length;
  const compCount = plan.all.filter(e => e.type === 'ai-component').length;
  
  lines.push(`  Summary: ${compCount} component${compCount !== 1 ? 's' : ''}, ${molCount} molecule${molCount !== 1 ? 's' : ''}, ${atomCount} atom${atomCount !== 1 ? 's' : ''}`);
  lines.push(`  Tokens: ${plan.tokens.length} CSS custom properties`);
  lines.push('');
  lines.push('  Done.');

  return lines;
}
