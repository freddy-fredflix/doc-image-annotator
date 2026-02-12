# Color Usage Guide

This document explains how colors are used in the Documentation Image Annotator.

## UI Components (React/DOM)

All UI components use **shadcn/ui theme variables** for consistency and dark mode support.

### Available Theme Colors

From `src/index.css`, the following semantic colors are available:

- `background` / `foreground` - Main background and text
- `card` / `card-foreground` - Card backgrounds and text
- `popover` / `popover-foreground` - Popover/dropdown colors
- `primary` / `primary-foreground` - Primary actions and buttons
- `secondary` / `secondary-foreground` - Secondary actions
- `muted` / `muted-foreground` - Muted/disabled elements
- `accent` / `accent-foreground` - Accent/hover states
- `destructive` / `destructive-foreground` - Destructive actions
- `border` - Border colors
- `input` - Input field borders
- `ring` - Focus ring colors

### Usage in Tailwind Classes

Always use semantic color classes:

✅ **Correct:**
```jsx
<div className="bg-card text-card-foreground">
<Button variant="primary">Click me</Button>
<p className="text-muted-foreground">Helper text</p>
```

❌ **Incorrect:**
```jsx
<div className="bg-white text-black">
<Button className="bg-green-600">Click me</Button>
<p className="text-gray-500">Helper text</p>
```

## Canvas Annotations (Konva)

Canvas annotations use **hardcoded hex colors** because:

1. Konva renders to `<canvas>` which requires actual color values
2. CSS variables cannot be used in canvas rendering
3. Colors must be visible in both light/dark modes AND when exported
4. Documentation screenshots need consistent, high-contrast colors

### Annotation Color Palette

Defined in `src/components/KonvaCanvas.jsx`:

```javascript
const ANNOTATION_STYLES = {
  primary: {
    fill: '#3b82f6',      // Blue - numbered markers
    stroke: '#2563eb',    // Darker blue borders
    textColor: '#ffffff', // White text
  },
  warning: {
    fill: '#f59e0b',      // Amber - highlights/attention
    stroke: '#d97706',    // Darker amber borders
    textColor: '#ffffff', // White text
  },
  info: {
    fill: '#06b6d4',      // Cyan - informational
    stroke: '#0891b2',    // Darker cyan borders
    textColor: '#ffffff', // White text
  },
}
```

### Why These Colors?

- **High contrast** - Visible on various screenshot backgrounds
- **Printable** - Work well in both color and grayscale
- **Accessible** - Meet WCAG contrast requirements
- **Professional** - Suitable for technical documentation
- **Theme-independent** - Look good in both light and dark UI modes

## Summary

- **UI components**: Use shadcn/ui theme variables (`text-primary`, `bg-card`, etc.)
- **Canvas annotations**: Use hardcoded colors (required by Konva rendering)
- **Exports**: Canvas colors remain consistent regardless of UI theme
