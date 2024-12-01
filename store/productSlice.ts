import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductState {
  allProducts: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  boughtProducts: Product[];
  userCoins: number;
  searchQuery: string;
}

const initialState: ProductState = {
  allProducts: [],
  filteredProducts: [],
  selectedProduct: null,
  boughtProducts: [],
  userCoins: 500,
  searchQuery: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.allProducts = action.payload;
      state.filteredProducts = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredProducts = state.allProducts.filter((product) =>
        product.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    addProductToBought: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!state.boughtProducts.some((item) => item.id === product.id)) {
        state.boughtProducts.push(product);
      }
    },
    removeProductFromBought(state, action: PayloadAction<number>) {
      state.boughtProducts = state.boughtProducts.filter(
        (product) => product.id !== action.payload
      );
    },
    setUserCoins: (state, action: PayloadAction<number>) => {
      state.userCoins = action.payload;
    },
    resetBoughtProducts: (state) => {
      state.boughtProducts = [];
      state.userCoins = 500;
    },
    setBoughtProducts: (state, action: PayloadAction<Product[]>) => {
      state.boughtProducts = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  addProductToBought,
  setUserCoins,
  setSearchQuery,
  removeProductFromBought,
  resetBoughtProducts,
  setBoughtProducts,
} = productSlice.actions;
export default productSlice.reducer;
