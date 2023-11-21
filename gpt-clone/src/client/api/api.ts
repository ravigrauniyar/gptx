import OpenAI from "openai";
import { IJsonAPI, JsonAPIResp } from "./types";
import _ from "lodash";

export class API implements IJsonAPI {
  private _openai: OpenAI;
  // Access base url from env file
  private _BASE_URL: string;

  constructor(VITE_OPENAI_API_KEY: string, baseUrl: string) {
    this._openai = new OpenAI({
      apiKey: VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this._BASE_URL = baseUrl;
  }
  // Returns the Headers array from key value pairs
  private _buildHeaders(
    headers: Map<string, string>,
    _headers: Headers
  ): Headers {
    headers.forEach((value, key) => {
      _headers.append(key, value);
    });
    return _headers;
  }
  // Parse the API response
  private async _parseResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      if (response.status === 204) {
        return undefined as T;
      }
    }
    return response.json() as T;
  }
  // Makes an API call with provided request parameters
  private async _request<T, U>(
    path: string,
    method: string,
    isAuthorized: boolean,
    headers?: Map<string, string>,
    body?: U
  ): Promise<JsonAPIResp<T>> {
    // Create a Headers array for the request
    let _headers = new Headers();
    if (headers) {
      _headers = this._buildHeaders(headers, _headers);
    }

    // Add authorization header if necessary
    if (isAuthorized) {
      const accessToken = localStorage.getItem("accessToken");
      _headers.append("Authorization", `Bearer ${accessToken}`);
    }
    // Configure options for the request
    const requestOption: RequestInit = {
      method: method,
      headers: _headers,
    };
    // Add body to request options if it's not undefined
    if (!_.isUndefined(body)) {
      requestOption.body = JSON.stringify(body);
    }

    // Make the request to the API
    const response = await fetch(`${this._BASE_URL}/${path}`, requestOption);
    // Parse the response for success or failure result and return it
    const data = await this._parseResponse<JsonAPIResp<T>>(response);
    return data;
  }
  // Implementation of IJsonAPI interface
  async getPromptResponse(prompt: string) {
    try {
      const response = await this._openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      if (response) {
        return response.choices[0].message;
      } else {
        return "API request failed.";
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }
  get<T>(
    path: string,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>> {
    return this._request(path, "GET", isAuthorized, headers);
  }
  post<T, U>(
    path: string,
    body: U,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>> {
    return this._request<T, U>(path, "POST", isAuthorized, headers, body);
  }
  put<T, U>(
    path: string,
    body: U,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>> {
    return this._request<T, U>(path, "PUT", isAuthorized, headers, body);
  }
  delete(
    path: string,
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<undefined>> {
    return this._request(path, "DELETE", isAuthorized);
  }
}
