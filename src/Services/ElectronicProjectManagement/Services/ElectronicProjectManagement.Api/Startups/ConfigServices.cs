using ElectronicProjectManagement.Repository.Configs;
using Microsoft.AspNetCore.Builder;

namespace ElectronicProjectManagement.Api.Startups
{
    public static class StartupExtensions
    {
        /// <summary>
        ///     Đăng ký các dịch vụ sẽ dùng trong project
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void AddCustomService(this IServiceCollection services, IConfiguration configuration)
        {
            services.DependencyInjectionRepository(configuration);
        }

        /// <summary>
        ///     Gọi hàm này khi đang ở chế độ debug (để inject thêm một số thành phần hỗ trợ đặc biệt cho môi trường dev
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void AddDebugCustomService(this IServiceCollection services, IConfiguration configuration)
        {

        }


        /// <summary>
        ///     Khai báo / config các pipeline / middleware trong project
        /// </summary>
        /// <param name="app"></param>
        public static void UseCustomService(this IApplicationBuilder app, IConfiguration configuration)
        {

        }
    }
}


