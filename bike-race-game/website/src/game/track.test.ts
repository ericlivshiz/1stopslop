import { describe, expect, it } from "vitest";
import { CANYON_TRACK } from "./track";

describe("canyon track", () => {
  it("has ordered terrain, checkpoints, and finish", () => {
    expect(CANYON_TRACK.points[0].x).toBe(0);
    for (let index = 1; index < CANYON_TRACK.points.length; index += 1) {
      expect(CANYON_TRACK.points[index].x).toBeGreaterThan(CANYON_TRACK.points[index - 1].x);
    }
    expect(CANYON_TRACK.checkpoints.length).toBeGreaterThanOrEqual(3);
    for (let index = 1; index < CANYON_TRACK.checkpoints.length; index += 1) {
      expect(CANYON_TRACK.checkpoints[index].x).toBeGreaterThan(CANYON_TRACK.checkpoints[index - 1].x);
    }
    expect(CANYON_TRACK.finishX).toBeGreaterThan(CANYON_TRACK.checkpoints.at(-1)!.x);
    expect(CANYON_TRACK.finishX).toBeLessThanOrEqual(CANYON_TRACK.points.at(-1)!.x);
  });

  it("provides a stable spawn for every checkpoint", () => {
    expect(CANYON_TRACK.spawns).toHaveLength(CANYON_TRACK.checkpoints.length + 1);
    expect(CANYON_TRACK.spawns.every((spawn) => Number.isFinite(spawn.x + spawn.y + spawn.angle))).toBe(true);
  });
});
