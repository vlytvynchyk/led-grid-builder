/**
 * Renders a small 8×8 LED-style preview of an icon.
 */
export function IconPreview({ grid, size = 32, color = 'var(--accent)' }) {
  if (!grid?.length) return null
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const cellSize = Math.max(2, Math.min(4, Math.floor(size / Math.max(rows, cols)) - 1))
  const gap = 1
  const w = cols * (cellSize + gap) - gap
  const h = rows * (cellSize + gap) - gap

  return (
    <div
      className="icon-preview"
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gap,
        width: w,
        height: h,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {grid.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: cellSize,
              height: cellSize,
              borderRadius: 1,
              backgroundColor: on ? color : 'var(--bg-input)',
              opacity: on ? 1 : 0.3,
            }}
          />
        ))
      )}
    </div>
  )
}
