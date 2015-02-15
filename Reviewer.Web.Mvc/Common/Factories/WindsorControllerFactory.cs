using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Castle.Windsor;

namespace Reviewer.Web.Mvc.Common.Factories
{
    /// <summary>
    ///     An MVC Controller Factory to provide allow Windsor to construct the controllers.
    /// </summary>
    public class WindsorControllerFactory : DefaultControllerFactory
    {
        #region Fields

        /// <summary>
        ///     References an IWindsorContainer
        /// </summary>
        private readonly IWindsorContainer container;

        #endregion

        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="WindsorControllerFactory"/> class.
        /// </summary>
        /// <param name="container">
        /// The container with which to generate controllers.
        /// </param>
        public WindsorControllerFactory(IWindsorContainer container)
        {
            this.container = container;
        }

        #endregion

        #region Public Methods and Operators

        /// <summary>
        /// Allows the release/disposal of resource allocated to the controller.
        /// </summary>
        /// <param name="controller">
        /// The controller to release.
        /// </param>
        public override void ReleaseController(IController controller)
        {
            this.container.Release(controller);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Requests a controller instance to be created by the IWindsorContainer.
        /// </summary>
        /// <param name="requestContext">
        /// The context of the request.
        /// </param>
        /// <param name="controllerType">
        /// The type of controller to instantiate.
        /// </param>
        /// <returns>
        /// A new controller instance.
        /// </returns>
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            if (controllerType == null)
            {
                string message = string.Format(
                    "The controller for path '{0}' could not be found.", requestContext.HttpContext.Request.Path);
                throw new HttpException(404, message);
            }

            return (IController)this.container.Resolve(controllerType);
        }

        #endregion
    }
}