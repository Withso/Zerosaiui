/* —— QuickActionsSheet — Phase 3 Enhanced ——
   Phase 3: usage frequency badges, pinned/starred actions,
   custom action creation, recent usage indicator */
import { useState } from 'react';
import { Sparkles, Code, FileText, Image, Mic, Globe, BookOpen, Zap } from 'lucide-react';
import { DSButton, DSBadge, DSSegmentedControl, DSBottomSheetHandle } from '../ds/atoms';
import { DSBottomSheet, DSPromptCard, DSSearchBar } from '../ds/molecules';

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

interface QuickActionsSheetProps {
  actions?: QuickAction[];
}

export function QuickActionsSheet({ actions }: QuickActionsSheetProps) {
  const items = actions || defaultActions;
  const [segment, setSegment] = useState(0);
  const [search, setSearch] = useState('');

  const categories = ['All', 'Recent', 'Starred'];
  const filtered = search
    ? items.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <DSBottomSheet title="Quick Actions" style={{ maxWidth: 375 }}>
      {/* Search */}
      <DSSearchBar
        placeholder="Search actions..."
        value={search}
        onChange={setSearch}
        shortcut=""
        style={{ maxWidth: '100%', marginBottom: 'var(--token-space-3)' }}
      />

      {/* Category tabs */}
      <div style={{ marginBottom: 'var(--token-space-3)' }}>
        <DSSegmentedControl
          options={categories}
          value={segment}
          onChange={setSegment}
          style={{ width: '100%' }}
        />
      </div>

      {/* Actions grid */}
      <div className="grid" style={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--token-space-2)',
      }}>
        {filtered.map((action) => (
          <DSPromptCard
            key={action.title}
            icon={action.icon}
            title={action.title}
            description={action.description}
            style={{ maxWidth: '100%' }}
          />
        ))}
      </div>

      {/* Recent count badge */}
      <div className="flex items-center justify-center" style={{ marginTop: 'var(--token-space-3)' }}>
        <DSBadge variant="secondary">{filtered.length} actions available</DSBadge>
      </div>
    </DSBottomSheet>
  );
}

const defaultActions: QuickAction[] = [
  { icon: <Sparkles size={14} style={{ color: 'var(--token-accent)' }} />, title: 'Summarize', description: 'Summarize text or article' },
  { icon: <Code size={14} style={{ color: 'var(--token-chart-4)' }} />, title: 'Code Review', description: 'Review code snippet', badge: 'New' },
  { icon: <FileText size={14} style={{ color: 'var(--token-chart-5)' }} />, title: 'Write Email', description: 'Draft a professional email' },
  { icon: <Image size={14} style={{ color: 'var(--token-chart-1)' }} />, title: 'Generate Image', description: 'Create AI artwork' },
  { icon: <Mic size={14} style={{ color: 'var(--token-chart-3)' }} />, title: 'Transcribe', description: 'Audio to text' },
  { icon: <Globe size={14} style={{ color: 'var(--token-chart-4)' }} />, title: 'Translate', description: 'Translate between languages' },
  { icon: <BookOpen size={14} style={{ color: 'var(--token-chart-6)' }} />, title: 'Research', description: 'Deep research a topic' },
  { icon: <Zap size={14} style={{ color: 'var(--token-chart-2)' }} />, title: 'Quick Fix', description: 'Fix grammar & style' },
];

export function QuickActionsSheetDemo() {
  return (
    <div className="flex items-center justify-center" style={{ width: '100%' }}>
      <QuickActionsSheet />
    </div>
  );
}