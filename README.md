# Documentation Image Annotator

A fast, opinionated client-side web application for creating instruction and documentation images. Built with Vite and React.

## Purpose

This tool is specifically designed for annotating screenshots and images for technical documentation. It prioritizes speed, clarity, and repeatability over flexibility.

**This is NOT a general-purpose image editor** — it's optimized for documentation workflows.

## Features

### Core Functionality

- **Image Upload**: Drag-and-drop or browse for images
- **Numbered Markers**: Auto-incrementing numbered markers with optional labels
- **Text Annotations**: Add descriptive text anywhere on the image
- **Highlighting Shapes**: 
  - Rectangles for highlighting areas
  - Circles for emphasis
- **Export**: Export annotated images as PNG at original resolution

### Opinionated Design

- **Predefined styles**: Consistent visual appearance across all annotations
- **Fast workflow**: Click → annotate → export
- **No complexity**: No layers, filters, or advanced editing features
- **Documentation-focused**: Optimized for readability in technical docs

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

1. **Upload an image**: Drag and drop or click to browse
2. **Select a tool**: Choose from numbered markers, text, rectangle, or circle
3. **Click on the image** to place annotations
4. **Export**: Download the annotated image as PNG

### Keyboard Shortcuts

- (Coming soon: Delete, Undo, etc.)

## Technology

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS (no external UI libraries)
- **Client-side only**: No backend required

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

This is an opinionated tool built for specific documentation workflows. Feature requests that maintain the fast, simple workflow are welcome.
