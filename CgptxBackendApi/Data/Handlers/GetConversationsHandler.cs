using CgptxBackendApi.Data.Queries;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.ChatModels;
using CgptxBackendApi.Repositories;
using MediatR;

namespace CgptxBackendApi.Data.Handlers{
    public class GetConversationsHandler : IRequestHandler<GetConversationsQuery, ApiResponseModel<List<Chat>>>
    {
        private readonly IConversationsRepository _chatRepository;
        private readonly ILogger<GetConversationsHandler> _logger;
        public GetConversationsHandler(IConversationsRepository chatRepository, ILogger<GetConversationsHandler> logger)
        {
            _chatRepository = chatRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<List<Chat>>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
        {
            try{
                var chatHistory = await _chatRepository.getPromptDataResponses();
                return ApiResponseModel<List<Chat>>.AsSuccess(chatHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the GetConversationsHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while fetching Chat history",
                    detail= ex.Message
                };
                return ApiResponseModel<List<Chat>>.AsFailure(error);
            }
        }
    }
}