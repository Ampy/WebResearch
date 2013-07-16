using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class MenuMap: ClassMap<Menu>
    {
        public MenuMap()
        {
            Id(x => x.NodeID, "nodeid");

            Map(x => x.Left, "lftvalue");
            Map(x => x.MenuCaption, "menucaption");
            Map(x => x.NodeName, "nodename").Nullable();
            Map(x => x.Right, "rgtvalue");

            HasOne<ACUri>(x => x.Uri).Cascade.None().PropertyRef(u => u.UriCode).Not.LazyLoad();

            Table("menus");
        }
    }
}
