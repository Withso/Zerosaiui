/* —— CanvasWorkspace — Phase 3 Enhanced ——
   Phase 3: node-based workflow with status indicators per node,
   connection lines between nodes, minimap, node context menu,
   collaboration cursor hints */
import { useState } from 'react';
import {
  MousePointer2, Type, Square, Circle, Image, Sparkles,
  Layers, ZoomIn, ZoomOut, Hand, Undo2, Redo2,
  Play, Pause, CheckCircle2, AlertCircle, Loader2, Link2,
} from 'lucide-react';
import { DSButton, DSBadge } from '../ds/atoms';

type CanvasTool = 'select' | 'text' | 'rectangle' | 'ellipse' | 'image' | 'ai' | 'hand';
type NodeStatus = 'idle' | 'running' | 'complete' | 'error';

interface CanvasNode {
  id: string;
  type: 'text' | 'shape' | 'image' | 'ai-block';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
  status?: NodeStatus;
  connectedTo?: string[];
}

interface CanvasWorkspaceProps {
  activeTool?: CanvasTool;
  nodes?: CanvasNode[];
  zoom?: number;
  onToolChange?: (tool: CanvasTool) => void;
}

/* —— Status config —— */
const statusConfig: Record<NodeStatus, { color: string; icon: React.ReactNode }> = {
  idle: { color: 'var(--token-text-disabled)', icon: null },
  running: { color: 'var(--token-warning)', icon: <Loader2 size={10} style={{ animation: 'token-spin 1s linear infinite' }} /> },
  complete: { color: 'var(--token-success)', icon: <CheckCircle2 size={10} /> },
  error: { color: 'var(--token-error)', icon: <AlertCircle size={10} /> },
};

