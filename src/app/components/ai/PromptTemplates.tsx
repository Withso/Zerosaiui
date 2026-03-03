/* —— PromptTemplates — Phase 3 Enhanced — ListPanel variant —— */
import { useState } from 'react';
import { LayoutTemplate, Code, FileText, Palette, BarChart3, Mail, Star, StarOff, Copy, Check } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';
import { DSFormField, DSBreadcrumb } from '../ds/molecules';
import { ListPanel, type ListPanelItem } from './ListPanel';

/* —— Types —— */
interface TemplateSlot {
  key: string;
  label: string;
  placeholder: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  template: string;
  slots: TemplateSlot[];
  category?: string;
  favorited?: boolean;
  usageCount?: number;
}

interface PromptTemplatesProps {
  templates?: PromptTemplate[];
  onUse?: (filledTemplate: string) => void;
  defaultSelectedId?: string;
}

export function PromptTemplates({ templates, onUse, defaultSelectedId }: PromptTemplatesProps) {
  const [items, setItems] = useState(templates || defaultTemplates);
  const autoSelect = defaultSelectedId ?? (items.length === 1 ? items[0].id : null);
  const [selectedId, setSelectedId] = useState<string | null>(autoSelect);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const selected = items.find(t => t.id === selectedId);

  /* —— Unique categories —— */
  const categories = [...new Set(items.map(t => t.category).filter(Boolean))] as string[];

  /* —— Filtered items —— */
  const filtered = filterCategory
    ? items.filter(t => t.category === filterCategory)
    : items;

  /* —— Toggle favorite —— */
  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(t => t.id === id ? { ...t, favorited: !t.favorited } : t));
  };

  /* —— Build filled template —— */
  const getFilledTemplate = () => {
    if (!selected) return '';
    return selected.template.replace(
      /\{\{(\w+)\}\}/g,
      (_, key) => slotValues[key] || `[${selected.slots.find(s => s.key === key)?.label || key}]`,
    );
  };

  const handleUse = () => {
    if (!selected) return;
    let result = selected.template;
    for (const slot of selected.slots) {
      result = result.replace(`{{${slot.key}}}`, slotValues[slot.key] || slot.placeholder);
    }
    onUse?.(result);
    /* Increment usage count */
    setItems(prev => prev.map(t => t.id === selected.id ? { ...t, usageCount: (t.usageCount || 0) + 1 } : t));
    setSelectedId(null);
    setSlotValues({});
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(getFilledTemplate());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* Detail view — when a template is selected */
  if (selected) {
    return (
      <div
        className="flex flex-col"
        style={{
          fontFamily: 'var(--token-font-sans)',
          border: '1px solid var(--token-border)',
          borderRadius: 'var(--token-radius-lg)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Breadcrumb header — uses DSBreadcrumb molecule */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-3) var(--token-space-4)',
            borderBottom: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
          }}
        >
          <DSBreadcrumb
            items={['Templates', selected.name]}
            onNavigate={() => { setSelectedId(null); setSlotValues({}); }}
          />
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            {selected.category && (
              <DSBadge variant="default" style={{ fontSize: 'var(--token-text-2xs)' }}>{selected.category}</DSBadge>
            )}
            <button
              onClick={() => toggleFavorite(selected.id)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 24, height: 24,
                borderRadius: 'var(--token-radius-sm)',
                border: 'none', background: 'transparent',
                color: selected.favorited ? 'var(--token-warning)' : 'var(--token-text-disabled)',
                padding: 0,
              }}
            >
              {selected.favorited ? <Star size={13} /> : <StarOff size={13} />}
            </button>
          </div>
        </div>

        {/* Slots — uses DSFormField molecule (which uses DSInput atom) */}
        <div className="flex flex-col" style={{ padding: 'var(--token-space-4)', gap: 'var(--token-space-3)' }}>
          {selected.slots.map(slot => (
            <DSFormField
              key={slot.key}
              label={slot.label}
              placeholder={slot.placeholder}
              value={slotValues[slot.key] || ''}
              onChange={(v) => setSlotValues(prev => ({ ...prev, [slot.key]: v }))}
              style={{ maxWidth: '100%' }}
            />
          ))}

          {/* Preview */}
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: 'var(--token-space-3)', borderRadius: 'var(--token-radius-md)',
              background: 'var(--token-bg-tertiary)', fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)',
              fontFamily: 'var(--token-font-mono)', whiteSpace: 'pre-wrap',
            }}>
              {getFilledTemplate()}
            </div>
            {/* Copy preview */}
            <button
              onClick={handleCopy}
              className="flex items-center cursor-pointer"
              style={{
                position: 'absolute',
                top: 'var(--token-space-2)',
                right: 'var(--token-space-2)',
                gap: 'var(--token-space-1)',
                padding: 'var(--token-space-1) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                border: 'none',
                background: 'var(--token-bg-secondary)',
                fontSize: 'var(--token-text-2xs)',
                color: copied ? 'var(--token-success)' : 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                transition: 'color var(--token-duration-fast)',
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Use button — uses DSButton atom */}
          <DSButton variant="primary" onClick={handleUse}>Use Template</DSButton>
        </div>
      </div>
    );
  }

  /* List view — uses shared ListPanel */
  const listItems: ListPanelItem[] = filtered.map(tpl => ({
    id: tpl.id,
    title: tpl.name,
    subtitle: tpl.description,
    icon: (
      <div className="flex items-center justify-center shrink-0" style={{
        width: 28, height: 28, borderRadius: 'var(--token-radius-md)',
        background: 'var(--token-bg-tertiary)', color: 'var(--token-text-tertiary)',
      }}>
        {tpl.icon}
      </div>
    ),
    badge: tpl.favorited ? (
      <Star size={12} style={{ color: 'var(--token-warning)', flexShrink: 0 }} />
    ) : undefined,
  }));

  return (
    <div className="flex flex-col" style={{ width: '100%', gap: 'var(--token-space-2)' }}>
      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterCategory(null)}
            className="cursor-pointer"
            style={{
              padding: 'var(--token-space-0-5) var(--token-space-2)',
              borderRadius: 'var(--token-radius-full)',
              border: `1px solid ${!filterCategory ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: !filterCategory ? 'var(--token-bg-hover)' : 'var(--token-bg)',
              color: !filterCategory ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
              fontSize: 'var(--token-text-2xs)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'all 150ms ease',
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className="cursor-pointer"
              style={{
                padding: 'var(--token-space-0-5) var(--token-space-2)',
                borderRadius: 'var(--token-radius-full)',
                border: `1px solid ${filterCategory === cat ? 'var(--token-accent)' : 'var(--token-border)'}`,
                background: filterCategory === cat ? 'var(--token-bg-hover)' : 'var(--token-bg)',
                color: filterCategory === cat ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                fontSize: 'var(--token-text-2xs)',
                fontFamily: 'var(--token-font-mono)',
                transition: 'all 150ms ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <ListPanel
        title="Templates"
        headerIcon={<LayoutTemplate size={14} style={{ color: 'var(--token-text-tertiary)' }} />}
        headerActions={
          <DSBadge variant="default">{filtered.length.toString()}</DSBadge>
        }
        searchPlaceholder="Search templates..."
        items={listItems}
        onSelect={(id) => setSelectedId(id)}
        maxHeight={280}
        emptyText="No templates found"
      />
    </div>
  );
}

const defaultTemplates: PromptTemplate[] = [
  { id: '1', name: 'Code Review', description: 'Analyze code for bugs and improvements', icon: <Code size={14} />, template: 'Review the following {{language}} code for bugs, performance issues, and best practices:\n\n```\n{{code}}\n```', slots: [{ key: 'language', label: 'Language', placeholder: 'TypeScript' }, { key: 'code', label: 'Code', placeholder: 'Paste code here...' }], category: 'Engineering', usageCount: 42 },
  { id: '2', name: 'Summarize Document', description: 'Create a concise summary of a text', icon: <FileText size={14} />, template: 'Summarize the following {{type}} in {{length}} sentences:\n\n{{text}}', slots: [{ key: 'type', label: 'Document Type', placeholder: 'article' }, { key: 'length', label: 'Length', placeholder: '3-5' }, { key: 'text', label: 'Text', placeholder: 'Paste text here...' }], category: 'Writing', usageCount: 28, favorited: true },
  { id: '3', name: 'Design Feedback', description: 'Get critique on UI/UX designs', icon: <Palette size={14} />, template: 'Analyze this {{platform}} UI design for {{aspect}}:\n\n{{description}}', slots: [{ key: 'platform', label: 'Platform', placeholder: 'web' }, { key: 'aspect', label: 'Focus Area', placeholder: 'accessibility' }, { key: 'description', label: 'Description', placeholder: 'Describe the design...' }], category: 'Design' },
  { id: '4', name: 'Data Analysis', description: 'Interpret datasets and find patterns', icon: <BarChart3 size={14} />, template: 'Analyze this {{format}} data and identify key trends:\n\n{{data}}', slots: [{ key: 'format', label: 'Format', placeholder: 'CSV' }, { key: 'data', label: 'Data', placeholder: 'Paste data here...' }], category: 'Engineering', usageCount: 15 },
  { id: '5', name: 'Email Draft', description: 'Compose professional emails', icon: <Mail size={14} />, template: 'Write a {{tone}} email to {{recipient}} about {{subject}}.', slots: [{ key: 'tone', label: 'Tone', placeholder: 'professional' }, { key: 'recipient', label: 'Recipient', placeholder: 'the team' }, { key: 'subject', label: 'Subject', placeholder: 'project update' }], category: 'Writing', favorited: true },
];

export function PromptTemplatesDemo() {
  const [generated, setGenerated] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 380, width: '100%', gap: 'var(--token-space-3)' }}>
      <PromptTemplates onUse={(prompt) => setGenerated(prompt)} />
      {generated && (
        <div style={{
          padding: 'var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-accent)',
          background: 'var(--token-bg-hover)',
          fontSize: 'var(--token-text-xs)',
          color: 'var(--token-text-secondary)',
          fontFamily: 'var(--token-font-mono)',
          lineHeight: 'var(--token-leading-relaxed)',
          whiteSpace: 'pre-wrap',
          animation: 'token-fade-in 200ms ease',
        }}>
          {generated}
        </div>
      )}
    </div>
  );
}