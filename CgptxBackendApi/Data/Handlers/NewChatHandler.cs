using CgptxBackendApi.Data.Commands;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using CgptxBackendApi.Repositories;
using MediatR;

namespace CgptxBackendApi.Data.Handlers{
    public class NewChatHandler : IRequestHandler<NewChatCommand, ApiResponseModel<Chat>>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<NewChatHandler> _logger;
        public NewChatHandler(IConversationsRepository chatRepository, ILogger<NewChatHandler> logger)
        {
            _chatRepository = chatRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<Chat>> Handle(NewChatCommand request, CancellationToken cancellationToken)
        {
            try{
                var chatHistory = await _chatRepository.startNewChat();
                return ApiResponseModel<Chat>.AsSuccess(chatHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the NewChatHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while fetching Chat history",
                    detail= ex.Message
                };
                return ApiResponseModel<Chat>.AsFailure(error);
            }
        }
    }
}