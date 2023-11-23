import { combineReducers, configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./slice/conversationSlice";
import sidebarSlice from "./slice/sidebarSlice";
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  PERSIST,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import accessSlice from "./slice/accessSlice";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    accessStates: accessSlice,
  })
);
export const gptStore = configureStore({
  reducer: {
    persistedReducer,
    conversations: conversationSlice,
    sidebar: sidebarSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persister = persistStore(gptStore);
export type RootState = ReturnType<typeof gptStore.getState>;
export type AppDispatch = typeof gptStore.dispatch;
