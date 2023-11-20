import { createSlice } from "@reduxjs/toolkit";
import { SidebarSliceProps } from "../../types/data";

const initialState: SidebarSliceProps = {
  isSidebarOpen: true,
  isTitleEditOn: false,
  isDeletePopUpOpen: false,
  chatHistory: [],
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      state.isTitleEditOn = false;
    },
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
      state.isTitleEditOn = false;
    },
    toggleTitleEditOn: (state) => {
      state.isTitleEditOn = !state.isTitleEditOn;
    },
    toggleDeletePopUpOpen: (state) => {
      state.isDeletePopUpOpen = !state.isDeletePopUpOpen;
    },
  },
});

export const {
  toggleSidebarOpen,
  setChatHistory,
  toggleTitleEditOn,
  toggleDeletePopUpOpen,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
