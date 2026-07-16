# Bike Race Web Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, original one-track motorcycle racing prototype that prioritizes desktop browsers and remains playable on mobile.

**Architecture:** Next.js renders the page shell and React HUD while a client-only Phaser game owns rendering, Matter physics, camera, and scene lifecycle. Pure TypeScript modules hold race state, input mapping, persistence, and track data so core behavior can be tested outside the canvas.

**Tech Stack:** Next.js 16, React 19, TypeScript, Phaser 3 with Matter.js, Vitest, Testing Library, ESLint

## Global Constraints

- Desktop keyboard play is the primary experience; touch play must remain functional and responsive.
- Include exactly one original canyon-themed track and one motorcycle/rider.
- Include checkpoints, crash/restart, timer, finish state, and a locally stored best time.
- Do not add accounts, a backend, multiplayer, progression, device tilt, or multiple tracks.
- Use an original sunset-canyon visual identity and original procedural artwork.

---

### Task 1: Test Harness and Pure Race Model

**Files:**
- Modify: `bike-race-game/website/package.json`
- Modify: `bike-race-game/website/package-lock.json`
- Create: `bike-race-game/website/vitest.config.ts`
- Create: `bike-race-game/website/src/game/race-state.ts`
- Create: `bike-race-game/website/src/game/race-state.test.ts`
- Create: `bike-race-game/website/src/game/best-time.ts`
- Create: `bike-race-game/website/src/game/best-time.test.ts`

**Interfaces:**
- Produces: `RaceSnapshot`, `createRaceState()`, `startRace()`, `advanceCheckpoint()`, `crashRace()`, `finishRace()`, `restartRace()`, `readBestTime()`, and `saveBestTime()`.

- [ ] **Step 1: Install test and game dependencies**

Run: `npm install phaser && npm install --save-dev vitest`
Expected: `package.json` contains Phaser and Vitest and the lockfile resolves both.

- [ ] **Step 2: Add a test script and Vitest configuration**

Add `"test": "vitest run"` to `scripts`. Configure `vitest.config.ts` with `environment: "node"` and `include: ["src/**/*.test.ts"]`.

- [ ] **Step 3: Write failing race-state and persistence tests**

Cover the ready → running → crashed/restarted → finished flow, monotonic checkpoint advancement, finish-time retention, safe parsing of local storage, and only replacing a best time when the new time is lower.

- [ ] **Step 4: Run tests to verify failure**

Run: `npm test`
Expected: FAIL because the race-state and persistence modules do not exist.

- [ ] **Step 5: Implement the minimal pure modules**

Use discriminated status values `ready | running | crashed | finished`. Keep elapsed time in integer milliseconds, preserve the latest checkpoint on crash, and inject a storage-shaped object into persistence helpers so browser APIs are not required in tests.

- [ ] **Step 6: Run tests and commit**

Run: `npm test`
Expected: PASS.

Commit: `git commit -m "feat: add race state model"`

### Task 2: Input Model and Track Definition

**Files:**
- Create: `bike-race-game/website/src/game/input.ts`
- Create: `bike-race-game/website/src/game/input.test.ts`
- Create: `bike-race-game/website/src/game/track.ts`
- Create: `bike-race-game/website/src/game/track.test.ts`

**Interfaces:**
- Produces: `ControlState`, `createControlState()`, `setControlAction()`, `clearControls()`, `TrackPoint`, `CheckpointDefinition`, and `CANYON_TRACK`.

- [ ] **Step 1: Write failing input tests**

Assert Arrow/WASD aliases map to `forward` and `backward`, simultaneous actions can coexist, pointer release clears its action, and blur clears all actions.

- [ ] **Step 2: Write failing track invariant tests**

Assert the track begins at x=0, x coordinates increase, at least three checkpoints are ordered within track bounds, and the finish lies beyond the final checkpoint.

- [ ] **Step 3: Run tests to verify failure**

Run: `npm test`
Expected: FAIL because input and track modules do not exist.

- [ ] **Step 4: Implement input and track modules**

Create immutable control updates and define one canyon course as sampled points plus spawn transforms, checkpoint x positions, and a finish x position. Include slopes, jump gaps, a broad loop-shaped obstacle section, and a final sprint.

- [ ] **Step 5: Run tests and commit**

Run: `npm test`
Expected: PASS.

Commit: `git commit -m "feat: define controls and canyon track"`

### Task 3: Phaser Game Runtime

**Files:**
- Create: `bike-race-game/website/src/game/events.ts`
- Create: `bike-race-game/website/src/game/BootScene.ts`
- Create: `bike-race-game/website/src/game/TrackBuilder.ts`
- Create: `bike-race-game/website/src/game/BikeController.ts`
- Create: `bike-race-game/website/src/game/RaceScene.ts`
- Create: `bike-race-game/website/src/game/create-game.ts`
- Create: `bike-race-game/website/src/components/GameCanvas.tsx`

