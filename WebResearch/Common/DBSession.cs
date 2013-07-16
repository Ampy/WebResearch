using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using WebResearch.Relation.Datas;

namespace WebResearch.Common
{
    public class DBSession
    {
        private static DBSession _Current = null;
        private static object _locker = new object();
        private ISessionFactory _SessionFactory;

        private DBSession()
        {
            this._SessionFactory = Fluently.Configure()
                .Database(
                    SQLiteConfiguration.Standard.ConnectionString("Data Source=" + 
                    Path.Combine(HttpContext.Current.Server.MapPath("~/App_Data"), "webresearch.db3")))
                .Mappings(m => m.FluentMappings.AddFromAssemblyOf<Customer_reltab>()).BuildSessionFactory();
        }

        public ISession CreateSession()
        {
            return this._SessionFactory.OpenSession();
        }

        public static DBSession Current
        {
            get
            {
                if (null == _Current)
                {
                    lock (_locker)
                    {
                        if (null == _Current)
                        {
                            _Current = new DBSession();
                        }
                    }
                }
                return _Current;
            }
        }
    }
}