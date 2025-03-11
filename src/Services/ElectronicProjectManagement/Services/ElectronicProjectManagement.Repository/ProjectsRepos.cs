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
using System.Data;
using Z.Dapper.Plus;
using Dapper;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using Aspose.Cells;
using ElectronicProjectManagement.DataContext.Dtos;
using ElectronicProjectManagement.Repository.Common;

namespace ElectronicProjectManagement.Repository
{
    public class ProjectsRepos : BaseRepos<Projects>, IProjectsRepos
    {
        private readonly IConfiguration _configuration;

        public ProjectsRepos(IConfiguration configuration) : base(configuration, ServiceConstant.DefaultSchema)
        {
            _configuration = configuration;
        }

        public async Task<MethodResult> ApproveTopic(int ProjectId)
        {
            try
            {

                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdProject", ProjectId);

                var dataUpdate = await connection.QueryFirstOrDefaultAsync<Projects>("EPM.ApproveTopic", parameters, commandType: CommandType.StoredProcedure);

                var parameters1 = new DynamicParameters();
                parameters1.Add("@IdStudent", dataUpdate.CreateBy);
                var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);
                connection.Close();
                if (dataUpdate?.Status == 1)
                {
                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ProjectTitle = dataUpdate.Name,
                        SupervisorName = dataUserTeacher.DisplayName
                    };
                    SendEmail.SendApprovalEmail(sendEmailModel);
                    return MethodResult.ResultWithSuccess("Approved success");
                }
                return MethodResult.ResultWithSuccess("Approved fail");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public async Task<MethodResult> CreateProjects(Projects model)
        {
            try
            {
                var listData = new List<Projects>
                {
                    new() {
                        Topic = model.Topic,
                        Name = model.Name,
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

        public Task<MethodResult> DeleteProjects(long id)
        {
            throw new NotImplementedException();
        }

        public Task<MethodResult<List<Projects>>> GetsAllProjects()
        {
            throw new NotImplementedException();
        }

        public async Task<MethodResult<List<Projects>>> GetsProjectsBySearch(SearchModel model)
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

                var data = await connection.QueryAsync<Projects>("EPM.GetProjectsBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetProjectsBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<Projects>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<Projects>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult<List<ProjectsProposedTopics>>> GetsStudentsProposedTopics(StudentsProposedTopicsSearchModel model)
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
                parameters.Add("@IdTeacher", model.IdTeacher);

                var data = await connection.QueryAsync<ProjectsProposedTopics>("EPM.GetProjectsProposedTopicsBySearch", parameters, commandType: CommandType.StoredProcedure);

                int totalRecord = await connection.ExecuteScalarAsync<int>("EPM.GetProjectsProposedTopicsBySearch_Count", parameters, commandType: CommandType.StoredProcedure);

                return MethodResult<List<ProjectsProposedTopics>>.ResultWithData(data.ToList(), "", totalRecord);
            }
            catch (Exception ex)
            {
                return MethodResult<List<ProjectsProposedTopics>>.ResultWithError(ex.Message, 400);
            }
        }

        public async Task<MethodResult> ImportProjects(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return MethodResult.ResultWithError("error", "File không hợp lệ", 400);
            }

            try
            {
                var listData = new List<Projects>();

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        int rowCount = worksheet.Dimension.Rows;
                        int totalRecords = rowCount - 1;

                        using IDbConnection connection = GetOpenConnection();
                        var invalidTopics = (await connection.QueryAsync<int>(
                            "SELECT Id FROM EPM.Topic WHERE Status != 1"
                        )).ToHashSet();

                        var existingProjects = (await connection.QueryAsync<(int Topic, string Name)>(
                            "SELECT Topic, Name FROM EPM.Projects where Status = 1"
                        )).ToHashSet();


                        for (int row = 2; row <= rowCount; row++) 
                        {
                            if (worksheet.Cells[row, 1].Value == null || worksheet.Cells[row, 2].Value == null)
                            {
                                continue; 
                            }

                            int topicId = Convert.ToInt32(worksheet.Cells[row, 1].Value);
                            string name = worksheet.Cells[row, 2].Value?.ToString()?.Trim();

                            if (invalidTopics.Contains(topicId) || existingProjects.Contains((topicId, name)))
                            {
                                continue;
                            }

                            var project = new Projects
                            {
                                Topic = topicId,
                                Name = worksheet.Cells[row, 2].Value?.ToString(),
                                Status = 1,
                                CreateDate = DateTime.Now,
                                CreateBy = null,
                                Modified = DateTime.Now,
                                ModifiedBy = null
                            };

                            listData.Add(project);
                        }

                        int importedRecords = 0;

                        if (listData.Count > 0)
                        {
                            await connection.BulkInsertAsync(listData);
                            importedRecords = listData.Count;
                        }
                        connection.Close();

                        return MethodResult.ResultWithSuccess($"Import thành công {importedRecords}/{totalRecords} bản ghi.");
                    }
                }
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 500);
            }
        }

