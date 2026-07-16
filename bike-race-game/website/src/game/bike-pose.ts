interface BikePose {
  x: number;
  y: number;
  angle: number;
}

interface LocalPoint {
  x: number;
  y: number;
}

export function worldPointFromBike(pose: BikePose, point: LocalPoint): { x: number; y: number } {
  const cos = Math.cos(pose.angle);
  const sin = Math.sin(pose.angle);
  return {
    x: pose.x + point.x * cos - point.y * sin,
    y: pose.y + point.x * sin + point.y * cos,
  };
}
