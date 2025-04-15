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
    public interface IProjectBatchRepos : IBaseRepos<ProjectBatch>
    {
        Task<MethodResult<List<ProjectBatch>>> GetsProjectBatchBySearch(ProjectBatchSearchModel model);
        Task<MemoryStream> ExportExcel(ProjectBatchSearchModel model);
        Task<MethodResult<ProjectBatchModel>> GetProjectBatchById(long id);
        Task<MethodResult<List<ProjectBatch>>> GetsAllProjectBatch();
        Task<MethodResult> CreateProjectBatch(ProjectBatchModel model);
        Task<MethodResult> UpdateProjectBatch(ProjectBatchModel model);
        Task<MethodResult> DeleteProjectBatch(long id);
        Task<MethodResult<List<ProjectBatchUserModel>>> GetsProjectBatchUserByProjectBatchId(ProjectBatchUserSearchModel model);

    }
}
