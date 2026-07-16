export type DriveTuning = {
  accelerationForce: number;
  maxGroundSpeed: number;
  tractionLimit: number;
  throttleRampSeconds: number;
  rotationImpulse: number;
  maxRotationSpeed: number;
};

export const DEFAULT_DRIVE_TUNING: DriveTuning = {
  accelerationForce: 0.013,
  maxGroundSpeed: 26,
  tractionLimit: 0.006,
  throttleRampSeconds: 0.28,
  rotationImpulse: 0.00675,
  maxRotationSpeed: 0.0675,
};

export function nextThrottle(
  current: number,
  direction: -1 | 0 | 1,
  deltaSeconds: number,
  rampSeconds: number,
): number {
  const target = direction;
  const duration = direction === 0 ? Math.min(rampSeconds, 0.1) : rampSeconds;
  const step = duration <= 0 ? 1 : deltaSeconds / duration;
  if (current < target) return Math.min(target, current + step);
  if (current > target) return Math.max(target, current - step);
  return current;
}

export function driveForce(speed: number, throttle: number, tuning = DEFAULT_DRIVE_TUNING): number {
  if (throttle === 0) return 0;
  const movingWithThrottle = Math.sign(speed) === Math.sign(throttle);
  const speedRatio = movingWithThrottle ? Math.min(1, Math.abs(speed) / tuning.maxGroundSpeed) : 0;
  const governor = 1 - speedRatio ** 4;
  if (governor === 0) return 0;
  const requested = throttle * tuning.accelerationForce * governor;
  return Math.max(-tuning.tractionLimit, Math.min(tuning.tractionLimit, requested));
}

export function nextIdleLinearSpeed(horizontal: number, vertical: number): number {
  void vertical;
  return horizontal;
}

export function nextBikeAngularVelocity(
  current: number,
  direction: -1 | 0 | 1,
  tuning = DEFAULT_DRIVE_TUNING,
): number {
  const next = current + direction * tuning.rotationImpulse;
  return Math.max(-tuning.maxRotationSpeed, Math.min(tuning.maxRotationSpeed, next));
}
