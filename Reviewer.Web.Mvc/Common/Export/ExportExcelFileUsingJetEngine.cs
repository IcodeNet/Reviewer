
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Reflection;
using System.Text;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportExcelFileUsingJetEngine exports data to an Excel file using the Jet engine
    /// </summary>
    /// <typeparam name="T">The Type of the rows to export</typeparam>
    /// <remarks>This implementation requires the Jet engine to be installed (on the server).</remarks>
    public class ExportExcelFileUsingJetEngine<T> : ExportFile<T>
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
                filename = filename + ".xlsb";
            }

            if (File.Exists(filename))
            {
                File.Delete(filename);
            }

            string connectionString = string.Format(
                "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=Excel 12.0 Xml;{1};Jet OLEDB:Engine Type=37;ReadOnly=False;IMEX=0;",
                filename,
                exportExcelFileFormat.IncludeColumnNames ? "HDR=YES" : string.Empty);

            using (OleDbConnection connection = new OleDbConnection(connectionString))
            {
                connection.Open();

                List<string> includeColumns = this.GetIncludeColumns(typeof(T), excludeColumns);
                List<PropertyInfo> includeColumnPropertyInfos = this.GetPropertyInfos(typeof(T), includeColumns);

                DataTable dataTable = this.CreateDataTable(connection, exportExcelFileFormat, includeColumnPropertyInfos);

                foreach (T row in rows)
                {
                    this.AddRow(dataTable, row, includeColumnPropertyInfos);
                }

                OleDbCommand selectCommand = new OleDbCommand(string.Format("SELECT * FROM [{0}]", dataTable.TableName), connection);
                OleDbDataAdapter dataAdapter = new OleDbDataAdapter(selectCommand);
                OleDbCommandBuilder builder = new OleDbCommandBuilder(dataAdapter);
                dataAdapter.InsertCommand = builder.GetInsertCommand();

                dataAdapter.Update(dataTable);

                connection.Close();
            }
        }

        /// <summary>
        /// AddRow adds a row to a DataTable
        /// </summary>
        /// <param name="dataTable">The DataTable to add the row to</param>
        /// <param name="row">The row to add to the DataTable</param>
        /// <param name="includeColumnPropertyInfos">The columns to add to the row</param>
        private void AddRow(DataTable dataTable, T row, List<PropertyInfo> includeColumnPropertyInfos)
        {
            DataRow dataRow = dataTable.NewRow();

            foreach (PropertyInfo includeColumnPropertyInfo in includeColumnPropertyInfos)
            {
                dataRow[includeColumnPropertyInfo.Name] = includeColumnPropertyInfo.GetValue(row, null);
            }

            dataTable.Rows.Add(dataRow);
        }

        /// <summary>
        /// CreateDataTable creates a table (aka workbook) in the Excel spreadsheet and returns a DataTable for it
        /// </summary>
        /// <param name="connection">The connection to the Excel file</param>
        /// <param name="exportExcelFileFormat">The file format parameters</param>
        /// <param name="includeColumnPropertyInfos">The list of PropertyInfo objects to include in the output</param>
        /// <returns>The DataTable for the newly created workbook</returns>
        private DataTable CreateDataTable(
            OleDbConnection connection, 
            ExportExcelFileFormatParameters exportExcelFileFormat,
            List<PropertyInfo> includeColumnPropertyInfos)
        {
            string workBookName = exportExcelFileFormat != null && string.IsNullOrEmpty(exportExcelFileFormat.WorkbookName)
                ? "Sheet1" : exportExcelFileFormat.WorkbookName;

            DataSet dataSet = new DataSet();

            string createTable = this.GetCreateTable(includeColumnPropertyInfos, workBookName);

            OleDbCommand createCommand = new OleDbCommand(createTable, connection);

            createCommand.ExecuteNonQuery();

            OleDbDataAdapter command = new OleDbDataAdapter("SELECT * FROM [" + workBookName + "]", connection);

            command.Fill(dataSet, workBookName);

            DataTable dataTable = dataSet.Tables[0];
            return dataTable;
        }

        /// <summary>
        /// GetCreateTable gets the CREATE TABLE statement for the Excel file
        /// </summary>
        /// <param name="includeColumnPropertyInfos">The columns to include</param>
        /// <param name="workBookName">The name of the workbook to create</param>
        /// <returns>The CREATE TABLE statement for the Excel file</returns>
        private string GetCreateTable(List<PropertyInfo> includeColumnPropertyInfos, string workBookName)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(string.Format("CREATE TABLE [{0}] (", workBookName));

            for (int columnIndex = 0; columnIndex < includeColumnPropertyInfos.Count; columnIndex++)
            {
                PropertyInfo propertyInfo = includeColumnPropertyInfos[columnIndex];
                string includeColumn = propertyInfo.Name;

                string columnDefinition = includeColumn + " " + this.GetDataDefinition(propertyInfo) + " NULL";

                if (columnIndex < includeColumnPropertyInfos.Count - 1)
                {
                    builder.Append(columnDefinition + ",");
                }
                else
                {
                    builder.Append(columnDefinition);
                }
            }

            builder.Append(")");

            return builder.ToString();
        }

        /// <summary>
        /// GetDataDefinition gets the SQL column definition that corresponds to the PropertyInfo
        /// </summary>
        /// <param name="propertyInfo">The PropertyInfo to get the column definition for</param>
        /// <returns>The SQL column definition that corresponds to the PropertyInfo</returns>
        private string GetDataDefinition(PropertyInfo propertyInfo)
        {
            if (propertyInfo.PropertyType == typeof(string))
            {
                return "VARCHAR(20)";
            }
            else if (propertyInfo.PropertyType == typeof(DateTime))
            {
                return "DATETIME";
            }
            else if (propertyInfo.PropertyType == typeof(int))
            {
                return "INTEGER";
            }
            else if (propertyInfo.PropertyType == typeof(decimal))
            {
                return "DECIMAL(10,2)";
            }

            return "VARCHAR(20)";
        }
    }
}
