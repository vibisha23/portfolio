import { nodeCatalog } from '../../constants/nodeCatalog'
import type { AutomationDefinition, WorkflowCanvasEdge, WorkflowCanvasNode } from '../../types/workflow'
import { NodeFormPanel } from '../forms/NodeFormPanel'

interface InspectorPanelProps {
  selectedNode: WorkflowCanvasNode | null
  selectedEdge: WorkflowCanvasEdge | null
  automationOptions: AutomationDefinition[]
  isLoadingAutomations: boolean
  automationError: string | null
  onUpdateNode: (nodeId: string, updater: (node: WorkflowCanvasNode) => WorkflowCanvasNode) => void
  onDeleteNode: () => void
  onDeleteEdge: () => void
}

export function InspectorPanel({
  selectedNode,
  selectedEdge,
  automationOptions,
  isLoadingAutomations,
  automationError,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge,
}: InspectorPanelProps) {
  if (selectedEdge) {
    return (
      <div className="inspector">
        <div className="section-heading">
          <span>Edge selected</span>
        </div>
        <p className="panel-copy">
          Connection from <strong>{selectedEdge.source}</strong> to <strong>{selectedEdge.target}</strong>.
        </p>
        <button type="button" className="danger-button" onClick={onDeleteEdge}>
          Delete connection
        </button>
      </div>
    )
  }

  if (!selectedNode) {
    return (
      <div className="inspector">
        <p className="eyebrow">Inspector</p>
        <h2>Select a node</h2>
        <p className="panel-copy">
          Choose any node on the canvas to configure its fields, automation settings, and completion logic.
        </p>
      </div>
    )
  }

  const meta = nodeCatalog[selectedNode.data.kind]

  return (
    <div className="inspector">
      <div className="inspector-header">
        <div>
          <p className="eyebrow">Node settings</p>
          <h2>{meta.label}</h2>
        </div>
        <button type="button" className="danger-button" onClick={onDeleteNode}>
          Delete node
        </button>
      </div>

      {isLoadingAutomations && <p className="muted-text">Loading automation actions...</p>}
      {automationError && <p className="error-banner">{automationError}</p>}

      <form className="node-form">
        <NodeFormPanel
          node={selectedNode}
          automations={automationOptions}
          onUpdateNode={onUpdateNode}
        />
      </form>
    </div>
  )
}
