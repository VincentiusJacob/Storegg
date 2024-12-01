import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import { setUserCoins } from "@/store/productSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const MinigameScreen = () => {
  const navigation = useNavigation();
  const [prize, setPrize] = useState<string | null>(null);
  const [coins, setCoins] = useState<{
    gold: number;
    silver: number;
    bronze: number;
  }>({
    gold: 100,
    silver: 50,
    bronze: 20,
  });
  const [coinValue, setCoinValue] = useState<number | null>(null);
  const dispatch = useDispatch();
  const userCoins = useSelector((state: RootState) => state.products.userCoins);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [eggScale] = useState(new Animated.Value(1));

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEggClick = async () => {
    Animated.sequence([
      Animated.timing(eggScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eggScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eggScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const coinTypes = [
      { type: "gold", value: 100 },
      { type: "silver", value: 50 },
      { type: "bronze", value: 20 },
    ];

    const randomIndex = Math.floor(Math.random() * coinTypes.length);
    const coin = coinTypes[randomIndex];

    setPrize(coin.type);
    setCoinValue(coin.value);

    const updatedCoins = userCoins + coin.value;
    dispatch(setUserCoins(updatedCoins));
    await AsyncStorage.setItem("userCoins", updatedCoins.toString());
  };

  const getPrizeImage = (prize: string | null) => {
    switch (prize) {
      case "gold":
        return require("@/assets/images/gold-coin.png");
      case "silver":
        return require("@/assets/images/silver-coin.png");
      case "bronze":
        return require("@/assets/images/bronze-coin.png");
      default:
        return null;
    }
  };

  const containerBackgroundColor = themeMode === "dark" ? "#001524" : "white";

  return (
    <View
      style={[styles.container, { backgroundColor: containerBackgroundColor }]}
    >
      <View style={styles.navigation}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={containerBackgroundColor === "#001524" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.productTitle,
            {
              color: containerBackgroundColor === "#001524" ? "white" : "black",
            },
          ]}
        >
          My Products
        </Text>
      </View>

      <View style={styles.header}>
        <View style={styles.coinContainer}>
          <Image
            source={require("@/assets/images/gold-coin.png")}
            style={styles.coin}
          />
          <Text
            style={[
              styles.coinText,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            {coins.gold}
          </Text>
        </View>
        <View style={styles.coinContainer}>
          <Image
            source={require("@/assets/images/silver-coin.png")}
            style={styles.coin}
          />
          <Text
            style={[
              styles.coinText,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            {coins.silver}
          </Text>
        </View>
        <View style={styles.coinContainer}>
          <Image
            source={require("@/assets/images/bronze-coin.png")}
            style={styles.coin}
          />
          <Text
            style={[
              styles.coinText,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            {coins.bronze}
          </Text>
        </View>
      </View>

      {!prize && (
        <Text
          style={[
            styles.instructionText,
            {
              color: containerBackgroundColor === "#001524" ? "white" : "black",
            },
          ]}
        >
          Click on the egg to get your prize!
        </Text>
      )}

      {prize && (
        <Text
          style={[
            styles.instructionText,
            {
              color: containerBackgroundColor === "#001524" ? "white" : "black",
            },
          ]}
        >
          {"Congratulations!\n\nYou got a " + prize + " coin!"}
        </Text>
      )}

      {prize && getPrizeImage(prize) && (
        <Image
          style={{ width: 80, height: 80 }}
          source={getPrizeImage(prize)}
        />
      )}

      <TouchableOpacity style={styles.eggContainer} onPress={handleEggClick}>
        <Animated.Image
          source={
            prize
              ? require("@/assets/images/egg-broken.png")
              : require("@/assets/images/egg-full.png")
          }
          style={[styles.egg, { transform: [{ scale: eggScale }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.infoText,
          { color: containerBackgroundColor === "#001524" ? "white" : "black" },
        ]}
      >
        {coinValue !== null &&
          `${coinValue} coin has been added to your balance`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardsText: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  infoText: {
    fontWeight: "500",
    fontSize: 20,
    marginTop: 50,
  },

  productTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 10,
    width: "100%",
  },

  navigation: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },

  backButton: {
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    top: 70,
  },

  coinContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 20,
  },

  coin: {
    width: 50,
    height: 50,
  },

  coinText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  instructionText: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 50,
  },

  eggContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  egg: {
    width: 200,
    height: 200,
  },
});

export default MinigameScreen;
