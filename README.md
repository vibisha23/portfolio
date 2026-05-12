# Portfolio

A React + React Flow prototype for visually designing internal HR workflows such as onboarding, leave approval, and document verification.

## What is included

- Drag-and-drop workflow canvas built with React Flow
- Custom Start, Task, Approval, Automated Step, and End nodes
- Right-side node inspector with type-specific controlled forms
- Mock API layer for `GET /automations` and `POST /simulate`
- Workflow sandbox for validation, graph serialization, and execution logs
- Type-safe workflow domain model and reusable validation helpers

## Tech stack

- React 19
- TypeScript
- Vite
- React Flow

## Architecture

`src/types/workflow.ts`
Defines the workflow domain model, node configs, API response shapes, and validation/simulation contracts.

`src/constants/nodeCatalog.ts`
Central registry for supported node types, default config creation, labels, and visual metadata.

`src/hooks/useWorkflowDesigner.ts`
Owns the editor state: nodes, edges, selection, drag-drop behavior, mock API loading, workflow reset, and simulation actions.

`src/api/mockServer.ts`
Implements lightweight local mocks that behave like:

- `GET /automations`
- `POST /simulate`

`src/utils/workflow.ts`
Contains node factories, starter graph creation, workflow validation, cycle detection, and simulation output builders.

`src/components/layout/*`
High-level shells for the sidebar, inspector, and sandbox modal.

`src/components/forms/*`
Reusable configuration form pieces, including dynamic key-value editors and node-specific form rendering.

`src/components/nodes/*`
Custom React Flow node presentation.

## Design choices

- A single `workflow` node renderer keeps React Flow setup simple while the domain model still supports strongly typed per-node config.
- The node catalog acts as the extensibility seam for adding new node types later.
- Validation is separate from rendering and simulation so the same graph rules can back UI badges, sandbox checks, and future persistence.
- The mock API is intentionally asynchronous to model real integration boundaries without requiring a backend.

## Assumptions

- Basic validation is enough for the prototype: exactly one Start node, at least one End node, no incoming edges into Start, no outgoing edges from End, and no cycles.
- Automated step parameters are string inputs driven directly from the selected automation definition.
- Simulation follows the connected graph from the Start node and produces a readable execution log rather than a true business rules engine.
- Persistence, authentication, and multi-user editing are out of scope.

## Run locally

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Notes

- If the environment is using an older Node 22 patch release, Vite may emit engine warnings. The app code remains framework-standard and can be pinned to older package versions if strict environment compatibility is required.
