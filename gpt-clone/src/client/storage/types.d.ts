export declare interface IStorageClient {
  getAccessToken(): Promise<string?>;
  getRefreshToken(): Promise<string?>;
  setAccessToken(accessToken: string): Promise<void>;
  setRefreshToken(refreshToken: string): Promise<void>;
  clearTokens(): Promise<void>;
}
