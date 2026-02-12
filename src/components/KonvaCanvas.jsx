import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle, Rect, Text, Group, Line } from 'react-konva'
import useImage from 'use-image'

/**
 * Canvas Library Choice: Konva + react-konva
 * 
 * Rationale:
 * - React-friendly with declarative API
 * - Built-in object selection, dragging, transforming
 * - Excellent performance on large images
 * - Native export to PNG at any resolution
 * - Active maintenance and good documentation
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
            width={annotation.label.length * 8 + 16}
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
            width={annotation.label.length * 8 + 16}
            height={32}
            verticalAlign="middle"
          />
        </Group>
      )}
    </Group>
  )
}

function TextAnnotation({ annotation, isSelected, onSelect, onChange }) {
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
        width={annotation.text.length * 9 + 16}
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
        width={annotation.text.length * 9 + 16}
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

export function KonvaCanvas({ image, tool, annotations, setAnnotations, onImageLoad }) {
  const [img] = useImage(image?.src)
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tempShape, setTempShape] = useState(null)
  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const [stageDimensions, setStageDimensions] = useState({ width: 1000, height: 800 })

  useEffect(() => {
    if (img && onImageLoad) {
      onImageLoad({ width: img.width, height: img.height })
    }
  }, [img, onImageLoad])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const getPointerPosition = (stage) => {
    const pos = stage.getPointerPosition()
    if (!pos) return null
    
    // Adjust for stage scale/position if needed
    return {
      x: pos.x,
      y: pos.y,
    }
  }

  const handleMouseDown = (e) => {
    if (e.target !== e.target.getStage()) return // Clicked on an annotation
    
    const stage = e.target.getStage()
    const pos = getPointerPosition(stage)
    if (!pos) return

    setSelectedId(null)

    if (tool === 'marker') {
      const number = annotations.filter(a => a.type === 'marker').length + 1
      const label = prompt('Enter label for marker (optional):') || ''
      setAnnotations([
        ...annotations,
        {
          id: Date.now(),
          type: 'marker',
          x: pos.x,
          y: pos.y,
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
            id: Date.now(),
            type: 'text',
            x: pos.x,
            y: pos.y,
            text,
          },
        ])
      }
    } else if (tool === 'rect' || tool === 'circle') {
      setIsDrawing(true)
      setTempShape({
        type: tool,
        startX: pos.x,
        startY: pos.y,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || !tempShape) return

    const stage = e.target.getStage()
    const pos = getPointerPosition(stage)
    if (!pos) return

    if (tempShape.type === 'rect') {
      setTempShape({
        ...tempShape,
        x: Math.min(pos.x, tempShape.startX),
        y: Math.min(pos.y, tempShape.startY),
        width: Math.abs(pos.x - tempShape.startX),
        height: Math.abs(pos.y - tempShape.startY),
      })
    } else if (tempShape.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - tempShape.startX, 2) + Math.pow(pos.y - tempShape.startY, 2)
      )
      setTempShape({
        ...tempShape,
        radius,
      })
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing || !tempShape) return

    if (tempShape.type === 'rect' && tempShape.width > 5 && tempShape.height > 5) {
      setAnnotations([
        ...annotations,
        {
          id: Date.now(),
          type: 'rect',
          x: tempShape.x,
          y: tempShape.y,
          width: tempShape.width,
          height: tempShape.height,
          style: 'warning',
        },
      ])
    } else if (tempShape.type === 'circle' && tempShape.radius > 5) {
      setAnnotations([
        ...annotations,
        {
          id: Date.now(),
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
    <div ref={containerRef} className="w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageDimensions.width}
        height={stageDimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {img && <KonvaImage image={img} />}
          
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
          {isDrawing && tempShape && tempShape.type === 'rect' && (
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
          {isDrawing && tempShape && tempShape.type === 'circle' && (
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
}

export function exportToPNG(stageRef, filename = 'annotated-image.png') {
  if (!stageRef.current) return

  const uri = stageRef.current.toDataURL({ pixelRatio: 1 })
  const link = document.createElement('a')
  link.download = filename
  link.href = uri
  link.click()
}
