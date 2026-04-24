import type { KeyValueItem } from '../../types/workflow'
import { createKeyValueItem } from '../../utils/workflow'

interface KeyValueEditorProps {
  label: string
  items: KeyValueItem[]
  onChange: (items: KeyValueItem[]) => void
}

export function KeyValueEditor({ label, items, onChange }: KeyValueEditorProps) {
  return (
    <div className="form-section">
      <div className="section-heading">
        <span>{label}</span>
        <button type="button" className="link-button" onClick={() => onChange([...items, createKeyValueItem()])}>
          Add field
        </button>
      </div>

      {items.length === 0 ? (
        <p className="muted-text">No custom values added yet.</p>
      ) : (
        items.map((item) => (
          <div className="key-value-row" key={item.id}>
            <input
              value={item.key}
              onChange={(event) =>
                onChange(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, key: event.target.value } : entry,
                  ),
                )
              }
              placeholder="Key"
            />
            <input
              value={item.value}
              onChange={(event) =>
                onChange(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, value: event.target.value } : entry,
                  ),
                )
              }
              placeholder="Value"
            />
            <button
              type="button"
              className="danger-text-button"
              onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  )
}
