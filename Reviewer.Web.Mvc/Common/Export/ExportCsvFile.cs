
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportCsvFile exports data to a CSV file
    /// </summary>
    /// <typeparam name="T">The Type of the rows to export</typeparam>
    public class ExportCsvFile<T> : ExportFile<T>
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
            ExportCsvFileFormatParameters exportCsvFileFormat = (ExportCsvFileFormatParameters)exportFileFormat;

            using (StreamWriter writer = new StreamWriter(filename))
            {
                this.ExportCsv(rows, writer, exportCsvFileFormat, excludeColumns);
            }
        }

        /// <summary>
        /// Export exports the data to the specified file using the specified file format
        /// </summary>
        /// <param name="rows">The rows to export</param>
        /// <param name="writer">The TextWriter to export the rows to</param>
        /// <param name="exportFileFormat">The format of the file</param>
        /// <param name="excludeColumns">The columns to exclude for the export</param>
        public void ExportCsv(
            IEnumerable<T> rows,
            TextWriter writer,
            ExportCsvFileFormatParameters exportFileFormat,
            List<string> excludeColumns)
        {
            List<string> includeColumns = this.GetIncludeColumns(typeof(T), excludeColumns);
            List<PropertyInfo> includeColumnPropertyInfos = this.GetPropertyInfos(typeof(T), includeColumns);

            if (exportFileFormat == null)
            {
                exportFileFormat = new ExportCsvFileFormatParameters();
            }

            if (exportFileFormat.IncludeColumnNames)
            {
                string line = this.GetHeader(exportFileFormat, includeColumns);
                writer.WriteLine(line);
            }

            foreach (T row in rows)
            {
                string line = this.GetLine(row, exportFileFormat, includeColumnPropertyInfos);
                writer.WriteLine(line);
            }
        }

        /// <summary>
        /// GetHeader gets the header line of the CSV file
        /// </summary>
        /// <param name="exportFileFormat">The CSV file format</param>
        /// <param name="includeColumns">The columns to include</param>
        /// <returns>The header line of the CSV file</returns>
        private string GetHeader(ExportCsvFileFormatParameters exportFileFormat, List<string> includeColumns)
        {
            StringBuilder builder = new StringBuilder();
            for (int columnIndex = 0; columnIndex < includeColumns.Count; columnIndex++)
            {
                string includeColumn = includeColumns[columnIndex];

                if (columnIndex < includeColumns.Count - 1)
                {
                    builder.Append(includeColumn + exportFileFormat.ColumnSeparator);
                }
                else
                {
                    builder.Append(includeColumn);
                }
            }

            return builder.ToString();
        }

        /// <summary>
        /// GetLine gets the data line of the CSV file for the given row
        /// </summary>
        /// <param name="row">The row to get the line for</param>
        /// <param name="exportFileFormat">The CSV file format</param>
        /// <param name="includeColumnPropertyInfos">A list of PropertyInfos of columns to include</param>
        /// <returns>The data line of the CSV file for the given row</returns>
        private string GetLine(
            T row,
            ExportCsvFileFormatParameters exportFileFormat,
            List<PropertyInfo> includeColumnPropertyInfos)
        {
            StringBuilder builder = new StringBuilder();
            for (int columnIndex = 0; columnIndex < includeColumnPropertyInfos.Count; columnIndex++)
            {
                PropertyInfo includeColumnPropertyInfo = includeColumnPropertyInfos[columnIndex];
                object data = includeColumnPropertyInfo.GetValue(row, null);
                string formattedData = this.GetFormattedData(data, exportFileFormat);

                if (columnIndex < includeColumnPropertyInfos.Count - 1)
                {
                    builder.Append(formattedData + exportFileFormat.ColumnSeparator);
                }
                else
                {
                    builder.Append(formattedData);
                }
            }

            return builder.ToString();
        }

        /// <summary>
        /// GetFormattedData gets the data as a string formatted for a CSV file
        /// </summary>
        /// <param name="data">The data to format</param>
        /// <param name="exportFileFormat">The CSV file format</param>
        /// <returns>The formatted data</returns>
        private string GetFormattedData(object data, ExportCsvFileFormatParameters exportFileFormat)
        {
            if (data == null)
            {
                return string.Empty;
            }
            else if (data is DateTime)
            {
                return ((DateTime)data).ToString("u", CultureInfo.InvariantCulture);
            }
            else if (data is string)
            {
                return string.Format("{0}{1}{2}", exportFileFormat.ColumnDelimiterBegin, data.ToString(), exportFileFormat.ColumnDelimiterEnd);
            }
            else
            {
                return data.ToString();
            }
        }
    }
}
