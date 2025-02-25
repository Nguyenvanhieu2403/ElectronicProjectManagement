using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicProjectManagement.DataContext
{
    public partial class ReferencesFile
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string DocumentType { get; set; }
        public DateTime YearPublication { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public string Description { get; set; }
        public string Field { get; set; }
    }
}
