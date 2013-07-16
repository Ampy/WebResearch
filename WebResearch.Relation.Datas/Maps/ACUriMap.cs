using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class ACUriMap : ClassMap<ACUri>
    {
        public ACUriMap()
        {
            Id(x => x.UriCode, "uricode");

            Map(x => x.Uri, "uri");
            Map(x=>x.UriDescription, "uridescription");

            Table("acuris");
        }
    }
}
