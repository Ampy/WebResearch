using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AttributeRouting.Web.Mvc;
using NHibernate;
using NHibernate.Criterion;
using WebResearch.Common;
using WebResearch.Relation.Datas;
using WebResearch.NHibernateSession;

namespace WebResearch.Controllers
{
    public class CustomerController : JsonController
    {
        //
        // GET: /Customer/

        [HttpGet]
        //[ActionName("query")]
        public ActionResult Index()
        {
            return View();
        }

        [GET("api/customer/{startRow}/{rows}/{orderby?}/{order?}")]
        public ActionResult All(int startRow, int rows, string orderby, string order)
        {
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                try
                {
                    PagingRecord retRecord = new PagingRecord();
                    retRecord.Order = order;
                    retRecord.Orderby = orderby;
                    retRecord.Rows = rows;

                    //DetachedCriteria c = DetachedCriteria.For<Customer_reltab>()
                    //    .SetProjection(Projections.Property("custNo"));

                    ICriteria cmain = session.CreateCriteria<Customer_reltab>();
                    //    .Add(Subqueries.PropertyNotIn("Vie_ieid", c));

                    switch (order.ToUpper())
                    {
                        case "ASC":
                            cmain.AddOrder(Order.Asc(orderby.ToFirstUpper()));
                            break;
                        case "DESC":
                            cmain.AddOrder(Order.Desc(orderby.ToFirstUpper()));
                            break;
                        default:
                            cmain.AddOrder(Order.Asc(orderby.ToFirstUpper()));
                            break;
                    }

                    ICriteria countc = cmain.Clone() as ICriteria;

                    countc.SetProjection(Projections.CountDistinct("CustNo"));

                    retRecord.TotalRows = countc.UniqueResult<int>();

                    if (0 != rows)
                    {
                        cmain.SetFirstResult(startRow - 1).SetMaxResults(rows);
                    }

                    IList<Customer_reltab> retValues = cmain.List<Customer_reltab>();

                    retRecord.Records = retValues;

                    return DefaultJson(retRecord);
                }
                catch (Exception eX)
                {
                    return ErrorContent(eX.Message);
                }
            }
        }

        [GET("api/customer/{id}")]
        public ActionResult Single(int id)
        {
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                try
                {
                    Customer_reltab retValue = session.Get<Customer_reltab>(id);

                    return DefaultJson(retValue);
                }
                catch (Exception eX)
                {
                    return ErrorContent(eX.Message);
                }
            }
        }

    }
}
