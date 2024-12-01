import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/Types";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "minigame"
>;

const FloatingButton = () => {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    navigation.navigate("minigame");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.floatButton}>
      <Image
        source={require("@/assets/images/egg-full.png")}
        style={styles.buttonImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0103ba",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },

  buttonImage: {
    width: 30,
    height: 30,
  },
});

export default FloatingButton;
