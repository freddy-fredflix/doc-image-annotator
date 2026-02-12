import { useState, useEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { ThemeToggle } from './components/ThemeToggle'
import { KonvaCanvas, exportToPNG } from './components/KonvaCanvas'
import { 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  MousePointer2,
  Type,
  Square,
  Circle,
  Hash,
  Upload
} from 'lucide-react'
import { cn } from './lib/utils'

function App() {
  const [image, setImage] = useState(null)
  const [tool, setTool] = useState('marker')
  const [annotations, setAnnotations] = useState([])
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            loadImageFromFile(file)
          }
          break
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const loadImageFromFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage({
        src: e.target.result,
        width: 0,
        height: 0,
      })
      setAnnotations([]) // Clear annotations when new image loads
    }
    reader.readAsDataURL(file)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      loadImageFromFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      loadImageFromFile(file)
    }
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    exportToPNG(canvasRef, `annotated-${timestamp}.png`)
  }

  const handleClearAnnotations = () => {
    if (window.confirm('Clear all annotations?')) {
      setAnnotations([])
    }
  }

  const handleNewImage = () => {
    setImage(null)
    setAnnotations([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', description: 'Select and move' },
    { id: 'marker', icon: Hash, label: 'Marker', description: 'Numbered markers' },
    { id: 'text', icon: Type, label: 'Text', description: 'Text annotation' },
    { id: 'rect', icon: Square, label: 'Rectangle', description: 'Highlight area' },
    { id: 'circle', icon: Circle, label: 'Circle', description: 'Circular highlight' },
  ]

  if (!image) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Documentation Image Annotator</h1>
              <p className="text-sm text-muted-foreground">Fast, opinionated tool for instruction images</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <div
            className="w-full max-w-2xl border-2 border-dashed border-border rounded-lg p-12 text-center bg-card hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-6">
                <ImageIcon className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload or paste an image</h2>
                <p className="text-muted-foreground mb-2">
                  Drag and drop, click to browse, or press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/Cmd + V</kbd> to paste
                </p>
                <p className="text-sm text-muted-foreground">PNG, JPG, or other image formats</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Documentation Image Annotator</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNewImage}>
              <Upload className="w-4 h-4 mr-2" />
              New Image
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Toolbar */}
        <aside className="w-64 flex flex-col gap-4">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Tools
            </h3>
            <div className="flex flex-col gap-2">
              {tools.map((t) => {
                const Icon = t.icon
                return (
                  <Button
                    key={t.id}
                    variant={tool === t.id ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setTool(t.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{t.label}</span>
                  </Button>
                )
              })}
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
              <strong>Tip:</strong> {tools.find(t => t.id === tool)?.description}
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={handleClearAnnotations}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4 text-xs text-muted-foreground">
            <p className="mb-2"><strong>Keyboard shortcuts:</strong></p>
            <ul className="space-y-1">
              <li>• <kbd className="px-1 bg-muted rounded">Ctrl/Cmd+V</kbd> Paste image</li>
              <li>• Drag annotations to move</li>
              <li>• Click to select</li>
            </ul>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1">
          <KonvaCanvas
            image={image}
            tool={tool}
            annotations={annotations}
            setAnnotations={setAnnotations}
            onImageLoad={(dims) => {
              setImage({ ...image, ...dims })
            }}
          />
        </main>
      </div>
    </div>
  )
}

export default App
