import React from "react";
import { API } from "../api/api";
import { Repository } from "../repositories/Repository";

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const repository = new Repository(
  new API(VITE_OPENAI_API_KEY, VITE_BASE_URL)
);

export const RepositoryContext = React.createContext(repository);
