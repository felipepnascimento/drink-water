import { useState } from "react";
import { theme } from "../lib/theme";
import styles from "./DrinkButton.module.css";

type Props = {
  ariaLabel: string;
  fillRatio: number;
  iconSize: number;
  borderColor: string;
  onDrink: () => void;
};

const CUP_PATH = "M6 4 H26 L23.5 27 A4 4 0 0 1 19.5 30 H12.5 A4 4 0 0 1 8.5 27 Z";

let cupClipIdCounter = 0;

function CupIcon({ fillRatio, size }: { fillRatio: number; size: number }) {
  const [clipId] = useState(() => `cupClip${cupClipIdCounter++}`);
  const waterTop = 30 - fillRatio * 24;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <clipPath id={clipId}>
          <path d={CUP_PATH} />
        </clipPath>
      </defs>
      <path d={CUP_PATH} fill="#ffffff" />
      <rect x={0} y={waterTop} width={32} height={32} fill={theme.waterMid} clipPath={`url(#${clipId})`} />
      <path d={CUP_PATH} fill="none" stroke={theme.waterDeep} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

export function DrinkButton({ ariaLabel, fillRatio, iconSize, borderColor, onDrink }: Props) {
  const handleClick = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
    onDrink();
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={styles.button}
      style={{ borderColor }}
      onClick={handleClick}
    >
      <CupIcon fillRatio={fillRatio} size={iconSize} />
    </button>
  );
}
