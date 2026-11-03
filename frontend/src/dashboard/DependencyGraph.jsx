import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    position: { x: 300, y: 20 },
    data: { label: 'Raw Material Supplier' },
    style: { background: '#173b4a', color: '#fff', border: '1px solid #20c6dc', borderRadius: 10, padding: 15, width: 190 }
  },
  {
    id: '2',
    position: { x: 50, y: 170 },
    data: { label: 'Component Supplier A' },
    style: { background: '#173b4a', color: '#fff', border: '1px solid #20c6dc', borderRadius: 10, padding: 15, width: 190 }
  },
  {
    id: '3',
    position: { x: 350, y: 170 },
    data: { label: 'Component Supplier B' },
    style: { background: '#482c2b', color: '#fff', border: '1px solid #ff6262', borderRadius: 10, padding: 15, width: 190 }
  },
  {
    id: '4',
    position: { x: 200, y: 330 },
    data: { label: 'Manufacturing Plant' },
    style: { background: '#30264a', color: '#fff', border: '1px solid #b99aff', borderRadius: 10, padding: 15, width: 190 }
  },
  {
    id: '5',
    position: { x: 200, y: 490 },
    data: { label: 'Distribution Warehouse' },
    style: { background: '#173c35', color: '#fff', border: '1px solid #55d9a1', borderRadius: 10, padding: 15, width: 190 }
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#ff6262', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ff6262', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true }
];

export default function DependencyGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="dependency-page">
      <div className="dependency-heading">
        <div>
          <p className="eyebrow">NETWORK / DEPENDENCY ANALYSIS</p>
          <h2>Supply Chain Dependency Graph</h2>
          <p className="subheading">
            Visualise how suppliers connect to manufacturing and distribution.
          </p>
        </div>
        <span className="demo-tag">DEMO DATA</span>
      </div>

      <div className="dependency-info">
        <span>🔵 Normal dependency</span>
        <span>🔴 At-risk supplier connection</span>
        <span>🟣 Manufacturing</span>
        <span>🟢 Distribution</span>
      </div>

      <div className="dependency-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.25 }}
        >
          <Background color="#34475b" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={node => node.id === '3' ? '#ff6262' : '#20c6dc'}
            maskColor="rgba(5,15,25,0.7)"
          />
        </ReactFlow>
      </div>

      <p className="map-disclaimer">
        Illustrative supplier dependencies. Not connected to live supplier data.
      </p>
    </div>
  );
}