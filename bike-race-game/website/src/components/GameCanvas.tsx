"use client";

import { useEffect, useRef } from "react";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    let disposed = false;
    let game: { destroy(removeCanvas?: boolean): void; scale: { resize(width: number, height: number): void } } | null = null;

    void import("../game/create-game").then(({ createBikeRaceGame }) => {
      if (disposed) return;
      game = createBikeRaceGame(parent);
    });

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (width && height) game?.scale.resize(width, height);
    });
    observer.observe(parent);

    return () => {
      disposed = true;
      observer.disconnect();
      game?.destroy(true);
      game = null;
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" aria-label="Bike race game canvas" />;
}
