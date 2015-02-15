
using System;
using System.Net;
using System.ServiceModel;
using System.Web.Mvc;
using FluentValidation.Results;
using Reviewer.Web.Mvc.Common.Filters;
using Reviewer.Web.Mvc.Common.Interceptors.Selectors;
using ServiceStack.Text;

namespace Reviewer.Web.Mvc.Controllers.MVC
{
    /// <summary>
    /// Base Controller
    /// </summary>
    [LogInvocations]
    [DisableCache]
    public abstract class BaseController : Controller
    {
        /// <summary>
        /// Executes the passed Action and returns a Json Result (with Allow Get).
        /// If the action throws a ValidationResult this is serialized to the response stream with Status 403.
        /// If the action throws an Exception this is serialized to the response stream with Status 500.
        /// </summary>
        /// <param name="action">The action.</param>
        /// <returns>An ActionResult to return to the client.</returns>
        protected ActionResult TryJsonAction(Func<object> action)
        {
            try
            {
                object value = action.Invoke();
                return this.Json(value, JsonRequestBehavior.AllowGet);
            }
            catch (FaultException<ValidationResult> ex)
            {
                return this.JsonStatusCode(ex.Detail, HttpStatusCode.Forbidden);
            }
            catch (Exception ex)
            {
                return this.JsonStatusCode(ex, HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Returns the value as Json with the supplied Http Status Code.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="statusCode">The status code.</param>
        /// <returns>An ActionResult to the client.</returns>
        protected ActionResult JsonStatusCode(object value, HttpStatusCode statusCode)
        {
            string response = string.Empty;
            if (value != null)
            {
                response = value.ToJson();
            }

            this.Response.Write(response);
            return new HttpStatusCodeResult(statusCode);
        }
    }
}