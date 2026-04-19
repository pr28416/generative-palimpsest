"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface AiTextEntry {
  text: string;
  xPct: number;       // left edge of stroke bounding box (% of canvas)
  yPct: number;       // top edge
  widthPct: number;   // bounding box width (%)
  heightPct: number;  // bounding box height (%)
  maskPoints: { cx: number; cy: number }[];  // stroke circles in local (bbox-relative) coords
  brushRadius: number;
  boundsW: number;    // bbox pixel width, for SVG viewBox
  boundsH: number;
  zone: number;       // unique stroke ID
  colorIndex?: number;
}

interface UseScrapeOptions {
  pageIndex: number;
  visibleText: string;
  onAiText: (entry: AiTextEntry) => void;
  onAiStart?: (zone: number, xPct: number, yPct: number, widthPct: number, heightPct: number) => void;
  onAiEnd?: (zone: number) => void;
  enabled: boolean;
}

const BRUSH_RADIUS = 28;
// Minimum bounding-box dimension (px) to bother firing AI
const MIN_STROKE_PX = BRUSH_RADIUS * 1.5;
const PARCHMENT_VEIL = "rgba(210, 190, 150, 0.58)";

export function useScrape(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseScrapeOptions
) {
  const { pageIndex, visibleText, onAiText, onAiStart, onAiEnd, enabled } = options;

  const isPainting    = useRef(false);
  const strokePoints  = useRef<{ cx: number; cy: number }[]>([]);
  const eraseBounds   = useRef({ minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
  const strokeCounter = useRef(0);
  const [clearedCount, setClearedCount] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = PARCHMENT_VEIL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokePoints.current = [];
    eraseBounds.current  = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    setClearedCount(0);
  }, [canvasRef]);

  // Erase the veil, expand bounding box, record downsampled stroke points
  const erase = useCallback((canvas: HTMLCanvasElement, cx: number, cy: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Expand the stroke bounding box
    const b = eraseBounds.current;
    b.minX = Math.min(b.minX, cx - BRUSH_RADIUS);
    b.minY = Math.min(b.minY, cy - BRUSH_RADIUS);
    b.maxX = Math.max(b.maxX, cx + BRUSH_RADIUS);
    b.maxY = Math.max(b.maxY, cy + BRUSH_RADIUS);

    // Downsample: only record a point when far enough from the last one
    const pts  = strokePoints.current;
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(cx - last.cx, cy - last.cy) >= BRUSH_RADIUS / 2) {
      pts.push({ cx, cy });
    }
  }, []);

  // Called on pointerup — packages the stroke and fires the AI request
  const fireOnStrokeEnd = useCallback(
    (canvas: HTMLCanvasElement) => {
      const b   = eraseBounds.current;
      const pts = strokePoints.current;
      if (pts.length === 0) return;

      const rawW = b.maxX - b.minX;
      const rawH = b.maxY - b.minY;
      if (rawW < MIN_STROKE_PX && rawH < MIN_STROKE_PX) return;

      // Clamp bounding box to canvas bounds
      const minX    = Math.max(0, b.minX);
      const minY    = Math.max(0, b.minY);
      const maxX    = Math.min(canvas.width,  b.maxX);
      const maxY    = Math.min(canvas.height, b.maxY);
      const boundsW = maxX - minX;
      const boundsH = maxY - minY;

      const xPct      = (minX    / canvas.width)  * 100;
      const yPct      = (minY    / canvas.height) * 100;
      const widthPct  = (boundsW / canvas.width)  * 100;
      const heightPct = (boundsH / canvas.height) * 100;

      // Translate stroke points to bounding-box-local coordinates for the SVG mask
      const maskPoints = pts.map(p => ({ cx: p.cx - minX, cy: p.cy - minY }));

      // Reset immediately so the next stroke starts clean
      strokePoints.current = [];
      eraseBounds.current  = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
      setClearedCount(n => n + 1);

      const id = ++strokeCounter.current;
      onAiStart?.(id, xPct, yPct, widthPct, heightPct);

      fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageIndex, visibleText: visibleText.slice(0, 800), zone: id }),
      })
        .then(r => r.json())
        .then((data: { text?: string }) => {
          if (data.text) {
            onAiText({
              text: data.text,
              xPct, yPct, widthPct, heightPct,
              maskPoints,
              brushRadius: BRUSH_RADIUS,
              boundsW,
              boundsH,
              zone: id,
            });
          }
        })
        .catch(console.error)
        .finally(() => onAiEnd?.(id));
    },
    [pageIndex, visibleText, onAiText, onAiStart, onAiEnd]
  );

  const getCanvasCoords = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      isPainting.current   = true;
      strokePoints.current = [];
      eraseBounds.current  = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
      erase(canvas, x, y);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPainting.current) return;
      const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
      erase(canvas, x, y);
    };

    const onPointerUp = () => {
      if (!isPainting.current) return;
      isPainting.current = false;
      fireOnStrokeEnd(canvas);
    };

    canvas.addEventListener("pointerdown",  onPointerDown);
    canvas.addEventListener("pointermove",  onPointerMove);
    canvas.addEventListener("pointerup",    onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown",  onPointerDown);
      canvas.removeEventListener("pointermove",  onPointerMove);
      canvas.removeEventListener("pointerup",    onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [canvasRef, enabled, erase, fireOnStrokeEnd]);

  return { initCanvas, clearedCount };
}
