import { useState, useEffect, useRef, useCallback } from 'react'
import { MODULE_TYPES, getGridSize } from './config/modules'
import { LedGrid } from './components/LedGrid'
import { SettingsPanel } from './components/SettingsPanel'
import { createEmptyCanvas } from './components/CanvasEditor'

const BLINK_MS_MIN = 100
const BLINK_MS_MAX = 2000
const SCROLL_MS_MIN = 20
const SCROLL_MS_MAX = 300

const THEME_KEY = 'led-grid-builder-theme'

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [moduleTypeId, setModuleTypeId] = useState('MAX7219_8X8')
  const [numModules, setNumModules] = useState(4)
  const [arrangement, setArrangement] = useState('square')
  const [colorId, setColorId] = useState('green')
  const [contentMode, setContentMode] = useState('icon')
  const [textContent, setTextContent] = useState('HELLO')
  const [iconId, setIconId] = useState('heart')
  const [canvasGrid, setCanvasGrid] = useState(() => createEmptyCanvas())
  const [displayMode, setDisplayMode] = useState('static')
  const [textFitMode, setTextFitMode] = useState('fill')
  const [iconFitMode, setIconFitMode] = useState('fill')
  const [textFlowDirection, setTextFlowDirection] = useState('left')
  const [blinkSpeedMs, setBlinkSpeedMs] = useState(500)
  const [scrollSpeedMs, setScrollSpeedMs] = useState(50)
  const [smoothing, setSmoothing] = useState(false)

  const [blinkingOn, setBlinkingOn] = useState(true)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [pngBackground, setPngBackground] = useState('dark')

  const gridRef = useRef(null)

  const moduleType = MODULE_TYPES[moduleTypeId]
  const gridSize = getGridSize(moduleType, numModules, arrangement)
  const { cols, rows, layoutCols, layoutRows } = gridSize

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (displayMode !== 'blink') return
    const ms = Math.max(BLINK_MS_MIN, Math.min(BLINK_MS_MAX, blinkSpeedMs))
    const t = setInterval(() => {
      setBlinkingOn((on) => !on)
    }, ms)
    return () => clearInterval(t)
  }, [displayMode, blinkSpeedMs])

  useEffect(() => {
    if (displayMode !== 'scroll') return
    const ms = Math.max(SCROLL_MS_MIN, Math.min(SCROLL_MS_MAX, scrollSpeedMs))
    const t = setInterval(() => {
      setScrollOffset((x) => x + 1)
    }, ms)
    return () => clearInterval(t)
  }, [displayMode, scrollSpeedMs])

  const content = contentMode === 'text' ? textContent : contentMode === 'icon' ? iconId : canvasGrid

  const handleExportPng = useCallback(async () => {
    if (!gridRef.current) return
    const bgColor = pngBackground === 'transparent'
      ? null
      : getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim() || '#0d0f14'
    const blob = await gridRef.current.exportPng(bgColor)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'led-grid.png'
    a.click()
    URL.revokeObjectURL(url)
  }, [pngBackground])

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>LED Grid Builder</h1>
          <div className="theme-switch" role="group" aria-label="Theme">
            <button
              type="button"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              type="button"
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
          </div>
        </div>
        <p>Configure MAX7219 modules and preview text, numbers, and icons</p>
      </header>

      <div className="main">
        <SettingsPanel
          moduleTypeId={moduleTypeId}
          onModuleTypeChange={setModuleTypeId}
          numModules={numModules}
          onNumModulesChange={(v) => setNumModules(Math.max(1, Math.min(64, Math.floor(Number(v)) || 1)))}
          arrangement={arrangement}
          onArrangementChange={setArrangement}
          colorId={colorId}
          onColorChange={setColorId}
          contentMode={contentMode}
          onContentModeChange={setContentMode}
          textContent={textContent}
          onTextContentChange={setTextContent}
          iconId={iconId}
          onIconChange={setIconId}
          canvasGrid={canvasGrid}
          onCanvasGridChange={setCanvasGrid}
          iconFitMode={iconFitMode}
          onIconFitModeChange={setIconFitMode}
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
          textFitMode={textFitMode}
          onTextFitModeChange={setTextFitMode}
          textFlowDirection={textFlowDirection}
          onTextFlowDirectionChange={setTextFlowDirection}
          blinkSpeedMs={blinkSpeedMs}
          onBlinkSpeedChange={setBlinkSpeedMs}
          scrollSpeedMs={scrollSpeedMs}
          onScrollSpeedChange={setScrollSpeedMs}
          smoothing={smoothing}
          onSmoothingChange={setSmoothing}
        />

        <section className="preview-section">
          <h2>Preview</h2>
          <LedGrid
            ref={gridRef}
            cols={cols}
            rows={rows}
            layoutCols={layoutCols}
            layoutRows={layoutRows}
            colorId={colorId}
            contentMode={contentMode}
            content={content}
            displayMode={displayMode}
            textFitMode={textFitMode}
            iconFitMode={iconFitMode}
            textFlowDirection={textFlowDirection}
            scrollOffset={scrollOffset}
            blinkingOn={blinkingOn}
            smoothing={smoothing}
          />
          <p className="preview-meta">
            {cols}×{rows} ({numModules} module{numModules !== 1 ? 's' : ''}) · {displayMode}
          </p>
          <div className="export-controls">
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-btn${pngBackground === 'dark' ? ' segmented-btn--active' : ''}`}
                onClick={() => setPngBackground('dark')}
              >
                Background
              </button>
              <button
                type="button"
                className={`segmented-btn${pngBackground === 'transparent' ? ' segmented-btn--active' : ''}`}
                onClick={() => setPngBackground('transparent')}
              >
                Transparent
              </button>
            </div>
            <button type="button" className="export-btn" onClick={handleExportPng}>
              Save as PNG
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
