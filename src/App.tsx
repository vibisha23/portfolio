import { useMemo, useState } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { Sidebar } from './components/layout/Sidebar'
import { InspectorPanel } from './components/layout/InspectorPanel'
import { SandboxPanel } from './components/layout/SandboxPanel'
import { WorkflowNodeCard } from './components/nodes/WorkflowNodeCard'
import { useWorkflowDesigner } from './hooks/useWorkflowDesigner'
import type { WorkflowNodeKind } from './types/workflow'

const nodeTypes = {
  workflow: WorkflowNodeCard,
}

function WorkflowDesignerApp() {
  const [showSandbox, setShowSandbox] = useState(false)
  const workflow = useWorkflowDesigner()

  const selectedNode = useMemo(
    () =>
      workflow.selectedNodeId
        ? workflow.nodes.find((node) => node.id === workflow.selectedNodeId) ?? null
        : null,
    [workflow.nodes, workflow.selectedNodeId],
  )

  const selectedEdge = useMemo(
    () =>
      workflow.selectedEdgeId
        ? workflow.edges.find((edge) => edge.id === workflow.selectedEdgeId) ?? null
        : null,
    [workflow.edges, workflow.selectedEdgeId],
  )

  const nodeCounts = useMemo(() => {
    return workflow.nodes.reduce<Record<WorkflowNodeKind, number>>(
      (acc, node) => {
        acc[node.data.kind] += 1
        return acc
      },
      {
        start: 0,
        task: 0,
        approval: 0,
        automated: 0,
        end: 0,
      },
    )
  }, [workflow.nodes])

  return (
    <div className="app-shell">
      <aside className="panel sidebar-shell">
        <Sidebar
          nodeCounts={nodeCounts}
          onDragStart={workflow.handleDragStart}
          onOpenSandbox={() => setShowSandbox(true)}
          validation={workflow.validation}
        />
      </aside>

      <main className="canvas-shell">
        <header className="canvas-header">
          <div>
            <p className="eyebrow">HR Workflow Designer</p>
            <h1>Prototype internal approval flows with live simulation</h1>
          </div>
          <div className="header-actions">
            <button type="button" className="ghost-button" onClick={workflow.resetWorkflow}>
              Reset canvas
            </button>
            <button type="button" className="primary-button" onClick={() => setShowSandbox(true)}>
              Test workflow
            </button>
          </div>
        </header>

        <section
          className="canvas-stage"
          onDrop={workflow.handleDrop}
          onDragOver={workflow.handleDragOver}
        >
          <ReactFlow
            fitView
            nodes={workflow.nodes}
            edges={workflow.edges}
            nodeTypes={nodeTypes}
            onInit={workflow.setReactFlowInstance}
            onNodesChange={workflow.onNodesChange}
            onEdgesChange={workflow.onEdgesChange}
            onConnect={workflow.onConnect}
            onSelectionChange={workflow.onSelectionChange}
            onPaneClick={workflow.clearSelection}
            defaultEdgeOptions={{
              animated: false,
              style: { strokeWidth: 2 },
            }}
            deleteKeyCode={['Delete', 'Backspace']}
          >
            <Background gap={20} size={1} color="rgba(63, 85, 69, 0.16)" />
            <MiniMap
              pannable
              zoomable
              nodeStrokeWidth={3}
              maskColor="rgba(12, 24, 18, 0.75)"
              style={{
                backgroundColor: '#f3efe3',
                border: '1px solid rgba(73, 94, 79, 0.18)',
              }}
            />
            <Controls />
          </ReactFlow>
        </section>
      </main>

      <aside className="panel inspector-shell">
        <InspectorPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          automationOptions={workflow.automationOptions}
          isLoadingAutomations={workflow.isLoadingAutomations}
          automationError={workflow.automationError}
          onUpdateNode={workflow.updateNode}
          onDeleteNode={workflow.deleteSelectedNode}
          onDeleteEdge={workflow.deleteSelectedEdge}
        />
      </aside>

      <SandboxPanel
        isOpen={showSandbox}
        workflowSnapshot={workflow.workflowSnapshot}
        validation={workflow.validation}
        simulation={workflow.simulation}
        onClose={() => setShowSandbox(false)}
        onRunSimulation={workflow.runSimulation}
      />
    </div>
  )
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerApp />
    </ReactFlowProvider>
  )
}

export default App
