import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMemo } from 'react'

function buildFlow(graphData) {
  if (!graphData?.nodes?.length) return { nodes: [], edges: [] }

  const nodes = graphData.nodes.map((node, i) => {
    const angle  = (i / graphData.nodes.length) * 2 * Math.PI
    const radius = 180
    const score  = node.riskScore || 0
    const color  = score >= 60 ? '#FF3B3B' : score >= 35 ? '#FFB800' : '#00FF88'

    return {
      id: node.id,
      position: {
        x: 300 + radius * Math.cos(angle),
        y: 200 + radius * Math.sin(angle)
      },
      data: { label: node.label || node.id },
      style: {
        background:  '#111827',
        border:      `1.5px solid ${color}`,
        color:       '#E8EDF5',
        borderRadius: '8px',
        fontSize:    '11px',
        fontFamily:  'JetBrains Mono',
        padding:     '6px 10px',
        boxShadow:   `0 0 12px ${color}33`,
      }
    }
  })

  const edges = (graphData.edges || []).map((edge, i) => ({
    id: `e-${i}`,
    source: edge.source,
    target: edge.target,
    label:  edge.relationship,
    style:  { stroke: '#1E2D45', strokeWidth: 1.5 },
    labelStyle: { fill: '#7A8BA8', fontSize: 9, fontFamily: 'JetBrains Mono' },
    animated: true,
  }))

  return { nodes, edges }
}

export default function FraudGraph({ graphData }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlow(graphData), [graphData]
  )
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  if (!graphData?.nodes?.length) return (
    <div className="h-64 flex items-center justify-center text-text-muted text-sm">
      No relationship graph available
    </div>
  )

  return (
    <div className="h-80 rounded-xl overflow-hidden border border-bg-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#1E2D45" gap={20} size={1} />
        <Controls style={{ background: '#111827', border: '1px solid #1E2D45' }} />
        <MiniMap
          nodeColor={n => n.style?.borderColor || '#1E2D45'}
          style={{ background: '#0D1421', border: '1px solid #1E2D45' }}
          maskColor="#080C1488"
        />
      </ReactFlow>
    </div>
  )
}