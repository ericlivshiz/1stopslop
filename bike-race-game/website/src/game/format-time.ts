export function formatRaceTime(elapsedMs: number): string {
  const safeMs = Math.max(0, Math.floor(elapsedMs));
  const minutes = Math.floor(safeMs / 60_000);
  const seconds = Math.floor((safeMs % 60_000) / 1_000);
  const hundredths = Math.floor((safeMs % 1_000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
}
