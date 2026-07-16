import { describe, expect, it } from "vitest";
import { nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";

describe("bike motor response", () => {
  it("ramps toward drive speed instead of snapping to it", () => {
    const firstFrame = nextWheelSpeed(0, 1);
    expect(firstFrame).toBeGreaterThan(0);
    expect(firstFrame).toBeLessThan(0.15);
  });

  it("does not apply a synthetic wheel brake when input is released", () => {
    expect(nextWheelSpeed(0.12, 0)).toBe(0.12);
  });

  it("caps sustained acceleration at five times the original speed", () => {
    let speed = 0;
    for (let frame = 0; frame < 300; frame += 1) speed = nextWheelSpeed(speed, 1);
    expect(speed).toBeCloseTo(0.7, 3);
  });

  it("preserves horizontal momentum on the ground and in the air", () => {
    expect(nextIdleLinearSpeed(0.008, 0.1)).toBe(0.008);
    expect(nextIdleLinearSpeed(2, 1.2)).toBe(2);
  });
});
