using Castle.DynamicProxy;

namespace Reviewer.Web.Mvc.Common.Interceptors
{
    /// <summary>
    ///     Interceptor providing Profiling capabilities to components.
    /// </summary>
    public class ProfilingInterceptor : IInterceptor
    {
        /// <summary>
        ///     Intercepts an invocation.
        /// </summary>
        /// <param name="invocation">The invocation to intercept.</param>
        public void Intercept(IInvocation invocation)
        {
            // Profile using something
            invocation.Proceed();
        }
    }
}