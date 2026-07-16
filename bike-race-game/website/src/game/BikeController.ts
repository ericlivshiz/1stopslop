import Phaser from "phaser";
import { BIKE_GEOMETRY } from "./bike-geometry";
import { nextIdleLinearSpeed, nextWheelSpeed } from "./bike-motion";
import { worldPointFromBike } from "./bike-pose";
import type { ControlState } from "./input";
import type { CheckpointDefinition } from "./track";

export class BikeController {
  readonly chassis: Phaser.Physics.Matter.Image;
  private rearWheel: Phaser.Physics.Matter.Image;
  private frontWheel: Phaser.Physics.Matter.Image;
  private rider: Phaser.GameObjects.Image;
  private head: Phaser.GameObjects.Image;
  private controls: ControlState = { forward: false, backward: false, rotateBack: false, rotateForward: false };

  constructor(private scene: Phaser.Scene, spawn: CheckpointDefinition) {
    this.rearWheel = scene.matter.add.image(spawn.x - BIKE_GEOMETRY.wheelOffsetX, spawn.y + BIKE_GEOMETRY.wheelOffsetY, "wheel", undefined, { restitution: 0.05, friction: BIKE_GEOMETRY.tireFriction }).setCircle(BIKE_GEOMETRY.wheelRadius).setDepth(9);
    this.frontWheel = scene.matter.add.image(spawn.x + BIKE_GEOMETRY.wheelOffsetX, spawn.y + BIKE_GEOMETRY.wheelOffsetY, "wheel", undefined, { restitution: 0.05, friction: BIKE_GEOMETRY.tireFriction }).setCircle(BIKE_GEOMETRY.wheelRadius).setDepth(9);
    this.chassis = scene.matter.add.image(spawn.x, spawn.y, "bike", undefined, { frictionAir: 0.018 }).setBody({ type: "rectangle", width: 92, height: BIKE_GEOMETRY.chassisHeight }).setDepth(10);
    this.rider = scene.add.image(spawn.x - 4, spawn.y - 38, "rider-body").setDepth(11);
    this.head = scene.add.image(spawn.x - 8, spawn.y - 76, "rider-head").setDepth(12);

    this.setLabel(this.chassis, "bike");
    this.setLabel(this.rearWheel, "bike-wheel");
    this.setLabel(this.frontWheel, "bike-wheel");
    [this.chassis, this.rearWheel, this.frontWheel].forEach((part) => {
      if (part.body && "collisionFilter" in part.body) {
        part.body.collisionFilter.group = BIKE_GEOMETRY.collisionGroup;
      }
    });

    scene.matter.add.constraint(this.chassis.body as MatterJS.BodyType, this.rearWheel.body as MatterJS.BodyType, BIKE_GEOMETRY.axleConstraintLength, 1, { pointA: { x: BIKE_GEOMETRY.rearAxleX, y: BIKE_GEOMETRY.axleY }, damping: 0.2 });
    scene.matter.add.constraint(this.chassis.body as MatterJS.BodyType, this.frontWheel.body as MatterJS.BodyType, BIKE_GEOMETRY.axleConstraintLength, 1, { pointA: { x: BIKE_GEOMETRY.frontAxleX, y: BIKE_GEOMETRY.axleY }, damping: 0.2 });
    this.respawn(spawn);
  }

  setControls(controls: ControlState) {
    this.controls = controls;
  }

  update() {
    const direction = (Number(this.controls.forward) - Number(this.controls.backward)) as -1 | 0 | 1;
    const rearSpeed = (this.rearWheel.body as MatterJS.BodyType).angularVelocity;
    if (direction !== 0) {
      this.rearWheel.setAngularVelocity(nextWheelSpeed(rearSpeed, direction));
    } else {
      const frontSpeed = (this.frontWheel.body as MatterJS.BodyType).angularVelocity;
      this.rearWheel.setAngularVelocity(nextWheelSpeed(rearSpeed, 0));
      this.frontWheel.setAngularVelocity(nextWheelSpeed(frontSpeed, 0));
      [this.chassis, this.rearWheel, this.frontWheel].forEach((part) => {
        const velocity = (part.body as MatterJS.BodyType).velocity;
        part.setVelocity(nextIdleLinearSpeed(velocity.x, velocity.y), velocity.y);
      });
    }

    const rotation = Number(this.controls.rotateForward) - Number(this.controls.rotateBack);
    if (rotation !== 0) {
      const angularVelocity = (this.chassis.body as MatterJS.BodyType).angularVelocity;
      this.chassis.setAngularVelocity(Phaser.Math.Clamp(angularVelocity + rotation * 0.012, -0.12, 0.12));
    }
  }

  syncVisuals() {
    const pose = { x: this.chassis.x, y: this.chassis.y, angle: this.chassis.rotation };
    const rider = worldPointFromBike(pose, { x: -4, y: -38 });
    const head = worldPointFromBike(pose, { x: -8, y: -76 });
    this.rider.setPosition(rider.x, rider.y).setRotation(pose.angle);
    this.head.setPosition(head.x, head.y).setRotation(pose.angle);
  }

  respawn(spawn: CheckpointDefinition) {
    const cos = Math.cos(spawn.angle);
    const sin = Math.sin(spawn.angle);
    const position = (x: number, y: number) => ({
      x: spawn.x + x * cos - y * sin,
      y: spawn.y + x * sin + y * cos,
    });
    const placements = [
      [this.chassis, position(0, 0)],
      [this.rearWheel, position(-BIKE_GEOMETRY.wheelOffsetX, BIKE_GEOMETRY.wheelOffsetY)],
      [this.frontWheel, position(BIKE_GEOMETRY.wheelOffsetX, BIKE_GEOMETRY.wheelOffsetY)],
    ] as const;
    placements.forEach(([part, point]) => {
      part.setPosition(point.x, point.y).setRotation(spawn.angle).setVelocity(0, 0).setAngularVelocity(0);
    });
    this.syncVisuals();
  }

  destroy() {
    [this.chassis, this.rearWheel, this.frontWheel, this.rider, this.head].forEach((part) => part.destroy());
  }

  private setLabel(image: Phaser.Physics.Matter.Image, label: string) {
    if (image.body && "label" in image.body) image.body.label = label;
  }
}