export function CanvasWorkspace({
  activeTool: controlledTool,
  nodes: controlledNodes,
  zoom: controlledZoom,
  onToolChange,
}: CanvasWorkspaceProps) {
  const [internalTool, setInternalTool] = useState<CanvasTool>('select');
  const [internalZoom, setInternalZoom] = useState(100);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('ai-1');
  const [showMinimap, setShowMinimap] = useState(true);

  const activeTool = controlledTool ?? internalTool;
  const zoom = controlledZoom ?? internalZoom;
  const nodes = controlledNodes || defaultNodes;

  const selectTool = (tool: CanvasTool) => {
    setInternalTool(tool);
    onToolChange?.(tool);
  };

  const tools: { id: CanvasTool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 size={15} />, label: 'Select' },
    { id: 'hand', icon: <Hand size={15} />, label: 'Pan' },
    { id: 'text', icon: <Type size={15} />, label: 'Text' },
    { id: 'rectangle', icon: <Square size={15} />, label: 'Rectangle' },
    { id: 'ellipse', icon: <Circle size={15} />, label: 'Ellipse' },
    { id: 'image', icon: <Image size={15} />, label: 'Image' },
    { id: 'ai', icon: <Sparkles size={15} />, label: 'AI Generate' },
  ];

  const toolBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 'var(--token-radius-md)',
    borderWidth: 0,
    borderStyle: 'none',
    background: active ? 'var(--token-accent-light)' : 'transparent',
    color: active ? 'var(--token-accent)' : 'var(--token-text-tertiary)',
    cursor: 'pointer',
    transition: 'all var(--token-duration-fast)',
  });

  /* —— Draw connection lines via SVG —— */
  const getNodeCenter = (node: CanvasNode) => ({
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  });

  const connections: Array<{ from: CanvasNode; to: CanvasNode }> = [];
  nodes.forEach(node => {
    if (node.connectedTo) {
      node.connectedTo.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (target) connections.push({ from: node, to: target });
      });
    }
  });

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Top toolbar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-0-5)' }}>
          {tools.map(t => (
            <button
              key={t.id}
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
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
          {/* Run workflow button */}
          <DSButton
            size="sm"
            variant="primary"
            icon={<Play size={11} />}
            style={{
              borderRadius: 'var(--token-radius-full)',
              padding: 'var(--token-space-1) var(--token-space-3)',
              fontSize: 'var(--token-text-2xs)',
            }}
          >
            Run
          </DSButton>

          <div style={{ width: 1, height: 16, background: 'var(--token-border)', margin: '0 2px' }} />

          <button
            style={toolBtnStyle(false)}
            onClick={() => setInternalZoom(z => Math.max(25, z - 25))}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ZoomOut size={14} />
          </button>
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-tertiary)',
            fontFamily: 'var(--token-font-mono)',
            minWidth: 32,
            textAlign: 'center',
          }}>
            {zoom}%
          </span>
          <button
            style={toolBtnStyle(false)}
            onClick={() => setInternalZoom(z => Math.min(400, z + 25))}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ZoomIn size={14} />
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--token-border)', margin: '0 2px' }} />
          <button style={toolBtnStyle(false)}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Undo2 size={14} />
          </button>
          <button style={toolBtnStyle(false)}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--token-bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="relative"
        style={{
          height: 280,
          background: 'var(--token-bg)',
          backgroundImage: 'radial-gradient(circle, var(--token-border-subtle) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          overflow: 'hidden',
          cursor: activeTool === 'hand' ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair',
        }}
        onClick={() => setSelectedNodeId(null)}
      >
        {/* Connection lines SVG */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {connections.map((conn, i) => {
            const from = getNodeCenter(conn.from);
            const to = getNodeCenter(conn.to);
            const midX = (from.x + to.x) / 2;
            return (
              <g key={i}>
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="var(--token-accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.4"
                />
                {/* Arrow marker */}
                <circle cx={to.x} cy={to.y} r="3" fill="var(--token-accent)" opacity="0.5" />
              </g>
            );
          })}
        </svg>

        {/* Canvas nodes */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const status = node.status || 'idle';
          const sc = statusConfig[status];

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                borderRadius: node.type === 'ai-block' ? 'var(--token-radius-lg)' : 'var(--token-radius-md)',
                background: node.color,
                borderWidth: isSelected ? '2px' : '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'var(--token-accent)' : 'var(--token-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color var(--token-duration-fast)',
                boxShadow: isSelected ? '0 0 0 3px var(--token-accent-light)' : 'var(--token-shadow-xs)',
              }}
            >
              {/* Status indicator */}
              {status !== 'idle' && (
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: 'var(--token-radius-full)',
                    background: sc.color,
                    color: 'white',
                    zIndex: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {sc.icon}
                </div>
              )}

              {node.type === 'ai-block' && (
                <div className="flex flex-col items-center" style={{ gap: 'var(--token-space-1)' }}>
                  <Sparkles size={16} style={{ color: 'var(--token-accent)', opacity: 0.7 }} />
                  <span style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-tertiary)',
                    fontFamily: 'var(--token-font-mono)',
                  }}>
                    {node.label}
                  </span>
                </div>
              )}
              {node.type === 'text' && (
                <span style={{
                  fontSize: 'var(--token-text-xs)',
                  color: 'var(--token-text-secondary)',
                  padding: 'var(--token-space-2)',
                }}>
                  {node.label}
                </span>
              )}
              {node.type === 'shape' && (
                <span style={{
                  fontSize: 'var(--token-text-2xs)',
                  color: 'var(--token-text-disabled)',
                  fontFamily: 'var(--token-font-mono)',
                }}>
                  {node.label}
                </span>
              )}
              {node.type === 'image' && (
                <Image size={14} style={{ color: 'var(--token-text-disabled)' }} />
              )}

              {/* Selection handles */}
              {isSelected && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {[
                    { top: -4, left: -4 },
                    { top: -4, right: -4 },
                    { bottom: -4, left: -4 },
                    { bottom: -4, right: -4 },
                  ].map((pos, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        ...pos,
                        width: 7,
                        height: 7,
                        borderRadius: 1,
                        background: 'var(--token-accent)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--token-bg)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* AI prompt overlay */}
        {activeTool === 'ai' && (
          <div
            className="absolute flex items-center"
            style={{
              bottom: 'var(--token-space-4)',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: 'var(--token-space-2)',
              padding: 'var(--token-space-2) var(--token-space-4)',
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-text-primary)',
              color: 'var(--token-text-inverse)',
              boxShadow: 'var(--token-shadow-lg)',
              animation: 'token-fade-in var(--token-duration-normal) var(--token-ease-default)',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={13} />
            <span style={{ fontSize: 'var(--token-text-xs)' }}>
              Click or drag to generate with AI
            </span>
          </div>
        )}

        {/* Minimap */}
        {showMinimap && (
          <div
            className="absolute"
            style={{
              bottom: 'var(--token-space-2)',
              right: 'var(--token-space-2)',
              width: 80,
              height: 50,
              borderRadius: 'var(--token-radius-sm)',
              background: 'var(--token-bg-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--token-border)',
              overflow: 'hidden',
              opacity: 0.8,
            }}
          >
            {nodes.map(node => (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.x * 0.2,
                  top: node.y * 0.16,
                  width: node.width * 0.2,
                  height: node.height * 0.16,
                  borderRadius: 1,
                  background: selectedNodeId === node.id ? 'var(--token-accent)' : 'var(--token-text-disabled)',
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* Collaboration cursor (demo) */}
        <div
          className="absolute"
          style={{
            top: 60,
            right: 60,
            pointerEvents: 'none',
          }}
        >
          <svg width="12" height="18" viewBox="0 0 12 18">
            <path d="M0 0L12 12H6L4 18L0 0Z" fill="var(--token-chart-4)" />
          </svg>
          <span style={{
            display: 'inline-block',
            marginLeft: 8,
            marginTop: -4,
            padding: '1px 6px',
            borderRadius: 'var(--token-radius-sm)',
            background: 'var(--token-chart-4)',
            color: 'white',
            fontSize: '9px',
            fontFamily: 'var(--token-font-sans)',
            whiteSpace: 'nowrap',
          }}>
            Alex
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--token-space-1-5) var(--token-space-3)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          <Layers size={12} style={{ color: 'var(--token-text-disabled)' }} />
          <span style={{
            fontSize: 'var(--token-text-2xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            {nodes.length} objects
          </span>
          {connections.length > 0 && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              · {connections.length} connections
            </span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
          {selectedNodeId && (
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              {nodes.find(n => n.id === selectedNodeId)?.label || ''}
            </span>
          )}
          {/* Collab indicator */}
          <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-success)',
            }} />
            <span style={{
              fontSize: 'var(--token-text-2xs)',
              color: 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
            }}>
              2 online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultNodes: CanvasNode[] = [
  { id: 'text-1', type: 'text', x: 20, y: 25, width: 140, height: 48, label: 'Input Prompt', color: 'var(--token-bg)', status: 'complete', connectedTo: ['ai-1'] },
  { id: 'shape-1', type: 'shape', x: 190, y: 20, width: 80, height: 56, label: 'Context', color: 'var(--token-bg-tertiary)', status: 'complete', connectedTo: ['ai-1'] },
  { id: 'ai-1', type: 'ai-block', x: 60, y: 120, width: 160, height: 100, label: 'GPT-4o', color: 'var(--token-accent-light)', status: 'running', connectedTo: ['shape-2'] },
  { id: 'shape-2', type: 'shape', x: 260, y: 140, width: 100, height: 70, label: 'Output', color: 'var(--token-bg-secondary)', status: 'idle' },
  { id: 'img-1', type: 'image', x: 290, y: 30, width: 70, height: 55, label: 'Reference', color: 'var(--token-bg-tertiary)' },
];

export function CanvasWorkspaceDemo() {
  return (
    <div className="flex flex-col" style={{ maxWidth: 480, width: '100%', gap: 'var(--token-space-2)' }}>
      <CanvasWorkspace />
      <span style={{
        fontSize: 'var(--token-text-2xs)',
        color: 'var(--token-text-disabled)',
        fontFamily: 'var(--token-font-mono)',
        textAlign: 'center',
      }}>
        Node-based AI workflow with connections and status indicators
      </span>
    </div>
  );
}
