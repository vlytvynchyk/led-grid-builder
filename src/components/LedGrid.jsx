import { useMemo, useImperativeHandle, forwardRef, useCallback } from 'react'
import { stringToGrid } from '../config/font5x7'
import { ICONS } from '../config/icons'
import { MODULE_COLORS } from '../config/modules'

const GAP = 1
/** Extra gap between modules when multiple are used */
const MODULE_GAP = 6
/** Fixed preview box size (px); grid scales inside to keep layout consistent. */
const PREVIEW_SIZE = 400

/**
 * Renders the LED grid preview with optional content (text, icon).
 * When layoutCols/layoutRows > 1, draws visual separation between modules.
 */
export const LedGrid = forwardRef(function LedGrid({
  cols,
  rows,
  layoutCols = 1,
  layoutRows = 1,
  colorId,
  contentMode,
  content,
  displayMode,
  textFitMode = 'fill',
  iconFitMode = 'fill',
  textFlowDirection = 'left',
  scrollOffset = 0,
  blinkingOn = true,
  smoothing = false,
}, ref) {
  const multiModule = layoutCols > 1 || layoutRows > 1
  const moduleCols = Math.floor(cols / layoutCols)
  const moduleRows = Math.floor(rows / layoutRows)
  const color = MODULE_COLORS[colorId]?.css ?? MODULE_COLORS.green.css

  const { grid, contentWidth, contentHeight } = useMemo(() => {
    if (contentMode === 'icon' && content) {
      const icon = ICONS[content]
      if (!icon) return { grid: null, contentWidth: 0, contentHeight: 0 }
      const g = icon.grid
      const h = g?.length ?? 0
      const w = g?.[0]?.length ?? 8
      return { grid: g, contentWidth: w, contentHeight: h }
    }
    if (contentMode === 'canvas' && Array.isArray(content) && content.length > 0) {
      const g = content
      const h = g.length
      const w = g[0]?.length ?? 0
      return { grid: g, contentWidth: w, contentHeight: h }
    }
    if (contentMode === 'text' && content !== undefined && content !== null) {
      const textGrid = stringToGrid(String(content))
      if (!textGrid.length) return { grid: null, contentWidth: 0, contentHeight: 0 }
      return {
        grid: textGrid,
        contentWidth: textGrid[0]?.length ?? 0,
        contentHeight: textGrid.length,
      }
    }
    return { grid: null, contentWidth: 0, contentHeight: 0 }
  }, [contentMode, content])

  const { cellSize, width, height, moduleWidth, moduleHeight } = useMemo(() => {
    const availableW = PREVIEW_SIZE - (multiModule ? (layoutCols - 1) * MODULE_GAP : 0)
    const availableH = PREVIEW_SIZE - (multiModule ? (layoutRows - 1) * MODULE_GAP : 0)
    const maxCellW = (availableW - GAP * (cols - 1)) / cols
    const maxCellH = (availableH - GAP * (rows - 1)) / rows
    const cellSize = Math.max(2, Math.floor(Math.min(maxCellW, maxCellH)))
    const width = cols * (cellSize + GAP) - GAP
    const height = rows * (cellSize + GAP) - GAP
    const moduleWidth = moduleCols * (cellSize + GAP) - GAP
    const moduleHeight = moduleRows * (cellSize + GAP) - GAP
    return { cellSize, width, height, moduleWidth, moduleHeight }
  }, [cols, rows, multiModule, layoutCols, layoutRows, moduleCols, moduleRows])

  const displayGrid = useMemo(() => {
    const out = []
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        row.push(0)
      }
      out.push(row)
    }

    if (!grid || !grid.length) return out

    const contentRows = contentHeight
    const contentCols = contentWidth
    const startRow = Math.max(0, Math.floor((rows - contentRows) / 2))
    const baseStartCol = Math.max(0, Math.floor((cols - contentCols) / 2))
    const applyScroll = displayMode === 'scroll'
    const mod = (a, n) => ((a % n) + n) % n
    const colOffset = applyScroll ? mod(Math.round(scrollOffset), Math.max(1, contentCols)) : 0
    const rowOffset = applyScroll ? mod(Math.round(scrollOffset), Math.max(1, contentRows)) : 0

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

    for (let outR = 0; outR < rows; outR++) {
      for (let outC = 0; outC < cols; outC++) {
        let contentR, contentC
        if (contentMode === 'icon' || contentMode === 'canvas') {
          let cr, cc
          switch (iconFitMode) {
            case 'native':
              cr = outR - startRow
              cc = outC - baseStartCol
              break
            case 'fill':
              cr = Math.floor((outR * contentRows) / rows)
              cc = Math.floor((outC * contentCols) / cols)
              break
            case 'uniform': {
              const s = Math.min(cols / contentCols, rows / contentRows)
              const offsetC = (cols - contentCols * s) / 2
              const offsetR = (rows - contentRows * s) / 2
              cc = Math.floor((outC - offsetC) / s)
              cr = Math.floor((outR - offsetR) / s)
              break
            }
            case 'fitWidth': {
              const scale = cols / contentCols
              const scaledH = contentRows * scale
              const offsetR = (rows - scaledH) / 2
              cc = clamp(Math.floor((outC * contentCols) / cols), 0, contentCols - 1)
              cr = Math.floor((outR - offsetR) / scale)
              break
            }
            case 'fitHeight': {
              const scale = rows / contentRows
              const scaledW = contentCols * scale
              const offsetC = (cols - scaledW) / 2
              cr = clamp(Math.floor((outR * contentRows) / rows), 0, contentRows - 1)
              cc = Math.floor((outC - offsetC) / scale)
              break
            }
            default:
              cr = Math.floor((outR * contentRows) / rows)
              cc = Math.floor((outC * contentCols) / cols)
          }
          if (applyScroll) {
            if (textFlowDirection === 'left') {
              contentR = cr
              contentC = mod(cc + colOffset, contentCols)
            } else if (textFlowDirection === 'right') {
              contentR = cr
              contentC = mod(cc - colOffset, contentCols)
            } else if (textFlowDirection === 'up') {
              contentR = mod(cr + rowOffset, contentRows)
              contentC = cc
            } else {
              contentR = mod(cr - rowOffset, contentRows)
              contentC = cc
            }
          } else {
            contentR = cr
            contentC = cc
          }
        } else if (contentMode === 'text' && applyScroll) {
          if (textFlowDirection === 'left') {
            contentR = outR - startRow
            contentC = mod(outC - baseStartCol + colOffset, contentCols)
          } else if (textFlowDirection === 'right') {
            contentR = outR - startRow
            contentC = mod(outC - baseStartCol - colOffset, contentCols)
          } else if (textFlowDirection === 'up') {
            contentR = mod(outR - startRow + rowOffset, contentRows)
            contentC = outC - baseStartCol
          } else {
            contentR = mod(outR - startRow - rowOffset, contentRows)
            contentC = outC - baseStartCol
          }
        } else if (contentMode === 'text') {
          switch (textFitMode) {
            case 'native': {
              contentR = outR - startRow
              contentC = outC - baseStartCol
              break
            }
            case 'fill': {
              contentR = Math.floor((outR * contentRows) / rows)
              contentC = Math.floor((outC * contentCols) / cols)
              break
            }
            case 'uniform': {
              const s = Math.min(cols / contentCols, rows / contentRows)
              const offsetC = (cols - contentCols * s) / 2
              const offsetR = (rows - contentRows * s) / 2
              contentC = Math.floor((outC - offsetC) / s)
              contentR = Math.floor((outR - offsetR) / s)
              break
            }
            case 'fitWidth': {
              const scale = cols / contentCols
              const scaledH = contentRows * scale
              const offsetR = (rows - scaledH) / 2
              contentC = clamp(Math.floor((outC * contentCols) / cols), 0, contentCols - 1)
              contentR = Math.floor((outR - offsetR) / scale)
              break
            }
            case 'fitHeight': {
              const scale = rows / contentRows
              const scaledW = contentCols * scale
              const offsetC = (cols - scaledW) / 2
              contentR = clamp(Math.floor((outR * contentRows) / rows), 0, contentRows - 1)
              contentC = Math.floor((outC - offsetC) / scale)
              break
            }
            default:
              contentR = outR - startRow
              contentC = outC - baseStartCol
          }
        } else {
          contentR = outR - startRow
          contentC = outC - baseStartCol
        }
        if (contentR < 0 || contentR >= contentRows || contentC < 0 || contentC >= contentCols) continue
        const val = grid[contentR]?.[contentC] ?? 0
        if (val) out[outR][outC] = 1
      }
    }
    return out
  }, [rows, cols, grid, contentWidth, contentHeight, contentMode, displayMode, textFitMode, iconFitMode, textFlowDirection, scrollOffset])

  /**
   * Edge-fill smoothing for scaled binary grids.
   * Fills in "staircase" gaps on diagonal edges to make curves and angled
   * lines look smoother on larger LED grids.
   *
   * For each empty pixel, if it has exactly two adjacent (orthogonal)
   * neighbours that are "on" and those neighbours are at a corner (not
   * opposite each other), the pixel is a concave staircase gap — fill it in.
   */
  const smoothedGrid = useMemo(() => {
    if (!smoothing) return displayGrid
    const h = displayGrid.length
    if (h === 0) return displayGrid
    const w = displayGrid[0].length

    // Clone grid
    const out = displayGrid.map((row) => [...row])

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (out[r][c]) continue // already on

        const top    = r > 0     ? displayGrid[r - 1][c] : 0
        const bottom = r < h - 1 ? displayGrid[r + 1][c] : 0
        const left   = c > 0     ? displayGrid[r][c - 1] : 0
        const right  = c < w - 1 ? displayGrid[r][c + 1] : 0

        // Count orthogonal neighbours
        const count = top + bottom + left + right

        // Fill corner gaps: exactly 2 adjacent (non-opposite) neighbours
        if (count === 2 && !(top && bottom) && !(left && right)) {
          // Verify the diagonal between the two neighbours is also on,
          // so we only smooth actual edges, not random noise
          const diagR = top ? r - 1 : r + 1
          const diagC = left ? c - 1 : c + 1
          if (diagR >= 0 && diagR < h && diagC >= 0 && diagC < w && displayGrid[diagR][diagC]) {
            out[r][c] = 1
          }
        }
      }
    }
    return out
  }, [displayGrid, smoothing])

  const showPixels = displayMode !== 'blink' || blinkingOn

  const exportPng = useCallback((bgColor) => {
    const multi = layoutCols > 1 || layoutRows > 1
    const canvasW = multi
      ? layoutCols * moduleWidth + (layoutCols - 1) * MODULE_GAP
      : width
    const canvasH = multi
      ? layoutRows * moduleHeight + (layoutRows - 1) * MODULE_GAP
      : height

    const canvas = document.createElement('canvas')
    canvas.width = canvasW
    canvas.height = canvasH
    const ctx = canvas.getContext('2d')

    if (bgColor) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasW, canvasH)
    }

    const ledColor = MODULE_COLORS[colorId]?.css ?? MODULE_COLORS.green.css
    const offColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-input').trim() || '#1e232d'
    const radius = Math.max(1, Math.floor(cellSize / 8))

    const drawRoundRect = (x, y, w, h, r) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
    }

    if (multi) {
      for (let ly = 0; ly < layoutRows; ly++) {
        for (let lx = 0; lx < layoutCols; lx++) {
          const r0 = ly * moduleRows
          const c0 = lx * moduleCols
          const offsetX = lx * (moduleWidth + MODULE_GAP)
          const offsetY = ly * (moduleHeight + MODULE_GAP)
          for (let dr = 0; dr < moduleRows; dr++) {
            for (let dc = 0; dc < moduleCols; dc++) {
              const on = smoothedGrid[r0 + dr]?.[c0 + dc] ?? 0
              const isOn = on && showPixels
              const x = offsetX + dc * (cellSize + GAP)
              const y = offsetY + dr * (cellSize + GAP)
              ctx.globalAlpha = isOn ? 1 : 0.25
              ctx.fillStyle = isOn ? ledColor : offColor
              drawRoundRect(x, y, cellSize, cellSize, radius)
            }
          }
        }
      }
    } else {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const on = smoothedGrid[r]?.[c] ?? 0
          const isOn = on && showPixels
          const x = c * (cellSize + GAP)
          const y = r * (cellSize + GAP)
          ctx.globalAlpha = isOn ? 1 : 0.25
          ctx.fillStyle = isOn ? ledColor : offColor
          drawRoundRect(x, y, cellSize, cellSize, radius)
        }
      }
    }

    ctx.globalAlpha = 1
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  }, [smoothedGrid, showPixels, cellSize, width, height, moduleWidth, moduleHeight, layoutCols, layoutRows, moduleCols, moduleRows, colorId])

  useImperativeHandle(ref, () => ({ exportPng }), [exportPng])

  const cellStyle = (on) => ({
    width: cellSize,
    height: cellSize,
    borderRadius: Math.max(1, Math.floor(cellSize / 8)),
    backgroundColor: on && showPixels ? color : 'var(--bg-input)',
    opacity: on && showPixels ? 1 : 0.25,
  })

  return (
    <div
      className="led-grid-wrap"
      style={{
        width: PREVIEW_SIZE + 16,
        height: PREVIEW_SIZE + 16,
        padding: 8,
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {multiModule ? (
        <div
          className="led-grid-modules"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layoutCols}, ${moduleWidth}px)`,
            gridTemplateRows: `repeat(${layoutRows}, ${moduleHeight}px)`,
            gap: MODULE_GAP,
            width: layoutCols * moduleWidth + (layoutCols - 1) * MODULE_GAP,
            height: layoutRows * moduleHeight + (layoutRows - 1) * MODULE_GAP,
          }}
        >
          {Array.from({ length: layoutRows * layoutCols }, (_, blockIndex) => {
            const ly = Math.floor(blockIndex / layoutCols)
            const lx = blockIndex % layoutCols
            const r0 = ly * moduleRows
            const c0 = lx * moduleCols
            return (
              <div
                key={blockIndex}
                className="led-grid-module"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${moduleCols}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${moduleRows}, ${cellSize}px)`,
                  gap: GAP,
                  width: moduleWidth,
                  height: moduleHeight,
                }}
              >
                {smoothedGrid.slice(r0, r0 + moduleRows).flatMap((row, dr) =>
                  row.slice(c0, c0 + moduleCols).map((on, dc) => (
                    <div
                      key={`${dr}-${dc}`}
                      style={cellStyle(on)}
                    />
                  ))
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div
          className="led-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: GAP,
            width,
            height,
          }}
        >
          {smoothedGrid.flatMap((row, r) =>
            row.map((on, c) => (
              <div key={`${r}-${c}`} style={cellStyle(on)} />
            ))
          )}
        </div>
      )}
    </div>
  )
})
