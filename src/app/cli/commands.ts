/* ================================================
   CLI Commands — zeros-aiui
   
   Simulates the full CLI command set:
   - init: Initialize a project with tokens + config
   - add:  Add components with dependency resolution
   - list: List available components
   - diff: Show what would change
   - info: Show component details
   ================================================ */

import { cliRegistry, resolveDependencies, searchComponents, registryStats, type CLIComponentEntry } from '../data/cliRegistry';
import { DEFAULT_CONFIG, generateConfigFile } from './config';
import { resolve, formatInstallOutput, type ResolvedPlan } from './resolver';

/* ——————————————————————————————————————————
   Command types
   —————————————————————————————————————————— */

export interface CommandResult {
  command: string;
  output: string[];
  success: boolean;
  plan?: ResolvedPlan;
}

/* ——————————————————————————————————————————
   INIT command
   —————————————————————————————————————————— */

export function cmdInit(flags: Record<string, string> = {}): CommandResult {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('  \u2728 Initializing zeros-aiui...');
  lines.push('');
  lines.push('  Creating configuration:');
  lines.push(`    + zeros-aiui.config.ts`);
  lines.push(`    + src/styles/zeros-tokens.css`);
  lines.push('');
  lines.push('  Config preview:');
  
  const configLines = generateConfigFile().split('\n');
  for (const cl of configLines) {
    lines.push(`    ${cl}`);
  }
  
  lines.push('');
  lines.push('  Next steps:');
  lines.push('    1. Import zeros-tokens.css in your global CSS:');
  lines.push("       @import './styles/zeros-tokens.css';");
  lines.push('');
  lines.push('    2. Add components:');
  lines.push('       npx zeros-aiui add ChatMessage ReasoningTrace');
  lines.push('');
  lines.push('  Done. Happy building!');

  return { command: 'npx zeros-aiui init', output: lines, success: true };
}

/* ——————————————————————————————————————————
   ADD command
   —————————————————————————————————————————— */

export function cmdAdd(componentIds: string[]): CommandResult {
  if (componentIds.length === 0) {
    return {
      command: 'npx zeros-aiui add',
      output: [
        '',
        '  Error: No components specified.',
        '',
        '  Usage: npx zeros-aiui add <component> [component...]',
        '',
        '  Examples:',
        '    npx zeros-aiui add chat-message',
        '    npx zeros-aiui add chat-message reasoning-trace tool-call',
        '    npx zeros-aiui add --category Chat',
        '',
        '  Run `npx zeros-aiui list` to see available components.',
      ],
      success: false,
    };
  }

  /* Handle --category flag */
  if (componentIds[0] === '--category' && componentIds[1]) {
    const category = componentIds[1];
    const matches = cliRegistry.filter(
      c => c.type === 'ai-component' && c.category.toLowerCase() === category.toLowerCase()
    );
    if (matches.length === 0) {
      return {
        command: `npx zeros-aiui add --category ${category}`,
        output: [
          '',
          `  Error: No components found in category "${category}".`,
          '',
          `  Available categories: ${registryStats.categories.join(', ')}`,
        ],
        success: false,
      };
    }
    componentIds = matches.map(m => m.id);
  }

  const plan = resolve(componentIds);
  const lines = formatInstallOutput(plan);

  return {
    command: `npx zeros-aiui add ${componentIds.join(' ')}`,
    output: lines,
    success: plan.warnings.length === 0,
    plan,
  };
}

/* ——————————————————————————————————————————
   LIST command
   —————————————————————————————————————————— */

export function cmdList(filter?: string): CommandResult {
  const lines: string[] = [];
  
  lines.push('');
  lines.push(`  zeros-aiui \u2014 ${registryStats.totalComponents} components available`);
  lines.push('');

  let entries: CLIComponentEntry[];
  if (filter) {
    entries = searchComponents(filter);
    if (entries.length === 0) {
      lines.push(`  No components matching "${filter}".`);
      return { command: `npx zeros-aiui list ${filter}`, output: lines, success: true };
    }
    lines.push(`  Showing ${entries.length} result${entries.length !== 1 ? 's' : ''} for "${filter}":`);
    lines.push('');
  } else {
    entries = cliRegistry.filter(c => c.type === 'ai-component');
  }

  /* Group by category */
  const grouped = new Map<string, CLIComponentEntry[]>();
  for (const e of entries) {
    const cat = e.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(e);
  }

  for (const [cat, items] of grouped) {
    lines.push(`  ${cat}:`);
    for (const item of items) {
      const depCount = resolveDependencies(item.id).length - 1;
      const depStr = depCount > 0 ? ` (${depCount} dep${depCount !== 1 ? 's' : ''})` : '';
      lines.push(`    ${item.id.padEnd(26)} ${item.description}${depStr}`);
    }
    lines.push('');
  }

  return { command: filter ? `npx zeros-aiui list ${filter}` : 'npx zeros-aiui list', output: lines, success: true };
}

/* ——————————————————————————————————————————
   INFO command
   —————————————————————————————————————————— */

