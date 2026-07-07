import styles from "./Fish.module.css";

type Props = {
  emoji: string;
  size: number;
  bottomPercent: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
};

export function Fish({ emoji, size, bottomPercent, direction, durationMs, delayMs }: Props) {
  return (
    <div
      className={`${styles.fish} ${direction === "leftToRight" ? styles.swimLTR : styles.swimRTL}`}
      style={{
        bottom: `${bottomPercent}%`,
        animationDuration: `${durationMs}ms`,
        animationDelay: `${delayMs}ms`,
      }}
    >
      <div className={styles.bob} style={{ animationDelay: `${delayMs}ms` }}>
        <span
          className={styles.emoji}
          style={{
            fontSize: size,
            transform: direction === "rightToLeft" ? "scaleX(-1)" : undefined,
          }}
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}
