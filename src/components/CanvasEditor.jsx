import { useCallback } from 'react'
import { MODULE_COLORS } from '../config/modules'

const CANVAS_ROWS = 8
const CANVAS_COLS = 8
const CELL_PX = 28
const GAP = 1

/** Create an empty 8×8 grid (0 = off, 1 = on). */
export function createEmptyCanvas() {
  return Array.from({ length: CANVAS_ROWS }, () => Array(CANVAS_COLS).fill(0))
}

/**
 * Drawable canvas: click cells to toggle. Grid is CANVAS_ROWS × CANVAS_COLS.
 */
export function CanvasEditor({ grid, onChange, colorId }) {
  const color = MODULE_COLORS[colorId]?.css ?? MODULE_COLORS.green.css

  const handleCellClick = useCallback(
    (r, c) => {
      const next = grid.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? (cell ? 0 : 1) : cell))
      )
      onChange(next)
    },
    [grid, onChange]
  )

  const handleClear = useCallback(() => {
    onChange(createEmptyCanvas())
  }, [onChange])

  if (!grid?.length) return null

  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const width = cols * (CELL_PX + GAP) - GAP
  const height = rows * (CELL_PX + GAP) - GAP

  return (
    <div className="canvas-editor">
      <div
        className="canvas-editor-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_PX}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_PX}px)`,
          gap: GAP,
          width,
          height,
        }}
      >
        {grid.map((row, r) =>
          row.map((on, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className="canvas-editor-cell"
              onClick={() => handleCellClick(r, c)}
              style={{
                width: CELL_PX,
                height: CELL_PX,
                borderRadius: 4,
                backgroundColor: on ? color : 'var(--bg-input)',
                border: '1px solid var(--border)',
              }}
              aria-label={`Cell ${r},${c} ${on ? 'on' : 'off'}`}
            />
          ))
        )}
      </div>
      <button type="button" className="canvas-editor-clear" onClick={handleClear}>
        Clear
      </button>
    </div>
  )
}