**Interfaces:**
- Consumes: `ControlState`, `CANYON_TRACK`, and race-state transition helpers.
- Produces: `gameEvents` with `snapshot` and `asset-error` events, `setGameControls(state)`, `restartGame()`, and the `GameCanvas` component.

- [ ] **Step 1: Create the typed UI/game event boundary**

Expose subscribe/unsubscribe helpers for race snapshots and commands without importing Phaser into React HUD modules.

- [ ] **Step 2: Build procedural assets in BootScene**

Generate bike, wheel, rider, dust, spark, checkpoint, and finish textures with Phaser graphics so the prototype has no copied artwork or fragile remote assets.

- [ ] **Step 3: Build collision terrain**

Convert the track definition into static Matter bodies and matching painted-steel render shapes. Add checkpoint and finish sensors.

- [ ] **Step 4: Build bike physics and control**

Create two circular wheels, a chassis, rider body/head, constraints, wheel torque, grounded braking, airborne rotation, head-impact crash detection, stable checkpoint respawn, dust, sparks, and engine pitch.

- [ ] **Step 5: Build race scene and camera**

Create parallax canyon layers, track, bike, sensors, timer updates, camera follow/zoom, bounded camera shake, pause-on-hidden behavior, and finish handling.

- [ ] **Step 6: Mount Phaser safely from React**

Create the game only in the browser, create exactly one instance per mounted canvas, resize from `ResizeObserver`, and destroy the game and listeners on unmount.

- [ ] **Step 7: Verify and commit**

Run: `npm test && npm run lint`
Expected: PASS.

Commit: `git commit -m "feat: add bike race game runtime"`

### Task 4: Responsive HUD and Original Page Design

**Files:**
- Modify: `bike-race-game/website/src/app/page.tsx`
- Modify: `bike-race-game/website/src/app/globals.css`
- Modify: `bike-race-game/website/src/app/layout.tsx`
- Create: `bike-race-game/website/src/components/RaceGame.tsx`
- Create: `bike-race-game/website/src/components/RaceHud.tsx`
- Create: `bike-race-game/website/src/components/TouchControls.tsx`

**Interfaces:**
- Consumes: `GameCanvas`, `gameEvents`, `setGameControls()`, `restartGame()`, `readBestTime()`, and `saveBestTime()`.
- Produces: the complete playable `/` route.

- [ ] **Step 1: Replace the starter page with the game shell**

Add the sunset-canyon header, desktop control legend, responsive game frame, loading presentation, and accessible status text.

- [ ] **Step 2: Implement HUD state flow**

Subscribe to race snapshots, render the timer/checkpoint/crash status, persist a better finish time, and show a replay results card.

- [ ] **Step 3: Implement responsive controls**

Support keyboard keydown/keyup with blur reset. Add large pointer-safe mobile buttons for backward, forward, rotate back, and rotate forward, including pointer-cancel cleanup and accessible labels.

- [ ] **Step 4: Apply responsive styling**

Create the original coral/violet visual system, safe-area-aware touch controls, desktop-first 16:9 frame, functional portrait layout, focus states, reduced-motion handling, and no horizontal overflow.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run lint && npm run build`
Expected: all commands pass and `/` is statically generated.

Commit: `git commit -m "feat: add responsive bike race interface"`

### Task 5: Browser Playtest and Tuning

**Files:**
- Modify as evidence requires: `bike-race-game/website/src/game/BikeController.ts`
- Modify as evidence requires: `bike-race-game/website/src/game/RaceScene.ts`
- Modify as evidence requires: `bike-race-game/website/src/game/track.ts`
- Modify as evidence requires: `bike-race-game/website/src/app/globals.css`

**Interfaces:**
- Consumes: the complete game.
- Produces: tuned desktop and mobile gameplay satisfying the design completion criteria.

- [ ] **Step 1: Run the production-like local server**

Run: `npm run dev`
Expected: Next.js serves the game without runtime errors.

- [ ] **Step 2: Playtest desktop behavior**

Verify keyboard controls, all course sections, checkpoints, repeated crash/restart, finish timing, replay, tab pause, resize, and best-time persistence.

- [ ] **Step 3: Playtest mobile viewports**

Verify 390×844 portrait and 844×390 landscape layouts, touch press/release/cancel behavior, safe areas, readable HUD, and absence of page scrolling during control input.

- [ ] **Step 4: Tune only evidenced problems**

Adjust named physics constants, checkpoint poses, camera damping, or responsive CSS based on reproducible playtest findings. Add regression tests for any pure-state defect.

- [ ] **Step 5: Run final verification and commit**

Run: `npm test && npm run lint && npm run build`
Expected: all commands pass.

Commit: `git commit -m "fix: tune bike race prototype"`
