# Martian Game — MVP (Plain Language)

## What we’re building first

A short, chaotic co-op game where **4 friends crash on Mars**, each with a different job, and have to keep the base alive through a few days of disasters until they can call for rescue.

If the game works, you should hear people yelling across Discord/voice chat the whole time.

---

## The one question the MVP answers

> Can specialized roles + partial information + disasters create fun, clip-worthy multiplayer without a huge survival sandbox?

If yes, we expand. If no, we rethink before building biomes, vehicles, and a full rocket tree.

---

## Who can play

- **4 players** (fixed party size for MVP)
- Online session (host or lobby)
- Voice chat expected (we don’t build voice ourselves)

---

## What each person does

We ship **4 jobs** only:

1. **Engineer** — keep power and systems alive  
2. **Botanist** — grow food and oxygen plants  
3. **Chemist** — make fuel / batteries / basic meds components  
4. **Medic** — keep people from dying weirdly  

Pilot and Geologist wait for later.

Each job has **one simple minigame**, not “hold E to interact.”

---

## How a match feels

A match is about **30–40 minutes**.

- A **day** lasts ~6 minutes.
- You try to survive **5 days**.
- Survive 5 days → escape / win.
- If oxygen collapses, power dies for good, or the crew is wiped → lose.

During a day players:
1. Check their special screens (only they can see their crisis info)
2. Fix their systems with a minigame
3. Trade what they need with the rest of the crew
4. Respond when a disaster hits
5. Night falls → next disaster rolls in

---

## The resource loop (kept tiny on purpose)

Everything depends on someone else:

```
Water (shared base supply)
  ↓
Botanist grows algae / plants
  ↓
Plants make oxygen + food
  ↓
Chemist turns algae into fuel / batteries
  ↓
Engineer burns fuel to keep power up
  ↓
Power keeps life support / greenhouse / medbay running
  ↓
Medic keeps people functional so they can do their jobs
```

No wood chopping. No giant crafting menus. Just this fragile chain.

---

## Disasters in the MVP

Only a small set, but they hit hard:

1. **Oxygen leak**
2. **Power outage / generator failure**
3. **Plant blight**
4. **Disease outbreak**
5. **Dust storm** (blocks outdoor work / stresses systems)

Every disaster is designed so **at least two jobs must talk**.

---

## Death and failure (funny, not a gray HP bar)

Players don’t just “lose hearts.”

They can:
- Suffocate slowly
- Get radiation / spore sickness
- Hallucinate (UI gets unreliable)
- Overheat or freeze from suit failure

Downed players can be revived by the Medic if the crew acts fast. Total wipe = run over.

---

## What is intentionally *not* in the MVP

To keep scope sane, we skip:

- 6–8 player lobbies
- Pilot / Geologist
- Full research tree to a rocket
- Vehicles / rovers
- Big procedural planets and many biomes
- Deep combat / alien hunting
- Cosmetics / meta progression unlocks
- Nightmare difficulty modes
- Huge crafting catalogs

Those are post-MVP once the core loop is proven fun.

---

## Win / lose in simple terms

| Outcome | What happened |
|---|---|
| **Win** | Crew survives 5 days and completes the rescue beacon |
| **Lose** | Base life support fails permanently, or all players are down |

---

## Success looks like

After a playtest, players say things like:

- “Wait don’t open that door”
- “Who used the last battery”
- “The greenhouse is dying and I can’t leave sickbay”
- “We had ten seconds of oxygen”

If sessions are quiet and solitary, the MVP failed.  
If sessions are loud and interdependent, the MVP worked.
