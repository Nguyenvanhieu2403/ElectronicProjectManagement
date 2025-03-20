using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class CheckPlagiarism
    {
        public long? IdProjectsTeachersStudents { get; set; }
        public Decimal PlagiarismRate { get; set; }
        public string? TargetFile { get; set; }
        public string? FileHighestRatio { get; set; }
        public string? ContentDuplicated { get; set; }
        public string? TestType { get; set; }
        public long? TimeCheck { get; set; }
    }
}
