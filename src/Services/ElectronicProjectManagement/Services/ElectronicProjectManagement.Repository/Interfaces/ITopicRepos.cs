using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.DataContext;
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
    public interface ITopicRepos : IBaseRepos<Topic>
    {
        Task<MethodResult<List<Topic>>> GetsTopicBySearch(TopicSearchModel model);
        Task<MemoryStream> ExportExcel(TopicSearchModel model);
        Task<MethodResult<List<Topic>>> GetsAllTopic();
        Task<MethodResult> CreateTopic(TopicModel model);
        Task<MethodResult> UpdateTopic(TopicModel model);
        Task<MethodResult> DeleteTopic(long id);
    }
}
