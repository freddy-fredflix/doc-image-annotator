import { useCallback, useState } from 'react'
import './ImageUploader.css'

function ImageUploader({ onImageUpload }) {
  const [dragActive, setDragActive] = useState(false)

  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          onImageUpload({
            src: e.target.result,
            width: img.width,
            height: img.height
          })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }, [onImageUpload])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleChange}
          className="file-input"
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-icon">📷</div>
          <h2>Upload an image to annotate</h2>
          <p>Drag and drop an image here, or click to browse</p>
          <p className="upload-hint">PNG, JPG, or other image formats</p>
        </label>
      </div>
    </div>
  )
}

export default ImageUploader
