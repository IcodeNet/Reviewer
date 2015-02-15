
using System;
using Castle.MicroKernel.Context;
using Castle.MicroKernel.Resolvers;

namespace Reviewer.Web.Mvc.IoC
{
    /// <summary>
    /// The inline dependencies propagating dependency resolver.
    /// </summary>
    public class InlineDependenciesPropagatingDependencyResolver : DefaultDependencyResolver
    {
        #region Methods

        /// <summary>
        /// The rebuild context for parameter.
        /// </summary>
        /// <param name="current">
        /// The current.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <returns>
        /// The <see cref="CreationContext"/>.
        /// </returns>
        protected override CreationContext RebuildContextForParameter(CreationContext current, Type parameterType)
        {
            if (parameterType.ContainsGenericParameters)
            {
                return current;
            }

            return new CreationContext(parameterType, current, true);
        }

        #endregion
    }
}