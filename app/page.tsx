"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import BookSpread, { type Spread } from "@/components/BookSpread";

// ── Spread definitions ────────────────────────────────────
// left: page index (null = endpaper), right: page index (0 = title)
const SPREADS: Spread[] = [
  { left: null, right: 0 },   // Spread 0 — endpaper + title
  { left: 1,    right: 2 },   // Spread 1 — Memory | Erasure
  { left: 3,    right: 4 },   // Spread 2 — Archimedes | Preservation
  { left: 5,    right: 6 },   // Spread 3 — Loss | Generative Scribe
];

const TOTAL_SPREADS = SPREADS.length;

export default function BookContainer() {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [incomingSpread, setIncomingSpread] = useState<number | null>(null);
  const [uvMode, setUvMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("palimpsest-intro-seen")) {
      setShowIntro(true);
    }
  }, []);

  const dismissIntro = () => {
    localStorage.setItem("palimpsest-intro-seen", "1");
    setShowIntro(false);
  };

  // currentRef  — z-index 2, always on top, clips away
  // incomingRef — z-index 1, always behind, revealed underneath
  const currentRef  = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const foldShadowRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (target: number) => {
      if (
        isAnimating ||
        target === currentSpread ||
        target < 0 ||
        target >= TOTAL_SPREADS
      )
        return;

      const direction = target > currentSpread ? 1 : -1;
      setIsAnimating(true);
      setIncomingSpread(target);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Animate the .book-spread inside the current wrapper
          const outgoing = currentRef.current?.querySelector<HTMLElement>(".book-spread");
          const shadow   = foldShadowRef.current;

          if (!outgoing) {
            setIsAnimating(false);
            return;
          }

          // Forward: right side disappears first → inset clips from right
          // Backward: left side disappears first → inset clips from left
          const clipFull = "inset(0 0% 0 0%)";
          const clipGone = direction > 0
            ? "inset(0 100% 0 0%)"
            : "inset(0 0% 0 100%)";

          gsap.set(outgoing, { clipPath: clipFull });

          if (shadow) {
            const rect   = outgoing.getBoundingClientRect();
            const startX = direction > 0 ? rect.right - 24 : rect.left;
            const endX   = direction > 0 ? rect.left        : rect.right - 24;
            gsap.set(shadow, {
              display: "block",
              left:    startX,
              top:     rect.top,
              height:  rect.height,
              background: direction > 0
                ? "linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 100%)"
                : "linear-gradient(to left,  rgba(0,0,0,0.22) 0%, transparent 100%)",
            });
            gsap.to(shadow, {
              left:     endX,
              duration: 0.55,
              ease:     "power2.inOut",
              onComplete: () => gsap.set(shadow, { display: "none" }),
            });
          }

          gsap.to(outgoing, {
            clipPath: clipGone,
            duration: 0.55,
            ease:     "power2.inOut",
            onComplete: () => {
              gsap.set(outgoing, { clearProps: "clipPath" });
              setCurrentSpread(target);
              setIncomingSpread(null);
              setIsAnimating(false);
            },
          });
        });
      });
    },
    [currentSpread, isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(currentSpread + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   navigate(currentSpread - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSpread, navigate]);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) navigate(currentSpread + (dx < 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [currentSpread, navigate]);

  return (
    <div className={`book-shell${uvMode ? " uv-mode" : ""}`}>

      {/* Incoming spread — z-index 1, behind, revealed as current clips away */}
      <div
        ref={incomingRef}
        className="page-wrapper"
        style={{ zIndex: 1 }}
      >
        {incomingSpread !== null && (
          <BookSpread
            spread={SPREADS[incomingSpread]}
            isActive={false}
            uvMode={uvMode}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* Current spread — z-index 2, on top, clips away during transition */}
      <div
        ref={currentRef}
        className="page-wrapper"
        style={{ zIndex: 2 }}
      >
        <BookSpread
          spread={SPREADS[currentSpread]}
          isActive={!isAnimating}
          uvMode={uvMode}
          onNavigate={navigate}
        />
      </div>

      {/* Fold shadow strip */}
      <div
        ref={foldShadowRef}
        style={{
          display:       "none",
          position:      "fixed",
          width:         24,
          pointerEvents: "none",
          zIndex:        200,
        }}
        aria-hidden="true"
      />

      <button
        className="nav-btn nav-prev"
        onClick={() => navigate(currentSpread - 1)}
        disabled={currentSpread === 0 || isAnimating}
        aria-label="Previous spread"
      >‹</button>
      <button
        className="nav-btn nav-next"
        onClick={() => navigate(currentSpread + 1)}
        disabled={currentSpread === TOTAL_SPREADS - 1 || isAnimating}
        aria-label="Next spread"
      >›</button>

      <div className="page-dots" aria-hidden="true">
        {SPREADS.map((_, i) => (
          <button
            key={i}
            className={`page-dot${i === currentSpread ? " active" : ""}`}
            onClick={() => navigate(i)}
            aria-label={`Go to spread ${i + 1}`}
          />
        ))}
      </div>

      <button
        className="uv-btn"
        onClick={() => setUvMode((v) => !v)}
        aria-pressed={uvMode}
      >
        {uvMode ? "◉ UV light on" : "◎ UV light"}
      </button>

      {/* ── First-load instruction overlay ── */}
      {showIntro && (
        <div className="intro-overlay" onClick={dismissIntro}>
          <div className="intro-card" onClick={(e) => e.stopPropagation()}>
            <p className="intro-eyebrow">Generative Palimpsest</p>
            <h2 className="intro-title">A book written over itself</h2>
            <div className="intro-rule" />
            <ul className="intro-steps">
              <li>
                <span className="intro-icon">⊖</span>
                Drag across the page to scrape away the surface
              </li>
              <li>
                <span className="intro-icon">◌</span>
                As you clear a zone, new text surfaces from the layers below
              </li>
              <li>
                <span className="intro-icon">◎</span>
                Toggle UV light to illuminate all layers at once
              </li>
              <li>
                <span className="intro-icon">›</span>
                Turn pages with the arrows, arrow keys, or swipe
              </li>
            </ul>
            <button className="intro-btn" onClick={dismissIntro}>
              Begin Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
