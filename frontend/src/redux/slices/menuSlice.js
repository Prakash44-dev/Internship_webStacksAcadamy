import { createSlice } from "@reduxjs/toolkit";
import { getMenus, createMenu, addItemToMenu } from "../actions/menuAction.js";

const initialState = {
  menus: [],
  menuId: null,
  loading: false,
  error: null,
  creating: false,
  createError: null,
  addingItem: false,
  addError: null,
  newMenu: null,
  updatedMenu: null,
};

const menuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    clearMenuErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.addError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload.menu;
        state.menuId = action.payload.menuId;
      })
      .addCase(getMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMenu.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.creating = false;
        state.newMenu = action.payload;
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      .addCase(addItemToMenu.pending, (state) => {
        state.addingItem = true;
        state.addError = null;
      })
      .addCase(addItemToMenu.fulfilled, (state, action) => {
        state.addingItem = false;
        state.updatedMenu = action.payload;
      })
      .addCase(addItemToMenu.rejected, (state, action) => {
        state.addingItem = false;
        state.addError = action.payload;
      });
  },
});

export const { clearMenuErrors } = menuSlice.actions;

export default menuSlice.reducer;
