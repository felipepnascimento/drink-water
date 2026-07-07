import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export type FishColor = { body: string; tail: string };

type Props = {
  color: FishColor;
  width: number;
  bottom: number;
  direction: "leftToRight" | "rightToLeft";
  durationMs: number;
  delayMs: number;
  tankWidth: number;
};

export function Fish({
  color,
  width,
  bottom,
  direction,
  durationMs,
  delayMs,
  tankWidth,
}: Props) {
  const height = width * 0.6;
  const progress = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swim = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: durationMs,
        delay: delayMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1400,
          delay: delayMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    swim.start();
    bobbing.start();
    return () => {
      swim.stop();
      bobbing.stop();
    };
  }, [progress, bob, durationMs, delayMs]);

  const startX = direction === "leftToRight" ? -width : tankWidth;
  const endX = direction === "leftToRight" ? tankWidth : -width;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [-3, 3] });
  const scaleX = direction === "leftToRight" ? 1 : -1;

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom,
        width,
        height,
        transform: [{ translateX }, { translateY }, { scaleX }],
      }}
    >
      <Svg viewBox="0 0 46 28" width={width} height={height}>
        <Ellipse cx={20} cy={14} rx={16} ry={10} fill={color.body} />
        <Path d="M4 14 L-6 4 L-6 24 Z" fill={color.tail} />
        <Circle cx={30} cy={11} r={2.4} fill="#133c3f" />
      </Svg>
    </Animated.View>
  );
}
