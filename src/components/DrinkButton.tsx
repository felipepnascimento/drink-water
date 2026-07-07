import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { theme } from "../theme";

type Props = {
  accessibilityLabel: string;
  fillRatio: number;
  iconSize: number;
  borderColor: string;
  onPress: () => void;
};

const CUP_PATH = "M6 4 H26 L23.5 27 A4 4 0 0 1 19.5 30 H12.5 A4 4 0 0 1 8.5 27 Z";

let cupClipIdCounter = 0;

function CupIcon({ fillRatio, size }: { fillRatio: number; size: number }) {
  const clipId = useRef(`cupClip${cupClipIdCounter++}`).current;
  const waterTop = 30 - fillRatio * 24;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={CUP_PATH} />
        </ClipPath>
      </Defs>
      <Path d={CUP_PATH} fill="#ffffff" />
      <Rect
        x={0}
        y={waterTop}
        width={32}
        height={32}
        fill={theme.waterMid}
        clipPath={`url(#${clipId})`}
      />
      <Path
        d={CUP_PATH}
        fill="none"
        stroke={theme.waterDeep}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DrinkButton({
  accessibilityLabel,
  fillRatio,
  iconSize,
  borderColor,
  onPress,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 30 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 3, tension: 140 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
      style={styles.wrap}
    >
      <Animated.View
        style={[styles.button, { borderColor, transform: [{ scale }] }]}
      >
        <CupIcon fillRatio={fillRatio} size={iconSize} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  button: {
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: theme.paper,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
