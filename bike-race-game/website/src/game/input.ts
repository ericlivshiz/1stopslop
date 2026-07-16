export type ControlAction = "forward" | "backward" | "rotateBack" | "rotateForward";

export type ControlState = Record<ControlAction, boolean>;

export function createControlState(): ControlState {
  return { forward: false, backward: false, rotateBack: false, rotateForward: false };
}

export function setControlAction(
  state: ControlState,
  action: ControlAction,
  pressed: boolean,
): ControlState {
  return { ...state, [action]: pressed };
}

export function clearControls(state?: ControlState): ControlState {
  void state;
  return createControlState();
}

const KEY_ACTIONS: Record<string, ControlAction> = {
  arrowright: "forward",
  d: "forward",
  arrowleft: "backward",
  a: "backward",
  arrowup: "rotateBack",
  w: "rotateBack",
  arrowdown: "rotateForward",
  s: "rotateForward",
};

export function keyToAction(key: string): ControlAction | null {
  return KEY_ACTIONS[key.toLowerCase()] ?? null;
}
