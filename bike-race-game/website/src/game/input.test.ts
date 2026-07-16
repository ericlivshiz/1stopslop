import { describe, expect, it } from "vitest";
import { clearControls, createControlState, keyToAction, setControlAction } from "./input";

describe("control input", () => {
  it("maps arrow and WASD aliases", () => {
    expect(keyToAction("ArrowRight")).toBe("forward");
    expect(keyToAction("d")).toBe("forward");
    expect(keyToAction("ArrowLeft")).toBe("backward");
    expect(keyToAction("a")).toBe("backward");
    expect(keyToAction("ArrowUp")).toBe("rotateBack");
    expect(keyToAction("s")).toBe("rotateForward");
  });

  it("tracks simultaneous actions and clears safely", () => {
    const moving = setControlAction(setControlAction(createControlState(), "forward", true), "rotateBack", true);
    expect(moving).toMatchObject({ forward: true, rotateBack: true });
    expect(setControlAction(moving, "rotateBack", false).forward).toBe(true);
    expect(clearControls(moving)).toEqual(createControlState());
  });
});
