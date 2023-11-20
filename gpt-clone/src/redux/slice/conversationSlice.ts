import { createSlice } from "@reduxjs/toolkit";
import { ConversationProps } from "../../types/data";

const initialState: ConversationProps = {
  id: "",
  userPrompts: [],
  loadingResponseWithIndex: -1,
  aiResponses: [],
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.id = action.payload;
    },
    pushUserPrompt: (state, action) => {
      state.userPrompts.push(action.payload);
      state.loadingResponseWithIndex = state.userPrompts.length - 1;
    },
    pushAiResponse: (state, action) => {
      if (state.loadingResponseWithIndex !== -1) {
        state.loadingResponseWithIndex = -1;
        state.aiResponses.push(action.payload);
      }
    },
    setCurrentChat: (state, action) => {
      state.id = action.payload.id;
      state.userPrompts = action.payload.userPrompts;
      state.loadingResponseWithIndex = -1;
      state.aiResponses = action.payload.aiResponses;
    },
    resetChat: (state) => {
      state.id = "";
      state.userPrompts = [];
      state.aiResponses = [];
    },
  },
});

export const {
  setChatId,
  pushUserPrompt,
  pushAiResponse,
  setCurrentChat,
  resetChat,
} = conversationSlice.actions;

export default conversationSlice.reducer;
