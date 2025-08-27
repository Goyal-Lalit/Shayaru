import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Root() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}> 
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" }, // dark background
          }}
        />
        {/* StatusBar dark + white text */}
        <StatusBar style="light" backgroundColor="#000" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
