import type {
  ApprovalNodeConfig,
  AutomatedNodeConfig,
  EndNodeConfig,
  NodeTemplate,
  StartNodeConfig,
  TaskNodeConfig,
  WorkflowNodeKind,
} from '../types/workflow'

export const nodeCatalog: Record<WorkflowNodeKind, NodeTemplate> = {
  start: {
    kind: 'start',
    label: 'Start',
    accent: '#1d7c63',
    description: 'Entry point for the HR workflow.',
    createConfig: (): StartNodeConfig => ({
      title: 'Workflow start',
      metadata: [],
    }),
  },
  task: {
    kind: 'task',
    label: 'Task',
    accent: '#2962a3',
    description: 'Human task like collecting documents or filling a form.',
    createConfig: (): TaskNodeConfig => ({
      title: 'Collect documents',
      description: '',
      assignee: '',
      dueDate: '',
      customFields: [],
    }),
  },
  approval: {
    kind: 'approval',
    label: 'Approval',
    accent: '#b86b1d',
    description: 'Decision gate owned by HR or a manager.',
    createConfig: (): ApprovalNodeConfig => ({
      title: 'Manager approval',
      approverRole: 'Manager',
      autoApproveThreshold: 0,
    }),
  },
  automated: {
    kind: 'automated',
    label: 'Automated Step',
    accent: '#8d4aad',
    description: 'System-triggered action using a mock automation.',
    createConfig: (): AutomatedNodeConfig => ({
      title: 'Send system action',
      automationId: '',
      automationLabel: '',
      parameters: {},
    }),
  },
  end: {
    kind: 'end',
    label: 'End',
    accent: '#5f6b76',
    description: 'Workflow completion node.',
    createConfig: (): EndNodeConfig => ({
      endMessage: 'Workflow completed successfully.',
      summaryFlag: true,
    }),
  },
}
