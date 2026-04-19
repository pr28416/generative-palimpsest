"use client";

import { useRef, useState, useLayoutEffect, useEffect, useCallback } from "react";
import { PageContent } from "@/lib/content";
import { useScrape, AiTextEntry } from "@/hooks/useScrape";

const AI_INK_PALETTE: { normal: string; uv: string }[] = [
  { normal: "#4a2c0a", uv: "#d4ac0d" },
  { normal: "#1a3a5c", uv: "#2e86c1" },
  { normal: "#2c4a1a", uv: "#27ae60" },
  { normal: "#4a1a3c", uv: "#8e44ad" },
  { normal: "#5c1a1a", uv: "#e74c3c" },
  { normal: "#1a4a4a", uv: "#17a589" },
];

/**
 * Build a CSS mask-image data URI from recorded stroke circles.
 *
 * CSS mask-image uses the ALPHA channel of the mask source:
 *   opaque pixel  → visible
 *   transparent   → invisible
 *
 * So we use a transparent SVG background (no black rect) with white
 * opaque circles at each brush point. Do NOT add a black background
 * rect — it is fully opaque and would make everything visible.
 */
function buildMaskUrl(entry: AiTextEntry): string {
  const w = Math.max(1, Math.round(entry.boundsW));
  const h = Math.max(1, Math.round(entry.boundsH));
  const r = entry.brushRadius;
  // Downsample to keep the data URI short
  const pts = entry.maskPoints.filter((_, i) => i % 2 === 0 || i === entry.maskPoints.length - 1);
  const circles = pts
    .map(p => `<circle cx="${Math.round(p.cx)}" cy="${Math.round(p.cy)}" r="${r}"/>`)
    .join("");
  // Explicit width/height + viewBox for reliable browser sizing
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g fill="white">${circles}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

interface LoadingZone {
  zone: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

interface PageProps {
  page: PageContent;
  isActive: boolean;
  uvMode: boolean;
}

export default function Page({ page, isActive, uvMode }: PageProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [aiLayers,     setAiLayers]     = useState<AiTextEntry[]>([]);
  const [loadingZones, setLoadingZones] = useState<LoadingZone[]>([]);

  const visibleText = page.layers.map((l) => l.text).join("\n\n");

  const handleAiText = useCallback((entry: AiTextEntry) => {
    setAiLayers((prev) => [...prev, { ...entry, colorIndex: prev.length }]);
  }, []);

  const handleAiStart = useCallback(
    (zone: number, xPct: number, yPct: number, widthPct: number, heightPct: number) => {
      setLoadingZones((prev) => [...prev, { zone, xPct, yPct, widthPct, heightPct }]);
    },
    []
  );

  const handleAiEnd = useCallback((zone: number) => {
    setLoadingZones((prev) => prev.filter((z) => z.zone !== zone));
  }, []);

  const { initCanvas, clearedCount } = useScrape(canvasRef, {
    pageIndex: page.id,
    visibleText,
    onAiText:  handleAiText,
    onAiStart: handleAiStart,
    onAiEnd:   handleAiEnd,
    enabled:   isActive && !uvMode,
  });

  const wearClass =
    clearedCount >= 8 ? " worn-heavy"
    : clearedCount >= 3 ? " worn-light"
    : "";

  useLayoutEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width  = Math.round(width);
    canvas.height = Math.round(height);
    initCanvas();
  }, [page.id, initCanvas]);

  useEffect(() => {
    setAiLayers([]);
    setLoadingZones([]);
  }, [page.id]);

  return (
    <div ref={containerRef} className={`page-surface${wearClass}`} data-page-id={page.id}>

      {/* ── Text Layers ─────────────────────── */}
      <div className="text-layer layer-0" aria-hidden="true">
        {page.layers[0].text.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </div>

      <div className="text-layer layer-1" aria-hidden="true">
        {page.layers[1].text.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </div>

      <div className="text-layer layer-2">
        {page.layers[2].text.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </div>

      {/* ── AI Generated Layers ──────────────── */}
      {aiLayers.map((entry, i) => {
        const ink = AI_INK_PALETTE[(entry.colorIndex ?? i) % AI_INK_PALETTE.length];
        // In UV mode skip the mask so the full text extent is revealed (like
        // multispectral imaging showing everything). In normal mode, only the
        // stroke-shaped area is visible.
        const maskUrl = uvMode ? undefined : buildMaskUrl(entry);
        return (
          <div
            key={`ai-${entry.zone}`}
            className="ai-layer"
            style={{
              left:     `${entry.xPct}%`,
              top:      `${entry.yPct}%`,
              width:    `${entry.widthPct}%`,
              height:   `${entry.heightPct}%`,
              overflow: "hidden",
              // Mask properties — alpha channel: opaque=visible, transparent=invisible
              maskImage:        maskUrl,
              WebkitMaskImage:  maskUrl,
              maskSize:         maskUrl ? "100% 100%" : undefined,
              WebkitMaskSize:   maskUrl ? "100% 100%" : undefined,
              maskRepeat:       maskUrl ? "no-repeat"  : undefined,
              WebkitMaskRepeat: maskUrl ? "no-repeat"  : undefined,
              maskMode:         maskUrl ? "alpha"       : undefined,
              ["--ai-normal" as string]: ink.normal,
              ["--ai-uv"     as string]: ink.uv,
            }}
            aria-label="Generative scribe fragment"
          >
            {entry.text}
          </div>
        );
      })}

      {/* ── Loading Indicators ─────────────── */}
      {loadingZones.map(({ zone, xPct, yPct, widthPct, heightPct }) => (
        <div
          key={`loading-${zone}`}
          className="ai-loading-pulse"
          style={{
            left:   `${xPct}%`,
            top:    `${yPct}%`,
            width:  `${widthPct}%`,
            height: `${heightPct}%`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Scrape Canvas ────────────────────── */}
      <canvas ref={canvasRef} className="scrape-canvas" aria-hidden="true" />

      {/* ── Page Chrome ──────────────────────── */}
      <div className="page-chrome">
        <span className="running-title">{page.runningTitle}</span>
        <span className="chapter-heading">{page.chapterHeading}</span>
        <span className="folio-number">{page.folioLabel}</span>
        {page.signature && <span className="page-signature">{page.signature}</span>}
        {page.catchword && <span className="page-catchword">{page.catchword}</span>}
        <div className="marginalia">{page.marginalia}</div>
        <div className="footnote-strip">
          {page.layers.map((layer, i) => (
            <div key={i}><sup>{i + 1}</sup> {layer.source}</div>
          ))}
        </div>
      </div>

      {isActive && !uvMode && aiLayers.length === 0 && loadingZones.length === 0 && (
        <p className="scrape-hint">scrape to reveal what lies beneath</p>
      )}
    </div>
  );
}
