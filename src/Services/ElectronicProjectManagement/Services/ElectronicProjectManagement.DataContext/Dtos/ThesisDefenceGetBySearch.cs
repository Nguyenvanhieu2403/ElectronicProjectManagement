using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Dtos
{
    public class ThesisDefenceGetBySearch
    {
        public int Id { get; set; }
        public int IdThesisDefenceDetail { get; set; }
        public string NameThesisDefence { get; set; }
        public string ProjectBatchName { get; set; }
        public string TopicName { get; set; }
        public string ProjectName { get; set; }
        public string NameStudent { get; set; }
        public string NameSupervisor { get; set; }
        public string? Point { get; set; }
        public string? Comment { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }

    }
}
