
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportFile is an abstract class for classes that export data to a file
    /// </summary>
    /// <typeparam name="T">The Type of the rows to export</typeparam>
    public abstract class ExportFile<T>
    {
        /// <summary>
        /// Export exports the data to the specified file using the specified file format
        /// </summary>
        /// <param name="rows">The rows to export</param>
        /// <param name="filename">The filename to export the rows to</param>
        /// <param name="exportFileFormat">The format of the file</param>
        /// <param name="excludeColumns">The columns to exclude for the export</param>
        public abstract void Export(
            IEnumerable<T> rows,
            string filename,
            ExportFileFormatParameters exportFileFormat,
            List<string> excludeColumns);

        /// <summary>
        /// GetPropertyInfos gets a list of PropertyInfos that correspond to the list of columns to be included
        /// </summary>
        /// <param name="type">The Type to get the PropertyInfos from</param>
        /// <param name="includeColumns">The list of columns to include</param>
        /// <returns>A list of PropertyInfos that correspond to the list of columns to be included</returns>
        protected List<PropertyInfo> GetPropertyInfos(Type type, List<string> includeColumns)
        {
            return (from p in type.GetProperties()
                    where includeColumns.Contains(p.Name)
                    select p).ToList();
        }

        /// <summary>
        /// GetIncludeColumns gets a list of column names to include excluding the columns specified
        /// </summary>
        /// <param name="type">The Type to get the column names from</param>
        /// <param name="excludeColumns">The list of columns to exclude</param>
        /// <returns>A list of column names to include excluding the columns specified</returns>
        protected List<string> GetIncludeColumns(Type type, List<string> excludeColumns)
        {
            List<string> includeColumns = (from p in type.GetProperties()
                                           select p.Name).ToList();

            if (excludeColumns != null && excludeColumns.Count > 0)
            {
                // exclude the excluded columns
                foreach (string excludeColumn in excludeColumns)
                {
                    int index = includeColumns.FindIndex(c => string.Compare(c, excludeColumn, StringComparison.InvariantCultureIgnoreCase) == 0);
                    if (index > -1)
                    {
                        includeColumns.RemoveAt(index);
                    }
                }
            }

            return includeColumns;
        }
    }
}
