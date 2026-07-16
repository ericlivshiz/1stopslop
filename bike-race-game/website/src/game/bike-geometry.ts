const WHEEL_OFFSET_X = 43;
const WHEEL_OFFSET_Y = 28;
const SUSPENSION_ANCHOR_X = 39;
const SUSPENSION_ANCHOR_Y = 14;

export const BIKE_GEOMETRY = {
  wheelOffsetX: WHEEL_OFFSET_X,
  wheelOffsetY: WHEEL_OFFSET_Y,
  wheelRadius: 23,
  chassisHeight: 34,
  rearAnchorX: -SUSPENSION_ANCHOR_X,
  frontAnchorX: SUSPENSION_ANCHOR_X,
  suspensionAnchorY: SUSPENSION_ANCHOR_Y,
  collisionGroup: -1,
  suspensionLength: Math.hypot(
    WHEEL_OFFSET_X - SUSPENSION_ANCHOR_X,
    WHEEL_OFFSET_Y - SUSPENSION_ANCHOR_Y,
  ),
} as const;

export function suspensionDistanceAtSpawn(wheel: "rear" | "front"): number {
  const direction = wheel === "rear" ? -1 : 1;
  const wheelX = direction * BIKE_GEOMETRY.wheelOffsetX;
  const anchorX = wheel === "rear" ? BIKE_GEOMETRY.rearAnchorX : BIKE_GEOMETRY.frontAnchorX;
  return Math.hypot(
    wheelX - anchorX,
    BIKE_GEOMETRY.wheelOffsetY - BIKE_GEOMETRY.suspensionAnchorY,
  );
}
