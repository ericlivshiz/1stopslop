const MAX_DRIVE_SPEED = 0.14;
const DRIVE_RESPONSE = 0.1;
const IDLE_DAMPING = 0.82;
const STOP_THRESHOLD = 0.001;

export function nextWheelSpeed(current: number, direction: -1 | 0 | 1): number {
  if (direction === 0) {
    const damped = current * IDLE_DAMPING;
    return Math.abs(damped) < STOP_THRESHOLD ? 0 : damped;
  }

  const target = direction * MAX_DRIVE_SPEED;
  return current + (target - current) * DRIVE_RESPONSE;
}

export function nextIdleLinearSpeed(horizontal: number, vertical: number): number {
  if (Math.abs(vertical) > 0.6) return horizontal;
  const damped = horizontal * 0.75;
  return Math.abs(damped) < 0.01 ? 0 : damped;
}
