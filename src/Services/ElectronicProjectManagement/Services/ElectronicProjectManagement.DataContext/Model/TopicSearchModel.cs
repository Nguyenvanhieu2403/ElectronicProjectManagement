using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class TopicSearchModel
    {
        public string? Keyword { get; set; }
        public Boolean? IsDesc { get; set; }
        public string? OrderCol { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Status { get; set; }
        public int TotalRecord { get; set; }
    }
}
