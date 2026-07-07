import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { theme } from "../theme";

type Props = {
  label: string;
  amountMl: number;
  colors: [string, string];
  onPress: () => void;
};

export function DrinkButton({ label, amountMl, colors, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors[1], opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: colors[0] }]}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="white">
          <Path d="M12 2C9 7 5 11.5 5 15.5A7 7 0 0019 15.5C19 11.5 15 7 12 2Z" />
        </Svg>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>+{amountMl} ml</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: theme.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontWeight: "800",
    fontSize: 13,
  },
  amount: {
    color: "white",
    fontWeight: "700",
    fontSize: 11,
    opacity: 0.9,
  },
});
