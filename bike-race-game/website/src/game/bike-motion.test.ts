import { describe, expect, it } from "vitest";
import { DEFAULT_DRIVE_TUNING, driveForce, nextBikeAngularVelocity, nextIdleLinearSpeed, nextThrottle } from "./bike-motion";

describe("bike motor response", () => {
  it("applies smooth rear-wheel traction below the speed cap", () => {
    expect(driveForce(0, 1)).toBeGreaterThan(0);
    expect(driveForce(0, -1)).toBeLessThan(0);
  });

  it("does not apply motor torque when input is released", () => {
    expect(driveForce(0.12, 0)).toBe(0);
  });

  it("cuts motor force at the bike-speed cap", () => {
    expect(driveForce(DEFAULT_DRIVE_TUNING.maxGroundSpeed, 1)).toBe(0);
    expect(driveForce(-DEFAULT_DRIVE_TUNING.maxGroundSpeed, -1)).toBe(0);
  });

  it("ramps a held input to full throttle instead of giving taps full power", () => {
    const firstFrame = nextThrottle(0, 1, 1 / 60, DEFAULT_DRIVE_TUNING.throttleRampSeconds);
    expect(firstFrame).toBeGreaterThan(0);
    expect(firstFrame).toBeLessThan(0.1);
    let held = 0;
    for (let frame = 0; frame < 30; frame += 1) {
      held = nextThrottle(held, 1, 1 / 60, DEFAULT_DRIVE_TUNING.throttleRampSeconds);
    }
    expect(held).toBe(1);
  });

  it("never requests more force than the traction limit", () => {
    expect(driveForce(0, 1)).toBe(DEFAULT_DRIVE_TUNING.tractionLimit);
  });

  it("preserves horizontal momentum on the ground and in the air", () => {
    expect(nextIdleLinearSpeed(0.008, 0.1)).toBe(0.008);
    expect(nextIdleLinearSpeed(2, 1.2)).toBe(2);
  });

  it("reduces rotation impulse and cap to 75 percent", () => {
    expect(nextBikeAngularVelocity(0, 1)).toBeCloseTo(0.00675, 5);
    expect(nextBikeAngularVelocity(1, 1)).toBeCloseTo(0.0675, 5);
    expect(nextBikeAngularVelocity(-1, -1)).toBeCloseTo(-0.0675, 5);
  });
});
