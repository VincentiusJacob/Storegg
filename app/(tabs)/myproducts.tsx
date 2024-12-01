import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/store/productSlice";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "@/store";

const myProducts = () => {
  const [boughtProducts, setBoughtProducts] = useState<Product[]>([]);
  const navigation = useNavigation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const fetchBoughtProducts = async () => {
      try {
        const products = await AsyncStorage.getItem("boughtProducts");
        console.log("products: ", products);
        if (products !== null) {
          setBoughtProducts(JSON.parse(products));
        }
      } catch (error) {
        console.error("Error fetching products from AsyncStorage:", error);
      }
    };

    fetchBoughtProducts();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const containerBackgroundColor = themeMode === "dark" ? "#001524" : "white";

  return (
    <View
      style={[
        styles.myproductContainer,
        { backgroundColor: containerBackgroundColor },
      ]}
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

      <View>
        {boughtProducts.length > 0 ? (
          boughtProducts.map((product, index) => (
            <View key={index} style={styles.productContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price} Coins</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No products found.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productInfo: {
    flexDirection: "column",
    flex: 1,
  },

  myproductContainer: {
    padding: 20,
    backgroundColor: "white",
    height: "100%",
  },

  navigation: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 10,
    width: "100%",
  },
  productContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    padding: 15,
    width: "100%",
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: "white",
    borderRadius: 7,
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default myProducts;
