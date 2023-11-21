import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import {
  pushAiResponse,
  setCurrentChat,
} from "../redux/slice/conversationSlice";
import { Repository } from "../repositories/Repository";
import { setChatHistory } from "../redux/slice/sidebarSlice";
import {
  PromptData,
  Chat,
  PromptDataResponse,
  UpdateChat,
} from "../types/data";

export const fetchAndStoreResponse = async (
  apiRepo: Repository,
  prompt: string,
  dispatch: Dispatch<AnyAction>,
  chatId: string,
  promptIndex: number
) => {
  const aiResponse = await apiRepo.getAiResponse(prompt);
  dispatch(pushAiResponse(aiResponse));

  const promptData: PromptData = {
    chatId: chatId,
    prompt: prompt,
    response: aiResponse,
    responseIndex: promptIndex,
  };
  await storePromptData(apiRepo, promptData);
};

export const getChatHistory = async (
  chatHistoryRepo: Repository,
  dispatch: Dispatch<AnyAction>
) => {
  const chatHistory = await chatHistoryRepo.getChatHistory<Chat>();
  if (chatHistory) {
    if ("errors" in chatHistory) {
      console.log(chatHistory.errors);
    } else {
      dispatch(setChatHistory(chatHistory));
      const lastOpenedChat = chatHistory.find((chat) => chat.isLastOpenedChat);
      if (lastOpenedChat) {
        dispatch(setCurrentChat(lastOpenedChat));
      }
    }
  } else {
    console.log("Api call failed!");
  }
};

export const storePromptData = async (
  apiRepo: Repository,
  data: PromptData
) => {
  return await apiRepo.storePromptData<PromptDataResponse, PromptData>(data);
};

export const updateChat = async (
  updateChatRepo: Repository,
  updateChatModel: UpdateChat,
  chatId: string,
  dispatch: Dispatch<AnyAction>
) => {
  const updateChatRes = await updateChatRepo.updateChat<Chat, UpdateChat>(
    chatId,
    updateChatModel
  );
  if (updateChatRes) {
    if ("errors" in updateChatRes) {
      console.log(updateChatRes.errors);
    } else {
      dispatch(setCurrentChat(updateChatRes));
    }
  }
};

export const deleteChat = async (
  deleteChatRepo: Repository,
  chatId: string
) => {
  return await deleteChatRepo.deleteChat(chatId);
};

export const startNewChat = async (
  startNewChatRepo: Repository,
  dispatch: Dispatch<AnyAction>
) => {
  const newChat = await startNewChatRepo.startNewChat<Chat>();
  if (newChat) {
    if ("errors" in newChat) {
      console.log(newChat.errors);
    } else {
      dispatch(setCurrentChat(newChat));
    }
  }
};
