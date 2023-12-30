using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        
        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
        }

        public string CreateToken(AppUser user)
        {
             var claims  = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email ),
                new Claim(ClaimTypes.GivenName, user.DisplayName)
            };
            
            var creds = new SigningCredentials(_key,SecurityAlgorithms.HmacSha256Signature);
             
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor();
            tokenDescriptor.Subject = new ClaimsIdentity(claims);
            tokenDescriptor.Expires = DateTime.UtcNow.AddDays(7);
            tokenDescriptor.SigningCredentials = creds;
            tokenDescriptor.Issuer = _config["Token:Issure"];
            tokenDescriptor.Audience = _config["Token:Audience"];
            
            var tokenHandler =  new JwtSecurityTokenHandler();
            
            var token =  tokenHandler.CreateToken(tokenDescriptor);
            
            return tokenHandler.WriteToken(token);
            
        }
    }   
} 