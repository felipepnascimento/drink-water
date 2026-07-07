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

const CONFETTI_EMOJI = ["💧", "⭐", "✨", "🎉"];

function StarIcon() {
  return (
    <svg width={52} height={52} viewBox="0 0 24 24" fill="white">
      <path d="M12 2.5l2.76 6.12 6.74.62-5.1 4.5 1.54 6.6L12 16.9l-5.94 3.44 1.54-6.6-5.1-4.5 6.74-.62L12 2.5z" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width={50} height={50} viewBox="0 0 24 24" fill="white">
      <path d="M2 21h3a1 1 0 001-1v-9a1 1 0 00-1-1H2v11zM22 11.5a2 2 0 00-2-2h-5.6l.8-3.6a1.7 1.7 0 00-3.1-1.3L9 9.3V21h9.5a2 2 0 001.9-1.4l1.5-5.8c.07-.24.1-.5.1-.75V11.5z" />
    </svg>
  );
}

const CONFIRM_ICONS = [StarIcon, ThumbsUpIcon];

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
  const [ConfirmIcon] = useState(() => randomPick(CONFIRM_ICONS));
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
          <ConfirmIcon />
        </button>
      </div>
    </div>
  );
}
