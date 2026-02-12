import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text, Group } from 'react-konva'
import useImage from 'use-image'

/**
 * Canvas Library Choice: Konva + react-konva
 * 
 * Rationale:
 * - React-friendly with declarative API
 * - Built-in object selection, dragging, transforming
 * - Excellent performance on large images
 * - Native export to PNG at any resolution
 * - Hit-testing and event handling work reliably
 * 
 * Alternatives considered:
 * - Fabric.js: More features but less React-idiomatic
 * - tldraw: Too opinionated for our use case, harder to constrain
 * - Custom canvas: Too brittle for complex interactions
 */

const ANNOTATION_STYLES = {
  primary: {
    fill: '#3b82f6',
    stroke: '#2563eb',
    textColor: '#ffffff',
  },
  warning: {
    fill: '#f59e0b',
    stroke: '#d97706',
    textColor: '#ffffff',
  },
  info: {
    fill: '#06b6d4',
    stroke: '#0891b2',
    textColor: '#ffffff',
  },
}

function NumberMarker({ annotation, isSelected, onSelect, onChange }) {
  const style = ANNOTATION_STYLES[annotation.style || 'primary']
  
  return (
    <Group
      x={annotation.x}
      y={annotation.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...annotation,
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
    >
      <Circle
        radius={24}
        fill={style.fill}
        stroke={isSelected ? '#ffffff' : style.stroke}
        strokeWidth={isSelected ? 4 : 2}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={4}
        shadowOffset={{ x: 0, y: 2 }}
      />
      <Text
        text={annotation.number.toString()}
        fontSize={18}
        fontStyle="bold"
        fill={style.textColor}
        width={48}
        height={48}
        offsetX={24}
        offsetY={24}
        align="center"
        verticalAlign="middle"
      />
      {annotation.label && (
        <Group x={32} y={-12}>
          <Rect
            width={Math.max(annotation.label.length * 8 + 16, 80)}
            height={32}
            fill="rgba(255,255,255,0.95)"
            stroke={style.stroke}
            strokeWidth={2}
            cornerRadius={4}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={3}
            shadowOffset={{ x: 0, y: 1 }}
          />
          <Text
            text={annotation.label}
            fontSize={14}
            fill="#1f2937"
            padding={8}
            width={Math.max(annotation.label.length * 8 + 16, 80)}
            height={32}
            verticalAlign="middle"
          />
        </Group>
      )}
    </Group>
  )
}

function TextAnnotation({ annotation, isSelected, onSelect, onChange }) {
  const textWidth = Math.max(annotation.text.length * 9 + 16, 100)
  
  return (
    <Group
      x={annotation.x}
      y={annotation.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...annotation,
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
    >
      <Rect
        width={textWidth}
        height={36}
        fill={isSelected ? 'rgba(59, 130, 246, 0.95)' : 'rgba(255,255,255,0.95)'}
        stroke="#3b82f6"
        strokeWidth={2}
        cornerRadius={4}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={3}
        shadowOffset={{ x: 0, y: 1 }}
      />
      <Text
        text={annotation.text}
        fontSize={16}
        fill={isSelected ? '#ffffff' : '#1f2937'}
        padding={8}
        width={textWidth}
        height={36}
        verticalAlign="middle"
      />
    </Group>
  )
}

function RectAnnotation({ annotation, isSelected, onSelect, onChange }) {
  const style = ANNOTATION_STYLES[annotation.style || 'warning']
  
  return (
    <Rect
      x={annotation.x}
      y={annotation.y}
      width={annotation.width}
      height={annotation.height}
      stroke={isSelected ? '#ef4444' : style.stroke}
      strokeWidth={3}
      dash={[8, 4]}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...annotation,
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
    />
  )
}

function CircleAnnotation({ annotation, isSelected, onSelect, onChange }) {
  const style = ANNOTATION_STYLES[annotation.style || 'warning']
  
  return (
    <Circle
      x={annotation.x}
      y={annotation.y}
      radius={annotation.radius}
      stroke={isSelected ? '#ef4444' : style.stroke}
      strokeWidth={3}
      dash={[8, 4]}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...annotation,
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
    />
  )
}

export const KonvaCanvas = React.forwardRef(({ image, tool, annotations, setAnnotations }, ref) => {
  const [img] = useImage(image?.src)
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tempShape, setTempShape] = useState(null)
  const stageRef = ref || useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Update dimensions to match container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const container = containerRef.current
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleStageClick = (e) => {
    // Click on empty area
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleStageMouseDown = (e) => {
    // Only handle if clicking on the stage background (not on an annotation)
    if (e.target !== e.target.getStage()) return
    
    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    
    setSelectedId(null)

    if (tool === 'marker') {
      const number = annotations.filter(a => a.type === 'marker').length + 1
      const label = prompt('Enter label for marker (optional):') || ''
      setAnnotations([
        ...annotations,
        {
          id: `marker-${Date.now()}`,
          type: 'marker',
          x: pointerPosition.x,
          y: pointerPosition.y,
          number,
          label,
          style: 'primary',
        },
      ])
    } else if (tool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        setAnnotations([
          ...annotations,
          {
            id: `text-${Date.now()}`,
            type: 'text',
            x: pointerPosition.x,
            y: pointerPosition.y,
            text,
          },
        ])
      }
    } else if (tool === 'rect' || tool === 'circle') {
      setIsDrawing(true)
      setTempShape({
        type: tool,
        startX: pointerPosition.x,
        startY: pointerPosition.y,
      })
    }
  }

  const handleStageMouseMove = (e) => {
    if (!isDrawing) return
    
    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    if (tempShape.type === 'rect') {
      setTempShape({
        ...tempShape,
        x: Math.min(pointerPosition.x, tempShape.startX),
        y: Math.min(pointerPosition.y, tempShape.startY),
        width: Math.abs(pointerPosition.x - tempShape.startX),
        height: Math.abs(pointerPosition.y - tempShape.startY),
      })
    } else if (tempShape.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pointerPosition.x - tempShape.startX, 2) +
        Math.pow(pointerPosition.y - tempShape.startY, 2)
      )
      setTempShape({
        ...tempShape,
        radius,
      })
    }
  }

  const handleStageMouseUp = () => {
    if (!isDrawing) return

    if (tempShape.type === 'rect' && tempShape.width > 10 && tempShape.height > 10) {
      setAnnotations([
        ...annotations,
        {
          id: `rect-${Date.now()}`,
          type: 'rect',
          x: tempShape.x,
          y: tempShape.y,
          width: tempShape.width,
          height: tempShape.height,
          style: 'warning',
        },
      ])
    } else if (tempShape.type === 'circle' && tempShape.radius > 10) {
      setAnnotations([
        ...annotations,
        {
          id: `circle-${Date.now()}`,
          type: 'circle',
          x: tempShape.startX,
          y: tempShape.startY,
          radius: tempShape.radius,
          style: 'warning',
        },
      ])
    }

    setIsDrawing(false)
    setTempShape(null)
  }

  const handleAnnotationChange = (id, newProps) => {
    setAnnotations(
      annotations.map((ann) => (ann.id === id ? { ...ann, ...newProps } : ann))
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-muted/20">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onTouchStart={handleStageMouseDown}
        onTouchMove={handleStageMouseMove}
        onTouchEnd={handleStageMouseUp}
      >
        <Layer>
          {img && (
            <KonvaImage
              image={img}
              x={(dimensions.width - img.width) / 2}
              y={(dimensions.height - img.height) / 2}
            />
          )}
          
          {annotations.map((annotation) => {
            const isSelected = annotation.id === selectedId
            const props = {
              key: annotation.id,
              annotation,
              isSelected,
              onSelect: () => setSelectedId(annotation.id),
              onChange: (newProps) => handleAnnotationChange(annotation.id, newProps),
            }

            if (annotation.type === 'marker') return <NumberMarker {...props} />
            if (annotation.type === 'text') return <TextAnnotation {...props} />
            if (annotation.type === 'rect') return <RectAnnotation {...props} />
            if (annotation.type === 'circle') return <CircleAnnotation {...props} />
            return null
          })}

          {/* Live preview for shape being drawn */}
          {isDrawing && tempShape && tempShape.type === 'rect' && tempShape.width > 0 && (
            <Rect
              x={tempShape.x}
              y={tempShape.y}
              width={tempShape.width}
              height={tempShape.height}
              stroke="#3b82f6"
              strokeWidth={2}
              dash={[4, 4]}
              opacity={0.7}
            />
          )}
          {isDrawing && tempShape && tempShape.type === 'circle' && tempShape.radius > 0 && (
            <Circle
              x={tempShape.startX}
              y={tempShape.startY}
              radius={tempShape.radius}
              stroke="#3b82f6"
              strokeWidth={2}
              dash={[4, 4]}
              opacity={0.7}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
})

KonvaCanvas.displayName = 'KonvaCanvas'

export function exportCanvasToPNG(stageRef, filename = 'annotated-image.png') {
  if (!stageRef.current) return

  const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
  const link = document.createElement('a')
  link.download = filename
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
