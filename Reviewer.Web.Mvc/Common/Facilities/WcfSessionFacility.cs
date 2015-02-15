using System;
using System.ServiceModel;
using Castle.Core;
using Castle.Core.Configuration;
using Castle.MicroKernel;

namespace Reviewer.Web.Mvc.Common.Facilities
{
    /// <summary>
    ///     This facility may be registered within your web application to automatically look for and close
    ///     WCF connections.  This eliminates all the redundant code for closing the connection and aborting
    ///     if any appropriate exceptions are encountered.  See Castle documentation for setting up and using this
    ///     Castle facility.
    /// </summary>
    public class WcfSessionFacility : IFacility
    {
        #region Constants

        /// <summary>
        ///     Manage Wcf Sessions Key
        /// </summary>
        public const string ManageWcfSessionsKey = "ManageWcfSessions";

        #endregion

        #region Public Methods and Operators

        /// <summary>
        /// Initializes the Facility.
        /// </summary>
        /// <param name="kernel">
        /// The calling kernel.
        /// </param>
        /// <param name="facilityConfig">
        /// The calling configuration.
        /// </param>
        public void Init(IKernel kernel, IConfiguration facilityConfig)
        {
            kernel.ComponentDestroyed += KernelComponentDestroyed;
        }

        /// <summary>
        ///     Terminates the Facility.
        /// </summary>
        public void Terminate()
        {
        }

        #endregion

        #region Methods

        /// <summary>
        /// Deals with a destroyed component.
        /// </summary>
        /// <param name="model">
        /// The model.
        /// </param>
        /// <param name="instance">
        /// The instance.
        /// </param>
        private static void KernelComponentDestroyed(ComponentModel model, object instance)
        {
            var shouldManage = false;
            var value = model.ExtendedProperties[ManageWcfSessionsKey];

            if (value != null)
            {
                shouldManage = (bool)value;
            }

            if (!shouldManage)
            {
                return;
            }

            var communicationObject = instance as ICommunicationObject;

            if (communicationObject != null)
            {
                try
                {
                    if (communicationObject.State != CommunicationState.Faulted)
                    {
                        communicationObject.Close();
                    }
                    else
                    {
                        communicationObject.Abort();
                    }
                }
                catch (CommunicationException)
                {
                    communicationObject.Abort();
                }
                catch (TimeoutException)
                {
                    communicationObject.Abort();
                }
                catch (Exception)
                {
                    communicationObject.Abort();
                    throw;
                }
            }
        }

        #endregion
    }
}