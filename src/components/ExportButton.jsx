import './ExportButton.css'

function ExportButton({ canvasRef }) {
  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      link.download = `annotated-image-${timestamp}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="export-container">
      <button className="export-button" onClick={handleExport}>
        ⬇️ Export as PNG
      </button>
      <p className="export-hint">
        Export at original image resolution with all annotations
      </p>
    </div>
  )
}

export default ExportButton
