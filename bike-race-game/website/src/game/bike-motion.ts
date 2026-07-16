const MAX_DRIVE_SPEED = 0.7;
const DRIVE_RESPONSE = 0.1;

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
