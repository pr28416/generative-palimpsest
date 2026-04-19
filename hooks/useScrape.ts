"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface AiTextEntry {
  text: string;
  xPct: number;
  yPct: number;
  zone: number;
  colorIndex?: number;
}

interface UseScrapeOptions {
  pageIndex: number;
  visibleText: string;
  onAiText: (entry: AiTextEntry) => void;
  onAiStart?: (zone: number, xPct: number, yPct: number) => void;
  onAiEnd?: (zone: number) => void;
  enabled: boolean;
}

const GRID_COLS = 8;
const GRID_ROWS = 8;
const BRUSH_RADIUS = 28;
const ZONE_TRIGGER_THRESHOLD = 0.6;
const PARCHMENT_VEIL = "rgba(210, 190, 150, 0.58)";

export function useScrape(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseScrapeOptions
) {
  const { pageIndex, visibleText, onAiText, onAiStart, onAiEnd, enabled } = options;

  const triggeredZones = useRef<Set<number>>(new Set());
  const isPainting = useRef(false);
  const pendingAi = useRef(false);
  const [clearedCount, setClearedCount] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = PARCHMENT_VEIL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    triggeredZones.current = new Set();
    setClearedCount(0);
  }, [canvasRef]);

  const measureZoneCleared = useCallback(
    (canvas: HTMLCanvasElement, col: number, row: number): number => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return 0;
      const cellW = canvas.width / GRID_COLS;
      const cellH = canvas.height / GRID_ROWS;
      const x0 = Math.floor(col * cellW);
      const y0 = Math.floor(row * cellH);
      const w = Math.max(1, Math.ceil(cellW));
      const h = Math.max(1, Math.ceil(cellH));
      const imageData = ctx.getImageData(x0, y0, w, h);
      const data = imageData.data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 20) transparent++;
      }
      return transparent / (data.length / 4);
    },
    []
  );

  const fireAiIfThreshold = useCallback(
    (canvas: HTMLCanvasElement, col: number, row: number) => {
      const zoneKey = row * GRID_COLS + col;
      if (triggeredZones.current.has(zoneKey)) return;
      if (pendingAi.current) return;

      const fraction = measureZoneCleared(canvas, col, row);
      if (fraction < ZONE_TRIGGER_THRESHOLD) return;

      triggeredZones.current.add(zoneKey);
      pendingAi.current = true;
      setClearedCount((n) => n + 1);

      const cellW = canvas.width / GRID_COLS;
      const cellH = canvas.height / GRID_ROWS;
      const xPct = ((col + 0.1) * cellW / canvas.width) * 100;
      const yPct = ((row + 0.15) * cellH / canvas.height) * 100;

      onAiStart?.(zoneKey, xPct, yPct);

      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageIndex, visibleText: visibleText.slice(0, 800), zone: zoneKey }),
      })
        .then((r) => r.json())
        .then((data: { text?: string }) => {
          if (data.text) {
            onAiText({ text: data.text, xPct, yPct, zone: zoneKey });
          }
        })
        .catch(console.error)
        .finally(() => {
          pendingAi.current = false;
          onAiEnd?.(zoneKey);
        });
    },
    [pageIndex, visibleText, onAiText, onAiStart, onAiEnd, measureZoneCleared]
  );

  const erase = useCallback(
    (canvas: HTMLCanvasElement, cx: number, cy: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const cellW = canvas.width / GRID_COLS;
      const cellH = canvas.height / GRID_ROWS;
      const col = Math.floor(cx / cellW);
      const row = Math.floor(cy / cellH);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const c = col + dc;
          const r = row + dr;
          if (c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS) {
            fireAiIfThreshold(canvas, c, r);
          }
        }
      }
    },
    [fireAiIfThreshold]
  );

  const getCanvasCoords = (
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      isPainting.current = true;
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
      isPainting.current = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [canvasRef, enabled, erase]);

  return { initCanvas, clearedCount };
}
