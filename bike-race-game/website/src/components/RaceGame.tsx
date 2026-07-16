"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readBestTime, saveBestTime } from "../game/best-time";
import { gameEvents } from "../game/events";
import { clearControls, createControlState, keyToAction, setControlAction, type ControlAction, type ControlState } from "../game/input";
import { createRaceState, type RaceSnapshot } from "../game/race-state";
import { GameCanvas } from "./GameCanvas";
import { RaceHud } from "./RaceHud";
import { TouchControls } from "./TouchControls";
import { DEFAULT_DRIVE_TUNING, type DriveTuning } from "../game/bike-motion";

export function RaceGame({ tuning = DEFAULT_DRIVE_TUNING }: { tuning?: DriveTuning }) {
  const [race, setRace] = useState<RaceSnapshot>(createRaceState);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const controlsRef = useRef<ControlState>(createControlState());

  useEffect(() => {
    gameEvents.setDriveTuning(tuning);
  }, [tuning]);

  const updateControl = useCallback((action: ControlAction, pressed: boolean) => {
    controlsRef.current = setControlAction(controlsRef.current, action, pressed);
    gameEvents.setControls(controlsRef.current);
  }, []);

  const resetControls = useCallback(() => {
    controlsRef.current = clearControls(controlsRef.current);
    gameEvents.setControls(controlsRef.current);
  }, []);

  const restart = useCallback(() => {
    resetControls();
    gameEvents.restart();
  }, [resetControls]);

  useEffect(() => {
    queueMicrotask(() => setBestTime(readBestTime(window.localStorage)));
    return gameEvents.onSnapshot((snapshot) => {
      setRace(snapshot);
      if (snapshot.status === "finished") {
        setBestTime(saveBestTime(window.localStorage, snapshot.elapsedMs));
      }
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent, pressed: boolean) => {
      if (event.key.toLowerCase() === "r" && pressed) {
        event.preventDefault();
        restart();
        return;
      }
      const action = keyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      updateControl(action, pressed);
    };
    const onKeyDown = (event: KeyboardEvent) => onKey(event, true);
    const onKeyUp = (event: KeyboardEvent) => onKey(event, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", resetControls);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", resetControls);
      resetControls();
    };
  }, [resetControls, restart, updateControl]);

  return (
    <section className="game-frame" aria-label="Sunset Ridge bike race">
      <GameCanvas />
      <RaceHud race={race} bestTime={bestTime} onRestart={restart} />
      <TouchControls onControl={updateControl} />
    </section>
  );
}
