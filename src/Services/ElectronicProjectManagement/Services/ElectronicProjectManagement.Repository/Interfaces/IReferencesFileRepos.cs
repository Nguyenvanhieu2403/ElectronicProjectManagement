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
    public interface IReferencesFileRepos : IBaseRepos<ReferencesFile>
    {
        Task<MethodResult<List<ReferencesFile>>> GetsReferencesFileBySearch(ReferencesFileSearchModel model);
        Task<MethodResult<List<ReferencesFile>>> GetsAllReferencesFile();
        Task<MemoryStream> ExportExcel(ReferencesFileSearchModel model);
        Task<MethodResult> CreateReferencesFile(ReferencesFileModel model, IFormFile file);
        Task<MethodResult> UpdateReferencesFile(ReferencesFileModel model, IFormFile file);
        Task<MethodResult> DeleteReferencesFile(long id);
    }
}
