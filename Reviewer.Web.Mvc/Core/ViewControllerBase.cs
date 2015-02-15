
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Core.Common.Contracts;

namespace Reviewer.Web.Mvc.Core
{
    /// <summary>
    ///     The view controller base.
    /// </summary>
    public class ViewControllerBase : Controller
    {
        #region Fields

        /// <summary>
        ///     The _ disposable services.
        /// </summary>
        private List<IServiceContract> disposableServices;

        #endregion

        #region Public Properties

        /// <summary>
        ///     Gets the disposable services.
        /// </summary>
        public List<IServiceContract> DisposableServices
        {
            get
            {
                return this.disposableServices ?? (this.disposableServices = new List<IServiceContract>());
            }
        }

        #endregion

        #region Methods

        /// <summary>
        /// The on action executed.
        /// </summary>
        /// <param name="filterContext">
        /// The filter context.
        /// </param>
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);

            foreach (IServiceContract service in this.DisposableServices)
            {
                if (service != null && service is IDisposable)
                {
                    (service as IDisposable).Dispose();
                }
            }
        }

        /// <summary>
        /// The on action executing will call the Register Services passing in the collection of Disposable services 
        /// that we will add to.
        /// </summary>
        /// <param name="filterContext">
        /// The filter context.
        /// </param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            this.RegisterServices(this.DisposableServices);
        }

        /// <summary>
        /// Controllers based on this class will have the responsibility to register services,
        ///     that on ActionExecuted will be flagged for disposal.
        ///     The disposal of Services will be the responsibility of a <see cref="System.Web.Http.Filters.ActionFilterAttribute"/>
        /// </summary>
        /// <param name="disposableServices">
        /// The disposable services.
        /// </param>
        protected virtual void RegisterServices(List<IServiceContract> disposableServices)
        {
        }

        #endregion
    }
}