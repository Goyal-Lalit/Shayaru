import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import * as Application from "expo-application";


export default function Settings() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem("profile_name");
      const storedImage = await AsyncStorage.getItem("profile_image");
      if (storedName) setName(storedName);
      if (storedImage) setImage(storedImage);
    } catch (e) {
      console.log("Error loading profile:", e);
    }
  };

  // Name auto save
  const handleNameChange = async (text: string) => {
    setName(text);
    await AsyncStorage.setItem("profile_name", text);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("profile_image", uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholder]}>
              <Text style={{ color: "#777", fontSize: 24 }}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your name"
            placeholderTextColor="#777"
            style={styles.input}
          />
        </View>
      </View>

      {/* Options */}
      <TouchableOpacity
        onPress={() => router.push("/set-passcode")}
        style={styles.optionCard}
      >
        <Text style={styles.optionText}>Change Passcode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Linking.openURL("https://your-privacy-policy.example")}
        style={styles.optionCard}
      >
        <Text style={styles.optionText}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* App Version */}
      <View style={styles.versionBox}>
        <Text style={styles.versionText}>Version : 1.0.0  </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 16 },
  header: {
    color: "#CFFFE2",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#131313",
    marginBottom: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  placeholder: {
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#CFFFE2", marginBottom: 4 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: "#1c1c1c",
    color: "#CFFFE2",
  },
  optionCard: {
    padding: 16,
    backgroundColor: "#242424",
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: { fontSize: 16, fontWeight: "500", color: "#CFFFE2" },
  versionBox: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 16,
  },
  versionText: { color: "#CFFFE2", fontSize: 14 },
});
