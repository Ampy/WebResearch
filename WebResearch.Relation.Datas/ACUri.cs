using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class ACUri
    {
        [DataMember]
        private string uriCode;

        public virtual string UriCode
        {
            get { return uriCode; }
            set { uriCode = value; }
        }

        [DataMember]
        private string uri;

        public virtual string Uri
        {
            get { return uri; }
            set { uri = value; }
        }

        [DataMember]
        private string uriDescription;

        public virtual string UriDescription
        {
            get { return uriDescription; }
            set { uriDescription = value; }
        }
    }
}
