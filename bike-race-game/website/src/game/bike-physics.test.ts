import Matter from "matter-js";
import { describe, expect, it } from "vitest";
import { BIKE_GEOMETRY } from "./bike-geometry";
import { nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";

function createBikeWorld() {
  const engine = Matter.Engine.create({ positionIterations: 10, velocityIterations: 8 });
  const group = BIKE_GEOMETRY.collisionGroup;
  const chassis = Matter.Bodies.rectangle(0, -64, 92, BIKE_GEOMETRY.chassisHeight, {
    frictionAir: 0.018,
    collisionFilter: { group },
  });
  const rearWheel = Matter.Bodies.circle(-BIKE_GEOMETRY.wheelOffsetX, -36, BIKE_GEOMETRY.wheelRadius, {
    friction: 1.2,
    restitution: 0.05,
    collisionFilter: { group },
  });
  const frontWheel = Matter.Bodies.circle(BIKE_GEOMETRY.wheelOffsetX, -36, BIKE_GEOMETRY.wheelRadius, {
    friction: 1.2,
    restitution: 0.05,
    collisionFilter: { group },
  });
  const ground = Matter.Bodies.rectangle(0, 20, 4_000, 40, { isStatic: true, friction: 1 });
  const rearAxle = Matter.Constraint.create({
    bodyA: chassis,
    bodyB: rearWheel,
    pointA: { x: BIKE_GEOMETRY.rearAxleX, y: BIKE_GEOMETRY.axleY },
    length: BIKE_GEOMETRY.axleConstraintLength,
    stiffness: 1,
    damping: 0.2,
  });
  const frontAxle = Matter.Constraint.create({
    bodyA: chassis,
    bodyB: frontWheel,
    pointA: { x: BIKE_GEOMETRY.frontAxleX, y: BIKE_GEOMETRY.axleY },
    length: BIKE_GEOMETRY.axleConstraintLength,
    stiffness: 1,
    damping: 0.2,
  });

  Matter.Composite.add(engine.world, [chassis, rearWheel, frontWheel, ground, rearAxle, frontAxle]);
  return { engine, chassis, rearWheel, frontWheel };
}

function stepBike(direction: -1 | 0 | 1, frames = 240) {
  const bike = createBikeWorld();
  for (let frame = 0; frame < frames; frame += 1) {
    if (direction === 0) {
      for (const body of [bike.chassis, bike.rearWheel, bike.frontWheel]) {
        Matter.Body.setVelocity(body, {
          x: nextIdleLinearSpeed(body.velocity.x, body.velocity.y),
          y: body.velocity.y,
        });
      }
      Matter.Body.setAngularVelocity(bike.rearWheel, nextWheelSpeed(bike.rearWheel.angularVelocity, 0));
      Matter.Body.setAngularVelocity(bike.frontWheel, nextWheelSpeed(bike.frontWheel.angularVelocity, 0));
    } else {
      Matter.Body.setAngularVelocity(
        bike.rearWheel,
        nextWheelSpeed(bike.rearWheel.angularVelocity, direction),
      );
    }
    Matter.Engine.update(bike.engine, 1000 / 60);
  }
  return bike;
}

function axleError(
  chassis: Matter.Body,
  wheel: Matter.Body,
  localX: number,
): number {
  const axle = Matter.Vector.add(chassis.position, Matter.Vector.rotate({ x: localX, y: BIKE_GEOMETRY.axleY }, chassis.angle));
  return Matter.Vector.magnitude(Matter.Vector.sub(wheel.position, axle));
}

describe("complete bike physics", () => {
  it("keeps both wheels fixed to their axles after settling", () => {
    const bike = stepBike(0);
    expect(axleError(bike.chassis, bike.rearWheel, BIKE_GEOMETRY.rearAxleX)).toBeLessThan(1);
    expect(axleError(bike.chassis, bike.frontWheel, BIKE_GEOMETRY.frontAxleX)).toBeLessThan(1);
    expect(Math.abs(bike.chassis.angle)).toBeLessThan(0.08);
  });

  it("drives smoothly forward without flipping", () => {
    const bike = stepBike(1);
    expect(bike.chassis.position.x).toBeGreaterThan(100);
    expect(Math.abs(bike.chassis.angle)).toBeLessThan(0.15);
  });

  it("drives smoothly backward without flipping", () => {
    const bike = stepBike(-1);
    expect(bike.chassis.position.x).toBeLessThan(-100);
    expect(Math.abs(bike.chassis.angle)).toBeLessThan(0.15);
  });
});
