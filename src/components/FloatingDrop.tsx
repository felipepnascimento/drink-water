import styles from "./FloatingDrop.module.css";

type Props = {
  left: number;
  onDone: () => void;
};

export function FloatingDrop({ left, onDone }: Props) {
  return (
    <div className={styles.drop} style={{ left }} onAnimationEnd={onDone}>
      <svg width={26} height={32} viewBox="0 0 24 28">
        <path
          d="M12 1C8 8 2 14 2 19a10 10 0 0020 0C22 14 16 8 12 1Z"
          fill="#6fd9d1"
          stroke="#ffffff"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
}
