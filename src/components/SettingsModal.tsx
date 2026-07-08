import { useState } from "react";
import { DrinkSizesMl } from "../lib/types";
import styles from "./SettingsModal.module.css";

type Props = {
  childName: string;
  dailyGoalMl: number;
  todayAmountMl: number;
  drinkSizesMl: DrinkSizesMl;
  onClose: () => void;
  onSave: (changes: { name: string; dailyGoalMl: number; drinkSizesMl: DrinkSizesMl }) => void;
  onResetToday: () => void;
};

function parsePositiveInt(text: string, fallback: number): number {
  const parsed = parseInt(text, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function SettingsModal({
  childName,
  dailyGoalMl,
  todayAmountMl,
  drinkSizesMl,
  onClose,
  onSave,
  onResetToday,
}: Props) {
  const [name, setName] = useState(childName);
  const [goalText, setGoalText] = useState(String(dailyGoalMl));
  const [smallText, setSmallText] = useState(String(drinkSizesMl.small));
  const [mediumText, setMediumText] = useState(String(drinkSizesMl.medium));
  const [largeText, setLargeText] = useState(String(drinkSizesMl.large));

  const handleSave = () => {
    onSave({
      name: name.trim() || childName,
      dailyGoalMl: parsePositiveInt(goalText, dailyGoalMl),
      drinkSizesMl: {
        small: parsePositiveInt(smallText, drinkSizesMl.small),
        medium: parsePositiveInt(mediumText, drinkSizesMl.medium),
        large: parsePositiveInt(largeText, drinkSizesMl.large),
      },
    });
    onClose();
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      `Zerar a água de hoje? Ela já bebeu ${todayAmountMl} ml — isso volta o aquário pra vazio.`,
    );
    if (confirmed) {
      onResetToday();
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>Ajustes</div>

        <label className={styles.fieldLabel} htmlFor="child-name">
          Nome da criança
        </label>
        <input
          id="child-name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
        />

        <label className={styles.fieldLabel} htmlFor="daily-goal">
          Meta diária (ml)
        </label>
        <input
          id="daily-goal"
          className={styles.input}
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          inputMode="numeric"
          placeholder="1000"
        />

        <label className={styles.fieldLabel}>Tamanho dos copos (ml)</label>
        <div className={styles.cupSizesRow}>
          <div className={styles.cupSizeField}>
            <label className={styles.cupSizeLabel} htmlFor="cup-small">
              P
            </label>
            <input
              id="cup-small"
              className={styles.input}
              value={smallText}
              onChange={(e) => setSmallText(e.target.value)}
              inputMode="numeric"
              placeholder="100"
            />
          </div>
          <div className={styles.cupSizeField}>
            <label className={styles.cupSizeLabel} htmlFor="cup-medium">
              M
            </label>
            <input
              id="cup-medium"
              className={styles.input}
              value={mediumText}
              onChange={(e) => setMediumText(e.target.value)}
              inputMode="numeric"
              placeholder="200"
            />
          </div>
          <div className={styles.cupSizeField}>
            <label className={styles.cupSizeLabel} htmlFor="cup-large">
              G
            </label>
            <input
              id="cup-large"
              className={styles.input}
              value={largeText}
              onChange={(e) => setLargeText(e.target.value)}
              inputMode="numeric"
              placeholder="350"
            />
          </div>
        </div>

        <button type="button" className={styles.resetButton} onClick={handleReset}>
          Zerar água de hoje
        </button>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
