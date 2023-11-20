import { useForm } from "react-hook-form";
import promptSuggestions from "../utils/PromptSuggestions.json";
import { useContext, useEffect, useRef } from "react";
import { TextBox } from "./shared/TextBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { pushUserPrompt, setChatId } from "../redux/slice/conversationSlice";
import { v4 as uuidv4 } from "uuid";
import { InputPrompt } from "./InputPrompt";
import { fetchAndStoreResponse, getChatHistory } from "../services/ApiServices";
import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";
import { PromptQuery } from "../types/data";

export const Chatbox = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state: RootState) => state.conversations);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, setValue } = useForm<PromptQuery>({
    defaultValues: {
      prompt: "",
    },
  });

  const apiRepository = useContext<Repository>(RepositoryContext);

  useEffect(() => {
    const uuid = uuidv4();
    if (!conversations.id) {
      dispatch(setChatId(uuid));
    }
  }, [conversations.id, dispatch]);

  const submitQuery = async (query: PromptQuery) => {
    if (query.prompt && conversations.loadingResponseWithIndex === -1) {
      setValue("prompt", "");
      dispatch(pushUserPrompt(query.prompt));

      await fetchAndStoreResponse(
        apiRepository,
        query.prompt,
        dispatch,
        conversations.id,
        conversations.aiResponses.length
      );
      await getChatHistory(apiRepository, dispatch);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(submitQuery)();
    }
  };
  // Function to scroll to the bottom of the Conversation container
  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [conversations.userPrompts]);

  return (
    <section className="flex flex-col items-center w-full h-[100vh] bg-[#343541]">
      <div className="flex md:hidden h-[7vh] w-full items-center justify-between px-3 bg-[#202123]">
        <img src="/icons/Bars.svg" alt="Menu Icon" className="w-[20px]" />
        <div className="text-white">New chat</div>
        <img src="/icons/Plus.svg" alt="New Chat" className="w-[35px]" />
      </div>
      {conversations.userPrompts.length === 0 ? (
        <div className="flex flex-col items-center w-full h-[78vh] md:h-[87.5vh] lg:h-[82.5vh] xl:h-[85vh] text-[#565869] border-y md:border-none border-[#565869]">
          <div className="grow" />
          <div className="font-[600] text-4xl">ChatGPTX</div>
          <div className="grow" />
          <div className="flex md:flex-col lg:flex-row justify-around w-full xl:w-3/4 text-sm text-[#c5c5d2]">
            {promptSuggestions.map((column, count) => {
              const columnStyle = count === 1 ? "block" : "hidden md:block";
              return (
                <div
                  className={`${columnStyle} flex-col w-full lg:w-[47.5%]`}
                  key={count}
                >
                  {column.map((item, index) => {
                    return (
                      <div
                        className="flex-col mx-3 xl:mx-0 mb-2 py-2 px-3 border border-[#565869] rounded-xl"
                        key={index}
                      >
                        <p className="font-[600] truncate">{item.heading}</p>
                        <p className="opacity-[0.5] truncate">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={conversationRef}
          className="w-full max-h-[100vh] overflow-y-auto scrollbar-thumb-rounded-md lg:scrollbar-thin scrollbar-thumb-defaultTextColor scrollbar-track-[#343541]"
        >
          <div className="flex text-sm justify-center items-center text-defaultTextColor w-full h-[75px] border-b border-b-[#20212380]">
            Default(GPTX-1.0)
          </div>
          {conversations.userPrompts.map((userPrompt: string, index: number) => {
            return (
              <div key={index}>
                <TextBox isUserPrompt={true} promptText={userPrompt} />
                <TextBox
                  isUserPrompt={false}
                  promptText={
                    conversations.loadingResponseWithIndex === index
                      ? "Loading..."
                      : conversations.aiResponses[index]
                  }
                />
              </div>
            );
          })}
          <div className="w-full h-[120px] md:h-[240px]" />
        </div>
      )}
      <div className="grow" />
      <div className="relative w-full">
        <InputPrompt
          handleKeyDown={handleKeyDown}
          handleSubmit={handleSubmit}
          register={register}
          setValue={setValue}
          submitQuery={submitQuery}
        />
      </div>
    </section>
  );
};
