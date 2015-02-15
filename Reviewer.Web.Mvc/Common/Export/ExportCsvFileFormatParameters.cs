

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportCsvFileFormatParameters represents the file format parameters for CSV files
    /// </summary>
    public class ExportCsvFileFormatParameters : ExportFileFormatParameters
    {
        /// <summary>
        /// Initializes a new instance of the ExportCsvFileFormatParameters class
        /// </summary>
        public ExportCsvFileFormatParameters()
        {
            this.IncludeColumnNames = true;
            this.ColumnSeparator = ",";
            this.ColumnDelimiterBegin = @"""";
            this.ColumnDelimiterEnd = @"""";
        }

        /// <summary>
        /// Gets or sets a value indicating whether to include column names in the output
        /// </summary>
        public bool IncludeColumnNames { get; set; }

        /// <summary>
        /// Gets or sets the string used to separate columns
        /// </summary>
        public string ColumnSeparator { get; set; }

        /// <summary>
        /// Gets or sets the string used at the beginning of a column
        /// </summary>
        public string ColumnDelimiterBegin { get; set; }

        /// <summary>
        /// Gets or sets the string used at the end of a column
        /// </summary>
        public string ColumnDelimiterEnd { get; set; }
    }
}
