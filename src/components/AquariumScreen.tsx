"use client";

import { useEffect, useRef, useState } from "react";
import { DrinkButton } from "./DrinkButton";
import { FloatingDrop } from "./FloatingDrop";
import { SettingsModal } from "./SettingsModal";
import { WaterTank } from "./WaterTank";
import {
  addDrink,
  getActiveChild,
  getTodayProgress,
  loadState,
  resetTodayProgress,
  saveState,
  updateActiveChild,
} from "../lib/storage";
import { theme } from "../lib/theme";
import { AppState } from "../lib/types";
import styles from "./AquariumScreen.module.css";

const DRINK_SIZES = [
  { key: "small" as const, fillRatio: 0.35, iconSize: 32, borderColor: theme.drinkButtonBorder.small },
  { key: "medium" as const, fillRatio: 0.65, iconSize: 40, borderColor: theme.drinkButtonBorder.medium },
  { key: "large" as const, fillRatio: 1, iconSize: 48, borderColor: theme.drinkButtonBorder.large },
];

let dropIdCounter = 0;

export function AquariumScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drops, setDrops] = useState<{ id: number; left: number }[]>([]);
  const controlsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Read persisted state after mount: on the server `loadState()` returns
    // the default (no `window`), so this can't be a lazy initial state
    // without causing a hydration mismatch against real localStorage data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
  }, []);

  const persist = (next: AppState) => {
    setState(next);
    saveState(next);
  };

  if (!state) {
    return <div className={styles.screen} />;
  }

  const child = getActiveChild(state);
  const todayProgress = getTodayProgress(state);
  const progressRatio = Math.min(1, todayProgress.amountMl / child.dailyGoalMl);
  const goalReached = todayProgress.amountMl >= child.dailyGoalMl;

  const handleDrink = (amountMl: number, buttonIndex: number) => {
    persist(addDrink(state, amountMl));

    const controlsWidth = controlsRef.current?.offsetWidth ?? 0;
    if (controlsWidth > 0) {
      const buttonWidth = (controlsWidth - 16 * 2 - 10 * 2) / 3;
      const left = 16 + buttonIndex * (buttonWidth + 10) + buttonWidth / 2 - 13;
      setDrops((current) => [...current, { id: dropIdCounter++, left }]);
    }
  };

  const removeDrop = (id: number) => {
    setDrops((current) => current.filter((d) => d.id !== id));
  };

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <div>
          <div className={styles.childName}>{child.name}</div>
          <div className={styles.goalLabel}>meta de hoje</div>
        </div>
        <button
          type="button"
          className={styles.gearButton}
          aria-label="Ajustes"
          onClick={() => setSettingsVisible(true)}
        >
          ⚙️
        </button>
      </div>

      <div className={styles.tankWrapper}>
        <div className={styles.goalPill}>
          {todayProgress.amountMl} / {child.dailyGoalMl} ml
        </div>
        {goalReached && <div className={styles.cheer}>🎉</div>}
        <WaterTank progress={progressRatio} />
      </div>

      <div className={styles.controls} ref={controlsRef}>
        {DRINK_SIZES.map((size, index) => (
          <DrinkButton
            key={size.key}
            ariaLabel={`Beber ${size.key === "small" ? "pouca" : size.key === "medium" ? "média" : "muita"} água`}
            fillRatio={size.fillRatio}
            iconSize={size.iconSize}
            borderColor={size.borderColor}
            onDrink={() => handleDrink(child.drinkSizesMl[size.key], index)}
          />
        ))}
      </div>

      {drops.map((drop) => (
        <FloatingDrop key={drop.id} left={drop.left} onDone={() => removeDrop(drop.id)} />
      ))}

      {settingsVisible && (
        <SettingsModal
          childName={child.name}
          dailyGoalMl={child.dailyGoalMl}
          todayAmountMl={todayProgress.amountMl}
          onClose={() => setSettingsVisible(false)}
          onSave={(changes) => persist(updateActiveChild(state, changes))}
          onResetToday={() => persist(resetTodayProgress(state))}
        />
      )}
    </div>
  );
}
