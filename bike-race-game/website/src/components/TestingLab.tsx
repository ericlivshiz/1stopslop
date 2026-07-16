"use client";

import { useState } from "react";
import { DEFAULT_DRIVE_TUNING, type DriveTuning } from "../game/bike-motion";
import { RaceGame } from "./RaceGame";

const controls: Array<{ key: keyof DriveTuning; label: string; min: number; max: number; step: number; help: string }> = [
  { key: "accelerationForce", label: "Acceleration force", min: 0.001, max: 0.014, step: 0.0005, help: "How much power A/D requests. Higher values reach speed faster, but traction still limits what reaches the ground." },
  { key: "maxGroundSpeed", label: "Maximum ground speed", min: 5, max: 30, step: 0.5, help: "The bike's target top speed. Power fades smoothly near this speed instead of abruptly cutting out." },
  { key: "tractionLimit", label: "Traction limit", min: 0.001, max: 0.012, step: 0.0005, help: "The most drive force the rear tire may transfer per frame. Raise it for harder launches and hills; lower it for gentler grip." },
  { key: "throttleRampSeconds", label: "Throttle ramp", min: 0, max: 1.2, step: 0.02, help: "Seconds required for a held A/D input to reach full power. Lower feels immediate; higher feels smoother and softer." },
  { key: "rotationImpulse", label: "W/S rotation strength", min: 0.001, max: 0.018, step: 0.0005, help: "How strongly W/S rotates the bike each frame while airborne or balancing on a slope." },
  { key: "maxRotationSpeed", label: "Maximum rotation speed", min: 0.02, max: 0.2, step: 0.005, help: "Caps W/S rotation so a long hold stays controllable instead of causing an instant flip." },
];

export function TestingLab() {
  const [tuning, setTuning] = useState<DriveTuning>({ ...DEFAULT_DRIVE_TUNING });

  return (
    <div className="testing-layout">
      <aside className="tuning-panel">
        <div className="tuning-heading">
          <div><span>Live drivetrain lab</span><h1>Bike tuning</h1></div>
          <button type="button" onClick={() => setTuning({ ...DEFAULT_DRIVE_TUNING })}>Reset defaults</button>
        </div>
        <p className="tuning-intro">Changes apply immediately. Hold <kbd>A</kbd>/<kbd>D</kbd> to compare acceleration and grip; use <kbd>R</kbd> to restart the course.</p>
        <div className="tuning-controls">
          {controls.map((control) => (
            <label className="tuning-control" key={control.key}>
              <span><strong>{control.label}</strong><output>{tuning[control.key].toFixed(control.step < 0.01 ? 4 : 2)}</output></span>
              <input aria-label={control.label} type="range" min={control.min} max={control.max} step={control.step} value={tuning[control.key]} onChange={(event) => setTuning((current) => ({ ...current, [control.key]: Number(event.target.value) }))} />
              <small>{control.help}</small>
            </label>
          ))}
        </div>
      </aside>
      <div className="testing-game"><RaceGame tuning={tuning} /></div>
    </div>
  );
}
