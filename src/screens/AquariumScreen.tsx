import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrinkButton } from "../components/DrinkButton";
import { SettingsModal } from "../components/SettingsModal";
import { WaterTank } from "../components/WaterTank";
import {
  addDrink,
  getActiveChild,
  getTodayProgress,
  loadState,
  saveState,
  updateActiveChild,
} from "../storage";
import { theme } from "../theme";
import { AppState } from "../types";

export function AquariumScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    loadState().then(setState);
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  if (!state) {
    return <View style={styles.screen} />;
  }

  const child = getActiveChild(state);
  const todayProgress = getTodayProgress(state);
  const progressRatio = Math.min(1, todayProgress.amountMl / child.dailyGoalMl);
  const goalReached = todayProgress.amountMl >= child.dailyGoalMl;

  const handleDrink = (amountMl: number) => {
    persist(addDrink(state, amountMl));
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

      <View style={styles.controls}>
        <DrinkButton
          label="Pouca"
          amountMl={child.drinkSizesMl.small}
          colors={theme.drinkButton.small as [string, string]}
          onPress={() => handleDrink(child.drinkSizesMl.small)}
        />
        <DrinkButton
          label="Média"
          amountMl={child.drinkSizesMl.medium}
          colors={theme.drinkButton.medium as [string, string]}
          onPress={() => handleDrink(child.drinkSizesMl.medium)}
        />
        <DrinkButton
          label="Muita"
          amountMl={child.drinkSizesMl.large}
          colors={theme.drinkButton.large as [string, string]}
          onPress={() => handleDrink(child.drinkSizesMl.large)}
        />
      </View>

      <SettingsModal
        visible={settingsVisible}
        childName={child.name}
        dailyGoalMl={child.dailyGoalMl}
        onClose={() => setSettingsVisible(false)}
        onSave={(changes) => persist(updateActiveChild(state, changes))}
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
