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
            DapperPlusManager.Entity<Topic>().Table("EPM.Topic");
            DapperPlusManager.Entity<ProjectBatch>().Table("EPM.ProjectBatch");
            DapperPlusManager.Entity<InstructorsByBatch>().Table("EPM.InstructorsByBatch");
            DapperPlusManager.Entity<ProjectsTeachersStudents>().Table("EPM.ProjectsTeachersStudents");
            DapperPlusManager.Entity<Projects>().Table("EPM.Projects");
            DapperPlusManager.Entity<PersonalProjectManagement>().Table("EPM.PersonalProjectManagement");
            DapperPlusManager.Entity<CheckPlagiarism>().Table("EPM.CheckPlagiarism");
            DapperPlusManager.Entity<ThesisDefence>().Table("EPM.ThesisDefence");
            DapperPlusManager.Entity<ThesisDefenceDetail>().Table("EPM.ThesisDefenceDetail");
        }
    }
}
