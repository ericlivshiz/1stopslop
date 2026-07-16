import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    this.makeWheelTexture();
    this.makeBikeTexture();
    this.makeRiderTextures();
    this.scene.start("race");
  }

  private makeWheelTexture() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x171a2b).fillCircle(24, 24, 23);
    graphics.lineStyle(4, 0xf7d7a0).strokeCircle(24, 24, 18);
    graphics.lineStyle(2, 0x69768f);
    for (let angle = 0; angle < Math.PI; angle += Math.PI / 4) {
      graphics.lineBetween(24 - Math.cos(angle) * 14, 24 - Math.sin(angle) * 14, 24 + Math.cos(angle) * 14, 24 + Math.sin(angle) * 14);
    }
    graphics.fillStyle(0xf26b5b).fillCircle(24, 24, 5);
    graphics.generateTexture("wheel", 48, 48).destroy();
  }

  private makeBikeTexture() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2cc6b7).fillRoundedRect(4, 10, 90, 25, 10);
    graphics.fillStyle(0xf6ead4).fillTriangle(28, 10, 55, 10, 42, -8);
    graphics.fillStyle(0xf26b5b).fillRoundedRect(68, 3, 28, 12, 5);
    graphics.lineStyle(7, 0x20243a).lineBetween(15, 33, 2, 54).lineBetween(82, 32, 96, 54);
    graphics.generateTexture("bike", 104, 62).destroy();
  }

  private makeRiderTextures() {
    const body = this.add.graphics();
    body.fillStyle(0x39456b).fillRoundedRect(4, 4, 24, 46, 10);
    body.fillStyle(0xf4b24d).fillRoundedRect(1, 0, 30, 14, 7);
    body.generateTexture("rider-body", 32, 54).destroy();

    const head = this.add.graphics();
    head.fillStyle(0xf4b24d).fillCircle(18, 18, 17);
    head.fillStyle(0x20243a).fillRoundedRect(3, 3, 30, 10, 5);
    head.fillStyle(0xf6ead4).fillRect(18, 10, 14, 5);
    head.generateTexture("rider-head", 36, 36).destroy();
  }
}
