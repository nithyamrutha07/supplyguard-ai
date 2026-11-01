import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

const nodeStyle = {
  background: "#1e293b",
  color: "white",
  border: "1px solid #38bdf8",
  borderRadius: 10,
  padding: 12,
  width: 160,
  fontSize: 13,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 50, y: 150 },
    data: { label: "🏭 Raw Material Supplier\nBengaluru" },
    style: nodeStyle,
  },
  {
    id: "2",
    position: { x: 300, y: 50 },
    data: { label: "📦 Warehouse\nChennai" },
    style: nodeStyle,
  },
  {
    id: "3",
    position: { x: 300, y: 250 },
    data: { label: "📦 Warehouse\nMumbai" },
    style: nodeStyle,
  },
  {
    id: "4",
    position: { x: 570, y: 150 },
    data: { label: "🏗️ Manufacturing Plant\nHyderabad" },
    style: nodeStyle,
  },
  {
    id: "5",
    position: { x: 840, y: 150 },
    data: { label: "🚚 Distribution Centre\nBengaluru" },
    style: nodeStyle,
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "Raw materials",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#22c55e", strokeWidth: 2 },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "Backup supply",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#22c55e", strokeWidth: 2 },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    label: "Main supply",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#ef4444", strokeWidth: 3 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    label: "Alternative supply",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#22c55e", strokeWidth: 2 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "Finished goods",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#22c55e", strokeWidth: 2 },
  },
];

export default function DependencyGraph() {
  return (
    <section style={{
      background: "#111827",
      padding: 20,
      borderRadius: 12,
      marginTop: 24,
      color: "white"
    }}>
      <h2>Supply Chain Dependency Graph</h2>
      <p style={{ color: "#9ca3af" }}>
        Explore suppliers, warehouses and manufacturing dependencies.
      </p>

      <div style={{ height: 480, background: "#0f172a", borderRadius: 10 }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          nodesDraggable
          nodesConnectable={false}
        >
          <Background color="#334155" gap={20} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <p style={{ color: "#9ca3af", marginTop: 12 }}>
        🟢 Normal dependency &nbsp; 🔴 Critical dependency
      </p>
    </section>
  );
}