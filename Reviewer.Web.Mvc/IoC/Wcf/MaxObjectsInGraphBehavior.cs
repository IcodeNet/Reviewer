using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;

namespace Reviewer.Web.Mvc.IoC.Wcf
{
    /// <summary>
    ///     Increases the MaxItemsInObjectGraph value to int.MaxValue.
    /// </summary>
    public class MaxObjectsInGraphBehavior : IEndpointBehavior
    {
        #region Public Methods and Operators

        /// <summary>
        /// Implement to pass data at runtime to bindings to support custom behaviour.
        /// </summary>
        /// <param name="endpoint">
        /// The endpoint to modify.
        /// </param>
        /// <param name="bindingParameters">
        /// The objects that binding elements require to support the behaviour.
        /// </param>
        public void AddBindingParameters(ServiceEndpoint endpoint, BindingParameterCollection bindingParameters)
        {
        }

        /// <summary>
        /// Implements a modification or extension of the client across an endpoint.
        /// </summary>
        /// <param name="endpoint">
        /// The endpoint that is to be customized.
        /// </param>
        /// <param name="clientRuntime">
        /// The client runtime to be customized.
        /// </param>
        public void ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)
        {
            foreach (OperationDescription operation in endpoint.Contract.Operations)
            {
                var serializer = operation.Behaviors.Find<DataContractSerializerOperationBehavior>();
                serializer.MaxItemsInObjectGraph = int.MaxValue;
            }
        }

        /// <summary>
        /// Implements a modification or extension of the service across an endpoint.
        /// </summary>
        /// <param name="endpoint">
        /// The endpoint that exposes the contract.
        /// </param>
        /// <param name="endpointDispatcher">
        /// The endpoint dispatcher to be modified or extended.
        /// </param>
        public void ApplyDispatchBehavior(ServiceEndpoint endpoint, EndpointDispatcher endpointDispatcher)
        {
        }

        /// <summary>
        /// Implement to confirm that the endpoint meets some intended criteria.
        /// </summary>
        /// <param name="endpoint">
        /// The endpoint to validate.
        /// </param>
        public void Validate(ServiceEndpoint endpoint)
        {
        }

        #endregion
    }
}