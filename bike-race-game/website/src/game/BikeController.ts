import Phaser from "phaser";
import { BIKE_GEOMETRY } from "./bike-geometry";
import type { ControlState } from "./input";
import type { CheckpointDefinition } from "./track";

export class BikeController {
  readonly chassis: Phaser.Physics.Matter.Image;
  private rearWheel: Phaser.Physics.Matter.Image;
  private frontWheel: Phaser.Physics.Matter.Image;
  private rider: Phaser.Physics.Matter.Image;
  private head: Phaser.Physics.Matter.Image;
  private controls: ControlState = { forward: false, backward: false, rotateBack: false, rotateForward: false };

  constructor(private scene: Phaser.Scene, spawn: CheckpointDefinition) {
    this.rearWheel = scene.matter.add.image(spawn.x - BIKE_GEOMETRY.wheelOffsetX, spawn.y + BIKE_GEOMETRY.wheelOffsetY, "wheel", undefined, { restitution: 0.05, friction: 1.2 }).setCircle(BIKE_GEOMETRY.wheelRadius).setDepth(9);
    this.frontWheel = scene.matter.add.image(spawn.x + BIKE_GEOMETRY.wheelOffsetX, spawn.y + BIKE_GEOMETRY.wheelOffsetY, "wheel", undefined, { restitution: 0.05, friction: 1.2 }).setCircle(BIKE_GEOMETRY.wheelRadius).setDepth(9);
    this.chassis = scene.matter.add.image(spawn.x, spawn.y, "bike", undefined, { frictionAir: 0.018 }).setBody({ type: "rectangle", width: 92, height: BIKE_GEOMETRY.chassisHeight }).setDepth(10);
    this.rider = scene.matter.add.image(spawn.x - 4, spawn.y - 38, "rider-body", undefined, { frictionAir: 0.02 }).setBody({ type: "rectangle", width: 27, height: 47 }).setDepth(11);
    this.head = scene.matter.add.image(spawn.x - 8, spawn.y - 76, "rider-head", undefined, { frictionAir: 0.02 }).setCircle(17).setDepth(12);

    this.setLabel(this.chassis, "bike");
    this.setLabel(this.rearWheel, "bike-wheel");
    this.setLabel(this.frontWheel, "bike-wheel");
    this.setLabel(this.rider, "rider");
    this.setLabel(this.head, "rider-head");

    scene.matter.add.constraint(this.chassis.body as MatterJS.BodyType, this.rearWheel.body as MatterJS.BodyType, BIKE_GEOMETRY.suspensionLength, 0.75, { pointA: { x: BIKE_GEOMETRY.rearAnchorX, y: BIKE_GEOMETRY.suspensionAnchorY }, damping: 0.16 });
    scene.matter.add.constraint(this.chassis.body as MatterJS.BodyType, this.frontWheel.body as MatterJS.BodyType, BIKE_GEOMETRY.suspensionLength, 0.75, { pointA: { x: BIKE_GEOMETRY.frontAnchorX, y: BIKE_GEOMETRY.suspensionAnchorY }, damping: 0.16 });
    scene.matter.add.constraint(this.chassis.body as MatterJS.BodyType, this.rider.body as MatterJS.BodyType, 0, 0.92, { pointA: { x: -4, y: -19 }, pointB: { x: 0, y: 22 } });
    scene.matter.add.constraint(this.rider.body as MatterJS.BodyType, this.head.body as MatterJS.BodyType, 0, 0.95, { pointA: { x: 0, y: -25 }, pointB: { x: 0, y: 15 } });

    this.respawn(spawn);
  }

  setControls(controls: ControlState) {
    this.controls = controls;
  }

  update() {
    const direction = Number(this.controls.forward) - Number(this.controls.backward);
    if (direction !== 0) {
      this.rearWheel.setAngularVelocity(direction * 0.34);
      this.frontWheel.setAngularVelocity(direction * 0.29);
      this.chassis.applyForce(new Phaser.Math.Vector2(direction * 0.0016, 0));
    } else {
      this.rearWheel.setAngularVelocity((this.rearWheel.body as MatterJS.BodyType).angularVelocity * 0.96);
      this.frontWheel.setAngularVelocity((this.frontWheel.body as MatterJS.BodyType).angularVelocity * 0.96);
    }

    const rotation = Number(this.controls.rotateForward) - Number(this.controls.rotateBack);
    if (rotation !== 0) {
      const angularVelocity = (this.chassis.body as MatterJS.BodyType).angularVelocity;
      this.chassis.setAngularVelocity(Phaser.Math.Clamp(angularVelocity + rotation * 0.012, -0.12, 0.12));
    }
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
      [this.rider, position(-4, -38)],
      [this.head, position(-8, -76)],
    ] as const;
    placements.forEach(([part, point]) => {
      part.setPosition(point.x, point.y).setRotation(spawn.angle).setVelocity(0, 0).setAngularVelocity(0);
    });
  }

  destroy() {
    [this.chassis, this.rearWheel, this.frontWheel, this.rider, this.head].forEach((part) => part.destroy());
  }

  private setLabel(image: Phaser.Physics.Matter.Image, label: string) {
    if (image.body && "label" in image.body) image.body.label = label;
  }
}
