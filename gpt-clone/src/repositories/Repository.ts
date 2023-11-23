import { API } from "../client/api/api";
import { JsonAPIResp, JsonAPIErrorResp } from "../client/api/types";
import { IStorageClient } from "../client/storage/types";
import { UserProfile } from "../types/data";
import { IRepository } from "./types";

export class Repository implements IRepository {
  private _api: API;
  private _localStorage: IStorageClient;
  private CHAT_CONTROLLER_URL = "conversations";
  private ACCESS_CONTROLLER_URL = "access";

  constructor(
    VITE_OPENAI_API_KEY: string,
    VITE_BASE_URL: string,
    localStorageClient: IStorageClient
  ) {
    this._localStorage = localStorageClient;
    this._api = new API(VITE_OPENAI_API_KEY, VITE_BASE_URL, localStorageClient);
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
  async requestLogin<TokenResponse, TokenRequest>(
    googleToken: TokenRequest
  ): Promise<TokenResponse | JsonAPIErrorResp | undefined> {
    const responseData = await this._api.post<TokenResponse, TokenRequest>(
      `${this.ACCESS_CONTROLLER_URL}/request`,
      googleToken,
      undefined,
      false
    );
    return this._getResponse(responseData);
  }
  async getAiResponse(prompt: string): Promise<string> {
    const responseData = await this._api.getPromptResponse(prompt);
    return typeof responseData === "string"
      ? "Unsuccessful"
      : responseData.content!;
  }
  async getUserProfile(): Promise<UserProfile | JsonAPIErrorResp | undefined> {
    const userResponse = await this._api.get<UserProfile>(
      `${this.ACCESS_CONTROLLER_URL}/profile`
    );
    return this._getResponse<UserProfile>(userResponse);
  }
  async getChatHistory<Chat>() {
    const responseData = await this._api.get<Chat[]>(this.CHAT_CONTROLLER_URL);
    return this._getResponse(responseData);
  }
  async storePromptData<PromptDataResponse, PromptData>(
    data: PromptData
  ): Promise<PromptDataResponse | JsonAPIErrorResp | undefined> {
    const response = await this._api.post<PromptDataResponse, PromptData>(
      `${this.CHAT_CONTROLLER_URL}/prompts`,
      data
    );
    return this._getResponse(response);
  }
  async updateChat<Chat, UpdateChat>(
    chatId: string,
    body?: UpdateChat
  ): Promise<Chat | JsonAPIErrorResp | undefined> {
    const response = await this._api.put<Chat, UpdateChat>(
      `${this.CHAT_CONTROLLER_URL}/${chatId}`,
      body!
    );
    return this._getResponse<Chat>(response);
  }
  async deleteChat(id: string): Promise<undefined> {
    const response = await this._api.delete(
      `${this.CHAT_CONTROLLER_URL}/${id}`
    );
    if (response) {
      if ("errors" in response) {
        console.log(response.errors);
      }
    } else return response;
  }
  async startNewChat<Chat>(): Promise<Chat | JsonAPIErrorResp | undefined> {
    const response = await this._api.put<Chat, undefined>(
      `${this.CHAT_CONTROLLER_URL}/new_chat`
    );
    return this._getResponse<Chat>(response);
  }
}
