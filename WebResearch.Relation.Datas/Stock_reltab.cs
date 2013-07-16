using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class Stock_reltab
    {
        [DataMember]
        private int stockNo;

        public virtual int StockNo
        {
            get { return stockNo; }
            set { stockNo = value; }
        }

        [DataMember]
        private decimal price;

        public virtual decimal Price
        {
            get { return price; }
            set { price = value; }
        }

        [DataMember]
        private decimal taxRate;

        public virtual decimal TaxRate
        {
            get { return taxRate; }
            set { taxRate = value; }
        }
    }
}
