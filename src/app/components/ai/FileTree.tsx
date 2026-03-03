/* —— FileTree — Phase 3 Enhanced —— */
import { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, FileCode, FileText, Image, FileJson, Copy, Check, Trash2, Edit3 } from 'lucide-react';
import { DSDot, DSButton } from '../ds/atoms';

/* —— Types —— */
interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  icon?: React.ReactNode;
  modified?: boolean;
  added?: boolean;
  size?: string;
}

interface FileTreeProps {
  tree?: TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  multiSelect?: boolean;
}

const fileIcons: Record<string, React.ReactNode> = {
  tsx: <FileCode size={13} style={{ color: 'var(--token-chart-4)' }} />,
  ts: <FileCode size={13} style={{ color: 'var(--token-chart-4)' }} />,
  jsx: <FileCode size={13} style={{ color: 'var(--token-chart-3)' }} />,
  js: <FileCode size={13} style={{ color: 'var(--token-chart-3)' }} />,
  json: <FileJson size={13} style={{ color: 'var(--token-chart-5)' }} />,
  css: <File size={13} style={{ color: 'var(--token-chart-6)' }} />,
  md: <FileText size={13} style={{ color: 'var(--token-text-tertiary)' }} />,
  png: <Image size={13} style={{ color: 'var(--token-chart-1)' }} />,
  svg: <Image size={13} style={{ color: 'var(--token-chart-2)' }} />,
};

function getFileIcon(name: string): React.ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return fileIcons[ext] || <File size={13} style={{ color: 'var(--token-text-disabled)' }} />;
}

/* —— Recursive tree item with context actions —— */
function TreeItem({
  node,
  depth,
  selectedId,
  selectedIds,
  onSelect,
  onDelete,
  onRename,
  multiSelect,
}: {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  selectedIds: Set<string>;
  onSelect: (id: string, multi?: boolean) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  multiSelect?: boolean;
}) {
  const [open, setOpen] = useState(depth < 2);
  const [hovered, setHovered] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const renameRef = useRef<HTMLInputElement>(null);
  const isFolder = node.type === 'folder';
  const isSelected = multiSelect ? selectedIds.has(node.id) : selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    if (isFolder) setOpen(!open);
    onSelect(node.id, multiSelect && (e.metaKey || e.ctrlKey));
  };

  const handleDoubleClick = () => {
    if (!isFolder && onRename) {
      setRenaming(true);
      setRenameValue(node.name);
      setTimeout(() => renameRef.current?.focus(), 50);
    }
  };

  const confirmRename = () => {
    if (renameValue.trim() && renameValue !== node.name) {
      onRename?.(node.id, renameValue.trim());
    }
    setRenaming(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center w-full cursor-pointer"
        style={{
          gap: 'var(--token-space-1-5)',
          padding: `var(--token-space-1) var(--token-space-2)`,
          paddingLeft: `calc(var(--token-space-3) + ${depth * 16}px)`,
          border: 'none',
          background: isSelected ? 'var(--token-bg-hover)' : 'transparent',
          fontFamily: 'var(--token-font-sans)',
          fontSize: 'var(--token-text-sm)',
          color: 'var(--token-text-primary)',
          textAlign: 'left',
          transition: 'background var(--token-duration-fast)',
          borderRadius: 0,
        }}
      >
        {/* Chevron for folders */}
        <span
          style={{
            width: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--token-text-disabled)',
          }}
        >
          {isFolder ? (
            open ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : null}
        </span>

        {/* Icon */}
        <span className="flex items-center shrink-0">
          {isFolder ? (
            open ? (
              <FolderOpen size={13} style={{ color: 'var(--token-warning)' }} />
            ) : (
              <Folder size={13} style={{ color: 'var(--token-warning)' }} />
            )
          ) : (
            node.icon || getFileIcon(node.name)
          )}
        </span>

        {/* Name or rename input */}
        {renaming ? (
          <input
            ref={renameRef}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') confirmRename();
              if (e.key === 'Escape') setRenaming(false);
            }}
            onBlur={confirmRename}
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1,
              border: '1px solid var(--token-accent)',
              borderRadius: 'var(--token-radius-sm)',
              background: 'var(--token-bg)',
              outline: 'none',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-sm)',
              color: 'var(--token-text-primary)',
              padding: '0 var(--token-space-1)',
            }}
          />
        ) : (
          <span
            className="truncate flex-1"
            style={{
              fontWeight: isFolder ? 'var(--token-weight-medium)' : 'var(--token-weight-regular)',
            }}
          >
            {node.name}
          </span>
        )}

        {/* Size label */}
        {node.size && !renaming && (
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              flexShrink: 0,
              opacity: hovered ? 1 : 0,
              transition: 'opacity var(--token-duration-fast)',
            }}
          >
            {node.size}
          </span>
        )}

        {/* Status indicators — composed from DSDot atom */}
        {node.modified && <DSDot color="var(--token-warning)" size={6} />}
        {node.added && <DSDot color="var(--token-success)" size={6} />}

        {/* Delete button on hover */}
        {hovered && onDelete && !isFolder && !renaming && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 18, height: 18,
              borderRadius: 'var(--token-radius-sm)',
              border: 'none',
              background: 'var(--token-bg-tertiary)',
              color: 'var(--token-text-disabled)',
              padding: 0,
              flexShrink: 0,
              transition: 'color var(--token-duration-fast)',
            }}
            title="Delete file"
          >
            <Trash2 size={10} />
          </button>
        )}
      </button>

      {/* Children */}
      {isFolder && open && node.children?.map(child => (
        <TreeItem
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onDelete={onDelete}
          onRename={onRename}
          multiSelect={multiSelect}
        />
      ))}
    </div>
  );
}

