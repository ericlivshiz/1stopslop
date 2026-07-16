import { describe, expect, it } from "vitest";
import { nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";

describe("bike motor response", () => {
  it("ramps toward drive speed instead of snapping to it", () => {
    const firstFrame = nextWheelSpeed(0, 1);
    expect(firstFrame).toBeGreaterThan(0);
    expect(firstFrame).toBeLessThan(0.03);
  });

  it("settles completely when no input is pressed", () => {
    let speed = 0.12;
    for (let frame = 0; frame < 90; frame += 1) speed = nextWheelSpeed(speed, 0);
    expect(speed).toBe(0);
  });

  it("caps sustained acceleration at a controllable speed", () => {
    let speed = 0;
    for (let frame = 0; frame < 300; frame += 1) speed = nextWheelSpeed(speed, 1);
    expect(speed).toBeCloseTo(0.14, 3);
  });

  it("settles grounded horizontal drift without braking in the air", () => {
    expect(nextIdleLinearSpeed(0.008, 0.1)).toBe(0);
    expect(nextIdleLinearSpeed(2, 1.2)).toBe(2);
  });
});
