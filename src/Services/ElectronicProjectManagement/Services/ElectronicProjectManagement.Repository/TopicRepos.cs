using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Base;
using VnPostLib.Common.Api.Models;
using ElectronicProjectManagement.DataContext.Model;
using Dapper;
using System.Data;
using Z.Dapper.Plus;

namespace ElectronicProjectManagement.Repository
{
    public class TopicRepos : BaseRepos<Topic>, ITopicRepos
    {
        private readonly IConfiguration _configuration;

        public TopicRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult> CreateTopic(TopicModel model)
        {
            try
            {
                var listData = new List<Topic>
                {
                    new() {
                        Name = model.Name,
                        UnitCode = model.UnitCode,
                        Description = model.Description,
                        Status = model.Status,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                using IDbConnection connection = GetOpenConnection();
                var result = await connection.BulkInsertAsync(listData);
                connection.Close();
                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public Task<MethodResult> DeleteTopic(long id)
        {
            throw new NotImplementedException();
        }

        public Task<MethodResult<List<Topic>>> GetsAllTopic()
        {
            throw new NotImplementedException();
        }

        public async Task<MethodResult<List<Topic>>> GetsTopicBySearch(TopicSearchModel model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@Keyword", model.Keyword);
                parameters.Add("@isDesc", model.IsDesc);
                parameters.Add("@orderCol", model.OrderCol ?? "Id");
                parameters.Add("@pageIndex", model.PageIndex);
                parameters.Add("@pageSize", model.PageSize);
                parameters.Add("@status", model.Status);

                var data = await connection.QueryAsync<Topic>("EPM.GetTopicBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetTopicBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<Topic>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<Topic>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult> UpdateTopic(TopicModel model)
        {
            try
            {
                var listData = new List<Topic>
                {
                    new() {
                        Id = model.Id,
                        Name = model.Name,
                        UnitCode = model.UnitCode,
                        Description = model.Description,
                        Status = model.Status,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                using IDbConnection connection = GetOpenConnection();
                var result = await connection.BulkUpdateAsync(listData);
                connection.Close();
                return MethodResult.ResultWithSuccess("Update success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }
    }
}
