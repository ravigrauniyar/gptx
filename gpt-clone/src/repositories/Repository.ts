import { API } from "../api/api";
import { JsonAPIResp, JsonAPIErrorResp } from "../api/types";
import { IRepository } from "./types";

export class Repository implements IRepository {
  private _api: API;
  private CHAT_CONTROLLER_URL = "conversations";

  constructor(api: API) {
    this._api = api;
  }
  private _getResponse<T>(response: JsonAPIResp<T>) {
    return "data" in response
      ? response.data
      : "errors" in response
      ? response
      : undefined;
  }

  // Implementation of IRepository
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
  async deleteChat(id: string): Promise<string | JsonAPIErrorResp | undefined> {
    const response = await this._api.delete(
      `${this.CHAT_CONTROLLER_URL}/${id}`,
      false
    );
    return this._getResponse<string>(response);
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
