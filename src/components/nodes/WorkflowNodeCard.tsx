import type { CSSProperties } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { nodeCatalog } from '../../constants/nodeCatalog'
import type { WorkflowNodeData } from '../../types/workflow'
import { getNodePrimaryText } from '../../utils/workflow'

export function WorkflowNodeCard({ data, selected }: NodeProps<WorkflowNodeData>) {
  const meta = nodeCatalog[data.kind]

  return (
    <div
      className={`workflow-node ${selected ? 'selected' : ''}`}
      style={{ '--node-accent': meta.accent } as CSSProperties}
    >
      {data.kind !== 'start' && (
        <Handle className="workflow-handle" type="target" position={Position.Left} />
      )}
      <div className="node-chip">{meta.label}</div>
      <strong>{getNodePrimaryText({ data })}</strong>
      <span>{meta.description}</span>
      {data.kind !== 'end' && (
        <Handle className="workflow-handle" type="source" position={Position.Right} />
      )}
    </div>
  )
}
