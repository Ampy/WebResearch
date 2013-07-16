using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class PurchaseOrder_reltab
    {
        [DataMember]
        private int poNo;

        public virtual int PoNo
        {
            get { return poNo; }
            set { poNo = value; }
        }

        [DataMember]
        private int custno;

        public virtual int Custno
        {
            get { return custno; }
            set { custno = value; }
        }

        [DataMember]
        private DateTime orderDate;

        public virtual DateTime OrderDate
        {
            get { return orderDate; }
            set { orderDate = value; }
        }

        [DataMember]
        private DateTime shipDate;

        public virtual DateTime ShipDate
        {
            get { return shipDate; }
            set { shipDate = value; }
        }

        [DataMember]
        private string toStreet;

        public virtual string ToStreet
        {
            get { return toStreet; }
            set { toStreet = value; }
        }

        [DataMember]
        private string toCity;

        public virtual string ToCity
        {
            get { return toCity; }
            set { toCity = value; }
        }

        [DataMember]
        private string toState;

        public virtual string ToState
        {
            get { return toState; }
            set { toState = value; }
        }

        [DataMember]
        private string toZip;

        public virtual string ToZip
        {
            get { return toZip; }
            set { toZip = value; }
        }

        [DataMember]
        private Customer_reltab customer;

        public virtual Customer_reltab Customer
        {
            get { return customer; }
            set { customer = value; }
        }

        [DataMember]
        IList<LineItems_reltab> items;

        public virtual IList<LineItems_reltab> Items
        {
            get { return items; }
            set { items = value; }
        }
    }
}
