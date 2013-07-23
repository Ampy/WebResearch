using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Cfg;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.NHibernateSession
{
    public class DBSession : IDisposable
    {
        private static FluentConfiguration _config;
        private static ISessionFactory _SessionFactory;
        private static Dictionary<string, Assembly> _EntityAssemblies;

        private static object _lock = new object();

        public ISession Session { get; private set; }
        protected ITransaction transaction;

        private string connectionStringName;

        public bool Rollback { get; set; }

        public static void RegistAssembly(Assembly asm){
            if(null == _EntityAssemblies)
            {
                lock(_lock)
                {
                    if(null == _EntityAssemblies)
                        _EntityAssemblies = new Dictionary<string,Assembly>();
                }
            }

            if(!_EntityAssemblies.ContainsKey(asm.FullName))
            {
                lock(_lock){
                    if(!_EntityAssemblies.ContainsKey(asm.FullName))
                    {

                        _EntityAssemblies.Add(asm.FullName, asm);
                    }
                }
            }
        }

        protected void BuildConfiguration()
        {
            switch (ConfigurationManager.ConnectionStrings[this.connectionStringName].ProviderName)
            {
                case "System.Data.SQLite":
                    _config = Fluently.Configure()
                        .Database(
                        SQLiteConfiguration.Standard.ConnectionString(ConfigurationManager.ConnectionStrings[this.connectionStringName].ConnectionString))
                        .Mappings(m => m.FluentMappings.AddFromAssembly(Assembly.GetExecutingAssembly()));

                    foreach (var asm in _EntityAssemblies.Values)
                    {
                        _config.Mappings(m => m.FluentMappings.AddFromAssembly(asm));
                    }

                    _SessionFactory = _config.BuildSessionFactory();
                    break;
            }
        }

        public DBSession(string connectionStringName)
        {
            this.connectionStringName = connectionStringName;

            if (null == _config)
                BuildConfiguration();

            Session = _SessionFactory.OpenSession();
            transaction = Session.BeginTransaction();

            Rollback = false;
        }

        public void Dispose()
        {
            if (Rollback)
                transaction.Rollback();
            else
                transaction.Commit();

            Session.Close();
        }

        public void Save(object value)
        {
            Session.SaveOrUpdate(value);
        }

        public void Delete(object value)
        {
            Session.Delete(value);
        }

        public T Get<T>(object id)
        {
            T returnVal = Session.Get<T>(id);
            return returnVal;
        }

        public IList<T> GetAll<T>() where T : class
        {
            IList<T> returnVal = Session.CreateCriteria<T>().List<T>();
            return returnVal;
        }
    }
}
