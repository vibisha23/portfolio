import type { DragEvent } from 'react'
import { nodeCatalog } from '../../constants/nodeCatalog'
import type { ValidationResult, WorkflowNodeKind } from '../../types/workflow'

interface SidebarProps {
  nodeCounts: Record<WorkflowNodeKind, number>
  validation: ValidationResult
  onDragStart: (event: DragEvent<HTMLElement>, kind: WorkflowNodeKind) => void
  onOpenSandbox: () => void
}

export function Sidebar({
  nodeCounts,
  validation,
  onDragStart,
  onOpenSandbox,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div>
        <p className="eyebrow">Node Library</p>
        <h2>Build the workflow graph</h2>
        <p className="panel-copy">
          Drag node types onto the canvas and connect them into onboarding, leave, or verification flows.
        </p>
      </div>

      <div className="node-library">
        {(Object.keys(nodeCatalog) as WorkflowNodeKind[]).map((kind) => {
          const meta = nodeCatalog[kind]
          return (
            <button
              key={kind}
              type="button"
              draggable
              className="library-card"
              onDragStart={(event) => onDragStart(event, kind)}
            >
              <span className="swatch" style={{ backgroundColor: meta.accent }} />
              <div>
                <strong>{meta.label}</strong>
                <p>{meta.description}</p>
              </div>
              <small>{nodeCounts[kind]} placed</small>
            </button>
          )
        })}
      </div>

      <div className="summary-card">
        <div>
          <strong>Validation snapshot</strong>
          <p>{validation.errors.length} errors, {validation.warnings.length} warnings</p>
        </div>
        <button type="button" className="primary-button" onClick={onOpenSandbox}>
          Open sandbox
        </button>
      </div>
    </div>
  )
}
