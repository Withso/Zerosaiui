/* ================================================
   Package Scaffold — zeros-aiui

   Generates the complete npm package structure for:
   1. zeros-aiui (CLI + component registry)
   2. @zeros-aiui/tokens (standalone token CSS)

   This module produces the file tree and contents
   that would be published to npm.
   ================================================ */

import { DEFAULT_CONFIG } from './config';
import { cliRegistry, registryStats } from '../data/cliRegistry';

/* ——————————————————————————————————————————
   Types
   —————————————————————————————————————————— */

export interface PackageFile {
  path: string;
  content: string;
  language: 'json' | 'ts' | 'css' | 'md' | 'sh';
}

export interface PackageScaffold {
  name: string;
  description: string;
  files: PackageFile[];
}

/* ——————————————————————————————————————————
   1. zeros-aiui CLI Package
   —————————————————————————————————————————— */

export function generateCLIPackage(): PackageScaffold {
  return {
    name: 'zeros-aiui',
    description: 'AI component toolkit for React — shadcn-style CLI',
    files: [
      {
        path: 'package.json',
        language: 'json',
        content: JSON.stringify({
          name: 'zeros-aiui',
          version: '0.1.0',
          description: 'AI component toolkit for React. Copy components directly into your project.',
          type: 'module',
          bin: {
            'zeros-aiui': './dist/bin.js',
          },
          main: './dist/index.js',
          types: './dist/index.d.ts',
          files: ['dist', 'registry', 'README.md'],
          scripts: {
            build: 'tsup src/bin.ts src/index.ts --format esm --dts',
            dev: 'tsup src/bin.ts --watch',
            prepublishOnly: 'npm run build',
          },
          dependencies: {
            commander: '^12.0.0',
            chalk: '^5.3.0',
            ora: '^8.0.0',
            prompts: '^2.4.2',
            'fs-extra': '^11.2.0',
            cosmiconfig: '^9.0.0',
          },
          devDependencies: {
            tsup: '^8.0.0',
            typescript: '^5.4.0',
            '@types/fs-extra': '^11.0.0',
            '@types/prompts': '^2.4.0',
          },
          peerDependencies: {
            react: '>=18.0.0',
            'lucide-react': '>=0.300.0',
          },
          peerDependenciesMeta: {
            'lucide-react': { optional: true },
          },
          keywords: [
            'ai', 'components', 'react', 'ui', 'design-system',
            'shadcn', 'tokens', 'chat', 'llm', 'tailwind',
          ],
          license: 'MIT',
          repository: {
            type: 'git',
            url: 'https://github.com/zeros-dev/zeros-aiui',
          },
          homepage: 'https://zeros-aiui.dev',
        }, null, 2),
      },
      {
        path: 'src/bin.ts',
        language: 'ts',
        content: `#!/usr/bin/env node
/* ================================================
   zeros-aiui CLI — Entry Point
   ================================================ */

import { Command } from 'commander';
import chalk from 'chalk';
import { initProject } from './commands/init.js';
import { addComponents } from './commands/add.js';
import { listComponents } from './commands/list.js';
import { infoComponent } from './commands/info.js';
import { diffComponents } from './commands/diff.js';

const program = new Command();

program
  .name('zeros-aiui')
  .description('AI component toolkit for React')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize project with tokens + config')
  .option('--tw3', 'Use Tailwind CSS v3 config')
  .option('--dir <path>', 'Component directory', 'src/components/zeros-aiui')
  .action(initProject);

program
  .command('add')
  .description('Add components to your project')
  .argument('<components...>', 'Component IDs to add')
  .option('--no-deps', 'Skip dependency installation')
  .option('--include-demos', 'Include Demo() functions')
  .option('--category <name>', 'Add all components in a category')
  .option('--overwrite', 'Overwrite existing files')
  .action(addComponents);

program
  .command('list')
  .description('List available components')
  .argument('[filter]', 'Filter by name/category')
  .action(listComponents);

program
  .command('info')
  .description('Show component details & dependencies')
  .argument('<component>', 'Component ID')
  .action(infoComponent);

program
  .command('diff')
  .description('Dry-run showing what would change')
  .argument('<components...>', 'Component IDs')
  .action(diffComponents);

program.parse();
`,
      },
      {
        path: 'src/commands/init.ts',
        language: 'ts',
        content: `/* zeros-aiui — init command */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, writeConfig, DEFAULT_CONFIG } from '../config.js';

export async function initProject(opts: { tw3?: boolean; dir?: string }) {
  const spinner = ora('Initializing zeros-aiui...').start();

  const config = {
    ...DEFAULT_CONFIG,
    ...(opts.dir ? { componentDir: opts.dir } : {}),
    ...(opts.tw3 ? { tailwindVersion: 3 as const } : {}),
  };

  /* 1. Write config file */
  await writeConfig(config);
  spinner.text = 'Writing zeros-aiui.config.ts...';

  /* 2. Copy tokens.css */
  const tokensDir = path.resolve(process.cwd(), config.tokensDir);
  await fs.ensureDir(tokensDir);
  const tokensSrc = path.resolve(__dirname, '../registry/tokens.css');
  const tokensDest = path.join(tokensDir, 'zeros-tokens.css');
  await fs.copyFile(tokensSrc, tokensDest);
  spinner.text = 'Copying tokens.css...';

  /* 3. Create component directory */
  const compDir = path.resolve(process.cwd(), config.componentDir);
  await fs.ensureDir(compDir);

  spinner.succeed(chalk.green('zeros-aiui initialized!'));
  
  console.log('');
  console.log('  Next steps:');
  console.log(\`  1. Import tokens in your CSS: \${chalk.cyan("@import './styles/zeros-tokens.css';")}\`);
  console.log(\`  2. Add components: \${chalk.cyan('npx zeros-aiui add chat-message')}\`);
  console.log('');
}
`,
      },
      {
        path: 'src/commands/add.ts',
        language: 'ts',
        content: `/* zeros-aiui — add command */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../config.js';
import { resolve } from '../resolver.js';
import { transformSource } from '../transformer.js';

export async function addComponents(
  components: string[],
  opts: { noDeps?: boolean; includeDemos?: boolean; category?: string; overwrite?: boolean }
) {
  const config = await getConfig();
  
  /* Handle --category flag */
  let ids = components;
  if (opts.category) {
    const { registry } = await import('../registry.js');
    ids = registry
      .filter(c => c.type === 'ai-component' && c.category.toLowerCase() === opts.category!.toLowerCase())
      .map(c => c.id);
    if (ids.length === 0) {
      console.error(chalk.red(\`No components found in category "\${opts.category}".\`));
      process.exit(1);
    }
  }

  const spinner = ora('Resolving dependencies...').start();
  const plan = resolve(ids);

  if (plan.warnings.length > 0) {
    spinner.warn(chalk.yellow('Warnings:'));
    for (const w of plan.warnings) {
      console.log(\`  \${chalk.yellow('⚠')}  \${w}\`);
    }
  }

  /* Copy DS layer files */
  const compDir = path.resolve(process.cwd(), config.componentDir);
  await fs.ensureDir(compDir);

  const allFiles = [
    ...plan.files.atoms,
    ...plan.files.molecules,
    ...plan.files.components,
  ];

  for (const file of allFiles) {
    const srcPath = path.resolve(__dirname, '../registry', file);
    const destName = file.split('/').pop()!;
    const destPath = path.join(compDir, destName);

    if (!opts.overwrite && await fs.pathExists(destPath)) {
      spinner.info(\`Skipping \${destName} (already exists)\`);
      continue;
    }

    let source = await fs.readFile(srcPath, 'utf-8');
    
    /* Transform source */
    const entry = plan.all.find(e => e.file === file);
    if (entry) {
      source = transformSource(source, entry, {
        config,
        stripDemos: !opts.includeDemos,
        addHeader: true,
      });
    }

    await fs.writeFile(destPath, source, 'utf-8');
    spinner.text = \`Installed \${chalk.cyan(destName)}\`;
  }

  spinner.succeed(chalk.green(\`Installed \${allFiles.length} files\`));
  
  /* Peer dep reminder */
  if (!opts.noDeps && plan.peerDependencies.length > 0) {
    console.log('');
    console.log(\`  Install peer deps: \${chalk.cyan('npm install ' + plan.peerDependencies.join(' '))}\`);
  }

  console.log('');
}
`,
      },
      {
        path: 'src/commands/list.ts',
        language: 'ts',
        content: `/* zeros-aiui — list command */

import chalk from 'chalk';
import { registry, registryStats, searchComponents } from '../registry.js';

export async function listComponents(filter?: string) {
  console.log('');
  console.log(\`  zeros-aiui — \${registryStats.totalComponents} components available\`);
  console.log('');

  const entries = filter
    ? searchComponents(filter)
    : registry.filter(c => c.type === 'ai-component');

  if (filter && entries.length === 0) {
    console.log(\`  No components matching "\${filter}".\`);
    return;
  }

  /* Group by category */
  const grouped = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!grouped.has(e.category)) grouped.set(e.category, []);
    grouped.get(e.category)!.push(e);
  }

  for (const [cat, items] of grouped) {
    console.log(\`  \${chalk.bold(cat)}:\`);
    for (const item of items) {
      console.log(\`    \${chalk.cyan(item.id.padEnd(26))} \${item.description}\`);
    }
    console.log('');
  }
}
`,
      },
      {
        path: 'src/commands/info.ts',
        language: 'ts',
        content: `/* zeros-aiui — info command */

import chalk from 'chalk';
import { registry, resolveDependencies, searchComponents } from '../registry.js';

export async function infoComponent(id: string) {
  const entry = registry.find(c => c.id === id);
  
  if (!entry) {
    console.error(chalk.red(\`Component "\${id}" not found.\`));
    const suggestions = searchComponents(id).slice(0, 5);
    if (suggestions.length > 0) {
      console.log('  Did you mean:');
      for (const s of suggestions) {
        console.log(\`    - \${chalk.cyan(s.id)}\`);
      }
    }
    process.exit(1);
  }

  const deps = resolveDependencies(id);
  const atoms = deps.filter(d => d.type === 'atom' || d.type === 'atom-extra');
  const molecules = deps.filter(d => d.type === 'molecule' || d.type === 'molecule-ai');

  console.log('');
  console.log(\`  \${chalk.bold(entry.name)}\`);
  console.log(\`  \${entry.description}\`);
  console.log('');
  console.log(\`  Type:     \${entry.type}\`);
  console.log(\`  Category: \${entry.category}\`);
  console.log(\`  File:     \${entry.file}\`);
  console.log('');

  if (atoms.length > 0) {
    console.log(\`  Atoms (\${atoms.length}):\`);
    for (const a of atoms) {
      console.log(\`    ├ \${a.name}\`);
    }
    console.log('');
  }

  if (molecules.length > 0) {
    console.log(\`  Molecules (\${molecules.length}):\`);
    for (const m of molecules) {
      console.log(\`    ├ \${m.name}\`);
    }
    console.log('');
  }

  console.log(\`  Install: \${chalk.cyan('npx zeros-aiui add ' + id)}\`);
  console.log('');
}
`,
      },
      {
        path: 'src/commands/diff.ts',
        language: 'ts',
        content: `/* zeros-aiui — diff command */

import chalk from 'chalk';
import { resolve } from '../resolver.js';
import { getConfig } from '../config.js';

export async function diffComponents(components: string[]) {
  const config = await getConfig();
  const plan = resolve(components);

  console.log('');
  console.log(chalk.dim('  Dry run — no files will be modified'));
  console.log('');

  const allFiles = [
    ...plan.files.atoms,
    ...plan.files.molecules,
    ...plan.files.components,
    'tokens.css',
  ];

  for (const f of allFiles) {
    const name = f.split('/').pop()!;
    console.log(\`  \${chalk.green('[new]')} \${config.componentDir}/\${name}\`);
  }

  console.log('');
  console.log(\`  Total: \${allFiles.length} file\${allFiles.length !== 1 ? 's' : ''}\`);

  if (plan.peerDependencies.length > 0) {
    console.log(\`  Peer deps: \${plan.peerDependencies.join(', ')}\`);
  }
  console.log('');
}
`,
      },
      {
        path: 'src/config.ts',
        language: 'ts',
        content: `/* zeros-aiui — config loader */

import { cosmiconfig } from 'cosmiconfig';
import fs from 'fs-extra';
import path from 'path';

export interface ZerosConfig {
  componentDir: string;
  tokensDir: string;
  importAlias: string;
  includeDemos: boolean;
  tailwindVersion: 3 | 4;
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

const explorer = cosmiconfig('zeros-aiui', {
  searchPlaces: [
    'zeros-aiui.config.ts',
    'zeros-aiui.config.js',
    'zeros-aiui.config.mjs',
    '.zeros-aiuirc.json',
  ],
});

export async function getConfig(): Promise<ZerosConfig> {
  const result = await explorer.search();
  if (result?.config) {
    return { ...DEFAULT_CONFIG, ...result.config };
  }
  return DEFAULT_CONFIG;
}

export async function writeConfig(config: ZerosConfig): Promise<void> {
  const configPath = path.resolve(process.cwd(), 'zeros-aiui.config.ts');
  const content = \`/** @type {import('zeros-aiui').ZerosConfig} */
export default {
  componentDir: '\${config.componentDir}',
  tokensDir: '\${config.tokensDir}',
  importAlias: '\${config.importAlias}',
  includeDemos: \${config.includeDemos},
  tailwindVersion: \${config.tailwindVersion},
  typescript: \${config.typescript},
};
\`;
  await fs.writeFile(configPath, content, 'utf-8');
}
`,
      },
      {
        path: 'tsconfig.json',
        language: 'json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            declaration: true,
            outDir: './dist',
            rootDir: './src',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
          },
          include: ['src'],
        }, null, 2),
      },
    ],
  };
}

