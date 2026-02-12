import { useRef, useState, useEffect } from 'react'
import './AnnotationCanvas.css'
import Toolbar from './Toolbar'
import ExportButton from './ExportButton'

function AnnotationCanvas({ image, annotations, setAnnotations, onReset }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [tool, setTool] = useState('marker') // 'marker', 'text', 'rect', 'circle', 'arrow'
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [scale, setScale] = useState(1)
  const [markerCounter, setMarkerCounter] = useState(1)

  useEffect(() => {
    drawCanvas()
  }, [image, annotations, scale, selectedAnnotation])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image.src

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Draw annotations
      annotations.forEach((annotation, index) => {
        const isSelected = index === selectedAnnotation

        if (annotation.type === 'marker') {
          drawMarker(ctx, annotation, isSelected)
        } else if (annotation.type === 'text') {
          drawText(ctx, annotation, isSelected)
        } else if (annotation.type === 'rect') {
          drawRect(ctx, annotation, isSelected)
        } else if (annotation.type === 'circle') {
          drawCircle(ctx, annotation, isSelected)
        }
      })
    }
  }

  const drawMarker = (ctx, annotation, isSelected) => {
    const radius = 20
    
    // Draw circle
    ctx.beginPath()
    ctx.arc(annotation.x, annotation.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = isSelected ? '#2980b9' : '#3498db'
    ctx.fill()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw number
    ctx.fillStyle = 'white'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(annotation.number, annotation.x, annotation.y)

    // Draw text label if exists
    if (annotation.label) {
      const textX = annotation.x + radius + 10
      const textY = annotation.y

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.font = '16px Arial'
      ctx.textAlign = 'left'
      const metrics = ctx.measureText(annotation.label)
      const padding = 8
      
      // Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.fillRect(
        textX - padding,
        textY - 12 - padding,
        metrics.width + padding * 2,
        24 + padding * 2
      )
      ctx.strokeStyle = '#3498db'
      ctx.lineWidth = 2
      ctx.strokeRect(
        textX - padding,
        textY - 12 - padding,
        metrics.width + padding * 2,
        24 + padding * 2
      )

      // Text
      ctx.fillStyle = '#2c3e50'
      ctx.fillText(annotation.label, textX, textY)
    }
  }

  const drawText = (ctx, annotation, isSelected) => {
    const padding = 8
    ctx.font = '16px Arial'
    const metrics = ctx.measureText(annotation.text)

    // Background
    ctx.fillStyle = isSelected ? 'rgba(52, 152, 219, 0.95)' : 'rgba(255, 255, 255, 0.95)'
    ctx.fillRect(
      annotation.x - padding,
      annotation.y - 12 - padding,
      metrics.width + padding * 2,
      24 + padding * 2
    )
    ctx.strokeStyle = '#3498db'
    ctx.lineWidth = 2
    ctx.strokeRect(
      annotation.x - padding,
      annotation.y - 12 - padding,
      metrics.width + padding * 2,
      24 + padding * 2
    )

    // Text
    ctx.fillStyle = isSelected ? 'white' : '#2c3e50'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(annotation.text, annotation.x, annotation.y)
  }

  const drawRect = (ctx, annotation, isSelected) => {
    ctx.strokeStyle = isSelected ? '#e74c3c' : '#f39c12'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.strokeRect(
      annotation.x,
      annotation.y,
      annotation.width,
      annotation.height
    )
    ctx.setLineDash([])
  }

  const drawCircle = (ctx, annotation, isSelected) => {
    ctx.strokeStyle = isSelected ? '#e74c3c' : '#f39c12'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(
      annotation.x + annotation.radius,
      annotation.y + annotation.radius,
      annotation.radius,
      0,
      2 * Math.PI
    )
    ctx.stroke()
    ctx.setLineDash([])
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    if (tool === 'marker') {
      const label = prompt('Enter label for this marker (optional):')
      setAnnotations([
        ...annotations,
        {
          type: 'marker',
          x,
          y,
          number: markerCounter,
          label: label || ''
        }
      ])
      setMarkerCounter(markerCounter + 1)
    } else if (tool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        setAnnotations([
          ...annotations,
          {
            type: 'text',
            x,
            y,
            text
          }
        ])
      }
    }
  }

  const handleCanvasMouseDown = (e) => {
    if (tool === 'rect' || tool === 'circle') {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height)
      
      setIsDragging(true)
      setDragStart({ x, y })
    }
  }

  const handleCanvasMouseMove = (e) => {
    if (isDragging && dragStart && (tool === 'rect' || tool === 'circle')) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height)

      // Preview shape (you could draw this on a separate preview layer)
    }
  }

  const handleCanvasMouseUp = (e) => {
    if (isDragging && dragStart && (tool === 'rect' || tool === 'circle')) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height)

      if (tool === 'rect') {
        const width = x - dragStart.x
        const height = y - dragStart.y
        setAnnotations([
          ...annotations,
          {
            type: 'rect',
            x: Math.min(dragStart.x, x),
            y: Math.min(dragStart.y, y),
            width: Math.abs(width),
            height: Math.abs(height)
          }
        ])
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - dragStart.x, 2) + Math.pow(y - dragStart.y, 2)
        )
        setAnnotations([
          ...annotations,
          {
            type: 'circle',
            x: dragStart.x - radius,
            y: dragStart.y - radius,
            radius
          }
        ])
      }

      setIsDragging(false)
      setDragStart(null)
    }
  }

  const handleDelete = () => {
    if (selectedAnnotation !== null) {
      setAnnotations(annotations.filter((_, index) => index !== selectedAnnotation))
      setSelectedAnnotation(null)
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all annotations?')) {
      setAnnotations([])
      setMarkerCounter(1)
    }
  }

  return (
    <div className="annotation-canvas-container" ref={containerRef}>
      <Toolbar 
        tool={tool} 
        setTool={setTool}
        onClear={handleClear}
        onReset={onReset}
      />
      
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="annotation-canvas"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        />
      </div>

      <ExportButton canvasRef={canvasRef} />
    </div>
  )
}

export default AnnotationCanvas
