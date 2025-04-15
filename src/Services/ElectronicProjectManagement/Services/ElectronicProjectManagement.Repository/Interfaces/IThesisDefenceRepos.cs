using ElectronicProjectManagement.DataContext;
using ElectronicProjectManagement.DataContext.Dtos;
using ElectronicProjectManagement.DataContext.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VnPostLib.Common.Api.Models;
using VnPostLib.Common.Base.Interfaces;

namespace ElectronicProjectManagement.Repository.Interfaces
{
    public interface IThesisDefenceRepos : IBaseRepos<ThesisDefence>
    {
        Task<MethodResult<List<ThesisDefenceGetBySearch>>> GetsThesisDefenceBySearch(SearchModel model);
        Task<MemoryStream> GetsThesisDefenceExportExcel(SearchModel model);
        Task<MethodResult<List<ThesisDefence>>> GetsAllThesisDefence();
        Task<MethodResult> CreateThesisDefence(ThesisDefenceModel model);
        Task<MethodResult> UpdateThesisDefence(ThesisDefenceModel model);
        Task<MethodResult> DeleteThesisDefence(long id);
        Task<MethodResult<List<PersonalProjectManagement>>> GetsAllPersonalProjectManagement();

        Task<MethodResult> ScoringThesisDefence(ThesisDefenceDetail model);
    }
}
