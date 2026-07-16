import { describe, expect, it } from "vitest";
import { readBestTime, saveBestTime, type StorageLike } from "./best-time";

function memoryStorage(initial?: string): StorageLike & { value: string | null } {
  return {
    value: initial ?? null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
  };
}

describe("best time persistence", () => {
  it("ignores missing, malformed, and non-positive values", () => {
    expect(readBestTime(memoryStorage())).toBeNull();
    expect(readBestTime(memoryStorage("oops"))).toBeNull();
    expect(readBestTime(memoryStorage("-4"))).toBeNull();
  });

  it("stores only a new fastest time", () => {
    const storage = memoryStorage("5200");
    expect(saveBestTime(storage, 6_000)).toBe(5_200);
    expect(saveBestTime(storage, 4_800)).toBe(4_800);
    expect(readBestTime(storage)).toBe(4_800);
  });
});
