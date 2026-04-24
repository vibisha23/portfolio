import { MarkerType } from 'reactflow'
import { nodeCatalog } from '../constants/nodeCatalog'
import type {
  ApprovalNodeConfig,
  AutomationDefinition,
  AutomatedNodeConfig,
  EndNodeConfig,
  KeyValueItem,
  NodeFactoryArgs,
  SimulationResult,
  SimulationStep,
  StartNodeConfig,
  TaskNodeConfig,
  ValidationResult,
  WorkflowCanvasEdge,
  WorkflowCanvasNode,
  WorkflowGraphSnapshot,
  WorkflowNodeConfigMap,
} from '../types/workflow'

export function createKeyValueItem(): KeyValueItem {
  return {
    id: crypto.randomUUID(),
    key: '',
    value: '',
  }
}

export function createWorkflowNode({ id, kind, position }: NodeFactoryArgs): WorkflowCanvasNode {
  return {
    id,
    type: 'workflow',
    position,
    data: {
      kind,
      config: nodeCatalog[kind].createConfig() as WorkflowNodeConfigMap[typeof kind],
    },
  }
}

export function createInitialWorkflow(): WorkflowGraphSnapshot {
  const start = createWorkflowNode({
    id: 'start-1',
    kind: 'start',
    position: { x: 80, y: 140 },
  })
  const task = createWorkflowNode({
    id: 'task-1',
    kind: 'task',
    position: { x: 380, y: 140 },
  })
  const approval = createWorkflowNode({
    id: 'approval-1',
    kind: 'approval',
    position: { x: 700, y: 140 },
  })
  const end = createWorkflowNode({
    id: 'end-1',
    kind: 'end',
    position: { x: 1020, y: 140 },
  })

  const edges: WorkflowCanvasEdge[] = [
    {
      id: 'edge-start-task',
      source: start.id,
      target: task.id,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'edge-task-approval',
      source: task.id,
      target: approval.id,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'edge-approval-end',
      source: approval.id,
      target: end.id,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ]

  return { nodes: [start, task, approval, end], edges }
}

export function getNodePrimaryText(node: Pick<WorkflowCanvasNode, 'data'>): string {
  switch (node.data.kind) {
    case 'start':
      return (node.data.config as StartNodeConfig).title
    case 'task':
      return (node.data.config as TaskNodeConfig).title
    case 'approval':
      return (node.data.config as ApprovalNodeConfig).title
    case 'automated':
      return (node.data.config as AutomatedNodeConfig).title
    case 'end':
      return (node.data.config as EndNodeConfig).endMessage
  }
}

export function validateWorkflow(snapshot: WorkflowGraphSnapshot): ValidationResult {
  const { nodes, edges } = snapshot
  const errors: string[] = []
  const warnings: string[] = []

  if (nodes.length === 0) {
    errors.push('Add at least one node to create a workflow.')
    return { errors, warnings }
  }

  const startNodes = nodes.filter((node) => node.data.kind === 'start')
  const endNodes = nodes.filter((node) => node.data.kind === 'end')

  if (startNodes.length !== 1) {
    errors.push(`Workflow requires exactly one Start node. Found ${startNodes.length}.`)
  }

  if (endNodes.length === 0) {
    errors.push('Workflow requires at least one End node.')
  }

  const incomingCount = new Map<string, number>()
  const outgoingCount = new Map<string, number>()

  nodes.forEach((node) => {
    incomingCount.set(node.id, 0)
    outgoingCount.set(node.id, 0)
  })

  edges.forEach((edge) => {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    outgoingCount.set(edge.source, (outgoingCount.get(edge.source) ?? 0) + 1)
  })

  startNodes.forEach((node) => {
    if ((incomingCount.get(node.id) ?? 0) > 0) {
      errors.push('Start node cannot have incoming connections.')
    }
    if ((outgoingCount.get(node.id) ?? 0) === 0) {
      errors.push('Start node must connect to the next step.')
    }
  })

  endNodes.forEach((node) => {
    if ((outgoingCount.get(node.id) ?? 0) > 0) {
      errors.push('End node cannot have outgoing connections.')
    }
  })

  nodes.forEach((node) => {
    const incoming = incomingCount.get(node.id) ?? 0
    const outgoing = outgoingCount.get(node.id) ?? 0
    const label = nodeCatalog[node.data.kind].label

    if (node.data.kind !== 'start' && incoming === 0) {
      warnings.push(`${label} node "${getNodePrimaryText(node)}" is disconnected on the left.`)
    }

    if (node.data.kind !== 'end' && outgoing === 0) {
      warnings.push(`${label} node "${getNodePrimaryText(node)}" is disconnected on the right.`)
    }
  })

  if (hasCycle(snapshot)) {
    errors.push('Workflow contains a cycle. Simulation only supports acyclic flows.')
  }

  return { errors, warnings }
}

export function hasCycle(snapshot: WorkflowGraphSnapshot): boolean {
  const adjacency = new Map<string, string[]>()

  snapshot.nodes.forEach((node) => adjacency.set(node.id, []))
  snapshot.edges.forEach((edge) => {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target])
  })

  const visiting = new Set<string>()
  const visited = new Set<string>()

  function visit(nodeId: string): boolean {
    if (visiting.has(nodeId)) {
      return true
    }

    if (visited.has(nodeId)) {
      return false
    }

    visiting.add(nodeId)

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (visit(neighbor)) {
        return true
      }
    }

    visiting.delete(nodeId)
    visited.add(nodeId)
    return false
  }

  return snapshot.nodes.some((node) => visit(node.id))
}

