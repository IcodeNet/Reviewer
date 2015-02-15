
using System.Collections.Generic;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportFileType specifies the type of the file to export to
    /// </summary>
    public enum ExportFileType
    {
        /// <summary>
        /// A CSV file
        /// </summary>
        Csv,

        /// <summary>
        /// An Excel file
        /// </summary>
        Excel
    }

    /// <summary>
    /// ExportManager provides an abstraction layer for the ExportFile class that is used to export data
    /// </summary>
    /// <typeparam name="T">The Type of the rows to export</typeparam>
    public class ExportManager<T>
    {
        /// <summary>
        /// Export exports the data to the specified file using the specified file format
        /// </summary>
        /// <param name="rows">The rows to export</param>
        /// <param name="filename">The filename to export the rows to</param>
        /// <param name="exportFileType">The type of the file to export to</param>
        /// <param name="exportFileFormat">The format of the file</param>
        /// <param name="excludeColumns">The columns to exclude for the export</param>
        public void Export(
            IEnumerable<T> rows,
            string filename,
            ExportFileType exportFileType,
            ExportFileFormatParameters exportFileFormat,
            List<string> excludeColumns)
        {
            if (exportFileType == ExportFileType.Csv)
            {
                if (exportFileFormat == null || exportFileFormat is ExportCsvFileFormatParameters)
                {
                    ExportCsvFile<T> exportFile = new ExportCsvFile<T>();
                    exportFile.Export(rows, filename, exportFileFormat, excludeColumns);
                }
            }
            else if (exportFileType == ExportFileType.Excel)
            {
                if (exportFileFormat == null || exportFileFormat is ExportExcelFileFormatParameters)
                {
                    ExportExcelFile<T> exportFile = new ExportExcelFile<T>();
                    exportFile.Export(rows, filename, exportFileFormat, excludeColumns);
                }
            }
        }
    }
}
