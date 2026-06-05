import { createSlice } from '@reduxjs/toolkit';

const mockRestaurants = [
    {
        id: 1,
        name: "Burger King",
        rating: 4.2,
        deliveryTime: "30-40 min",
        categories: ["American", "Burgers", "Fast Food"],
        priceForTwo: "₹350 for two",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        promoted: true
    },
    {
        id: 2,
        name: "Pizza Hut",
        rating: 4.0,
        deliveryTime: "45-55 min",
        categories: ["Pizzas", "Italian"],
        priceForTwo: "₹450 for two",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        promoted: false
    },
    {
        id: 3,
        name: "Meghana Foods",
        rating: 4.6,
        deliveryTime: "35-45 min",
        categories: ["Biryani", "Andhra", "South Indian"],
        priceForTwo: "₹500 for two",
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        promoted: true
    },
    {
        id: 4,
        name: "The Dessert Heaven",
        rating: 4.5,
        deliveryTime: "25-35 min",
        categories: ["Desserts", "Bakery"],
        priceForTwo: "₹250 for two",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        promoted: false
    },
    {
        id: 5,
        name: "KFC",
        rating: 4.1,
        deliveryTime: "30-40 min",
        categories: ["American", "Fast Food", "Snacks"],
        priceForTwo: "₹400 for two",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        promoted: false
    },
    {
        id: 6,
        name: "Nandhana Palace",
        rating: 4.3,
        deliveryTime: "40-50 min",
        categories: ["Andhra", "Biryani", "South Indian"],
        priceForTwo: "₹600 for two",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
        promoted: false
    }
];

const mockCategories = [
    { id: 1, name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=60" },
    { id: 2, name: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60" },
    { id: 3, name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=60" },
    { id: 4, name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=60" },
    { id: 5, name: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop&q=60" },
    { id: 6, name: "South Indian", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&auto=format&fit=crop&q=60" },
    { id: 7, name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&auto=format&fit=crop&q=60" },
    { id: 8, name: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60" },
];

const mockMenu = [
    { id: 101, name: "Chicken Biryani", price: 299, description: "Authentic Hyderabadi chicken biryani", veg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=60" },
    { id: 102, name: "Paneer Butter Masala", price: 249, description: "Rich and creamy paneer curry", veg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200&auto=format&fit=crop&q=60" },
    { id: 103, name: "Margherita Pizza", price: 199, description: "Classic cheese and tomato pizza", veg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=60" },
    { id: 104, name: "Crispy Chicken Burger", price: 149, description: "Juicy chicken patty with fresh lettuce", veg: false, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60" },
    { id: 105, name: "Chocolate Lava Cake", price: 129, description: "Warm chocolate cake with a gooey center", veg: true, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200&auto=format&fit=crop&q=60" },
];

const initialState = {
    restaurants: mockRestaurants,
    categories: mockCategories,
    menuItems: mockMenu, // Shared mock menu for any restaurant page for simplicity
    searchQuery: '',
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        }
    }
});

export const { setSearchQuery } = dataSlice.actions;
export default dataSlice.reducer;
