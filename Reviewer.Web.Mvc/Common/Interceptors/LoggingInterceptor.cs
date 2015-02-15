
using System.Diagnostics;
using Castle.Core.Logging;
using Castle.DynamicProxy;

namespace Reviewer.Web.Mvc.Common.Interceptors
{
    /// <summary>
    ///     Interceptor to provide logging around components.
    /// </summary>
    public class LoggingInterceptor : IInterceptor
    {
        /// <summary>
        ///     Gets or sets the Logger to use.
        /// </summary>
        public ILogger Logger { get; set; }

        /// <summary>
        ///     Intercepts an invocation.
        /// </summary>
        /// <param name="invocation">The invocation being intercepted.</param>
        public void Intercept(IInvocation invocation)
        {
            this.Logger.Info(string.Format("Calling {0}.{1}", invocation.TargetType.Name, invocation.Method.Name));

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();

            invocation.Proceed();
            
            stopwatch.Stop();

            this.Logger.Info(string.Format("Invoked {0}.{1} in {2}", invocation.TargetType.Name, invocation.Method.Name, stopwatch.Elapsed.ToString("g")));
        }
    }
}