import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useContext, useEffect } from "react";
import {
  deleteChat,
  getChatHistory,
  startNewChat,
  updateChat,
} from "../services/ApiServices";
import { RepositoryContext } from "../shared/contexts";
import { Repository } from "../repositories/Repository";
import {
  toggleDeletePopUpOpen,
  toggleTitleEditOn,
} from "../redux/slice/sidebarSlice";
import { useForm } from "react-hook-form";
import { PopUpModal } from "./shared/PopUpModal";
import { Chat, PopUpModalProps, UpdateChat } from "../types/data";
import _ from "lodash";

enum SelectedChatBg {
  active = "bg-[#343541]",
  inactive = "bg-transparent",
  hover = "hover:bg-[#2A2B32]",
}
export const ChatHistory = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state: RootState) => state.conversations);
  const sidebar = useSelector((state: RootState) => state.sidebar);

  const { register, handleSubmit, setValue } = useForm<UpdateChat>({
    defaultValues: {
      newTitle: "",
      isLastOpenedChat: true,
    },
  });

  const apiRepository = useContext<Repository>(RepositoryContext);

  const handleSelectChat = async (id: string) => {
    const chat = sidebar.chatHistory.find((chat: Chat) => chat.id === id);
    if (chat && id !== conversations.id) {
      const newData: UpdateChat = {
        newTitle: chat.title,
        isLastOpenedChat: true,
      };
      await updateChat(apiRepository, newData, id, dispatch);
      await getChatHistory(apiRepository, dispatch);
    }
  };
  const handleDeleteChat = async () => {
    const deleteResponse = await deleteChat(apiRepository, conversations.id);
    if (_.isUndefined(deleteResponse)) {
      console.log("Chat deleted successfully!");
    }
    await startNewChat(apiRepository, dispatch);
    await getChatHistory(apiRepository, dispatch);
    dispatch(toggleDeletePopUpOpen());
  };
  const submitEditTitle = async (updateData: UpdateChat) => {
    if (updateData.newTitle) {
      dispatch(toggleTitleEditOn());
      await updateChat(apiRepository, updateData, conversations.id, dispatch);
      await getChatHistory(apiRepository, dispatch);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(submitEditTitle)();
    }
  };
  const handleCancelEditTitle = () => {
    setValue("newTitle", "");
    dispatch(toggleTitleEditOn());
  };
  const handleDeletePopUp = () => {
    dispatch(toggleDeletePopUpOpen());
  };

  useEffect(() => {
    getChatHistory(apiRepository, dispatch);
  }, [apiRepository, dispatch]);

  return (
    <div className="flex w-full flex-col items-center mt-2">
      {sidebar.chatHistory.map((chat: Chat, index: number) => {
        const chatBgColor =
          conversations.id === chat.id
            ? SelectedChatBg.active
            : SelectedChatBg.inactive;

        const titleDivWidth =
          chatBgColor === SelectedChatBg.active ? "w-[150px]" : "w-[220px]";

        const deleteModalProps: PopUpModalProps = {
          viewportBgColor: "bg-[#56586973]",
          popUpModalBg: "bg-[#202122]",
          titleText: "Delete chat?",
          bodyText: conversations.userPrompts[0],
          leftBtnText: "Cancel",
          leftBtnBgColor: "bg-[#343541]",
          leftBtnHoverBgColor: "hover:bg-[#494959]",
          handleLeftBtnClick: handleDeletePopUp,
          rightBtnText: "Delete",
          rightBtnBgColor: "bg-[#b91c1c]",
          rightBtnHoverBgColor: "hover:bg-[#a13535]",
          handleRightBtnClick: handleDeleteChat,
        };

        return (
          <div key={index}>
            {sidebar.isDeletePopUpOpen ? (
              <PopUpModal {...deleteModalProps} />
            ) : null}
            <div
              onClick={() => handleSelectChat(chat.id)}
              className={`flex ${chatBgColor} ${
                chatBgColor !== SelectedChatBg.active
                  ? SelectedChatBg.hover
                  : null
              } justify-between items-center w-[240px] h-[50px] rounded-md cursor-pointer`}
            >
              <div className={`${titleDivWidth} flex ml-2`}>
                <img
                  src="/icons/Chat.svg"
                  alt="Chat Icon"
                  className="w-[23px] mr-3"
                />
                {(!sidebar.isTitleEditOn || conversations.id !== chat.id) && (
                  <div className="truncate text-defaultTextColor text-sm">
                    {chat.title}
                  </div>
                )}
                {sidebar.isTitleEditOn && conversations.id === chat.id && (
                  <div className="w-full h-[25px] text-defaultTextColor text-sm px-1 bg-transparent border border-gray outline-none">
                    <input
                      {...register("newTitle")}
                      type="text"
                      placeholder={chat.title}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setValue("newTitle", e.target.value)}
                      autoComplete="off"
                      className="w-full h-[20px] bg-transparent border-none outline-none"
                    />
                  </div>
                )}
              </div>
              {chatBgColor === SelectedChatBg.active &&
                !sidebar.isTitleEditOn && (
                  <div className="flex justify-between w-[50px] mr-2">
                    <img
                      onClick={() => dispatch(toggleTitleEditOn())}
                      src="/icons/Edit.svg"
                      alt="Edit Icon"
                      className="w-[18px]"
                    />
                    <img
                      onClick={() => dispatch(toggleDeletePopUpOpen())}
                      src="/icons/Delete.svg"
                      alt="Delete Icon"
                      className="w-[23px]"
                    />
                  </div>
                )}
              {chatBgColor === SelectedChatBg.active &&
                sidebar.isTitleEditOn && (
                  <div className="flex items-center justify-between w-[55px] mr-2">
                    <form onSubmit={handleSubmit(submitEditTitle)}>
                      <button
                        type="submit"
                        className="w-[25px] flex items-center"
                      >
                        <img
                          src="/icons/Tick.svg"
                          alt="Tick Icon"
                          className="w-full"
                        />
                      </button>
                    </form>
                    <img
                      onClick={handleCancelEditTitle}
                      src="/icons/Cross.svg"
                      alt="Cross Icon"
                      className="w-[25px]"
                    />
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
