import { useEffect, useRef } from "react";

const IS_FINE_POINTER =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: fine)").matches;

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CursorFX() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const trailRefs = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!IS_FINE_POINTER) return;

    const cursorEl = cursorRef.current;
    const dotEl = dotRef.current;
    const trails = trailRefs.current;
    if (!cursorEl || !dotEl) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    // Initialize trail positions
    const trailPoints = Array.from({ length: trails.length }, () => ({ x, y }));

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      // Slight lag for main ring (CRT-ish “drag”)
      tx += (x - tx) * 0.18;
      ty += (y - ty) * 0.18;
      cursorEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

      // Matrix-ish trail: shift points down the chain
      if (!PREFERS_REDUCED_MOTION) {
        for (let i = 0; i < trailPoints.length; i++) {
          const prev = i === 0 ? { x: tx, y: ty } : trailPoints[i - 1];
          trailPoints[i].x += (prev.x - trailPoints[i].x) * 0.22;
          trailPoints[i].y += (prev.y - trailPoints[i].y) * 0.22;
          const el = trails[i];
          if (el) el.style.transform = `translate3d(${trailPoints[i].x}px, ${trailPoints[i].y}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!IS_FINE_POINTER) return null;

  return (
    <div className="cursor-fx" aria-hidden="true">
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      {!PREFERS_REDUCED_MOTION && (
        <div className="cursor-trail">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
              className="cursor-trail-dot"
              style={{ opacity: Math.max(0.08, 0.6 - i * 0.05) }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


