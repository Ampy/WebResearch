using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebResearch.Common;
using WebResearch.Relation.Datas;

namespace WebResearch.Controllers
{
    public class InstallDBController : JsonController
    {
        private ISessionFactory CreateSessionFactory()
        {
            return Fluently.Configure().Database(
                SQLiteConfiguration.Standard.ConnectionString(
                "Data Source=" + base.Server.MapPath("~/App_Data/") + "webresearch.db3")).Mappings((m)=>
            {
                m.FluentMappings.AddFromAssemblyOf<Customer_reltab>();
            }).ExposeConfiguration((c)=>
            {
                if (!System.IO.File.Exists(Path.Combine(base.Server.MapPath("~/App_Data"), "webresearch.db3")))
                {
                    SQLiteConnection.CreateFile(Path.Combine(base.Server.MapPath("~/App_Data"), "webresearch.db3"));
                }
                new SchemaUpdate(c).Execute(false, true);
            }).BuildSessionFactory();
        }
        //
        // GET: /InstallDB/

        public ActionResult Index()
        {
            try
            {
                ISessionFactory factory = this.CreateSessionFactory();
                ViewBag.Message = "安装成功";
            }
            catch (Exception ex)
            {
                ViewBag.Message = ex.Message;
                Exception innerEx = ex.InnerException;

                while (null != innerEx)
                {
                    ViewBag.message = ViewBag.message + "------" + innerEx.Message;
                    innerEx = innerEx.InnerException;
                }
            }

            return PartialView("PartialIndex");
        }

        public ActionResult InitialData()
        {
            Stock_reltab sr1 = new Stock_reltab()
            {
                StockNo = 1004,
                Price = 6750.00M,
                TaxRate = 2,
            };

            Stock_reltab sr2 = new Stock_reltab()
            {
                StockNo = 1011,
                Price = 4500.23M,
                TaxRate = 2
            };

            Stock_reltab sr3 = new Stock_reltab()
            {
                StockNo = 1534,
                Price = 2234.00M,
                TaxRate = 2
            };

            Stock_reltab sr4 = new Stock_reltab()
            {
                StockNo = 1535,
                Price = 3456.23M,
                TaxRate = 2
            };

            Stock_reltab[] srs = new Stock_reltab[] { 
                sr1,
                sr2,
                sr3,
                sr4
            };

            Customer_reltab cr1 = new Customer_reltab()
            {
                CustNo = 1,
                CustName = "Jean Nance",
                Street = "2 Avocet Drive",
                City = "Redwood Shores",
                State = "CA",
                Zip = "95054",
                Phone1 = "415-555-1212",
                Phone2 = "",
                Phone3 = ""
            };

            Customer_reltab cr2 = new Customer_reltab()
            {
                CustNo = 2,
                CustName = "John Nike",
                Street = "323 College Drive",
                City = "Edison",
                State = "NJ",
                Zip = "08820",
                Phone1 = "609-555-1212",
                Phone2 = "201-555-1212",
                Phone3 = ""
            };

            Customer_reltab[] crs = new Customer_reltab[]{
                cr1,
                cr2
            };

            using (ISession session = this.CreateSessionFactory().OpenSession())
            {
                using (ITransaction trans = session.BeginTransaction())
                {
                    try
                    {
                        foreach (var c in crs)
                        {
                            session.Save(c);
                        }

                        foreach (var sr in srs)
                        {
                            session.Save(sr);
                        }
                        trans.Commit();
                        session.Close();

                        ViewBag.message = "初始化数据完成";
                    }
                    catch (Exception eX)
                    {
                        trans.Rollback();
                        session.Close();
                        ViewBag.message = "初始化数据失败：" + eX.Message;
                    }
                }
            }

            return PartialView("ParitalIndex");
        }

        public ActionResult DeleteDB()
        {
            try
            {
                if (!System.IO.File.Exists(Path.Combine(base.Server.MapPath("~/App_Data"), "webresearch.db3")))
                {
                    System.IO.File.Delete(Path.Combine(base.Server.MapPath("~/App_Data"), "webresearch.db3"));
                }

                ViewBag.message = "数据库成功删除";
            }
            catch (Exception eX)
            {
                ViewBag.message = eX.Message;
            }

            return PartialView("PartialIndex");
        }
    }
}