export function FileTree({ tree, selectedId: controlledId, onSelect, onDelete, onRename, multiSelect }: FileTreeProps) {
  const [internalId, setInternalId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedId = controlledId ?? internalId;
  const nodes = tree || defaultTree;

  /* —— Count files recursively —— */
  const countFiles = (nodes: TreeNode[]): number => {
    return nodes.reduce((sum, n) => sum + (n.type === 'file' ? 1 : 0) + (n.children ? countFiles(n.children) : 0), 0);
  };
  const fileCount = countFiles(nodes);

  const handleSelect = (id: string, multi?: boolean) => {
    if (multi) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setInternalId(id);
    }
    onSelect?.(id);
  };

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
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          gap: 'var(--token-space-2)',
          padding: 'var(--token-space-2-5) var(--token-space-3)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Folder size={13} style={{ color: 'var(--token-text-tertiary)' }} />
          <span
            style={{
              fontSize: 'var(--token-text-sm)',
              fontWeight: 'var(--token-weight-medium)',
              color: 'var(--token-text-primary)',
            }}
          >
            Files
          </span>
        </div>
        <span
          style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}
        >
          {fileCount} files
        </span>
      </div>

      {/* Tree */}
      <div className="flex flex-col" style={{ padding: 'var(--token-space-1) 0', maxHeight: 300, overflowY: 'auto' }}>
        {nodes.map(node => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onDelete={onDelete}
            onRename={onRename}
            multiSelect={multiSelect}
          />
        ))}
      </div>
    </div>
  );
}

const defaultTree: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'app',
        name: 'app',
        type: 'folder',
        children: [
          { id: 'app-tsx', name: 'App.tsx', type: 'file', modified: true, size: '2.4 KB' },
          { id: 'routes', name: 'routes.ts', type: 'file', size: '840 B' },
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: [
              { id: 'header', name: 'Header.tsx', type: 'file', size: '1.1 KB' },
              { id: 'sidebar', name: 'Sidebar.tsx', type: 'file', modified: true, size: '3.2 KB' },
              { id: 'chat', name: 'ChatView.tsx', type: 'file', added: true, size: '5.6 KB' },
            ],
          },
          {
            id: 'pages',
            name: 'pages',
            type: 'folder',
            children: [
              { id: 'home', name: 'HomePage.tsx', type: 'file', size: '1.8 KB' },
              { id: 'detail', name: 'DetailPage.tsx', type: 'file', modified: true, size: '4.2 KB' },
            ],
          },
        ],
      },
      {
        id: 'styles',
        name: 'styles',
        type: 'folder',
        children: [
          { id: 'theme', name: 'theme.css', type: 'file', size: '6.1 KB' },
          { id: 'tokens', name: 'tokens.css', type: 'file', size: '12.4 KB' },
        ],
      },
    ],
  },
  { id: 'pkg', name: 'package.json', type: 'file', size: '1.2 KB' },
  { id: 'tsconfig', name: 'tsconfig.json', type: 'file', size: '580 B' },
];

export function FileTreeDemo() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string | null>(null);

  return (
    <div className="flex flex-col" style={{ maxWidth: 300, width: '100%', gap: 'var(--token-space-3)' }}>
      <FileTree
        onSelect={(id) => setSelectedFile(id)}
        onDelete={(id) => { setDeleted(id); setTimeout(() => setDeleted(null), 2000); }}
        onRename={(id, name) => {}}
      />
      {selectedFile && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-accent)',
          background: 'var(--token-bg-hover)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-secondary)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Selected: {selectedFile}
        </div>
      )}
      {deleted && (
        <div style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderRadius: 'var(--token-radius-md)',
          border: '1px solid var(--token-error)',
          background: 'var(--token-error-light)',
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-error)',
          fontFamily: 'var(--token-font-mono)',
          animation: 'token-fade-in 200ms ease',
        }}>
          Deleted: {deleted}
        </div>
      )}
    </div>
  );
}
