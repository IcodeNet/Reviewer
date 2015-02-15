using System.Reflection;

namespace Reviewer.Web.Mvc.Extensions
{
    public static class ObjectExtensions
    {
        #region Methods

        private static object GetPropertyValue(this object obj, string property)
        {
            PropertyInfo propertyInfo = obj.GetType().GetProperty(property);
            return propertyInfo.GetValue(obj, null);
        }

        #endregion
    }
}