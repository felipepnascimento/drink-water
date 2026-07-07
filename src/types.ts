export type DrinkSizeKey = "small" | "medium" | "large";

export type DrinkSizesMl = Record<DrinkSizeKey, number>;

export type Child = {
  id: string;
  name: string;
  dailyGoalMl: number;
  drinkSizesMl: DrinkSizesMl;
};

export type Drink = {
  amountMl: number;
  at: string;
};

export type DayProgress = {
  amountMl: number;
  drinks: Drink[];
};

export type AppState = {
  children: Child[];
  activeChildId: string;
  progress: Record<string, DayProgress>;
};
