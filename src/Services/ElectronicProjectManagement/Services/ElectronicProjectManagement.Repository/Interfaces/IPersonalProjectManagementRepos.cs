using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base.Interfaces;

namespace ElectronicProjectManagement.Repository.Interfaces
{
    public interface IPersonalProjectManagementRepos : IBaseRepos<PersonalProjectManagement>
    {
        Task<MethodResult<List<PersonalProjectManagement>>> GetsPersonalProjectManagementBySearch(PersonalProjectManagementSearchModel model);
        Task<MethodResult<List<PersonalProjectManagement>>> GetsPersonalProjectManagementApprovalBySearch(PersonalProjectManagementSearchModel model);
        Task<MethodResult<PersonalProjectManagement>> GetsPersonalProjectManagementByStudentId(PersonalProjectManagementSearchModel model);
        Task<MethodResult> UploadProject(IFormFile PDF, IFormFile PPT, IFormFile Source, long? IdStudent, int IdProjectsTeachersStudents);
        Task<MethodResult> CheckPlagiarism(string FilePath, long? IdProjectsTeachersStudents);
        Task<MethodResult> ProjectApproval(int IdProjectsTeachersStudents, int Status, string? Reason);
    }
}
