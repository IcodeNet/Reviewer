
namespace Reviewer.Web.Mvc.Common.Contracts
{
    /// <summary>
    ///     The search request model.
    /// </summary>
    public class SearchRequestModel
    {
        #region Public Properties

        public FilterKeyValue[] FilterKeyValues { get; set; }

        public string LoggedInUserEmail { get; set; }
       
        public string OrderBy { get; set; }
      
        public int Page { get; set; }
 
        public int PageSize { get; set; }

        public string SortOrder { get; set; }

        #endregion
    }
}