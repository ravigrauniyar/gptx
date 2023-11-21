using CgptxBackendApi.Controllers;
using CgptxBackendApi.Data.Commands;
using CgptxBackendApi.Models.AccessModels;
using CgptxBackendApi.Models.ApiResponses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CgptxBackendApi{
    [ApiController]
    [Route("/api/access/")]
    public class AccessController: Controller{
        private readonly IMediator _mediator;
        private readonly ILogger<ChatController> _logger;
        private readonly BaseController _baseController;
        public AccessController(IMediator mediator, ILogger<ChatController> logger, BaseController baseController)
        {
            _mediator = mediator;
            _logger = logger;
            _baseController = baseController;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestAccess([FromBody] TokenRequest tokenRequest){
            try{
                var response = await _mediator.Send(new RequestLoginCommand(tokenRequest));
                if(response.apiErrorResponse == null){
                    var user = response.apiObjectResponse!.data!;
                    var userResponse = await _mediator.Send(new CheckOrCreateUserCommand(user));

                    if(userResponse.apiErrorResponse == null){
                        var userId = userResponse.apiObjectResponse!.data!.id;
                        var userIdForToken = new UserIdForToken{
                            id = userId
                        };
                        var accessToken = _baseController.GetTokenResponse(userIdForToken, 10);
                        var refreshToken = _baseController.GetTokenResponse(userIdForToken, 1000);

                        if(accessToken != null && refreshToken != null){
                            var tokenResponse = new TokenResponse{
                                access_token = accessToken,
                                refresh_token = refreshToken
                            };
                            return Ok(ApiResponseModel<TokenResponse>.AsSuccess(tokenResponse).apiObjectResponse);
                        }
                        else throw new Exception("Error occurred while creating token!");
                    }
                    else{
                        return BadRequest(userResponse.apiErrorResponse);
                    }
                }
                else{
                    return BadRequest(response.apiErrorResponse);
                }
            }
            catch(Exception ex){
                _logger.LogError(ex, "An expection occurred in the RequestAccess method of AccessController.");
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Exception occurred while requesting login.",
                    detail= ex.Message
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error).apiErrorResponse);
            }
        }
    
        [HttpPost("refresh")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest request) {
            var (isExpired, userId) = _baseController.ValidateTokenAndGetUserId(request.refresh_token);
            if(!isExpired){
                var userIdForToken = new UserIdForToken{
                    id = userId!
                };
                var accessToken = _baseController.GetTokenResponse(userIdForToken, 1);
                var tokenResponse = new TokenResponse{
                    access_token = accessToken,
                    refresh_token = request.refresh_token
                };
                return Ok(ApiResponseModel<TokenResponse>.AsSuccess(tokenResponse).apiObjectResponse);
            }
            else{
                var error = new ApiErrorModel{
                    status= "Failure",
                    title="Expired Signature.",
                    detail= "Refresh token is expired!"
                };
                return BadRequest(ApiResponseModel<string>.AsFailure(error).apiErrorResponse);
            }
        }
    }
}