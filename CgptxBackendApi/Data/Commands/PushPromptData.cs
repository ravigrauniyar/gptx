using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using MediatR;

namespace CgptxBackendApi.Data.Commands{
    public class PushPromptData: IRequest<ApiResponseModel<PromptDataResponse>>{
        public PromptData data;
        public PushPromptData(PromptData promptData)
        {
            data = promptData;
        }
    }
}