export function buildSimulationResult(
  snapshot: WorkflowGraphSnapshot,
  automations: AutomationDefinition[],
): SimulationResult {
  const startedAt = new Date().toISOString()
  const validation = validateWorkflow(snapshot)

  if (validation.errors.length > 0) {
    return {
      ok: false,
      startedAt,
      finishedAt: new Date().toISOString(),
      summary: 'Simulation blocked by workflow validation errors.',
      steps: validation.errors.map(
        (error, index): SimulationStep => ({
          id: `validation-${index}`,
          nodeId: 'validation',
          nodeLabel: 'Validation',
          nodeType: 'start',
          status: 'blocked',
          details: error,
        }),
      ),
    }
  }

  const nodeMap = new Map(snapshot.nodes.map((node) => [node.id, node]))
  const adjacency = new Map<string, string[]>()
  snapshot.nodes.forEach((node) => adjacency.set(node.id, []))
  snapshot.edges.forEach((edge) => {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target])
  })

  const startNode = snapshot.nodes.find((node) => node.data.kind === 'start')
  if (!startNode) {
    return {
      ok: false,
      startedAt,
      finishedAt: new Date().toISOString(),
      summary: 'Simulation could not locate a Start node.',
      steps: [],
    }
  }

  const queue = [startNode.id]
  const visited = new Set<string>()
  const steps: SimulationStep[] = []

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (!currentId || visited.has(currentId)) {
      continue
    }

    visited.add(currentId)
    const node = nodeMap.get(currentId)
    if (!node) {
      continue
    }

    steps.push(describeSimulationStep(node, automations))
    for (const nextId of adjacency.get(currentId) ?? []) {
      queue.push(nextId)
    }
  }

  return {
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    summary: `Simulation completed ${steps.length} workflow step(s).`,
    steps,
  }
}

function describeSimulationStep(
  node: WorkflowCanvasNode,
  automations: AutomationDefinition[],
): SimulationStep {
  switch (node.data.kind) {
    case 'start': {
      const config = node.data.config as StartNodeConfig
      return {
        id: `${node.id}-step`,
        nodeId: node.id,
        nodeLabel: config.title,
        nodeType: 'start',
        status: 'completed',
        details: `Workflow started with ${config.metadata.length} metadata value(s).`,
      }
    }
    case 'task': {
      const config = node.data.config as TaskNodeConfig
      return {
        id: `${node.id}-step`,
        nodeId: node.id,
        nodeLabel: config.title,
        nodeType: 'task',
        status: 'completed',
        details: `Assigned to ${config.assignee || 'Unassigned'} with due date ${config.dueDate || 'not set'}.`,
      }
    }
    case 'approval': {
      const config = node.data.config as ApprovalNodeConfig
      return {
        id: `${node.id}-step`,
        nodeId: node.id,
        nodeLabel: config.title,
        nodeType: 'approval',
        status: config.autoApproveThreshold > 0 ? 'warning' : 'completed',
        details:
          config.autoApproveThreshold > 0
            ? `Waiting for ${config.approverRole} because threshold is ${config.autoApproveThreshold}.`
            : `Approved automatically for role ${config.approverRole}.`,
      }
    }
    case 'automated': {
      const config = node.data.config as AutomatedNodeConfig
      const automation = automations.find(
        (item) => item.id === config.automationId,
      )
      return {
        id: `${node.id}-step`,
        nodeId: node.id,
        nodeLabel: config.title,
        nodeType: 'automated',
        status: automation ? 'completed' : 'warning',
        details: automation
          ? `${automation.label} executed with ${Object.keys(config.parameters).length} parameter(s).`
          : 'Automation action is missing or not configured.',
      }
    }
    case 'end': {
      const config = node.data.config as EndNodeConfig
      return {
        id: `${node.id}-step`,
        nodeId: node.id,
        nodeLabel: config.endMessage,
        nodeType: 'end',
        status: 'completed',
        details: config.summaryFlag
          ? 'Workflow closed and summary generated.'
          : 'Workflow closed without summary generation.',
      }
    }
  }
}
