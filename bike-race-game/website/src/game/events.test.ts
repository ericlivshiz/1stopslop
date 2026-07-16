import { describe, expect, it } from "vitest";
import { createControlState } from "./input";
import { gameEvents } from "./events";
import { DEFAULT_DRIVE_TUNING } from "./bike-motion";

describe("game event boundary", () => {
  it("publishes controls and restart commands", () => {
    const controls: boolean[] = [];
    let restarts = 0;
    const stopControls = gameEvents.onControls((state) => controls.push(state.forward));
    const stopRestart = gameEvents.onRestart(() => { restarts += 1; });

    gameEvents.setControls({ ...createControlState(), forward: true });
    gameEvents.restart();
    stopControls();
    stopRestart();
    gameEvents.setControls(createControlState());

    expect(controls).toEqual([true]);
    expect(restarts).toBe(1);
  });

  it("publishes live drivetrain tuning", () => {
    const received: number[] = [];
    const stop = gameEvents.onDriveTuning((tuning) => received.push(tuning.maxGroundSpeed));
    gameEvents.setDriveTuning({ ...DEFAULT_DRIVE_TUNING, maxGroundSpeed: 22 });
    stop();
    gameEvents.setDriveTuning(DEFAULT_DRIVE_TUNING);

    expect(received).toEqual([22]);
    expect(gameEvents.getDriveTuning()).toEqual(DEFAULT_DRIVE_TUNING);
  });
});
