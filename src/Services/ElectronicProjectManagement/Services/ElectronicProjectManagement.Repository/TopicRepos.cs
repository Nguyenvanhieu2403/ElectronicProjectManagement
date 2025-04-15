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
using Microsoft.Data.SqlClient;
using VnPostLib.Common.Helpers;
using System.Reflection;

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

        private async Task<DataTable> ExportExcelToDataTable(TopicSearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.GetTopicExportExcel", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Keyword", (model.Keyword ?? ""));
                    command.Parameters.AddWithValue("@isDesc", model.IsDesc);
                    command.Parameters.AddWithValue("@orderCol", model.OrderCol);
                    command.Parameters.AddWithValue("@status", model.Status);
                    command.CommandTimeout = 420;
                    using (SqlDataAdapter adapter1 = new SqlDataAdapter(command))
                    {
                        adapter1.Fill(dataTable);
                    }
                }
                conn.Close();
            }
            return dataTable;
        }

        public async Task<MemoryStream> ExportExcel(TopicSearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_TopicReport.xlsx"); ;

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:D" + (result.Rows.Count + 6).ToString()];
                foreach (var cell in range)
                {
                    var border = cell.Style.Border;
                    border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                    border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                }

                package.SaveAs(exportFile);
            }

            exportFile.Position = 0;
            return exportFile;
            #endregion
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
