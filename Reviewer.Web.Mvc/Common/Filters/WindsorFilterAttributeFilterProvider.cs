
using System.Linq;
using System.Web.Mvc;
using Castle.Windsor;

namespace Reviewer.Web.Mvc.Common.Filters
{
    /// <summary>
    ///     An MVC Filter Attribute Filter Provider to provide allow Windsor to construct the filters.
    /// </summary>
    public class WindsorFilterAttributeFilterProvider : FilterAttributeFilterProvider
    {
        #region Private Fields

        /// <summary>
        ///     References an IWindsorContainer
        /// </summary>
        private readonly IWindsorContainer container;

        #endregion

        #region Constructors

        /// <summary>
        ///     Initializes a new instance of the <see cref="WindsorFilterAttributeFilterProvider" /> class.
        /// </summary>
        /// <param name="container">The container with which to generate Filters.</param>
        public WindsorFilterAttributeFilterProvider(IWindsorContainer container)
        {
            this.container = container;
        }

        #endregion

        #region FilterAttributeFilterProvider Methods

        /// <summary>
        ///     Returns filter attributes for the executing controller.
        /// </summary>
        /// <param name="controllerContext">The context of the controller.</param>
        /// <param name="actionDescriptor">The descriptor of the action.</param>
        /// <returns>The list of filter attributes of execution.</returns>
        protected override System.Collections.Generic.IEnumerable<FilterAttribute> GetControllerAttributes(
            ControllerContext controllerContext, ActionDescriptor actionDescriptor)
        {
            var attributes = base.GetControllerAttributes(controllerContext, actionDescriptor);
            foreach (var attribute in attributes)
            {
                this.BuildAttribute(attribute);
            }

            return attributes;
        }

        /// <summary>
        ///     Returns filter attributes for the executing action.
        /// </summary>
        /// <param name="controllerContext">The context of the controller.</param>
        /// <param name="actionDescriptor">The descriptor of the action.</param>
        /// <returns>The list of filter attributes of execution.</returns>
        protected override System.Collections.Generic.IEnumerable<FilterAttribute> GetActionAttributes(
            ControllerContext controllerContext, ActionDescriptor actionDescriptor)
        {
            var attributes = base.GetActionAttributes(controllerContext, actionDescriptor);
            foreach (var attribute in attributes)
            {
                this.BuildAttribute(attribute);
            }

            return attributes;
        }

        #endregion

        #region Private Methods

        /// <summary>
        ///     Uses property injection to populate the passed filter attribute.
        /// </summary>
        /// <param name="filterAttribute">The passed filter attribute.</param>
        private void BuildAttribute(FilterAttribute filterAttribute)
        {
            var properties = filterAttribute.GetType().GetProperties().Where(p => p.CanWrite && p.PropertyType.IsPublic);
            foreach (var propertyInfo in properties)
            {
                if (this.container.Kernel.HasComponent(propertyInfo.PropertyType))
                {
                    propertyInfo.SetValue(filterAttribute, this.container.Resolve(propertyInfo.PropertyType), null);
                }
            }
        }

        #endregion
    }
}