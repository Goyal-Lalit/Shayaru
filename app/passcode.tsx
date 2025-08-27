import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";

export default function Passcode() {
  const [p, setP] = useState("");
  const router = useRouter();

  const check = async () => {
    const saved = await SecureStore.getItemAsync("ranu-passcode");
    if (p === saved) router.replace("/(tabs)/home");
    else alert("Wrong passcode");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")} // 👈 isko tum apni diya hua img ka path lagana
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      blurRadius={3} // halka blur effect for better visibility
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          margin: 24,
          borderRadius: 20,
          padding: 24,
        }}
      >
        <Text
          style={{
            color: "#CFFFE2",
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Shayaru
        </Text>

        <Text
          style={{
            color: "#CFFFE2",
            marginBottom: 8,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Enter Passcode
        </Text>

        <TextInput
          placeholder="••••"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          secureTextEntry
          value={p}
          onChangeText={setP}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "#fff",
            borderRadius: 10,
            padding: 14,
            letterSpacing: 8,
            textAlign: "center",
            fontSize: 20,
          }}
        />

        <TouchableOpacity
          onPress={check}
          style={{
            marginTop: 20,
            backgroundColor: "#A2D5C6",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
            Tap to Unlock
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
