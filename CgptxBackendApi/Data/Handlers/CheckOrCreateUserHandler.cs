using CgptxBackendApi.Data.Commands;
using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Repositories;
using MediatR;

namespace CgptxBackendApi.Data.Handlers{
    public class CheckOrCreateUserHandler : IRequestHandler<CheckOrCreateUserCommand, ApiResponseModel<User>>
    {
        private readonly IAccessRepository _accessRepository;
        private readonly ILogger<PushPromptHandler> _logger;

        public CheckOrCreateUserHandler(IAccessRepository accessRepository, ILogger<PushPromptHandler> logger){
            _accessRepository = accessRepository;
            _logger = logger;
        }
        public async Task<ApiResponseModel<User>> Handle(CheckOrCreateUserCommand request, CancellationToken cancellationToken)
        {
            try{
                var user = await _accessRepository.checkOrCreateUser(request.profile);
                return ApiResponseModel<User>.AsSuccess(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the CheckOrCreateUserHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while checking User in database.",
                    detail= ex.Message
                };
                return ApiResponseModel<User>.AsFailure(error);
            }
        }
    }
}