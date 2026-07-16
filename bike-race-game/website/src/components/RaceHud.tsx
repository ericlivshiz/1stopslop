"use client";

import { formatRaceTime } from "../game/format-time";
import type { RaceSnapshot } from "../game/race-state";

interface RaceHudProps {
  race: RaceSnapshot;
  bestTime: number | null;
  onRestart(): void;
}

export function RaceHud({ race, bestTime, onRestart }: RaceHudProps) {
  return (
    <div className="race-hud">
      <div className="hud-chip checkpoint-chip">
        <span>Gate</span>
        <strong>{race.checkpoint}/4</strong>
      </div>
      <div className="timer" aria-live="off">{formatRaceTime(race.elapsedMs)}</div>
      <button type="button" className="restart-button" onClick={onRestart}>Restart <kbd>R</kbd></button>

      {race.status === "ready" && (
        <div className="start-card">
          <span className="eyebrow">Canyon Run 01</span>
          <h2>Ride the ridge.</h2>
          <p>Use <kbd>A</kbd><kbd>D</kbd> to ride and <kbd>W</kbd><kbd>S</kbd> to rotate in the air.</p>
          <strong>Press any control to start</strong>
        </div>
      )}

      {race.status === "crashed" && <div className="crash-callout" role="status">Wipeout! Resetting…</div>}

      {race.status === "finished" && (
        <div className="finish-card" role="dialog" aria-label="Race complete">
          <span className="eyebrow">Course cleared</span>
          <h2>{formatRaceTime(race.elapsedMs)}</h2>
          <p>{bestTime === race.elapsedMs ? "New personal best" : `Best ${bestTime === null ? "—" : formatRaceTime(bestTime)}`}</p>
          <button type="button" onClick={onRestart}>Race again</button>
        </div>
      )}
    </div>
  );
}
