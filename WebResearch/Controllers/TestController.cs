using AttributeRouting.Web.Mvc;
using QuantumCode.Tree.MPTTA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebResearch.Relation.Datas;

namespace WebResearch.Controllers
{
    public class TestController : JsonController
    {
        //
        // GET: /Test/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Tree()
        {
            return PartialView("PartialTree");
        }

        public ActionResult Customer()
        {
            return PartialView("PartialCustomer");
        }

        [GET("api/test/tree")]
        public ActionResult GetTreeData()
        {
            Tree<Menu> tree = new Tree<Menu>();

            Menu m1 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "菜单" };
            Menu m2 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试菜单" };
            m2.Uri = new ACUri()
            {
                Uri = "test/tree",
                UriCode = "testtree",
                UriDescription = "树形控件测试"
            };
            Menu m3 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "基础数据维护" };
            Menu m4 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "客户维护" };
            m4.Uri = new ACUri()
            {
                Uri = "test/customer",
                UriCode = "testcustomer",
                UriDescription = "客户维护"
            };
            Menu m5 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试子项二" };

            Menu m6 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "数据库维护" };

            Menu m7 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "数据库管理" };
            Menu m10 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "数据库创建" };
            m10.Uri = new ACUri()
            {
                Uri = "InstallDB",
                UriCode = "installdb",
                UriDescription = "安装数据库"
            };

            Menu m8 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "初始化数据" };
            m8.Uri = new ACUri()
            {
                Uri = "InstallDB/InitialData",
                UriCode = "initialdata",
                UriDescription = "初始化数据"
            };

            Menu m9 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "删除数据库" };
            m9.Uri = new ACUri()
            {
                Uri = "InstallDB/DeleteDB",
                UriCode = "deletedb",
                UriDescription = "删除数据库"
            };

            tree.AddNode("", m1);
            tree.AddNode(m1, m2);
            tree.AddNode(m1, m3);
            tree.AddNode(m3, m4);
            tree.AddNode(m3, m5);

            tree.AddNode(m1, m6);
            tree.AddNode(m6, m7);
            tree.AddNode(m7, m9);
            tree.AddNode(m7, m10);

            tree.AddNode(m6, m8);

            return Json(tree);
        }
    }
}
