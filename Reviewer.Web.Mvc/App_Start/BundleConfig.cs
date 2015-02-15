
using System;
using System.Web.Optimization;

namespace Reviewer.Web.Mvc
{
    /// <summary>
    ///     The bundle config.
    /// </summary>
    public class BundleConfig
    {
        #region Public Methods and Operators

        /// <summary>
        ///     The register bundles.
        /// </summary>
        /// <param name="bundles">
        ///     The bundles.
        /// </param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);


            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include("~/Scripts/jquery-ui-{version}.js"));
            bundles.Add(
                new ScriptBundle("~/bundles/jqueryval").Include(
                    "~/Scripts/jquery.unobtrusive*",
                    "~/Scripts/jquery.validate*"));

            bundles.Add(
                new StyleBundle("~/Content/css").Include(
                    "~/Content/Bootstrap/Bootstrap.css",
                    "~/Content/ICode.min.css",
                    "~/Content/ko.plus.min.css",
                    "~/Content/toastr.min.css",
                    "~/Content/typeahead.js-bootstrap.min.css",
                    "~/Content/chosen.min.css",
                    "~/Content/smart_wizard.min.css",
                    "~/Content/themes/redmond/jquery-ui.min.css",
                    "~/Content/jquery.jqGrid/redmond.ui.jqgrid.css",
                    "~/Content/JQuery.selectbox/jquery.selectbox.min.css"));


            /*o enable bundling and minification, set the debug value to "false". 
             * You can override the Web.config setting with the EnableOptimizations property on the BundleTable class.
             * The following code enables bundling and minification and overrides any setting in the Web.config file.*/
            BundleTable.EnableOptimizations = true;
        }


        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
                throw new ArgumentNullException("ignoreList");
            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }


        #endregion
    }
}