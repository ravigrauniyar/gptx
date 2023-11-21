using CgptxBackendApi.Data.Commands;
using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using MediatR;
using Newtonsoft.Json;

namespace CgptxBackendApi.Data.Handlers{
    public class RequestLoginHandler : IRequestHandler<RequestLoginCommand, ApiResponseModel<GoogleProfile>>
    { 
        private readonly ILogger<RequestLoginHandler> _logger;
        private readonly IConfiguration _configuration;

        public RequestLoginHandler(ILogger<RequestLoginHandler> logger, IConfiguration configuration){
            _logger = logger;
            _configuration = configuration;
        }
        public async Task<ApiResponseModel<GoogleProfile>> Handle(RequestLoginCommand request, CancellationToken cancellationToken)
        {
            try{
                using HttpClient client = new();
                var googleTokenUrl = _configuration.GetValue<string>("GoogleTokenUrl");
                var tokenValidationResponse = await client.GetAsync(googleTokenUrl + "?access_token=" + request.tokenRequest.google_token, cancellationToken);
                
                if(tokenValidationResponse.IsSuccessStatusCode){
                    var googleProfileUrl = _configuration.GetValue<string>("GoogleProfileUrl");
                    
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + request.tokenRequest.google_token);
                    var profileResponse = await client.GetAsync(googleProfileUrl, cancellationToken);

                    if(profileResponse.IsSuccessStatusCode){
                        var profileString = await profileResponse.Content.ReadAsStringAsync(cancellationToken);
                        var profile = JsonConvert.DeserializeObject<GoogleProfile>(profileString)!;
                        return ApiResponseModel<GoogleProfile>.AsSuccess(profile);
                    }
                    else throw new Exception("Could not fetch user profile!");
                }
                else throw new Exception("Could not validate access token!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expection occurred in the RequestLoginHandler.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while validating access token.",
                    detail= ex.Message
                };
                return ApiResponseModel<GoogleProfile>.AsFailure(error);
            }        
        }
    }
}