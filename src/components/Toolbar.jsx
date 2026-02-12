import './Toolbar.css'

function Toolbar({ tool, setTool, onClear, onReset }) {
  const tools = [
    { id: 'marker', label: '🔢 Marker', description: 'Numbered markers' },
    { id: 'text', label: '📝 Text', description: 'Text annotation' },
    { id: 'rect', label: '▢ Rectangle', description: 'Highlight area' },
    { id: 'circle', label: '○ Circle', description: 'Highlight area' },
  ]

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Annotation Tools</h3>
        <div className="tool-buttons">
          {tools.map(t => (
            <button
              key={t.id}
              className={`tool-button ${tool === t.id ? 'active' : ''}`}
              onClick={() => setTool(t.id)}
              title={t.description}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button className="action-button clear-button" onClick={onClear}>
            🗑️ Clear All
          </button>
          <button className="action-button reset-button" onClick={onReset}>
            ↺ New Image
          </button>
        </div>
      </div>

      <div className="toolbar-hint">
        <p>
          <strong>Current tool:</strong> {tools.find(t => t.id === tool)?.description}
        </p>
      </div>
    </div>
  )
}

export default Toolbar
