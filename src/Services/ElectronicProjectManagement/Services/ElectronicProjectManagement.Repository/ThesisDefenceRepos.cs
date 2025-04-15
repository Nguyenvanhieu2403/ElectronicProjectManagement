using Dapper;
using DocumentFormat.OpenXml.EMMA;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext.Dtos;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Common;
using ElectronicProjectManagement.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base;
using VnPostLib.Common.Helpers;
using Z.Dapper.Plus;

namespace ElectronicProjectManagement.Repository
{
    public class ThesisDefenceRepos : BaseRepos<ThesisDefence>, IThesisDefenceRepos
    {
        private readonly IConfiguration _configuration;

        public ThesisDefenceRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult> CreateThesisDefence(ThesisDefenceModel model)
        {
            try
            {
                var listData = new List<ThesisDefence>
                {
                    new() {
                        Name = model.Name,
                        BeginDate = model.BeginDate,
                        EndDate = model.EndDate,
                        Location = model.Location,
                        Status = model.Status,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                using IDbConnection connection = GetOpenConnection();
                var result = await connection.BulkInsertAsync(listData);

                var lastInsertedId = await connection.ExecuteScalarAsync<int>("SELECT MAX(Id) FROM EPM.ThesisDefence");

                var listThesisDefenceDetail = new List<ThesisDefenceDetail>();

                if (model.IdPersonalProjectManagement?.Any() == true)
                {
                    listThesisDefenceDetail.AddRange(model.IdPersonalProjectManagement.Select(IdPersonalProjectManagement => new ThesisDefenceDetail
                    {
                        IdThesisDefence = lastInsertedId,
                        IdPersonalProjectManagement = IdPersonalProjectManagement,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                // Thêm danh sách giáo viên (nếu có)
                if (model.IdTeacher?.Any() == true)
                {
                    listThesisDefenceDetail.AddRange(model.IdTeacher.Select(teacherId => new ThesisDefenceDetail
                    {
                        IdThesisDefence = lastInsertedId,
                        IdTeacher = teacherId,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }));
                }

                if (listThesisDefenceDetail.Any())
                {
                    await connection.BulkInsertAsync(listThesisDefenceDetail);
                }

                List<(string Name, string Email)> Teachers  = new List<(string Name, string Email)>();

                foreach (var item in model.IdTeacher)
                {
                    var parameters1 = new DynamicParameters();
                    parameters1.Add("@IdPersonalProjectManagement", item);
                    var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherByIdPersonalProjectManagement", parameters1, commandType: CommandType.StoredProcedure);
                    Teachers.Add((dataUserTeacher.DisplayName, dataUserTeacher.Email));
                }

                foreach (var item in model.IdPersonalProjectManagement)
                {
                    var parameters1 = new DynamicParameters();
                    parameters1.Add("@IdPersonalProjectManagement", item);
                    var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentByIdPersonalProjectManagement", parameters1, commandType: CommandType.StoredProcedure);

                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ThesisDefenceName = model.Name,
                        StartTime = model.BeginDate,
                        EndTime = model.EndDate,
                        Location = model.Location,
                        Teachers = Teachers
                    };
                    SendEmail.SendDefenseNotification(sendEmailModel);
                }
                connection.Close();
                
                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public Task<MethodResult> DeleteThesisDefence(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<MethodResult<List<PersonalProjectManagement>>> GetsAllPersonalProjectManagement()
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                var data = await connection.QueryAsync<PersonalProjectManagement>("EPM.GetsAllPersonalProjectManagement", commandType: CommandType.StoredProcedure);
                return MethodResult<List<PersonalProjectManagement>>.ResultWithData(data.ToList(), "", 0);
            }
            catch (Exception ex)
            {
                return MethodResult<List<PersonalProjectManagement>>.ResultWithError(ex.Message, 400);
            }
        }

        public Task<MethodResult<List<ThesisDefence>>> GetsAllThesisDefence()
        {
            throw new NotImplementedException();
        }

        public async Task<MethodResult<List<ThesisDefenceGetBySearch>>> GetsThesisDefenceBySearch(SearchModel model)
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

                var data = await connection.QueryAsync<ThesisDefenceGetBySearch>("EPM.ThesisDefenceGetBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.ThesisDefenceGetBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ThesisDefenceGetBySearch>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ThesisDefenceGetBySearch>>.ResultWithError(ex.Message, 400);
            }
        }

        private async Task<DataTable> ExportExcelToDataTable(SearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.ThesisDefenceGetExportExcel", conn))
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

        public async Task<MemoryStream> GetsThesisDefenceExportExcel(SearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ThesisDefenceReport.xlsx"); ;

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:L" + (result.Rows.Count + 6).ToString()];
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

        public async Task<MethodResult> ScoringThesisDefence(ThesisDefenceDetail model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                string sql = @"
                    UPDATE EPM.ThesisDefenceDetail
                    SET Point = @Point,
                        Comment = @Comment,
                        Status = @Status,
                        Modified = @Modified,
                        ModifiedBy = @ModifiedBy
                    WHERE Id = @Id";

                var parameters = new
                {
                    model.Point,
                    model.Comment,
                    model.Status,
                    Modified = DateTime.Now,
                    model.ModifiedBy,
                    model.Id
                };

                int rowsAffected = await connection.ExecuteAsync(sql, parameters);
                connection.Close();

                if (rowsAffected > 0)
                    return MethodResult.ResultWithSuccess("Update success");
                else
                    return MethodResult.ResultWithError("Update failed", "No records updated", 400);
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }


        public Task<MethodResult> UpdateThesisDefence(ThesisDefenceModel model)
        {
            throw new NotImplementedException();
        }
    }
}