export function cmdInfo(id: string): CommandResult {
  const entry = cliRegistry.find(c => c.id === id);
  
  if (!entry) {
    return {
      command: `npx zeros-aiui info ${id}`,
      output: [
        '',
        `  Error: Component "${id}" not found.`,
        '',
        '  Did you mean one of these?',
        ...searchComponents(id).slice(0, 5).map(c => `    - ${c.id}`),
      ],
      success: false,
    };
  }

  const deps = resolveDependencies(id);
  const atoms = deps.filter(d => d.type === 'atom' || d.type === 'atom-extra');
  const molecules = deps.filter(d => d.type === 'molecule' || d.type === 'molecule-ai');
  const components = deps.filter(d => d.type === 'ai-component' && d.id !== id);

  const lines: string[] = [];
  lines.push('');
  lines.push(`  ${entry.name}`);
  lines.push(`  ${entry.description}`);
  lines.push('');
  lines.push(`  Type:      ${entry.type}`);
  lines.push(`  Category:  ${entry.category}`);
  lines.push(`  File:      ${entry.file}`);
  lines.push('');

  if (atoms.length > 0) {
    lines.push(`  Atoms (${atoms.length}):`);
    for (const a of atoms) {
      lines.push(`    \u251c ${a.name} \u2014 ${a.description}`);
    }
    lines.push('');
  }

  if (molecules.length > 0) {
    lines.push(`  Molecules (${molecules.length}):`);
    for (const m of molecules) {
      lines.push(`    \u251c ${m.name} \u2014 ${m.description}`);
    }
    lines.push('');
  }

  if (components.length > 0) {
    lines.push(`  Components (${components.length}):`);
    for (const c of components) {
      lines.push(`    \u251c ${c.name} \u2014 ${c.description}`);
    }
    lines.push('');
  }

  if (entry.peerDependencies.length > 0) {
    lines.push(`  Peer deps: ${entry.peerDependencies.join(', ')}`);
    lines.push('');
  }

  lines.push(`  Tokens: ${entry.tokens.length} CSS custom properties`);
  lines.push('');
  lines.push(`  Install: npx zeros-aiui add ${id}`);

  return { command: `npx zeros-aiui info ${id}`, output: lines, success: true };
}

/* ——————————————————————————————————————————
   DIFF command (dry-run)
   —————————————————————————————————————————— */

export function cmdDiff(componentIds: string[]): CommandResult {
  const plan = resolve(componentIds);
  const lines: string[] = [];

  lines.push('');
  lines.push('  Dry run \u2014 no files will be modified');
  lines.push('');

  const allFiles = [
    ...plan.files.atoms,
    ...plan.files.molecules,
    ...plan.files.components,
    'tokens.css',
  ];

  for (const f of allFiles) {
    lines.push(`  [new] ${DEFAULT_CONFIG.componentDir}/${f.replace('components/', '').replace('ds/', '').replace('ai/', '')}`);
  }

  lines.push('');
  
  if (plan.peerDependencies.length > 0) {
    lines.push(`  Would install: ${plan.peerDependencies.join(', ')}`);
    lines.push('');
  }

  lines.push(`  Total: ${allFiles.length} file${allFiles.length !== 1 ? 's' : ''}`);

  return {
    command: `npx zeros-aiui diff ${componentIds.join(' ')}`,
    output: lines,
    success: true,
    plan,
  };
}

/* ——————————————————————————————————————————
   HELP command
   —————————————————————————————————————————— */

export function cmdHelp(): CommandResult {
  return {
    command: 'npx zeros-aiui --help',
    output: [
      '',
      '  zeros-aiui \u2014 AI component toolkit for React',
      '',
      '  Commands:',
      '    init                          Initialize project with tokens + config',
      '    add <component> [...]         Add components to your project',
      '    add --category <name>         Add all components in a category',
      '    list [filter]                 List available components',
      '    info <component>              Show component details & dependencies',
      '    diff <component> [...]        Dry-run showing what would change',
      '',
      '  Options:',
      '    --help, -h                    Show this help',
      '    --version, -v                 Show version',
      '    --no-deps                     Skip dependency installation',
      '    --include-demos               Include Demo() functions',
      '',
      '  Examples:',
      '    npx zeros-aiui init',
      '    npx zeros-aiui add chat-message reasoning-trace',
      '    npx zeros-aiui add --category Voice',
      '    npx zeros-aiui list chat',
      '    npx zeros-aiui info ai-context-panel',
      '',
      '  Documentation: https://zeros-aiui.dev',
    ],
    success: true,
  };
}

/* ——————————————————————————————————————————
   Command parser
   —————————————————————————————————————————— */

export function parseAndExecute(input: string): CommandResult {
  const trimmed = input.trim();
  
  /* Strip the npx prefix if present */
  const cmd = trimmed
    .replace(/^npx\s+zeros-aiui\s*/, '')
    .replace(/^zeros-aiui\s*/, '')
    .trim();

  if (!cmd || cmd === '--help' || cmd === '-h') {
    return cmdHelp();
  }

  const parts = cmd.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'init':
      return cmdInit();
    case 'add':
      return cmdAdd(args);
    case 'list':
      return cmdList(args[0]);
    case 'info':
      return args[0] ? cmdInfo(args[0]) : cmdHelp();
    case 'diff':
      return cmdDiff(args);
    default:
      return {
        command: trimmed,
        output: [
          '',
          `  Unknown command: "${command}"`,
          '',
          '  Run `npx zeros-aiui --help` for usage.',
        ],
        success: false,
      };
  }
}