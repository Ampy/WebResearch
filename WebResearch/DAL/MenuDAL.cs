using QuantumCode.Tree.MPTTA.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Web;
using WebResearch.Relation.Datas;

namespace WebResearch.DAL
{
    public class MenuDAL : TreeDAL<Menu>
    {
        public MenuDAL()
            : base("menudal")
        {
        }

        public override void FillExtendedProperties(Menu t, System.Data.DataRow row)
        {
            t.MenuCaption = row.IsNull("menucaption") ? "" : row["menucaption"].ToString();
        }

        public override string TableName
        {
            get { return "menus"; }
        }

        public override string AddSubNodeSQL
        {
            get
            {
                return string.Format(@"insert into {0}(nodeid, name, menucaption, lftvalue, rgtvalue) 
                                    values({1}, {2}, {3}, {4}, {5})",
                                TableName,
                                _DbOperation.CreateSqlCommandParameter("nodeid"),
                                _DbOperation.CreateSqlCommandParameter("name"),
                                _DbOperation.CreateSqlCommandParameter("menucaption"),
                                _DbOperation.CreateSqlCommandParameter("lftvalue"),
                                _DbOperation.CreateSqlCommandParameter("rgtvalue"));
            }
        }

        public override System.Data.Common.DbCommand BuildAddSubNodeCommand(Menu node, Menu subNode)
        {
            DbCommand retValue = base.BuildAddSubNodeCommand(node, subNode);
            _DbOperation.AddParameter(retValue, "nodeid", DbType.String, ParameterDirection.Input, "", DataRowVersion.Current, subNode.NodeID);
            _DbOperation.AddParameter(retValue, "booktype", DbType.String, ParameterDirection.Input, "", DataRowVersion.Current, subNode.MenuCaption);

            return retValue;
        }

        public override string UpdateNodeSQL
        {
            get
            {
                return string.Format(@"update {0} set 
                                        name = {1},
                                        menucaption = {2}
                                        where nodeid = {3}",
                                    TableName,
                                    _DbOperation.CreateSqlCommandParameter("nodename"),
                                    _DbOperation.CreateSqlCommandParameter("menucaption"),
                                    _DbOperation.CreateSqlCommandParameter("nodeid"));
            }
        }

        public override DbCommand BuildUpdateNodeCommand(Menu node)
        {
            DbCommand retValue = base.BuildUpdateNodeCommand(node);

            _DbOperation.AddParameter(retValue, "menucaption", DbType.String, ParameterDirection.Input, "", DataRowVersion.Current, node.MenuCaption);

            return retValue;
        }
    }
}