import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addProductToBought } from "@/store/productSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/constants/Types";
import { Product } from "@/store/productSlice";

type Navigation = StackNavigationProp<RootStackParamList, "productDetail">;

type ProductItemProps = {
  isGridView: boolean;
  productID: number;
};

const fetchProductDetails = async (productID: number): Promise<Product> => {
  const response = await fetch(
    `https://fakestoreapi.com/products/${productID}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }
  return response.json();
};

const ProductItem = ({ isGridView, productID }: ProductItemProps) => {
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", productID],
    queryFn: () => fetchProductDetails(productID),
  });

  const dispatch = useDispatch();
  const navigation = useNavigation<Navigation>();

  const handlePress = () => {
    if (product) {
      dispatch(addProductToBought(product));
      navigation.navigate("productDetail", { productID });
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error instanceof Error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        isGridView ? styles.gridItemContainer : styles.itemDetailContainer,
      ]}
    >
      <View style={[isGridView ? styles.gridItem : styles.itemDetail]}>
        <Image
          source={{ uri: product?.image }}
          style={isGridView ? styles.gridImage : styles.itemImage}
        />
        <View style={styles.itemLabel}>
          <Text style={styles.itemTitle}>{product?.title}</Text>
          <Text style={styles.itemPrice}>{product?.price} Coins</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemDetailContainer: {},

  gridItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 5,
    backgroundColor: "white",
    borderRadius: 7,
    elevation: 2,
    overflow: "hidden",
  },

  itemDetail: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    padding: 20,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 7,
    marginBottom: 7,
    elevation: 7,
  },

  gridItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    gap: 10,
    width: "100%",
    marginBottom: 10,
  },

  gridImage: {
    width: 70,
    height: 70,
  },

  itemImage: {
    width: 50,
    height: 50,
  },

  itemLabel: {
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  itemTitle: {
    fontWeight: "700",
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
  },
});

export default ProductItem;
