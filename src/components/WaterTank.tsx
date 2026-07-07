import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
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

type Props = {
  progress: number;
};

export function WaterTank({ progress }: Props) {
  const [tankSize, setTankSize] = useState({ width: 0, height: 0 });
  const waterHeight = useRef(new Animated.Value(0)).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTankSize({ width, height });
  };

  useEffect(() => {
    Animated.timing(waterHeight, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress, waterHeight]);

  const animatedHeight = waterHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["6%", "72%"],
  });

  return (
    <View style={styles.tank} onLayout={onLayout}>
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
    </View>
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
});
