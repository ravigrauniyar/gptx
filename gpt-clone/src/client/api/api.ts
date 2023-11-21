import OpenAI from "openai";
import { IJsonAPI, JsonAPIResp } from "./types";
import _ from "lodash";
import { IStorageClient } from "../storage/types";
import { RefreshTokenRequest, TokenResponse } from "../../types/data";

export class API implements IJsonAPI {
  private _openai: OpenAI;
  // Access base url from env file
  private _BASE_URL: string;
  // Declare local storage client
  private _localStorageClient: IStorageClient;
  // URL for accessing refreshed access token
  private _REFRESH_TOKEN_URL: string = "access/refresh";

  constructor(
    VITE_OPENAI_API_KEY: string,
    baseUrl: string,
    localStorageClient: IStorageClient
  ) {
    this._openai = new OpenAI({
      apiKey: VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this._BASE_URL = baseUrl;
    this._localStorageClient = localStorageClient;
  }
  // Returns the Headers array from key value pairs
  private _buildHeaders(headers: Map<string, string>): Headers {
    const _headers = new Headers();
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
  // Fetch the refresh token from the API
  private async refreshToken(): Promise<void> {
    const refreshToken = await this._localStorageClient.getRefreshToken();

    if (refreshToken) {
      const body: RefreshTokenRequest = { refresh_token: refreshToken };
      const headers = new Map<string, string>();
      headers.set("Content-Type", "application/json");

      const response = await this.post<TokenResponse, RefreshTokenRequest>(
        this._REFRESH_TOKEN_URL,
        body,
        headers,
        false
      );
      if ("data" in response) {
        await this._localStorageClient.setAccessToken(
          response.data.access_token
        );
      } else {
        throw new Error("Token refresh failed");
      }
    }
  }
  // Makes an API call with provided request parameters
  private async _request<T, U>(
    path: string,
    method: string,
    isAuthorized: boolean,
    headers: Map<string, string>,
    body?: U
  ): Promise<JsonAPIResp<T>> {
    // Create a Headers array for the request

    headers.set("Content-Type", "application/json");
    const _headers = this._buildHeaders(headers);

    // Add authorization header if necessary
    if (isAuthorized) {
      const accessToken = await this._localStorageClient.getAccessToken();
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

    if (response.status === 401) {
      // Refresh the token
      await this.refreshToken();

      // Get the new access token
      const newAccessToken = await this._localStorageClient.getAccessToken();
      // Retry the original request with the new access token
      if (newAccessToken) {
        _headers.set("Authorization", `Bearer ${newAccessToken}`);
        requestOption.headers = _headers;

        const refreshedResponse = await fetch(
          `${this._BASE_URL}/${path}`,
          requestOption
        );
        const refreshTokenResponse = await this._parseResponse<JsonAPIResp<T>>(
          refreshedResponse
        );
        return refreshTokenResponse;
      }
    }
    // Parse the response for success or failure result and return it
    const apiResponse = await this._parseResponse<JsonAPIResp<T>>(response);
    return apiResponse;
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
    body?: U,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<T>> {
    return this._request<T, U>(path, "PUT", isAuthorized, headers, body);
  }
  delete(
    path: string,
    headers: Map<string, string> = new Map(),
    isAuthorized: boolean = true
  ): Promise<JsonAPIResp<undefined>> {
    return this._request(path, "DELETE", isAuthorized, headers);
  }
}
