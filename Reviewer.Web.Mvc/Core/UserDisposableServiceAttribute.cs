
using System;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Core.Common.Contracts;

namespace Reviewer.Web.Mvc.Core
{
    /// <summary>
    ///     The user disposable service attribute.
    ///     Any controllers that are decorated with this attribute once they have registered
    ///     any disposable services they will enjoy automatic Service Disposal on ActionExecuted.
    /// </summary>
    public class UserDisposableServiceAttribute : ActionFilterAttribute
    {
        #region Public Methods and Operators

        /// <summary>
        /// The on action executed will try to dispose registered services.
        /// </summary>
        /// <param name="actionExecutedContext">
        /// The action executed context.
        /// </param>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            // post-processing
            var controller = actionExecutedContext.ActionContext.ControllerContext.Controller as IServiceAwareController;

            if (controller != null)
            {
                foreach (IServiceContract service in controller.DisposableServices)
                {
                    if (service != null && service is IDisposable)
                    {
                        (service as IDisposable).Dispose();
                    }
                }
            }
        }

        /// <summary>
        /// The on action executing will register the Disposable services.
        /// </summary>
        /// <param name="actionContext">
        /// The action context.
        /// </param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            // pre-processing
            var controller = actionContext.ControllerContext.Controller as IServiceAwareController;

            if (controller != null)
            {
                controller.RegisterDisposableServices(controller.DisposableServices);
            }
        }

        #endregion
    }
}