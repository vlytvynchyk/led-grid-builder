# Overview

## What the application does

**LED Grid Builder** is a visual design and preview tool for LED matrix displays driven by **MAX7219** driver ICs. It lets you:

1. **Define the hardware layout**  
   Choose a module type (single 8×8, 4-in-1 8×32, or 32×32), how many modules you use, and how they’re arranged (e.g. square, row, column). The preview shows the same grid shape and proportions, with optional visual separation between modules.

2. **Choose LED color**  
   Set the display color to red, green, or blue to match common single-color MAX7219 modules.

3. **Add content**  
   - **Text / numbers** — Type any text (letters, digits, basic punctuation like `:`, `.`, `-`). You can choose how the text fits the grid (native size, fill, uniform scale, fit width, fit height).  
   - **Icons** — Pick from a set of 8×8 symbols (e.g. radiation, biohazard, heart, skull, arrows, battery, Wi‑Fi, play/pause, sun/moon). Icons can use the same fit options as text.  
   - **Canvas** — Draw your own 8×8 pattern by toggling cells on and off. The drawing is then shown on the grid like an icon.

4. **Preview behaviour**  
   - **Static** — Content is fixed on the grid.  
   - **Blinking** — Content turns on and off at a configurable interval.  
   - **Floating / scroll** — Content moves in a chosen direction (left, right, up, down) at a configurable speed.  
   Text and icons (and canvas) can scroll; text also supports different “fit” modes so long lines scale or wrap to the grid.

5. **Use light or dark theme**  
   A theme switch in the header toggles between dark and light UI; the choice is saved in the browser.

The **main preview area** always shows the same overall size; only the grid resolution (e.g. 8×8 vs 32×32) and cell size change so you can compare layouts at a glance.

## Who it’s for

- **Makers and hobbyists** planning a MAX7219 LED matrix project and wanting to try layouts and messages before wiring hardware.  
- **Developers** who need a quick way to preview text, icons, or patterns on different grid sizes and arrangements.  
- Anyone who wants to see how a message or symbol will look on an 8×8, 8×32, or 32×32 (or combined) MAX7219 display.

## What it does *not* do

- It does **not** generate Arduino, ESP, or other firmware code.  
- It does **not** program or control real hardware.  
- It does **not** export bitmaps or font data; it is for on-screen preview only.

## Technology

- **Front-end**: React (Vite), HTML/CSS.  
- **Deployment**: Static build (`dist/`); can be served by nginx, GitHub Pages, or any static host.  
- **Persistence**: Only the theme (dark/light) is stored in the browser; no backend or database.

## Module types (reference)

The app models three common setups:

| Type | Description | Grid per module |
|------|-------------|------------------|
| **MAX7219 8×8 (single)** | One 8×8 matrix, one MAX7219 IC | 8×8 |
| **MAX7219 4-in-1 8×32** | Four 8×8 in a row on one board | 32×8 |
| **MAX7219 32×32** | 16× 8×8 in a 4×4 (or 4× 8×32 stacked) | 32×32 |

You can then choose how many of these “modules” to use (e.g. 4× 8×8) and arrange them in a **square**, **row**, or **column**. The preview updates to match.

For more detail on using the UI, see the [User guide](user-guide.md).
