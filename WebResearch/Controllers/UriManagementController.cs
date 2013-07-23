using AttributeRouting.Web.Mvc;
using NHibernate;
using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebResearch.Common;
using WebResearch.NHibernateSession;
using WebResearch.Relation.Datas;

namespace WebResearch.Controllers
{
    public class UriManagementController : JsonController
    {
        //
        // GET: /UriManagement/

        public ActionResult Index()
        {
            return PartialView("PartialIndex");
        }

        [GET("api/uri/{startRow}/{rows}/{orderby?}/{order?}")]
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

                    ICriteria cmain = session.CreateCriteria<ACUri>();

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

                    countc.SetProjection(Projections.CountDistinct("UriCode"));

                    retRecord.TotalRows = countc.UniqueResult<int>();

                    if (0 != rows)
                    {
                        cmain.SetFirstResult(startRow - 1).SetMaxResults(rows);
                    }

                    IList<ACUri> retValues = cmain.List<ACUri>();

                    retRecord.Records = retValues;

                    return DefaultJson(retRecord);
                }
                catch (Exception eX)
                {
                    return ErrorContent(eX.Message);
                }
            }
        }

        [GET("api/uri/{uriCode}")]
        public ActionResult GetUri(string uriCode)
        {
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                try
                {
                    ACUri retValue = session.Get<ACUri>(uriCode);

                    if (null != retValue)
                        return DefaultJson(retValue);
                    else
                    {
                        throw new Exception("找不到指定的Uri地址");
                    }
                }
                catch (Exception eX)
                {
                    return ErrorContent(eX.Message);
                }
            }
        }

        [POST("api/uri/save")]
        public ActionResult Save(ACUri uri)
        {
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                ACUri oldUri = session.Get<ACUri>(uri.UriCode);

                if (null == oldUri)
                {
                    try
                    {
                        session.Save(uri);
                    }
                    catch (Exception eX)
                    {
                        db.Rollback = true;
                        return ErrorContent(eX.Message);
                    }

                    return Content("保存成功");
                }
                else
                {
                    return ErrorContent("已经存在相同的Uri代码的Url地址");
                }
            }
        }

        [POST("api/uri/update")]
        public ActionResult Update(ACUri uri)
        {
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                ACUri oldUri = session.Get<ACUri>(uri.UriCode);

                if (null != oldUri)
                {
                    try
                    {
                        session.Evict(oldUri);

                        session.Update(uri);

                    }
                    catch (Exception eX)
                    {
                        db.Rollback = true;
                        return ErrorContent(eX.Message);
                    }

                    return Content("更新成功");
                }
                else
                {
                    return ErrorContent("要更新的Uri信息不存在");
                }
            }
        }

        [POST("api/uri/delete")]
        public ActionResult Delete(List<string> delobjs){
            using (var db = new DBSession("default"))
            {
                ISession session = db.Session;
                try
                {
                    foreach (string uriCode in delobjs)
                    {
                        session.Delete(session.Get<ACUri>(uriCode));
                    }
                    return Content("删除成功");
                }
                catch (Exception eX)
                {
                    db.Rollback = true;
                    return ErrorContent(eX.Message);
                }
            }
        }
    }
}
