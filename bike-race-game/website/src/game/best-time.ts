export const BEST_TIME_KEY = "bike-race-best-time-ms";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readBestTime(storage: StorageLike): number | null {
  try {
    const value = Number(storage.getItem(BEST_TIME_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function saveBestTime(storage: StorageLike, elapsedMs: number): number | null {
  const current = readBestTime(storage);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return current;
  if (current !== null && current <= elapsedMs) return current;

  try {
    storage.setItem(BEST_TIME_KEY, String(Math.round(elapsedMs)));
    return Math.round(elapsedMs);
  } catch {
    return current;
  }
}
