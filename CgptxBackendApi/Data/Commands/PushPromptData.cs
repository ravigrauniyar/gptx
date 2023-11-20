using MediatR;

namespace CgptxBackendApi{
    public class PushPromptData: IRequest<ApiResponseModel<PromptDataResponse>>{
        public PromptData data;
        public PushPromptData(PromptData promptData)
        {
            data = promptData;
        }
    }
}