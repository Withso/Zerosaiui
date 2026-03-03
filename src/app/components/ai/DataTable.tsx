/* —— DataTable — Phase 3 Enhanced —— */
import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Table2, Download, Search, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { DSButton, DSCheckbox } from '../ds/atoms';

/* —— Types —— */
interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: 'number' | 'currency' | 'percent';
  highlight?: (value: string | number) => string | undefined;
}

interface DataTableProps {
  title?: string;
  columns?: Column[];
  rows?: Record<string, string | number>[];
  sortable?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onExport?: () => void;
  onSelectionChange?: (selectedIndices: number[]) => void;
}

export function DataTable({
  title,
  columns,
  rows,
  sortable = true,
  selectable = false,
  searchable = false,
  paginated = false,
  pageSize = 5,
  onExport,
  onSelectionChange,
}: DataTableProps) {
  const cols = columns || defaultColumns;
  const data = rows || defaultRows;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  /* —— Filter by search —— */
  const filtered = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(row =>
      cols.some(col => String(row[col.key]).toLowerCase().includes(q))
    );
  }, [data, searchQuery, cols]);

  /* —— Sort —— */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (!sortKey) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  /* —— Pagination —— */
  const totalPages = paginated ? Math.ceil(sorted.length / pageSize) : 1;
  const paginatedData = paginated ? sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : sorted;

  /* —— Selection —— */
  const toggleRow = (idx: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      onSelectionChange?.([...next]);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const all = new Set(paginatedData.map((_, i) => currentPage * pageSize + i));
      setSelectedRows(all);
      onSelectionChange?.([...all]);
    }
  };

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;

  /* —— Format cell —— */
  const formatCell = (value: string | number, format?: string) => {
    if (format === 'currency' && typeof value === 'number') return `$${value.toLocaleString()}`;
    if (format === 'percent' && typeof value === 'number') return `${value}%`;
    if (format === 'number' && typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  /* —— Copy cell —— */
  const handleCellCopy = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedCell(value);
    setTimeout(() => setCopiedCell(null), 1200);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderRadius: 'var(--token-radius-lg)',
        border: '1px solid var(--token-border)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          background: 'var(--token-bg-secondary)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Table2 size={14} style={{ color: 'var(--token-text-tertiary)' }} />
          {title && (
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-medium)',
                color: 'var(--token-text-primary)',
              }}
            >
              {title}
            </span>
          )}
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            {filtered.length} rows
            {selectedRows.size > 0 && ` · ${selectedRows.size} selected`}
          </span>
        </div>

        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {/* —— Export button — composed from DSButton atom —— */}
          {onExport && (
            <DSButton
              variant="icon"
              icon={<Download size={10} />}
              onClick={onExport}
              style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-tertiary)',
                gap: 'var(--token-space-1)',
                padding: 0,
              }}
            >
              Export
            </DSButton>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchable && (
        <div
          style={{
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderBottom: '1px solid var(--token-border)',
          }}
        >
          <div
            className="flex items-center"
            style={{
              gap: 'var(--token-space-2)',
              padding: 'var(--token-space-1-5) var(--token-space-3)',
              borderRadius: 'var(--token-radius-md)',
              border: '1px solid var(--token-border)',
              background: 'var(--token-bg)',
            }}
          >
            <Search size={13} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              placeholder="Filter rows..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontFamily: 'var(--token-font-sans)',
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-primary)',
              }}
            />
            {searchQuery && (
              <span
                style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                }}
              >
                {filtered.length} matches
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--token-text-sm)',
          }}
        >
          <thead>
            <tr>
              {selectable && (
                <th
                  style={{
                    padding: 'var(--token-space-2-5) var(--token-space-3)',
                    background: 'var(--token-bg)',
                    borderBottom: '1px solid var(--token-border)',
                    width: 40,
                  }}
                >
                  <DSCheckbox checked={allSelected} onChange={toggleAll} />
                </th>
              )}
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => sortable && toggleSort(col.key)}
                  style={{
                    padding: 'var(--token-space-2-5) var(--token-space-4)',
                    textAlign: (col.align || 'left') as 'left' | 'right' | 'center',
                    fontSize: 'var(--token-text-2xs)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: sortKey === col.key ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--token-tracking-wide)',
                    borderBottom: '1px solid var(--token-border)',
                    background: 'var(--token-bg)',
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color var(--token-duration-fast)',
                  }}
                >
                  <span className="inline-flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                    {col.label}
                    {sortable && (
                      sortKey === col.key
                        ? sortDir === 'asc'
                          ? <ArrowUp size={10} />
                          : <ArrowDown size={10} />
                        : <ArrowUpDown size={10} style={{ opacity: 0.3 }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, i) => {
              const globalIdx = paginated ? currentPage * pageSize + i : i;
              const isSelected = selectedRows.has(globalIdx);
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < paginatedData.length - 1 ? '1px solid var(--token-border-subtle)' : 'none',
                    transition: 'background var(--token-duration-fast)',
                    background: isSelected ? 'var(--token-accent-light)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--token-bg-hover)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = isSelected ? 'var(--token-accent-light)' : 'transparent';
                  }}
                >
                  {selectable && (
                    <td style={{ padding: 'var(--token-space-2-5) var(--token-space-3)' }}>
                      <DSCheckbox checked={isSelected} onChange={() => toggleRow(globalIdx)} />
                    </td>
                  )}
                  {cols.map(col => {
                    const formatted = formatCell(row[col.key], col.format);
                    const highlightColor = col.highlight?.(row[col.key]);
                    return (
                      <td
                        key={col.key}
                        onClick={() => handleCellCopy(formatted)}
                        style={{
                          padding: 'var(--token-space-2-5) var(--token-space-4)',
                          textAlign: (col.align || 'left') as 'left' | 'right' | 'center',
                          color: highlightColor || (copiedCell === formatted ? 'var(--token-success)' : 'var(--token-text-primary)'),
                          fontFamily: col.format ? 'var(--token-font-mono)' : undefined,
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          transition: 'color var(--token-duration-fast)',
                        }}
                        title="Click to copy"
                      >
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={cols.length + (selectable ? 1 : 0)}
                  style={{
                    padding: 'var(--token-space-6)',
                    textAlign: 'center',
                    color: 'var(--token-text-disabled)',
                    fontSize: 'var(--token-text-xs)',
                    fontFamily: 'var(--token-font-mono)',
                  }}
                >
                  No matching rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--token-space-2) var(--token-space-4)',
            borderTop: '1px solid var(--token-border)',
            background: 'var(--token-bg-secondary)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}
          >
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 28, height: 28,
                borderRadius: 'var(--token-radius-md)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: currentPage === 0 ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)',
                padding: 0,
                opacity: currentPage === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 28, height: 28,
                borderRadius: 'var(--token-radius-md)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg)',
                color: currentPage === totalPages - 1 ? 'var(--token-text-disabled)' : 'var(--token-text-secondary)',
                padding: 0,
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultColumns: Column[] = [
  { key: 'model', label: 'Model' },
  { key: 'params', label: 'Parameters', align: 'right', format: 'number' },
  { key: 'context', label: 'Context', align: 'right', format: 'number' },
  {
    key: 'score',
    label: 'Score',
    align: 'right',
    format: 'percent',
    highlight: (v) => {
      if (typeof v === 'number') {
        if (v >= 90) return 'var(--token-success)';
        if (v < 86) return 'var(--token-warning)';
      }
      return undefined;
    },
  },
  { key: 'cost', label: 'Cost / 1M', align: 'right', format: 'currency' },
];

const defaultRows = [
  { model: 'GPT-4o', params: 200000000000, context: 128000, score: 92.4, cost: 5 },
  { model: 'Claude 3.5 Sonnet', params: 175000000000, context: 200000, score: 91.8, cost: 3 },
  { model: 'Gemini 1.5 Pro', params: 160000000000, context: 1000000, score: 89.2, cost: 3.5 },
  { model: 'Llama 3.1 405B', params: 405000000000, context: 128000, score: 87.6, cost: 0 },
  { model: 'Mistral Large', params: 123000000000, context: 32000, score: 85.1, cost: 2 },
];

export function DataTableDemo() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 620, width: '100%', gap: 'var(--token-space-3)' }}>
      <DataTable
        title="Model Comparison"
        onExport={handleExport}
        selectable
        searchable
        paginated
        pageSize={3}
      />
      <div className="flex items-center justify-between">
        <span style={{
          fontSize: 'var(--token-text-2xs)',
          color: 'var(--token-text-disabled)',
          fontFamily: 'var(--token-font-mono)',
        }}>
          Click headers to sort · Click cells to copy
        </span>
        {exported && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-success)',
            fontFamily: 'var(--token-font-mono)',
            animation: 'token-fade-in 200ms ease',
          }}>
            CSV exported
          </span>
        )}
      </div>
    </div>
  );
}
