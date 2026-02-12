import { useState } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import AnnotationCanvas from './components/AnnotationCanvas'

function App() {
  const [image, setImage] = useState(null)
  const [annotations, setAnnotations] = useState([])

  const handleImageUpload = (uploadedImage) => {
    setImage(uploadedImage)
    setAnnotations([]) // Clear annotations when new image is uploaded
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Documentation Image Annotator</h1>
        <p>Fast, opinionated tool for creating instruction images</p>
      </header>
      
      <main className="app-main">
        {!image ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <AnnotationCanvas 
            image={image} 
            annotations={annotations}
            setAnnotations={setAnnotations}
            onReset={() => setImage(null)}
          />
        )}
      </main>
    </div>
  )
}

export default App
