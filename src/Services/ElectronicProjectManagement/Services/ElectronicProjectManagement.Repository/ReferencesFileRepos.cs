using Dapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Interfaces;
using FastMember;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
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
using VnPostLib.Common.Utils;
using Z.Dapper.Plus;

namespace ElectronicProjectManagement.Repository
{
    public class ReferencesFileRepos : BaseRepos<ReferencesFile>, IReferencesFileRepos
    {
        private readonly IConfiguration _configuration;

        public ReferencesFileRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }



        public async Task<MethodResult> CreateReferencesFile(ReferencesFileModel model, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return MethodResult.ResultWithError("error", "Không có file tài liệu nào được chọn", 400);
                }
                string baseDirData = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";

                string imageDir = Path.Combine(baseDirData, "ReferencesFile");

                if (!Directory.Exists(imageDir))
                {
                    Directory.CreateDirectory(imageDir);
                }

                string filePath = Path.Combine(imageDir, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var listData = new List<ReferencesFile>
                {
                    new() {
                        Title = model.Title,
                        Author = model.Author,
                        Description = model.Description,
                        DocumentType = model.DocumentType,
                        YearPublication = model.YearPublication.Value,
                        FileName = file.FileName,
                        Path = ("ReferencesFile\\" + file.FileName),
                        Field = model.Field,
                        Status = 1,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        ModifiedBy = null,
                        Modified = null
                    }
                };

                using IDbConnection connection = GetOpenConnection();
                var result = await connection.BulkInsertAsync(listData);
                connection.Close();
                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch(Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public async Task<MethodResult> DeleteReferencesFile(long id)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                string oldFilePath = await connection.QueryFirstOrDefaultAsync<string>("EPM.GetReferencesFileById", new { Id = id }, commandType: CommandType.StoredProcedure);

                string baseDirData = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";
                if (!string.IsNullOrEmpty(oldFilePath))
                {
                    string fullOldFilePath = Path.Combine(baseDirData, oldFilePath.TrimStart('\\'));

                    if (File.Exists(fullOldFilePath))
                    {
                        File.Delete(fullOldFilePath);
                    }
                }
                var listData = new List<ReferencesFile>
                {
                    new() {
                        Id = id
                    }
                };
                var result = await connection.BulkDeleteAsync(listData);
                connection.Close();
                return MethodResult.ResultWithSuccess("Delete success");

            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        private async Task<DataTable> ExportExcelToDataTable(ReferencesFileSearchModel model)
        {
            DataTable dataTable = new DataTable();

            using (SqlConnection conn = new SqlConnection(NamingConventionHelpers.GetSqlConnectionString(_configuration)))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("EPM.GetReferencesFileExcel", conn))
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

        public async Task<MemoryStream> ExportExcel(ReferencesFileSearchModel model)
        {
            var exportFile = new MemoryStream();

            #region call list api
            var result = await ExportExcelToDataTable(model);
            #endregion

            #region xuất excel từ template
            // Đường dẫn tới file template
            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot", "template", "EPM_ReferencesFileReport.xlsx"); ;

            // Đọc file template
            var fileInfo = new FileInfo(templatePath);
            using (var package = new OfficeOpenXml.ExcelPackage(fileInfo))
            {
                // Lấy worksheet đầu tiên từ template
                var worksheet = package.Workbook.Worksheets[0];
                worksheet.Cells["A5"].LoadFromDataTable(result, false);

                // Tự động điều chỉnh kích thước cột
                //worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                var range = worksheet.Cells["A5:H" + (result.Rows.Count + 6).ToString()];
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

        public async Task<MethodResult<List<ReferencesFile>>> GetsAllReferencesFile()
        {
            using var conn = GetOpenConnection();
            string sqlQuery = "[EPM].[ReferencesFile_GetsAllReferencesFile]";
            List<ReferencesFile> data = (await conn.QueryAsync<ReferencesFile>(sqlQuery, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return MethodResult<List<ReferencesFile>>.ResultWithData(data, "", 0);
        }

        public async Task<MethodResult<List<ReferencesFile>>> GetsReferencesFileBySearch(ReferencesFileSearchModel model)
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

                var data = await connection.QueryAsync<ReferencesFile>("EPM.GetReferencesFileBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetReferencesFileBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ReferencesFile>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ReferencesFile>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult> UpdateReferencesFile(ReferencesFileModel model, IFormFile file)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();

                if (file == null || file.Length == 0)
                {
                    return MethodResult.ResultWithError("error", "Không có file tài liệu nào được chọn", 400);
                }
                string baseDirData = _configuration.GetSection("File").GetValue<string>("ReferencesFileUrl")
                         ?? "D:\\DoAnTotNghiep\\ElectronicProjectManagement\\src\\File";

                string imageDir = Path.Combine(baseDirData, "ReferencesFile");

                if (!Directory.Exists(imageDir))
                {
                    Directory.CreateDirectory(imageDir);
                }

                string oldFilePath = await connection.QueryFirstOrDefaultAsync<string>("EPM.GetReferencesFileById", new { Id = model.Id }, commandType: CommandType.StoredProcedure);

                if (!string.IsNullOrEmpty(oldFilePath))
                {
                    string fullOldFilePath = Path.Combine(baseDirData, oldFilePath.TrimStart('\\'));

                    if (File.Exists(fullOldFilePath))
                    {
                        File.Delete(fullOldFilePath);
                    }
                }

                string filePath = Path.Combine(imageDir, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var listData = new List<ReferencesFile>
                {
                    new() {
                        Id = model.Id,
                        Title = model.Title,
                        Author = model.Author,
                        Description = model.Description,
                        DocumentType = model.DocumentType,
                        YearPublication = model.YearPublication.Value,
                        FileName = file.FileName,
                        Path = ("ReferencesFile\\" + file.FileName),
                        Field = model.Field,
                        Status = 1,
                        CreateDate = null,
                        CreateBy = null,
                        ModifiedBy = model.CreateBy,
                        Modified = DateTime.Now
                    }
                };
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
