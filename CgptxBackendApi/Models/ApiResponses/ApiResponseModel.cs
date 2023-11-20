using System.Text.Json.Serialization;

namespace CgptxBackendApi{
    public class ApiResponseModel<T>{
        [JsonIgnore(Condition =JsonIgnoreCondition.WhenWritingNull)]
        public ApiObjectResponse<T>? apiObjectResponse{ get; set; } = null;

        [JsonIgnore(Condition =JsonIgnoreCondition.WhenWritingNull)]
        public ApiErrorResponse? apiErrorResponse {get; set;} = null;

        public ApiResponseModel(ApiObjectResponse<T> apiObjectResponse, ApiErrorResponse apiErrorResponse){
            this.apiObjectResponse = apiObjectResponse;
            this.apiErrorResponse = apiErrorResponse;
        }
        public static ApiResponseModel<T> AsSuccess(T value)
        {
            var response = new ApiObjectResponse<T>{
                data = value
            };
            return new ApiResponseModel<T>(response, default!);
        }
        public static ApiResponseModel<T> AsFailure(ApiErrorModel error)
        {
            var errorsResponse = new ApiErrorResponse();
            errorsResponse.errors.Add(error);
            return new ApiResponseModel<T>(default!, errorsResponse);
        }
    }
}