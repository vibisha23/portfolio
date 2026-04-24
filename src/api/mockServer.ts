import type {
  AutomationDefinition,
  SimulationResult,
  WorkflowGraphSnapshot,
} from '../types/workflow'
import { buildSimulationResult } from '../utils/workflow'

const mockAutomations: AutomationDefinition[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create IT Ticket', params: ['team', 'priority'] },
]

function delay<T>(value: T, timeout = 400): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), timeout)
  })
}

export async function getAutomations(): Promise<AutomationDefinition[]> {
  return delay(mockAutomations, 300)
}

export async function postSimulate(
  workflow: WorkflowGraphSnapshot,
): Promise<SimulationResult> {
  return delay(buildSimulationResult(workflow, mockAutomations), 650)
}
