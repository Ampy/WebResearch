using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class Customer_reltab
    {
        [DataMember]
        private int custNo;

        public virtual int CustNo
        {
            get { return custNo; }
            set { custNo = value; }
        }

        [DataMember]
        private string custName;

        public virtual string CustName
        {
            get { return custName; }
            set { custName = value; }
        }

        [DataMember]
        private string street;

        public virtual string Street
        {
            get { return street; }
            set { street = value; }
        }

        [DataMember]
        private string city;

        public virtual string City
        {
            get { return city; }
            set { city = value; }
        }

        [DataMember]
        private string state;

        public virtual string State
        {
            get { return state; }
            set { state = value; }
        }

        [DataMember]
        private string zip;

        public virtual string Zip
        {
            get { return zip; }
            set { zip = value; }
        }

        [DataMember]
        private string phone1;

        public virtual string Phone1
        {
            get { return phone1; }
            set { phone1 = value; }
        }

        [DataMember]
        private string phone2;

        public virtual string Phone2
        {
            get { return phone2; }
            set { phone2 = value; }
        }

        [DataMember]
        private string phone3;

        public virtual string Phone3
        {
            get { return phone3; }
            set { phone3 = value; }
        }

        //[DataMember]
        private IList<PurchaseOrder_reltab> orders;

        public virtual IList<PurchaseOrder_reltab> Orders
        {
            get { return orders; }
            set { orders = value; }
        }
    }
}
