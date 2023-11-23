import { UserAvatar } from "./shared/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  toggleSidebarOpen,
  toggleTitleEditOn,
} from "../redux/slice/sidebarSlice";
import { ChatHistory } from "./ChatHistory";
import { useContext, useEffect } from "react";
import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";
import { startNewChat, storePromptData } from "../services/ApiServices";
import { PromptData } from "../types/data";
import { setAuthToken, setUserProfile } from "../redux/slice/accessSlice";
import { useNavigate } from "react-router-dom";
import { TooltipComponent } from "./shared/Tooltip";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebar = useSelector((state: RootState) => state.sidebar);
  const conversation = useSelector((state: RootState) => state.conversations);
  const profile = useSelector(
    (state: RootState) => state.persistedReducer.accessStates.userProfile
  );

  const apiRepository = useContext<Repository>(RepositoryContext);

  useEffect(() => {
    const getProfile = async () => {
      const profile = await apiRepository.getUserProfile();
      if (profile) {
        if ("errors" in profile) {
          console.error("User profile not found!");
        } else {
          dispatch(setUserProfile(profile));
        }
      }
    };
    getProfile();
  }, [apiRepository, dispatch]);

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
  const logout = async () => {
    dispatch(setAuthToken(""));
    dispatch(setUserProfile(null));

    const localStorage = await apiRepository.getStorage();
    await localStorage.setAccessToken("");
    await localStorage.setRefreshToken("");

    navigate("/auth/login");
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
          data-tooltip-id="hideSidebar"
          data-tooltip-offset={10}
          data-tooltip-content="Hide Sidebar"
          data-tooltip-place="right"
          onClick={() => dispatch(toggleSidebarOpen())}
          className="relative flex w-[55px] p-3 items-center justify-center rounded-md border border-[#565869] cursor-pointer"
        >
          <img
            src="/icons/Sidebar.svg"
            alt="Sidebar Toggler"
            className="w-[20px] h-[20px]"
          />
          <TooltipComponent id="hideSidebar" />
        </div>
      </div>
      <ChatHistory />
      <div className="grow" />
      <div className="flex flex-col w-full items-center text-sm mb-2">
        <div className="flex w-[90%] border-t border-[#565869] p-3">
          <img src="/icons/Stars.svg" alt="Stars Icon" className="w-[25px]" />
          <div className="ml-2 text-white">Upgrade plan</div>
        </div>
        {profile && (
          <div className="flex items-center justify-around w-[90%] py-3 text-white">
            <div className="flex items-center">
              <UserAvatar
                picture={profile.picture}
                dimension="w-[30px] h-[30px]"
              />
              <p className="font-bold text-[20px] ml-2">{`${profile.first_name} ${profile.last_name}`}</p>
            </div>
            <div className="relative">
              <img
                data-tooltip-id="logout"
                data-tooltip-content="Logout"
                data-tooltip-place="right"
                src="/icons/Logout.svg"
                alt="Logout Icon"
                className="w-[25px] cursor-pointer"
                onClick={logout}
              />
              <TooltipComponent id="logout" />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      data-tooltip-id="showSidebar"
      data-tooltip-offset={10}
      data-tooltip-content="Show Sidebar"
      data-tooltip-place="right"
      onClick={() => dispatch(toggleSidebarOpen())}
      className="absolute z-10 hidden md:flex flex-col items-center justify-center m-[10px] w-[55px] h-[55px] hover:bg-[#444654] rounded-md cursor-pointer"
    >
      <img
        src="/icons/Sidebar.svg"
        alt="Sidebar Toggler"
        className="w-[20px] h-[20px]"
      />
      <TooltipComponent id="showSidebar" />
    </div>
  );
};
