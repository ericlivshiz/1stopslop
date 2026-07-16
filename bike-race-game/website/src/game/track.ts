export interface TrackPoint {
  x: number;
  y: number;
}

export interface CheckpointDefinition extends TrackPoint {
  angle: number;
}

export interface TrackDefinition {
  points: TrackPoint[];
  checkpoints: CheckpointDefinition[];
  spawns: CheckpointDefinition[];
  finishX: number;
  worldHeight: number;
}

export const CANYON_TRACK: TrackDefinition = {
  worldHeight: 1_100,
  finishX: 6_700,
  points: [
    { x: 0, y: 720 },
    { x: 220, y: 710 },
    { x: 480, y: 650 },
    { x: 760, y: 560 },
    { x: 1_020, y: 600 },
    { x: 1_270, y: 760 },
    { x: 1_550, y: 700 },
    { x: 1_850, y: 525 },
    { x: 2_110, y: 500 },
    { x: 2_380, y: 740 },
    { x: 2_720, y: 700 },
    { x: 3_050, y: 620 },
    { x: 3_360, y: 640 },
    { x: 3_680, y: 770 },
    { x: 3_980, y: 610 },
    { x: 4_260, y: 500 },
    { x: 4_560, y: 590 },
    { x: 4_860, y: 720 },
    { x: 5_180, y: 660 },
    { x: 5_480, y: 525 },
    { x: 5_760, y: 650 },
    { x: 6_080, y: 720 },
    { x: 6_420, y: 680 },
    { x: 6_760, y: 650 },
    { x: 7_000, y: 650 },
  ],
  checkpoints: [
    { x: 1_530, y: 645, angle: -0.3 },
    { x: 3_020, y: 565, angle: -0.15 },
    { x: 4_840, y: 665, angle: 0.25 },
    { x: 6_050, y: 665, angle: 0.1 },
  ],
  spawns: [
    { x: 150, y: 630, angle: 0 },
    { x: 1_530, y: 590, angle: -0.3 },
    { x: 3_020, y: 510, angle: -0.15 },
    { x: 4_840, y: 610, angle: 0.25 },
    { x: 6_050, y: 610, angle: 0.1 },
  ],
};
