import Phaser from "phaser";
import type { TrackDefinition } from "./track";

export class TrackBuilder {
  constructor(private scene: Phaser.Scene, private definition: TrackDefinition) {}

  build() {
    const shadow = this.scene.add.graphics().setDepth(3);
    const rail = this.scene.add.graphics().setDepth(4);
    shadow.lineStyle(34, 0x14172a, 0.45);
    rail.lineStyle(22, 0x252a43, 1);

    const { points } = this.definition;
    shadow.beginPath().moveTo(points[0].x, points[0].y + 8);
    rail.beginPath().moveTo(points[0].x, points[0].y);

    for (let index = 1; index < points.length; index += 1) {
      const from = points[index - 1];
      const to = points[index];
      shadow.lineTo(to.x, to.y + 8);
      rail.lineTo(to.x, to.y);

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.hypot(dx, dy);
      const body = this.scene.matter.add.rectangle(
        (from.x + to.x) / 2,
        (from.y + to.y) / 2 + 13,
        length + 3,
        28,
        { isStatic: true, angle: Math.atan2(dy, dx), friction: 0.9, label: "track" },
      );
      body.collisionFilter.category = 1;
    }

    shadow.strokePath();
    rail.strokePath();

    const highlight = this.scene.add.graphics().setDepth(5);
    highlight.lineStyle(4, 0xffa36b, 0.9).beginPath().moveTo(points[0].x, points[0].y - 10);
    points.slice(1).forEach((point) => highlight.lineTo(point.x, point.y - 10));
    highlight.strokePath();

    this.definition.checkpoints.forEach((checkpoint, index) => {
      this.scene.matter.add.rectangle(checkpoint.x, checkpoint.y - 85, 18, 170, {
        isStatic: true,
        isSensor: true,
        label: `checkpoint:${index + 1}`,
      });
      this.addGate(checkpoint.x, checkpoint.y, index + 1);
    });

    this.scene.matter.add.rectangle(this.definition.finishX, 560, 24, 260, {
      isStatic: true,
      isSensor: true,
      label: "finish",
    });
    this.addFinish(this.definition.finishX, 650);
  }

  private addGate(x: number, y: number, number: number) {
    const gate = this.scene.add.graphics().setDepth(2);
    gate.fillStyle(0xf7d7a0, 0.3).fillRect(x - 3, y - 115, 6, 105);
    gate.fillStyle(0x2cc6b7).fillRoundedRect(x - 30, y - 132, 60, 28, 10);
    this.scene.add.text(x, y - 118, String(number), {
      fontFamily: "system-ui",
      fontSize: "16px",
      color: "#132133",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(6);
  }

  private addFinish(x: number, y: number) {
    const gate = this.scene.add.graphics().setDepth(3);
    gate.fillStyle(0xf7d7a0).fillRect(x - 5, y - 190, 10, 180);
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        gate.fillStyle((row + col) % 2 ? 0xf6ead4 : 0x20243a).fillRect(x + col * 18, y - 190 + row * 18, 18, 18);
      }
    }
  }
}
