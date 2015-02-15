
using System;
using Castle.Core.Logging;
using Castle.DynamicProxy;

namespace Reviewer.Web.Mvc.Common.Interceptors
{
    /// <summary>
    ///     Interceptor to provide exception logging for components.
    /// </summary>
    public class ExceptionInterceptor : IInterceptor
    {
        /// <summary>
        ///     Gets or sets the ILogger to be used.
        /// </summary>
        public ILogger Logger { get; set; }

        /// <summary>
        ///     Intercepts an invocation.
        /// </summary>
        /// <param name="invocation">The invocation being invoked.</param>
        public void Intercept(IInvocation invocation)
        {
            try
            {
                invocation.Proceed();
            }
            catch (Exception ex)
            {
                this.Logger.Error(
                    string.Format("Exception invoking {0}.{1}", invocation.TargetType.Name, invocation.Method.Name), ex);

                throw;
            }
        }
    }
}