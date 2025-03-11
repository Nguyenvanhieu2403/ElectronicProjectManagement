using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Dtos
{
    public class ProjectsProposedTopics
    {
        public long Id { get; set; }
        public string TopicName { get; set; }
        public string ProjectName { get; set; }
        public string NameStudent { get; set; }
        public string UnitName { get; set; }
        public string NameTeacher { get; set; }
    }
}
