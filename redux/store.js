import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // local import from same folder

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
