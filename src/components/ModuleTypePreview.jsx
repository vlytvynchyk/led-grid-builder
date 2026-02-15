/**
 * Small grid preview for a module type (per-module dimensions).
 * Shows the shape of one module unit (e.g. 8×8, 32×8, 32×32).
 */
const GAP = 1
const MAX_SIZE = 100

export function ModuleTypePreview({ cols, rows }) {
  const scale = Math.min(MAX_SIZE / cols, MAX_SIZE / rows)
  const cellSize = Math.max(2, Math.floor(scale)) - GAP
  const cellSizeClamped = Math.max(2, cellSize)
  const width = cols * (cellSizeClamped + GAP) - GAP
  const height = rows * (cellSizeClamped + GAP) - GAP

  return (
    <div className="module-type-preview" aria-hidden>
      <div
        className="module-type-preview-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSizeClamped}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSizeClamped}px)`,
          gap: GAP,
          width,
          height,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div
            key={i}
            style={{
              width: cellSizeClamped,
              height: cellSizeClamped,
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
