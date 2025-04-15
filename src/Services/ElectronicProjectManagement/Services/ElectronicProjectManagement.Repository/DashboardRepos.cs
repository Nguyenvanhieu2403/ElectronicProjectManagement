using Dapper;
using DocumentFormat.OpenXml.EMMA;
using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Dtos;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base;

namespace ElectronicProjectManagement.Repository
{
    public class DashboardRepos : BaseRepos<Dashboard>, IDashboardRepos
    {
        private readonly IConfiguration _configuration;
        public Double PlagiarismRate = -1;

        public DashboardRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult<List<ProjectScoreStatisticsForYear>>> GetDashboardProjectScoreStatisticsForYear()
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                var data = await connection.QueryAsync<ProjectScoreStatisticsForYear>("EPM.GetDashboardProjectScoreStatisticsForYear", commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectScoreStatisticsForYear>>.ResultWithData(data.ToList(), "", 1);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectScoreStatisticsForYear>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectStatisticsByTopic>>> GetDashboardProjectStatisticsByTopic()
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                var data = await connection.QueryAsync<ProjectStatisticsByTopic>("EPM.GetDashboardProjectStatisticsByTopic", commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectStatisticsByTopic>>.ResultWithData(data.ToList(), "", 1);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectStatisticsByTopic>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<DashboardTotal>> GetDashboardTotal()
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                var data = await connection.QueryFirstOrDefaultAsync<DashboardTotal>("EPM.GetDashboardTotal", commandType: CommandType.StoredProcedure);

                return MethodResult<DashboardTotal>.ResultWithData(data, "", 1);
            }
            catch (Exception ex)
            {
                return MethodResult<DashboardTotal>.ResultWithError(ex.Message, 400);
            }
        }
    }
}
