import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToBought,
  removeProductFromBought,
  resetBoughtProducts,
  setBoughtProducts,
  setUserCoins,
} from "@/store/productSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/store";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/Types";
import { Product } from "@/store/productSlice";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "productDetail">;

const ProductDetail = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productID } = route.params;
  const [isBought, setIsBought] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [imageUri, setImageUri] = useState("");
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentCoin = useSelector(
    (state: RootState) => state.products.userCoins
  );

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", productID],
    queryFn: () =>
      fetch(`https://fakestoreapi.com/products/${productID}`).then((res) =>
        res.json()
      ),
  });

  const boughtProducts = useSelector(
    (state: RootState) => state.products.boughtProducts
  );

  const resetStorage = async () => {
    await AsyncStorage.removeItem("boughtProducts");
    await AsyncStorage.removeItem("userCoins");
    dispatch(resetBoughtProducts());
    dispatch(setUserCoins(500));
    console.log("Storage and state reset!");

    const boughtProducts = await AsyncStorage.getItem("boughtProducts");
    const userCoins = await AsyncStorage.getItem("userCoins");
    console.log("After reset:", { boughtProducts, userCoins });
  };

  useEffect(() => {
    const initializeAppState = async () => {
      try {
        const existingBoughtProducts = await AsyncStorage.getItem(
          "boughtProducts"
        );
        const existingCoins = await AsyncStorage.getItem("userCoins");

        if (!existingBoughtProducts || !existingCoins) {
          console.log("No data found. Resetting app state...");
          await AsyncStorage.setItem("boughtProducts", JSON.stringify([]));
          await AsyncStorage.setItem("userCoins", "500");
          dispatch(setBoughtProducts([]));
          dispatch(setUserCoins(500));
        } else {
          dispatch(setBoughtProducts(JSON.parse(existingBoughtProducts)));
          dispatch(setUserCoins(Number(existingCoins)));
        }
      } catch (error) {
        console.error("Error initializing app state:", error);
      }
    };

    initializeAppState();
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      const alreadyBought = boughtProducts.some(
        (boughtProduct) => String(boughtProduct.id) === String(product.id)
      );
      setIsBought(alreadyBought);
    } else {
      setIsBought(false);
    }
  }, [product, boughtProducts]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const showAlert = (message: string) => {
    setModalMessage(message);
    setAlertModalVisible(true);
  };

  const closeAlertModal = () => {
    setAlertModalVisible(false);
  };

  const handleBuyProduct = async () => {
    if (product) {
      if (currentCoin >= product.price) {
        const updatedBoughtProducts = [...boughtProducts, product];
        dispatch(addProductToBought(product));
        dispatch(setUserCoins(currentCoin - product.price));

        try {
          await AsyncStorage.setItem(
            "userCoins",
            String(currentCoin - product.price)
          );
          await AsyncStorage.setItem(
            "boughtProducts",
            JSON.stringify(updatedBoughtProducts)
          );

          showAlert(
            `${
              product.title
            } was bought successfully! Your current balance is ${
              currentCoin - product.price
            }.`
          );
          setIsBought(true);
        } catch (error) {
          console.error("Error saving purchase:", error);
        }
      } else {
        showAlert("You don't have enough coins to buy this product.");
      }
    }
  };

  const handleSellProduct = async () => {
    if (product) {
      const updatedBoughtProducts = boughtProducts.filter(
        (boughtProduct) => boughtProduct.id !== product.id
      );
      dispatch(removeProductFromBought(product.id));
      dispatch(setUserCoins(currentCoin + product.price));

      try {
        await AsyncStorage.setItem(
          "userCoins",
          String(currentCoin + product.price)
        );
        await AsyncStorage.setItem(
          "boughtProducts",
          JSON.stringify(updatedBoughtProducts)
        );

        showAlert(
          `${product.title} was sold successfully! Your current balance is ${
            currentCoin + product.price
          }.`
        );
        setIsBought(false);
      } catch (error) {
        console.error("Error saving sale:", error);
      }
    }
  };

  const openImageModal = (uri: string) => {
    setImageUri(uri);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
  };

  useEffect(() => {
    console.log("isBought:", isBought);
  }, [isBought]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error instanceof Error) {
    return <Text>{error.message}</Text>;
  }

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
          {product?.title}
        </Text>
      </View>

      <TouchableOpacity onPress={() => openImageModal(product.image)}>
        <Image source={{ uri: product?.image }} style={styles.productImage} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={imageModalVisible}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: imageUri }}
                style={styles.fullScreenImage}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={alertModalVisible}
        animationType="fade"
        onRequestClose={closeAlertModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalMessage ? (
              <Text>{modalMessage}</Text>
            ) : (
              <Image
                source={{ uri: product?.image }}
                style={styles.fullScreenImage}
              />
            )}
            <TouchableOpacity
              onPress={closeAlertModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.title,
            {
              color: containerBackgroundColor === "#001524" ? "white" : "black",
            },
          ]}
        >
          {product?.title}
        </Text>
        <View style={styles.detailRow}>
          <Text
            style={[
              styles.label,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            Price
          </Text>
          <Text
            style={[
              styles.price,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            {product?.price} Coins
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={[
              styles.label,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.description,
              {
                color:
                  containerBackgroundColor === "#001524" ? "white" : "black",
              },
            ]}
          >
            {product?.description}
          </Text>
        </View>
      </View>

      {isBought ? (
        <TouchableOpacity onPress={handleSellProduct} style={styles.sellBtn}>
          <Text style={styles.actionSell}>Sell</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleBuyProduct} style={styles.buyBtn}>
          <Text style={styles.actionBuy}>Buy</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: "column",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    marginTop: 10,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
  },
  buyBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  sellBtn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  actionBuy: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionSell: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    flexDirection: "column",
    gap: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProductDetail;
