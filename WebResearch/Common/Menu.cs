using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WebResearch.Common
{
    [DataContract]
    public class Menu
    {
        [DataMember]
        public string Action { get; set; }

        [DataMember]
        public string Code { get; set; }

        [DataMember]
        public string Controller { get; set; }

        [DataMember]
        public string Name { get; set; }
    }
}