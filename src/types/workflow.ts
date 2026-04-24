import type { Edge, Node, XYPosition } from 'reactflow'

export type WorkflowNodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KeyValueItem {
  id: string
  key: string
  value: string
}

export interface AutomationDefinition {
  id: string
  label: string
  params: string[]
}

export interface StartNodeConfig {
  title: string
  metadata: KeyValueItem[]
}

export interface TaskNodeConfig {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValueItem[]
}

export interface ApprovalNodeConfig {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedNodeConfig {
  title: string
  automationId: string
  automationLabel: string
  parameters: Record<string, string>
}

export interface EndNodeConfig {
  endMessage: string
  summaryFlag: boolean
}

export type WorkflowNodeConfigMap = {
  start: StartNodeConfig
  task: TaskNodeConfig
  approval: ApprovalNodeConfig
  automated: AutomatedNodeConfig
  end: EndNodeConfig
}

export interface WorkflowNodeData<K extends WorkflowNodeKind = WorkflowNodeKind> {
  kind: K
  config: WorkflowNodeConfigMap[K]
}

export type WorkflowCanvasNode<K extends WorkflowNodeKind = WorkflowNodeKind> = Node<
  WorkflowNodeData<K>,
  'workflow'
>

export type WorkflowCanvasEdge = Edge

export interface WorkflowGraphSnapshot {
  nodes: WorkflowCanvasNode[]
  edges: WorkflowCanvasEdge[]
}

export interface ValidationResult {
  errors: string[]
  warnings: string[]
}

export interface SimulationStep {
  id: string
  nodeId: string
  nodeLabel: string
  nodeType: WorkflowNodeKind
  status: 'completed' | 'warning' | 'blocked'
  details: string
}

export interface SimulationResult {
  ok: boolean
  startedAt: string
  finishedAt: string
  summary: string
  steps: SimulationStep[]
}

export interface NodeTemplate {
  kind: WorkflowNodeKind
  label: string
  accent: string
  description: string
  createConfig: () => WorkflowNodeConfigMap[WorkflowNodeKind]
}

export interface NodeFactoryArgs {
  id: string
  kind: WorkflowNodeKind
  position: XYPosition
}
