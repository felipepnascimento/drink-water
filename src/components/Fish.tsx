import styles from "./Fish.module.css";

export type FishColor = { body: string; tail: string };

type Props = {
  color: FishColor;
  width: number;
  bottomPercent: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
};

export function Fish({ color, width, bottomPercent, direction, durationMs, delayMs }: Props) {
  const height = width * 0.6;

  return (
    <div
      className={`${styles.fish} ${direction === "leftToRight" ? styles.swimLTR : styles.swimRTL}`}
      style={{
        width,
        height,
        bottom: `${bottomPercent}%`,
        animationDuration: `${durationMs}ms`,
        animationDelay: `${delayMs}ms`,
      }}
    >
      <div className={styles.bob} style={{ animationDelay: `${delayMs}ms` }}>
        <svg
          viewBox="0 0 46 28"
          width={width}
          height={height}
          style={direction === "rightToLeft" ? { transform: "scaleX(-1)" } : undefined}
        >
          <ellipse cx={20} cy={14} rx={16} ry={10} fill={color.body} />
          <path d="M4 14 L-6 4 L-6 24 Z" fill={color.tail} />
          <circle cx={30} cy={11} r={2.4} fill="#133c3f" />
        </svg>
      </div>
    </div>
  );
}
