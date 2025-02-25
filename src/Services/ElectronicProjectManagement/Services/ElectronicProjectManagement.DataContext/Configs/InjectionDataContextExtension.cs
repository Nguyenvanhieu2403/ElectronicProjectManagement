using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Z.Dapper.Plus;

namespace ElectronicProjectManagement.DataContext.Configs
{
    public static class InjectionDataContextExtension
    {
        public static void DepedencyInjectionDatacontext(this IServiceCollection services, IConfiguration configuration)
        {
            DapperPlusManager.Entity<ReferencesFile>().Table("EPM.ReferencesFile");
        }
    }
}
