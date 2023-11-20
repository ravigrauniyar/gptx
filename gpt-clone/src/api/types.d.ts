import { ChatCompletionMessage } from "openai/resources/index.mjs";

// https://jsonapi.org/format/#document-top-level
export declare type JsonAPIObjectResp<T> = {
  data: T;
};
// https://jsonapi.org/format/#error-objects
declare type JsonAPIError = {
  status: string;
  title: string;
  detail: string?;
};
export declare type JsonAPIErrorResp = {
  errors: JsonAPIError[];
};

export declare type JsonAPIResp<T> = JsonAPIObjectResp<T> | JsonAPIErrorResp;

export declare interface IJsonAPI {
  getPromptResponse(prompt: string): Promise<string | ChatCompletionMessage>;

  get<T>(
    path: string,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>>;

  post<T, U>(
    path: string,
    body?: U,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>>;

  put<T, U>(
    path: string,
    body?: U,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>>;

  delete(
    path: string,
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<string>>;
}
