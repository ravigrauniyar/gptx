import { API } from "../client/api/api";
import { JsonAPIResp, JsonAPIErrorResp } from "../client/api/types";
import { IStorageClient } from "../client/storage/types";
import { IRepository } from "./types";

export class Repository implements IRepository {
  private _api: API;
  private _localStorage: IStorageClient;
  private CHAT_CONTROLLER_URL = "conversations";

  constructor(
    VITE_OPENAI_API_KEY: string,
    VITE_BASE_URL: string,
    localStorageClient: IStorageClient
  ) {
    this._localStorage = localStorageClient;
    this._api = new API(VITE_OPENAI_API_KEY, VITE_BASE_URL);
  }
  private _getResponse<T>(response: JsonAPIResp<T>) {
    return "data" in response
      ? response.data
      : "errors" in response
      ? response
      : undefined;
  }

  // Implementation of IRepository
  async getStorage(): Promise<IStorageClient> {
    return this._localStorage;
  }
  async getAiResponse(prompt: string): Promise<string> {
    const responseData = await this._api.getPromptResponse(prompt);
    return typeof responseData === "string"
      ? "Unsuccessful"
      : responseData.content!;
  }
  async getChatHistory<Chat>() {
    const responseData = await this._api.get<Chat[]>(
      this.CHAT_CONTROLLER_URL,
      undefined,
      false
    );
    return this._getResponse(responseData);
  }
  async storePromptData<PromptDataResponse, PromptData>(
    data: PromptData
  ): Promise<PromptDataResponse | JsonAPIErrorResp | undefined> {
    const headers = new Map<string, string>();
    headers.set("Content-Type", "application/json");

    const response = await this._api.post<PromptDataResponse, PromptData>(
      `${this.CHAT_CONTROLLER_URL}/prompts`,
      data,
      headers,
      false
    );
    return this._getResponse(response);
  }
  async updateChat<Chat, UpdateChat>(
    chatId: string,
    body?: UpdateChat
  ): Promise<Chat | JsonAPIErrorResp | undefined> {
    const headers = new Map<string, string>();
    headers.set("Content-Type", "application/json");

    const response = await this._api.put<Chat, UpdateChat>(
      `${this.CHAT_CONTROLLER_URL}/${chatId}`,
      body!,
      headers,
      false
    );
    return this._getResponse<Chat>(response);
  }
  async deleteChat(id: string): Promise<undefined> {
    const response = await this._api.delete(
      `${this.CHAT_CONTROLLER_URL}/${id}`,
      false
    );
    if (response) {
      if ("errors" in response) {
        console.log(response.errors);
      }
    } else return response;
  }
  async startNewChat<Chat>(): Promise<Chat | JsonAPIErrorResp | undefined> {
    const response = await this._api.put<Chat, undefined>(
      `${this.CHAT_CONTROLLER_URL}/new_chat`,
      undefined,
      undefined,
      false
    );
    return this._getResponse<Chat>(response);
  }
}
