import type {
  ApprovalNodeConfig,
  AutomatedNodeConfig,
  AutomationDefinition,
  EndNodeConfig,
  StartNodeConfig,
  TaskNodeConfig,
  WorkflowCanvasNode,
} from '../../types/workflow'
import { KeyValueEditor } from './KeyValueEditor'

interface NodeFormPanelProps {
  node: WorkflowCanvasNode
  automations: AutomationDefinition[]
  onUpdateNode: (nodeId: string, updater: (node: WorkflowCanvasNode) => WorkflowCanvasNode) => void
}

export function NodeFormPanel({
  node,
  automations,
  onUpdateNode,
}: NodeFormPanelProps) {
  const patchConfig = (partial: Partial<WorkflowCanvasNode['data']['config']>) => {
    onUpdateNode(node.id, (currentNode) => ({
      ...currentNode,
      data: {
        ...currentNode.data,
        config: {
          ...currentNode.data.config,
          ...partial,
        },
      },
    }))
  }

  switch (node.data.kind) {
    case 'start': {
      const config = node.data.config as StartNodeConfig
      return (
        <>
          <label>
            Start title
            <input
              value={config.title}
              onChange={(event) => patchConfig({ title: event.target.value })}
            />
          </label>
          <KeyValueEditor
            label="Metadata"
            items={config.metadata}
            onChange={(metadata) => patchConfig({ metadata })}
          />
        </>
      )
    }

    case 'task': {
      const config = node.data.config as TaskNodeConfig
      return (
        <>
          <label>
            Title
            <input
              required
              value={config.title}
              onChange={(event) => patchConfig({ title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows={4}
              value={config.description}
              onChange={(event) => patchConfig({ description: event.target.value })}
            />
          </label>
          <label>
            Assignee
            <input
              value={config.assignee}
              onChange={(event) => patchConfig({ assignee: event.target.value })}
            />
          </label>
          <label>
            Due date
            <input
              type="date"
              value={config.dueDate}
              onChange={(event) => patchConfig({ dueDate: event.target.value })}
            />
          </label>
          <KeyValueEditor
            label="Custom fields"
            items={config.customFields}
            onChange={(customFields) => patchConfig({ customFields })}
          />
        </>
      )
    }

    case 'approval': {
      const config = node.data.config as ApprovalNodeConfig
      return (
        <>
          <label>
            Title
            <input
              value={config.title}
              onChange={(event) => patchConfig({ title: event.target.value })}
            />
          </label>
          <label>
            Approver role
            <input
              value={config.approverRole}
              onChange={(event) => patchConfig({ approverRole: event.target.value })}
            />
          </label>
          <label>
            Auto-approve threshold
            <input
              type="number"
              min="0"
              value={config.autoApproveThreshold}
              onChange={(event) =>
                patchConfig({
                  autoApproveThreshold: Number(event.target.value) || 0,
                })
              }
            />
          </label>
        </>
      )
    }

    case 'automated': {
      const config = node.data.config as AutomatedNodeConfig
      const selectedAutomation = automations.find(
        (automation) => automation.id === config.automationId,
      )

      return (
        <>
          <label>
            Title
            <input
              value={config.title}
              onChange={(event) => patchConfig({ title: event.target.value })}
            />
          </label>
          <label>
            Action
            <select
              value={config.automationId}
              onChange={(event) => {
                const automation = automations.find((item) => item.id === event.target.value)
                patchConfig({
                  automationId: automation?.id ?? '',
                  automationLabel: automation?.label ?? '',
                  parameters:
                    automation?.params.reduce<Record<string, string>>((acc, param) => {
                      acc[param] = ''
                      return acc
                    }, {}) ?? {},
                })
              }}
            >
              <option value="">Choose an action</option>
              {automations.map((automation) => (
                <option key={automation.id} value={automation.id}>
                  {automation.label}
                </option>
              ))}
            </select>
          </label>

          <div className="form-section">
            <div className="section-heading">
              <span>Action parameters</span>
            </div>
            {selectedAutomation ? (
              selectedAutomation.params.map((param) => (
                <label key={param}>
                  {param}
                  <input
                    value={config.parameters[param] ?? ''}
                    onChange={(event) =>
                      patchConfig({
                        parameters: {
                          ...config.parameters,
                          [param]: event.target.value,
                        },
                      })
                    }
                  />
                </label>
              ))
            ) : (
              <p className="muted-text">Select an automation to load dynamic fields.</p>
            )}
          </div>
        </>
      )
    }

    case 'end': {
      const config = node.data.config as EndNodeConfig
      return (
        <>
          <label>
            End message
            <textarea
              rows={4}
              value={config.endMessage}
              onChange={(event) => patchConfig({ endMessage: event.target.value })}
            />
          </label>
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={config.summaryFlag}
              onChange={(event) => patchConfig({ summaryFlag: event.target.checked })}
            />
            Generate summary at completion
          </label>
        </>
      )
    }
  }
}
