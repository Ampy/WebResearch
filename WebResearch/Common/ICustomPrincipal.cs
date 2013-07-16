using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace WebResearch.Common
{
    public interface ICustomPrincipal : IPrincipal
    {
        string DisplayName { get; set; }

        string UserName { get; set; }
    }
}