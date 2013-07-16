using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class Stock_reltab_map : ClassMap<Stock_reltab>
    {
        public Stock_reltab_map()
        {
            Id(x => x.StockNo, "StockNo").GeneratedBy.Assigned();

            Map(x => x.Price, "Price");
            Map(x => x.TaxRate, "TaxRate");

            Table("Stock_reltab");
        }
    }
}
