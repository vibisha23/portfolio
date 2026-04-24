import { useEffect, useMemo, useState, type DragEvent } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
} from 'reactflow'
import { getAutomations, postSimulate } from '../api/mockServer'
import type {
  AutomationDefinition,
  SimulationResult,
  ValidationResult,
  WorkflowCanvasEdge,
  WorkflowCanvasNode,
  WorkflowGraphSnapshot,
  WorkflowNodeKind,
} from '../types/workflow'
import { createInitialWorkflow, createWorkflowNode, validateWorkflow } from '../utils/workflow'

const mimeType = 'application/reactflow-node-kind'

export function useWorkflowDesigner() {
  const initial = useMemo(() => createInitialWorkflow(), [])
  const [nodes, setNodes] = useState<WorkflowCanvasNode[]>(initial.nodes)
  const [edges, setEdges] = useState<WorkflowCanvasEdge[]>(initial.edges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [automationOptions, setAutomationOptions] = useState<AutomationDefinition[]>([])
  const [isLoadingAutomations, setIsLoadingAutomations] = useState(true)
  const [automationError, setAutomationError] = useState<string | null>(null)
  const [simulation, setSimulation] = useState<{
    status: 'idle' | 'running' | 'done' | 'error'
    result: SimulationResult | null
    error: string | null
  }>({
    status: 'idle',
    result: null,
    error: null,
  })
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<WorkflowCanvasNode, WorkflowCanvasEdge> | null>(null)

  const workflowSnapshot = useMemo<WorkflowGraphSnapshot>(() => ({ nodes, edges }), [nodes, edges])
  const validation = useMemo<ValidationResult>(
    () => validateWorkflow(workflowSnapshot),
    [workflowSnapshot],
  )

  useEffect(() => {
    let cancelled = false

    async function loadAutomations() {
      try {
        setIsLoadingAutomations(true)
        const data = await getAutomations()
        if (!cancelled) {
          setAutomationOptions(data)
          setAutomationError(null)
        }
      } catch {
        if (!cancelled) {
          setAutomationError('Unable to load automation actions.')
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAutomations(false)
        }
      }
    }

    void loadAutomations()

    return () => {
      cancelled = true
    }
  }, [])

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes) as WorkflowCanvasNode[])
  }

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges))
  }

  const onConnect = (connection: Connection) => {
    setEdges((currentEdges) =>
      addEdge(
        {
          ...connection,
          id: crypto.randomUUID(),
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        currentEdges,
      ),
    )
  }

  const onSelectionChange = ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
    setSelectedNodeId(selectedNodes[0]?.id ?? null)
    setSelectedEdgeId(selectedEdges[0]?.id ?? null)
  }

  const clearSelection = () => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
  }

  const updateNode = (nodeId: string, updater: (node: WorkflowCanvasNode) => WorkflowCanvasNode) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => (node.id === nodeId ? updater(node) : node)),
    )
  }

  const deleteSelectedNode = () => {
    if (!selectedNodeId) {
      return
    }

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId))
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    )
    setSelectedNodeId(null)
  }

  const deleteSelectedEdge = () => {
    if (!selectedEdgeId) {
      return
    }

    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== selectedEdgeId))
    setSelectedEdgeId(null)
  }

  const handleDragStart = (event: DragEvent<HTMLElement>, kind: WorkflowNodeKind) => {
    event.dataTransfer.setData(mimeType, kind)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()

    const kind = event.dataTransfer.getData(mimeType) as WorkflowNodeKind
    if (!kind || !reactFlowInstance) {
      return
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    const nextNode = createWorkflowNode({
      id: `${kind}-${crypto.randomUUID()}`,
      kind,
      position,
    })

    setNodes((currentNodes) => [...currentNodes, nextNode])
    setSelectedNodeId(nextNode.id)
    setSelectedEdgeId(null)
  }

  const runSimulation = async () => {
    setSimulation({ status: 'running', result: null, error: null })

    try {
      const result = await postSimulate(workflowSnapshot)
      setSimulation({ status: 'done', result, error: null })
    } catch {
      setSimulation({
        status: 'error',
        result: null,
        error: 'Simulation request failed.',
      })
    }
  }

  const resetWorkflow = () => {
    const next = createInitialWorkflow()
    setNodes(next.nodes)
    setEdges(next.edges)
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setSimulation({ status: 'idle', result: null, error: null })
  }

  return {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    workflowSnapshot,
    validation,
    simulation,
    automationOptions,
    automationError,
    isLoadingAutomations,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    updateNode,
    deleteSelectedNode,
    deleteSelectedEdge,
    handleDragStart,
    handleDragOver,
    handleDrop,
    runSimulation,
    clearSelection,
    resetWorkflow,
  }
}
