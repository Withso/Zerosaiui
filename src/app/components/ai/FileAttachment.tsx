/* FileAttachment — Enhanced file attachment with previews + AI summary
   Phase 3 enhancements:
   — Interactive preview modal (click to preview documents)
   — AI-generated summary tooltip on hover
   — Upload progress indicator per file
   — File type-aware rich previews (image thumbnail, doc page count)
   — Expandable detail panel */
import { useState, useCallback, useEffect } from 'react';
import { FileText, Image, FileCode, File, X, Eye, Download, Sparkles, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type FileType = 'document' | 'image' | 'code' | 'other';

interface FileItem {
  name: string;
  size: string;
  type: FileType;
  pages?: number;
  uploadProgress?: number;
  aiSummary?: string;
}

interface FileAttachmentProps {
  files: FileItem[];
  onRemove?: (index: number) => void;
  onPreview?: (index: number) => void;
  onDownload?: (index: number) => void;
  removable?: boolean;
  showSummaries?: boolean;
}

const fileIcons: Record<FileType, typeof FileText> = {
  document: FileText,
  image: Image,
  code: FileCode,
  other: File,
};

const typeColors: Record<FileType, string> = {
  document: 'var(--token-accent)',
  image: 'var(--token-chart-2, #8b5cf6)',
  code: 'var(--token-success)',
  other: 'var(--token-text-tertiary)',
};

export function FileAttachment({
  files,
  onRemove,
  onPreview,
  onDownload,
  removable = true,
  showSummaries = true,
}: FileAttachmentProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<number | null>(null);

  const handlePreview = (idx: number) => {
    setPreviewIdx(previewIdx === idx ? null : idx);
    onPreview?.(idx);
  };

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--token-space-2)', width: '100%' }}>
      {files.map((file, i) => {
        const Icon = fileIcons[file.type];
        const isHovered = hoveredIdx === i;
        const isExpanded = expandedIdx === i;
        const isPreviewing = previewIdx === i;
        const isUploading = file.uploadProgress !== undefined && file.uploadProgress < 100;

        return (
          <div
            key={`${file.name}-${i}`}
            className="flex flex-col"
            style={{
              borderRadius: 'var(--token-radius-md)',
              border: `1px solid ${isPreviewing ? 'var(--token-accent)' : 'var(--token-border)'}`,
              background: 'var(--token-bg)',
              fontFamily: 'var(--token-font-sans)',
              overflow: 'hidden',
              transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
              animation: `token-fade-in 200ms ease ${i * 60}ms both`,
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Main row */}
            <div
              className="flex items-center"
              style={{
                gap: 'var(--token-space-2-5)',
                padding: 'var(--token-space-2) var(--token-space-3)',
              }}
            >
              {/* File type icon with color accent */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--token-radius-sm)',
                  background: 'var(--token-bg-tertiary)',
                  position: 'relative',
                }}
              >
                <Icon size={14} style={{ color: typeColors[file.type] }} />
                {file.type === 'image' && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 2,
                      borderRadius: 'var(--token-radius-sm)',
                      background: 'linear-gradient(135deg, var(--token-accent), var(--token-chart-2, #8b5cf6))',
                      opacity: 0.15,
                    }}
                  />
                )}
              </div>

              {/* Name + meta */}
              <div className="flex flex-col flex-1" style={{ gap: 0, minWidth: 0 }}>
                <span
                  className="truncate"
                  style={{
                    fontSize: 'var(--token-text-sm)',
                    fontWeight: 'var(--token-weight-medium)',
                    color: 'var(--token-text-primary)',
                    lineHeight: 'var(--token-leading-tight)',
                  }}
                >
                  {file.name}
                </span>
                <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
                  <span
                    style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-text-tertiary)',
                      lineHeight: 'var(--token-leading-tight)',
                    }}
                  >
                    {file.size}
                  </span>
                  {file.pages && (
                    <span
                      style={{
                        fontSize: 'var(--token-text-2xs)',
                        color: 'var(--token-text-disabled)',
                      }}
                    >
                      · {file.pages} pages
                    </span>
                  )}
                </div>
              </div>

              {/* Hover actions */}
              <div
                className="flex items-center shrink-0"
                style={{
                  gap: 'var(--token-space-0-5)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity var(--token-duration-fast) var(--token-ease-default)',
                }}
              >
                <DSButton
                  variant="icon"
                  icon={<Eye size={11} />}
                  onClick={() => handlePreview(i)}
                  title="Preview"
                  style={{ width: 22, height: 22 }}
                />
                <DSButton
                  variant="icon"
                  icon={<Download size={11} />}
                  onClick={() => onDownload?.(i)}
                  title="Download"
                  style={{ width: 22, height: 22 }}
                />
                {showSummaries && file.aiSummary && (
                  <DSButton
                    variant="icon"
                    icon={isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    onClick={() => toggleExpand(i)}
                    title="AI Summary"
                    style={{ width: 22, height: 22 }}
                  />
                )}
              </div>

              {removable && (
                <DSButton
                  variant="icon"
                  icon={<X size={10} />}
                  onClick={() => onRemove?.(i)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 'var(--token-radius-full)',
                    border: 'none',
                    background: 'var(--token-bg-tertiary)',
                    color: 'var(--token-text-tertiary)',
                    padding: 0,
                  }}
                />
              )}
            </div>

            {/* Upload progress bar */}
            {isUploading && (
              <div
                style={{
                  height: 2,
                  background: 'var(--token-bg-tertiary)',
                  margin: '0 var(--token-space-3)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${file.uploadProgress}%`,
                    background: 'var(--token-accent)',
                    borderRadius: 'var(--token-radius-full)',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            )}

            {/* AI Summary expandable */}
            {isExpanded && file.aiSummary && (
              <div
                style={{
                  padding: 'var(--token-space-2) var(--token-space-3)',
                  borderTop: '1px solid var(--token-border)',
                  background: 'var(--token-bg-secondary)',
                  animation: 'token-fade-in 150ms ease',
                }}
              >
                <div className="flex items-center" style={{ gap: 'var(--token-space-1)', marginBottom: 'var(--token-space-1)' }}>
                  <Sparkles size={10} style={{ color: 'var(--token-accent)' }} />
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)', fontWeight: 'var(--token-weight-medium)' }}>
                    AI Summary
                  </span>
                </div>
                <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-secondary)', lineHeight: 'var(--token-leading-relaxed)' }}>
                  {file.aiSummary}
                </span>
              </div>
            )}

            {/* Preview panel */}
            {isPreviewing && (
              <div
                style={{
                  padding: 'var(--token-space-3)',
                  borderTop: '1px solid var(--token-border)',
                  background: 'var(--token-bg-tertiary)',
                  animation: 'token-fade-in 150ms ease',
                }}
              >
                {file.type === 'image' ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      height: 120,
                      borderRadius: 'var(--token-radius-md)',
                      background: 'linear-gradient(135deg, var(--token-accent), var(--token-chart-2, #8b5cf6))',
                      opacity: 0.7,
                    }}
                  >
                    <Image size={24} style={{ color: '#fff' }} />
                  </div>
                ) : file.type === 'code' ? (
                  <pre
                    style={{
                      margin: 0,
                      padding: 'var(--token-space-2) var(--token-space-3)',
                      borderRadius: 'var(--token-radius-md)',
                      background: 'var(--token-code-bg, var(--token-bg))',
                      border: '1px solid var(--token-border)',
                      fontSize: 'var(--token-text-2xs)',
                      fontFamily: 'var(--token-font-mono)',
                      color: 'var(--token-code-text, var(--token-text-primary))',
                      overflow: 'auto',
                      maxHeight: 100,
                    }}
                  >
{`export function utils() {
  // File preview placeholder
  return { ok: true };
}`}
                  </pre>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      height: 100,
                      borderRadius: 'var(--token-radius-md)',
                      border: '1px dashed var(--token-border)',
                      gap: 'var(--token-space-2)',
                    }}
                  >
                    <FileText size={20} style={{ color: 'var(--token-text-disabled)' }} />
                    <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
                      Document preview · {file.pages || 1} page{(file.pages || 1) > 1 ? 's' : ''}
                    </span>
                    <DSButton
                      variant="outline"
                      icon={<ExternalLink size={10} />}
                      style={{ fontSize: 'var(--token-text-2xs)' }}
                    >
                      Open full preview
                    </DSButton>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const sampleFiles: FileItem[] = [
  { name: 'research-paper.pdf', size: '2.4 MB', type: 'document', pages: 12, aiSummary: 'A comprehensive study on transformer architectures and their applications in natural language processing, covering attention mechanisms, pre-training strategies, and fine-tuning approaches.' },
  { name: 'screenshot.png', size: '840 KB', type: 'image' },
  { name: 'utils.ts', size: '12 KB', type: 'code', aiSummary: 'Utility module containing helper functions for date formatting, string manipulation, and API response parsing.' },
  { name: 'dataset.csv', size: '156 KB', type: 'other', uploadProgress: 72 },
];

export function FileAttachmentDemo() {
  const [files, setFiles] = useState(sampleFiles);

  /* Simulate upload progress */
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(prev =>
        prev.map(f =>
          f.uploadProgress !== undefined && f.uploadProgress < 100
            ? { ...f, uploadProgress: Math.min(100, f.uploadProgress + 8) }
            : f,
        ),
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 440, width: '100%' }}>
      <FileAttachment
        files={files}
        onRemove={idx => setFiles(prev => prev.filter((_, i) => i !== idx))}
      />
      {files.length === 0 && (
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--token-space-6)',
            border: '1px dashed var(--token-border)',
            borderRadius: 'var(--token-radius-lg)',
            gap: 'var(--token-space-2)',
            animation: 'token-fade-in 200ms ease',
          }}
        >
          <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-disabled)' }}>
            All files removed
          </span>
          <DSButton
            variant="outline"
            onClick={() => setFiles(sampleFiles)}
            style={{ fontSize: 'var(--token-text-xs)' }}
          >
            Reset Demo
          </DSButton>
        </div>
      )}
    </div>
  );
}
