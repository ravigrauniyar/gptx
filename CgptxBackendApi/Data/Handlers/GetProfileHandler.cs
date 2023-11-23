using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Data.Queries;
using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Repositories;
using MediatR;

namespace CgptxBackendApi.Data.Handlers{
    public class GetProfileHandler : IRequestHandler<GetProfileQuery, ApiResponseModel<UserProfile>>
    {
        public IAccessRepository _accessRepository;
        public ILogger<GetProfileHandler> _logger;

        public GetProfileHandler(IAccessRepository repository, ILogger<GetProfileHandler> logger)
        {
            _accessRepository = repository;
            _logger = logger;
        }

        public async Task<ApiResponseModel<UserProfile>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            try{
                var user = await _accessRepository.getUserProfile(request.userId);
                return ApiResponseModel<UserProfile>.AsSuccess(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the GetProfileHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while fetching user profile",
                    detail= ex.Message
                };
                return ApiResponseModel<UserProfile>.AsFailure(error);
            }
        }
    }
}