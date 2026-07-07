import { useEffect, useRef, useState } from "react";
import { Fish, FishColor } from "./Fish";
import { theme } from "../lib/theme";
import styles from "./WaterTank.module.css";

type FishSpec = {
  color: FishColor;
  width: number;
  bottomPercent: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
};

const SHOAL: FishSpec[] = [
  { color: theme.fish.coral, width: 46, bottomPercent: 34, direction: "leftToRight", durationMs: 8000, delayMs: 0 },
  { color: theme.fish.sun, width: 34, bottomPercent: 46, direction: "rightToLeft", durationMs: 6500, delayMs: 400 },
  { color: theme.fish.mint, width: 26, bottomPercent: 26, direction: "leftToRight", durationMs: 9500, delayMs: 900 },
  { color: theme.fish.coral, width: 20, bottomPercent: 39, direction: "rightToLeft", durationMs: 5200, delayMs: 1100 },
  { color: theme.fish.leaf, width: 30, bottomPercent: 20, direction: "leftToRight", durationMs: 10500, delayMs: 2400 },
  { color: theme.fish.sun, width: 18, bottomPercent: 51, direction: "leftToRight", durationMs: 7200, delayMs: 600 },
  { color: theme.fish.sky, width: 24, bottomPercent: 15, direction: "rightToLeft", durationMs: 8800, delayMs: 3200 },
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
          color={fish.color}
          width={fish.width}
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
