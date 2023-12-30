using System.Text;
using Core.Entities.Identity;
using Infrastructure.Data.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection  AddIdentityService(this IServiceCollection services ,IConfiguration config)
        {
    
	        var key = Encoding.ASCII.GetBytes(config["Token:Key"]);
            services.AddDbContext<AppIdentityDBContext>( opt =>
            {
                opt.UseSqlite(config.GetConnectionString("IdentityConnection"));     
            });

            services.AddIdentityCore<AppUser>(opt =>
            {
                // 
            })
            .AddEntityFrameworkStores<AppIdentityDBContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => 
                {
                    options.TokenValidationParameters = new  TokenValidationParameters 
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = false, 
                        
                        ValidIssuer = config["Token:Issuer"],
                        ValidAudience = config["Token:Audience"]
                        
                        // ValidateIssuerSigningKey = true,
                        // IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),  
                        // ValidIssuer = config["Token:Issure"],
                        // ValidateIssuer = true,
                        //ClockSkew = TimeSpan.Zero                      
                    };
                });

            services.AddAuthorization();

            return services;
        }
    }
}