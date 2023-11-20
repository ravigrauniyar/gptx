import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { pushAiResponse } from "../redux/slice/conversationSlice";
import { useContext } from "react";
import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";
import { storePromptData } from "../services/ApiServices";
import { InputPromptProps, PromptData } from "../types/data";

export const InputPrompt = (inputPromptProps: InputPromptProps) => {
  const { handleSubmit, submitQuery, register, setValue, handleKeyDown } =
    inputPromptProps;

  const dispatch = useDispatch();
  const conversations = useSelector((state: RootState) => state.conversations);

  const latestPrompt =
    conversations.userPrompts[conversations.userPrompts.length - 1];

  const apiRepository = useContext<Repository>(RepositoryContext);

  const handleRegenerate = () => {
    submitQuery({ prompt: latestPrompt });
  };
  const handleStopGenerating = async () => {
    dispatch(pushAiResponse("Prompt cancelled!"));

    const promptData: PromptData = {
      chatId: conversations.id,
      prompt: latestPrompt,
      response: "Prompt cancelled!",
      responseIndex: conversations.aiResponses.length,
    };
    await storePromptData(apiRepository, promptData);
  };
  return (
    <div className="absolute z-10 bottom-0 flex justify-center w-full bg-gradient-to-b from-transparent to-[#343541] via-[#343541]">
      <div className="flex flex-col w-[95%] xl:w-3/4 max-w-[960px]">
        {conversations.userPrompts.length !== 0 && (
          <div className="flex w-full justify-end mb-4">
            {conversations.loadingResponseWithIndex === -1 ? (
              <button
                onClick={handleRegenerate}
                className="text-defaultTextColor flex items-center justify-center leading-[1.25rem] text-[0.875rem] font-[600] bg-[#343541] border border-[#565869] rounded-lg w-[155px] h-[45px]"
              >
                <img
                  src="/icons/ArrowCycle.svg"
                  alt="Regenerate Icon"
                  className="w-[15px] mr-2"
                />
                Regenerate
              </button>
            ) : (
              <button
                onClick={handleStopGenerating}
                className="text-defaultTextColor flex items-center justify-center leading-[1.25rem] text-[0.875rem] font-[600] bg-[#343541] border border-[#565869] rounded-lg w-[190px] h-[45px]"
              >
                <div className="w-[12px] h-[12px] rounded-sm border mr-2" />
                Stop generating
              </button>
            )}
          </div>
        )}
        <form
          className="flex text-white h-[50px] md:h-[70px] items-center justify-between px-3 py-2 lg:py-5 rounded-xl border border-[#20212380] bg-[#40414f]"
          onSubmit={handleSubmit(submitQuery)}
        >
          <input
            {...register("prompt")}
            type="text"
            placeholder="Send a message"
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue("prompt", e.target.value)}
            autoComplete="off"
            className="w-[90%] h-[35px] py-1 bg-transparent border-none outline-none"
          />
          <button type="submit">
            <img
              src="/icons/Send.svg"
              alt="Submit Icon"
              className="w-[30px] mr-1 cursor-pointer"
            />
          </button>
        </form>
        <div className="w-full text-xs my-2 text-center text-[#c5c5d2]">
          ChatGPTX never makes any mistake. Don't ever verify important
          information.
        </div>
      </div>
    </div>
  );
};
