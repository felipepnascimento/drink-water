import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Child, DayProgress } from "./types";

const STORAGE_KEY = "@drink-water/app-state";

function makeDefaultChild(): Child {
  return {
    id: "child-1",
    name: "Minha criança",
    dailyGoalMl: 1000,
    drinkSizesMl: { small: 100, medium: 200, large: 350 },
  };
}

function defaultState(): AppState {
  const child = makeDefaultChild();
  return {
    children: [child],
    activeChildId: child.id,
    progress: {},
  };
}

export function todayKey(childId: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${childId}_${year}-${month}-${day}`;
}

export async function loadState(): Promise<AppState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getActiveChild(state: AppState): Child {
  const child = state.children.find((c) => c.id === state.activeChildId);
  return child ?? state.children[0];
}

export function getTodayProgress(state: AppState): DayProgress {
  const child = getActiveChild(state);
  const key = todayKey(child.id);
  return state.progress[key] ?? { amountMl: 0, drinks: [] };
}

export function addDrink(state: AppState, amountMl: number): AppState {
  const child = getActiveChild(state);
  const key = todayKey(child.id);
  const current = state.progress[key] ?? { amountMl: 0, drinks: [] };
  const updated: DayProgress = {
    amountMl: current.amountMl + amountMl,
    drinks: [...current.drinks, { amountMl, at: new Date().toISOString() }],
  };
  return {
    ...state,
    progress: { ...state.progress, [key]: updated },
  };
}

export function resetTodayProgress(state: AppState): AppState {
  const child = getActiveChild(state);
  const key = todayKey(child.id);
  const { [key]: _removed, ...restProgress } = state.progress;
  return { ...state, progress: restProgress };
}

export function updateActiveChild(
  state: AppState,
  changes: Partial<Pick<Child, "name" | "dailyGoalMl" | "drinkSizesMl">>,
): AppState {
  const activeChild = getActiveChild(state);
  return {
    ...state,
    children: state.children.map((c) =>
      c.id === activeChild.id ? { ...c, ...changes } : c,
    ),
  };
}
