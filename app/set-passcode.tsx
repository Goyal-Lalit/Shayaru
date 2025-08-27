import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function SetPasscode() {
  const [p, setP] = useState("");
  const router = useRouter();
  const save = async () => {
    if (p.length < 4) return alert("Min 4 digits");
    await SecureStore.setItemAsync("ranu-passcode", p);
    router.replace("/(tabs)/home");
  };
  return (
    <View style={{flex:1,backgroundColor:"#0B0B0B",padding:24,justifyContent:"center"}}>
      <Text style={{color:"#CFFFE2",fontSize:28,fontWeight:"700",marginBottom:16}}>Set Passcode</Text>
      <TextInput
        placeholder="Create passcode"
        placeholderTextColor="#666"
        keyboardType="number-pad"
        secureTextEntry
        value={p}
        onChangeText={setP}
        style={{backgroundColor:"#151515",color:"#fff",borderRadius:10,padding:12,letterSpacing:6}}
      />
      <TouchableOpacity onPress={save} style={{marginTop:16,backgroundColor:"#A2D5C6",padding:14,borderRadius:12,alignItems:"center"}}>
        <Text style={{color:"#000000",fontWeight:"700"}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
