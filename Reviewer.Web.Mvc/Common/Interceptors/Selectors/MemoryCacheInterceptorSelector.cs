using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Castle.DynamicProxy;

namespace Reviewer.Web.Mvc.Common.Interceptors.Selectors
{
    /// <summary>
    ///     A selector used to filter which methods are intercepted by the MemoryCacheInterceptor.
    /// </summary>
    public class MemoryCacheInterceptorSelector : IInterceptorSelector
    {
        #region Fields

        /// <summary>
        ///     References a List of methods to intercept.
        /// </summary>
        private readonly List<MethodInfo> methodsToIntercept;

        #endregion

        #region Constructors and Destructors

        /// <summary>
        ///     Initializes a new instance of the <see cref="MemoryCacheInterceptorSelector" /> class.
        /// </summary>
        public MemoryCacheInterceptorSelector()
        {
            this.methodsToIntercept = new List<MethodInfo>();
        }

        #endregion

        #region Public Methods and Operators

        /// <summary>
        /// Used to specify which methods to intercept on the component.
        /// </summary>
        /// <typeparam name="T">
        /// The type of the component
        /// </typeparam>
        /// <param name="expr">
        /// The expression describing a function to intercept.
        /// </param>
        /// <returns>
        /// The called object used for chaining calls.
        /// </returns>
        public MemoryCacheInterceptorSelector Intercept<T>(Expression<Func<T, object>> expr)
        {
            var methodCall = expr.Body as MethodCallExpression;
            if (methodCall != null)
            {
                if (!this.methodsToIntercept.Contains(methodCall.Method))
                {
                    this.methodsToIntercept.Add(methodCall.Method);
                }
            }

            return this;
        }

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
        public IInterceptor[] SelectInterceptors(
            Type type, MethodInfo method, IInterceptor[] interceptors)
        {
            if (!this.methodsToIntercept.Contains(method))
            {
                interceptors = interceptors.Where(x => x.GetType() != typeof(MemoryCacheInterceptor)).ToArray();
            }

            return interceptors;
        }

        #endregion
    }
}