import { describe, expect, it } from "vitest";
import {
  advanceCheckpoint,
  crashRace,
  createRaceState,
  finishRace,
  restartRace,
  resumeRace,
  startRace,
  suspendRace,
} from "./race-state";

describe("race state", () => {
  it("moves through a complete race and preserves the latest checkpoint", () => {
    const ready = createRaceState();
    expect(ready).toMatchObject({ status: "ready", checkpoint: 0, elapsedMs: 0 });

    const running = startRace(ready, 1_000);
    const checkpoint = advanceCheckpoint(running, 2);
    const crashed = crashRace(checkpoint, 4_200);
    expect(crashed).toMatchObject({ status: "crashed", checkpoint: 2, elapsedMs: 3_200 });

    const restarted = restartRace(crashed, 5_000);
    expect(restarted).toMatchObject({ status: "running", checkpoint: 2, elapsedMs: 3_200 });

    const finished = finishRace(restarted, 7_000);
    expect(finished).toMatchObject({ status: "finished", checkpoint: 2, elapsedMs: 5_200 });
  });

  it("never moves a checkpoint backward", () => {
    const running = startRace(createRaceState(), 100);
    expect(advanceCheckpoint(advanceCheckpoint(running, 3), 1).checkpoint).toBe(3);
  });

  it("does not count time while suspended", () => {
    const running = startRace(createRaceState(), 1_000);
    const suspended = suspendRace(running, 3_000);
    const resumed = resumeRace(suspended, 8_000);
    expect(finishRace(resumed, 10_000).elapsedMs).toBe(4_000);
  });
});
