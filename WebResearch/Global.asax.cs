﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Web.Security;
using WebResearch.Common;
using WebResearch.NHibernateSession;
using WebResearch.Relation.Datas;

namespace WebResearch
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            DBSession.RegistAssembly(typeof(ACUri).Assembly);
        }

        protected void Application_PostAuthenticateRequest(object sender, EventArgs e)
        {
            HttpCookie cookie = base.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (cookie != null)
            {
                FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(cookie.Value);
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                if (!(ticket.UserData == "OAuth"))
                {
                    CustomPrincipalModel model = serializer.Deserialize<CustomPrincipalModel>(ticket.UserData);
                    CustomPrincipal principal = new CustomPrincipal(ticket.Name)
                    {
                        UserName = model.UserName,
                        DisplayName = model.DisplayName
                    };
                    HttpContext.Current.User = principal;
                }
            }
        }
    }
}