import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Backup mock categories since we didn't build a full Categories CRUD in backend yet
const mockCategories = [
    { id: '1', name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=60" },
    { id: '2', name: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60" },
    { id: '3', name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=60" },
    { id: '4', name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=60" },
    { id: '5', name: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop&q=60" },
    { id: '6', name: "South Indian", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&auto=format&fit=crop&q=60" },
    { id: '7', name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&auto=format&fit=crop&q=60" },
    { id: '8', name: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60" },
];

export const fetchRestaurants = createAsyncThunk(
    'data/fetchRestaurants',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/restaurants');
            // Backend returns { restaurants: [...] }
            return response.data.data.restaurants;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch restaurants');
        }
    }
);

export const fetchMenu = createAsyncThunk(
    'data/fetchMenu',
    async (restaurantId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/foods/restaurant/${restaurantId}`);
            // Backend returns { foods: [...] }
            return response.data.data.foods;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch menu');
        }
    }
);

const initialState = {
    restaurants: [],
    categories: mockCategories, // Using mock for now since it's just static UI
    menuItems: [],
    searchQuery: '',
    loading: false,
    error: null,
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems = action.payload;
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchQuery } = dataSlice.actions;
export default dataSlice.reducer;
