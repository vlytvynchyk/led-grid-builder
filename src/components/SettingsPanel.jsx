import { MODULE_TYPES, MODULE_COLORS, ARRANGEMENTS } from '../config/modules'
import { ICONS } from '../config/icons'
import { IconPreview } from './IconPreview'
import { CanvasEditor } from './CanvasEditor'
import { ModuleTypePreview } from './ModuleTypePreview'

const DISPLAY_MODES = [
  { id: 'static', name: 'Static' },
  { id: 'blink', name: 'Blinking' },
  { id: 'scroll', name: 'Floating / Scroll' },
]

const TEXT_FLOW_DIRECTIONS = [
  { id: 'left', name: '← Left (default)' },
  { id: 'right', name: 'Right →' },
  { id: 'up', name: '↑ Up' },
  { id: 'down', name: 'Down ↓' },
]

export const TEXT_FIT_MODES = [
  { id: 'native', name: 'Native', hint: '5×7 size, centered, clip if needed' },
  { id: 'fill', name: 'Fill', hint: 'Stretch to fill entire grid' },
  { id: 'uniform', name: 'Uniform', hint: 'Scale to fit, keep aspect ratio' },
  { id: 'fitWidth', name: 'Fit width', hint: 'Scale to fit width, center height' },
  { id: 'fitHeight', name: 'Fit height', hint: 'Scale to fit height, center width' },
]

const CONTENT_MODES = [
  { id: 'text', name: 'Text' },
  { id: 'icon', name: 'Icon' },
  { id: 'canvas', name: 'Canvas' },
]

const BLINK_MS_MIN = 100
const BLINK_MS_MAX = 2000
const SCROLL_MS_MIN = 20
const SCROLL_MS_MAX = 300

