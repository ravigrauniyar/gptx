import { IStorageClient } from "./types";

export class LocalStorageClient implements IStorageClient {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }
  async setAccessToken(accessToken: string): Promise<void> {
    this.storage.setItem("accessToken", accessToken);
  }
  async setRefreshToken(refreshToken: string): Promise<void> {
    this.storage.setItem("refreshToken", refreshToken);
  }
  async getAccessToken(): Promise<string | null> {
    return this.storage.getItem("accessToken");
  }
  async getRefreshToken(): Promise<string | null> {
    return this.storage.getItem("refreshToken");
  }
  async clearTokens(): Promise<void> {
    this.storage.clear();
  }
}
