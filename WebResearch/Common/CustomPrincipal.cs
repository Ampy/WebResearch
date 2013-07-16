using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace WebResearch.Common
{
    public class CustomPrincipal : ICustomPrincipal
    {
        public CustomPrincipal(string userName)
        {
            this.Identity = new GenericIdentity(userName);
        }

        public string DisplayName
        {
            get;
            set;
        }

        public string UserName
        {
            get;
            set;
        }

        public IIdentity Identity
        {
            get;
            private set;
        }

        public bool IsInRole(string role)
        {
            return true;
        }
    }
}