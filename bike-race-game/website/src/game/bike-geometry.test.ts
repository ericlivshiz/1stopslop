import { describe, expect, it } from "vitest";
import { BIKE_GEOMETRY } from "./bike-geometry";

describe("bike geometry", () => {
  it("mounts both wheel centers directly to fixed chassis axles", () => {
    expect(BIKE_GEOMETRY.rearAxleX).toBe(-BIKE_GEOMETRY.wheelOffsetX);
    expect(BIKE_GEOMETRY.frontAxleX).toBe(BIKE_GEOMETRY.wheelOffsetX);
    expect(BIKE_GEOMETRY.axleY).toBe(BIKE_GEOMETRY.wheelOffsetY);
    expect(BIKE_GEOMETRY.axleConstraintLength).toBe(0);
  });

  it("keeps the chassis above the wheel contact patch", () => {
    const wheelBottom = BIKE_GEOMETRY.wheelOffsetY + BIKE_GEOMETRY.wheelRadius;
    const chassisBottom = BIKE_GEOMETRY.chassisHeight / 2;
    expect(wheelBottom - chassisBottom).toBeGreaterThan(25);
  });

  it("uses a negative collision group so constrained bike parts cannot collide", () => {
    expect(BIKE_GEOMETRY.collisionGroup).toBeLessThan(0);
  });

  it("uses moderate tire friction for traction without sticky rolling", () => {
    expect(BIKE_GEOMETRY.tireFriction).toBeGreaterThanOrEqual(0.8);
    expect(BIKE_GEOMETRY.tireFriction).toBeLessThanOrEqual(1.1);
  });
});
