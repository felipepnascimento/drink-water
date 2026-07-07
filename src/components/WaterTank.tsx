import { useEffect, useRef, useState } from "react";
import { Fish } from "./Fish";
import styles from "./WaterTank.module.css";

type FishSpec = {
  emoji: string;
  size: number;
  bottomPercent: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
};

// Emoji picked so kids recognize the cast even if they can't read yet:
// 🐠 is the modal's own mascot, 🐡/🦈/🐬/🐢/🦀/🐙/🐳 read as
// Nemo-and-friends style ocean pals from cartoons they already know.
const SHOAL: FishSpec[] = [
  { emoji: "🐠", size: 72, bottomPercent: 34, direction: "leftToRight", durationMs: 8000, delayMs: 0 },
  { emoji: "🐟", size: 54, bottomPercent: 46, direction: "rightToLeft", durationMs: 6500, delayMs: 400 },
  { emoji: "🐡", size: 46, bottomPercent: 26, direction: "leftToRight", durationMs: 9500, delayMs: 900 },
  { emoji: "🐠", size: 40, bottomPercent: 39, direction: "rightToLeft", durationMs: 5200, delayMs: 1100 },
  { emoji: "🐬", size: 58, bottomPercent: 20, direction: "leftToRight", durationMs: 10500, delayMs: 2400 },
  { emoji: "🦈", size: 64, bottomPercent: 51, direction: "leftToRight", durationMs: 11200, delayMs: 600 },
  { emoji: "🐢", size: 50, bottomPercent: 15, direction: "rightToLeft", durationMs: 8800, delayMs: 3200 },
  { emoji: "🦀", size: 34, bottomPercent: 8, direction: "leftToRight", durationMs: 7600, delayMs: 1800 },
  { emoji: "🐙", size: 52, bottomPercent: 12, direction: "rightToLeft", durationMs: 9800, delayMs: 2900 },
  { emoji: "🐳", size: 68, bottomPercent: 44, direction: "rightToLeft", durationMs: 12500, delayMs: 500 },
];

type BurstBubbleSpec = {
  id: number;
  leftPercent: number;
  delayMs: number;
  size: number;
};

let bubbleIdCounter = 0;

type Props = {
  progress: number;
};

export function WaterTank({ progress }: Props) {
  const [bouncing, setBouncing] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [burstBubbles, setBurstBubbles] = useState<BurstBubbleSpec[]>([]);
  const prevProgressRef = useRef<number | null>(null);

  useEffect(() => {
    const previous = prevProgressRef.current;
    if (previous !== null && progress > previous) {
      setBouncing(true);
      setFlashing(true);
      const newBubbles: BurstBubbleSpec[] = Array.from({ length: 7 }, () => ({
        id: bubbleIdCounter++,
        leftPercent: 8 + Math.random() * 84,
        delayMs: Math.random() * 180,
        size: 5 + Math.random() * 7,
      }));
      setBurstBubbles((current) => [...current, ...newBubbles]);

      const bounceTimeout = setTimeout(() => setBouncing(false), 180);
      const flashTimeout = setTimeout(() => setFlashing(false), 110);
      prevProgressRef.current = progress;
      return () => {
        clearTimeout(bounceTimeout);
        clearTimeout(flashTimeout);
      };
    }
    prevProgressRef.current = progress;
  }, [progress]);

  const removeBubble = (id: number) => {
    setBurstBubbles((current) => current.filter((b) => b.id !== id));
  };

  const waterHeightPercent = 6 + Math.min(1, Math.max(0, progress)) * 66;

  return (
    <div className={`${styles.tank} ${bouncing ? styles.bounce : ""}`}>
      <div className={styles.water} style={{ height: `${waterHeightPercent}%` }} />
      <div className={styles.sand} />

      {SHOAL.map((fish, index) => (
        <Fish
          key={index}
          emoji={fish.emoji}
          size={fish.size}
          bottomPercent={fish.bottomPercent}
          direction={fish.direction}
          durationMs={fish.durationMs}
          delayMs={fish.delayMs}
        />
      ))}

      {burstBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.burstBubble}
          style={{ left: `${bubble.leftPercent}%`, width: bubble.size, height: bubble.size, animationDelay: `${bubble.delayMs}ms` }}
          onAnimationEnd={() => removeBubble(bubble.id)}
        />
      ))}

      <div className={`${styles.flash} ${flashing ? styles.on : ""}`} />
    </div>
  );
}
