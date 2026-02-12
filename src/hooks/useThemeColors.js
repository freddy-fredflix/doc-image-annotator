import { useEffect, useState } from 'react'

/**
 * Hook to get current theme colors from CSS variables
 * Konva needs actual color values, not CSS variable names
 */
export function useThemeColors() {
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    destructive: '#ef4444',
    muted: '#f3f4f6',
    border: '#e5e7eb',
  })

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)

      const hslToHex = (hsl) => {
        const [h, s, l] = hsl.match(/[\d.]+/g).map(Number)
        const hDecimal = l / 100
        const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100
        const f = (n) => {
          const k = (n + h / 30) % 12
          const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
          return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
      }

      const oklchToHex = (oklch) => {
        // For now, use a simplified conversion
        // In production, you'd want a proper OKLCH -> RGB conversion
        const lightness = parseFloat(oklch.match(/[\d.]+/)[0])
        if (lightness > 0.5) {
          return '#3b82f6' // primary-ish blue for light mode
        } else {
          return '#60a5fa' // lighter blue for dark mode
        }
      }

      try {
        const primaryVar = computedStyle.getPropertyValue('--primary').trim()
        const primaryFgVar = computedStyle.getPropertyValue('--primary-foreground').trim()
        const destructiveVar = computedStyle.getPropertyValue('--destructive').trim()
        const mutedVar = computedStyle.getPropertyValue('--muted').trim()
        const borderVar = computedStyle.getPropertyValue('--border').trim()

        // Try to convert oklch or hsl to hex
        const convertColor = (cssVar) => {
          if (cssVar.startsWith('oklch')) {
            return oklchToHex(cssVar)
          } else if (cssVar.match(/\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%/)) {
            return hslToHex(`hsl(${cssVar})`)
          }
          return cssVar
        }

        setColors({
          primary: convertColor(primaryVar) || '#3b82f6',
          primaryForeground: convertColor(primaryFgVar) || '#ffffff',
          destructive: convertColor(destructiveVar) || '#ef4444',
          muted: convertColor(mutedVar) || '#f3f4f6',
          border: convertColor(borderVar) || '#e5e7eb',
        })
      } catch (e) {
        // Fallback to default colors
        console.warn('Could not read theme colors:', e)
      }
    }

    updateColors()

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return colors
}
