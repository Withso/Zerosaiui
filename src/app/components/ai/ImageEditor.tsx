/* —— ImageEditor — Phase 3 Enhanced ——
   Phase 3: generative fill prompt input, edit history panel,
   layer indicator, prompt-based inpaint region, zoom percentage display */
import { useState } from 'react';
import {
  MousePointer2, Paintbrush, Eraser, Scissors,
  Download, RotateCcw, ZoomIn, ZoomOut,
  Undo2, Redo2, Move, Wand2, Clock, Sparkles, Send,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type EditorTool = 'select' | 'inpaint' | 'erase' | 'crop' | 'move' | 'gen-fill';

interface HistoryEntry {
  id: string;
  action: string;
  timestamp: string;
}

interface ImageEditorProps {
  activeTool?: EditorTool;
  brushSize?: number;
  onToolChange?: (tool: EditorTool) => void;
  onBrushSizeChange?: (size: number) => void;
}

export function ImageEditor({
  activeTool: controlledTool,
  brushSize: controlledBrush,
  onToolChange,
  onBrushSizeChange,
}: ImageEditorProps) {
  const [internalTool, setInternalTool] = useState<EditorTool>('inpaint');
  const [internalBrush, setInternalBrush] = useState(24);
  const activeTool = controlledTool ?? internalTool;
  const brushSize = controlledBrush ?? internalBrush;
  const [zoom, setZoom] = useState(100);
  const [showHistory, setShowHistory] = useState(false);
  const [genFillPrompt, setGenFillPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectTool = (tool: EditorTool) => {
    setInternalTool(tool);
    onToolChange?.(tool);
  };

  const setBrush = (size: number) => {
    setInternalBrush(size);
    onBrushSizeChange?.(size);
  };

  /* —— Mock history —— */
  const history: HistoryEntry[] = [
    { id: '1', action: 'Original image', timestamp: '0:00' },
    { id: '2', action: 'Inpaint: sky region', timestamp: '0:12' },
    { id: '3', action: 'Erase: foreground object', timestamp: '0:28' },
    { id: '4', action: 'Gen Fill: "add sunset clouds"', timestamp: '0:45' },
  ];

  const tools: { id: EditorTool; icon: React.ReactNode; label: string; badge?: string }[] = [
    { id: 'select', icon: <MousePointer2 size={15} />, label: 'Select' },
    { id: 'inpaint', icon: <Paintbrush size={15} />, label: 'Inpaint' },
    { id: 'gen-fill', icon: <Sparkles size={15} />, label: 'Gen Fill', badge: 'AI' },
    { id: 'erase', icon: <Eraser size={15} />, label: 'Erase' },
    { id: 'crop', icon: <Scissors size={15} />, label: 'Crop' },
    { id: 'move', icon: <Move size={15} />, label: 'Pan' },
  ];

  const toolBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 'var(--token-radius-md)',
    borderWidth: active ? '1px' : '1px',
    borderStyle: 'solid',
    borderColor: active ? 'var(--token-accent)' : 'transparent',
    background: active ? 'var(--token-accent-light)' : 'transparent',
    color: active ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
    cursor: 'pointer',
    transition: 'all var(--token-duration-fast) var(--token-ease-default)',
    position: 'relative' as const,
  });

  const handleGenFill = () => {
    if (!genFillPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenFillPrompt('');
    }, 2000);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        gap: 0,
        width: '100%',
      }}
    >
      {/* Canvas area */}
      <div
        className="relative"
        style={{
          width: '100%',
          aspectRatio: '16/10',
          background: 'var(--token-bg-tertiary)',
          borderRadius: 'var(--token-radius-lg) var(--token-radius-lg) 0 0',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--token-border)',
          borderBottomWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Checkerboard transparency */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(45deg, var(--token-bg-tertiary) 25%, transparent 25%), ' +
              'linear-gradient(-45deg, var(--token-bg-tertiary) 25%, transparent 25%), ' +
              'linear-gradient(45deg, transparent 75%, var(--token-bg-tertiary) 75%), ' +
              'linear-gradient(-45deg, transparent 75%, var(--token-bg-tertiary) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.3,
          }}
        />

        {/* Inpaint/Gen-fill region indicator */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: '25%',
            left: '30%',
            width: '40%',
            height: '50%',
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: activeTool === 'gen-fill' ? 'var(--token-chart-6)' : 'var(--token-accent)',
            borderRadius: 'var(--token-radius-md)',
            background: activeTool === 'gen-fill' ? 'rgba(168,135,143,0.08)' : 'rgba(0, 102, 255, 0.06)',
            transition: 'all var(--token-duration-fast)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: activeTool === 'gen-fill' ? 'var(--token-chart-6)' : 'var(--token-accent)',
              fontFamily: 'var(--token-font-mono)',
              background: 'var(--token-bg)',
              padding: '2px 8px',
              borderRadius: 'var(--token-radius-sm)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: activeTool === 'gen-fill' ? 'var(--token-chart-6)' : 'var(--token-accent)',
            }}
          >
            {activeTool === 'gen-fill' ? 'Gen Fill Region' : 'Inpaint Region'}
          </span>
        </div>

        {/* Cursor indicator */}
        {(activeTool === 'inpaint' || activeTool === 'erase') && (
          <div
            className="absolute"
            style={{
              top: '45%',
              left: '48%',
              width: brushSize,
              height: brushSize,
              borderRadius: 'var(--token-radius-full)',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: 'var(--token-text-primary)',
              opacity: 0.6,
              pointerEvents: 'none',
              transition: 'opacity var(--token-duration-fast)',
            }}
          />
        )}

        {/* Zoom indicator */}
        <div
          className="absolute flex items-center"
          style={{
            bottom: 'var(--token-space-2)',
            right: 'var(--token-space-2)',
            gap: 'var(--token-space-1)',
            padding: 'var(--token-space-1) var(--token-space-2)',
            borderRadius: 'var(--token-radius-sm)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {zoom}%
          </span>
        </div>

        {/* Generating overlay */}
        {isGenerating && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(2px)',
              animation: 'token-fade-in 200ms ease',
            }}
          >
            <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-2)' }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: 'var(--token-radius-full)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.2)',
                borderTopColor: 'rgba(255,255,255,0.8)',
                animation: 'token-spin 1s linear infinite',
              }} />
              <span style={{
                fontSize: 'var(--token-text-xs)',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                Generating...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gen Fill prompt bar */}
      {activeTool === 'gen-fill' && (
        <div
          className="flex items-center"
          style={{
            gap: 'var(--token-space-2)',
            padding: 'var(--token-space-2) var(--token-space-3)',
            background: 'var(--token-bg)',
            borderLeftWidth: '1px',
            borderRightWidth: '1px',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderStyle: 'solid',
            borderColor: 'var(--token-border)',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--token-chart-6)', flexShrink: 0 }} />
          <input
            value={genFillPrompt}
            onChange={e => setGenFillPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenFill()}
            placeholder="Describe what to fill (e.g., 'add sunset clouds')..."
            style={{
              flex: 1,
              borderWidth: 0,
              borderStyle: 'none',
              background: 'transparent',
              fontSize: 'var(--token-text-sm)',
              fontFamily: 'var(--token-font-sans)',
              color: 'var(--token-text-primary)',
              outline: 'none',
            }}
          />
          <DSButton
            size="sm"
            variant="primary"
            onClick={handleGenFill}
            disabled={!genFillPrompt.trim() || isGenerating}
            icon={<Send size={12} />}
            style={{ borderRadius: 'var(--token-radius-full)', padding: 'var(--token-space-1-5) var(--token-space-3)' }}
          >
            Fill
          </DSButton>
        </div>
      )}

      {/* Toolbar */}
      <div
        className="flex items-center"
        style={{
          padding: 'var(--token-space-2) var(--token-space-3)',
          background: 'var(--token-bg-secondary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--token-border)',
          borderRadius: '0 0 var(--token-radius-lg) var(--token-radius-lg)',
          gap: 'var(--token-space-2)',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {/* Tool buttons */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)', flexWrap: 'wrap' }}>
          {tools.map(t => (
            <div key={t.id} className="relative">
              <button
                onClick={() => selectTool(t.id)}
                style={toolBtnStyle(activeTool === t.id)}
                title={t.label}
                onMouseEnter={e => {
                  if (activeTool !== t.id) {
                    e.currentTarget.style.background = 'var(--token-bg-hover)';
                    e.currentTarget.style.color = 'var(--token-text-secondary)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTool !== t.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--token-text-tertiary)';
                  }
                }}
              >
                {t.icon}
              </button>
              {t.badge && (
                <div style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 6, height: 6,
                  borderRadius: 'var(--token-radius-full)',
                  background: 'var(--token-chart-6)',
                }} />
              )}
            </div>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'var(--token-border)', margin: '0 var(--token-space-1)' }} />

          {/* Brush size slider */}
          {(activeTool === 'inpaint' || activeTool === 'erase') && (
            <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
              <input
                type="range"
                min={4} max={64}
                value={brushSize}
                onChange={e => setBrush(Number(e.target.value))}
                style={{ width: 80, accentColor: 'var(--token-accent)', height: 4 }}
              />
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
                width: 24,
                textAlign: 'right',
              }}>
                {brushSize}
              </span>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          <DSButton variant="icon" icon={<Undo2 size={14} />} title="Undo" style={{ width: 30, height: 30 }} />
          <DSButton variant="icon" icon={<Redo2 size={14} />} title="Redo" style={{ width: 30, height: 30 }} />
          <div style={{ width: 1, height: 20, background: 'var(--token-border)', margin: '0 var(--token-space-0-5)' }} />
          <DSButton
            variant="icon"
            icon={<ZoomOut size={14} />}
            onClick={() => setZoom(z => Math.max(25, z - 25))}
            title="Zoom Out"
            style={{ width: 30, height: 30 }}
          />
          <DSButton
            variant="icon"
            icon={<ZoomIn size={14} />}
            onClick={() => setZoom(z => Math.min(400, z + 25))}
            title="Zoom In"
            style={{ width: 30, height: 30 }}
          />
          <DSButton
            variant="icon"
            icon={<Clock size={14} />}
            onClick={() => setShowHistory(!showHistory)}
            title="History"
            style={{
              width: 30, height: 30,
              color: showHistory ? 'var(--token-accent)' : undefined,
            }}
          />
          <DSButton variant="icon" icon={<RotateCcw size={14} />} title="Reset" style={{ width: 30, height: 30 }} />
        </div>
      </div>

      {/* History panel */}
      {showHistory && (
        <div
          className="flex flex-col"
          style={{
            marginTop: 'var(--token-space-2)',
            borderRadius: 'var(--token-radius-md)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--token-border)',
            background: 'var(--token-bg)',
            overflow: 'hidden',
            animation: 'token-fade-in 150ms ease',
          }}
        >
          <div style={{
            padding: 'var(--token-space-2) var(--token-space-3)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--token-border-subtle)',
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Edit History
          </div>
          {history.map((entry, i) => (
            <button
              key={entry.id}
              className="flex items-center w-full cursor-pointer"
              style={{
                gap: 'var(--token-space-2)',
                padding: 'var(--token-space-2) var(--token-space-3)',
                borderWidth: 0,
                borderStyle: 'none',
                borderBottomWidth: i < history.length - 1 ? '1px' : 0,
                borderBottomStyle: 'solid',
                borderBottomColor: 'var(--token-border-subtle)',
                background: i === history.length - 1 ? 'var(--token-bg-hover)' : 'transparent',
                textAlign: 'left',
                fontFamily: 'var(--token-font-sans)',
                transition: 'background var(--token-duration-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = i === history.length - 1 ? 'var(--token-bg-hover)' : 'transparent'; }}
            >
              <div style={{
                width: 6, height: 6,
                borderRadius: 'var(--token-radius-full)',
                background: i === history.length - 1 ? 'var(--token-accent)' : 'var(--token-border)',
                flexShrink: 0,
              }} />
              <span style={{
                flex: 1,
                fontSize: 'var(--token-text-xs)',
                color: 'var(--token-text-secondary)',
              }}>
                {entry.action}
              </span>
              <span style={{
                fontSize: 'var(--token-text-2xs)',
                color: 'var(--token-text-disabled)',
                fontFamily: 'var(--token-font-mono)',
              }}>
                {entry.timestamp}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageEditorDemo() {
  const [activeTool, setActiveTool] = useState<string>('inpaint');

  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-3)' }}>
      <ImageEditor onToolChange={(tool) => setActiveTool(tool)} />
      <div style={{
        padding: 'var(--token-space-2) var(--token-space-3)',
        borderRadius: 'var(--token-radius-md)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        background: 'var(--token-bg-secondary)',
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-secondary)',
        fontFamily: 'var(--token-font-mono)',
      }}>
        Active tool: {activeTool}
      </div>
    </div>
  );
}