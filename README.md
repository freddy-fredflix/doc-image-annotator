# Documentation Image Annotator

A fast, opinionated client-side web application for creating instruction and documentation images. Built with Vite, React, and Konva.

## Purpose

This tool is specifically designed for annotating screenshots and images for technical documentation. It prioritizes speed, clarity, and repeatability over flexibility.

**This is NOT a general-purpose image editor** — it's optimized for documentation workflows.

## Features

### Core Functionality

- **🖼️ Image Upload**: Drag-and-drop, file browser, or **paste from clipboard** (Ctrl/Cmd+V)
- **🔢 Numbered Markers**: Auto-incrementing numbered markers with optional labels
- **📝 Text Annotations**: Add descriptive text anywhere on the image
- **⬜ Rectangle Highlights**: Highlight rectangular areas
- **⭕ Circle Highlights**: Circular emphasis areas
- **✨ Live Drawing Preview**: See shapes as you draw them (rubber-banding)
- **🎯 Selection & Dragging**: Click to select, drag to move annotations
- **📤 Export**: Export annotated images as PNG at original resolution

### Professional UI

- **🎨 Tailwind CSS v4**: Modern, responsive styling
- **🌓 Dark Mode**: Full dark mode support with theme toggle (light/dark/system)
- **✨ shadcn/ui Components**: Polished, accessible UI components
- **🎯 Opinionated Design**: Predefined annotation styles for consistency

### Canvas Technology

**Library: Konva + react-konva**

Rationale for choosing Konva:
- React-friendly with declarative API
- Built-in object selection, dragging, and transforming
- Excellent performance on large images
- Native export to PNG at any resolution
- Reliable hit-testing and event handling
- Active maintenance and strong documentation

Alternatives considered but not used:
- **Fabric.js**: More features but less React-idiomatic
- **tldraw**: Too opinionated, harder to constrain to our use case
- **Custom canvas**: Too brittle for complex interactions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy to any static hosting service.

## Usage

### Upload an Image

1. **Drag and drop** an image onto the upload zone
2. **Click to browse** and select an image file
3. **Paste from clipboard**: Press `Ctrl/Cmd + V` with an image copied

### Annotate

1. **Select a tool** from the sidebar (Marker, Text, Rectangle, Circle)
2. **Click on the image** to place annotations
3. **Drag annotations** to reposition them
4. **Live preview**: When drawing shapes, you'll see them update in real-time

### Export

Click **Export PNG** to download your annotated image at original resolution.

## Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste image from clipboard
- Click: Select annotation
- Drag: Move selected annotation

## Opinionated Design Principles

✅ **Predefined styling** - Consistent, documentation-friendly appearance  
✅ **Fast workflow** - Click → annotate → export  
✅ **No complexity** - No layers, filters, or advanced editing  
✅ **Professional output** - Clean annotations suitable for technical docs  
✅ **Client-side only** - No backend required  

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Canvas**: Konva + react-konva
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui patterns
- **Icons**: Lucide React

## What This Is NOT

This tool intentionally avoids:
- ❌ Freehand drawing tools
- ❌ Image filters or retouching
- ❌ Layer management UI
- ❌ Full typography controls
- ❌ Full-spectrum color pickers

Keep it focused on producing consistent documentation annotations quickly.

## Architecture Notes

The application is structured to allow future extensions such as:
- Annotation presets
- Saved templates
- Multi-page support
- Cross-image consistent numbering

All state is managed locally in React. No persistence or authentication is currently implemented.

## License

MIT

## Contributing

This is an opinionated tool built for specific documentation workflows. Feature requests that maintain the fast, simple workflow are welcome. Pull requests that add unnecessary complexity will be declined.
