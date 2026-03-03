/* ================================================
   Shared Token Data — Single Source of Truth
   Parses tokens.css and categorizes into collections.
   Used by both TokenTablePopup and DesignTokensPage.
   ================================================ */

// @ts-ignore — Vite raw import
import tokensCssRaw from '../../styles/tokens.css?raw';
import { COMPONENT_L4_DATA, type L4Entry } from './componentL4Tokens';

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */
export interface TokenEntry {
  name: string;
  lightValue: string;
  darkValue: string;
  /** For alias tokens (L4): the resolved raw color for swatch rendering. */
  lightSwatch?: string;
  darkSwatch?: string;
  group: string;
  collection: string;
}

export interface TokenGroup {
  name: string;
  tokens: TokenEntry[];
}

export interface TokenCollection {
  name: string;
  groups: TokenGroup[];
  tokenCount: number;
}

/* ═══════════════════════════════════════════════
   CSS Parser — extracts custom props from tokens.css
   ═══════════════════════════════════════════════ */
function parseTokensCss(rawCss: string): { light: Record<string, string>; dark: Record<string, string> } {
  const noComments = rawCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  let pos = 0;
  const text = noComments;

  while (pos < text.length) {
    while (pos < text.length && /\s/.test(text[pos])) pos++;
    if (pos >= text.length) break;

    const selectorStart = pos;
    while (pos < text.length && text[pos] !== '{') pos++;
    if (pos >= text.length) break;
    const selector = text.slice(selectorStart, pos).trim();
    pos++;

    let depth = 1;
    const bodyStart = pos;
    while (pos < text.length && depth > 0) {
      if (text[pos] === '{') depth++;
      else if (text[pos] === '}') depth--;
      pos++;
    }
    const body = text.slice(bodyStart, pos - 1);

    if (selector === ':root') {
      extractProps(body, light);
    } else if (selector === '.dark') {
      extractProps(body, dark);
    }
  }

  return { light, dark };
}

function extractProps(body: string, target: Record<string, string>) {
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = regex.exec(body)) !== null) {
    target[m[1]] = m[2].trim();
  }
}

/* ═══════════════════════════════════════════════
   Token Categorizer
   ═══════════════════════════════════════════════ */
function categorizeToken(name: string, _value: string): { collection: string; group: string } {
  const primitiveMatch = name.match(/^--(moonstone|sunstone|olivine|malachite|garnet|ochre|cyan|neutral)-/);
  if (primitiveMatch) {
    const hue = primitiveMatch[1];
    return { collection: 'Primitives', group: hue.charAt(0).toUpperCase() + hue.slice(1) };
  }

  if (!name.startsWith('--token-')) return { collection: 'Other', group: 'Misc' };

  const rest = name.slice(8);

  if (rest.startsWith('bg')) return { collection: 'Colors', group: 'Background' };
  if (rest.startsWith('text-')) {
    const sub = rest.slice(5);
    if (/^(2xs|xs|sm|base|md|lg|xl|2xl|3xl|4xl)$/.test(sub)) {
      return { collection: 'Typography', group: 'Font Size' };
    }
    return { collection: 'Colors', group: 'Text' };
  }
  if (rest.startsWith('border')) return { collection: 'Colors', group: 'Border' };
  if (rest.startsWith('accent')) return { collection: 'Colors', group: 'Brand Primary' };
  if (rest.startsWith('secondary')) return { collection: 'Colors', group: 'Brand Secondary' };
  if (rest.startsWith('tertiary')) return { collection: 'Colors', group: 'Brand Tertiary' };
  if (/^(success|error|warning|info)/.test(rest)) return { collection: 'Colors', group: 'Status' };
  if (rest.startsWith('chart')) return { collection: 'Colors', group: 'Chart / Categorical' };
  if (/^(user-|ai-)/.test(rest)) return { collection: 'Components', group: 'Semantic: Chat' };
  if (rest.startsWith('code')) return { collection: 'Components', group: 'Semantic: Code' };
  if (rest.startsWith('voice')) return { collection: 'Components', group: 'Semantic: Voice' };
  if (/^(insight|confidence|step)/.test(rest)) return { collection: 'Components', group: 'Semantic: Research' };
  if (rest.startsWith('image')) return { collection: 'Components', group: 'Semantic: Image' };
  if (rest.startsWith('space')) return { collection: 'Layout', group: 'Spacing' };
  if (rest.startsWith('radius')) return { collection: 'Layout', group: 'Radius' };
  if (rest.startsWith('font')) return { collection: 'Typography', group: 'Font Family' };
  if (rest.startsWith('leading')) return { collection: 'Typography', group: 'Line Height' };
  if (rest.startsWith('weight')) return { collection: 'Typography', group: 'Font Weight' };
  if (rest.startsWith('tracking')) return { collection: 'Typography', group: 'Letter Spacing' };
  if (rest.startsWith('shadow')) return { collection: 'Effects', group: 'Shadows' };
  if (rest.startsWith('duration') || rest.startsWith('ease')) return { collection: 'Effects', group: 'Motion' };
  if (rest.startsWith('z')) return { collection: 'Layout', group: 'Z-Index' };

  return { collection: 'Other', group: 'Misc' };
}

