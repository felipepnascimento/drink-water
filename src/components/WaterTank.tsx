import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Fish, FishColor } from "./Fish";
import { theme } from "../theme";

type FishSpec = {
  color: FishColor;
  width: number;
  bottomRatio: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
};

const SHOAL: FishSpec[] = [
  { color: theme.fish.coral, width: 46, bottomRatio: 0.34, direction: "leftToRight", durationMs: 8000, delayMs: 0 },
  { color: theme.fish.sun, width: 34, bottomRatio: 0.46, direction: "rightToLeft", durationMs: 6500, delayMs: 400 },
  { color: theme.fish.mint, width: 26, bottomRatio: 0.26, direction: "leftToRight", durationMs: 9500, delayMs: 900 },
  { color: theme.fish.coral, width: 20, bottomRatio: 0.39, direction: "rightToLeft", durationMs: 5200, delayMs: 1100 },
  { color: theme.fish.leaf, width: 30, bottomRatio: 0.2, direction: "leftToRight", durationMs: 10500, delayMs: 2400 },
  { color: theme.fish.sun, width: 18, bottomRatio: 0.51, direction: "leftToRight", durationMs: 7200, delayMs: 600 },
  { color: theme.fish.sky, width: 24, bottomRatio: 0.15, direction: "rightToLeft", durationMs: 8800, delayMs: 3200 },
];

type BurstBubbleSpec = {
  id: number;
  leftPercent: number;
  delayMs: number;
  size: number;
};

function BurstBubble({
  leftPercent,
  delayMs,
  size,
  onDone,
}: Omit<BurstBubbleSpec, "id"> & { onDone: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      delay: delayMs,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [anim, delayMs, onDone]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -90] });
  const opacity = anim.interpolate({ inputRange: [0, 0.15, 0.8, 1], outputRange: [0, 0.9, 0.7, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        bottom: "34%",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(255,255,255,0.75)",
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

type Props = {
  progress: number;
};

let bubbleIdCounter = 0;

export function WaterTank({ progress }: Props) {
  const [tankSize, setTankSize] = useState({ width: 0, height: 0 });
  const waterHeight = useRef(new Animated.Value(0)).current;
  const tankScale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const [burstBubbles, setBurstBubbles] = useState<BurstBubbleSpec[]>([]);
  const prevProgressRef = useRef<number | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTankSize({ width, height });
  };

  const removeBubble = (id: number) => {
    setBurstBubbles((current) => current.filter((b) => b.id !== id));
  };

  useEffect(() => {
    Animated.timing(waterHeight, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();

    const previous = prevProgressRef.current;
    if (previous !== null && progress > previous) {
      Animated.sequence([
        Animated.timing(tankScale, { toValue: 1.035, duration: 130, useNativeDriver: true }),
        Animated.spring(tankScale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.timing(flash, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 480, useNativeDriver: true }),
      ]).start();

      const newBubbles: BurstBubbleSpec[] = Array.from({ length: 7 }, () => ({
        id: bubbleIdCounter++,
        leftPercent: 8 + Math.random() * 84,
        delayMs: Math.random() * 180,
        size: 5 + Math.random() * 7,
      }));
      setBurstBubbles((current) => [...current, ...newBubbles]);
    }
    prevProgressRef.current = progress;
  }, [progress, waterHeight, tankScale, flash]);

  const animatedHeight = waterHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["6%", "72%"],
  });
  const flashOpacity = flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] });

  return (
    <Animated.View
      style={[styles.tank, { transform: [{ scale: tankScale }] }]}
      onLayout={onLayout}
    >
      <Animated.View style={[styles.water, { height: animatedHeight }]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.waterLight} />
              <Stop offset="0.45" stopColor={theme.waterMid} />
              <Stop offset="1" stopColor={theme.waterDeep} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#water)" />
        </Svg>
      </Animated.View>

      <View style={styles.sand} />

      {tankSize.width > 0 &&
        SHOAL.map((fish, index) => (
          <Fish
            key={index}
            color={fish.color}
            width={fish.width}
            bottom={tankSize.height * fish.bottomRatio}
            direction={fish.direction}
            durationMs={fish.durationMs}
            delayMs={fish.delayMs}
            tankWidth={tankSize.width}
          />
        ))}

      {burstBubbles.map((bubble) => (
        <BurstBubble key={bubble.id} {...bubble} onDone={() => removeBubble(bubble.id)} />
      ))}

      <Animated.View
        pointerEvents="none"
        style={[styles.flash, { opacity: flashOpacity }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tank: {
    flex: 1,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#cdeef0",
    marginHorizontal: 14,
    marginTop: 8,
  },
  water: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  sand: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "10%",
    backgroundColor: theme.sandDark,
  },
  flash: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "white",
  },
});
