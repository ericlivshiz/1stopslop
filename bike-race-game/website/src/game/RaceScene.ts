import Phaser from "phaser";
import { BikeController } from "./BikeController";
import { gameEvents } from "./events";
import { createControlState, type ControlState } from "./input";
import {
  advanceCheckpoint,
  crashRace,
  createRaceState,
  elapsedRaceTime,
  finishRace,
  restartRace,
  resumeRace,
  startRace,
  suspendRace,
  type RaceSnapshot,
} from "./race-state";
import { CANYON_TRACK } from "./track";
import { TrackBuilder } from "./TrackBuilder";

export class RaceScene extends Phaser.Scene {
  private bike!: BikeController;
  private race: RaceSnapshot = createRaceState();
  private controls: ControlState = createControlState();
  private cleanup: Array<() => void> = [];
  private lastPublishedSecond = -1;
  private crashedAt = 0;

  constructor() {
    super("race");
  }

  create() {
    this.cameras.main.setBackgroundColor("#f8bd79");
    this.drawBackdrop();
    new TrackBuilder(this, CANYON_TRACK).build();
    this.bike = new BikeController(this, CANYON_TRACK.spawns[0]);
    const cameraLead = this.scale.width < 600 ? 0 : -180;
    const cameraLift = this.scale.height < 500 ? 0 : 80;
    if (this.scale.height < 500) this.cameras.main.setZoom(0.82);
    this.cameras.main.startFollow(this.bike.chassis, true, 0.08, 0.08, cameraLead, cameraLift);
    this.cameras.main.setBounds(0, 0, CANYON_TRACK.points.at(-1)!.x, CANYON_TRACK.worldHeight);
    this.matter.world.setBounds(-200, -300, CANYON_TRACK.points.at(-1)!.x + 500, CANYON_TRACK.worldHeight + 600, 100, true, true, false, true);

    this.cleanup.push(gameEvents.onControls((controls) => {
      this.controls = controls;
      this.bike.setControls(controls);
      if (this.race.status === "ready" && Object.values(controls).some(Boolean)) {
        this.race = startRace(this.race, performance.now());
        this.publish();
      }
    }));
    this.cleanup.push(gameEvents.onRestart(() => this.restart()));
    this.matter.world.on("collisionstart", this.handleCollision, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.publish();
  }

  update(_time: number, delta: number) {
    this.bike.syncVisuals();
    this.bike.update();
    if (this.race.status === "running") {
      const elapsed = elapsedRaceTime(this.race, performance.now());
      const second = Math.floor(elapsed / 100);
      if (second !== this.lastPublishedSecond) {
        this.lastPublishedSecond = second;
        gameEvents.publishSnapshot({ ...this.race, elapsedMs: elapsed });
      }
      if (this.bike.chassis.y > CANYON_TRACK.worldHeight + 100) this.crash();
    } else if (this.race.status === "crashed" && performance.now() - this.crashedAt > 900) {
      this.restart();
    }

    void delta;
  }

  private handleCollision(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      const labels = [bodyA.label, bodyB.label];
      if (labels.includes("bike") && labels.includes("track")) {
        const angle = Math.abs(Phaser.Math.Angle.Wrap(this.bike.chassis.rotation));
        if (angle > 1.65) this.crash();
      }

      const sensor = labels.find((label) => label.startsWith("checkpoint:"));
      if (sensor && labels.some((label) => label.startsWith("bike"))) {
        const checkpoint = Number(sensor.split(":")[1]);
        if (checkpoint > this.race.checkpoint) {
          this.race = advanceCheckpoint(this.race, checkpoint);
          this.cameras.main.flash(120, 44, 198, 183, false);
          this.publish();
        }
      }

      if (labels.includes("finish") && labels.some((label) => label.startsWith("bike")) && this.race.status === "running") {
        this.race = finishRace(this.race, performance.now());
        this.controls = createControlState();
        this.bike.setControls(this.controls);
        this.cameras.main.flash(300, 247, 215, 160, false);
        this.publish();
      }
    });
  }

  private crash() {
    if (this.race.status !== "running") return;
    this.race = crashRace(this.race, performance.now());
    this.crashedAt = performance.now();
    this.bike.setControls(createControlState());
    this.cameras.main.shake(180, 0.008);
    this.publish();
  }

  private restart() {
    if (this.race.status === "finished") {
      this.race = createRaceState();
      this.bike.respawn(CANYON_TRACK.spawns[0]);
    } else {
      if (this.race.status === "running") this.race = crashRace(this.race, performance.now());
      if (this.race.status === "ready") this.race = startRace(this.race, performance.now());
      if (this.race.status === "crashed") this.race = restartRace(this.race, performance.now());
      this.bike.respawn(CANYON_TRACK.spawns[this.race.checkpoint]);
    }
    this.lastPublishedSecond = -1;
    this.publish();
  }

  private publish() {
    gameEvents.publishSnapshot({ ...this.race, elapsedMs: elapsedRaceTime(this.race, performance.now()) });
  }

  private drawBackdrop() {
    const far = this.add.graphics().setScrollFactor(0.08).setDepth(-4).setName("far-canyon");
    far.fillStyle(0xd97878, 0.62);
    for (let x = -400; x < 2_200; x += 360) far.fillTriangle(x, 650, x + 190, 240 + (x % 3) * 30, x + 420, 650);
    const near = this.add.graphics().setScrollFactor(0.22).setDepth(-3).setName("near-canyon");
    near.fillStyle(0x8d4b6f, 0.42);
    for (let x = -300; x < 2_400; x += 500) near.fillTriangle(x, 760, x + 260, 410, x + 610, 760);
    const haze = this.add.rectangle(0, 760, 2_600, 350, 0xf6a66f, 0.48).setOrigin(0).setScrollFactor(0).setDepth(-2).setName("haze");
    haze.setBlendMode(Phaser.BlendModes.SCREEN);
  }

  private handleVisibility = () => {
    if (document.hidden) {
      this.race = suspendRace(this.race, performance.now());
      this.scene.pause();
    } else if (this.scene.isPaused()) {
      this.race = resumeRace(this.race, performance.now());
      this.scene.resume();
      this.publish();
    }
  };

  private shutdown() {
    this.cleanup.forEach((cleanup) => cleanup());
    this.cleanup = [];
    this.matter.world.off("collisionstart", this.handleCollision, this);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.bike?.destroy();
  }
}
