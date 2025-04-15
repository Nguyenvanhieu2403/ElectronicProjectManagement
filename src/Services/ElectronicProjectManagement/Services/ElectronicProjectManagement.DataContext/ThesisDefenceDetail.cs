using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class ThesisDefenceDetail
    {
        public int IdThesisDefence { get; set; }
        public int? IdPersonalProjectManagement { get; set; }
        public int? IdTeacher { get; set; }
        public string? Point { get; set; }
        public string? Comment { get; set; }
    }
}
