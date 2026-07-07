import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  left: number;
  onDone: () => void;
};

export function FloatingDrop({ left, onDone }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [anim, onDone]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -160] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 10, -6] });
  const opacity = anim.interpolate({ inputRange: [0, 0.12, 0.75, 1], outputRange: [0, 1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.4, 1.25, 0.85] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["-8deg", "12deg"] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { left, opacity, transform: [{ translateX }, { translateY }, { scale }, { rotate }] },
      ]}
    >
      <Svg width={26} height={32} viewBox="0 0 24 28">
        <Path
          d="M12 1C8 8 2 14 2 19a10 10 0 0020 0C22 14 16 8 12 1Z"
          fill="#6fd9d1"
          stroke="#ffffff"
          strokeWidth={1.5}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 118,
    zIndex: 30,
  },
});