        public async Task<MethodResult> ProposeProjects(Projects model)
        {
            try
            {
                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdStudent", model.CreateBy);

                var data = await connection.QueryAsync<ProjectsTeachersStudents>("EPM.CheckStudentRegisterProject", parameters, commandType: CommandType.StoredProcedure);
                if (data.Count() < 1)
                {
                    return MethodResult.ResultWithError("error", "Sinh viên phải đăng ký giảng viên hướng dẫn trước", 400);
                }

                if (data.Count() > 0 && data.FirstOrDefault().IdProject != null)
                {
                    return MethodResult.ResultWithError("error","Mỗi sinh viên chỉ được đăng ký 1 đề tài đồ án tốt nghiệp", 400);
                }
                var listData = new List<Projects>
                {
                    new() {
                        Topic = model.Topic,
                        Name = model.Name,
                        Status = 4,
                        CreateDate = DateTime.Now,
                        CreateBy = model.CreateBy,
                        Modified = DateTime.Now,
                        ModifiedBy = model.ModifiedBy
                    }
                };
                var result = await connection.BulkInsertAsync(listData);
                connection.Close();
                return MethodResult.ResultWithSuccess("Insert success");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public async Task<MethodResult> RejectTopic(int ProjectId)
        {
            try
            {

                using IDbConnection connection = GetOpenConnection();
                var parameters = new DynamicParameters();
                parameters.Add("@IdProject", ProjectId);

                var dataUpdate = await connection.QueryFirstOrDefaultAsync<Projects>("EPM.RejectTopic", parameters, commandType: CommandType.StoredProcedure);

                var parameters1 = new DynamicParameters();
                parameters1.Add("@IdStudent", dataUpdate.CreateBy);
                var dataUserStudent = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetStudentSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);

                var dataUserTeacher = await connection.QueryFirstOrDefaultAsync<ProjectBatchUserModel>("EPM.GetTeacherSendEmailApproveTopic", parameters1, commandType: CommandType.StoredProcedure);
                connection.Close();
                if (dataUpdate?.Status == 3)
                {
                    SendEmailModel sendEmailModel = new SendEmailModel
                    {
                        StudentEmail = dataUserStudent.Email,
                        StudentName = dataUserStudent.DisplayName,
                        ProjectTitle = dataUpdate.Name,
                        SupervisorName = dataUserTeacher.DisplayName
                    };
                    SendEmail.SendProjectRejectionEmail(sendEmailModel);
                    return MethodResult.ResultWithSuccess("Approved success");
                }
                return MethodResult.ResultWithSuccess("Approved fail");
            }
            catch (Exception ex)
            {
                return MethodResult.ResultWithError("error", ex.Message, 400);
            }
        }

        public async Task<MethodResult> UpdateProjects(Projects model)
        {
            try
            {
                var listData = new List<Projects>
                {
                    new() {
                        Id = model.Id,
                        Topic = model.Topic,
                        Name = model.Name,
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
