import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from "@/store";
import { setSearchQuery } from "@/store/productSlice";
import { RootStackParamList } from "@/constants/Types";
import { setTheme } from "@/store/themeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchIcon from "./SearchIcon";

type NavigationProp = StackNavigationProp<RootStackParamList, "index">;

const Navigation = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const userCoins = useSelector((state: RootState) => state.products.userCoins);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        dispatch(setTheme(savedTheme as "light" | "dark"));
      }
    };

    loadTheme();
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    dispatch(setSearchQuery(text));
  };

  const handleThemeToggle = async (mode: "light" | "dark") => {
    dispatch(setTheme(mode));
    await AsyncStorage.setItem("theme", mode);
  };

  const handlePress = () => {
    navigation.navigate("myproducts");
  };

  return (
    <View style={[themeMode === "dark" ? styles.darkMode : styles.navigation]}>
      <View style={styles.themeMode}>
        <TouchableOpacity
          style={[
            styles.themeBtn,
            themeMode === "light" && { backgroundColor: "lightcoral" },
          ]}
          onPress={() => handleThemeToggle("light")}
        >
          <Text style={{ color: "white" }}> Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.themeBtn,
            themeMode === "dark" && { backgroundColor: "lightcoral" },
          ]}
          onPress={() => handleThemeToggle("dark")}
        >
          <Text style={{ color: "white" }}> Dark</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          placeholder="Search Product.."
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <TouchableOpacity style={styles.myProducts} onPress={handlePress}>
        <Text style={{ color: "white" }}> My Products </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color="black"
          style={{ color: "white" }}
        />
      </TouchableOpacity>

      <View style={styles.coinsDashboard}>
        <Text style={styles.coinText}>{userCoins}</Text>
        <Text style={{ color: "white" }}> My Coins </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  darkMode: {
    backgroundColor: "#141E46",
    color: "white",
    flexDirection: "column",
    position: "relative",
    padding: 16,
    gap: 20,
    width: "100%",
  },
  themeMode: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  themeBtn: {
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "#1679AB",
    borderRadius: 8,
  },

  navigation: {
    flexDirection: "column",
    position: "relative",
    padding: 16,
    gap: 20,
    width: "100%",
    backgroundColor: "#141E46",
  },
  coinText: {
    fontSize: 30,
    color: "white",
  },
  coinsDashboard: {
    position: "absolute",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#1679AB",
    right: 20,
    top: 150,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 3,
    paddingLeft: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  myProducts: {
    flexDirection: "row",
    color: "white",
    padding: 10,
    paddingLeft: 3,
    paddingRight: 3,
    backgroundColor: "#1679AB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
});

export default Navigation;
