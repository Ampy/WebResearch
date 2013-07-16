using System;
using System.Web;
using System.Web.Optimization;

namespace WebResearch
{
    public class BundleConfig
    {
        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }
            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            ignoreList.Ignore("*.min.css", OptimizationMode.WhenEnabled);
        }

        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(new ScriptBundle("~/bundles/require").Include(new string[]{
                "~/Scripts/lib/require.js"
            }));

            bundles.Add(
                new ScriptBundle("~/bundles/jquery").Include(new string[] { 
                    "~/Scripts/jquery-1.9.1.min.js" 
                }));

            bundles.Add(
                new ScriptBundle("~/bundles/jqueryui").Include(new string[] { 
                    "~/Scripts/jquery-ui-1.10.3.custom.min.js" 
                }));

            bundles.Add(
                new ScriptBundle("~/bundles/jqueryval").Include(new string[] { 
                    "~/Scripts/jquery.unobtrusive*", 
                    "~/Scripts/jquery.validate*" 
                }));

            bundles.Add(new ScriptBundle("~/bundles/third").Include(new string[] { 
                "~/Scripts/bootstrap.min.js", 
                "~/Scripts/underscore-min.js", 
                "~/Scripts/json2.js", 
                "~/Scripts/backbone-min.js", 
                "~/Scripts/jquery.blockUI.js", 
                "~/Scripts/quantumcode-elements.js", 
                "~/Scripts/quantumcode.js", 
                "~/Scripts/date.js" 
            }));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(new string[] { 
                "~/Scripts/modernizr-*" 
            }));

            bundles.Add(new ScriptBundle("~/bundles/formatCurrency").Include(new string[] { 
                "~/Scripts/jquery.formatCurrency-1.4.0.min.js",
                "~/Scripts/jquery.formatCurrency.zh-CN.js" 
            }));

            bundles.Add(new StyleBundle("~/Content/css").Include(new string[] {
                "~/Content/site.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/redmond/css").Include(new string[] { 
                "~/Content/redmond/jquery-ui-1.10.3.custom.min.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(new string[] { 
                "~/Content/bootstrap.min.css", 
                "~/Content/bootstrap-responsive.min.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/bie6").Include(new string[] { 
                "~/Content/boostrap-ie6.min.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/font-awesome").Include(new string[] { 
                "~/Content/font-awesome.min.css"
            }));

            bundles.Add(new StyleBundle("~/Content/font-awesome").Include(new string[] { 
                "~/Content/font-awesome.min.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/faie7").Include(new string[] { 
                "~/Content/font-awesome-ie7.min.css" 
            }));

            bundles.Add(new StyleBundle("~/Content/quantumcode").Include(new string[] { 
                //"~/Content/quantumcode.css",
                "~/Content/quantumcode.min.css",
                "~/Content/quantumcode-resposive.css", 
                "~/Content/quantumcode-skins.css"
            }));

            bundles.Add(new StyleBundle("~/Content/quie").Include(new string[] { 
                "~/Content/quantumcode-ie.css"
            }));

            bundles.Add(new StyleBundle("~/Content/login").Include(new string[] { 
                "~/Content/logincss.css" 
            }));
        }
    }
}