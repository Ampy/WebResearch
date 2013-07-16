using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace WebResearch.Common
{
    [DataContract]
    public class PagingRecord
    {
        [DataMember]
        private int rows;

        public int Rows
        {
            get { return rows; }
            set { rows = value; }
        }

        [DataMember]
        private string orderby;

        public string Orderby
        {
            get { return orderby; }
            set { orderby = value; }
        }

        [DataMember]
        private string order;

        public string Order
        {
            get { return order; }
            set { order = value; }
        }

        [DataMember]
        private object records;

        public object Records
        {
            get { return records; }
            set { records = value; }
        }

        [DataMember]
        private int totalRows;

        public int TotalRows
        {
            get { return totalRows; }
            set { totalRows = value; }
        }

        [DataMember(Name = "pages")]
        public int Pages
        {
            get
            {
                int ps = totalRows / rows;
                int psm = totalRows % rows;

                if (0 != psm)
                    ps += 1;

                return ps;
            }
        }
    }
}