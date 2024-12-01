import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Modal,
  Button,
  BackHandler,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProducts } from "@/store/productSlice";
import { RootState } from "@/store/index";
import GridViewIcon from "@/components/GridViewIcon";
import ListViewIcon from "@/components/ListViewIcon";
import FloatingButton from "@/components/FloatingButton";
import ProductItem from "@/components/ProductItem";
import Navigation from "@/components/Navigation";
import { useNavigation } from "@react-navigation/native";

export default function Index() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const filteredProducts = useSelector(
    (state: RootState) => state.products.filteredProducts
  );
  const [isGridView, setIsGridView] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        dispatch(setProducts(response.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchApi();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [dispatch]);

  const handleBackPress = () => {
    setIsModalVisible(true);
    return true;
  };

  const handleExitApp = () => {
    setIsModalVisible(false);
    BackHandler.exitApp();
  };

  const handleCancelExit = () => {
    setIsModalVisible(false);
  };

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const containerBackgroundColor = themeMode === "dark" ? "#001524" : "white";

  return (
    <View style={{ flex: 1, backgroundColor: containerBackgroundColor }}>
      <Navigation />
      <View style={styles.mainPage}>
        <View style={styles.productView}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: containerBackgroundColor === "#001524" ? "white" : "black",
            }}
          >
            Available Products
          </Text>
          {isGridView ? (
            <GridViewIcon onPress={toggleView} />
          ) : (
            <ListViewIcon onPress={toggleView} />
          )}
        </View>

        {filteredProducts && filteredProducts.length > 0 ? (
          <FlatList
            key={isGridView ? "grid" : "list"}
            data={filteredProducts}
            numColumns={isGridView ? 2 : 1}
            renderItem={({ item }) => (
              <ProductItem isGridView={isGridView} productID={item.id} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.itemsList}
          />
        ) : (
          <Text>No products available</Text>
        )}
        <FloatingButton />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelExit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to close Storegg?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCancelExit} />
              <Button title="OK" onPress={handleExitApp} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 10,
    padding: 30,
    justifyContent: "space-between",
  },

  itemsList: {
    padding: 20,
    gap: 10,
  },

  productView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
