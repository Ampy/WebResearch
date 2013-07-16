using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WebResearch.Common
{
    [DataContract]
    public class CustomPrincipalModel
    {
        [DataMember]
        public string DisplayName { get; set; }

        [DataMember]
        public string UserName { get; set; }
    }
}