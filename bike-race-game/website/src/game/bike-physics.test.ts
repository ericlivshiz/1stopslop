import Matter from "matter-js";
import { describe, expect, it } from "vitest";
import { BIKE_GEOMETRY } from "./bike-geometry";
import { nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";

function createBikeWorld(groundAngle = 0) {
  const engine = Matter.Engine.create({ positionIterations: 10, velocityIterations: 8 });
  const group = BIKE_GEOMETRY.collisionGroup;
  const point = (x: number, y: number) => Matter.Vector.rotate({ x, y }, groundAngle);
  const chassisPosition = point(0, -52);
  const rearPosition = point(-BIKE_GEOMETRY.wheelOffsetX, -24);
  const frontPosition = point(BIKE_GEOMETRY.wheelOffsetX, -24);
  const groundPosition = point(0, 20);
  const chassis = Matter.Bodies.rectangle(chassisPosition.x, chassisPosition.y, 92, BIKE_GEOMETRY.chassisHeight, {
    frictionAir: 0.018,
    collisionFilter: { group },
    angle: groundAngle,
  });
  const rearWheel = Matter.Bodies.circle(rearPosition.x, rearPosition.y, BIKE_GEOMETRY.wheelRadius, {
    friction: BIKE_GEOMETRY.tireFriction,
    restitution: 0.05,
    collisionFilter: { group },
  });
  const frontWheel = Matter.Bodies.circle(frontPosition.x, frontPosition.y, BIKE_GEOMETRY.wheelRadius, {
    friction: BIKE_GEOMETRY.tireFriction,
    restitution: 0.05,
    collisionFilter: { group },
  });
  const ground = Matter.Bodies.rectangle(groundPosition.x, groundPosition.y, 4_000, 40, { isStatic: true, friction: 0.75, angle: groundAngle });
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

function driveThenCoast() {
  const bike = createBikeWorld();
  for (let frame = 0; frame < 120; frame += 1) {
    Matter.Body.setAngularVelocity(
      bike.rearWheel,
      nextWheelSpeed(bike.rearWheel.angularVelocity, 1),
    );
    Matter.Engine.update(bike.engine, 1000 / 60);
  }
  const releaseX = bike.chassis.position.x;
  for (let frame = 0; frame < 120; frame += 1) {
    Matter.Engine.update(bike.engine, 1000 / 60);
  }
  return { releaseX, finalX: bike.chassis.position.x, angle: bike.chassis.angle };
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

  it("keeps coasting after throttle is released", () => {
    const result = driveThenCoast();
    expect(result.finalX - result.releaseX).toBeGreaterThan(50);
    expect(Math.abs(result.angle)).toBeLessThan(0.15);
  });

  it("climbs a mild hill under sustained throttle", () => {
    const angle = -0.12;
    const bike = createBikeWorld(angle);
    const start = { ...bike.chassis.position };
    for (let frame = 0; frame < 240; frame += 1) {
      Matter.Body.setAngularVelocity(
        bike.rearWheel,
        nextWheelSpeed(bike.rearWheel.angularVelocity, 1),
      );
      Matter.Engine.update(bike.engine, 1000 / 60);
    }
    const displacement = Matter.Vector.dot(
      Matter.Vector.sub(bike.chassis.position, start),
      { x: Math.cos(angle), y: Math.sin(angle) },
    );
    expect(displacement).toBeGreaterThan(100);
    expect(Math.abs(bike.chassis.angle - angle)).toBeLessThan(0.2);
  });
});
