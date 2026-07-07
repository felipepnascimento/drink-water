import { useState } from "react";
import styles from "./DrinkCelebration.module.css";

type Props = {
  goalReached: boolean;
  onConfirm: () => void;
};

const MESSAGES = [
  "Uau, o peixinho amou!",
  "Isso aí! Bebeu água!",
  "Muito bem, campeã!",
  "O aquário agradece!",
  "Você é demais!",
];

const CONFIRM_ICONS = ["👍", "⭐", "🙌", "✨"];
const CONFETTI_EMOJI = ["💧", "⭐", "✨", "🎉"];

type ConfettiPiece = {
  id: number;
  left: number;
  delayMs: number;
  durationMs: number;
  emoji: string;
};

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 10 }, (_, id) => ({
    id,
    left: 6 + Math.random() * 88,
    delayMs: Math.random() * 250,
    durationMs: 900 + Math.random() * 500,
    emoji: randomPick(CONFETTI_EMOJI),
  }));
}

export function DrinkCelebration({ goalReached, onConfirm }: Props) {
  const [confirmIcon] = useState(() => randomPick(CONFIRM_ICONS));
  const [confetti] = useState(makeConfetti);
  const [message] = useState(() => (goalReached ? "Você bateu a meta de hoje!" : randomPick(MESSAGES)));

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.confettiLayer}>
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className={styles.confetti}
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delayMs}ms`,
                animationDuration: `${piece.durationMs}ms`,
              }}
            >
              {piece.emoji}
            </span>
          ))}
        </div>

        <div className={styles.mascot}>{goalReached ? "🏆" : "🐠"}</div>
        <div className={styles.message}>{message}</div>
        <div className={styles.subMessage}>Toca aqui pra continuar</div>

        <button
          type="button"
          className={styles.confirmButton}
          aria-label="Continuar"
          onClick={onConfirm}
        >
          {confirmIcon}
        </button>
      </div>
    </div>
  );
}
