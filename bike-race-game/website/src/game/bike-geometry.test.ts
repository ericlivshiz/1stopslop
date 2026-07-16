import { describe, expect, it } from "vitest";
import { BIKE_GEOMETRY, suspensionDistanceAtSpawn } from "./bike-geometry";

describe("bike geometry", () => {
  it("starts both wheels at their suspension rest length", () => {
    expect(suspensionDistanceAtSpawn("rear")).toBeCloseTo(BIKE_GEOMETRY.suspensionLength, 5);
    expect(suspensionDistanceAtSpawn("front")).toBeCloseTo(BIKE_GEOMETRY.suspensionLength, 5);
  });

  it("keeps the chassis above the wheel contact patch", () => {
    const wheelBottom = BIKE_GEOMETRY.wheelOffsetY + BIKE_GEOMETRY.wheelRadius;
    const chassisBottom = BIKE_GEOMETRY.chassisHeight / 2;
    expect(wheelBottom - chassisBottom).toBeGreaterThan(25);
  });
});
