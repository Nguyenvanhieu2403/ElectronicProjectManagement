using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class ProjectsTeachersStudents
    {
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int? CountStudent { get; set; }
        public long? IdTeacher { get; set; }
        public long? IdStudent { get; set; }
        public long? IdProject { get; set; }
        public long? IdProjectBatch { get; set; }
        public string? ProjectBatchName { get; set; }
        public string? TopicName { get; set; }
        public string? ProjectName { get; set; }
    }
}
