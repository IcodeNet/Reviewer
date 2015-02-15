
namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportCsvFileFormatParameters represents the file format parameters for CSV files
    /// </summary>
    public class ExportExcelFileFormatParameters : ExportFileFormatParameters
    {
        /// <summary>
        /// Initializes a new instance of the ExportExcelFileFormatParameters class
        /// </summary>
        public ExportExcelFileFormatParameters()
        {
            this.IncludeColumnNames = true;
        }

        /// <summary>
        /// Gets or sets the string used at the end of a column
        /// </summary>
        public string WorkbookName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether to include column names in the output
        /// </summary>
        public bool IncludeColumnNames { get; set; }
    }
}
