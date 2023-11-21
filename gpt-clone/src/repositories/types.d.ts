import { TokenResponse } from "@react-oauth/google";
import { JsonAPIErrorResp } from "../client/api/types";
import { IStorageClient } from "../client/storage/types";
import { TokenRequest } from "../types/data";

export interface IRepository {
  requestLogin(
    googleToken: TokenRequest
  ): Promise<TokenResponse | JsonAPIErrorResp | undefined>;
  
  getStorage(): Promise<IStorageClient>;

  getAiResponse(prompt: string): Promise<string>;

  getChatHistory<Chat>(): Promise<Chat[] | JsonAPIErrorResp | undefined>;

  storePromptData<PromptDataResponse, PromptData>(
    data: PromptData
  ): Promise<PromptDataResponse | JsonAPIErrorResp | undefined>;

  updateChat<Chat, UpdateChat>(
    chatId: string,
    body?: UpdateChat
  ): Promise<Chat | JsonAPIErrorResp | undefined>;

  deleteChat(id: string): Promise<undefined>;

  startNewChat<Chat>(): Promise<Chat | JsonAPIErrorResp | undefined>;
}
