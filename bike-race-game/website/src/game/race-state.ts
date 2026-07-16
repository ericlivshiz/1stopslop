export type RaceStatus = "ready" | "running" | "crashed" | "finished";

export interface RaceSnapshot {
  status: RaceStatus;
  checkpoint: number;
  elapsedMs: number;
  startedAt: number | null;
  crashes: number;
}

export function createRaceState(): RaceSnapshot {
  return { status: "ready", checkpoint: 0, elapsedMs: 0, startedAt: null, crashes: 0 };
}

export function startRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "ready") return state;
  return { ...state, status: "running", startedAt: now };
}

export function advanceCheckpoint(state: RaceSnapshot, checkpoint: number): RaceSnapshot {
  return { ...state, checkpoint: Math.max(state.checkpoint, checkpoint) };
}

function elapsedAt(state: RaceSnapshot, now: number) {
  return state.startedAt === null ? state.elapsedMs : Math.max(0, now - state.startedAt);
}

export function crashRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "running") return state;
  return {
    ...state,
    status: "crashed",
    elapsedMs: elapsedAt(state, now),
    startedAt: null,
    crashes: state.crashes + 1,
  };
}

export function restartRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "crashed") return state;
  return { ...state, status: "running", startedAt: now - state.elapsedMs };
}

export function finishRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "running") return state;
  return { ...state, status: "finished", elapsedMs: elapsedAt(state, now), startedAt: null };
}

export function suspendRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "running" || state.startedAt === null) return state;
  return { ...state, elapsedMs: elapsedAt(state, now), startedAt: null };
}

export function resumeRace(state: RaceSnapshot, now: number): RaceSnapshot {
  if (state.status !== "running" || state.startedAt !== null) return state;
  return { ...state, startedAt: now - state.elapsedMs };
}

export function elapsedRaceTime(state: RaceSnapshot, now: number): number {
  return state.status === "running" ? elapsedAt(state, now) : state.elapsedMs;
}
