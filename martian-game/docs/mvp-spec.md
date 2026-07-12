# Martian Game — MVP High-Level Specification

## 1. Goal

Ship a playable **4-player online co-op** prototype that proves:

1. Role specialization creates dependence  
2. Partial information forces communication  
3. Short day cycles + disasters create constant pressure  
4. Simple interconnected resources beat generic crafting grind  

Target session length: **30–40 minutes**.

---

## 2. Product Scope

### In scope
- 4-player online match
- 4 professions
- Shared base systems (oxygen, power, food, water, medical)
- Day/night loop (5 days to win)
- 5 disaster types
- 1 primary minigame per profession
- Status ailments (non-HP-primary failure states)
- Rescue beacon win condition on Day 5

### Out of scope
- 5–8 player modes
- Pilot / Geologist
- Procedural multi-biome exploration
- Vehicles, satellites, full rocket research tree
- Deep combat AI
- Meta progression / cosmetics
- Dedicated voice stack

---

## 3. Match Structure

| Parameter | MVP value |
|---|---|
| Players | Exactly 4 |
| Day length | ~6 minutes |
| Days to win | 5 |
| Night phase | ~30–60 seconds (disaster resolve / next threat reveal) |
| Roles | Engineer, Botanist, Chemist, Medic (1 each) |

### Day phases (soft, not hard-gated)
1. Status check (role-unique UI)
2. Maintenance / production minigames
3. Resource handoff / shared storage use
4. Disaster event
5. Recovery / prep for night

---

## 4. Roles & Partial Information

Each role has a **private panel** other players cannot open.

| Role | Private info | Primary responsibility | Primary minigame |
|---|---|---|---|
| Engineer | Power graph, generator health, circuit faults | Keep power online | Reroute power / fix circuit |
| Botanist | Plant health, disease type, nutrient balance | Food + oxygen production | Identify disease / balance nutrients |
| Chemist | Formula station, fuel/battery output, contamination | Convert algae → fuel/batteries/med components | Combine chemicals |
| Medic | Vitals, infection type, treatment recipe | Stabilize crew ailments | Diagnose + apply antidote/surgery step |

### Shared info (everyone can see)
- Rough base oxygen %
- Rough power %
- Day timer
- Active disaster banner
- Shared storage counts (water, food, fuel, batteries, algae)

---

## 5. Systems Model

### 5.1 Core resources
- `water`
- `algae`
- `food`
- `oxygen` (atmospheric level)
- `fuel`
- `batteries`
- `med_components`

### 5.2 Dependency graph
```
water → botanist production → algae + food + oxygen contribution
algae → chemist conversion → fuel + batteries + med_components
fuel/batteries → engineer power plant → power
power → greenhouse, chem lab, medbay, life support pumps
crew health → medic → keeps roles able to act
```

### 5.3 Critical failure thresholds
- Oxygen ≤ 0 for sustained period → crew starts suffocating
- Power offline too long → life support / greenhouse / labs degrade
- Food = 0 → weakness / slowed minigame performance
- Unresolved disease → escalating ailments / downs

---

## 6. Disasters

| Disaster | Primary pressure | Needs communication from |
|---|---|---|
| Oxygen leak | Oxygen drain accelerates | Engineer + Botanist |
| Generator failure | Power collapse | Engineer + Chemist (fuel/batteries) |
| Plant blight | Oxygen/food production tanks | Botanist + Chemist (treatments) |
| Disease outbreak | Multiple players afflicted | Medic + Chemist |
| Dust storm | Outdoor tasks blocked; systems stressed | All (priority call by whoever sees first) |

### Disaster rules
- Exactly **one major disaster** resolves per day (may start late day / early night)
- Disaster intensity scales mildly by day number (Day 1 soft → Day 5 hard)
- Disaster always creates a **cross-role dependency**

---

## 7. Player States (instead of plain HP)

Players have condition flags, not just a health number.

Examples:
- `suffocating`
- `irradiated` / `spore_sick`
- `hallucinating` (UI noise / false warnings)
- `overheating` / `freezing`
- `downed` (revivable)
- `dead` (if unrecovered past timer / total wipe)

Design intent: failures produce readable, funny moments and clip-worthy panic.

---

## 8. Win / Lose Conditions

### Win
- Survive through Day 5
- Complete Rescue Beacon sequence (short multi-role checklist in final minutes)

### Lose
- All players `downed`/`dead`
- Or irreversible base collapse (oxygen + power both failed beyond recovery window)

---

## 9. Interaction Rules (anti-grind)

- No long hold-to-gather loops
- No large crafting trees
- Production happens through **short minigames** (target 10–40 seconds)
- Shared storage is the main transfer mechanism (no complex inventory tetris)
- Exploration radius is limited to a small exterior ring around the base (optional scrap/event pickup only)

---

## 10. Technical High-Level Shape

### Likely stack (subject to change)
- Client: web or game client (current repo has Next.js under `martian-game/website` for web surface)
- Realtime session sync required (shared world/base state)
- Authoritative simulation for resources, disasters, and role private state

### Networking requirements (MVP)
- Lobby create/join for 4 players
- Role assignment (manual pick or random unique roles)
- Replicated shared systems state
- Role-private state visible only to owning client
- Host migration optional (can be host-authoritative for MVP)

### Persistence
- None required beyond match lifetime for MVP

---

## 11. UX Requirements

- Big readable disaster alerts
- Loud/clear timers (“90 seconds to storm”)
- Role panels are distinct and glanceable
- Failures communicate cause (“oxygen leak in greenhouse”) not just numbers
- Accidental sabotage possible (venting, wrong chem mix, bad power route) but recoverable if crew responds

---

## 12. Playtest Acceptance Criteria

The MVP is considered successful if, in playtests:

1. Players talk continuously about systems they alone can see  
2. At least 3 distinct “clip moments” occur per match on average  
3. Average match ends by Day 3–5 (not instant fail, not trivial win)  
4. Players can explain how their job depends on another job  
5. Sessions feel busy every minute (no long idle crafting stretches)

---

## 13. Delivery Breakdown (suggested)

1. **Vertical slice day** — 1 day, 2 roles, 1 disaster, shared oxygen/power  
2. **Full 4-role loop** — full dependency chain + all role minigames  
3. **5-day match** — disaster rotation + win/lose  
4. **Playtest polish** — clarity, timing, funny failure states  

---

## 14. Open Decisions (tracked, not blocking concept)

- Exact networking backend
- 2D vs 3D presentation for MVP
- Whether exterior exploration is included in first vertical slice or deferred one slice
- Whether rescue beacon is a multi-step ritual or a single end-of-Day-5 event