/* ═══════════════════════════════════════════════
   Build structured token data
   ═══════════════════════════════════════════════ */
export const COLLECTION_ORDER = ['Primitives', 'Colors', 'Components', 'Typography', 'Layout', 'Effects', 'Other'];

export function buildTokenData(rawCss: string): TokenCollection[] {
  const { light, dark } = parseTokensCss(rawCss);

  const entries: TokenEntry[] = Object.keys(light).map(name => {
    const { collection, group } = categorizeToken(name, light[name]);
    return { name, lightValue: light[name], darkValue: dark[name] || light[name], group, collection };
  });

  const collMap = new Map<string, Map<string, TokenEntry[]>>();
  for (const e of entries) {
    if (!collMap.has(e.collection)) collMap.set(e.collection, new Map());
    const groups = collMap.get(e.collection)!;
    if (!groups.has(e.group)) groups.set(e.group, []);
    groups.get(e.group)!.push(e);
  }

  /* Merge L4 component alias tokens */
  if (!collMap.has('Components')) collMap.set('Components', new Map());
  const compGroups = collMap.get('Components')!;
  for (const [groupName, groupEntries] of Object.entries(COMPONENT_L4_DATA)) {
    const tokens: TokenEntry[] = groupEntries.map(([l4Name, l3Ref, lightVal, darkVal]: L4Entry) => ({
      name: l4Name,
      lightValue: l3Ref,
      darkValue: l3Ref,
      lightSwatch: lightVal,
      darkSwatch: darkVal,
      group: groupName,
      collection: 'Components',
    }));
    compGroups.set(groupName, tokens);
  }

  const collections: TokenCollection[] = [];
  for (const collName of COLLECTION_ORDER) {
    const groups = collMap.get(collName);
    if (!groups) continue;
    const groupArray: TokenGroup[] = [];
    for (const [gName, tokens] of groups) {
      groupArray.push({ name: gName, tokens });
    }
    collections.push({
      name: collName,
      groups: groupArray,
      tokenCount: groupArray.reduce((s, g) => s + g.tokens.length, 0),
    });
  }
  return collections;
}

/* ═══════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════ */
export function isColorValue(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(value) ||
    /^rgba?\(/.test(value) ||
    /^hsla?\(/.test(value) ||
    /^color-mix\(/.test(value) ||
    value === 'transparent';
}

/* ═══════════════════════════════════════════════
   Pre-built data (singleton, parsed once at import)
   ═══════════════════════════════════════════════ */
export const allCollections: TokenCollection[] = buildTokenData(tokensCssRaw);

/** All collections except Components — for the Design Tokens documentation page */
export const documentationCollections: TokenCollection[] = allCollections.filter(c => c.name !== 'Components');