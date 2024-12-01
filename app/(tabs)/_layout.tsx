import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/Types"; // Import your types
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="productDetail" options={{ headerShown: false }} />
        <Stack.Screen name="myproducts" options={{ headerShown: false }} />
        <Stack.Screen name="minigame" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
