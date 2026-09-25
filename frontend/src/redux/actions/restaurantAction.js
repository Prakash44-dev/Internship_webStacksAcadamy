import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Utils/api";

export const getAllRestaurants = createAsyncThunk(
  "restaurant/getAllRestaurants",
  async (args = {}, { rejectWithValue }) => {
    try {
      const params = typeof args === "string" ? { keyword: args } : { ...args };
      if (!params.city || params.city.toLowerCase() === "all") {
        delete params.city;
      }
      if (!params.keyword) {
        delete params.keyword;
      }

      const { data } = await api.get("/eats/stores", {
        params,
      });

      return {
        restaurants: data.restaurants,
        count: data.count,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to load restaurants",
      );
    }
  },
);

export const createRestaurant = createAsyncThunk(
  "restaurant/createRestaurant",
  async (restaurantData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/eats/stores", restaurantData);
      return data.restaurant;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to create restaurant",
      );
    }
  },
);

export const deleteRestaurant = createAsyncThunk(
  "restaurant/deleteRestaurant",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/eats/stores/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete restaurant",
      );
    }
  },
);
export const analyzeRestaurantReviews = createAsyncThunk(
  "restaurant/analyzeRestaurantReviews",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/ai/admin/restaurants/${id}/analyze`);
      return {
        id,
        aiData: data.aiData,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to analyze reviews",
      );
    }
  },
);
