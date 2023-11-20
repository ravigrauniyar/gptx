using MediatR;

namespace CgptxBackendApi{
    public class UpdateChatHandler : IRequestHandler<UpdateChatCommand, ApiResponseModel<Chat>>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<PushPromptHandler> _logger;

        public UpdateChatHandler(IConversationsRepository conversationsRepository, ILogger<PushPromptHandler> logger){
            _chatRepository = conversationsRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<Chat>> Handle(UpdateChatCommand request, CancellationToken cancellationToken)
        {
            try{
                var promptResponse = await _chatRepository.updateChat(request.data, request.id);
                return ApiResponseModel<Chat>.AsSuccess(promptResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the UpdateChatHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while updating Chat.",
                    detail= ex.Message
                };
                return ApiResponseModel<Chat>.AsFailure(error);
            }
        }
    }
}