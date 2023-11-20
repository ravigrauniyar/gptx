import { JsonAPIErrorResp } from "../api/types";

export interface IRepository {
  getAiResponse(prompt: string): Promise<string>;

  getChatHistory<Chat>(): Promise<Chat[] | JsonAPIErrorResp | undefined>;

  storePromptData<PromptDataResponse, PromptData>(
    data: PromptData
  ): Promise<PromptDataResponse | JsonAPIErrorResp | undefined>;

  updateChat<Chat, UpdateChat>(
    chatId: string,
    body?: UpdateChat
  ): Promise<Chat | JsonAPIErrorResp | undefined>;

  deleteChat(id: string): Promise<string | JsonAPIErrorResp | undefined>;

  startNewChat<Chat>(): Promise<Chat | JsonAPIErrorResp | undefined>;
}
