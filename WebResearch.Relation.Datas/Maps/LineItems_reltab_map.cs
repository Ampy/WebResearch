using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class LineItems_reltab_map : ClassMap<LineItems_reltab>
    {
        public LineItems_reltab_map()
        {
            CompositeId()
                .KeyProperty(x => x.LineItemNo)
                .KeyProperty(x => x.PoNo);

            Map(x => x.StockNo, "StockNo");
            Map(x => x.Quantity, "Quantity");
            Map(x => x.Discount, "Discount");

            Table("LineItems_reltab");
        }
    }
}
