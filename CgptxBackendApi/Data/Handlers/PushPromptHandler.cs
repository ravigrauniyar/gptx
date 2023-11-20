using MediatR;

namespace CgptxBackendApi{
    public class PushPromptHandler : IRequestHandler<PushPromptData, ApiResponseModel<PromptDataResponse>>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<PushPromptHandler> _logger;

        public PushPromptHandler(IConversationsRepository conversationsRepository, ILogger<PushPromptHandler> logger){
            _chatRepository = conversationsRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<PromptDataResponse>> Handle(PushPromptData request, CancellationToken cancellationToken)
        {
            try{
                var promptResponse = await _chatRepository.storePromptData(request.data);
                return ApiResponseModel<PromptDataResponse>.AsSuccess(promptResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the PushPromptHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while creating new Chat prompt.",
                    detail= ex.Message
                };
                return ApiResponseModel<PromptDataResponse>.AsFailure(error);
            }
        }
    }
}