using System.Web.Mvc;
using FluentValidation.Results;

namespace Reviewer.Web.Mvc.Common.Validation
{
    /// <summary>
    ///     The model state helpers.
    /// </summary>
    public class ModelStateHelpers
    {
        #region Public Methods and Operators

        /// <summary>
        /// The map fluent validation result to model state.
        /// </summary>
        /// <param name="validationResult">
        /// The validation result.
        /// </param>
        /// <param name="modelState">
        /// The model state.
        /// </param>
        public static void MapFluentValidationResultToModelState(
            ValidationResult validationResult, ModelStateDictionary modelState)
        {
            foreach (var validationError in validationResult.Errors)
            {
                modelState.AddModelError(validationError.PropertyName, validationError.ErrorMessage);
            }
        }

        #endregion
    }
}