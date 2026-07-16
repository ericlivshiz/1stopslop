"use client";

import type { PointerEvent } from "react";
import type { ControlAction } from "../game/input";

interface TouchControlsProps {
  onControl(action: ControlAction, pressed: boolean): void;
}

interface ControlButtonProps extends TouchControlsProps {
  action: ControlAction;
  label: string;
  symbol: string;
}

function ControlButton({ action, label, symbol, onControl }: ControlButtonProps) {
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    onControl(action, false);
  };

  return (
    <button
      type="button"
      className="touch-button"
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onControl(action, true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}

export function TouchControls({ onControl }: TouchControlsProps) {
  return (
    <div className="touch-controls" aria-label="Touch controls">
      <div className="touch-cluster">
        <ControlButton action="backward" label="Brake or reverse" symbol="←" onControl={onControl} />
        <ControlButton action="forward" label="Accelerate" symbol="→" onControl={onControl} />
      </div>
      <div className="touch-cluster">
        <ControlButton action="rotateBack" label="Rotate backward" symbol="↶" onControl={onControl} />
        <ControlButton action="rotateForward" label="Rotate forward" symbol="↷" onControl={onControl} />
      </div>
    </div>
  );
}
