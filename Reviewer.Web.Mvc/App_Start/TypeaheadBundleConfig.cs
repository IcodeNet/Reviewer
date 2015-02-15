using System.Web.Optimization;
using Reviewer.Web.Mvc;

[assembly: WebActivatorEx.PostApplicationStartMethod(typeof(TypeaheadBundleConfig), "RegisterBundles")]

namespace Reviewer.Web.Mvc
{
    public class TypeaheadBundleConfig
    {
        public static void RegisterBundles()
        {
            // Add @Scripts.Render("~/bundles/typeahead") after jQuery in your _Layout.cshtml view
            // When <compilation debug="true" />, MVC4 will render the full readable version. When set to <compilation debug="false" />, the minified version will be rendered automatically
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/typeahead").Include("~/Scripts/typeahead*"));
        }
    }
}
