"use client";

import { useRef, useState, useLayoutEffect, useEffect, useCallback } from "react";
import { PageContent } from "@/lib/content";
import { useScrape, AiTextEntry } from "@/hooks/useScrape";

// Each AI fragment gets its own ink; cycles through this palette.
// --ai-normal is used in regular mode, --ai-uv in UV light mode.
const AI_INK_PALETTE: { normal: string; uv: string }[] = [
  { normal: "#4a2c0a", uv: "#d4ac0d" },  // amber
  { normal: "#1a3a5c", uv: "#2e86c1" },  // deep blue
  { normal: "#2c4a1a", uv: "#27ae60" },  // forest green
  { normal: "#4a1a3c", uv: "#8e44ad" },  // deep purple
  { normal: "#5c1a1a", uv: "#e74c3c" },  // brick red
  { normal: "#1a4a4a", uv: "#17a589" },  // deep teal
];

interface LoadingZone {
  zone: number;
  xPct: number;
  yPct: number;
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

  const handleAiStart = useCallback((zone: number, xPct: number, yPct: number) => {
    setLoadingZones((prev) => [...prev, { zone, xPct, yPct }]);
  }, []);

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

  // progressive wear class based on how many zones have been scraped (max 64)
  const wearClass =
    clearedCount >= 12 ? " worn-heavy"
    : clearedCount >= 4 ? " worn-light"
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
        return (
          <div
            key={`ai-${entry.zone}-${i}`}
            className="ai-layer"
            style={{
              left: `${entry.xPct}%`,
              top:  `${entry.yPct}%`,
              // CSS vars picked up by .ai-layer and .uv-mode .ai-layer rules
              ["--ai-normal" as string]: ink.normal,
              ["--ai-uv"     as string]: ink.uv,
            }}
            aria-label="Generative scribe fragment"
          >
            {entry.text}
          </div>
        );
      })}

      {/* ── Loading Zone Pulses ───────────────── */}
      {loadingZones.map(({ zone, xPct, yPct }) => (
        <div
          key={`loading-${zone}`}
          className="ai-loading-pulse"
          style={{ left: `${xPct}%`, top: `${yPct}%` }}
          aria-hidden="true"
        />
      ))}

      {/* ── Scrape Canvas ────────────────────── */}
      <canvas
        ref={canvasRef}
        className="scrape-canvas"
        aria-hidden="true"
      />

      {/* ── Page Chrome ──────────────────────── */}
      <div className="page-chrome">
        <span className="running-title">{page.runningTitle}</span>
        <span className="chapter-heading">{page.chapterHeading}</span>
        <span className="folio-number">{page.folioLabel}</span>
        {page.signature && (
          <span className="page-signature">{page.signature}</span>
        )}
        {page.catchword && (
          <span className="page-catchword">{page.catchword}</span>
        )}
        <div className="marginalia">{page.marginalia}</div>
        <div className="footnote-strip">
          {page.layers.map((layer, i) => (
            <div key={i}>
              <sup>{i + 1}</sup> {layer.source}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scrape hint ──────────────────────── */}
      {isActive && !uvMode && aiLayers.length === 0 && loadingZones.length === 0 && (
        <p className="scrape-hint">scrape to reveal what lies beneath</p>
      )}
    </div>
  );
}
