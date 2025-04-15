using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class ThesisDefenceModel
    {
        public string Name { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public string? Point { get; set; }
        public string? Comment { get; set; }
        public byte? Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public long? CreateBy { get; set; }
        public DateTime? Modified { get; set; }
        public long? ModifiedBy { get; set; }
        public List<int>? IdPersonalProjectManagement { get; set; }
        public List<int>? IdTeacher { get; set; }
    }
}
