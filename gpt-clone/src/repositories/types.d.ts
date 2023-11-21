import { JsonAPIErrorResp } from "../client/api/types";
import { IStorageClient } from "../client/storage/types";

export interface IRepository {
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
