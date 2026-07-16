import Phaser from "phaser";
import { BootScene } from "./BootScene";
import { RaceScene } from "./RaceScene";

export function createBikeRaceGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#f8bd79",
    transparent: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: "100%",
      height: "100%",
    },
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 1.25 },
        enableSleeping: false,
        positionIterations: 8,
        velocityIterations: 6,
      },
    },
    render: { antialias: true, roundPixels: false },
    scene: [BootScene, RaceScene],
  });
}
