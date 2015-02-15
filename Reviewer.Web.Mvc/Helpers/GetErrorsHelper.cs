
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Reviewer.Web.Mvc.Helpers
{
    /// <summary>
    ///     JStatic method for pulling json results from error messages
    /// </summary>
    public static class GetErrorsHelper
    {
        #region Public Methods and Operators

        /// <summary>
        /// Gets errors as JSON valid string
        /// </summary>
        /// <param name="modelState">
        /// instance of ASP ModelState
        /// </param>
        /// <returns>
        /// JSON result
        /// </returns>
        public static IEnumerable GetErrors(this ModelStateDictionary modelState)
        {
            if (!modelState.IsValid)
            {
                IEnumerable<KeyValuePair<string, string[]>> result =
                    modelState.ToDictionary(
                        kvp => kvp.Key, kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray())
                              .Where(m => m.Value.Any());

                return Json.Encode(result);
            }

            return null;
        }

        #endregion
    }
}