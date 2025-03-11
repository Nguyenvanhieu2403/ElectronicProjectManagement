using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class ProjectBatchUserSearchModel
    {
        public long id { get; set; }
        public int Type { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
