import { createSlice } from "@reduxjs/toolkit";
import {
  analyzeRestaurantReviews,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
} from "../actions/restaurantAction";

const initialState = {
  restaurants: [],
  count: 0,
  loading: false,
  error: null,
  showVegOnly: false,
  pureVegRestaurantsCount: 0,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
  analyzing: false,
  analyzeError: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    sortByRatings: (state) => {
      state.restaurants.sort((a, b) => b.ratings - a.ratings);
    },
    sortByReviews: (state) => {
      state.restaurants.sort(
        (a, b) =>
          (b.numOfReviews ?? b.reviews?.length ?? 0) -
          (a.numOfReviews ?? a.reviews?.length ?? 0)
      );
    },
    toggleVegOnly: (state) => {
      state.showVegOnly = !state.showVegOnly;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.restaurants;
        state.count = action.payload.count;
        state.pureVegRestaurantsCount = action.payload.restaurants.filter(
          (restaurant) => restaurant.isVeg,
        ).length;
      })
      .addCase(getAllRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRestaurant.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.creating = false;
        state.restaurants.push(action.payload);
        state.count += 1;
        state.pureVegRestaurantsCount = state.restaurants.filter(
          (restaurant) => restaurant.isVeg,
        ).length;
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      .addCase(deleteRestaurant.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.deleting = false;
        state.restaurants = state.restaurants.filter(
          (restaurant) => restaurant._id !== action.payload.id,
        );
        state.count -= 1;
        state.pureVegRestaurantsCount = state.restaurants.filter(
          (restaurant) => restaurant.isVeg,
        ).length;
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      })
      .addCase(analyzeRestaurantReviews.pending, (state) => {
        state.analyzing = true;
        state.analyzeError = null;
      })
      .addCase(analyzeRestaurantReviews.fulfilled, (state, action) => {
        state.analyzing = false;
        state.restaurants = state.restaurants.map((restaurant) =>
          restaurant._id === action.payload.id
            ? {
                ...restaurant,
                reviewSentiment: action.payload.aiData.sentiment,
                reviewSummaryBullets: action.payload.aiData.summaryBullets,
                reviewTopMentions: action.payload.aiData.topMentions,
              }
            : restaurant,
        );
      })
      .addCase(analyzeRestaurantReviews.rejected, (state, action) => {
        state.analyzing = false;
        state.analyzeError = action.payload;
      });
  },
});

export const { sortByRatings, sortByReviews, toggleVegOnly, clearError } =
  restaurantSlice.actions;

export default restaurantSlice.reducer;
