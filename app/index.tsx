import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const pin = await SecureStore.getItemAsync("ranu-passcode");
      router.replace(pin ? "/passcode" : "/set-passcode");
    })();
  }, []);
  return <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#0B0B0B"}}><ActivityIndicator/></View>;
}
