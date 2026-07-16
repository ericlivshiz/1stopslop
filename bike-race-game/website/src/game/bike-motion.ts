const MAX_DRIVE_SPEED = 2.1;
const DRIVE_RESPONSE = 0.1;
const ROTATION_IMPULSE = 0.009;
const MAX_ROTATION_SPEED = 0.09;

export function nextWheelSpeed(current: number, direction: -1 | 0 | 1): number {
  if (direction === 0) {
    return current;
  }

  const target = direction * MAX_DRIVE_SPEED;
  return current + (target - current) * DRIVE_RESPONSE;
}

export function nextIdleLinearSpeed(horizontal: number, vertical: number): number {
  void vertical;
  return horizontal;
}

export function nextBikeAngularVelocity(current: number, direction: -1 | 0 | 1): number {
  const next = current + direction * ROTATION_IMPULSE;
  return Math.max(-MAX_ROTATION_SPEED, Math.min(MAX_ROTATION_SPEED, next));
}
