const WHEEL_OFFSET_X = 43;
const WHEEL_OFFSET_Y = 28;

export const BIKE_GEOMETRY = {
  wheelOffsetX: WHEEL_OFFSET_X,
  wheelOffsetY: WHEEL_OFFSET_Y,
  wheelRadius: 23,
  tireFriction: 0.65,
  chassisHeight: 34,
  rearAxleX: -WHEEL_OFFSET_X,
  frontAxleX: WHEEL_OFFSET_X,
  axleY: WHEEL_OFFSET_Y,
  axleConstraintLength: 0,
  collisionGroup: -1,
} as const;
