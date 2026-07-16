import { expect, it } from "vitest";
import { formatRaceTime } from "./format-time";

it("formats milliseconds as minutes, seconds, and hundredths", () => {
  expect(formatRaceTime(0)).toBe("0:00.00");
  expect(formatRaceTime(65_432)).toBe("1:05.43");
});