/* ——————————————————————————————————————————
   2. @zeros-aiui/tokens Package
   —————————————————————————————————————————— */

export function generateTokensPackage(): PackageScaffold {
  return {
    name: '@zeros-aiui/tokens',
    description: 'Geological Intelligence design tokens — CSS custom properties',
    files: [
      {
        path: 'package.json',
        language: 'json',
        content: JSON.stringify({
          name: '@zeros-aiui/tokens',
          version: '0.1.0',
          description: 'Geological Intelligence design tokens for zeros-aiui. 4-level CSS custom property architecture with light/dark themes.',
          main: './tokens.css',
          types: './index.d.ts',
          files: ['tokens.css', 'index.d.ts', 'README.md'],
          keywords: [
            'css', 'tokens', 'design-tokens', 'custom-properties',
            'light-dark', 'theme', 'geological-intelligence',
          ],
          license: 'MIT',
          repository: {
            type: 'git',
            url: 'https://github.com/zeros-dev/zeros-aiui',
            directory: 'packages/tokens',
          },
          homepage: 'https://zeros-aiui.dev/design-tokens',
        }, null, 2),
      },
      {
        path: 'index.d.ts',
        language: 'ts',
        content: `/* @zeros-aiui/tokens — TypeScript type declarations */

/**
 * Import this CSS file for all zeros-aiui design tokens.
 * 
 * Usage:
 *   @import '@zeros-aiui/tokens';
 *   // or
 *   @import '@zeros-aiui/tokens/tokens.css';
 * 
 * Provides CSS custom properties on :root (light) and .dark (dark).
 * 4-level architecture: Raw → Primitive → Semantic → Component.
 */
declare module '@zeros-aiui/tokens' {
  const content: string;
  export default content;
}
`,
      },
      {
        path: 'tokens.css',
        language: 'css',
        content: `/* ================================================
   @zeros-aiui/tokens
   Geological Intelligence Design Token System
   
   4-Level Architecture:
     L1: Raw Values      → hardcoded hex/px
     L2: Primitives      → named color scales (Moonstone, Sunstone, etc.)
     L3: Semantic Tokens  → purpose-driven (--token-bg, --token-accent)
     L4: Component Tokens → domain-specific (--token-user-bubble, --token-code-bg)
   
   Usage:
     @import '@zeros-aiui/tokens';
     // Tokens available as CSS custom properties on :root
     // Dark theme via .dark class
   ================================================ */

/* [Full tokens.css content would be copied from /src/styles/tokens.css] */
/* See the source project for the complete 600-line token file */
`,
      },
    ],
  };
}

