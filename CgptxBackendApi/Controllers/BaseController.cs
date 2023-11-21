using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CgptxBackendApi.Data.Entities;
using CgptxBackendApi.Models.ApiResponses;
using CgptxBackendApi.Models.AccessModels;

namespace CgptxBackendApi.Controllers{
    public class BaseController: ControllerBase{
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        public BaseController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        public UserIdForToken ClaimValue()
        {
            var userObjectString = _httpContextAccessor!.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == "UserId")?.Value;
            var userObject = JsonSerializer.Deserialize<UserIdForToken>(userObjectString!);
            return userObject!;
        }
        public string GetTokenResponse(UserIdForToken userIdForToken, int expiresInMinutes)
        {
            var jwt = _configuration.GetSection("Jwt").Get<Jwt>();
            var userDataString = JsonSerializer.Serialize(userIdForToken);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserId", userDataString)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt!.key));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                jwt.issuer,
                jwt.audience,
                claims,
                // Adjusted for UTC and added clock skew
                expires: DateTime.UtcNow.AddMinutes(expiresInMinutes), 
                signingCredentials: signIn
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            return tokenString;
        }
        public (bool IsExpired, string? UserId) ValidateTokenAndGetUserId(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                // Read and validate the token
                if (tokenHandler.ReadToken(token) is not JwtSecurityToken jsonToken)
                {
                    // Token is not in a valid JWT format
                    return (true, null);
                }
                // Check the token's expiration date
                var isExpired = jsonToken.ValidTo < DateTime.UtcNow;

                // Extract UserId claim
                var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
                return (isExpired, userIdClaim);
            }
            catch (Exception)
            {
                // Token validation failed
                return (true, null);
            }
        }

    }
}