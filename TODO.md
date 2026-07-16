# Water Tank — plan and TODO

PWA (Next.js) to encourage a small child to drink water. Single screen
with an animated fish tank: the water rises as the child drinks, until
she hits the daily goal. No backend — everything is saved in the browser
(`localStorage`).

Code (variables, components, files) in **English**. Text shown on screen
in **pt-BR**.

## Stack

- Next.js (App Router + TypeScript), deployed on Vercel
- `localStorage` for local persistence (no backend, no account)
- SVG + CSS (keyframes/transitions) for the fish, the water, and the
  animations — no external animation libraries
- Web Speech API + synthesized audio for the drink chime and voice
  narration
- Custom manifest + service worker to install as a PWA (no `next-pwa`)

> This used to be an Expo/React Native app — migrated to Next.js to run
> as a PWA (installs straight from the browser, no Expo Go/App
> Store/SDK compatibility issues) and to get continuous deploys on
> Vercel.

## Local data model

```ts
type Child = { id: string; name: string; dailyGoalMl: number };

type Drink = { amountMl: number; at: string /* ISO timestamp */ };

type DayProgress = { amountMl: number; drinks: Drink[] };

type AppState = {
  children: Child[];
  activeChildId: string;
  // key: `${childId}_${YYYY-MM-DD}`
  progress: Record<string, DayProgress>;
};
```

The daily reset is automatic: each day becomes a new key in `progress`,
no manual reset needed.

## MVP — single screen

- [x] Discreet header: active child's name + gear icon (⚙️) only for the
      adult to configure goal/profiles.
- [x] Tank: water level = `amountMl / dailyGoalMl`, with a smooth rising
      animation on every tap.
- [x] Swimming fish (SVG + CSS keyframes), several in the same tank for
      liveliness.
- [x] 3 fixed cup buttons (small / medium / large, no text — the child
      can't read yet): values editable in settings.
- [x] No numbers on the main screen for the child — just the drawing
      rising.
- [x] Celebration on hitting 100% of the goal (🎉), with a randomized,
      name-personalized message read aloud.
- [x] Animated reaction on drinking: cup bounces, a drop floats up, the
      tank does a "gulp" (bounce + flash), extra bubbles in the water,
      plus a chime and voice narration.
- [x] Settings modal (adult): set the daily goal in ml, edit the child's
      name, configure the ml amount for each cup size, **reset today's
      water**.
- [x] Persistence via `localStorage`, automatic reset at midnight (based
      on the day's date).
- [x] Installable PWA (manifest + icons + basic service worker).
- [ ] Register/edit multiple child profiles from settings.

## Out of MVP (backlog for later)

- [ ] Notification reminding to drink water (Web Push — needs user
      permission and is limited on iOS Safari).
- [ ] Simple weekly history (how many days the goal was hit).
- [ ] Multiple tank themes (day/night, ocean floor, etc).
- [ ] Support for more than one child with quick profile switching on
      the main screen (currently only switchable via settings).
- [ ] Export/backup progress (e.g. share a summary as an image).

## Decisions already made

- No backend, no login — 100% offline, single device/browser.
- Free app, no ads planned for the MVP.
- Single screen; settings live behind the gear icon so they don't
  distract the child.
- PWA instead of a native app: installs straight from Safari/Chrome, no
  store and no native builds; deploying is just a push (Vercel builds
  and publishes).
