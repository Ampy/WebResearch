using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebResearch
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            //routes.MapRoute(
            //    "api-customer-single",
            //    "api/customer/{id}",
            //    new { controller = "CustomerController", action = "query" }
            //);

            //routes.MapRoute(
            //    "api-customer-paging",
            //    "api/customer/{startRow}/{rows}/{orderby}/{order}",
            //    new { controller = "CustomerController", action = "query" }
            //);
        }
    }
}