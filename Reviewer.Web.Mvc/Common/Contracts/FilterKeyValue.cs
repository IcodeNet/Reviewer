namespace Reviewer.Web.Mvc.Common.Contracts
{
    /// <summary>
    ///     Custom key value 
    /// </summary>
    public class FilterKeyValue
    {
        #region Public Properties

        /// <summary>
        ///     Gets or sets the key.
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        public dynamic Value { get; set; }

        #endregion
    }
}