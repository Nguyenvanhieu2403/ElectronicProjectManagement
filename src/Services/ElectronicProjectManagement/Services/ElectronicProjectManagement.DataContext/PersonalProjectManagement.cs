using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class PersonalProjectManagement
    {
        public long? IdProjectsTeachersStudents { get; set; }
        public string? NameStudent { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? NameTeacher { get; set; }
        public string? NameProjectBatch { get; set; }
        public string? TopicName { get; set; }
        public string? ProjectName { get; set; }
        public string? NamePDF { get; set; }
        public string? PathPDF { get; set; }
        public string? NamePPT { get; set; }
        public string? PathPPT { get; set; }
        public string? NameSource { get; set; }
        public string? PathSource { get; set; }
        public string? Comment { get; set; }
        public Double? PlagiarismRate { get; set; }
        public string? TargetFile { get; set; }
        public string? FileHighestRatio { get; set; }
        public string? ContentDuplicated { get; set; }
        public int? TimeCheck { get; set; }
        public string? TestType { get; set; }
    }
}
