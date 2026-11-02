
import { useCallback } from 'react';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position
} from '@xyflow/react';

import SectionTitle from '../components/SectionTitle';

function Node({ data }) {
  return (
    <div className={`dependency-node ${data.status || ''}`}>
      <Handle type="target" position={Position.Left} />

      <small>{data.type}</small>
      <b>{data.label}</b>
      <span>{data.detail}</span>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  supply: Node
};

const nodes = [
  {
    id: 's1',
    type: 'supply',
    position: { x: 0, y: 90 },
    data: {
      type: 'SUPPLIER',
      label: 'Apex Metals',
      detail: 'Shipment delayed',
      status: 'risk'
    }
  },
  {
    id: 's2',
    type: 'supply',
    position: { x: 0, y: 280 },
    data: {
      type: 'SUPPLIER',
      label: 'Zenith Materials',
      detail: 'Alternative supplier',
      status: 'safe'
    }
  },
  {
    id: 'm1',
    type: 'supply',
    position: { x: 245, y: 90 },
    data: {
      type: 'RAW MATERIAL',
      label: 'Aluminium sheets',
      detail: 'Shortage risk',
      status: 'risk'
    }
  },
  {
    id: 'f1',
    type: 'supply',
    position: { x: 490, y: 90 },
    data: {
      type: 'FACTORY',
      label: 'Bengaluru facility',
      detail: 'Production at risk',
      status: 'risk'
    }
  },
  {
    id: 'w1',
    type: 'supply',
    position: { x: 735, y: 0 },
    data: {
      type: 'WAREHOUSE',
      label: 'South warehouse',
      detail: 'Low stock',
      status: 'risk'
    }
  },
  {
    id: 'w2',
    type: 'supply',
    position: { x: 735, y: 190 },
    data: {
      type: 'WAREHOUSE',
      label: 'Chennai warehouse',
      detail: 'Available stock',
      status: 'safe'
    }
  },
  {
    id: 'o1',
    type: 'supply',
    position: { x: 980, y: 90 },
    data: {
      type: 'CUSTOMER ORDERS',
      label: '3 customer orders',
      detail: 'Delivery may be affected',
      status: 'risk'
    }
  }
];

const edges = [
  {
    id: 'e1',
    source: 's1',
    target: 'm1',
    animated: true,
    style: { stroke: '#ef7777', strokeWidth: 2 }
  },
  {
    id: 'e2',
    source: 's2',
    target: 'm1',
    style: { stroke: '#43c7a3', strokeWidth: 2 }
  },
  {
    id: 'e3',
    source: 'm1',
    target: 'f1',
    animated: true,
    style: { stroke: '#ef7777', strokeWidth: 2 }
  },
  {
    id: 'e4',
    source: 'f1',
    target: 'w1',
    style: { stroke: '#ef7777', strokeWidth: 2 }
  },
  {
    id: 'e5',
    source: 'f1',
    target: 'w2',
    style: { stroke: '#43c7a3', strokeWidth: 2 }
  },
  {
    id: 'e6',
    source: 'w1',
    target: 'o1',
    style: { stroke: '#ef7777', strokeWidth: 2 }
  },
  {
    id: 'e7',
    source: 'w2',
    target: 'o1',
    style: { stroke: '#43c7a3', strokeWidth: 2 }
  }
];

export default function Dependency() {
  const onNodesChange = useCallback(() => {}, []);

  return (
    <>
      <SectionTitle
        eyebrow="DEPENDENCY INTELLIGENCE"
        title="Supply chain dependency map"
        description="Trace how a disruption at one supplier can affect materials, factories, warehouses and customer orders."
        action={
          <span className="pill pill-warn">
            INC-2048 IMPACT VIEW
          </span>
        }
      />

      <div className="dependency-legend">
        <span>
          <i className="legend-red"></i>
          Affected dependency
        </span>

        <span>
          <i className="legend-green"></i>
          Available / alternative
        </span>

        <span>Drag nodes to explore the network</span>
      </div>

      <div className="panel flow-panel">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#2b3b50" gap={22} />
          <Controls />

          <MiniMap
            nodeColor={(n) =>
              n.data.status === 'risk' ? '#ef7777' : '#43c7a3'
            }
            maskColor="rgba(7,16,29,.7)"
          />
        </ReactFlow>
      </div>

      <div className="impact-summary">
        <div>
          <b>01</b>
          <span>Disrupted supplier</span>
        </div>

        <div>
          <b>01</b>
          <span>Material at risk</span>
        </div>

        <div>
          <b>01</b>
          <span>Factory affected</span>
        </div>

        <div>
          <b>03</b>
          <span>Customer orders exposed</span>
        </div>
      </div>
    </>
  );
}
