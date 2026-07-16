# Bike Race Web Prototype Design

## Goal

Build a polished, original, physics-based motorcycle racing prototype for the web. The game should prioritize desktop browsers while remaining responsive and fully playable on mobile browsers.

The prototype succeeds when a player can load the page, learn the controls, complete a short course, crash and restart reliably, and replay to improve their best time without refreshing the page.

## Scope

The prototype includes:

- One original canyon-themed track designed for a 45–60 second first completion
- One motorcycle and rider
- Keyboard controls on desktop
- On-screen touch controls on mobile
- Acceleration, braking, airborne rotation, suspension, and crash physics
- Checkpoints, instant restart, race timer, finish state, and locally saved best time
- A responsive game canvas and interface
- Original visual assets and track design

The prototype does not include accounts, a backend, multiplayer, global leaderboards, unlockable bikes, progression, device-tilt controls, or multiple tracks.

## Technical Approach

Use Phaser as the game framework with Matter.js physics, embedded in the existing Next.js application.

Next.js owns the page shell, metadata, responsive layout, and React-based interface. Phaser owns the canvas, render loop, physics simulation, camera, scene lifecycle, and game-world input. React and Phaser communicate through a small typed event/state boundary rather than sharing mutable game objects.

This approach provides mature rendering, input, camera, animation, and physics capabilities without requiring custom engine infrastructure.

## Architecture

### GameCanvas

`GameCanvas` is a client-only React component. It creates one Phaser instance when mounted and destroys it when unmounted. It resizes the game viewport when its container changes size and prevents duplicate Phaser instances during React development lifecycle behavior.

### BootScene

`BootScene` loads the original game assets, prepares shared animations, and transitions to the race. Asset load failures display a clear retry state instead of leaving a blank canvas.

### RaceScene

`RaceScene` owns the active race. It creates the level, bike, checkpoints, finish line, camera, effects, and collision handlers. It publishes small race-state snapshots to React when user-visible state changes.

### BikeController

`BikeController` translates abstract input actions into physics behavior. Grounded throttle applies torque to the wheels. Brake input reduces wheel motion. In the air, forward and backward actions rotate the bike assembly. Control constants remain isolated so the handling can be tuned without changing scene logic.

### TrackBuilder

`TrackBuilder` creates collision geometry and visual track segments from reusable track definitions. The first course contains gentle slopes, a jump, a steep landing, a loop, and a final sprint. Checkpoints divide the course into safe restart positions.

### RaceState

`RaceState` represents whether the race is ready, running, crashed, or finished. It also stores elapsed time, the latest checkpoint, crash count, and best local time. Best time persists in `localStorage`; malformed or unavailable stored data is ignored safely.

### React HUD

React renders the timer, checkpoint feedback, restart action, mobile controls, and finish results above the game canvas. Touch controls appear for coarse-pointer/smaller-screen devices but remain usable in either portrait or landscape orientation.

## Gameplay

The player starts at the beginning of the course and races toward the finish line. Arrow keys and WASD provide equivalent desktop controls. Mobile players use large on-screen controls for throttle, brake, and forward/backward rotation.

The same directional actions serve two contexts:

- On the ground, forward and backward control acceleration and braking/reversing.
- In the air, forward and backward rotate the bike for landing alignment.

The bike uses two physical wheels connected to a chassis with constrained suspension. A crash occurs when the rider's head hits track geometry or the bike enters a clearly unrecoverable state. After a crash, the player can restart immediately at the most recently crossed checkpoint. Restart restores the bike to a stable pose with zero momentum.

Crossing the finish line stops the timer. The results overlay shows completion time, locally stored best time, and a replay action.

## Level Progression

The first course teaches mechanics in sequence:

1. Gentle terrain introduces acceleration and braking.
2. A small jump teaches airborne rotation and landing alignment.
3. A steeper landing tests speed control.
4. A loop combines momentum and orientation.
5. A short final sprint leads to the finish.

Checkpoint placement keeps restarts quick and avoids forcing players to repeat already-mastered sections after every crash.

## Visual and Audio Direction

The game uses an original “sunset canyon rally” identity rather than copying the appearance of an existing title.

- Coral and violet canyon silhouettes form layered parallax backgrounds.
- Dark painted-steel tracks use warm edge highlights.
- The bike uses a teal-and-cream palette with a compact cartoon rider.
- Suspension movement, dust trails, landing sparks, and restrained camera shake communicate impact and speed.
- The HUD stays minimal so the course remains the focus.
- The finish overlay pauses the race beneath a clean results card.

Initial assets may use crisp procedural shapes and small original sprite assets. Audio is limited to essential feedback such as engine pitch, landing impact, crash, checkpoint, and finish cues; the game remains understandable when muted.

## Responsive Behavior

Desktop is the primary experience. The game canvas fills the available content area while maintaining a useful gameplay aspect ratio. Keyboard help appears before the first run.

On mobile, the canvas scales to the viewport and the HUD avoids browser safe areas. Large touch targets sit near the lower corners without covering the bike. Orientation changes resize the game without resetting race progress. Portrait mode remains functional, though landscape may be suggested for the best view.

Device tilt is excluded from the prototype because browser permission and calibration behavior is inconsistent.

## Lifecycle and Failure Handling

- The simulation pauses when the page loses visibility and resumes without advancing the timer.
- Container resize and device rotation update the camera and renderer without rebuilding the race.
- Missing assets produce a retryable error state.
- Unavailable `localStorage` disables best-time persistence without preventing play.
- Input state resets on blur so controls cannot remain stuck.
- Phaser is destroyed on React unmount to prevent duplicate canvases, listeners, and physics loops.

## Verification

Automated checks cover:

- Input mapping for keyboard and touch actions
- Race-state transitions among ready, running, crashed, and finished
- Timer pausing and finish behavior
- Checkpoint advancement and restart placement
- Best-time parsing and persistence
- Track construction invariants, including checkpoint and finish ordering

Manual verification covers:

- Completing the course on a desktop browser with keyboard controls
- Completing or meaningfully playing the course at representative mobile viewport sizes with touch controls
- Repeated crashes and checkpoint restarts
- Resizing and rotating without losing progress
- Leaving and returning to the tab without timer drift or stuck input
- Replaying after finishing and recording a better local time
- Successful lint, test, and production-build commands

## Completion Criteria

The prototype is complete when:

- The full course is playable from start to finish.
- Bike handling is predictable enough that crashes feel attributable to player input.
- Crashes and checkpoint restarts work repeatedly without refreshing.
- Timer and local best-time results are accurate across replays.
- Desktop controls are polished and mobile controls are functional and responsive.
- The experience uses original visuals and a distinct Bike Race identity.
- Automated checks, lint, and the production build pass.
