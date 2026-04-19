/* ============================================================
   DINO ENHANCED - index.css
   Chrome Dino faithful recreation with enhanced UI
   ============================================================ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100%;
  background: #f7f7f7;
  font-family: 'Courier New', Courier, monospace;
  color: #535353;
}

/* ── LAYOUT ─────────────────────────────────────── */
.game-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── HEADER ─────────────────────────────────────── */
.game-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.game-header .title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #535353;
}

.game-header .subtitle {
  font-size: 11px;
  color: #aaa;
  letter-spacing: 1px;
}

/* ── CANVAS CONTAINER ───────────────────────────── */
.canvas-container {
  position: relative;
  background: #f7f7f7;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

#gameCanvas {
  display: block;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* ── CONTROLS BAR ───────────────────────────────── */
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 11px;
  color: #999;
  border-top: 1px solid #e8e8e8;
  padding-top: 8px;
}

.controls-bar span::before {
  content: '▸ ';
  color: #ccc;
}

/* ── MILESTONE PANEL ────────────────────────────── */
.milestone-panel,
.pickups-panel {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px 20px;
}

.milestone-panel h3,
.pickups-panel h3 {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #535353;
  margin-bottom: 14px;
  text-transform: uppercase;
}

.milestones {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.milestone .m-icon {
  font-size: 24px;
  min-width: 34px;
  text-align: center;
  line-height: 1;
}

.milestone strong {
  font-size: 12px;
  font-weight: 700;
  color: #535353;
  display: block;
  margin-bottom: 2px;
}

.milestone p {
  font-size: 11px;
  color: #888;
  line-height: 1.4;
}

/* ── PICKUPS PANEL ──────────────────────────────── */
.pickup-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.pickup-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pickup-item > span {
  font-size: 28px;
}

.pickup-item strong {
  font-size: 12px;
  font-weight: 700;
  display: block;
  margin-bottom: 2px;
}

.pickup-item p {
  font-size: 11px;
  color: #888;
}

/* ── DARK MODE (night in-game is handled by canvas)
   but we can style the page dark too if user prefers) ── */
@media (prefers-color-scheme: dark) {
  html, body {
    background: #1a1a1a;
    color: #e0e0e0;
  }

  .canvas-container {
    border-color: #333;
    background: #111;
  }

  .milestone-panel,
  .pickups-panel {
    background: #1e1e1e;
    border-color: #333;
  }

  .milestone-panel h3,
  .pickups-panel h3,
  .game-header .title {
    color: #e0e0e0;
  }

  .milestone strong,
  .pickup-item strong {
    color: #e0e0e0;
  }

  .controls-bar {
    border-color: #333;
  }
}

/* ── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 600px) {
  .game-wrapper {
    padding: 12px 10px 30px;
    gap: 12px;
  }

  .game-header .title {
    font-size: 16px;
  }

  .controls-bar {
    font-size: 10px;
    gap: 4px 12px;
  }

  .pickup-items {
    flex-direction: column;
    gap: 12px;
  }
}

/* ── ACCESSIBILITY: reduce motion ───────────────── */
@media (prefers-reduced-motion: reduce) {
  #gameCanvas {
    image-rendering: auto;
  }
}
