using System;
using System.Linq;
using System.Reflection;
using Castle.DynamicProxy;

namespace Reviewer.Web.Mvc.Common.Interceptors.Selectors
{
    /// <summary>
    ///     This selector removes the LoggingInterceptor from Methods which do not have the LogMethod attribute on themselves or their parent Types.
    /// </summary>
    public class LoggingSelector : IInterceptorSelector
    {
        #region Public Methods and Operators

        /// <summary>
        /// Called by Castle to select the list of interceptors used based upon the intercepted method.
        /// </summary>
        /// <param name="type">
        /// The type
        /// </param>
        /// <param name="method">
        /// Method being invoked.
        /// </param>
        /// <param name="interceptors">
        /// The array of interceptors as they currently stand.
        /// </param>
        /// <returns>
        /// The filtered list of interceptors.
        /// </returns>
        public IInterceptor[] SelectInterceptors(Type type, MethodInfo method, IInterceptor[] interceptors)
        {
            if (method.GetCustomAttributes(typeof(LogInvocationsAttribute), true).Length != 0
                || method.DeclaringType.GetCustomAttributes(typeof(LogInvocationsAttribute), true).Length != 0)
            {
                return interceptors;
            }

            return interceptors.Where(x => x.GetType() != typeof(LoggingInterceptor)).ToArray();
        }

        #endregion
    }
}