import { describe, expect, it } from "vitest";
import { nextBikeAngularVelocity, nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";

describe("bike motor response", () => {
  it("ramps toward drive speed instead of snapping to it", () => {
    const firstFrame = nextWheelSpeed(0, 1);
    expect(firstFrame).toBeGreaterThan(0);
    expect(firstFrame).toBeLessThan(0.5);
  });

  it("does not apply a synthetic wheel brake when input is released", () => {
    expect(nextWheelSpeed(0.12, 0)).toBe(0.12);
  });

  it("caps sustained acceleration at three times the previous speed", () => {
    let speed = 0;
    for (let frame = 0; frame < 300; frame += 1) speed = nextWheelSpeed(speed, 1);
    expect(speed).toBeCloseTo(2.1, 3);
  });

  it("preserves horizontal momentum on the ground and in the air", () => {
    expect(nextIdleLinearSpeed(0.008, 0.1)).toBe(0.008);
    expect(nextIdleLinearSpeed(2, 1.2)).toBe(2);
  });

  it("reduces rotation impulse and cap to 75 percent", () => {
    expect(nextBikeAngularVelocity(0, 1)).toBeCloseTo(0.009, 5);
    expect(nextBikeAngularVelocity(1, 1)).toBeCloseTo(0.09, 5);
    expect(nextBikeAngularVelocity(-1, -1)).toBeCloseTo(-0.09, 5);
  });
});
