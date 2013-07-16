using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebResearch.Common
{
    public static class extensions
    {
        public static string ToFirstUpper(this string s)
        {
            string retValue = s.Substring(0, 1).ToUpper() + s.Substring(1, s.Length - 1);

            return retValue;
        }
    }
}