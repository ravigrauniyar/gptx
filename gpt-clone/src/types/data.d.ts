export declare type PromptQuery = {
  prompt: string;
};
declare type AccessStates = {
  accessToken: string;
  userProfile: UserProfile | null;
};
declare type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  picture: string;
};
declare type TokenRequest = {
  google_token: string;
};
declare type RefreshTokenRequest = {
  refresh_token: string;
};
declare type TokenResponse = {
  access_token: string;
  refresh_token: string;
};

declare type TextBoxProps = {
  isUserPrompt: boolean;
  promptText: string;
};

declare type AvatarProps = {
  dimension: string;
  picture: string;
};

declare type ConversationProps = {
  id: string;
  userPrompts: string[];
  loadingResponseWithIndex: number;
  aiResponses: string[];
};

declare type InputPromptProps = {
  handleSubmit: UseFormHandleSubmit<PromptQuery, undefined>;
  submitQuery: (query: PromptQuery) => void;
  register: UseFormRegister<PromptQuery>;
  setValue: UseFormSetValue<PromptQuery>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

declare type Chat = {
  id: string;
  title: string;
  isLastOpenedChat: boolean;
  userPrompts: string[];
  aiResponses: string[];
};

declare type UpdateChat = {
  newTitle: string;
  isLastOpenedChat: boolean;
};

declare type SidebarSliceProps = {
  isSidebarOpen: boolean;
  isTitleEditOn: boolean;
  isDeletePopUpOpen: boolean;
  chatHistory: Chat[];
};

declare type PromptData = {
  chatId: string;
  prompt: string;
  response: string;
  responseIndex: number;
};

declare type PromptDataResponse = {
  promptUniqueKey: string;
  chatId: string;
  prompt: string;
  response: string;
  created_at: string;
};

declare type PopUpModalProps = {
  viewportBgColor: string;
  popUpModalBg: string;
  titleText: string;
  bodyText: string;
  leftBtnText: string;
  leftBtnBgColor: string;
  leftBtnHoverBgColor: string;
  handleLeftBtnClick: () => void;
  rightBtnText: string;
  rightBtnBgColor: string;
  rightBtnHoverBgColor: string;
  handleRightBtnClick: () => void;
};
