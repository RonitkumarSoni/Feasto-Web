import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import dataReducer from './dataSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        data: dataReducer,
    },
});
