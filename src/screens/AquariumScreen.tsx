import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrinkButton } from "../components/DrinkButton";
import { FloatingDrop } from "../components/FloatingDrop";
import { SettingsModal } from "../components/SettingsModal";
import { WaterTank } from "../components/WaterTank";
import {
  addDrink,
  getActiveChild,
  getTodayProgress,
  loadState,
  resetTodayProgress,
  saveState,
  updateActiveChild,
} from "../storage";
import { theme } from "../theme";
import { AppState } from "../types";

const DRINK_SIZES = [
  { key: "small" as const, fillRatio: 0.35, iconSize: 32, borderColor: theme.drinkButtonBorder.small },
  { key: "medium" as const, fillRatio: 0.65, iconSize: 40, borderColor: theme.drinkButtonBorder.medium },
  { key: "large" as const, fillRatio: 1, iconSize: 48, borderColor: theme.drinkButtonBorder.large },
];

let dropIdCounter = 0;

export function AquariumScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [controlsWidth, setControlsWidth] = useState(0);
  const [drops, setDrops] = useState<{ id: number; left: number }[]>([]);
  const stateRef = useRef<AppState | null>(null);
  stateRef.current = state;

  useEffect(() => {
    loadState().then(setState);
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  const onControlsLayout = (event: LayoutChangeEvent) => {
    setControlsWidth(event.nativeEvent.layout.width);
  };

  if (!state) {
    return <View style={styles.screen} />;
  }

  const child = getActiveChild(state);
  const todayProgress = getTodayProgress(state);
  const progressRatio = Math.min(1, todayProgress.amountMl / child.dailyGoalMl);
  const goalReached = todayProgress.amountMl >= child.dailyGoalMl;

  const handleDrink = (amountMl: number, buttonIndex: number) => {
    if (!stateRef.current) return;
    persist(addDrink(stateRef.current, amountMl));

    if (controlsWidth > 0) {
      const buttonWidth = (controlsWidth - 16 * 2 - 10 * 2) / 3;
      const left =
        16 + buttonIndex * (buttonWidth + 10) + buttonWidth / 2 - 13;
      setDrops((current) => [...current, { id: dropIdCounter++, left }]);
    }
  };

  const removeDrop = (id: number) => {
    setDrops((current) => current.filter((d) => d.id !== id));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.goalLabel}>meta de hoje</Text>
        </View>
        <Pressable style={styles.gearButton} onPress={() => setSettingsVisible(true)}>
          <Text style={styles.gearIcon}>⚙️</Text>
        </Pressable>
      </View>

      <View style={styles.tankWrapper}>
        <View style={styles.goalPill}>
          <Text style={styles.goalPillText}>
            {todayProgress.amountMl} / {child.dailyGoalMl} ml
          </Text>
        </View>
        {goalReached && (
          <View style={styles.cheer}>
            <Text style={styles.cheerText}>🎉</Text>
          </View>
        )}
        <WaterTank progress={progressRatio} />
      </View>

      <View style={styles.controls} onLayout={onControlsLayout}>
        {DRINK_SIZES.map((size, index) => (
          <DrinkButton
            key={size.key}
            accessibilityLabel={`Beber ${size.key === "small" ? "pouca" : size.key === "medium" ? "média" : "muita"} água`}
            fillRatio={size.fillRatio}
            iconSize={size.iconSize}
            borderColor={size.borderColor}
            onPress={() => handleDrink(child.drinkSizesMl[size.key], index)}
          />
        ))}
      </View>

      {drops.map((drop) => (
        <FloatingDrop key={drop.id} left={drop.left} onDone={() => removeDrop(drop.id)} />
      ))}

      <SettingsModal
        visible={settingsVisible}
        childName={child.name}
        dailyGoalMl={child.dailyGoalMl}
        todayAmountMl={todayProgress.amountMl}
        onClose={() => setSettingsVisible(false)}
        onSave={(changes) => persist(updateActiveChild(state, changes))}
        onResetToday={() => persist(resetTodayProgress(state))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  childName: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.ink,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gearButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.paper,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  gearIcon: {
    fontSize: 15,
  },
  tankWrapper: {
    flex: 1,
    marginTop: 8,
  },
  goalPill: {
    position: "absolute",
    top: 14,
    right: 28,
    zIndex: 4,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  goalPillText: {
    color: theme.waterDeep,
    fontWeight: "800",
    fontSize: 11,
  },
  cheer: {
    position: "absolute",
    top: 12,
    left: 28,
    zIndex: 4,
  },
  cheerText: {
    fontSize: 22,
  },
  controls: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
