using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base.Interfaces;

namespace ElectronicProjectManagement.Repository.Interfaces
{
    public interface IProjectsTeachersStudentsRepos : IBaseRepos<ProjectsTeachersStudents>
    {
        Task<MethodResult<List<ProjectsTeachersStudents>>> GetsProjectsTeachersStudentsBySearch(SearchModel model);
        Task<MemoryStream> ProjectsTeachersStudentsExportExcel(SearchModel model);
        Task<MethodResult> RegisterTeachers(ProjectsTeachersStudents model);
        Task<MethodResult<List<ProjectBatchUserModel>>> GetStudentRegister(ProjectsTeachersStudentsRegisterModel model);
        Task<MethodResult> RegisterProjects(ProjectsTeachersStudents model);
        Task<MethodResult<List<ProjectsTeachersStudents>>> GetsProjectForStudentRegister(SearchModel model);
    }
}
