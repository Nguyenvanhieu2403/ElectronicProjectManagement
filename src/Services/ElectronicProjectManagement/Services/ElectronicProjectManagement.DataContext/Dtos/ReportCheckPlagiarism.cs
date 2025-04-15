using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Dtos
{
    public class ReportCheckPlagiarism
    {
        public string Author { get; set; }
        public string FileName { get; set; }
        public string FileHighestRatio { get; set; }
        public Decimal PlagiarismRate { get; set; }
        public int TimeCheck { get; set; }
        public string ContentDuplicated { get; set; }
        public string PathPDF { get; set; }
    }
}