/* ——————————————————————————————————————————
   File tree visualization
   —————————————————————————————————————————— */

export function renderFileTree(scaffold: PackageScaffold): string[] {
  const lines: string[] = [];
  lines.push(`${scaffold.name}/`);

  for (let i = 0; i < scaffold.files.length; i++) {
    const file = scaffold.files[i];
    const isLast = i === scaffold.files.length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    
    /* Handle nested paths */
    const parts = file.path.split('/');
    if (parts.length > 1) {
      lines.push(`${prefix}${parts.join('/')}`);
    } else {
      lines.push(`${prefix}${file.path}`);
    }
  }

  return lines;
}

/* ——————————————————————————————————————————
   Combined output for CLI page
   —————————————————————————————————————————— */

export function getPackageOverview(): {
  cli: { name: string; files: number; description: string };
  tokens: { name: string; files: number; description: string };
  registry: { components: number; atoms: number; molecules: number; categories: number };
} {
  return {
    cli: {
      name: 'zeros-aiui',
      files: generateCLIPackage().files.length,
      description: 'CLI tool + component registry for npx zeros-aiui add',
    },
    tokens: {
      name: '@zeros-aiui/tokens',
      files: generateTokensPackage().files.length,
      description: 'Standalone CSS custom property token package',
    },
    registry: {
      components: registryStats.aiComponents,
      atoms: registryStats.atoms,
      molecules: registryStats.molecules,
      categories: registryStats.categories.length,
    },
  };
}
