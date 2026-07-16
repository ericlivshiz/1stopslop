import type { ControlState } from "./input";
import type { RaceSnapshot } from "./race-state";
import { DEFAULT_DRIVE_TUNING, type DriveTuning } from "./bike-motion";

type Unsubscribe = () => void;

const controlListeners = new Set<(state: ControlState) => void>();
const restartListeners = new Set<() => void>();
const snapshotListeners = new Set<(snapshot: RaceSnapshot) => void>();
const tuningListeners = new Set<(tuning: DriveTuning) => void>();
let driveTuning = DEFAULT_DRIVE_TUNING;

function subscribe<T>(listeners: Set<(value: T) => void>, listener: (value: T) => void): Unsubscribe {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const gameEvents = {
  getDriveTuning() {
    return driveTuning;
  },
  setDriveTuning(tuning: DriveTuning) {
    driveTuning = tuning;
    tuningListeners.forEach((listener) => listener(tuning));
  },
  onDriveTuning(listener: (tuning: DriveTuning) => void) {
    return subscribe(tuningListeners, listener);
  },
  setControls(state: ControlState) {
    controlListeners.forEach((listener) => listener(state));
  },
  onControls(listener: (state: ControlState) => void) {
    return subscribe(controlListeners, listener);
  },
  restart() {
    restartListeners.forEach((listener) => listener());
  },
  onRestart(listener: () => void): Unsubscribe {
    restartListeners.add(listener);
    return () => restartListeners.delete(listener);
  },
  publishSnapshot(snapshot: RaceSnapshot) {
    snapshotListeners.forEach((listener) => listener(snapshot));
  },
  onSnapshot(listener: (snapshot: RaceSnapshot) => void) {
    return subscribe(snapshotListeners, listener);
  },
};
