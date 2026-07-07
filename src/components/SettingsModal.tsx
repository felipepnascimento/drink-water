import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";

type Props = {
  visible: boolean;
  childName: string;
  dailyGoalMl: number;
  todayAmountMl: number;
  onClose: () => void;
  onSave: (changes: { name: string; dailyGoalMl: number }) => void;
  onResetToday: () => void;
};

export function SettingsModal({
  visible,
  childName,
  dailyGoalMl,
  todayAmountMl,
  onClose,
  onSave,
  onResetToday,
}: Props) {
  const [name, setName] = useState(childName);
  const [goalText, setGoalText] = useState(String(dailyGoalMl));

  const handleSave = () => {
    const parsedGoal = parseInt(goalText, 10);
    onSave({
      name: name.trim() || childName,
      dailyGoalMl: Number.isFinite(parsedGoal) && parsedGoal > 0 ? parsedGoal : dailyGoalMl,
    });
    onClose();
  };

  const handleReset = () => {
    Alert.alert(
      "Zerar água de hoje?",
      `Isso volta o aquário pra vazio (hoje ela já bebeu ${todayAmountMl} ml).`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Zerar",
          style: "destructive",
          onPress: () => {
            onResetToday();
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Ajustes</Text>

          <Text style={styles.fieldLabel}>Nome da criança</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Nome"
          />

          <Text style={styles.fieldLabel}>Meta diária (ml)</Text>
          <TextInput
            value={goalText}
            onChangeText={setGoalText}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="1000"
          />

          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetLabel}>Zerar água de hoje</Text>
          </Pressable>

          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryLabel}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryLabel}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 60, 63, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: theme.paper,
    borderRadius: 20,
    padding: 20,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.ink,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.inkSoft,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.paperEdge,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.ink,
    marginTop: 4,
  },
  resetButton: {
    marginTop: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#fdeceb",
  },
  resetLabel: {
    color: "#c0392b",
    fontWeight: "700",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: theme.background,
  },
  secondaryLabel: {
    color: theme.inkSoft,
    fontWeight: "700",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: theme.waterMid,
  },
  primaryLabel: {
    color: "white",
    fontWeight: "800",
  },
});
