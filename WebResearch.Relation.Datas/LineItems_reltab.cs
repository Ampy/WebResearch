using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class LineItems_reltab
    {
        [DataMember]
        private int lineItemNo;

        public virtual int LineItemNo
        {
            get { return lineItemNo; }
            set { lineItemNo = value; }
        }

        [DataMember]
        private int poNo;

        public virtual int PoNo
        {
            get { return poNo; }
            set { poNo = value; }
        }

        [DataMember]
        private int stockNo;

        public virtual int StockNo
        {
            get { return stockNo; }
            set { stockNo = value; }
        }

        [DataMember]
        private int quantity;

        public virtual int Quantity
        {
            get { return quantity; }
            set { quantity = value; }
        }

        [DataMember]
        private decimal discount;

        public virtual decimal Discount
        {
            get { return discount; }
            set { discount = value; }
        }

        public override bool Equals(object obj)
        {
            if (null == obj)
                return false;
            else return this.poNo == (obj as LineItems_reltab).poNo && this.lineItemNo == (obj as LineItems_reltab).lineItemNo;
        }

        public override int GetHashCode()
        {
            return this.poNo.GetHashCode() | this.lineItemNo.GetHashCode();
        }
    }
}
