import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ThemeToggle'
import { KonvaCanvas, exportCanvasToPNG } from '@/components/KonvaCanvas'
import { 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  MousePointer2,
  Type,
  Square,
  Circle,
  Hash,
  Upload,
  Info
} from 'lucide-react'

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
    exportCanvasToPNG(canvasRef, `annotated-${timestamp}.png`)
  }

  const handleClearAnnotations = () => {
    if (window.confirm('Clear all annotations? This cannot be undone.')) {
      setAnnotations([])
    }
  }

  const handleNewImage = () => {
    if (annotations.length > 0) {
      if (!window.confirm('Load a new image? Current annotations will be lost.')) {
        return
      }
    }
    setImage(null)
    setAnnotations([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', description: 'Select and move annotations' },
    { id: 'marker', icon: Hash, label: 'Marker', description: 'Add numbered markers with optional labels' },
    { id: 'text', icon: Type, label: 'Text', description: 'Add text annotations' },
    { id: 'rect', icon: Square, label: 'Rectangle', description: 'Draw rectangles to highlight areas' },
    { id: 'circle', icon: Circle, label: 'Circle', description: 'Draw circles to highlight areas' },
  ]

  if (!image) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Documentation Image Annotator</h1>
              <p className="text-sm text-muted-foreground">Fast, opinionated tool for creating instruction images</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl">
            <div
              className="p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
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
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-full bg-primary/10 p-8">
                  <ImageIcon className="w-16 h-16 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Upload or paste an image</h2>
                  <p className="text-muted-foreground">
                    Drag and drop, click to browse, or press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl/Cmd + V</kbd> to paste from clipboard
                  </p>
                  <p className="text-sm text-muted-foreground">Supports PNG, JPG, and other common image formats</p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b shrink-0">
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

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-card flex flex-col overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Tools Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Annotation Tools
              </h3>
              <div className="space-y-2">
                {tools.map((t) => {
                  const Icon = t.icon
                  return (
                    <Button
                      key={t.id}
                      variant={tool === t.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setTool(t.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span>{t.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Current Tool Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Current Tool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tools.find(t => t.id === tool)?.description}
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Actions Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Actions
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleClearAnnotations}
                  disabled={annotations.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Clear All Annotations
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={handleExport}
                  disabled={annotations.length === 0}
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export as PNG
                </Button>
              </div>
            </div>

            <Separator />

            {/* Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Paste image:</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded font-mono">Ctrl/Cmd+V</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Move annotation:</span>
                  <span>Click & drag</span>
                </div>
                <div className="flex justify-between">
                  <span>Deselect:</span>
                  <span>Click empty area</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {annotations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Document Stats</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Total annotations:</span>
                      <span className="font-semibold text-foreground">{annotations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Markers:</span>
                      <span className="font-semibold text-foreground">
                        {annotations.filter(a => a.type === 'marker').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shapes:</span>
                      <span className="font-semibold text-foreground">
                        {annotations.filter(a => a.type === 'rect' || a.type === 'circle').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="w-full h-full rounded-lg border bg-card shadow-sm overflow-hidden">
            <KonvaCanvas
              ref={canvasRef}
              image={image}
              tool={tool}
              annotations={annotations}
              setAnnotations={setAnnotations}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
