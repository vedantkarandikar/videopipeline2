"use client"

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Handle,
  Position,
  useReactFlow,
  BackgroundVariant,
} from 'react-flow-renderer';
import TopBar from './TopBar';
import BlockCatalog from './BlockCatalog';
import NodeOptions from './NodeOptions';
import * as BlockIcons from './BlockIcons';

const GRID_SIZE = 20;

const snapToGrid = (x: number, y: number) => {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
};

const getNodeColor = (type: string, isSelected: boolean) => {
  const baseColors = {
    input: 'bg-blue-200 hover:bg-blue-300',
    processing: 'bg-purple-200 hover:bg-purple-300',
    ai: 'bg-green-200 hover:bg-green-300',
    editing: 'bg-yellow-200 hover:bg-yellow-300',
    customization: 'bg-pink-200 hover:bg-pink-300',
    logic: 'bg-indigo-200 hover:bg-indigo-300',
    integration: 'bg-cyan-200 hover:bg-cyan-300',
    output: 'bg-red-200 hover:bg-red-300',
    aiconfig: 'bg-violet-200 hover:bg-violet-300',
    moderation: 'bg-orange-200 hover:bg-orange-300',
    interaction: 'bg-teal-200 hover:bg-teal-300',
    collaboration: 'bg-lime-200 hover:bg-lime-300',
    misc: 'bg-gray-200 hover:bg-gray-300',
  };
  const selectedColors = {
    input: 'bg-blue-300',
    processing: 'bg-purple-300',
    ai: 'bg-green-300',
    editing: 'bg-yellow-300',
    customization: 'bg-pink-300',
    logic: 'bg-indigo-300',
    integration: 'bg-cyan-300',
    output: 'bg-red-300',
    aiconfig: 'bg-violet-300',
    moderation: 'bg-orange-300',
    interaction: 'bg-teal-300',
    collaboration: 'bg-lime-300',
    misc: 'bg-gray-300',
  };
  return isSelected ? selectedColors[type] : baseColors[type];
};

const CustomNode = ({ data, type, selected }) => {
  const Icon = BlockIcons[data.icon];
  const colorClass = getNodeColor(type, selected);

  return (
    <div className={`rounded-lg p-2 w-32 h-32 shadow-sm hover:shadow-md flex flex-col items-center justify-center transition-colors duration-200 ${colorClass}`}>
      <Handle type="target" position={Position.Left} />
      {Icon && <Icon className="w-12 h-12 mb-2" />}
      <strong className="text-center text-sm">{data.label}</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const PipelineEditorFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const snappedPosition = snapToGrid(position.x, position.y);

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: 'custom',
        position: snappedPosition,
        data: { label: type, icon: type.replace(/\s+/g, '') },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, nodes, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSidebarOpen(false);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full flex">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
        <Controls />
      </ReactFlow>
      {sidebarOpen && (
        <NodeOptions
          node={selectedNode}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default function PipelineEditor() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <BlockCatalog onDragStart={onDragStart} />
        <ReactFlowProvider>
          <PipelineEditorFlow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}