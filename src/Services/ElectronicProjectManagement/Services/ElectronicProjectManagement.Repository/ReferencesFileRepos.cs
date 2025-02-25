using Dapper;
using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Constants;
using ElectronicProjectManagement.DataContext.Model;
using ElectronicProjectManagement.Repository.Interfaces;
using FastMember;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base;
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
                        YearPublication = model.YearPublication,
                        FileName = file.FileName,
                        Path = ("\\ReferencesFile\\" + file.FileName),
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
                        YearPublication = model.YearPublication,
                        FileName = file.FileName,
                        Path = ("\\ReferencesFile\\" + file.FileName),
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
