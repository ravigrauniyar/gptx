import { PopUpModalProps } from "../../types/data";

export const PopUpModal = (modalProps: PopUpModalProps) => {
  const {
    viewportBgColor,
    popUpModalBg,
    titleText,
    bodyText,
    leftBtnText,
    leftBtnBgColor,
    leftBtnHoverBgColor,
    handleLeftBtnClick,
    rightBtnText,
    rightBtnBgColor,
    rightBtnHoverBgColor,
    handleRightBtnClick,
  } = modalProps;
  return (
    <div
      className={`absolute top-0 left-0 flex justify-center items-center z-50 w-full h-[100vh] ${viewportBgColor}`}
    >
      <div
        className={`flex flex-col text-defaultTextColor justify-center items-center w-[95%] max-w-md min-h-[250px] rounded-xl ${popUpModalBg}`}
      >
        <div className="min-h-[90px] w-full flex items-center border-b border-[#ffffff1a]">
          <div className="ml-[30px] text-lg font-[600] leading-6">
            {titleText}
          </div>
        </div>
        <div className="min-h-[150px] w-full flex flex-col">
          <div className="ml-[30px] my-5 text-[20px] font-[500]">
            This will delete <strong>{bodyText}</strong>
          </div>
          <div className="flex justify-end">
            <button
              onClick={()=>handleLeftBtnClick()}
              className={`${leftBtnBgColor} ${leftBtnHoverBgColor} border border-[#555768] text-defaultTextColor text-sm font-[600] rounded-lg px-3 h-[45px]`}
            >
              {leftBtnText}
            </button>
            <button
              onClick={() => handleRightBtnClick()}
              className={`${rightBtnBgColor} ${rightBtnHoverBgColor} ml-3 border border-transparent text-white text-sm font-[600] rounded-lg px-3 h-[45px] mr-[30px]`}
            >
              {rightBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
