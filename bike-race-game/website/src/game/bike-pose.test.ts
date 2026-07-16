import { expect, it } from "vitest";
import { worldPointFromBike } from "./bike-pose";

it("keeps rider offsets rigidly mounted as the bike rotates", () => {
  expect(worldPointFromBike({ x: 100, y: 200, angle: 0 }, { x: -4, y: -38 })).toEqual({ x: 96, y: 162 });
  const quarterTurn = worldPointFromBike(
    { x: 100, y: 200, angle: Math.PI / 2 },
    { x: -4, y: -38 },
  );
  expect(quarterTurn.x).toBeCloseTo(138);
  expect(quarterTurn.y).toBeCloseTo(196);
});
