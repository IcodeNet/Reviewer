namespace Reviewer.Web.Mvc.Controllers.MVC
{
    using System.Collections.Generic;

    public class ReportDataModel
    {
        #region Public Properties

        public string[] ColumnsNames { get; set; }
        public IEnumerable<string[]> Rows { get; set; }

        #endregion
    }
}