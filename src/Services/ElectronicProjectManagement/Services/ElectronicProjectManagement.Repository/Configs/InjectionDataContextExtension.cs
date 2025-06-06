    using ElectronicProjectManagement.DataContext.Configs;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ElectronicProjectManagement.Repository.Configs
{
    public static class InjectionRepositoryExtension
    {
        public static void DependencyInjectionRepository(this IServiceCollection services, IConfiguration configuration)
        {
            services.DepedencyInjectionDatacontext(configuration);
            services.AddScoped<IReferencesFileRepos, ReferencesFileRepos>();
            services.AddScoped<ITopicRepos, TopicRepos>();
            services.AddScoped<IProjectBatchRepos, ProjectBatchRepos>();
            services.AddScoped<IProjectsTeachersStudentsRepos, ProjectsTeachersStudentsRepos>();
            services.AddScoped<IProjectsRepos, ProjectsRepos>();
            services.AddScoped<IPersonalProjectManagementRepos, PersonalProjectManagementRepos>();
            services.AddScoped<IThesisDefenceRepos, ThesisDefenceRepos>();
            services.AddScoped<IDashboardRepos, DashboardRepos>();
        }
    }
}