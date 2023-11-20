import { TextBoxProps } from "../../types/data";
import { GptxAvatar } from "./GptxAvatar";
import { UserAvatar } from "./UserAvatar";

enum TextBoxBg {
  userPromptBg = "bg-transparent",
  aiResponseBg = "bg-[#444654]",
}
export const TextBox = (textboxProps: TextBoxProps) => {
  const { isUserPrompt, promptText } = textboxProps;
  const textBoxBgColor = isUserPrompt
    ? TextBoxBg.userPromptBg
    : TextBoxBg.aiResponseBg;

  return (
    <div
      className={`flex w-full min-h-[100px] py-3 justify-center items-center text-white ${textBoxBgColor}`}
    >
      <div className="flex w-3/4 max-w-[960px]">
        {isUserPrompt ? (
          <UserAvatar bgColor="bg-blue" dimension="w-[35px] h-[35px]" />
        ) : (
          <GptxAvatar />
        )}
        <div className="ml-5 max-w-full pb-1 overflow-x-auto scrollbar-thumb-rounded-md lg:scrollbar-thin scrollbar-thumb-defaultTextColor scrollbar-track-[#343541]">
          {promptText}
        </div>
      </div>
    </div>
  );
};
