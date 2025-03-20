using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext.Model
{
    public class PersonalProjectManagementSearchModel : SearchModel
    {
        public long IdProjectBatch { get; set; }
        public long IdUser { get; set; }
    }
}
