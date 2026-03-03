/* MultiModalInput — Enhanced multi-modal input with rich previews
   Phase 3 enhancements:
   — Rich context previews (image thumbnails, URL cards, document icons)
   — Drag-and-drop reorder for attachments
   — Paste-to-attach (image + URL detection)
   — Attachment limit indicator
   — Voice transcription text display
   — Stop button during AI generation */
import { useState, useRef, useCallback } from 'react';
import { Type, ImageIcon, Mic, ArrowUp, Upload, X, Square, Link, FileText, GripVertical, Globe, Sparkles } from 'lucide-react';
import { DSButton } from '../ds/atoms';

type InputMode = 'text' | 'image' | 'voice';

interface Attachment {
  id: string;
  type: 'image' | 'url' | 'document';
  name: string;
  preview?: string;
  meta?: string;
}

interface MultiModalInputProps {
  onSend?: (value: string, attachments: Attachment[]) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  maxAttachments?: number;
  placeholder?: string;
}

export function MultiModalInput({
  onSend,
  isStreaming = false,
  onStop,
  maxAttachments = 5,
  placeholder = 'Type your message...',
}: MultiModalInputProps) {
  const [mode, setMode] = useState<InputMode>('text');
  const [value, setValue] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragOverZone, setDragOverZone] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modes: { key: InputMode; icon: React.ReactNode; label: string }[] = [
    { key: 'text', icon: <Type size={14} />, label: 'Text' },
    { key: 'image', icon: <ImageIcon size={14} />, label: 'Image' },
    { key: 'voice', icon: <Mic size={14} />, label: 'Voice' },
  ];

  const addAttachment = useCallback((att: Attachment) => {
    setAttachments(prev => {
      if (prev.length >= maxAttachments) return prev;
      return [...prev, att];
    });
  }, [maxAttachments]);

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  /* — Paste detection — */
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        addAttachment({
          id: `img-${Date.now()}`,
          type: 'image',
          name: 'Pasted image',
          preview: 'clipboard',
          meta: 'From clipboard',
        });
        return;
      }
    }

    /* URL detection in pasted text */
    const text = e.clipboardData?.getData('text/plain') || '';
    const urlMatch = text.match(/^https?:\/\/[^\s]+$/);
    if (urlMatch) {
      e.preventDefault();
      const url = urlMatch[0];
      const hostname = new URL(url).hostname;
      addAttachment({
        id: `url-${Date.now()}`,
        type: 'url',
        name: hostname,
        preview: url,
        meta: url.slice(0, 40) + (url.length > 40 ? '...' : ''),
      });
    }
  }, [addAttachment]);

  /* — Drag reorder helpers — */
  const handleDragStart = (idx: number) => { setDragIdx(idx); setIsDragging(true); };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setAttachments(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIdx, 1);
      copy.splice(idx, 0, moved);
      return copy;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => { setDragIdx(null); setIsDragging(false); };

  /* — Drop zone for files — */
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file, i) => {
      const isImage = file.type.startsWith('image/');
      addAttachment({
        id: `file-${Date.now()}-${i}`,
        type: isImage ? 'image' : 'document',
        name: file.name,
        meta: `${(file.size / 1024).toFixed(0)} KB`,
      });
    });
  };

  /* — Voice recording simulation — */
  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setTranscription('How can I optimize the database queries for better performance?');
    } else {
      setRecording(true);
      setTranscription('');
    }
  };

  const handleSend = () => {
    const text = mode === 'voice' ? transcription : value;
    if (!text.trim() && attachments.length === 0) return;
    onSend?.(text, attachments);
    setValue('');
    setTranscription('');
    setAttachments([]);
  };

  const attachmentIcons: Record<Attachment['type'], React.ReactNode> = {
    image: <ImageIcon size={12} style={{ color: 'var(--token-accent)' }} />,
    url: <Globe size={12} style={{ color: 'var(--token-accent)' }} />,
    document: <FileText size={12} style={{ color: 'var(--token-text-secondary)' }} />,
  };

  return (
    <div
      style={{
        borderRadius: 'var(--token-radius-xl)',
        border: `1px solid ${dragOverZone ? 'var(--token-accent)' : 'var(--token-border)'}`,
        background: 'var(--token-bg)',
        overflow: 'hidden',
        fontFamily: 'var(--token-font-sans)',
        boxShadow: 'var(--token-shadow-sm)',
        transition: 'border-color var(--token-duration-fast) var(--token-ease-default)',
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOverZone(true); }}
      onDragLeave={() => setDragOverZone(false)}
      onDrop={handleFileDrop}
    >
      {/* Mode tabs */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-1)',
          borderBottom: '1px solid var(--token-border)',
        }}
      >
        <div className="flex" style={{ gap: 'var(--token-space-0-5)' }}>
          {modes.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                gap: 'var(--token-space-1-5)',
                padding: 'var(--token-space-1-5) var(--token-space-3)',
                borderRadius: 'var(--token-radius-md)',
                border: 'none',
                background: mode === m.key ? 'var(--token-bg-tertiary)' : 'transparent',
                color: mode === m.key ? 'var(--token-text-primary)' : 'var(--token-text-tertiary)',
                fontSize: 'var(--token-text-xs)',
                fontWeight: 'var(--token-weight-medium)',
                fontFamily: 'var(--token-font-sans)',
                transition: 'all var(--token-duration-fast) var(--token-ease-default)',
              }}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
        {attachments.length > 0 && (
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: attachments.length >= maxAttachments ? 'var(--token-warning)' : 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
            paddingRight: 'var(--token-space-2)',
          }}>
            {attachments.length}/{maxAttachments}
          </span>
        )}
      </div>

      {/* Attachments preview strip */}
      {attachments.length > 0 && (
        <div
          className="flex items-center"
          style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            gap: 'var(--token-space-2)',
            borderBottom: '1px solid var(--token-border)',
            overflowX: 'auto',
          }}
        >
          {attachments.map((att, idx) => (
            <div
              key={att.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className="flex items-center shrink-0"
              style={{
                gap: 'var(--token-space-1-5)',
                padding: 'var(--token-space-1) var(--token-space-2)',
                borderRadius: 'var(--token-radius-sm)',
                border: '1px solid var(--token-border)',
                background: 'var(--token-bg-secondary)',
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-secondary)',
                cursor: 'grab',
                animation: isDragging ? 'none' : `token-fade-in 150ms ease ${idx * 50}ms both`,
                opacity: dragIdx === idx ? 0.5 : 1,
                transition: 'opacity var(--token-duration-fast) var(--token-ease-default)',
              }}
            >
              <GripVertical size={10} style={{ color: 'var(--token-text-disabled)', flexShrink: 0 }} />
              {att.type === 'image' ? (
                <div
                  style={{
                    width: 20, height: 20,
                    borderRadius: 'var(--token-radius-sm)',
                    background: 'linear-gradient(135deg, var(--token-accent), var(--token-chart-2, #8b5cf6))',
                    flexShrink: 0,
                  }}
                />
              ) : (
                attachmentIcons[att.type]
              )}
              <span className="truncate" style={{ maxWidth: 80 }}>{att.name}</span>
              <button
                onClick={() => removeAttachment(att.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 14, height: 14,
                  borderRadius: 'var(--token-radius-full)',
                  border: 'none', background: 'var(--token-bg-tertiary)',
                  color: 'var(--token-text-tertiary)', cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={8} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: 'var(--token-space-3)' }}>
        {mode === 'text' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder}
            rows={2}
            disabled={isStreaming}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              color: 'var(--token-text-primary)',
              fontFamily: 'var(--token-font-sans)',
              fontSize: 'var(--token-text-base)',
              lineHeight: 'var(--token-leading-normal)',
              opacity: isStreaming ? 0.5 : 1,
            }}
          />
        )}

        {mode === 'image' && (
          <div>
            <div
              onClick={() => {
                if (attachments.length < maxAttachments) {
                  addAttachment({
                    id: `img-${Date.now()}`,
                    type: 'image',
                    name: 'image_001.png',
                    preview: 'uploaded',
                    meta: '1024 x 1024 · 2.4 MB',
                  });
                }
              }}
              className="flex flex-col items-center justify-center cursor-pointer"
              style={{
                padding: 'var(--token-space-5)',
                borderRadius: 'var(--token-radius-lg)',
                border: '2px dashed var(--token-border)',
                gap: 'var(--token-space-2)',
                transition: 'border-color var(--token-duration-normal)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--token-border-strong)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--token-border)')}
            >
              <Upload size={18} style={{ color: 'var(--token-text-tertiary)' }} />
              <span style={{ fontSize: 'var(--token-text-sm)', color: 'var(--token-text-tertiary)' }}>
                Drop image or click to upload
              </span>
              <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)' }}>
                Supports PNG, JPG, WebP · Max 10 MB
              </span>
            </div>
          </div>
        )}

        {mode === 'voice' && (
          <div className="flex flex-col items-center" style={{ padding: 'var(--token-space-3)', gap: 'var(--token-space-3)' }}>
            {/* Mini waveform */}
            <div className="flex items-center justify-center" style={{ gap: 2, height: 32 }}>
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    width: 3,
                    borderRadius: 'var(--token-radius-full)',
                    background: recording ? 'var(--token-voice-bar-active, var(--token-accent))' : 'var(--token-voice-bar, var(--token-text-disabled))',
                    opacity: recording ? 1 : 0.2,
                    height: recording ? `${(Math.sin(i * 0.8) * 0.4 + 0.5) * 100}%` : '15%',
                    transition: `height ${200 + i * 10}ms var(--token-ease-default)`,
                    animation: recording ? `token-pulse ${1 + (i % 4) * 0.15}s ease-in-out ${i * 0.05}s infinite` : 'none',
                  }}
                />
              ))}
            </div>
            <DSButton
              variant="primary"
              icon={<Mic size={16} />}
              onClick={toggleRecording}
              style={{
                width: 40, height: 40,
                borderRadius: 'var(--token-radius-full)',
                padding: 0, minWidth: 'unset',
                background: recording ? 'var(--token-error)' : 'var(--token-text-primary)',
              }}
            />
            <span style={{ fontSize: 'var(--token-text-xs)', color: 'var(--token-text-tertiary)' }}>
              {recording ? 'Recording... tap to stop' : 'Tap to record'}
            </span>

            {/* Transcription display */}
            {transcription && (
              <div
                style={{
                  width: '100%',
                  padding: 'var(--token-space-2) var(--token-space-3)',
                  borderRadius: 'var(--token-radius-md)',
                  border: '1px solid var(--token-border)',
                  background: 'var(--token-bg-secondary)',
                  fontSize: 'var(--token-text-sm)',
                  color: 'var(--token-text-primary)',
                  lineHeight: 'var(--token-leading-normal)',
                  animation: 'token-fade-in 200ms ease',
                }}
              >
                <div className="flex items-center" style={{ gap: 'var(--token-space-1)', marginBottom: 'var(--token-space-1)' }}>
                  <Sparkles size={10} style={{ color: 'var(--token-accent)' }} />
                  <span style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-tertiary)' }}>
                    Transcription
                  </span>
                </div>
                {transcription}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          borderTop: '1px solid var(--token-border)',
        }}
      >
        {/* Quick attach buttons */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          <DSButton
            variant="icon"
            icon={<ImageIcon size={13} />}
            title="Attach image"
            onClick={() => {
              if (attachments.length < maxAttachments) {
                addAttachment({
                  id: `img-${Date.now()}`,
                  type: 'image',
                  name: 'photo.jpg',
                  meta: '640x480',
                });
              }
            }}
            style={{ width: 26, height: 26 }}
          />
          <DSButton
            variant="icon"
            icon={<Link size={13} />}
            title="Attach URL"
            onClick={() => {
              if (attachments.length < maxAttachments) {
                addAttachment({
                  id: `url-${Date.now()}`,
                  type: 'url',
                  name: 'example.com',
                  preview: 'https://example.com',
                });
              }
            }}
            style={{ width: 26, height: 26 }}
          />
          <DSButton
            variant="icon"
            icon={<FileText size={13} />}
            title="Attach document"
            onClick={() => {
              if (attachments.length < maxAttachments) {
                addAttachment({
                  id: `doc-${Date.now()}`,
                  type: 'document',
                  name: 'document.pdf',
                  meta: '2.4 MB',
                });
              }
            }}
            style={{ width: 26, height: 26 }}
          />
        </div>

        {/* Send / Stop */}
        {isStreaming ? (
          <DSButton
            variant="primary"
            icon={<Square size={12} fill="currentColor" />}
            onClick={onStop}
            style={{
              width: 30, height: 30,
              borderRadius: 'var(--token-radius-full)',
              padding: 0,
              minWidth: 'unset',
              background: 'var(--token-error)',
              animation: 'token-pulse 2s ease infinite',
            }}
          />
        ) : (
          <DSButton
            variant="primary"
            icon={<ArrowUp size={14} />}
            onClick={handleSend}
            style={{
              width: 30, height: 30,
              borderRadius: 'var(--token-radius-full)',
              padding: 0,
              minWidth: 'unset',
            }}
          />
        )}
      </div>
    </div>
  );
}

export function MultiModalInputDemo() {
  const [streaming, setStreaming] = useState(false);

  return (
    <div className="flex flex-col" style={{ maxWidth: 440, width: '100%', gap: 'var(--token-space-3)' }}>
      <MultiModalInput
        isStreaming={streaming}
        onSend={() => { setStreaming(true); setTimeout(() => setStreaming(false), 3000); }}
        onStop={() => setStreaming(false)}
        placeholder="Message with attachments... (paste URLs or images)"
      />
      <div style={{ fontSize: 'var(--token-text-2xs)', color: 'var(--token-text-disabled)', textAlign: 'center' }}>
        Try the attach buttons, mode tabs, or paste a URL
      </div>
    </div>
  );
}