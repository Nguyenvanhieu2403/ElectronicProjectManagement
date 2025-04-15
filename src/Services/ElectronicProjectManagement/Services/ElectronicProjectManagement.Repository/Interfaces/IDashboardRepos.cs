using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base.Interfaces;

namespace ElectronicProjectManagement.Repository.Interfaces
{
    public interface IDashboardRepos : IBaseRepos<Dashboard>
    {
        Task<MethodResult<DashboardTotal>> GetDashboardTotal();
        Task<MethodResult<List<ProjectStatisticsByTopic>>> GetDashboardProjectStatisticsByTopic();
        Task<MethodResult<List<ProjectScoreStatisticsForYear>>> GetDashboardProjectScoreStatisticsForYear();
    }
}
