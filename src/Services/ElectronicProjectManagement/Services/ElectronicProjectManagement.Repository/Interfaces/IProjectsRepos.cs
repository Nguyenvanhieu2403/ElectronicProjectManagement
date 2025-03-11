using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base.Interfaces;
using Microsoft.AspNetCore.Http;
using ElectronicProjectManagement.DataContext.Dtos;

namespace ElectronicProjectManagement.Repository.Interfaces
{
    public interface IProjectsRepos : IBaseRepos<Projects>
    {
        Task<MethodResult<List<Projects>>> GetsProjectsBySearch(SearchModel model);
        Task<MethodResult<List<Projects>>> GetsAllProjects();
        Task<MethodResult> CreateProjects(Projects model);
        Task<MethodResult> ProposeProjects(Projects model);
        Task<MethodResult> UpdateProjects(Projects model);
        Task<MethodResult> DeleteProjects(long id);
        Task<MethodResult> ImportProjects(IFormFile file);

        Task<MethodResult<List<ProjectsProposedTopics>>> GetsStudentsProposedTopics(StudentsProposedTopicsSearchModel model);
        Task<MethodResult> ApproveTopic(int ProjectId);
        Task<MethodResult> RejectTopic(int ProjectId);
    }
}
