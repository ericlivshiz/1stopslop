import { describe, expect, it } from "vitest";
import { createControlState } from "./input";
import { gameEvents } from "./events";

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
});
