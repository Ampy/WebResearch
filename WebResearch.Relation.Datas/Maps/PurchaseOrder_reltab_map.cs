using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class PurchaseOrder_reltab_map : ClassMap<PurchaseOrder_reltab>
    {
        public PurchaseOrder_reltab_map()
        {
            Id(x => x.PoNo, "PONo").GeneratedBy.Native();

            Map(x => x.Custno, "Custno");
            Map(x => x.OrderDate, "OrderDate");
            Map(x => x.ShipDate, "ShipDate");
            Map(x => x.ToStreet, "ToStreet").Length(200);
            Map(x => x.ToCity, "ToCity").Length(200);
            Map(x => x.ToState, "ToState").Length(2);
            Map(x => x.ToZip, "ToZip").Length(20);

            References<Customer_reltab>(x => x.Customer, "Custno").Cascade.None();

            HasMany<LineItems_reltab>(x => x.Items)
                .KeyColumn("PoNo")
                .Inverse()
                .Cascade
                .All();

            Table("PurchaseOrder_reltab");
        }
    }
}
