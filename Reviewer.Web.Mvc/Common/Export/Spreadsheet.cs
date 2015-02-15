
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// SpreadsheetExtensions is a collection of extensions to the Spreadsheet class to support non-DataTable data sources
    /// </summary>
    /// <typeparam name="T">The type of the rows</typeparam>
    public class Spreadsheet<T> : Spreadsheet
    {
        /// <summary>
        /// Create creates a spreadsheet from the given rows
        /// </summary>
        /// <param name="rows">The rows to add to the spreadsheet</param>
        /// <param name="filePath">The filename of the spreadsheet including the path</param>
        /// <param name="includeColumnPropertyInfos">The list of PropertyInfo objects to include in the output</param>
        public static void Create(IEnumerable<T> rows, string filePath, List<PropertyInfo> includeColumnPropertyInfos)
        {
            DataTable dataTable = GetDataTable(rows, includeColumnPropertyInfos);
            Spreadsheet.Create(dataTable, filePath);
        }

        /// <summary>
        /// GetDataTable gets a DataTable from a collection of rows
        /// </summary>
        /// <param name="rows">The rows to add to the DataTable</param>
        /// <param name="includeColumnPropertyInfos">The list of PropertyInfo objects to include in the output</param>
        /// <returns>A DataTable from a collection of rows</returns>
        private static DataTable GetDataTable(IEnumerable<T> rows, List<PropertyInfo> includeColumnPropertyInfos)
        {
            DataTable dataTable = new DataTable();
            AddColumns(dataTable, includeColumnPropertyInfos);
            AddData(dataTable, rows, includeColumnPropertyInfos);
            return dataTable;
        }

        /// <summary>
        /// AddData adds the rows to the DataTable
        /// </summary>
        /// <param name="dataTable">The DataTable to add the rows to</param>
        /// <param name="rows">The rows to add to the DataTable</param>
        /// <param name="includeColumnPropertyInfos">The list of PropertyInfo objects to include in the output</param>
        private static void AddData(DataTable dataTable, IEnumerable<T> rows, List<PropertyInfo> includeColumnPropertyInfos)
        {
            foreach (T row in rows)
            {
                DataRow dataRow = dataTable.NewRow();
                foreach (PropertyInfo propertyInfo in includeColumnPropertyInfos)
                {
                    object value = propertyInfo.GetValue(row, null);
                    dataRow[GetExportColumnName(propertyInfo)] = value == null ? DBNull.Value : value;
                }

                dataTable.Rows.Add(dataRow);
            }
        }

        /// <summary>
        /// AddColumns adds the corresponding DataColumns to the DataTable
        /// </summary>
        /// <param name="dataTable">The DataTable to add the columns to</param>
        /// <param name="includeColumnPropertyInfos">The list of PropertyInfo objects to include in the output</param>
        private static void AddColumns(DataTable dataTable, List<PropertyInfo> includeColumnPropertyInfos)
        {
            foreach (PropertyInfo propertyInfo in includeColumnPropertyInfos)
            {
                DataColumn dataColumn = new DataColumn(GetExportColumnName(propertyInfo), GetUnderlyingType(propertyInfo.PropertyType));
                dataTable.Columns.Add(dataColumn);
            }
        }

        /// <summary>
        /// GetExportColumnName gets the column name that should be used for exporting
        /// </summary>
        /// <param name="propertyInfo">The PropertyInfo to get the column name from</param>
        /// <returns>The column name that should be used for exporting</returns>
        private static string GetExportColumnName(PropertyInfo propertyInfo)
        {
            object[] exportColumnNameAttributes = propertyInfo.GetCustomAttributes(typeof(ExportColumnNameAttribute), true);
            if (exportColumnNameAttributes.GetLength(0) == 1)
            {
                ExportColumnNameAttribute exportColumnNameAttribute = (ExportColumnNameAttribute)exportColumnNameAttributes[0];
                return exportColumnNameAttribute.ColumnName;
            }

            return propertyInfo.Name;
        }

        /// <summary>
        /// GetUnderlyingType gets the underlying type if type is Nullable otherwise return the type
        /// </summary>
        /// <param name="type">The Type</param>
        /// <returns>The underlying type if type is Nullable otherwise return the type</returns>
        private static Type GetUnderlyingType(Type type)
        {
            if (type != null && IsNullable(type))
            {
                if (!type.IsValueType)
                {
                    return type;
                }
                else
                {
                    return Nullable.GetUnderlyingType(type);
                }
            }
            else
            {
                return type;
            }
        }

        /// <summary>
        /// IsNullable gets whether specified type is nullable
        /// </summary>
        /// <param name="type">The Type</param>
        /// <returns>True if the specified type is nullable</returns>
        private static bool IsNullable(Type type)
        {
            return !type.IsValueType || (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>));
        }
    }
}
