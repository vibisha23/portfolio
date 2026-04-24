import type { SimulationResult, ValidationResult, WorkflowGraphSnapshot } from '../../types/workflow'

interface SandboxPanelProps {
  isOpen: boolean
  workflowSnapshot: WorkflowGraphSnapshot
  validation: ValidationResult
  simulation: {
    status: 'idle' | 'running' | 'done' | 'error'
    result: SimulationResult | null
    error: string | null
  }
  onClose: () => void
  onRunSimulation: () => void
}

export function SandboxPanel({
  isOpen,
  workflowSnapshot,
  validation,
  simulation,
  onClose,
  onRunSimulation,
}: SandboxPanelProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="sandbox-backdrop">
      <section className="sandbox-panel">
        <header className="sandbox-header">
          <div>
            <p className="eyebrow">Workflow sandbox</p>
            <h2>Validate and simulate the current graph</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="sandbox-grid">
          <div className="sandbox-column">
            <div className="sandbox-card">
              <div className="section-heading">
                <span>Validation</span>
                <button type="button" className="primary-button" onClick={onRunSimulation}>
                  {simulation.status === 'running' ? 'Running...' : 'Run simulation'}
                </button>
              </div>

              <div className="validation-columns">
                <div>
                  <strong>Errors</strong>
                  {validation.errors.length === 0 ? (
                    <p className="muted-text">No blocking issues found.</p>
                  ) : (
                    validation.errors.map((item) => (
                      <p key={item} className="error-banner">{item}</p>
                    ))
                  )}
                </div>
                <div>
                  <strong>Warnings</strong>
                  {validation.warnings.length === 0 ? (
                    <p className="muted-text">No warnings found.</p>
                  ) : (
                    validation.warnings.map((item) => (
                      <p key={item} className="warning-banner">{item}</p>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="sandbox-card">
              <div className="section-heading">
                <span>Serialized workflow</span>
              </div>
              <pre>{JSON.stringify(workflowSnapshot, null, 2)}</pre>
            </div>
          </div>

          <div className="sandbox-column">
            <div className="sandbox-card">
              <div className="section-heading">
                <span>Execution log</span>
              </div>

              {simulation.status === 'idle' && (
                <p className="muted-text">Run the workflow to inspect step-by-step output from the mock API.</p>
              )}
              {simulation.status === 'error' && <p className="error-banner">{simulation.error}</p>}
              {simulation.result && (
                <>
                  <p className="panel-copy">{simulation.result.summary}</p>
                  <div className="timeline">
                    {simulation.result.steps.map((step, index) => (
                      <article key={step.id} className={`timeline-item status-${step.status}`}>
                        <small>Step {index + 1}</small>
                        <strong>{step.nodeLabel}</strong>
                        <span>{step.details}</span>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
