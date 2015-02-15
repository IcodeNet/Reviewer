
using System;

namespace Reviewer.Web.Mvc.Common.Export
{
    /// <summary>
    /// ExportColumnNameAttribute is an attribute that allows a column name to be specified for exporting that is different from the property name
    /// </summary>
    /// <remarks>This attribute is particularly useful for column names that are not legal identifiers in C# such as those that contain spaces.</remarks>
    public class ExportColumnNameAttribute : Attribute
    {
        /// <summary>
        /// Gets or sets the name of the column when it is exported
        /// </summary>
        public string ColumnName { get; set; }
    }
}
