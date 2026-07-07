import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AquariumScreen } from "./src/screens/AquariumScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <AquariumScreen />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
