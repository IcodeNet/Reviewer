
using System.Collections.Generic;

namespace Reviewer.Web.Mvc.Common.Contracts
{
    /// <summary>
    ///     Search Response Model
    /// </summary>
    /// <typeparam name="T">
    ///     Search Response Type
    /// </typeparam>
    public class SearchResponseModel<T>
    {
        #region Public Properties

        /// <summary>
        ///     Gets or sets the page.
        /// </summary>
        /// <value>
        ///     The page.
        /// </value>
        public int Page { get; set; }

        /// <summary>
        ///     Gets or sets the size of the page.
        /// </summary>
        /// <value>
        ///     The size of the page.
        /// </value>
        public int PageSize { get; set; }

        /// <summary>
        ///     Gets or sets the result when the result needs to be a more complex object.
        /// </summary>
        /// <value>
        ///     The result object graph.
        /// </value>
        public T Result { get; set; }

        /// <summary>
        ///     Gets or sets the results.
        /// </summary>
        /// <value>
        ///     The results.
        /// </value>
        public IEnumerable<T> Results { get; set; }

        /// <summary>
        ///     Gets or sets the total pages.
        /// </summary>
        /// <value>
        ///     The total pages.
        /// </value>
        public int TotalPages { get; set; }

        /// <summary>
        ///     Gets or sets the total results.
        /// </summary>
        /// <value>
        ///     The total results.
        /// </value>
        public int TotalResults { get; set; }

        #endregion
    }
}