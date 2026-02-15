/**
 * LED module definitions for the grid builder.
 *
 * MAX7219 is an LED driver IC that drives one 8×8 matrix (64 LEDs) per chip.
 * All modules use 3-wire SPI (DIN, CLK, CS), are daisy-chainable, and are
 * commonly available in red, green, and blue. Typical supply: 5V.
 *
 * References:
 * - Single 8×8 and 4-in-1 8×32 are standard commercial modules.
 * - 32×32 is built from 16× 8×8 in a 4×4 grid, or 4× 8×32 boards stacked.
 */

export const MODULE_TYPES = {
  /** Single 8×8 module: one MAX7219 IC, 64 LEDs. Common for small displays. */
  MAX7219_8X8: {
    id: 'MAX7219_8X8',
    name: 'MAX7219 8×8 (single)',
    description: '1× 8×8 matrix, 1 MAX7219 IC, 64 LEDs',
    perModuleCols: 8,
    perModuleRows: 8,
    moduleCount: 1,
  },
  /**
   * "4-in-1" board: four 8×8 matrices on one PCB in a row (8×32).
   * One physical module, 4 MAX7219 ICs, 256 LEDs. Often sold as "4 in 1" or "8x32".
   */
  MAX7219_4IN1_8X32: {
    id: 'MAX7219_4IN1_8X32',
    name: 'MAX7219 4-in-1 8×32',
    description: '4× 8×8 in a row on one board, 8×32, 4 MAX7219 ICs',
    perModuleCols: 32,
    perModuleRows: 8,
    moduleCount: 4,
  },
  /**
   * 32×32 display: 16× 8×8 in a 4×4 grid (or 4× 8×32 boards stacked).
   * Built by daisy-chaining; not a single commercial “module” but a common layout.
   */
  MAX7219_32X32: {
    id: 'MAX7219_32X32',
    name: 'MAX7219 32×32',
    description: '16× 8×8 in 4×4 grid (or 4× 8×32 stacked), 32×32',
    perModuleCols: 32,
    perModuleRows: 32,
    moduleCount: 16,
  },
}

/** Arrangement options when using multiple identical modules */
export const ARRANGEMENTS = [
  { id: 'square', name: 'Square (e.g. 4 → 2×2)' },
  { id: 'row', name: 'Row (modules in one row)' },
  { id: 'column', name: 'Column (modules in one column)' },
]

/**
 * Compute grid size from module type, number of modules, and arrangement.
 * @returns {{ cols: number, rows: number, layoutCols: number, layoutRows: number }}
 */
export function getGridSize(moduleType, numModules, arrangement) {
  const n = Math.max(1, Math.min(64, Math.floor(Number(numModules) || 1)))
  const w = moduleType?.perModuleCols ?? 8
  const h = moduleType?.perModuleRows ?? 8

  let layoutCols, layoutRows
  if (arrangement === 'row') {
    layoutCols = n
    layoutRows = 1
  } else if (arrangement === 'column') {
    layoutCols = 1
    layoutRows = n
  } else {
    layoutRows = Math.max(1, Math.floor(Math.sqrt(n)))
    layoutCols = Math.ceil(n / layoutRows)
  }

  return {
    cols: w * layoutCols,
    rows: h * layoutRows,
    layoutCols,
    layoutRows,
  }
}

export const MODULE_COLORS = {
  red: { id: 'red', name: 'Red', css: '#e63946', rgb: [230, 57, 70] },
  green: { id: 'green', name: 'Green', css: '#2a9d4a', rgb: [42, 157, 74] },
  blue: { id: 'blue', name: 'Blue', css: '#4361ee', rgb: [67, 97, 238] },
}
