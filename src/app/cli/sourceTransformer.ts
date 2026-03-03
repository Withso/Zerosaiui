/* ================================================
   Source Transformer — zeros-aiui CLI

   Transforms component source code for distribution:
   — Rewrites import paths (../ds/atoms → configurable alias)
   — Strips Demo() functions (optional)
   — Removes internal-only comments
   — Adds license header
   — Generates barrel exports
   ================================================ */

import type { ZerosConfig } from './config';
import { DEFAULT_CONFIG } from './config';
import type { CLIComponentEntry } from '../data/cliRegistry';
import { cliRegistry } from '../data/cliRegistry';

/* ——————————————————————————————————————————
   Import path rewriting
   —————————————————————————————————————————— */

export interface TransformOptions {
  config: ZerosConfig;
  stripDemos: boolean;
  addHeader: boolean;
}

const DEFAULT_TRANSFORM: TransformOptions = {
  config: DEFAULT_CONFIG,
  stripDemos: true,
  addHeader: true,
};

/** Map of internal import paths to their distribution equivalents */
function buildImportMap(alias: string): Array<[RegExp, string]> {
  return [
    [/from\s+['"]\.\.\/ds\/atoms-extra['"]/g, `from '${alias}/atoms-extra'`],
    [/from\s+['"]\.\.\/ds\/atoms['"]/g, `from '${alias}/atoms'`],
    [/from\s+['"]\.\.\/ds\/molecules-ai['"]/g, `from '${alias}/molecules-ai'`],
    [/from\s+['"]\.\.\/ds\/molecules-base['"]/g, `from '${alias}/molecules-base'`],
    [/from\s+['"]\.\.\/ds\/molecules['"]/g, `from '${alias}/molecules'`],
  ];
}

/**
 * Transform a single component source file for distribution
 */
export function transformSource(
  source: string,
  entry: CLIComponentEntry,
  opts: Partial<TransformOptions> = {}
): string {
  const options = { ...DEFAULT_TRANSFORM, ...opts };
  let result = source;

  /* 1. Rewrite import paths */
  const importMap = buildImportMap(options.config.importAlias);
  for (const [pattern, replacement] of importMap) {
    result = result.replace(pattern, replacement);
  }

  /* 2. Strip Demo functions */
  if (options.stripDemos) {
    result = stripDemoSection(result);
  }

  /* 3. Add license header */
  if (options.addHeader) {
    result = addLicenseHeader(result, entry);
  }

  return result;
}

/**
 * Strip everything from the Demo export to the end of file.
 * Handles:
 *   — Sample data constants before Demo
 *   — The Demo function itself
 *   — Any trailing code after Demo
 */
function stripDemoSection(source: string): string {
  /* Pattern 1: Look for sample data + Demo function */
  const sampleDataPattern = /\n\/\*[\s\S]*?\*\/\s*\n(?:const\s+sample\w+[\s\S]*?)?\s*export\s+function\s+\w*Demo\s*\(/;
  const match1 = source.match(sampleDataPattern);
  if (match1 && match1.index !== undefined) {
    return source.substring(0, match1.index).trimEnd() + '\n';
  }

  /* Pattern 2: Just the Demo function export */
  const demoPattern = /\nexport\s+function\s+\w*Demo\s*\(/;
  const match2 = source.match(demoPattern);
  if (match2 && match2.index !== undefined) {
    return source.substring(0, match2.index).trimEnd() + '\n';
  }

  return source;
}

/**
 * Add a license/attribution header
 */
function addLicenseHeader(source: string, entry: CLIComponentEntry): string {
  const header = `/* ——————————————————————————————————————————
   ${entry.name}
   zeros-aiui — AI component toolkit for React
   https://zeros-aiui.dev
   License: MIT
   —————————————————————————————————————————— */\n`;

  /* Skip if source already starts with the header */
  if (source.includes('zeros-aiui')) return source;

  /* Insert after any existing file-level comments */
  const existingComment = source.match(/^\/\*[\s\S]*?\*\/\s*\n/);
  if (existingComment) {
    return header + source.substring(existingComment[0].length);
  }

  return header + source;
}

/* ——————————————————————————————————————————
   Barrel export generator
   —————————————————————————————————————————— */

/**
 * Generate an index.ts barrel file exporting all installed components
 */
export function generateBarrelExport(entries: CLIComponentEntry[]): string {
  const lines: string[] = [
    `/* zeros-aiui — barrel export */`,
    `/* Auto-generated. Do not edit manually. */`,
    '',
  ];

  /* Group by type */
  const atoms = entries.filter(e => e.type === 'atom');
  const atomsExtra = entries.filter(e => e.type === 'atom-extra');
  const molBase = entries.filter(e => e.type === 'molecule');
  const molAI = entries.filter(e => e.type === 'molecule-ai');
  const components = entries.filter(e => e.type === 'ai-component');

  if (atoms.length > 0) {
    const names = atoms.map(a => a.name).join(', ');
    lines.push(`export { ${names} } from './atoms';`);
  }
  if (atomsExtra.length > 0) {
    const names = atomsExtra.map(a => a.name).join(', ');
    lines.push(`export { ${names} } from './atoms-extra';`);
  }
  if (molBase.length > 0) {
    const names = molBase.map(m => m.name).join(', ');
    lines.push(`export { ${names} } from './molecules-base';`);
  }
  if (molAI.length > 0) {
    const names = molAI.map(m => m.name).join(', ');
    lines.push(`export { ${names} } from './molecules-ai';`);
  }

  if (components.length > 0) {
    lines.push('');
    lines.push('/* AI Components */');
    for (const c of components) {
      const fileName = c.file.replace('components/ai/', '').replace('.tsx', '');
      lines.push(`export { ${c.name} } from './${fileName}';`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/* ——————————————————————————————————————————
   Source preview (for CLI page)
   —————————————————————————————————————————— */

/**
 * Generate a preview of what a component file would look like
 * after `npx zeros-aiui add <component>`.
 * Uses mock source since we can't read actual files at runtime.
 */
export function generateSourcePreview(entry: CLIComponentEntry, config: ZerosConfig = DEFAULT_CONFIG): string {
  const lines: string[] = [];

  /* License header */
  lines.push(`/* ——————————————————————————————————————————`);
  lines.push(`   ${entry.name}`);
  lines.push(`   zeros-aiui — AI component toolkit for React`);
  lines.push(`   https://zeros-aiui.dev`);
  lines.push(`   License: MIT`);
  lines.push(`   —————————————————————————————————————————— */`);
  lines.push('');

  /* React import */
  lines.push(`import React, { useState } from 'react';`);

  /* Lucide imports (from registry) */
  if (entry.peerDependencies.includes('lucide-react')) {
    lines.push(`import { /* icons */ } from 'lucide-react';`);
  }

  /* DS imports (rewritten) */
  const atomDeps = entry.dependencies.filter(d => {
    const dep = cliRegistry.find(c => c.id === d);
    return dep && dep.type === 'atom';
  });
  const atomExtraDeps = entry.dependencies.filter(d => {
    const dep = cliRegistry.find(c => c.id === d);
    return dep && dep.type === 'atom-extra';
  });
  const molDeps = entry.dependencies.filter(d => {
    const dep = cliRegistry.find(c => c.id === d);
    return dep && (dep.type === 'molecule' || dep.type === 'molecule-ai');
  });

  if (atomDeps.length > 0) {
    const names = atomDeps.map(d => cliRegistry.find(c => c.id === d)?.name).filter(Boolean).join(', ');
    lines.push(`import { ${names} } from '${config.importAlias}/atoms';`);
  }
  if (atomExtraDeps.length > 0) {
    const names = atomExtraDeps.map(d => cliRegistry.find(c => c.id === d)?.name).filter(Boolean).join(', ');
    lines.push(`import { ${names} } from '${config.importAlias}/atoms-extra';`);
  }
  if (molDeps.length > 0) {
    const names = molDeps.map(d => cliRegistry.find(c => c.id === d)?.name).filter(Boolean).join(', ');
    lines.push(`import { ${names} } from '${config.importAlias}/molecules';`);
  }

  lines.push('');
  lines.push(`/* ——— Props ——— */`);
  lines.push(`export interface ${entry.name}Props {`);
  lines.push(`  // ... component props`);
  lines.push(`}`);
  lines.push('');
  lines.push(`/* ——— Component ——— */`);
  lines.push(`export function ${entry.name}(props: ${entry.name}Props) {`);
  lines.push(`  // Full component implementation`);
  lines.push(`  // (copied from zeros-aiui source)`);
  lines.push(`  return (`);
  lines.push(`    <div>`);
  lines.push(`      {/* ${entry.description} */}`);
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push('');

  return lines.join('\n');
}
