import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./slice/conversationSlice";
import sidebarSlice from "./slice/sidebarSlice";

export const gptStore = configureStore({
  reducer: {
    conversations: conversationSlice,
    sidebar: sidebarSlice,
  },
});
export type RootState = ReturnType<typeof gptStore.getState>;
export type AppDispatch = typeof gptStore.dispatch;
