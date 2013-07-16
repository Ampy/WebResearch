using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebResearch.Common
{
    public class UserMenu
    {
        public static IList<Menu> Menus()
        {
            Menu menu = new Menu
            {
                Code = "Index",
                Controller = "Home",
                Action = "Index",
                Name = "基础数据"
            };
            Menu menu2 = new Menu
            {
                Code = "VslVoyList",
                Controller = "Home",
                Action = "VslVoyList",
                Name = "测试"
            };
            return new List<Menu> { menu, menu2 };
        }
    }
}