export function SettingsPanel({
  moduleTypeId,
  onModuleTypeChange,
  numModules,
  onNumModulesChange,
  arrangement,
  onArrangementChange,
  colorId,
  onColorChange,
  contentMode,
  onContentModeChange,
  textContent,
  onTextContentChange,
  iconId,
  onIconChange,
  canvasGrid,
  onCanvasGridChange,
  iconFitMode,
  onIconFitModeChange,
  displayMode,
  onDisplayModeChange,
  textFitMode,
  onTextFitModeChange,
  textFlowDirection,
  onTextFlowDirectionChange,
  blinkSpeedMs,
  onBlinkSpeedChange,
  scrollSpeedMs,
  onScrollSpeedChange,
  smoothing,
  onSmoothingChange,
}) {
  const clampBlink = (v) => Math.max(BLINK_MS_MIN, Math.min(BLINK_MS_MAX, Math.floor(Number(v)) || BLINK_MS_MIN))
  const clampScroll = (v) => Math.max(SCROLL_MS_MIN, Math.min(SCROLL_MS_MAX, Math.floor(Number(v)) || SCROLL_MS_MIN))
  return (
    <aside className="settings-panel">
      <details className="settings-collapsible" open>
        <summary className="settings-section-title">Grid setup</summary>
        <div className="settings-section-block">
        <label className="field">
          <span>Module type</span>
          <select
            value={moduleTypeId}
            onChange={(e) => onModuleTypeChange(e.target.value)}
          >
            {Object.values(MODULE_TYPES).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.description}
              </option>
            ))}
          </select>
          <div className="module-type-preview-wrap">
            <ModuleTypePreview
              cols={MODULE_TYPES[moduleTypeId]?.perModuleCols ?? 8}
              rows={MODULE_TYPES[moduleTypeId]?.perModuleRows ?? 8}
            />
            <span className="field-hint">
              {MODULE_TYPES[moduleTypeId]?.perModuleCols ?? 8}×{MODULE_TYPES[moduleTypeId]?.perModuleRows ?? 8} per module
            </span>
          </div>
        </label>

        <label className="field">
          <span>Number of modules</span>
          <input
            type="number"
            min={1}
            max={64}
            value={numModules}
            onChange={(e) => onNumModulesChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Arrangement</span>
          <select
            value={arrangement}
            onChange={(e) => onArrangementChange(e.target.value)}
          >
            {ARRANGEMENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <div className="field">
          <span>Color</span>
          <div className="color-swatches">
            {Object.values(MODULE_COLORS).map((c) => (
              <button
                key={c.id}
                type="button"
                className={`color-swatch ${colorId === c.id ? 'color-swatch--selected' : ''}`}
                style={{ '--swatch-color': c.css }}
                onClick={() => onColorChange(c.id)}
                title={c.name}
                aria-label={c.name}
                aria-pressed={colorId === c.id}
              />
            ))}
          </div>
        </div>
        </div>
      </details>

      <details className="settings-collapsible" open>
        <summary className="settings-section-title">Content</summary>
        <div className="settings-section-block">
        <div className="field">
          <span>Content type</span>
          <div className="segmented-control">
            {CONTENT_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`segmented-btn ${contentMode === mode.id ? 'segmented-btn--active' : ''}`}
                onClick={() => onContentModeChange(mode.id)}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {contentMode === 'text' && (
          <>
            <label className="field">
              <span>Text to display</span>
              <input
                type="text"
                value={textContent}
                onChange={(e) => onTextContentChange(e.target.value)}
                placeholder="Hello 123"
                maxLength={32}
              />
            </label>
            <label className="field">
              <span>Text fit</span>
              <select
                value={textFitMode}
                onChange={(e) => onTextFitModeChange(e.target.value)}
              >
                {TEXT_FIT_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <span className="field-hint">
                {TEXT_FIT_MODES.find((m) => m.id === textFitMode)?.hint}
              </span>
            </label>
          </>
        )}

        {contentMode === 'icon' && (
          <>
            <div className="field">
              <span>Icon</span>
              <div className="icon-picker">
                {Object.values(ICONS).map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    className={`icon-picker-item ${iconId === icon.id ? 'icon-picker-item--selected' : ''}`}
                    onClick={() => onIconChange(icon.id)}
                    title={icon.name}
                  >
                    <IconPreview grid={icon.grid} size={36} />
                    <span className="icon-picker-label">{icon.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="field">
              <span>Icon fit</span>
              <select
                value={iconFitMode}
                onChange={(e) => onIconFitModeChange(e.target.value)}
              >
                {TEXT_FIT_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <span className="field-hint">
                {TEXT_FIT_MODES.find((m) => m.id === iconFitMode)?.hint}
              </span>
            </label>
          </>
        )}

        {contentMode === 'canvas' && (
          <>
            <div className="field">
              <span>Draw your icon</span>
              <span className="field-hint">Click cells to toggle on/off (8×8)</span>
              <CanvasEditor
                grid={canvasGrid}
                onChange={onCanvasGridChange}
                colorId={colorId}
              />
            </div>
            <label className="field">
              <span>Canvas fit</span>
              <select
                value={iconFitMode}
                onChange={(e) => onIconFitModeChange(e.target.value)}
              >
                {TEXT_FIT_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <span className="field-hint">
                {TEXT_FIT_MODES.find((m) => m.id === iconFitMode)?.hint}
              </span>
            </label>
          </>
        )}
        </div>
      </details>

      <details className="settings-collapsible" open>
        <summary className="settings-section-title">Display</summary>
        <div className="settings-section-block">
        <label className="field">
          <span>Mode</span>
          <select
            value={displayMode}
            onChange={(e) => onDisplayModeChange(e.target.value)}
          >
            {DISPLAY_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-toggle">
          <span>Smoothing</span>
          <button
            type="button"
            role="switch"
            aria-checked={smoothing}
            className={`toggle-switch ${smoothing ? 'toggle-switch--on' : ''}`}
            onClick={() => onSmoothingChange(!smoothing)}
          >
            <span className="toggle-switch-thumb" />
          </button>
          <span className="field-hint">Fill diagonal staircase gaps on scaled content</span>
        </label>

        {displayMode === 'blink' && (
          <div className="field">
            <span>Blink speed ({blinkSpeedMs}ms)</span>
            <input
              type="range"
              className="range-slider"
              min={BLINK_MS_MIN}
              max={BLINK_MS_MAX}
              step={50}
              value={blinkSpeedMs}
              onChange={(e) => onBlinkSpeedChange(clampBlink(e.target.value))}
            />
            <span className="field-hint">Interval between toggles; lower = faster</span>
          </div>
        )}

        {displayMode === 'scroll' && (
          <>
            <label className="field">
              <span>Text flow direction</span>
              <select
                value={textFlowDirection}
                onChange={(e) => onTextFlowDirectionChange(e.target.value)}
              >
                {TEXT_FLOW_DIRECTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="field">
              <span>Scroll speed ({scrollSpeedMs}ms)</span>
              <input
                type="range"
                className="range-slider"
                min={SCROLL_MS_MIN}
                max={SCROLL_MS_MAX}
                step={10}
                value={scrollSpeedMs}
                onChange={(e) => onScrollSpeedChange(clampScroll(e.target.value))}
              />
              <span className="field-hint">Step interval; lower = faster scroll</span>
            </div>
          </>
        )}
        </div>
      </details>
    </aside>
  )
}
