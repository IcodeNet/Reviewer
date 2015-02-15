
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportExcelFile exports data to an Excel file
    /// </summary>
    /// <typeparam name="T">The Type of the rows to export</typeparam>
    public class ExportExcelFile<T> : ExportFile<T>
    {
        /// <summary>
        /// Export exports the data to the specified file using the specified file format
        /// </summary>
        /// <param name="rows">The rows to export</param>
        /// <param name="filename">The filename to export the rows to</param>
        /// <param name="exportFileFormat">The format of the file</param>
        /// <param name="excludeColumns">The columns to exclude for the export</param>
        public override void Export(
            IEnumerable<T> rows,
            string filename,
            ExportFileFormatParameters exportFileFormat,
            List<string> excludeColumns)
        {
            ExportExcelFileFormatParameters exportExcelFileFormat = (ExportExcelFileFormatParameters)exportFileFormat;
            if (exportExcelFileFormat == null)
            {
                exportExcelFileFormat = new ExportExcelFileFormatParameters();
            }

            if (string.IsNullOrEmpty(Path.GetExtension(filename)))
            {
                filename = filename + ".xlsx";
            }

            if (File.Exists(filename))
            {
                File.Delete(filename);
            }

            List<string> includeColumns = this.GetIncludeColumns(typeof(T), excludeColumns);
            List<PropertyInfo> includeColumnPropertyInfos = this.GetPropertyInfos(typeof(T), includeColumns);

            Spreadsheet<T>.Create(rows, filename, includeColumnPropertyInfos);
        }
    }
}
