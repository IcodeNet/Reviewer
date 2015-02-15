
using System;
using System.Runtime.Caching;
using Castle.DynamicProxy;
using ServiceStack.Text;

namespace Reviewer.Web.Mvc.Common.Interceptors
{
    /// <summary>
    ///     Interceptor providing MemoryCache capabilities to components.
    /// </summary>
    public class MemoryCacheInterceptor : IInterceptor
    {
        /// <summary>
        ///     Intercepts an invocation.
        /// </summary>
        /// <param name="invocation">The invocation to intercept.</param>
        public void Intercept(IInvocation invocation)
        {
            ObjectCache cache = MemoryCache.Default;
            string key = this.GenerateCacheItemKey(invocation);

            if (cache.Contains(key))
            {
                invocation.ReturnValue = cache[key];
            }
            else
            {
                invocation.Proceed();
                if (invocation.ReturnValue != null)
                {
                    cache.Add(
                        new CacheItem(key, invocation.ReturnValue),
                        new CacheItemPolicy { AbsoluteExpiration = DateTime.Now.AddMinutes(20) });
                }
            }
        }

        /// <summary>
        ///     Constructs a key based upon the invocation details.
        /// </summary>
        /// <param name="invocation">Invocation to use.</param>
        /// <returns>Key returned.</returns>
        private string GenerateCacheItemKey(IInvocation invocation)
        {
            return invocation.TargetType.Name + ":" + invocation.Method.Name + "_" + invocation.Arguments.ToJson();
        }
    }
}