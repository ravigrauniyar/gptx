using MediatR;

namespace CgptxBackendApi{
    public class DeleteChatHandler : IRequestHandler<DeleteChatCommand, ApiResponseModel<string>>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<DeleteChatHandler> _logger;

        public DeleteChatHandler(IConversationsRepository conversationsRepository, ILogger<DeleteChatHandler> logger){
            _chatRepository = conversationsRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<string>> Handle(DeleteChatCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _chatRepository.deleteChat(request.id);
                return ApiResponseModel<string>.AsSuccess("Chat deleted successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the DeleteChatHandler.");
                var error = new ApiErrorModel
                {
                    status = "Failure",
                    title = "Exception occurred while deleting Chat.",
                    detail = ex.Message
                };
                return ApiResponseModel<string>.AsFailure(error);
            }
        }
    }
}