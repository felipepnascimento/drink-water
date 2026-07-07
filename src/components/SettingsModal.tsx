import { useState } from "react";
import styles from "./SettingsModal.module.css";

type Props = {
  childName: string;
  dailyGoalMl: number;
  todayAmountMl: number;
  onClose: () => void;
  onSave: (changes: { name: string; dailyGoalMl: number }) => void;
  onResetToday: () => void;
};

export function SettingsModal({
  childName,
  dailyGoalMl,
  todayAmountMl,
  onClose,
  onSave,
  onResetToday,
}: Props) {
  const [name, setName] = useState(childName);
  const [goalText, setGoalText] = useState(String(dailyGoalMl));

  const handleSave = () => {
    const parsedGoal = parseInt(goalText, 10);
    onSave({
      name: name.trim() || childName,
      dailyGoalMl: Number.isFinite(parsedGoal) && parsedGoal > 0 ? parsedGoal : dailyGoalMl,
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
