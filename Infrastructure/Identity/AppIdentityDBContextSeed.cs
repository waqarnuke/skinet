using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDBContextSeed
    {
         public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
         {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Bob",
                    Email = "bob@testmail.com",
                    UserName = "bob@testmail.com",
                    Address = new Address
                    {
                        FirstName = "bob",
                        LastName = "bobbity",
                        Street = "1889 S Dr",
                        City = "Houston",
                        State = "Tx",
                        ZipCode = "77338" 
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
         }
    }
}