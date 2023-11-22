import { UserAvatar } from "./shared/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  toggleSidebarOpen,
  toggleTitleEditOn,
} from "../redux/slice/sidebarSlice";
import { ChatHistory } from "./ChatHistory";
import { useContext } from "react";
import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";
import { startNewChat, storePromptData } from "../services/ApiServices";
import { PromptData } from "../types/data";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector((state: RootState) => state.sidebar);
  const conversation = useSelector((state: RootState) => state.conversations);

  const apiRepository = useContext<Repository>(RepositoryContext);

  const handleStartNewChat = async () => {
    if (sidebar.isTitleEditOn) {
      dispatch(toggleTitleEditOn());
    }
    if (conversation.loadingResponseWithIndex !== -1) {
      const promptData: PromptData = {
        chatId: conversation.id,
        prompt: conversation.userPrompts[conversation.loadingResponseWithIndex],

        responseIndex: conversation.loadingResponseWithIndex,
        response: "Interrupted",
      };
      await storePromptData(apiRepository, promptData);
    }
    await startNewChat(apiRepository, dispatch);
  };

  return sidebar.isSidebarOpen ? (
    <div className="hidden md:flex flex-col items-center min-w-[260px] bg-[#202123]">
      <div className="flex mt-2 w-full justify-between px-2 text-sm">
        <div
          onClick={handleStartNewChat}
          className="flex w-[175px] py-3 px-2 rounded-md border border-[#565869] cursor-pointer"
        >
          <img src="/icons/Plus.svg" alt="New Chat" className="w-[25px]" />
          <div className="ml-3 text-white cursor-pointer">New Chat</div>
        </div>
        <div
          onClick={() => dispatch(toggleSidebarOpen())}
          className="flex w-[55px] p-3 items-center justify-center rounded-md border border-[#565869] cursor-pointer"
        >
          <img
            src="/icons/Sidebar.svg"
            alt="Sidebar Toggler"
            className="w-[20px] h-[20px]"
          />
        </div>
      </div>
      <ChatHistory />
      <div className="grow" />
      <div className="flex flex-col w-full items-center text-sm mb-2">
        <div className="flex w-[90%] border-t border-[#565869] p-3">
          <img src="/icons/Stars.svg" alt="Stars Icon" className="w-[25px]" />
          <div className="ml-2 text-white">Upgrade plan</div>
        </div>
        <div className="flex items-center justify-around w-[90%] py-3 text-white">
          <div className="flex items-center">
            <UserAvatar bgColor="bg-blue" dimension="w-[30px] h-[30px]" />
            <p className="font-bold ml-3">Ravi Rauniyar</p>
          </div>
          <img
            src="/icons/HorizontalDots.svg"
            alt="Dots Icon"
            className="w-[25px]"
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => dispatch(toggleSidebarOpen())}
      className="absolute z-10 hidden md:flex flex-col items-center justify-center m-[10px] w-[55px] h-[55px] hover:bg-[#444654] rounded-md cursor-pointer"
    >
      <img
        src="/icons/Sidebar.svg"
        alt="Sidebar Toggler"
        className="w-[20px] h-[20px]"
      />
    </div>
  );
};
