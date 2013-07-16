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
            return View("Tree");
        }

        [GET("api/test/tree")]
        public ActionResult GetTreeData()
        {
            Tree<Menu> tree = new Tree<Menu>();

            Menu m1 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "菜单" };
            Menu m2 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试菜单" };
            Menu m3 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试目录一" };
            Menu m4 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试子项一" };
            Menu m5 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试子项二" };

            Menu m6 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试目录二" };
            Menu m7 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试子项三" };
            Menu m8 = new Menu() { NodeID = Guid.NewGuid().ToString(), MenuCaption = "测试子项三四" };

            tree.AddNode("", m1);
            tree.AddNode(m1, m2);
            tree.AddNode(m1, m3);
            tree.AddNode(m3, m4);
            tree.AddNode(m3, m5);

            tree.AddNode(m1, m6);
            tree.AddNode(m6, m7);
            tree.AddNode(m7, m8);

            return Json(tree);
        }
    }
}
