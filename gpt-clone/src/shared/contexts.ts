import React from "react";
import { Repository } from "../repositories/Repository";
import { LocalStorageClient } from "../client/storage/Storage";

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const localStorageClient = new LocalStorageClient(window.localStorage);

export const repository = new Repository(
  VITE_OPENAI_API_KEY,
  VITE_BASE_URL,
  localStorageClient
);

export const RepositoryContext = React.createContext(repository);
