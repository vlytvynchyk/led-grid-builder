# User guide

This guide walks through the LED Grid Builder interface and options.

---

## 1. Grid setup

### Module type

Choose the kind of MAX7219 hardware you’re using:

- **MAX7219 8×8 (single)** — One 8×8 matrix (64 LEDs), one MAX7219 IC.  
- **MAX7219 4-in-1 8×32** — One board with four 8×8 matrices in a row (32×8).  
- **MAX7219 32×32** — 32×32 grid (e.g. 16× 8×8 in a 4×4 layout).

A small **preview** under the dropdown shows the shape of one module (e.g. square 8×8 or wide 32×8).

### Number of modules

How many of the chosen modules you’re using (1–64). For example, “4” with **8×8 (single)** means four 8×8 boards.

### Arrangement

How those modules are laid out:

- **Square** — As square as possible (e.g. 4 → 2×2, 6 → 2×3).  
- **Row** — All in one row.  
- **Column** — All in one column.

Example: 4× 8×8 with **Square** gives a 16×16 grid (2×2 modules).

### Color

LED color: **Red**, **Green**, or **Blue**, to match common single-color MAX7219 modules.

---

## 2. Content

### Content type

- **Text** — Type letters, numbers, and symbols (e.g. `HELLO`, `12:20`).  
- **Icon** — Choose a preset 8×8 icon (radiation, biohazard, heart, arrows, battery, etc.).  
- **Canvas** — Draw your own 8×8 pattern by clicking cells in the editor.

### Text options (when Content type = Text)

- **Text to display** — The string to show.  
- **Text fit** — How the text is scaled or placed on the grid:  
  **Native** (fixed 5×7 size, centered, may clip), **Fill** (stretch to fill), **Uniform** (scale keeping aspect ratio), **Fit width**, **Fit height**.

### Icon options (when Content type = Icon)

- **Icon** — Grid of icons with small previews; click one to select.  
- **Icon fit** — Same choices as Text fit (Native, Fill, Uniform, Fit width, Fit height).

### Canvas options (when Content type = Canvas)

- **Draw your icon** — 8×8 grid; click a cell to toggle it on/off. **Clear** resets the canvas.  
- **Canvas fit** — Same as Icon fit.

---

## 3. Display

### Mode

- **Static** — Content stays fixed.  
- **Blinking** — Content turns on and off at the blink speed.  
- **Floating / Scroll** — Content moves in the chosen direction at the scroll speed.

### Blink speed (ms)

Interval between on/off toggles when mode is **Blinking**. Lower = faster (e.g. 200 ms = faster than 1000 ms).

### Text flow direction

Used when mode is **Floating / Scroll**:

- **← Left** — Content scrolls left.  
- **Right →** — Content scrolls right.  
- **↑ Up** — Content scrolls up.  
- **Down ↓** — Content scrolls down.

Applies to text and to icons/canvas when they’re in scroll mode.

### Moving text speed (ms)

Delay between scroll steps when mode is **Floating / Scroll**. Lower = faster movement.

---

## 4. Theme

In the **header**, the **Dark** / **Light** switch changes the UI theme. The choice is saved in your browser for the next visit.

---

## 5. Preview area

The large **Preview** shows your grid and content:

- **Grid** — Matches the module type, number of modules, and arrangement. If you use more than one module, thin gaps separate them.  
- **Content** — Your text, icon, or canvas drawn on the grid with the selected fit and display mode (static, blinking, or scrolling).  
- **Caption** — Displays grid size (e.g. 16×16), number of modules, and current display mode.

The preview box size stays fixed; only the resolution (cell count) and cell size change so you can compare different setups easily.

---

## Tips

- Use **Text fit** or **Icon fit** to make long text or small icons fill the grid or keep proportions.  
- For scrolling, try **Floating / Scroll** with **Text flow direction** and **Moving text speed** to match the effect you want on hardware.  
- **Canvas** is useful for one-off symbols or logos that aren’t in the icon set.  
- Theme (Dark/Light) is independent of the LED **Color**; the latter only affects the preview pixels.
