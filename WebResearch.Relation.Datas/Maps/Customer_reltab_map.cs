using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas.Maps
{
    public class Customer_reltab_map : ClassMap<Customer_reltab>
    {
        public Customer_reltab_map()
        {
            Id(x => x.CustNo, "CustNo").GeneratedBy.Assigned();

            Map(x => x.CustName, "CustName").Length(200);
            Map(x => x.Street, "Street").Length(200);
            Map(x => x.City, "City").Length(200);
            Map(x => x.State, "State").Length(2);
            Map(x => x.Zip, "Zip").Length(20);
            Map(x => x.Phone1, "Phone1").Length(20).Nullable();
            Map(x => x.Phone2, "Phone2").Length(20).Nullable();
            Map(x => x.Phone3, "Phone3").Length(20).Nullable();

            HasMany<PurchaseOrder_reltab>(x => x.Orders).KeyColumn("Custno")
                .Inverse().Cascade.All();

            Table("Customer_reltab");
        }
    }
}
